// Week 12 quizzes — Grade 7 Science: The Cell

export const QUIZZES_WEEK_12 = {
  // ── w12-l1: The Cell Theory and Its Diversity — mixed ─────────────────────
  "w12-l1": {
    lessonId: "w12-l1",
    title: "The Cell Theory and Its Diversity",
    description:
      "Test your knowledge of cell theory, the scientists behind it, and the two major categories of cell.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question:
          "Matthias Schleiden concluded that animals — not plants — are made of cells.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Schleiden (1838) concluded that PLANTS are made of cells. It was Theodor Schwann (1839) who extended the conclusion to animals.",
      },
      {
        id: "q2",
        type: "true-false",
        question:
          "The third principle of cell theory, stated by Rudolf Virchow, is that all cells come from pre-existing cells.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Virchow's phrase 'Omnis cellula e cellula' — every cell from a cell — established that cells arise only by division, ruling out spontaneous generation.",
      },
      {
        id: "q3",
        type: "true-false",
        question:
          "According to cell theory, a virus is a living cell because it can reproduce.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Viruses are not made of cells — they are non-cellular particles that can only reproduce inside a host cell. Cell theory applies only to true cellular organisms.",
      },
      {
        id: "q4",
        type: "matching",
        question:
          "Match each organism or feature to the correct cell type.",
        leftItems: [
          "Bacteria",
          "Human skin cell",
          "Has no membrane-bound nucleus",
          "Onion root tip cell",
          "DNA is a single circular loop",
          "Has many membrane-bound organelles",
        ],
        rightItems: ["Prokaryotic Cell", "Eukaryotic Cell"],
        correctPairs: {
          Bacteria: "Prokaryotic Cell",
          "Human skin cell": "Eukaryotic Cell",
          "Has no membrane-bound nucleus": "Prokaryotic Cell",
          "Onion root tip cell": "Eukaryotic Cell",
          "DNA is a single circular loop": "Prokaryotic Cell",
          "Has many membrane-bound organelles": "Eukaryotic Cell",
        },
        points: 15,
      },
      {
        id: "q5",
        type: "fill-blanks",
        question:
          "An organism made of only one cell is called ___, while an organism made of many specialised cells is called ___.",
        blanks: ["unicellular", "multicellular"],
        points: 5,
      },
      {
        id: "q6",
        type: "fill-blanks",
        question:
          "Red blood cells lose their ___ when mature, which frees more space for the ___ molecules that carry oxygen.",
        blanks: ["nucleus", "hemoglobin"],
        points: 5,
      },
      {
        id: "q7",
        type: "identification",
        question:
          "What single feature defines whether a cell is prokaryotic or eukaryotic?",
        correctAnswer: "a membrane-bound nucleus",
        acceptedAnswers: [
          "a membrane-bound nucleus",
          "membrane-bound nucleus",
          "the presence of a nucleus",
          "a true nucleus",
          "nucleus",
          "having a nucleus",
        ],
        points: 5,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Choose TWO specialised cells and explain how the structure of each one suits the job it does.",
        points: 10,
        rubric:
          "Should choose two from: nerve cell (long axon carries signals over long distances quickly); muscle cell (packed with actin and myosin filaments that slide to shorten the cell); red blood cell (biconcave shape maximises surface area, no nucleus leaves room for haemoglobin); white blood cell (flexible shape squeezes through capillary walls to engulf bacteria); leaf mesophyll cell (crowded with chloroplasts to capture light); root hair cell (long projection maximises absorbing surface). Each must link a structural feature to the function.",
      },
    ],
  },

  // ── w12-l2: Parts and Function of the Cell — mixed ────────────────────────
  "w12-l2": {
    lessonId: "w12-l2",
    title: "Parts and Function of the Cell",
    description:
      "Test your knowledge of the cell membrane, the organelles inside a cell, and what each one does.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which of these best describes the property of selective permeability?",
        options: [
          "The membrane allows all molecules through freely",
          "The membrane blocks all molecules from entering",
          "The membrane allows some substances through while restricting others",
          "The membrane only allows water through",
        ],
        correctAnswer:
          "The membrane allows some substances through while restricting others",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "What is the cell membrane primarily made of?",
        options: [
          "Cellulose fibres",
          "A phospholipid bilayer with embedded proteins",
          "Chitin and peptidoglycan",
          "Starch and glycogen",
        ],
        correctAnswer: "A phospholipid bilayer with embedded proteins",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "A plant cell is placed in salty water and water leaves the cell through the membrane. What process is this?",
        options: ["Diffusion", "Active transport", "Osmosis", "Respiration"],
        correctAnswer: "Osmosis",
        points: 5,
        explanation:
          "Osmosis is specifically the movement of water through a selectively permeable membrane, from where water is more concentrated to where it is less concentrated.",
      },
      {
        id: "q4",
        type: "true-false",
        question:
          "The mitochondria is called the powerhouse of the cell because it produces ATP through cellular respiration.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Mitochondria use glucose and oxygen to produce ATP, the cell's energy currency, through cellular respiration.",
      },
      {
        id: "q5",
        type: "true-false",
        question:
          "The Golgi apparatus is responsible for producing energy for the cell.",
        correctAnswer: false,
        points: 5,
        explanation:
          "The Golgi apparatus sorts, modifies, and packages proteins for transport. Energy production is the job of the mitochondria.",
      },
      {
        id: "q6",
        type: "true-false",
        question:
          "Ribosomes are found only in eukaryotic cells and are absent in prokaryotes.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Ribosomes are found in ALL cells, prokaryotic and eukaryotic alike — they are the universal site of protein synthesis. The two types differ in size and structure, which is what many antibiotics exploit.",
      },
      {
        id: "q7",
        type: "matching",
        question: "Match each organelle to its function.",
        leftItems: [
          "Nucleus",
          "Mitochondria",
          "Ribosome",
          "Golgi apparatus",
          "Lysosome",
          "Cytoskeleton",
        ],
        rightItems: [
          "Contains DNA and directs all cell activities",
          "Produces ATP energy through cellular respiration",
          "Assembles amino acids into proteins",
          "Sorts, modifies, and packages proteins for transport",
          "Contains digestive enzymes that break down waste",
          "A protein network giving the cell shape and moving materials",
        ],
        correctPairs: {
          Nucleus: "Contains DNA and directs all cell activities",
          Mitochondria: "Produces ATP energy through cellular respiration",
          Ribosome: "Assembles amino acids into proteins",
          "Golgi apparatus":
            "Sorts, modifies, and packages proteins for transport",
          Lysosome: "Contains digestive enzymes that break down waste",
          Cytoskeleton:
            "A protein network giving the cell shape and moving materials",
        },
        points: 15,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "A biologist finds that heart muscle cells contain far more mitochondria than skin cells do. Explain why.",
        points: 10,
        rubric:
          "Should explain that mitochondria produce ATP through cellular respiration, and that heart muscle contracts continuously for an entire lifetime, which demands an enormous and constant energy supply. Skin cells have far lower energy requirements, so they need fewer mitochondria. The number of mitochondria in a cell reflects how much energy that cell uses.",
      },
    ],
  },
};
