import { lazy, Suspense } from 'react';
import { Activity, BarChart3, BriefcaseBusiness, Building2, CircleAlert, CircleCheck, Compass, GraduationCap, Headset, MessageSquare, Mic, School, UsersRound } from 'lucide-react';

const OfficeRoom3D = lazy(() => import('./OfficeRoom3D.jsx'));

function RoomFallback() {
  return (
    <div className="flex h-full min-h-full items-center justify-center gap-3 text-sm text-white/65" role="status" aria-live="polite">
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      Loading 3D room...
    </div>
  );
}

const productCards = [
  ['01', Headset, 'VR interview practice', 'Realistic interview environments create controlled pressure before real interviews.', 'text-brandBlue'],
  ['02', Mic, 'Voice-to-voice AI', 'Adaptive follow-up questions respond to user answers through natural spoken practice.', 'text-brandTeal'],
  ['03', BarChart3, 'Measured feedback', 'Feedback covers answer quality, speech delivery, confidence, communication, and readiness.', 'text-brandBlue'],
  ['04', Compass, 'RIASEC guidance', 'Early pathway guidance helps school students explore academic and career direction.', 'text-brandOrange'],
];

const segments = [
  ['Primary', UsersRound, 'Students & job seekers', 'University students, fresh graduates, job seekers, and career changers preparing for interviews.', 'bg-blue-50 text-brandBlue'],
  ['Institutional', Building2, 'Schools & training providers', 'Universities, colleges, bootcamps, training centers, career services, and K-12 school networks.', 'bg-emerald-50 text-brandTeal'],
];

const lifecycle = [
  ['School', School, 'Pathway choice'],
  ['University', GraduationCap, 'Major exploration'],
  ['Interview', MessageSquare, 'Practice and feedback'],
  ['Workplace', Activity, 'Pressure simulation'],
];

function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-line bg-ink/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-full w-[92%] max-w-7xl items-center justify-center md:justify-between">
        <a href="#" className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">
            HR<span className="bg-gradient-to-r from-brandBlue to-brandTeal bg-clip-text text-transparent">VERSE</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a href="#product" className="hover:text-white">Product</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#segments" className="hover:text-white">Segments</a>
          <a href="#demo" className="hover:text-white">3D Room</a>
        </div>

      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="soft-glow relative h-[calc(100svh-4rem)] overflow-hidden border-b border-line">
      <div id="demo" className="absolute inset-0 z-0">
        <Suspense fallback={<RoomFallback />}>
          <OfficeRoom3D />
        </Suspense>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[52%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      <div className="pointer-events-none relative z-10 mx-auto grid h-full w-[92%] content-end items-end gap-8 pb-10 pt-8 lg:grid-cols-[0.75fr_1.25fr] lg:pb-14 lg:pt-10">
        <div className="flex max-w-2xl flex-col gap-8">
          <div className="hidden w-fit items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-2 text-sm text-white/70 sm:inline-flex">
            <span className="aspect-square w-2 rounded-full bg-brandOrange" />
            Coming soon — preview only
          </div>

          <div className="space-y-6">
            <h1 className="hero-title font-medium">Practice interviews before they matter.</h1>
            <p className="max-w-2xl text-[clamp(0.78rem,0.9vw,0.9rem)] leading-relaxed text-white/62">
              HRVERSE is an AI-powered employability and workforce-readiness ecosystem for VR interview practice,
              adaptive voice simulation, instant feedback, and future workplace-pressure training.
            </p>
          </div>

          <div className="pointer-events-auto hidden gap-3 sm:flex sm:flex-row">
            <a href="#demo" className="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white/85">
              Explore 3D room
            </a>
            <a href="#product" className="inline-flex justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30">
              Learn about product
            </a>
          </div>
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}

