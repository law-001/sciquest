// data/quizzes.js
// ─── ADD / EDIT QUIZZES HERE ONLY ────────────────────────────────────────────
// Keyed by lessonId so QuizPage can look up by lesson.
// No other file needs to change when editing quiz content.

export const QUIZZES_DATA = {
  // ── Week 1 ─────────────────────────────────────────────────────────────────
  "lesson-1": {
    lessonId: "lesson-1",
    title: "Uses of Scientific Models",
    timeLimit: 60, // seconds
    xpPerCorrect: 25, // 3 questions × 25 = 75 xp (matches lesson.xp)
    questions: [
      {
        id: "q1",
        prompt: "What is a scientific model?",
        options: [
          "An exact copy of a real object",
          "A simplified representation used to explain or predict phenomena",
          "A type of laboratory experiment",
          "A diagram drawn by hand only",
        ],
        correctAnswer:
          "A simplified representation used to explain or predict phenomena",
      },
      {
        id: "q2",
        prompt: "Which of the following is an example of a physical model?",
        options: [
          "Newton's equation F = ma",
          "A food web diagram",
          "A globe representing Earth",
          "A weather simulation program",
        ],
        correctAnswer: "A globe representing Earth",
      },
      {
        id: "q3",
        prompt:
          "Why do scientists use models instead of studying the real thing directly?",
        options: [
          "Because models are always 100% accurate",
          "Because real objects are too expensive to buy",
          "Because some phenomena are too small, large, fast, or dangerous to observe directly",
          "Because models are easier to draw",
        ],
        correctAnswer:
          "Because some phenomena are too small, large, fast, or dangerous to observe directly",
      },
    ],
  },

  "lesson-2": {
    lessonId: "lesson-2",
    title: "Types of Scientific Models",
    timeLimit: 60,
    xpPerCorrect: 25,
    questions: [
      {
        id: "q1",
        prompt: "Which type of model uses equations to describe relationships?",
        options: [
          "Physical Model",
          "Conceptual Model",
          "Mathematical Model",
          "Simulation Model",
        ],
        correctAnswer: "Mathematical Model",
      },
      {
        id: "q2",
        prompt:
          "A flight simulator used to train pilots is an example of which model type?",
        options: [
          "Physical Model",
          "Conceptual Model",
          "Mathematical Model",
          "Simulation Model",
        ],
        correctAnswer: "Simulation Model",
      },
      {
        id: "q3",
        prompt: "The Bohr model of the atom is an example of a:",
        options: [
          "Physical Model",
          "Conceptual Model",
          "Simulation Model",
          "Mathematical Model",
        ],
        correctAnswer: "Conceptual Model",
      },
    ],
  },

  "lesson-3": {
    lessonId: "lesson-3",
    title: "Models in Real Life",
    timeLimit: 60,
    xpPerCorrect: 25,
    questions: [
      {
        id: "q1",
        prompt:
          "Which real-life application uses computer models to predict future conditions?",
        options: [
          "Atomic Models",
          "Weather Forecasting",
          "Engineering Designs",
          "Physical Models",
        ],
        correctAnswer: "Weather Forecasting",
      },
      {
        id: "q2",
        prompt: "Engineers build scaled-down models of bridges to:",
        options: [
          "Decorate their offices",
          "Test strength before building the real thing",
          "Replace mathematical equations",
          "Create conceptual diagrams",
        ],
        correctAnswer: "Test strength before building the real thing",
      },
      {
        id: "q3",
        prompt: "Models can be improved or replaced when:",
        options: [
          "Scientists get bored of them",
          "They become too expensive",
          "New evidence appears",
          "Students find them confusing",
        ],
        correctAnswer: "New evidence appears",
      },
    ],
  },

  // ── Week 2 ─────────────────────────────────────────────────────────────────
  "lesson-4": {
    lessonId: "lesson-4",
    title: "Cell Structure",
    timeLimit: 60,
    xpPerCorrect: 25,
    questions: [
      {
        id: "q1",
        prompt: 'Which part of the cell is known as the "powerhouse"?',
        options: ["Nucleus", "Mitochondria", "Ribosome", "Cell Membrane"],
        correctAnswer: "Mitochondria",
      },
      {
        id: "q2",
        prompt: "What is the main function of the cell membrane?",
        options: [
          "Produce energy",
          "Store DNA",
          "Control what enters and exits",
          "Make proteins",
        ],
        correctAnswer: "Control what enters and exits",
      },
      {
        id: "q3",
        prompt:
          'Which organelle is considered the "command center" of the cell?',
        options: ["Nucleus", "Cytoplasm", "Golgi Apparatus", "Lysosome"],
        correctAnswer: "Nucleus",
      },
    ],
  },

  "lesson-5": {
    lessonId: "lesson-5",
    title: "Cell Functions",
    timeLimit: 60,
    xpPerCorrect: 25,
    questions: [
      {
        id: "q1",
        prompt: "Which organelle produces proteins in the cell?",
        options: ["Mitochondria", "Ribosome", "Vacuole", "Nucleus"],
        correctAnswer: "Ribosome",
      },
      {
        id: "q2",
        prompt: "What does the Golgi apparatus do?",
        options: [
          "Produces energy",
          "Stores DNA",
          "Packages and ships proteins",
          "Controls cell division",
        ],
        correctAnswer: "Packages and ships proteins",
      },
      {
        id: "q3",
        prompt: "Which organelle breaks down waste materials inside the cell?",
        options: ["Nucleus", "Ribosome", "Lysosome", "Mitochondria"],
        correctAnswer: "Lysosome",
      },
    ],
  },

  "lesson-6": {
    lessonId: "lesson-6",
    title: "Cell Division",
    timeLimit: 60,
    xpPerCorrect: 25,
    questions: [
      {
        id: "q1",
        prompt: "What is the process called when a cell duplicates itself?",
        options: ["Meiosis", "Mitosis", "Photosynthesis", "Osmosis"],
        correctAnswer: "Mitosis",
      },
      {
        id: "q2",
        prompt: "How many daughter cells does mitosis produce?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
      },
      {
        id: "q3",
        prompt:
          "Which type of cell division is used to produce sex cells (sperm and egg)?",
        options: ["Mitosis", "Binary fission", "Meiosis", "Budding"],
        correctAnswer: "Meiosis",
      },
    ],
  },
};

/** Get a quiz by its lessonId */
export function getQuizByLesson(lessonId) {
  return QUIZZES_DATA[lessonId] ?? null;
}
