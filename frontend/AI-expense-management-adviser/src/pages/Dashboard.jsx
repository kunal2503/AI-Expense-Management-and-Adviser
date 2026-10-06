import { useMemo, useState } from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import MetricCards from "../components/dashboard/MetricCards";
import SpendingChart from "../components/dashboard/SpendingChart";
import BudgetCard from "../components/dashboard/BudgetCard";
import TransactionsPanel from "../components/dashboard/TransactionsPanel";
import CategoriesPanel from "../components/dashboard/CategoriesPanel";
import ExpenseDialog from "../components/dashboard/ExpenseDialog";
import BudgetDialog from "../components/dashboard/BudgetDialog";
import { categories, currency, starterExpenses } from "../components/dashboard/dashboardData";

const STORAGE_KEY = "pennywise-expenses-v1";
const BUDGET_KEY = "pennywise-budget-v1";
const categoryOptions = ["All categories", ...categories.map(({ name }) => name)];

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : starterExpenses;
  } catch {
    return starterExpenses;
  }
}

function Dashboard() {
  const [expenses, setExpenses] = useState(loadExpenses);
  const [budget, setBudget] = useState(() => Number(localStorage.getItem(BUDGET_KEY)) || 2400);
  const [period, setPeriod] = useState("This month");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [query, setQuery] = useState("");
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [notice, setNotice] = useState("");
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const previousMonthEnd = monthStart;

  const monthlyExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);
    return date >= monthStart && date < nextMonthStart;
  });
  const monthlyTotal = monthlyExpenses.reduce((total, expense) => total + Number(expense.amount), 0);
  const previousTotal = expenses
    .filter((expense) => {
      const date = new Date(expense.date);
      return date >= previousMonthStart && date < previousMonthEnd;
    })
    .reduce((total, expense) => total + Number(expense.amount), 0);
  const savings = 5200 - monthlyTotal;
  const remaining = Math.max(budget - monthlyTotal, 0);
  const budgetPercent = budget > 0 ? (monthlyTotal / budget) * 100 : 0;
  const periodExpenses = period === "This month"
    ? monthlyExpenses
    : expenses.filter((expense) => new Date(expense.date) >= weekStart && new Date(expense.date) < new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));

  const filteredExpenses = useMemo(() => periodExpenses.filter((expense) => {
    const matchesCategory = categoryFilter === "All categories" || expense.category === categoryFilter;
    const searchableText = `${expense.name} ${expense.category} ${expense.note || ""}`.toLowerCase();
    return matchesCategory && searchableText.includes(query.trim().toLowerCase());
  }), [periodExpenses, categoryFilter, query]);

  const categoryTotals = useMemo(
    () => categories.map(({ name }) => ({
      category: name,
      total: monthlyExpenses
        .filter((expense) => expense.category === name)
        .reduce((sum, expense) => sum + Number(expense.amount), 0),
    })),
    [monthlyExpenses],
  );
  const highestCategory = [...categoryTotals].sort((a, b) => b.total - a.total)[0];

  const saveExpenses = (nextExpenses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextExpenses));
    setExpenses(nextExpenses);
  };

  const addExpense = (expense) => {
    const nextExpense = {
      ...expense,
      id: crypto.randomUUID(),
      amount: Number(expense.amount),
      date: new Date().toISOString(),
    };
    saveExpenses([nextExpense, ...expenses]);
    setShowExpenseDialog(false);
    setNotice("Expense added successfully");
    window.setTimeout(() => setNotice(""), 2800);
  };

  const saveBudget = (nextBudget) => {
    localStorage.setItem(BUDGET_KEY, String(nextBudget));
    setBudget(nextBudget);
    setShowBudgetDialog(false);
    setNotice("Monthly budget updated");
    window.setTimeout(() => setNotice(""), 2800);
  };

  const exportCsv = () => {
    const rows = [
      ["Name", "Category", "Date", "Amount", "Note"],
      ...filteredExpenses.map((expense) => [
        expense.name,
        expense.category,
        new Date(expense.date).toLocaleDateString(),
        expense.amount,
        expense.note || "",
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "pennywise-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const focusTransactions = (category) => {
    setCategoryFilter(category);
    document.getElementById("transactions")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 lg:flex">
      <DashboardSidebar />
      <main id="overview" className="min-w-0 flex-1">
        <DashboardHeader />
        <div className="mx-auto w-full max-w-[1500px] px-4 pb-8 pt-7 sm:px-6 lg:px-10 lg:pt-10">
          <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Your money, in good shape</p>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                A little more clarity. A lot more <span className="font-serif italic text-indigo-600">possibility.</span>
              </h1>
              <p className="mt-3 text-sm text-slate-500 sm:text-base">Here’s the story your spending is telling this month.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowExpenseDialog(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              <span className="text-lg leading-none">+</span> Add expense
            </button>
          </section>

          <MetricCards
            availableBalance={Math.max(savings, 0)}
            monthlyTotal={monthlyTotal}
            previousTotal={previousTotal}
            savings={savings}
            budget={budget}
            budgetPercent={budgetPercent}
          />

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
            <SpendingChart expenses={expenses} period={period} onPeriodChange={setPeriod} />
            <BudgetCard
              monthlyTotal={monthlyTotal}
              remaining={remaining}
              budget={budget}
              budgetPercent={budgetPercent}
              onEdit={() => setShowBudgetDialog(true)}
            />
          </section>

          <section className="mt-6 grid scroll-mt-6 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
            <TransactionsPanel
              expenses={filteredExpenses}
              query={query}
              onQueryChange={setQuery}
              categoryFilter={categoryFilter}
              categories={categoryOptions}
              onCategoryChange={setCategoryFilter}
              onExport={exportCsv}
              onClearFilters={() => {
                setQuery("");
                setCategoryFilter("All categories");
              }}
            />
            <CategoriesPanel
              categoryTotals={categoryTotals}
              monthlyTotal={monthlyTotal}
              highestCategory={highestCategory}
              onSelectCategory={focusTransactions}
            />
          </section>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-5 text-xs text-slate-400">
            <span>Made for a clearer money day.</span>
            <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" />Your data is saved on this device</span>
          </footer>
        </div>
      </main>

      {showExpenseDialog && <ExpenseDialog onClose={() => setShowExpenseDialog(false)} onSave={addExpense} />}
      {showBudgetDialog && <BudgetDialog budget={budget} onClose={() => setShowBudgetDialog(false)} onSave={saveBudget} />}
      {notice && (
        <div role="status" className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-xl">
          <span className="mr-2 text-emerald-300">✓</span>{notice}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
