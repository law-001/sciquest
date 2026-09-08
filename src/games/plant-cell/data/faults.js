// Level 3 case file. Each fault is one broken organelle plus the readings the
// cell gives off while it is broken: the monitors that are always on screen
// (`symptoms`) and the result of every test the player can run (`results`).
//
// A fault is identified by the whole pattern, not by one reading — every fault
// leaves at least two tests looking perfectly normal.

export const TESTS = [
  {
    id: 'light',
    label: 'Shine bright light on the cell',
    hint: 'How much glucose do the chloroplasts make?',
    measures: 'Glucose production',
  },
  {
    id: 'energy',
    label: 'Feed glucose in and measure energy released',
    hint: 'Can the cell get usable energy out of food it already has?',
    measures: 'Energy from respiration',
  },
  {
    id: 'freshWater',
    label: 'Move the cell into fresh water',
    hint: 'Water should move in slowly and the cell should firm up.',
    measures: 'Water entering',
  },
  {
    id: 'salt',
    label: 'Move the cell into salty water',
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
    id: 'dye',
    label: 'Add tracer dye to the water outside',
    hint: 'A healthy membrane keeps the dye out.',
    measures: 'Barrier control',
  },
  {
    id: 'nucleus',
    label: 'Stain the nucleus and check the DNA',
    hint: 'The control centre of the cell.',
    measures: 'Genetic material',
  },
];

const NORMAL_NUCLEUS = { tone: 'normal', text: 'DNA intact, nucleus giving instructions as usual.' };

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
      light: { tone: 'bad', text: 'Full sunlight, water and carbon dioxide all present — but almost no glucose appears.' },
      energy: { tone: 'normal', text: 'Given glucose directly, the cell releases energy normally. Respiration is fine.' },
      freshWater: { tone: 'normal', text: 'Water moves in slowly and the cell firms up as expected.' },
      salt: { tone: 'normal', text: 'Water leaves slowly and steadily, exactly as osmosis predicts.' },
      vacuoleWatch: { tone: 'normal', text: 'The vacuole holds its volume for the full ten seconds.' },
      dye: { tone: 'normal', text: 'The dye stays outside. The membrane is still selective.' },
      nucleus: NORMAL_NUCLEUS,
    },
    reasoning: 'Glucose stayed low even in bright light with water and carbon dioxide available, while respiration, water balance and the membrane all tested normal. Only the organelle that makes glucose fits.',
    repairLabel: 'Rebuild the chloroplast',
    repairNote: 'Photosynthesis restarts, and glucose starts flowing to the rest of the cell.',
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
      energy: { tone: 'bad', text: 'Plenty of glucose available, but hardly any usable energy is released.' },
      freshWater: { tone: 'normal', text: 'Water moves in slowly and the cell firms up as expected.' },
      salt: { tone: 'normal', text: 'Water leaves slowly and steadily, exactly as osmosis predicts.' },
      vacuoleWatch: { tone: 'normal', text: 'The vacuole holds its volume for the full ten seconds.' },
      dye: { tone: 'normal', text: 'The dye stays outside. The membrane is still selective.' },
      nucleus: NORMAL_NUCLEUS,
    },
    reasoning: 'Food was there and photosynthesis was working — the cell simply could not release energy from the glucose it had. That is respiration, and respiration happens in the mitochondria.',
    repairLabel: 'Restore the mitochondria',
    repairNote: 'Respiration restarts and the stored glucose is turned into usable energy again.',
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
      energy: { tone: 'normal', text: 'Energy is released from glucose at the usual rate.' },
      freshWater: { tone: 'warn', text: 'Water enters at the normal speed, but the cell never firms up — nothing is holding the water.' },
      salt: { tone: 'warn', text: 'Water leaves at the normal speed and the cell wilts almost at once. There is no reserve to fall back on.' },
      vacuoleWatch: { tone: 'bad', text: 'Stored water drains away within seconds. The store cannot hold anything.' },
      dye: { tone: 'normal', text: 'The dye stays outside. The membrane is still selective.' },
      nucleus: NORMAL_NUCLEUS,
    },
    reasoning: 'Water crossed the membrane at exactly the right speed in both directions, so the barrier is fine — but nothing inside was holding onto it. The store failed, not the gate.',
    repairLabel: 'Reseal the vacuole',
    repairNote: 'The vacuole holds water again, and the cell can stay firm between changes in the weather.',
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
      energy: { tone: 'normal', text: 'Energy is released from glucose at the usual rate.' },
      freshWater: { tone: 'bad', text: 'Water floods in far too fast, whatever the channels are set to.' },
      salt: { tone: 'bad', text: 'Water rushes straight back out. Nothing is slowing the movement down.' },
      vacuoleWatch: { tone: 'warn', text: 'The vacuole fills and empties as the water outside changes, but it holds what it is given.' },
      dye: { tone: 'bad', text: 'The dye pours straight into the cytoplasm. Substances are no longer being sorted.' },
      nucleus: NORMAL_NUCLEUS,
    },
    reasoning: 'Dye that should have been kept out walked straight in, and water crossed uncontrollably in both directions. The barrier that decides what enters and leaves has failed.',
    repairLabel: 'Patch the cell membrane',
    repairNote: 'The membrane is selective again — it decides what crosses, and osmosis slows to a controlled rate.',
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
