// Plant Cell: Keep the Cell Alive — level configuration.
//
// Every level is described here (goal, tuning numbers, briefing + debrief text)
// and rendered by its own screen in ../levels. Tuning a level should never mean
// editing a component.

export const LEVELS = [
  {
    id: 'l1',
    number: 1,
    name: 'Power the Cell',
    focus: 'photosynthesis',
    icon: '☀️',
    accent: '#2f9e63',
    unlocksAfter: null,
    goal: 'Feed the chloroplasts sunlight, water and carbon dioxide so the cell never runs out of glucose.',
    objective: 'Keep the cell alive for 30 seconds',
    durationSeconds: 30,
    briefing: {
      title: 'Your plant cell needs energy to survive.',
      lead: 'Chloroplasts run photosynthesis, but only while all three raw materials keep arriving.',
      points: [
        'Sunlight + water + carbon dioxide → glucose + oxygen.',
        'Photosynthesis runs only as fast as the material in shortest supply — that one is the limiting factor.',
        'Opening the stomata lets carbon dioxide in, but water vapour escapes at the same time.',
      ],
      cta: 'Start photosynthesis',
    },
    debrief: {
      title: 'You kept the cell alive by supplying photosynthesis.',
      body: 'Chloroplasts are the site of photosynthesis. They use light energy to turn water and carbon dioxide into glucose, and oxygen is released as a by-product. That glucose is the food store every other organelle depends on.',
      points: [
        'Chloroplast → the organelle where photosynthesis happens.',
        'Photosynthesis → glucose (food) + oxygen (released).',
        'Whichever raw material runs lowest limits the whole reaction.',
      ],
    },
    sim: {
      glucoseStart: 34,
      healthStart: 65,
      soilStart: 80,
      cellWaterStart: 60,
      soilRefillPerSec: 6,
      soilDrainPerSec: 11,
      uptakePerSec: 9,
      transpirationLight: 0.022,
      transpirationStomata: 0.05,
      photosynthesisWaterPerSec: 4,
      productionPerSec: 15,
      demandPerSec: 8,
      deficitHealthPerSec: 9,
      regenHealthPerSec: 3.2,
      oxygenPerSec: 9,
      // Read as: 3 stars if the lowest health reached stayed at or above 55.
      starMinHealth: [0, 1, 30, 55],
    },
  },

  {
    id: 'l2',
    number: 2,
    name: 'Keep It Alive',
    focus: 'osmosis',
    icon: '💧',
    accent: '#2bafa9',
    unlocksAfter: 'l1',
    goal: 'Ride out rain, drought and salty soil by working the membrane channels and banking water in the vacuole.',
    objective: 'Hold the water balance in the healthy band for 55 seconds',
    durationSeconds: 55,
    briefing: {
      title: 'The weather outside is about to change.',
      lead: 'Water crosses the membrane by osmosis — you decide how far the channels open.',
      points: [
        'The cell membrane is the selective barrier: it controls what moves in and out.',
        'The vacuole stores water. Bank some while it rains, spend it during a drought.',
        'The cell wall does not move water — it supports the cell and stops it bursting.',
      ],
      cta: 'Face the weather',
    },
    debrief: {
      title: 'You held the water balance steady.',
      body: 'Osmosis is the movement of water across a selectively permeable membrane, from where water is more concentrated to where it is less concentrated. The membrane controls that movement, the vacuole stores the water, and the cell wall gives the support that keeps a well-watered plant cell firm instead of burst.',
      points: [
        'Cell membrane → selective barrier controlling movement in and out.',
        'Vacuole → stores water and other substances.',
        'Cell wall → support and protection, not water control.',
      ],
    },
    sim: {
      cellWaterStart: 58,
      vacuoleStart: 30,
      healthStart: 100,
      insideSolute: 40,
      flowPerSec: 26,
      baseUsagePerSec: 0.7,
      transferPerSec: 14,
      dryThreshold: 30,
      dryHealthPerSec: 0.32,
      recoverHealthPerSec: 2.2,
      bandLow: 36,
      bandHigh: 88,
      wallStrainAt: 94,
      // Read as: 3 stars if the water balance sat in the healthy band 86% of the time.
      starBandPercent: [0, 45, 68, 86],
    },
    // Weather runs on a clock: each entry takes over at `at` seconds.
    weather: [
      { at: 0, id: 'mild', label: 'Mild morning', solute: 30, water: 62, note: 'Soil water and salt are both moderate.' },
      { at: 11, id: 'rain', label: 'Heavy rain', solute: 8, water: 100, note: 'Fresh water everywhere — water moves into the cell.' },
      { at: 25, id: 'drought', label: 'Drought', solute: 36, water: 8, note: 'The soil is drying out. There is very little water to take in.' },
      { at: 39, id: 'salty', label: 'Salty soil', solute: 88, water: 55, note: 'Salt outside pulls water out of the cell by osmosis.' },
      { at: 50, id: 'mild', label: 'Mild evening', solute: 30, water: 62, note: 'Conditions settle again.' },
    ],
  },

  {
    id: 'l3',
    number: 3,
    name: 'Cell Emergency',
    focus: 'diagnosis',
    icon: '🚨',
    accent: '#d1544f',
    unlocksAfter: 'l2',
    goal: 'One organelle has failed. Run tests, read the evidence, name the culprit and repair it.',
    objective: 'Find the broken organelle and repair the cell',
    durationSeconds: 0,
    briefing: {
      title: 'Something in this cell has stopped working.',
      lead: 'The monitors already show symptoms. Your job is to work out which organelle is behind them.',
      points: [
        'Run tests on the cell — each one reports how a part of the cell is behaving.',
        'A normal reading rules an organelle out. What is normal matters as much as what is not.',
        'Name the organelle only once the evidence fits. A wrong call costs the cell.',
      ],
      cta: 'Open the case',
    },
    debrief: {
      title: 'The cell is working again.',
      body: 'Organelles do not work alone. A fault in one of them shows up as symptoms all over the cell, so the readings that stay normal are as useful as the ones that do not — together they point at the part that actually failed.',
      points: [
        'Chloroplast → photosynthesis. Mitochondria → releasing usable energy from glucose.',
        'Vacuole → storage, especially water. Membrane → controlling what moves in and out.',
        'A problem in one organelle affects the whole cell.',
      ],
    },
    sim: {
      healthStart: 58,
      healthFloor: 20,
      declinePerSec: 0.55,
      testSeconds: 2.2,
      wrongGuessHealth: 8,
      recoverPerSec: 22,
      // Read as: 3 stars with no wrong diagnosis, 2 with one, 1 with two or more.
      starsByWrongGuesses: [3, 2, 1],
    },
  },
];

export function getLevel(id) {
  return LEVELS.find((level) => level.id === id) ?? null;
}

export function isLevelUnlocked(level, completedIds) {
  return !level.unlocksAfter || completedIds.includes(level.unlocksAfter);
}

// Stars come from per-level thresholds in `sim`. The measured value differs by
// level (lowest health, time in band), but the comparison is always the same.
export function starsForValue(thresholds, value) {
  let stars = 0;
  thresholds.forEach((min, index) => {
    if (value >= min) stars = index;
  });
  return stars;
}
