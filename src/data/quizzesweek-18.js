// Week 18 quizzes — Grade 7 Science

export const QUIZZES_WEEK_18 = {
  "lesson-52": {
    lessonId: "lesson-52",
    title: "Sexual vs. Asexual Reproduction",
    description: "Test your knowledge of the differences between sexual and asexual reproduction and the strategies organisms use.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question: "Match each organism or example to its reproductive strategy or method.",
        leftItems: [
          "Bacteria",
          "Strawberry plant",
          "Sea anemone",
          "Humans",
          "Starfish",
          "Aphids (in summer)"
        ],
        rightItems: [
          "Binary fission — splits into two identical daughter cells",
          "Vegetative propagation — sends out runners that root in soil",
          "Both sexual AND asexual — switches depending on conditions",
          "Sexual reproduction — internal fertilization produces unique offspring",
          "Fragmentation — detached arm grows into a new organism",
          "Parthenogenesis — unfertilized eggs develop into female clones"
        ],
        correctPairs: {
          "Bacteria": "Binary fission — splits into two identical daughter cells",
          "Strawberry plant": "Vegetative propagation — sends out runners that root in soil",
          "Sea anemone": "Both sexual AND asexual — switches depending on conditions",
          "Humans": "Sexual reproduction — internal fertilization produces unique offspring",
          "Starfish": "Fragmentation — detached arm grows into a new organism",
          "Aphids (in summer)": "Parthenogenesis — unfertilized eggs develop into female clones"
        },
        points: 15
      }
    ]
  },

  "lesson-53": {
    lessonId: "lesson-53",
    title: "Advantages and Disadvantages of Each",
    description: "Test your knowledge of the trade-offs between sexual and asexual reproduction and related ecological concepts.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question: "What is the term for differences in the genetic makeup of individuals in a population, which is produced by sexual reproduction?",
        correctAnswer: "Genetic variation",
        acceptedAnswers: ["genetic variation", "Genetic Variation", "genetic diversity", "genetic differences"],
        points: 5
      },
      {
        id: "q2",
        type: "identification",
        question: "What is the main advantage of asexual reproduction over sexual reproduction in terms of speed of population growth?",
        correctAnswer: "Rapid reproduction",
        acceptedAnswers: ["rapid reproduction", "faster reproduction", "speed", "rapid population growth", "no mate needed", "all offspring can reproduce"],
        points: 5
      },
      {
        id: "q3",
        type: "identification",
        question: "What process, driven by genetic variation, causes organisms better suited to their environment to survive and reproduce more successfully over generations?",
        correctAnswer: "Natural selection",
        acceptedAnswers: ["natural selection", "Natural Selection", "selection", "evolution by natural selection"],
        points: 5
      },
      {
        id: "q4",
        type: "identification",
        question: "What is the main DISADVANTAGE of asexual reproduction that makes a population vulnerable to disease or environmental change?",
        correctAnswer: "No genetic variation",
        acceptedAnswers: ["no genetic variation", "lack of genetic variation", "genetic uniformity", "all offspring are identical", "clones are equally vulnerable"],
        points: 5
      },
      {
        id: "q5",
        type: "identification",
        question: "What historical event demonstrated the danger of genetically identical crops, when a single disease nearly wiped out an entire country's food supply in the 1840s?",
        correctAnswer: "Irish Potato Famine",
        acceptedAnswers: ["Irish Potato Famine", "the Irish Famine", "potato famine", "the great famine"],
        points: 5
      }
    ]
  },

  "lesson-54": {
    lessonId: "lesson-54",
    title: "Examples in Nature",
    description: "Test your understanding of real-world examples of sexual and asexual reproduction in plants, animals, and microorganisms.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "short-answer",
        question: "Explain how bacteria can turn a small amount of contaminated food into a serious health hazard within just a few hours. Include the name of the reproductive process they use.",
        points: 10,
        rubric: "Should mention binary fission as the reproductive process. Should explain that bacteria divide every ~20 minutes, doubling the population each time. Should note that within 7-8 hours, millions of bacteria can be present. Should mention that all offspring are genetically identical clones."
      },
      {
        id: "q2",
        type: "short-answer",
        question: "A gardener finds that aphids have completely covered her garden in just a few weeks. Explain how this rapid population explosion happened without the gardener seeing any aphids mating. What type of asexual reproduction do aphids use?",
        points: 10,
        rubric: "Should identify parthenogenesis as the type of asexual reproduction. Should explain that female aphids produce female clones from unfertilized eggs. Should mention rapid population growth because all offspring can reproduce. Should note that males are not needed in spring and summer."
      },
      {
        id: "q3",
        type: "short-answer",
        question: "A farmer wants to expand a strawberry crop quickly without using seeds. Describe the natural asexual reproductive strategy of strawberry plants that the farmer can take advantage of, and explain whether the new plants will be genetically identical to or different from the original plants.",
        points: 10,
        rubric: "Should identify vegetative propagation as the strategy. Should describe runners (stolons) as horizontal stems sent out by the parent plant that root when they touch soil. Should state that new plants are genetically IDENTICAL (clones) to the parent plant. Should mention this is asexual — no seeds, no fertilization, no genetic variation."
      }
    ]
  }
};
