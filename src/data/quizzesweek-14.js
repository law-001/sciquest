// Week 14 quizzes — Grade 7 Science: Cell Reproduction and the Cell Cycle

export const QUIZZES_WEEK_14 = {
  // ── w14-l1: Cell Reproduction — mixed ─────────────────────────────────────
  "w14-l1": {
    lessonId: "w14-l1",
    title: "Cell Reproduction",
    description:
      "Test your understanding of why cells divide, what chromosomes carry, and what happens when division is not controlled.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which of these is NOT a reason that cells divide?",
        options: [
          "To allow an organism to grow",
          "To repair damaged tissue",
          "To replace worn-out cells",
          "To make each individual cell larger",
        ],
        correctAnswer: "To make each individual cell larger",
        points: 5,
        explanation:
          "Division makes MORE cells, not bigger ones. In fact a cell divides partly because it has grown too large — its volume outgrows its surface area, so the membrane can no longer supply it efficiently.",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "What is the correct name for the two identical copies of a chromosome that stay joined at the centromere after replication?",
        options: [
          "Homologous chromosomes",
          "Sister chromatids",
          "Gametes",
          "Spindle fibres",
        ],
        correctAnswer: "Sister chromatids",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Why can chromosomes not normally be seen in a cell that is not dividing?",
        options: [
          "The cell destroys them and rebuilds them each time",
          "The DNA is loose and uncoiled as chromatin, so it is too thin to see",
          "Chromosomes exist only in dividing cells",
          "The nucleus hides them behind the nuclear membrane",
        ],
        correctAnswer:
          "The DNA is loose and uncoiled as chromatin, so it is too thin to see",
        points: 5,
        explanation:
          "For most of a cell's life DNA is uncoiled chromatin so the cell can read it. It condenses into thick, visible chromosomes only when the cell prepares to divide.",
      },
      {
        id: "q4",
        type: "fill-blanks",
        question:
          "Mitosis allows an organism to ___ from a single fertilised egg into a body made of trillions of ___.",
        blanks: ["grow", "cells"],
        points: 5,
      },
      {
        id: "q5",
        type: "fill-blanks",
        question:
          "When you cut your skin, cells at the edges of the wound divide by ___ to produce new cells and ___ the damaged tissue.",
        blanks: ["mitosis", "repair"],
        points: 5,
      },
      {
        id: "q6",
        type: "fill-blanks",
        question:
          "Cancer occurs when cells bypass the cell cycle ___ and divide ___, forming a mass of cells called a tumour.",
        blanks: ["checkpoints", "uncontrollably"],
        points: 5,
      },
      {
        id: "q7",
        type: "identification",
        question:
          "What is the term for the control that makes healthy cells stop dividing once they touch neighbouring cells — the reason a healing wound does not overshoot?",
        correctAnswer: "contact inhibition",
        acceptedAnswers: ["contact inhibition", "contact-inhibition"],
        points: 5,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Explain why it is so important that DNA is copied accurately before a cell divides, and describe what can happen if the copies are not separated correctly.",
        points: 10,
        rubric:
          "Should explain that each daughter cell must receive a complete and correct set of instructions to function properly. If separation goes wrong, one daughter cell ends up with too many chromosomes and the other with too few, which usually prevents the cell from working properly and can cause serious conditions or cell death.",
      },
    ],
  },

  // ── w14-l2: The Cell Cycle — multiple-choice ──────────────────────────────
  "w14-l2": {
    lessonId: "w14-l2",
    title: "The Cell Cycle",
    description:
      "Test your understanding of the phases of the cell cycle and the checkpoints that control it.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "During which phase of the cell cycle does DNA replication take place?",
        options: ["G1 Phase", "S Phase", "G2 Phase", "Mitosis"],
        correctAnswer: "S Phase",
        points: 5,
        explanation:
          "S stands for synthesis — the synthesis of new DNA strands. All the copying happens here, before mitosis begins.",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "Which of these correctly describes what happens during G1 phase?",
        options: [
          "The cell copies all of its DNA",
          "The cell physically divides into two daughter cells",
          "The cell grows in size and carries out its normal functions",
          "Chromosomes separate and move to opposite poles",
        ],
        correctAnswer:
          "The cell grows in size and carries out its normal functions",
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
        correctAnswer:
          "To ensure the cell has correctly completed each phase before proceeding",
        points: 5,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question:
          "Roughly what proportion of the cell cycle does a cell spend in interphase?",
        options: ["About 10%", "About 25%", "About 50%", "About 90%"],
        correctAnswer: "About 90%",
        points: 5,
        explanation:
          "A cell spends roughly 90% of its life in interphase, growing and doing its normal job, and only about 10% actually dividing.",
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "The phase in which the cytoplasm divides to produce two separate daughter cells is called:",
        options: ["Telophase", "G2 Phase", "Anaphase", "Cytokinesis"],
        correctAnswer: "Cytokinesis",
        points: 5,
      },
      {
        id: "q6",
        type: "multiple-choice",
        question:
          "What is G0 phase, and which cells are typically found in it?",
        options: [
          "The fastest phase of division, found in bacteria",
          "A resting state outside the cycle, where cells that will not divide remain — such as most neurons",
          "The stage where DNA is destroyed",
          "The final stage of cytokinesis in plant cells",
        ],
        correctAnswer:
          "A resting state outside the cycle, where cells that will not divide remain — such as most neurons",
        points: 5,
        explanation:
          "Cells exit the cycle at the G1 checkpoint into G0 if they are not going to divide. Most neurons in your brain stay in G0 permanently, which is part of why nerve damage heals so poorly.",
      },
      {
        id: "q7",
        type: "multiple-choice",
        question:
          "Cancer cells are dangerous because they:",
        options: [
          "Divide too slowly to repair damaged tissue",
          "Refuse to undergo cytokinesis",
          "Bypass cell cycle checkpoints and divide uncontrollably",
          "Stop producing DNA during S phase",
        ],
        correctAnswer:
          "Bypass cell cycle checkpoints and divide uncontrollably",
        points: 5,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Name the three checkpoints of the cell cycle and state what each one checks for.",
        points: 10,
        rubric:
          "G1 checkpoint: is the cell large enough, are nutrients available, and is the DNA undamaged? G2 checkpoint: was all the DNA copied, and copied correctly? M checkpoint (during mitosis): is every chromosome properly attached to the spindle before they are pulled apart? Should also note that a cell which cannot repair damage may trigger apoptosis rather than pass on faulty DNA.",
      },
    ],
  },
};
