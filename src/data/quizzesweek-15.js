// Week 15 quizzes — Grade 7 Science: Cell Division

export const QUIZZES_WEEK_15 = {
  // ── w15-l1: Mitosis Cell Division — mixed ─────────────────────────────────
  "w15-l1": {
    lessonId: "w15-l1",
    title: "Mitosis Cell Division",
    description:
      "Test your knowledge of the four stages of mitosis and what happens at each step.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question:
          "During metaphase, chromosomes line up along the middle of the cell at the metaphase plate.",
        correctAnswer: true,
        points: 5,
        explanation:
          "In metaphase, spindle fibres from opposite poles attach at each centromere and align the chromosomes across the cell's equator — which makes this the easiest stage for counting chromosomes.",
      },
      {
        id: "q2",
        type: "true-false",
        question:
          "During anaphase, the nuclear envelope reforms and chromosomes decondense back into chromatin.",
        correctAnswer: false,
        points: 5,
        explanation:
          "That happens in telophase, not anaphase. During anaphase the sister chromatids are pulled apart to opposite poles by shortening spindle fibres.",
      },
      {
        id: "q3",
        type: "true-false",
        question:
          "Mitosis produces two genetically identical daughter cells, each with the same chromosome number as the parent.",
        correctAnswer: true,
        points: 5,
        explanation:
          "That is the whole purpose of mitosis. In humans each daughter cell receives all 46 chromosomes — an exact copy of the parent cell.",
      },
      {
        id: "q4",
        type: "true-false",
        question:
          "DNA is copied during mitosis itself, in prophase.",
        correctAnswer: false,
        points: 5,
        explanation:
          "DNA is copied during S phase of interphase, BEFORE mitosis begins. Mitosis separates copies that already exist — it does not make them.",
      },
      {
        id: "q5",
        type: "true-false",
        question:
          "In plant cells, cytokinesis occurs by forming a cell plate down the middle of the dividing cell.",
        correctAnswer: true,
        points: 5,
        explanation:
          "A plant cell cannot form a cleavage furrow because of its rigid cell wall. Instead, vesicles from the Golgi line up along the centre and fuse into a cell plate, which becomes the new wall.",
      },
      {
        id: "q6",
        type: "ordering",
        question:
          "Arrange the stages of mitosis and cytokinesis in the correct order:",
        items: [
          "Prophase — chromosomes condense and the nuclear membrane breaks down",
          "Metaphase — chromosomes line up at the metaphase plate",
          "Anaphase — sister chromatids are pulled to opposite poles",
          "Telophase — nuclear envelopes reform and chromosomes decondense",
          "Cytokinesis — the cytoplasm divides into two daughter cells",
        ],
        points: 15,
      },
      {
        id: "q7",
        type: "identification",
        question:
          "What mnemonic is used to remember the four stages of mitosis in order?",
        correctAnswer: "PMAT",
        acceptedAnswers: [
          "pmat",
          "p m a t",
          "prophase metaphase anaphase telophase",
        ],
        points: 5,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Compare cytokinesis in an animal cell with cytokinesis in a plant cell. Explain why the two processes differ.",
        points: 10,
        rubric:
          "Animal cells: the flexible cell membrane pinches inward, forming a cleavage furrow, as a ring of protein filaments tightens like a drawstring. Plant cells: the rigid cell wall cannot be pinched, so vesicles from the Golgi line up along the centre and fuse to form a cell plate that grows outward into a new cell wall. The difference exists because only plant cells have a rigid cell wall.",
      },
    ],
  },

  // ── w15-l2: Meiosis Cell Division — mixed ─────────────────────────────────
  "w15-l2": {
    lessonId: "w15-l2",
    title: "Meiosis Cell Division",
    description:
      "Test your knowledge of the stages of meiosis, where genetic variation comes from, and how meiosis differs from mitosis.",
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
          "Crossing over",
          "Independent assortment",
        ],
        rightItems: [
          "Cell division producing four genetically unique sex cells from one parent cell",
          "A sex cell (sperm or egg) containing half the normal chromosome number",
          "A cell containing only one complete set of chromosomes (n)",
          "A cell containing two complete sets of chromosomes (2n)",
          "The exchange of DNA segments between homologous chromosomes in Prophase I",
          "The random orientation of each homologous pair at Metaphase I",
        ],
        correctPairs: {
          Meiosis:
            "Cell division producing four genetically unique sex cells from one parent cell",
          Gamete:
            "A sex cell (sperm or egg) containing half the normal chromosome number",
          Haploid: "A cell containing only one complete set of chromosomes (n)",
          Diploid: "A cell containing two complete sets of chromosomes (2n)",
          "Crossing over":
            "The exchange of DNA segments between homologous chromosomes in Prophase I",
          "Independent assortment":
            "The random orientation of each homologous pair at Metaphase I",
        },
        points: 15,
      },
      {
        id: "q2",
        type: "identification",
        question:
          "During which division of meiosis is the chromosome number actually halved — Meiosis I or Meiosis II?",
        correctAnswer: "Meiosis I",
        acceptedAnswers: ["meiosis i", "meiosis 1", "meiosis one", "the first"],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question:
          "How many haploid daughter cells are produced at the end of meiosis from one diploid parent cell?",
        correctAnswer: "four",
        acceptedAnswers: ["four", "4", "four cells", "4 cells"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question:
          "In which phase of meiosis does crossing over take place?",
        correctAnswer: "Prophase I",
        acceptedAnswers: [
          "prophase i",
          "prophase 1",
          "prophase one",
          "in prophase i",
        ],
        points: 5,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "Why does meiosis halve the chromosome number even though there are two divisions?",
        options: [
          "Because DNA is destroyed between the two divisions",
          "Because DNA is replicated only once, before Meiosis I, and there is no replication between the two divisions",
          "Because half the chromosomes are discarded as waste",
          "Because the second division copies only half the DNA",
        ],
        correctAnswer:
          "Because DNA is replicated only once, before Meiosis I, and there is no replication between the two divisions",
        points: 5,
        explanation:
          "One round of copying followed by two rounds of separating means the chromosome number is halved. This is the single key difference from mitosis, which has one copying and one separating.",
      },
      {
        id: "q6",
        type: "multiple-choice",
        question:
          "Which statement about Meiosis II is correct?",
        options: [
          "Crossing over occurs again in Prophase II",
          "DNA is replicated again before Meiosis II begins",
          "It separates sister chromatids and is very similar to mitosis",
          "It separates homologous pairs for the second time",
        ],
        correctAnswer:
          "It separates sister chromatids and is very similar to mitosis",
        points: 5,
        explanation:
          "Meiosis II works almost exactly like mitosis, except that it starts with haploid cells. Homologous pairs were already separated in Meiosis I.",
      },
      {
        id: "q7",
        type: "ordering",
        question:
          "Arrange these events in the correct sequence for meiosis, from first to last:",
        items: [
          "DNA is replicated during S phase of interphase",
          "Prophase I — homologous chromosomes pair up and crossing over occurs",
          "Metaphase I — homologous pairs line up randomly at the centre",
          "Anaphase I — homologous chromosomes separate, halving the chromosome number",
          "Meiosis II begins with no further DNA replication",
          "Sister chromatids are separated, producing four haploid cells",
        ],
        points: 15,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Give three differences between mitosis and meiosis, and explain why meiosis must produce haploid cells.",
        points: 10,
        rubric:
          "Three differences from: number of daughter cells (2 vs 4); ploidy of daughter cells (diploid vs haploid); genetic identity (identical vs unique); number of divisions (one vs two); crossing over (absent vs present in Prophase I); purpose (growth and repair vs producing gametes). Should explain that gametes must be haploid so that when two fuse at fertilization the normal diploid number is restored — otherwise the chromosome number would double every generation.",
      },
    ],
  },
};
