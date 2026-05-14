// Week 4 quizzes — Grade 7 Science: Scientific Investigation

export const QUIZZES_WEEK_04 = {
  // ── Lesson 10: Parts of a Scientific Investigation — multiple-choice ──────
  "lesson-10": {
    lessonId: "lesson-10",
    title: "Parts of a Scientific Investigation",
    description:
      "Test your knowledge of the steps of a scientific investigation and the scientific method.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which step of a scientific investigation involves writing an educated, testable prediction about what will happen in the experiment?",
        options: [
          "Identifying the problem",
          "Forming a hypothesis",
          "Collecting data",
          "Communicating results",
        ],
        correctAnswer: "Forming a hypothesis",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "A student notices that plants near the window grow taller than those in a darker corner of the room. What is the MOST appropriate next step in a scientific investigation?",
        options: [
          "Immediately write a conclusion about sunlight and plant growth",
          "Identify the problem and form a testable question about light and plant growth",
          "Skip to the experiment without doing any research",
          "Communicate the observation to the class",
        ],
        correctAnswer:
          "Identify the problem and form a testable question about light and plant growth",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Why is it important to research a topic BEFORE designing an experiment?",
        options: [
          "To make the hypothesis impossible to test",
          "To avoid repeating past mistakes and form a better hypothesis",
          "To skip the data collection step",
          "Because experiments do not require background knowledge",
        ],
        correctAnswer:
          "To avoid repeating past mistakes and form a better hypothesis",
        points: 5,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question:
          "A student conducts an experiment and gets results that do NOT support her hypothesis. What should she do?",
        options: [
          "Change the data until it matches the hypothesis",
          "Throw away the results and start over without recording anything",
          "Write an honest conclusion stating the hypothesis was rejected, and explain why",
          "Avoid sharing the results with her teacher",
        ],
        correctAnswer:
          "Write an honest conclusion stating the hypothesis was rejected, and explain why",
        points: 5,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "Which of the following is the BEST example of communicating scientific results?",
        options: [
          "Telling a friend verbally what you think might have happened",
          "Writing a detailed report with data tables and graphs and sharing it with others",
          "Keeping all results private so no one else can check them",
          "Memorizing the conclusion without recording any data",
        ],
        correctAnswer:
          "Writing a detailed report with data tables and graphs and sharing it with others",
        points: 5,
      },
    ],
  },

  // ── Lesson 11: Variables and Controls — matching ──────────────────────────
  "lesson-11": {
    lessonId: "lesson-11",
    title: "Variables and Controls",
    description:
      "Match each variable term to its correct definition or example.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question:
          "Match each term on the left to its correct definition or example on the right.",
        leftItems: [
          "Independent Variable",
          "Dependent Variable",
          "Controlled Variable",
          "Control Group",
          "Fair Test",
          "Hypothesis",
        ],
        rightItems: [
          "The variable that is deliberately changed by the experimenter",
          "The variable that is measured to see the effect of the change",
          "A factor kept constant throughout the experiment",
          "A group that receives no treatment, used as a baseline for comparison",
          "An experiment where only one variable is changed at a time",
          "An educated, testable prediction written as an If-then statement",
        ],
        correctPairs: {
          "Independent Variable":
            "The variable that is deliberately changed by the experimenter",
          "Dependent Variable":
            "The variable that is measured to see the effect of the change",
          "Controlled Variable":
            "A factor kept constant throughout the experiment",
          "Control Group":
            "A group that receives no treatment, used as a baseline for comparison",
          "Fair Test":
            "An experiment where only one variable is changed at a time",
          Hypothesis:
            "An educated, testable prediction written as an If-then statement",
        },
        points: 15,
      },
    ],
  },

  // ── Lesson 12: Data Collection and Recording — identification ─────────────
  "lesson-12": {
    lessonId: "lesson-12",
    title: "Data Collection and Recording",
    description:
      "Test your ability to identify types of data and measurement concepts.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "identification",
        question:
          "What type of data is expressed as numbers and measurements, such as the mass of an object in grams or the temperature in degrees Celsius?",
        correctAnswer: "quantitative data",
        acceptedAnswers: ["quantitative data", "quantitative"],
        points: 5,
      },
      {
        id: "q2",
        type: "identification",
        question:
          "What type of data is expressed as descriptions or observations — such as the color, texture, or smell of a substance — rather than as numbers?",
        correctAnswer: "qualitative data",
        acceptedAnswers: ["qualitative data", "qualitative"],
        points: 5,
      },
      {
        id: "q3",
        type: "identification",
        question:
          "What is the term for the average of a set of data values, calculated by adding all values together and dividing by the number of values?",
        correctAnswer: "mean",
        acceptedAnswers: ["mean", "average"],
        points: 5,
      },
      {
        id: "q4",
        type: "identification",
        question:
          "What is the term for a data value that is very different from all other values in a set — indicating a possible error or unusual result during an experiment?",
        correctAnswer: "outlier",
        acceptedAnswers: ["outlier", "outliers"],
        points: 5,
      },
      {
        id: "q5",
        type: "identification",
        question:
          "What type of graph is best used to show how a measured value changes over time — for example, tracking plant height each day for two weeks?",
        correctAnswer: "line graph",
        acceptedAnswers: ["line graph", "line chart"],
        points: 5,
      },
    ],
  },
};
