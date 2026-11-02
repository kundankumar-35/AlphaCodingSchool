// Alpha Coding School content CLI. Usage: npm run content -- <command> [args] [--flags]
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Course, LiveClass, Enrollment } from './models.js';

const [cmd, ...rest] = process.argv.slice(2);
const flags = new Set(rest.filter((a) => a.startsWith('--')));
const args = rest.filter((a) => !a.startsWith('--'));
const die = (m) => { console.error('✖ ' + m); process.exit(1); };
const ok = (m) => console.log('✔ ' + m);
const warn = (m) => console.log('⚠ ' + m);
const fmt = (d) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';

function readJson(file) {
  if (!file) die('Give a file path.');
  const p = path.resolve(file);
  if (!fs.existsSync(p)) die(`File not found: ${p}`);
  try { return [p, JSON.parse(fs.readFileSync(p, 'utf8'))]; } catch (e) { die(`Invalid JSON in ${file}: ${e.message}`); }
}

function checkCourse(c) {
  const errs = [], warns = [], bad = (m) => errs.push(m);
  for (const k of ['title', 'instructor', 'description']) if (!c[k] || typeof c[k] !== 'string') bad(`"${k}" is required (text).`);
  if (typeof c.price !== 'number' || c.price < 0) bad('"price" must be a number (0 or more).');
  if (!Array.isArray(c.lessons) || !c.lessons.length) { bad('"lessons" must be a non-empty list.'); return { errs, warns }; }
  const seen = new Set();
  let sample = 0;
  c.lessons.forEach((l, i) => {
    const n = `Lesson ${i + 1} (${l.title || 'no title'})`;
    if (!l.title) bad(`${n}: "title" is required.`);
    else if (seen.has(l.title)) bad(`${n}: duplicate title.`); else seen.add(l.title);
    if (!/^https?:\/\//.test(l.videoUrl || '')) bad(`${n}: "videoUrl" must start with http(s)://`);
    else if (l.videoUrl.includes('BigBuckBunny')) sample++;
    if (!l.notes) warns.push(`${n}: no notes.`);
    (l.problems || []).forEach((p) => { if (!p.title || !p.url) bad(`${n}: each problem needs "title" and "url".`); });
  });
  if (sample) warns.unshift(`${sample} lesson(s) still use the sample video. Replace videoUrl with your real video links.`);
  return { errs, warns };
}

async function course() {
  const [file, data] = readJson(args[0]);
  const { errs, warns } = checkCourse(data);
  warns.slice(0, 8).forEach(warn); if (warns.length > 8) warn(`…and ${warns.length - 8} more warnings.`);
  if (errs.length) { errs.forEach((e) => console.error('✖ ' + e)); die('Fix the errors above. Nothing was changed.'); }
  if (cmd === 'check') return ok(`${data.title}: ${data.lessons.length} lessons look valid.`);

  const existing = await Course.findOne({ title: data.title });
  const old = existing?.lessons || [], used = new Set();
  const lessons = data.lessons.map((l) => {
    const m = old.find((o) => l.id && String(o._id) === l.id) || old.find((o) => o.title === l.title && !used.has(String(o._id)));
    const _id = m?._id || new mongoose.Types.ObjectId();
    used.add(String(_id));
    const { id, ...body } = l;
    return { ...body, _id };
  });
  const added = lessons.filter((l) => !old.some((o) => String(o._id) === String(l._id))).length;
  const orphans = old.filter((o) => !used.has(String(o._id)));
  if (orphans.length) {
    if (flags.has('--prune')) warn(`Removing ${orphans.length} lesson(s) not in the file: ${orphans.map((o) => o.title).join(', ')}`);
    else { lessons.push(...orphans.map((o) => o.toObject())); warn(`${orphans.length} lesson(s) exist in the database but not in the file. Kept. Use --prune to remove.`); }
  }
  const { lessons: _l, ...fields } = data;
  console.log(`${existing ? 'Update' : 'Create'} "${data.title}": ${lessons.length} lessons (${added} new, ${lessons.length - added - (orphans.length && !flags.has('--prune') ? orphans.length : 0)} updated).`);
  if (flags.has('--dry')) return ok('Dry run. Nothing was saved.');

  if (existing) { existing.set({ ...fields, lessons }); await existing.save(); } else await Course.create({ ...fields, lessons });
  data.lessons.forEach((l, i) => { l.id = String(lessons[i]._id); }); // keeps lesson ids stable for next time
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  ok('Saved. Lesson ids were written back to the file. Keep them.');
}

async function live() {
  const [, raw] = readJson(args[0]);
  const list = Array.isArray(raw) ? raw : raw.sessions;
  if (!Array.isArray(list)) die('File must be a list of sessions, or { "sessions": [...] }.');
  const errs = [];
  list.forEach((s, i) => {
    const n = `Session ${i + 1}`;
    if (!s.course || !s.title || !s.joinUrl) errs.push(`${n}: "course", "title" and "joinUrl" are required.`);
    if (isNaN(new Date(s.startsAt))) errs.push(`${n}: "startsAt" must look like 2026-11-08T19:00:00+05:30`);
    else if (new Date(s.startsAt) < new Date()) warn(`${n}: "${s.title}" is in the past, so students will not see it.`);
  });
  if (errs.length) { errs.forEach((e) => console.error('✖ ' + e)); die('Fix the errors above. Nothing was changed.'); }
  for (const s of list) {
    const c = await Course.findOne({ title: s.course });
    if (!c) { console.error(`✖ Course not found: "${s.course}". Skipped "${s.title}".`); continue; }
    const doc = { title: s.title, startsAt: new Date(s.startsAt), joinUrl: s.joinUrl, ...(s.recordingUrl && { recordingUrl: s.recordingUrl }) };
    const found = await LiveClass.findOne({ course: c._id, title: s.title });
    const line = `${found ? 'Update' : 'Create'} "${s.title}" → ${fmt(doc.startsAt)}`;
    if (flags.has('--dry')) { console.log(line + ' (dry run)'); continue; }
    await LiveClass.findOneAndUpdate({ course: c._id, title: s.title }, { ...doc, course: c._id }, { upsert: true });
    ok(line);
  }
}

async function list() {
  const courses = await Course.find().lean();
  console.log('\nCOURSES');
  for (const c of courses) {
    const n = await Enrollment.countDocuments({ course: c._id });
    console.log(`  ${c.archived ? '[archived] ' : ''}${c.title} — ${c.lessons.length} lessons, ${n} students, ₹${c.price}`);
  }
  console.log('\nLIVE SESSIONS');
  const ls = await LiveClass.find().sort({ startsAt: 1 }).populate('course', 'title').lean();
  ls.forEach((l) => console.log(`  ${new Date(l.startsAt) < new Date() ? '[past] ' : ''}${fmt(l.startsAt)} — ${l.title} (${l.course?.title})`));
  if (!ls.length) console.log('  none');
}

async function setArchived(value) {
  const c = await Course.findOneAndUpdate({ title: args[0] }, { archived: value });
  c ? ok(`${value ? 'Archived' : 'Restored'} "${c.title}".${value ? ' Hidden from the catalog; enrolled students keep access.' : ''}`) : die(`Course not found: "${args[0]}"`);
}

async function deleteCourse() {
  const c = await Course.findOne({ title: args[0] });
  if (!c) die(`Course not found: "${args[0]}"`);
  const n = await Enrollment.countDocuments({ course: c._id });
  const l = await LiveClass.countDocuments({ course: c._id });
  if (!flags.has('--force')) die(`"${c.title}" has ${n} enrolled student(s) and ${l} live session(s). Deleting removes all of it permanently.\n  Safer: archive-course "${c.title}"\n  To really delete, add --force`);
  await Enrollment.deleteMany({ course: c._id }); await LiveClass.deleteMany({ course: c._id }); await c.deleteOne();
  ok(`Deleted "${c.title}", ${n} enrollment(s) and ${l} live session(s).`);
}

async function deleteLive() {
  const filter = flags.has('--past') ? { startsAt: { $lt: new Date(Date.now() - 24 * 3600e3) } } : args[0] ? { title: args[0] } : die('Give a session title, or --past.');
  const r = await LiveClass.deleteMany(filter);
  ok(`Deleted ${r.deletedCount} live session(s).`);
}

const offline = { check: course };
const online = { course, live, list, 'archive-course': () => setArchived(true), 'unarchive-course': () => setArchived(false), 'delete-course': deleteCourse, 'delete-live': deleteLive };
if (offline[cmd]) await offline[cmd]();
else if (online[cmd]) {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Alpha Coding School');
  await online[cmd]();
  await mongoose.disconnect();
} else console.log(`Commands:
  check <file>                 validate a course file (no database needed)
  course <file> [--dry] [--prune]   add or update a course
  live <file> [--dry]          add or update live sessions
  list                         show courses and live sessions
  archive-course "<title>"     hide from catalog, students keep access
  unarchive-course "<title>"
  delete-course "<title>" --force
  delete-live "<title>"   |   delete-live --past`);
