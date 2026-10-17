import {
  CarFront,
  Film,
  GraduationCap,
  HeartPulse,
  House,
  Lightbulb,
  Plane,
  ShoppingBag,
  Utensils,
} from "lucide-react";

export const categories = [
  { name: "Food", icon: Utensils, tone: "orange" },
  { name: "Transportation", icon: CarFront, tone: "sky" },
  { name: "Shopping", icon: ShoppingBag, tone: "violet" },
  { name: "Entertainment", icon: Film, tone: "amber" },
  { name: "Healthcare", icon: HeartPulse, tone: "rose" },
  { name: "Education", icon: GraduationCap, tone: "blue" },
  { name: "Utilities", icon: Lightbulb, tone: "emerald" },
  { name: "Travel", icon: Plane, tone: "cyan" },
  { name: "Other", icon: House, tone: "slate" },
];

export const categoryStyles = {
  orange: {
    icon: "bg-orange-50 text-orange-600",
    badge: "bg-orange-50 text-orange-700",
    bar: "bg-orange-400",
  },
  sky: {
    icon: "bg-sky-50 text-sky-600",
    badge: "bg-sky-50 text-sky-700",
    bar: "bg-sky-400",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    badge: "bg-violet-50 text-violet-700",
    bar: "bg-violet-400",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-400",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    badge: "bg-amber-50 text-amber-700",
    bar: "bg-amber-400",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600",
    badge: "bg-rose-50 text-rose-700",
    bar: "bg-rose-400",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600",
    badge: "bg-blue-50 text-blue-700",
    bar: "bg-blue-400",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    badge: "bg-cyan-50 text-cyan-700",
    bar: "bg-cyan-400",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    badge: "bg-slate-100 text-slate-700",
    bar: "bg-slate-400",
  },
};

export const currency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
