import { SUBSTANCES } from '../data/substances';

export function determineState(substanceId, tempC, pressureAtm) {
  const substance = SUBSTANCES[substanceId];
  if (!substance) return 'solid';

  // CO₂ sublimes at ≤5 atm — no liquid phase at standard/moderate pressure
  if (substanceId === 'co2' && pressureAtm <= 5) {
    return tempC < substance.meltingPoint ? 'solid' : 'gas';
  }

  // Each atm above 1 raises the effective boiling point by 10°C (simplified model)
  const effectiveBoilingPoint = substance.boilingPoint + (pressureAtm - 1) * 10;

  if (tempC < substance.meltingPoint) return 'solid';
  if (tempC > effectiveBoilingPoint) return 'gas';
  return 'liquid';
}
