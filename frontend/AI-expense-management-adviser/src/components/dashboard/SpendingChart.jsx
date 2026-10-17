import { ChevronDown, Sparkles } from "lucide-react";
import { currency } from "./dashboardData";

function SpendingChart({ expenses, period, onPeriodChange }) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const chartData = period === "This month"
    ? Array.from({ length: Math.ceil(new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() / 7) }, (_, index) => {
      const startDay = index * 7 + 1;
      const endDay = Math.min(startDay + 6, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate());
      const total = expenses
        .filter((expense) => {
          const date = new Date(expense.date);
          return date.getFullYear() === today.getFullYear()
            && date.getMonth() === today.getMonth()
            && date.getDate() >= startDay
            && date.getDate() <= endDay;
        })
        .reduce((sum, expense) => sum + Number(expense.amount), 0);
      return {
        label: `Week ${index + 1}`,
        dateLabel: `${today.toLocaleDateString([], { month: "short" })} ${startDay}–${endDay}`,
        total,
      };
    })
    : Array.from({ length: 7 }, (_, index) => {
      const date = new Date(todayStart);
      date.setDate(date.getDate() - 6 + index);
      const total = expenses
        .filter((expense) => new Date(expense.date).toDateString() === date.toDateString())
        .reduce((sum, expense) => sum + Number(expense.amount), 0);
      return {
        label: date.toLocaleDateString([], { weekday: "short" }),
        dateLabel: date.toLocaleDateString([], { month: "short", day: "numeric" }),
        total,
      };
    });
  const chartTotal = chartData.reduce((total, day) => total + day.total, 0);
  const maxValue = Math.max(...chartData.map(({ total }) => total), 50);
  const highestPeriod = chartData.reduce((highest, day) => day.total > highest.total ? day : highest, chartData[0]);

  return (
    <article id="insights" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">The big picture</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Spending rhythm</h2>
          <p className="mt-1 text-sm text-slate-500">A gentle look at where your money goes.</p>
        </div>
        <label className="relative inline-flex items-center">
          <span className="sr-only">Spending period</span>
          <select
            aria-label="Spending period"
            value={period}
            onChange={(event) => onPeriodChange(event.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs font-medium text-slate-600 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option>This month</option><option>This week</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" />
        </label>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <div><p className="text-2xl font-semibold tracking-tight text-slate-950">{currency(chartTotal)}</p><p className="mt-1 text-xs text-slate-400">{period === "This month" ? "Spent this month" : "Spent in the last 7 days"}</p></div>
        <span className="mb-1 inline-flex items-center gap-2 text-xs text-slate-500"><i className="size-2 rounded-full bg-indigo-500" />{period === "This month" ? "Weekly spend" : "Daily spend"}</span>
      </div>

      <div className="mt-5 grid h-48 grid-cols-[32px_1fr] gap-3 sm:h-56">
        <div className="flex flex-col justify-between pb-6 text-right text-[10px] text-slate-400">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => <span key={ratio}>{currency(maxValue * ratio).replace(".00", "")}</span>)}
        </div>
        <div className="relative flex min-w-0 items-stretch justify-around border-b border-slate-100 bg-[linear-gradient(to_bottom,transparent_calc(25%-1px),#f1f5f9_25%,transparent_calc(25%+1px),transparent_calc(50%-1px),#f1f5f9_50%,transparent_calc(50%+1px),transparent_calc(75%-1px),#f1f5f9_75%,transparent_calc(75%+1px))]">
          {chartData.map((day) => {
            const height = day.total ? Math.max((day.total / maxValue) * 100, 5) : 0;
            return (
              <div key={day.dateLabel} className="flex h-full w-[11%] flex-col items-center justify-end">
                <span title={`${day.dateLabel}: ${currency(day.total)}`} className={`w-full max-w-8 rounded-t-lg transition-all duration-300 hover:brightness-95 ${day === highestPeriod && day.total > 0 ? "bg-indigo-600" : "bg-indigo-200"}`} style={{ height: `${height}%` }} />
                <span className="mt-2 text-[10px] text-slate-400">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-indigo-50/80 px-3.5 py-3 text-xs leading-5 text-slate-600">
        <Sparkles size={15} className="mt-0.5 shrink-0 text-indigo-600" />
        <p>{chartTotal > 0 ? <><strong className="font-semibold text-slate-800">{highestPeriod.label} is your biggest spending period</strong> at {currency(highestPeriod.total)}. Every little choice adds up.</> : `Add an expense to see your ${period === "This month" ? "monthly" : "weekly"} spending rhythm take shape.`}</p>
      </div>
    </article>
  );
}

export default SpendingChart;
