import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, when } from '../api.js';
import { useAuth } from '../auth.jsx';
import { CourseCard } from './Courses.jsx';

/*
|--------------------------------------------------------------------------
| HOME PAGE DATA
|--------------------------------------------------------------------------
| These arrays are intentionally kept outside the component.
| Later you can move them to:
|   - MongoDB
|   - CMS
|   - separate JSON/config files
|   - Admin dashboard
|--------------------------------------------------------------------------
*/

const stats = [
  {
    value: '10,000+',
    label: 'Students Learning',
    icon: '👥',
  },
  {
    value: '100+',
    label: 'Problems & Assignments',
    icon: '🧩',
  },
  {
    value: '200+',
    label: 'Video Lessons',
    icon: '▶',
  },
  {
    value: 'Live',
    label: 'Interactive Classes',
    icon: '📡',
  },
  {
    value: '4.8/5',
    label: 'Student Satisfaction',
    icon: '★',
  },
];


/*
|--------------------------------------------------------------------------
| COURSE CATEGORIES
|--------------------------------------------------------------------------
| These are currently static.
| FUTURE:
| Fetch categories dynamically from backend/admin panel.
|--------------------------------------------------------------------------
*/

const learningPaths = [
  {
    title: 'DSA with C++',
    subtitle: 'Complete roadmap',
    icon: 'C++',
    iconStyle: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'DSA Mastery',
    subtitle: 'Basics to advanced',
    icon: '🧠',
    iconStyle: 'bg-pink-100 text-pink-600',
  },
  {
    title: 'Python for DSA',
    subtitle: 'Learn with simplicity',
    icon: '🐍',
    iconStyle: 'bg-yellow-100 text-yellow-700',
  },
  {
    title: 'Java for DSA',
    subtitle: 'Strong foundations',
    icon: '☕',
    iconStyle: 'bg-red-100 text-red-600',
  },
  {
    title: 'Interview Prep',
    subtitle: 'Crack top companies',
    icon: '💼',
    iconStyle: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'System Design',
    subtitle: 'Design scalable systems',
    icon: '▤',
    iconStyle: 'bg-slate-100 text-slate-700',
  },
];


/*
|--------------------------------------------------------------------------
| BENEFITS
|--------------------------------------------------------------------------
*/

const benefits = [
  {
    icon: '▶',
    title: 'High Quality Content',
    description: 'Structured lessons that are easy to follow and revise.',
  },
  {
    icon: '▤',
    title: 'Comprehensive Notes',
    description: 'Clean and organized study material for quick revision.',
  },
  {
    icon: '👥',
    title: 'Live Interactive Classes',
    description: 'Learn directly with guidance, discussion and doubt solving.',
  },
  {
    icon: '▥',
    title: 'Practice & Growth',
    description: 'Handpicked problems designed to improve your thinking.',
  },
];


/*
|--------------------------------------------------------------------------
| LEARNING JOURNEY
|--------------------------------------------------------------------------
*/

const learningSteps = [
  {
    number: '01',
    title: 'Learn the Concept',
    description: 'Understand the idea before memorizing the solution.',
  },
  {
    number: '02',
    title: 'Understand the Pattern',
    description: 'Learn how to recognize the right approach.',
  },
  {
    number: '03',
    title: 'Solve Problems',
    description: 'Apply your knowledge to carefully selected problems.',
  },
  {
    number: '04',
    title: 'Practice Variations',
    description: 'Build flexibility by solving different variations.',
  },
  {
    number: '05',
    title: 'Become Interview Ready',
    description: 'Turn your problem-solving skills into interview confidence.',
  },
];


/*
|--------------------------------------------------------------------------
| TESTIMONIAL PLACEHOLDERS
|--------------------------------------------------------------------------
| Keep these as placeholders until you have real student feedback.
|
| IMPORTANT:
| Do not publish fake testimonials.
| Replace this data with genuine reviews later.
|--------------------------------------------------------------------------
*/

