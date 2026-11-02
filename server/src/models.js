import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const Ref = (ref) => ({ type: Schema.Types.ObjectId, ref });

const lesson = new Schema({
  title: String, videoUrl: String, duration: Number, // minutes
  notes: String,                                      // plain text / markdown
  logic: { problem: String, thinking: String, pattern: String, logic: String, approach: String, code: String },
  problems: [{ title: String, url: String }],
});

export const User = model('User', new Schema({
  name: String, password: String, role: { type: String, default: 'student' },
  email: { type: String, unique: true, lowercase: true },
}, { timestamps: true }));

export const Course = model('Course', new Schema({
  title: String, instructor: String, level: String, description: String,
  price: Number, featured: Boolean, archived: Boolean, includes: [String], lessons: [lesson],
}, { timestamps: true }));

export const LiveClass = model('LiveClass', new Schema({
  course: Ref('Course'), title: String, startsAt: Date, joinUrl: String, recordingUrl: String,
}));

const enrollment = new Schema({
  user: Ref('User'), course: Ref('Course'),
  completed: [String], lastLesson: String, lastPosition: { type: Number, default: 0 },
  payment: { status: String, ref: String, amount: Number },
}, { timestamps: true });
enrollment.index({ user: 1, course: 1 }, { unique: true });
export const Enrollment = model('Enrollment', enrollment);
