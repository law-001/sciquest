// Week 11 quizzes — Grade 7 Science: The Microscope

export const QUIZZES_WEEK_11 = {
  // ── w11-l1: The Microscope: An Introduction — mixed ───────────────────────
  "w11-l1": {
    lessonId: "w11-l1",
    title: "The Microscope: An Introduction",
    description:
      "Test your knowledge of microscope parts, magnification, correct handling, and slide preparation.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which part of the compound microscope controls the amount of light passing through the specimen?",
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
        id: "q2",
        type: "multiple-choice",
        question:
          "If the eyepiece is 10× and the objective lens in use is 40×, what is the total magnification?",
        options: ["40×", "50×", "400×", "4000×"],
        correctAnswer: "400×",
        points: 5,
        explanation:
          "Total magnification = eyepiece power × objective power = 10 × 40 = 400×.",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Why should a cover slip be lowered at a 45° angle rather than dropped flat onto the specimen?",
        options: [
          "To make the slide easier to carry",
          "To push air ahead of the liquid and avoid trapping bubbles",
          "To increase the magnification of the specimen",
          "To stop the stain from drying out",
        ],
        correctAnswer:
          "To push air ahead of the liquid and avoid trapping bubbles",
        points: 5,
        explanation:
          "Lowering at an angle lets the liquid spread and push the air out ahead of it. Dropping it flat traps air, producing dark-edged circles that hide parts of the specimen.",
      },
      {
        id: "q4",
        type: "identification",
        question:
          "What is the name of the lens at the top of the microscope that you look through, usually magnifying 10×?",
        correctAnswer: "eyepiece",
        acceptedAnswers: ["eyepiece", "ocular lens", "ocular", "eyepiece lens"],
        points: 5,
      },
      {
        id: "q5",
        type: "identification",
        question:
          "What is the thin square of glass placed over a specimen to protect it and hold it flat?",
        correctAnswer: "cover slip",
        acceptedAnswers: ["cover slip", "coverslip", "cover glass"],
        points: 5,
      },
      {
        id: "q6",
        type: "identification",
        question:
          "Which stain is commonly used to highlight the nucleus of animal cells such as cheek cells?",
        correctAnswer: "methylene blue",
        acceptedAnswers: ["methylene blue", "methylene blue stain"],
        points: 5,
      },
      {
        id: "q7",
        type: "ordering",
        question:
          "Arrange these steps in the correct order for using a compound microscope:",
        items: [
          "Carry the microscope with one hand on the arm and one under the base",
          "Click the lowest power objective (4×) into position",
          "Place the prepared slide on the stage and secure it with the stage clips",
          "Watching from the side, use the coarse adjustment knob to bring the stage close to the objective",
          "Look through the eyepiece and turn the coarse knob slowly to find the image",
          "Switch to a higher objective and sharpen using only the fine adjustment knob",
        ],
        points: 15,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "A student looks at a wet mount and sees several perfectly round dark-edged circles covering part of the specimen. Explain what these are, what caused them, and how to avoid them next time.",
        points: 10,
        rubric:
          "Should identify them as air bubbles trapped under the cover slip, caused by lowering the cover slip flat instead of at an angle. To avoid them, hold the cover slip at about 45°, touch its edge to the side of the water drop, and lower it slowly so the liquid pushes the air out ahead of it.",
      },
    ],
  },

  // ── w11-l2: The Importance of Microscope Discovery — mixed ────────────────
  "w11-l2": {
    lessonId: "w11-l2",
    title: "The Importance of Microscope Discovery",
    description:
      "Test your knowledge of the history of the microscope and the discoveries it made possible.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question:
          "Robert Hooke named the tiny structures he saw in cork 'cells' because they reminded him of the small rooms monks lived in.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Hooke coined the term from the Latin 'cellula', meaning small room, after observing the box-like compartments in cork in 1665. He published the drawings in Micrographia.",
      },
      {
        id: "q2",
        type: "true-false",
        question:
          "Antonie van Leeuwenhoek was the first person to observe living microorganisms.",
        correctAnswer: true,
        points: 5,
        explanation:
          "In the 1670s van Leeuwenhoek used lenses he ground himself, reaching over 200× magnification, to observe bacteria and protozoa for the first time. He called them 'animalcules' and is known as the Father of Microbiology.",
      },
      {
        id: "q3",
        type: "true-false",
        question:
          "An electron microscope can be used to watch living cells moving in real time.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Electron microscopes cannot show living specimens — the preparation process kills the sample. Only a light microscope can observe living cells in motion.",
      },
      {
        id: "q4",
        type: "true-false",
        question:
          "Germ theory — the understanding that specific microorganisms cause specific diseases — could not have been established without the microscope.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Pasteur and Koch needed to see and identify the microbes responsible before they could link them to particular diseases. The microscope made that possible, and antiseptic surgery, vaccines, and antibiotics all followed.",
      },
      {
        id: "q5",
        type: "matching",
        question:
          "Match each scientist or instrument to their contribution.",
        leftItems: [
          "Zacharias Janssen",
          "Robert Hooke",
          "Antonie van Leeuwenhoek",
          "Pasteur and Koch",
          "The electron microscope",
        ],
        rightItems: [
          "Built one of the first compound microscopes in the 1590s",
          "Observed cork in 1665 and named the 'cell'",
          "First to observe living microorganisms in the 1670s",
          "Showed that specific microbes cause specific diseases",
          "Uses a beam of electrons to magnify up to two million times",
        ],
        correctPairs: {
          "Zacharias Janssen":
            "Built one of the first compound microscopes in the 1590s",
          "Robert Hooke": "Observed cork in 1665 and named the 'cell'",
          "Antonie van Leeuwenhoek":
            "First to observe living microorganisms in the 1670s",
          "Pasteur and Koch":
            "Showed that specific microbes cause specific diseases",
          "The electron microscope":
            "Uses a beam of electrons to magnify up to two million times",
        },
        points: 15,
      },
      {
        id: "q6",
        type: "multiple-choice",
        question:
          "Which statement best explains why improvements in lens quality mattered so much to biology?",
        options: [
          "Better lenses made microscopes cheaper to build",
          "Better lenses improved resolution, revealing finer structures and raising new questions",
          "Better lenses made specimens live longer",
          "Better lenses removed the need to prepare slides",
        ],
        correctAnswer:
          "Better lenses improved resolution, revealing finer structures and raising new questions",
        points: 5,
        explanation:
          "Resolution is the ability to show two close points as separate. Each improvement revealed structures nobody had seen, which is how the cell, then bacteria, then organelles were each discovered in turn.",
      },
      {
        id: "q7",
        type: "short-answer",
        question:
          "Compare a light microscope and an electron microscope. Give two advantages of each, and explain when a scientist would choose one over the other.",
        points: 10,
        rubric:
          "Light microscope advantages: can observe LIVING specimens in real time; shows natural colour; small, affordable, available in schools; magnifies up to about 1,500×. Electron microscope advantages: magnifies up to about 2,000,000×; reveals organelles, viruses, and molecular detail. A scientist chooses a light microscope to watch a living process and an electron microscope to see ultra-fine structure in a dead, prepared sample.",
      },
    ],
  },
};
