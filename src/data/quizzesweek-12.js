// Week 12 quizzes — Grade 7 Science: Cell Theory

export const QUIZZES_WEEK_12 = {
  // ── Lesson 34: Development of Cell Theory — true-false ───────────────────
  "lesson-34": {
    lessonId: "lesson-34",
    title: "Development of Cell Theory",
    description: "Test your knowledge of the scientists and principles behind cell theory.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "Robert Hooke named the tiny structures he saw in cork 'cells' because they reminded him of small rooms in a monastery.",
        correctAnswer: true,
        points: 5,
        explanation: "Hooke coined the term 'cell' from the Latin 'cellula,' meaning a small room, after observing the box-like compartments in thin slices of cork under a microscope in 1665.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "Matthias Schleiden concluded that animals — not plants — are made of cells.",
        correctAnswer: false,
        points: 5,
        explanation: "Matthias Schleiden (1838) concluded that plants are made of cells. It was Theodor Schwann (1839) who extended this conclusion to animals.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "The third principle of cell theory, stated by Rudolf Virchow, is that all cells come from pre-existing cells.",
        correctAnswer: true,
        points: 5,
        explanation: "Virchow's famous Latin phrase 'Omnis cellula e cellula' — every cell from a cell — established that cells can only arise from existing cells through division, not spontaneous generation.",
      },
      {
        id: "q4",
        type: "true-false",
        question: "According to modern cell theory, a virus is considered a living cell because it can reproduce.",
        correctAnswer: false,
        points: 5,
        explanation: "Viruses are not considered living cells under cell theory. They are not made of cells — they are non-cellular particles. Cell theory applies only to true cellular organisms.",
      },
      {
        id: "q5",
        type: "true-false",
        question: "Antonie van Leeuwenhoek was the first person to observe living microorganisms under a microscope.",
        correctAnswer: true,
        points: 5,
        explanation: "In the 1670s, van Leeuwenhoek used his powerful handcrafted lenses to observe bacteria, protozoa, and other living microorganisms for the first time, earning him the title 'Father of Microbiology.'",
      },
    ],
  },

  // ── Lesson 35: Types of Cells: Prokaryotes and Eukaryotes — matching ─────
  "lesson-35": {
    lessonId: "lesson-35",
    title: "Types of Cells: Prokaryotes and Eukaryotes",
    description: "Match each organism or cell feature to the correct cell type.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question: "Match each organism or cell feature to the correct cell type.",
        leftItems: [
          "Bacteria",
          "Human skin cell",
          "Has no membrane-bound nucleus",
          "Onion root tip cell",
          "Archaea",
          "Has DNA organized in linear chromosomes",
        ],
        rightItems: [
          "Prokaryotic Cell",
          "Eukaryotic Cell",
        ],
        correctPairs: {
          "Bacteria": "Prokaryotic Cell",
          "Human skin cell": "Eukaryotic Cell",
          "Has no membrane-bound nucleus": "Prokaryotic Cell",
          "Onion root tip cell": "Eukaryotic Cell",
          "Archaea": "Prokaryotic Cell",
          "Has DNA organized in linear chromosomes": "Eukaryotic Cell",
        },
        points: 15,
      },
    ],
  },

  // ── Lesson 36: Cell Diversity — fill-blanks ───────────────────────────────
  "lesson-36": {
    lessonId: "lesson-36",
    title: "Cell Diversity",
    description: "Complete each statement about cell diversity and specialization.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question: "All cells share four basic features: a ___ membrane, ___, DNA, and ribosomes.",
        blanks: ["cell", "cytoplasm"],
        points: 5,
      },
      {
        id: "q2",
        type: "fill-blanks",
        question: "A ___ cell has long extensions called axons that allow it to transmit ___ signals rapidly across the body.",
        blanks: ["nerve", "electrical"],
        points: 5,
      },
      {
        id: "q3",
        type: "fill-blanks",
        question: "Red blood cells lack a ___ when mature, which frees up more space for ___ molecules that carry oxygen.",
        blanks: ["nucleus", "hemoglobin"],
        points: 5,
      },
      {
        id: "q4",
        type: "fill-blanks",
        question: "An organism made of only one cell is called ___, while an organism made of many specialized cells is called ___.",
        blanks: ["unicellular", "multicellular"],
        points: 5,
      },
      {
        id: "q5",
        type: "fill-blanks",
        question: "Leaf mesophyll cells are packed with ___ to capture sunlight for the process of ___.",
        blanks: ["chloroplasts", "photosynthesis"],
        points: 5,
      },
    ],
  },
};
