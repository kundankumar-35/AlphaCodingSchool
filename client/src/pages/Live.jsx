import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, when } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function Live() {
  const { user } = useAuth();
  const [list, setList] = useState(null);
  useEffect(() => { api('/live').then(setList).catch(() => setList([])); }, [user]);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Live Classes</h1>
      {!list ? <p className="mt-6">Loading…</p> : list.length === 0 ? <p className="mt-6 text-ink/60">No live classes scheduled. Check back soon.</p> :
        <div className="mt-6 space-y-4">
          {list.map((l) => (
            <div key={l._id} className="rounded-xl border border-ink/10 bg-white p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-live"><span className="h-2 w-2 rounded-full bg-live" />Upcoming Live Class</p>
              <h2 className="mt-2 text-xl font-bold">{l.title}</h2>
              <p className="mt-1 text-ink/70">{when(l.startsAt)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {l.canJoin ? <a href={l.joinUrl} target="_blank" rel="noreferrer" className="btn">Join Class</a>
                  : <Link to={`/courses/${l.course._id}`} className="btn-ghost">Enroll in {l.course.title} to join</Link>}
                {l.canJoin && l.recordingUrl && <a href={l.recordingUrl} className="text-sig font-medium">Watch recording</a>}
              </div>
            </div>
          ))}
        </div>}
    </main>
  );
}
