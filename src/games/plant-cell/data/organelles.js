// The organelles drawn in CellView and named across all three levels. One
// entry per organelle so a label is never written twice.

export const ORGANELLES = {
  cellWall: {
    id: 'cellWall',
    name: 'Cell wall',
    job: 'Supports and protects the cell. It holds the shape and stops the cell bursting — it does not control what moves in and out.',
  },
  membrane: {
    id: 'membrane',
    name: 'Cell membrane',
    job: 'The selective barrier just inside the wall. It controls which substances move into and out of the cell.',
  },
  cytoplasm: {
    id: 'cytoplasm',
    name: 'Cytoplasm',
    job: 'The jelly where the organelles sit and most reactions happen.',
  },
  nucleus: {
    id: 'nucleus',
    name: 'Nucleus',
    job: 'Holds the genetic material (DNA) and controls the cell activities.',
  },
  chloroplast: {
    id: 'chloroplast',
    name: 'Chloroplast',
    job: 'The site of photosynthesis. Uses light energy, water and carbon dioxide to make glucose and release oxygen.',
  },
  vacuole: {
    id: 'vacuole',
    name: 'Vacuole',
    job: 'A large store, mostly of water. A full vacuole presses outwards and keeps the cell firm.',
  },
  mitochondrion: {
    id: 'mitochondrion',
    name: 'Mitochondria',
    job: 'Carry out cellular respiration — releasing usable energy from glucose for the rest of the cell.',
  },
  ribosome: {
    id: 'ribosome',
    name: 'Ribosomes',
    job: 'Tiny structures that build the proteins the cell needs.',
  },
};

// Everything below is laid out in the 320 x 220 viewBox CellView draws into, so
// every screen shows the same cell and can point at the same organelle. The
// vacuole sits in the middle and pushes the rest to the edges, the way it does
// in a real plant cell.
export const CHLOROPLAST_SPOTS = [
  { x: 62, y: 48, tilt: -20 },
  { x: 132, y: 32, tilt: 8 },
  { x: 214, y: 32, tilt: -6 },
  { x: 276, y: 72, tilt: 24 },
  { x: 268, y: 166, tilt: -16 },
  { x: 146, y: 192, tilt: 10 },
];

export const MITOCHONDRIA_SPOTS = [
  { x: 208, y: 192, tilt: -12 },
  { x: 286, y: 122, tilt: 74 },
];

export const RIBOSOME_SPOTS = [
  { x: 100, y: 26 }, { x: 246, y: 18 }, { x: 26, y: 74 },
  { x: 30, y: 176 }, { x: 96, y: 206 }, { x: 300, y: 30 },
];

export const NUCLEUS = { x: 52, y: 122, r: 24 };
export const VACUOLE = { x: 160, y: 110, minRx: 38, maxRx: 78, minRy: 26, maxRy: 52 };
