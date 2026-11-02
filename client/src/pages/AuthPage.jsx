import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function AuthPage({ mode }) {
  const signup = mode === 'signup';
  const { login } = useAuth();
  const nav = useNavigate();
  const from = useLocation().state?.from || '/my-courses';
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { login(await api(`/auth/${mode}`, { method: 'POST', body: f })); nav(from, { replace: true }); }
    catch (x) { setErr(x.message); }
  };
  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-3xl font-bold">{signup ? 'Create your account' : 'Welcome back'}</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        {signup && <input className="input" placeholder="Name" value={f.name} onChange={set('name')} required />}
        <input className="input" type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
        <input className="input" type="password" placeholder="Password (6+ characters)" value={f.password} onChange={set('password')} required />
        {err && <p className="text-sm text-live">{err}</p>}
        <button className="btn w-full">{signup ? 'Sign up' : 'Log in'}</button>
      </form>
      <p className="mt-4 text-sm text-ink/70">{signup ? 'Have an account?' : 'New here?'} <Link className="font-medium text-sig" to={signup ? '/login' : '/signup'} state={{ from }}>{signup ? 'Log in' : 'Sign up'}</Link></p>
    </main>
  );
}
