const MAX_LEVEL_ICON = 15;
// Each star tier covers this many levels: 1–3 → tier 1, 4–6 → tier 2, … 13–15 → tier 5.
const LEVELS_PER_TIER = 3;

export function levelIconSrc(level) {
  const numericLevel = Number(level) || 1;
  const safeLevel = Math.min(MAX_LEVEL_ICON, Math.max(1, numericLevel));
  const tier = Math.ceil(safeLevel / LEVELS_PER_TIER);

  return `${import.meta.env.BASE_URL}level-stars/star-tier-${tier}.png`;
}
