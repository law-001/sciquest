// Week 13 quizzes — Grade 7 Science: Plant and Animal Cell

export const QUIZZES_WEEK_13 = {
  // ── w13-l1: Plant and Animal Cell — mixed ─────────────────────────────────
  "w13-l1": {
    lessonId: "w13-l1",
    title: "Plant and Animal Cell",
    description:
      "Test your ability to compare plant and animal cells and to explain how each unique structure suits the way the organism lives.",
    timeLimit: 1200,
    questions: [
      {
        id: "q1",
        type: "matching",
        question:
          "Match each structure to the cell type or types in which it is found.",
        leftItems: [
          "Chloroplast",
          "Centriole",
          "Central vacuole",
          "Mitochondria",
          "Cell wall (cellulose)",
          "Cell membrane",
        ],
        rightItems: [
          "Plant Cell Only",
          "Animal Cell Only",
          "Both Plant and Animal Cells",
        ],
        correctPairs: {
          Chloroplast: "Plant Cell Only",
          Centriole: "Animal Cell Only",
          "Central vacuole": "Plant Cell Only",
          Mitochondria: "Both Plant and Animal Cells",
          "Cell wall (cellulose)": "Plant Cell Only",
          "Cell membrane": "Both Plant and Animal Cells",
        },
        points: 15,
      },
      {
        id: "q2",
        type: "identification",
        question:
          "What plant organelle contains chlorophyll and is the site where photosynthesis takes place?",
        correctAnswer: "chloroplast",
        acceptedAnswers: ["chloroplast", "chloroplasts"],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question:
          "What is the name of the pressure exerted by water in the central vacuole against the cell wall, which keeps non-woody plants firm and upright?",
        correctAnswer: "turgor pressure",
        acceptedAnswers: ["turgor pressure", "turgor"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question:
          "What tough carbohydrate makes up the plant cell wall and gives it its strength?",
        correctAnswer: "cellulose",
        acceptedAnswers: ["cellulose"],
        points: 5,
      },
      {
        id: "q5",
        type: "identification",
        question:
          "What type of plastid stores starch in plant roots and tubers such as potatoes?",
        correctAnswer: "leucoplast",
        acceptedAnswers: [
          "leucoplast",
          "leucoplasts",
          "amyloplast",
          "amyloplasts",
        ],
        points: 5,
      },
      {
        id: "q6",
        type: "multiple-choice",
        question:
          "A plant cell and an animal cell are both placed in pure distilled water. The plant cell swells firm and stops; the animal cell swells and bursts. Which structure explains the difference?",
        options: [
          "The nucleus",
          "The cell wall",
          "The mitochondria",
          "The ribosomes",
        ],
        correctAnswer: "The cell wall",
        points: 5,
        explanation:
          "The rigid cellulose cell wall resists the outward pressure once the plant cell is full, so swelling safely stops. The animal cell has only a flexible membrane with nothing to resist the pressure, so it keeps expanding until it ruptures.",
      },
      {
        id: "q7",
        type: "multiple-choice",
        question:
          "A potted plant droops after three days without water, then stands fully upright a few hours after being watered, with no visible damage. What happened?",
        options: [
          "The chloroplasts were destroyed and then regrew",
          "The central vacuoles lost water and turgor pressure, then refilled",
          "The cell walls dissolved and then reformed",
          "The mitochondria stopped and then restarted",
        ],
        correctAnswer:
          "The central vacuoles lost water and turgor pressure, then refilled",
        points: 5,
        explanation:
          "Wilting is a loss of turgor pressure, not damage. When the vacuoles lose water the cells go limp; refilling them restores the pressure and the plant stands again.",
      },
      {
        id: "q8",
        type: "ordering",
        question:
          "Arrange the events of lysosome function in the correct order:",
        items: [
          "A white blood cell detects and engulfs a bacterium by phagocytosis",
          "A membrane-bound phagosome forms around the captured bacterium",
          "Lysosomes move toward the phagosome through the cytoplasm",
          "The lysosome membrane fuses with the phagosome membrane",
          "Digestive enzymes are released onto the bacterium",
          "The broken-down fragments are recycled or expelled from the cell",
        ],
        points: 15,
      },
      {
        id: "q9",
        type: "short-answer",
        question:
          "Leaves are green, carrots are orange, and potato flesh is white — yet all three are made of plant cells. Explain what causes the three different colours.",
        points: 10,
        rubric:
          "Should explain that the difference is the type of plastid present. Leaves are packed with chloroplasts containing the green pigment chlorophyll; carrots contain chromoplasts holding orange carotenoid pigments; potato flesh contains colourless leucoplasts full of stored starch. All three are members of the plastid family.",
      },
    ],
  },
};