function Product() {
  return (
    <section id="product" className="bg-[#f6f5f0] text-ink">
      <div className="mx-auto grid w-[92%] max-w-7xl gap-12 py-[12vh] lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.22em] text-ink/45">Product</p>
          <h2 className="section-title font-medium">One platform from pathway choice to workforce readiness.</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {productCards.map(([num, Icon, title, text, color]) => (
            <article key={num} className="rounded-[1rem] border border-black/10 bg-white p-4 sm:rounded-[1.5rem] sm:p-6">
              <div className="mb-4 flex items-center justify-between sm:mb-10">
                <p className={`text-xs sm:text-sm ${color}`}>{num}</p>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} aria-hidden="true" />
              </div>
              <h3 className="text-base font-medium tracking-tight sm:text-2xl">{title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-ink/60 sm:mt-4 sm:text-base">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="border-y border-line bg-ink">
      <div className="mx-auto w-[92%] max-w-7xl py-[12vh]">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/40">Problem / Solution</p>
            <h2 className="section-title max-w-3xl font-medium">Turn practice into measured simulation.</h2>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-red-300/20 bg-red-500/[0.06] p-6">
              <div className="flex items-center gap-2 text-red-200/60">
                <CircleAlert className="h-5 w-5" aria-hidden="true" />
                <p className="text-sm uppercase tracking-[0.18em]">Problem</p>
              </div>
              <h3 className="mt-4 text-2xl font-medium tracking-tight">Preparation is unrealistic, expensive, hard to scale, and inconsistent.</h3>
              <p className="mt-4 leading-relaxed text-white/55">
                Students and job seekers need realistic interview pressure, while institutions need scalable and consistent feedback.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/[0.06] p-6">
              <div className="flex items-center gap-2 text-emerald-200/60">
                <CircleCheck className="h-5 w-5" aria-hidden="true" />
                <p className="text-sm uppercase tracking-[0.18em]">Solution</p>
              </div>
              <h3 className="mt-4 text-2xl font-medium tracking-tight">HRVERSE provides realistic AI/VR practice with structured reports.</h3>
              <p className="mt-4 leading-relaxed text-white/55">
                Users practice naturally, receive objective feedback, and institutions can track performance through automated reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Segments() {
  return (
    <section id="segments" className="bg-white text-ink">
      <div className="mx-auto w-[92%] max-w-7xl py-[12vh]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.22em] text-ink/45">Market segments</p>
            <h2 className="section-title font-medium">Who HRVERSE serves.</h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-ink/55">
            Built for students, job seekers, institutions, and enterprise HR teams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {segments.map(([tag, Icon, title, text, tagClass]) => (
            <article key={title} className="rounded-[1rem] border border-black/10 p-4 sm:rounded-[1.5rem] sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs sm:px-3 sm:text-sm ${tagClass}`}>{tag}</span>
                <Icon className="h-5 w-5 text-ink/40 sm:h-6 sm:w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-base font-medium tracking-tight sm:mt-10 sm:text-2xl">{title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-ink/60 sm:mt-4 sm:text-base">{text}</p>
            </article>
          ))}

          <article className="rounded-[1rem] border border-black/10 bg-ink p-4 text-white sm:rounded-[1.5rem] sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/60 sm:px-3 sm:text-sm">Enterprise</span>
              <BriefcaseBusiness className="h-5 w-5 text-white/45 sm:h-6 sm:w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-base font-medium tracking-tight sm:mt-10 sm:text-2xl">Employers & HR teams</h3>
            <p className="mt-3 text-xs leading-relaxed text-white/55 sm:mt-4 sm:text-base">
              Recruiters and HR departments improving candidate screening and workplace-readiness preparation.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Lifecycle() {
  return (
    <section className="bg-[#f6f5f0] text-ink">
      <div className="mx-auto grid w-[92%] max-w-7xl gap-6 py-[12vh] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.8rem] bg-ink p-8 text-white">
          <p className="text-sm uppercase tracking-[0.22em] text-white/40">Lifecycle advantage</p>
          <h2 className="mt-8 max-w-2xl text-[clamp(2rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.06em]">
            From school pathway to workplace pressure.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {lifecycle.map(([label, Icon, title]) => (
            <div key={title} className="rounded-[1rem] border border-black/10 bg-white p-4 sm:rounded-[1.5rem] sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-ink/45 sm:text-sm">{label}</p>
                <Icon className="h-5 w-5 text-brandBlue sm:h-6 sm:w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-medium sm:mt-8 sm:text-xl">{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComingSoon() {
  return (
    <section className="bg-ink">
      <div className="mx-auto w-[92%] max-w-7xl py-[12vh]">
        <div className="rounded-[2rem] border border-line bg-panel p-[min(8vw,4rem)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.22em] text-brandOrange">Coming soon</p>
              <h2 className="section-title max-w-4xl font-medium">HRVERSE is not released yet. This page is a visual preview only.</h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <a href="#demo" className="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white/85">
                Return to 3D preview
              </a>
              <a href="#" className="inline-flex justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30">
                Back to top
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex w-[92%] max-w-7xl flex-col gap-6 py-8 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span>HRVERSE</span>
        </div>

        <div className="flex flex-wrap gap-5">
          <a href="#product" className="hover:text-white">Product</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#segments" className="hover:text-white">Segments</a>
          <a href="#demo" className="hover:text-white">3D Room</a>
        </div>
      </div>

      <p className="mx-auto w-[92%] max-w-7xl border-t border-line pb-8 pt-6 text-center text-xs text-white/35">
        © Al Ahliyya Amman University. All rights reserved.
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="bg-ink text-white font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <Product />
        <Features />
        <Segments />
        <Lifecycle />
        <ComingSoon />
      </main>
      <Footer />
    </div>
  );
}
