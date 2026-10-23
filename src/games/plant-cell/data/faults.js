// Level 3 case file. Each fault is one broken organelle plus the readings the
// cell gives off while it is broken: the monitors that are always on screen
// (`symptoms`) and the result of every test the player can run (`results`).
//
// A fault is identified by the whole pattern, not by one reading — every fault
// leaves at least two tests looking perfectly normal. Every test and result is
// worded from the Week 12 and 13 lessons.

export const TESTS = [
  {
    id: 'light',
    label: 'Shine bright light on the cell',
    hint: 'How much glucose do the chloroplasts make?',
    measures: 'Glucose production',
  },
  {
    id: 'energy',
    label: 'Give the cell glucose and measure its energy',
    hint: 'Can the mitochondria get energy out of glucose?',
    measures: 'Energy from glucose',
  },
  {
    id: 'freshWater',
    label: 'Put the cell in pure water',
    hint: 'Water should move in and the cell should firm up.',
    measures: 'Water entering',
  },
  {
    id: 'salt',
    label: 'Put the cell in salty water',
    hint: 'Water should leave slowly and steadily.',
    measures: 'Water leaving',
  },
  {
    id: 'vacuoleWatch',
    label: 'Watch the vacuole for 10 seconds',
    hint: 'A healthy vacuole holds what it stores.',
    measures: 'Storage',
  },
  {
    id: 'nucleus',
    label: 'Check the nucleus and its DNA',
    hint: 'The control centre of the cell.',
    measures: 'Control centre',
  },
];

const NORMAL_NUCLEUS = { tone: 'normal', text: 'DNA intact, and the nucleus is controlling the cell as usual.' };

