// Week 2: Particle Model of Matter — Grade 7 Science

import matter from "../assets/week2/matter.webp";
import solid from "../assets/week2/solid.webp";
import liquid from "../assets/week2/liquid.jpg";
import gas from "../assets/week2/gas.jpg";
import lesson6hero from "../assets/week2/lesson6hero.png";

export const week02 = {
  id: "week-2",
  weekNumber: 2,
  title: "Particle Model of Matter",
  category: "Matter",
  description:
    "Discover what matter is made of and how the particle model explains the behavior of solids, liquids, and gases.",
  icon: "Atom",
  color: "secondary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 4 — What is Matter?
    // ═══════════════════════════════════════════════════
    // ═══════════════════════════════════════════════════
    // COMBINED LESSON — Particle Theory of Matter
    // (Objectives-aligned: definitions, five statements,
    //  states comparison, temperature effect)
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-4",
      weekId: "week-2",
      lessonNumber: 4,
      title: "Particle Theory of Matter",
      badge: "Lesson 4",
      subtitle:
        "The Particle Model of Matter explains that all matter is made up of tiny particles, and each pure substance has its own kind of particles. These particles are constantly moving, and their arrangement and behavior affect the properties and state of matter. ",
      readTime: "~18 min read",
      xp: 100,
      heroImage: matter,
      heroImageAlt: "Microscopic view illustrating particle theory",

      sections: [
        "What is Matter?",
        "Important Properties of Matter",
        "Five Statements of Particle Theory",
        "Key Ideas About Particles",
        "Atoms and Molecules",
        "Temperature and Particles",
      ],

      references: [
        {
          label: "Particle Model of Matter Overview",
          url: "https://www.scribd.com/document/895837918/Particle-Model-of-Matter-Grade7",
        },
      ],

      layout: [
        // ── Section 0: Introduction ──
        {
          type: "intro",
          heading: "What is Matter? ",
          data: {
            paragraphs: [
              "Matter is <strong class='text-primary-700'>anything that has mass and occupies space</strong>. It exists in different forms or states such as solid, liquid, gas, plasma, and Bose-Einstein condensate.",
            ],
            didYouKnow:
              "Even in a solid block of metal, the atoms are never completely still. They vibrate billions of times per second! Temperature measures how fast this vibration is happening.",
          },
        },

        // ── Section 1: Key Terms ──
        // (Only terms directly relevant to the objectives are kept)
        {
          type: "keyTerms",
          heading: "Important Properties of Matter",
          data: {
            terms: [
              {
                term: "Density",
                desc: "The amount of mass found in a certain volume of a substance. The more tightly packed the particles, the denser the substance like iron compared to wood.",
              },
              {
                term: "Mass",
                desc: "The amount of matter an object contains based on the number of particles it has a full balloon has more mass than an empty one.",
              },
              {
                term: "Volume",
                desc: "The amount of space a substance occupies, including the gaps between particles gas takes up more volume than liquid because its particles are farther apart.",
              },
              {
                term: "Color",
                desc: "The visible shade of a substance determined by how its particles absorb and reflect light like how copper appears reddish-orange.",
              },
              {
                term: "Odor",
                desc: "The smell produced when particles escape into the air and reach your nose like perfume spreading across a room.",
              },
              {
                term: "Melting Point",
                desc: "The temperature at which a solid becomes a liquid as particles gain enough energy to break free from their fixed positions like ice melting at 0°C.",
              },
              {
                term: "Hardness",
                desc: "A material's ability to resist scratching, determined by how strongly its particles attract each other diamond is hard because its carbon atoms are very tightly bonded.",
              },
              {
                term: "Temperature",
                desc: "A measure of the average kinetic energy of particles in a substance the faster the particles move, the higher the temperature.",
              },
            ],
          },
        },

        // ── Section 3: Five Statements ──
        // (Core of Objective 1 & 2)
        {
          type: "timeline",
          heading: "Five Statements of Particle Theory",
          data: {
            intro:
              "The particle theory is summarized in five key statements. Together, these statements explain why matter behaves the way it does in all three states.",
            steps: [
              {
                num: 1,
                title: "All Matter Is Made of Tiny Particles",
                color: "primary",
                description:
                  "Every substance, solid, liquid, or gas, is made up of extremely small particles called atoms or molecules. These particles are too small to see with the naked eye, even with most microscopes.",
                tip: "Think of a glass of water: it looks smooth, but it is really billions of water molecules packed together.",
              },
              {
                num: 2,
                title: "Particles Are in Constant Motion",
                color: "secondary",
                description:
                  "All particles of matter are constantly moving. In solids, they vibrate in place. In liquids, they slide around each other. In gases, they move rapidly in all directions. This motion never completely stops, even at very cold temperatures.",
                tip: "The faster the particles move, the more kinetic energy they have, and the warmer the substance feels.",
              },
              {
                num: 3,
                title: "There Is Empty Space Between Particles",
                color: "accent",
                description:
                  "Particles of matter do not touch each other. There are spaces between them. In solids, the spaces are very small. In liquids, spaces are a bit larger. In gases, there is a great deal of empty space between particles.",
                tip: "This is why gases can be compressed into a smaller container but solids and liquids cannot be compressed as easily.",
              },
              {
                num: 4,
                title: "Particles Attract Each Other",
                color: "primary",
                description:
                  "Particles exert attractive forces on each other called intermolecular forces. In solids, the forces are very strong and hold particles tightly together. In liquids, forces are weaker. In gases, the forces are very weak.",
                tip: "Strong attractive forces produce a rigid solid. Weak attractive forces produce a freely moving gas.",
              },
              {
                num: 5,
                title: "Temperature Affects Particle Speed",
                color: "secondary",
                description:
                  "When the temperature of a substance increases, its particles move faster. When the temperature decreases, particles move slower. Temperature is a measure of the average kinetic energy of the particles in a substance.",
                tip: "Heating a gas makes it expand because its particles move faster and push outward more forcefully.",
              },
            ],
          },
        },

        // ── Section 4: Key Ideas About Particles ──
        // (Reinforces all three objectives in summary form)
        {
          type: "conceptList",
          heading: "Key Ideas About Particles",
          data: {
            concepts: [
              "All particles of matter are in constant motion. They never completely stop moving, even in solids.",
              "The amount of empty space between particles determines how easily a substance can be compressed.",
              "Intermolecular forces (attractions between particles) determine whether a substance is a solid, liquid, or gas at a given temperature.",
              "When a substance is heated, its particles absorb energy and move faster, which can cause the substance to expand or change state.",
              "The particle model explains observable properties of matter: why liquids flow, gases expand, and solids hold their shape.",
              "The particle theory is a model, not a perfect picture of reality, but it is extremely useful for predicting and explaining the behavior of matter.",
            ],
          },
        },

        // ── Section 5: Temperature and Particles ──
        // (Directly addresses Objective 2: heat increases particle speed)
        {
          type: "comparison",
          heading: "Atoms and Molecules",
          data: {
            intro:
              "Atoms are the basic units or building blocks of matter. Everything around us is made up of atoms. Molecules are formed when two or more atoms combine or bond together, such as water (H₂O). Different substances are made up of different kinds of particles, which give them their own unique properties and characteristics. .",
            left: {
              label: "Atom",
              color: "primary",
              items: [
                "The basic unit or building block of matter",
                "Made of a single particle of an element",
                "Cannot be broken down by ordinary chemical means",
                "Smallest particle that still keeps the properties of an element",
                "Examples: Hydrogen atom (H), Oxygen atom (O), Carbon atom (C)",
              ],
            },
            right: {
              label: "Molecules",
              color: "secondary",
              items: [
                "Formed when two or more atoms chemically combine or bond together",
                "Can be made of the same or different kinds of atoms",
                "Represents the smallest unit of a substance that can exist independently",
                "Has its own unique properties depending on the atoms combined",
                "Examples: Water (H₂O), Carbon Dioxide (CO₂), Oxygen Gas (O₂)",
              ],
            },
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 5 — States of Matter
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-5",
      weekId: "week-2",
      lessonNumber: 5,
      title: "Particle Nature of Matter States",
      badge: "Lesson 5",
      subtitle:
        "Understanding the particle nature of matter helps explain how matter behaves in its different states at the microscopic level. Matter commonly exists in three main states: solid, liquid, and gas. ",
      readTime: "~13 min read",
      xp: 50,
      heroImage: lesson6hero,
      heroImageAlt: "Diagram showing the three main states of matter",

      sections: [
        "Introduction",
        "States of Matter and Particle Behavior",
        "Motion Energy of Particles",
        "Temperature and Particle Movement",
        "State Changes",
        "Key Ideas About Particles",
        "Real-World Scenarios",
      ],

      references: [
        {
          label: "Particle Nature of Matter States",
          url: "https://www.scribd.com/presentation/919258922/CHAP-2-LESSON-2-THE-PARTICLE-NATURE-OF-THE-THREE-STATES-OF-MATTER",
        },
      ],

      layout: [
        // ── Section 0: Intro (always first) ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "The particle nature of matter explains that all matter is made up of tiny particles that are constantly moving. These particles <strong class='text-primary-700'>behave differently depending on the state of matter</strong>, whether solid, liquid, or gas. Understanding how particles move and interact helps explain the properties and behavior of matter in everyday life.",
              "The arrangement, movement, and attractive forces between particles determine whether a substance exists as a solid, liquid, or gas. <strong class='text-primary-700'>Temperature and pressure also affect how particles behave</strong> and can cause matter to change from one state to another.",
            ],
            didYouKnow:
              "Even though solid objects appear still, their particles are constantly vibrating in place. The higher the temperature, the faster the particles move.",
          },
        },

        {
          type: "imageCards",
          heading: "States of Matter and Particle Behavior",
          data: {
            cards: [
              {
                title: "Solids",
                label: "Tightly Packed",
                variant: "primary",
                color: "primary",
                desc: "A state of matter where particles are tightly packed together and only vibrate in place. Solids have a definite shape and a definite volume.",
                image: solid,
                imageAlt: "Particle diagram of a solid",
                examples: [
                  "Rocks, Wood, Ice, Metals, Glass",
                  "Because the particles are closely packed, solids are usually hard and difficult to compress.",
                ],
              },
              {
                title: "Liquids",
                label: "Flowing Freely",
                variant: "secondary",
                color: "secondary",
                desc: "A state of matter where particles are loosely packed and can slide past one another. Liquids have no definite shape but have a definite volume.",
                image: liquid,
                imageAlt: "Particle diagram of a liquid",
                examples: [
                  "Water, Oil, Milk",
                  "Liquids take the shape of their container while keeping the same amount of volume.",
                ],
              },
              {
                title: "Gases",
                label: "Spread Apart",
                variant: "primary",
                color: "accent",
                desc: "A state of matter where particles are far apart and move freely and rapidly. Gases have no definite shape and no definite volume. Gases spread out to fill any container they are placed in.",
                image: gas,
                imageAlt: "Particle diagram of a gas",
                examples: [
                  "Oxygen, Carbon Dioxide, Helium, Water Vapor",
                  "Because the particles are widely spaced, gases can easily be compressed.",
                ],
              },
            ],
          },
        },

        // ── Section 2: Why Use Models (reasonCards) ──
        {
          type: "reasonCards",
          heading: "Motion Energy of Particles",
          data: {
            intro:
              "Particles of matter are always moving and possess motion energy. The amount of motion energy affects how particles behave in each state of matter.",
            reasons: [
              {
                num: 1,
                title: "Solids",
                color: "primary",
                desc: "Particles in solids have low motion energy. The attractive forces between particles are stronger than their movement, causing them to stay closely packed and vibrate in fixed positions. ",
                content:
                  "e.g. A metal spoon keeps its shape no matter what container it is placed in because its particles are locked in fixed positions.",
              },
              {
                num: 2,
                title: "Liquids",
                color: "secondary",
                desc: "Particles in liquids have moderate motion energy. They can move around one another while still remaining close together, allowing liquids to flow.",
                content:
                  "e.g. Water takes the shape of any container it is poured into because its particles can slide past one another while staying close together.",
              },
              {
                num: 3,
                title: "Gases",
                color: "accent",
                desc: "Particles in gases have high motion energy. Their movement is much stronger than the attractive forces between them, causing particles to spread far apart and move freely.",
                content:
                  "e.g. Air fills an entire room because gas particles move rapidly and spread out to occupy all available space.",
              },
            ],
          },
        },

        // ── Section 2: Solid vs. Gas (comparison) ──
        {
          type: "comparison",
          heading: "Temperature and Particle Movement",
          data: {
            intro: "Temperature directly affects the movement of particles.",
            left: {
              label: "When Matter is Heated",
              color: "primary",
              items: [
                "Particles gain more motion energy and move faster",
                "Attractive force between particles become weaker",
                "Particles spread farther apart",
                "Matter may change from solid to liquid or from liquid to gas",
              ],
            },
            right: {
              label: "When Matter is Cooled",
              color: "secondary",
              items: [
                "Particles lose motion energy and move slower",
                "Attractive forces become stronger",
                "Particles move closer together and become more organized",
                "Matter may change from gas to liquid or from liquid to solid",
              ],
            },
          },
        },

        // ── Section 3: State Changes (timeline) ──
        {
          type: "timeline",
          heading: "State Changes",
          data: {
            intro:
              "Matter changes from one state to another when energy is added or removed. Each transition has a specific name. Adding heat generally moves matter toward the gas or plasma state; removing heat moves it back toward solid.",
            steps: [
              {
                num: 1,
                title: "Melting — Solid to Liquid",
                color: "primary",
                description:
                  "When a solid is heated, its particles absorb energy and vibrate more vigorously. At the melting point, particles gain enough energy to break free from their fixed positions and begin to flow. The substance changes from solid to liquid.",
                tip: "Ice melts at 0 °C (32 °F). Different solids have different melting points depending on the strength of the forces between their particles.",
              },
              {
                num: 2,
                title: "Freezing — Liquid to Solid",
                color: "secondary",
                description:
                  "When a liquid loses heat energy, its particles slow down. At the freezing point, particles no longer have enough energy to slide past each other and lock into fixed positions. The substance changes from liquid to solid.",
                tip: "Freezing and melting occur at the same temperature for a given substance. For water, both happen at 0 °C.",
              },
              {
                num: 3,
                title: "Evaporation / Boiling — Liquid to Gas",
                color: "accent",
                description:
                  "As a liquid is heated, faster-moving particles at the surface escape into the air (evaporation). When the temperature reaches the boiling point, particles throughout the liquid have enough energy to escape as gas.",
                tip: "Evaporation happens at any temperature, while boiling only happens at the boiling point. Water boils at 100 °C (212 °F) at sea level.",
              },
              {
                num: 4,
                title: "Condensation — Gas to Liquid",
                color: "primary",
                description:
                  "When a gas loses energy and cools, its particles slow and are pulled together by intermolecular forces. The substance changes from gas to liquid. This is why water droplets form on a cold glass on a warm day.",
                tip: "The water in fog and clouds is condensed water vapor. Dew forms when water vapor in the air condenses on cooler surfaces overnight.",
              },
              {
                num: 5,
                title: "Sublimation — Solid to Gas",
                color: "secondary",
                description:
                  "Some solids change directly to a gas without passing through the liquid state. This occurs when particles at the surface of a solid gain enough energy to escape directly into the air.",
                tip: "Dry ice (solid CO₂) sublimates at room temperature, producing a fog effect without leaving any liquid behind.",
              },
              {
                num: 6,
                title: "Deposition — Gas to Solid",
                color: "accent",
                description:
                  "Some gases change directly into a solid without passing through the liquid state. This occurs when gas particles lose enough energy to lock immediately into fixed positions.",
                tip: "Frost is a common example water vapor in the air deposits directly onto cold surfaces as ice crystals, skipping the liquid stage entirely.",
              },
            ],
          },
        },

        // ── Section 1: Key Terms ──
        {
          type: "keyTerms",
          heading: "Key Ideas About Particles",
          data: {
            terms: [
              {
                term: "Constant Motion",
                desc: "All particles of matter are constantly moving even in a solid, particles never completely stop and continue to vibrate in place.",
              },
              {
                term: "Compressibility",
                desc: "The spaces between particles affect how compressible matter is  gases compress easily while solids and liquids resist compression.",
              },
              {
                term: "Intermolecular Forces",
                desc: "Strong intermolecular forces produce solids while weak forces produce gases, determining how freely particles can move.",
              },
              {
                term: "Temperature Effect",
                desc: "Heating increases particle movement while cooling slows particles down, causing matter to expand or contract accordingly.",
              },
              {
                term: "Particle Model",
                desc: "The particle model explains the properties and behavior of matter why solids hold their shape, liquids flow, and gases spread out.",
              },
              {
                term: "Scientific Theory",
                desc: "The particle model is a scientific theory used to explain changes in matter and natural processes like phase changes and heat transfer.",
              },
            ],
          },
        },

        // ── Section 4: Real-World Scenarios ──
        {
          type: "scenario",
          heading: "Real-World Scenarios",
          data: {
            intro:
              "Apply your understanding of states of matter to these everyday situations. Think through each one carefully.",
            scenarios: [
              {
                title: "Morning Fog",
                situation:
                  "Early in the morning, you see fog hanging low over a field. As the sun rises and the temperature increases, the fog disappears completely within an hour.",
                question:
                  "What state of matter is fog? What state change occurs as the sun heats it up? Use the particle model in your answer.",
                skill: "Identifying state changes using particle theory",
              },
              {
                title: "Cooking Pasta",
                situation:
                  "You place a pot of water on the stove. As the temperature rises, small bubbles form at the bottom and the water starts to boil. Steam rises off the surface.",
                question:
                  "Describe the state changes happening in the pot. What is happening to the water particles as the temperature increases?",
                skill:
                  "Linking heat energy to particle motion and state changes",
              },
              {
                title: "Neon Sign",
                situation:
                  "A neon sign glows brightly with colored light. Inside the glass tubes is a gas that has been energized by an electric current at very high temperatures.",
                question:
                  "The glowing material inside the sign is not a regular gas. What fourth state of matter is it? What makes it different from a regular gas?",
                skill: "Identifying plasma as the fourth state of matter",
              },
            ],
          },
        },

        // // ── Section 5: Applications ──
        // {
        //   type: "applications",
        //   heading: "Applications",
        //   data: {
        //     apps: [
        //       {
        //         title: "Cooking and Food Science",
        //         description:
        //           "Cooking involves all three states of matter. Ice melts to water (solid to liquid), water boils to steam (liquid to gas), and understanding these states helps chefs control texture and flavor.",
        //         icon: "🍽️",
        //         color: "border-l-primary-500",
        //       },
        //       {
        //         title: "Weather and Atmosphere",
        //         description:
        //           "Water naturally cycles between solid (snow and ice), liquid (rain), and gas (water vapor) in the atmosphere. The study of these changes is fundamental to meteorology and climate science.",
        //         icon: "🌦️",
        //         color: "border-l-secondary-500",
        //       },
        //       {
        //         title: "Manufacturing",
        //         description:
        //           "Many manufacturing processes involve changing the state of materials: melting metals to cast them into shapes, pressurizing gases into cylinders, or freeze-drying food for preservation.",
        //         icon: "🏭",
        //         color: "border-l-accent-500",
        //       },
        //       {
        //         title: "Biology and Medicine",
        //         description:
        //           "Living organisms depend on the properties of all states of matter, from solid bones to liquid blood to the gases we breathe. Medical equipment also uses controlled state changes, like sterilization with steam.",
        //         icon: "🧬",
        //         color: "border-l-primary-500",
        //       },
        //     ],
        //   },
        // },
      ],
    },
  ],
};
