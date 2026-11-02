const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(API + '/api' + path, {   // was: '/api' + path
    method, body: body && JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Try again.');
  return data;
}
export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
export const when = (d) => new Date(d).toLocaleString([], { weekday: 'long', hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' });
