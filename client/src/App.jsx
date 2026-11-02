import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Home from './pages/Home.jsx';
import { Courses, CourseDetail } from './pages/Courses.jsx';
import Live from './pages/Live.jsx';
import MyCourses from './pages/MyCourses.jsx';
import Learn from './pages/Learn.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Success from './pages/Success.jsx';

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
    <img src="/a-rounded-logo-red.svg" alt="" className="h-8 w-8" />Alpha <span className="text-live">Coding School</span>
  </Link>
);

function Navbar() {
  const { user, logout } = useAuth();
  const link = ({ isActive }) => `px-3 py-1.5 rounded-md ${isActive ? 'bg-ink text-white' : 'hover:bg-ink/5'}`;
  return (
    <header className="border-b border-ink/10 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Logo />
        <div className="ml-auto flex flex-wrap items-center gap-1 text-sm font-medium">
          <NavLink to="/courses" className={link}>Courses</NavLink>
          <NavLink to="/live" className={link}>Live Classes</NavLink>
          <NavLink to="/my-courses" className={link}>My Courses</NavLink>
          {user ? <button onClick={logout} className="btn-ghost !py-1.5 text-sm">Log out ({user.name.split(' ')[0]})</button>
                : <NavLink to="/login" className={link}>Login</NavLink>}
        </div>
      </nav>
    </header>
  );
}

export function Protected({ children }) {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <p className="p-8">Loading…</p>;
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname }} replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/live" element={<Live />} />
        <Route path="/my-courses" element={<Protected><MyCourses /></Protected>} />
        <Route path="/learn/:courseId/:lessonId?" element={<Protected><Learn /></Protected>} />
        <Route path="/success/:courseId" element={<Protected><Success /></Protected>} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
