import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { currency } from "./dashboardData";

function percentChange(current, previous) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function MetricCard({ label, value, detail, icon: Icon, accent, children }) {
  return (
    <article className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${accent}`}><Icon size={17} /></span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
      <div className="mt-2 flex min-h-5 items-center gap-2 text-xs text-slate-500">{detail}</div>
      {children}
    </article>
  );
}

function MetricCards({ availableBalance, monthlyTotal, previousTotal, savings, budget, budgetPercent }) {
  const change = percentChange(monthlyTotal, previousTotal);
  return (
    <section aria-label="Financial summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        label="Available balance"
        value={currency(availableBalance)}
        detail={<><span className="font-semibold text-emerald-600"><ArrowUpRight size={13} className="mr-0.5 inline" />On track</span><span>based on your monthly income</span></>}
        icon={Wallet}
        accent="bg-indigo-50 text-indigo-600"
      >
        <div aria-hidden="true" className="absolute -bottom-4 right-4 flex h-14 items-end gap-1 opacity-50">
          {[23, 33, 25, 40, 34, 50, 42, 56].map((height, index) => <span key={index} style={{ height: `${height}px` }} className="w-1.5 rounded-t-full bg-indigo-200" />)}
        </div>
      </MetricCard>
      <MetricCard
        label="Spent this month"
        value={currency(monthlyTotal)}
        detail={change === null
          ? <span>Not enough data to compare yet</span>
          : <><span className={`font-semibold ${change <= 0 ? "text-emerald-600" : "text-orange-600"}`}><ArrowDownLeft size={13} className="mr-0.5 inline" />{Math.abs(change)}%</span><span>vs. last month</span></>}
        icon={ArrowUpRight}
        accent="bg-orange-50 text-orange-600"
      >
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full transition-all ${budgetPercent >= 100 ? "bg-orange-500" : "bg-indigo-500"}`} style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
        </div>
        <div className="mt-2 flex justify-between gap-2 text-[11px] text-slate-400"><span>{Math.round(budgetPercent)}% of budget</span><span>{currency(budget)}</span></div>
      </MetricCard>
      <MetricCard
        label="Saved so far"
        value={currency(savings)}
        detail={<span>of {currency(5200)} monthly income</span>}
        icon={ArrowDownLeft}
        accent="bg-emerald-50 text-emerald-600"
      >
        <div className="mt-5 flex h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.max(0, Math.min((savings / 5200) * 100, 100))}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-slate-400">{Math.round(Math.max(0, Math.min((savings / 5200) * 100, 100)))}% of income remaining</p>
      </MetricCard>
    </section>
  );
}

export default MetricCards;
