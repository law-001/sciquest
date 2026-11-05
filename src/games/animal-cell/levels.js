// Animal Cell: Power the Cell — level configuration.
//
// The sibling of the plant cell game: the plant made glucose and oxygen, and
// here an animal cell uses them. Every level is described here and rendered by
// its own screen; tuning a level should never mean editing a component. Quests
// work exactly like plant-cell's (see plant-cell/engine/useQuests.js).

export const LEVELS = [
  {
    id: 'l1',
    number: 1,
    name: 'Fuel the Cell',
    focus: 'respiration',
    icon: '⚡',
    accent: '#d76d2e',
    unlocksAfter: null,
    goal: 'Feed the mitochondria glucose and oxygen so they release enough energy to keep the animal cell alive.',
    objective: 'Complete every respiration quest',
    // isMet(sim, controls)
    quests: [
      {
        id: 'l1-glucose',
        title: 'Feed the cell',
        description: 'Raise Glucose past 70%. Glucose is the food the cell breaks down.',
        holdSeconds: 2,
        isMet: (sim, controls) => controls.glucose >= 70,
        educationalNote: 'Animal cells cannot make their own glucose. It comes from the food the animal eats — and that food’s energy first came from plants’ photosynthesis.',
      },
      {
        id: 'l1-oxygen',
        title: 'Let it breathe',
        description: 'Raise Oxygen past 70%.',
        holdSeconds: 2,
        isMet: (sim, controls) => controls.oxygen >= 70,
        educationalNote: 'The oxygen an animal breathes in is carried to every cell. Mitochondria need it to release energy from glucose.',
      },
      {
        id: 'l1-no-oxygen',
        title: 'Hold your breath',
        description: 'Turn Oxygen down to 0 and watch energy release stop.',
        holdSeconds: 2,
        isMet: (sim, controls) => controls.oxygen <= 5 && sim.rate < 0.1,
        educationalNote: 'Respiration needs both glucose and oxygen. Take either one away and the mitochondria cannot release energy.',
      },
      {
        id: 'l1-full-power',
        title: 'Full power',
        description: 'Turn both up so energy is released at 90% or more for 3 seconds.',
        holdSeconds: 3,
        isMet: (sim) => sim.rate >= 0.9,
        educationalNote: 'With plenty of glucose and oxygen, the mitochondria release energy fastest. That is why active muscle cells are packed with mitochondria.',
      },
      {
        id: 'l1-waste',
        title: 'Spot the waste',
        description: 'Keep respiration running until 40 units of carbon dioxide have been released.',
        holdSeconds: 0,
        isMet: (sim) => sim.co2 >= 40,
        educationalNote: 'Respiration also makes carbon dioxide and water. The carbon dioxide leaves the cell and is breathed out — and plants take it in for photosynthesis.',
      },
    ],
    briefing: {
      title: 'Your animal cell needs energy to survive.',
      lead: 'Mitochondria release energy from glucose by cellular respiration — but only while they get both glucose and oxygen.',
      points: [
        'Glucose + oxygen → energy + carbon dioxide + water.',
        'Animal cells have no chloroplasts, so they cannot make glucose. It comes from food.',
        'The cell uses energy all the time. With no energy, the cell gets weaker.',
      ],
      cta: 'Start respiration',
    },
    debrief: {
      title: 'You kept the cell alive with respiration.',
      body: 'Mitochondria are where cellular respiration happens. They use oxygen to release the energy stored in glucose, giving off carbon dioxide and water. It is photosynthesis run backwards: plants make glucose and oxygen, and cells use them.',
      points: [
        'Mitochondria → the organelle where respiration happens.',
        'Respiration → energy + carbon dioxide + water.',
        'It needs both: glucose and oxygen.',
      ],
    },
    keyTerms: [
      { term: 'Mitochondria', meaning: 'The organelles that release energy from glucose. Often called the powerhouse of the cell.' },
      { term: 'Cellular respiration', meaning: 'Mitochondria use oxygen to break down glucose, releasing energy, carbon dioxide and water.' },
      { term: 'Glucose', meaning: 'A sugar made by plants. Animals get it from the food they eat.' },
    ],
    sim: {
      energyStart: 34,
      healthStart: 65,
      productionPerSec: 15,
      demandPerSec: 8,
      deficitHealthPerSec: 9,
      regenHealthPerSec: 3.2,
      co2PerSec: 6,
      // Read as: 3 stars if the lowest health reached stayed at or above 55.
      starMinHealth: [0, 1, 30, 55],
    },
  },

  {
    id: 'l2',
    number: 2,
    name: 'Water In, Water Out',
    focus: 'osmosis',
    icon: '💧',
    accent: '#2bafa9',
    unlocksAfter: 'l1',
    goal: 'Predict what happens to an animal cell — and a plant cell — when the water around it changes.',
    objective: 'Predict every change right',
    // Each quest is one round played on plant-cell/engine/water.js: `cell` is
    // which cell sits in the water and `around` keys sim.perSec. There is no
    // isMet: the screen completes a round when the chosen answer is `correct`.
    quests: [
      {
        id: 'l2-salty',
        title: 'Into salty water',
        description: 'Predict what an animal cell does in very salty water, then watch.',
        question: 'What do you think will happen to an animal cell dropped into very salty water?',
        holdSeconds: 0,
        cell: 'animal',
        around: 'salty',
        choices: [
          { label: 'It swells up with water' },
          { label: 'Water moves out and the cell shrinks', correct: true },
          { label: 'Nothing — the membrane keeps all the water in' },
        ],
        story: [
          'There is more salt outside the cell than inside.',
          'Water moves out through the cell membrane, towards the salty side.',
          'The cell loses water and shrivels up.',
        ],
        educationalNote: 'Water moves across the membrane towards the saltier side. Outside was saltier, so water left and the cell shrank.',
      },
      {
        id: 'l2-pure',
        title: 'Into pure water',
        description: 'Predict what an animal cell does in pure water, then watch.',
        question: 'What do you think will happen to an animal cell dropped into pure water?',
        holdSeconds: 0,
        cell: 'animal',
        around: 'pure',
        choices: [
          { label: 'Water rushes in until the cell bursts', correct: true },
          { label: 'The cell shrinks' },
          { label: 'It fills up, then the cell wall stops it' },
        ],
        story: [
          'Now the inside of the cell is saltier than the water around it.',
          'Water moves in through the membrane, and the cell swells.',
          'An animal cell has no cell wall to hold it — so it bursts.',
        ],
        educationalNote: 'Water moved in towards the saltier inside. With only a thin membrane and no cell wall, nothing stopped the cell swelling until it burst.',
      },
      {
        id: 'l2-balanced',
        title: 'Just right',
        description: 'Predict what happens when the water outside is exactly as salty as inside.',
        question: 'What do you think will happen if the water outside is just as salty as the inside of the cell?',
        holdSeconds: 0,
        cell: 'animal',
        around: 'same',
        choices: [
          { label: 'The cell bursts' },
          { label: 'The cell shrinks' },
          { label: 'The cell stays the same size', correct: true },
        ],
        story: [
          'Inside and outside are equally salty.',
          'Water still crosses the membrane — but just as much comes in as goes out.',
          'So the cell keeps its size. Blood keeps your cells in water like this.',
        ],
        educationalNote: 'With the same saltiness on both sides, water moved in and out equally, so the cell stayed the same size.',
      },
      {
        id: 'l2-plant-pure',
        title: 'Now a plant cell',
        description: 'Predict what a plant cell does in pure water, then watch.',
        question: 'A plant cell goes into pure water too. What do you think will happen?',
        holdSeconds: 0,
        cell: 'plant',
        around: 'pure',
        choices: [
          { label: 'It bursts, just like the animal cell' },
          { label: 'It fills up and goes firm, but does not burst', correct: true },
          { label: 'It shrinks' },
        ],
        story: [
          'Water moves into the plant cell, filling its central vacuole.',
          'The vacuole pushes out against the rigid cell wall.',
          'The wall holds firm — the cell goes stiff instead of bursting.',
        ],
        educationalNote: 'The plant cell took in water just like the animal cell, but its rigid cell wall stopped it bursting. That firmness keeps plants upright.',
      },
      {
        id: 'l2-plant-salty',
        title: 'Plant cell in salt',
        description: 'Predict what a plant cell does in salty water, then watch.',
        question: 'What do you think will happen to a plant cell in very salty water?',
        holdSeconds: 0,
        cell: 'plant',
        around: 'salty',
        choices: [
          { label: 'The cell wall stops any water leaving' },
          { label: 'It bursts' },
          { label: 'Water leaves and the inside pulls away from the wall', correct: true },
        ],
        story: [
          'Water moves out of the plant cell, towards the salty side.',
          'The vacuole shrinks and the membrane pulls away from the cell wall.',
          'The wall keeps its shape, but the cell inside goes limp.',
        ],
        educationalNote: 'The cell wall does not control what moves in and out — the membrane does. Water left, so the inside shrank away from the wall.',
      },
    ],
    briefing: {
      title: 'Water in, water out.',
      lead: 'Water moves through the cell membrane towards the saltier side. Predict what each cell will do, then watch it happen.',
      points: [
        'The cell membrane lets water through.',
        'An animal cell has a membrane but no cell wall. A plant cell has both.',
        'A wrong prediction costs a star — but you see what really happens and can try again.',
      ],
      cta: 'Start predicting',
    },
    debrief: {
      title: 'You can predict where water goes.',
      body: 'Water moves across the cell membrane towards the saltier side. Salty water pulls water out and cells shrink; pure water pushes water in. An animal cell has no cell wall, so it can burst — a plant cell’s wall holds it firm.',
      points: [
        'Saltier outside → water leaves → the cell shrinks.',
        'Pure water outside → water enters → an animal cell can burst.',
        'Cell wall → keeps a plant cell from bursting.',
      ],
    },
    keyTerms: [
      { term: 'Cell membrane', meaning: 'The thin layer around every cell. It controls what moves in and out, including water.' },
      { term: 'Cell wall', meaning: 'A rigid layer outside a plant cell’s membrane. Animal cells do not have one.' },
      { term: 'Osmosis', meaning: 'Water moving across a membrane towards the saltier side.' },
    ],
    sim: {
      // Change in water %, per second, for each kind of surrounding water.
      perSec: { pure: 13, salty: -13, same: 0 },
      plantStart: 60,
      animalStart: 60,
      minWater: 12,
      // Long enough for every story line to rise in and be read.
      watchSeconds: 11,
      // Read as: 3 stars with no wrong predictions, 2 with one or two, 1 with more.
      starsByMisses: [3, 2, 2, 1],
    },
  },

  {
    id: 'l3',
    number: 3,
    name: 'Cell Doctor',
    focus: 'diagnosis',
    icon: '🩺',
    accent: '#d1544f',
    unlocksAfter: 'l2',
    goal: 'One of the cell’s jobs has stopped. Read the job meters, name the organelle that broke and fix it.',
    objective: 'Fix every sick cell',
    // `broken` is the right answer: the organelle ids (see ORGANELLES) that
    // failed. Each organelle runs one job meter, so a broken one drops its
    // meter. `hint` is shown after a wrong guess.
    quests: [
      {
        id: 'l3-power-cut',
        title: 'The power cut',
        description: 'This cell has plenty of food but no energy. Find out why.',
        question: 'The cell has glucose and oxygen, but no energy. Which organelle broke?',
        holdSeconds: 0,
        broken: ['mitochondrion'],
        hint: 'Which organelle releases energy from glucose?',
        story: [
          'You repair the mitochondria.',
          'They break down glucose again, and energy flows back into the cell.',
        ],
        educationalNote: 'Mitochondria release the energy stored in glucose. With them broken, the food was there but the energy never came out.',
      },
      {
        id: 'l3-no-proteins',
        title: 'Nothing to build with',
        description: 'This cell cannot repair itself. Find out why.',
        question: 'The cell has stopped making the proteins it needs. Which organelle broke?',
        holdSeconds: 0,
        broken: ['ribosome'],
        hint: 'Look for the tiny dots on the endoplasmic reticulum.',
        story: [
          'You fix the ribosomes.',
          'They start building proteins again, and the cell can repair itself.',
        ],
        educationalNote: 'Ribosomes are tiny structures that build proteins. Without them, the cell had nothing to grow or repair itself with.',
      },
      {
        id: 'l3-leaky',
        title: 'The leaky cell',
        description: 'Anything can get into this cell. Find out why.',
        question: 'Harmful substances are getting in and useful ones are leaking out. Which part broke?',
        holdSeconds: 0,
        broken: ['membrane'],
        hint: 'Which part controls what enters and leaves the cell?',
        story: [
          'You patch the cell membrane.',
          'It controls what moves in and out again, keeping the useful things inside.',
        ],
        educationalNote: 'The cell membrane is a selective barrier. Broken, it could no longer choose what came in and what went out.',
      },
      {
        id: 'l3-clutter',
        title: 'The cluttered cell',
        description: 'Waste is piling up in this cell. Find out why.',
        question: 'Waste and worn-out parts are piling up inside the cell. Which organelle broke?',
        holdSeconds: 0,
        broken: ['lysosome'],
        hint: 'Which organelle breaks down waste?',
        story: [
          'You fix the lysosomes.',
          'They break down the waste and worn-out parts, and the cell is clean again.',
        ],
        educationalNote: 'Lysosomes hold chemicals that break down waste and worn-out parts. Without them, the rubbish just built up.',
      },
      {
        id: 'l3-lost-control',
        title: 'No instructions',
        description: 'This cell’s activities have lost control. Find out why.',
        question: 'The cell’s activities are out of control — nothing is following instructions. Which organelle broke?',
        holdSeconds: 0,
        broken: ['nucleus'],
        hint: 'Which organelle holds the DNA?',
        story: [
          'You repair the nucleus.',
          'Its DNA instructions reach the rest of the cell again, and every job gets back on track.',
        ],
        educationalNote: 'The nucleus holds the DNA — the cell’s instructions — and controls the cell’s activities.',
      },
      {
        id: 'l3-double',
        title: 'Double trouble',
        description: 'Two things are wrong with this cell. Find both.',
        question: 'Two jobs have stopped this time. Which two organelles broke?',
        holdSeconds: 0,
        broken: ['golgi', 'mitochondrion'],
        hint: 'Check the Energy and Proteins shipped meters.',
        story: [
          'You fix the Golgi apparatus and the mitochondria.',
          'Proteins are packed and shipped again, and energy flows back in.',
        ],
        educationalNote: 'The Golgi apparatus packs proteins and sends them where they are needed; the mitochondria release energy. Fixing only one would not have been enough.',
      },
    ],
    briefing: {
      title: 'These cells are sick.',
      lead: 'Every organelle has a job. In each cell one job has stopped — read the job meters and work out which organelle broke.',
      points: [
        'A low meter shows which job has stopped.',
        'Pick the organelle that does that job, then fix it.',
        'A wrong guess costs a star — but you get a hint and can try again.',
      ],
      cta: 'Start the check-up',
    },
    debrief: {
      title: 'You know what each organelle does.',
      body: 'Each organelle does one job for the cell. When a job stops, the organelle that does it is the one to fix: no energy means the mitochondria, no proteins means the ribosomes, waste piling up means the lysosomes.',
      points: [
        'Mitochondria → energy. Ribosomes → proteins. Golgi → packing and shipping.',
        'Lysosomes → break down waste. Cell membrane → controls what enters and leaves.',
        'Nucleus → holds the DNA and controls the cell.',
      ],
    },
    keyTerms: [
      { term: 'Organelle', meaning: 'A tiny part inside a cell that does one job.' },
      { term: 'Lysosome', meaning: 'An organelle that breaks down waste and worn-out parts.' },
      { term: 'Golgi apparatus', meaning: 'Packs proteins and sends them where they are needed.' },
    ],
    sim: {
      // Job meter levels, in %, for a working and a broken organelle.
      healthyJob: 88,
      brokenJob: 8,
      sickHealth: 25,
      recoverPerSec: 14,
      // Long enough for the verdict and both story lines to be read.
      fixSeconds: 10,
      starsByMisses: [3, 2, 2, 1],
    },
  },
];

// The organelles the cell view draws and Level 3 can name. `job` is the meter
// that organelle runs in Level 3.
export const ORGANELLES = [
  { id: 'nucleus', name: 'Nucleus', icon: '🧬', job: 'Following instructions' },
  { id: 'membrane', name: 'Cell membrane', icon: '🛡️', job: 'Controlling entry' },
  { id: 'mitochondrion', name: 'Mitochondria', icon: '⚡', job: 'Energy' },
  { id: 'ribosome', name: 'Ribosomes', icon: '🔩', job: 'Proteins made' },
  { id: 'golgi', name: 'Golgi apparatus', icon: '📦', job: 'Proteins shipped' },
  { id: 'lysosome', name: 'Lysosomes', icon: '🧹', job: 'Waste cleared' },
];

export function getLevel(id) {
  return LEVELS.find((level) => level.id === id) ?? null;
}
