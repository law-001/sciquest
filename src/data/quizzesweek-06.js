// Week 6 quizzes — Grade 7 Science: Solutions and Solubility

export const QUIZZES_WEEK_06 = {
  // ── Lesson 16: Mixtures and Solutions — true-false ────────────────────────
  "lesson-16": {
    lessonId: "lesson-16",
    title: "Mixtures and Solutions",
    description: "Test your understanding of pure substances, mixtures, and how solutions are formed.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "A solution is a type of homogeneous mixture where the solute is evenly distributed throughout the solvent.",
        correctAnswer: true,
        points: 5,
        explanation: "A solution is defined as a homogeneous mixture — it has the same composition throughout, meaning the solute is evenly distributed in the solvent.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "In saltwater, the salt is the solvent and the water is the solute.",
        correctAnswer: false,
        points: 5,
        explanation: "In saltwater, salt is the solute (the substance that dissolves) and water is the solvent (the substance that does the dissolving). The solvent is always present in the larger amount.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Air is a pure substance because it has the same properties everywhere.",
        correctAnswer: false,
        points: 5,
        explanation: "Air is a mixture — specifically a homogeneous mixture (solution) of gases including nitrogen (78%), oxygen (21%), and other gases. A pure substance has a fixed chemical composition, which air does not.",
      },
      {
        id: "q4",
        type: "true-false",
        question: "Muddy water is an example of a suspension because the soil particles will eventually settle to the bottom.",
        correctAnswer: true,
        points: 5,
        explanation: "In a suspension, the dispersed particles are large enough to settle over time under gravity. Muddy water is a classic example — the mud particles are not dissolved and will settle if left undisturbed.",
      },
      {
        id: "q5",
        type: "true-false",
        question: "Milk is classified as a solution because it appears uniform and does not separate on its own.",
        correctAnswer: false,
        points: 5,
        explanation: "Milk is a colloid, not a solution. Although it appears uniform, it contains fat droplets dispersed in water that are intermediate in size — too small to settle easily but large enough to scatter light (Tyndall effect).",
      },
    ],
  },

  // ── Lesson 17: Solubility — matching ─────────────────────────────────────
  "lesson-17": {
    lessonId: "lesson-17",
    title: "Solubility",
    description: "Test your knowledge of solubility concepts by matching each term to its correct definition.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question: "Match each solubility term to its correct definition.",
        leftItems: [
          "Solubility",
          "Saturated solution",
          "Unsaturated solution",
          "Supersaturated solution",
          "Like dissolves like",
          "Solubility curve",
        ],
        rightItems: [
          "The maximum amount of solute that can dissolve in a solvent at a given temperature",
          "A solution that contains less dissolved solute than the maximum possible at that temperature",
          "A solution that contains more dissolved solute than is normally possible — an unstable state",
          "A graph showing how the solubility of a substance changes with temperature",
          "A rule stating that polar solvents dissolve polar solutes and non-polar solvents dissolve non-polar solutes",
          "A solution that has dissolved the maximum amount of solute possible at a given temperature",
        ],
        correctPairs: {
          "Solubility": "The maximum amount of solute that can dissolve in a solvent at a given temperature",
          "Saturated solution": "A solution that has dissolved the maximum amount of solute possible at a given temperature",
          "Unsaturated solution": "A solution that contains less dissolved solute than the maximum possible at that temperature",
          "Supersaturated solution": "A solution that contains more dissolved solute than is normally possible — an unstable state",
          "Like dissolves like": "A rule stating that polar solvents dissolve polar solutes and non-polar solvents dissolve non-polar solutes",
          "Solubility curve": "A graph showing how the solubility of a substance changes with temperature",
        },
        points: 15,
      },
    ],
  },

  // ── Lesson 18: Factors Affecting the Rate of Dissolving — short-answer ───
  "lesson-18": {
    lessonId: "lesson-18",
    title: "Factors Affecting the Rate of Dissolving",
    description: "Demonstrate your understanding of the factors that affect how quickly a solute dissolves in a solvent.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "short-answer",
        question: "Explain how particle size affects the rate of dissolving. Use a specific example in your answer.",
        points: 10,
        rubric: "Should mention that smaller particles have greater surface area exposed to the solvent, which increases contact between solute and solvent particles and therefore speeds up dissolving. A valid example: powdered sugar dissolves faster than a sugar cube because it has more surface area.",
      },
      {
        id: "q2",
        type: "short-answer",
        question: "A student wants to dissolve table salt in water as quickly as possible. Describe THREE specific actions the student could take to increase the rate of dissolving, and explain the reason for each action.",
        points: 10,
        rubric: "Should mention three of: (1) Increase temperature — higher temperature gives water molecules more kinetic energy, leading to more frequent and energetic collisions with the salt; (2) Stir or agitate the mixture — brings fresh water into contact with undissolved salt; (3) Use fine salt (smaller particles) instead of coarse salt — increases surface area exposed to water. Each action should be explained with its scientific reason.",
      },
      {
        id: "q3",
        type: "short-answer",
        question: "Why does a carbonated drink go flat faster when left open in a warm room compared to when it is kept in a cold refrigerator? Explain using your knowledge of factors affecting the rate of dissolving.",
        points: 10,
        rubric: "Should explain that carbon dioxide (CO₂) is a gas dissolved in the liquid under pressure. Higher temperature decreases the solubility of gases and increases the kinetic energy of CO₂ molecules, causing them to escape from the solution more rapidly. In a cold refrigerator, the lower temperature keeps the CO₂ more soluble and the gas escapes more slowly.",
      },
    ],
  },
};
