import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { categories } from "./dashboardData";

function ExpenseDialog({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "Food",
    note: "",
  });
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || Number(form.amount) <= 0) return;
    onSave({ ...form, name: form.name.trim(), note: form.note.trim() });
  };
  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-dialog-title"
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
              A little note to yourself
            </p>
            <h2
              id="expense-dialog-title"
              className="mt-1 text-xl font-semibold tracking-tight text-slate-900"
            >
              Add an expense
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep track of where your money goes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-slate-600">
            What was it for?
            <input
              autoFocus
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className={inputClass}
              placeholder="e.g. Lunch with Sam"
              maxLength={70}
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-slate-600">
              Amount
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(event) =>
                  setForm({ ...form, amount: event.target.value })
                }
                className={inputClass}
                placeholder="0.00"
                required
              />
            </label>
            <label className="block text-xs font-semibold text-slate-600">
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                className={inputClass}
              >
                {categories.map(({ name }) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-xs font-semibold text-slate-600">
            A note <span className="font-normal text-slate-400">Optional</span>
            <input
              value={form.note}
              onChange={(event) =>
                setForm({ ...form, note: event.target.value })
              }
              className={inputClass}
              placeholder="Add a detail to remember"
              maxLength={100}
            />
          </label>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              <Plus size={16} />
              Save expense
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ExpenseDialog;
