import { CarFront, Film, Home, ShoppingBag, Utensils } from "lucide-react";

export const categories = [
  { name: "Food", icon: Utensils, tone: "orange" },
  { name: "Transport", icon: CarFront, tone: "sky" },
  { name: "Shopping", icon: ShoppingBag, tone: "violet" },
  { name: "Bills", icon: Home, tone: "emerald" },
  { name: "Entertainment", icon: Film, tone: "amber" },
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
};

export const currency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const today = new Date();
const dateString = (offset = 0) => {
  const date = new Date(today);
  date.setDate(date.getDate() - offset);
  return date.toISOString();
};

export const starterExpenses = [
  { id: "seed-1", name: "Sunday Market", category: "Food", date: dateString(0), amount: 42.8, note: "Weekly groceries" },
  { id: "seed-2", name: "Metro card top-up", category: "Transport", date: dateString(0), amount: 25, note: "Commute" },
  { id: "seed-3", name: "Studio North", category: "Bills", date: dateString(1), amount: 68, note: "Monthly subscription" },
  { id: "seed-4", name: "Good Day Coffee", category: "Food", date: dateString(1), amount: 8.5, note: "Coffee with Maya" },
  { id: "seed-5", name: "Field Notes Store", category: "Shopping", date: dateString(2), amount: 34.2, note: "Desk supplies" },
  { id: "seed-6", name: "Little Cinema", category: "Entertainment", date: dateString(3), amount: 18, note: "Friday film" },
  { id: "seed-7", name: "Green Basket", category: "Food", date: dateString(4), amount: 56.4, note: "Groceries" },
  { id: "seed-8", name: "Ride share", category: "Transport", date: dateString(5), amount: 16.75, note: "Airport ride" },
];
