// Week 13 quizzes — Grade 7 Science: Cell Parts and Functions

export const QUIZZES_WEEK_13 = {
  // ── Lesson 37: Cell Membrane and Cell Wall — multiple-choice ─────────────
  "lesson-37": {
    lessonId: "lesson-37",
    title: "Cell Membrane and Cell Wall",
    description: "Test your knowledge of the structure and function of the cell membrane and cell wall.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Which of the following best describes the property of selective permeability?",
        options: [
          "The membrane allows all molecules to pass through freely",
          "The membrane blocks all molecules from entering the cell",
          "The membrane allows some substances through while restricting others",
          "The membrane only allows water to pass through",
        ],
        correctAnswer: "The membrane allows some substances through while restricting others",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "What is the cell membrane primarily made of?",
        options: [
          "Cellulose fibers",
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
        question: "Which of the following statements about the cell wall is correct?",
        options: [
          "The cell wall is found in all animal cells",
          "The cell wall is selectively permeable like the cell membrane",
          "The cell wall in plant cells is made of cellulose and provides rigid support",
          "The cell wall replaces the cell membrane in plant cells",
        ],
        correctAnswer: "The cell wall in plant cells is made of cellulose and provides rigid support",
        points: 5,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "A student places a plant cell in salty water. Water leaves the cell through the membrane. What process is this an example of?",
        options: [
          "Diffusion",
          "Active transport",
          "Osmosis",
          "Endocytosis",
        ],
        correctAnswer: "Osmosis",
        points: 5,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "Which cell type does NOT have a cell wall?",
        options: [
          "Bacterial cell",
          "Plant cell",
          "Animal cell",
          "Fungal cell",
        ],
        correctAnswer: "Animal cell",
        points: 5,
      },
    ],
  },

  // ── Lesson 38: Nucleus and Cell Organelles — true-false ──────────────────
  "lesson-38": {
    lessonId: "lesson-38",
    title: "Nucleus and Cell Organelles",
    description: "Test your understanding of the nucleus and major cell organelles.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "The mitochondria is often called the 'powerhouse of the cell' because it produces ATP through cellular respiration.",
        correctAnswer: true,
        points: 5,
        explanation: "Mitochondria use oxygen and glucose to produce ATP (adenosine triphosphate) — the cell's main energy currency — through the process of cellular respiration.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "The Golgi apparatus is responsible for producing energy for the cell.",
        correctAnswer: false,
        points: 5,
        explanation: "The Golgi apparatus sorts, modifies, and packages proteins for transport — it does not produce energy. Energy production is the job of the mitochondria.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Ribosomes are found only in eukaryotic cells and are absent in prokaryotic cells.",
        correctAnswer: false,
        points: 5,
        explanation: "Ribosomes are found in ALL cells — both prokaryotic and eukaryotic. They are the universal site of protein synthesis. However, prokaryotic and eukaryotic ribosomes differ in size and structure.",
      },
      {
        id: "q4",
        type: "true-false",
        question: "The nucleolus, found inside the nucleus, is responsible for producing ribosomes.",
        correctAnswer: true,
        points: 5,
        explanation: "The nucleolus is a dense region inside the nucleus where ribosomal RNA (rRNA) is transcribed and ribosome subunits are assembled before being exported to the cytoplasm.",
      },
      {
        id: "q5",
        type: "true-false",
        question: "Lysosomes use digestive enzymes to break down old organelles, bacteria, and waste materials inside the cell.",
        correctAnswer: true,
        points: 5,
        explanation: "Lysosomes are membrane-bound sacs containing powerful hydrolytic (digestive) enzymes. They break down cellular waste, old organelles (autophagy), and foreign particles like bacteria engulfed by immune cells.",
      },
    ],
  },

  // ── Lesson 39: Cytoplasm and Cytoskeleton — short-answer ─────────────────
  "lesson-39": {
    lessonId: "lesson-39",
    title: "Cytoplasm and Cytoskeleton",
    description: "Answer questions that demonstrate your understanding of cytoplasm and cytoskeleton function.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "short-answer",
        question: "Explain the difference between cytoplasm and cytosol, and describe the role of cytoplasm in cell function.",
        points: 10,
        rubric: "Should mention that cytosol is the liquid portion of the cytoplasm (water-based solution of salts, proteins, and sugars). Cytoplasm includes the cytosol plus all organelles suspended within it. Should explain that cytoplasm provides the medium for chemical reactions, suspends organelles, and fills the cell between the membrane and nucleus.",
      },
      {
        id: "q2",
        type: "short-answer",
        question: "Describe two specific roles of the cytoskeleton and explain why the cytoskeleton is described as 'dynamic' rather than rigid.",
        points: 10,
        rubric: "Should identify two roles from: maintaining cell shape, anchoring organelles, enabling cell movement via cilia/flagella, separating chromosomes during cell division, or intracellular transport. Should explain that the cytoskeleton is dynamic because it is constantly being assembled and disassembled — this allows cells to change shape, divide, and move.",
      },
      {
        id: "q3",
        type: "short-answer",
        question: "Compare cilia and flagella — describe a structural difference and give one example of where each is found in the human body.",
        points: 10,
        rubric: "Should state that cilia are short and numerous while flagella are long and usually single per cell. Both are made of microtubule bundles. Example of cilia: cells lining the trachea/respiratory tract that sweep mucus upward. Example of flagella: the tail of a sperm cell that propels it toward the egg.",
      },
    ],
  },
};
