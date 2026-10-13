import { useMemo, useState } from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ExpenseDialog from "../components/dashboard/ExpenseDialog"


function Dashboard() {
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);

  const addExpense = (expense) => {

  }

  const handleExpenseDialog = () => {
    console.log(showExpenseDialog)
    setShowExpenseDialog(!showExpenseDialog);
  }
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
              onClick={handleExpenseDialog}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              <span className="text-lg leading-none">+</span> Add expense
            </button>
          </section>
          <ExpenseDialog onClose={handleExpenseDialog} onSave={addExpense} />
          {/* <MetricCards
            availableBalance={Math.max(savings, 0)}
            monthlyTotal={monthlyTotal}
            previousTotal={previousTotal}
            savings={savings}
            budget={budget}
            budgetPercent={budgetPercent}
          /> */}

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
            {/* <SpendingChart expenses={} period={} onPeriodChange={} />
            <BudgetCard
              monthlyTotal={}
              remaining={}
              budget={}
              budgetPercent={}
              onEdit={() => setShowBudgetDialog(true)}
            /> */}
          </section>

          <section className="mt-6 grid scroll-mt-6 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
            {/* <TransactionsPanel */}
              
            {/* /> */}
            {/* <CategoriesPanel */}
              
            {/* /> */}
          </section>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-5 text-xs text-slate-400">
            <span>Made for a clearer money day.</span>
            <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" />Your data is saved on this device</span>
          </footer>
        </div>
      </main>

      {/* {showExpenseDialog && <ExpenseDialog onClose={() => setShowExpenseDialog(false)} onSave={addExpense} />} */}
      {/* {showBudgetDialog && <BudgetDialog budget={budget} onClose={() => setShowBudgetDialog(false)} onSave={saveBudget} />} */}
      {/* {notice && ( */}
        {/* <div role="status" className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-xl"> */}
          {/* <span className="mr-2 text-emerald-300">✓</span>{notice} */}
        {/* </div> */}
      {/* )} */}
    </div>
  );
}

export default Dashboard;
