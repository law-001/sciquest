// Week 3 quizzes — Grade 7 Science: Changes in State of Matter

export const QUIZZES_WEEK_03 = {
  // ── Lesson 7: Melting and Freezing — multiple-choice ─────────────────────
  "lesson-7": {
    lessonId: "lesson-7",
    title: "Melting and Freezing",
    description:
      "Test your understanding of melting, freezing, and the energy changes involved.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is the definition of melting?",
        options: [
          "A liquid changing into a gas when heated",
          "A solid changing directly into a gas",
          "A solid changing into a liquid when heat energy is added",
          "A gas changing into a liquid when cooled",
        ],
        correctAnswer: "A solid changing into a liquid when heat energy is added",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "At what temperature does pure water melt (and freeze) at standard atmospheric pressure?",
        options: ["100°C", "0°C", "37°C", "−273°C"],
        correctAnswer: "0°C",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Melting is described as an endothermic process. What does this mean?",
        options: [
          "The substance releases heat to the surroundings",
          "The substance absorbs heat energy from the surroundings",
          "The temperature of the substance rises continuously during melting",
          "The substance requires no energy to change state",
        ],
        correctAnswer: "The substance absorbs heat energy from the surroundings",
        points: 5,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question:
          "While a pure solid substance is melting at its melting point, what happens to its temperature?",
        options: [
          "It rises steadily as heat is added",
          "It falls because energy is released",
          "It stays constant until all the solid has melted",
          "It fluctuates randomly between two values",
        ],
        correctAnswer: "It stays constant until all the solid has melted",
        points: 5,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "Which of the following correctly describes the relationship between melting point and freezing point for a pure substance?",
        options: [
          "The freezing point is always lower than the melting point",
          "The freezing point is always higher than the melting point",
          "They are the same temperature for a pure substance",
          "They depend on the color and texture of the substance",
        ],
        correctAnswer: "They are the same temperature for a pure substance",
        points: 5,
      },
    ],
  },

  // ── Lesson 8: Evaporation and Condensation — true-false ──────────────────
  "lesson-8": {
    lessonId: "lesson-8",
    title: "Evaporation and Condensation",
    description:
      "Test your knowledge of evaporation, boiling, and condensation.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question:
          "Evaporation can only occur when a liquid is heated to its boiling point.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Evaporation occurs at the surface of a liquid at any temperature, as long as some surface particles have enough energy to escape. Boiling is the rapid form that occurs throughout the liquid at the boiling point.",
      },
      {
        id: "q2",
        type: "true-false",
        question:
          "Condensation is the process by which a gas loses heat energy and changes into a liquid.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Condensation is the reverse of evaporation. When a gas cools and loses energy, its particles slow down and come together to form a liquid.",
      },
      {
        id: "q3",
        type: "true-false",
        question:
          "Increasing the surface area of a liquid speeds up the rate of evaporation.",
        correctAnswer: true,
        points: 5,
        explanation:
          "A larger surface area exposes more liquid particles to the air at once, allowing more particles to escape as vapor per unit of time — so evaporation occurs faster.",
      },
      {
        id: "q4",
        type: "true-false",
        question:
          "Dew on grass in the morning forms because it rained during the night.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Dew forms through condensation. Water vapor in the warm air condenses onto cool grass and surfaces as the temperature drops overnight — it does not require rain.",
      },
      {
        id: "q5",
        type: "true-false",
        question:
          "High humidity in the air slows down the rate of evaporation from a liquid surface.",
        correctAnswer: true,
        points: 5,
        explanation:
          "When the air is already full of water vapor (high humidity), it cannot absorb much more. This reduces the rate at which liquid molecules escape from the surface, slowing evaporation.",
      },
    ],
  },

  // ── Lesson 9: Sublimation and Deposition — short-answer ──────────────────
  "lesson-9": {
    lessonId: "lesson-9",
    title: "Sublimation and Deposition",
    description:
      "Demonstrate your understanding of sublimation and deposition through short written answers.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "short-answer",
        question:
          "Explain the difference between sublimation and deposition. Give one real-life example of each process.",
        points: 10,
        rubric:
          "Should define sublimation as solid → gas (skipping liquid) and deposition as gas → solid (skipping liquid). Acceptable examples for sublimation: dry ice, iodine crystals, mothballs/naphthalene, camphor. Acceptable examples for deposition: frost on windows, snowflake formation in clouds.",
      },
      {
        id: "q2",
        type: "short-answer",
        question:
          "Why does dry ice appear to 'smoke' or produce a fog when left out at room temperature? Use the term sublimation in your answer.",
        points: 10,
        rubric:
          "Should explain that dry ice is solid carbon dioxide (CO₂). At normal atmospheric pressure, CO₂ cannot exist as a liquid, so it sublimates directly from solid to gas. The visible 'smoke' is actually cold CO₂ gas condensing the water vapor in the surrounding air into a visible fog. Should use the word sublimation correctly.",
      },
      {
        id: "q3",
        type: "short-answer",
        question:
          "A student leaves a tray of wet mothballs (naphthalene) in a closed room. After two weeks, the mothballs have become much smaller but there is no liquid on the tray. Explain what happened to the mothballs using your knowledge of state changes.",
        points: 10,
        rubric:
          "Should identify the process as sublimation — the solid naphthalene changed directly into naphthalene vapor (gas) without passing through the liquid state. Should mention that this happens because naphthalene has weak enough intermolecular forces to escape the solid state at room temperature. The absence of any liquid confirms that no melting occurred.",
      },
    ],
  },
};
