// Week 6: Solubility of Matter — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 6.
//   Lesson 1 — Solubility of Matter: Solute and Solvent
//   Lesson 2 — Creation of Performance Task 2: Solution Detectives

import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";
import mysterylab from "../assets/mysterylab.png";
import classroom from "../assets/classroom.webp";

export const week06 = {
  id: "week-6",
  weekNumber: 6,
  title: "Solubility of Matter",
  category: "Chemistry",
  description:
    "Identify the solute and solvent in a solution, express how much solute is dissolved, and see how heat and other factors change solubility. Then investigate everyday solutions in Performance Task 2.",
  icon: "Droplets",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Solubility of Matter: Solute and Solvent
    // ═══════════════════════════════════════════════════
    {
      id: "w06-l1",
      weekId: "week-6",
      lessonNumber: 1,
      title: "Solubility of Matter: Solute and Solvent",
      badge: "Lesson 1",
      subtitle:
        "Tell the solute from the solvent, describe the amount of solute in numbers, and find out why heat lets more sugar dissolve in your tea.",
      readTime: "~20 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt: "Sugar being stirred into a glass of water with a spoon",

      signature: {
        widgetId: "solubility-beaker",
        heading: "Watch It: The Beaker Says No",
        intro: "Sugar dissolves until the water will take no more.",
        instruction: "Make all three solutions, then change the speed.",
        xp: 25,
        explainer: {
          title: "Why the beaker stopped taking sugar",
          points: [
            "Early spoonfuls disappeared into the water. The marker sat below the curve: unsaturated.",
            "Once the marker touched the curve, the water was full. Every extra spoonful piled up on the bottom.",
            "Warming the water lifted the curve, so the pile dissolved. Cooling it pushed the marker above the curve.",
            "The stirrer and the crusher only sped things up. The curve never moved, so the limit stayed the same.",
          ],
        },
      },

      sections: [
        "Overview",
        "Solute and Solvent Around You",
        "How Much Solute Is in a Solution?",
        "Factors Affecting Solubility",
        "Saturated vs. Unsaturated",
        "Factors Affecting the Rate of Dissolving",
      ],

      references: [
        {
          label: "Britannica — Solution (Chemistry)",
          url: "https://www.britannica.com/science/solution-chemistry",
        },
        {
          label: "Britannica — Solubility (Chemistry)",
          url: "https://www.britannica.com/science/solubility-chemistry",
        },
        {
          label: "Khan Academy — Solubility",
          url: "https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces/mixtures-and-solutions/a/solubility",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Lia makes a pitcher of iced tea. She pours cold water over the tea, adds ice, then dumps in four spoonfuls of sugar. She stirs and stirs, but a layer of sugar stays at the bottom, and the tea is not sweet enough. Her Kuya makes his by dissolving the sugar in hot tea first, then adding ice. His is sweet with no sugar left at the bottom. Why? This is the <strong class='text-primary-700'>Iced Tea Dilemma</strong>.",
              "Sweet tea is a <strong class='text-primary-700'>solution</strong>, a mixture in which one substance is spread evenly through another. The substance that gets dissolved is the <strong class='text-primary-700'>solute</strong> (the sugar). The substance that does the dissolving is the <strong class='text-primary-700'>solvent</strong> (the water in the tea). The solvent is usually the part present in the larger amount.",
              "<strong class='text-primary-700'>Solubility</strong> is the most solute that can dissolve in a certain amount of solvent at a certain temperature. Hot water can hold much more sugar than cold water. That is why Kuya's method works.",
              "Working with solutions also means being <strong class='text-primary-700'>responsible</strong>. Label every container, never taste anything in the lab, and handle cleaning solutions like Zonrox only with adult supervision.",
            ],
            didYouKnow:
              "Water is called the \"universal solvent\" because it dissolves more kinds of substances than any other common liquid. Even the air you breathe is a solution: a gas (oxygen) dissolved in another gas (nitrogen).",
          },
        },

        {
          type: "imageCards",
          heading: "Solute and Solvent Around You",
          data: {
            cards: [
              {
                title: "Sweet Iced Tea",
                label: "Solid in liquid",
                variant: "primary",
                color: "primary",
                desc: "Sugar is a solid that dissolves in the water of the tea. The sugar is the solute and the water is the solvent.",
                image: lab,
                imageAlt: "Glasses of iced tea with ice cubes",
                examples: [
                  "Solute: sugar",
                  "Solvent: water",
                  "Also: salt in seawater, powdered juice drink",
                ],
              },
              {
                title: "Rubbing Alcohol",
                label: "Liquid in liquid",
                variant: "secondary",
                color: "secondary",
                desc: "A bottle labeled \"70% alcohol\" is 70 parts alcohol and 30 parts water. Here alcohol is the larger part, so alcohol is the solvent and water is the solute.",
                image: simulation,
                imageAlt: "A bottle of rubbing alcohol",
                examples: [
                  "Solute: water (30%)",
                  "Solvent: alcohol (70%)",
                  "Also: vinegar (acetic acid in water)",
                ],
              },
              {
                title: "Soft Drinks",
                label: "Gas in liquid",
                variant: "accent",
                color: "accent",
                desc: "The fizz is carbon dioxide gas dissolved in water under pressure. When you open the bottle, the pressure drops and bubbles of the gas escape.",
                image: equation,
                imageAlt: "Bubbles rising in a glass of soda",
                examples: [
                  "Solutes: carbon dioxide gas, sugar, flavoring",
                  "Solvent: water",
                  "Also: oxygen dissolved in river water, which fish breathe",
                ],
              },
              {
                title: "Brass",
                label: "Solid in solid",
                variant: "primary",
                color: "primary",
                desc: "Brass is an alloy, a solution of two metals. Zinc is mixed evenly into melted copper, and the mixture hardens into a shiny solid.",
                image: equation,
                imageAlt: "Shiny brass objects such as a brass instrument or fittings",
                examples: [
                  "Solute: zinc",
                  "Solvent: copper",
                  "Used in: trumpets, door knobs, keys",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "How Much Solute Is in a Solution?",
          data: {
            intro:
              "Saying a drink is \"a little sweet\" or \"very salty\" is not exact. Scientists use numbers to show how much solute is in a given amount of solvent or solution.",
            steps: [
              {
                num: 1,
                title: "Grams of Solute per Volume of Solvent",
                color: "primary",
                description:
                  "The simplest way is to state the mass of solute and the volume of solvent. Example: \"10 g of sugar dissolved in 250 mL of water.\" Solubility is often written this way: about 36 g of table salt can dissolve in 100 mL of water at room temperature.",
                tip: "Always give both numbers and both units. \"10 g of sugar\" alone does not tell how strong the solution is.",
              },
              {
                num: 2,
                title: "Percent by Mass",
                color: "secondary",
                description:
                  "Percent by mass = (mass of solute ÷ mass of solution) × 100%. The mass of the solution is solute + solvent. Example: 5 g of salt + 95 g of water = 100 g of solution, so it is (5 ÷ 100) × 100% = 5% salt by mass.",
                tip: "Since 1 mL of water has a mass of about 1 g, 95 mL of water is about 95 g.",
              },
              {
                num: 3,
                title: "Percent by Volume",
                color: "accent",
                description:
                  "When both solute and solvent are liquids, use volume. Percent by volume = (volume of solute ÷ volume of solution) × 100%. A 100 mL bottle of 70% alcohol contains 70 mL of alcohol.",
                tip: "Vinegar labels often say about 4–5% acidity. That means about 4 to 5 mL of acetic acid in every 100 mL of vinegar.",
              },
              {
                num: 4,
                title: "Compare Using the Same Amount",
                color: "primary",
                description:
                  "To compare two solutions, use the same amount of solvent. A glass with 20 g of sugar in 200 mL of water and a glass with 10 g in 100 mL are equally sweet: both have 10 g of sugar for every 100 mL of water.",
                tip: "More solute in the same amount of solvent = a more concentrated solution. You will study concentration more in Week 7.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Factors Affecting Solubility",
          data: {
            intro:
              "Solubility answers \"How much can dissolve?\" These factors change that limit.",
            reasons: [
              {
                num: 1,
                title: "Temperature (Heat) for Solids",
                color: "primary",
                desc: "Heating the solvent lets most solids dissolve more",
                content:
                  "About 200 g of sugar dissolves in 100 mL of water at 20 °C, but nearly 490 g at 100 °C. That solves the Iced Tea Dilemma.",
              },
              {
                num: 2,
                title: "Temperature for Gases",
                color: "secondary",
                desc: "Heating the solvent makes gases dissolve less",
                content:
                  "A warm soft drink goes flat faster than a cold one because the carbon dioxide escapes more easily.",
              },
              {
                num: 3,
                title: "Not Every Solid Changes Much",
                color: "accent",
                desc: "Some solutes barely change with temperature",
                content:
                  "Salt's solubility only rises from about 36 g to 39 g per 100 mL of water between room temperature and boiling.",
              },
              {
                num: 4,
                title: "Pressure for Gases",
                color: "primary",
                desc: "Higher pressure lets more gas dissolve in a liquid",
                content:
                  "Soft drinks are sealed under pressure to keep the carbon dioxide dissolved until you open them.",
              },
              {
                num: 5,
                title: "Nature of Solute and Solvent",
                color: "secondary",
                desc: "\"Like dissolves like\"",
                content:
                  "Salt and sugar dissolve in water, but cooking oil does not. Oil stains need soap, which can mix with both oil and water.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Saturated vs. Unsaturated",
          data: {
            intro:
              "Whether a solution has reached its limit tells you if it can still take more solute.",
            left: {
              label: "Saturated Solution",
              color: "primary",
              items: [
                "Holds the most solute it can at that temperature",
                "Extra solute stays at the bottom, undissolved",
                "Heating it lets more dissolve, so it becomes unsaturated again",
                "Example: Lia's cold iced tea with sugar left at the bottom",
              ],
            },
            right: {
              label: "Unsaturated Solution",
              color: "secondary",
              items: [
                "Holds less solute than it can",
                "More solute can still dissolve",
                "Looks clear with nothing left at the bottom",
                "Example: one spoonful of sugar in a glass of warm water",
              ],
            },
          },
        },

        {
          type: "timeline",
          heading: "Factors Affecting the Rate of Dissolving",
          data: {
            intro:
              "The rate of dissolving answers a different question: \"How fast?\" You can test each factor with a fair test, changing only one thing at a time.",
            steps: [
              {
                num: 1,
                title: "Set Up a Fair Test",
                color: "primary",
                description:
                  "Use cups with the same volume of water (for example, 100 mL each) and the same mass of sugar (5 g each). Time each cup with a stopwatch and record the results in a table.",
                tip: "Same amounts in every cup. Only the factor you are testing should change.",
              },
              {
                num: 2,
                title: "Temperature: Hotter Is Faster",
                color: "secondary",
                description:
                  "Put sugar in cold water and in warm water, without stirring. In warm water, the water particles move faster and hit the sugar more often, so it dissolves faster.",
                tip: "Use warm tap water, not boiling water, to avoid burns.",
              },
              {
                num: 3,
                title: "Particle Size: Smaller Is Faster",
                color: "accent",
                description:
                  "Compare a sugar cube with the same mass of fine sugar. Fine sugar has more surface touching the water, so more of it dissolves at once.",
                tip: "This is why powdered juice mixes dissolve so fast.",
              },
              {
                num: 4,
                title: "Stirring: Mixing Is Faster",
                color: "primary",
                description:
                  "Stir one cup and leave the other still. Stirring moves fresh water next to the sugar, so it dissolves faster.",
                tip: "Stirring, heating, and crushing all speed up dissolving, but only heating changes how much can dissolve.",
              },
            ],
          },
        },

      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Creation of Performance Task 2
    // ═══════════════════════════════════════════════════
    {
      id: "w06-l2",
      weekId: "week-6",
      lessonNumber: 2,
      title:
        "Creation of Performance Task 2: Solution Detectives — Exploring Solutes and Solvents in Everyday Life",
      badge: "Performance Task 2",
      subtitle:
        "Work in a group of five to make at least three everyday solutions, measure them in standard units, and explain their solutes and solvents in a 1–3 minute \"Solution Showcase\" video.",
      readTime: "~14 min read",
      xp: 100,
      heroImage: mysterylab,
      heroImageAlt:
        "Students recording a science demonstration with a phone camera",

      sections: [
        "The Task",
        "What You Will Need",
        "Solutions to Showcase",
        "Making Your Solution Showcase",
        "How You Will Be Graded",
        "Tips for a Strong Video",
      ],

      references: [
        {
          label: "Britannica — Solution (Chemistry)",
          url: "https://www.britannica.com/science/solution-chemistry",
        },
        {
          label: "NIST — The International System of Units (SI)",
          url: "https://www.nist.gov/pml/owm/metric-si/si-units",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "The Task",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Goal:</strong> Find out how everyday solutions are made by identifying their solutes and solvents. <strong class='text-primary-700'>Role:</strong> You are a student scientist, a \"solution detective.\" <strong class='text-primary-700'>Audience:</strong> your classmates, your teachers, and younger students.",
              "<strong class='text-primary-700'>Situation:</strong> Your class is holding a \"Science Gallery Walk.\" Each group of five will play its video for visitors who want to learn how solutions work.",
              "<strong class='text-primary-700'>Product:</strong> A 1–3 minute <strong class='text-primary-700'>\"Solution Showcase\" video</strong>. Show at least three solutions being made (for example, saltwater, coffee, and vinegar in water). For each one, name the solute and the solvent, show your measurements, and explain why it is a solution. Use clear labels, and keep it neat and accurate.",
              "Throughout the task, be <strong class='text-primary-700'>responsible</strong>: handle every material safely, follow the procedure, and clean up when you are done.",
            ],
            didYouKnow:
              "Food labels list ingredients from the largest amount to the smallest. In most drinks, water is listed first, a clue that water is the solvent.",
          },
        },

        {
          type: "keyTerms",
          heading: "What You Will Need",
          data: {
            terms: [
              {
                term: "Three or more solutes",
                desc: "Safe kitchen items such as salt, sugar, instant coffee, powdered juice, vinegar, or calamansi. No cleaning products.",
              },
              {
                term: "Clean water (the solvent)",
                desc: "Use drinking water at room temperature, plus warm water if you want to show the effect of heat.",
              },
              {
                term: "Measuring tools",
                desc: "A graduated cylinder or measuring cup marked in mL, and a kitchen scale or measuring spoons. Write every amount with its unit.",
              },
              {
                term: "Clear glasses or jars",
                desc: "So viewers can see that a solution looks the same all through and nothing settles.",
              },
              {
                term: "Labels and a data table",
                desc: "Label each glass. Record the solute, the solvent, the amounts, and what you observed.",
              },
              {
                term: "Phone or camera",
                desc: "To record the video. Hold it steady and film in good light.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Solutions to Showcase",
          data: {
            cards: [
              {
                title: "Saltwater",
                label: "Solid in liquid",
                variant: "primary",
                color: "primary",
                desc: "Stir table salt into water until it disappears. The water looks clear, but if a few drops dry on a dark plate, white salt is left behind. The salt was there all along, spread evenly.",
                image: lab,
                imageAlt: "Table salt and a glass of water",
                examples: [
                  "Solute: salt",
                  "Solvent: water",
                  "Try: 5 g of salt in 100 mL of water",
                ],
              },
              {
                title: "Coffee",
                label: "Solid in liquid",
                variant: "secondary",
                color: "secondary",
                desc: "Instant coffee granules dissolve in hot water and give it an even brown color all through.",
                image: classroom,
                imageAlt: "A cup of black coffee",
                examples: [
                  "Solute: coffee granules (and sugar, if added)",
                  "Solvent: water",
                  "Show: hot water dissolves the granules faster",
                ],
              },
              {
                title: "Vinegar in Water",
                label: "Liquid in liquid",
                variant: "accent",
                color: "accent",
                desc: "Vinegar is already a solution of acetic acid in water. Adding it to more water makes a weaker solution that still looks clear and even.",
                image: simulation,
                imageAlt: "A bottle of vinegar",
                examples: [
                  "Solute: vinegar (acetic acid)",
                  "Solvent: water",
                  "Try: 10 mL of vinegar in 90 mL of water",
                ],
              },
              {
                title: "Calamansi Juice",
                label: "Solid and liquid in liquid",
                variant: "primary",
                color: "primary",
                desc: "Calamansi juice and sugar mixed into water make a drink. Strain out the seeds and pulp first. Anything that settles at the bottom is not part of the solution.",
                image: mysterylab,
                imageAlt: "Calamansi fruits, some cut in half",
                examples: [
                  "Solutes: calamansi juice, sugar",
                  "Solvent: water",
                  "Tip: pulp that settles is not dissolved",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Making Your Solution Showcase",
          data: {
            intro:
              "Plan first, then measure, then film. Your group of five can divide the roles: measurer, mixer, recorder, camera person, and narrator.",
            steps: [
              {
                num: 1,
                title: "Plan Your Three Solutions",
                color: "primary",
                description:
                  "Choose at least three solutions. For each, write down the solute, the solvent, and how much of each you will use. Get your teacher's approval for your list.",
                tip: "Choose solutions that are different from each other, like a solid in a liquid and a liquid in a liquid.",
              },
              {
                num: 2,
                title: "Measure in Standard Units",
                color: "secondary",
                description:
                  "Measure the water with a graduated cylinder or measuring cup (for example, 100 mL). Measure the solute with a scale or measuring spoon (for example, 5 g of salt). Read volumes at eye level.",
                tip: "Show the measuring step on camera, with the number and unit clearly visible.",
              },
              {
                num: 3,
                title: "Make Each Solution",
                color: "accent",
                description:
                  "Add the solute to the solvent and stir until it dissolves. Observe: Did it disappear? Is the color the same all through? Did anything settle after a few minutes?",
                tip: "If something settles at the bottom, it is not fully dissolved. Explain that in your video.",
              },
              {
                num: 4,
                title: "Record Your Data",
                color: "primary",
                description:
                  "Fill in a table with columns for Solution, Solute (amount), Solvent (amount), Observations, and \"Why it is a solution.\" Show the finished table in your video.",
                tip: "Record the real results, even if something did not dissolve as expected.",
              },
              {
                num: 5,
                title: "Film and Explain",
                color: "secondary",
                description:
                  "For each solution, say: \"The solute is ___. The solvent is ___. It is a solution because ___.\" Add labels on screen or on the glasses. Keep the video between 1 and 3 minutes.",
                tip: "Practice once before filming so your explanation is clear and confident.",
              },
              {
                num: 6,
                title: "Clean Up and Submit",
                color: "accent",
                description:
                  "Wash the glasses and tools, wipe the table, and throw away used solutions properly. Submit your video on time for the Science Gallery Walk.",
                tip: "Leaving the workspace clean is part of being responsible.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "How You Will Be Graded",
          data: {
            intro:
              "Your video is scored out of 100 points using five criteria. Read them before you start.",
            left: {
              label: "Science Work — 70 points",
              color: "primary",
              items: [
                "Experiment Design (25 pts): three or more solutions, clear plan, safe materials",
                "Data Collection (25 pts): accurate measurements with units, organized in a table",
                "Analysis & Conclusion (20 pts): solute and solvent correctly identified and explained",
              ],
            },
            right: {
              label: "Communication — 30 points",
              color: "secondary",
              items: [
                "Presentation (20 pts): clear labels, clear explanation, 1–3 minutes long",
                "Creativity & Engagement (10 pts): interesting for classmates and younger students",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Tips for a Strong Video",
          data: {
            concepts: [
              "Say the words solute and solvent out loud for every solution. That is what the task is about.",
              "Show the measuring tools and read the numbers with units: \"100 milliliters of water, 5 grams of salt.\"",
              "Explain why it is a solution: the solute disappeared, it looks the same all through, and nothing settled.",
              "Show one thing that is NOT a solution (like sand in water) to make your explanation stronger.",
              "Show heat as a factor: dissolve the same solute in cold and warm water and compare.",
              "Never taste anything during the task, and never use bleach or other cleaning products.",
            ],
          },
        },

      ],
    },
  ],
};
