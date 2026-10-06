import { ArrowUpRight, Sparkles } from "lucide-react";
import { categories, categoryStyles, currency } from "./dashboardData";

function CategoriesPanel({ categoryTotals, monthlyTotal, highestCategory, onSelectCategory }) {
  const rankedCategories = [...categoryTotals].sort((a, b) => b.total - a.total);
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">Where it goes</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Top categories</h2><p className="mt-1 text-sm text-slate-500">Your spending, by category.</p></div>
      <div className="mt-5 space-y-1">
        {rankedCategories.map(({ category, total }) => {
          const definition = categories.find(({ name }) => name === category) || categories[0];
          const Icon = definition.icon;
          const style = categoryStyles[definition.tone];
          const share = monthlyTotal ? Math.round((total / monthlyTotal) * 100) : 0;
          return (
            <button type="button" key={category} onClick={() => onSelectCategory(category)} className="group flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${style.icon}`}><Icon size={16} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2"><strong className="text-sm font-semibold text-slate-700">{category}</strong><span className="text-sm font-semibold text-slate-800">{currency(total)}</span></span>
                <span className="mt-1.5 flex items-center gap-2"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><i className={`block h-full rounded-full transition-all ${style.bar}`} style={{ width: `${Math.max(share, total ? 3 : 0)}%` }} /></span><small className="w-8 text-right text-[10px] text-slate-400">{share}%</small></span>
              </span>
              <ArrowUpRight size={14} className="shrink-0 text-slate-300 transition group-hover:text-indigo-500" />
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-violet-50 px-3.5 py-3 text-xs leading-5 text-slate-600">
        <Sparkles size={15} className="mt-0.5 shrink-0 text-violet-600" />
        <p>{monthlyTotal > 0 ? <><strong className="font-semibold text-slate-800">{highestCategory?.category}</strong> is your biggest category this month. Tap a category to see those transactions.</> : "Add your first expense to see where your money goes."}</p>
      </div>
    </article>
  );
}

export default CategoriesPanel;
