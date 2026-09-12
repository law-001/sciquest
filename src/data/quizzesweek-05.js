// Week 5 quizzes — Grade 7 Science: Scientific Investigation and Measurement

export const QUIZZES_WEEK_05 = {
  // ── w05-l1: Appropriate Steps in Scientific Investigation — mixed ─────────
  "w05-l1": {
    lessonId: "w05-l1",
    title: "Appropriate Steps in Scientific Investigation",
    description:
      "Test your knowledge of the steps of a scientific investigation and your ability to identify variables in an experiment.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which step of a scientific investigation involves writing an educated, testable prediction about what will happen?",
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
          "Why is it important to research a topic BEFORE designing an experiment?",
        options: [
          "To make the hypothesis impossible to test",
          "To avoid repeating past mistakes and to form a better hypothesis",
          "To skip the data collection step",
          "Because experiments do not require background knowledge",
        ],
        correctAnswer:
          "To avoid repeating past mistakes and to form a better hypothesis",
        points: 5,
      },
      {
        id: "q3",
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
        id: "q4",
        type: "multiple-choice",
        question:
          "A student tests whether fertilizer helps plants grow. She puts fertilizer on one plant and leaves it on a sunny windowsill, and puts no fertilizer on a second plant which she keeps in a dark corner. The fertilized plant grows taller. What is wrong with this experiment?",
        options: [
          "Nothing — the experiment proves fertilizer works",
          "Two variables were changed at once, so the cause of the growth cannot be identified",
          "She should have used three plants instead of two",
          "Plants cannot be used in scientific experiments",
        ],
        correctAnswer:
          "Two variables were changed at once, so the cause of the growth cannot be identified",
        points: 5,
        explanation:
          "Both the fertilizer AND the light were changed. The extra growth could have been caused by either one, so no conclusion can be drawn. Both plants must receive identical light with fertilizer as the only difference.",
      },
      {
        id: "q5",
        type: "matching",
        question:
          "Match each term on the left to its correct definition on the right.",
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
      {
        id: "q6",
        type: "short-answer",
        question:
          "A student tests whether water temperature affects how fast sugar dissolves. She uses 10 g of sugar in 200 mL of water at 10 °C, 30 °C, 50 °C, and 70 °C. Identify the independent variable, the dependent variable, and two controlled variables.",
        points: 10,
        rubric:
          "Independent variable: the temperature of the water. Dependent variable: the time taken for the sugar to dissolve. Controlled variables (any two): the mass of sugar, the volume of water, the brand or grain size of the sugar, whether or not it is stirred.",
      },
    ],
  },

  // ── w05-l2: Measurement — mixed ───────────────────────────────────────────
  "w05-l2": {
    lessonId: "w05-l2",
    title: "Measurement",
    description:
      "Test your knowledge of SI units, correct measuring technique, and the difference between accuracy and precision.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question:
          "The SI base unit of ___ is the metre (m), and the SI base unit of ___ is the kilogram (kg).",
        blanks: ["length", "mass"],
        points: 5,
      },
      {
        id: "q2",
        type: "fill-blanks",
        question:
          "The prefix ___ means one thousand (×1,000), while the prefix ___ means one-hundredth (÷100).",
        blanks: ["kilo", "centi"],
        points: 5,
      },
      {
        id: "q3",
        type: "fill-blanks",
        question:
          "When reading a graduated cylinder you must read from the bottom of the curved surface, which is called the ___, and your eye must be at ___ level to avoid parallax error.",
        blanks: ["meniscus", "eye"],
        points: 5,
      },
      {
        id: "q4",
        type: "ordering",
        question:
          "Arrange the steps for correctly using a triple beam balance in the right order:",
        items: [
          "Place the balance on a flat, level surface",
          "Zero (tare) the balance so the pointer rests at the centre mark",
          "Place the object to be measured on the pan",
          "Move the riders along the beams until the pointer returns to the centre",
          "Add the values shown on all three beams",
          "Record the total mass with the correct unit",
        ],
        points: 15,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "A student measures a 50.0 g standard mass five times and gets 48.1, 48.0, 48.2, 48.0, and 48.1 grams. How should these measurements be described?",
        options: [
          "Accurate but not precise",
          "Precise but not accurate",
          "Both accurate and precise",
          "Neither accurate nor precise",
        ],
        correctAnswer: "Precise but not accurate",
        points: 5,
        explanation:
          "The readings agree closely with each other (within ±0.2 g), so they are precise. But they are all about 2 g below the true value of 50.0 g, so they are not accurate — a systematic error, most likely an unzeroed balance.",
      },
      {
        id: "q6",
        type: "multiple-choice",
        question:
          "A student's measurements are consistently 5 g higher than the true value in every single trial. What type of error is this?",
        options: [
          "Random error",
          "Systematic error",
          "Parallax error",
          "No error — the results are precise",
        ],
        correctAnswer: "Systematic error",
        points: 5,
        explanation:
          "An error that shifts every reading in the same direction by the same amount is systematic, usually caused by a miscalibrated instrument. Random errors scatter readings unpredictably in both directions.",
      },
      {
        id: "q7",
        type: "identification",
        question:
          "What is the name of the reading error caused by looking at a measuring scale from an angle instead of straight on at eye level?",
        correctAnswer: "parallax error",
        acceptedAnswers: ["parallax error", "parallax"],
        points: 5,
      },
      {
        id: "q8",
        type: "short-answer",
        question:
          "Explain the difference between accuracy and precision, and give one example of a measurement that is precise but not accurate.",
        points: 10,
        rubric:
          "Accuracy is how close a measurement is to the true or accepted value. Precision is how consistent repeated measurements are with each other, regardless of whether they are correct. A valid example: a balance that has not been zeroed gives 48.0, 48.1, 48.0 g for a true 50.0 g mass — consistent (precise) but all wrong (not accurate).",
      },
    ],
  },
};
