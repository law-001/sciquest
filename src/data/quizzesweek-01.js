// Week 1 quizzes — Grade 7 Science: Scientific Models
// One quiz type per lesson. Aggregates all weeks via imports.

import { QUIZZES_WEEK_02 } from "./quizzesweek-02";
import { QUIZZES_WEEK_03 } from "./quizzesweek-03";
import { QUIZZES_WEEK_04 } from "./quizzesweek-04";
import { QUIZZES_WEEK_05 } from "./quizzesweek-05";
import { QUIZZES_WEEK_06 } from "./quizzesweek-06";
import { QUIZZES_WEEK_07 } from "./quizzesweek-07";
import { QUIZZES_WEEK_08 } from "./quizzesweek-08";
import { QUIZZES_WEEK_09 } from "./quizzesweek-09";
import { QUIZZES_WEEK_10 } from "./quizzesweek-10";
import { QUIZZES_WEEK_11 } from "./quizzesweek-11";
import { QUIZZES_WEEK_12 } from "./quizzesweek-12";
import { QUIZZES_WEEK_13 } from "./quizzesweek-13";
import { QUIZZES_WEEK_14 } from "./quizzesweek-14";
import { QUIZZES_WEEK_15 } from "./quizzesweek-15";
import { QUIZZES_WEEK_16 } from "./quizzesweek-16";
import { QUIZZES_WEEK_17 } from "./quizzesweek-17";
import { QUIZZES_WEEK_18 } from "./quizzesweek-18";
import { QUIZZES_WEEK_19 } from "./quizzesweek-19";
import { QUIZZES_WEEK_20 } from "./quizzesweek-20";

export const QUIZZES_WEEK_01 = {
  // ── Lesson 1: Uses of Scientific Models — multiple-choice ──────────────────
  "lesson-1": {
    lessonId: "lesson-1",
    title: "Uses of Scientific Models",
    description: "Test your understanding of how and why scientists use models.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is a scientific model?",
        options: [
          "An exact copy of a real object",
          "A simplified representation used to explain or predict phenomena",
          "A type of laboratory experiment",
          "A diagram drawn by hand only",
        ],
        correctAnswer: "A simplified representation used to explain or predict phenomena",
        points: 5,
        explanation: "Scientific models simplify complex phenomena to make them easier to study and communicate.",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "Which of the following is a reason scientists use models?",
        options: [
          "To make phenomena more complicated",
          "To replace experiments entirely",
          "To visualize things that cannot be seen directly",
          "To eliminate the need for data collection",
        ],
        correctAnswer: "To visualize things that cannot be seen directly",
        points: 5,
        explanation: "Models help scientists study phenomena that are too small, large, fast, or dangerous to observe directly.",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "A globe is an example of which type of scientific model?",
        options: ["Mathematical model", "Simulation model", "Physical model", "Conceptual model"],
        correctAnswer: "Physical model",
        points: 5,
        explanation: "A globe is a tangible, three-dimensional object that represents the Earth at a smaller scale.",
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "Which type of model uses equations and numbers to describe a system?",
        options: ["Physical model", "Conceptual model", "Simulation model", "Mathematical model"],
        correctAnswer: "Mathematical model",
        points: 5,
        explanation: "Mathematical models use equations to describe relationships and make predictions.",
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "Why should scientific models be updated or replaced over time?",
        options: [
          "Because they are always wrong",
          "Because new evidence and technology improve our understanding",
          "Because students find them boring",
          "Because they become too accurate",
        ],
        correctAnswer: "Because new evidence and technology improve our understanding",
        points: 5,
        explanation: "Science is self-correcting — models evolve as new data and technologies become available.",
      },
    ],
  },

  // ── Lesson 2: Science Process Skills — true-false ─────────────────────────
  "lesson-2": {
    lessonId: "lesson-2",
    title: "Integrated Science Process Skills and the Scientific Method",
    description: "Test your knowledge of science process skills and scientific attitudes.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "Observation uses only the sense of sight to gather information.",
        correctAnswer: false,
        points: 5,
        explanation: "Observation uses all five senses — sight, hearing, touch, taste, and smell — as well as scientific instruments.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "An inference is a conclusion based on observations and prior knowledge.",
        correctAnswer: true,
        points: 5,
        explanation: "Inference goes beyond what is directly seen by using past experience and existing knowledge to explain observations.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "A prediction is the same as a random guess about what will happen.",
        correctAnswer: false,
        points: 5,
        explanation: "A prediction is based on patterns and prior observations — it must be testable, unlike a random guess.",
      },
      {
        id: "q4",
        type: "true-false",
        question: "Integrity means a scientist should report data honestly, even if results do not support the hypothesis.",
        correctAnswer: true,
        points: 5,
        explanation: "Scientific integrity requires honest reporting of all results, regardless of whether they support the original hypothesis.",
      },
      {
        id: "q5",
        type: "true-false",
        question: "Classification involves grouping objects based on their shared properties.",
        correctAnswer: true,
        points: 5,
        explanation: "Classification is a basic science process skill that organizes objects or data based on similarities and differences.",
      },
    ],
  },

  // ── Lesson 3: Models in Real Life — matching ───────────────────────────────
  "lesson-3": {
    lessonId: "lesson-3",
    title: "Models in Real Life",
    description: "Match real-world applications to the correct model type.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question: "Match each real-world application to its correct model type.",
        leftItems: [
          "Weather forecasting program",
          "Globe of the Earth",
          "Newton's F = ma equation",
          "Food web diagram",
          "Flight simulator for pilot training",
          "Bohr model of the atom",
        ],
        rightItems: [
          "Physical Model",
          "Mathematical Model",
          "Conceptual Model",
          "Simulation Model",
        ],
        correctPairs: {
          "Weather forecasting program": "Simulation Model",
          "Globe of the Earth": "Physical Model",
          "Newton's F = ma equation": "Mathematical Model",
          "Food web diagram": "Conceptual Model",
          "Flight simulator for pilot training": "Simulation Model",
          "Bohr model of the atom": "Conceptual Model",
        },
        points: 15,
      },
    ],
  },
};

export const QUIZZES_DATA = {
  ...QUIZZES_WEEK_01,
  ...QUIZZES_WEEK_02,
  ...QUIZZES_WEEK_03,
  ...QUIZZES_WEEK_04,
  ...QUIZZES_WEEK_05,
  ...QUIZZES_WEEK_06,
  ...QUIZZES_WEEK_07,
  ...QUIZZES_WEEK_08,
  ...QUIZZES_WEEK_09,
  ...QUIZZES_WEEK_10,
  ...QUIZZES_WEEK_11,
  ...QUIZZES_WEEK_12,
  ...QUIZZES_WEEK_13,
  ...QUIZZES_WEEK_14,
  ...QUIZZES_WEEK_15,
  ...QUIZZES_WEEK_16,
  ...QUIZZES_WEEK_17,
  ...QUIZZES_WEEK_18,
  ...QUIZZES_WEEK_19,
  ...QUIZZES_WEEK_20,
};

export function getQuizByLesson(lessonId) {
  return QUIZZES_DATA[lessonId] ?? null;
}