export const FAULTS = [
  {
    id: 'chloroplast',
    organelleId: 'chloroplast',
    title: 'Damaged chloroplast',
    symptoms: {
      glucose: { label: 'Glucose production', value: 'LOW', tone: 'bad' },
      energy: { label: 'Cellular energy', value: 'LOW', tone: 'bad' },
      water: { label: 'Water balance', value: 'NORMAL', tone: 'normal' },
      transport: { label: 'Substances in / out', value: 'NORMAL', tone: 'normal' },
    },
    results: {
      light: { tone: 'bad', text: 'Sunlight, water and carbon dioxide are all there — but almost no glucose is made.' },
      energy: { tone: 'normal', text: 'Given glucose directly, the cell gets energy from it normally. The mitochondria are fine.' },
      freshWater: { tone: 'normal', text: 'Water moves in and the cell firms up, as expected.' },
      salt: { tone: 'normal', text: 'Water leaves slowly and steadily, as expected.' },
      vacuoleWatch: { tone: 'normal', text: 'The vacuole holds its water for the full ten seconds.' },
      nucleus: NORMAL_NUCLEUS,
    },
    reasoning: 'No glucose was made even with sunlight, water and carbon dioxide, while the mitochondria, the vacuole and water movement all tested normal. Only the organelle that makes glucose fits.',
    repairLabel: 'Rebuild the chloroplast',
    repairNote: 'Photosynthesis starts again, and glucose flows to the rest of the cell.',
  },
  {
    id: 'mitochondrion',
    organelleId: 'mitochondrion',
    title: 'Damaged mitochondria',
    symptoms: {
      glucose: { label: 'Glucose production', value: 'NORMAL', tone: 'normal' },
      energy: { label: 'Cellular energy', value: 'LOW', tone: 'bad' },
      water: { label: 'Water balance', value: 'NORMAL', tone: 'normal' },
      transport: { label: 'Substances in / out', value: 'NORMAL', tone: 'normal' },
    },
    results: {
      light: { tone: 'normal', text: 'Glucose is made at the normal rate and is piling up unused.' },
      energy: { tone: 'bad', text: 'Plenty of glucose, but the cell gets almost no energy from it.' },
      freshWater: { tone: 'normal', text: 'Water moves in and the cell firms up, as expected.' },
      salt: { tone: 'normal', text: 'Water leaves slowly and steadily, as expected.' },
      vacuoleWatch: { tone: 'normal', text: 'The vacuole holds its water for the full ten seconds.' },
      nucleus: NORMAL_NUCLEUS,
    },
    reasoning: 'The chloroplasts were making glucose, but the cell could not get energy out of it. Getting energy from glucose is cellular respiration, and that happens in the mitochondria.',
    repairLabel: 'Restore the mitochondria',
    repairNote: 'The mitochondria turn glucose into energy for the cell again.',
  },
  {
    id: 'vacuole',
    organelleId: 'vacuole',
    title: 'Damaged vacuole',
    symptoms: {
      glucose: { label: 'Glucose production', value: 'NORMAL', tone: 'normal' },
      energy: { label: 'Cellular energy', value: 'NORMAL', tone: 'normal' },
      water: { label: 'Water balance', value: 'UNSTABLE', tone: 'bad' },
      transport: { label: 'Substances in / out', value: 'NORMAL', tone: 'normal' },
    },
    results: {
      light: { tone: 'normal', text: 'Glucose is made at the normal rate in bright light.' },
      energy: { tone: 'normal', text: 'The cell gets energy from glucose at the usual rate.' },
      freshWater: { tone: 'warn', text: 'Water comes in at the normal speed, but the cell never firms up — nothing is holding the water.' },
      salt: { tone: 'warn', text: 'Water leaves at the normal speed and the cell goes limp almost at once. There is no water stored.' },
      vacuoleWatch: { tone: 'bad', text: 'Stored water drains away within seconds. The vacuole cannot hold anything.' },
      nucleus: NORMAL_NUCLEUS,
    },
    reasoning: 'Water went in and out at the right speed, so the cell membrane is fine — but nothing inside held onto it. The vacuole, the cell’s water store, has failed.',
    repairLabel: 'Reseal the vacuole',
    repairNote: 'The vacuole holds water again, and turgor pressure keeps the cell firm.',
  },
  {
    id: 'membrane',
    organelleId: 'membrane',
    title: 'Damaged cell membrane',
    symptoms: {
      glucose: { label: 'Glucose production', value: 'NORMAL', tone: 'normal' },
      energy: { label: 'Cellular energy', value: 'NORMAL', tone: 'normal' },
      water: { label: 'Water balance', value: 'UNSTABLE', tone: 'bad' },
      transport: { label: 'Substances in / out', value: 'ABNORMAL', tone: 'bad' },
    },
    results: {
      light: { tone: 'normal', text: 'Glucose is made at the normal rate in bright light.' },
      energy: { tone: 'normal', text: 'The cell gets energy from glucose at the usual rate.' },
      freshWater: { tone: 'bad', text: 'Water floods in far too fast. Nothing is controlling what comes in.' },
      salt: { tone: 'bad', text: 'Water rushes straight back out. Nothing is controlling what goes out.' },
      vacuoleWatch: { tone: 'warn', text: 'The vacuole fills and empties as the water outside changes, but it holds what it is given.' },
      nucleus: NORMAL_NUCLEUS,
    },
    reasoning: 'Water rushed in and out far too fast, even though the vacuole still held what it was given. The cell membrane controls what moves into and out of the cell, and it has failed.',
    repairLabel: 'Patch the cell membrane',
    repairNote: 'The cell membrane controls what moves in and out again.',
  },
];

// Organelles the player can accuse. The healthy ones are here on purpose: a
// diagnosis screen with only the four suspects would give the answer away.
export const SUSPECTS = ['chloroplast', 'mitochondrion', 'vacuole', 'membrane', 'nucleus', 'cellWall'];

export function getFault(id) {
  return FAULTS.find((fault) => fault.id === id) ?? FAULTS[0];
}

// Cases rotate by attempt so a repeat run is a new investigation rather than a
// memory test.
export function pickFault(attempt) {
  return FAULTS[Math.abs(attempt) % FAULTS.length];
}
