import { Bell, ChevronRight } from "lucide-react";

function DashboardHeader() {
  const today = new Date();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">Workspace</span><ChevronRight size={15} className="text-slate-300" /><strong className="font-semibold text-slate-700">Overview</strong>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        <span className="hidden text-sm text-slate-500 sm:block">
          {today.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
        </span>
        <span className="hidden h-6 w-px bg-slate-200 sm:block" />
        <button type="button" aria-label="Notifications" title="You're all caught up" className="relative flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Bell size={18} /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-indigo-500" />
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
