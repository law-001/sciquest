// Week 7: Concentration, Acids, Bases and Salts — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 7.
//   Lesson 1 — Concentration of Solutions
//   Lesson 2 — Acids, Bases and Salts

import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week07 = {
  id: "week-7",
  weekNumber: 7,
  title: "Concentration, Acids, Bases and Salts",
  category: "Chemistry",
  description:
    "Calculate and compare the concentration of solutions, then explore acids, bases, the pH scale, and the salts formed when they react.",
  icon: "TestTube",
  color: "primary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Concentration of Solutions
    // ═══════════════════════════════════════════════════
    {
      id: "w07-l1",
      weekId: "week-7",
      lessonNumber: 1,
      title: "Concentration of Solutions",
      badge: "Lesson 1",
      subtitle:
        "Learn what concentration means, how to calculate it, and how diluting a solution changes it without removing a single particle of solute.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "Two beakers side by side showing concentrated and dilute solutions",

      signature: {
        widgetId: "dilution-jar",
        heading: "Watch It: Dilute Without Removing Anything",
        intro:
          "Add water and the colour fades — but count the particles before and after. Not one of them left the jar; they are simply sharing more space, and the % m/m readout falls as it happens.",
        instruction: "Find both routes to dilute, then hit the target",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "Ways to Express Concentration",
        "Concentrated vs. Dilute",
        "Preparing a Diluted Solution",
        "Key Concepts",
        "Real-Life Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Molarity and Solution Concentration",
          url: "https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces",
        },
        {
          label: "Britannica — Concentration (Chemistry)",
          url: "https://www.britannica.com/science/concentration-chemistry",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Concentration</strong> describes how much solute is dissolved in a given amount of solution. A concentrated solution has a lot of solute relative to the solvent; a dilute solution has only a little. Think of the difference between a strong cup of coffee and a weak one.",
              "Scientists express concentration in different ways depending on the situation: <strong class='text-primary-700'>percent by mass</strong> (grams of solute per 100 grams of solution), <strong class='text-primary-700'>percent by volume</strong> (millilitres per 100 mL), and <strong class='text-primary-700'>parts per million (ppm)</strong> for extremely dilute solutions such as pollutants in water.",
              "<strong class='text-primary-700'>Dilution</strong> is the process of lowering concentration by adding more solvent. The amount of solute never changes — only the total volume grows, which spreads the same particles more thinly.",
            ],
            didYouKnow:
              "The safe limit for lead in drinking water is just 10 parts per billion — 0.00000001 grams per gram of water. Instruments sensitive enough to detect that are among the most precise ever built.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Concentration",
                desc: "The amount of solute dissolved in a given quantity of solution. It tells you how strong or weak a solution is.",
              },
              {
                term: "Concentrated",
                desc: "Describing a solution with a relatively large amount of solute dissolved in the solvent.",
              },
              {
                term: "Dilute",
                desc: "Describing a solution with a relatively small amount of solute dissolved in the solvent.",
              },
              {
                term: "Percent by Mass",
                desc: "Concentration expressed as (mass of solute ÷ mass of solution) × 100.",
              },
              {
                term: "Percent by Volume",
                desc: "Concentration expressed as (volume of solute ÷ volume of solution) × 100. Used when both are liquids.",
              },
              {
                term: "Parts per Million (ppm)",
                desc: "A unit for very dilute solutions — one part solute per one million parts of solution. 1 ppm = 1 mg per kg.",
              },
              {
                term: "Dilution",
                desc: "Reducing the concentration of a solution by adding more solvent while keeping the amount of solute the same.",
              },
              {
                term: "Supersaturated",
                desc: "A solution holding more dissolved solute than is normally possible at that temperature — an unstable state.",
              },
              {
                term: "Crystallization",
                desc: "The process by which dissolved solute comes out of solution as solid crystals, often triggered in a supersaturated solution.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Ways to Express Concentration",
          data: {
            cards: [
              {
                title: "Percent by Mass",
                label: "Most Common",
                variant: "primary",
                color: "primary",
                desc: "Calculated as (mass of solute ÷ mass of solution) × 100. Used for solid-in-liquid solutions such as saltwater or sugar solutions.",
                image: equation,
                imageAlt: "Percent by mass formula on paper",
                examples: [
                  "10 g salt in 200 g solution = 5% by mass",
                  "Saline drip: 0.9% sodium chloride",
                  "Seawater: about 3.5% salt by mass",
                ],
              },
              {
                title: "Percent by Volume",
                label: "Liquid in Liquid",
                variant: "secondary",
                color: "secondary",
                desc: "Calculated as (volume of solute ÷ volume of solution) × 100. Used when both substances are liquids, such as alcohol in water.",
                image: simulation,
                imageAlt: "Graduated cylinder measuring liquid volumes",
                examples: [
                  "Rubbing alcohol: 70% isopropanol by volume",
                  "Vinegar: about 5% acetic acid by volume",
                  "Mouthwash: 21.6% alcohol by volume",
                ],
              },
              {
                title: "Parts per Million",
                label: "Trace Amounts",
                variant: "primary",
                color: "primary",
                desc: "Used for extremely dilute solutions where the concentration is far too small to express usefully as a percentage.",
                image: lab,
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
          heading: "Concentrated vs. Dilute",
          data: {
            intro:
              "Concentrated and dilute solutions behave differently and are handled differently. Reading a product label correctly is a genuine safety skill.",
            left: {
              label: "Concentrated Solution",
              color: "primary",
              items: [
                "Large amount of solute per volume of solution",
                "Often darker or more intensely coloured",
                "Stronger effect — taste, smell, or reactivity is pronounced",
                "Frequently must be diluted before it is safe to use",
                "Example: full-strength bleach (5–10% sodium hypochlorite)",
              ],
            },
            right: {
              label: "Dilute Solution",
              color: "secondary",
              items: [
                "Small amount of solute per volume of solution",
                "Usually lighter in colour or nearly colourless",
                "Weaker effect — milder taste, smell, or reactivity",
                "Usually the working strength for everyday use",
                "Example: diluted bleach for surface cleaning (0.5%)",
              ],
            },
          },
        },

        {
          type: "timeline",
          heading: "Preparing a Diluted Solution",
          data: {
            intro:
              "Chemists use the relationship C₁V₁ = C₂V₂, where C is concentration and V is volume, to work out how much to dilute a stock solution. Here is the safe procedure.",
            steps: [
              {
                num: 1,
                title: "Measure the Concentrate",
                color: "primary",
                description:
                  "Use a graduated cylinder or pipette to measure the required volume of concentrated solution. Record the starting concentration (C₁) and volume (V₁) accurately.",
                tip: "Read the bottom of the meniscus at eye level, exactly as you learned in Week 5.",
              },
              {
                num: 2,
                title: "Add Concentrate to the Container",
                color: "secondary",
                description:
                  "Pour the measured concentrate into a clean flask or beaker large enough for the final volume. When working with acid, always add the acid to the water — never water to concentrated acid.",
                tip: "Adding water to concentrated acid can boil and spit violently. Acid into water, always.",
              },
              {
                num: 3,
                title: "Add Solvent Gradually",
                color: "accent",
                description:
                  "Slowly add distilled water while gently swirling, until the volume reaches the target final level (V₂).",
                tip: "Add the last few millilitres drop by drop so you do not overshoot.",
              },
              {
                num: 4,
                title: "Mix Thoroughly",
                color: "primary",
                description:
                  "Seal and invert the flask several times, or stir with a glass rod, until the solution is completely and evenly mixed.",
                tip: "An unmixed dilution has different concentrations at the top and bottom — it is not one solution yet.",
              },
              {
                num: 5,
                title: "Label the Solution",
                color: "secondary",
                description:
                  "Immediately label the container with the solute name, the new concentration (C₂), the volume, the date, and your name.",
                tip: "An unlabelled solution is a safety hazard. Label it before you put it down.",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Key Concepts",
          data: {
            concepts: [
              "Concentration is not the same as solubility — solubility is the maximum that can dissolve, concentration is how much actually is dissolved.",
              "A solution can be dilute even when the solute is highly soluble; it just means less was added.",
              "Percent by mass = (mass of solute ÷ mass of solution) × 100. The mass of solution includes the solute.",
              "Parts per million is used for trace amounts, such as pollutants or minerals in drinking water.",
              "Doubling the amount of solute in the same volume of solvent doubles the concentration.",
              "In dilution the amount of solute stays constant while total volume increases — which is why concentration falls.",
              "C₁V₁ = C₂V₂ lets you calculate exactly how much concentrate and how much water to combine.",
            ],
          },
        },

        {
          type: "scenario",
          heading: "Real-Life Scenarios",
          data: {
            intro:
              "Apply the concentration formula to real situations. Work out the number before reading the answer.",
            scenarios: [
              {
                title: "The Sports Drink",
                situation:
                  "A student mixes 15 g of electrolyte powder into 285 g of water. The total mass of the solution is 300 g.",
                question:
                  "What is the percent by mass concentration of the electrolyte powder?",
                skill:
                  "Percent by mass = (15 ÷ 300) × 100 = 5%. Note the denominator is the mass of the whole solution, not the water alone.",
              },
              {
                title: "Reading the Bleach Label",
                situation:
                  "A bottle of household bleach is labelled '5% sodium hypochlorite'. The safety instructions say to dilute it to 0.5% for surface disinfection.",
                question:
                  "Is the bleach in the bottle concentrated or dilute relative to the working solution? By what factor must it be diluted?",
                skill:
                  "The bottle is concentrated. It must be diluted tenfold — one part bleach to nine parts water — to reach the 0.5% working concentration.",
              },
              {
                title: "Adjusting Fertilizer",
                situation:
                  "A farmer has a liquid fertilizer concentrate labelled '20% nitrogen by mass'. The recommended application concentration is 4% nitrogen.",
                question:
                  "Is the concentrate stronger or weaker than needed? How should the farmer adjust it?",
                skill:
                  "Five times more concentrated than needed. The farmer must dilute it with water before applying, or the excess nitrogen will burn the crop roots.",
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
                title: "IV Drips in Hospitals",
                description:
                  "Medical staff control the concentration of saline and glucose solutions precisely so they match the body's own fluid balance.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Making Drinks from Concentrate",
                description:
                  "Juice concentrates are diluted with water at home or in factories to reach the right flavour strength.",
                icon: "🥤",
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
                title: "Preparing Medicines",
                description:
                  "Pharmacists dilute stock drug solutions to precise concentrations so patients receive the correct dose in a safe volume.",
                icon: "💊",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Acids, Bases and Salts
    // ═══════════════════════════════════════════════════
    {
      id: "w07-l2",
      weekId: "week-7",
      lessonNumber: 2,
      title: "Acids, Bases and Salts",
      badge: "Lesson 2",
      subtitle:
        "Identify acids and bases by their properties, place them on the pH scale, and see how they cancel each other out to form salts and water.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt:
        "Litmus paper tests showing color changes in acid and base solutions",

      signature: {
        widgetId: "titration-drip",
        heading: "Watch It: One Drop from Neutral",
        intro:
          "Open the burette a drop at a time. H⁺ and OH⁻ pair off into water on screen, salt builds on the floor of the flask, and the pH needle crawls for thirty drops before jumping most of the scale on the fortieth.",
        instruction: "Reach pH 7 and make salt — overshooting is allowed",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "Acids vs. Bases",
        "The pH Scale",
        "pH Categories",
        "Neutralization and Salts",
        "Everyday Neutralization",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Acids, Bases, and pH",
          url: "https://www.khanacademy.org/science/biology/water-acids-and-bases",
        },
        {
          label: "Britannica — Acid-Base Reaction",
          url: "https://www.britannica.com/science/acid-base-reaction",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Acids</strong> and <strong class='text-primary-700'>bases</strong> are two families of chemical compounds found everywhere in nature and daily life. Acids taste sour, turn blue litmus paper red, and react with metals to release hydrogen gas. Vinegar, lemon juice, and stomach acid are all acids.",
              "Bases taste bitter and feel slippery. They turn red litmus paper blue and react with fats and oils to form soap. Baking soda, ammonia, and lye are bases. Both acids and bases conduct electricity in water because both form <strong class='text-primary-700'>ions</strong> in solution.",
              "When an acid and a base are mixed they cancel each other out in a reaction called <strong class='text-primary-700'>neutralization</strong>, producing a <strong class='text-primary-700'>salt</strong> and water. That single reaction explains antacid tablets, agricultural lime, and why baking soda cleans an acidic stain.",
            ],
            didYouKnow:
              "Your stomach produces hydrochloric acid with a pH of about 1.5 — strong enough to digest food and kill most bacteria. The stomach lining protects itself with a thick layer of mucus that it constantly replaces.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Acid",
                desc: "A substance that releases hydrogen ions (H⁺) when dissolved in water. Acids taste sour, turn blue litmus red, and have a pH below 7.",
              },
              {
                term: "Base",
                desc: "A substance that releases hydroxide ions (OH⁻) in water. Bases taste bitter, feel slippery, turn red litmus blue, and have a pH above 7.",
              },
              {
                term: "Indicator",
                desc: "A substance that changes colour in the presence of an acid or base, used to identify the nature of a solution.",
              },
              {
                term: "Litmus",
                desc: "A natural dye used as an acid-base indicator — red in acids, blue in bases.",
              },
              {
                term: "pH Scale",
                desc: "A numerical scale from 0 to 14 that measures how acidic or basic a solution is. 7 is neutral.",
              },
              {
                term: "Neutralization",
                desc: "A reaction between an acid and a base that produces a salt and water, reducing both the acidity and the basicity.",
              },
              {
                term: "Salt",
                desc: "An ionic compound formed from the positive ion of a base and the negative ion of an acid during neutralization.",
              },
              {
                term: "Antacid",
                desc: "A basic substance taken to neutralize excess stomach acid and relieve heartburn or indigestion.",
              },
              {
                term: "Corrosive",
                desc: "Able to destroy or damage materials on contact. Strong acids and strong bases are both corrosive.",
              },
              {
                term: "Electrolyte",
                desc: "A substance that conducts electricity when dissolved in water because it forms ions. Both acids and bases are electrolytes.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Acids vs. Bases",
          data: {
            intro:
              "Acids and bases have opposite properties that can be told apart with simple tests. Knowing these differences is essential for handling chemicals safely.",
            left: {
              label: "Acids",
              color: "primary",
              items: [
                "Taste sour (like lemon juice or vinegar)",
                "Turn blue litmus paper red",
                "pH range: 0 to below 7",
                "React with reactive metals to release hydrogen gas",
                "Examples: HCl, H₂SO₄, vinegar, citric acid",
              ],
            },
            right: {
              label: "Bases",
              color: "secondary",
              items: [
                "Taste bitter (like baking soda or soap)",
                "Turn red litmus paper blue",
                "pH range: above 7 to 14",
                "Feel slippery or soapy — they react with skin oils",
                "Examples: NaOH, NH₃, baking soda, bleach",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "The pH Scale",
          data: {
            concepts: [
              "The pH scale runs from 0 (most acidic) to 14 (most basic), with exactly 7 being neutral.",
              "Pure water is neutral, with a pH of exactly 7.0 at 25 °C.",
              "Each step on the scale represents a tenfold change in acidity — pH 2 is ten times more acidic than pH 3, and a hundred times more acidic than pH 4.",
              "Litmus, universal indicator, and phenolphthalein are the common school-laboratory indicators.",
              "Universal indicator runs through a spectrum of colours — red, orange, yellow, green, blue, purple — as pH rises from 0 to 14.",
              "Digital pH meters give a precise numerical reading, while indicators only give a range.",
              "Maintaining the right pH is critical in living things: human blood must stay between 7.35 and 7.45 or life-threatening conditions follow.",
            ],
          },
        },

        {
          type: "imageCards",
          heading: "pH Categories",
          data: {
            cards: [
              {
                title: "Strong Acids",
                label: "pH 0–3",
                variant: "primary",
                color: "primary",
                desc: "Strong acids have a very low pH and are highly corrosive. They release large numbers of hydrogen ions in solution.",
                image: equation,
                imageAlt: "Red litmus paper indicating strong acid",
                examples: [
                  "Battery acid (H₂SO₄): pH ≈ 0–1",
                  "Stomach acid (HCl): pH ≈ 1.5–2",
                  "Lemon juice (citric acid): pH ≈ 2–3",
                ],
              },
              {
                title: "Neutral Substances",
                label: "pH 6–8",
                variant: "secondary",
                color: "secondary",
                desc: "Neutral or near-neutral substances sit close to pH 7 and are generally safe to handle. Pure water is the reference point.",
                image: lab,
                imageAlt: "Clear water in a beaker representing neutral pH",
                examples: [
                  "Pure water: pH = 7.0",
                  "Blood: pH ≈ 7.35–7.45",
                  "Human saliva: pH ≈ 6.5–7.5",
                ],
              },
              {
                title: "Strong Bases",
                label: "pH 11–14",
                variant: "primary",
                color: "primary",
                desc: "Strong bases have a very high pH and are also corrosive. They release large numbers of hydroxide ions in solution.",
                image: simulation,
                imageAlt: "Blue litmus paper indicating strong base",
                examples: [
                  "Ammonia solution: pH ≈ 11–12",
                  "Bleach (sodium hypochlorite): pH ≈ 12–13",
                  "Drain cleaner (NaOH): pH ≈ 13–14",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Neutralization and Salts",
          data: {
            intro:
              "The general equation is Acid + Base → Salt + Water. Here is what actually happens at the particle level when hydrochloric acid reacts with sodium hydroxide.",
            steps: [
              {
                num: 1,
                title: "Mix the Acid and Base",
                color: "primary",
                description:
                  "Measured volumes of hydrochloric acid (HCl) and sodium hydroxide (NaOH) are combined in a beaker. The mixture now contains H⁺, Cl⁻, Na⁺, and OH⁻ ions all moving freely in the water.",
                tip: "Add slowly — neutralization releases heat, and a fast mix can become hot enough to matter.",
              },
              {
                num: 2,
                title: "Ions Combine",
                color: "secondary",
                description:
                  "The positively charged hydrogen ions (H⁺) from the acid are attracted to the negatively charged hydroxide ions (OH⁻) from the base. The Na⁺ and Cl⁻ ions take no part in this step.",
                tip: "H⁺ meeting OH⁻ is the whole reaction. Everything else is a spectator.",
              },
              {
                num: 3,
                title: "Water Forms",
                color: "accent",
                description:
                  "Each pair of H⁺ and OH⁻ ions joins to form a molecule of water (H₂O). As they are used up, the solution becomes less acidic and less basic, moving toward pH 7.",
                tip: "Forming water is what drives the reaction forward.",
              },
              {
                num: 4,
                title: "Salt Remains in Solution",
                color: "primary",
                description:
                  "The Na⁺ and Cl⁻ ions, untouched by the reaction, remain dissolved. Together they are sodium chloride (NaCl) — ordinary table salt — dissolved in the water that was just formed.",
                tip: "Evaporate the water afterwards and solid salt crystals are left behind.",
              },
              {
                num: 5,
                title: "Test with an Indicator",
                color: "secondary",
                description:
                  "Add a few drops of universal indicator to confirm neutralization is complete. Green (universal indicator) or no colour change (litmus) means the solution is neutral.",
                tip: "If the indicator still shows acid or base, add small amounts of the opposite substance until it turns green.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Everyday Neutralization",
          data: {
            intro:
              "Neutralization reactions happen all around you. For each scenario, name the reaction and identify the products.",
            scenarios: [
              {
                title: "Antacid for Heartburn",
                situation:
                  "A person has heartburn after eating spicy food — their stomach has produced too much HCl. They chew an antacid tablet containing calcium carbonate (CaCO₃).",
                question:
                  "What type of reaction occurs, and what are the products?",
                skill:
                  "Neutralization — the basic calcium carbonate reacts with the excess HCl to form calcium chloride (a salt), water, and carbon dioxide gas, relieving the acidity.",
              },
              {
                title: "Treating Soil Acidity",
                situation:
                  "A farmer tests the soil and finds a pH of 4.5 — too acidic for vegetables. The farmer spreads powdered agricultural lime (calcium oxide, CaO) over the field.",
                question:
                  "How does adding lime change the soil, and what type of reaction is it?",
                skill:
                  "Lime is a base that neutralizes the excess acid in the soil, raising the pH into the range crops need — neutralization applied to agriculture.",
              },
              {
                title: "Cleaning with Baking Soda",
                situation:
                  "To remove a stain caused by fruit juice (a mild acid), a student sprinkles baking soda (NaHCO₃) on it and adds a few drops of water before scrubbing.",
                question:
                  "Why does baking soda help remove an acidic stain? What is formed?",
                skill:
                  "Baking soda is a mild base that neutralizes the acid in the stain, breaking it into salt, water, and CO₂ gas — which is the fizzing you see — making it easy to wash away.",
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
                title: "Digestive System",
                description:
                  "Stomach acid breaks down food and kills pathogens. The small intestine then releases a basic solution to neutralize it before nutrients are absorbed.",
                icon: "🫁",
                color: "border-l-primary-500",
              },
              {
                title: "Soil pH for Farming",
                description:
                  "Most crops grow best in slightly acidic soil (pH 6–7). Farmers add lime to raise pH or sulfur to lower it, tuning the soil to the crop.",
                icon: "🌾",
                color: "border-l-secondary-500",
              },
              {
                title: "Swimming Pool Management",
                description:
                  "Pool water is held at pH 7.2–7.6. Below 7 it stings swimmers' eyes; above 7.8 the chlorine stops working properly.",
                icon: "🏊",
                color: "border-l-accent-500",
              },
              {
                title: "Food Preservation",
                description:
                  "Pickling uses acidic vinegar to drop the pH of food to a level where bacteria cannot grow, preserving it for months.",
                icon: "🥒",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
