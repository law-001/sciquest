// Week 19 quizzes — Grade 7 Science: Energy Flow in the Circle of Life

export const QUIZZES_WEEK_19 = {
  // ── w19-l1: Energy Flow in the Circle of Life — mixed ─────────────────────
  "w19-l1": {
    lessonId: "w19-l1",
    title: "Energy Flow in the Circle of Life",
    description:
      "Test your understanding of ecological pyramids, the difference between energy flow and nutrient cycling, and the ways species interact.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question:
          "What is the name of the diagram showing the decreasing energy available at each trophic level, always widest at the base?",
        correctAnswer: "energy pyramid",
        acceptedAnswers: [
          "energy pyramid",
          "ecological pyramid",
          "pyramid of energy",
          "trophic pyramid",
        ],
        points: 5,
      },
      {
        id: "q2",
        type: "identification",
        question:
          "According to the 10% rule, if the producers in an ecosystem hold 10,000 kcal of energy, how much is available to the primary consumers?",
        correctAnswer: "1,000 kcal",
        acceptedAnswers: [
          "1000 kcal",
          "1,000 kcal",
          "1000",
          "1,000",
          "one thousand kcal",
        ],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question:
          "What happens to the roughly 90% of energy that is NOT passed from one trophic level to the next?",
        correctAnswer: "lost as heat",
        acceptedAnswers: [
          "lost as heat",
          "released as heat",
          "used for metabolism",
          "heat energy",
          "dissipated as heat",
          "it is lost as heat",
        ],
        points: 5,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question:
          "Which type of ecological pyramid can NEVER be inverted?",
        options: [
          "Pyramid of numbers",
          "Pyramid of biomass",
          "Pyramid of energy",
          "All three can be inverted",
        ],
        correctAnswer: "Pyramid of energy",
        points: 5,
        explanation:
          "Energy always decreases as it moves up, so an energy pyramid is always widest at the base. Pyramids of numbers and biomass can invert — one large oak tree supports thousands of insects, and fast-breeding ocean phytoplankton have less biomass than the animals eating them.",
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "Which statement correctly describes energy and nutrients in an ecosystem?",
        options: [
          "Both energy and nutrients cycle round endlessly",
          "Both energy and nutrients flow one way and are lost",
          "Energy flows one way and is lost as heat; nutrients cycle and are reused",
          "Nutrients flow one way and are lost; energy cycles and is reused",
        ],
        correctAnswer:
          "Energy flows one way and is lost as heat; nutrients cycle and are reused",
        points: 5,
        explanation:
          "This is the central idea of ecology. Energy enters from the sun, passes upward losing 90% at each step, and is lost permanently as heat. Nutrients such as carbon and nitrogen are recycled indefinitely by decomposers.",
      },
      {
        id: "q6",
        type: "matching",
        question:
          "Match each type of species interaction to its correct description.",
        leftItems: [
          "Mutualism",
          "Commensalism",
          "Parasitism",
          "Predation",
          "Competition",
        ],
        rightItems: [
          "Both species benefit (+/+) — bees and flowers",
          "One benefits, the other is unaffected (+/0) — barnacles on a whale",
          "One benefits at the other's expense (+/−) — a tapeworm in an intestine",
          "One kills and eats the other (+/−) — a hawk and a mouse",
          "Both are harmed as they compete for the same resource (−/−)",
        ],
        correctPairs: {
          Mutualism: "Both species benefit (+/+) — bees and flowers",
          Commensalism:
            "One benefits, the other is unaffected (+/0) — barnacles on a whale",
          Parasitism:
            "One benefits at the other's expense (+/−) — a tapeworm in an intestine",
          Predation: "One kills and eats the other (+/−) — a hawk and a mouse",
          Competition:
            "Both are harmed as they compete for the same resource (−/−)",
        },
        points: 15,
      },
      {
        id: "q7",
        type: "ordering",
        question:
          "Arrange the levels of ecological organisation from SMALLEST to LARGEST:",
        items: [
          "Organism — a complete living thing",
          "Population — all individuals of one species in an area",
          "Community — all populations of different species in an area",
          "Ecosystem — the community plus its non-living environment",
          "Biosphere — all ecosystems on Earth",
        ],
        points: 15,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Explain why top predators such as eagles and sharks are always rare compared with the organisms they eat.",
        points: 10,
        rubric:
          "Should apply the 10% rule: only about 10% of the energy at each trophic level passes to the next, so by the time energy reaches the top predator only a tiny fraction of the original remains. There is simply not enough energy available at that level to support many individuals, which is why top predators are scarce and need very large territories.",
      },
    ],
  },

  // ── w19-l2: 3D Ecosystem Diorama — short-answer and essay ─────────────────
  "w19-l2": {
    lessonId: "w19-l2",
    title: "3rd Performance Task: 3D Ecosystem Diorama",
    description:
      "Plan your diorama and show that you understand the ecosystem you are modelling before you start building.",
    timeLimit: 1200,
    questions: [
      {
        id: "q1",
        type: "short-answer",
        question:
          "Name the ecosystem you have chosen and list at least eight organisms that genuinely live there. Label each one as a producer, a primary consumer, a secondary or tertiary consumer, or a decomposer.",
        points: 10,
        rubric:
          "Should name one specific ecosystem and list at least eight organisms that plausibly coexist in it. All four roles must be represented, including at least one decomposer — the most commonly forgotten category.",
      },
      {
        id: "q2",
        type: "short-answer",
        question:
          "Describe the abiotic (non-living) components you will include in your diorama, and explain why they are part of the ecosystem.",
        points: 10,
        rubric:
          "Should name at least three abiotic factors appropriate to the chosen ecosystem — water, soil, rocks, sunlight, air, temperature. Should explain that an ecosystem is defined as the living community PLUS the non-living environment it depends on, so abiotic factors are genuinely part of it rather than just scenery.",
      },
      {
        id: "q3",
        type: "short-answer",
        question:
          "Write out one food chain from your ecosystem with at least four organisms, using arrows. Then explain which way your arrows point and why.",
        points: 10,
        rubric:
          "Should give a valid four-organism chain from the chosen ecosystem using arrows, for example Grass → Grasshopper → Frog → Snake. Must state that arrows point from the organism being eaten toward the organism eating it, because the arrow shows the direction energy flows.",
      },
      {
        id: "q4",
        type: "short-answer",
        question:
          "Choose one species interaction you will show in your diorama. Name the type of interaction, the two organisms involved, and explain how each one is affected.",
        points: 10,
        rubric:
          "Should name a specific interaction type (mutualism, commensalism, parasitism, predation, or competition), identify both organisms, and correctly state the effect on each using the +/−/0 logic — for example clownfish and sea anemone as mutualism, where both benefit.",
      },
      {
        id: "q5",
        type: "essay",
        question:
          "Choose ONE organism from your diorama and predict in detail what would happen to the rest of the ecosystem if it were removed. Trace the effects through at least three other organisms and explain whether the ecosystem would be likely to recover.",
        minWords: 120,
        points: 25,
      },
    ],
  },
};
