import { ArrowDownLeft, ArrowUpRight, Receipt, Wallet } from "lucide-react";
import { currency } from "./dashboardData";

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

function MetricCards({ monthlyTotal, previousTotal, budget, budgetPercent, transactionCount }) {
  const change = previousTotal > 0
    ? Math.round(((monthlyTotal - previousTotal) / previousTotal) * 100)
    : null;

  return (
    <section aria-label="Financial summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        label="Spent this month"
        value={currency(monthlyTotal)}
        detail={change === null
          ? <span>Not enough data to compare yet</span>
          : <><span className={`font-semibold ${change <= 0 ? "text-emerald-600" : "text-orange-600"}`}>{change <= 0 ? <ArrowDownLeft size={13} className="mr-0.5 inline" /> : <ArrowUpRight size={13} className="mr-0.5 inline" />}{Math.abs(change)}%</span><span>vs. last month</span></>}
        icon={ArrowUpRight}
        accent="bg-orange-50 text-orange-600"
      >
        {budget > 0 && <><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${budgetPercent >= 100 ? "bg-orange-500" : "bg-indigo-500"}`} style={{ width: `${Math.min(budgetPercent, 100)}%` }} /></div><div className="mt-2 flex justify-between gap-2 text-[11px] text-slate-400"><span>{Math.round(budgetPercent)}% of budget</span><span>{currency(budget)}</span></div></>}
      </MetricCard>
      <MetricCard
        label="Budget remaining"
        value={budget > 0 ? currency(Math.max(budget - monthlyTotal, 0)) : "Not set"}
        detail={budget > 0
          ? <span>{budgetPercent >= 100 ? "Monthly budget reached" : "Available for the rest of this month"}</span>
          : <span>Set a monthly budget to track your limit</span>}
        icon={Wallet}
        accent="bg-indigo-50 text-indigo-600"
      />
      <MetricCard
        label="Transactions this month"
        value={transactionCount.toLocaleString()}
        detail={<span>Expenses recorded this month</span>}
        icon={Receipt}
        accent="bg-emerald-50 text-emerald-600"
      />
    </section>
  );
}

export default MetricCards;
