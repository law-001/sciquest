// Week 17 quizzes — Grade 7 Science

export const QUIZZES_WEEK_17 = {
  "lesson-49": {
    lessonId: "lesson-49",
    title: "Fertilization",
    description: "Test your understanding of fertilization, zygote formation, and the difference between internal and external fertilization.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is the cell called that is formed when a sperm cell and an egg cell fuse during fertilization?",
        options: ["Embryo", "Gamete", "Zygote", "Blastomere"],
        correctAnswer: "Zygote",
        points: 5
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "After fertilization, how many chromosomes does the human zygote contain?",
        options: ["23", "46", "92", "12"],
        correctAnswer: "46",
        points: 5
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "Which of the following animals uses EXTERNAL fertilization?",
        options: ["Dog", "Eagle", "Frog", "Cat"],
        correctAnswer: "Frog",
        points: 5
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "What type of cell division does the zygote undergo immediately after fertilization to develop into an embryo?",
        options: ["Meiosis", "Binary fission", "Budding", "Mitosis"],
        correctAnswer: "Mitosis",
        points: 5
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "Which of the following correctly describes the chromosome status of the zygote?",
        options: [
          "Haploid — contains one set of chromosomes from the egg only",
          "Diploid — contains one set of chromosomes from each parent",
          "Haploid — contains one set of chromosomes from the sperm only",
          "Diploid — contains two sets of chromosomes from the egg only"
        ],
        correctAnswer: "Diploid — contains one set of chromosomes from each parent",
        points: 5
      }
    ]
  },

  "lesson-50": {
    lessonId: "lesson-50",
    title: "Sexual Reproduction",
    description: "Test your understanding of sexual reproduction, genetic variation, and how different organisms reproduce sexually.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "Sexual reproduction always requires two parents — one male and one female — each contributing a gamete.",
        correctAnswer: true,
        points: 5,
        explanation: "Sexual reproduction requires two parents. Each contributes a gamete (sperm from the male, egg from the female), which fuse during fertilization."
      },
      {
        id: "q2",
        type: "true-false",
        question: "Offspring produced through sexual reproduction are genetically identical to both parents.",
        correctAnswer: false,
        points: 5,
        explanation: "Offspring from sexual reproduction are genetically UNIQUE — different from both parents — because they receive a mix of genetic material from each parent through meiosis and fertilization."
      },
      {
        id: "q3",
        type: "true-false",
        question: "Gametes (sperm and eggs) are produced through the process of meiosis.",
        correctAnswer: true,
        points: 5,
        explanation: "Meiosis is the cell division process that produces gametes. Each gamete contains half the normal chromosome number (haploid) so that when two gametes fuse, the full chromosome number is restored."
      },
      {
        id: "q4",
        type: "true-false",
        question: "Flowering plants reproduce sexually through the process of pollination and fertilization.",
        correctAnswer: true,
        points: 5,
        explanation: "In flowering plants, pollen (containing sperm) is transferred to the flower's stigma by wind or insects (pollination). The sperm then travels to the egg cell in the ovary and fertilization occurs."
      },
      {
        id: "q5",
        type: "true-false",
        question: "Sexual reproduction is faster and more energy-efficient than asexual reproduction.",
        correctAnswer: false,
        points: 5,
        explanation: "Sexual reproduction is actually SLOWER and more energy-intensive than asexual reproduction — it requires finding a mate, producing gametes through meiosis, and fertilization. Asexual reproduction is faster and more efficient."
      }
    ]
  },

  "lesson-51": {
    lessonId: "lesson-51",
    title: "Asexual Reproduction",
    description: "Test your knowledge of asexual reproduction types including binary fission, budding, fragmentation, and vegetative propagation.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question: "Asexual reproduction requires only ___ parent, and the offspring are genetically ___ to the parent.",
        blanks: ["one", "identical"],
        points: 5
      },
      {
        id: "q2",
        type: "fill-blanks",
        question: "Bacteria reproduce asexually by a process called ___ ___, where the parent cell splits into two equal daughter cells.",
        blanks: ["binary", "fission"],
        points: 5
      },
      {
        id: "q3",
        type: "fill-blanks",
        question: "When a new organism grows directly from the parent's body as a small outgrowth, this is called ___. Yeast and Hydra reproduce this way.",
        blanks: ["budding"],
        points: 5
      },
      {
        id: "q4",
        type: "fill-blanks",
        question: "Sea stars can reproduce asexually by ___: a detached body part grows into a complete new organism.",
        blanks: ["fragmentation"],
        points: 5
      },
      {
        id: "q5",
        type: "fill-blanks",
        question: "Strawberry plants reproduce asexually through ___ propagation, sending out long horizontal stems called ___ that root and grow into new plants.",
        blanks: ["vegetative", "runners"],
        points: 5
      }
    ]
  }
};
