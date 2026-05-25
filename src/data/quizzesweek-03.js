// Week 3 quizzes — Grade 7 Science: Changes in State of Matter

export const QUIZZES_WEEK_03 = {
  // ── Lesson 7: Melting and Freezing — all 10 slot types ────────────────────
  "lesson-7": {
    lessonId: "lesson-7",
    title: "Melting and Freezing",
    description:
      "Test your understanding of melting, freezing, and the energy changes involved.",
    timeLimit: 1200,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question:
          "Melting is an endothermic process, meaning the substance absorbs heat energy from its surroundings.",
        correctAnswer: true,
        points: 5,
        explanation:
          "During melting, heat energy is absorbed from the surroundings to break the bonds holding particles in the solid structure. This is why ice feels cold when you hold it — it is drawing heat away from your hand.",
      },
      {
        id: "q2",
        type: "fill-blanks",
        question:
          "Pure water melts and freezes at ___ °C. While a substance is changing state, its temperature stays ___ until the change is complete.",
        blanks: ["0", "constant"],
        points: 5,
        explanation:
          "The melting and freezing point of pure water is 0°C. All absorbed energy goes into breaking bonds rather than raising the temperature, so the temperature remains constant during the state change.",
      },
      {
        id: "q3",
        type: "identification",
        question:
          "What is the name of the process by which a solid changes into a liquid by absorbing heat energy?",
        correctAnswer: "melting",
        acceptedAnswers: ["melting", "fusion"],
        points: 5,
      },
      {
        id: "q4",
        type: "ordering",
        question:
          "Arrange the following events in the correct order for what happens when ice melts into liquid water:",
        items: [
          "Heat energy is added to the ice",
          "Ice particles begin to vibrate faster",
          "Bonds between particles start to break",
          "Temperature stays constant at 0°C",
          "All ice has turned into liquid water",
        ],
        points: 5,
      },
      {
        id: "q5",
        type: "matching",
        question: "Match each term to its correct description.",
        leftItems: ["Melting", "Freezing", "Melting point", "Endothermic", "Exothermic"],
        rightItems: [
          "Solid → Liquid",
          "Liquid → Solid",
          "Temperature at which a state change occurs",
          "Absorbs heat from surroundings",
          "Releases heat to surroundings",
        ],
        correctPairs: {
          "Melting": "Solid → Liquid",
          "Freezing": "Liquid → Solid",
          "Melting point": "Temperature at which a state change occurs",
          "Endothermic": "Absorbs heat from surroundings",
          "Exothermic": "Releases heat to surroundings",
        },
        points: 5,
      },
      {
        id: "q6",
        type: "multiple-choice",
        question:
          "A pure substance is being cooled from liquid to solid. Which statement best describes what happens to its temperature as it freezes?",
        options: [
          "The temperature drops steadily throughout the entire process",
          "The temperature stays constant until all the liquid has turned solid",
          "The temperature rises briefly before dropping again",
          "The temperature immediately drops to absolute zero",
        ],
        correctAnswer:
          "The temperature stays constant until all the liquid has turned solid",
        points: 5,
        explanation:
          "Freezing, like melting, is a state change that occurs at a fixed temperature. The energy released as bonds form between particles keeps the temperature constant until the entire substance has solidified.",
      },
      {
        id: "q7",
        type: "short-answer",
        question:
          "Explain why the temperature of a melting substance stays constant even though heat is continuously being added to it.",
        points: 10,
        rubric:
          "Should explain that the heat energy is used to break the bonds between particles (overcoming intermolecular forces) rather than increasing kinetic energy. Since temperature measures kinetic energy, it does not rise during the state change.",
      },
      {
        id: "q8",
        type: "essay",
        question:
          "Using your knowledge of particles and energy, describe what happens at the particle level when a block of ice is slowly heated until it completely melts into liquid water. Include the role of heat energy, particle movement, and bonding in your answer.",
        minWords: 80,
        points: 15,
      },
      {
        id: "q9",
        type: "picture-based",
        imageUrl: null,
        imageAlt:
          "A heating curve graph showing temperature (°C) on the y-axis and time on the x-axis. The line rises, then goes flat at 0°C, then rises again after all the ice has melted.",
        question:
          "The graph shows a heating curve for water being heated from −20°C. What is occurring during the flat (horizontal) section of the graph at 0°C?",
        options: [
          "The water is cooling down and releasing heat",
          "The ice is melting — heat energy is breaking bonds, not raising temperature",
          "The thermometer is broken and not recording correctly",
          "The substance is boiling and turning into steam",
        ],
        correctAnswer:
          "The ice is melting — heat energy is breaking bonds, not raising temperature",
        points: 5,
        explanation:
          "The flat section is the melting plateau. All added heat energy goes into breaking the bonds between water molecules in the ice rather than increasing particle kinetic energy, so the temperature does not rise until melting is complete.",
      },
      {
        id: "q10",
        type: "case-study",
        scenario:
          "Maria leaves a bar of chocolate on a sunny windowsill. After 30 minutes she notices the chocolate has turned from a solid bar into a puddle of liquid. She puts it in the freezer and an hour later it has hardened back into a solid. Maria's younger brother asks her why chocolate melts so easily compared to ice.",
        points: 15,
        subQuestions: [
          {
            id: "q10-a",
            type: "multiple-choice",
            question:
              "Why does chocolate melt at a lower temperature than water ice?",
            options: [
              "Chocolate contains more water than ice does",
              "Chocolate has a lower melting point because its particles need less energy to break free from each other",
              "Chocolate is darker in color and therefore absorbs more sunlight",
              "Ice always has a higher melting point than any food substance",
            ],
            correctAnswer:
              "Chocolate has a lower melting point because its particles need less energy to break free from each other",
            points: 5,
          },
          {
            id: "q10-b",
            type: "true-false",
            question:
              "When Maria placed the liquid chocolate in the freezer to re-solidify, the chocolate released heat energy to the surroundings.",
            correctAnswer: true,
            points: 5,
            explanation:
              "Freezing is an exothermic process. As liquid particles slow down and bond together to form a solid, they release the energy that was originally absorbed during melting.",
          },
          {
            id: "q10-c",
            type: "short-answer",
            question:
              "Maria's brother suggests that melting and freezing are opposite processes. Do you agree? Use evidence from this scenario to support your answer.",
            points: 5,
            rubric:
              "Should agree and explain that melting (solid → liquid) absorbs heat while freezing (liquid → solid) releases heat. Both occur at the same temperature for a pure substance. Evidence: chocolate melted on the windowsill (absorbed heat) and re-solidified in the freezer (released heat).",
          },
        ],
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
