// Week 2: Particle Model of Matter — Grade 7 Science

import matter from "../assets/week2/matter.webp";
import lesson5hero from "../assets/week2/lesson5hero.jpg";
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
        "Introduction",
        "Key Terms",
        "Particles by State",
        "Five Statements of Particle Theory",
        "Key Ideas About Particles",
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

        // ── Section 2: Particles by State ──
        // (Directly addresses Objective 3: illustrate & compare states)
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
    // LESSON 6 — States of Matter
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-6",
      weekId: "week-2",
      lessonNumber: 5,
      title: "States of Matter",
      badge: "Lesson 5",
      subtitle:
        "Compare the properties of solids, liquids, gases, and the rare fourth state of matter, plasma.",
      readTime: "~13 min read",
      xp: 50,
      heroImage: lesson6hero,
      heroImageAlt: "Diagram showing the three main states of matter",

      sections: [
        "Introduction",
        "Key Terms",
        "Solid vs. Gas",
        "State Changes",
        "Real-World Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "PhET   States of Matter Simulation",
          url: "https://phet.colorado.edu/en/simulations/states-of-matter",
        },
        {
          label: "CK-12   States of Matter",
          url: "https://www.ck12.org/c/physical-science/states-of-matter",
        },
        {
          label: "Britannica   Plasma",
          url: "https://www.britannica.com/science/plasma-state-of-matter",
        },
        {
          label: "Khan Academy   States of Matter",
          url: "https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces",
        },
      ],

      layout: [
        // ── Section 0: Intro (always first) ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Matter exists in different <strong class='text-primary-700'>physical states</strong> depending on how its particles are arranged and how much energy they have. The three main states of matter are <strong class='text-primary-700'>solid</strong>, <strong class='text-primary-700'>liquid</strong>, and <strong class='text-primary-700'>gas</strong>. Each state has distinct properties determined by the spacing, motion, and attraction between its particles.",
              "There is also a rare fourth state of matter called <strong class='text-primary-700'>plasma</strong>. Plasma occurs at extremely high temperatures when electrons are stripped from atoms, creating an electrically charged gas. Examples include lightning, the sun, and neon signs.",
            ],
            didYouKnow:
              "More than 99% of all visible matter in the universe is in the plasma state, found in stars like our sun. Plasma is actually the most common state of matter in the universe, even though we rarely see it on Earth!",
          },
        },

        // ── Section 1: Key Terms ──
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Solid",
                desc: "A state of matter with a definite (fixed) shape and a definite (fixed) volume. Particles are tightly packed and vibrate in place.",
              },
              {
                term: "Liquid",
                desc: "A state of matter with a definite volume but no definite shape. Particles are close together but flow and slide past one another.",
              },
              {
                term: "Gas",
                desc: "A state of matter with no definite shape and no definite volume. Particles move rapidly, are far apart, and spread to fill any container.",
              },
              {
                term: "Plasma",
                desc: "A rare, high-energy state of matter made of electrically charged particles (ions and electrons). Found in lightning, stars, and fluorescent lights.",
              },
              {
                term: "Physical State",
                desc: "The form in which matter exists (solid, liquid, gas, or plasma), determined by temperature, pressure, and the forces between particles.",
              },
              {
                term: "Intermolecular Forces",
                desc: "Attractive forces between particles of matter. These forces determine whether a substance is a solid, liquid, or gas at a given temperature.",
              },
            ],
          },
        },

        // ── Section 2: Solid vs. Gas (comparison) ──
        {
          type: "comparison",
          heading: "Solid vs. Gas",
          data: {
            intro:
              "Solids and gases are at opposite ends of the matter spectrum. Understanding their differences reveals how particle arrangement determines the properties of matter.",
            left: {
              label: "Solid",
              color: "primary",
              items: [
                "Definite shape that does not change without force",
                "Definite volume that does not expand to fill a container",
                "Particles are tightly packed in a fixed, regular arrangement",
                "Very strong intermolecular forces hold particles together",
                "Examples: ice, iron, wood, rock, plastic",
              ],
            },
            right: {
              label: "Gas",
              color: "secondary",
              items: [
                "No definite shape, takes the shape of any container",
                "No definite volume, expands to completely fill any container",
                "Particles are far apart and move rapidly in all directions",
                "Very weak intermolecular forces allow particles to move almost freely",
                "Examples: oxygen, steam, carbon dioxide, helium, air",
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
                title: "Ionization — Gas to Plasma",
                color: "accent",
                description:
                  "At extremely high temperatures, gas particles collide so violently that electrons are stripped from atoms, creating free electrons and positively charged ions. This electrically charged state of matter is plasma.",
                tip: "Lightning, the sun, and neon signs are all examples of plasma. Plasma is actually the most common state of matter in the universe.",
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

        // ── Section 5: Applications ──
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Cooking and Food Science",
                description:
                  "Cooking involves all three states of matter. Ice melts to water (solid to liquid), water boils to steam (liquid to gas), and understanding these states helps chefs control texture and flavor.",
                icon: "🍽️",
                color: "border-l-primary-500",
              },
              {
                title: "Weather and Atmosphere",
                description:
                  "Water naturally cycles between solid (snow and ice), liquid (rain), and gas (water vapor) in the atmosphere. The study of these changes is fundamental to meteorology and climate science.",
                icon: "🌦️",
                color: "border-l-secondary-500",
              },
              {
                title: "Manufacturing",
                description:
                  "Many manufacturing processes involve changing the state of materials: melting metals to cast them into shapes, pressurizing gases into cylinders, or freeze-drying food for preservation.",
                icon: "🏭",
                color: "border-l-accent-500",
              },
              {
                title: "Biology and Medicine",
                description:
                  "Living organisms depend on the properties of all states of matter, from solid bones to liquid blood to the gases we breathe. Medical equipment also uses controlled state changes, like sterilization with steam.",
                icon: "🧬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