const testimonials = [
  {
    quote:
      'The teaching style focuses on understanding the pattern instead of memorizing code.',
    name: 'Student Name',
    role: 'DSA Learner',
  },
  {
    quote:
      'The structured approach made difficult DSA topics much easier to understand.',
    name: 'Student Name',
    role: 'Computer Science Student',
  },
  {
    quote:
      'The combination of videos, notes and practice made my preparation much more organized.',
    name: 'Student Name',
    role: 'Interview Candidate',
  },
];


/*
|--------------------------------------------------------------------------
| HERO VISUAL
|--------------------------------------------------------------------------
| We use a local image if you add:
|
| public/images/home-hero.png
|
| If the image doesn't exist, a CSS-based fallback visual is shown.
|
| This makes the page work even before you add the final hero artwork.
|--------------------------------------------------------------------------
*/

function HeroVisual() {
  const [imageAvailable, setImageAvailable] = useState(true);

  return (
    <div className="relative mx-auto w-full max-w-xl">

      {/* Decorative glow */}
      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-10 bottom-5 h-48 w-48 rounded-full bg-yellow-400/20 blur-3xl" />

      {/* Main visual frame */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm">

        {imageAvailable ? (
          <img
            src="/images/home-hero.png"
            alt="BigO School learning"
            className="h-[390px] w-full rounded-[22px] object-cover object-center"
            onError={() => setImageAvailable(false)}
          />
        ) : (
          <div className="relative flex h-[390px] items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b1f49] via-[#083c8c] to-[#06142e]">

            {/* Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)',
                backgroundSize: '38px 38px',
              }}
            />

            {/* Code terminal */}
            <div className="relative w-[78%] rounded-2xl border border-white/10 bg-[#081225]/95 p-5 shadow-2xl">

              <div className="mb-5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>

              <div className="space-y-2 font-mono text-sm leading-6">
                <p className="text-blue-300">
                  function <span className="text-yellow-300">solve</span>(arr) {'{'}
                </p>

                <p className="pl-5 text-white/75">
                  // Understand the pattern
                </p>

                <p className="pl-5 text-green-300">
                  let answer = think(arr);
                </p>

                <p className="pl-5 text-cyan-300">
                  return answer;
                </p>

                <p className="text-blue-300">{'}'}</p>
              </div>

            </div>


            {/* Floating cards */}

            <div className="absolute right-5 top-6 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-white/60">
                Better
              </p>
              <p className="font-bold text-white">
                Problem Solving
              </p>
            </div>

            <div className="absolute left-5 bottom-6 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-white/60">
                Build
              </p>
              <p className="font-bold text-white">
                Stronger Logic
              </p>
            </div>

          </div>
        )}


        {/* Floating badge */}

        <div className="absolute -right-4 top-10 rounded-2xl border border-white/10 bg-white px-4 py-3 shadow-xl">
          <p className="text-xs font-medium text-slate-500">
            Interview Goal
          </p>

          <p className="mt-1 text-sm font-extrabold text-slate-900">
            Crack Top Companies
          </p>
        </div>


        <div className="absolute -bottom-4 left-4 rounded-2xl border border-white/10 bg-white px-4 py-3 shadow-xl">
          <p className="text-xs font-medium text-slate-500">
            Learning Focus
          </p>

          <p className="mt-1 text-sm font-extrabold text-slate-900">
            Logic → Patterns → Practice
          </p>
        </div>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| HOME COMPONENT
|--------------------------------------------------------------------------
*/

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [live, setLive] = useState([]);

  /*
   * Search input.
   *
   * Currently we navigate to /courses?search=...
   *
   * FUTURE:
   * Your Courses page can read this query parameter and
   * filter the courses.
   */
  const [search, setSearch] = useState('');


  /*
   |--------------------------------------------------------------------------
   | LOAD HOMEPAGE DATA
   |--------------------------------------------------------------------------
   | Existing APIs are preserved:
   |
   | GET /courses
   | GET /live
   |
   | Only the first few items are displayed on the homepage.
   |--------------------------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    Promise.all([
      api('/courses').catch(() => []),
      api('/live').catch(() => []),
    ]).then(([courseData, liveData]) => {
      if (!mounted) return;

      setCourses(Array.isArray(courseData) ? courseData.slice(0, 4) : []);
      setLive(Array.isArray(liveData) ? liveData.slice(0, 3) : []);
    });

    return () => {
      mounted = false;
    };
  }, []);


  /*
   |--------------------------------------------------------------------------
   | SEARCH SUBMIT
   |--------------------------------------------------------------------------
   */

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate('/courses');
      return;
    }

    navigate(`/courses?search=${encodeURIComponent(query)}`);
  };


  return (
    <main className="overflow-hidden bg-slate-50">

      {/* ================================================================
          HERO SECTION
      ================================================================= */}

      <section className="relative overflow-hidden bg-[#071225] text-white">

        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />

          <div className="absolute right-0 top-10 h-[450px] w-[450px] rounded-full bg-yellow-400/10 blur-3xl" />

        </div>


        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8 lg:py-24">

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">

            {/* =========================================================
                LEFT SIDE
            ========================================================== */}

            <div>

              {/* Small badge

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">

                <span className="h-2 w-2 rounded-full bg-sun" />

                Master DSA · Build Skills · Get Interview Ready

              </div> */}


              {/* Main heading */}

              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">

                Learn the logic,
                <br />

                not just{' '}

                <span className="text-sun">
                  the solution.
                </span>

              </h1>


              {/* Description */}

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">

                Structured courses, live classes, practice problems and expert
                guidance to help you master Data Structures & Algorithms.

              </p>


              {/* CTA buttons */}

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center rounded-xl bg-sun px-6 py-3.5 font-bold text-ink transition hover:-translate-y-0.5 hover:brightness-95"
                >
                  Explore Courses
                  <span className="ml-2">→</span>
                </Link>


                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                >
                  <span className="mr-2">▶</span>
                  Watch Demo
                </Link>

              </div>


              {/* Social proof */}

              <div className="mt-8 flex flex-wrap items-center gap-4">

                {/* Fake avatar stack / replace with real student images later */}

                <div className="flex -space-x-2">

                  {['K', 'A', 'R', 'S'].map((letter, index) => (
                    <div
                      key={letter}
                      className={`grid h-9 w-9 place-items-center rounded-full border-2 border-[#071225] text-xs font-bold text-white ${
                        index === 0
                          ? 'bg-blue-600'
                          : index === 1
                            ? 'bg-purple-600'
                            : index === 2
                              ? 'bg-emerald-600'
                              : 'bg-orange-500'
                      }`}
                    >
                      {letter}
                    </div>
                  ))}

                </div>


                <div>
                  <p className="text-sm font-bold text-white">
                    10,000+ students
                  </p>

                  <p className="text-xs text-white/55">
                    are already learning with BigO School
                  </p>
                </div>

              </div>


              {/* Search */}

              <form
                onSubmit={handleSearch}
                className="mt-9 max-w-2xl"
              >

                <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur">

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for courses, DSA, interview preparation..."
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                  />

                  <button
                    type="submit"
                    className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-ink transition hover:bg-slate-100"
                  >
                    Search
                  </button>

                </div>

              </form>

            </div>


            {/* =========================================================
                RIGHT VISUAL
            ========================================================== */}

            <HeroVisual />

          </div>

        </div>

      </section>


      {/* ================================================================
          STATS SECTION
      ================================================================= */}

      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:grid-cols-2 lg:grid-cols-5">

          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex items-center gap-4 px-5 py-5 ${
                index !== stats.length - 1
                  ? 'border-b border-slate-100 lg:border-b-0 lg:border-r'
                  : ''
              }`}
            >

              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-lg">
                {stat.icon}
              </div>

              <div>
                <p className="text-lg font-extrabold text-slate-900">
                  {stat.value}
                </p>

                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>

            </div>
          ))}

        </div>

      </section>


      {/* ================================================================
          LEARNING PATHS
      ================================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="flex flex-wrap items-end justify-between gap-4">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sig">
              Start Learning
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink md:text-4xl">
              Choose your learning path
            </h2>

            <p className="mt-2 max-w-2xl text-ink/60">
              Start from where you are and follow a structured path toward
              stronger problem-solving skills.
            </p>

          </div>


          <Link
            to="/courses"
            className="font-semibold text-sig transition hover:underline"
          >
            View all courses →
          </Link>

        </div>


        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {learningPaths.map((path) => (
            <Link
              key={path.title}
              to="/courses"
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >

              <div
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-black ${path.iconStyle}`}
              >
                {path.icon}
              </div>


              <div className="min-w-0">

                <h3 className="font-bold text-ink">
                  {path.title}
                </h3>

                <p className="mt-1 text-sm text-ink/55">
                  {path.subtitle}
                </p>

              </div>


              <span className="ml-auto text-lg text-ink/30 transition group-hover:translate-x-1 group-hover:text-sig">
                →
              </span>

            </Link>
          ))}

        </div>

      </section>


      {/* ================================================================
          FEATURED COURSES
      ================================================================= */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="flex flex-wrap items-end justify-between gap-4">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sig">
                Featured Courses
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-ink md:text-4xl">
                Handpicked for your journey
              </h2>

              <p className="mt-2 text-ink/60">
                Start with carefully structured courses designed for real
                problem solving.
              </p>

            </div>


            <Link
              to="/courses"
              className="font-semibold text-sig transition hover:underline"
            >
              View all courses →
            </Link>

          </div>


          {courses.length > 0 ? (

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  c={course}
                />
              ))}

            </div>

          ) : (

            /*
             * Placeholder cards when the API is empty.
             * This is useful while your backend is still being populated.
             */
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >

                  <div className="h-40 animate-pulse rounded-xl bg-slate-200" />

                  <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-200" />

                  <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-slate-200" />

                </div>
              ))}

            </div>

          )}

        </div>

      </section>


      {/* ================================================================
          WHY BIGO SCHOOL
      ================================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="text-center">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sig">
            Why Big O School
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-ink md:text-4xl">
            Everything you need to improve
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-ink/60">
            Learn concepts, practice intelligently and build the confidence
            required for technical interviews.
          </p>

        </div>


        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                {benefit.icon}
              </div>


              <h3 className="mt-5 text-lg font-bold text-ink">
                {benefit.title}
              </h3>


              <p className="mt-2 text-sm leading-6 text-ink/60">
                {benefit.description}
              </p>

            </div>
          ))}

        </div>

      </section>


      {/* ================================================================
          LEARNING JOURNEY
      ================================================================= */}

      <section className="bg-[#071225] text-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun">
              Learning Method
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              Learn → Understand → Practice → Master
            </h2>

            <p className="mt-4 text-white/65">
              Our approach focuses on building thinking ability instead of
              teaching you to memorize solutions.
            </p>

          </div>


          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">

            {learningSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >

                <div className="flex items-center justify-between">

                  <span className="text-3xl font-black text-white/20">
                    {step.number}
                  </span>

                  <div className="h-2.5 w-2.5 rounded-full bg-sun" />

                </div>


                <h3 className="mt-7 font-bold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  {step.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* ================================================================
          UPCOMING LIVE CLASSES
      ================================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="flex flex-wrap items-end justify-between gap-4">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-live">
              Learn Live
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink md:text-4xl">
              Upcoming live classes
            </h2>

            <p className="mt-2 text-ink/60">
              Join live sessions, ask questions and learn directly.
            </p>

          </div>


          <Link
            to="/live"
            className="font-semibold text-sig transition hover:underline"
          >
            See all classes →
          </Link>

        </div>


        <div className="mt-8 grid gap-4 md:grid-cols-3">

          {live.length === 0 ? (

            /*
             * Empty state for now.
             * Once live classes are added to backend,
             * this section automatically becomes dynamic.
             */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 md:col-span-3">

              <div className="mx-auto max-w-md text-center">

                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-xl">
                  📡
                </div>

                <h3 className="mt-4 text-lg font-bold text-ink">
                  No live classes scheduled yet
                </h3>

                <p className="mt-2 text-sm text-ink/55">
                  Upcoming live sessions will appear here automatically.
                </p>

                <Link
                  to="/live"
                  className="mt-5 inline-flex rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sig"
                >
                  Explore Live Classes
                </Link>

              </div>

            </div>

          ) : (

            live.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-start justify-between gap-4">

                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">

                    <span className="h-2 w-2 rounded-full bg-red-500" />

                    Live Session

                  </span>


                  <span className="text-xs text-ink/45">
                    {when(item.startsAt)}
                  </span>

                </div>


                <h3 className="mt-6 text-lg font-bold text-ink">
                  {item.title}
                </h3>


                <p className="mt-2 text-sm text-ink/55">
                  Join the session and learn directly with guidance.
                </p>


                <Link
                  to="/live"
                  className="mt-6 inline-flex font-semibold text-sig"
                >
                  View Class →
                </Link>

              </div>
            ))

          )}

        </div>

      </section>


      {/* ================================================================
          TESTIMONIALS
      ================================================================= */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sig">
              Student Feedback
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink md:text-4xl">
              Built for better learning
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-ink/60">
              Real student feedback can be displayed here as your community
              grows.
            </p>

          </div>


          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {testimonials.map((testimonial) => (
              <div
                key={testimonial.quote}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >

                <div className="text-lg tracking-wide text-yellow-400">
                  ★★★★★
                </div>


                <p className="mt-4 text-sm leading-7 text-ink/70">
                  "{testimonial.quote}"
                </p>


                <div className="mt-6 flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>

                    <p className="text-sm font-bold text-ink">
                      {testimonial.name}
                    </p>

                    <p className="text-xs text-ink/50">
                      {testimonial.role}
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* ================================================================
          FINAL CTA
      ================================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#071225] via-[#0a2450] to-[#06122b]">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/4 top-0 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute right-1/4 bottom-0 h-60 w-60 rounded-full bg-yellow-400/10 blur-3xl" />

        </div>


        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun">
            Start Today
          </p>


          <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Stop memorizing solutions.
            <br />
            Start understanding patterns.
          </h2>


          <p className="mx-auto mt-5 max-w-2xl text-white/60">
            Build stronger problem-solving skills with structured courses,
            practice and guidance designed for real technical interviews.
          </p>


          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <Link
              to="/courses"
              className="rounded-xl bg-sun px-7 py-3.5 font-bold text-ink transition hover:-translate-y-0.5 hover:brightness-95"
            >
              Start Learning →
            </Link>


            {!user && (
              <Link
                to="/signup"
                className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Create Free Account
              </Link>
            )}

          </div>

        </div>

      </section>


      {/* ================================================================
          FUTURE FEATURES
      ================================================================= */}

      {/*
        FUTURE SECTION IDEAS

        1. Company preparation section
           - Google
           - Microsoft
           - Amazon
           - Meta
           - Adobe

        2. DSA Pattern Explorer
           - Arrays
           - Sliding Window
           - Binary Search
           - Trees
           - Graphs
           - DP

        3. Student dashboard preview

        4. Coding streak section

        5. Leaderboard

        6. Success stories

        7. Free resources / blogs

        8. Newsletter / email collection

        9. Placement statistics

        10. FAQ

        11. Footer with:
            - About
            - Courses
            - Resources
            - Contact
            - Privacy
            - Terms
      */}

    </main>
  );
}