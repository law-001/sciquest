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
  // ── Lesson 1: Uses of Scientific Models — essay ────────────────────────────
  "lesson-1": {
    lessonId: "lesson-1",
    title: "Uses of Scientific Models",
    description: "Summarize the lesson by orally explaining all your takeaways.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "essay",
        question:
          "Summarize the lesson by explaining all your takeaways about scientific models. What are they, why do scientists use them, and what are the different types? Explain in your own words.",
        minWords: 50,
        points: 25,
      },
    ],
  },

  // ── Lesson 2: Science Process Skills — matching ────────────────────────────
  "lesson-2": {
    lessonId: "lesson-2",
    title: "Integrated Science Process Skills and the Scientific Method",
    description:
      "Read each statement in Column A and choose from Column B the process skill or scientific attitude that best describes it.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "matching",
        question:
          "Read each statement in Column A and choose from Column B the process skill or scientific attitude that best describes it.",
        leftItems: [
          "1. Myra is comparing the volumes of the alcohol containers.",
          "2. Adrian looked at the traffic light.",
          "3. Real is rearranging the clothes in her cabinet.",
          "4. Jesse heard a loud knock on the door. It seems that his guest has arrived.",
          "5. William said that the watermelon she bought might be sweet.",
          "6. Pam checks the results of the experiment.",
          "7. Jerrie is always willing to work with others.",
          "8. Luis tries to listen and accept the ideas of his colleagues.",
          "9. Dhanna made a mistake, but she was still not giving up.",
          "10. Ben is always looking for questions about the world.",
        ],
        rightItems: [
          "a. Observing",
          "b. Classifying",
          "c. Predicting",
          "d. Measuring",
          "e. Inferencing",
          "f. Collaboration",
          "g. Curiosity",
          "h. Integrity",
          "i. Open-mindedness",
          "j. Perseverance",
        ],
        correctPairs: {
          "1. Myra is comparing the volumes of the alcohol containers.": "d. Measuring",
          "2. Adrian looked at the traffic light.": "a. Observing",
          "3. Real is rearranging the clothes in her cabinet.": "b. Classifying",
          "4. Jesse heard a loud knock on the door. It seems that his guest has arrived.": "e. Inferencing",
          "5. William said that the watermelon she bought might be sweet.": "c. Predicting",
          "6. Pam checks the results of the experiment.": "h. Integrity",
          "7. Jerrie is always willing to work with others.": "f. Collaboration",
          "8. Luis tries to listen and accept the ideas of his colleagues.": "i. Open-mindedness",
          "9. Dhanna made a mistake, but she was still not giving up.": "j. Perseverance",
          "10. Ben is always looking for questions about the world.": "g. Curiosity",
        },
        points: 50,
      },
    ],
  },

  // ── Lesson 3: Models in Real Life — true-false (two parts per item) ────────
  "lesson-3": {
    lessonId: "lesson-3",
    title: "Models in Real Life",
    description: "Read each statement carefully and write True or False.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "true-false",
        question: "Scientific investigations are based on a set of observations.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Scientific investigations always begin with observations that lead to questions and hypotheses.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "We can make predictions by the use of models.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Models allow scientists to make predictions about phenomena based on the patterns and relationships they represent.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "A paper airplane is a model of an airplane.",
        correctAnswer: true,
        points: 5,
        explanation:
          "A paper airplane is a simplified physical model that represents the basic shape and flight principles of a real airplane.",
      },
      {
        id: "q4",
        type: "true-false",
        question: "Models can never be changed.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Models are updated or replaced as new evidence and better understanding emerge — they are not permanent.",
      },
      {
        id: "q5",
        type: "true-false",
        question: "The particle model represents matter that is made up of tiny particles.",
        correctAnswer: true,
        points: 5,
        explanation:
          "The particle model describes matter as composed of tiny, discrete particles (atoms or molecules).",
      },
      {
        id: "q6",
        type: "true-false",
        question: "Particles are in the form of either atoms or molecules.",
        correctAnswer: true,
        points: 5,
        explanation:
          "In the particle model, matter is made up of atoms (for elements) or molecules (for compounds and some elements).",
      },
      {
        id: "q7",
        type: "true-false",
        question: "Elements cannot chemically combine to form a compound.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Elements can and do chemically combine to form compounds — for example, hydrogen and oxygen combine to form water (H₂O).",
      },
      {
        id: "q8",
        type: "true-false",
        question: "One element alone can form a compound.",
        correctAnswer: false,
        points: 5,
        explanation:
          "A compound requires at least two different elements chemically bonded together — a single element forms an element, not a compound.",
      },
      {
        id: "q9",
        type: "true-false",
        question: "Particles cannot retain energy.",
        correctAnswer: false,
        points: 5,
        explanation:
          "Particles do possess and retain energy — this energy is what keeps them in constant motion.",
      },
      {
        id: "q10",
        type: "true-false",
        question: "Particles are in constant motion.",
        correctAnswer: true,
        points: 5,
        explanation:
          "According to the particle model, all particles are in constant motion, though the type and speed of motion vary depending on the state of matter.",
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
