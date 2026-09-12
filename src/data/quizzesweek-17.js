// Week 17 quizzes — Grade 7 Science: Asexual Reproduction
// This week also carries the Second Quarter Summative Test.

export const QUIZZES_WEEK_17 = {
  // ── w17-l1: Asexual Reproduction — mixed ──────────────────────────────────
  "w17-l1": {
    lessonId: "w17-l1",
    title: "Asexual Reproduction",
    description:
      "Test your knowledge of the four types of asexual reproduction and the advantages and disadvantages of reproducing without a partner.",
    timeLimit: 1200,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question:
          "Asexual reproduction requires only ___ parent, and the offspring are genetically ___ to the parent.",
        blanks: ["one", "identical"],
        points: 5,
      },
      {
        id: "q2",
        type: "fill-blanks",
        question:
          "Bacteria reproduce asexually by a process called ___ ___, in which the parent cell splits into two equal daughter cells.",
        blanks: ["binary", "fission"],
        points: 5,
      },
      {
        id: "q3",
        type: "fill-blanks",
        question:
          "Strawberry plants reproduce asexually through ___ propagation, sending out horizontal stems called ___ that root and grow into new plants.",
        blanks: ["vegetative", "runners"],
        points: 5,
      },
      {
        id: "q4",
        type: "matching",
        question:
          "Match each organism or example to its method of asexual reproduction.",
        leftItems: [
          "Bacteria",
          "Yeast and Hydra",
          "Sea star",
          "Strawberry plant",
          "Aphids in summer",
          "Potato",
        ],
        rightItems: [
          "Binary fission — the cell splits into two identical halves",
          "Budding — a small outgrowth develops into a new organism",
          "Fragmentation — a detached body part regenerates a whole organism",
          "Vegetative propagation by runners that root in the soil",
          "Parthenogenesis — unfertilised eggs develop into female clones",
          "Vegetative propagation from eyes (buds) on the tuber",
        ],
        correctPairs: {
          Bacteria: "Binary fission — the cell splits into two identical halves",
          "Yeast and Hydra":
            "Budding — a small outgrowth develops into a new organism",
          "Sea star":
            "Fragmentation — a detached body part regenerates a whole organism",
          "Strawberry plant":
            "Vegetative propagation by runners that root in the soil",
          "Aphids in summer":
            "Parthenogenesis — unfertilised eggs develop into female clones",
          Potato: "Vegetative propagation from eyes (buds) on the tuber",
        },
        points: 15,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "Which type of cell division is used in asexual reproduction?",
        options: ["Meiosis", "Mitosis", "Both meiosis and mitosis", "Neither"],
        correctAnswer: "Mitosis",
        points: 5,
        explanation:
          "Asexual reproduction produces genetically identical offspring, which requires mitosis. Meiosis shuffles and halves the genetic material, so it is used only for making gametes.",
      },
      {
        id: "q6",
        type: "multiple-choice",
        question:
          "What is the single greatest DISADVANTAGE of asexual reproduction?",
        options: [
          "It is much slower than sexual reproduction",
          "It requires large amounts of energy",
          "There is no genetic variation, so the whole population shares the same weaknesses",
          "Only half the population can reproduce",
        ],
        correctAnswer:
          "There is no genetic variation, so the whole population shares the same weaknesses",
        points: 5,
        explanation:
          "Because every offspring is a clone, a single new disease or environmental change that harms one individual will harm them all equally. This is exactly what threatens commercial banana crops.",
      },
      {
        id: "q7",
        type: "true-false",
        question:
          "Parthenogenesis is a form of sexual reproduction because an egg cell is involved.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Parthenogenesis is asexual. Although an egg is involved, it is never fertilised — there is no second parent and no fusion of gametes, so the offspring are clones of the mother.",
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "A person swallows a small number of harmful bacteria in undercooked food and feels seriously ill within hours. Explain how so few bacteria became a serious infection so quickly, naming the process involved.",
        points: 10,
        rubric:
          "Should name binary fission. Should explain that bacteria divide roughly every 20 minutes, doubling the population each time, so a handful of cells becomes millions within a few hours. Should note that all offspring are genetically identical clones of the original bacterium.",
      },
      {
        id: "q9",
        type: "short-answer",
        question:
          "Give two advantages and two disadvantages of asexual reproduction, and describe one situation in which it is the better strategy for an organism.",
        points: 10,
        rubric:
          "Advantages (any two): very fast; no mate needed; every individual can reproduce; low energy cost. Disadvantages (any two): no genetic variation; the whole population shares the same weaknesses; cannot adapt to change; rapid overcrowding. Better strategy when conditions are stable and favourable with abundant food and few threats, so a population can colonise quickly — for example aphids in summer.",
      },
    ],
  },
};
