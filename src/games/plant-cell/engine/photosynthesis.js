// Level 1 model: sunlight + water + carbon dioxide → glucose + oxygen.
//
// The reaction runs at the rate of whichever raw material is in shortest
// supply (the limiting factor), which is the whole point of the level. Pure
// functions, so the screen only has to draw what comes back.

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Above this much water in the cytoplasm, water is no longer what holds
// photosynthesis back.
const WATER_SATURATION = 60;

export const LIMITING_LABEL = {
  light: 'Sunlight',
  water: 'Water',
  co2: 'Carbon dioxide',
  none: 'Nothing',
};

export function createPhotosynthesisState(sim) {
  return {
    elapsed: 0,
    soil: sim.soilStart,
    cellWater: sim.cellWaterStart,
    glucose: sim.glucoseStart,
    health: sim.healthStart,
    minHealth: sim.healthStart,
    oxygen: 0,
    rate: 0,
    limiting: 'light',
    waterIn: 0,
    dead: false,
  };
}

export function stepPhotosynthesis(state, controls, sim, dt) {
  const light = controls.light / 100;
  const co2 = controls.co2 / 100;
  const uptake = controls.water / 100;

  // Roots can only draw what the soil still holds; the taper keeps the last
  // drops from cutting off in a single frame.
  const soilFactor = clamp(state.soil / 12, 0, 1);
  const waterIn = uptake * soilFactor * sim.uptakePerSec * dt;
  const soil = clamp(
    state.soil - uptake * soilFactor * sim.soilDrainPerSec * dt + sim.soilRefillPerSec * dt,
    0,
    100,
  );

  const waterFactor = clamp(state.cellWater / WATER_SATURATION, 0, 1);
  const rate = Math.min(light, waterFactor, co2);
  const limiting = rate >= 0.999
    ? 'none'
    : rate === light ? 'light' : rate === waterFactor ? 'water' : 'co2';

  // Open stomata and strong light both cost water vapour.
  const lost = (controls.light * sim.transpirationLight + controls.co2 * sim.transpirationStomata) * dt;
  const usedByReaction = rate * sim.photosynthesisWaterPerSec * dt;
  const cellWater = clamp(state.cellWater + waterIn - lost - usedByReaction, 0, 100);

  const produced = rate * sim.productionPerSec * dt;
  const demanded = sim.demandPerSec * dt;
  let glucose = state.glucose + produced - demanded;
  let health = state.health;

  if (glucose < 0) {
    // The store ran dry, so the shortfall comes straight out of the cell.
    health -= -glucose * (sim.deficitHealthPerSec / sim.demandPerSec);
    glucose = 0;
  } else if (glucose > 20 && produced >= demanded) {
    health += sim.regenHealthPerSec * dt;
  }

  glucose = clamp(glucose, 0, 100);
  health = clamp(health, 0, 100);

  return {
    elapsed: state.elapsed + dt,
    soil,
    cellWater,
    glucose,
    health,
    minHealth: Math.min(state.minHealth, health),
    oxygen: state.oxygen + rate * sim.oxygenPerSec * dt,
    rate,
    limiting,
    waterIn: waterIn / Math.max(dt, 0.0001),
    dead: health <= 0,
  };
}

// Short, honest coaching line for the current reading.
export function photosynthesisAdvice(state, controls) {
  if (state.rate < 0.15) {
    return { tone: 'bad', text: `Photosynthesis has almost stopped. ${LIMITING_LABEL[state.limiting]} is what is holding it back.` };
  }
  if (state.soil < 15 && controls.water > 60) {
    return { tone: 'warn', text: 'The soil around the roots is nearly dry. Ease off the uptake and let it refill.' };
  }
  if (state.cellWater < 25) {
    return { tone: 'warn', text: 'The cell is drying out — water vapour is escaping through the open stomata.' };
  }
  if (state.limiting !== 'none') {
    return { tone: 'info', text: `Running at ${Math.round(state.rate * 100)}%. ${LIMITING_LABEL[state.limiting]} is the limiting factor.` };
  }
  return { tone: 'good', text: 'All three raw materials are plentiful — photosynthesis is running flat out.' };
}
