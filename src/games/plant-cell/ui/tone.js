// Shared tone vocabulary for the read-outs. Kept out of CellStats.jsx so that
// file only exports components.

export const TONE_COLOR = {
  good: 'var(--pc-good)',
  info: 'var(--pc-teal)',
  warn: 'var(--pc-warn)',
  bad: 'var(--pc-bad)',
  normal: 'var(--pc-ink-2)',
};

export function toneForValue(value, { low = 30, high = 70 } = {}) {
  if (value < low) return 'bad';
  if (value < high) return 'warn';
  return 'good';
}
