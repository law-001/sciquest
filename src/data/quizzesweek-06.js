// Week 6 quizzes — Grade 7 Science: Solubility of Matter

export const QUIZZES_WEEK_06 = {
  // ── w06-l1: Solubility of Matter: Solute and Solvent — mixed ──────────────
  "w06-l1": {
    lessonId: "w06-l1",
    title: "Solubility of Matter: Solute and Solvent",
    description:
      "Test your understanding of solutes, solvents, types of mixtures, solubility, and the rate of dissolving.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question:
          "In saltwater, the salt is the solvent and the water is the solute.",
        correctAnswer: false,
        points: 5,
        explanation:
          "It is the other way round. Salt is the solute (the substance that dissolves) and water is the solvent (the substance doing the dissolving). The solvent is normally present in the larger amount.",
      },
      {
        id: "q2",
        type: "true-false",
        question:
          "Muddy water is an example of a suspension because the soil particles eventually settle to the bottom.",
        correctAnswer: true,
        points: 5,
        explanation:
          "In a suspension the dispersed particles are large enough to settle out under gravity. Muddy water is the classic example — the mud is not dissolved and will settle if left undisturbed.",
      },
      {
        id: "q3",
        type: "true-false",
        question:
          "Milk is classified as a solution because it looks uniform and does not separate on its own.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Milk is a colloid, not a solution. Its fat droplets are too small to settle but large enough to scatter light — which is why a torch beam is visible passing through it (the Tyndall effect).",
      },
      {
        id: "q4",
        type: "true-false",
        question:
          "Solubility and rate of dissolving mean the same thing.",
        correctAnswer: false,
        points: 5,
        explanation:
          "They are different questions. Solubility is HOW MUCH solute can dissolve in total at a given temperature. Rate of dissolving is HOW FAST it dissolves. Stirring speeds up the rate but does not change the solubility at all.",
      },
      {
        id: "q5",
        type: "matching",
        question: "Match each solubility term to its correct definition.",
        leftItems: [
          "Solubility",
          "Saturated solution",
          "Unsaturated solution",
          "Supersaturated solution",
          "Like dissolves like",
          "Surface area",
        ],
        rightItems: [
          "The maximum amount of solute that can dissolve in a solvent at a given temperature",
          "A solution holding the maximum amount of solute possible at that temperature",
          "A solution holding less solute than the maximum possible at that temperature",
          "A solution holding more dissolved solute than is normally possible — an unstable state",
          "A rule stating that polar solvents dissolve polar solutes and non-polar solvents dissolve non-polar solutes",
          "The amount of solute exposed to the solvent — increased by crushing the solute into smaller pieces",
        ],
        correctPairs: {
          Solubility:
            "The maximum amount of solute that can dissolve in a solvent at a given temperature",
          "Saturated solution":
            "A solution holding the maximum amount of solute possible at that temperature",
          "Unsaturated solution":
            "A solution holding less solute than the maximum possible at that temperature",
          "Supersaturated solution":
            "A solution holding more dissolved solute than is normally possible — an unstable state",
          "Like dissolves like":
            "A rule stating that polar solvents dissolve polar solutes and non-polar solvents dissolve non-polar solutes",
          "Surface area":
            "The amount of solute exposed to the solvent — increased by crushing the solute into smaller pieces",
        },
        points: 15,
      },
      {
        id: "q6",
        type: "short-answer",
        question:
          "A student wants to dissolve table salt in water as quickly as possible. Describe THREE specific actions the student could take, and give the scientific reason for each one.",
        points: 10,
        rubric:
          "Should give three of: (1) heat the water — higher temperature means more kinetic energy and more frequent, forceful collisions with the solute; (2) stir the mixture — sweeps away saturated solvent and brings fresh solvent into contact; (3) crush the salt into finer grains — increases surface area exposed to the water. Each action must be paired with its reason.",
      },
      {
        id: "q7",
        type: "short-answer",
        question:
          "Why does a carbonated drink go flat faster when left open in a warm room than when kept in a cold refrigerator? Explain using what you know about the solubility of gases.",
        points: 10,
        rubric:
          "Should explain that carbon dioxide is a gas dissolved in the liquid under pressure. Unlike solids, the solubility of a gas DECREASES as temperature rises, and the CO₂ molecules also gain kinetic energy, so they escape the solution faster in a warm room. The cold refrigerator keeps CO₂ more soluble and slows its escape.",
      },
    ],
  },

  // ── w06-l2: Performance Task 2 — short-answer ─────────────────────────────
  "w06-l2": {
    lessonId: "w06-l2",
    title:
      "Creation of Performance Task 2: Solution Detectives — Exploring Solutes and Solvents in Everyday Life",
    description:
      "Plan your investigation and demonstrate that you can identify solutes, solvents, and mixture types before you begin.",
    timeLimit: 1200,
    questions: [
      {
        id: "q1",
        type: "short-answer",
        question:
          "List three household products you plan to test. For each one, identify what you expect the solute and the solvent to be, and explain how you decided.",
        points: 10,
        rubric:
          "Should name three real household products and give a reasonable solute and solvent for each. Full marks require an explanation of the reasoning, such as reading the ingredient list and noting that the substance present in the greatest amount (usually water) is the solvent.",
      },
      {
        id: "q2",
        type: "short-answer",
        question:
          "Describe the two tests you will use to classify each sample as a solution, a suspension, or a colloid. Explain what result each test gives for each of the three mixture types.",
        points: 10,
        rubric:
          "Should describe the settling test (leave standing ~30 minutes) and the Tyndall test (shine a torch beam through the sample). Solution: nothing settles, no visible beam. Colloid: nothing settles, beam clearly visible. Suspension: particles settle out to the bottom.",
      },
      {
        id: "q3",
        type: "short-answer",
        question:
          "Explain why a fair investigation requires you to use the same amount of each substance and to leave every sample standing for the same length of time.",
        points: 10,
        rubric:
          "Should explain that keeping the amount and the standing time constant makes them controlled variables, so that any difference between samples is caused by the mixture itself rather than by how it was tested. Should mention that ending the settling test too early could cause a suspension to be wrongly classified as a colloid.",
      },
      {
        id: "q4",
        type: "short-answer",
        question:
          "State two safety rules you must follow during this investigation, and explain the danger each one prevents.",
        points: 10,
        rubric:
          "Should give two of: never mix two cleaning products (mixing acid with a bleach-based cleaner releases toxic chlorine gas); never taste any sample (risk of poisoning); have an adult present when handling cleaning products; never use an unlabelled container (unknown hazard). Each rule must be paired with the specific danger it prevents.",
      },
    ],
  },
};
