// Week 14 quizzes — Grade 7 Science: Plant and Animal Cells

export const QUIZZES_WEEK_14 = {
  // ── Lesson 40: Comparing Plant and Animal Cells — matching ───────────────
  "lesson-40": {
    lessonId: "lesson-40",
    title: "Comparing Plant and Animal Cells",
    description: "Match each organelle or structure to the correct cell type — plant only, animal only, or both.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question: "Match each organelle or structure to the cell type(s) in which it is found.",
        leftItems: [
          "Chloroplast",
          "Centriole",
          "Central Vacuole",
          "Mitochondria",
          "Cell Wall (cellulose)",
          "Nucleus",
        ],
        rightItems: [
          "Plant Cell Only",
          "Animal Cell Only",
          "Both Plant and Animal Cells",
        ],
        correctPairs: {
          "Chloroplast": "Plant Cell Only",
          "Centriole": "Animal Cell Only",
          "Central Vacuole": "Plant Cell Only",
          "Mitochondria": "Both Plant and Animal Cells",
          "Cell Wall (cellulose)": "Plant Cell Only",
          "Nucleus": "Both Plant and Animal Cells",
        },
        points: 15,
      },
    ],
  },

  // ── Lesson 41: Unique Structures in Plant Cells — identification ──────────
  "lesson-41": {
    lessonId: "lesson-41",
    title: "Unique Structures in Plant Cells",
    description: "Identify the plant cell structure being described in each question.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question: "What plant organelle contains chlorophyll and is the site where photosynthesis takes place?",
        correctAnswer: "chloroplast",
        acceptedAnswers: ["chloroplast", "chloroplasts"],
        points: 5,
      },
      {
        id: "q2",
        type: "identification",
        question: "What is the name of the pressure exerted by water in the central vacuole against the cell wall that keeps non-woody plants firm and upright?",
        correctAnswer: "turgor pressure",
        acceptedAnswers: ["turgor pressure", "turgor"],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question: "What tough carbohydrate makes up the plant cell wall, giving it rigidity and tensile strength?",
        correctAnswer: "cellulose",
        acceptedAnswers: ["cellulose"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question: "What type of plastid stores starch in plant roots and tubers such as potatoes?",
        correctAnswer: "leucoplast",
        acceptedAnswers: ["leucoplast", "leucoplasts", "amyloplast", "amyloplasts"],
        points: 5,
      },
      {
        id: "q5",
        type: "identification",
        question: "What is the green pigment inside chloroplasts that absorbs light energy for photosynthesis?",
        correctAnswer: "chlorophyll",
        acceptedAnswers: ["chlorophyll"],
        points: 5,
      },
    ],
  },

  // ── Lesson 42: Unique Structures in Animal Cells — ordering ──────────────
  "lesson-42": {
    lessonId: "lesson-42",
    title: "Unique Structures in Animal Cells",
    description: "Arrange the events of lysosome function in the correct order from start to finish.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "ordering",
        question: "Arrange the following events of lysosome function in the correct order:",
        items: [
          "A white blood cell detects and engulfs a bacterium through phagocytosis",
          "A membrane-bound phagosome forms around the captured bacterium inside the cell",
          "Lysosomes move toward the phagosome within the cytoplasm",
          "The lysosome membrane fuses with the phagosome membrane",
          "Digestive enzymes are released directly onto the bacterium",
          "The broken-down fragments are either recycled by the cell or expelled through the membrane",
        ],
        points: 15,
      },
    ],
  },
};
