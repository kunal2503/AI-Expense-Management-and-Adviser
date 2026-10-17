import { ArrowUpRight } from "lucide-react";
import { currency } from "./dashboardData";

function BudgetCard({ monthlyTotal, remaining, budget, budgetPercent, onEdit }) {
  const percent = Math.min(budgetPercent, 100);
  const isOverBudget = budgetPercent >= 100;
  const monthLabel = new Date().toLocaleDateString([], { month: "long", year: "numeric" });
  return (
    <article id="budgets" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">Spend with intention</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Monthly budget</h2></div>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          Edit <ArrowUpRight size={14} />
        </button>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400">{monthLabel}</p>

      <div className="mt-5 flex justify-center">
        <div
          role="img"
          aria-label={`${Math.round(budgetPercent)} percent of monthly budget used`}
          className={`grid size-44 place-items-center rounded-full ${isOverBudget ? "bg-[conic-gradient(#f97316_0%,#f97316_100%,#f1f5f9_100%)]" : "bg-[conic-gradient(#4f46e5_0%,#4f46e5_var(--budget-progress),#eef2ff_var(--budget-progress),#eef2ff_100%)]"}`}
          style={{ "--budget-progress": `${percent}%` }}
        >
          <div className="grid size-36 place-content-center rounded-full bg-white text-center shadow-inner">
            <strong className="text-3xl font-semibold tracking-tight text-slate-900">{Math.round(budgetPercent)}<span className="text-lg">%</span></strong>
            <span className="mt-0.5 text-xs text-slate-400">of budget</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <div><p className="flex items-center gap-1.5 text-[11px] text-slate-400"><i className="size-2 rounded-full bg-indigo-500" />Spent</p><p className="mt-1 text-sm font-semibold text-slate-800">{currency(monthlyTotal)}</p></div>
        <div><p className="flex items-center gap-1.5 text-[11px] text-slate-400"><i className="size-2 rounded-full bg-slate-200" />Left</p><p className="mt-1 text-sm font-semibold text-slate-800">{currency(Math.max(remaining, 0))}</p></div>
      </div>
      <div className={`mt-4 rounded-xl px-3.5 py-3 text-xs leading-5 ${isOverBudget ? "bg-orange-50 text-orange-800" : "bg-emerald-50 text-emerald-800"}`}>
        {budget <= 0
          ? "Set a monthly spending limit to keep your plans in view."
          : isOverBudget
          ? `You’re ${currency(monthlyTotal - budget)} over your ${currency(budget)} monthly plan.`
          : `Looking good. You have ${currency(Math.max(budget - monthlyTotal, 0))} left in your plan.`}
      </div>
    </article>
  );
}

export default BudgetCard;
