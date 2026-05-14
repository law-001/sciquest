// Week 5 quizzes — Grade 7 Science: Measurement in Science

export const QUIZZES_WEEK_05 = {
  // ── Lesson 13: SI Units and Measurement Tools — fill-blanks ──────────────
  "lesson-13": {
    lessonId: "lesson-13",
    title: "SI Units and Measurement Tools",
    description:
      "Test your knowledge of SI base units and metric prefixes.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "fill-blanks",
        question:
          "The SI base unit of ___ is the meter (m), and the SI base unit of ___ is the kilogram (kg).",
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
          "The SI unit for measuring the volume of liquids is the ___, which equals 1,000 ___.",
        blanks: ["liter", "milliliters"],
        points: 5,
      },
      {
        id: "q4",
        type: "fill-blanks",
        question:
          "Scientists worldwide use the ___ System of Units (SI) so that measurement results can be shared and ___ by other scientists.",
        blanks: ["International", "verified"],
        points: 5,
      },
      {
        id: "q5",
        type: "fill-blanks",
        question:
          "Density is a ___ unit calculated by dividing ___ by volume. Its SI unit is grams per cubic centimeter (g/cm³).",
        blanks: ["derived", "mass"],
        points: 5,
      },
    ],
  },

  // ── Lesson 14: Measuring Length, Mass, and Volume — ordering ─────────────
  "lesson-14": {
    lessonId: "lesson-14",
    title: "Measuring Length, Mass, and Volume",
    description:
      "Test your understanding of correct measurement techniques and procedures.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "ordering",
        question:
          "Arrange the steps for correctly using a triple beam balance to measure the mass of an object in the correct order:",
        items: [
          "Place the triple beam balance on a flat, level surface",
          "Zero (tare) the balance by adjusting the riders until the pointer rests at the center mark",
          "Place the object to be measured on the pan",
          "Move the riders on the beams until the pointer returns to the center mark",
          "Read the mass by adding the values indicated by each rider on all three beams",
          "Record the total mass with the correct unit (grams)",
        ],
        points: 15,
      },
    ],
  },

  // ── Lesson 15: Accuracy, Precision, and Errors — multiple-choice ──────────
  "lesson-15": {
    lessonId: "lesson-15",
    title: "Accuracy, Precision, and Errors",
    description:
      "Test your understanding of accuracy, precision, and types of measurement error.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "A student measures the mass of a 100 g standard mass five times and gets: 99.9, 100.1, 99.8, 100.2, and 100.0 grams. How would you describe these measurements?",
        options: [
          "Precise but not accurate",
          "Accurate but not precise",
          "Both accurate and precise",
          "Neither accurate nor precise",
        ],
        correctAnswer: "Both accurate and precise",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "A dart thrower hits the same spot on the edge of the target every single throw — far from the bullseye. Which statement BEST describes this result?",
        options: [
          "The throws are accurate but not precise",
          "The throws are precise but not accurate",
          "The throws are both accurate and precise",
          "The throws are neither accurate nor precise",
        ],
        correctAnswer: "The throws are precise but not accurate",
        points: 5,
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "A student's measurements are consistently 5 g higher than the true value for every trial. This is an example of which type of error?",
        options: [
          "Random error",
          "Human error",
          "Systematic error",
          "Experimental error",
        ],
        correctAnswer: "Systematic error",
        points: 5,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question:
          "Which formula is used to calculate percent error in a measurement?",
        options: [
          "|(measured + true) / true| × 100%",
          "|(measured − true) / true| × 100%",
          "|(true − measured) × measured| × 100%",
          "|(measured / true)| × 100%",
        ],
        correctAnswer: "|(measured − true) / true| × 100%",
        points: 5,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "Which of the following would BEST improve the accuracy of a measurement?",
        options: [
          "Repeating the measurement more times",
          "Using a larger measuring container",
          "Calibrating the measuring instrument correctly before use",
          "Recording the measurement without units",
        ],
        correctAnswer: "Calibrating the measuring instrument correctly before use",
        points: 5,
      },
    ],
  },
};
