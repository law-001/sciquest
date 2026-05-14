// Week 7: Concentration of Solutions — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import globe from "../assets/globe.jpg";
import web from "../assets/web.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";
import classroom from "../assets/classroom.webp";
import modernclassroom from "../assets/modernclassroom.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week07 = {
  id: "week-7",
  weekNumber: 7,
  title: "Concentration of Solutions",
  category: "Chemistry",
  description:
    "Understand how to describe and calculate the concentration of solutions, and learn about dilution.",
  icon: "TestTube",
  color: "primary",
  xpReward: 225,
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 19 — What is Concentration?
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-19",
      weekId: "week-7",
      lessonNumber: 19,
      title: "What is Concentration?",
      badge: "Lesson 19",
      subtitle:
        "Learn what concentration means, how it is expressed, and how concentrated and dilute solutions differ.",
      readTime: "~12 min read",
      xp: 75,
      heroImage: lab,
      heroImageAlt:
        "Two beakers side by side showing concentrated and dilute solutions",

      sections: ["Overview", "Key Terms", "Key Concepts", "Applications"],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Concentration</strong> describes how much solute is dissolved in a given amount of solution. A concentrated solution has a large amount of solute relative to the solvent, while a dilute solution has only a small amount of solute. Think of the difference between a strong cup of coffee and a weak one.",
              "Scientists express concentration in different ways depending on the situation. Common methods include <strong class='text-primary-700'>percent by mass</strong> (grams of solute per 100 grams of solution), <strong class='text-primary-700'>percent by volume</strong> (millilitres of solute per 100 mL of solution), and <strong class='text-primary-700'>parts per million (ppm)</strong> for extremely dilute solutions like pollutants in water.",
            ],
            didYouKnow:
              "The safe limit for lead in drinking water is just 10 parts per billion — that is 0.00000001 grams per gram of water. Scientists use incredibly sensitive instruments to measure concentrations this small!",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Concentration",
                desc: "The amount of solute dissolved in a given quantity of solution. It tells us how strong or weak a solution is.",
              },
              {
                term: "Concentrated",
                desc: "Describing a solution that has a relatively large amount of solute dissolved in the solvent.",
              },
              {
                term: "Dilute",
                desc: "Describing a solution that has a relatively small amount of solute dissolved in the solvent.",
              },
              {
                term: "Percent by Mass",
                desc: "A way to express concentration as the mass of solute divided by the mass of solution, multiplied by 100%.",
              },
              {
                term: "Parts per Million (ppm)",
                desc: "A unit of concentration used for very dilute solutions, equal to one part of solute per one million parts of solution.",
              },
              {
                term: "Solute",
                desc: "The substance dissolved in a solution, present in the smaller amount.",
              },
              {
                term: "Solution",
                desc: "A homogeneous mixture of solute and solvent in which the solute is evenly distributed throughout.",
              },
            ],
          },
        },
        {
          type: "conceptList",
          heading: "Key Concepts",
          data: {
            concepts: [
              "Concentration is not the same as solubility — solubility is the maximum amount that can dissolve, while concentration describes the actual amount dissolved.",
              "A solution can be dilute even if the solute is highly soluble — it just means less solute was added.",
              "Percent by mass is calculated as: (mass of solute ÷ mass of solution) × 100.",
              "Percent by volume is used when both solute and solvent are liquids, such as alcohol in water.",
              "Parts per million is used for trace amounts — for example, measuring pollutants or minerals in drinking water.",
              "Doubling the amount of solute in the same volume of solvent doubles the concentration.",
            ],
          },
        },
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "IV Drips in Hospitals",
                description:
                  "Medical staff carefully control the concentration of saline or glucose solutions in IV drips to match the body's natural fluid balance.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Fertilizer Mixing",
                description:
                  "Farmers dilute concentrated liquid fertilizers to the correct percentage before applying them to crops to avoid burning plant roots.",
                icon: "🌱",
                color: "border-l-secondary-500",
              },
              {
                title: "Water Quality Standards",
                description:
                  "Environmental agencies measure pollutants in rivers and tap water in parts per million or billion to enforce safety limits.",
                icon: "🚰",
                color: "border-l-accent-500",
              },
              {
                title: "Food Flavoring",
                description:
                  "Food scientists adjust the concentration of flavoring compounds, salt, and sugar to achieve the exact taste profile required in packaged foods.",
                icon: "🧂",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 20 — Measuring and Calculating Concentration
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-20",
      weekId: "week-7",
      lessonNumber: 20,
      title: "Measuring and Calculating Concentration",
      badge: "Lesson 20",
      subtitle:
        "Practice calculating concentration using the percent by mass formula and learn to read concentration labels on everyday products.",
      readTime: "~12 min read",
      xp: 75,
      heroImage: equation,
      heroImageAlt: "Concentration formula written on a whiteboard",

      sections: [
        "Overview",
        "Types of Concentration",
        "Concentrated vs Dilute",
        "Real-Life Scenarios",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Calculating concentration is an essential chemistry skill. The most common formula is <strong class='text-primary-700'>percent by mass = (mass of solute ÷ mass of solution) × 100</strong>. For example, dissolving 10 g of salt in 190 g of water gives a solution with a total mass of 200 g and a concentration of 5% by mass.",
              "In everyday life, concentration values appear on product labels — bleach bottles, medicine packaging, sports drinks, and fertilizer bags all display concentration information. Understanding these numbers helps you use products safely and effectively.",
            ],
            didYouKnow:
              "Seawater has a salt concentration of about 3.5% by mass — that means there are 35 grams of dissolved salts in every kilogram of seawater!",
          },
        },
        {
          type: "imageCards",
          heading: "Types of Concentration",
          data: {
            cards: [
              {
                title: "Percent by Mass",
                label: "Most Common",
                variant: "primary",
                color: "primary",
                desc: "Calculated as (mass of solute ÷ mass of solution) × 100. Used for solid-liquid solutions such as saltwater or sugar solutions.",
                image: equation,
                imageAlt: "Percent by mass formula on paper",
                examples: [
                  "10 g salt in 200 g solution = 5% by mass",
                  "Saline drip: 0.9% sodium chloride solution",
                  "Seawater: approximately 3.5% salt by mass",
                ],
              },
              {
                title: "Percent by Volume",
                label: "Liquid-Liquid",
                variant: "secondary",
                color: "secondary",
                desc: "Calculated as (volume of solute ÷ volume of solution) × 100. Used when both substances are liquids, such as alcohol in water.",
                image: simulation,
                imageAlt: "Graduated cylinder measuring liquid volumes",
                examples: [
                  "Rubbing alcohol: 70% isopropanol by volume",
                  "Wine: approximately 12% ethanol by volume",
                  "Mouthwash: 21.6% alcohol by volume",
                ],
              },
              {
                title: "Parts per Million",
                label: "Trace Amounts",
                variant: "primary",
                color: "primary",
                desc: "Used for extremely dilute solutions where concentrations are very small. 1 ppm = 1 mg of solute per 1 kg of solution.",
                image: web,
                imageAlt: "Water quality testing equipment",
                examples: [
                  "Chlorine in swimming pools: 1–3 ppm",
                  "Fluoride in drinking water: 0.7 ppm",
                  "Mercury in fish: regulated below 1 ppm",
                ],
              },
            ],
          },
        },
        {
          type: "comparison",
          heading: "Concentrated vs Dilute",
          data: {
            intro:
              "Concentrated and dilute solutions have different physical properties and uses. Comparing them helps you make safe decisions when handling chemical products.",
            left: {
              label: "Concentrated Solution",
              color: "primary",
              items: [
                "Large amount of solute per volume of solution",
                "Often darker in color or more intensely colored",
                "Stronger effect — taste, smell, or reactivity is pronounced",
                "May taste very salty, sweet, or bitter depending on solute",
                "Example: Full-strength bleach (5–10% sodium hypochlorite)",
              ],
            },
            right: {
              label: "Dilute Solution",
              color: "secondary",
              items: [
                "Small amount of solute per volume of solution",
                "Usually lighter in color or nearly colorless",
                "Weaker effect — milder taste, smell, or reactivity",
                "Closer to the taste or smell of pure solvent",
                "Example: Diluted bleach used for surface cleaning (0.5%)",
              ],
            },
          },
        },
        {
          type: "scenario",
          heading: "Real-Life Scenarios",
          data: {
            intro:
              "Let's apply the concentration formula to real situations. Read each scenario and determine the concentration or appropriate action.",
            scenarios: [
              {
                title: "The Sports Drink",
                situation:
                  "A student mixes 15 g of electrolyte powder into 285 g of water to make a sports drink. The total mass of the solution is 300 g.",
                question:
                  "What is the percent by mass concentration of the electrolyte powder in the sports drink?",
                skill:
                  "Percent by mass = (15 ÷ 300) × 100 = 5%. The sports drink is a 5% electrolyte solution.",
              },
              {
                title: "Reading the Bleach Label",
                situation:
                  "A bottle of household bleach is labeled '5% sodium hypochlorite.' The safety instructions say to dilute it to 0.5% for surface disinfection.",
                question:
                  "Is the bleach in the bottle concentrated or dilute relative to the recommended cleaning solution?",
                skill:
                  "The bottle contains concentrated bleach (5%) that must be diluted tenfold to reach the safe working concentration of 0.5% for everyday use.",
              },
              {
                title: "Adjusting Fertilizer",
                situation:
                  "A farmer has a liquid fertilizer concentrate labeled '20% nitrogen by mass.' The recommended application concentration is 4% nitrogen.",
                question:
                  "Is the concentrate more or less concentrated than the working solution? How should the farmer adjust it?",
                skill:
                  "The concentrate (20%) is five times more concentrated than needed (4%). The farmer must dilute it with water before applying it to avoid damaging the crops.",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 21 — Dilution and Saturated Solutions
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-21",
      weekId: "week-7",
      lessonNumber: 21,
      title: "Dilution and Saturated Solutions",
      badge: "Lesson 21",
      subtitle:
        "Understand how dilution reduces concentration and explore the fascinating behavior of supersaturated solutions.",
      readTime: "~12 min read",
      xp: 75,
      heroImage: flowchart,
      heroImageAlt:
        "Diagram showing dilution process from concentrated to dilute solution",

      sections: [
        "Overview",
        "Key Terms",
        "Preparing a Diluted Solution",
        "Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Dilution</strong> is the process of reducing the concentration of a solution by adding more solvent. The amount of solute stays the same — only the volume of the solution increases. Chemists use the relationship <strong class='text-primary-700'>C₁V₁ = C₂V₂</strong>, where C is concentration and V is volume, to calculate how much to dilute a solution.",
              "A <strong class='text-primary-700'>supersaturated solution</strong> is one that contains more dissolved solute than it normally would at that temperature. This is achieved by dissolving the solute in hot solvent and then cooling it slowly without disturbing it. Supersaturated solutions are unstable — any disturbance can cause rapid <strong class='text-primary-700'>crystallization</strong>.",
            ],
            didYouKnow:
              "Rock candy is made from a supersaturated sugar solution! When a string is placed in the solution and left undisturbed, sugar crystals slowly grow on it as the solution crystallizes.",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Dilution",
                desc: "The process of reducing the concentration of a solution by adding more solvent while keeping the amount of solute the same.",
              },
              {
                term: "Supersaturated",
                desc: "Describing a solution that contains more dissolved solute than is normally possible at that temperature — an unstable state.",
              },
              {
                term: "Crystallization",
                desc: "The process by which dissolved solute comes out of solution to form solid crystals, often triggered in a supersaturated solution.",
              },
              {
                term: "Recrystallization",
                desc: "A purification technique where a substance is dissolved in hot solvent and then allowed to crystallize as the solution cools.",
              },
              {
                term: "Saturated",
                desc: "Describing a solution that has dissolved the maximum amount of solute possible at a given temperature.",
              },
              {
                term: "Concentration",
                desc: "The amount of solute dissolved per unit volume or mass of solution, often expressed as percent by mass or ppm.",
              },
            ],
          },
        },
        {
          type: "timeline",
          heading: "Preparing a Diluted Solution",
          data: {
            intro:
              "Follow these steps to safely dilute a concentrated solution in the laboratory. Dilution is used whenever a stock solution is too concentrated for practical use.",
            steps: [
              {
                num: 1,
                title: "Measure the Concentrate",
                color: "primary",
                description:
                  "Use a graduated cylinder or pipette to measure the required volume of the concentrated solution. Record the concentration (C₁) and volume (V₁) accurately.",
                tip: "Always read the bottom of the meniscus at eye level when using a graduated cylinder.",
              },
              {
                num: 2,
                title: "Add Concentrate to Container",
                color: "secondary",
                description:
                  "Pour the measured concentrate into a clean volumetric flask or beaker of the appropriate size for your final volume. Never add water to concentrated acid — always add acid to water.",
                tip: "For safety with acids, always add the concentrated solution to the water, not the other way around.",
              },
              {
                num: 3,
                title: "Add Solvent Gradually",
                color: "accent",
                description:
                  "Slowly add distilled water (or the appropriate solvent) to the flask while gently swirling. Continue until the volume reaches the desired final level (V₂).",
                tip: "Add solvent in small amounts near the end to avoid overshooting the target volume.",
              },
              {
                num: 4,
                title: "Mix Thoroughly",
                color: "primary",
                description:
                  "Seal the flask and invert it several times, or stir with a glass rod, to ensure the solution is completely and evenly mixed.",
                tip: "Mixing is essential — an unmixed dilution will have uneven concentration throughout.",
              },
              {
                num: 5,
                title: "Label the Solution",
                color: "secondary",
                description:
                  "Immediately label the container with the solute name, the new concentration (C₂), the volume, the date, and the preparer's name. Store appropriately.",
                tip: "An unlabeled solution is a safety hazard — always label before storing.",
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
                title: "Preparing Medicines",
                description:
                  "Pharmacists dilute stock solutions of drugs to precise concentrations to ensure patients receive the correct dose in a safe volume.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "Diluting Bleach Safely",
                description:
                  "Household bleach must be diluted before use on surfaces to reduce its concentration to a safe and effective level for disinfection.",
                icon: "🧹",
                color: "border-l-secondary-500",
              },
              {
                title: "Making Drinks from Concentrate",
                description:
                  "Juice concentrates are diluted with water at home or in factories to produce beverages at the correct flavor strength and sweetness.",
                icon: "🥤",
                color: "border-l-accent-500",
              },
              {
                title: "Chemistry Labs",
                description:
                  "Students and researchers routinely dilute stock solutions to create working solutions of the specific concentrations needed for experiments.",
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
