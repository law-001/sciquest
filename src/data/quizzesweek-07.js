// Week 7 quizzes — Grade 7 Science: Concentration, Acids, Bases and Salts

export const QUIZZES_WEEK_07 = {
  // ── w07-l1: Concentration of Solutions — mixed ────────────────────────────
  "w07-l1": {
    lessonId: "w07-l1",
    title: "Concentration of Solutions",
    description:
      "Test your ability to describe, calculate, and compare the concentration of solutions, and to explain dilution.",
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
          "The speed at which the solute dissolves",
        ],
        correctAnswer:
          "The amount of solute dissolved in a given quantity of solution",
        points: 5,
        explanation:
          "Concentration tells you how much solute is actually present in a given amount of solution — how strong or weak it is. That is different from solubility, which is the maximum that COULD dissolve.",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "A student dissolves 20 g of sugar in 180 g of water, making 200 g of solution. What is the percent by mass?",
        options: ["10%", "18%", "20%", "90%"],
        correctAnswer: "10%",
        points: 5,
        explanation:
          "Percent by mass = (mass of solute ÷ mass of solution) × 100 = (20 ÷ 200) × 100 = 10%. Note the denominator is the mass of the whole solution, not just the water.",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Which unit of concentration is most appropriate for measuring a toxic pollutant present in drinking water in tiny amounts?",
        options: [
          "Percent by mass",
          "Percent by volume",
          "Parts per million (ppm)",
          "Grams per litre",
        ],
        correctAnswer: "Parts per million (ppm)",
        points: 5,
        explanation:
          "Parts per million is used for extremely dilute solutions. Expressing a pollutant as 0.0001% is awkward; expressing it as 1 ppm is clear and practical.",
      },
      {
        id: "q4",
        type: "multiple-choice",
        question:
          "When you dilute a solution by adding more water, what happens to the amount of solute in it?",
        options: [
          "The amount of solute decreases",
          "The amount of solute increases",
          "The amount of solute stays exactly the same",
          "The solute turns into solvent",
        ],
        correctAnswer: "The amount of solute stays exactly the same",
        points: 5,
        explanation:
          "Dilution adds solvent, not removes solute. The same number of solute particles is now spread through a larger volume, which is why the concentration falls even though nothing was taken out.",
      },
      {
        id: "q5",
        type: "fill-blanks",
        question:
          "___ is the process of reducing the concentration of a solution by adding more ___.",
        blanks: ["Dilution", "solvent"],
        points: 5,
      },
      {
        id: "q6",
        type: "fill-blanks",
        question:
          "In the dilution formula C₁V₁ = C₂V₂, C represents ___ and V represents ___.",
        blanks: ["concentration", "volume"],
        points: 5,
      },
      {
        id: "q7",
        type: "identification",
        question:
          "A bottle of bleach is labelled 5% sodium hypochlorite, but the safety instructions say to dilute it to 0.5% before cleaning surfaces. By what factor must it be diluted?",
        correctAnswer: "ten times",
        acceptedAnswers: [
          "ten times",
          "10 times",
          "tenfold",
          "10-fold",
          "10x",
          "by a factor of 10",
          "10",
        ],
        points: 5,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "A student mixes 15 g of electrolyte powder into 285 g of water to make a sports drink. Calculate the percent by mass concentration, showing your working.",
        points: 10,
        rubric:
          "Should first find the total mass of solution: 15 g + 285 g = 300 g. Then apply the formula: percent by mass = (15 ÷ 300) × 100 = 5%. Full marks require the working, particularly the correct total solution mass in the denominator.",
      },
    ],
  },

  // ── w07-l2: Acids, Bases and Salts — mixed ────────────────────────────────
  "w07-l2": {
    lessonId: "w07-l2",
    title: "Acids, Bases and Salts",
    description:
      "Test your knowledge of the properties of acids and bases, the pH scale, and neutralization reactions.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "Acids taste sour and turn blue litmus paper red.",
        correctAnswer: true,
        points: 5,
        explanation:
          "These are two key identifying properties of acids. The sour taste of lemon juice and vinegar comes from their acidity, and the litmus colour change is the standard laboratory test.",
      },
      {
        id: "q2",
        type: "true-false",
        question:
          "Only acids can conduct electricity when dissolved in water.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Both acids AND bases conduct electricity in water, because both form ions in solution. Ions are charged particles that carry a current, which makes acids and bases alike electrolytes.",
      },
      {
        id: "q3",
        type: "true-false",
        question:
          "Sodium hydroxide (NaOH) is an acid because it is highly corrosive.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Sodium hydroxide is a strong BASE. Corrosiveness is shared by strong acids and strong bases alike, so it cannot be used to tell them apart. NaOH is corrosive because it releases hydroxide ions (OH⁻).",
      },
      {
        id: "q4",
        type: "true-false",
        question:
          "Each step on the pH scale represents a tenfold change in acidity, so pH 2 is one hundred times more acidic than pH 4.",
        correctAnswer: true,
        points: 5,
        explanation:
          "The pH scale is logarithmic. Each whole number is a factor of ten, so two steps is 10 × 10 = 100 times more acidic.",
      },
      {
        id: "q5",
        type: "matching",
        question:
          "Match each substance to its correct pH range or category.",
        leftItems: [
          "Battery acid (H₂SO₄)",
          "Lemon juice",
          "Pure water",
          "Blood",
          "Baking soda solution",
          "Drain cleaner (NaOH)",
        ],
        rightItems: [
          "pH ≈ 0–1 (very strong acid)",
          "pH ≈ 2–3 (strong acid)",
          "pH = 7.0 (neutral)",
          "pH ≈ 7.35–7.45 (very slightly basic)",
          "pH ≈ 8–9 (mild base)",
          "pH ≈ 13–14 (very strong base)",
        ],
        correctPairs: {
          "Battery acid (H₂SO₄)": "pH ≈ 0–1 (very strong acid)",
          "Lemon juice": "pH ≈ 2–3 (strong acid)",
          "Pure water": "pH = 7.0 (neutral)",
          Blood: "pH ≈ 7.35–7.45 (very slightly basic)",
          "Baking soda solution": "pH ≈ 8–9 (mild base)",
          "Drain cleaner (NaOH)": "pH ≈ 13–14 (very strong base)",
        },
        points: 15,
      },
      {
        id: "q6",
        type: "ordering",
        question:
          "Arrange the steps of a neutralization reaction between HCl and NaOH in the correct order:",
        items: [
          "Measure equal amounts of HCl (acid) and NaOH (base) in separate containers",
          "Slowly combine the acid and base solutions in a beaker",
          "H⁺ ions from the acid meet OH⁻ ions from the base",
          "Water molecules (H₂O) are formed as those ions combine",
          "Na⁺ and Cl⁻ ions remain in solution, forming the salt NaCl",
          "Add universal indicator to confirm a neutral pH of 7",
        ],
        points: 15,
      },
      {
        id: "q7",
        type: "identification",
        question:
          "What are the TWO products always formed when an acid reacts with a base? (Give both, separated by 'and'.)",
        correctAnswer: "salt and water",
        acceptedAnswers: [
          "salt and water",
          "a salt and water",
          "water and salt",
          "water and a salt",
        ],
        points: 5,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "A person takes an antacid tablet containing calcium carbonate to relieve heartburn caused by excess stomach acid. Explain what type of reaction occurs and what products are formed.",
        points: 10,
        rubric:
          "Should identify the reaction as neutralization. The basic calcium carbonate reacts with the excess hydrochloric acid to form a salt (calcium chloride), water, and carbon dioxide gas. Should explain that this raises the pH toward neutral, relieving the burning sensation.",
      },
    ],
  },
};
