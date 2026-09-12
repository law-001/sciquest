// Week 4 quizzes — Grade 7 Science: Changes in the State of Matter
// Covered by the First Summative Test, so this quiz uses a wide mix of types.

export const QUIZZES_WEEK_04 = {
  // ── w04-l1: Changes in the State of Matter — mixed types ──────────────────
  "w04-l1": {
    lessonId: "w04-l1",
    title: "Changes in the State of Matter in Terms of Particle Arrangement",
    description:
      "Test your understanding of all six changes of state, the energy involved in each, and what the particles are doing.",
    timeLimit: 1800,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question:
          "Melting is an endothermic process, meaning the substance absorbs heat energy from its surroundings.",
        correctAnswer: true,
        points: 5,
        explanation:
          "During melting, heat energy is absorbed to break the attractions holding particles in the solid arrangement. This is why ice feels cold when you hold it — it is drawing heat away from your hand.",
      },
      {
        id: "q2",
        type: "fill-blanks",
        question:
          "Pure water melts and freezes at ___ °C. While a substance is changing state, its temperature stays ___ until the change is complete.",
        blanks: ["0", "constant"],
        points: 5,
        explanation:
          "The melting and freezing point of pure water is 0 °C. All absorbed energy goes into breaking bonds rather than raising the temperature, so the temperature holds steady during the change.",
      },
      {
        id: "q3",
        type: "identification",
        question:
          "What is the name of the change of state in which a solid turns directly into a gas without ever becoming a liquid?",
        correctAnswer: "sublimation",
        acceptedAnswers: ["sublimation", "sublimate", "subliming"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question:
          "What is the name of the change of state in which a gas turns directly into a solid, skipping the liquid stage — the process that forms frost?",
        correctAnswer: "deposition",
        acceptedAnswers: ["deposition", "depositing"],
        points: 5,
      },
      {
        id: "q5",
        type: "ordering",
        question:
          "Arrange these events in the correct order for what happens when a block of ice is heated until it becomes liquid water:",
        items: [
          "Heat energy is added to the ice",
          "Ice particles vibrate faster in their fixed positions",
          "The temperature reaches 0 °C and stops rising",
          "Attractions between particles begin to break",
          "Solid and liquid exist together while the temperature stays constant",
          "All the ice has melted and the temperature begins to rise again",
        ],
        points: 15,
      },
      {
        id: "q6",
        type: "matching",
        question:
          "Match each change of state to its correct description.",
        leftItems: [
          "Melting",
          "Freezing",
          "Evaporation",
          "Condensation",
          "Sublimation",
          "Deposition",
        ],
        rightItems: [
          "Solid → Liquid",
          "Liquid → Solid",
          "Liquid → Gas at the surface",
          "Gas → Liquid",
          "Solid → Gas, skipping liquid",
          "Gas → Solid, skipping liquid",
        ],
        correctPairs: {
          Melting: "Solid → Liquid",
          Freezing: "Liquid → Solid",
          Evaporation: "Liquid → Gas at the surface",
          Condensation: "Gas → Liquid",
          Sublimation: "Solid → Gas, skipping liquid",
          Deposition: "Gas → Solid, skipping liquid",
        },
        points: 15,
      },
      {
        id: "q7",
        type: "multiple-choice",
        question:
          "Which statement correctly describes the difference between evaporation and boiling?",
        options: [
          "Evaporation happens throughout the liquid; boiling happens only at the surface",
          "Evaporation happens only at the surface and at any temperature; boiling happens throughout the liquid at one specific temperature",
          "Evaporation and boiling are two words for exactly the same process",
          "Evaporation requires a higher temperature than boiling",
        ],
        correctAnswer:
          "Evaporation happens only at the surface and at any temperature; boiling happens throughout the liquid at one specific temperature",
        points: 5,
        explanation:
          "Evaporation occurs when the fastest particles escape from the surface, which can happen at any temperature. Boiling occurs when particles throughout the whole liquid have enough energy to escape, forming bubbles inside it — and only at the boiling point.",
      },
      {
        id: "q8",
        type: "multiple-choice",
        question:
          "Which list contains ONLY exothermic changes of state — changes that release heat to the surroundings?",
        options: [
          "Melting, evaporation, sublimation",
          "Freezing, condensation, deposition",
          "Melting, freezing, boiling",
          "Evaporation, condensation, sublimation",
        ],
        correctAnswer: "Freezing, condensation, deposition",
        points: 5,
        explanation:
          "Freezing, condensation, and deposition all move a substance toward a more ordered state, and all release energy. Melting, evaporation, and sublimation are the endothermic opposites — they absorb energy.",
      },
      {
        id: "q9",
        type: "short-answer",
        question:
          "Explain why the temperature of a melting substance stays constant even though heat is continuously being added to it.",
        points: 10,
        rubric:
          "Should explain that the added heat energy is used to break the attractive forces between particles rather than to increase their kinetic energy. Since temperature measures average kinetic energy, it does not rise while the change of state is happening.",
      },
      {
        id: "q10",
        type: "case-study",
        scenario:
          "Maria places a block of dry ice (solid carbon dioxide) in a bowl on the kitchen bench. Thick white fog pours over the sides of the bowl, but when she carefully touches the bench afterwards it is completely dry. A few hours later the block has disappeared entirely, leaving nothing behind. Meanwhile, on the cold window beside her, delicate white frost patterns have formed on the inside of the glass overnight.",
        points: 20,
        subQuestions: [
          {
            id: "q10-a",
            type: "multiple-choice",
            question:
              "What change of state did the dry ice undergo, and why was the bench left dry?",
            options: [
              "Melting — the liquid evaporated too quickly to notice",
              "Sublimation — carbon dioxide passed straight from solid to gas with no liquid stage",
              "Condensation — the solid absorbed water from the air",
              "Freezing — the block became colder and shrank",
            ],
            correctAnswer:
              "Sublimation — carbon dioxide passed straight from solid to gas with no liquid stage",
            points: 5,
          },
          {
            id: "q10-b",
            type: "true-false",
            question:
              "The frost on the window formed by deposition, which is an exothermic change.",
            correctAnswer: true,
            points: 5,
            explanation:
              "Water vapour in the air lost energy rapidly against the freezing glass and locked straight into ice crystals, skipping the liquid stage. Since the vapour released energy to the surroundings, deposition is exothermic.",
          },
          {
            id: "q10-c",
            type: "short-answer",
            question:
              "Maria's brother says sublimation and deposition are opposite processes. Do you agree? Use evidence from this scenario and explain what happens to the particles in each.",
            points: 10,
            rubric:
              "Should agree and explain that sublimation is solid → gas while deposition is gas → solid, and that both skip the liquid stage. Sublimation is endothermic (the dry ice absorbed energy so its particles could escape); deposition is exothermic (water vapour released energy so its particles could lock into ice crystals). Evidence: the dry ice vanished without wetting the bench; the frost appeared on the glass without any liquid water first.",
          },
        ],
      },
    ],
  },
};
