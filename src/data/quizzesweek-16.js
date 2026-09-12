// Week 16 quizzes — Grade 7 Science: Science Fair and Fertilization

export const QUIZZES_WEEK_16 = {
  // ── w16-l1: Math and Science Fair Performance Task — short-answer ─────────
  "w16-l1": {
    lessonId: "w16-l1",
    title: "2nd Performance Task in Science 7: Math and Science Fair 2025",
    description:
      "Submit your project plan and show that your investigation is properly designed before you begin collecting data.",
    timeLimit: 1800,
    questions: [
      {
        id: "q1",
        type: "short-answer",
        question:
          "State your science fair question and write your hypothesis as an 'If… then… because…' statement.",
        points: 10,
        rubric:
          "The question must be specific and testable, naming something to change and something to measure. The hypothesis must follow the If/then/because structure, with the 'because' giving a scientific reason drawn from background research rather than a guess.",
      },
      {
        id: "q2",
        type: "short-answer",
        question:
          "Identify the independent variable, the dependent variable, and at least THREE controlled variables in your investigation.",
        points: 10,
        rubric:
          "Independent variable: the single factor deliberately changed. Dependent variable: what will be measured, with a stated unit. At least three controlled variables that could plausibly affect the result and are being held constant. Full marks require the dependent variable to be genuinely measurable.",
      },
      {
        id: "q3",
        type: "short-answer",
        question:
          "Describe how you will measure your dependent variable. Name the instrument, the SI unit you will record in, and how many trials you will run.",
        points: 10,
        rubric:
          "Should name an appropriate instrument (ruler, balance, thermometer, stopwatch, graduated cylinder) and the correct SI unit (cm, g, °C, s, mL). Should state at least three trials and explain that repeating reduces the effect of random error and allows a mean to be calculated.",
      },
      {
        id: "q4",
        type: "short-answer",
        question:
          "What type of graph will you use to present your results, and why is it the right choice for your data?",
        points: 10,
        rubric:
          "Should name a line graph for data showing change over time or across a continuous range, or a bar graph for comparing separate groups or categories. Should justify the choice by reference to the kind of data being collected, and mention labelling both axes with quantity and unit.",
      },
      {
        id: "q5",
        type: "essay",
        question:
          "Write the procedure for your investigation as a numbered list of steps. It must be precise enough that a classmate could carry out your experiment exactly, without asking you any questions.",
        minWords: 120,
        points: 25,
      },
    ],
  },

  // ── w16-l2: Fertilization — multiple-choice ───────────────────────────────
  "w16-l2": {
    lessonId: "w16-l2",
    title: "Fertilization",
    description:
      "Test your understanding of fertilization, zygote formation, and internal versus external fertilization.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "What is the cell called that forms when a sperm cell and an egg cell fuse?",
        options: ["Embryo", "Gamete", "Zygote", "Blastomere"],
        correctAnswer: "Zygote",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "After fertilization, how many chromosomes does a human zygote contain?",
        options: ["23", "46", "92", "12"],
        correctAnswer: "46",
        points: 5,
        explanation:
          "The sperm contributes 23 and the egg contributes 23, restoring the full diploid number of 46.",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Which of these animals uses EXTERNAL fertilization?",
        options: ["Dog", "Eagle", "Frog", "Cat"],
        correctAnswer: "Frog",
        points: 5,
        explanation:
          "Frogs release eggs and sperm into water, where fertilization takes place outside the body. External fertilization needs water so the sperm can swim to the eggs.",
      },
      {
        id: "q4",
        type: "multiple-choice",
        question:
          "What type of cell division does the zygote undergo immediately after fertilization?",
        options: ["Meiosis", "Binary fission", "Budding", "Mitosis"],
        correctAnswer: "Mitosis",
        points: 5,
        explanation:
          "The zygote divides by mitosis, producing genetically identical cells. This is why every cell in your body carries the same DNA.",
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "Why is it essential that gametes are haploid before fertilization?",
        options: [
          "So that the zygote will have half the normal chromosome number",
          "So that when two gametes fuse, the normal diploid number is restored rather than doubled",
          "Because haploid cells are larger and easier to fuse",
          "Because haploid cells do not need energy",
        ],
        correctAnswer:
          "So that when two gametes fuse, the normal diploid number is restored rather than doubled",
        points: 5,
        explanation:
          "The halving done by meiosis and the doubling done by fertilization balance exactly. If gametes were diploid, the chromosome number would double with every generation.",
      },
      {
        id: "q6",
        type: "multiple-choice",
        question:
          "What prevents a second sperm from entering the egg once one has already fertilised it?",
        options: [
          "The egg immediately begins dividing",
          "A fertilization membrane forms around the egg",
          "The remaining sperm die instantly",
          "The egg shrinks in size",
        ],
        correctAnswer: "A fertilization membrane forms around the egg",
        points: 5,
      },
      {
        id: "q7",
        type: "true-false",
        question:
          "Animals that use external fertilization generally produce far more eggs than animals that use internal fertilization.",
        correctAnswer: true,
        points: 5,
        explanation:
          "External fertilization exposes eggs and embryos to predators and changing conditions, so survival per egg is very low. Producing huge numbers compensates. Internal fertilization protects each offspring, so fewer are needed.",
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Describe what happens from the moment a sperm penetrates an egg to the formation of an embryo.",
        points: 10,
        rubric:
          "Should describe: one sperm penetrates the egg's outer layer and a fertilization membrane forms to block others; the sperm's 23 chromosomes fuse with the egg's 23 to form a diploid zygote with 46; the zygote immediately begins dividing by mitosis into 2, 4, 8 cells and onward; as division continues the cells differentiate into specialised types and the organism is then called an embryo.",
      },
    ],
  },
};
