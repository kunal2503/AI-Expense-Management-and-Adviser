import { useState } from "react";


const initialExpenses = [
    { name: "Whole Foods Market", category: "Groceries", date: "Today, 10:24 AM", amount: 84.32 },
    { name: "City Metro", category: "Transport", date: "Yesterday, 8:10 AM", amount: 24.5 },
    { name: "Netflix", category: "Entertainment", date: "Mar 18, 2026", amount: 15.99 },
    { name: "Northside Cafe", category: "Dining", date: "Mar 17, 2026", amount: 12.75 },
];

const categoryStyles = {
    Groceries: "bg-emerald-100 text-emerald-700",
    Transport: "bg-sky-100 text-sky-700",
    Entertainment: "bg-rose-100 text-rose-700",
    Dining: "bg-amber-100 text-amber-700",
};

const Dashboard = () => {
    const [expenses, setExpenses] = useState(initialExpenses);
    const [form, setForm] = useState({ name: "", amount: "", category: "Groceries" });
    const [showForm, setShowForm] = useState(false);
    const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.name || !form.amount) return;
        setExpenses([{ ...form, date: "Just now", amount: Number(form.amount) }, ...expenses]);
        setForm({ name: "", amount: "", category: "Groceries" });
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-[#f7f9fc] font-sans text-[#172033]">
            <aside className="fixed hidden h-screen w-64 flex-col border-r border-[#e7ebf0] bg-white px-5 py-7 lg:flex">
                <div className="mb-12 flex items-center gap-3 px-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#123b34] text-lg font-bold text-[#d8f36b]">P</div><span className="text-xl font-bold tracking-tight">Pennywise</span></div>
                <nav className="space-y-2 text-sm font-semibold"><a className="flex items-center gap-3 rounded-xl bg-[#edf7e1] px-4 py-3 text-[#315b24]" href="/dashboard">▦ <span>Overview</span></a><a className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#788394] hover:bg-[#f5f7f9]" href="#transactions">↕ <span>Transactions</span></a><a className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#788394] hover:bg-[#f5f7f9]" href="#budget">◷ <span>Budgets</span></a><a className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#788394] hover:bg-[#f5f7f9]" href="#insights">✦ <span>Insights</span></a></nav>
                <div className="mt-auto rounded-2xl bg-[#123b34] p-5 text-white"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#b8d79a]">Monthly goal</p><p className="text-sm leading-5 text-[#d8e5df]">You are on track to save more this month.</p><div className="mt-4 h-1.5 rounded-full bg-white/20"><div className="h-full w-3/4 rounded-full bg-[#d8f36b]" /></div><p className="mt-2 text-xs text-[#b8c9c1]">75% of your savings goal</p></div>
            </aside>
            <main className="lg:ml-64"><header className="flex items-center justify-between border-b border-[#e7ebf0] bg-white px-6 py-5 md:px-10"><div><p className="text-sm text-[#8a94a6]">Tuesday, March 24, 2026</p><h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Good morning, Alex</h1></div><button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d8f36b] font-bold text-[#315b24]">AM</button></header>
                <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-10">
                    <section className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-[#123b34] p-6 text-white shadow-sm md:col-span-2"><p className="text-sm text-[#b8c9c1]">Total balance</p><p className="mt-3 text-4xl font-bold tracking-tight">$4,268.50</p><div className="mt-5 flex items-center gap-2 text-sm text-[#d8f36b]"><span>↑ 8.4%</span><span className="text-[#b8c9c1]">from last month</span></div></div><div className="rounded-2xl border border-[#e7ebf0] bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-[#788394]">Spent this month</p><p className="mt-3 text-3xl font-bold">${totalSpent.toFixed(2)}</p><div className="mt-5 h-2 rounded-full bg-[#edf0f2]"><div className="h-full w-[62%] rounded-full bg-[#e7a74d]" /></div><p className="mt-2 text-xs text-[#8a94a6]">62% of $1,500 monthly budget</p></div></section>
                    <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]"><div className="rounded-2xl border border-[#e7ebf0] bg-white p-6 shadow-sm" id="insights"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Spending overview</h2><p className="mt-1 text-sm text-[#8a94a6]">Your expenses over the last 7 days</p></div><select className="rounded-lg border border-[#e1e6eb] bg-white px-3 py-2 text-sm font-semibold text-[#536071]"><option>This week</option><option>This month</option></select></div><div className="mt-8 flex h-48 items-end justify-between gap-3 border-b border-[#edf0f2] px-2">{[{ day: "Mon", value: "45%" }, { day: "Tue", value: "66%" }, { day: "Wed", value: "34%" }, { day: "Thu", value: "82%" }, { day: "Fri", value: "55%" }, { day: "Sat", value: "92%" }, { day: "Sun", value: "28%" }].map((item, index) => <div className="flex h-full flex-1 flex-col items-center justify-end gap-3" key={item.day}><div className={`w-full max-w-10 rounded-t-md ${index === 5 ? "bg-[#123b34]" : "bg-[#d8f36b]"}`} style={{ height: item.value }} /><span className="mb-[-26px] text-xs text-[#8a94a6]">{item.day}</span></div>)}</div></div><div className="rounded-2xl border border-[#e7ebf0] bg-white p-6 shadow-sm" id="budget"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Budget status</h2><button className="text-sm font-semibold text-[#315b24]">Edit</button></div><p className="mt-1 text-sm text-[#8a94a6]">March 2026</p><div className="mt-8 flex items-center justify-center"><div className="flex h-40 w-40 items-center justify-center rounded-full" style={{ background: "conic-gradient(#123b34 0 62%, #e8edf0 62% 100%)" }}><div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white"><span className="text-2xl font-bold">62%</span><span className="text-xs text-[#8a94a6]">used</span></div></div></div><div className="mt-7 flex justify-between text-sm"><span className="text-[#8a94a6]">Remaining</span><strong>$570.00</strong></div></div></section>
                    <section className="rounded-2xl border border-[#e7ebf0] bg-white p-6 shadow-sm" id="transactions"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-lg font-bold">Recent transactions</h2><p className="mt-1 text-sm text-[#8a94a6]">Keep an eye on where your money goes.</p></div><button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-[#123b34] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1c5248]">+ Add expense</button></div>{showForm && <form onSubmit={handleSubmit} className="mt-5 grid gap-3 rounded-xl bg-[#f7f9fc] p-4 sm:grid-cols-[1fr_130px_150px_auto]"><input className="rounded-lg border border-[#dfe5e9] bg-white px-3 py-2.5 text-sm outline-none" placeholder="Expense name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><input className="rounded-lg border border-[#dfe5e9] bg-white px-3 py-2.5 text-sm outline-none" type="number" min="0" step="0.01" placeholder="Amount" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required /><select className="rounded-lg border border-[#dfe5e9] bg-white px-3 py-2.5 text-sm outline-none" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Groceries</option><option>Transport</option><option>Entertainment</option><option>Dining</option></select><button className="rounded-lg bg-[#d8f36b] px-4 py-2.5 text-sm font-bold text-[#315b24]" type="submit">Save</button></form>}<div className="mt-6 divide-y divide-[#edf0f2]">{expenses.map((expense) => <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" key={`${expense.name}-${expense.date}`}><div className="flex min-w-0 items-center gap-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${categoryStyles[expense.category]}`}>{expense.category.charAt(0)}</div><div className="min-w-0"><p className="truncate text-sm font-bold">{expense.name}</p><p className="mt-1 text-xs text-[#8a94a6]">{expense.category} · {expense.date}</p></div></div><p className="shrink-0 text-sm font-bold">-${expense.amount.toFixed(2)}</p></div>)}</div></section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;