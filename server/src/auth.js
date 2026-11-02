import jwt from 'jsonwebtoken';
const secret = () => process.env.JWT_SECRET || 'dev-secret';
export const sign = (u) => jwt.sign({ id: u._id, role: u.role }, secret(), { expiresIn: '14d' });
const read = (req) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { return t ? jwt.verify(t, secret()) : null; } catch { return null; }
};
export const optional = (req, _res, next) => { req.user = read(req); next(); };
export const auth = (req, res, next) => {
  req.user = read(req);
  req.user ? next() : res.status(401).json({ error: 'Please log in to continue.' });
};
