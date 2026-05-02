// data/quizzesweek-01.js
// ─── ADD / EDIT QUIZZES HERE ONLY ────────────────────────────────────────────
// Keyed by lessonId. Each question requires a `type` field that maps
// to a quiz-slot component in components/quiz-slots/.
//
// Supported types:
//   multiple-choice | true-false | fill-blanks | short-answer | essay
//   matching | identification | ordering | picture-based | case-study

export const QUIZZES_DATA = {
  // ── Week 1 ─────────────────────────────────────────────────────────────────

  "lesson-1": {
    lessonId: "lesson-1",
    title: "Uses of Scientific Models",
    description:
      "Test your understanding of how and why scientists use models.",
    timeLimit: 1800,
    questions: [
      // ── 1. Multiple Choice ─────────────────────────────────────────────────
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is a scientific model?",
        options: [
          "An exact copy of a real object",
          "A simplified representation used to explain or predict phenomena",
          "A type of laboratory experiment",
          "A diagram drawn by hand only",
        ],
        correctAnswer:
          "A simplified representation used to explain or predict phenomena",
        points: 5,
        explanation:
          "Scientific models simplify complex phenomena to make them easier to study and communicate.",
      },

      // ── 2. True / False ────────────────────────────────────────────────────
      {
        id: "q2",
        type: "true-false",
        question:
          "A scientific model must always be a physical, tangible object.",
        correctAnswer: false,
        points: 3,
        explanation:
          "Models can be physical, mathematical, conceptual, or computational.",
      },

      // ── 3. Fill in the Blanks ──────────────────────────────────────────────
      {
        id: "q3",
        type: "fill-blanks",
        question:
          "Scientists use models because some phenomena are too ___, ___, fast, or ___ to observe directly.",
        blanks: ["small", "large", "dangerous"],
        points: 6,
        explanation:
          "Scale and safety constraints make direct observation impractical for many phenomena.",
      },

      // ── 4. Short Answer ────────────────────────────────────────────────────
      {
        id: "q4",
        type: "short-answer",
        question:
          "In your own words, explain why scientists need to update or replace models over time.",
        points: 10,
        rubric:
          "Should mention new evidence, improved technology, or a better understanding of the phenomenon.",
      },

      // ── 5. Matching ────────────────────────────────────────────────────────
      {
        id: "q5",
        type: "matching",
        question: "Match each model type to its correct example.",
        leftItems: [
          "Physical Model",
          "Mathematical Model",
          "Simulation Model",
          "Conceptual Model",
        ],
        rightItems: [
          "F = ma",
          "Globe of the Earth",
          "Flight Simulator",
          "Food Web Diagram",
        ],
        correctPairs: {
          "Physical Model": "Globe of the Earth",
          "Mathematical Model": "F = ma",
          "Simulation Model": "Flight Simulator",
          "Conceptual Model": "Food Web Diagram",
        },
        points: 8,
      },

      // ── 6. Identification ──────────────────────────────────────────────────
      {
        id: "q6",
        type: "identification",
        question:
          "Name the type of model that uses computer programs to mimic real-world processes.",
        correctAnswer: "simulation model",
        acceptedAnswers: [
          "simulation model",
          "simulation",
          "computational model",
          "computer simulation",
          "computer model",
        ],
        points: 5,
      },

      // ── 7. Ordering / Sequencing ───────────────────────────────────────────
      {
        id: "q7",
        type: "ordering",
        question:
          "Put the following steps of model development in the correct order (drag or use the arrows):",
        items: [
          "Identify the phenomenon to model",
          "Gather observations and data",
          "Build and test the model",
          "Use the model to make predictions",
          "Revise the model based on results",
        ],
        points: 10,
      },

      // ── 8. Essay ───────────────────────────────────────────────────────────
      {
        id: "q8",
        type: "essay",
        question:
          "Describe a real-world situation where a scientific model was crucial. What type of model was used and what were its limitations?",
        minWords: 50,
        points: 15,
      },

      // ── 9. Picture-Based ───────────────────────────────────────────────────
      {
        id: "q9",
        type: "picture-based",
        question: "What type of scientific model does this diagram represent?",
        imageUrl: "/images/quiz/bohr-model.png",
        imageAlt:
          "Diagram showing electrons orbiting a nucleus in fixed shells (Bohr model)",
        options: [
          "Physical Model",
          "Conceptual Model",
          "Mathematical Model",
          "Simulation Model",
        ],
        correctAnswer: "Conceptual Model",
        points: 5,
        explanation:
          "The Bohr model is a conceptual model — it simplifies atomic structure to show key relationships.",
      },

      // ── 10. Case Study ─────────────────────────────────────────────────────
      {
        id: "q10",
        type: "case-study",
        question: "Read the scenario below and answer the sub-questions.",
        scenario:
          "Dr. Reyes is studying the spread of a new virus. She creates a computer program that simulates how the virus spreads through a population based on contact rates, infection probability, and recovery time. She uses this model to predict whether a vaccination campaign will slow the outbreak.",
        subQuestions: [
          {
            id: "q10a",
            type: "multiple-choice",
            question: "What type of model is Dr. Reyes using?",
            options: [
              "Physical Model",
              "Simulation Model",
              "Conceptual Model",
              "Mathematical Model",
            ],
            correctAnswer: "Simulation Model",
            points: 5,
          },
          {
            id: "q10b",
            type: "true-false",
            question:
              "Dr. Reyes's model can predict real-world outcomes with 100% certainty.",
            correctAnswer: false,
            points: 3,
            explanation:
              "All models simplify reality and carry assumptions, so predictions are probabilistic, not certain.",
          },
          {
            id: "q10c",
            type: "short-answer",
            question:
              "List one limitation of using this type of model to predict real-world outcomes.",
            points: 5,
          },
        ],
      },
    ],
  },

  "lesson-2": {
    lessonId: "lesson-2",
    title: "Types of Scientific Models",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which type of model uses equations to describe relationships?",
        options: [
          "Physical Model",
          "Conceptual Model",
          "Mathematical Model",
          "Simulation Model",
        ],
        correctAnswer: "Mathematical Model",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "A flight simulator used to train pilots is an example of which model type?",
        options: [
          "Physical Model",
          "Conceptual Model",
          "Mathematical Model",
          "Simulation Model",
        ],
        correctAnswer: "Simulation Model",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "The Bohr model of the atom is an example of a:",
        options: [
          "Physical Model",
          "Conceptual Model",
          "Simulation Model",
          "Mathematical Model",
        ],
        correctAnswer: "Conceptual Model",
        points: 5,
      },
    ],
  },

  "lesson-3": {
    lessonId: "lesson-3",
    title: "Models in Real Life",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which real-life application uses computer models to predict future conditions?",
        options: [
          "Atomic Models",
          "Weather Forecasting",
          "Engineering Designs",
          "Physical Models",
        ],
        correctAnswer: "Weather Forecasting",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "Engineers build scaled-down models of bridges to:",
        options: [
          "Decorate their offices",
          "Test strength before building the real thing",
          "Replace mathematical equations",
          "Create conceptual diagrams",
        ],
        correctAnswer: "Test strength before building the real thing",
        points: 5,
      },
      {
        id: "q3",
        type: "true-false",
        question:
          "Scientific models can be improved or replaced when new evidence appears.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Science is self-correcting — models evolve as new data and technologies emerge.",
      },
    ],
  },

  // ── Week 2 ─────────────────────────────────────────────────────────────────

  "lesson-4": {
    lessonId: "lesson-4",
    title: "Cell Structure",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: 'Which part of the cell is known as the "powerhouse"?',
        options: ["Nucleus", "Mitochondria", "Ribosome", "Cell Membrane"],
        correctAnswer: "Mitochondria",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "What is the main function of the cell membrane?",
        options: [
          "Produce energy",
          "Store DNA",
          "Control what enters and exits",
          "Make proteins",
        ],
        correctAnswer: "Control what enters and exits",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          'Which organelle is considered the "command center" of the cell?',
        options: ["Nucleus", "Cytoplasm", "Golgi Apparatus", "Lysosome"],
        correctAnswer: "Nucleus",
        points: 5,
      },
    ],
  },

  "lesson-5": {
    lessonId: "lesson-5",
    title: "Cell Functions",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Which organelle produces proteins in the cell?",
        options: ["Mitochondria", "Ribosome", "Vacuole", "Nucleus"],
        correctAnswer: "Ribosome",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "What does the Golgi apparatus do?",
        options: [
          "Produces energy",
          "Stores DNA",
          "Packages and ships proteins",
          "Controls cell division",
        ],
        correctAnswer: "Packages and ships proteins",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Which organelle breaks down waste materials inside the cell?",
        options: ["Nucleus", "Ribosome", "Lysosome", "Mitochondria"],
        correctAnswer: "Lysosome",
        points: 5,
      },
    ],
  },

  "lesson-6": {
    lessonId: "lesson-6",
    title: "Cell Division",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is the process called when a cell duplicates itself?",
        options: ["Meiosis", "Mitosis", "Photosynthesis", "Osmosis"],
        correctAnswer: "Mitosis",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "How many daughter cells does mitosis produce?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Which type of cell division is used to produce sex cells (sperm and egg)?",
        options: ["Mitosis", "Binary fission", "Meiosis", "Budding"],
        correctAnswer: "Meiosis",
        points: 5,
      },
    ],
  },
};

export function getQuizByLesson(lessonId) {
  return QUIZZES_DATA[lessonId] ?? null;
}
