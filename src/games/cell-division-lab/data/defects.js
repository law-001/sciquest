// What goes wrong in the new cells when a step is done badly.
//
// Every step returns 0–3 stars. Three stars is clean work and costs nothing;
// anything less takes a bite out of Accuracy and, below two stars, leaves a
// named problem on the final report.

// Tuned against the longest level (9 steps) so that finishing every step at
// two stars lands in the 2-star band and at one star still counts as a
// completed — if damaged — division.
export const ACCURACY_COST = { 3: 0, 2: 3, 1: 5, 0: 12 };

export const PROBLEMS = {
  pointMutation: {
    id: 'pointMutation',
    label: 'Wrong DNA letter',
    detail: 'A letter of the DNA was copied wrongly. Both new cells now carry that mistake.',
    severity: 'minor',
  },
  chromatinBridge: {
    id: 'chromatinBridge',
    label: 'DNA left stretched',
    detail: 'The DNA never coiled up tightly, so a strand was left stretched between the two new cells.',
    severity: 'major',
  },
  monoOrientation: {
    id: 'monoOrientation',
    label: 'Pulled to one side',
    detail: 'A chromosome was held from one side only, so both of its halves were dragged into the same new cell.',
    severity: 'major',
  },
  nondisjunction: {
    id: 'nondisjunction',
    label: 'Uneven split',
    detail: 'The chromosomes did not line up properly. One new cell ended up with an extra chromosome and the other is missing one.',
    severity: 'major',
  },
  chromosomeBreak: {
    id: 'chromosomeBreak',
    label: 'Torn chromosome',
    detail: 'The two halves were pulled apart before the link joining them was cut, so the chromosome tore.',
    severity: 'major',
  },
  micronucleus: {
    id: 'micronucleus',
    label: 'Chromosome left out',
    detail: 'A chromosome was left outside the new nuclear membrane and got sealed into a tiny bubble of its own.',
    severity: 'minor',
  },
  binucleate: {
    id: 'binucleate',
    label: 'Cell never split',
    detail: 'The pinching ring never closed. Instead of two cells there is one big cell with two nuclei inside it.',
    severity: 'major',
  },
  unbalancedRecombination: {
    id: 'unbalancedRecombination',
    label: 'Uneven swap',
    detail: 'The pieces swapped between the matching chromosomes were different sizes, so one gained DNA and the other lost some.',
    severity: 'major',
  },
  checkpointBypass: {
    id: 'checkpointBypass',
    label: 'Checkpoint ignored',
    detail: 'A checkpoint was waved through when it should have paused the cell. Damage that could have been repaired was passed on instead.',
    severity: 'major',
  },
};

// Which problem a given step leaves behind when it is done badly.
const STEP_PROBLEM = {
  dnaReplication: 'pointMutation',
  chromatinCondense: 'chromatinBridge',
  spindleAttach: 'monoOrientation',
  chromosomeAlign: 'nondisjunction',
  chromatidPull: 'chromosomeBreak',
  nuclearEnvelope: 'micronucleus',
  cleavageFurrow: 'binucleate',
  crossingOver: 'unbalancedRecombination',
};

export function problemForProcedure(procedureId, stars) {
  if (stars >= 2) return null;
  const key = STEP_PROBLEM[procedureId];
  return key ? PROBLEMS[key] : null;
}

export function starsForAccuracy(accuracy) {
  if (accuracy >= 90) return 3;
  if (accuracy >= 70) return 2;
  if (accuracy >= 50) return 1;
  return 0;
}

export const OUTCOME_BY_STARS = {
  3: {
    title: 'Perfect division',
    detail: 'Every new cell is complete and healthy, with exactly the right set of chromosomes.',
    tone: 'good',
  },
  2: {
    title: 'Division worked',
    detail: 'The new cells can survive, but they carry mistakes that a real cell would have to repair.',
    tone: 'ok',
  },
  1: {
    title: 'Division just about worked',
    detail: 'Serious mistakes were passed on to the new cells. Cells in this state often cannot divide again.',
    tone: 'warn',
  },
  0: {
    title: 'Division failed',
    detail: 'Too much went wrong, so the cell stopped before it could finish dividing.',
    tone: 'bad',
  },
};
