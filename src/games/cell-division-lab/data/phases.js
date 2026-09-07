// Teaching content for every stage of the cell cycle the lab covers.
//
// Written for around grade 7: short sentences, everyday words, and any
// technical term either explained on the spot or left out entirely.
//
// `cellIdx` maps a phase onto the six-stage cycle the canvas renderer draws
// (0 interphase … 5 cytokinesis). Several lab phases share a renderer stage —
// prophase and prometaphase both look like renderer stage 1, for instance.

export const PHASES = {
  g1: {
    id: 'g1',
    displayName: 'G1 — Growing',
    shortName: 'G1',
    color: '#7BC9CF',
    cellIdx: 0,
    teachingText:
      'The cell grows and gets on with its everyday job. Before it is allowed to start dividing it has to pass the G1 checkpoint, which asks three questions: is the cell big enough, does it have enough food, and is its DNA undamaged?',
    objectives: ['Read the cell readout', 'Decide whether the cell should start dividing'],
    controls: 'Read the readout, then choose GO or WAIT',
  },

  sPhase: {
    id: 'sPhase',
    displayName: 'S Phase — Copying the DNA',
    shortName: 'S',
    color: '#7BC9CF',
    cellIdx: 0,
    teachingText:
      'The cell makes a copy of every chromosome. The DNA ladder unzips down the middle, and each old half is used as the pattern for building a new half. Every chromosome ends up as two identical copies joined together in the middle.',
    objectives: ['Unzip the DNA ladder', 'Match every letter correctly: A with T, G with C'],
    controls: 'Drag a DNA letter from the cell into the copying clamp',
  },

  g2: {
    id: 'g2',
    displayName: 'G2 — Last Checks',
    shortName: 'G2',
    color: '#7BC9CF',
    cellIdx: 0,
    teachingText:
      'The cell builds the parts it will need for dividing, then double-checks the copies it just made. The G2 checkpoint hunts for copying mistakes and damaged DNA before it lets the cell go any further.',
    objectives: ['Read the copying report', 'Decide whether the cell should carry on'],
    controls: 'Read the report, then choose GO or WAIT',
  },

  prophase: {
    id: 'prophase',
    displayName: 'Prophase',
    shortName: 'Prophase',
    color: '#A8C8F0',
    cellIdx: 1,
    teachingText:
      'The long, tangled DNA winds itself up into short, thick chromosomes you can actually see under a microscope. Packing the DNA up this tightly stops it from tearing when it gets pulled apart later on.',
    objectives: ['Coil up all four DNA threads'],
    controls: 'Press and hold each glowing DNA thread until it finishes coiling',
  },

  prometaphase: {
    id: 'prometaphase',
    displayName: 'Prometaphase',
    shortName: 'Prometa',
    color: '#9BB8E8',
    cellIdx: 1,
    teachingText:
      'The wall around the nucleus breaks down, and thin fibres reach in from the top and bottom of the cell to grab the chromosomes. Every chromosome has to be grabbed from BOTH sides — one fibre from the top and one from the bottom. A chromosome held from one side only gets dragged whole into the wrong cell.',
    objectives: ['Attach every chromosome to both the top and the bottom'],
    controls: 'Drag a fibre out of the top point and out of the bottom point, and drop each one on a chromosome',
  },

  sac: {
    id: 'sac',
    displayName: 'Spindle Checkpoint',
    shortName: 'Spindle check',
    color: '#F4B942',
    cellIdx: 1,
    teachingText:
      'This is the last safety check before the big split. The cell refuses to pull anything apart until every single chromosome is held from both sides. One loose chromosome is enough to stop the whole cell.',
    objectives: ['Check every chromosome is held from both sides', 'Decide whether to pull them apart'],
    controls: 'Read the readout, then choose GO or WAIT',
  },

  metaphase: {
    id: 'metaphase',
    displayName: 'Metaphase',
    shortName: 'Metaphase',
    color: '#F4B942',
    cellIdx: 2,
    teachingText:
      'The chromosomes get pulled into a single line across the middle of the cell. Scientists call that line the metaphase plate. Lining up exactly is what makes sure each new cell ends up with one copy of every chromosome.',
    objectives: ['Line every chromosome up across the middle'],
    controls: 'Drag each chromosome onto the dashed line across the middle',
  },

  anaphase: {
    id: 'anaphase',
    displayName: 'Anaphase',
    shortName: 'Anaphase',
    color: '#E07B54',
    cellIdx: 3,
    teachingText:
      'The link holding each pair of copies together is cut, and the fibres pull the two copies to opposite ends of the cell. Pulling before the link has been fully cut tears the chromosome and damages the DNA.',
    objectives: ['Cut the link in the middle of each chromosome', 'Pull only once the link is fully cut'],
    controls: 'Tap the green link in the middle, wait for it to be cut, then drag up or down',
  },

  telophase: {
    id: 'telophase',
    displayName: 'Telophase',
    shortName: 'Telophase',
    color: '#9B7EC8',
    cellIdx: 4,
    teachingText:
      'A new membrane forms around each set of chromosomes, and the chromosomes start to unwind again. The cell now has two complete nuclei inside it.',
    objectives: ['Wrap a membrane around every group of chromosomes'],
    controls: 'Draw a closed loop around each group, ending where you started',
  },

  cytokinesis: {
    id: 'cytokinesis',
    displayName: 'Cytokinesis — The Split',
    shortName: 'Cytokinesis',
    color: '#6DBF8A',
    cellIdx: 5,
    teachingText:
      'A ring of fibres tightens around the middle of the cell like the drawstring on a bag. It squeezes until the cell pinches right through and becomes two separate cells.',
    objectives: ['Tighten both sides of the ring'],
    controls: 'Drag the handle on each side of the ring inward toward the middle',
  },

  // ── Meiosis ────────────────────────────────────────────────────────────

  prophase1: {
    id: 'prophase1',
    displayName: 'Prophase I — Swapping Pieces',
    shortName: 'Prophase I',
    color: '#C77DBB',
    cellIdx: 1,
    teachingText:
      'Matching chromosomes — one you got from each parent — pair up and swap matching pieces where they touch. This swapping is the reason you are not identical to your brothers and sisters.',
    objectives: ['Line the matching pair up with each other', 'Swap pieces at every crossing point'],
    controls: 'Drag the blue chromosome up or down until its stripes line up, then tap each ⇄',
  },

  metaphase1: {
    id: 'metaphase1',
    displayName: 'Metaphase I',
    shortName: 'Meta I',
    color: '#F4B942',
    cellIdx: 2,
    teachingText:
      'Whole PAIRS of matching chromosomes line up in the middle, instead of single ones. Which parent’s chromosome ends up facing which end of the cell is random for every pair — another reason no two cells come out the same.',
    objectives: ['Line every matching pair up across the middle'],
    controls: 'Drag each pair onto the dashed line across the middle',
  },

  anaphase1: {
    id: 'anaphase1',
    displayName: 'Anaphase I',
    shortName: 'Ana I',
    color: '#E07B54',
    cellIdx: 3,
    teachingText:
      'The matching chromosomes get pulled away from each other — but each one is still made of two copies joined together. This is the step that halves the number of chromosomes, and it is the biggest difference between meiosis and mitosis.',
    objectives: ['Separate the matching pair, not the joined copies'],
    controls: 'Tap the green link between the pair, wait for it to be cut, then drag up or down',
  },

  cytokinesis1: {
    id: 'cytokinesis1',
    displayName: 'Cytokinesis I',
    shortName: 'Cyto I',
    color: '#6DBF8A',
    cellIdx: 5,
    teachingText:
      'The cell pinches into two. Each new cell now has half as many chromosomes as the cell you started with, but every chromosome is still two copies joined together.',
    objectives: ['Tighten both sides of the ring'],
    controls: 'Drag the handle on each side of the ring inward toward the middle',
  },

  metaphase2: {
    id: 'metaphase2',
    displayName: 'Metaphase II',
    shortName: 'Meta II',
    color: '#F4B942',
    cellIdx: 2,
    teachingText:
      'In both of the new cells, the chromosomes that are left line up one by one across the middle — exactly the way they do in mitosis.',
    objectives: ['Line every chromosome up across the middle'],
    controls: 'Drag each chromosome onto the dashed line across the middle',
  },

  anaphase2: {
    id: 'anaphase2',
    displayName: 'Anaphase II',
    shortName: 'Ana II',
    color: '#E07B54',
    cellIdx: 3,
    teachingText:
      'Now the joined copies finally come apart, just like they do in mitosis. Compare this with Anaphase I, where it was whole matching pairs that moved away from each other.',
    objectives: ['Separate the joined copies'],
    controls: 'Tap the green link in the middle, wait for it to be cut, then drag up or down',
  },

  telophase2: {
    id: 'telophase2',
    displayName: 'Telophase II',
    shortName: 'Telo II',
    color: '#9B7EC8',
    cellIdx: 4,
    teachingText:
      'Four nuclei form. Meiosis ends up making four cells, each one with half the usual number of chromosomes, and each one different from all the others.',
    objectives: ['Wrap a membrane around all four groups'],
    controls: 'Draw a closed loop around each group, ending where you started',
  },

  cytokinesis2: {
    id: 'cytokinesis2',
    displayName: 'Cytokinesis II',
    shortName: 'Cyto II',
    color: '#6DBF8A',
    cellIdx: 5,
    teachingText:
      'The last split makes four cells in total, each with half the usual number of chromosomes. In humans, these become sperm cells or egg cells.',
    objectives: ['Tighten both sides of the ring'],
    controls: 'Drag the handle on each side of the ring inward toward the middle',
  },
};

