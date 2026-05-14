// Week 2 quizzes — Grade 7 Science: Particle Model of Matter

export const QUIZZES_WEEK_02 = {
  // ── Lesson 4: What is Matter? — identification ────────────────────────────
  "lesson-4": {
    lessonId: "lesson-4",
    title: "What is Matter?",
    description: "Test your understanding of matter vocabulary and properties.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question:
          "What is the scientific term for anything that has mass and takes up space (volume)?",
        correctAnswer: "matter",
        acceptedAnswers: ["matter"],
        points: 5,
      },
      {
        id: "q2",
        type: "identification",
        question:
          "What property of matter describes the amount of material in an object, measured in grams or kilograms?",
        correctAnswer: "mass",
        acceptedAnswers: ["mass"],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question:
          "What is the scientific term for the amount of three-dimensional space that matter occupies?",
        correctAnswer: "volume",
        acceptedAnswers: ["volume"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question:
          "What property of matter is calculated by dividing mass by volume and tells you how much matter is packed into a given space?",
        correctAnswer: "density",
        acceptedAnswers: ["density"],
        points: 5,
      },
      {
        id: "q5",
        type: "identification",
        question:
          "What term describes matter made of only one type of particle throughout, such as pure water or pure gold?",
        correctAnswer: "pure substance",
        acceptedAnswers: ["pure substance", "pure substances"],
        points: 5,
      },
    ],
  },

  // ── Lesson 5: Particle Theory of Matter — fill-blanks ────────────────────
  "lesson-5": {
    lessonId: "lesson-5",
    title: "Particle Theory of Matter",
    description:
      "Test your knowledge of the five statements of the particle theory of matter.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question:
          "All matter is made up of extremely small ___ that cannot be seen with the naked eye.",
        blanks: ["particles"],
        points: 5,
      },
      {
        id: "q2",
        type: "fill-blanks",
        question:
          "The particles of matter are in constant ___, and this motion never completely stops.",
        blanks: ["motion"],
        points: 5,
      },
      {
        id: "q3",
        type: "fill-blanks",
        question:
          "There is ___ space between the particles of matter. In gases, this space is very ___.",
        blanks: ["empty", "large"],
        points: 5,
      },
      {
        id: "q4",
        type: "fill-blanks",
        question:
          "Particles of matter ___ each other. In solids these forces are very ___, while in gases they are very weak.",
        blanks: ["attract", "strong"],
        points: 5,
      },
      {
        id: "q5",
        type: "fill-blanks",
        question:
          "When the ___ of a substance increases, its particles move ___. Temperature is a measure of the average ___ energy of the particles.",
        blanks: ["temperature", "faster", "kinetic"],
        points: 5,
      },
    ],
  },

  // ── Lesson 6: States of Matter — ordering ────────────────────────────────
  "lesson-6": {
    lessonId: "lesson-6",
    title: "States of Matter",
    description:
      "Test your understanding of the properties and particle arrangements of the states of matter.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "ordering",
        question:
          "Arrange the following state changes in the order they would occur when a solid substance is continuously heated from well below its melting point to above its boiling point:",
        items: [
          "The solid absorbs heat and its particles vibrate faster",
          "The solid reaches its melting point and begins to melt",
          "The solid and liquid exist together while heat is absorbed",
          "The substance is fully liquid and its temperature continues to rise",
          "The liquid reaches its boiling point and begins to evaporate rapidly",
          "The substance is fully in the gas state",
        ],
        points: 15,
      },
    ],
  },
};
