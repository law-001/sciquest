// Week 18 quizzes — Grade 7 Science: Sexual Reproduction and Energy Flow

export const QUIZZES_WEEK_18 = {
  // ── w18-l1: Sexual Reproduction — mixed ───────────────────────────────────
  "w18-l1": {
    lessonId: "w18-l1",
    title: "Sexual Reproduction",
    description:
      "Test your understanding of sexual reproduction, genetic variation, and how it compares with asexual reproduction.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question:
          "Sexual reproduction requires two parents, each contributing a gamete.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Each parent produces a haploid gamete by meiosis — sperm from the male, egg from the female — and the two fuse at fertilization.",
      },
      {
        id: "q2",
        type: "true-false",
        question:
          "Offspring produced through sexual reproduction are genetically identical to both parents.",
        correctAnswer: false,
        points: 5,
        explanation:
          "They are genetically UNIQUE. Crossing over and independent assortment during meiosis, plus the random combination of two gametes, make every offspring different from both parents and from every sibling.",
      },
      {
        id: "q3",
        type: "true-false",
        question:
          "Sexual reproduction is faster and more energy-efficient than asexual reproduction.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Sexual reproduction is slower and more costly — a mate must be found, gametes produced by meiosis, and only half the population can bear offspring. Its advantage is variation, not speed.",
      },
      {
        id: "q4",
        type: "true-false",
        question:
          "Flowering plants reproduce sexually through pollination followed by fertilization.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Pollen carrying the male gamete is transferred to another flower by wind or animals. The male gamete then travels to the egg cell in the ovary, and fertilization produces seeds.",
      },
      {
        id: "q5",
        type: "identification",
        question:
          "What is the term for the differences in genetic makeup between individuals in a population — the main advantage sexual reproduction provides?",
        correctAnswer: "genetic variation",
        acceptedAnswers: [
          "genetic variation",
          "genetic diversity",
          "variation",
          "genetic differences",
        ],
        points: 5,
      },
      {
        id: "q6",
        type: "identification",
        question:
          "What process, which acts on genetic variation, causes organisms better suited to their environment to survive and reproduce more successfully over generations?",
        correctAnswer: "natural selection",
        acceptedAnswers: [
          "natural selection",
          "selection",
          "evolution by natural selection",
        ],
        points: 5,
      },
      {
        id: "q7",
        type: "multiple-choice",
        question:
          "Why does a genetically varied population survive a new disease better than a population of clones?",
        options: [
          "Varied populations reproduce faster",
          "Some individuals are likely to carry natural resistance and survive to reproduce",
          "Varied populations are always larger",
          "Diseases cannot infect varied populations",
        ],
        correctAnswer:
          "Some individuals are likely to carry natural resistance and survive to reproduce",
        points: 5,
        explanation:
          "Because their genes differ, a new pathogen is unlikely to affect every individual equally. In a clone population every individual has the same vulnerability, so all are lost together.",
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Compare sexual and asexual reproduction. Give three differences, then explain why sexual reproduction has become the dominant strategy among complex organisms despite costing more time and energy.",
        points: 10,
        rubric:
          "Three differences from: number of parents (two vs one); gametes and fertilization (required vs absent); genetic identity of offspring (unique vs clones); cell division used (meiosis then mitosis vs mitosis only); speed (slow vs fast); energy cost (high vs low). Should explain that genetic variation lets populations adapt to changing environments, resist new diseases, and supply the raw material for natural selection — a long-term survival advantage worth the short-term cost.",
      },
    ],
  },

  // ── w18-l2: Energy Flow in an Ecosystem — mixed ───────────────────────────
  "w18-l2": {
    lessonId: "w18-l2",
    title:
      "Energy Flow in an Ecosystem: Food Chain, Food Web, and Energy Transfer",
    description:
      "Test your understanding of producers, consumers, decomposers, trophic levels, the 10% rule, and food webs.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which of these is an example of a PRODUCER in an ecosystem?",
        options: ["Rabbit", "Eagle", "Grass", "Mushroom"],
        correctAnswer: "Grass",
        points: 5,
        explanation:
          "Producers make their own food through photosynthesis. Grass, trees, algae, and phytoplankton are producers. A mushroom is a decomposer, not a producer.",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "What is the role of decomposers in an ecosystem?",
        options: [
          "They eat living producers for energy",
          "They hunt and eat other consumers",
          "They break down dead organisms and return nutrients to the soil",
          "They convert sunlight into chemical energy",
        ],
        correctAnswer:
          "They break down dead organisms and return nutrients to the soil",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "In the food chain Grass → Grasshopper → Frog → Snake, what trophic level does the frog occupy?",
        options: [
          "First trophic level (producer)",
          "Second trophic level (primary consumer)",
          "Third trophic level (secondary consumer)",
          "Fourth trophic level (tertiary consumer)",
        ],
        correctAnswer: "Third trophic level (secondary consumer)",
        points: 5,
        explanation:
          "Grass is the producer (first), the grasshopper is the primary consumer (second), and the frog, which eats the grasshopper, is the secondary consumer at the third level.",
      },
      {
        id: "q4",
        type: "true-false",
        question:
          "In a food chain, the arrows point from the organism being eaten toward the organism doing the eating.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Arrows show the direction ENERGY flows, which is from food to feeder. Grass → Grasshopper means the grasshopper eats the grass and the energy moves into the grasshopper.",
      },
      {
        id: "q5",
        type: "true-false",
        question:
          "According to the 10% rule, about 90% of the energy at one trophic level is passed on to the next level.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Only about 10% is passed on. The other 90% is lost, mostly as heat during movement and metabolism. This is why energy pyramids narrow so sharply toward the top.",
      },
      {
        id: "q6",
        type: "true-false",
        question:
          "Food chains typically have 8 to 10 trophic levels because there is plenty of energy at each level.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Food chains rarely exceed four or five levels. Because 90% of the energy is lost at each step, there is simply not enough left to support a sixth or seventh level.",
      },
      {
        id: "q7",
        type: "matching",
        question:
          "Match each organism to its correct role or trophic level.",
        leftItems: ["Grass", "Grasshopper", "Frog", "Eagle", "Fungi", "Human"],
        rightItems: [
          "Producer — captures solar energy through photosynthesis",
          "Primary consumer — herbivore that eats producers",
          "Secondary consumer — carnivore that eats primary consumers",
          "Tertiary consumer — top predator",
          "Decomposer — breaks down dead matter and recycles nutrients",
          "Omnivore — eats both plants and animals",
        ],
        correctPairs: {
          Grass: "Producer — captures solar energy through photosynthesis",
          Grasshopper: "Primary consumer — herbivore that eats producers",
          Frog: "Secondary consumer — carnivore that eats primary consumers",
          Eagle: "Tertiary consumer — top predator",
          Fungi:
            "Decomposer — breaks down dead matter and recycles nutrients",
          Human: "Omnivore — eats both plants and animals",
        },
        points: 15,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Explain the difference between a food chain and a food web, and state why a food web makes an ecosystem more resilient.",
        points: 10,
        rubric:
          "A food chain is a simple linear sequence showing one feeding pathway. A food web is an interconnected network of many overlapping chains showing all feeding relationships. A web is more resilient because most organisms have several food sources — if one disappears, they can switch to another, whereas removing one link breaks a simple chain completely.",
      },
      {
        id: "q9",
        type: "short-answer",
        question:
          "Wolves were hunted out of Yellowstone National Park. Describe what happened to the ecosystem as a result, and name the effect this illustrates.",
        points: 10,
        rubric:
          "Should describe a trophic cascade. Removing the top predator let the elk population explode; the elk overgrazed riverbank vegetation (the producers), causing erosion and habitat loss. Should note that reintroducing wolves in 1995 reversed the damage — willows regrew, erosion slowed, and the ecosystem recovered — showing how a change at one trophic level propagates through the whole web.",
      },
    ],
  },
};
