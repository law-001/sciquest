// Week 3: Changes in State of Matter — Grade 7 Science

import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week03 = {
  id: "week-3",
  weekNumber: 3,
  title: "Changes in State of Matter",
  category: "Matter",
  description:
    "Explore how matter changes from one state to another when heat is added or removed.",
  icon: "Thermometer",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 7 — Melting and Freezing
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-7",
      weekId: "week-3",
      lessonNumber: 7,
      title: "Melting and Freezing",
      badge: "Lesson 7",
      subtitle:
        "Discover how heat energy causes solids to melt into liquids and how removing heat causes liquids to freeze into solids.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt: "Ice melting in a laboratory setting",

      sections: [
        "Introduction",
        "Key Terms",
        "Temperature Changes During Melting",
        "Applications",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Melting</strong> is the process by which a solid changes into a liquid when heat energy is added. The temperature at which this happens is called the <strong class='text-primary-700'>melting point</strong>. For example, ice melts at 0°C (32°F). When a substance melts, its particles absorb energy and begin to move more freely, breaking away from their fixed positions.",
              "<strong class='text-primary-700'>Freezing</strong> is the reverse process — a liquid changes into a solid when heat energy is removed. The <strong class='text-primary-700'>freezing point</strong> of a pure substance is the same temperature as its melting point. For example, liquid water freezes at 0°C. Melting is an <strong class='text-primary-700'>endothermic</strong> process (absorbs heat), while freezing is an <strong class='text-primary-700'>exothermic</strong> process (releases heat).",
            ],
            didYouKnow:
              "Pure gold melts at 1,064°C — hot enough to melt almost any container on Earth. Scientists use special crucibles made of materials like graphite or ceramic to melt and work with precious metals!",
          },
        },

        // ── Section 1: Key Terms ──
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Melting",
                desc: "The change of state from solid to liquid when heat energy is added. Particles absorb enough energy to break free from their fixed positions.",
              },
              {
                term: "Freezing",
                desc: "The change of state from liquid to solid when heat energy is removed. Particles lose energy and lock into a fixed arrangement.",
              },
              {
                term: "Melting Point",
                desc: "The specific temperature at which a solid changes to a liquid. For a pure substance, this is a fixed, characteristic value (e.g., 0°C for water).",
              },
              {
                term: "Freezing Point",
                desc: "The specific temperature at which a liquid changes to a solid. For a pure substance, the freezing point equals the melting point.",
              },
              {
                term: "Endothermic",
                desc: "A process that absorbs heat energy from the surroundings. Melting is endothermic — the substance takes in heat to change state.",
              },
              {
                term: "Exothermic",
                desc: "A process that releases heat energy to the surroundings. Freezing is exothermic — the substance gives off heat as it solidifies.",
              },
            ],
          },
        },

        // ── Section 2: Temperature Changes (timeline) ──
        {
          type: "timeline",
          heading: "Temperature Changes During Melting",
          data: {
            intro:
              "When ice is heated, the temperature changes follow a predictable pattern. Understanding this helps explain what happens to particles at each stage of the melting process.",
            steps: [
              {
                num: 1,
                title: "Heating the Solid (Below Melting Point)",
                color: "primary",
                description:
                  "Heat energy is added to the ice. The temperature rises steadily as the particles vibrate faster and faster in their fixed positions. The ice remains solid throughout this stage.",
                tip: "The colder the solid, the more energy is needed to raise its temperature to the melting point.",
              },
              {
                num: 2,
                title: "Reaching the Melting Point",
                color: "secondary",
                description:
                  "The temperature stops rising when the melting point is reached (0°C for ice). All the heat energy added at this stage goes into breaking the bonds between particles — not into raising the temperature.",
                tip: "This is called the 'latent heat of fusion' — energy used to change state, not temperature.",
              },
              {
                num: 3,
                title: "Melting Occurs (Solid + Liquid Mixture)",
                color: "accent",
                description:
                  "While the substance is at its melting point, solid and liquid exist together. The temperature stays constant until all the solid has melted. Particles are absorbing energy and breaking free of their fixed positions.",
                tip: "Pure substances melt at a sharp, exact temperature — impurities cause a range of melting temperatures.",
              },
              {
                num: 4,
                title: "Fully Liquid (Above Melting Point)",
                color: "primary",
                description:
                  "Once all the solid has melted, the temperature begins to rise again as heat is added to the liquid. The particles now move freely and the substance is entirely in the liquid state.",
                tip: "Liquid water will continue to rise in temperature until it reaches 100°C — its boiling point.",
              },
              {
                num: 5,
                title: "Cooling and Freezing (Reverse Process)",
                color: "secondary",
                description:
                  "When heat is removed from a liquid, the temperature drops until it reaches the freezing point. At this point, particles release energy, slow down, and lock into a solid arrangement. This is the reverse of melting.",
                tip: "Freezing releases energy — that is why ponds take a long time to freeze even in very cold weather.",
              },
            ],
          },
        },

        // ── Section 3: Applications ──
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Melting Ice",
                description:
                  "Ice cubes in a drink absorb heat from the surroundings and melt into liquid water, keeping your drink cool. This is a practical example of an endothermic process in everyday life.",
                icon: "🧊",
                color: "border-l-primary-500",
              },
              {
                title: "Casting Metal",
                description:
                  "In manufacturing, metals like iron, copper, and aluminum are melted at very high temperatures and poured into molds. When they cool and freeze into solid shapes, the desired parts are formed.",
                icon: "⚙️",
                color: "border-l-secondary-500",
              },
              {
                title: "Food Preservation",
                description:
                  "Freezing food removes heat from it, lowering the temperature below the freezing point of water inside the food. This slows down bacterial growth and preserves food for weeks or months.",
                icon: "🥶",
                color: "border-l-accent-500",
              },
              {
                title: "Permafrost and Climate",
                description:
                  "Permafrost is permanently frozen ground found in polar regions. As global temperatures rise, permafrost melts — releasing trapped greenhouse gases and destabilizing Arctic ecosystems.",
                icon: "🌍",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 8 — Evaporation and Condensation
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-8",
      weekId: "week-3",
      lessonNumber: 8,
      title: "Evaporation and Condensation",
      badge: "Lesson 8",
      subtitle:
        "Understand how liquids turn into gases through evaporation and boiling, and how gases turn back into liquids through condensation.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt: "Water evaporating and forming steam",

      sections: [
        "Introduction",
        "Factors That Increase Evaporation",
        "Key Ideas",
        "Real-World Scenarios",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Evaporation</strong> is the process by which a liquid changes into a gas at its surface. Unlike boiling, evaporation can happen at any temperature — it occurs when surface particles gain enough energy to escape into the air as gas. This is why puddles disappear on a sunny day even without heating the water to 100°C.",
              "<strong class='text-primary-700'>Boiling</strong> is evaporation that occurs throughout the entire liquid at a specific temperature called the boiling point (100°C for water at sea level). <strong class='text-primary-700'>Condensation</strong> is the reverse — a gas loses heat energy and changes back into a liquid. These processes are essential to the water cycle that sustains all life on Earth.",
            ],
            didYouKnow:
              "Your body uses evaporation to cool itself down — when you sweat, the water on your skin evaporates and carries heat away from your body. Without this process, your body temperature would rise dangerously in hot weather!",
          },
        },

        // ── Section 1: Factors That Increase Evaporation (reasonCards) ──
        {
          type: "reasonCards",
          heading: "Factors That Increase Evaporation",
          data: {
            intro:
              "Evaporation rate is not the same in all conditions. Several factors speed up or slow down how quickly a liquid evaporates. Understanding these factors helps explain everyday phenomena like drying clothes.",
            reasons: [
              {
                num: 1,
                title: "Higher Temperature",
                color: "primary",
                desc: "Warmer liquid particles have more kinetic energy",
                content:
                  "Clothes dry faster on a hot, sunny day because more water molecules have enough energy to escape the liquid surface.",
              },
              {
                num: 2,
                title: "Greater Surface Area",
                color: "secondary",
                desc: "More liquid is exposed to the air at once",
                content:
                  "Spreading wet clothes out flat instead of bunching them speeds up drying by increasing the exposed surface area.",
              },
              {
                num: 3,
                title: "Wind or Air Movement",
                color: "accent",
                desc: "Moving air carries water vapor away from the surface",
                content:
                  "Clothes on a clothesline dry faster on a windy day because the wind removes water vapor, allowing more evaporation to occur.",
              },
              {
                num: 4,
                title: "Lower Humidity",
                color: "primary",
                desc: "Dry air can absorb more water vapor",
                content:
                  "In desert areas with very dry air, water evaporates extremely quickly. In humid tropical areas, evaporation is much slower.",
              },
              {
                num: 5,
                title: "Nature of the Liquid",
                color: "secondary",
                desc: "Some liquids evaporate more easily than others",
                content:
                  "Alcohol (ethanol) evaporates faster than water because its particles have weaker intermolecular forces. Rubbing alcohol on skin feels cold as it evaporates.",
              },
            ],
          },
        },

        // ── Section 2: Concept List ──
        {
          type: "conceptList",
          heading: "Key Ideas",
          data: {
            concepts: [
              "Evaporation occurs only at the surface of a liquid and can happen at any temperature — it does not require the liquid to reach its boiling point.",
              "Boiling is rapid evaporation that occurs throughout the liquid at a specific temperature called the boiling point (100°C for water at sea level).",
              "Condensation is the reverse of evaporation — a gas loses heat energy and changes into a liquid when it contacts a cooler surface.",
              "The dew point is the temperature at which air becomes saturated with water vapor and condensation begins to form.",
              "Condensation can be seen on the outside of a cold glass on a humid day — water vapor in the air cools and changes to liquid water.",
              "Both evaporation and condensation are key stages in the water cycle, which moves water between the ocean, atmosphere, and land.",
            ],
          },
        },

        // ── Section 3: Scenarios ──
        {
          type: "scenario",
          heading: "Real-World Scenarios",
          data: {
            intro:
              "Apply your understanding of evaporation and condensation to these everyday situations. Identify the process and explain what is happening at the particle level.",
            scenarios: [
              {
                title: "Drying Clothes on a Clothesline",
                situation:
                  "Maria hangs wet clothes outside on a sunny, windy day. By afternoon, the clothes are dry even though the temperature never reached 100°C.",
                question:
                  "What process is removing the water from the clothes? Why did the clothes dry faster on a windy, sunny day than on a cold, still day?",
                skill:
                  "Evaporation — solar energy and wind speed up the process. Higher temperature gives particles more energy, and wind carries away water vapor so more can escape.",
              },
              {
                title: "Dew on the Grass in the Morning",
                situation:
                  "After a cool night, Juan notices tiny droplets of water on the grass and car windows in the morning, even though it did not rain.",
                question:
                  "Where did the water droplets come from? What process caused them to form on the cool surfaces?",
                skill:
                  "Condensation — water vapor in the warm air contacted the cool grass and car surfaces, lost heat energy, and changed from gas back into liquid water droplets.",
              },
              {
                title: "Steam on the Bathroom Mirror",
                situation:
                  "After a hot shower, Ana notices that the bathroom mirror is completely fogged up with tiny water droplets that she has to wipe away.",
                question:
                  "The shower produced steam (water vapor). What happened when this steam touched the cool mirror surface?",
                skill:
                  "Condensation — the hot water vapor from the shower cooled rapidly when it contacted the mirror. As the particles lost energy, they changed from gas to liquid, forming the fog on the mirror.",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 9 — Sublimation and Deposition
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-9",
      weekId: "week-3",
      lessonNumber: 9,
      title: "Sublimation and Deposition",
      badge: "Lesson 9",
      subtitle:
        "Explore the fascinating state changes where solids become gases and gases become solids — skipping the liquid phase entirely.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt: "Diagram showing sublimation and deposition processes",

      sections: [
        "Introduction",
        "Key Terms",
        "Sublimation vs. Deposition",
        "Applications",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Sublimation</strong> is the process by which a solid changes directly into a gas without passing through the liquid state. This happens when the pressure is low or the substance has weak intermolecular forces. Common examples include dry ice (solid carbon dioxide), mothballs (naphthalene), and iodine crystals, which all produce visible vapor without becoming liquid first.",
              "<strong class='text-primary-700'>Deposition</strong> is the reverse of sublimation — a gas changes directly into a solid without passing through the liquid state. Frost forming on a window in winter is a classic example: water vapor in the air deposits directly as ice crystals when it contacts a very cold surface. Both processes are rarer than melting, freezing, evaporation, and condensation.",
            ],
            didYouKnow:
              "Dry ice is solid carbon dioxide at −78.5°C. At normal atmospheric pressure, CO₂ cannot exist as a liquid — it goes directly from solid to gas, which is why dry ice 'smokes' without getting wet!",
          },
        },

        // ── Section 1: Key Terms ──
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Sublimation",
                desc: "The direct change of state from solid to gas, skipping the liquid phase. The solid absorbs energy and its particles escape directly into the gaseous state.",
              },
              {
                term: "Deposition",
                desc: "The direct change of state from gas to solid, skipping the liquid phase. Gas particles lose energy rapidly and lock directly into a solid arrangement.",
              },
              {
                term: "Dry Ice",
                desc: "Solid carbon dioxide (CO₂) at −78.5°C. It sublimates directly into CO₂ gas at normal atmospheric pressure and is used to create fog effects and preserve food.",
              },
              {
                term: "Frost",
                desc: "Ice crystals that form directly from water vapor in the air when a surface is colder than the frost point. Frost is an example of deposition.",
              },
              {
                term: "Phase Change",
                desc: "Any change in the physical state of matter — such as melting, freezing, evaporation, condensation, sublimation, or deposition.",
              },
              {
                term: "Vapor",
                desc: "The gaseous form of a substance that is normally a liquid or solid at room temperature. Water vapor, iodine vapor, and camphor vapor are common examples.",
              },
            ],
          },
        },

        // ── Section 2: Sublimation vs. Deposition (comparison) ──
        {
          type: "comparison",
          heading: "Sublimation vs. Deposition",
          data: {
            intro:
              "Sublimation and deposition are opposite processes — one converts solid to gas, the other converts gas to solid. Both skip the liquid phase entirely.",
            left: {
              label: "Sublimation",
              color: "primary",
              items: [
                "Direction: Solid → Gas (skips liquid phase)",
                "Examples: dry ice disappearing, iodine crystals producing violet vapor, mothballs shrinking",
                "Energy change: Endothermic — the solid absorbs heat energy to sublimate",
                "Conditions: Low atmospheric pressure or very weak intermolecular forces in the solid",
                "Real-life use: Dry ice for food transport, freeze-drying coffee and medicine",
              ],
            },
            right: {
              label: "Deposition",
              color: "secondary",
              items: [
                "Direction: Gas → Solid (skips liquid phase)",
                "Examples: frost on windows, snowflake formation in clouds, iodine vapor forming crystals",
                "Energy change: Exothermic — the gas releases heat energy as it becomes solid",
                "Conditions: Very cold surfaces that cool gas particles rapidly below the freezing point",
                "Real-life use: Snowflake formation, frost warning alerts in agriculture",
              ],
            },
          },
        },

        // ── Section 3: Applications ──
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Food Preservation with Dry Ice",
                description:
                  "Dry ice (solid CO₂) sublimates and keeps food extremely cold during transport without leaving any liquid residue. It is commonly used to ship medical samples, seafood, and ice cream.",
                icon: "🧊",
                color: "border-l-primary-500",
              },
              {
                title: "Freeze-Drying",
                description:
                  "Freeze-drying uses sublimation to remove water from food or medicines. The product is frozen first, then placed in a vacuum so the ice sublimates directly — preserving flavor, nutrition, and shelf life.",
                icon: "🥦",
                color: "border-l-secondary-500",
              },
              {
                title: "Camphor and Mothballs",
                description:
                  "Camphor and naphthalene (mothballs) slowly sublimate at room temperature, releasing a vapor that repels insects. Over time, the solid block disappears completely without leaving any liquid.",
                icon: "🧴",
                color: "border-l-accent-500",
              },
              {
                title: "Snowflake Formation",
                description:
                  "Snowflakes form through deposition — water vapor in cold clouds deposits directly as ice crystals without passing through liquid water. Each snowflake forms a unique crystalline pattern as it falls.",
                icon: "❄️",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
