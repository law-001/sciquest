// Level 2 model: osmosis across the cell membrane, buffered by the vacuole.
//
// Water moves from where it is more concentrated to where it is less
// concentrated. Here that is decided by the difference between the solute
// (salt) inside the cell and outside it — the membrane only controls how fast
// it happens, never which way it goes.

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// A membrane is never completely closed to water: some always crosses by
// simple diffusion even with every channel shut.
const BASE_PERMEABILITY = 0.15;

export function createOsmosisState(sim) {
  return {
    elapsed: 0,
    cellWater: sim.cellWaterStart,
    vacuole: sim.vacuoleStart,
    health: sim.healthStart,
    bandTime: 0,
    flow: 0,
    turgor: sim.cellWaterStart * 0.6 + sim.vacuoleStart * 0.4,
    dead: false,
  };
}

export function currentWeather(weather, elapsed) {
  let active = weather[0];
  for (const entry of weather) {
    if (elapsed >= entry.at) active = entry;
  }
  return active;
}

export function stepOsmosis(state, controls, level, dt) {
  const { sim, weather } = level;
  const env = currentWeather(weather, state.elapsed);

  const permeability = BASE_PERMEABILITY + (1 - BASE_PERMEABILITY) * (controls.channels / 100);
  const gradient = (sim.insideSolute - env.solute) / 100;
  // Water can only flow in as fast as the soil can supply it.
  const supply = gradient > 0 ? env.water / 100 : 1;
  const flow = gradient * permeability * sim.flowPerSec * supply;

  // Dry air pulls water out of the cell whatever the solutes are doing.
  const evaporation = ((100 - env.water) / 100) * 0.9;

  let cellWater = state.cellWater + (flow - sim.baseUsagePerSec - evaporation) * dt;
  let vacuole = state.vacuole;

  if (controls.transfer === 'store') {
    const moved = Math.min(sim.transferPerSec * dt, Math.max(0, cellWater - 15), 100 - vacuole);
    cellWater -= moved;
    vacuole += moved;
  } else if (controls.transfer === 'release') {
    const moved = Math.min(sim.transferPerSec * dt, vacuole, 100 - cellWater);
    cellWater += moved;
    vacuole -= moved;
  }

  // The cell wall is what stops a plant cell bursting when water keeps coming
  // in — the clamp is the wall doing its job, not a rule of osmosis.
  cellWater = clamp(cellWater, 0, 100);
  vacuole = clamp(vacuole, 0, 100);

  let health = state.health;
  if (cellWater < sim.dryThreshold) {
    health -= (sim.dryThreshold - cellWater) * sim.dryHealthPerSec * dt;
  } else {
    health += sim.recoverHealthPerSec * dt;
  }
  health = clamp(health, 0, 100);

  const turgor = cellWater * 0.6 + vacuole * 0.4;
  const inBand = turgor >= sim.bandLow && turgor <= sim.bandHigh;

  return {
    elapsed: state.elapsed + dt,
    cellWater,
    vacuole,
    health,
    bandTime: state.bandTime + (inBand ? dt : 0),
    flow,
    turgor,
    dead: health <= 0,
  };
}

export function osmosisStatus(state, level, env) {
  const { sim } = level;
  if (state.cellWater < sim.dryThreshold) {
    return { tone: 'bad', text: 'The cytoplasm is drying out and the cell is wilting. Release water from the vacuole, and close the channels if salt is pulling water out.' };
  }
  if (state.turgor >= sim.wallStrainAt) {
    return { tone: 'warn', text: 'Completely turgid. The cell wall is holding — an animal cell would have burst — but there is nowhere left to put more water.' };
  }
  if (state.turgor > sim.bandHigh) {
    return { tone: 'warn', text: 'Very full. Store some of it in the vacuole so you have a reserve later.' };
  }
  if (state.turgor < sim.bandLow) {
    return { tone: 'warn', text: 'Turgor is dropping — the cell is going limp.' };
  }
  if (env.solute > sim.insideSolute + 20) {
    return { tone: 'info', text: 'Salt is more concentrated outside, so water is leaving the cell. Narrow the channels to slow it down.' };
  }
  if (env.solute < sim.insideSolute - 10) {
    return { tone: 'info', text: 'Water is more concentrated outside, so it is moving in. Good time to fill the vacuole.' };
  }
  return { tone: 'good', text: 'Water balance is healthy and the cell is firm.' };
}

export function flowDirection(flow) {
  if (flow > 0.4) return 'in';
  if (flow < -0.4) return 'out';
  return 'still';
}
