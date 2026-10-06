import { useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Search, X } from "lucide-react";
import { categories, categoryStyles, currency } from "./dashboardData";

function formatDate(value) {
  const date = new Date(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function TransactionsPanel({
  expenses,
  query,
  onQueryChange,
  categoryFilter,
  categories: categoryOptions,
  onCategoryChange,
  onExport,
  onClearFilters,
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleExpenses = showAll ? expenses : expenses.slice(0, 7);
  const hasFilters = query.length > 0 || categoryFilter !== "All categories";

  return (
    <article id="transactions" className="scroll-mt-24 min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">The latest</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Recent activity</h2><p className="mt-1 text-sm text-slate-500">Every little thing, all in one place.</p></div>
        <button type="button" onClick={onExport} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <ArrowDownToLine size={15} /> Export
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-400 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
          <Search size={16} className="shrink-0" />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search transactions" aria-label="Search transactions" className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
          {query && <button type="button" onClick={() => onQueryChange("")} aria-label="Clear search" className="rounded p-0.5 hover:bg-slate-100"><X size={14} /></button>}
        </label>
        <label className="sm:w-44">
          <span className="sr-only">Filter by category</span>
          <select value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)} aria-label="Filter by category" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
            {categoryOptions.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-4 overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(90px,0.8fr)_minmax(90px,0.7fr)_auto] gap-3 border-b border-slate-100 px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:grid">
          <span>Merchant</span><span>Category</span><span>Date</span><span className="text-right">Amount</span>
        </div>
        {visibleExpenses.map((expense) => {
          const category = categories.find(({ name }) => name === expense.category) || categories[0];
          const Icon = category.icon;
          const style = categoryStyles[category.tone];
          return (
            <div key={expense.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-b border-slate-100 px-1 py-3.5 last:border-b-0 sm:grid-cols-[minmax(0,1.6fr)_minmax(90px,0.8fr)_minmax(90px,0.7fr)_auto] sm:gap-3 sm:px-2">
              <div className="flex min-w-0 items-center gap-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${style.icon}`}><Icon size={16} /></span>
                <span className="min-w-0"><strong className="block truncate text-sm font-semibold text-slate-800">{expense.name}</strong><span className="block truncate text-xs text-slate-400">{expense.note || "Personal expense"}</span></span>
              </div>
              <span className={`hidden w-fit rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline-flex ${style.badge}`}>{expense.category}</span>
              <span className="hidden text-xs text-slate-500 sm:block">{formatDate(expense.date)}</span>
              <span className="text-right text-sm font-semibold text-slate-800">−{currency(Number(expense.amount))}<span className="mt-1 block text-[11px] font-normal text-slate-400 sm:hidden">{formatDate(expense.date)}</span></span>
              <span className={`col-start-1 w-fit rounded-full px-2 py-0.5 text-[10px] font-medium sm:hidden ${style.badge}`}>{expense.category}</span>
            </div>
          );
        })}
        {expenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Search size={18} /></span>
            <strong className="mt-3 text-sm font-semibold text-slate-700">{hasFilters ? "No matching expenses" : "Nothing here just yet"}</strong>
            <span className="mt-1 text-xs text-slate-400">{hasFilters ? "Try another search or category." : "Add an expense and it will show up here."}</span>
            {hasFilters && <button type="button" onClick={onClearFilters} className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800">Clear filters</button>}
          </div>
        )}
      </div>

      {expenses.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">
          <span>Showing <strong className="font-semibold text-slate-600">{visibleExpenses.length}</strong> of <strong className="font-semibold text-slate-600">{expenses.length}</strong> transactions</span>
          <button type="button" onClick={showAll ? () => setShowAll(false) : onExport} className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800">
            {showAll ? "Show recent" : "Download full report"} <ArrowUpRight size={13} />
          </button>
        </div>
      )}
    </article>
  );
}

export default TransactionsPanel;
