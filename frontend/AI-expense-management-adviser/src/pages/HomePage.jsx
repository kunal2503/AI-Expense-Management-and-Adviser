import { ArrowRight, BarChart3, LockKeyhole, Sparkles, Wallet } from "lucide-react";
import { Link } from "react-router";

function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-950">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><Wallet size={19} /></span>
          pennywise<span className="-ml-2 text-indigo-600">.</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/signin" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900">Sign in</Link>
          <Link to="/signup" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">Get started</Link>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700"><Sparkles size={14} />A clearer view of your money</p>
          <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">Spend with more <span className="font-serif italic text-indigo-600">intention.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">Track everyday expenses, set a monthly budget, and get thoughtful, AI-powered guidance grounded in your own spending.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700">Create your account <ArrowRight size={16} /></Link>
            <Link to="/signin" className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700">I already have an account</Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole size={14} />Your financial data stays tied to your account.</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-100 via-violet-50 to-sky-100 blur-2xl" />
          <div className="relative rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-2xl shadow-indigo-950/10 sm:p-7">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium text-slate-400">Your overview</p><p className="mt-1 text-lg font-semibold text-slate-900">A calmer money day</p></div>
              <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><BarChart3 size={19} /></span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Monthly budget</p><p className="mt-2 text-2xl font-semibold text-slate-900">In focus</p><p className="mt-1 text-xs text-slate-500">A limit that works for you</p></div>
              <div className="rounded-2xl bg-indigo-50/70 p-4"><p className="text-xs text-indigo-500">Recent activity</p><p className="mt-2 text-2xl font-semibold text-slate-900">Organized</p><p className="mt-1 text-xs text-slate-500">Your spending, by category</p></div>
            </div>
            <div className="mt-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-violet-50/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Sparkles size={15} className="text-indigo-600" />Insight, with context</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">Ask how your spending is changing or get practical ideas based on your own expense history.</p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400"><span>Private by account</span><span>Built for everyday clarity</span></div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/70 bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8">
          {[["Track", "Record and organize daily spending in one place."], ["Understand", "See monthly totals, categories, and budget progress."], ["Improve", "Explore AI guidance grounded in your own expense data."]].map(([title, description]) => (
            <div key={title} className="flex gap-3"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><ArrowRight size={15} /></span><div><h2 className="text-sm font-semibold text-slate-800">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p></div></div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
