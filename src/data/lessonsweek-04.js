// Week 4: Changes in the State of Matter — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 4.
//   Lesson 1 — Changes in the State of Matter in Terms of Particle Arrangement
//   (FIRST SUMMATIVE TEST)

import lesson7hero from "../assets/week3/lesson7hero.jpg";
import solid from "../assets/week2/solid.webp";
import liquid from "../assets/week2/liquid.jpg";
import gas from "../assets/week2/gas.jpg";
import lesson8hero from "../assets/week3/lesson8hero.jpg";
import lesson9hero from "../assets/week3/lesson9hero.jpg";

export const week04 = {
  id: "week-4",
  weekNumber: 4,
  title: "Changes in the State of Matter",
  category: "Matter",
  description:
    "Describe how particles are arranged in solids, liquids, and gases, and explain every change of state by what happens to the particles and their energy. Covered by the First Summative Test.",
  icon: "Thermometer",
  color: "primary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Changes in the State of Matter in Terms of Particle Arrangement
    // ═══════════════════════════════════════════════════
    {
      id: "w04-l1",
      weekId: "week-4",
      lessonNumber: 1,
      title: "Changes in the State of Matter in Terms of Particle Arrangement",
      badge: "Lesson 1",
      subtitle:
        "See how particles are packed in solids, liquids, and gases, then follow them as they gain or lose energy during melting, freezing, evaporation, boiling, condensation, sublimation, and deposition.",
      readTime: "~22 min read",
      xp: 100,
      heroImage: lesson7hero,
      heroImageAlt:
        "A pot of water boiling on a stove, with bubbles rising through the water and steam above it",

      signature: {
        widgetId: "heating-curve",
        heading: "Watch It: The Plateau Appears",
        intro:
          "Heat goes in at a steady rate while the graph draws itself.",
        instruction: "Hold the heat button and watch the line.",
        xp: 25,
        explainer: {
          title: "Why the line went flat",
          points: [
            "While the line climbed, the heat was making particles move faster, so the thermometer rose.",
            "On each flat part the heat kept going in, but it went into pulling particles apart instead.",
            "Cooling followed the same line backwards, so freezing gave back exactly what melting took.",
            "With the pump on, the solid went straight to gas and the liquid stage never happened.",
          ],
        },
      },

      sections: [
        "Introduction",
        "How Particles Are Arranged",
        "Heating and Cooling",
        "Changes of State Around You",
        "Evaporation vs. Boiling",
        "Real-World Scenarios",
      ],

      references: [
        {
          label: "CK-12 — States of Matter",
          url: "https://www.ck12.org/c/physical-science/states-of-matter",
        },
        {
          label: "Khan Academy — States of Matter",
          url: "https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces/states-of-matter/v/states-of-matter",
        },
        {
          label: "Britannica — Phase (Matter)",
          url: "https://www.britannica.com/science/phase-state-of-matter",
        },
        {
          label: "Britannica — Sublimation (Phase Change)",
          url: "https://www.britannica.com/science/sublimation-phase-change",
        },
        {
          label: "PAGASA — Climate of the Philippines",
          url: "https://www.pagasa.dost.gov.ph/information/climate-philippines",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Imagine a sealed box with three things inside: a marble, some water in a bottle, and an inflated balloon. Without opening it, how would you describe each one? The marble keeps its shape. The water takes the shape of its bottle. The air fills the whole balloon. These are the three common states of matter: <strong class='text-primary-700'>solid, liquid, and gas</strong>.",
              "Scientists explain these states with the <strong class='text-primary-700'>particle model of matter</strong>. All matter is made of tiny particles that are always moving and that attract each other. What makes a solid different from a liquid or a gas is <strong class='text-primary-700'>how close the particles are, how they are arranged, and how much they move</strong>.",
              "When you heat matter, its particles <strong class='text-primary-700'>gain energy</strong> and move faster. When you cool it, they <strong class='text-primary-700'>lose energy</strong> and slow down. Enough of either one changes the state. This is why ice in your halo-halo melts and why water in a pot of sinaing turns to steam.",
              "Changes that <strong class='text-primary-700'>absorb</strong> heat are called <strong class='text-primary-700'>endothermic</strong>: melting, evaporation, boiling and sublimation. Changes that <strong class='text-primary-700'>release</strong> heat are called <strong class='text-primary-700'>exothermic</strong>: freezing, condensation and deposition. Pure water melts and freezes at 0 °C and boils at 100 °C at sea level.",
              "Matter in all its forms keeps us alive: water to drink, air to breathe, and LPG to cook our food. Showing <strong class='text-primary-700'>respect</strong> for matter means using it responsibly, like turning off the stove when the rice is done and not leaving the faucet running.",
            ],
            didYouKnow:
              "In Baguio City, about 1,500 meters above sea level, water boils at around 95 °C instead of 100 °C. The air pressure is lower up there, so the water particles escape more easily.",
          },
        },

        {
          type: "imageCards",
          heading: "How Particles Are Arranged",
          data: {
            cards: [
              {
                title: "Solid",
                label: "Fixed shape",
                variant: "primary",
                color: "primary",
                desc: "Particles are packed very closely in a regular, fixed pattern. They cannot move from place to place. They only vibrate where they are. This is why a solid keeps its own shape and volume.",
                image: solid,
                imageAlt: "Clear ice cubes piled together, each keeping its own cube shape",
                examples: [
                  "Arrangement: close together, in an orderly pattern",
                  "Motion: vibrate in fixed positions",
                  "Ice, a coin, a block of wood",
                ],
              },
              {
                title: "Liquid",
                label: "Takes the container's shape",
                variant: "secondary",
                color: "secondary",
                desc: "Particles are still close together, but they are not in a fixed pattern. They slide past one another. A liquid flows and takes the shape of its container, but its volume stays the same.",
                image: liquid,
                imageAlt: "Water being poured from a pitcher into a glass",
                examples: [
                  "Arrangement: close together, but disorderly",
                  "Motion: slide and flow past each other",
                  "Water, cooking oil, calamansi juice",
                ],
              },
              {
                title: "Gas",
                label: "Fills any space",
                variant: "accent",
                color: "accent",
                desc: "Particles are far apart and move quickly in all directions. They bump into each other and into the walls of their container. A gas spreads out to fill the whole space it is in.",
                image: gas,
                imageAlt: "Colorful inflated balloons filled with air",
                examples: [
                  "Arrangement: far apart, no pattern",
                  "Motion: move fast and freely in all directions",
                  "Air in a balloon, steam, LPG gas",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Heating and Cooling",
          data: {
            intro:
              "Follow water from ice to vapor and back again. Heating gives the particles energy. Cooling takes it away. Watch what the thermometer does at each step.",
            steps: [
              {
                num: 1,
                title: "Heating the Solid",
                color: "primary",
                description:
                  "Heat goes into the ice. Its particles gain energy and vibrate faster in their fixed places. The temperature of the ice goes up, but it is still solid.",
                tip: "Faster particles = higher temperature.",
              },
              {
                num: 2,
                title: "Melting (Solid → Liquid)",
                color: "secondary",
                description:
                  "At the melting point (0 °C for ice), the particles have enough energy to break out of their fixed pattern and slide past each other. While the ice melts, the temperature stays flat at 0 °C. The added energy goes into pulling the particles apart, not into making them move faster.",
                tip: "Melting absorbs energy. That is why melting ice keeps your drink cold.",
              },
              {
                num: 3,
                title: "Heating the Liquid",
                color: "accent",
                description:
                  "Once all the ice has melted, the water keeps absorbing heat. Its particles move faster and faster, and the temperature rises again.",
                tip: "Some fast particles at the surface already escape as vapor even before boiling. This is evaporation.",
              },
              {
                num: 4,
                title: "Boiling (Liquid → Vapor)",
                color: "primary",
                description:
                  "At the boiling point (100 °C for water at sea level), particles all through the liquid have enough energy to escape. Bubbles of vapor form inside and rise to the top. The temperature stays flat again until all the water has turned to gas.",
                tip: "Boiling water stays at about 100 °C no matter how high you turn the flame. A stronger flame only makes it boil faster, so a medium flame saves LPG.",
              },
              {
                num: 5,
                title: "Condensation (Vapor → Liquid)",
                color: "secondary",
                description:
                  "Now run it backwards. Water vapor touches something cool, like the inside of a rice cooker lid. The particles lose energy, slow down, and are pulled closer together into liquid droplets.",
                tip: "Condensation releases energy. This is why steam can burn your skin more than hot water does.",
              },
              {
                num: 6,
                title: "Freezing (Liquid → Solid)",
                color: "accent",
                description:
                  "As the water keeps losing heat, its particles slow down. At the freezing point (0 °C), they lock into a fixed, orderly pattern. The temperature stays flat until all the water has frozen, as the particles give back the energy they took in during melting.",
                tip: "Water melts and freezes at the same temperature. Only the direction of the energy is different.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Changes of State Around You",
          data: {
            cards: [
              {
                title: "Melting",
                label: "Solid → Liquid",
                variant: "primary",
                color: "primary",
                desc: "Ice absorbs heat from the warm air and from the food around it. Its particles break out of their fixed pattern and flow as water.",
                image: lesson7hero,
                imageAlt: "Ice cubes melting into a puddle of water",
                examples: [
                  "Shaved ice melting in halo-halo",
                  "Ice candy softening in your hand",
                  "Ice packed around fish melting on the way to the palengke",
                ],
              },
              {
                title: "Freezing",
                label: "Liquid → Solid",
                variant: "secondary",
                color: "secondary",
                desc: "The freezer takes heat away from the water. Its particles slow down until they lock into the fixed pattern of ice.",
                image: solid,
                imageAlt: "An ice cube tray filled with frozen ice cubes",
                examples: [
                  "Water in an ice tray turning into ice cubes",
                  "Juice in plastic bags becoming ice candy",
                  "Fish frozen in cold storage",
                ],
              },
              {
                title: "Evaporation",
                label: "Liquid → Gas",
                variant: "accent",
                color: "accent",
                desc: "The fastest water particles at the surface of wet clothes escape into the air. It happens below 100 °C. Sun and wind make it faster.",
                image: lesson8hero,
                imageAlt: "Laundry hanging on a clothesline outdoors to dry in the sun",
                examples: [
                  "Clothes drying on a sampayan",
                  "Daing (dried fish) drying in the sun",
                  "Sweat drying on your skin",
                ],
              },
              {
                title: "Condensation",
                label: "Gas → Liquid",
                variant: "primary",
                color: "primary",
                desc: "Water vapor in the air touches the cold glass, loses energy, and turns back into tiny liquid droplets on the outside of the glass.",
                image: lesson8hero,
                imageAlt: "Water droplets forming on the outside of a cold glass",
                examples: [
                  "Droplets on a glass of iced tea",
                  "Water drops under a rice cooker lid",
                  "Fog on the windows of an air-conditioned bus",
                ],
              },
              {
                title: "Sublimation",
                label: "Solid → Gas",
                variant: "secondary",
                color: "secondary",
                desc: "Some solids turn straight into a gas without melting first. The particles at the surface gain enough energy to escape directly into the air.",
                image: lesson9hero,
                imageAlt: "White mothballs (naphthalene balls) in a pile",
                examples: [
                  "Naphthalene balls (mothballs) slowly shrinking in a closet",
                  "Air freshener blocks getting smaller",
                  "Dry ice giving off white fog",
                ],
              },
              {
                title: "Deposition",
                label: "Gas → Solid",
                variant: "accent",
                color: "accent",
                desc: "Water vapor touches a surface far below freezing and gives off its energy so fast that it turns directly into ice crystals, skipping the liquid stage.",
                image: lesson9hero,
                imageAlt: "White frost crystals built up inside a freezer",
                examples: [
                  "Frost building up inside a freezer",
                  "Frost on grass in very cold places",
                  "Snowflakes forming in clouds",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Evaporation vs. Boiling",
          data: {
            intro:
              "Both change a liquid into a gas, but they are not the same. This is a common test question.",
            left: {
              label: "Evaporation",
              color: "primary",
              items: [
                "Happens only at the surface of the liquid",
                "Happens at any temperature, even below the boiling point",
                "Slow; faster when it is hot, windy, or less humid",
                "No bubbles form inside the liquid",
                "Examples: clothes drying on a sampayan, salt beds in Pangasinan drying in the sun",
              ],
            },
            right: {
              label: "Boiling",
              color: "secondary",
              items: [
                "Happens all through the liquid",
                "Happens only at the boiling point (100 °C for water at sea level)",
                "Fast; the liquid turns to gas quickly",
                "Bubbles of vapor form inside and rise to the surface",
                "Examples: water boiling for instant noodles, a kettle whistling",
              ],
            },
          },
        },

        {
          type: "scenario",
          heading: "Real-World Scenarios",
          data: {
            intro:
              "For each situation, name the change of state, say whether the particles gain or lose energy, and describe what the particles are doing.",
            scenarios: [
              {
                title: "Ice Candy on a Hot Afternoon",
                situation:
                  "Bea buys a frozen ice candy from the sari-sari store. After ten minutes in the afternoon heat, the bottom of the plastic is full of sweet liquid.",
                question:
                  "What change of state happened? Did the particles gain or lose energy? What happened to their arrangement?",
                skill:
                  "Melting. The particles gained energy from the warm air, vibrated faster, and broke out of their fixed pattern, so they could slide past each other as a liquid.",
              },
              {
                title: "Drying Clothes in the Rainy Season",
                situation:
                  "Nanay hangs the laundry on the sampayan. In April the clothes dry by lunch. In August, during the rainy season, they are still damp by evening, even though it never got close to 100 °C either time.",
                question:
                  "What process dries the clothes? Why is it slower in August?",
                skill:
                  "Evaporation. It happens below the boiling point because only the fastest particles at the surface need to escape. In August there is less sun to give the particles energy, and the humid air already holds a lot of water vapor, so evaporation is slower.",
              },
              {
                title: "Droplets Under the Rice Cooker Lid",
                situation:
                  "Carlo opens the rice cooker after the rice is done. Water drops fall from the inside of the lid.",
                question:
                  "Where did the drops come from? What did the particles do?",
                skill:
                  "Condensation. Water vapor from the cooking rice touched the cooler lid, lost energy, slowed down, and was pulled closer together into liquid droplets.",
              },
              {
                title: "Shrinking Mothballs",
                situation:
                  "Lola puts naphthalene balls in the cabinet with the old clothes. After a few months they are much smaller, but the cabinet is completely dry.",
                question:
                  "What change of state happened? Why was there no liquid?",
                skill:
                  "Sublimation. Particles at the surface of the naphthalene balls gained enough energy to escape straight into the air as a gas, skipping the liquid state, so nothing got wet.",
              },
              {
                title: "Frost in the Freezer",
                situation:
                  "The family has not defrosted the freezer in weeks. A thick layer of white frost has formed on the walls, although no one spilled any water.",
                question:
                  "Where did the frost come from? Why didn't liquid water form first?",
                skill:
                  "Deposition. Water vapor from the air that entered when the door was opened touched the very cold walls and released its energy so fast that the particles locked directly into ice crystals.",
              },
            ],
          },
        },
      ],
    },
  ],
};
