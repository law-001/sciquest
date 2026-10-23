// Plant Cell: Keep the Cell Alive — level configuration.
//
// Every level is described here (goal, tuning numbers, briefing + debrief text)
// and rendered by its own screen in ../levels. Tuning a level should never mean
// editing a component.
//
// Levels are worked through like the matter-state sandbox's challenges: each
// quest completes after its `isMet` condition holds for `holdSeconds` (0 = the
// moment it is true), and the run keeps going afterwards. Finishing every quest
// completes the level. `isMet` receives whatever its level screen passes in.

export const LEVELS = [
  {
    id: 'l1',
    number: 1,
    name: 'Power the Cell',
    focus: 'photosynthesis',
    icon: '☀️',
    accent: '#2f9e63',
    unlocksAfter: null,
    goal: 'Give the chloroplasts sunlight, water and carbon dioxide so they make enough glucose to keep the cell alive.',
    objective: 'Complete every photosynthesis quest',
    // Everything in this level comes from the Week 12 and 13 lessons:
    // photosynthesis, chloroplasts, chlorophyll, and the cell using glucose.
    // isMet(sim, controls)
    quests: [
      {
        id: 'l1-sunlight',
        title: 'Turn on the sunlight',
        description: 'Raise Sunlight past 70%. Chloroplasts need light to make glucose.',
        holdSeconds: 2,
        isMet: (sim, controls) => controls.light >= 70,
        educationalNote: 'Chloroplasts contain chlorophyll, a green pigment that absorbs light. That light energy powers photosynthesis.',
      },
      {
        id: 'l1-water',
        title: 'Give it water',
        description: 'Raise Water past 70%.',
        holdSeconds: 2,
        isMet: (sim, controls) => controls.water >= 70,
        educationalNote: 'Water is one of the raw materials chloroplasts use to make glucose.',
      },
      {
        id: 'l1-co2',
        title: 'Add carbon dioxide',
        description: 'Raise Carbon dioxide past 70%.',
        holdSeconds: 2,
        isMet: (sim, controls) => controls.co2 >= 70,
        educationalNote: 'Plants take carbon dioxide from the air. Photosynthesis turns carbon dioxide and water into glucose and oxygen.',
      },
      {
        id: 'l1-take-away',
        title: 'Take one away',
        description: 'Turn Carbon dioxide down to 0 and watch glucose-making stop.',
        holdSeconds: 2,
        isMet: (sim, controls) => controls.co2 <= 5 && sim.rate < 0.1,
        educationalNote: 'Photosynthesis needs all three: sunlight, water and carbon dioxide. Take any one away and the chloroplasts cannot make glucose.',
      },
      {
        id: 'l1-full-power',
        title: 'Make lots of glucose',
        description: 'Turn all three up so glucose is made at 90% or more for 3 seconds.',
        holdSeconds: 3,
        isMet: (sim) => sim.rate >= 0.9,
        educationalNote: 'With plenty of sunlight, water and carbon dioxide, chloroplasts make glucose fastest — and release the most oxygen.',
      },
    ],
    briefing: {
      title: 'Your plant cell needs energy to survive.',
      lead: 'Chloroplasts make glucose (food) by photosynthesis — but only while they get sunlight, water and carbon dioxide.',
      points: [
        'Sunlight + water + carbon dioxide → glucose + oxygen.',
        'Chloroplasts contain chlorophyll, the green pigment that absorbs light.',
        'The cell uses glucose for energy. With no glucose, the cell gets weaker.',
      ],
      cta: 'Start photosynthesis',
    },
    debrief: {
      title: 'You kept the cell alive with photosynthesis.',
      body: 'Chloroplasts are where photosynthesis happens. Their chlorophyll absorbs light, and that energy turns water and carbon dioxide into glucose and oxygen. The cell’s mitochondria then use the glucose for energy.',
      points: [
        'Chloroplast → the organelle where photosynthesis happens.',
        'Photosynthesis → glucose (food) + oxygen.',
        'It needs all three: sunlight, water and carbon dioxide.',
      ],
    },
    // Shown in the sidebar, worded like the lessons' key terms.
    keyTerms: [
      { term: 'Chloroplast', meaning: 'The organelle where photosynthesis happens. It contains chlorophyll.' },
      { term: 'Chlorophyll', meaning: 'The green pigment inside chloroplasts that absorbs light.' },
      { term: 'Photosynthesis', meaning: 'Chloroplasts use light energy to turn carbon dioxide and water into glucose and oxygen.' },
    ],
    sim: {
      glucoseStart: 34,
      healthStart: 65,
      productionPerSec: 15,
      demandPerSec: 8,
      deficitHealthPerSec: 9,
      regenHealthPerSec: 3.2,
      oxygenPerSec: 9,
      // Read as: 3 stars if the lowest health reached stayed at or above 55.
      starMinHealth: [0, 1, 30, 55],
    },
  },

  {
    id: 'l2',
    number: 2,
    name: 'What Happens If?',
    focus: 'prediction',
    icon: '🔮',
    accent: '#2bafa9',
    unlocksAfter: 'l1',
    goal: 'Predict what happens to photosynthesis when something changes, then watch it happen.',
    objective: 'Predict every change right',
    // Same photosynthesis model as Level 1, played as predictions. Each quest
    // is one round, so there is no isMet: the level screen completes a round
    // when the player's chosen answer is the one marked `correct`.
    // `change` is applied over sim.baseControls when the player presses
    // "Let's see it happen". The educationalNote explains the result.
    quests: [
      {
        id: 'l2-no-light',
        title: 'Block the sunlight',
        description: 'Predict what happens when the plant gets no sunlight, then watch.',
        question: 'What do you think will happen if the sunlight is blocked?',
        holdSeconds: 0,
        change: { light: 0 },
        choices: [
          { label: 'Nothing changes — it still has water and carbon dioxide' },
          { label: 'The chloroplasts stop making glucose', correct: true },
          { label: 'The plant makes glucose from water instead' },
        ],
        educationalNote: 'Chloroplasts use light energy to make glucose. With no sunlight they stopped, so the cell had to use up its glucose store instead.',
      },
      {
        id: 'l2-no-water',
        title: 'Take away the water',
        description: 'Predict what happens when the plant gets no water, then watch.',
        question: 'What do you think will happen if the plant gets no water?',
        holdSeconds: 0,
        change: { water: 0 },
        choices: [
          { label: 'Glucose-making stops, even in bright sunlight', correct: true },
          { label: 'Sunlight is enough to keep making glucose' },
          { label: 'The plant makes more oxygen' },
        ],
        educationalNote: 'Water is one of the raw materials of photosynthesis. Even in bright sunlight, chloroplasts cannot make glucose without it.',
      },
      {
        id: 'l2-stomata',
        title: 'Close the stomata',
        description: 'Predict what happens when no carbon dioxide can get into the leaf, then watch.',
        question: 'What do you think will happen if the leaf’s stomata close and no carbon dioxide can get in?',
        holdSeconds: 0,
        change: { co2: 0 },
        choices: [
          { label: 'Only oxygen stops — glucose keeps being made' },
          { label: 'The plant makes its own carbon dioxide and carries on' },
          { label: 'No glucose or oxygen is made', correct: true },
        ],
        educationalNote: 'Stomata are tiny holes in a leaf that let carbon dioxide in. With them closed, the chloroplasts had no carbon dioxide, so no glucose or oxygen was made.',
      },
      {
        id: 'l2-dim-light',
        title: 'Dim the sunlight',
        description: 'Predict what happens when the sunlight gets weak, then watch.',
        question: 'What do you think will happen if the sunlight drops to a dim 20%?',
        holdSeconds: 0,
        change: { light: 20 },
        choices: [
          { label: 'Glucose-making stops completely' },
          { label: 'Glucose is still made, but more slowly', correct: true },
          { label: 'Glucose is made faster than before' },
        ],
        educationalNote: 'Photosynthesis did not stop — it slowed down. With less light the chloroplasts make glucose more slowly, so the glucose store starts to shrink.',
      },
      {
        id: 'l2-full-power',
        title: 'Turn everything up',
        description: 'Predict what happens when all three are turned up to full, then watch.',
        question: 'What do you think will happen if sunlight, water and carbon dioxide are all turned up to full?',
        holdSeconds: 0,
        change: { light: 100, water: 100, co2: 100 },
        choices: [
          { label: 'Nothing changes' },
          { label: 'The plant makes too much glucose and gets sick' },
          { label: 'Glucose is made fastest and the most oxygen is released', correct: true },
        ],
        educationalNote: 'With plenty of sunlight, water and carbon dioxide, the chloroplasts worked at full speed — making glucose fastest and releasing the most oxygen.',
      },
    ],
    briefing: {
      title: 'What happens if…?',
      lead: 'In Level 1 you changed sunlight, water and carbon dioxide yourself. Now predict first: each round asks what will happen if something changes. Pick your answer, then watch it happen.',
      points: [
        'Photosynthesis needs sunlight, water and carbon dioxide.',
        'Watch the “Glucose being made” meter to see if you were right.',
        'A wrong prediction costs a star — but you see what really happens and can try again.',
      ],
      cta: 'Start predicting',
    },
    debrief: {
      title: 'You can predict what photosynthesis will do.',
      body: 'Chloroplasts need all three ingredients. Take away sunlight, water or carbon dioxide — even by closing the stomata — and glucose-making stops. Less of one ingredient slows it down, and plenty of all three runs it at full speed, releasing the most oxygen.',
      points: [
        'No sunlight, water or carbon dioxide → no glucose.',
        'Less of one ingredient → glucose is made more slowly.',
        'Stomata → tiny holes that let carbon dioxide into the leaf.',
      ],
    },
    // Shown in the sidebar, worded like the lessons' key terms.
    keyTerms: [
      { term: 'Chloroplast', meaning: 'The organelle where photosynthesis happens. It contains chlorophyll.' },
      { term: 'Photosynthesis', meaning: 'Chloroplasts use light energy to turn carbon dioxide and water into glucose and oxygen.' },
      { term: 'Stomata', meaning: 'Tiny holes in a leaf that let carbon dioxide in.' },
    ],
    sim: {
      // What the plant has before each round's change, in %.
      baseControls: { light: 70, water: 70, co2: 70 },
      // How long the change plays out before the prediction is marked.
      watchSeconds: 5,
      glucoseStart: 60,
      healthStart: 90,
      productionPerSec: 15,
      demandPerSec: 8,
      deficitHealthPerSec: 9,
      regenHealthPerSec: 3.2,
      oxygenPerSec: 9,
      // Read as: 3 stars with no wrong predictions, 2 with one or two, 1 with more.
      starsByMisses: [3, 2, 2, 1],
    },
  },

  {
    id: 'l3',
    number: 3,
    name: 'Cell Emergency',
    focus: 'diagnosis',
    icon: '🚨',
    accent: '#d1544f',
    unlocksAfter: 'l2',
    goal: 'One organelle has failed. Run tests, read the evidence, name the culprit and repair it.',
    objective: 'Complete every diagnosis quest',
    // isMet(caseState, fault)
    quests: [
      {
        id: 'l3-test',
        title: 'Run a test',
        description: 'Pick any test in the bottom bar and read its result.',
        holdSeconds: 0,
        isMet: (state) => state.revealed.length > 0,
        educationalNote: 'The monitors only say that something is wrong. Each test reports how one part of the cell is behaving, which narrows down where the fault is.',
      },
      {
        id: 'l3-rule-out',
        title: 'Rule something out',
        description: 'Find a test that comes back Normal.',
        holdSeconds: 0,
        isMet: (state, fault) => state.revealed.some((id) => fault.results[id].tone === 'normal'),
        educationalNote: 'A normal reading clears the organelle it tests. What is still working matters as much as what is not.',
      },
      {
        id: 'l3-diagnose',
        title: 'Name the fault',
        description: 'Choose the organelle the evidence points to and make the call.',
        holdSeconds: 0,
        isMet: (state) => state.phase !== 'investigate',
        educationalNote: 'A good diagnosis fits every result — the abnormal readings and the normal ones.',
      },
      {
        id: 'l3-repair',
        title: 'Repair the organelle',
        description: 'Hold the repair button until the organelle is rebuilt.',
        holdSeconds: 0,
        isMet: (state) => state.phase === 'recovering' || state.phase === 'done',
        educationalNote: 'Once the broken organelle works again, everything that depends on it can start back up.',
      },
      {
        id: 'l3-recover',
        title: 'Nurse the cell back',
        description: 'Watch the cell recover to full health.',
        holdSeconds: 0,
        isMet: (state) => state.phase === 'done',
        educationalNote: 'Organelles work together, so one fault shows up all over the cell — and fixing it lets the whole cell recover.',
      },
    ],
    // Shown in the sidebar, worded like the Week 12 and 13 key terms.
    keyTerms: [
      { term: 'Chloroplast', meaning: 'Makes glucose by photosynthesis.' },
      { term: 'Mitochondria', meaning: 'The powerhouse of the cell — gets energy from glucose (cellular respiration).' },
      { term: 'Vacuole', meaning: 'Stores water, nutrients and waste.' },
      { term: 'Cell membrane', meaning: 'Controls what moves into and out of the cell.' },
      { term: 'Nucleus', meaning: 'The control centre of the cell. It contains the DNA.' },
      { term: 'Cell wall', meaning: 'A rigid outer layer that gives a plant cell shape and support.' },
    ],
    briefing: {
      title: 'Something in this cell has stopped working.',
      lead: 'The monitors already show symptoms. Your job is to work out which organelle is behind them.',
      points: [
        'Run tests on the cell — each one reports how a part of the cell is behaving.',
        'A normal reading rules an organelle out. What is normal matters as much as what is not.',
        'Name the organelle only once the evidence fits. A wrong call costs the cell.',
      ],
      cta: 'Open the case',
    },
    debrief: {
      title: 'The cell is working again.',
      body: 'Organelles do not work alone. A fault in one of them shows up as symptoms all over the cell, so the readings that stay normal are as useful as the ones that do not — together they point at the part that actually failed.',
      points: [
        'Chloroplast → photosynthesis. Mitochondria → releasing usable energy from glucose.',
        'Vacuole → storage, especially water. Membrane → controlling what moves in and out.',
        'A problem in one organelle affects the whole cell.',
      ],
    },
    sim: {
      healthStart: 58,
      healthFloor: 20,
      declinePerSec: 0.55,
      testSeconds: 2.2,
      wrongGuessHealth: 8,
      recoverPerSec: 22,
      // Read as: 3 stars with no wrong diagnosis, 2 with one, 1 with two or more.
      starsByWrongGuesses: [3, 2, 1],
    },
  },
];

export function getLevel(id) {
  return LEVELS.find((level) => level.id === id) ?? null;
}

export function isLevelUnlocked(level, completedIds) {
  return !level.unlocksAfter || completedIds.includes(level.unlocksAfter);
}

// Stars come from per-level thresholds in `sim`. The measured value differs by
// level (lowest health, time in band), but the comparison is always the same.
export function starsForValue(thresholds, value) {
  let stars = 0;
  thresholds.forEach((min, index) => {
    if (value >= min) stars = index;
  });
  return stars;
}
