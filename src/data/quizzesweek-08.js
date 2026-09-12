// Week 8 quizzes — Grade 7 Science: The Science Laboratory

export const QUIZZES_WEEK_08 = {
  // ── w08-l1: Science Laboratory Instruments and Equipment — mixed ──────────
  "w08-l1": {
    lessonId: "w08-l1",
    title: "Science Laboratory Instruments and Equipment",
    description:
      "Test your knowledge of common laboratory equipment, what each instrument is for, and how to care for it.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which piece of equipment is best for measuring a precise volume of liquid?",
        options: [
          "Beaker",
          "Erlenmeyer flask",
          "Graduated cylinder",
          "Test tube",
        ],
        correctAnswer: "Graduated cylinder",
        points: 5,
        explanation:
          "A graduated cylinder is designed specifically for precise volume measurement. Beakers and flasks carry markings too, but they are approximate and meant for holding and mixing, not measuring.",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "A student needs to heat a liquid over a Bunsen burner safely. Which setup should they use?",
        options: [
          "Beaker placed directly in the Bunsen burner flame",
          "Test tube held with bare hands over the flame",
          "Beaker on wire gauze on a tripod stand over the Bunsen burner",
          "Erlenmeyer flask balanced on the burner itself",
        ],
        correctAnswer:
          "Beaker on wire gauze on a tripod stand over the Bunsen burner",
        points: 5,
        explanation:
          "The correct order is tripod stand, then wire gauze, then the beaker. The tripod holds the glassware above the flame and the gauze spreads the heat evenly so the glass does not crack from a hot spot.",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "What is the main advantage of an Erlenmeyer flask over a beaker?",
        options: [
          "It holds more liquid than a beaker",
          "Its tapered neck reduces spilling when the contents are swirled",
          "It is made of stronger glass",
          "It can be heated directly on a flame without a tripod",
        ],
        correctAnswer:
          "Its tapered neck reduces spilling when the contents are swirled",
        points: 5,
        explanation:
          "The conical shape and narrow neck let you swirl the contents vigorously without splashing, which is why it is the standard vessel for mixing reactions.",
      },
      {
        id: "q4",
        type: "multiple-choice",
        question:
          "Which is the correct way to care for laboratory glassware?",
        options: [
          "Use cracked glassware as long as it still holds liquid",
          "Rinse hot glassware immediately with cold water to clean it faster",
          "Let heated glassware cool completely before rinsing it with water",
          "Store wet glassware on any available surface",
        ],
        correctAnswer:
          "Let heated glassware cool completely before rinsing it with water",
        points: 5,
        explanation:
          "Rinsing hot glass with cold water causes thermal shock — the sudden temperature change makes the glass crack or shatter. Always let it reach room temperature first.",
      },
      {
        id: "q5",
        type: "identification",
        question:
          "A microscope has a 10× eyepiece and the student is using the 40× objective lens. What is the total magnification?",
        correctAnswer: "400x",
        acceptedAnswers: ["400x", "400×", "400", "400 times"],
        points: 5,
      },
      {
        id: "q6",
        type: "identification",
        question:
          "Which objective lens should always be selected FIRST when beginning to observe a new specimen?",
        correctAnswer: "lowest power",
        acceptedAnswers: [
          "lowest power",
          "low power",
          "4x",
          "4×",
          "low power objective",
          "the 4x objective",
        ],
        points: 5,
      },
      {
        id: "q7",
        type: "identification",
        question:
          "What is the name of the flat platform on a microscope where the glass slide is placed?",
        correctAnswer: "stage",
        acceptedAnswers: ["stage", "microscope stage", "the stage"],
        points: 5,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Explain why the coarse adjustment knob must never be used when the high-power (40×) objective is in position.",
        points: 10,
        rubric:
          "Should explain that at high power the objective lens sits only millimetres above the slide. The coarse knob moves the stage a long distance in a single turn, so using it can drive the objective straight into the slide — cracking the glass and scratching or destroying the expensive lens. Only the fine adjustment knob should be used at high power.",
      },
    ],
  },

  // ── w08-l2: Laboratory Rules and Safety Symbols — mixed ───────────────────
  "w08-l2": {
    lessonId: "w08-l2",
    title:
      "Science Laboratory Rules and Science Laboratory Safety Symbols",
    description:
      "Test your knowledge of laboratory safety rules, GHS hazard symbols, and correct emergency procedures.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question:
          "Safety goggles only need to be worn when working with liquids that might splash.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Goggles must be worn for the entire laboratory session. Vapours, glass fragments, and unexpected reactions can threaten your eyes at any moment, not only when a splash looks likely.",
      },
      {
        id: "q2",
        type: "true-false",
        question:
          "It is acceptable to eat a snack in the laboratory as long as you are not handling chemicals at that moment.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Eating and drinking are never permitted in a laboratory. Chemical residue contaminates surfaces, hands, and air invisibly, so food can be contaminated even when no chemicals are being used right then.",
      },
      {
        id: "q3",
        type: "true-false",
        question:
          "If you find a container with no label, you should smell it carefully to work out what it is.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Never use or smell an unlabelled chemical. Report it to the teacher immediately. Without knowing what it is, you cannot know whether its vapour is toxic, corrosive, or flammable.",
      },
      {
        id: "q4",
        type: "true-false",
        question:
          "A Safety Data Sheet (SDS or MSDS) tells you a chemical's hazards, how to handle it safely, and what to do in an emergency.",
        correctAnswer: true,
        points: 5,
        explanation:
          "The Safety Data Sheet is the complete reference for a chemical, covering hazards, safe handling, storage conditions, first aid measures, and disposal requirements.",
      },
      {
        id: "q5",
        type: "matching",
        question:
          "Match each GHS hazard symbol to its correct meaning.",
        leftItems: [
          "Flame symbol",
          "Skull and crossbones",
          "Corrosion symbol",
          "Exclamation mark",
          "Exploding bomb",
          "Dead fish and tree",
        ],
        rightItems: [
          "Flammable — the substance catches fire easily",
          "Acute toxicity — can cause death or serious illness",
          "Corrosive — destroys skin, eyes, or metals on contact",
          "Irritant — may cause skin or respiratory irritation",
          "Explosive — can explode under certain conditions",
          "Environmental hazard — harmful to aquatic life",
        ],
        correctPairs: {
          "Flame symbol": "Flammable — the substance catches fire easily",
          "Skull and crossbones":
            "Acute toxicity — can cause death or serious illness",
          "Corrosion symbol":
            "Corrosive — destroys skin, eyes, or metals on contact",
          "Exclamation mark":
            "Irritant — may cause skin or respiratory irritation",
          "Exploding bomb": "Explosive — can explode under certain conditions",
          "Dead fish and tree":
            "Environmental hazard — harmful to aquatic life",
        },
        points: 15,
      },
      {
        id: "q6",
        type: "fill-blanks",
        question:
          "When smelling a chemical you should use the ___ technique — fanning the vapour toward your nose rather than placing your nose over the ___.",
        blanks: ["wafting", "container"],
        points: 5,
      },
      {
        id: "q7",
        type: "fill-blanks",
        question:
          "If a chemical spills on your skin, flood the area with large amounts of ___ for at least ___ minutes.",
        blanks: ["water", "15"],
        points: 5,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Describe the correct step-by-step procedure for responding to a chemical spill on the skin. Include at least FOUR steps.",
        points: 10,
        rubric:
          "Should include most of: (1) stop what you are doing immediately and put down equipment; (2) call the teacher loudly, naming the chemical; (3) flood the area with cool running water for a minimum of 15 minutes; (4) remove contaminated clothing or jewellery while rinsing; (5) seek medical attention even if the skin feels fine afterwards. The 15-minute rinse and notifying the teacher are both required for full marks.",
      },
    ],
  },
};
