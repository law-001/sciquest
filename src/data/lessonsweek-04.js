// Week 4: Changes in the State of Matter — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 4.
//   Lesson 1 — Changes in the State of Matter in Terms of Particle Arrangement
//   (FIRST SUMMATIVE TEST)

import lesson7hero from "../assets/week3/lesson7hero.jpg";

export const week04 = {
  id: "week-4",
  weekNumber: 4,
  title: "Changes in the State of Matter",
  category: "Matter",
  description:
    "Explain all six changes of state in terms of particle arrangement, motion, and energy. Covered by the First Summative Test.",
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
        "Follow all six changes of state — melting, freezing, evaporation, condensation, sublimation, and deposition — and explain each one by what the particles are doing.",
      readTime: "~20 min read",
      xp: 100,
      heroImage: lesson7hero,
      heroImageAlt: "Ice melting in a laboratory setting",

      signature: {
        widgetId: "heating-curve",
        heading: "Watch It: The Plateau Appears",
        intro:
          "Heat goes in at a steady rate and the graph draws itself alongside the lattice. Hold the heat until the line goes flat, then cool it and watch the curve retrace the way it came.",
        instruction: "Draw both plateaus, run it backwards, then take the sublimation route",
        xp: 25,
      },

      sections: [
        "Introduction",
        "The Six Changes of State",
        "Temperature During a Change of State",
        "Melting vs. Freezing",
        "Evaporation vs. Boiling",
        "Sublimation and Deposition",
        "Key Terms",
        "Real-World Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "The Physics Classroom — Phase Changes",
          url: "https://www.physicsclassroom.com/class/thermalP/Lesson-2/Phase-Changes",
        },
        {
          label: "CK-12 — Melting and Freezing",
          url: "https://www.ck12.org/c/physical-science/melting-and-freezing",
        },
        {
          label: "Britannica — Sublimation (Phase Change)",
          url: "https://www.britannica.com/science/sublimation-phase-change",
        },
        {
          label: "Khan Academy — States of Matter and Intermolecular Forces",
          url: "https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Matter changes from one state to another when energy is added or removed. Every one of these changes has the same underlying explanation: <strong class='text-primary-700'>heating gives particles more motion energy so they can break away from each other, and cooling takes it away so attractive forces can pull them back together</strong>.",
              "Adding heat is an <strong class='text-primary-700'>endothermic</strong> change — the substance absorbs energy from its surroundings. Removing heat is an <strong class='text-primary-700'>exothermic</strong> change — the substance releases energy to its surroundings. There are six named changes, and this lesson covers all of them.",
            ],
            didYouKnow:
              "Pure gold melts at 1,064 °C, hot enough to melt almost any container on Earth. Scientists use special crucibles made of graphite or ceramic to melt and work with precious metals.",
          },
        },

        {
          type: "timeline",
          heading: "The Six Changes of State",
          data: {
            intro:
              "Each change has a name, a direction, and a particle-level explanation. Learn them as a set of three pairs — each change and its reverse.",
            steps: [
              {
                num: 1,
                title: "Melting — Solid to Liquid",
                color: "primary",
                description:
                  "When a solid is heated, its particles absorb energy and vibrate more vigorously. At the melting point, particles gain enough energy to break free from their fixed positions and begin to slide past one another. The regular pattern of the solid collapses.",
                tip: "Endothermic. Ice melts at 0 °C. Different solids melt at different temperatures depending on how strongly their particles attract.",
              },
              {
                num: 2,
                title: "Freezing — Liquid to Solid",
                color: "secondary",
                description:
                  "When a liquid loses heat energy, its particles slow down. At the freezing point they no longer have enough energy to slide past each other, so attractive forces lock them into a fixed, regular arrangement.",
                tip: "Exothermic. Freezing and melting happen at the same temperature for a given pure substance — for water, both at 0 °C.",
              },
              {
                num: 3,
                title: "Evaporation and Boiling — Liquid to Gas",
                color: "accent",
                description:
                  "As a liquid is heated, the faster-moving particles at the surface escape into the air — this is evaporation, and it happens at any temperature. At the boiling point, particles throughout the whole liquid have enough energy to escape, forming bubbles of vapour inside the liquid.",
                tip: "Endothermic. Evaporation happens only at the surface; boiling happens throughout. Water boils at 100 °C at sea level.",
              },
              {
                num: 4,
                title: "Condensation — Gas to Liquid",
                color: "primary",
                description:
                  "When a gas loses energy and cools, its particles slow down until attractive forces can pull them back together into a liquid. This is why water droplets form on a cold glass on a warm day.",
                tip: "Exothermic. Fog, clouds, and morning dew are all condensed water vapour.",
              },
              {
                num: 5,
                title: "Sublimation — Solid to Gas",
                color: "secondary",
                description:
                  "Some solids change directly into a gas without ever becoming a liquid. This happens when particles at the surface of the solid gain enough energy to escape straight into the air, usually because the attractive forces are weak or the pressure is low.",
                tip: "Endothermic. Dry ice (solid CO₂) sublimates at room temperature, producing fog without leaving anything wet behind.",
              },
              {
                num: 6,
                title: "Deposition — Gas to Solid",
                color: "accent",
                description:
                  "Some gases change directly into a solid without passing through the liquid state. Gas particles lose energy so quickly on contact with a very cold surface that they lock immediately into a fixed arrangement.",
                tip: "Exothermic. Frost is the classic example — water vapour depositing straight onto cold surfaces as ice crystals.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Temperature During a Change of State",
          data: {
            intro:
              "Here is the part that surprises most students: while a substance is changing state, its temperature does not rise, even though heat is still being added. Follow what happens to a block of ice on a hotplate.",
            steps: [
              {
                num: 1,
                title: "Heating the Solid (Below Melting Point)",
                color: "primary",
                description:
                  "Heat energy is added to the ice. The temperature rises steadily as the particles vibrate faster and faster in their fixed positions. The ice remains solid throughout this stage.",
                tip: "The colder the solid, the more energy is needed to raise it to its melting point.",
              },
              {
                num: 2,
                title: "Reaching the Melting Point",
                color: "secondary",
                description:
                  "The temperature stops rising when the melting point is reached (0 °C for ice). All heat energy added at this stage goes into breaking the attractions between particles, not into raising the temperature.",
                tip: "This energy is called the latent heat of fusion — energy used to change state rather than temperature.",
              },
              {
                num: 3,
                title: "Melting Occurs (Solid and Liquid Together)",
                color: "accent",
                description:
                  "While the substance sits at its melting point, solid and liquid exist side by side. The temperature stays flat until the last of the solid has melted. On a temperature-time graph this shows as a horizontal plateau.",
                tip: "Pure substances melt at a sharp, exact temperature. Impurities spread melting across a range instead.",
              },
              {
                num: 4,
                title: "Heating the Liquid",
                color: "primary",
                description:
                  "Once everything has melted, the temperature begins to climb again as heat is added to the liquid. The particles now move freely past one another and the substance is entirely liquid.",
                tip: "Liquid water keeps warming until it reaches 100 °C, its boiling point — where a second plateau appears.",
              },
              {
                num: 5,
                title: "Cooling Back Down (Reverse Process)",
                color: "secondary",
                description:
                  "Remove heat and the whole sequence runs backwards. The temperature drops until it reaches the freezing point, then holds flat while particles release energy, slow down, and lock into a solid arrangement.",
                tip: "Freezing releases energy, which is why a pond takes a long time to freeze even in very cold weather.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Melting vs. Freezing",
          data: {
            intro:
              "Melting and freezing are opposite phase changes that occur at the same temperature for a given pure substance.",
            left: {
              label: "Melting",
              color: "primary",
              items: [
                "Direction: Solid → Liquid (gains energy)",
                "Energy: Endothermic — absorbs heat from the surroundings",
                "Particles gain energy, vibrate faster, and break free of fixed positions",
                "Temperature stays constant at the melting point during the change",
                "Examples: ice becoming water, wax softening, chocolate melting",
              ],
            },
            right: {
              label: "Freezing",
              color: "secondary",
              items: [
                "Direction: Liquid → Solid (loses energy)",
                "Energy: Exothermic — releases heat to the surroundings",
                "Particles lose energy, slow down, and lock into a rigid arrangement",
                "Temperature stays constant at the freezing point during the change",
                "Examples: water turning to ice, candle wax solidifying, cast metal cooling",
              ],
            },
          },
        },

        {
          type: "comparison",
          heading: "Evaporation vs. Boiling",
          data: {
            intro:
              "Both turn a liquid into a gas, but they differ in where they happen and what conditions they need. This distinction is a common exam question.",
            left: {
              label: "Evaporation",
              color: "primary",
              items: [
                "Occurs only at the surface of the liquid",
                "Can happen at any temperature, not only at the boiling point",
                "Slower — the rate depends on temperature, humidity, surface area, and wind",
                "No bubbles form inside the liquid",
                "Examples: puddles drying, wet clothes drying, sweat cooling skin",
              ],
            },
            right: {
              label: "Boiling",
              color: "secondary",
              items: [
                "Occurs throughout the entire liquid at once",
                "Only happens at one specific temperature — the boiling point",
                "Much faster — rapid conversion of liquid to gas",
                "Bubbles of vapour form inside the liquid and rise to the surface",
                "Examples: water on a stove, kettle steam, pasta water",
              ],
            },
          },
        },

        {
          type: "comparison",
          heading: "Sublimation and Deposition",
          data: {
            intro:
              "These two changes skip the liquid stage entirely. They are rarer than the other four, but they follow exactly the same energy rules.",
            left: {
              label: "Sublimation",
              color: "primary",
              items: [
                "Direction: Solid → Gas (skips the liquid phase)",
                "Energy: Endothermic — the solid absorbs heat to sublimate",
                "Conditions: low atmospheric pressure or very weak attractions in the solid",
                "Examples: dry ice fogging, iodine crystals releasing violet vapour, mothballs shrinking",
                "Used for: freeze-drying food and medicine, shipping with dry ice",
              ],
            },
            right: {
              label: "Deposition",
              color: "secondary",
              items: [
                "Direction: Gas → Solid (skips the liquid phase)",
                "Energy: Exothermic — the gas releases heat as it becomes solid",
                "Conditions: very cold surfaces that drain energy from gas particles fast",
                "Examples: frost on windows, snowflakes forming in clouds",
                "Used for: understanding frost warnings in agriculture",
              ],
            },
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Melting Point",
                desc: "The specific temperature at which a solid changes to a liquid. For a pure substance this is a fixed, characteristic value — 0 °C for water.",
              },
              {
                term: "Freezing Point",
                desc: "The specific temperature at which a liquid changes to a solid. For a pure substance the freezing point equals the melting point.",
              },
              {
                term: "Boiling Point",
                desc: "The temperature at which a liquid boils throughout and becomes a gas. Water boils at 100 °C at sea level.",
              },
              {
                term: "Endothermic",
                desc: "A process that absorbs heat energy from the surroundings. Melting, evaporation, and sublimation are all endothermic.",
              },
              {
                term: "Exothermic",
                desc: "A process that releases heat energy to the surroundings. Freezing, condensation, and deposition are all exothermic.",
              },
              {
                term: "Latent Heat",
                desc: "The energy absorbed or released during a change of state, which changes the arrangement of particles rather than the temperature.",
              },
              {
                term: "Humidity",
                desc: "The amount of water vapour present in the air. High humidity slows evaporation because the air already holds a lot of vapour.",
              },
              {
                term: "Phase Change",
                desc: "Any change in the physical state of matter — melting, freezing, evaporation, condensation, sublimation, or deposition.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Real-World Scenarios",
          data: {
            intro:
              "For each situation, identify which change of state is happening, whether it is endothermic or exothermic, and what the particles are doing.",
            scenarios: [
              {
                title: "Chocolate Dipped Strawberry",
                situation:
                  "You dip a cold strawberry into a bowl of melted chocolate. When you pull it out, the chocolate coating hardens almost instantly into a solid shell.",
                question:
                  "What change of state happened to the chocolate? Is this endothermic or exothermic? What happened to the chocolate particles?",
                skill:
                  "Freezing — exothermic. The cold strawberry drew energy out of the liquid chocolate, its particles slowed, and attractive forces locked them into a solid arrangement.",
              },
              {
                title: "Drying Clothes on a Clothesline",
                situation:
                  "Maria hangs wet clothes outside on a sunny, windy day. By afternoon the clothes are dry, even though the temperature never came close to 100 °C.",
                question:
                  "What process removed the water? Why did the clothes dry faster on a windy, sunny day than on a cold, still day?",
                skill:
                  "Evaporation — endothermic, and it happens at any temperature because only the fastest surface particles need to escape. Heat raises particle energy and wind carries vapour away, so both speed it up.",
              },
              {
                title: "Steam on the Bathroom Mirror",
                situation:
                  "After a hot shower, Ana notices the bathroom mirror is completely fogged with tiny water droplets she has to wipe away.",
                question:
                  "The shower produced water vapour. What happened when this vapour touched the cool mirror surface?",
                skill:
                  "Condensation — exothermic. The cool glass drew energy from the vapour, its particles slowed, and attractive forces pulled them into liquid droplets.",
              },
              {
                title: "Dry Ice in a Bowl",
                situation:
                  "You place a block of dry ice in a bowl at room temperature. Thick white fog pours over the sides, but the block never becomes wet. After a few hours it has vanished completely.",
                question:
                  "What change of state occurred? Why did the block never produce any liquid?",
                skill:
                  "Sublimation — endothermic. At normal atmospheric pressure carbon dioxide cannot exist as a liquid, so the solid passes straight to gas with no liquid stage at all.",
              },
              {
                title: "Frost on a Car Windshield",
                situation:
                  "On a cold morning you notice white frost on a car windshield, even though it did not rain or snow overnight. The temperature dropped below 0 °C during the night.",
                question:
                  "Where did the frost come from, and why did it form directly on the glass with no liquid water appearing first?",
                skill:
                  "Deposition — exothermic. Water vapour in the air lost energy so rapidly against the freezing glass that its particles locked straight into ice crystals, skipping liquid entirely.",
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
                title: "Food Preservation",
                description:
                  "Freezing removes heat from food, slowing bacterial growth. Freeze-drying goes further, using sublimation in a vacuum to remove water without any heat damage.",
                icon: "🥶",
                color: "border-l-primary-500",
              },
              {
                title: "Casting Metal",
                description:
                  "Metals are melted at high temperature, poured into moulds, and allowed to freeze into the finished shape — an industrial use of melting and freezing.",
                icon: "⚙️",
                color: "border-l-secondary-500",
              },
              {
                title: "The Water Cycle",
                description:
                  "Evaporation, condensation, freezing, and deposition move water between ocean, atmosphere, and land — the process that produces all rain, snow, and frost.",
                icon: "🌦️",
                color: "border-l-accent-500",
              },
              {
                title: "Cooling Your Body",
                description:
                  "Sweat evaporating from your skin is endothermic — it absorbs heat from your body and carries it away, which is how you avoid overheating.",
                icon: "💧",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
