import { ArrowUpRight, LayoutDashboard, LogOut, Sparkles, Wallet } from "lucide-react";

const links = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "Transactions", href: "#transactions", icon: Wallet },
  { label: "Budgets", href: "#budgets", icon: Wallet },
  { label: "Insights", href: "#insights", icon: Sparkles },
  { label: "AI adviser", href: "#adviser", icon: Sparkles },
];

function DashboardSidebar({ user, onLogout }) {
  const initials = user?.username
    ?.split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PW";

  return (
    <aside className="flex shrink-0 flex-col border-b border-slate-200 bg-white px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <a href="#overview" className="flex w-fit items-center gap-2.5 rounded-lg text-xl font-bold tracking-tight text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20"><Wallet size={19} /></span>
        pennywise<span className="-ml-2 text-indigo-600">.</span>
      </a>
      <p className="mb-3 mt-8 hidden px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 lg:block">Workspace</p>
      <nav aria-label="Main navigation" className="mt-4 flex gap-1 overflow-x-auto pb-1 lg:mt-0 lg:flex-col lg:overflow-visible lg:pb-0">
        {links.map(({ label, href, icon: Icon }, index) => (
          <a
            key={label}
            href={href}
            className={`group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              index === 0
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {index === 0 && <span className="ml-auto hidden size-1.5 rounded-full bg-indigo-600 lg:block" />}
          </a>
        ))}
      </nav>

      <div className="mt-auto hidden lg:block">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm"><Sparkles size={16} /></span>
          <p className="mt-3 text-sm font-semibold text-slate-800">Your week, in focus</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Your latest spending is ready to explore. Small steps make a big difference.</p>
          <a href="#insights" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900">
            See your insights <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">{initials}</div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{user?.username || "Your account"}</p><p className="truncate text-xs text-slate-400">{user?.email || "Personal account"}</p></div>
          <button type="button" onClick={onLogout} aria-label="Sign out" title="Sign out" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"><LogOut size={16} /></button>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
