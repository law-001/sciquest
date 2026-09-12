// Week 6: Solubility of Matter — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 6.
//   Lesson 1 — Solubility of Matter: Solute and Solvent
//   Lesson 2 — Creation of Performance Task 2: Solution Detectives

import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";
import mysterylab from "../assets/mysterylab.png";

export const week06 = {
  id: "week-6",
  weekNumber: 6,
  title: "Solubility of Matter",
  category: "Chemistry",
  description:
    "Learn how solutes dissolve in solvents, what controls solubility and the rate of dissolving, then investigate everyday solutions in Performance Task 2.",
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
        "Understand what dissolves in what, how much can dissolve, and how fast — the three separate questions at the heart of solubility.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt: "Laboratory glassware with colorful solutions",

      sections: [
        "Overview",
        "Key Terms",
        "Types of Mixtures",
        "Factors Affecting Solubility",
        "Saturated vs. Unsaturated",
        "Factors Affecting the Rate of Dissolving",
        "Key Concepts",
        "Applications",
      ],

      references: [
        {
          label: "Britannica — Solution (Chemistry)",
          url: "https://www.britannica.com/science/solution-chemistry",
        },
        {
          label: "Khan Academy — Solutions and Solubility",
          url: "https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Matter can be classified as either a <strong class='text-primary-700'>pure substance</strong> or a <strong class='text-primary-700'>mixture</strong>. A pure substance has a fixed composition throughout — pure water, pure gold. A mixture is two or more substances combined but not chemically joined.",
              "When one substance dissolves completely into another, the result is a <strong class='text-primary-700'>solution</strong>. The <strong class='text-primary-700'>solute</strong> is the substance that dissolves; the <strong class='text-primary-700'>solvent</strong> is the substance doing the dissolving. In saltwater, salt is the solute and water is the solvent.",
              "Three separate questions follow from that. <em>Will</em> it dissolve? That is the 'like dissolves like' rule. <em>How much</em> can dissolve? That is <strong class='text-primary-700'>solubility</strong>. <em>How fast</em> does it dissolve? That is the <strong class='text-primary-700'>rate of dissolving</strong> — and it is not the same thing as solubility.",
            ],
            didYouKnow:
              "Air is a mixture of gases — mostly nitrogen (78%) and oxygen (21%) — which makes it a homogeneous mixture, or a solution, of gases.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Pure Substance",
                desc: "A material with a fixed and uniform composition throughout, such as distilled water, gold, or oxygen gas.",
              },
              {
                term: "Mixture",
                desc: "A combination of two or more substances that are not chemically combined and can be separated by physical means.",
              },
              {
                term: "Solution",
                desc: "A homogeneous mixture in which one substance is completely and evenly dissolved in another.",
              },
              {
                term: "Solute",
                desc: "The substance that is dissolved in a solution, usually present in the smaller amount — salt in saltwater.",
              },
              {
                term: "Solvent",
                desc: "The substance that does the dissolving, usually present in the larger amount — water in saltwater.",
              },
              {
                term: "Solubility",
                desc: "The maximum amount of solute that can dissolve in a given amount of solvent at a specific temperature.",
              },
              {
                term: "Rate of Dissolving",
                desc: "How quickly a solute dissolves. Different from solubility, which is about how much can dissolve in total.",
              },
              {
                term: "Homogeneous",
                desc: "Having a uniform composition throughout — the same at every point. All solutions are homogeneous.",
              },
              {
                term: "Heterogeneous",
                desc: "Having a non-uniform composition, where the components can be visibly told apart — like sand in water.",
              },
              {
                term: "Surface Area",
                desc: "The total area of solute exposed to the solvent. Smaller pieces have more surface area, so they dissolve faster.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Types of Mixtures",
          data: {
            cards: [
              {
                title: "Solutions",
                label: "Homogeneous",
                variant: "primary",
                color: "primary",
                desc: "The solute dissolves completely and evenly in the solvent. The particles are far too small to see and never settle out.",
                image: lab,
                imageAlt: "Clear saltwater solution in a beaker",
                examples: [
                  "Saltwater (salt dissolved in water)",
                  "Air (a mixture of gases)",
                  "Alloys such as brass (copper and zinc)",
                ],
              },
              {
                title: "Suspensions",
                label: "Heterogeneous",
                variant: "secondary",
                color: "secondary",
                desc: "Larger particles are mixed into a liquid but do not dissolve. Left undisturbed, they settle to the bottom.",
                image: simulation,
                imageAlt: "Muddy water suspension",
                examples: [
                  "Muddy water (soil particles in water)",
                  "Blood (cells suspended in plasma)",
                  "Salad dressing (oil, vinegar, and spices)",
                ],
              },
              {
                title: "Colloids",
                label: "Intermediate",
                variant: "primary",
                color: "primary",
                desc: "Medium-sized particles dispersed throughout that do not settle. They scatter a beam of light — the Tyndall effect.",
                image: equation,
                imageAlt: "Milk as a colloid example",
                examples: [
                  "Milk (fat droplets in water)",
                  "Fog (water droplets in air)",
                  "Gelatin (protein particles in water)",
                ],
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Factors Affecting Solubility",
          data: {
            intro:
              "Solubility answers the question 'how much can dissolve in total?' Several factors change that maximum.",
            reasons: [
              {
                num: 1,
                title: "Temperature (Solids)",
                color: "primary",
                desc: "Higher temperature increases the solubility of most solids",
                content: "e.g. More sugar dissolves in hot tea than in iced tea",
              },
              {
                num: 2,
                title: "Temperature (Gases)",
                color: "secondary",
                desc: "Higher temperature decreases the solubility of gases",
                content:
                  "e.g. Warm soda goes flat faster because CO₂ escapes more easily",
              },
              {
                num: 3,
                title: "Pressure (Gases)",
                color: "accent",
                desc: "Higher pressure increases the solubility of gases in liquids",
                content:
                  "e.g. Carbonated drinks are sealed under pressure to keep CO₂ dissolved",
              },
              {
                num: 4,
                title: "Nature of the Solute",
                color: "primary",
                desc: "Polar solutes dissolve in polar solvents — 'like dissolves like'",
                content: "e.g. Salt dissolves in water; candle wax does not",
              },
              {
                num: 5,
                title: "Nature of the Solvent",
                color: "secondary",
                desc: "The solvent decides what can dissolve in it at all",
                content: "e.g. Grease dissolves in acetone but not in water",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Saturated vs. Unsaturated",
          data: {
            intro:
              "Whether a solution has reached its limit matters in chemistry, cooking, and industry alike.",
            left: {
              label: "Saturated Solution",
              color: "primary",
              items: [
                "Contains the maximum amount of dissolved solute",
                "No more solute can dissolve at that temperature",
                "Excess solute sits undissolved at the bottom",
                "Heating it can turn it back into an unsaturated solution",
                "Example: saltwater at its dissolving limit",
              ],
            },
            right: {
              label: "Unsaturated Solution",
              color: "secondary",
              items: [
                "Contains less solute than the maximum possible",
                "More solute can still be added and dissolved",
                "Appears clear with no undissolved residue",
                "Becomes saturated by adding more solute",
                "Example: lightly salted water",
              ],
            },
          },
        },

        {
          type: "timeline",
          heading: "Factors Affecting the Rate of Dissolving",
          data: {
            intro:
              "The rate of dissolving answers a different question: 'how fast?' Three factors control it, and you can test each one with a fair experiment.",
            steps: [
              {
                num: 1,
                title: "Prepare a Fair Test",
                color: "primary",
                description:
                  "Gather four beakers with equal volumes of water. Label them A, B, C, and D. Use the same mass of sugar in each so that only the factor you are testing differs.",
                tip: "Same mass of sugar and same volume of water in every beaker — otherwise it is not a fair test.",
              },
              {
                num: 2,
                title: "Temperature — Hotter Dissolves Faster",
                color: "secondary",
                description:
                  "Use cold water in beaker A and hot water in beaker B. Add one sugar cube to each and do not stir. Higher temperature gives water molecules more kinetic energy, so they collide with the sugar more often and more forcefully.",
                tip: "Time both with a stopwatch so you have real data rather than an impression.",
              },
              {
                num: 3,
                title: "Particle Size — Smaller Dissolves Faster",
                color: "accent",
                description:
                  "Add a sugar cube to beaker C and the same mass of powdered sugar to beaker D, both at room temperature, without stirring. The powder has far more surface area exposed to the water, so more sugar is in contact with the solvent at once.",
                tip: "Same mass, different surface area — this is why crushing a tablet makes it dissolve faster.",
              },
              {
                num: 4,
                title: "Stirring — Agitation Dissolves Faster",
                color: "primary",
                description:
                  "Add powdered sugar to two beakers of room-temperature water. Stir one continuously and leave the other still. Stirring sweeps away the sugar-rich water next to the solute and brings fresh solvent into contact with it.",
                tip: "Stir at a steady pace so the comparison stays fair.",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Key Concepts",
          data: {
            concepts: [
              "Solubility is always stated at a specific temperature, because temperature changes the maximum that can dissolve.",
              "Solubility and rate of dissolving are different: solubility is how much, rate is how fast.",
              "Stirring, heating, and crushing all speed up dissolving — but only heating changes how much can dissolve in total.",
              "A saturated solution holds the maximum dissolved solute; an unsaturated one holds less.",
              "A supersaturated solution holds more than should be possible at that temperature — it is unstable and can crystallise suddenly.",
              "'Like dissolves like': polar solvents dissolve polar solutes, non-polar solvents dissolve non-polar solutes. This is why oil and water do not mix.",
              "A solubility curve is a graph showing how a substance's solubility changes with temperature.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Drinking Water Treatment",
                description:
                  "Treatment plants use filtration and chemical solutions to remove impurities and produce safe drinking water.",
                icon: "💧",
                color: "border-l-primary-500",
              },
              {
                title: "Effervescent Medicine Tablets",
                description:
                  "Tablets meant to dissolve in water are pressed from fine particles to maximise surface area, so the drug is absorbed quickly.",
                icon: "💊",
                color: "border-l-secondary-500",
              },
              {
                title: "Food and Drink Manufacturing",
                description:
                  "Manufacturers control temperature and mixing speed to dissolve sugars and flavourings at exactly the right rate.",
                icon: "🏭",
                color: "border-l-accent-500",
              },
              {
                title: "Cleaning Products",
                description:
                  "Powdered detergent is ground finely so it dissolves fast, and is formulated so that grease — normally insoluble in water — can be carried away.",
                icon: "🫧",
                color: "border-l-primary-500",
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
        "Become a solution detective: hunt down real solutions in your own home, identify the solute and solvent in each, and report your findings like a scientist.",
      readTime: "~12 min read",
      xp: 100,
      heroImage: mysterylab,
      heroImageAlt:
        "Investigation-style laboratory scene with unknown samples to identify",

      sections: [
        "The Task",
        "What You Will Need",
        "Carrying Out the Investigation",
        "How You Will Be Graded",
        "Tips for a Strong Report",
        "Why This Task Matters",
      ],

      references: [
        {
          label: "Britannica — Solution (Chemistry)",
          url: "https://www.britannica.com/science/solution-chemistry",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "The Task",
          data: {
            paragraphs: [
              "Your kitchen, bathroom, and garage are full of solutions — you just have not labelled them yet. In this performance task you become a <strong class='text-primary-700'>solution detective</strong>: find at least eight real products in your home, work out which is the solute and which is the solvent in each, and classify every one as a solution, a suspension, or a colloid.",
              "You will present your findings as an <strong class='text-primary-700'>investigation report</strong> with a data table, a short written analysis, and evidence — photographs or drawings of the products you examined. You are being assessed on whether you can apply the solute–solvent idea to things nobody labelled for you.",
            ],
            didYouKnow:
              "Reading ingredient labels is real chemistry. Ingredients are listed in order of quantity, so the first item on the list is almost always the solvent.",
          },
        },

        {
          type: "keyTerms",
          heading: "What You Will Need",
          data: {
            terms: [
              {
                term: "Eight household products",
                desc: "Safe, everyday items — vinegar, soft drink, brewed coffee, salt water, rubbing alcohol, shampoo, milk, muddy water, seawater, syrup. Never taste or mix anything.",
              },
              {
                term: "A data table",
                desc: "Columns for the product, the solute, the solvent, the mixture type (solution, suspension, or colloid), and the evidence for your classification.",
              },
              {
                term: "A clear glass or jar",
                desc: "For observing whether a sample is transparent, cloudy, or settles into layers over time.",
              },
              {
                term: "A torch or phone light",
                desc: "For the Tyndall test — shine a beam through the sample. A visible shaft of light means a colloid.",
              },
              {
                term: "Camera or drawing materials",
                desc: "Photograph or sketch each product as evidence to attach to your report.",
              },
              {
                term: "Adult supervision",
                desc: "Have an adult present when handling any cleaning product, and never open or mix chemicals.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Carrying Out the Investigation",
          data: {
            intro:
              "Work through these steps in order. Steps two and three are where the marks are — take your time on them.",
            steps: [
              {
                num: 1,
                title: "Collect Your Samples",
                color: "primary",
                description:
                  "Find at least eight household products that are mixtures of some kind. Aim for variety: at least one you think is a solution, one a suspension, and one a colloid. Write each one down before you start analysing.",
                tip: "Ask permission before taking anything from the kitchen, and never use an unlabelled container.",
              },
              {
                num: 2,
                title: "Identify the Solute and Solvent",
                color: "secondary",
                description:
                  "For each product, read the label and decide which substance is dissolved (the solute) and which is doing the dissolving (the solvent). Remember the solvent is normally the ingredient present in the greatest amount.",
                tip: "For most household products the solvent is water — but rubbing alcohol and nail polish remover are exceptions worth noting.",
              },
              {
                num: 3,
                title: "Classify the Mixture",
                color: "accent",
                description:
                  "Decide whether each sample is a solution, a suspension, or a colloid. Use two tests: leave the sample standing for thirty minutes and see whether anything settles, then shine a torch through it and look for a visible beam.",
                tip: "Clear and no beam = solution. Cloudy with a visible beam and no settling = colloid. Settles out = suspension.",
              },
              {
                num: 4,
                title: "Record Your Data",
                color: "primary",
                description:
                  "Fill in your data table completely — product, solute, solvent, mixture type, and the observation that justifies your classification. Every row needs evidence, not just a label.",
                tip: "Write the evidence as an observation, e.g. 'beam clearly visible, nothing settled after 30 min'.",
              },
              {
                num: 5,
                title: "Write Your Analysis",
                color: "secondary",
                description:
                  "In one or two paragraphs, describe the patterns you noticed. Which solvent appeared most often? Were any products difficult to classify, and why? Did anything surprise you?",
                tip: "Mentioning a sample you found genuinely hard to classify shows deeper understanding, not weakness.",
              },
              {
                num: 6,
                title: "Assemble and Submit",
                color: "accent",
                description:
                  "Put together your report: title page, data table, photographs or drawings, analysis, and a short conclusion. Write your name and section, then submit on the due date.",
                tip: "Check every scientific term is spelled correctly before submitting.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "How You Will Be Graded",
          data: {
            intro:
              "Your report is marked out of 100 points across two areas. Read this before you start collecting samples.",
            left: {
              label: "Science Content — 60 points",
              color: "primary",
              items: [
                "Solute and solvent correctly identified for each product (20 pts)",
                "Mixture types correctly classified with evidence given (20 pts)",
                "At least eight products, covering all three mixture types (10 pts)",
                "Analysis correctly uses scientific vocabulary (10 pts)",
              ],
            },
            right: {
              label: "Report Quality — 40 points",
              color: "secondary",
              items: [
                "Data table is complete, organised, and easy to read (15 pts)",
                "Photographs or drawings included as evidence (10 pts)",
                "Analysis and conclusion are clearly written (10 pts)",
                "Report is neat, complete, and submitted on time (5 pts)",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Tips for a Strong Report",
          data: {
            concepts: [
              "Do the Tyndall test in a dark room — a visible beam is much easier to see, and it is the clearest way to separate a colloid from a solution.",
              "Give the settling test a full thirty minutes. Some suspensions take a while, and calling one a colloid too early is the most common mistake.",
              "Milk looks like a solution but is a colloid. Including it and explaining the evidence earns more credit than avoiding it.",
              "Not every solvent is water. Finding at least one alcohol-based product shows you understand what a solvent actually is.",
              "Write the evidence, not just the answer. 'Suspension — mud settled to the bottom in 10 minutes' is worth more than 'suspension'.",
              "Safety first: never taste a sample, never mix two cleaning products, and keep an adult nearby.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Why This Task Matters",
          data: {
            apps: [
              {
                title: "Reading What You Buy",
                description:
                  "Once you can read an ingredient list as a solute-and-solvent problem, you can work out what is actually in food, medicine, and cleaning products.",
                icon: "🏷️",
                color: "border-l-primary-500",
              },
              {
                title: "How Scientists Actually Work",
                description:
                  "Collecting samples, classifying them against criteria, and reporting the evidence is exactly the workflow of an analytical chemist.",
                icon: "🔬",
                color: "border-l-secondary-500",
              },
              {
                title: "Water Quality Testing",
                description:
                  "Environmental technicians classify water samples using the same settling and light-scattering tests you are using here.",
                icon: "💧",
                color: "border-l-accent-500",
              },
              {
                title: "Preparing for Week 7",
                description:
                  "Next week you move from what dissolves to how much is dissolved — concentration. This task gives you the real examples to reason about.",
                icon: "🧪",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
