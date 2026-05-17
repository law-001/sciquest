// Week 2: Particle Model of Matter — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";

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
      readTime: "~12 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt: "Particle simulation of atoms and molecules",

      sections: ["Overview", "Key Terms", "States at a Glance", "Applications"],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Everything around you — the air you breathe, the water you drink, the chair you sit on — is made of <strong class='text-primary-700'>matter</strong>. Matter is defined as anything that has <strong class='text-primary-700'>mass</strong> and takes up <strong class='text-primary-700'>volume</strong> (space). From the tiniest grain of sand to the largest mountain, all physical objects are matter.",
              "Matter is made of incredibly tiny particles called <strong class='text-primary-700'>atoms</strong> and <strong class='text-primary-700'>molecules</strong>. These particles are so small that millions of them can fit on the period at the end of this sentence. The <strong class='text-primary-700'>particle model of matter</strong> helps scientists explain why different materials behave the way they do — why ice is hard, water flows, and steam rises.",
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
                desc: "The amount of three-dimensional space that matter occupies, measured in liters (L) or cubic centimeters (cm³).",
              },
              {
                term: "Density",
                desc: "The amount of mass packed into a given volume. Calculated as Density = Mass ÷ Volume. A denser material has more mass per unit of space.",
              },
              {
                term: "Particle",
                desc: "A tiny unit of matter — such as an atom or molecule — that makes up all substances. Particles are too small to see with the naked eye.",
              },
              {
                term: "Pure Substance",
                desc: "Matter made of only one type of particle throughout. Elements (like oxygen) and compounds (like water) are pure substances.",
              },
            ],
          },
        },

        // ── Section 2: States at a Glance (imageCards) ──
        {
          type: "imageCards",
          heading: "States at a Glance",
          data: {
            cards: [
              {
                title: "Solids",
                label: "Fixed Shape",
                variant: "primary",
                color: "primary",
                desc: "Solids have a fixed shape and a fixed volume. Their particles are tightly packed in a regular arrangement and vibrate in place.",
                image: lab,
                imageAlt: "Solid objects in a laboratory setting",
                examples: [
                  "Particles are very close together with strong forces between them",
                  "Shape and volume do not change unless force is applied",
                  "Examples: iron, ice, wood, rock, plastic",
                ],
              },
              {
                title: "Liquids",
                label: "Fixed Volume",
                variant: "secondary",
                color: "secondary",
                desc: "Liquids have a fixed volume but no fixed shape — they take the shape of their container. Particles are close but can slide past each other.",
                image: equation,
                imageAlt: "Liquid in containers",
                examples: [
                  "Particles are close together but move freely around each other",
                  "Volume stays the same; shape changes with the container",
                  "Examples: water, mercury, cooking oil, blood",
                ],
              },
              {
                title: "Gases",
                label: "No Fixed Shape",
                variant: "primary",
                color: "primary",
                desc: "Gases have no fixed shape and no fixed volume. Their particles move very fast and spread out to fill any container completely.",
                image: simulation,
                imageAlt: "Gas particles spreading out in a simulation",
                examples: [
                  "Particles move rapidly and are far apart with almost no forces between them",
                  "Gas expands to fill any container it is placed in",
                  "Examples: oxygen, carbon dioxide, steam, helium",
                ],
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
                title: "Food and Cooking",
                description:
                  "Understanding matter helps explain how food changes when cooked. Fats, proteins, and carbohydrates are all forms of matter that transform when heat is applied.",
                icon: "🍳",
                color: "border-l-primary-500",
              },
              {
                title: "Air We Breathe",
                description:
                  "Air is a mixture of gases — nitrogen, oxygen, carbon dioxide, and others. The particle model explains how these gases mix and how our lungs absorb oxygen.",
                icon: "💨",
                color: "border-l-secondary-500",
              },
              {
                title: "Water in Nature",
                description:
                  "Water exists as a solid (ice), liquid (water), and gas (water vapor) on Earth. Its particle arrangement changes with temperature — a key concept in weather and climate.",
                icon: "💧",
                color: "border-l-accent-500",
              },
              {
                title: "Metals in Technology",
                description:
                  "Metals are solids with densely packed particles. Engineers use knowledge of mass, volume, and density to choose the right metal for bridges, aircraft, and electronics.",
                icon: "⚙️",
                color: "border-l-primary-500",
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
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt: "Microscopic view illustrating particle theory",

      sections: [
        "Introduction",
        "Five Statements of Particle Theory",
        "Key Ideas About Particles",
        "Temperature and Particles",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>particle theory of matter</strong> is a scientific model that explains the structure and behavior of all matter using five key statements. It tells us that all matter — whether solid, liquid, or gas — is made of tiny particles that are always in motion.",
              "This theory was developed over centuries by scientists who noticed patterns in how materials behave when heated, cooled, or mixed. Today, the particle theory is one of the most important ideas in science because it explains everything from why gases expand when heated to why liquids flow more easily at higher temperatures.",
            ],
            didYouKnow:
              "Even in a solid block of metal, the atoms are never completely still — they vibrate billions of times per second! Temperature measures how fast this vibration is happening.",
          },
        },

        // ── Section 1: Five Statements (timeline) ──
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
                  "Every substance — solid, liquid, or gas — is made up of extremely small particles called atoms or molecules. These particles are too small to see with the naked eye, even with most microscopes.",
                tip: "Think of a glass of water: it looks smooth, but it is really billions of water molecules packed together.",
              },
              {
                num: 2,
                title: "Particles Are in Constant Motion",
                color: "secondary",
                description:
                  "All particles of matter are constantly moving. In solids, they vibrate in place. In liquids, they slide around each other. In gases, they move rapidly in all directions. This motion never completely stops — even at very cold temperatures.",
                tip: "The faster the particles move, the more kinetic energy they have — and the warmer the substance feels.",
              },
              {
                num: 3,
                title: "There Is Empty Space Between Particles",
                color: "accent",
                description:
                  "Particles of matter do not touch each other — there are spaces between them. In solids, the spaces are very small. In liquids, spaces are a bit larger. In gases, there is a great deal of empty space between particles.",
                tip: "This is why gases can be compressed (squeezed into a smaller container) but solids and liquids cannot be compressed as easily.",
              },
              {
                num: 4,
                title: "Particles Attract Each Other",
                color: "primary",
                description:
                  "Particles exert attractive forces on each other. These forces are called intermolecular forces. In solids, the forces are very strong and hold particles tightly together. In liquids, forces are weaker. In gases, the forces are very weak.",
                tip: "Strong attractive forces = rigid solid. Weak attractive forces = freely moving gas.",
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

        // ── Section 2: Concept List ──
        {
          type: "conceptList",
          heading: "Key Ideas About Particles",
          data: {
            concepts: [
              "All particles of matter are in constant motion — they never completely stop moving, even in solids.",
              "The amount of empty space between particles determines how easily a substance can be compressed.",
              "Intermolecular forces (attractions between particles) determine whether a substance is a solid, liquid, or gas at a given temperature.",
              "When a substance is heated, its particles absorb energy and move faster, which can cause the substance to expand or change state.",
              "The particle model explains observable properties of matter — like why liquids flow, gases expand, and solids hold their shape.",
              "The particle theory is a model, not a perfect picture of reality — but it is extremely useful for predicting and explaining the behavior of matter.",
            ],
          },
        },

        // ── Section 3: Comparison ──
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
                "Intermolecular forces are harder to maintain — substance may change state",
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
        "Compare the properties of solids, liquids, gases, and the rare fourth state of matter — plasma.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: equation,
      heroImageAlt: "Diagram showing the three main states of matter",

      sections: ["Introduction", "Key Terms", "Solid vs. Gas", "Applications"],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Matter exists in different <strong class='text-primary-700'>physical states</strong> depending on how its particles are arranged and how much energy they have. The three main states of matter are <strong class='text-primary-700'>solid</strong>, <strong class='text-primary-700'>liquid</strong>, and <strong class='text-primary-700'>gas</strong>. Each state has distinct properties that are determined by the spacing, motion, and attraction between its particles.",
              "There is also a rare fourth state of matter called <strong class='text-primary-700'>plasma</strong>. Plasma occurs at extremely high temperatures when electrons are stripped from atoms, creating an electrically charged gas. Examples include lightning, the sun, and neon signs.",
            ],
            didYouKnow:
              "More than 99% of all visible matter in the universe is in the plasma state — found in stars like our sun. Plasma is actually the most common state of matter in the universe, even though we rarely see it on Earth!",
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
                term: "Volume",
                desc: "The amount of three-dimensional space occupied by matter. Liquids and solids have a definite volume; gases do not.",
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
                "Definite shape — does not change without force",
                "Definite volume — does not expand to fill a container",
                "Particles are tightly packed in a fixed, regular arrangement",
                "Very strong intermolecular forces hold particles together",
                "Examples: ice, iron, wood, rock, plastic",
              ],
            },
            right: {
              label: "Gas",
              color: "secondary",
              items: [
                "No definite shape — takes the shape of any container",
                "No definite volume — expands to completely fill any container",
                "Particles are far apart and move rapidly in all directions",
                "Very weak intermolecular forces — particles move almost freely",
                "Examples: oxygen, steam, carbon dioxide, helium, air",
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
                title: "Cooking and Food Science",
                description:
                  "Cooking involves all three states of matter. Ice melts to water (solid to liquid), water boils to steam (liquid to gas), and understanding these states helps chefs control texture and flavor.",
                icon: "🍽️",
                color: "border-l-primary-500",
              },
              {
                title: "Weather and Atmosphere",
                description:
                  "Water naturally cycles between solid (snow/ice), liquid (rain), and gas (water vapor) in the atmosphere. The study of these changes is fundamental to meteorology and climate science.",
                icon: "🌦️",
                color: "border-l-secondary-500",
              },
              {
                title: "Manufacturing",
                description:
                  "Many manufacturing processes involve changing the state of materials — melting metals to cast them into shapes, pressurizing gases into cylinders, or freeze-drying food for preservation.",
                icon: "🏭",
                color: "border-l-accent-500",
              },
              {
                title: "Biology and Medicine",
                description:
                  "Living organisms depend on the properties of all states of matter — from solid bones to liquid blood to the gases we breathe. Medical equipment also uses controlled state changes, like sterilization with steam.",
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
