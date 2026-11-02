import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';

export default function Success() {
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  useEffect(() => { api(`/courses/${courseId}`).then((c) => setTitle(c.title)).catch(() => {}); }, [courseId]);
  return (
    <main className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sun text-2xl font-bold">✓</p>
      <h1 className="mt-5 text-3xl font-bold">Payment Successful</h1>
      <p className="mt-3 text-ink/70">You are enrolled in:</p>
      <p className="font-display text-xl font-bold">{title}</p>
      <Link to={`/learn/${courseId}`} className="btn mt-6">Start Learning</Link>
    </main>
  );
}
