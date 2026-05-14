// Week 9 quizzes — Grade 7 Science: Laboratory Equipment

export const QUIZZES_WEEK_09 = {
  // ── Lesson 25: Common Laboratory Equipment — multiple-choice ──────────────
  "lesson-25": {
    lessonId: "lesson-25",
    title: "Common Laboratory Equipment",
    description: "Test your knowledge of common laboratory equipment and their correct functions.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Which piece of laboratory equipment is best for measuring a precise volume of liquid?",
        options: [
          "Beaker",
          "Erlenmeyer flask",
          "Graduated cylinder",
          "Test tube",
        ],
        correctAnswer: "Graduated cylinder",
        points: 5,
        explanation: "A graduated cylinder is specifically designed for precise volume measurement. While beakers and flasks also have volume markings, they are less accurate and are used for mixing and holding liquids, not precise measurement.",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "A student needs to heat a liquid sample over a Bunsen burner safely. Which combination of equipment should they use?",
        options: [
          "Beaker placed directly on the Bunsen burner flame",
          "Test tube held with bare hands over the flame",
          "Beaker on wire gauze on a tripod stand over the Bunsen burner",
          "Erlenmeyer flask placed directly on the Bunsen burner",
        ],
        correctAnswer: "Beaker on wire gauze on a tripod stand over the Bunsen burner",
        points: 5,
        explanation: "The correct setup is: tripod stand → wire gauze → beaker. The tripod supports the beaker above the flame, and the wire gauze distributes the heat evenly to prevent cracking the glassware.",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "What is the main purpose of an Erlenmeyer flask compared to a beaker?",
        options: [
          "It can hold more liquid than a beaker",
          "Its tapered neck reduces spilling when swirling the contents",
          "It is made of a stronger type of glass than a beaker",
          "It can be heated directly over a flame without a tripod",
        ],
        correctAnswer: "Its tapered neck reduces spilling when swirling the contents",
        points: 5,
        explanation: "The conical shape and narrow neck of an Erlenmeyer flask allow the contents to be swirled vigorously without spilling — making it ideal for mixing reactions and growing cultures.",
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "Which of the following is the correct procedure for caring for laboratory glassware?",
        options: [
          "Use cracked glassware for experiments because it still holds liquid",
          "Rinse hot glassware immediately with cold water to clean it quickly",
          "Allow heated glassware to cool completely before rinsing with water",
          "Store wet glassware upside down on any available surface",
        ],
        correctAnswer: "Allow heated glassware to cool completely before rinsing with water",
        points: 5,
        explanation: "Rinsing hot glassware with cold water causes thermal shock, which can crack or shatter the glass. Always allow glassware to cool to room temperature before washing.",
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "A student needs to transfer a small amount of solid chemical from a container to a test tube. Which tool should they use?",
        options: [
          "Glass rod",
          "Forceps or spatula",
          "Graduated cylinder",
          "Rubber stopper",
        ],
        correctAnswer: "Forceps or spatula",
        points: 5,
        explanation: "Forceps (tongs) or a spatula are used to handle and transfer solid materials in the laboratory. Using bare hands risks chemical contamination of both the chemical and the student.",
      },
    ],
  },

  // ── Lesson 26: Using the Microscope — identification ──────────────────────
  "lesson-26": {
    lessonId: "lesson-26",
    title: "Using the Microscope",
    description: "Identify the correct microscope part or value from each description.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question: "What is the name of the lens at the top of the microscope through which the observer looks? It typically has a magnification of 10×.",
        correctAnswer: "eyepiece",
        acceptedAnswers: ["eyepiece", "ocular lens", "ocular", "eyepiece lens"],
        points: 5,
      },
      {
        id: "q2",
        type: "identification",
        question: "A microscope has an eyepiece magnification of 10× and the student is using the high-power objective lens (40×). What is the total magnification?",
        correctAnswer: "400x",
        acceptedAnswers: ["400x", "400×", "400", "400 times"],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question: "What is the name of the flat platform on a microscope where the glass slide is placed for observation?",
        correctAnswer: "stage",
        acceptedAnswers: ["stage", "microscope stage"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question: "Which focusing knob should be used when switching from low power to high power to make fine adjustments to the image?",
        correctAnswer: "fine focus knob",
        acceptedAnswers: ["fine focus knob", "fine adjustment knob", "fine focus", "fine knob"],
        points: 5,
      },
      {
        id: "q5",
        type: "identification",
        question: "What power objective lens should always be selected FIRST when beginning to observe a new specimen on a slide?",
        correctAnswer: "lowest power",
        acceptedAnswers: ["lowest power", "low power", "4x", "4×", "low power objective"],
        points: 5,
      },
    ],
  },

  // ── Lesson 27: Proper Handling of Lab Materials — fill-blanks ─────────────
  "lesson-27": {
    lessonId: "lesson-27",
    title: "Proper Handling of Lab Materials",
    description: "Complete each statement about the correct procedures for handling laboratory materials.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question: "When smelling a chemical in the laboratory, you should use the ___ technique — gently fanning the vapors toward your nose rather than placing your nose directly over the ___.",
        blanks: ["wafting", "container"],
        points: 5,
      },
      {
        id: "q2",
        type: "fill-blanks",
        question: "Before using any piece of glassware, you should ___ it for cracks or chips. Damaged glassware must be ___ to the teacher immediately.",
        blanks: ["inspect", "reported"],
        points: 5,
      },
      {
        id: "q3",
        type: "fill-blanks",
        question: "If a chemical spills on your skin, you should immediately flood the area with large amounts of ___ for at least ___ minutes.",
        blanks: ["water", "15"],
        points: 5,
      },
      {
        id: "q4",
        type: "fill-blanks",
        question: "When handling biological specimens, you should always wear ___ and dispose of all materials according to your ___'s instructions.",
        blanks: ["gloves", "teacher"],
        points: 5,
      },
      {
        id: "q5",
        type: "fill-blanks",
        question: "Broken glass should be cleaned up using a ___ and brush — never with ___ hands.",
        blanks: ["dustpan", "bare"],
        points: 5,
      },
    ],
  },
};
