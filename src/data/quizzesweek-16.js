// Week 16 quizzes — Grade 7 Science

export const QUIZZES_WEEK_16 = {
  "lesson-46": {
    lessonId: "lesson-46",
    title: "Introduction to Meiosis",
    description: "Test your understanding of meiosis, gametes, and the key vocabulary of sexual cell division.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question: "Match each meiosis term to its correct definition.",
        leftItems: [
          "Meiosis",
          "Gamete",
          "Haploid",
          "Diploid",
          "Crossing Over",
          "Zygote"
        ],
        rightItems: [
          "Cell division producing four genetically unique sex cells from one parent cell",
          "A sex cell (sperm or egg) that contains half the normal chromosome number",
          "A cell containing only one complete set of chromosomes (n)",
          "A cell containing two complete sets of chromosomes (2n)",
          "Exchange of DNA segments between homologous chromosomes during Prophase I",
          "The diploid cell formed when a sperm and egg fuse during fertilization"
        ],
        correctPairs: {
          "Meiosis": "Cell division producing four genetically unique sex cells from one parent cell",
          "Gamete": "A sex cell (sperm or egg) that contains half the normal chromosome number",
          "Haploid": "A cell containing only one complete set of chromosomes (n)",
          "Diploid": "A cell containing two complete sets of chromosomes (2n)",
          "Crossing Over": "Exchange of DNA segments between homologous chromosomes during Prophase I",
          "Zygote": "The diploid cell formed when a sperm and egg fuse during fertilization"
        },
        points: 15
      }
    ]
  },

  "lesson-47": {
    lessonId: "lesson-47",
    title: "Stages of Meiosis",
    description: "Test your knowledge of the phases of Meiosis I and Meiosis II and what happens at each stage.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question: "What is the name of the process in Prophase I where homologous chromosomes exchange DNA segments?",
        correctAnswer: "Crossing over",
        acceptedAnswers: ["crossing over", "Crossing Over", "crossover", "genetic recombination"],
        points: 5
      },
      {
        id: "q2",
        type: "identification",
        question: "What type of cells are produced at the END of Meiosis II?",
        correctAnswer: "Haploid cells",
        acceptedAnswers: ["haploid cells", "haploid", "haploid daughter cells", "gametes"],
        points: 5
      },
      {
        id: "q3",
        type: "identification",
        question: "During which phase of Meiosis I do homologous chromosome pairs line up along the center of the cell?",
        correctAnswer: "Metaphase I",
        acceptedAnswers: ["Metaphase I", "metaphase I", "metaphase 1"],
        points: 5
      },
      {
        id: "q4",
        type: "identification",
        question: "What is the term for the random alignment of homologous chromosome pairs during Metaphase I, which produces genetic variation?",
        correctAnswer: "Independent assortment",
        acceptedAnswers: ["independent assortment", "Independent Assortment", "independent alignment"],
        points: 5
      },
      {
        id: "q5",
        type: "identification",
        question: "How many haploid daughter cells are produced at the end of Meiosis II from one original diploid parent cell?",
        correctAnswer: "Four",
        acceptedAnswers: ["four", "4", "four cells", "4 cells"],
        points: 5
      }
    ]
  },

  "lesson-48": {
    lessonId: "lesson-48",
    title: "Comparing Mitosis and Meiosis",
    description: "Test your understanding of the key differences between mitosis and meiosis.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "ordering",
        question: "Arrange these events in the correct logical sequence when comparing mitosis and meiosis — from what happens first to last:",
        items: [
          "DNA replication occurs in S phase (same for both mitosis and meiosis)",
          "Meiosis I: crossing over occurs between homologous chromosomes in Prophase I",
          "Meiosis I: homologous pairs separate — chromosome number is halved",
          "Meiosis II begins without further DNA replication",
          "Sister chromatids are separated (in Meiosis II or mitosis)",
          "Final result: two diploid identical cells (mitosis) OR four haploid unique cells (meiosis)"
        ],
        points: 15
      }
    ]
  }
};
