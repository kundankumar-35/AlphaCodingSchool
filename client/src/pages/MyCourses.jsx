import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function MyCourses() {
  const [list, setList] = useState(null);
  useEffect(() => { api('/enrollments/me').then(setList).catch(() => setList([])); }, []);
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">My Courses</h1>
      {!list ? <p className="mt-6">Loading…</p> : list.length === 0 ?
        <div className="mt-6"><p className="text-ink/60">You haven't enrolled in any course yet.</p><Link to="/courses" className="btn mt-4">Explore Courses</Link></div> :
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {list.map((e) => (
            <div key={e._id} className="rounded-xl border border-ink/10 bg-white p-5">
              <h2 className="text-xl font-bold">{e.course.title}</h2>
              <div className="mt-4 h-2 rounded-full bg-ink/10"><div className="h-2 rounded-full bg-sig" style={{ width: `${e.progress}%` }} /></div>
              <p className="mt-2 text-sm text-ink/60">Progress: {e.progress}%</p>
              <Link to={`/learn/${e.course._id}${e.lastLesson ? '/' + e.lastLesson : ''}`} className="btn mt-4">Continue Learning</Link>
            </div>
          ))}
        </div>}
    </main>
  );
}
