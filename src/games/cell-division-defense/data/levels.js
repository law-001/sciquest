// breachCountByPhase: how many of the 5 spawn points are active per phase.
// Prophase starts with 3, escalating to 5 by anaphase.
export const LEVELS = [
  {
    id: 'act1-level1',
    act: 1,
    level: 1,
    displayName: 'First Division',
    startAtp: 400,
    nucleusHp: 100,
    phases: ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'],
    breachCountByPhase: { prophase: 3, metaphase: 3, anaphase: 4, telophase: 4, cytokinesis: 5 },
    waves: {
      prophase: [
        { type: 'viralHijacker', count: 5, interval: 2200 },
        { type: 'radiationPulse', count: 3, interval: 2500 },
        { type: 'toxinDroplet', count: 2, interval: 3500 },
      ],
      metaphase: [
        { type: 'viralHijacker', count: 5, interval: 2000 },
        { type: 'radiationPulse', count: 3, interval: 2500 },
        { type: 'toxinDroplet', count: 2, interval: 3200 },
      ],
      anaphase: [
        { type: 'viralHijacker', count: 6, interval: 2000 },
        { type: 'radiationPulse', count: 3, interval: 2500 },
        { type: 'toxinDroplet', count: 2, interval: 3000 },
      ],
      telophase: [
        { type: 'viralHijacker', count: 6, interval: 1800 },
        { type: 'radiationPulse', count: 4, interval: 2200 },
        { type: 'toxinDroplet', count: 2, interval: 3000 },
      ],
      cytokinesis: [
        { type: 'viralHijacker', count: 6, interval: 1800 },
        { type: 'radiationPulse', count: 4, interval: 2000 },
        { type: 'toxinDroplet', count: 3, interval: 2800 },
      ],
    },
  },
  {
    id: 'act1-level2',
    act: 1,
    level: 2,
    displayName: 'Escalating Threat',
    startAtp: 400,
    nucleusHp: 100,
    phases: ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'],
    breachCountByPhase: { prophase: 3, metaphase: 4, anaphase: 4, telophase: 5, cytokinesis: 5 },
    waves: {
      prophase: [
        { type: 'viralHijacker', count: 6, interval: 2000 },
        { type: 'radiationPulse', count: 3, interval: 2500 },
        { type: 'toxinDroplet', count: 2, interval: 3200 },
      ],
      metaphase: [
        { type: 'viralHijacker', count: 6, interval: 1800 },
        { type: 'radiationPulse', count: 4, interval: 2200 },
        { type: 'toxinDroplet', count: 2, interval: 3000 },
      ],
      anaphase: [
        { type: 'viralHijacker', count: 6, interval: 1800 },
        { type: 'radiationPulse', count: 4, interval: 2200 },
        { type: 'toxinDroplet', count: 3, interval: 2800 },
      ],
      telophase: [
        { type: 'viralHijacker', count: 7, interval: 1800 },
        { type: 'radiationPulse', count: 4, interval: 2000 },
        { type: 'toxinDroplet', count: 3, interval: 2800 },
      ],
      cytokinesis: [
        { type: 'viralHijacker', count: 7, interval: 1800 },
        { type: 'radiationPulse', count: 4, interval: 2000 },
        { type: 'toxinDroplet', count: 3, interval: 2600 },
      ],
    },
  },
  {
    id: 'act1-level3',
    act: 1,
    level: 3,
    displayName: 'Under Siege',
    startAtp: 380,
    nucleusHp: 100,
    phases: ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'],
    breachCountByPhase: { prophase: 3, metaphase: 4, anaphase: 5, telophase: 5, cytokinesis: 5 },
    waves: {
      prophase: [
        { type: 'viralHijacker', count: 6, interval: 1800 },
        { type: 'radiationPulse', count: 4, interval: 2200 },
        { type: 'toxinDroplet', count: 3, interval: 3000 },
      ],
      metaphase: [
        { type: 'viralHijacker', count: 7, interval: 1800 },
        { type: 'radiationPulse', count: 4, interval: 2000 },
        { type: 'toxinDroplet', count: 3, interval: 2800 },
      ],
      anaphase: [
        { type: 'viralHijacker', count: 7, interval: 1600 },
        { type: 'radiationPulse', count: 5, interval: 2000 },
        { type: 'toxinDroplet', count: 3, interval: 2600 },
      ],
      telophase: [
        { type: 'viralHijacker', count: 8, interval: 1600 },
        { type: 'radiationPulse', count: 5, interval: 1800 },
        { type: 'toxinDroplet', count: 3, interval: 2600 },
      ],
      cytokinesis: [
        { type: 'viralHijacker', count: 8, interval: 1600 },
        { type: 'radiationPulse', count: 5, interval: 1800 },
        { type: 'toxinDroplet', count: 4, interval: 2400 },
      ],
    },
  },
  {
    id: 'act1-level4',
    act: 1,
    level: 4,
    displayName: 'Mutation Crisis',
    startAtp: 370,
    nucleusHp: 100,
    phases: ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'],
    breachCountByPhase: { prophase: 4, metaphase: 4, anaphase: 5, telophase: 5, cytokinesis: 5 },
    waves: {
      prophase: [
        { type: 'viralHijacker', count: 7, interval: 1800 },
        { type: 'radiationPulse', count: 4, interval: 2000 },
        { type: 'toxinDroplet', count: 3, interval: 2800 },
      ],
      metaphase: [
        { type: 'viralHijacker', count: 7, interval: 1600 },
        { type: 'radiationPulse', count: 5, interval: 1800 },
        { type: 'toxinDroplet', count: 3, interval: 2600 },
      ],
      anaphase: [
        { type: 'viralHijacker', count: 8, interval: 1600 },
        { type: 'radiationPulse', count: 5, interval: 1800 },
        { type: 'toxinDroplet', count: 4, interval: 2400 },
      ],
      telophase: [
        { type: 'viralHijacker', count: 8, interval: 1400 },
        { type: 'radiationPulse', count: 5, interval: 1800 },
        { type: 'toxinDroplet', count: 4, interval: 2400 },
      ],
      cytokinesis: [
        { type: 'viralHijacker', count: 9, interval: 1400 },
        { type: 'radiationPulse', count: 5, interval: 1600 },
        { type: 'toxinDroplet', count: 4, interval: 2200 },
      ],
    },
  },
  {
    id: 'act1-level5',
    act: 1,
    level: 5,
    displayName: 'Final Mitosis',
    startAtp: 360,
    nucleusHp: 100,
    phases: ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'],
    breachCountByPhase: { prophase: 4, metaphase: 5, anaphase: 5, telophase: 5, cytokinesis: 5 },
    waves: {
      prophase: [
        { type: 'viralHijacker', count: 8, interval: 1600 },
        { type: 'radiationPulse', count: 5, interval: 1800 },
        { type: 'toxinDroplet', count: 3, interval: 2800 },
      ],
      metaphase: [
        { type: 'viralHijacker', count: 8, interval: 1400 },
        { type: 'radiationPulse', count: 5, interval: 1800 },
        { type: 'toxinDroplet', count: 4, interval: 2400 },
      ],
      anaphase: [
        { type: 'viralHijacker', count: 9, interval: 1400 },
        { type: 'radiationPulse', count: 6, interval: 1600 },
        { type: 'toxinDroplet', count: 4, interval: 2200 },
      ],
      telophase: [
        { type: 'viralHijacker', count: 9, interval: 1200 },
        { type: 'radiationPulse', count: 6, interval: 1600 },
        { type: 'toxinDroplet', count: 5, interval: 2200 },
      ],
      cytokinesis: [
        { type: 'viralHijacker', count: 10, interval: 1200 },
        { type: 'radiationPulse', count: 6, interval: 1600 },
        { type: 'toxinDroplet', count: 5, interval: 2000 },
      ],
    },
  },
];