// Checkpoint gates. `correct` is the answer that scores full marks; every
// option carries the explanation shown after the choice is made.
//
// Two options only, GO or WAIT. A third "self-destruct" option used to sit
// here, but it was never the right answer at any gate in the game, so all it
// added was noise to the decision.
export const CHECKPOINTS = {
  g1: {
    id: 'g1',
    phaseId: 'g1',
    prompt: 'This cell has grown to full size, it has plenty of food, and a scan finds no damage to its DNA. Should it start dividing?',
    options: [
      {
        id: 'go',
        label: 'GO',
        detail: 'Start copying the DNA',
        explain: 'Correct. All three checks passed, so this cell is safe to start dividing.',
      },
      {
        id: 'wait',
        label: 'WAIT',
        detail: 'Hold on and keep growing',
        explain: 'Too careful. Waiting is the right call when a cell is too small or short of food — but this cell already passes every check.',
      },
    ],
    correct: 'go',
  },

  g2: {
    id: 'g2',
    phaseId: 'g2',
    prompt: 'The DNA has been copied. Read the report below, then decide whether this cell should carry on.',
    options: [
      {
        id: 'go',
        label: 'GO',
        detail: 'Carry on and start dividing',
        explain: 'This is the right call when the report shows no copying mistakes. The copies are complete, so the cell can safely carry on.',
      },
      {
        id: 'wait',
        label: 'WAIT',
        detail: 'Pause and fix the DNA',
        explain: 'This is the right call when the report shows copying mistakes. Pausing gives the cell time to fix them, instead of locking them into both new cells forever.',
      },
    ],
    // Resolved at runtime from the S-phase score: clean run → go, mistakes → wait.
    correct: 'dynamic',
  },

  sac: {
    id: 'sac',
    phaseId: 'sac',
    prompt: 'Read the readout below. Is every chromosome being held from both sides?',
    options: [
      {
        id: 'go',
        label: 'GO',
        detail: 'Pull the chromosomes apart now',
        explain: 'This is the right call only when every chromosome is held from both sides. Pulling early sends the wrong number of chromosomes into the new cells.',
      },
      {
        id: 'wait',
        label: 'WAIT',
        detail: 'Hold on and finish attaching',
        explain: 'This is the right call when a chromosome is still loose. The checkpoint blocks the split until the very last chromosome has been caught from both sides.',
      },
    ],
    correct: 'dynamic',
  },
};

export function getPhase(id) {
  return PHASES[id] ?? null;
}
