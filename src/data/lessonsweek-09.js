// Week 9: Performance Task 3 — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 9.
//   Lesson 1 — Creation of Performance Task 3:
//              Identifying Acids and Bases in Everyday Products ("Color Clues")
//   (SECOND SUMMATIVE TEST)

import mysterylab from "../assets/mysterylab.png";
import lab from "../assets/lab.jpg";
import classroom from "../assets/classroom.webp";

export const week09 = {
  id: "week-9",
  weekNumber: 9,
  title: "Performance Task 3: Acids and Bases at Home",
  category: "Chemistry",
  description:
    "Test household products with a natural indicator, classify each one as acidic, basic or neutral, and report your results to help the community use them safely. Covered by the Second Summative Test.",
  icon: "FlaskRound",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Creation of Performance Task 3
    // ═══════════════════════════════════════════════════
    {
      id: "w09-l1",
      weekId: "week-9",
      lessonNumber: 1,
      title:
        "Creation of Performance Task 3: Identifying Acids and Bases in Everyday Products",
      badge: "Performance Task 3",
      subtitle:
        "Color Clues: make a natural indicator, test six household products, measure and record your data, and present what the colors tell you.",
      readTime: "~16 min read",
      xp: 100,
      heroImage: mysterylab,
      heroImageAlt:
        "A row of clear cups holding red cabbage indicator mixed with household products, showing pink, purple and green colors",

      sections: [
        "The Task",
        "Making Your Indicator",
        "Testing the Products",
        "Reading the Colors",
        "Safety Rules for This Task",
        "Lab Report, Presentation and Grading",
      ],

      references: [
        {
          label: "Britannica — Acid–Base Indicator",
          url: "https://www.britannica.com/science/acid-base-indicator",
        },
        {
          label: "Britannica — pH",
          url: "https://www.britannica.com/science/pH",
        },
        {
          label: "American Chemical Society — Adventures in Chemistry",
          url: "https://www.acs.org/education/whatischemistry/adventures-in-chemistry.html",
        },
        {
          label: "Khan Academy — Acids, Bases, and pH",
          url: "https://www.khanacademy.org/science/biology/water-acids-and-bases",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "The Task",
          data: {
            paragraphs: [
              "Many families use vinegar, calamansi, shampoo, liquid soap and bleach every day without knowing which are acids and which are bases. That matters: mixing the wrong two can make a poisonous gas, and using a strong product the wrong way can burn skin.",
              "In this performance task, called <strong class='text-primary-700'>Color Clues</strong>, your group works as scientists who test household products. You will make a natural <strong class='text-primary-700'>indicator</strong> from red cabbage or eggplant skin (or use pH paper), test six products, and classify each one as <strong class='text-primary-700'>acidic</strong>, <strong class='text-primary-700'>basic</strong> or <strong class='text-primary-700'>neutral</strong>.",
              "You must measure every amount in standard units, record your data in a table, follow every safety rule, and present your findings in a <strong class='text-primary-700'>lab report</strong> and a short <strong class='text-primary-700'>group presentation</strong> that shows the color changes.",
              "<strong class='text-primary-700'>GRASPS:</strong> Your <strong class='text-primary-700'>goal</strong> is to classify household products using an indicator and explain why it matters. Your <strong class='text-primary-700'>role</strong> is a team of scientists who test household products. Your <strong class='text-primary-700'>audience</strong> is your classmates, teachers and community. The <strong class='text-primary-700'>situation</strong>: people often store, mix or use these products without knowing what they are. Your <strong class='text-primary-700'>product</strong> is a lab report plus a group presentation, scored with the 100-point rubric at the end of this lesson.",
              "Your results can help your community use these products properly and safely. Doing that work carefully and honestly is what it means to be a <strong class='text-primary-700'>responsible</strong> young scientist.",
            ],
            didYouKnow:
              "Red cabbage and the purple skin of eggplant (talong) both contain anthocyanins, the same pigments that color ube and duhat. Anthocyanins change color with pH, so they work as a natural indicator.",
          },
        },

        {
          type: "timeline",
          heading: "Making Your Indicator",
          data: {
            intro:
              "Do this part with your teacher or an adult present. It takes about 20 minutes. You will need: 2 cups of chopped red cabbage or the skins of 2 eggplants (or pH paper), about 500 mL of hot water (handled by an adult), a strainer and clean jar, the six test products, plain water as the control, seven clear labeled cups, a graduated cylinder or measuring cup and spoons, gloves, goggles and a data table.",
            steps: [
              {
                num: 1,
                title: "Chop the Cabbage or Peel the Eggplant",
                color: "primary",
                description:
                  "Chop about 2 cups of red cabbage into small pieces, or peel the purple skin from 2 eggplants. Put them in a heatproof bowl.",
                tip: "Smaller pieces release more color, the same surface-area idea you saw with dissolving sugar.",
              },
              {
                num: 2,
                title: "Soak in Hot Water",
                color: "secondary",
                description:
                  "An adult pours about 500 mL of hot water over the pieces. Let it stand for 10 to 15 minutes until the water turns deep purple.",
                tip: "Never handle the hot water yourself.",
              },
              {
                num: 3,
                title: "Strain and Cool",
                color: "accent",
                description:
                  "Pour the mixture through a strainer into a clean jar. The purple liquid is your indicator. Let it cool completely before testing.",
                tip: "Label the jar \"Indicator\" with the date and your group name.",
              },
              {
                num: 4,
                title: "Test the Control",
                color: "primary",
                description:
                  "Add 5 mL of indicator to 20 mL of plain water. It should stay purple. Every other cup will be compared with this one.",
                tip: "Write down the exact color of the control before testing anything else.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Testing the Products",
          data: {
            intro:
              "Keep the procedure the same for every product so the test is fair. Measure in mL and record everything right away.",
            steps: [
              {
                num: 1,
                title: "Write Your Hypothesis",
                color: "primary",
                description:
                  "Before testing, predict whether each product is acidic, basic or neutral, and write down why. Example: \"Calamansi juice is acidic because it tastes sour.\"",
                tip: "A hypothesis can turn out wrong. Your data decides.",
              },
              {
                num: 2,
                title: "Label and Measure",
                color: "secondary",
                description:
                  "Label seven cups. Use a graduated cylinder or measuring cup to pour exactly 20 mL of each product into its cup, and 20 mL of plain water into the control cup.",
                tip: "Rinse and dry the measuring tool between products so they don't mix.",
              },
              {
                num: 3,
                title: "Add the Indicator",
                color: "accent",
                description:
                  "Add exactly 5 mL of indicator to every cup. Swirl gently. If you use pH paper, dip one strip in each cup instead.",
                tip: "Same amount in every cup, or the colors can't be compared fairly.",
              },
              {
                num: 4,
                title: "Observe and Record",
                color: "primary",
                description:
                  "Compare each cup with the control. Record the product, the amount used, the color you see, the estimated pH and the classification in your data table.",
                tip: "Describe colors exactly, like \"bright pink\" or \"blue-green,\" not just \"changed.\"",
              },
              {
                num: 5,
                title: "Photograph the Results",
                color: "secondary",
                description:
                  "Arrange the cups from most acidic to most basic and take a clear photo in good light. You will use it in your report and presentation.",
                tip: "Put a label in front of each cup so the photo can be read on its own.",
              },
              {
                num: 6,
                title: "Analyze and Conclude",
                color: "accent",
                description:
                  "Compare your results with your hypothesis. Which products were acids? Which were bases? Did any result surprise you? Write a conclusion based only on your data.",
                tip: "If a result didn't match what you expected, report it honestly and explain why it might have happened.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Reading the Colors",
          data: {
            cards: [
              {
                title: "Acidic",
                label: "Red to Pink",
                variant: "primary",
                color: "primary",
                desc: "Cabbage indicator turns red or pink in acids. The redder the color, the stronger the acid. pH paper shows red to orange.",
                image: lab,
                imageAlt:
                  "Cups of vinegar and calamansi juice with red cabbage indicator turned bright pink and red",
                examples: [
                  "Expected: vinegar",
                  "Expected: calamansi juice",
                  "Estimated pH: about 2 to 4",
                ],
              },
              {
                title: "Neutral",
                label: "Purple",
                variant: "secondary",
                color: "secondary",
                desc: "In a neutral solution, the indicator stays purple, the same as the plain-water control.",
                image: mysterylab,
                imageAlt:
                  "Cups of plain water and salt solution with red cabbage indicator staying purple",
                examples: [
                  "Expected: plain water (control)",
                  "Expected: salt solution",
                  "Estimated pH: about 7",
                ],
              },
              {
                title: "Basic",
                label: "Blue to Green to Yellow",
                variant: "accent",
                color: "accent",
                desc: "Cabbage indicator turns blue, then green, then yellow as the base gets stronger. Shampoo may be close to neutral, so check your own result.",
                image: classroom,
                imageAlt:
                  "Cups of liquid soap and diluted bleach with red cabbage indicator turned blue-green and yellow-green",
                examples: [
                  "Expected: liquid soap",
                  "Expected: diluted Zonrox, which may turn yellow and then fade, because bleach also breaks down the pigment",
                  "Estimated pH: about 8 to 12",
                ],
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Safety Rules for This Task",
          data: {
            concepts: [
              "Wear goggles and gloves the whole time, especially when handling the diluted Zonrox and the soaps.",
              "Only your teacher or an adult handles the hot water and prepares the diluted Zonrox.",
              "NEVER mix the Zonrox cup with the vinegar or calamansi cup. Bleach mixed with an acid gives off poisonous chlorine gas.",
              "Never taste or sniff any sample directly, even the food ones. Waft if you need to check a smell.",
              "Work in a well-ventilated room, with windows open or a fan running.",
              "Dispose of each cup separately, pouring it into the sink with plenty of running water, and the Zonrox cup last. Never pour cups together into one container.",
              "If a sample splashes onto your skin or into your eyes, rinse with clean running water for at least 15 minutes and tell your teacher.",
              "Wash your hands and clean your station when you finish. Cabbage indicator stains clothes, so wear an apron or old clothes.",
            ],
          },
        },

        {
          type: "comparison",
          heading: "Lab Report, Presentation and Grading",
          data: {
            intro:
              "Your group submits one lab report and gives one short presentation. Here is what to include and how it will be scored out of 100 points.",
            left: {
              label: "What to Submit",
              color: "primary",
              items: [
                "Hypothesis: your predictions and reasons",
                "Materials: everything used, with amounts in mL",
                "Procedure: numbered steps another group could repeat",
                "Data: a table with product, amount, color, estimated pH and classification, plus your photo",
                "Results and Analysis: what the colors show and any surprises",
                "Conclusion: which products are acidic, basic or neutral, and how to use them safely",
                "Presentation: a short group talk showing the color changes",
              ],
            },
            right: {
              label: "Rubric — 100 points",
              color: "secondary",
              items: [
                "Scientific Accuracy (25): correct classifications and pH estimates supported by your data",
                "Clarity and Organization (25): complete, neat report and clear presentation",
                "Demonstration of Safety Rules (20): goggles, gloves, no mixing, proper disposal",
                "Real-World Application (20): explains how the community can use these products safely",
                "Punctuality (10): submitted and presented on time",
              ],
            },
          },
        },

      ],
    },
  ],
};
