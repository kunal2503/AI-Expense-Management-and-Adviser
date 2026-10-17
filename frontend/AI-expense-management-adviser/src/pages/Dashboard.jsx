import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import BudgetCard from "../components/dashboard/BudgetCard";
import BudgetDialog from "../components/dashboard/BudgetDialog";
import CategoriesPanel from "../components/dashboard/CategoriesPanel";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import ExpenseAdviser from "../components/dashboard/ExpenseAdviser";
import ExpenseDialog from "../components/dashboard/ExpenseDialog";
import MetricCards from "../components/dashboard/MetricCards";
import SpendingChart from "../components/dashboard/SpendingChart";
import TransactionsPanel from "../components/dashboard/TransactionsPanel";
import { categories } from "../components/dashboard/dashboardData";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const mapExpense = (expense) => ({
  ...expense,
  id: expense._id,
  name: expense.description || expense.category,
  note: expense.paymentMethod,
});

function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [user, setUser] = useState(readStoredUser);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [period, setPeriod] = useState("This month");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([
        axiosInstance.get("/expenses"),
        axiosInstance.get("/budget"),
        axiosInstance.get("/auth/me"),
    ])
      .then(([expenseResponse, budgetResponse, userResponse]) => {
        if (!active) return;
        setLoadError("");
        setExpenses(expenseResponse.data.expenses.map(mapExpense));
        setBudget(budgetResponse.data.budget);
        setUser(userResponse.data.user);
        localStorage.setItem("user", JSON.stringify(userResponse.data.user));
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/signin", { replace: true });
          return;
        }
        const message = error.response?.data?.message || "Could not load your dashboard. Check your API connection.";
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [navigate, refreshKey]);

  const refreshDashboard = () => setRefreshKey((current) => current + 1);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthExpenses = useMemo(() => expenses.filter((expense) => {
    const date = new Date(expense.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }), [expenses, currentMonth, currentYear]);
  const lastMonthExpenses = useMemo(() => expenses.filter((expense) => {
    const date = new Date(expense.date);
    const previous = new Date(currentYear, currentMonth - 1, 1);
    return date.getMonth() === previous.getMonth() && date.getFullYear() === previous.getFullYear();
  }), [expenses, currentMonth, currentYear]);
  const monthlyTotal = thisMonthExpenses.reduce((total, expense) => total + Number(expense.amount), 0);
  const previousTotal = lastMonthExpenses.reduce((total, expense) => total + Number(expense.amount), 0);
  const monthlyBudget = Number(budget?.totalBudget || 0);
  const budgetPercent = monthlyBudget > 0 ? (monthlyTotal / monthlyBudget) * 100 : 0;
  const categoryTotals = useMemo(() => categories.map(({ name }) => ({
    category: name,
    total: thisMonthExpenses
      .filter((expense) => expense.category === name)
      .reduce((total, expense) => total + Number(expense.amount), 0),
  })).filter(({ total }) => total > 0), [thisMonthExpenses]);
  const highestCategory = categoryTotals.reduce(
    (highest, item) => item.total > highest.total ? item : highest,
    { category: "", total: 0 },
  );
  const filteredExpenses = useMemo(() => expenses.filter((expense) => {
    const matchesQuery = `${expense.name} ${expense.note} ${expense.category}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return matchesQuery && (categoryFilter === "All categories" || expense.category === categoryFilter);
  }), [expenses, query, categoryFilter]);

  const saveExpense = async (form) => {
    try {
      if (editingExpense) {
        await axiosInstance.put(`/expenses/${editingExpense.id}`, form);
      } else {
        await axiosInstance.post("/expenses", form);
      }
      setShowExpenseDialog(false);
      setEditingExpense(null);
      refreshDashboard();
      toast.success(editingExpense ? "Expense updated" : "Expense added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save this expense.");
    }
  };

  const saveBudget = async (amount) => {
    try {
      await axiosInstance.put("/budget", { totalBudget: amount });
      setShowBudgetDialog(false);
      refreshDashboard();
      toast.success("Monthly budget saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save your budget.");
    }
  };

  const deleteExpense = async (expense) => {
    if (!window.confirm(`Delete "${expense.name}"? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/expenses/${expense.id}`);
      refreshDashboard();
      toast.success("Expense deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete this expense.");
    }
  };

  const exportExpenses = () => {
    const rows = [
      ["Description", "Category", "Amount", "Payment method", "Date"],
      ...filteredExpenses.map((expense) => [
        expense.name,
        expense.category,
        Number(expense.amount).toFixed(2),
        expense.paymentMethod || "",
        new Date(expense.date).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "pennywise-expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin", { replace: true });
  };

  const selectCategory = (category) => {
    setCategoryFilter(category);
    document.getElementById("transactions")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 lg:flex">
      <DashboardSidebar user={user} onLogout={logout} />
      <main id="overview" className="min-w-0 flex-1">
        <DashboardHeader onLogout={logout} />
        <div className="mx-auto w-full max-w-[1500px] px-4 pb-8 pt-7 sm:px-6 lg:px-10 lg:pt-10">
          <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Your money, in good shape</p>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                A little more clarity. A lot more <span className="font-serif italic text-indigo-600">possibility.</span>
              </h1>
              <p className="mt-3 text-sm text-slate-500">Here’s the story your spending is telling this month, {user?.username?.split(" ")[0] || "friend"}.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => setShowBudgetDialog(true)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100">Set budget</button>
              <button type="button" onClick={() => { setEditingExpense(null); setShowExpenseDialog(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200">
                <span className="text-lg leading-none">+</span> Add expense
              </button>
            </div>
          </section>

          {showExpenseDialog && <ExpenseDialog expense={editingExpense} onClose={() => { setShowExpenseDialog(false); setEditingExpense(null); }} onSave={saveExpense} />}
          {showBudgetDialog && <BudgetDialog budget={budget} onClose={() => setShowBudgetDialog(false)} onSave={saveBudget} />}

          {loading ? (
            <div role="status" className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading your dashboard…</div>
          ) : loadError ? (
            <div role="alert" className="rounded-2xl border border-rose-200 bg-white p-6 text-center">
              <p className="text-sm font-semibold text-slate-800">{loadError}</p>
              <button type="button" onClick={() => { setLoadError(""); setLoading(true); refreshDashboard(); }} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Try again</button>
            </div>
          ) : (
            <>
              <MetricCards monthlyTotal={monthlyTotal} previousTotal={previousTotal} budget={monthlyBudget} budgetPercent={budgetPercent} transactionCount={thisMonthExpenses.length} />

              <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
                <SpendingChart expenses={expenses} period={period} onPeriodChange={setPeriod} />
                <BudgetCard monthlyTotal={monthlyTotal} remaining={Math.max(monthlyBudget - monthlyTotal, 0)} budget={monthlyBudget} budgetPercent={budgetPercent} onEdit={() => setShowBudgetDialog(true)} />
              </section>

              <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
                <TransactionsPanel
                  expenses={filteredExpenses}
                  query={query}
                  onQueryChange={setQuery}
                  categoryFilter={categoryFilter}
                  categories={["All categories", ...categories.map(({ name }) => name)]}
                  onCategoryChange={setCategoryFilter}
                  onExport={exportExpenses}
                  onClearFilters={() => { setQuery(""); setCategoryFilter("All categories"); }}
                  onEditExpense={(expense) => { setEditingExpense(expense); setShowExpenseDialog(true); }}
                  onDeleteExpense={deleteExpense}
                />
                <CategoriesPanel categoryTotals={categoryTotals} monthlyTotal={monthlyTotal} highestCategory={highestCategory} onSelectCategory={selectCategory} />
              </section>

              <section className="mt-6">
                <ExpenseAdviser />
              </section>
            </>
          )}

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-5 text-xs text-slate-400">
            <span>Made for a clearer money day.</span>
            <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" />Your expenses are stored securely in your account</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
