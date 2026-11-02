import 'dotenv/config';
import mongoose from 'mongoose';
import { Course, LiveClass } from './models.js';

const VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; // placeholder: use your own URLs
const topics = ['Introduction', 'Arrays', 'Strings', 'Binary Search', 'Trees', 'Graphs', 'Dynamic Programming'];

const rich = {
  Arrays: {
    notes: 'Arrays store items in a row.\n\nKey ideas:\n- Index access is O(1)\n- Insert/delete in the middle is O(n)\n- Two pointers and sliding window turn O(n^2) into O(n)',
    logic: {
      problem: 'Find the maximum sum of any 3 consecutive numbers in an array.',
      thinking: 'Checking every group of 3 repeats work. Neighbouring groups share most of their numbers.',
      pattern: 'Sliding Window: a fixed-size range that moves one step at a time.',
      logic: 'When the window moves right, add the new number and remove the one that left.',
      approach: '1. Sum the first 3.\n2. Slide: sum += arr[i] - arr[i-3].\n3. Keep the best sum.',
      code: 'let sum = arr.slice(0, k).reduce((a, b) => a + b, 0), best = sum;\nfor (let i = k; i < arr.length; i++) {\n  sum += arr[i] - arr[i - k];\n  best = Math.max(best, sum);\n}',
    },
    problems: [{ title: 'Maximum Average Subarray', url: 'https://leetcode.com/problems/maximum-average-subarray-i/' }],
  },
  'Dynamic Programming': {
    notes: 'Dynamic Programming = break a problem into smaller problems, solve each once, remember the answers.\n\nTop 5 to master: Fibonacci, Climbing Stairs, Coin Change, 0/1 Knapsack, LCS.',
    logic: {
      problem: 'How many ways can you climb n stairs taking 1 or 2 steps?',
      thinking: 'To stand on step n, your last move came from step n-1 or n-2.',
      pattern: 'Current answer = combination of earlier answers.',
      logic: 'ways(n) = ways(n-1) + ways(n-2)',
      approach: '1. Base: ways(0)=1, ways(1)=1.\n2. Fill the table left to right.\n3. Answer is ways(n).',
      code: 'const dp = [1, 1];\nfor (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];\nreturn dp[n];',
    },
    problems: [{ title: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/' }, { title: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/' }],
  },
};
const lessons = topics.map((t, i) => ({
  title: `${String(i + 1).padStart(2, '0')}. ${t}`, videoUrl: VIDEO, duration: 20 + i * 3,
  notes: rich[t]?.notes || `Notes for ${t}. Add your lesson notes here.`,
  logic: rich[t]?.logic || { problem: `A typical ${t} problem.`, thinking: 'What is the question really asking?', pattern: 'Name the pattern.', logic: 'Why does it work?', approach: 'Steps in plain words.', code: '// code' },
  problems: rich[t]?.problems || [{ title: `${t} practice`, url: 'https://leetcode.com/' }],
}));

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/AlphaCodingSchool');
await Course.deleteMany({}); await LiveClass.deleteMany({});
const dsa = await Course.create({
  title: 'DSA Mastery', instructor: 'Alpha Coding School Team', level: 'Basic → Advanced', price: 1999, featured: true,
  description: 'Learn data structures and algorithms by understanding the thinking behind every solution.',
  includes: ['Videos', 'Notes', 'Logic', 'Live Classes', 'Practice'], lessons,
});
const sunday = (weeks) => { const d = new Date(); d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7) + 7 * weeks); d.setHours(19, 0, 0, 0); return d; };
await LiveClass.create([
  { course: dsa._id, title: 'Dynamic Programming — Session 04', startsAt: sunday(0), joinUrl: 'https://meet.google.com/your-link' },
  { course: dsa._id, title: 'Graphs — Session 05', startsAt: sunday(1), joinUrl: 'https://meet.google.com/your-link' },
]);
console.log('Seeded.'); process.exit(0);
