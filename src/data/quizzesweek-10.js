// Week 10 quizzes — Grade 7 Science: Laboratory Safety

export const QUIZZES_WEEK_10 = {
  // ── Lesson 28: Laboratory Safety Rules — true-false ───────────────────────
  "lesson-28": {
    lessonId: "lesson-28",
    title: "Laboratory Safety Rules",
    description: "Test your knowledge of essential laboratory safety rules and the reasons behind them.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "Safety goggles only need to be worn when working with liquids that might splash.",
        correctAnswer: false,
        points: 5,
        explanation: "Safety goggles must be worn throughout the entire laboratory session, not just when splashing is expected. Chemical vapors, glass fragments, and unexpected reactions can all threaten eye safety at any time during an experiment.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "It is safe to eat a snack in the laboratory as long as you are not directly working with chemicals at that moment.",
        correctAnswer: false,
        points: 5,
        explanation: "Eating and drinking are never permitted in any laboratory environment. Chemical residues can contaminate surfaces, hands, and the air — meaning food can easily become contaminated even when chemicals are not being actively handled.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "A Material Safety Data Sheet (MSDS) provides information about the hazards of a chemical and the correct emergency procedures if something goes wrong.",
        correctAnswer: true,
        points: 5,
        explanation: "The MSDS (also called Safety Data Sheet or SDS) contains complete information about a chemical including its hazards, safe handling requirements, storage conditions, first aid measures, and disposal instructions.",
      },
      {
        id: "q4",
        type: "true-false",
        question: "If a student finishes an experiment early, it is acceptable to start a new experiment without asking the teacher, as long as they follow the written procedure.",
        correctAnswer: false,
        points: 5,
        explanation: "Students must always follow teacher instructions and never begin unauthorized experiments. The teacher knows which materials are available and safe for use. Unauthorized experiments can lead to dangerous chemical combinations or unsafe conditions.",
      },
      {
        id: "q5",
        type: "true-false",
        question: "All students should know the location of the fire extinguisher, eyewash station, and nearest emergency exit before starting any laboratory activity.",
        correctAnswer: true,
        points: 5,
        explanation: "Knowing the location of safety equipment and exits before an emergency occurs is a fundamental safety requirement. In an actual emergency there is no time to search for these resources — they must already be known.",
      },
    ],
  },

  // ── Lesson 29: Safety Symbols and Hazards — matching ─────────────────────
  "lesson-29": {
    lessonId: "lesson-29",
    title: "Safety Symbols and Hazards",
    description: "Match each GHS safety symbol or hazard description to its correct meaning.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question: "Match each GHS hazard symbol or term to its correct meaning.",
        leftItems: [
          "Flame symbol",
          "Skull and crossbones",
          "Corrosion symbol",
          "Exclamation mark",
          "Exploding bomb",
          "Dead fish and tree",
        ],
        rightItems: [
          "Flammable — substance can catch fire easily",
          "Acute toxicity — substance can cause death or serious illness",
          "Corrosive — causes destruction of skin, eyes, or metals on contact",
          "Irritant or mild health hazard — may cause skin or respiratory irritation",
          "Explosive — substance can explode under certain conditions",
          "Environmental hazard — harmful to aquatic life or ecosystems",
        ],
        correctPairs: {
          "Flame symbol": "Flammable — substance can catch fire easily",
          "Skull and crossbones": "Acute toxicity — substance can cause death or serious illness",
          "Corrosion symbol": "Corrosive — causes destruction of skin, eyes, or metals on contact",
          "Exclamation mark": "Irritant or mild health hazard — may cause skin or respiratory irritation",
          "Exploding bomb": "Explosive — substance can explode under certain conditions",
          "Dead fish and tree": "Environmental hazard — harmful to aquatic life or ecosystems",
        },
        points: 15,
      },
    ],
  },

  // ── Lesson 30: Emergency Procedures — short-answer ────────────────────────
  "lesson-30": {
    lessonId: "lesson-30",
    title: "Emergency Procedures",
    description: "Demonstrate your understanding of correct emergency response procedures in the laboratory.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "short-answer",
        question: "Describe the correct step-by-step procedure for responding to a chemical spill on the skin. Include at least FOUR steps in your answer.",
        points: 10,
        rubric: "Should include all or most of: (1) Stop what you are doing immediately; (2) Call or notify the teacher loudly; (3) Flood the affected area with large amounts of cold running water for a minimum of 15 minutes; (4) Remove any contaminated clothing or jewellery while rinsing; (5) Seek medical attention even if the area feels fine after washing. Answers should mention the 15-minute rinsing time and the importance of notifying the teacher.",
      },
      {
        id: "q2",
        type: "short-answer",
        question: "Explain what the PASS technique means when using a fire extinguisher. What does each letter stand for and what action does it describe?",
        points: 10,
        rubric: "Should correctly explain all four steps: P = Pull the pin (removes the safety mechanism); A = Aim at the base of the fire (not at the flames — aim at the fuel source); S = Squeeze the handle (releases the extinguishing agent); S = Sweep from side to side (moves the stream across the base of the fire to smother it). Full marks for accurate descriptions of all four steps.",
      },
      {
        id: "q3",
        type: "short-answer",
        question: "What is the difference between a minor and a major laboratory emergency? Give one example of each and explain how the response to each type differs.",
        points: 10,
        rubric: "Should distinguish that a minor emergency involves low risk to one person and is managed with first aid and teacher notification without evacuation (e.g., small cut from glass, small spill on a gloved hand). A major emergency threatens multiple people or the whole room and requires alerting everyone, calling emergency services, and evacuating the building (e.g., large chemical fire, gas leak, serious acid burn to the face). The key difference in response is whether evacuation and emergency services are required.",
      },
    ],
  },
};
