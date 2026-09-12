// Week 5: Scientific Investigation and Measurement — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 5.
//   Lesson 1 — Appropriate Steps in Scientific Investigation
//   Lesson 2 — Measurement

import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week05 = {
  id: "week-5",
  weekNumber: 5,
  title: "Scientific Investigation and Measurement",
  category: "Scientific Method",
  description:
    "Design a fair investigation from question to conclusion, then master the SI units and instruments scientists measure with.",
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
        "Learn the ordered steps of a scientific investigation and how to control variables so your results actually mean something.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt: "Flowchart showing the steps of a scientific investigation",

      signature: {
        widgetId: "investigation-rig",
        heading: "Watch It: Jam the Machine",
        intro:
          "The investigation runs as a machine on a conveyor. Pull any stage out of its housing and the belt keeps turning while the sample stops dead at the gap.",
        instruction: "Run it whole, jam it once, then confound it once",
        xp: 25,
      },

      sections: [
        "Introduction",
        "Key Terms",
        "Steps of a Scientific Investigation",
        "Independent vs. Dependent Variable",
        "Rules for a Fair Test",
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
          url: "https://undsci.berkeley.edu/understanding-science/how-science-works/the-scientific-method/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "A <strong class='text-primary-700'>scientific investigation</strong> is a systematic process used to answer questions about the natural world. Unlike guessing, an investigation gathers real <strong class='text-primary-700'>evidence</strong> through careful observation and experiment. Every good investigation follows the same ordered steps so that the results are valid and reliable.",
              "Getting the order right is only half of it. For results to mean anything, you must also control what changes. In every experiment there is an <strong class='text-primary-700'>independent variable</strong> (what you deliberately change), a <strong class='text-primary-700'>dependent variable</strong> (what you measure), and <strong class='text-primary-700'>controlled variables</strong> (everything else, held constant). Change two things at once and you can never say which one caused the result.",
            ],
            didYouKnow:
              "The controlled experiment was pioneered by the Arab scientist Ibn al-Haytham around 1000 CE. His controlled tests of light and vision laid the foundation for modern experimental design.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Hypothesis",
                desc: "An educated, testable prediction that answers a scientific question, usually written as an 'If… then…' statement based on prior knowledge.",
              },
              {
                term: "Independent Variable",
                desc: "The one factor the experimenter deliberately changes. Ask: what am I changing?",
              },
              {
                term: "Dependent Variable",
                desc: "The factor that is observed and measured to see the effect of the change. Ask: what am I measuring?",
              },
              {
                term: "Controlled Variable",
                desc: "A factor that could affect the result but is deliberately kept the same in every trial — such as pot size, soil type, or room temperature.",
              },
              {
                term: "Control Group",
                desc: "A group that receives no treatment, used as a baseline to compare the experimental groups against.",
              },
              {
                term: "Fair Test",
                desc: "An experiment in which only the independent variable is changed while everything else is held constant.",
              },
              {
                term: "Data",
                desc: "The measurements and observations collected during an investigation — the evidence used to support or reject the hypothesis.",
              },
              {
                term: "Conclusion",
                desc: "A statement explaining what the data shows and whether the hypothesis was supported or rejected.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Steps of a Scientific Investigation",
          data: {
            intro:
              "Every scientific investigation follows these seven steps in order. Skipping or reordering them is what produces results nobody can trust.",
            steps: [
              {
                num: 1,
                title: "Identify the Problem or Question",
                color: "primary",
                description:
                  "Start with a specific, testable question about something you want to understand. A good question is clear, focused, and answerable through investigation. Example: 'Does the amount of water affect the height of bean plants after 2 weeks?'",
                tip: "Avoid questions that are too broad or that cannot be tested with an experiment.",
              },
              {
                num: 2,
                title: "Research the Topic",
                color: "secondary",
                description:
                  "Before designing your experiment, gather background information. Read textbooks, articles, or reports to find out what is already known. This prevents duplicating past work and helps you form a smarter hypothesis.",
                tip: "Use reliable sources — science journals, textbooks, and educational sites beat random web pages.",
              },
              {
                num: 3,
                title: "Form a Hypothesis",
                color: "accent",
                description:
                  "Based on your research, write a testable prediction of what you think will happen. Example: 'If a bean plant receives more water per day, then it will grow taller after 2 weeks.'",
                tip: "A hypothesis is not a fact and not a random guess — it is your best prediction from available evidence.",
              },
              {
                num: 4,
                title: "Design the Experiment",
                color: "primary",
                description:
                  "Plan how you will test the hypothesis. Identify the independent variable, the dependent variable, and every controlled variable. Write a clear step-by-step procedure that someone else could follow exactly.",
                tip: "Change only ONE variable at a time, or your results will not show what caused what.",
              },
              {
                num: 5,
                title: "Collect Data",
                color: "secondary",
                description:
                  "Carry out the experiment and record every observation and measurement carefully in tables. Always record what actually happens — never adjust data to match your hypothesis.",
                tip: "Run at least three trials so a single odd result cannot mislead you.",
              },
              {
                num: 6,
                title: "Analyze Data and Identify Patterns",
                color: "accent",
                description:
                  "Look for patterns, trends, and relationships. Calculate averages, draw graphs, and compare results across trials. Ask yourself honestly: what does the data actually show?",
                tip: "Graphs make patterns visible that a table of numbers hides.",
              },
              {
                num: 7,
                title: "Draw Conclusions and Communicate Results",
                color: "primary",
                description:
                  "State whether the hypothesis was supported or rejected and explain why. Account for unexpected results, then share your findings through a report, presentation, or poster.",
                tip: "A rejected hypothesis is still a valuable finding — it rules out an explanation.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Independent vs. Dependent Variable",
          data: {
            intro:
              "These two variables play opposite roles. Telling them apart is the single most useful skill in experimental design.",
            left: {
              label: "Independent Variable",
              color: "primary",
              items: [
                "Definition: the variable deliberately changed by the experimenter",
                "Example: the amount of fertilizer added to each group (0 g, 5 g, 10 g)",
                "Who controls it: you — it is intentionally varied",
                "How to identify: ask 'What am I changing?'",
                "Role: the cause",
              ],
            },
            right: {
              label: "Dependent Variable",
              color: "secondary",
              items: [
                "Definition: the variable observed and measured for an effect",
                "Example: the height of the plant in cm after 2 weeks",
                "Who controls it: nobody — it responds on its own",
                "How to identify: ask 'What am I measuring?'",
                "Role: the effect",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Rules for a Fair Test",
          data: {
            concepts: [
              "In a fair test, only the independent variable changes — every other condition must stay the same across all groups.",
              "Controlled variables are factors that could affect the result but are deliberately held constant (pot size, soil type, watering schedule, temperature).",
              "A control group receives no treatment and acts as the baseline you compare every other group against.",
              "If more than one variable changes at once, it is impossible to say which change caused the result.",
              "Every experiment should be repeated for multiple trials, so you can tell a real effect from random chance.",
              "Record measurements honestly and immediately — writing data down later invites error.",
              "The more variables you control, the more confident you can be that the independent variable caused the change.",
            ],
          },
        },

        {
          type: "scenario",
          heading: "Experiment Scenarios",
          data: {
            intro:
              "For each scenario, identify the independent variable, the dependent variable, and at least two controlled variables.",
            scenarios: [
              {
                title: "Plant Growth Experiment",
                situation:
                  "A student sets up 4 groups of bean plants. Group A gets 0 mL of water per day, Group B gets 50 mL, Group C gets 100 mL, and Group D gets 150 mL. All plants use the same soil, pot size, amount of sunlight, and room temperature. After 2 weeks the student measures plant height.",
                question:
                  "What is the independent variable, the dependent variable, and the control group? Name two controlled variables.",
                skill:
                  "IV: amount of water per day. DV: plant height after 2 weeks. Control group: Group A (0 mL). Controlled variables: soil type, pot size, sunlight, temperature.",
              },
              {
                title: "Dissolving Sugar Experiment",
                situation:
                  "A student tests whether temperature affects how quickly sugar dissolves. She dissolves 10 g of sugar in 200 mL of water at 10 °C, 30 °C, 50 °C, and 70 °C, using the same brand of sugar and the same volume of water each time.",
                question:
                  "What is the independent variable? The dependent variable? What would a control group look like?",
                skill:
                  "IV: temperature of the water. DV: time taken for the sugar to dissolve. Control: a trial at room temperature with no heating or cooling. Controlled: amount of sugar, volume of water, brand of sugar.",
              },
              {
                title: "The Unfair Test",
                situation:
                  "A student wants to know whether fertilizer helps plants grow. He puts fertilizer on one plant and leaves it on a sunny windowsill, and puts no fertilizer on a second plant which he keeps in a dark corner. The fertilized plant grows much taller.",
                question:
                  "Why can this student NOT conclude that fertilizer caused the extra growth? What should he change?",
                skill:
                  "Two variables changed at once — fertilizer AND light. The result could be caused by either, so nothing can be concluded. Both plants must get identical light, with fertilizer as the only difference.",
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
                title: "Medicine",
                description:
                  "Clinical trials are controlled investigations that test whether new treatments and vaccines are safe and effective before they reach patients.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "Engineering",
                description:
                  "Engineers run controlled tests on the strength of materials and the safety of structures before anything is built at full scale.",
                icon: "🏗️",
                color: "border-l-secondary-500",
              },
              {
                title: "Environmental Science",
                description:
                  "Scientists investigate pollution levels and ecosystem health, controlling for season and location so that changes can be attributed to the right cause.",
                icon: "🌿",
                color: "border-l-accent-500",
              },
              {
                title: "Agriculture",
                description:
                  "Farmers run side-by-side trials of fertilizers and crop varieties, holding soil and watering constant, to find what genuinely improves yield.",
                icon: "🌾",
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
        "Master the SI system, choose the right instrument for every quantity, and learn the difference between being accurate and being precise.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: equation,
      heroImageAlt: "Scientific measurement tools and unit labels",

      signature: {
        widgetId: "meniscus-bench",
        heading: "Watch It: Your Eye Changes the Number",
        intro:
          "The sightline is drawn for real. Look down at the meniscus and the scale reads high; look up at it and it reads low. Only eye level gives the true volume — and the balance beside it is lying by the same amount every time.",
        instruction: "Read three volumes at eye level, then find the systematic error",
        xp: 25,
      },

      sections: [
        "Introduction",
        "Key Terms",
        "Measurement Tools",
        "Using a Graduated Cylinder",
        "Measurement Tips",
        "Accuracy vs. Precision",
        "Measurement Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "NIST — The International System of Units (SI)",
          url: "https://www.nist.gov/pml/owm/metric-si/si-units",
        },
        {
          label: "Khan Academy — Measurement and Units",
          url: "https://www.khanacademy.org/math/cc-fifth-grade-math/measurement-and-data",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>International System of Units</strong> (SI) is the modern metric system used by scientists worldwide. By agreeing on one system, scientists in different countries can share and verify each other's results without confusion.",
              "SI is built on <strong class='text-primary-700'>base units</strong> — the metre for length, the kilogram for mass, the second for time. Metric prefixes such as <strong class='text-primary-700'>kilo-</strong>, <strong class='text-primary-700'>centi-</strong>, and <strong class='text-primary-700'>milli-</strong> scale those units by powers of ten. But choosing the right unit is only half the skill: you also have to use each instrument correctly, and understand the difference between a measurement that is <strong class='text-primary-700'>accurate</strong> and one that is merely <strong class='text-primary-700'>precise</strong>.",
            ],
            didYouKnow:
              "In 1999 NASA lost a $125 million Mars orbiter because one engineering team used metric units while another used imperial. The spacecraft burned up in the Martian atmosphere — a costly reminder of why standard units matter.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "SI Units",
                desc: "The International System of Units — the globally agreed standard for scientific measurement, based on the metric system.",
              },
              {
                term: "Meter (m)",
                desc: "The SI base unit of length. Smaller lengths use centimetres (cm) or millimetres (mm); larger ones use kilometres (km).",
              },
              {
                term: "Kilogram (kg)",
                desc: "The SI base unit of mass. One kilogram equals 1,000 grams.",
              },
              {
                term: "Liter (L)",
                desc: "The SI unit for the volume of liquids and gases. One litre equals 1,000 millilitres (mL). 1 mL = 1 cm³.",
              },
              {
                term: "Metric Prefix",
                desc: "A word part added before a unit to show a multiple or fraction: kilo- (×1,000), centi- (÷100), milli- (÷1,000).",
              },
              {
                term: "Derived Unit",
                desc: "A unit formed by combining base units — speed (m/s), area (m²), density (g/cm³).",
              },
              {
                term: "Meniscus",
                desc: "The curved surface a liquid forms in a narrow tube. Always read volume from the bottom of the curve, at eye level.",
              },
              {
                term: "Parallax Error",
                desc: "The reading error caused by viewing a scale from an angle instead of straight on at eye level.",
              },
              {
                term: "Accuracy",
                desc: "How close a measurement is to the true or accepted value.",
              },
              {
                term: "Precision",
                desc: "How consistent repeated measurements are with each other — regardless of whether they are correct.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Measurement Tools",
          data: {
            cards: [
              {
                title: "Length Tools",
                label: "Length",
                variant: "primary",
                color: "primary",
                desc: "Length is measured in metres (m), centimetres (cm), or millimetres (mm) using rulers, metre sticks, and calipers.",
                image: equation,
                imageAlt: "Ruler and measurement tools",
                examples: [
                  "Ruler (15–30 cm): small objects like pencils or paper",
                  "Metre stick (1 m): furniture or room dimensions",
                  "Vernier caliper: very small lengths with high precision, such as wire diameter",
                ],
              },
              {
                title: "Mass Tools",
                label: "Mass",
                variant: "secondary",
                color: "secondary",
                desc: "Mass is measured in kilograms (kg) or grams (g) using balances and digital scales.",
                image: lab,
                imageAlt: "Balance scale in a laboratory",
                examples: [
                  "Triple beam balance: precise mass in grams using sliding riders",
                  "Digital electronic scale: direct mass reading",
                  "Platform balance: classroom use for larger masses",
                ],
              },
              {
                title: "Volume Tools",
                label: "Volume",
                variant: "primary",
                color: "primary",
                desc: "The volume of liquids is measured in litres (L) or millilitres (mL) using graduated cylinders, beakers, and pipettes.",
                image: simulation,
                imageAlt: "Graduated cylinder with liquid",
                examples: [
                  "Graduated cylinder: most accurate — read at the bottom of the meniscus",
                  "Beaker: approximate volume and mixing only, not precise readings",
                  "Measuring pipette: very small, precise volumes",
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
              "A graduated cylinder is the most accurate common tool for measuring liquid volume. Follow these steps every time for a correct reading.",
            steps: [
              {
                num: 1,
                title: "Choose the Correct Cylinder Size",
                color: "primary",
                description:
                  "Select a cylinder whose capacity is close to the volume you want to measure. Using a 100 mL cylinder for 5 mL of liquid gives far less precision than a 10 mL cylinder.",
                tip: "Use the smallest cylinder that can hold the full volume.",
              },
              {
                num: 2,
                title: "Place It on a Flat, Level Surface",
                color: "secondary",
                description:
                  "Set the cylinder on a flat bench — never hold it in your hand while reading. A tilted surface makes the liquid sit at an angle and gives a wrong reading.",
                tip: "Always place measuring tools on a stable, level surface before reading.",
              },
              {
                num: 3,
                title: "Pour the Liquid Carefully",
                color: "accent",
                description:
                  "Pour slowly, stopping when you are close to the target volume. Avoid splashing or overfilling — removing small amounts accurately is difficult.",
                tip: "Use a dropper for the last few millilitres.",
              },
              {
                num: 4,
                title: "Read at Eye Level",
                color: "primary",
                description:
                  "Bend down so your eyes are level with the liquid surface. Looking from above or below causes parallax error, making the volume appear different from the true value.",
                tip: "Your line of sight must be horizontal and level with the bottom of the meniscus.",
              },
              {
                num: 5,
                title: "Read the Bottom of the Meniscus",
                color: "secondary",
                description:
                  "Water and most liquids curve upward at the edges. Always read the volume from the lowest point of that curve.",
                tip: "Exception: mercury curves the other way — read from the top of its curve.",
              },
              {
                num: 6,
                title: "Record the Value with Units",
                color: "accent",
                description:
                  "Write down the volume including the unit (mL or cm³). Estimate one digit between the smallest markings. A reading without units is meaningless in science.",
                tip: "If markings are every 1 mL, record to one decimal place — e.g. 23.5 mL.",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Measurement Tips",
          data: {
            concepts: [
              "Align the zero mark of a ruler with the edge of the object — never start from the physical end of the ruler, which may not be at zero.",
              "Read every scale at eye level to avoid parallax error.",
              "Always record measurements with their unit — the number '15' alone is meaningless.",
              "Zero (tare) a balance before placing anything on it, and make sure it sits level.",
              "Take multiple measurements and calculate the mean to reduce the effect of random error.",
              "Estimate one digit beyond the smallest division on the instrument to gain an extra significant figure.",
            ],
          },
        },

        {
          type: "comparison",
          heading: "Accuracy vs. Precision",
          data: {
            intro:
              "These two words are used interchangeably in everyday speech, but in science they mean different things — and a measurement can have one without the other.",
            left: {
              label: "Accuracy",
              color: "primary",
              items: [
                "Definition: how close a measurement is to the true or accepted value",
                "Example: measuring a 10.0 g mass and getting 9.9 g is accurate",
                "Caused by: systematic error — poor calibration or wrong technique",
                "How to improve: calibrate the instrument, use correct technique",
                "Formula: Percent Error = |(measured − true) ÷ true| × 100%",
              ],
            },
            right: {
              label: "Precision",
              color: "secondary",
              items: [
                "Definition: how consistent repeated measurements are with each other",
                "Example: getting 9.2, 9.2, 9.3 g repeatedly is precise — even if the true value is 10.0 g",
                "Caused by: random error — inconsistent reading, vibration, shaky hands",
                "How to improve: repeat measurements, read the instrument the same way each time",
                "Often written as ± — e.g. 9.2 ± 0.1 g",
              ],
            },
          },
        },

        {
          type: "scenario",
          heading: "Measurement Scenarios",
          data: {
            intro:
              "Decide whether each situation shows accuracy, precision, both, or neither — and identify the type of error present.",
            scenarios: [
              {
                title: "The Archery Target Analogy",
                situation:
                  "Archer A hits near the bullseye every shot but each arrow lands in a slightly different spot. Archer B hits the same spot on the edge of the target every time, far from the bullseye. Archer C hits near the bullseye, tightly grouped.",
                question:
                  "Which archer is accurate? Which is precise? Which is both?",
                skill:
                  "Archer A = accurate but not precise (near the bullseye but scattered). Archer B = precise but not accurate (consistent but wrong). Archer C = both.",
              },
              {
                title: "Lab Mass Measurements",
                situation:
                  "A student measures a 50.0 g standard mass five times: 48.1, 48.0, 48.2, 48.0, 48.1 grams. The balance was never zeroed.",
                question:
                  "Are these precise? Accurate? What type of error is responsible and how should it be fixed?",
                skill:
                  "Precise — the values agree within ±0.2 g. Not accurate — all are about 2 g below the true value. Systematic error from the unzeroed balance. Fix: tare the balance before measuring.",
              },
              {
                title: "Reading the Cylinder from Above",
                situation:
                  "Two students measure the same 25 mL of water in the same graduated cylinder. One bends down to eye level and reads 25.0 mL. The other stays standing and reads 26.5 mL.",
                question:
                  "Why did the two students get different numbers from the identical cylinder? Which reading should be recorded?",
                skill:
                  "Parallax error — viewing the scale from above makes the liquid appear higher than it is. The eye-level reading of 25.0 mL is correct.",
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
                title: "Medicine and Dosing",
                description:
                  "Doctors and pharmacists prescribe exact doses in milligrams and millilitres. An error of a few units can be life-threatening.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "Engineering and Construction",
                description:
                  "Engineers work to precise SI measurements. A wall framed even 5 mm out of square creates major problems fitting doors and windows.",
                icon: "🏗️",
                color: "border-l-secondary-500",
              },
              {
                title: "International Trade",
                description:
                  "Countries trading goods rely on SI units to agree on the mass, volume, and dimensions of everything from food shipments to steel.",
                icon: "🚢",
                color: "border-l-accent-500",
              },
              {
                title: "Scientific Research",
                description:
                  "Results are only trusted when they are both accurate and precise, so that laboratories in other countries can reproduce them exactly.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
