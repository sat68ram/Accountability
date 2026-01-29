export function formatCurrency(value) {
  if (value === null || value === undefined || value === "--") return "--";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "--";
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

export function formatNumber(value) {
  if (value === null || value === undefined || value === "--") return "--";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "--";
  return num.toLocaleString();
}
