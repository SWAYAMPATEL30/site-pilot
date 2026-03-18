// Currency helper: format amounts as Indian Rupees
export function formatINR(amount) {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  const n = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
