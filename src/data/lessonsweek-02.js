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
    {
      id: "lesson-4",
      weekId: "week-2",
      lessonNumber: 4,
      title: "What is Matter?",
      badge: "Lesson 4",
      subtitle:
        "Understand what matter is, what it is made of, and how scientists classify different forms of matter.",
      readTime: "~15 min read",
      xp: 50,
      heroImage: matter,
      heroImageAlt: "Particle simulation of atoms and molecules",

      sections: [
        "Overview",
        "Key Terms",
        "History of Matter",
        "Classification of Matter",
        "Pure Substance vs Mixture",
        "Real-World Scenarios",
      ],

      references: [
        {
          label: "Britannica   Matter",
          url: "https://www.britannica.com/science/matter",
        },
        {
          label: "Khan Academy   Introduction to Chemistry",
          url: "https://www.khanacademy.org/science/chemistry",
        },
        {
          label: "CK-12   What Is Matter?",
          url: "https://www.ck12.org/c/physical-science/matter",
        },
        {
          label: "NIST Chemistry WebBook",
          url: "https://webbook.nist.gov/",
        },
      ],

      layout: [
        // ── Section 0: Intro (always first) ──
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Everything around you, the air you breathe, the water you drink, and the chair you sit on, is made of <strong class='text-primary-700'>matter</strong>. Matter is defined as anything that has <strong class='text-primary-700'>mass</strong> and takes up <strong class='text-primary-700'>volume</strong> (space). From the tiniest grain of sand to the largest mountain, all physical objects are matter.",
              "Matter is made of incredibly tiny particles called <strong class='text-primary-700'>atoms</strong> and <strong class='text-primary-700'>molecules</strong>. These particles are so small that millions of them can fit on the period at the end of this sentence. The <strong class='text-primary-700'>particle model of matter</strong> helps scientists explain why different materials behave the way they do: why ice is hard, water flows, and steam rises.",
            ],
            didYouKnow:
              "A single grain of sand contains about 43 quintillion (43,000,000,000,000,000,000) atoms! The particle model helps us understand matter even at this unimaginably small scale.",
          },
        },

        // ── Section 1: Key Terms ──
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Matter",
                desc: "Anything that has mass and takes up space (volume). All physical objects in the universe are made of matter.",
              },
              {
                term: "Mass",
                desc: "The amount of matter in an object, measured in grams (g) or kilograms (kg). Mass does not change with location.",
              },
              {
                term: "Volume",
                desc: "The amount of three-dimensional space that matter occupies, measured in liters (L) or cubic centimeters (cm3).",
              },
              {
                term: "Density",
                desc: "The amount of mass packed into a given volume. Calculated as Density = Mass divided by Volume. A denser material has more mass per unit of space.",
              },
              {
                term: "Particle",
                desc: "A tiny unit of matter, such as an atom or molecule, that makes up all substances. Particles are too small to see with the naked eye.",
              },
              {
                term: "Pure Substance",
                desc: "Matter made of only one type of particle throughout. Elements (like oxygen) and compounds (like water) are pure substances.",
              },
            ],
          },
        },

        // ── Section 2: History of Matter (timeline) ──
        {
          type: "timeline",
          heading: "History of Matter",
          data: {
            intro:
              "Our understanding of matter has evolved over thousands of years. Here are the key milestones that shaped the modern particle model.",
            steps: [
              {
                num: 1,
                title: "Ancient Greece: The Four Elements (400 BCE)",
                color: "primary",
                description:
                  "Greek philosophers like Empedocles proposed that all matter was made of four elements: earth, water, fire, and air. Aristotle added a fifth called aether for celestial bodies. This idea held for nearly 2,000 years.",
                tip: "These were not elements in the modern sense. They were categories of properties: fire represented heat and dryness, water represented coldness and wetness.",
              },
              {
                num: 2,
                title: "Dalton's Atomic Theory (1803)",
                color: "secondary",
                description:
                  "John Dalton proposed that all matter is made of tiny, indivisible particles called atoms. He stated that atoms of the same element are identical and that chemical reactions rearrange atoms without creating or destroying them.",
                tip: "Dalton's model was mostly correct, but we now know atoms can be split and that isotopes exist within the same element.",
              },
              {
                num: 3,
                title: "Mendeleev's Periodic Table (1869)",
                color: "accent",
                description:
                  "Dmitri Mendeleev organized the known elements by atomic mass and chemical properties, creating the first periodic table. He even left gaps for undiscovered elements and correctly predicted their properties.",
                tip: "The periodic table is still used today and contains 118 confirmed elements, all forms of pure matter.",
              },
              {
                num: 4,
                title: "Thomson and Rutherford: Inside the Atom (1897-1911)",
                color: "primary",
                description:
                  "J.J. Thomson discovered the electron, showing atoms have internal structure. Ernest Rutherford later discovered the nucleus: a tiny, dense, positively charged core at the center of every atom.",
                tip: "Rutherford's gold foil experiment showed that most of an atom is empty space, a fact that still surprises people today.",
              },
              {
                num: 5,
                title: "Modern Particle Model (20th Century)",
                color: "secondary",
                description:
                  "Scientists developed quantum mechanics, revealing that electrons exist in probability clouds around the nucleus. Protons and neutrons are themselves made of quarks. The particle model used in science class is a simplified but powerful version of this picture.",
                tip: "The school-level particle model is accurate enough to explain states of matter, density, and heat without needing quantum mechanics.",
              },
            ],
          },
        },

        // ── Section 3: Classification of Matter (reasonCards) ──
        {
          type: "reasonCards",
          heading: "Classification of Matter",
          data: {
            intro:
              "All matter is classified into two main groups: pure substances and mixtures. Each group is further divided based on how its particles are arranged and combined.",
            reasons: [
              {
                num: 1,
                title: "Element",
                color: "primary",
                desc: "A pure substance made entirely of one type of atom. Elements cannot be broken down into simpler substances by chemical means.",
                content:
                  "There are 118 known elements listed on the periodic table. Examples include oxygen (O), gold (Au), carbon (C), and hydrogen (H). Every atom of the same element is identical.",
              },
              {
                num: 2,
                title: "Compound",
                color: "secondary",
                desc: "A pure substance made of two or more different elements that are chemically bonded together in a fixed ratio.",
                content:
                  "Compounds have different properties from the elements that form them. Water (H₂O) is made of hydrogen and oxygen, yet behaves like neither gas on its own. Other examples: table salt (NaCl), carbon dioxide (CO₂), ammonia (NH₃).",
              },
              {
                num: 3,
                title: "Homogeneous Mixture",
                color: "accent",
                desc: "A mixture that looks and feels uniform throughout. Its particles are evenly distributed and cannot be distinguished by eye.",
                content:
                  "Also called a solution. Examples include salt water, air, vinegar, apple juice, and brass (a metal alloy). The components are still physically combined and can be separated by methods like distillation.",
              },
              {
                num: 4,
                title: "Heterogeneous Mixture",
                color: "primary",
                desc: "A mixture where different substances are visibly distinct. The composition is not uniform and you can see the separate parts.",
                content:
                  "Examples include trail mix, soil, pizza, salad, and granite. Because the substances are only physically combined, they can be separated by hand-sorting, filtering, or other physical methods.",
              },
            ],
          },
        },

        // ── Section 4: Pure Substance vs Mixture (comparison) ──
        {
          type: "comparison",
          heading: "Pure Substance vs Mixture",
          data: {
            intro:
              "Knowing whether something is a pure substance or a mixture helps scientists predict how it will behave and how to separate or use it.",
            left: {
              label: "Pure Substance",
              color: "primary",
              items: [
                "Made of only one kind of particle throughout",
                "Has a fixed, definite composition that never changes",
                "Cannot be separated by physical means (filtering, evaporation)",
                "Has sharp, predictable melting and boiling points",
                "Examples: gold (Au), water (H2O), table salt (NaCl), oxygen (O2)",
              ],
            },
            right: {
              label: "Mixture",
              color: "secondary",
              items: [
                "Made of two or more substances combined physically",
                "Composition can vary, any ratio is possible",
                "Can be separated by physical methods (filtering, distillation, magnetism)",
                "Melts and boils over a range of temperatures, not a fixed point",
                "Examples: air, seawater, soil, trail mix, blood, orange juice",
              ],
            },
          },
        },

        // ── Section 5: Real-World Scenarios ──
        {
          type: "scenario",
          heading: "Real-World Scenarios",
          data: {
            intro:
              "Apply what you have learned about matter to these real-life situations. Think through each one before reading the skill hint.",
            scenarios: [
              {
                title: "The Floating Ice Cube",
                situation:
                  "You drop an ice cube into a glass of water. The ice floats, even though both the ice and the water are made of the exact same substance, H2O.",
                question:
                  "Why does solid ice float on liquid water, even though they are the same substance?",
                skill: "Comparing density of solids and liquids",
              },
              {
                title: "Saltwater at the Beach",
                situation:
                  "Ocean water tastes salty, but if you leave a shallow puddle of seawater in the sun, the water evaporates and leaves behind a white crust of salt.",
                question:
                  "Is seawater a pure substance or a mixture? How does the evaporation experiment prove your answer?",
                skill: "Identifying and separating mixtures",
              },
              {
                title: "Blowing Up a Balloon",
                situation:
                  "When you blow air into a balloon, it expands. The more air you add, the bigger it gets. If you release the balloon without tying it, the air rushes out.",
                question:
                  "Use the particle model to explain why the balloon expands when you blow into it and shrinks when air escapes.",
                skill: "Applying the particle model to gases",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 5 — Particle Theory of Matter
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-5",
      weekId: "week-2",
      lessonNumber: 5,
      title: "Particle Theory of Matter",
      badge: "Lesson 5",
      subtitle:
        "Learn the five core statements of the particle theory and how they explain the behavior of all matter.",
      readTime: "~14 min read",
      xp: 50,
      heroImage: lesson5hero,
      heroImageAlt: "Microscopic view illustrating particle theory",

      sections: [
        "Introduction",
        "Particles by State",
        "Five Statements of Particle Theory",
        "Key Ideas About Particles",
        "Why Particle Theory Matters",
        "Temperature and Particles",
      ],

      references: [
        {
          label: "The Physics Classroom   Thermal Physics",
          url: "https://www.physicsclassroom.com/class/thermalP",
        },
        {
          label: "CK-12   Particle Theory of Matter",
          url: "https://www.ck12.org/c/physical-science/particle-theory",
        },
        {
          label: "PhET   States of Matter: Basics",
          url: "https://phet.colorado.edu/en/simulations/states-of-matter-basics",
        },
        {
          label: "Britannica   Kinetic Theory of Gases",
          url: "https://www.britannica.com/science/kinetic-theory-of-gases",
        },
      ],

      layout: [
        // ── Section 0: Intro (always first) ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>particle theory of matter</strong> is a scientific model that explains the structure and behavior of all matter using five key statements. It tells us that all matter, whether solid, liquid, or gas, is made of tiny particles that are always in motion.",
              "This theory was developed over centuries by scientists who noticed patterns in how materials behave when heated, cooled, or mixed. Today, the particle theory is one of the most important ideas in science because it explains everything from why gases expand when heated to why liquids flow more easily at higher temperatures.",
            ],
            didYouKnow:
              "Even in a solid block of metal, the atoms are never completely still. They vibrate billions of times per second! Temperature measures how fast this vibration is happening.",
          },
        },

        // ── Section 1: Particles by State (imageCards) ──
        {
          type: "imageCards",
          heading: "Particles by State",
          data: {
            cards: [
              {
                title: "Solids",
                label: "Tightly Packed",
                variant: "primary",
                color: "primary",
                desc: "In a solid, particles are arranged in a close, orderly pattern. They vibrate in place but cannot move past one another, which gives solids their fixed shape.",
                image: solid,
                imageAlt: "Solid objects in a laboratory setting",
                examples: [
                  "Particles are very close together with strong forces between them",
                  "Shape and volume do not change unless force is applied",
                  "Examples: iron, ice, wood, rock, plastic",
                ],
              },
              {
                title: "Liquids",
                label: "Flowing Freely",
                variant: "secondary",
                color: "secondary",
                desc: "In a liquid, particles are close together but slide and flow past each other. This is why liquids take the shape of their container while keeping a fixed volume.",
                image: liquid,
                imageAlt: "Liquid in containers",
                examples: [
                  "Particles are close but move freely around each other",
                  "Volume stays the same; shape changes with the container",
                  "Examples: water, mercury, cooking oil, blood",
                ],
              },
              {
                title: "Gases",
                label: "Spread Apart",
                variant: "primary",
                color: "accent",
                desc: "In a gas, particles move very quickly and are far apart from one another. Weak forces between them allow gas particles to spread out and fill any container completely.",
                image: gas,
                imageAlt: "Gas particles spreading out",
                examples: [
                  "Particles move rapidly and are far apart with almost no forces between them",
                  "Gas expands to fill any container it is placed in",
                  "Examples: oxygen, carbon dioxide, steam, helium",
                ],
              },
            ],
          },
        },

        // ── Section 2: Five Statements (timeline) ──
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

        // ── Section 3: Key Ideas (conceptList) ──
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

        // ── Section 4: Why Particle Theory Matters (reasonCards) ──
        {
          type: "reasonCards",
          heading: "Why Particle Theory Matters",
          data: {
            intro:
              "The particle theory is not just a school concept. It powers real scientific breakthroughs and technologies we rely on every day.",
            reasons: [
              {
                num: 1,
                title: "Drug Design",
                color: "primary",
                desc: "Scientists design medicines by understanding how molecules interact with the body at the atomic level.",
                content:
                  "A single extra atom in the wrong place can change a medicine from helpful to harmful. Particle theory guides every step of drug development.",
              },
              {
                num: 2,
                title: "Material Science",
                color: "secondary",
                desc: "Engineers use particle theory to explain why some materials are strong, flexible, or conductive, driving innovations in phones, bridges, and aircraft.",
                content:
                  "Carbon fiber is light yet stronger than steel because of how carbon atoms are bonded and arranged at the particle level.",
              },
              {
                num: 3,
                title: "Climate Science",
                color: "accent",
                desc: "Understanding how gas particles trap heat helps scientists model climate change and predict temperature changes on Earth.",
                content:
                  "Greenhouse gases like CO2 absorb infrared radiation because of how their molecules vibrate, a direct application of particle theory.",
              },
              {
                num: 4,
                title: "Food Preservation",
                color: "primary",
                desc: "Freeze-drying, refrigeration, and pasteurization all rely on particle theory to slow spoilage and kill bacteria in food.",
                content:
                  "Lowering temperature slows particle movement in bacteria, reducing their ability to reproduce and spoil food.",
              },
            ],
          },
        },

        // ── Section 5: Temperature and Particles (comparison) ──
        {
          type: "comparison",
          heading: "Temperature and Particles",
          data: {
            intro:
              "Temperature has a direct effect on how particles move and behave. Compare how particles act at high temperature versus low temperature.",
            left: {
              label: "High Temperature",
              color: "primary",
              items: [
                "Particles move very fast and have high kinetic energy",
                "Particles spread farther apart from each other",
                "Intermolecular forces are harder to maintain and the substance may change state",
                "Gases expand and exert more pressure on their containers",
                "More likely for a substance to be in a liquid or gas state",
              ],
            },
            right: {
              label: "Low Temperature",
              color: "secondary",
              items: [
                "Particles move slowly and have low kinetic energy",
                "Particles stay closer together and vibrate less",
                "Intermolecular forces are stronger relative to particle motion",
                "Gases contract and exert less pressure on their containers",
                "More likely for a substance to be in a solid or liquid state",
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
      lessonNumber: 6,
      title: "States of Matter",
      badge: "Lesson 6",
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
