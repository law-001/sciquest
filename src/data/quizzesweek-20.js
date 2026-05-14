// Week 20 quizzes — Grade 7 Science

export const QUIZZES_WEEK_20 = {
  "lesson-58": {
    lessonId: "lesson-58",
    title: "Energy Pyramid",
    description: "Test your knowledge of energy pyramids, the 10% rule, and how energy flows through trophic levels.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question: "What is the name of the diagram that shows the decreasing amount of energy available at each trophic level, always widest at the base?",
        correctAnswer: "Energy pyramid",
        acceptedAnswers: ["energy pyramid", "Energy Pyramid", "ecological pyramid", "trophic pyramid"],
        points: 5
      },
      {
        id: "q2",
        type: "identification",
        question: "According to the 10% energy rule, if producers have 10,000 kcal of energy, how much energy (in kcal) is available to primary consumers?",
        correctAnswer: "1,000 kcal",
        acceptedAnswers: ["1000 kcal", "1,000 kcal", "1000", "1,000", "one thousand kcal"],
        points: 5
      },
      {
        id: "q3",
        type: "identification",
        question: "What happens to the 90% of energy that is NOT passed on from one trophic level to the next?",
        correctAnswer: "Lost as heat",
        acceptedAnswers: ["lost as heat", "released as heat", "used for metabolism", "heat energy", "dissipated as heat"],
        points: 5
      },
      {
        id: "q4",
        type: "identification",
        question: "What type of ecological pyramid shows the COUNT (number) of organisms at each trophic level rather than the amount of energy or mass?",
        correctAnswer: "Pyramid of numbers",
        acceptedAnswers: ["pyramid of numbers", "Pyramid of Numbers", "numbers pyramid"],
        points: 5
      },
      {
        id: "q5",
        type: "identification",
        question: "Why are top predators (like eagles or sharks) always RARER than the organisms they eat in any ecosystem?",
        correctAnswer: "Because very little energy reaches the top of the pyramid",
        acceptedAnswers: [
          "because very little energy reaches the top of the pyramid",
          "10% rule — not enough energy to support many top predators",
          "energy decreases at each trophic level",
          "not enough energy available at higher trophic levels",
          "the 10% rule limits how many can be supported"
        ],
        points: 5
      }
    ]
  },

  "lesson-59": {
    lessonId: "lesson-59",
    title: "Levels of Biological Organization",
    description: "Test your knowledge of the nine levels of biological organization, from cell to biosphere.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question: "The smallest unit of life that can carry out all life processes is the ___. Groups of similar cells working together form a ___.",
        blanks: ["cell", "tissue"],
        points: 5
      },
      {
        id: "q2",
        type: "fill-blanks",
        question: "Multiple tissue types working together to perform a complex function form an ___. Groups of organs working together form an ___ system.",
        blanks: ["organ", "organ"],
        points: 5
      },
      {
        id: "q3",
        type: "fill-blanks",
        question: "All individuals of the SAME species living in the same area form a ___. All populations of DIFFERENT species in the same area form a ___.",
        blanks: ["population", "community"],
        points: 5
      },
      {
        id: "q4",
        type: "fill-blanks",
        question: "A community of living organisms PLUS all the non-living factors (water, soil, sunlight, temperature) in their environment together form an ___.",
        blanks: ["ecosystem"],
        points: 5
      },
      {
        id: "q5",
        type: "fill-blanks",
        question: "The largest level of biological organization — which includes ALL ecosystems on Earth, anywhere life exists — is called the ___.",
        blanks: ["biosphere"],
        points: 5
      }
    ]
  },

  "lesson-60": {
    lessonId: "lesson-60",
    title: "Ecosystem Interactions",
    description: "Test your understanding of symbiosis, mutualism, commensalism, parasitism, predation, and competition in ecosystems.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "ordering",
        question: "Arrange the levels of ecological organization in the correct order from SMALLEST to LARGEST:",
        items: [
          "Cell — the basic unit of life",
          "Tissue — groups of similar cells with the same function",
          "Organ — groups of different tissues working together",
          "Organism — a complete living thing (all organ systems working together)",
          "Population — all individuals of the same species in one area",
          "Community — all populations of different species in one area",
          "Ecosystem — community plus all non-living environmental factors",
          "Biosphere — all ecosystems on Earth"
        ],
        points: 15
      }
    ]
  }
};
