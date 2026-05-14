// Week 7 quizzes — Grade 7 Science: Concentration of Solutions

export const QUIZZES_WEEK_07 = {
  // ── Lesson 19: What is Concentration? — multiple-choice ──────────────────
  "lesson-19": {
    lessonId: "lesson-19",
    title: "What is Concentration?",
    description: "Test your understanding of concentration, how it is measured, and the difference between concentrated and dilute solutions.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What does the concentration of a solution describe?",
        options: [
          "The temperature at which the solute dissolves",
          "The maximum amount of solute that can dissolve in a solvent",
          "The amount of solute dissolved in a given quantity of solution",
          "The speed at which the solute dissolves in the solvent",
        ],
        correctAnswer: "The amount of solute dissolved in a given quantity of solution",
        points: 5,
        explanation: "Concentration describes how much solute is present in a given amount of solution. It tells us whether a solution is strong (concentrated) or weak (dilute).",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "Which of the following correctly describes a dilute solution?",
        options: [
          "A solution with a large amount of solute relative to the solvent",
          "A solution that has reached its maximum solubility",
          "A solution with a small amount of solute relative to the solvent",
          "A solution that cannot dissolve any more solute",
        ],
        correctAnswer: "A solution with a small amount of solute relative to the solvent",
        points: 5,
        explanation: "A dilute solution has relatively little solute dissolved in the solvent. The opposite of dilute is concentrated, which has a large amount of solute.",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "A student dissolves 20 g of sugar in 180 g of water, making 200 g of solution. What is the percent by mass of the solution?",
        options: ["10%", "18%", "20%", "90%"],
        correctAnswer: "10%",
        points: 5,
        explanation: "Percent by mass = (mass of solute ÷ mass of solution) × 100 = (20 ÷ 200) × 100 = 10%.",
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "Which unit of concentration is most appropriate for measuring the amount of a toxic pollutant in drinking water?",
        options: [
          "Percent by mass",
          "Percent by volume",
          "Parts per million (ppm)",
          "Grams per litre",
        ],
        correctAnswer: "Parts per million (ppm)",
        points: 5,
        explanation: "Parts per million (ppm) is used for extremely dilute solutions where concentrations are very small. Pollutants in drinking water are typically present in trace amounts best expressed in ppm or ppb.",
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "Two solutions contain the same type of solute. Solution A is 2% salt and Solution B is 15% salt. Which statement is correct?",
        options: [
          "Solution A is more concentrated than Solution B",
          "Solution B is more concentrated than Solution A",
          "Both solutions have the same concentration",
          "Solution A is saturated and Solution B is unsaturated",
        ],
        correctAnswer: "Solution B is more concentrated than Solution A",
        points: 5,
        explanation: "A higher percentage value means more solute per 100 g of solution — so 15% salt solution (Solution B) is more concentrated than 2% salt solution (Solution A).",
      },
    ],
  },

  // ── Lesson 20: Measuring and Calculating Concentration — identification ───
  "lesson-20": {
    lessonId: "lesson-20",
    title: "Measuring and Calculating Concentration",
    description: "Identify the correct concentration terms and concepts from their descriptions.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question: "What is the scientific term for a solution that has a large amount of solute dissolved relative to the solvent?",
        correctAnswer: "concentrated",
        acceptedAnswers: ["concentrated", "concentrated solution"],
        points: 5,
      },
      {
        id: "q2",
        type: "identification",
        question: "What formula is used to calculate percent by mass concentration? (Express as: mass of ___ divided by mass of ___, multiplied by 100)",
        correctAnswer: "solute divided by solution",
        acceptedAnswers: ["solute divided by solution", "solute over solution times 100", "mass of solute divided by mass of solution"],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question: "What unit of concentration is represented by the abbreviation 'ppm'?",
        correctAnswer: "parts per million",
        acceptedAnswers: ["parts per million", "ppm"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question: "A student dissolves 5 g of salt in 95 g of water. What is the total mass of the resulting solution?",
        correctAnswer: "100 g",
        acceptedAnswers: ["100 g", "100 grams", "100"],
        points: 5,
      },
      {
        id: "q5",
        type: "identification",
        question: "What type of concentration is used when both the solute and the solvent are liquids, such as alcohol dissolved in water?",
        correctAnswer: "percent by volume",
        acceptedAnswers: ["percent by volume", "% by volume", "volume percent"],
        points: 5,
      },
    ],
  },

  // ── Lesson 21: Dilution and Saturated Solutions — fill-blanks ────────────
  "lesson-21": {
    lessonId: "lesson-21",
    title: "Dilution and Saturated Solutions",
    description: "Complete each statement about dilution and saturated solutions by filling in the missing terms.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question: "___ is the process of reducing the concentration of a solution by adding more ___.",
        blanks: ["Dilution", "solvent"],
        points: 5,
      },
      {
        id: "q2",
        type: "fill-blanks",
        question: "When a solute comes out of a supersaturated solution and forms solid particles, the process is called ___. The solid particles that form are called ___.",
        blanks: ["crystallization", "crystals"],
        points: 5,
      },
      {
        id: "q3",
        type: "fill-blanks",
        question: "A ___ solution contains more dissolved solute than is normally possible at that temperature, making it an ___ state.",
        blanks: ["supersaturated", "unstable"],
        points: 5,
      },
      {
        id: "q4",
        type: "fill-blanks",
        question: "In the dilution formula C₁V₁ = C₂V₂, C represents ___ and V represents ___.",
        blanks: ["concentration", "volume"],
        points: 5,
      },
      {
        id: "q5",
        type: "fill-blanks",
        question: "When diluting a solution, the amount of ___ stays the same while the total ___ of the solution increases.",
        blanks: ["solute", "volume"],
        points: 5,
      },
    ],
  },
};
