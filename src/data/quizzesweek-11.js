// Week 11 quizzes — Grade 7 Science: The Microscope

export const QUIZZES_WEEK_11 = {
  // ── Lesson 31: History and Parts of the Microscope — multiple-choice ─────
  "lesson-31": {
    lessonId: "lesson-31",
    title: "History and Parts of the Microscope",
    description: "Test your understanding of microscope history and the function of its main parts.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Who is credited with building one of the first compound microscopes in the 1590s?",
        options: [
          "Robert Hooke",
          "Antonie van Leeuwenhoek",
          "Zacharias Janssen",
          "Rudolf Virchow",
        ],
        correctAnswer: "Zacharias Janssen",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "Robert Hooke used a microscope in 1665 to observe thin slices of cork. What did he name the tiny box-like structures he saw?",
        options: [
          "Atoms",
          "Cells",
          "Microbes",
          "Organelles",
        ],
        correctAnswer: "Cells",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "Which part of the compound microscope controls the amount of light passing through the specimen?",
        options: [
          "Stage clips",
          "Revolving nosepiece",
          "Diaphragm",
          "Coarse adjustment knob",
        ],
        correctAnswer: "Diaphragm",
        points: 5,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "If the eyepiece is 10x and the objective lens in use is 40x, what is the total magnification?",
        options: [
          "40x",
          "50x",
          "400x",
          "4000x",
        ],
        correctAnswer: "400x",
        points: 5,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "Antonie van Leeuwenhoek is known as the 'Father of Microbiology' because he was the first person to:",
        options: [
          "Name the cell",
          "Build a microscope with two lenses",
          "Observe living microorganisms",
          "Develop the electron microscope",
        ],
        correctAnswer: "Observe living microorganisms",
        points: 5,
      },
    ],
  },

  // ── Lesson 32: Using the Microscope Correctly — ordering ─────────────────
  "lesson-32": {
    lessonId: "lesson-32",
    title: "Using the Microscope Correctly",
    description: "Arrange the steps for correctly using a compound microscope in the proper order.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "ordering",
        question: "Arrange the following steps in the correct order for using a compound microscope:",
        items: [
          "Carry the microscope to your workstation with one hand on the arm and one under the base",
          "Place the prepared slide on the stage and secure it with the stage clips",
          "Click the lowest power objective (4x) into position",
          "Use the coarse adjustment knob to bring the specimen into rough focus",
          "Switch to a higher power objective and use only the fine adjustment knob to sharpen the image",
          "When finished, return to the lowest power objective and remove the slide",
        ],
        points: 15,
      },
    ],
  },

  // ── Lesson 33: Preparing Microscope Slides — identification ──────────────
  "lesson-33": {
    lessonId: "lesson-33",
    title: "Preparing Microscope Slides",
    description: "Test your knowledge of slide preparation terms and techniques.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question: "What is the name of the slide preparation method where the specimen is placed in a drop of water and covered with a cover slip?",
        correctAnswer: "wet mount",
        acceptedAnswers: ["wet mount", "wet-mount"],
        points: 5,
      },
      {
        id: "q2",
        type: "identification",
        question: "What is the thin, square piece of glass placed over a specimen on a slide to protect it and keep it flat?",
        correctAnswer: "cover slip",
        acceptedAnswers: ["cover slip", "coverslip", "cover glass"],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question: "What is the colored chemical solution added to a specimen to increase contrast and make cell structures more visible?",
        correctAnswer: "stain",
        acceptedAnswers: ["stain", "dye", "staining solution"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question: "At what angle should the cover slip be held before slowly lowering it onto the slide to prevent air bubbles?",
        correctAnswer: "45 degrees",
        acceptedAnswers: ["45 degrees", "45°", "45-degree angle", "forty-five degrees"],
        points: 5,
      },
      {
        id: "q5",
        type: "identification",
        question: "What common stain is used to highlight the nucleus of animal cells (such as cheek cells) during slide preparation?",
        correctAnswer: "methylene blue",
        acceptedAnswers: ["methylene blue", "methylene blue stain"],
        points: 5,
      },
    ],
  },
};
