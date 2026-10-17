import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { categories } from "./dashboardData";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const localDate = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

function ExpenseDialog({ expense, onClose, onSave }) {
  const expenseDate = expense?.date ? new Date(expense.date) : new Date();
  expenseDate.setMinutes(expenseDate.getMinutes() - expenseDate.getTimezoneOffset());
  const [form, setForm] = useState({
    description: expense?.description ?? expense?.name ?? "",
    amount: expense?.amount ?? "",
    category: expense?.category ?? "Food",
    paymentMethod: expense?.paymentMethod ?? "Debit Card",
    date: expenseDate.toISOString().slice(0, 10) || localDate(),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, amount: Number(form.amount), date: new Date(`${form.date}T12:00:00`).toISOString() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="expense-dialog-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">A little note to yourself</p>
            <h2 id="expense-dialog-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{expense ? "Edit expense" : "Add an expense"}</h2>
            <p className="mt-1 text-sm text-slate-500">Keep track of where your money goes.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-slate-600">What was it for?
            <input autoFocus name="description" value={form.description} onChange={updateField} className={inputClass} placeholder="e.g. Lunch with Sam" maxLength={100} required />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-slate-600">Amount
              <input name="amount" type="number" min="1" step="0.01" value={form.amount} onChange={updateField} className={inputClass} placeholder="0.00" required />
            </label>
            <label className="block text-xs font-semibold text-slate-600">Category
              <select name="category" value={form.category} onChange={updateField} className={inputClass}>
                {categories.map(({ name }) => <option key={name}>{name}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-slate-600">Payment method
              <select name="paymentMethod" value={form.paymentMethod} onChange={updateField} className={inputClass}>
                {["Cash", "Credit Card", "Debit Card", "UPI"].map((method) => <option key={method}>{method}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-slate-600">Date
              <input name="date" type="date" value={form.date} onChange={updateField} className={inputClass} required />
            </label>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-wait disabled:opacity-60">
              <Plus size={16} />{saving ? "Saving…" : expense ? "Update expense" : "Save expense"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ExpenseDialog;
