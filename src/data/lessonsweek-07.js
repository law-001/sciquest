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
    "Tell solutions apart by how much solute they hold and compute their concentration. Then test household items with litmus to sort acids, bases and salts, and learn to handle them safely.",
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
        "Name a solution by how much solute it holds, compute its concentration in percent, and see how temperature and other factors change how much can dissolve.",
      readTime: "~20 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "Two glasses of juice side by side, one dark and strong and one pale and watery",

      signature: {
        widgetId: "dilution-jar",
        heading: "Watch It: Dilute Without Removing Anything",
        intro: "Water goes in, particles stay. The color fades anyway.",
        instruction: "Find both routes to dilute, then hit the target.",
        xp: 25,
        explainer: {
          title: "Why the color faded",
          points: [
            "Adding water never removed a particle. The same count spread through more liquid, so the color thinned out.",
            "The % m/m reading fell because the total mass underneath the fraction grew while the solute stayed put.",
            "Pouring half away did remove particles. Topping back up gave the same volume with half the solute in it.",
          ],
        },
      },

      sections: [
        "Overview",
        "Types of Solutions",
        "Dilute vs. Concentrated",
        "Computing Concentration",
        "Practice Problems",
        "Factors That Affect Solubility",
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
          label: "Britannica — Concentration (Chemistry)",
          url: "https://www.britannica.com/science/concentration-chemistry",
        },
        {
          label: "CK-12 — Saturated and Unsaturated Solutions",
          url: "https://www.ck12.org/c/chemistry/saturated-and-unsaturated-solutions/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Your Lola makes calamansi juice for the family. She squeezes ten calamansi into one glass of water and adds two spoonfuls of sugar. Your little brother makes his with one calamansi and a whole pitcher of water. Both are calamansi juice, but one is sour and strong, and the other tastes almost like plain water. The difference is <strong class='text-primary-700'>concentration</strong>.",
              "<strong class='text-primary-700'>Concentration</strong> tells how much solute is dissolved in a certain amount of solution. A solution with a lot of solute is <strong class='text-primary-700'>concentrated</strong>. A solution with only a little solute is <strong class='text-primary-700'>dilute</strong>.",
              "We can also name a solution by how close it is to its limit. An <strong class='text-primary-700'>unsaturated</strong> solution can still dissolve more solute. A <strong class='text-primary-700'>saturated</strong> solution has dissolved all it can. A <strong class='text-primary-700'>supersaturated</strong> solution holds even more than it normally can, but only for a while.",
              "Scientists do not stop at words like \"strong\" or \"weak.\" They use numbers such as <strong class='text-primary-700'>percent by mass</strong> and <strong class='text-primary-700'>percent by volume</strong>. Reading these numbers on labels is part of being <strong class='text-primary-700'>responsible</strong>: a cleaning product that is too concentrated can hurt you, and one that is too dilute will not work.",
            ],
            didYouKnow:
              "About 200 g of table sugar can dissolve in 100 mL of water at room temperature, but only about 36 g of table salt can. In hot water, sugar's limit more than doubles, while salt's limit barely changes.",
          },
        },

        {
          type: "imageCards",
          heading: "Types of Solutions",
          data: {
            cards: [
              {
                title: "Unsaturated",
                label: "Room for More",
                variant: "primary",
                color: "primary",
                desc: "The solvent can still dissolve more solute. Add another spoonful and it disappears when you stir.",
                image: equation,
                imageAlt:
                  "A spoonful of sugar dissolving completely in a clear glass of water, with no sugar left at the bottom",
                examples: [
                  "One spoon of sugar in a glass of water",
                  "Lightly salted water for washing vegetables",
                  "Iced tea that can still take more sugar",
                ],
              },
              {
                title: "Saturated",
                label: "Full",
                variant: "secondary",
                color: "secondary",
                desc: "The solvent has dissolved all the solute it can at that temperature. Any extra solute settles at the bottom no matter how long you stir.",
                image: simulation,
                imageAlt:
                  "A glass of water with undissolved salt crystals resting on the bottom",
                examples: [
                  "Salt piling up at the bottom of a glass of brine",
                  "Sugar that won't dissolve in cold juice",
                  "Seawater left to evaporate in a salt bed",
                ],
              },
              {
                title: "Supersaturated",
                label: "Over the Limit",
                variant: "accent",
                color: "accent",
                desc: "Very hot water dissolves a lot of sugar. If the syrup cools slowly without being disturbed, it can keep more sugar dissolved than cold water normally holds. One small crystal or a shake makes the extra sugar come out as crystals.",
                image: lab,
                imageAlt:
                  "Sugar crystals (rock candy) growing on a string hanging in a jar of thick syrup",
                examples: [
                  "Rock candy grown from cooled sugar syrup",
                  "Thick syrup that turns grainy after standing",
                  "Reusable heat packs that harden when clicked",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Dilute vs. Concentrated",
          data: {
            intro:
              "Dilute and concentrated describe how much solute a solution has compared with others. They are comparing words, so always ask: \"compared with what?\"",
            left: {
              label: "Dilute",
              color: "secondary",
              items: [
                "Little solute for the amount of solvent",
                "Usually lighter in color and milder in taste or smell",
                "Made by adding more water to a solution",
                "Example: calamansi juice made with one fruit in a pitcher",
                "Example: bleach mixed with water before cleaning",
              ],
            },
            right: {
              label: "Concentrated",
              color: "primary",
              items: [
                "A lot of solute for the amount of solvent",
                "Usually darker in color and stronger in taste or smell",
                "Made by adding more solute or letting some water evaporate",
                "Example: arnibal, the thick brown-sugar syrup in taho",
                "Example: bleach straight from the bottle",
              ],
            },
          },
        },

        {
          type: "timeline",
          heading: "Computing Concentration",
          data: {
            intro:
              "Percent concentration tells how many parts of solute are in every 100 parts of solution. Follow these steps every time.",
            steps: [
              {
                num: 1,
                title: "Identify the Solute and Solvent",
                color: "primary",
                description:
                  "Decide what is being dissolved (solute) and what does the dissolving (solvent). In salt water, salt is the solute and water is the solvent.",
                tip: "Solid solute? Use percent by mass. Liquid solute? Use percent by volume.",
              },
              {
                num: 2,
                title: "Find the Amount of Solution",
                color: "secondary",
                description:
                  "Add the solute and solvent together. If 15 g of salt is dissolved in 135 g of water, the solution has a mass of 15 g + 135 g = 150 g.",
                tip: "The most common mistake is dividing by the solvent alone. Divide by the whole solution.",
              },
              {
                num: 3,
                title: "Percent by Mass",
                color: "accent",
                description:
                  "Percent by mass = (mass of solute ÷ mass of solution) × 100%. For the salt water: (15 g ÷ 150 g) × 100% = 10%. Every 100 g of this solution contains 10 g of salt.",
                tip: "Use a balance and record masses in grams.",
              },
              {
                num: 4,
                title: "Percent by Volume",
                color: "primary",
                description:
                  "Percent by volume = (volume of solute ÷ volume of solution) × 100%. Rubbing alcohol labeled 70% has 70 mL of alcohol in every 100 mL of solution.",
                tip: "Measure liquids in milliliters with a graduated cylinder, reading the bottom of the meniscus.",
              },
              {
                num: 5,
                title: "Work Backward from a Label",
                color: "secondary",
                description:
                  "A 1,000 mL bottle of vinegar labeled 5% acidity has 5 ÷ 100 × 1,000 mL = 50 mL of acetic acid. The rest is water.",
                tip: "Always write the unit with the answer: g, mL or %.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Practice Problems",
          data: {
            intro:
              "Work out each answer on paper first, then check the model answer.",
            scenarios: [
              {
                title: "Sweet Gulaman Drink",
                situation:
                  "Mia dissolves 25 g of sugar in 225 g of water to make the syrup for her sago't gulaman.",
                question: "What is the percent by mass of sugar in the syrup?",
                skill:
                  "Mass of solution = 25 g + 225 g = 250 g. Percent by mass = (25 g ÷ 250 g) × 100% = 10% sugar.",
              },
              {
                title: "Calamansi Juice",
                situation:
                  "Paolo mixes 20 mL of pure calamansi juice with enough water to make 250 mL of drink.",
                question:
                  "What is the percent by volume of calamansi juice in the drink?",
                skill:
                  "Percent by volume = (20 mL ÷ 250 mL) × 100% = 8% calamansi juice.",
              },
              {
                title: "Which Is Sweeter?",
                situation:
                  "Ana dissolves 10 g of sugar to make 100 g of solution. Ben dissolves 15 g of sugar to make 200 g of solution.",
                question:
                  "Ben used more sugar. Is his drink more concentrated?",
                skill:
                  "No. Ana's is (10 ÷ 100) × 100% = 10%, while Ben's is (15 ÷ 200) × 100% = 7.5%. Ana's drink is more concentrated, because concentration depends on the amount of solute compared with the whole solution, not on the solute alone.",
              },
              {
                title: "Is It Saturated?",
                situation:
                  "Jun keeps adding salt to a glass of water and stirring. After the fifth spoonful, salt stays at the bottom no matter how long he stirs.",
                question:
                  "What type of solution does Jun have now, and how could he dissolve the leftover salt?",
                skill:
                  "It is a saturated solution, since it can't dissolve any more salt at that temperature. Adding more water would dissolve the leftover salt. Heating helps only a little, because salt's solubility barely changes with temperature.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Factors That Affect Solubility",
          data: {
            intro:
              "Solubility is the most solute that can dissolve in a given amount of solvent. These factors change that limit. Each one comes with a simple demonstration you can try with your teacher.",
            reasons: [
              {
                num: 1,
                title: "Temperature (Solids)",
                color: "primary",
                desc: "Most solids dissolve more in hot water",
                content:
                  "Stir sugar into 100 mL of cold water until no more dissolves, then do the same with 100 mL of hot water and count the spoonfuls. The hot water takes far more. Hot water particles move faster and pull sugar particles apart more easily. Salt is an exception: its limit barely changes.",
              },
              {
                num: 2,
                title: "Temperature (Gases)",
                color: "secondary",
                desc: "Gases dissolve less in warm liquids",
                content:
                  "Open one cold and one warm bottle of soft drink over a basin. The warm one fizzes more, because warm liquid can hold less carbon dioxide. This is also why fish in warm, still water, like fish cages in hot summer months, can run short of dissolved oxygen.",
              },
              {
                num: 3,
                title: "Nature of Solute and Solvent",
                color: "accent",
                desc: "\"Like dissolves like\"",
                content:
                  "Stir cooking oil into water and it floats in a layer, while salt in the same water disappears. Water dissolves substances similar to it, like salt and sugar, but not oils. Oil stains come out with soap or a solvent similar to oil.",
              },
              {
                num: 4,
                title: "Pressure (Gases)",
                color: "primary",
                desc: "More pressure, more dissolved gas",
                content:
                  "Soft drinks are bottled under high pressure to force extra carbon dioxide into the liquid. When you open the cap, the pressure drops and bubbles rush out. Pressure has almost no effect on solids dissolving in liquids.",
              },
              {
                num: 5,
                title: "Stirring and Particle Size",
                color: "secondary",
                desc: "Faster, but not more",
                content:
                  "Stirring, or crushing a sugar cube into fine grains, makes the solute dissolve faster. It does not raise the limit. A saturated solution stays saturated however long you stir it.",
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
        "Sort household and school solutions into acids, bases and salts using litmus paper, and learn to use, store and throw away these products safely.",
      readTime: "~20 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt:
        "Strips of red and blue litmus paper dipped in vinegar and soapy water, showing their color changes",

      signature: {
        widgetId: "titration-drip",
        heading: "Watch It: One Drop from Neutral",
        intro: "One drop at a time, acid turns into salt and water.",
        instruction: "Reach pH 7, then add one drop too many.",
        xp: 25,
        explainer: {
          title: "Why the pH jumped at the end",
          points: [
            "Each drop paired an H⁺ with an OH⁻. Both vanished and left plain water behind.",
            "The white crystals on the flask floor were the salt, sodium chloride, left by that swap.",
            "The needle crawled while acid was still spare, then jumped once the last H⁺ was gone.",
            "One drop past neutral turned the flask pink, because the base was in charge now.",
          ],
        },
      },

      sections: [
        "Overview",
        "Acids vs. Bases",
        "Testing with Litmus Paper",
        "Acid, Base or Salt? Items at Home and School",
        "Classify It",
        "Safe Use, Storage and Disposal",
      ],

      references: [
        {
          label: "Britannica — Acid",
          url: "https://www.britannica.com/science/acid",
        },
        {
          label: "Britannica — Base (Chemistry)",
          url: "https://www.britannica.com/science/base-chemistry",
        },
        {
          label: "Britannica — Litmus",
          url: "https://www.britannica.com/science/litmus",
        },
        {
          label: "Britannica — pH",
          url: "https://www.britannica.com/science/pH",
        },
        {
          label: "Khan Academy — Acids, Bases, and pH",
          url: "https://www.khanacademy.org/science/biology/water-acids-and-bases",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Look around your kitchen. Sukang Iloko, calamansi and tomatoes taste sour. Bar soap like Safeguard feels slippery and tastes bitter if it gets in your mouth. These everyday things belong to two big groups of substances: <strong class='text-primary-700'>acids</strong> and <strong class='text-primary-700'>bases</strong>.",
              "You can't safely tell them apart by tasting or touching. Instead, scientists use an <strong class='text-primary-700'>indicator</strong>, a substance that changes color in an acid or a base. The most common one in school is <strong class='text-primary-700'>litmus paper</strong>, which comes in blue and red strips.",
              "When an acid and a base react, they cancel each other out and form a <strong class='text-primary-700'>salt</strong> and water. Many salt solutions, like table salt dissolved in water, are neutral: they are neither acidic nor basic.",
              "Many household cleaners are strong acids or bases. Muriatic acid for cleaning toilets and drain cleaner (sosa) can burn skin. Being <strong class='text-primary-700'>responsible</strong> means reading labels, wearing gloves, storing them properly and never mixing them.",
            ],
            didYouKnow:
              "Litmus is a natural dye that comes from lichens, small living things made of a fungus and an alga growing together. People have used it to test for acids for hundreds of years.",
          },
        },

        {
          type: "comparison",
          heading: "Acids vs. Bases",
          data: {
            intro:
              "Acids and bases have opposite properties. On the pH scale (0 to 14), acids are below 7, neutral is 7 and bases are above 7. When an acid and a base react, they neutralize each other and form a salt and water. Never taste or touch lab samples. The tastes listed here are only what you may already know from food and soap.",
            left: {
              label: "Acids",
              color: "primary",
              items: [
                "Taste sour, like calamansi, vinegar and green mango",
                "Turn blue litmus paper red",
                "pH below 7",
                "React with some metals, like zinc, and give off hydrogen gas",
                "Home examples: vinegar, calamansi juice, soft drinks, tomato juice, muriatic acid",
              ],
            },
            right: {
              label: "Bases",
              color: "secondary",
              items: [
                "Taste bitter, like soap",
                "Feel slippery or soapy",
                "Turn red litmus paper blue",
                "pH above 7",
                "Home examples: baking soda solution, bar soap, bleach (Zonrox), drain cleaner (sosa), antacids",
              ],
            },
          },
        },

        {
          type: "imageCards",
          heading: "Testing with Litmus Paper",
          data: {
            cards: [
              {
                title: "In an Acid",
                label: "Blue → Red",
                variant: "primary",
                color: "primary",
                desc: "Dip a blue litmus strip in an acid and it turns red. A red strip stays red. One color change is enough to tell you it is an acid.",
                image: equation,
                imageAlt:
                  "A blue litmus strip turning red after being dipped in a cup of vinegar",
                examples: [
                  "Vinegar: blue litmus turns red",
                  "Calamansi juice: blue litmus turns red",
                  "Soft drink: blue litmus turns red",
                ],
              },
              {
                title: "In a Base",
                label: "Red → Blue",
                variant: "secondary",
                color: "secondary",
                desc: "Dip a red litmus strip in a base and it turns blue. A blue strip stays blue.",
                image: simulation,
                imageAlt:
                  "A red litmus strip turning blue after being dipped in soapy water",
                examples: [
                  "Soap solution: red litmus turns blue",
                  "Baking soda solution: red litmus turns blue",
                  "Antacid dissolved in water: red litmus turns blue",
                ],
              },
              {
                title: "In a Neutral Solution",
                label: "No Change",
                variant: "accent",
                color: "accent",
                desc: "In a neutral solution, neither strip changes. Blue stays blue and red stays red. Many salt solutions behave this way.",
                image: lab,
                imageAlt:
                  "Red and blue litmus strips beside a glass of salt water, both keeping their original colors",
                examples: [
                  "Table salt dissolved in water",
                  "Sugar dissolved in water",
                  "Distilled water",
                ],
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Acid, Base or Salt? Items at Home and School",
          data: {
            cards: [
              {
                title: "Kitchen Acids",
                label: "Acidic",
                variant: "primary",
                color: "primary",
                desc: "Sour foods and drinks are acidic. They turn blue litmus red.",
                image: flowchart,
                imageAlt:
                  "Calamansi, a bottle of cane vinegar, tomatoes and a soft drink on a kitchen table",
                examples: [
                  "Vinegar (sukang Iloko, sukang maasim)",
                  "Calamansi and lemon juice",
                  "Tomatoes, green mangoes, soft drinks",
                ],
              },
              {
                title: "Cleaning Bases",
                label: "Basic",
                variant: "secondary",
                color: "secondary",
                desc: "Soaps and many cleaners are basic. They turn red litmus blue. The strongest ones are corrosive.",
                image: lab,
                imageAlt:
                  "A bar of soap, a box of baking soda and a bottle of bleach on a laundry shelf",
                examples: [
                  "Bar soap and laundry soap",
                  "Baking soda dissolved in water",
                  "Bleach (Zonrox) and drain cleaner (sosa), which are strong",
                ],
              },
              {
                title: "Neutral Salts and Liquids",
                label: "Neutral",
                variant: "accent",
                color: "accent",
                desc: "These do not change either litmus paper.",
                image: equation,
                imageAlt:
                  "A glass of clear water and a small bowl of rock salt",
                examples: [
                  "Table salt (rock salt) dissolved in water",
                  "Distilled water",
                  "Sugar water",
                ],
              },
              {
                title: "At School",
                label: "Mixed",
                variant: "primary",
                color: "primary",
                desc: "School has acids and bases too. Some are safe; others are for adults only.",
                image: simulation,
                imageAlt:
                  "A school janitor's cart holding labeled bottles of muriatic acid and liquid hand soap",
                examples: [
                  "Hand soap at the sink (basic)",
                  "Muriatic acid for cleaning toilets (strong acid, adults only)",
                  "Lab bottles of dilute acids and bases (teacher only)",
                ],
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Classify It",
          data: {
            intro:
              "Use the litmus results to decide whether each solution is an acid, a base, or neutral.",
            scenarios: [
              {
                title: "Mystery Cup A",
                situation:
                  "Blue litmus paper dipped in Cup A turns red. Red litmus stays red.",
                question: "Is Cup A an acid, a base, or neutral?",
                skill:
                  "Cup A is an acid, because acids turn blue litmus red. It could be vinegar or calamansi juice.",
              },
              {
                title: "Mystery Cup B",
                situation:
                  "Red litmus paper dipped in Cup B turns blue. Blue litmus stays blue.",
                question: "Is Cup B an acid, a base, or neutral?",
                skill:
                  "Cup B is a base, because bases turn red litmus blue. It could be soap solution or baking soda solution.",
              },
              {
                title: "Mystery Cup C",
                situation:
                  "Neither the red nor the blue litmus paper changes color in Cup C.",
                question: "What can you conclude about Cup C?",
                skill:
                  "Cup C is neutral. It could be water, sugar water, or a neutral salt solution like table salt dissolved in water.",
              },
              {
                title: "Only One Strip",
                situation:
                  "A student has only red litmus paper. It stays red when dipped in a sample.",
                question: "Can the student say for sure that the sample is an acid?",
                skill:
                  "No. Red litmus stays red in both acids and neutral solutions. The student needs blue litmus too: if blue turns red, it is an acid; if blue stays blue, it is neutral.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Safe Use, Storage and Disposal",
          data: {
            intro:
              "Strong acids and bases at home, like muriatic acid, bleach and drain cleaner, can burn skin, damage eyes and give off harmful fumes. Follow these rules every time.",
            reasons: [
              {
                num: 1,
                title: "Read the Label First",
                color: "primary",
                desc: "Know what it is and how to use it",
                content:
                  "Look for warning words and symbols, and follow the directions on how much to use and how much water to mix in. Use the product only for what the label says.",
              },
              {
                num: 2,
                title: "Protect Yourself",
                color: "secondary",
                desc: "Gloves, open windows, no splashing",
                content:
                  "Wear rubber gloves and, if possible, eye protection. Open windows or use a fan so fumes don't build up. Pour slowly and keep your face away from the opening.",
              },
              {
                num: 3,
                title: "Never Mix Cleaners",
                color: "accent",
                desc: "Some mixtures make poisonous gas",
                content:
                  "Mixing bleach (Zonrox) with an acid such as muriatic acid or vinegar gives off chlorine gas. Mixing bleach with ammonia cleaners also makes toxic fumes. Use one product, rinse, then use another.",
              },
              {
                num: 4,
                title: "Store Them Safely",
                color: "primary",
                desc: "Original bottle, tightly closed, out of reach",
                content:
                  "Keep products in their original labeled containers, never in soft-drink or water bottles, where someone could drink them by mistake. Store them high up or locked away from children, and away from food.",
              },
              {
                num: 5,
                title: "Dispose of Them Properly",
                color: "secondary",
                desc: "Follow the label; never dump them outside",
                content:
                  "Small amounts of diluted household cleaners can usually go down the toilet or sink with plenty of running water, if the label allows it. Never pour them into canals, rivers or the ground, and never pour two different products into the drain at the same time.",
              },
              {
                num: 6,
                title: "Know What to Do in an Accident",
                color: "accent",
                desc: "Rinse with water and get help",
                content:
                  "If an acid or base touches your skin or eyes, rinse with plenty of clean running water for at least 15 minutes and tell an adult right away. If someone swallows one, call for help immediately (dial 911) and bring the container so the doctor knows what it was.",
              },
            ],
          },
        },

      ],
    },
  ],
};
