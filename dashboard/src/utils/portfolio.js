export function formatINR(value) {
  return `₹${Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export const CHART_COLORS = [
  "#4184f3",
  "#ff5722",
  "#4caf50",
  "#9c27b0",
  "#ff9800",
  "#00bcd4",
  "#e91e63",
  "#795548",
  "#607d8b",
  "#3f51b5",
];
