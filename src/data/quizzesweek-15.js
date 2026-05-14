// Week 15 quizzes — Grade 7 Science: Cell Reproduction: Mitosis

export const QUIZZES_WEEK_15 = {
  // ── Lesson 43: The Cell Cycle — multiple-choice ───────────────────────────
  "lesson-43": {
    lessonId: "lesson-43",
    title: "The Cell Cycle",
    description: "Test your understanding of the phases of the cell cycle and their significance.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "During which phase of the cell cycle does DNA replication (copying) take place?",
        options: [
          "G1 Phase",
          "S Phase",
          "G2 Phase",
          "Mitosis",
        ],
        correctAnswer: "S Phase",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "Which of the following correctly describes what happens during G1 phase?",
        options: [
          "The cell copies all of its DNA",
          "The cell physically divides into two daughter cells",
          "The cell grows in size and carries out normal metabolic functions",
          "Chromosomes separate and move to opposite poles",
        ],
        correctAnswer: "The cell grows in size and carries out normal metabolic functions",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "What is the purpose of checkpoints in the cell cycle?",
        options: [
          "To speed up cell division",
          "To ensure the cell has correctly completed each phase before proceeding",
          "To trigger DNA mutations",
          "To prevent cells from ever dividing",
        ],
        correctAnswer: "To ensure the cell has correctly completed each phase before proceeding",
        points: 5,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "Cancer cells are dangerous because they:",
        options: [
          "Divide too slowly to repair damaged tissues",
          "Refuse to undergo cytokinesis",
          "Bypass cell cycle checkpoints and divide uncontrollably",
          "Stop producing DNA during the S phase",
        ],
        correctAnswer: "Bypass cell cycle checkpoints and divide uncontrollably",
        points: 5,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "The phase of the cell cycle in which the cytoplasm divides to produce two separate daughter cells is called:",
        options: [
          "Telophase",
          "G2 Phase",
          "Anaphase",
          "Cytokinesis",
        ],
        correctAnswer: "Cytokinesis",
        points: 5,
      },
    ],
  },

  // ── Lesson 44: Stages of Mitosis — true-false ─────────────────────────────
  "lesson-44": {
    lessonId: "lesson-44",
    title: "Stages of Mitosis",
    description: "Test your knowledge of the four stages of mitosis and what occurs at each step.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "During metaphase, chromosomes line up along the equator (middle) of the cell at the metaphase plate.",
        correctAnswer: true,
        points: 5,
        explanation: "Metaphase is the stage where spindle fibers from opposite poles attach to the centromeres of chromosomes and align them at the cell's equatorial plane — the metaphase plate — making it the easiest stage for counting chromosomes.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "During anaphase, the nuclear envelope reforms and chromosomes decondense back into chromatin.",
        correctAnswer: false,
        points: 5,
        explanation: "The nuclear envelope reforms and chromosomes decondense during telophase, not anaphase. During anaphase, sister chromatids are pulled apart to opposite poles of the cell by shortening spindle fibers.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Mitosis produces two genetically identical daughter cells, each with the same number of chromosomes as the parent cell.",
        correctAnswer: true,
        points: 5,
        explanation: "The entire purpose of mitosis is to distribute an identical copy of the genome to each daughter cell. In humans, this means each daughter cell receives 46 chromosomes — identical to the parent cell.",
      },
      {
        id: "q4",
        type: "true-false",
        question: "Spindle fibers are made of actin microfilaments and are used during prophase to condense chromosomes.",
        correctAnswer: false,
        points: 5,
        explanation: "Spindle fibers are made of microtubules (tubulin protein), not actin microfilaments. They form during prophase but their role is to attach to chromosomes and pull them apart — not to condense chromosomes. Condensation of chromosomes during prophase is driven by coiling of the chromatin.",
      },
      {
        id: "q5",
        type: "true-false",
        question: "In plant cells, cytokinesis occurs by the formation of a cell plate down the middle of the dividing cell.",
        correctAnswer: true,
        points: 5,
        explanation: "Plant cells cannot form a cleavage furrow (as animal cells do) because of their rigid cell wall. Instead, vesicles from the Golgi apparatus fuse along the center of the cell to form a new cell plate, which becomes the new cell wall dividing the two daughter cells.",
      },
    ],
  },

  // ── Lesson 45: Importance and Applications of Mitosis — fill-blanks ───────
  "lesson-45": {
    lessonId: "lesson-45",
    title: "Importance and Applications of Mitosis",
    description: "Complete each statement about the importance and real-world applications of mitosis.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question: "Mitosis allows multicellular organisms to ___ from a single fertilized egg into a complex adult body made of trillions of ___.",
        blanks: ["grow", "cells"],
        points: 5,
      },
      {
        id: "q2",
        type: "fill-blanks",
        question: "When you cut your skin, cells at the edges of the wound divide through ___ to produce new skin cells and ___ the damaged tissue.",
        blanks: ["mitosis", "repair"],
        points: 5,
      },
      {
        id: "q3",
        type: "fill-blanks",
        question: "Cancer occurs when cells bypass the cell cycle ___ and divide ___, forming a mass of cells called a tumor.",
        blanks: ["checkpoints", "uncontrollably"],
        points: 5,
      },
      {
        id: "q4",
        type: "fill-blanks",
        question: "Red blood cells live only about 120 days. Your ___ continuously produces new red blood cells through cell division to ___ the ones that die.",
        blanks: ["bone marrow", "replace"],
        points: 5,
      },
      {
        id: "q5",
        type: "fill-blanks",
        question: "In some single-celled organisms like amoeba, mitosis is used for ___ reproduction, producing offspring that are ___ identical to the parent cell.",
        blanks: ["asexual", "genetically"],
        points: 5,
      },
    ],
  },
};
