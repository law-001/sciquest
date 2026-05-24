// Week 2 quizzes — Grade 7 Science: Particle Model of Matter

export const QUIZZES_WEEK_02 = {
  // ── Lesson 4: What is Matter? — matching + short-answer ──────────────────
  "lesson-4": {
    lessonId: "lesson-4",
    title: "What is Matter?",
    description:
      "Match phase changes and demonstrate your understanding of the particle theory and states of matter.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question:
          "Seatwork 3: Match the following phase changes by selecting the correct term from Column B for each description in Column A.",
        leftItems: [
          "Liquid to Solid",
          "Liquid to Gas",
          "Gas to Liquid",
          "Solid to Gas",
          "Solid to Liquid",
        ],
        rightItems: [
          "freezing",
          "melting",
          "evaporation",
          "condensation",
          "sublimation",
          "deposition",
        ],
        correctPairs: {
          "Liquid to Solid": "freezing",
          "Liquid to Gas": "evaporation",
          "Gas to Liquid": "condensation",
          "Solid to Gas": "sublimation",
          "Solid to Liquid": "melting",
        },
        points: 10,
      },
      {
        id: "q2",
        type: "short-answer",
        question: "Explain the particle theory of matter and its key ideas.",
        rubric:
          "Include the five key statements: all matter is made of tiny particles; particles are in constant motion; there is empty space between particles; particles attract each other; and temperature affects particle speed.",
        points: 10,
      },
      {
        id: "q3",
        type: "short-answer",
        question:
          "Demonstrate your critical thinking skills by identifying and describing two distinct properties of matter for each state: solid, liquid, and gas.",
        rubric:
          "For each state name two properties (e.g., definite shape, definite volume, ability to flow, compressibility) and explain them using particle arrangement.",
        points: 10,
      },
      {
        id: "q4",
        type: "short-answer",
        question:
          "Support your descriptions by providing one real-life example for each state of matter (solid, liquid, and gas) and briefly explain how its properties relate to particle behavior.",
        rubric:
          "Choose a clear real-world example for each state and link it back to particle spacing, motion, or forces.",
        points: 10,
      },
    ],
  },

  // ── Lesson 5: Particle Theory of Matter — identification ─────────────────
  "lesson-5": {
    lessonId: "lesson-particle-theory",
    title: "Particle Theory of Matter",
    description:
      "Read each question carefully. Identify the correct scientific term being described in each item. Spelling counts.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question:
          "The theory that states matter is made up of tiny, constantly moving particles.",
        correctAnswer: "Particle Theory of Matter",
        acceptedAnswers: ["particle theory of matter", "particle theory"],
        points: 5,
      },
      {
        id: "q2",
        type: "identification",
        question:
          "The state of matter where particles are tightly packed and vibrate in place.",
        correctAnswer: "Solid",
        acceptedAnswers: ["solid"],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question:
          "The state of matter where particles are far apart and move freely.",
        correctAnswer: "Gas",
        acceptedAnswers: ["gas"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question:
          "The state of matter that has a definite volume but takes the shape of its container.",
        correctAnswer: "Liquid",
        acceptedAnswers: ["liquid"],
        points: 5,
      },
      {
        id: "q5",
        type: "identification",
        question:
          "The movement of particles from an area of high concentration to low concentration.",
        correctAnswer: "Diffusion",
        acceptedAnswers: ["diffusion"],
        points: 5,
      },
      {
        id: "q6",
        type: "identification",
        question:
          "This property describes how easily the particles of a substance can be compressed.",
        correctAnswer: "Compressibility",
        acceptedAnswers: ["compressibility"],
        points: 5,
      },
      {
        id: "q7",
        type: "identification",
        question: "The energy that particles have due to their motion.",
        correctAnswer: "Kinetic Energy",
        acceptedAnswers: ["kinetic energy"],
        points: 5,
      },
      {
        id: "q8",
        type: "identification",
        question:
          "The process where particles gain enough energy to change from solid to liquid.",
        correctAnswer: "Melting",
        acceptedAnswers: ["melting"],
        points: 5,
      },
      {
        id: "q9",
        type: "identification",
        question: "The phase change from gas to liquid due to loss of energy.",
        correctAnswer: "Condensation",
        acceptedAnswers: ["condensation"],
        points: 5,
      },
      {
        id: "q10",
        type: "identification",
        question: "The arrangement of particles in a solid.",
        correctAnswer: "Tightly packed in a regular pattern",
        acceptedAnswers: [
          "tightly packed in a regular pattern",
          "tightly packed",
          "regular pattern",
          "close together in a regular pattern",
        ],
        points: 5,
      },
    ],
  },
};
