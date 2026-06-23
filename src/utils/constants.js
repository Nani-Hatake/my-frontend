export const STAGES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
export const PRIORITIES = ["Low", "Medium", "High"];

export const STAGE_STYLES = {
  New: "bg-slate-100 text-ink-700",
  Contacted: "bg-blue-50 text-blue-700",
  Qualified: "bg-violet-50 text-violet-700",
  "Proposal Sent": "bg-amber-50 text-amber-700",
  Won: "bg-emerald-50 text-emerald-700",
  Lost: "bg-red-50 text-red-700",
};

export const PRIORITY_STYLES = {
  Low: "bg-slate-100 text-ink-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700",
};

export const formatCurrency = (value) => {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// HTML date inputs need YYYY-MM-DD
export const toDateInputValue = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};
