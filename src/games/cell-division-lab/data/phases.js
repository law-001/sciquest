// Teaching content for every stage of the cell cycle the lab covers.
//
// `cellIdx` maps a phase onto the six-stage cycle the canvas renderer draws
// (0 interphase … 5 cytokinesis). Several lab phases share a renderer stage —
// prophase and prometaphase both look like renderer stage 1, for instance.

export const PHASES = {
  g1: {
    id: 'g1',
    displayName: 'G1 — Growth',
    shortName: 'G1',
    color: '#7BC9CF',
    cellIdx: 0,
    teachingText:
      'The cell grows and carries out its normal work. Before it commits to dividing it must pass the G1 checkpoint, which asks whether the cell is big enough, has enough nutrients, and whether its DNA is undamaged.',
    objectives: ['Inspect the cell', 'Decide whether to commit to division'],
    controls: 'Read the cell readout, then choose GO, WAIT or SELF-DESTRUCT',
  },

  sPhase: {
    id: 'sPhase',
    displayName: 'S Phase — DNA Replication',
    shortName: 'S',
    color: '#7BC9CF',
    cellIdx: 0,
    teachingText:
      'Every chromosome is copied. The double helix unzips and each old strand is used as a template for a new one, so each chromosome ends up as two identical sister chromatids joined at the centromere.',
    objectives: ['Unzip the double helix', 'Pair every base correctly (A-T, G-C)'],
    controls: 'Drag a nucleotide from the nucleoplasm into the polymerase clamp',
  },

  g2: {
    id: 'g2',
    displayName: 'G2 — Final Checks',
    shortName: 'G2',
    color: '#7BC9CF',
    cellIdx: 0,
    teachingText:
      'The cell makes the proteins it needs for division and double-checks the copies it just made. The G2 checkpoint looks for replication errors and DNA damage before allowing mitosis to begin.',
    objectives: ['Review the replication report', 'Decide whether to enter mitosis'],
    controls: 'Read the replication report, then choose GO, WAIT or SELF-DESTRUCT',
  },

  prophase: {
    id: 'prophase',
    displayName: 'Prophase',
    shortName: 'Prophase',
    color: '#A8C8F0',
    cellIdx: 1,
    teachingText:
      'Long, tangled chromatin coils up tightly into compact chromosomes you can actually see under a microscope. Packing the DNA this way stops it from tearing when it is pulled apart later.',
    objectives: ['Condense all four chromatin strands'],
    controls: 'Press and hold the glowing chromatin thread until it finishes coiling',
  },

  prometaphase: {
    id: 'prometaphase',
    displayName: 'Prometaphase',
    shortName: 'Prometa',
    color: '#9BB8E8',
    cellIdx: 1,
    teachingText:
      'The nuclear envelope breaks down and spindle fibres reach in from both poles. Each chromosome must be captured from BOTH sides — one pole per sister chromatid. This is called bi-orientation.',
    objectives: ['Attach every chromosome to both poles'],
    controls: 'Drag a fibre out of each pole and drop it on a chromosome',
  },

  sac: {
    id: 'sac',
    displayName: 'Spindle Checkpoint',
    shortName: 'SAC',
    color: '#F4B942',
    cellIdx: 1,
    teachingText:
      'The spindle assembly checkpoint is the cell’s last line of defence. It halts division until every single chromosome is correctly attached to both poles. One unattached chromosome is enough to stop the whole cell.',
    objectives: ['Verify every attachment', 'Decide whether to separate'],
    controls: 'Check the attachments, then choose GO, WAIT or SELF-DESTRUCT',
  },

  metaphase: {
    id: 'metaphase',
    displayName: 'Metaphase',
    shortName: 'Metaphase',
    color: '#F4B942',
    cellIdx: 2,
    teachingText:
      'Chromosomes are pulled into a single line across the middle of the cell — the metaphase plate. Lining up precisely is what guarantees each daughter cell receives exactly one copy of every chromosome.',
    objectives: ['Align every chromosome on the plate'],
    controls: 'Drag each chromosome onto the dashed metaphase plate',
  },

  anaphase: {
    id: 'anaphase',
    displayName: 'Anaphase',
    shortName: 'Anaphase',
    color: '#E07B54',
    cellIdx: 3,
    teachingText:
      'The link holding each pair of sister chromatids is cut, and the spindle pulls them to opposite poles. Pulling before the link is fully cut tears the chromosome and damages the DNA.',
    objectives: ['Sever each centromere link', 'Pull only after the link is cut'],
    controls: 'Tap the green centromere, wait for the cut, then drag the mouse up or down',
  },

  telophase: {
    id: 'telophase',
    displayName: 'Telophase',
    shortName: 'Telophase',
    color: '#9B7EC8',
    cellIdx: 4,
    teachingText:
      'A new nuclear envelope forms around each set of chromosomes, and the chromosomes begin to unwind back into chromatin. The cell now has two complete nuclei.',
    objectives: ['Enclose every chromosome set in an envelope'],
    controls: 'Draw a closed loop around each cluster, finishing where you started',
  },

  cytokinesis: {
    id: 'cytokinesis',
    displayName: 'Cytokinesis',
    shortName: 'Cytokinesis',
    color: '#6DBF8A',
    cellIdx: 5,
    teachingText:
      'A ring of protein filaments tightens around the cell’s equator like a drawstring, pinching the cytoplasm until the cell splits into two separate daughter cells.',
    objectives: ['Contract every section of the ring'],
    controls: 'Drag the ring handle on each side inward toward the middle',
  },

  // ── Meiosis ────────────────────────────────────────────────────────────

  prophase1: {
    id: 'prophase1',
    displayName: 'Prophase I — Crossing Over',
    shortName: 'Prophase I',
    color: '#C77DBB',
    cellIdx: 1,
    teachingText:
      'Homologous chromosomes — one from each parent — pair up and swap matching segments where they touch. This recombination is why you are not identical to your siblings.',
    objectives: ['Pair each homologous chromosome', 'Swap segments at every chiasma'],
    controls: 'Drag the paternal chromosome up or down into register, then tap each ⇄',
  },

  metaphase1: {
    id: 'metaphase1',
    displayName: 'Metaphase I',
    shortName: 'Meta I',
    color: '#F4B942',
    cellIdx: 2,
    teachingText:
      'Whole homologous PAIRS line up on the plate, not single chromosomes. Which parent’s chromosome faces which pole is random for every pair — another source of genetic variety.',
    objectives: ['Align every homologous pair on the plate'],
    controls: 'Drag each homologous pair onto the dashed metaphase plate',
  },

  anaphase1: {
    id: 'anaphase1',
    displayName: 'Anaphase I',
    shortName: 'Ana I',
    color: '#E07B54',
    cellIdx: 3,
    teachingText:
      'Homologous chromosomes separate — but the sister chromatids stay joined. This is the step that halves the chromosome number, and it is the single biggest difference between meiosis and mitosis.',
    objectives: ['Separate homologues, not sister chromatids'],
    controls: 'Tap the green link, wait for the cut, then drag the mouse up or down',
  },

  cytokinesis1: {
    id: 'cytokinesis1',
    displayName: 'Cytokinesis I',
    shortName: 'Cyto I',
    color: '#6DBF8A',
    cellIdx: 5,
    teachingText:
      'The cell divides into two. Each daughter now has half the original chromosome number, but every chromosome is still made of two sister chromatids.',
    objectives: ['Contract every section of the ring'],
    controls: 'Drag the ring handle on each side inward toward the middle',
  },

  metaphase2: {
    id: 'metaphase2',
    displayName: 'Metaphase II',
    shortName: 'Meta II',
    color: '#F4B942',
    cellIdx: 2,
    teachingText:
      'In both daughter cells the remaining chromosomes line up singly on a new plate — the same way they do in mitosis.',
    objectives: ['Align every chromosome on the plate'],
    controls: 'Drag each chromosome onto the dashed metaphase plate',
  },

  anaphase2: {
    id: 'anaphase2',
    displayName: 'Anaphase II',
    shortName: 'Ana II',
    color: '#E07B54',
    cellIdx: 3,
    teachingText:
      'Now the sister chromatids finally separate, exactly as they do in mitosis. Compare this with Anaphase I — there it was whole homologues that moved apart.',
    objectives: ['Separate sister chromatids'],
    controls: 'Tap the green centromere, wait for the cut, then drag the mouse up or down',
  },

  telophase2: {
    id: 'telophase2',
    displayName: 'Telophase II',
    shortName: 'Telo II',
    color: '#9B7EC8',
    cellIdx: 4,
    teachingText:
      'Four nuclei form. Meiosis produces four haploid cells, each genetically different from the others and from the parent cell.',
    objectives: ['Enclose all four chromosome sets'],
    controls: 'Draw a closed loop around each cluster, finishing where you started',
  },

  cytokinesis2: {
    id: 'cytokinesis2',
    displayName: 'Cytokinesis II',
    shortName: 'Cyto II',
    color: '#6DBF8A',
    cellIdx: 5,
    teachingText:
      'The final split produces four haploid daughter cells. In humans these become sperm or egg cells.',
    objectives: ['Contract every section of the ring'],
    controls: 'Drag the ring handle on each side inward toward the middle',
  },
};

