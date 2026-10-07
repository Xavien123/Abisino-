// lib/utils.js
export function formatAC(units) {
  if (!Number.isInteger(units)) return "0.00 AC";
  // Wandelt 200 Units in "2.00 AC" um
  return (units / 100).toFixed(2) + " AC";
}
