// Each level is an ordered list of steps. A step is either a `procedure`
// (a hands-on mini-game) or a `checkpoint` (a GO / WAIT decision).
//
// `fault` marks a step that is deliberately rigged in Level 3 — the step is
// made impossible to finish cleanly, so the checkpoint straight after it
// reports a problem and the right answer there becomes WAIT instead of GO.

export const LEVELS = [
  {
    id: 'l1',
    number: 1,
    name: 'One Cell, Two Copies',
    goal: 'Take one cell all the way through mitosis and end up with two identical new cells.',
    outcome: '2 identical cells',
    accent: '#2bafa9',
    unlocksAfter: null,
    steps: [
      { kind: 'checkpoint', phaseId: 'g1', checkpointId: 'g1' },
      { kind: 'procedure', phaseId: 'sPhase', procedure: 'dnaReplication' },
      { kind: 'checkpoint', phaseId: 'g2', checkpointId: 'g2' },
      { kind: 'procedure', phaseId: 'prophase', procedure: 'chromatinCondense' },
      { kind: 'procedure', phaseId: 'prometaphase', procedure: 'spindleAttach' },
      { kind: 'checkpoint', phaseId: 'sac', checkpointId: 'sac' },
      { kind: 'procedure', phaseId: 'metaphase', procedure: 'chromosomeAlign', props: { mode: 'single' } },
      { kind: 'procedure', phaseId: 'anaphase', procedure: 'chromatidPull', props: { mode: 'chromatid' } },
      { kind: 'procedure', phaseId: 'telophase', procedure: 'nuclearEnvelope', props: { count: 2 } },
      { kind: 'procedure', phaseId: 'cytokinesis', procedure: 'cleavageFurrow' },
    ],
  },

  {
    id: 'l2',
    number: 2,
    name: 'Four Cells, All Different',
    goal: 'Run both rounds of meiosis and end up with four cells that are all different from each other.',
    outcome: '4 different cells',
    accent: '#9B7EC8',
    unlocksAfter: 'l1',
    steps: [
      { kind: 'procedure', phaseId: 'sPhase', procedure: 'dnaReplication' },
      { kind: 'procedure', phaseId: 'prophase1', procedure: 'crossingOver' },
      { kind: 'procedure', phaseId: 'metaphase1', procedure: 'chromosomeAlign', props: { mode: 'tetrad' } },
      { kind: 'procedure', phaseId: 'anaphase1', procedure: 'chromatidPull', props: { mode: 'homolog' } },
      { kind: 'procedure', phaseId: 'cytokinesis1', procedure: 'cleavageFurrow' },
      { kind: 'procedure', phaseId: 'metaphase2', procedure: 'chromosomeAlign', props: { mode: 'single' } },
      { kind: 'procedure', phaseId: 'anaphase2', procedure: 'chromatidPull', props: { mode: 'chromatid' } },
      { kind: 'procedure', phaseId: 'telophase2', procedure: 'nuclearEnvelope', props: { count: 4 } },
      { kind: 'procedure', phaseId: 'cytokinesis2', procedure: 'cleavageFurrow' },
    ],
  },

  {
    id: 'l3',
    number: 3,
    name: 'When Things Go Wrong',
    goal: 'Two steps in this cell are broken and cannot be done properly. Use the checkpoints to catch each problem and give the cell a chance to fix it.',
    outcome: '2 cells — how healthy is up to you',
    accent: '#d1544f',
    unlocksAfter: 'l2',
    steps: [
      { kind: 'checkpoint', phaseId: 'g1', checkpointId: 'g1' },
      { kind: 'procedure', phaseId: 'sPhase', procedure: 'dnaReplication', fault: 'replicationErrors' },
      { kind: 'checkpoint', phaseId: 'g2', checkpointId: 'g2' },
      { kind: 'procedure', phaseId: 'prophase', procedure: 'chromatinCondense' },
      { kind: 'procedure', phaseId: 'prometaphase', procedure: 'spindleAttach', fault: 'stuckKinetochore' },
      { kind: 'checkpoint', phaseId: 'sac', checkpointId: 'sac' },
      { kind: 'procedure', phaseId: 'metaphase', procedure: 'chromosomeAlign', props: { mode: 'single' } },
      { kind: 'procedure', phaseId: 'anaphase', procedure: 'chromatidPull', props: { mode: 'chromatid' } },
      { kind: 'procedure', phaseId: 'telophase', procedure: 'nuclearEnvelope', props: { count: 2 } },
      { kind: 'procedure', phaseId: 'cytokinesis', procedure: 'cleavageFurrow' },
    ],
  },
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) ?? null;
}

export function isLevelUnlocked(level, completedIds) {
  return !level.unlocksAfter || completedIds.includes(level.unlocksAfter);
}