// Checkpoint gates. `correct` is the answer that scores full marks; every
// option carries the explanation shown after the choice is made.
export const CHECKPOINTS = {
  g1: {
    id: 'g1',
    phaseId: 'g1',
    prompt: 'The cell has grown to full size, nutrients are plentiful, and a DNA scan finds no damage. Should it commit to dividing?',
    options: [
      {
        id: 'go',
        label: 'GO',
        detail: 'Enter S phase and copy the DNA',
        explain: 'Correct. All three G1 conditions are met, so the cell passes the restriction point and commits to division.',
      },
      {
        id: 'wait',
        label: 'WAIT',
        detail: 'Hold in G1 and keep growing',
        explain: 'Too cautious. Waiting is right when the cell is too small or starved, but here every condition is already satisfied.',
      },
      {
        id: 'apoptosis',
        label: 'SELF-DESTRUCT',
        detail: 'Trigger apoptosis',
        explain: 'Far too drastic. Apoptosis is for cells with damage too severe to repair — this cell is perfectly healthy.',
      },
    ],
    correct: 'go',
  },

  g2: {
    id: 'g2',
    phaseId: 'g2',
    prompt: 'Replication has finished. Review your own S-phase result before deciding whether this cell may enter mitosis.',
    options: [
      {
        id: 'go',
        label: 'GO',
        detail: 'Begin mitosis',
        explain: 'Right call when replication was clean — the copies are complete and undamaged, so mitosis can begin.',
      },
      {
        id: 'wait',
        label: 'WAIT',
        detail: 'Pause and repair the DNA',
        explain: 'Right call when replication left errors behind. G2 gives the cell time to fix mistakes before they are locked into both daughter cells.',
      },
      {
        id: 'apoptosis',
        label: 'SELF-DESTRUCT',
        detail: 'Trigger apoptosis',
        explain: 'Reserved for damage beyond repair. A handful of mispaired bases can still be fixed.',
      },
    ],
    // Resolved at runtime from the S-phase score: clean run → go, errors → wait.
    correct: 'dynamic',
  },

  sac: {
    id: 'sac',
    phaseId: 'sac',
    prompt: 'Review your spindle attachments. Is every chromosome attached to both poles?',
    options: [
      {
        id: 'go',
        label: 'GO',
        detail: 'Separate the chromatids',
        explain: 'Right call only when every chromosome is bi-oriented. Separating early causes daughter cells to get the wrong number of chromosomes.',
      },
      {
        id: 'wait',
        label: 'WAIT',
        detail: 'Hold and finish attaching',
        explain: 'Right call when any chromosome is still unattached. The spindle checkpoint blocks anaphase until the last one is captured.',
      },
      {
        id: 'apoptosis',
        label: 'SELF-DESTRUCT',
        detail: 'Trigger apoptosis',
        explain: 'Only if the spindle cannot be fixed at all. An unattached chromosome can usually still be captured.',
      },
    ],
    correct: 'dynamic',
  },
};

export function getPhase(id) {
  return PHASES[id] ?? null;
}
