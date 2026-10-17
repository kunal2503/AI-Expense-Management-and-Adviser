import { useEffect, useState } from "react";
import { X } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

function BudgetDialog({ budget, onClose, onSave }) {
  const [draft, setDraft] = useState(budget?.totalBudget ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = Number(draft);
    if (!Number.isFinite(value) || value <= 0) return;
    setSaving(true);
    try {
      await onSave(value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="budget-dialog-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">A plan that fits you</p><h2 id="budget-dialog-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Set monthly budget</h2></div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block text-xs font-semibold text-slate-600">Monthly spending limit
            <input type="number" min="0.01" step="0.01" value={draft} onChange={(event) => setDraft(event.target.value)} className={inputClass} required />
          </label>
          <p className="mt-2 text-xs leading-5 text-slate-400">Your budget helps put this month’s spending in context.</p>
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-wait disabled:opacity-60">{saving ? "Saving…" : "Save budget"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default BudgetDialog;
