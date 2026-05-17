// Week 6: Solutions and Solubility — Grade 7 Science

import web from "../assets/web.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week06 = {
  id: "week-6",
  weekNumber: 6,
  title: "Solutions and Solubility",
  category: "Chemistry",
  description:
    "Learn about mixtures, solutions, and the factors that affect how substances dissolve.",
  icon: "Droplets",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 16 — Mixtures and Solutions
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-16",
      weekId: "week-6",
      lessonNumber: 16,
      title: "Mixtures and Solutions",
      badge: "Lesson 16",
      subtitle:
        "Understand the difference between pure substances and mixtures, and learn how solutions are formed.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt: "Laboratory glassware with colorful solutions",

      sections: ["Overview", "Key Terms", "Types of Mixtures", "Applications"],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Matter can be classified as either a <strong class='text-primary-700'>pure substance</strong> or a <strong class='text-primary-700'>mixture</strong>. A pure substance has a fixed composition throughout — it is always the same, like pure water or pure gold. A mixture, on the other hand, is made up of two or more substances combined but not chemically joined.",
              "When one substance dissolves completely into another, we call the result a <strong class='text-primary-700'>solution</strong>. In a solution, the <strong class='text-primary-700'>solute</strong> is the substance that dissolves, and the <strong class='text-primary-700'>solvent</strong> is the substance that does the dissolving. For example, in saltwater, salt is the solute and water is the solvent.",
            ],
            didYouKnow:
              "Air is actually a mixture of gases — mostly nitrogen (78%) and oxygen (21%) — making it a homogeneous mixture, or solution, of gases!",
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
                desc: "The substance that is dissolved in a solution. It is usually present in a smaller amount (e.g., salt in saltwater).",
              },
              {
                term: "Solvent",
                desc: "The substance that does the dissolving in a solution. It is usually present in a larger amount (e.g., water in saltwater).",
              },
              {
                term: "Homogeneous",
                desc: "Having a uniform composition throughout — the same at every point. All solutions are homogeneous mixtures.",
              },
              {
                term: "Heterogeneous",
                desc: "Having a non-uniform composition — the components can be visibly distinguished from one another, like sand and water.",
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
                desc: "A solution is a homogeneous mixture where the solute dissolves completely and evenly in the solvent. The particles are too small to be seen.",
                image: lab,
                imageAlt: "Clear saltwater solution in a beaker",
                examples: [
                  "Saltwater (salt dissolved in water)",
                  "Air (mixture of gases)",
                  "Alloys like brass (copper and zinc)",
                ],
              },
              {
                title: "Suspensions",
                label: "Heterogeneous",
                variant: "secondary",
                color: "secondary",
                desc: "In a suspension, larger particles are mixed in a liquid but do not dissolve. The particles will eventually settle to the bottom if left undisturbed.",
                image: simulation,
                imageAlt: "Muddy water suspension",
                examples: [
                  "Muddy water (soil particles in water)",
                  "Blood (cells suspended in plasma)",
                  "Salad dressing (oil and vinegar with spices)",
                ],
              },
              {
                title: "Colloids",
                label: "Intermediate",
                variant: "primary",
                color: "primary",
                desc: "A colloid contains medium-sized particles that are dispersed throughout but do not settle. The particles scatter light (Tyndall effect).",
                image: web,
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
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Drinking Water Treatment",
                description:
                  "Water treatment plants use filtration and chemical solutions to remove impurities and produce clean, safe drinking water.",
                icon: "💧",
                color: "border-l-primary-500",
              },
              {
                title: "Medicine Preparation",
                description:
                  "Many medicines are solutions — the active ingredient (solute) is dissolved in water or alcohol (solvent) for easy dosing and absorption.",
                icon: "💊",
                color: "border-l-secondary-500",
              },
              {
                title: "Food Industry",
                description:
                  "Cooks and food scientists use solutions every day — from dissolving sugar in beverages to creating emulsions like mayonnaise.",
                icon: "🍽️",
                color: "border-l-accent-500",
              },
              {
                title: "Cleaning Products",
                description:
                  "Detergents and soaps are solutions designed to dissolve dirt and grease, making them effective cleaning agents.",
                icon: "🧴",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 17 — Solubility
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-17",
      weekId: "week-6",
      lessonNumber: 17,
      title: "Solubility",
      badge: "Lesson 17",
      subtitle:
        "Explore what solubility means, what affects it, and how we classify solutions by how much solute they contain.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: equation,
      heroImageAlt: "Graph showing solubility curves for different substances",

      sections: [
        "Overview",
        "Factors Affecting Solubility",
        "Key Concepts",
        "Saturated vs Unsaturated",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Solubility</strong> is the maximum amount of solute that can dissolve in a given amount of solvent at a specific temperature. Once that maximum is reached, no more solute will dissolve and the solution is said to be saturated.",
              "A key rule in chemistry is <strong class='text-primary-700'>'like dissolves like'</strong> — polar solvents (like water) dissolve polar solutes (like salt and sugar), while non-polar solvents (like oil) dissolve non-polar solutes (like grease and wax). This explains why oil and water do not mix.",
            ],
            didYouKnow:
              "At 20°C, you can dissolve about 36 grams of table salt in 100 mL of water. If you add more, it just sinks to the bottom — the water is saturated!",
          },
        },
        {
          type: "reasonCards",
          heading: "Factors Affecting Solubility",
          data: {
            intro:
              "Several factors influence how much solute can dissolve in a solvent. Understanding these factors helps chemists and engineers control solutions in industry and medicine.",
            reasons: [
              {
                num: 1,
                title: "Temperature (Solids)",
                color: "primary",
                desc: "Higher temperature increases solubility of most solids",
                content:
                  "e.g. More sugar dissolves in hot tea than in iced tea",
              },
              {
                num: 2,
                title: "Temperature (Gases)",
                color: "secondary",
                desc: "Higher temperature decreases solubility of gases",
                content:
                  "e.g. Warm soda goes flat faster because CO₂ escapes more easily",
              },
              {
                num: 3,
                title: "Pressure (Gases)",
                color: "accent",
                desc: "Higher pressure increases solubility of gases in liquids",
                content:
                  "e.g. Carbonated drinks are sealed under pressure to keep CO₂ dissolved",
              },
              {
                num: 4,
                title: "Nature of the Solute",
                color: "primary",
                desc: "Polar solutes dissolve in polar solvents",
                content: "e.g. Salt (ionic) dissolves in water; wax does not",
              },
              {
                num: 5,
                title: "Nature of the Solvent",
                color: "secondary",
                desc: "The type of solvent determines what can dissolve in it",
                content: "e.g. Grease dissolves in acetone but not in water",
              },
            ],
          },
        },
        {
          type: "conceptList",
          heading: "Key Concepts",
          data: {
            concepts: [
              "Solubility is always measured at a specific temperature because temperature changes the maximum amount that can dissolve.",
              "A saturated solution contains the maximum amount of dissolved solute at a given temperature.",
              "An unsaturated solution has less solute dissolved than the maximum — more solute can still be added.",
              "A supersaturated solution contains more dissolved solute than normally possible at that temperature — it is unstable and can crystallize suddenly.",
              "The 'like dissolves like' rule means polar solvents dissolve polar solutes and non-polar solvents dissolve non-polar solutes.",
              "Solubility curves on a graph show how the solubility of a substance changes with temperature.",
            ],
          },
        },
        {
          type: "comparison",
          heading: "Saturated vs Unsaturated",
          data: {
            intro:
              "Knowing whether a solution is saturated or unsaturated is important in chemistry, cooking, and industry. Here is how the two types compare.",
            left: {
              label: "Saturated Solution",
              color: "primary",
              items: [
                "Contains the maximum amount of dissolved solute",
                "No more solute can dissolve at that temperature",
                "Excess solute remains undissolved at the bottom",
                "Adding heat can convert it to unsaturated",
                "Example: Saltwater at its dissolving limit",
              ],
            },
            right: {
              label: "Unsaturated Solution",
              color: "secondary",
              items: [
                "Contains less solute than the maximum possible",
                "More solute can still be added and dissolved",
                "Solution appears clear with no undissolved residue",
                "Can become saturated by adding more solute",
                "Example: Lightly salted water",
              ],
            },
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 18 — Factors Affecting the Rate of Dissolving
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-18",
      weekId: "week-6",
      lessonNumber: 18,
      title: "Factors Affecting the Rate of Dissolving",
      badge: "Lesson 18",
      subtitle:
        "Discover how stirring, temperature, and particle size control how quickly a substance dissolves.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Student stirring a solution in a beaker during a lab activity",

      sections: [
        "Overview",
        "Key Terms",
        "Lab Experiment Steps",
        "Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>rate of dissolving</strong> describes how quickly a solute dissolves in a solvent. This is different from solubility — solubility tells us the maximum amount that can dissolve, while the rate tells us how fast it happens.",
              "Three main factors affect the rate of dissolving: <strong class='text-primary-700'>stirring or agitation</strong> (moves fresh solvent into contact with solute), <strong class='text-primary-700'>temperature</strong> (increases the kinetic energy of particles, causing more frequent collisions), and <strong class='text-primary-700'>particle size</strong> (smaller particles have more surface area exposed to the solvent).",
            ],
            didYouKnow:
              "Powdered sugar dissolves much faster than a sugar cube, even though both contain the same amount of sugar. The powder has far more surface area exposed to water!",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Rate of Dissolving",
                desc: "How quickly a solute dissolves in a solvent, measured by how fast the solute disappears from the mixture.",
              },
              {
                term: "Surface Area",
                desc: "The total area of a substance exposed to the solvent. Smaller particles have greater surface area, leading to faster dissolving.",
              },
              {
                term: "Agitation",
                desc: "Stirring or shaking a mixture to bring fresh solvent into contact with undissolved solute, increasing the rate of dissolving.",
              },
              {
                term: "Temperature",
                desc: "A measure of how much thermal energy the particles in a substance have. Higher temperatures generally increase the rate of dissolving.",
              },
              {
                term: "Particle Size",
                desc: "The physical size of the solute pieces. Crushing or grinding a solid into smaller pieces increases the rate of dissolving.",
              },
              {
                term: "Kinetic Energy",
                desc: "The energy of motion possessed by particles. Higher temperature means higher kinetic energy and more frequent, energetic collisions between particles.",
              },
            ],
          },
        },
        {
          type: "timeline",
          heading: "Lab Experiment Steps",
          data: {
            intro:
              "In this lab activity, we compare how quickly a sugar cube and powdered sugar dissolve under different conditions to see how the three factors affect the rate of dissolving.",
            steps: [
              {
                num: 1,
                title: "Prepare Your Materials",
                color: "primary",
                description:
                  "Gather four beakers of equal amounts of water. Label them A, B, C, and D. Prepare a sugar cube for beakers A and B, and an equal mass of powdered sugar for beakers C and D.",
                tip: "Make sure you use the same amount of sugar by mass in each beaker for a fair test.",
              },
              {
                num: 2,
                title: "Test Temperature Effect",
                color: "secondary",
                description:
                  "Use cold water in beaker A and hot water in beaker B. Add one sugar cube to each and observe without stirring. Record how long it takes for each cube to fully dissolve.",
                tip: "Use a stopwatch to measure the dissolving time accurately.",
              },
              {
                num: 3,
                title: "Test Particle Size Effect",
                color: "accent",
                description:
                  "Add a sugar cube to beaker C and powdered sugar to beaker D, both with room-temperature water. Do not stir either. Compare how quickly each dissolves.",
                tip: "The powder will dissolve noticeably faster — observe the bottom of the beaker.",
              },
              {
                num: 4,
                title: "Test Stirring Effect",
                color: "primary",
                description:
                  "Add powdered sugar to two beakers of room-temperature water. Stir one continuously and leave the other undisturbed. Time how long each takes to dissolve.",
                tip: "Stir at a steady, consistent pace for a reliable comparison.",
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
                title: "Making Drinks",
                description:
                  "We stir sugar into hot drinks because heat and agitation both speed up dissolving, making drinks taste sweeter faster.",
                icon: "☕",
                color: "border-l-primary-500",
              },
              {
                title: "Effervescent Medicine Tablets",
                description:
                  "Tablets that dissolve in water are designed with fine particles to maximize surface area and ensure rapid dissolving for quick drug absorption.",
                icon: "💊",
                color: "border-l-secondary-500",
              },
              {
                title: "Food Processing",
                description:
                  "Food manufacturers control temperature and mixing speed to dissolve ingredients at the right rate during production of products like candy and soft drinks.",
                icon: "🏭",
                color: "border-l-accent-500",
              },
              {
                title: "Laundry Detergent",
                description:
                  "Powdered detergent is ground finely to increase surface area, helping it dissolve quickly in wash water for effective cleaning.",
                icon: "🫧",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
