// What goes wrong in the daughter cells when a procedure is done badly.
//
// Every procedure returns 0–3 stars. Three stars is clean work and costs
// nothing; anything less takes a bite out of Fidelity and, below two stars,
// leaves a named defect on the final report.

// Tuned against the longest level (9 procedures) so that finishing every
// procedure at two stars lands in the 2-star band and at one star still
// counts as a completed — if defective — division.
export const FIDELITY_COST = { 3: 0, 2: 3, 1: 5, 0: 12 };

export const DEFECTS = {
  pointMutation: {
    id: 'pointMutation',
    label: 'Point mutation',
    detail: 'Bases were mispaired during replication. The wrong letter is now baked into both daughter cells.',
    severity: 'minor',
  },
  chromatinBridge: {
    id: 'chromatinBridge',
    label: 'Chromatin bridge',
    detail: 'Chromosomes never condensed fully, so a strand of DNA is left stretched between the two daughter cells.',
    severity: 'major',
  },
  monoOrientation: {
    id: 'monoOrientation',
    label: 'Mono-orientation',
    detail: 'A chromosome was attached to only one pole, so both its chromatids were dragged to the same side.',
    severity: 'major',
  },
  nondisjunction: {
    id: 'nondisjunction',
    label: 'Nondisjunction',
    detail: 'Chromosomes failed to line up correctly. One daughter cell has an extra chromosome and the other is missing one.',
    severity: 'major',
  },
  chromosomeBreak: {
    id: 'chromosomeBreak',
    label: 'Chromosome break',
    detail: 'Chromatids were pulled before the centromere link was cut, tearing the chromosome.',
    severity: 'major',
  },
  micronucleus: {
    id: 'micronucleus',
    label: 'Micronucleus',
    detail: 'A chromosome was left outside the new nuclear envelope and sealed into a small nucleus of its own.',
    severity: 'minor',
  },
  binucleate: {
    id: 'binucleate',
    label: 'Failed cytokinesis',
    detail: 'The contractile ring never closed, leaving one oversized cell with two nuclei instead of two cells.',
    severity: 'major',
  },
  unbalancedRecombination: {
    id: 'unbalancedRecombination',
    label: 'Unbalanced recombination',
    detail: 'Segments swapped between homologues did not match, so one chromosome gained DNA and the other lost it.',
    severity: 'major',
  },
  checkpointBypass: {
    id: 'checkpointBypass',
    label: 'Checkpoint bypassed',
    detail: 'A checkpoint was waved through when it should have halted the cell. Damage that could have been repaired was passed on.',
    severity: 'major',
  },
  apoptosisSkipped: {
    id: 'apoptosisSkipped',
    label: 'Damaged cell survived',
    detail: 'A cell too damaged to repair was allowed to keep dividing. This is how uncontrolled growth begins.',
    severity: 'major',
  },
};

// Which defect a given procedure leaves behind when it is done badly.
const PROCEDURE_DEFECT = {
  dnaReplication: 'pointMutation',
  chromatinCondense: 'chromatinBridge',
  spindleAttach: 'monoOrientation',
  chromosomeAlign: 'nondisjunction',
  chromatidPull: 'chromosomeBreak',
  nuclearEnvelope: 'micronucleus',
  cleavageFurrow: 'binucleate',
  crossingOver: 'unbalancedRecombination',
};

export function defectForProcedure(procedureId, stars) {
  if (stars >= 2) return null;
  const key = PROCEDURE_DEFECT[procedureId];
  return key ? DEFECTS[key] : null;
}

export function starsForFidelity(fidelity) {
  if (fidelity >= 90) return 3;
  if (fidelity >= 70) return 2;
  if (fidelity >= 50) return 1;
  return 0;
}

export const OUTCOME_BY_STARS = {
  3: {
    title: 'Textbook division',
    detail: 'Both daughter cells are complete, healthy and genetically identical to the parent.',
    tone: 'good',
  },
  2: {
    title: 'Division succeeded',
    detail: 'The cells are viable, but they carry defects that a real cell would need to repair.',
    tone: 'ok',
  },
  1: {
    title: 'Division succeeded — barely',
    detail: 'Serious defects were passed to the daughter cells. Cells in this state often fail to divide again.',
    tone: 'warn',
  },
  0: {
    title: 'Division failed',
    detail: 'Too much went wrong. The cell arrested before it could finish dividing.',
    tone: 'bad',
  },
};
