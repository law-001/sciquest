// Week 8 quizzes — Grade 7 Science: Acids, Bases, and Salts

export const QUIZZES_WEEK_08 = {
  // ── Lesson 22: Properties of Acids and Bases — true-false ─────────────────
  "lesson-22": {
    lessonId: "lesson-22",
    title: "Properties of Acids and Bases",
    description: "Test your knowledge of the physical and chemical properties that distinguish acids from bases.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "Acids taste sour and turn blue litmus paper red.",
        correctAnswer: true,
        points: 5,
        explanation: "These are two key identifying properties of acids. The sour taste of lemon juice and vinegar is due to their acidic nature, and the litmus color change is a standard laboratory test for acids.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "Bases feel soapy and slippery because they react with the oils on your skin.",
        correctAnswer: true,
        points: 5,
        explanation: "Bases undergo saponification — they react with fats and oils (including the natural oils on human skin) to form soap-like compounds, which is why they feel slippery.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Only acids can conduct electricity when dissolved in water.",
        correctAnswer: false,
        points: 5,
        explanation: "Both acids AND bases conduct electricity when dissolved in water because both form ions in solution. Ions are charged particles that can carry an electric current — making both acids and bases electrolytes.",
      },
      {
        id: "q4",
        type: "true-false",
        question: "Hydrochloric acid (HCl) reacts with zinc metal to produce hydrogen gas.",
        correctAnswer: true,
        points: 5,
        explanation: "A key property of acids is that they react with reactive metals (such as zinc, magnesium, and iron) to produce hydrogen gas and a metal salt. This is the basis of the 'acid + metal' reaction type.",
      },
      {
        id: "q5",
        type: "true-false",
        question: "Sodium hydroxide (NaOH) is an acid because it is highly corrosive.",
        correctAnswer: false,
        points: 5,
        explanation: "Sodium hydroxide is a strong BASE, not an acid. Corrosiveness is a property shared by both strong acids and strong bases. NaOH is corrosive because it releases hydroxide ions (OH⁻), which is a characteristic of bases.",
      },
    ],
  },

  // ── Lesson 23: The pH Scale — matching ───────────────────────────────────
  "lesson-23": {
    lessonId: "lesson-23",
    title: "The pH Scale",
    description: "Match each common substance to its correct pH range or category on the pH scale.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question: "Match each substance to its correct pH range or category.",
        leftItems: [
          "Battery acid (H₂SO₄)",
          "Pure water",
          "Blood",
          "Baking soda solution",
          "Lemon juice",
          "Drain cleaner (NaOH)",
        ],
        rightItems: [
          "pH ≈ 0–1 (Very strong acid)",
          "pH = 7.0 (Neutral)",
          "pH ≈ 7.35–7.45 (Slightly basic/neutral)",
          "pH ≈ 8–9 (Mild base)",
          "pH ≈ 2–3 (Strong acid)",
          "pH ≈ 13–14 (Very strong base)",
        ],
        correctPairs: {
          "Battery acid (H₂SO₄)": "pH ≈ 0–1 (Very strong acid)",
          "Pure water": "pH = 7.0 (Neutral)",
          "Blood": "pH ≈ 7.35–7.45 (Slightly basic/neutral)",
          "Baking soda solution": "pH ≈ 8–9 (Mild base)",
          "Lemon juice": "pH ≈ 2–3 (Strong acid)",
          "Drain cleaner (NaOH)": "pH ≈ 13–14 (Very strong base)",
        },
        points: 15,
      },
    ],
  },

  // ── Lesson 24: Neutralization and Salts — ordering ────────────────────────
  "lesson-24": {
    lessonId: "lesson-24",
    title: "Neutralization and Salts",
    description: "Arrange the steps of a neutralization reaction in the correct logical and chemical order.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "ordering",
        question: "Arrange these steps of a neutralization reaction between HCl and NaOH in the correct order from start to finish:",
        items: [
          "Measure equal amounts of HCl (acid) and NaOH (base) in separate containers",
          "Slowly combine the acid and base solutions in a beaker",
          "H⁺ ions from the acid combine with OH⁻ ions from the base",
          "Water molecules (H₂O) are formed as the ions combine",
          "Na⁺ and Cl⁻ ions remain in solution, forming NaCl (salt)",
          "Add a few drops of universal indicator to confirm a neutral pH of 7",
        ],
        points: 15,
      },
    ],
  },
};
