export const MUTATIONS = {
  pointMutation: {
    id: 'pointMutation',
    name: 'Point Mutation',
    effect: 'hp:-5',
    biologyNote: 'A single nucleotide base is substituted, inserted, or deleted in the DNA sequence.',
  },
  frameshiftMutation: {
    id: 'frameshiftMutation',
    name: 'Frameshift Mutation',
    effect: 'towerOutput:0.5',
    biologyNote: 'An insertion or deletion shifts the reading frame, altering every codon downstream.',
  },
  chromatinBridge: {
    id: 'chromatinBridge',
    name: 'Chromatin Bridge',
    effect: 'towerDisable:1wave',
    biologyNote: 'Dicentric chromosomes form bridges during anaphase, leading to breakage-fusion-bridge cycles.',
  },
  nondisjunction: {
    id: 'nondisjunction',
    name: 'Nondisjunction',
    effect: 'splitImbalance',
    biologyNote: 'In real cells this can cause Down syndrome.',
  },
  deletion: {
    id: 'deletion',
    name: 'Deletion',
    effect: 'maxHp:-10%',
    biologyNote: 'Loss of a chromosomal segment removes all genes in that region, often causing severe effects.',
  },
  openNucleus: {
    id: 'openNucleus',
    name: 'Open Nucleus',
    effect: 'enemyDoubleDamage:1',
    biologyNote: 'During mitosis the nuclear envelope breaks down temporarily, exposing DNA to the cytoplasm.',
  },
};
