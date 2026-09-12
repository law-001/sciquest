// Week 3 quizzes — Grade 7 Science: Phases of Matter

export const QUIZZES_WEEK_03 = {
  // ── w03-l1: Different Phases of Matter — multiple-choice ──────────────────
  "w03-l1": {
    lessonId: "w03-l1",
    title: "Different Phases of Matter",
    description:
      "Test your understanding of the five phases of matter and what decides which phase a substance is in.",
    timeLimit: 900,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which phase of matter has a definite volume but takes the shape of its container?",
        options: ["Solid", "Liquid", "Gas", "Plasma"],
        correctAnswer: "Liquid",
        points: 5,
        explanation:
          "In a liquid the particles are still close together, which fixes the volume, but they can slide past one another, so the substance flows into the shape of its container.",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "Why can a gas be compressed much more easily than a solid or a liquid?",
        options: [
          "Gas particles are smaller than solid or liquid particles",
          "There is a large amount of empty space between gas particles",
          "Gas particles have no mass",
          "Gas particles attract each other very strongly",
        ],
        correctAnswer:
          "There is a large amount of empty space between gas particles",
        points: 5,
        explanation:
          "Compressing a substance means pushing its particles closer together. A gas is mostly empty space, so there is a great deal of room to squeeze out. In solids and liquids the particles are already nearly touching.",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Which phase of matter is the most common in the universe, making up stars including the Sun?",
        options: [
          "Solid",
          "Liquid",
          "Plasma",
          "Bose-Einstein condensate",
        ],
        correctAnswer: "Plasma",
        points: 5,
        explanation:
          "More than 99% of the visible matter in the universe is plasma. Every star is a ball of it, which makes solid, liquid, and gas the unusual phases rather than the normal ones.",
      },
      {
        id: "q4",
        type: "multiple-choice",
        question:
          "A Bose-Einstein condensate forms under which of these conditions?",
        options: [
          "Extremely high temperature",
          "Extremely high pressure",
          "Temperature very close to absolute zero",
          "Exposure to strong sunlight",
        ],
        correctAnswer: "Temperature very close to absolute zero",
        points: 5,
        explanation:
          "A Bose-Einstein condensate forms within a fraction of a degree of absolute zero (−273.15 °C), where particles lose almost all motion energy and begin behaving as a single unified group.",
      },
      {
        id: "q5",
        type: "multiple-choice",
        question:
          "What determines whether a substance exists as a solid, a liquid, or a gas at a given moment?",
        options: [
          "Only the mass of the substance",
          "The balance between the motion energy of the particles and the attractive forces between them",
          "The colour of the substance",
          "Whether the substance is natural or man-made",
        ],
        correctAnswer:
          "The balance between the motion energy of the particles and the attractive forces between them",
        points: 5,
        explanation:
          "It is a tug-of-war. When attraction wins, particles lock in place and the substance is solid. When motion wins, particles escape one another and it is a gas. When the two are roughly balanced, it is a liquid.",
      },
      {
        id: "q6",
        type: "identification",
        question:
          "What is the name for any substance that can flow and take the shape of its container — a term that covers both liquids and gases?",
        correctAnswer: "fluid",
        acceptedAnswers: ["fluid", "fluids"],
        points: 5,
      },
      {
        id: "q7",
        type: "identification",
        question:
          "What is the lowest possible temperature, at which particle motion is at its absolute minimum?",
        correctAnswer: "absolute zero",
        acceptedAnswers: [
          "absolute zero",
          "-273.15 °c",
          "-273 °c",
          "-273.15",
          "-273",
          "0 kelvin",
          "0 k",
        ],
        points: 5,
      },
      {
        id: "q8",
        type: "true-false",
        question:
          "Increasing the pressure on a gas can turn it into a liquid without cooling it at all.",
        correctAnswer: true,
        points: 5,
        explanation:
          "Pressure forces gas particles closer together. If they are pushed close enough for attractive forces to take hold, the gas condenses into a liquid — which is exactly how LPG is stored in tanks.",
      },
    ],
  },

  // ── w03-l2: Performance Task 1 — short-answer and essay ───────────────────
  "w03-l2": {
    lessonId: "w03-l2",
    title:
      'Creation of Performance Task 1: "The States of Matter Adventure: A Comic Strip Journey"',
    description:
      "Plan your comic strip and show that you can explain the states of matter accurately before you start drawing.",
    timeLimit: 1200,
    questions: [
      {
        id: "q1",
        type: "short-answer",
        question:
          "Describe the substance you have chosen for your comic strip and outline the journey your particle character will take. Name every state it will pass through, in order.",
        points: 10,
        rubric:
          "Should name a specific substance (water, chocolate, candle wax, dry ice are all acceptable) and list the states in a logical order, for example solid → liquid → gas and back. Full marks require the transitions to be in a physically possible sequence for the chosen substance.",
      },
      {
        id: "q2",
        type: "short-answer",
        question:
          "For ONE panel of your comic showing a solid, describe exactly how you will draw the particles. Mention their arrangement, their spacing, and how you will show that they are moving.",
        points: 10,
        rubric:
          "Should state that particles are drawn packed closely in a regular, repeating pattern with very small spaces between them, and that motion is shown by small vibration lines indicating the particles vibrate in place without leaving their positions.",
      },
      {
        id: "q3",
        type: "short-answer",
        question:
          "One of your panels must show a transition. Choose one transition from your comic, name it, and explain what the caption will say about energy — is energy absorbed or released?",
        points: 10,
        rubric:
          "Should correctly name a transition (melting, freezing, evaporation, condensation, sublimation, or deposition) and correctly identify the energy direction: melting, evaporation, and sublimation absorb energy (endothermic); freezing, condensation, and deposition release it (exothermic).",
      },
      {
        id: "q4",
        type: "essay",
        question:
          "Write the script for your comic strip. For each panel, describe what the reader will see and write the caption that names the process and explains it in terms of particles and energy. You need at least six panels.",
        minWords: 120,
        points: 25,
      },
    ],
  },
};
