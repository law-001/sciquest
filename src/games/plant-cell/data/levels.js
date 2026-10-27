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
    // "Let's see what happens". The educationalNote explains the result.
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
        // Fades in line by line on the stage while the change plays out.
        story: [
          'The sun is blocked — no light reaches the leaves.',
          'No light means the chloroplasts can’t do photosynthesis.',
          'So no glucose or oxygen is made. The plant has to live off its glucose store.',
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
        // Fades in line by line on the stage while the change plays out.
        story: [
          'The soil dries out — no water climbs the stem.',
          'Water is an ingredient, so even in bright sun photosynthesis stops.',
          'No glucose or oxygen is made, and the plant starts using up its store.',
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
        // Fades in line by line on the stage while the change plays out.
        story: [
          'The stomata close — carbon dioxide can’t get into the leaf.',
          'Without carbon dioxide the chloroplasts have nothing to build glucose from.',
          'Photosynthesis stops: no glucose and no oxygen come out.',
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
        // Fades in line by line on the stage while the change plays out.
        story: [
          'The light drops to a dim 20%.',
          'The chloroplasts still work, but with less light they work slowly.',
          'Only a little glucose and oxygen trickle out, so the glucose store shrinks.',
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
        // Fades in line by line on the stage while the change plays out.
        story: [
          'Sunlight, water and carbon dioxide all go up to full.',
          'The chloroplasts have plenty of everything, so they run at top speed.',
          'Glucose is made fastest and the most oxygen streams out of the leaves.',
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
      // How long the change plays out before the prediction is marked — long
      // enough for every story line to fade in and be read.
      watchSeconds: 12,
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
    name: 'Plant Doctor',
    focus: 'diagnosis',
    icon: '🩺',
    accent: '#d1544f',
    unlocksAfter: 'l2',
    goal: 'Each plant has stopped making glucose. Spot the clue in the room, name what it is missing and fix it.',
    objective: 'Fix every sick plant',
    // Each quest is one sick plant. `missing` is what the room is starving it
    // of (the right answer), `scene` draws the clue into the room, and `hint`
    // is shown after a wrong guess. There is no isMet: the level screen
    // completes a round once the fix has played out.
    quests: [
      {
        id: 'l3-curtain',
        title: 'The dark corner',
        description: 'This plant is wilting. Find out what it is missing.',
        question: 'This plant has stopped making glucose. What is it missing?',
        holdSeconds: 0,
        missing: ['light'],
        scene: { curtain: true },
        hint: 'Look at the window.',
        story: [
          'You open the curtains — sunlight reaches the leaves again.',
          'The chloroplasts can make glucose again, and oxygen streams out.',
        ],
        educationalNote: 'The closed curtains blocked the sunlight. Without light energy, chloroplasts cannot make glucose.',
      },
      {
        id: 'l3-dry',
        title: 'The forgotten plant',
        description: 'This plant is wilting. Find out what it is missing.',
        question: 'This plant has stopped making glucose. What is it missing?',
        holdSeconds: 0,
        missing: ['water'],
        scene: { weather: 'drought' },
        hint: 'Look at the soil in the pot.',
        story: [
          'You water the soil — water climbs up the stem to the leaves.',
          'With water back, the chloroplasts make glucose again.',
        ],
        educationalNote: 'The cracked, dry soil meant no water reached the leaves. Water is one of the raw materials of photosynthesis.',
      },
      {
        id: 'l3-bag',
        title: 'The wrapped plant',
        description: 'This plant is wilting. Find out what it is missing.',
        question: 'This plant has stopped making glucose. What is it missing?',
        holdSeconds: 0,
        missing: ['co2'],
        scene: { bag: true },
        hint: 'Look at what is covering the plant.',
        story: [
          'You take the bag off — air reaches the leaves again.',
          'Carbon dioxide gets in through the stomata, so glucose is made again.',
        ],
        educationalNote: 'The sealed bag kept fresh air away, so no carbon dioxide could get in through the stomata.',
      },
      {
        id: 'l3-two',
        title: 'Double trouble',
        description: 'Two things are wrong with this plant. Find both.',
        question: 'Two things are wrong this time. What is the plant missing?',
        holdSeconds: 0,
        missing: ['light', 'water'],
        scene: { curtain: true, weather: 'drought' },
        hint: 'Check the window and the soil.',
        story: [
          'You open the curtains and water the soil.',
          'With light and water back, the chloroplasts start working again.',
        ],
        educationalNote: 'Photosynthesis needs all three ingredients. Fixing only one would not have been enough.',
      },
      {
        id: 'l3-night',
        title: 'The night shift',
        description: 'Nothing is covering this plant. So why has it stopped?',
        question: 'Nothing is blocking the window. Why has the plant stopped making glucose?',
        holdSeconds: 0,
        missing: ['light'],
        scene: { night: true },
        hint: 'Look outside the window. What time is it?',
        story: [
          'Morning comes — the sun rises and light pours in.',
          'Plants only make glucose when there is light, so they pause every night.',
        ],
        educationalNote: 'At night there is no sunlight, so photosynthesis stops. The plant lives off the glucose it stored during the day.',
      },
    ],
    briefing: {
      title: 'These plants are sick.',
      lead: 'In Levels 1 and 2 you learned that photosynthesis needs sunlight, water and carbon dioxide. Now each plant has stopped making glucose — your job is to work out why.',
      points: [
        'Look around the room for a clue: the window, the soil, the plant itself.',
        'Pick what the plant is missing, then fix it.',
        'A wrong guess costs a star — but you get a hint and can try again.',
      ],
      cta: 'Start the check-up',
    },
    debrief: {
      title: 'You can spot what a plant is missing.',
      body: 'A plant that has stopped making glucose is missing at least one ingredient. Clues in its surroundings tell you which: darkness means no sunlight, dry soil means no water, and anything sealing the leaves means no carbon dioxide.',
      points: [
        'Dark room or night → no sunlight.',
        'Dry, cracked soil → no water.',
        'Leaves sealed off → no carbon dioxide.',
      ],
    },
    // Shown in the sidebar, worded like the lessons' key terms.
    keyTerms: [
      { term: 'Photosynthesis', meaning: 'Chloroplasts use light energy to turn carbon dioxide and water into glucose and oxygen.' },
      { term: 'Chloroplast', meaning: 'The organelle where photosynthesis happens.' },
      { term: 'Stomata', meaning: 'Tiny holes in a leaf that let carbon dioxide in.' },
    ],
    sim: {
      // What a healthy plant has, in %. A sick plant has its `missing` inputs at 0.
      baseControls: { light: 70, water: 70, co2: 70 },
      // Plant health while sick (low enough to look wilted) and how fast it
      // recovers once fixed, in % per second.
      sickHealth: 25,
      recoverPerSec: 14,
      // How long the fix plays out before the round completes — long enough
      // for both story lines to rise in and be read.
      fixSeconds: 12,
      // Read as: 3 stars with no wrong guesses, 2 with one or two, 1 with more.
      starsByMisses: [3, 2, 2, 1],
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
