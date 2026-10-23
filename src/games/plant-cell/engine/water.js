// Level 2 model, kept to what the lessons teach: pure water fills a cell, and
// salty water or no water empties it. A plant cell's rigid wall stops it
// swelling once full; an animal cell has no wall, so pure water bursts it.

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// `quest` is one prediction round: { cell: 'plant' | 'animal', around, startWater? }.
export function createCellState(quest, sim) {
  const start = quest.startWater ?? (quest.cell === 'plant' ? sim.plantStart : sim.animalStart);
  return { water: start, burst: false };
}

export function stepCell(state, quest, sim, dt) {
  // Capping at 100 is the plant cell wall doing its job.
  const water = clamp(state.water + sim.perSec[quest.around] * dt, sim.minWater, 100);
  return { water, burst: quest.cell === 'animal' && water >= 100 };
}

// What the test showed, once the cell has nothing more to do — null until then.
export function outcomeOf(state, sim) {
  if (state.burst) return 'burst';
  if (state.water >= 100) return 'firm';
  if (state.water <= sim.minWater) return 'shrink';
  return null;
}
