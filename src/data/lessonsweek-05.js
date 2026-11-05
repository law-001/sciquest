// Week 5: Scientific Investigation and Measurement — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 5.
//   Lesson 1 — Appropriate Steps in Scientific Investigation
//   Lesson 2 — Measurement

import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";
import flowchart from "../assets/flowchart.jpg";
import scimethod from "../assets/week1/scimethod.jpg";
import modernclassroom from "../assets/modernclassroom.jpg";

export const week05 = {
  id: "week-5",
  weekNumber: 5,
  title: "Scientific Investigation and Measurement",
  category: "Scientific Method",
  description:
    "Follow the steps of a scientific investigation from aim to conclusion, then measure accurately in standard units and record your data in tables.",
  icon: "Ruler",
  color: "secondary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Appropriate Steps in Scientific Investigation
    // ═══════════════════════════════════════════════════
    {
      id: "w05-l1",
      weekId: "week-5",
      lessonNumber: 1,
      title: "Appropriate Steps in Scientific Investigation",
      badge: "Lesson 1",
      subtitle:
        "Learn the five parts of a scientific investigation (aim, materials, method, results, and conclusion) and use them to answer a simple question fairly.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt:
        "Students doing a hands-on science experiment together at a table",

      signature: {
        widgetId: "investigation-rig",
        heading: "Watch It: Jam the Machine",
        intro: "A sample rides the belt through all five stages.",
        instruction: "Run it whole, pull a stage out, then change two things.",
        xp: 25,
        explainer: {
          title: "Why the machine jammed",
          points: [
            "With all five stages in place, the sample rode the belt straight into the result tray.",
            "Pulling a stage out left a gap in the belt, and the sample stopped there. Steps cannot be skipped.",
            "With the second variable on, the cause arrows crossed and the tray showed a question mark.",
            "Two things changed at once, so the result could not be blamed on either one.",
          ],
        },
      },

      sections: [
        "Introduction",
        "Steps of a Scientific Investigation",
        "The Steps in Action",
        "Variables and Fair Tests",
        "Experiment Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "Science Buddies — Steps of the Scientific Method",
          url: "https://www.sciencebuddies.org/science-fair-projects/science-fair/steps-of-the-scientific-method",
        },
        {
          label: "UC Berkeley — Understanding Science: How Science Works",
          url: "https://undsci.berkeley.edu/understanding-science-101/how-science-works/",
        },
        {
          label: "Khan Academy — The Science of Biology (The Scientific Method)",
          url: "https://www.khanacademy.org/science/biology/intro-to-biology/science-of-biology/a/the-science-of-biology",
        },
        {
          label: "PhilRice — Philippine Rice Research Institute",
          url: "https://www.philrice.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Your Lolo says monggo seeds grow faster if you water them with rice water (hugas-bigas). Your classmate says plain water is just as good. Who is right? Arguing will not settle it. A <strong class='text-primary-700'>scientific investigation</strong> will.",
              "A scientific investigation is a careful, step-by-step way of answering a question with <strong class='text-primary-700'>evidence</strong>. Every investigation report has five parts: <strong class='text-primary-700'>(a) the aim or problem, (b) the materials and equipment, (c) the method or procedure, (d) the results, including the data, and (e) the conclusion</strong>.",
              "Good scientists show <strong class='text-primary-700'>respect for evidence</strong>. They let the data decide the answer, even when it is not the answer they hoped for. A conclusion must come from what you measured, not from what you already believed.",
            ],
            didYouKnow:
              "Ibn al-Haytham, a scientist who lived about 1,000 years ago, insisted on testing ideas with careful experiments instead of trusting famous books. Many historians call him one of the first experimental scientists.",
          },
        },

        {
          type: "timeline",
          heading: "Steps of a Scientific Investigation",
          data: {
            intro:
              "Here is how to solve the monggo question step by step. Each step matches a part of your investigation report.",
            steps: [
              {
                num: 1,
                title: "Aim or Problem",
                color: "primary",
                description:
                  "Write one clear question that you can test. Example: \"Does watering monggo seeds with rice water make the sprouts grow taller after 7 days than watering with plain water?\" Then write your hypothesis: \"If monggo seeds are watered with rice water, then the sprouts will be taller after 7 days.\"",
                tip: "A good aim names what you will change and what you will measure.",
              },
              {
                num: 2,
                title: "Materials and Equipment",
                color: "secondary",
                description:
                  "List everything you need, with exact amounts: 20 monggo seeds, 2 plastic cups with the same soil, a 10 mL measuring syringe or graduated cylinder, plain water, rice water, a ruler marked in millimeters, and labels.",
                tip: "If an amount matters, write the number and the unit.",
              },
              {
                num: 3,
                title: "Method or Procedure",
                color: "accent",
                description:
                  "Write numbered steps. 1) Plant 10 seeds in each cup. 2) Label one cup \"Plain water\" and the other \"Rice water.\" 3) Place both cups in the same spot by the window. 4) Give each cup 10 mL of its water every morning. 5) Measure each sprout's height every day for 7 days.",
                tip: "Change only one thing (the kind of water). Keep the soil, cup, sunlight, and amount of water the same.",
              },
              {
                num: 4,
                title: "Results, Including Data",
                color: "primary",
                description:
                  "Record every measurement right away in a table, with units. Then find the average height of each group and show it in a bar graph. Write down anything unusual, like a seed that did not sprout.",
                tip: "Record what actually happened. Never change a number to fit your hypothesis.",
              },
              {
                num: 5,
                title: "Conclusion",
                color: "secondary",
                description:
                  "Answer the aim using your data. Example: \"The rice-water sprouts averaged 8.2 cm and the plain-water sprouts averaged 8.0 cm. The difference is very small, so our data does not clearly support the hypothesis.\" Then suggest how to improve the test.",
                tip: "A hypothesis that is not supported is still a useful result. It tells you something real.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "The Steps in Action",
          data: {
            cards: [
              {
                title: "Ask a Testable Question",
                label: "Aim / Problem",
                variant: "primary",
                color: "primary",
                desc: "Every investigation starts with something you noticed. A question about how monggo sprouts grow can be tested with a simple setup at home.",
                image: scimethod,
                imageAlt: "Mung bean (monggo) sprouts growing from seeds",
                examples: [
                  "Does rice water help monggo grow taller?",
                  "Does salt make ice melt faster?",
                  "Which brand of towel absorbs the most water?",
                ],
              },
              {
                title: "Prepare the Materials",
                label: "Materials & Equipment",
                variant: "secondary",
                color: "secondary",
                desc: "Gather everything before you start, and write down how much of each. Using the right measuring tools makes your results trustworthy.",
                image: lab,
                imageAlt: "Laboratory glassware and tools laid out on a table, ready for an experiment",
                examples: [
                  "Graduated cylinder for measuring water",
                  "Ruler for measuring height",
                  "Labels so the setups do not get mixed up",
                ],
              },
              {
                title: "Record the Data",
                label: "Results",
                variant: "accent",
                color: "accent",
                desc: "Write measurements in a table as soon as you take them. A graph made from the table helps you see the pattern.",
                image: equation,
                imageAlt: "A notebook with a hand-drawn data table and graph",
                examples: [
                  "A table of sprout height for each day",
                  "A bar graph of the average heights",
                  "Notes about anything unexpected",
                ],
              },
              {
                title: "Share the Conclusion",
                label: "Conclusion",
                variant: "primary",
                color: "primary",
                desc: "Scientists share what they found so others can check it. A poster at a science fair shows the aim, method, data, and conclusion.",
                image: modernclassroom,
                imageAlt: "Students presenting a science fair project poster",
                examples: [
                  "Investigation report",
                  "Science fair poster",
                  "Short class presentation",
                ],
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Variables and Fair Tests",
          data: {
            concepts: [
              "The independent variable is the one thing you change on purpose. Ask: \"What am I changing?\" In the monggo test, it is the kind of water. It is the cause.",
              "The dependent variable is the thing you measure. Ask: \"What am I measuring?\" In the monggo test, it is the sprout height in cm after 7 days. It is the effect.",
              "Controlled variables are everything you keep the same, like cup size, soil, sunlight, and amount of water. A fair test changes only the independent variable.",
              "Use a control setup (like the plain-water cup) to compare the other setups against.",
              "If two things change at the same time, you cannot tell which one caused the result.",
              "Repeat the test or use many samples (like 10 seeds per cup), so one odd result does not fool you.",
              "Base your conclusion only on your data. Respect the evidence, even when it surprises you.",
            ],
          },
        },

        {
          type: "scenario",
          heading: "Experiment Scenarios",
          data: {
            intro:
              "For each scenario, identify the variables or the problem in the investigation.",
            scenarios: [
              {
                title: "Ice and Salt",
                situation:
                  "Jay wants to know if salt makes ice melt faster. He puts one ice cube with a pinch of salt on a plate and another ice cube with no salt on an identical plate. He sets them side by side and times how long each takes to melt.",
                question:
                  "What is the aim? What are the independent and dependent variables? Name two controlled variables.",
                skill:
                  "Aim: Does salt make ice melt faster? Independent variable: whether salt is added. Dependent variable: the time for the ice to melt. Controlled: same size of ice cube, same kind of plate, same place and room temperature.",
              },
              {
                title: "The Unfair Test",
                situation:
                  "Mika puts fertilizer on a pechay plant by the sunny window and no fertilizer on a second pechay plant in a dark corner. The fertilized plant grows taller, so she says fertilizer works.",
                question:
                  "Why is her conclusion not valid? How should she fix the method?",
                skill:
                  "Two things changed at once: fertilizer and sunlight. The extra growth could come from either one. Both plants must be in the same spot with the same light, with fertilizer as the only difference.",
              },
              {
                title: "The Missing Step",
                situation:
                  "A group tested which paper towel absorbs the most water. Their report has an aim, a list of materials, and a conclusion that says \"Brand B is the best.\" There is no procedure and no data table.",
                question:
                  "Which parts of the investigation are missing, and why does that matter?",
                skill:
                  "The method and the results (data) are missing. Without a method, no one can repeat the test. Without data, there is no evidence to support the conclusion that Brand B is best.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Rice Research",
                description:
                  "Scientists at the Philippine Rice Research Institute (PhilRice) plant different rice varieties side by side under the same conditions to find which ones give more harvest.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Medicine and Vaccines",
                description:
                  "Before a new medicine is approved, it is tested in carefully planned trials, and the results are checked by other scientists.",
                icon: "💊",
                color: "border-l-secondary-500",
              },
              {
                title: "Weather Forecasting",
                description:
                  "PAGASA collects measurements every day, studies the data, and draws conclusions about coming rain and typhoons.",
                icon: "🌀",
                color: "border-l-accent-500",
              },
              {
                title: "Everyday Decisions",
                description:
                  "Testing which detergent removes stains best, or which rice cooker setting cooks best, uses the same steps: aim, materials, method, results, and conclusion.",
                icon: "🏠",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Measurement
    // ═══════════════════════════════════════════════════
    {
      id: "w05-l2",
      weekId: "week-5",
      lessonNumber: 2,
      title: "Measurement",
      badge: "Lesson 2",
      subtitle:
        "Measure length, volume, mass, temperature, and time in standard units, use each instrument properly, and organize your data in tables and charts.",
      readTime: "~20 min read",
      xp: 50,
      heroImage: equation,
      heroImageAlt:
        "Common measuring instruments together on a table, including a ruler and laboratory glassware",

      signature: {
        widgetId: "meniscus-bench",
        heading: "Watch It: Eye Level Matters",
        intro: "Your eye height changes the number the scale shows.",
        instruction: "Read three volumes at eye level, then zero the balance.",
        xp: 25,
        explainer: {
          title: "Why eye level gave the true volume",
          points: [
            "Looking down at the liquid made the scale read high, and looking up made it read low.",
            "Only at eye level did your line of sight cross the scale exactly where the liquid sat.",
            "The balance was off by 2.40 g on every single mass, not by a different amount each time.",
            "An error that repeats the same way every time is a systematic error. You fixed it by zeroing the balance.",
          ],
        },
      },

      sections: [
        "Introduction",
        "Measurement Tools",
        "Using a Graduated Cylinder",
        "Recording Data in Tables and Charts",
        "Accuracy vs. Precision",
        "Measurement Scenarios",
      ],

      references: [
        {
          label: "NIST — The International System of Units (SI)",
          url: "https://www.nist.gov/pml/owm/metric-si/si-units",
        },
        {
          label: "NASA — Mars Climate Orbiter",
          url: "https://science.nasa.gov/mission/mars-climate-orbiter/",
        },
        {
          label: "Britannica — International System of Units",
          url: "https://www.britannica.com/science/International-System-of-Units",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "At the palengke, a vendor weighs your galunggong on a scale in kilograms. At the gas station, fuel is sold in liters. In science, we also need numbers that everyone understands, so scientists around the world use the <strong class='text-primary-700'>International System of Units (SI)</strong>.",
              "The main units you will use are the <strong class='text-primary-700'>meter (m)</strong> for length, the <strong class='text-primary-700'>kilogram (kg)</strong> for mass, the <strong class='text-primary-700'>second (s)</strong> for time, and the <strong class='text-primary-700'>degree Celsius (°C)</strong> for everyday temperature. Volume is usually measured in <strong class='text-primary-700'>liters (L)</strong> and <strong class='text-primary-700'>milliliters (mL)</strong>. Prefixes like kilo- (× 1,000), centi- (÷ 100), and milli- (÷ 1,000) make units bigger or smaller.",
              "A measurement is only useful if it is taken carefully and written down honestly. This lesson is about <strong class='text-primary-700'>integrity</strong>: using each instrument the right way, and recording exactly what you see, even when it is not the number you expected.",
            ],
            didYouKnow:
              "In 1999, NASA lost its Mars Climate Orbiter because one team used metric units and another used English units (pounds). The spacecraft flew too close to Mars and was destroyed, a costly lesson in why standard units matter.",
          },
        },

        {
          type: "imageCards",
          heading: "Measurement Tools",
          data: {
            cards: [
              {
                title: "Ruler",
                label: "Length",
                variant: "primary",
                color: "primary",
                desc: "Measures short lengths in centimeters (cm) and millimeters (mm). Line up the object with the zero mark, not the edge of the ruler.",
                image: equation,
                imageAlt: "A ruler with centimeter and millimeter markings",
                examples: [
                  "Length of a pencil: 17.5 cm",
                  "Height of a monggo sprout: 42 mm",
                  "Read with your eye directly above the mark",
                ],
              },
              {
                title: "Tape Measure / Meter Stick",
                label: "Length",
                variant: "secondary",
                color: "secondary",
                desc: "Measures longer lengths in meters (m) and centimeters. A flexible tape can also measure around curved objects.",
                image: equation,
                imageAlt: "A tape measure pulled out to show its markings",
                examples: [
                  "Length of the classroom: 8.5 m",
                  "Around a coconut: 52 cm",
                  "Keep the tape straight and tight",
                ],
              },
              {
                title: "Graduated Cylinder",
                label: "Volume",
                variant: "accent",
                color: "accent",
                desc: "Measures the volume of liquids in milliliters (mL). It is more accurate than a beaker. Read it at eye level, at the bottom of the meniscus.",
                image: simulation,
                imageAlt: "A graduated cylinder holding a colored liquid",
                examples: [
                  "50.0 mL of water for an experiment",
                  "10 mL of vinegar",
                  "Place it on a flat table before reading",
                ],
              },
              {
                title: "Balance",
                label: "Mass",
                variant: "primary",
                color: "primary",
                desc: "Measures mass in grams (g) or kilograms (kg). Zero (tare) it before you place anything on it.",
                image: lab,
                imageAlt: "A laboratory balance used to measure mass",
                examples: [
                  "5.0 g of salt",
                  "Mass of an egg: 58 g",
                  "Use a container and tare it first",
                ],
              },
              {
                title: "Thermometer",
                label: "Temperature",
                variant: "secondary",
                color: "secondary",
                desc: "Measures temperature in degrees Celsius (°C). Keep the bulb in the liquid, not touching the bottom or sides of the container, and wait until the reading stops changing.",
                image: lab,
                imageAlt: "A laboratory thermometer with a Celsius scale",
                examples: [
                  "Tap water: about 28 °C",
                  "Boiling water: about 100 °C",
                  "Handle glass thermometers gently",
                ],
              },
              {
                title: "Stopwatch",
                label: "Time",
                variant: "accent",
                color: "accent",
                desc: "Measures time in seconds (s) and minutes. Start and stop it at exactly the moments the procedure says.",
                image: simulation,
                imageAlt: "A stopwatch showing elapsed time",
                examples: [
                  "Time for sugar to dissolve: 45 s",
                  "Time for ice to melt: 12 min 30 s",
                  "Have the same person press start and stop",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Using a Graduated Cylinder",
          data: {
            intro:
              "A graduated cylinder is the most accurate common tool for measuring liquid volume. Follow these steps every time.",
            steps: [
              {
                num: 1,
                title: "Choose the Right Size",
                color: "primary",
                description:
                  "Pick a cylinder close to the volume you need. For 8 mL, a 10 mL cylinder gives a better reading than a 100 mL cylinder.",
                tip: "Use the smallest cylinder that can hold the whole amount.",
              },
              {
                num: 2,
                title: "Put It on a Flat Surface",
                color: "secondary",
                description:
                  "Set the cylinder on a level table. Do not hold it in your hand while reading, because a tilted cylinder gives a wrong reading.",
                tip: "A steady cylinder means a steady reading.",
              },
              {
                num: 3,
                title: "Pour Carefully",
                color: "accent",
                description:
                  "Pour slowly and stop just before the mark you need. Add the last few drops with a dropper.",
                tip: "It is easier to add a little more than to remove extra.",
              },
              {
                num: 4,
                title: "Read at Eye Level",
                color: "primary",
                description:
                  "Bend down so your eyes are level with the liquid. Looking from above or below causes parallax error.",
                tip: "Your line of sight should be flat, like a table top.",
              },
              {
                num: 5,
                title: "Read the Bottom of the Meniscus",
                color: "secondary",
                description:
                  "Water curves up at the sides of the cylinder. Read the volume at the lowest point of the curve.",
                tip: "A white card held behind the cylinder makes the curve easier to see.",
              },
              {
                num: 6,
                title: "Record the Number and the Unit",
                color: "accent",
                description:
                  "Write the reading with its unit, like 23.5 mL. Estimate one digit between the smallest marks.",
                tip: "\"23.5\" alone means nothing. \"23.5 mL\" is a measurement.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Recording Data in Tables and Charts",
          data: {
            intro:
              "Data is only useful if it is organized. Here is how to record the time it takes for 5 g of sugar to dissolve in 100 mL of water at different temperatures.",
            steps: [
              {
                num: 1,
                title: "Make the Table Before You Start",
                color: "primary",
                description:
                  "Draw a table with a title and labeled columns: \"Water Temperature (°C)\", \"Trial 1 (s)\", \"Trial 2 (s)\", \"Trial 3 (s)\", and \"Average (s)\".",
                tip: "Put the units in the column headings so you do not have to write them in every box.",
              },
              {
                num: 2,
                title: "Put the Independent Variable First",
                color: "secondary",
                description:
                  "The first column lists what you changed, from lowest to highest: 30 °C, 50 °C, 70 °C. The other columns hold what you measured.",
                tip: "This order makes patterns easy to spot.",
              },
              {
                num: 3,
                title: "Fill It In Right Away",
                color: "accent",
                description:
                  "Write each reading in the table the moment you take it. Do not depend on your memory.",
                tip: "If you make a mistake, draw one line through it and write the correct value beside it, so the record stays honest.",
              },
              {
                num: 4,
                title: "Calculate the Average",
                color: "primary",
                description:
                  "Add the trials and divide by the number of trials. Example: (62 s + 58 s + 60 s) ÷ 3 = 60 s.",
                tip: "Averages make your results more reliable than a single trial.",
              },
              {
                num: 5,
                title: "Show It in a Chart",
                color: "secondary",
                description:
                  "Make a bar graph or line graph. Put the independent variable (temperature) on the horizontal axis and the dependent variable (average time) on the vertical axis. Label both axes with units and give the graph a title.",
                tip: "A line graph is best when the independent variable is a number that changes step by step, like temperature.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Accuracy vs. Precision",
          data: {
            intro:
              "In everyday talk these words mean the same thing, but in science they are different. A measurement can have one without the other.",
            left: {
              label: "Accuracy",
              color: "primary",
              items: [
                "Meaning: how close a measurement is to the true value",
                "Example: weighing a 50.0 g mass and getting 49.9 g",
                "Spoiled by: systematic error, like a balance that was not zeroed",
                "How to improve: zero and check the instrument, use the right technique",
                "Ask: \"Is my answer close to the real value?\"",
              ],
            },
            right: {
              label: "Precision",
              color: "secondary",
              items: [
                "Meaning: how close repeated measurements are to each other",
                "Example: getting 48.1 g, 48.0 g, and 48.1 g again and again",
                "Spoiled by: random error, like shaky hands or reading at different angles",
                "How to improve: repeat measurements and read the same way each time",
                "Ask: \"Do my answers agree with each other?\"",
              ],
            },
          },
        },

        {
          type: "scenario",
          heading: "Measurement Scenarios",
          data: {
            intro:
              "Decide what went right or wrong in each situation.",
            scenarios: [
              {
                title: "The Unzeroed Balance",
                situation:
                  "A student measures a 50.0 g standard mass five times and gets 48.1, 48.0, 48.2, 48.0, and 48.1 g. Nobody zeroed the balance before starting.",
                question:
                  "Are the readings precise? Are they accurate? What should the student do?",
                skill:
                  "They are precise, because they agree within 0.2 g. They are not accurate, because they are all about 2 g below the true value. This is a systematic error from the unzeroed balance. Tare the balance and measure again.",
              },
              {
                title: "Reading from Above",
                situation:
                  "Two students read the same 25 mL of water in the same graduated cylinder. One bends down to eye level and reads 25.0 mL. The other stays standing and reads 26.5 mL.",
                question:
                  "Why are the readings different? Which one should be recorded?",
                skill:
                  "Parallax error. Looking from above makes the liquid seem higher than it really is. The eye-level reading, 25.0 mL, is correct.",
              },
              {
                title: "The Tempting Eraser",
                situation:
                  "In the sugar-dissolving test, Trial 2 at 50 °C took 95 s while Trials 1 and 3 took about 40 s. A groupmate wants to erase 95 s and write 40 s so the table looks neat.",
                question:
                  "What is the honest way to handle this?",
                skill:
                  "Keep the 95 s in the record and note what might have gone wrong (for example, the water cooled or no one stirred the same way). Repeat the trial if possible. Changing data to look neat is dishonest and makes the results untrustworthy.",
              },
            ],
          },
        },
      ],
    },
  ],
};
