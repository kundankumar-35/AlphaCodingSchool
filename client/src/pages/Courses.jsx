import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, inr } from '../api.js';
import { useAuth } from '../auth.jsx';

export function CourseCard({ c }) {
  /*
   * ================================
   * AUTOMATIC DISCOUNT CALCULATION
   * ================================
   *
   * Current c.price = actual selling price
   * 40% discount is displayed automatically.
   */

  const discountPercent = 40;

  const calculatedOriginalPrice = Math.ceil(
    c.price / (1 - discountPercent / 100)
  );

  const originalPrice =
    Math.ceil(calculatedOriginalPrice / 100) * 100 - 1;

  const savings = originalPrice - c.price;

  return (
    <Link
      to={`/courses/${c._id}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-lg"
    >

      {/* =========================
          COURSE BANNER
      ========================== */}
      <div className="relative mx-2 mt-2 h-40 overflow-hidden rounded-xl bg-gradient-to-br from-[#071b52] via-[#073b8f] to-[#06204f]">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/40" />

          <div className="absolute -bottom-12 left-16 h-32 w-32 rounded-full border border-white/20" />

          <div className="absolute left-1/2 top-1/2 h-px w-full -rotate-12 bg-white/20" />
        </div>

        {/* Discount badge */}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-extrabold text-white shadow">
          {discountPercent}% OFF
        </div>

        {/* Course level */}
        <div className="absolute left-3 top-3 z-10 rounded-full bg-yellow-300 px-2.5 py-1 text-[11px] font-bold text-yellow-950">
          {c.level || 'Basic · Advanced'}
        </div>

        {/* Banner content */}
        <div className="relative flex h-full items-center justify-between px-5">

          <div className="max-w-[68%]">

            <h3 className="text-xl font-extrabold leading-tight tracking-tight text-white">
              {c.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-xs font-medium leading-4 text-white/85">
              {c.description}
            </p>

          </div>

          {/* Course icon */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm">
            <span className="text-2xl font-black text-white">
              {c.title?.charAt(0)?.toUpperCase()}
            </span>
          </div>

        </div>

        {/* Instructor */}
        <div className="absolute bottom-2.5 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
          {c.instructor}
        </div>

      </div>


      {/* =========================
          COURSE INFORMATION
      ========================== */}
      <div className="px-4 pb-4 pt-3">

        {/* Course meta */}
        <p className="text-xs text-ink/55">
          {c.level} · {c.instructor}
        </p>

        {/* Description */}
        <p className="mt-2 line-clamp-2 min-h-[36px] text-sm leading-[18px] text-ink/70">
          {c.description}
        </p>


        {/* =========================
            COURSE FEATURES
        ========================== */}
        <div className="mt-3 flex flex-wrap gap-1.5">

          {c.includes?.slice(0, 5).map((i) => (
            <span
              key={i}
              className="rounded-md bg-sig/10 px-2 py-1 text-[10px] font-medium text-sig"
            >
              {i}
            </span>
          ))}

        </div>


        {/* =========================
            PRICE SECTION
        ========================== */}
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5">

          {/* Original price + discount */}
          <div className="flex items-center gap-2">

            <span className="text-xs text-ink/45 line-through">
              {inr(originalPrice)}
            </span>

            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
              {discountPercent}% OFF
            </span>

          </div>


          {/* Current price */}
          <div className="mt-0.5 flex items-end justify-between">

            <div>

              <p className="text-[10px] text-ink/45">
                Special Price
              </p>

              <p className="font-display text-xl font-extrabold leading-none text-ink">
                {inr(c.price)}
              </p>

            </div>


            {/* Savings */}
            <p className="text-[11px] font-bold text-green-600">
              Save {inr(savings)}
            </p>

          </div>

        </div>


        {/* =========================
            VIEW COURSE BUTTON
        ========================== */}
        <div className="mt-3">

          <span className="flex w-full items-center justify-center rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-sig">
            View Course →
          </span>

        </div>

      </div>

    </Link>
  );
}


export function Courses() {
  const [list, setList] = useState(null);

  useEffect(() => {
    api('/courses')
      .then(setList)
      .catch(() => setList([]));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">

      <h1 className="text-3xl font-bold">
        Courses
      </h1>

      {!list ? (
        <p className="mt-6">
          Loading…
        </p>
      ) : list.length === 0 ? (
        <p className="mt-6 text-ink/60">
          No courses yet.
        </p>
      ) : (

        /*
         * ================================
         * RESPONSIVE COURSE GRID
         * ================================
         *
         * Mobile  : 1 card
         * Tablet  : 2 cards
         * Desktop : 3 cards
         */

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {list.map((c) => (
            <CourseCard
              key={c._id}
              c={c}
            />
          ))}

        </div>
      )}

    </main>
  );
}


export function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();

  const [c, setC] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);


  useEffect(() => {
    api(`/courses/${id}`)
      .then(setC)
      .catch((e) => setErr(e.message));
  }, [id, user]);


  const enroll = async () => {

    if (!user) {
      return nav('/login', {
        state: {
          from: `/courses/${id}`
        }
      });
    }

    setBusy(true);

    try {

      await api('/payments/checkout', {
        method: 'POST',
        body: {
          courseId: id
        }
      });

      nav(`/success/${id}`);

    } catch (e) {

      setErr(e.message);
      setBusy(false);

    }
  };


  if (err && !c) {
    return (
      <p className="p-8 text-live">
        {err}
      </p>
    );
  }


  if (!c) {
    return (
      <p className="p-8">
        Loading…
      </p>
    );
  }


  /*
   * ================================
   * DETAIL PAGE DISCOUNT
   * ================================
   */

  const discountPercent = 40;

  const calculatedOriginalPrice = Math.ceil(
    c.price / (1 - discountPercent / 100)
  );

  const originalPrice =
    Math.ceil(calculatedOriginalPrice / 100) * 100 - 1;

  const savings = originalPrice - c.price;


  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1fr_320px]">

      {/* =========================
          COURSE DETAILS
      ========================== */}

      <div>

        <h1 className="text-4xl font-extrabold">
          {c.title}
        </h1>

        <p className="mt-1 text-ink/60">
          {c.level} · Taught by {c.instructor}
        </p>

        <p className="mt-5 max-w-2xl text-lg">
          {c.description}
        </p>


        <h2 className="mt-10 text-xl font-bold">
          Syllabus
        </h2>


        <ol className="mt-3 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">

          {c.syllabus.map((l) => (
            <li
              key={l.id}
              className="flex justify-between px-4 py-3"
            >

              <span>
                {l.title}
              </span>

              <span className="text-sm text-ink/50">
                {l.duration} min
              </span>

            </li>
          ))}

        </ol>

      </div>


      {/* =========================
          PURCHASE CARD
      ========================== */}

      <aside className="h-fit rounded-xl border border-ink/10 bg-white p-5 md:sticky md:top-6">

        {/* Price */}

        <div className="rounded-xl bg-slate-50 p-4">

          <div className="flex items-center gap-2">

            <span className="text-lg text-ink/50 line-through">
              {inr(originalPrice)}
            </span>

            <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
              {discountPercent}% OFF
            </span>

          </div>


          <p className="mt-1 text-xs font-medium text-ink/50">
            Special Price
          </p>


          <p className="font-display text-3xl font-extrabold">
            {inr(c.price)}
          </p>


          <p className="mt-1 text-sm font-semibold text-green-600">
            You save {inr(savings)}
          </p>

        </div>


        {/* Included features */}

        <ul className="mt-4 space-y-1.5 text-sm">

          {c.includes.map((i) => (
            <li key={i}>
              ✓ {i}
            </li>
          ))}

        </ul>


        {/* Enroll / Continue */}

        {c.enrolled ? (

          <Link
            to={`/learn/${c._id}`}
            className="btn mt-5 w-full"
          >
            Continue Learning
          </Link>

        ) : (

          <button
            onClick={enroll}
            disabled={busy}
            className="btn mt-5 w-full"
          >
            {busy ? 'Processing…' : 'Enroll Now'}
          </button>

        )}


        {/* Error */}

        {err && (
          <p className="mt-3 text-sm text-live">
            {err}
          </p>
        )}

      </aside>

    </main>
  );
}