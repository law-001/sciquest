// Week 9: Performance Task 3 — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 9.
//   Lesson 1 — Creation of Performance Task 3:
//              Identifying Acids and Bases in Everyday Products
//   (SECOND SUMMATIVE TEST)

import mysterylab from "../assets/mysterylab.png";

export const week09 = {
  id: "week-9",
  weekNumber: 9,
  title: "Performance Task 3: Acids and Bases at Home",
  category: "Chemistry",
  description:
    "Test everyday products with a home-made indicator and classify each one as acid, base, or neutral. Covered by the Second Summative Test.",
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
        "Make your own indicator from red cabbage, test ten products from your home, and build a pH chart backed by your own evidence.",
      readTime: "~14 min read",
      xp: 100,
      heroImage: mysterylab,
      heroImageAlt:
        "Laboratory bench with unknown samples waiting to be identified",

      sections: [
        "The Task",
        "What You Will Need",
        "Making Your Indicator",
        "Carrying Out the Tests",
        "How You Will Be Graded",
        "Safety Rules for This Task",
        "Why This Task Matters",
      ],

      references: [
        {
          label: "Khan Academy — Acids, Bases, and pH",
          url: "https://www.khanacademy.org/science/biology/water-acids-and-bases",
        },
        {
          label: "American Chemical Society — Red Cabbage Indicator",
          url: "https://www.acs.org/education/whatischemistry/adventures-in-chemistry.html",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "The Task",
          data: {
            paragraphs: [
              "You have learned that acids turn blue litmus red, bases turn red litmus blue, and the pH scale runs from 0 to 14. Now you are going to prove it yourself — using an indicator you make from <strong class='text-primary-700'>red cabbage</strong>, which changes through a full spectrum of colours across the pH range.",
              "Your task is to test at least <strong class='text-primary-700'>ten everyday products</strong> from your home, record the colour each one turns your indicator, estimate its pH, and classify it as acidic, basic, or neutral. You will present your findings as a <strong class='text-primary-700'>pH chart</strong> with your data table, photographs, and a written analysis.",
            ],
            didYouKnow:
              "Red cabbage contains a pigment called anthocyanin, the same class of molecule that makes blueberries blue and autumn leaves red. It turns pink in acid, purple at neutral, and green-yellow in base — a complete home-made universal indicator.",
          },
        },

        {
          type: "keyTerms",
          heading: "What You Will Need",
          data: {
            terms: [
              {
                term: "Half a red cabbage",
                desc: "Chopped finely. This is your indicator source. Purple cabbage works equally well — the names are used interchangeably.",
              },
              {
                term: "Hot water and a strainer",
                desc: "For extracting the pigment. An adult must handle the hot water.",
              },
              {
                term: "Ten clear cups or jars",
                desc: "One per test substance, so you can see the colour clearly. Clear glass or plastic only.",
              },
              {
                term: "Ten test substances",
                desc: "Vinegar, lemon juice, baking soda solution, soap solution, milk, soft drink, tap water, shampoo, calamansi juice, antacid solution. Never use drain cleaner or bleach.",
              },
              {
                term: "A dropper or spoon",
                desc: "For adding the same amount of indicator to every cup — a fair test needs equal amounts.",
              },
              {
                term: "A colour reference chart",
                desc: "Pink/red ≈ pH 2, purple ≈ pH 7, blue-green ≈ pH 10, yellow-green ≈ pH 12. Use this to estimate pH from your colours.",
              },
              {
                term: "Camera and data table",
                desc: "To photograph each result and record substance, colour, estimated pH, and classification.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Making Your Indicator",
          data: {
            intro:
              "Do this part with an adult present. The extraction takes about twenty minutes and makes enough indicator for all ten tests.",
            steps: [
              {
                num: 1,
                title: "Chop the Cabbage",
                color: "primary",
                description:
                  "Chop about half a red cabbage into small pieces and place them in a heatproof bowl. Smaller pieces release more pigment — this is the surface-area idea from Week 6 in action.",
                tip: "The finer the chop, the darker and more useful your indicator will be.",
              },
              {
                num: 2,
                title: "Add Hot Water",
                color: "secondary",
                description:
                  "Have an adult pour hot water over the cabbage until it is just covered. Leave it to stand for 10–15 minutes. The water will turn deep purple as the anthocyanin dissolves out.",
                tip: "Do not boil it on the stove yourself — let an adult handle the hot water.",
              },
              {
                num: 3,
                title: "Strain the Liquid",
                color: "accent",
                description:
                  "Pour the mixture through a strainer into a clean jar, keeping the purple liquid and discarding the cabbage. This purple liquid is your indicator.",
                tip: "Let it cool fully before testing — hot liquid can crack a glass cup.",
              },
              {
                num: 4,
                title: "Test Your Control",
                color: "primary",
                description:
                  "Add indicator to a cup of plain distilled or tap water first. It should stay purple, confirming neutral. This is your control — the baseline every other result is compared against.",
                tip: "If your control is not purple, your indicator is too dilute. Make a stronger batch.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Carrying Out the Tests",
          data: {
            intro:
              "Now test all ten substances. Keep the procedure identical each time so the comparison is fair.",
            steps: [
              {
                num: 1,
                title: "Set Up and Label",
                color: "primary",
                description:
                  "Line up ten clear cups and label each with the substance it will hold. Add the same small amount of each test substance — about two tablespoons.",
                tip: "Same volume in every cup, or the colours will not be comparable.",
              },
              {
                num: 2,
                title: "Add the Indicator",
                color: "secondary",
                description:
                  "Add the same number of drops of cabbage indicator to every cup — five drops is enough. Swirl gently and watch the colour develop.",
                tip: "Count the drops out loud. Adding more to one cup makes that result useless.",
              },
              {
                num: 3,
                title: "Record the Colour and Estimate pH",
                color: "accent",
                description:
                  "Write down the exact colour you see, then use your reference chart to estimate the pH. Pink and red mean acid, purple means neutral, blue-green and yellow mean base.",
                tip: "Describe colours precisely — 'bright pink' and 'pale pink' suggest different pH values.",
              },
              {
                num: 4,
                title: "Classify Each Substance",
                color: "primary",
                description:
                  "For each cup, write whether the substance is acidic (pH below 7), basic (pH above 7), or neutral (pH about 7). Add a note on what evidence led you to that classification.",
                tip: "Your classification must follow from the colour, not from what you expected.",
              },
              {
                num: 5,
                title: "Photograph Your Results",
                color: "secondary",
                description:
                  "Photograph all ten cups together in good light, arranged from most acidic to most basic. This single photograph is your strongest piece of evidence.",
                tip: "Arranging them in pH order makes the whole spectrum visible in one image.",
              },
              {
                num: 6,
                title: "Build Your pH Chart and Analysis",
                color: "accent",
                description:
                  "Draw a pH scale from 0 to 14 and place each tested substance at its estimated position. Then write one or two paragraphs on the patterns you found and anything that surprised you.",
                tip: "Compare your results to the published pH values — explaining a difference earns more credit than hiding it.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "How You Will Be Graded",
          data: {
            intro:
              "This task is marked out of 100 points. Read the criteria before you begin so you know where the marks are.",
            left: {
              label: "Science Content — 60 points",
              color: "primary",
              items: [
                "All ten substances correctly classified as acid, base, or neutral (20 pts)",
                "pH estimates are reasonable and justified by the observed colour (15 pts)",
                "pH chart correctly places every substance on the 0–14 scale (15 pts)",
                "Analysis uses correct vocabulary: acid, base, neutral, indicator, pH (10 pts)",
              ],
            },
            right: {
              label: "Investigation and Report — 40 points",
              color: "secondary",
              items: [
                "Fair test: equal amounts of substance and indicator throughout (10 pts)",
                "A control (plain water) was tested and reported (5 pts)",
                "Data table complete, with photographs as evidence (15 pts)",
                "Report is neat, safe procedures followed, submitted on time (10 pts)",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Safety Rules for This Task",
          data: {
            concepts: [
              "An adult must be present for the hot-water extraction step. Do not handle boiling water yourself.",
              "NEVER test bleach, drain cleaner, ammonia, or oven cleaner. These are strongly corrosive and can release dangerous gases.",
              "NEVER mix two test substances together. Mixing an acid and a bleach-based cleaner produces toxic chlorine gas.",
              "Never taste any sample, even the food ones, once indicator has been added.",
              "Wear old clothes — cabbage indicator stains fabric permanently.",
              "Wash your hands thoroughly when you have finished, and pour the used samples down the sink with plenty of running water.",
              "If any sample splashes into your eye, rinse with clean running water for 15 minutes and tell an adult immediately.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Why This Task Matters",
          data: {
            apps: [
              {
                title: "Chemistry You Can Do at Home",
                description:
                  "Making your own indicator proves that real chemistry does not require expensive equipment — just a good procedure and careful observation.",
                icon: "🥬",
                color: "border-l-primary-500",
              },
              {
                title: "Reading Product Labels",
                description:
                  "Knowing which household products are acidic or basic tells you which ones must never be mixed, and which will neutralise a spill.",
                icon: "🏷️",
                color: "border-l-secondary-500",
              },
              {
                title: "How Water Is Tested",
                description:
                  "Environmental technicians use indicator strips and pH meters exactly as you are doing here to monitor rivers, pools, and drinking water.",
                icon: "💧",
                color: "border-l-accent-500",
              },
              {
                title: "Preparing for the Summative Test",
                description:
                  "The Second Summative Test covers solubility, concentration, acids, bases, salts, and laboratory safety — everything from Weeks 6 to 8.",
                icon: "📝",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
