import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";

function ExpenseAdviser() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async (event) => {
    event.preventDefault();
    const prompt = question.trim();
    if (!prompt || loading) return;
    setMessages((current) => [...current, { role: "user", content: prompt }]);
    setQuestion("");
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/insights/chat", { question: prompt });
      setMessages((current) => [...current, {
        role: "assistant",
        content: data.answer,
        sources: data.sources || [],
      }]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reach your expense adviser.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article id="adviser" className="scroll-mt-24 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Sparkles size={18} /></span>
        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">Your AI money companion</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Ask about your spending</h2><p className="mt-1 text-sm text-slate-500">Answers use your expense history and practical financial guidance.</p></div>
      </div>
      <div aria-live="polite" className="mt-5 max-h-80 space-y-3 overflow-y-auto">
        {messages.length === 0 && <p className="rounded-xl bg-indigo-50/70 px-4 py-3 text-sm leading-6 text-slate-600">Try asking “What category did I spend the most on this month?” or “How can I make my budget more realistic?”</p>}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`rounded-xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-8 bg-slate-100 text-slate-700" : "mr-4 bg-indigo-50/70 text-slate-700"}`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.sources?.length > 0 && <p className="mt-2 border-t border-indigo-100 pt-2 text-xs text-slate-500">Guidance: {message.sources.join(" · ")}</p>}
          </div>
        ))}
        {loading && <p className="mr-4 rounded-xl bg-indigo-50/70 px-4 py-3 text-sm text-slate-500">Looking at your recent spending…</p>}
      </div>
      <form onSubmit={ask} className="mt-4 flex gap-2">
        <label className="sr-only" htmlFor="adviser-question">Ask a question about your expenses</label>
        <input id="adviser-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={500} placeholder="Ask a question about your spending…" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        <button type="submit" disabled={!question.trim() || loading} aria-label="Send question" className="flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-4 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} /></button>
      </form>
      <p className="mt-2 text-[11px] leading-5 text-slate-400">Educational guidance, not financial or investment advice. Your questions are sent securely to Gemini.</p>
    </article>
  );
}

export default ExpenseAdviser;
