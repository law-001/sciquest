// Week 8: Acids, Bases, and Salts — Grade 7 Science

import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week08 = {
  id: "week-8",
  weekNumber: 8,
  title: "Acids, Bases, and Salts",
  category: "Chemistry",
  description:
    "Explore the properties of acids and bases, understand the pH scale, and learn about neutralization reactions.",
  icon: "FlaskRound",
  color: "secondary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 22 — Properties of Acids and Bases
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-22",
      weekId: "week-8",
      lessonNumber: 22,
      title: "Properties of Acids and Bases",
      badge: "Lesson 22",
      subtitle:
        "Learn to identify acids and bases by their physical properties and how they behave in chemical reactions.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "Litmus paper tests showing color changes in acid and base solutions",

      sections: ["Overview", "Key Terms", "Acids vs Bases", "Applications"],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Acids</strong> and <strong class='text-primary-700'>bases</strong> are two important classes of chemical compounds found everywhere in nature and daily life. Acids taste sour, turn blue litmus paper red, and react with metals to release hydrogen gas. Common acids include vinegar (acetic acid), lemon juice (citric acid), and stomach acid (hydrochloric acid).",
              "Bases taste bitter and feel slippery to the touch. They turn red litmus paper blue and react with fats and oils to form soap — a process called saponification. Common bases include baking soda (sodium bicarbonate), ammonia, and lye (sodium hydroxide). Both acids and bases conduct electricity when dissolved in water because they form <strong class='text-primary-700'>ions</strong> in solution.",
            ],
            didYouKnow:
              "The stomach produces hydrochloric acid (HCl) with a pH of about 1.5 — strong enough to digest food and kill most bacteria, yet the stomach lining protects itself with a thick layer of mucus!",
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
                term: "Litmus",
                desc: "A natural dye used as an acid-base indicator. It turns red in acids and blue in bases.",
              },
              {
                term: "Indicator",
                desc: "A substance that changes color in the presence of an acid or base, used to identify the nature of a solution.",
              },
              {
                term: "Corrosive",
                desc: "Able to destroy or damage materials on contact. Strong acids and bases are corrosive and can cause chemical burns.",
              },
              {
                term: "Electrolyte",
                desc: "A substance that conducts electricity when dissolved in water because it forms ions in solution. Both acids and bases are electrolytes.",
              },
              {
                term: "Hydroxide",
                desc: "The OH⁻ ion released by bases in solution. The hydroxide ion is responsible for the basic properties of a solution.",
              },
              {
                term: "Hydrogen Ion",
                desc: "The H⁺ ion released by acids in solution. The hydrogen ion concentration determines how acidic a solution is.",
              },
            ],
          },
        },
        {
          type: "comparison",
          heading: "Acids vs Bases",
          data: {
            intro:
              "Acids and bases have opposite properties that can be identified through simple tests. Knowing these differences is essential for safely handling chemical substances.",
            left: {
              label: "Acids",
              color: "primary",
              items: [
                "Taste sour (like lemon juice or vinegar)",
                "Turn blue litmus paper red",
                "pH range: 0 to below 7",
                "Feel corrosive — can damage skin and surfaces",
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
                "Feel slippery or soapy to the touch",
                "Examples: NaOH, NH₃, baking soda, bleach",
              ],
            },
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
                  "Stomach acid (HCl, pH ≈ 1.5) breaks down food and kills pathogens. The small intestine uses a basic solution to neutralize the acid before absorption.",
                icon: "🫁",
                color: "border-l-primary-500",
              },
              {
                title: "Cleaning Products",
                description:
                  "Many cleaners are basic — bleach and ammonia-based cleaners remove grease and stains because bases react with oils and fats.",
                icon: "🧽",
                color: "border-l-secondary-500",
              },
              {
                title: "Battery Acid",
                description:
                  "Car batteries contain sulfuric acid (H₂SO₄), a strong acid that drives the chemical reactions that generate electrical current.",
                icon: "🔋",
                color: "border-l-accent-500",
              },
              {
                title: "Baking with Baking Soda",
                description:
                  "Baking soda (a base) reacts with acidic ingredients like buttermilk or vinegar to release CO₂ gas, which makes bread and cakes rise.",
                icon: "🍞",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 23 — The pH Scale
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-23",
      weekId: "week-8",
      lessonNumber: 23,
      title: "The pH Scale",
      badge: "Lesson 23",
      subtitle:
        "Understand the pH scale and use chemical indicators to classify everyday substances as acids, bases, or neutral.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "pH scale chart showing colors from red (acid) to purple (base)",

      sections: ["Overview", "pH Categories", "Key Ideas", "Applications"],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>pH scale</strong> is a numerical scale from 0 to 14 that measures how acidic or basic a solution is. A pH of 7 is neutral — this is the pH of pure water. Values below 7 indicate an acid (the lower the number, the stronger the acid), while values above 7 indicate a base (the higher the number, the stronger the base).",
              "Scientists use <strong class='text-primary-700'>indicators</strong> to determine pH. Litmus paper turns red in acid and blue in base. Universal indicator produces a range of colors across the entire pH scale. Phenolphthalein is colorless in acid and turns pink in base. Digital pH meters give precise readings to two decimal places.",
            ],
            didYouKnow:
              "Each step on the pH scale represents a tenfold change in acidity. So pH 2 is ten times more acidic than pH 3, and a hundred times more acidic than pH 4!",
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
                desc: "Neutral or near-neutral substances have a pH close to 7 and are safe to handle. Pure water is the reference point for neutrality.",
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
                  "Bleach (sodium hypochlorite): pH ≈ 12–13",
                  "Drain cleaner (NaOH): pH ≈ 13–14",
                  "Ammonia solution: pH ≈ 11–12",
                ],
              },
            ],
          },
        },
        {
          type: "conceptList",
          heading: "Key Ideas",
          data: {
            concepts: [
              "The pH scale runs from 0 (most acidic) to 14 (most basic), with 7 being exactly neutral.",
              "Each pH unit represents a tenfold difference in the concentration of hydrogen ions.",
              "Pure water is neutral with a pH of exactly 7.0 at 25°C.",
              "Litmus, universal indicator, and phenolphthalein are common chemical indicators used in school laboratories.",
              "A universal indicator changes through a spectrum of colors (red → orange → yellow → green → blue → purple) as pH increases from 0 to 14.",
              "Maintaining the correct pH is critical in biological systems — human blood must stay between pH 7.35 and 7.45 or life-threatening conditions can occur.",
            ],
          },
        },
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Swimming Pool Management",
                description:
                  "Pool water must be maintained at pH 7.2–7.6. If it drops below 7, acid irritates swimmers' eyes; if it rises above 7.8, chlorine becomes less effective.",
                icon: "🏊",
                color: "border-l-primary-500",
              },
              {
                title: "Soil pH for Farming",
                description:
                  "Most crops grow best in slightly acidic soil (pH 6–7). Farmers test and adjust soil pH by adding lime (raises pH) or sulfur (lowers pH) to maximize yields.",
                icon: "🌾",
                color: "border-l-secondary-500",
              },
              {
                title: "Blood pH Regulation",
                description:
                  "The body uses buffer systems to keep blood pH between 7.35 and 7.45. A shift outside this range causes acidosis or alkalosis, both of which are medical emergencies.",
                icon: "🩸",
                color: "border-l-accent-500",
              },
              {
                title: "Food Preservation",
                description:
                  "Pickling uses acidic vinegar (pH ≈ 2–3) to lower the pH of food to levels where bacteria cannot grow, preserving the food for months.",
                icon: "🥒",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 24 — Neutralization and Salts
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-24",
      weekId: "week-8",
      lessonNumber: 24,
      title: "Neutralization and Salts",
      badge: "Lesson 24",
      subtitle:
        "Learn how acids and bases react to form salts and water, and explore where neutralization reactions occur in everyday life.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: equation,
      heroImageAlt:
        "Chemical equation showing acid plus base yields salt plus water",

      sections: [
        "Overview",
        "Key Terms",
        "Steps of Neutralization",
        "Everyday Neutralization",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Neutralization</strong> is a chemical reaction in which an acid and a base react together to form a salt and water. The general equation is: Acid + Base → Salt + Water. A classic example is hydrochloric acid reacting with sodium hydroxide: HCl + NaOH → NaCl + H₂O, producing table salt and water.",
              "<strong class='text-primary-700'>Salts</strong> are ionic compounds formed from the positive ion of a base and the negative ion of an acid. Table salt (NaCl) is the most familiar example, but there are many others: calcium carbonate (CaCO₃, found in chalk and shells), potassium nitrate (KNO₃, used in fertilizers), and magnesium sulfate (MgSO₄, Epsom salt).",
            ],
            didYouKnow:
              "Antacids work by neutralizing excess stomach acid. The active ingredients — like calcium carbonate or magnesium hydroxide — are bases that react with HCl to form harmless salts and water, relieving heartburn.",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Neutralization",
                desc: "A chemical reaction between an acid and a base that produces a salt and water, reducing the acidity or basicity of both.",
              },
              {
                term: "Salt",
                desc: "An ionic compound formed from the positive ion of a base and the negative ion of an acid during a neutralization reaction.",
              },
              {
                term: "Ionic Compound",
                desc: "A compound formed from positively and negatively charged ions held together by electrostatic attraction.",
              },
              {
                term: "Antacid",
                desc: "A basic substance taken to neutralize excess stomach acid and relieve symptoms of heartburn or indigestion.",
              },
              {
                term: "Reaction",
                desc: "A chemical process in which substances (reactants) are transformed into new substances (products) with different properties.",
              },
              {
                term: "Product",
                desc: "A substance formed as a result of a chemical reaction — in neutralization, the products are always a salt and water.",
              },
              {
                term: "Reactant",
                desc: "A substance that enters into and is altered during a chemical reaction. In neutralization, the reactants are an acid and a base.",
              },
            ],
          },
        },
        {
          type: "timeline",
          heading: "Steps of Neutralization",
          data: {
            intro:
              "A neutralization reaction happens step by step as acid and base solutions are mixed. Here is what happens at the particle level when HCl reacts with NaOH.",
            steps: [
              {
                num: 1,
                title: "Mix the Acid and Base",
                color: "primary",
                description:
                  "Equal volumes of hydrochloric acid (HCl) and sodium hydroxide (NaOH) are carefully measured and poured together into a beaker. The solution initially contains H⁺, Cl⁻, Na⁺, and OH⁻ ions all moving freely.",
                tip: "Always add acid to base slowly to control the reaction and prevent heat build-up.",
              },
              {
                num: 2,
                title: "Ions Combine",
                color: "secondary",
                description:
                  "The positively charged hydrogen ions (H⁺) from the acid are attracted to the negatively charged hydroxide ions (OH⁻) from the base and combine with them. The Na⁺ and Cl⁻ ions remain separate in solution.",
                tip: "The H⁺ and OH⁻ ions neutralize each other — this is the core of the neutralization reaction.",
              },
              {
                num: 3,
                title: "Water Forms",
                color: "accent",
                description:
                  "Each pair of H⁺ and OH⁻ ions combines to form a molecule of water (H₂O). As this happens, the solution becomes less acidic and less basic — it moves toward neutral pH 7.",
                tip: "The formation of water is the driving force of a neutralization reaction.",
              },
              {
                num: 4,
                title: "Salt Remains in Solution",
                color: "primary",
                description:
                  "The Na⁺ ions and Cl⁻ ions, which were not directly involved in the reaction, remain in solution. Together they form sodium chloride (NaCl) — common table salt dissolved in water.",
                tip: "If you evaporate the water afterward, solid salt crystals will be left behind.",
              },
              {
                num: 5,
                title: "Test with Indicator",
                color: "secondary",
                description:
                  "Adding a few drops of universal indicator or litmus to the final solution confirms that neutralization is complete. A green color (universal indicator) or no color change (litmus) indicates a neutral solution.",
                tip: "If the indicator still shows acid or base, adjust by adding small amounts of the opposite substance.",
              },
            ],
          },
        },
        {
          type: "scenario",
          heading: "Everyday Neutralization",
          data: {
            intro:
              "Neutralization reactions happen all around us. Recognizing them helps you understand how chemistry solves practical problems in health and agriculture.",
            scenarios: [
              {
                title: "Antacid for Heartburn",
                situation:
                  "A person experiences heartburn after eating spicy food. Their stomach has produced too much HCl, causing a burning sensation in the esophagus. They take a chewable antacid tablet containing calcium carbonate (CaCO₃).",
                question:
                  "What type of chemical reaction is occurring? What are the products?",
                skill:
                  "Neutralization — the basic calcium carbonate reacts with excess HCl to form calcium chloride (a salt), water, and carbon dioxide gas, relieving the acidity.",
              },
              {
                title: "Treating Soil Acidity",
                situation:
                  "A farmer tests the soil and finds it has a pH of 4.5 — too acidic for growing vegetables. The farmer spreads powdered agricultural lime (calcium oxide, CaO) over the field.",
                question:
                  "How does adding lime change the soil? What type of reaction is this?",
                skill:
                  "Lime is a base that neutralizes the excess acid in the soil, raising the pH to a range suitable for plant growth — this is neutralization applied to agriculture.",
              },
              {
                title: "Cleaning with Baking Soda",
                situation:
                  "To remove a stubborn stain caused by a mild acid (like fruit juice), a student sprinkles baking soda (NaHCO₃) on the stain and adds a few drops of water before scrubbing.",
                question:
                  "Why does the baking soda help remove the acidic stain? What products are formed?",
                skill:
                  "Baking soda is a mild base that neutralizes the acid in the stain, breaking it down into salt, water, and CO₂ gas, making it easier to wash away.",
              },
            ],
          },
        },
      ],
    },
  ],
};
