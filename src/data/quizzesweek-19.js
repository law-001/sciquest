// Week 19 quizzes — Grade 7 Science

export const QUIZZES_WEEK_19 = {
  "lesson-55": {
    lessonId: "lesson-55",
    title: "Producers, Consumers, and Decomposers",
    description: "Test your knowledge of the fundamental roles that organisms play in an ecosystem.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Which of the following is an example of a PRODUCER in an ecosystem?",
        options: ["Rabbit", "Eagle", "Grass", "Frog"],
        correctAnswer: "Grass",
        points: 5
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "What is the role of decomposers in an ecosystem?",
        options: [
          "They eat living producers for energy",
          "They hunt and eat other consumers",
          "They break down dead organisms and return nutrients to the soil",
          "They convert sunlight into chemical energy through photosynthesis"
        ],
        correctAnswer: "They break down dead organisms and return nutrients to the soil",
        points: 5
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "A deer that eats only grass would be classified as which type of consumer?",
        options: ["Secondary consumer", "Tertiary consumer", "Decomposer", "Primary consumer"],
        correctAnswer: "Primary consumer",
        points: 5
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "Which of the following organisms is an example of a DECOMPOSER?",
        options: ["Eagle", "Deer", "Grasshopper", "Mushroom"],
        correctAnswer: "Mushroom",
        points: 5
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "Another name for a producer — an organism that makes its own food through photosynthesis — is:",
        options: ["Heterotroph", "Autotroph", "Carnivore", "Omnivore"],
        correctAnswer: "Autotroph",
        points: 5
      }
    ]
  },

  "lesson-56": {
    lessonId: "lesson-56",
    title: "Food Chains",
    description: "Test your understanding of food chains, trophic levels, and the 10% energy rule.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "In a food chain, the arrows point in the direction of energy flow — from the organism being eaten toward the organism doing the eating.",
        correctAnswer: true,
        points: 5,
        explanation: "Correct. Arrows in a food chain show the direction energy flows — from prey to predator, or from food to the organism that eats it. For example: Grass → Grasshopper means the grasshopper eats the grass and energy flows from grass to grasshopper."
      },
      {
        id: "q2",
        type: "true-false",
        question: "In the 10% energy rule, about 90% of energy at one trophic level is passed on to the next level.",
        correctAnswer: false,
        points: 5,
        explanation: "This is FALSE. Only 10% of energy is passed on to the next trophic level. The other 90% is lost mainly as heat during metabolism, movement, and other life processes. This is why energy pyramids get narrower at each level."
      },
      {
        id: "q3",
        type: "true-false",
        question: "Producers are always found at the FIRST trophic level of a food chain because they capture energy from the sun.",
        correctAnswer: true,
        points: 5,
        explanation: "Correct. Producers (plants, algae, phytoplankton) capture solar energy through photosynthesis and form the base of every food chain. They are always at the first trophic level."
      },
      {
        id: "q4",
        type: "true-false",
        question: "Food chains typically have 8 to 10 trophic levels because there is plenty of energy at each level.",
        correctAnswer: false,
        points: 5,
        explanation: "FALSE. Food chains rarely have more than 4 to 5 trophic levels. Because 90% of energy is lost at each step (the 10% rule), there is simply not enough energy to support a 6th or 7th level. Top predators receive only a tiny fraction of the original energy."
      },
      {
        id: "q5",
        type: "true-false",
        question: "Decomposers are not technically part of a food chain but play a vital role by recycling nutrients back into the ecosystem.",
        correctAnswer: true,
        points: 5,
        explanation: "Decomposers (bacteria, fungi) are sometimes not shown in simplified food chain diagrams, but they are essential. They break down dead organisms at every trophic level and return nutrients to the soil and water, which producers then use again."
      }
    ]
  },

  "lesson-57": {
    lessonId: "lesson-57",
    title: "Food Webs",
    description: "Test your understanding of food webs, interconnected feeding relationships, and the effects of removing species from an ecosystem.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question: "Match each organism or term to its correct role or trophic level in an ecosystem food web.",
        leftItems: [
          "Grass",
          "Grasshopper",
          "Frog",
          "Eagle",
          "Fungi",
          "Snake"
        ],
        rightItems: [
          "Producer — first trophic level; captures solar energy through photosynthesis",
          "Primary consumer — herbivore that eats grass (second trophic level)",
          "Secondary consumer — carnivore that eats grasshoppers (third trophic level)",
          "Tertiary consumer — top predator (fourth trophic level)",
          "Decomposer — breaks down dead organisms and recycles nutrients",
          "Secondary or tertiary consumer — carnivore that eats frogs or other small animals"
        ],
        correctPairs: {
          "Grass": "Producer — first trophic level; captures solar energy through photosynthesis",
          "Grasshopper": "Primary consumer — herbivore that eats grass (second trophic level)",
          "Frog": "Secondary consumer — carnivore that eats grasshoppers (third trophic level)",
          "Eagle": "Tertiary consumer — top predator (fourth trophic level)",
          "Fungi": "Decomposer — breaks down dead organisms and recycles nutrients",
          "Snake": "Secondary or tertiary consumer — carnivore that eats frogs or other small animals"
        },
        points: 15
      }
    ]
  }
};
