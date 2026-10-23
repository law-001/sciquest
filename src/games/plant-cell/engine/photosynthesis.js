// Level 1 model, kept to the lessons: chloroplasts turn sunlight, water and
// carbon dioxide into glucose and oxygen, and the cell uses glucose for energy.
// Photosynthesis only runs as fast as the ingredient there is least of, so
// taking any one away stops it. Pure functions, so the screen only has to draw
// what comes back.

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const INPUT_LABEL = {
  light: 'sunlight',
  water: 'water',
  co2: 'carbon dioxide',
};

export function createPhotosynthesisState(sim) {
  return {
    glucose: sim.glucoseStart,
    health: sim.healthStart,
    minHealth: sim.healthStart,
    oxygen: 0,
    rate: 0,
    lowest: 'light',
    dead: false,
  };
}

export function stepPhotosynthesis(state, controls, sim, dt) {
  const inputs = { light: controls.light / 100, water: controls.water / 100, co2: controls.co2 / 100 };
  const lowest = Object.keys(inputs).reduce((a, b) => (inputs[b] < inputs[a] ? b : a));
  const rate = inputs[lowest];

  const produced = rate * sim.productionPerSec * dt;
  const used = sim.demandPerSec * dt;
  let glucose = state.glucose + produced - used;
  let health = state.health;

  if (glucose < 0) {
    // The store ran dry, so the shortfall comes straight out of the cell.
    health -= -glucose * (sim.deficitHealthPerSec / sim.demandPerSec);
    glucose = 0;
  } else if (glucose > 20 && produced >= used) {
    health += sim.regenHealthPerSec * dt;
  }

  glucose = clamp(glucose, 0, 100);
  health = clamp(health, 0, 100);

  return {
    glucose,
    health,
    minHealth: Math.min(state.minHealth, health),
    oxygen: state.oxygen + rate * sim.oxygenPerSec * dt,
    rate,
    lowest,
    dead: health <= 0,
  };
}

// One plain sentence about what is happening right now.
export function photosynthesisAdvice(state) {
  const lowest = INPUT_LABEL[state.lowest];
  if (state.rate < 0.15) {
    return { tone: 'bad', text: `Photosynthesis has almost stopped — there is not enough ${lowest}. Chloroplasts need sunlight, water and carbon dioxide.` };
  }
  if (state.glucose < 15) {
    return { tone: 'warn', text: 'The glucose store is nearly empty. The cell needs glucose for energy.' };
  }
  if (state.rate < 0.9) {
    return { tone: 'info', text: `Making glucose at ${Math.round(state.rate * 100)}%. More ${lowest} would speed it up.` };
  }
  return { tone: 'good', text: 'Plenty of sunlight, water and carbon dioxide — the chloroplasts are making lots of glucose and oxygen.' };
}
