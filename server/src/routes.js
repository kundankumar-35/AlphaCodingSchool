import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User, Course, LiveClass, Enrollment } from './models.js';
import { sign, auth, optional } from './auth.js';

const r = Router();
const wrap = (fn) => (q, s, n) => fn(q, s, n).catch(n);
const pub = (u) => ({ id: u._id, name: u.name, email: u.email });
const summary = ({ lessons = [], ...c }) => ({ ...c, lessonCount: lessons.length });
const isEnrolled = async (user, course) => !!user && !!(await Enrollment.exists({ user: user.id, course }));

// ---- Auth
r.post('/auth/signup', wrap(async (q, s) => {
  const { name, email, password } = q.body;
  if (!name || !email || !password || password.length < 6)
    return s.status(400).json({ error: 'Enter your name, email and a password of 6+ characters.' });
  if (await User.exists({ email: email.toLowerCase() })) return s.status(409).json({ error: 'This email is already registered. Log in instead.' });
  const u = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  s.json({ token: sign(u), user: pub(u) });
}));
r.post('/auth/login', wrap(async (q, s) => {
  const u = await User.findOne({ email: (q.body.email || '').toLowerCase() });
  if (!u || !(await bcrypt.compare(q.body.password || '', u.password)))
    return s.status(401).json({ error: 'Email or password is incorrect.' });
  s.json({ token: sign(u), user: pub(u) });
}));
r.get('/auth/me', auth, wrap(async (q, s) => s.json(pub(await User.findById(q.user.id)))));

// ---- Courses (lesson content stays locked until enrolled)
r.get('/courses', wrap(async (_q, s) => {
  const list = await Course.find({ archived: { $ne: true } }).sort({ featured: -1, createdAt: -1 }).lean();
  s.json(list.map(summary));
}));
r.get('/courses/:id', optional, wrap(async (q, s) => {
  const c = await Course.findById(q.params.id).lean();
  if (!c) return s.status(404).json({ error: 'Course not found.' });
  const syllabus = c.lessons.map((l) => ({ id: l._id, title: l.title, duration: l.duration }));
  s.json({ ...summary(c), syllabus, enrolled: await isEnrolled(q.user, c._id) });
}));
r.get('/courses/:id/lessons/:lessonId', auth, wrap(async (q, s) => {
  if (!(await isEnrolled(q.user, q.params.id))) return s.status(403).json({ error: 'Enroll in this course to unlock lessons.' });
  const c = await Course.findById(q.params.id).lean();
  const l = c?.lessons.find((x) => String(x._id) === q.params.lessonId);
  l ? s.json(l) : s.status(404).json({ error: 'Lesson not found.' });
}));

// ---- Live classes (join link only for enrolled students)
r.get('/live', optional, wrap(async (q, s) => {
  const list = await LiveClass.find({ startsAt: { $gte: new Date(Date.now() - 2 * 3600e3) } })
    .sort({ startsAt: 1 }).populate('course', 'title').lean();
  const out = [];
  for (const c of list) {
    const canJoin = await isEnrolled(q.user, c.course._id);
    if (!canJoin) { delete c.joinUrl; delete c.recordingUrl; }
    out.push({ ...c, canJoin });
  }
  s.json(out);
}));

// // Health check of application
// r.get("/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "AlphaCodingSchool API is running"
//   });
// });

// ---- Payment -> Enrollment.
// V1 uses a mock payment so the full flow works. Replace the marked block with
// Stripe/Razorpay: create the order here, and create the Enrollment in the webhook.
r.post('/payments/checkout', auth, wrap(async (q, s) => {
  const c = await Course.findById(q.body.courseId).lean();
  if (!c) return s.status(404).json({ error: 'Course not found.' });
  let e = await Enrollment.findOne({ user: q.user.id, course: c._id });
  if (!e) e = await Enrollment.create({ // --- replace with real payment ---
    user: q.user.id, course: c._id, payment: { status: 'paid', ref: 'MOCK-' + Date.now(), amount: c.price },
  });
  s.json({ ok: true, courseId: c._id, title: c.title });
}));

// ---- Enrollment + progress
const withProgress = (e) => ({
  ...e, course: summary(e.course),
  progress: e.course.lessons.length ? Math.round((e.completed.length / e.course.lessons.length) * 100) : 0,
});
r.get('/enrollments/me', auth, wrap(async (q, s) => {
  const list = await Enrollment.find({ user: q.user.id }).populate('course').lean();
  s.json(list.filter((e) => e.course).map(withProgress));
}));
r.get('/enrollments/:courseId', auth, wrap(async (q, s) => {
  const e = await Enrollment.findOne({ user: q.user.id, course: q.params.courseId }).populate('course').lean();
  e ? s.json(withProgress(e)) : s.status(403).json({ error: 'You are not enrolled in this course.' });
}));
r.put('/enrollments/:courseId/progress', auth, wrap(async (q, s) => {
  const { lessonId, position = 0, completed } = q.body;
  const e = await Enrollment.findOne({ user: q.user.id, course: q.params.courseId });
  if (!e) return s.status(403).json({ error: 'You are not enrolled in this course.' });
  e.lastLesson = lessonId; e.lastPosition = Math.floor(position);
  if (completed === true && !e.completed.includes(lessonId)) e.completed.push(lessonId);
  if (completed === false) e.completed = e.completed.filter((x) => x !== lessonId);
  await e.save();
  s.json(withProgress((await e.populate('course')).toObject()));
}));

export default r;
