import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';

const TABS = ['Video', 'Notes', 'Logic', 'Problems'];
const STEPS = [['problem', 'Problem'], ['thinking', 'Thinking'], ['pattern', 'Pattern'], ['logic', 'Logic'], ['approach', 'Approach'], ['code', 'Code']];

export default function Learn() {
  const { courseId, lessonId } = useParams();
  const nav = useNavigate();
  const [course, setCourse] = useState(null);
  const [enr, setEnr] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [tab, setTab] = useState('Video');
  const [err, setErr] = useState('');
  const lastSave = useRef(0);
  const syllabus = course?.syllabus || [];
  const current = lessonId || enr?.lastLesson || syllabus[0]?.id;
  const idx = syllabus.findIndex((l) => l.id === current);

  useEffect(() => {
    Promise.all([api(`/courses/${courseId}`), api(`/enrollments/${courseId}`)])
      .then(([c, e]) => { setCourse(c); setEnr(e); }).catch((e) => setErr(e.message));
  }, [courseId]);
  useEffect(() => {
    if (!current) return;
    setLesson(null); setTab('Video');
    api(`/courses/${courseId}/lessons/${current}`).then(setLesson).catch((e) => setErr(e.message));
  }, [courseId, current]);

  const save = (body) => api(`/enrollments/${courseId}/progress`, { method: 'PUT', body: { lessonId: current, ...body } });
  const go = (i) => syllabus[i] && nav(`/learn/${courseId}/${syllabus[i].id}`);
  const done = enr?.completed.includes(current);
  const toggleDone = () => save({ completed: !done }).then(setEnr);
  const onTime = (e) => {
    const t = e.target.currentTime;
    if (t - lastSave.current > 5 || t < lastSave.current) { lastSave.current = t; save({ position: t }); }
  };
  const resume = (e) => { if (enr?.lastLesson === current && enr.lastPosition > 0) e.target.currentTime = enr.lastPosition; };
  const downloadNotes = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lesson.notes], { type: 'text/plain' }));
    a.download = `${syllabus[idx].title}.txt`; a.click();
  };

  if (err) return <div className="p-8"><p className="text-live">{err}</p><Link to={`/courses/${courseId}`} className="btn mt-4">Go to course</Link></div>;
  if (!course || !enr) return <p className="p-8">Loading…</p>;
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_300px]">
      <section>
        <p className="text-sm text-ink/60">{course.title} · Progress {enr.progress}%</p>
        <h1 className="text-2xl font-bold">{syllabus[idx]?.title}</h1>
        <div className="mt-4 flex gap-1 border-b border-ink/10" role="tablist">
          {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`px-4 py-2 font-medium ${tab === t ? 'border-b-2 border-ink' : 'text-ink/50 hover:text-ink'}`}>{t}</button>)}
        </div>
        <div className="mt-5">
          {!lesson ? <p>Loading lesson…</p> : <>
            {tab === 'Video' && (
              <video
                key={current}
                src={`${import.meta.env.VITE_CLOUDFLARE_URL}/upcomingvideo/alpha-coding-school-coming-soon.mp4`}  // {lesson.videoUrl}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                playsInline
                onContextMenu={(e) => e.preventDefault()}
                onLoadedMetadata={(e) => { e.target.muted = false; e.target.volume = 1; resume(e); }}
                onTimeUpdate={onTime}
                onEnded={() => !src.includes('coming-soon') && save({ completed: true }).then(setEnr)} // update src  to lesson.videoUrl
                className="aspect-video w-full rounded-xl bg-black"
              />
            )}
            {tab === 'Notes' && <div className="rounded-xl border border-ink/10 bg-white p-5">
              <p className="whitespace-pre-wrap leading-relaxed">{lesson.notes}</p>
              <button onClick={downloadNotes} className="btn-ghost mt-4">Download notes</button></div>}
            {tab === 'Logic' && !STEPS.some(([k]) => lesson.logic?.[k]) && <p className="text-ink/60">No logic notes for this lesson yet.</p>}
            {tab === 'Logic' && <ol className="space-y-3">
              {STEPS.map(([k, label]) => lesson.logic?.[k] && (
                <li key={k} className="rounded-xl border border-ink/10 bg-white p-4">
                  <h3 className="font-bold text-sig">{label}</h3>
                  {k === 'code' ? <pre className="mt-2 overflow-x-auto rounded-lg bg-ink p-4 font-mono text-sm text-white">{lesson.logic[k]}</pre>
                    : <p className="mt-1 whitespace-pre-wrap">{lesson.logic[k]}</p>}
                </li>))}
            </ol>}
            {tab === 'Problems' && <ul className="space-y-2">
              {lesson.problems?.map((p) => <li key={p.url}><a href={p.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-ink/10 bg-white p-4 font-medium hover:border-ink">{p.title}</a></li>)}
              {!lesson.problems?.length && <p className="text-ink/60">No practice problems for this lesson.</p>}</ul>}
          </>}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button className="btn-ghost" disabled={idx <= 0} onClick={() => go(idx - 1)}>Previous</button>
          <button className={done ? 'btn-ghost' : 'btn'} onClick={toggleDone}>{done ? '✓ Completed' : 'Mark as completed'}</button>
          <button className="btn-ghost" disabled={idx >= syllabus.length - 1} onClick={() => go(idx + 1)}>Next</button>
        </div>
      </section>
      <aside className="h-fit rounded-xl border border-ink/10 bg-white lg:sticky lg:top-6">
        <h2 className="border-b border-ink/10 px-4 py-3 font-bold">{course.title}</h2>
        <ul>{syllabus.map((l, i) => (
          <li key={l.id}><Link to={`/learn/${courseId}/${l.id}`} className={`flex items-center gap-2 px-4 py-2.5 text-sm ${l.id === current ? 'bg-sun/30 font-semibold' : 'hover:bg-ink/5'}`}>
            <span className={`grid h-5 w-5 place-items-center rounded-full border text-xs ${enr.completed.includes(l.id) ? 'border-sig bg-sig text-white' : 'border-ink/30'}`}>{enr.completed.includes(l.id) ? '✓' : ''}</span>{l.title}</Link></li>))}
        </ul>
      </aside>
    </main>
  );
}
