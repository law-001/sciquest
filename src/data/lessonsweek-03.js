// Week 3: Phases of Matter — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 3.
//   Lesson 1 — Different Phases of Matter
//   Lesson 2 — Creation of Performance Task 1:
//              "The States of Matter Adventure: A Comic Strip Journey"

import lesson5hero from "../assets/week2/lesson5hero.jpg";
import solid from "../assets/week2/solid.webp";
import liquid from "../assets/week2/liquid.jpg";
import gas from "../assets/week2/gas.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week03 = {
  id: "week-3",
  weekNumber: 3,
  title: "Phases of Matter",
  category: "Matter",
  description:
    "Compare the different phases of matter — including plasma and Bose-Einstein condensate — then build Performance Task 1, a comic strip journey through the states of matter.",
  icon: "Thermometer",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Different Phases of Matter
    // ═══════════════════════════════════════════════════
    {
      id: "w03-l1",
      weekId: "week-3",
      lessonNumber: 1,
      title: "Different Phases of Matter",
      badge: "Lesson 1",
      subtitle:
        "Go beyond solid, liquid, and gas — compare all five phases of matter and learn what decides which phase a substance is in.",
      readTime: "~14 min read",
      xp: 50,
      heroImage: lesson5hero,
      heroImageAlt: "Illustration comparing the different phases of matter",

      signature: {
        widgetId: "phase-bench",
        heading: "Watch It: One Substance, Five Phases",
        intro:
          "One slider takes the same handful of particles from a hair above absolute zero to star-hot. Watch them merge into a blur, lock into a lattice, break loose, fly free, and finally tear into charged ions and loose electrons.",
        instruction: "Reach all five phases",
        xp: 25,
      },

      sections: [
        "Introduction",
        "Key Terms",
        "The Three Common Phases",
        "Two More Phases",
        "What Decides the Phase?",
        "Applications",
      ],

      references: [
        {
          label: "Britannica — States of Matter",
          url: "https://www.britannica.com/science/state-of-matter",
        },
        {
          label: "NASA Science — What Is Plasma?",
          url: "https://science.nasa.gov/heliophysics/focus-areas/what-is-plasma/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "A <strong class='text-primary-700'>phase of matter</strong> (also called a state of matter) is a distinct form that matter takes, decided by how its particles are arranged, how fast they move, and how strongly they pull on one another. Solid, liquid, and gas are the three phases you meet every day.",
              "But they are not the only ones. Scientists also recognise <strong class='text-primary-700'>plasma</strong> — by far the most common phase in the universe — and <strong class='text-primary-700'>Bose-Einstein condensate</strong>, a phase that only appears within a whisker of absolute zero. In this lesson you compare all five and learn what pushes a substance from one into another.",
            ],
            didYouKnow:
              "More than 99% of the visible matter in the universe is plasma. Every star, including the Sun, is a giant ball of it — which makes solid, liquid and gas the unusual phases, not the normal ones.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Phase of Matter",
                desc: "A distinct form that matter takes, determined by the arrangement, motion, and attraction of its particles. Also called a state of matter.",
              },
              {
                term: "Definite Shape",
                desc: "A shape that stays the same no matter what container the substance is placed in. Only solids have a definite shape.",
              },
              {
                term: "Definite Volume",
                desc: "An amount of space that stays the same regardless of the container. Solids and liquids have a definite volume; gases do not.",
              },
              {
                term: "Fluid",
                desc: "Any substance that can flow and take the shape of its container. Both liquids and gases are fluids.",
              },
              {
                term: "Plasma",
                desc: "A phase of matter formed at extremely high temperatures in which particles gain so much energy that electrons are stripped away, leaving charged particles that conduct electricity.",
              },
              {
                term: "Bose-Einstein Condensate (BEC)",
                desc: "A phase formed at temperatures near absolute zero (−273 °C), where particles slow almost to a stop and behave as a single unified group.",
              },
              {
                term: "Absolute Zero",
                desc: "The lowest possible temperature, −273.15 °C, at which particle motion is at its absolute minimum.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "The Three Common Phases",
          data: {
            cards: [
              {
                title: "Solid",
                label: "Definite shape and volume",
                variant: "primary",
                color: "primary",
                desc: "Particles are packed closely in a fixed, regular pattern and only vibrate in place. Attractive forces are strong enough to hold every particle where it is.",
                image: solid,
                imageAlt: "Particle diagram of a solid",
                examples: [
                  "Shape: definite · Volume: definite",
                  "Very difficult to compress",
                  "Examples: ice, iron, wood, rock, glass",
                ],
              },
              {
                title: "Liquid",
                label: "Definite volume only",
                variant: "secondary",
                color: "secondary",
                desc: "Particles are still close together but have enough energy to slide past one another, so the substance flows and takes the shape of whatever holds it.",
                image: liquid,
                imageAlt: "Particle diagram of a liquid",
                examples: [
                  "Shape: takes the container · Volume: definite",
                  "Difficult to compress — the particles are already close",
                  "Examples: water, cooking oil, milk, mercury",
                ],
              },
              {
                title: "Gas",
                label: "Neither shape nor volume",
                variant: "primary",
                color: "accent",
                desc: "Particles are far apart and move rapidly in every direction. Attractive forces are so weak that the particles spread out to fill any space available.",
                image: gas,
                imageAlt: "Particle diagram of a gas",
                examples: [
                  "Shape: takes the container · Volume: takes the container",
                  "Easy to compress — mostly empty space",
                  "Examples: oxygen, helium, carbon dioxide, water vapour",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Two More Phases",
          data: {
            intro:
              "Add enough energy and matter goes past gas. Take almost all of it away and matter goes below solid. These two extreme phases sit at either end of the temperature scale.",
            left: {
              label: "Plasma — the hot extreme",
              color: "primary",
              items: [
                "Formed at extremely high temperatures or under strong electric fields",
                "Particles gain so much energy that electrons are torn away from atoms",
                "Made of charged particles, so plasma conducts electricity and responds to magnets",
                "Glows, because energised particles release light",
                "Examples: the Sun and all stars, lightning, neon signs, the aurora",
              ],
            },
            right: {
              label: "Bose-Einstein Condensate — the cold extreme",
              color: "secondary",
              items: [
                "Formed within a fraction of a degree of absolute zero (−273.15 °C)",
                "Particles lose almost all their motion energy and slow nearly to a stop",
                "Separate particles begin behaving as one single unified group",
                "Cannot occur naturally on Earth — it is made in laboratories",
                "First produced in 1995, seventy years after it was predicted",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "What Decides the Phase?",
          data: {
            concepts: [
              "The phase of a substance is decided by a tug-of-war between the motion energy of its particles and the attractive forces pulling them together.",
              "When attraction wins, particles lock into place and the substance is a solid.",
              "When motion and attraction are roughly balanced, particles stay close but slide — the substance is a liquid.",
              "When motion wins, particles escape one another entirely and the substance is a gas.",
              "Adding heat increases motion energy and pushes a substance toward gas; removing heat decreases it and pushes toward solid.",
              "Pressure matters too — squeezing a gas forces its particles closer together and can turn it into a liquid without cooling it.",
              "The same substance can exist in any phase. Water is ice, liquid water, or steam depending only on temperature and pressure.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Plasma Screens and Lighting",
                description:
                  "Fluorescent tubes, neon signs, and plasma televisions all work by energising a gas until it becomes glowing plasma.",
                icon: "💡",
                color: "border-l-primary-500",
              },
              {
                title: "Liquefied Petroleum Gas",
                description:
                  "LPG tanks store fuel as a liquid under pressure. Releasing the pressure lets it return to gas so it can burn in a stove.",
                icon: "🔥",
                color: "border-l-secondary-500",
              },
              {
                title: "Weather and the Water Cycle",
                description:
                  "Water moves between all three common phases — ice, liquid, and vapour — as it cycles through the atmosphere, oceans, and land.",
                icon: "🌧️",
                color: "border-l-accent-500",
              },
              {
                title: "Ultra-Cold Physics",
                description:
                  "Bose-Einstein condensates let scientists study quantum behaviour at a size they can actually observe, guiding research into superconductors.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Creation of Performance Task 1
    // ═══════════════════════════════════════════════════
    {
      id: "w03-l2",
      weekId: "week-3",
      lessonNumber: 2,
      title:
        'Creation of Performance Task 1: "The States of Matter Adventure: A Comic Strip Journey"',
      badge: "Performance Task 1",
      subtitle:
        "Turn everything you know about the phases of matter into a comic strip that follows one particle on a journey through solid, liquid, and gas.",
      readTime: "~12 min read",
      xp: 100,
      heroImage: flowchart,
      heroImageAlt:
        "Storyboard panels laid out for a science comic strip project",

      sections: [
        "The Task",
        "What You Will Need",
        "Building Your Comic Strip",
        "How You Will Be Graded",
        "Tips for a Strong Comic",
        "Why This Task Matters",
      ],

      references: [
        {
          label: "Britannica — States of Matter",
          url: "https://www.britannica.com/science/state-of-matter",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "The Task",
          data: {
            paragraphs: [
              "You are going to create a <strong class='text-primary-700'>comic strip</strong> that tells the story of one particle travelling through the states of matter. Your particle starts out locked inside a solid, is heated until it breaks free into a liquid, and finally escapes as a gas — then makes the return journey home.",
              "This is a <strong class='text-primary-700'>performance task</strong>, which means you are being assessed on how well you can <em>apply</em> what you have learned, not on how well you can memorise it. Your comic must be scientifically accurate: every panel has to show particle arrangement, motion, and energy correctly.",
            ],
            didYouKnow:
              "Scientists use comics and storyboards for real work. NASA and CERN both publish illustrated explainers, because a picture sequence can carry an idea that a paragraph of text cannot.",
          },
        },

        {
          type: "keyTerms",
          heading: "What You Will Need",
          data: {
            terms: [
              {
                term: "Paper or digital canvas",
                desc: "A short bond paper, cartolina, or any drawing app. A minimum of six panels — more if your story needs them.",
              },
              {
                term: "Colouring materials",
                desc: "Pencils, crayons, markers, or digital colours. Use colour consistently: pick one colour for your particle and keep it the same in every panel.",
              },
              {
                term: "A main character",
                desc: "One particle, given a name and a face. Everything the reader learns comes from what happens to this character.",
              },
              {
                term: "Speech bubbles and captions",
                desc: "Speech bubbles for what your particle says or feels; captions for the scientific narration that names the process happening.",
              },
              {
                term: "Correct vocabulary",
                desc: "Melting, freezing, evaporation, condensation, sublimation, deposition, kinetic energy, attractive forces. Spell them correctly.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Building Your Comic Strip",
          data: {
            intro:
              "Work through these steps in order. Do not start drawing the final version until step four — planning first will save you from redrawing panels.",
            steps: [
              {
                num: 1,
                title: "Plan Your Story",
                color: "primary",
                description:
                  "Decide what substance your particle belongs to. Water is the easiest because you have seen all of its states, but you could choose chocolate, candle wax, or dry ice. Write a one-sentence summary of the journey before drawing anything.",
                tip: "Choosing a substance you have actually watched change makes every panel easier to get right.",
              },
              {
                num: 2,
                title: "Storyboard the Panels",
                color: "secondary",
                description:
                  "Sketch rough boxes and write what happens in each. A minimum of six panels: starting solid, heating, melting, liquid, evaporating, and gas. Add panels for the return journey if you want full marks for completeness.",
                tip: "Keep the sketches rough and fast — this stage is about the order of events, not the artwork.",
              },
              {
                num: 3,
                title: "Get the Science Right",
                color: "accent",
                description:
                  "In every panel, check three things: are the particles arranged correctly for that state, is the spacing right, and does the movement shown match the energy level? A solid panel must show a regular pattern; a gas panel must show wide spacing.",
                tip: "Draw the other particles around your main character too — one lonely particle cannot show arrangement.",
              },
              {
                num: 4,
                title: "Draw and Colour the Final Version",
                color: "primary",
                description:
                  "Redraw your storyboard neatly. Keep your main particle the same colour and shape throughout so the reader can follow it. Use motion lines to show vibration in the solid and fast movement in the gas.",
                tip: "Neatness counts, but accuracy counts more. A simple clear drawing beats a detailed confusing one.",
              },
              {
                num: 5,
                title: "Add Captions and Labels",
                color: "secondary",
                description:
                  "Name the process in each transition panel — melting, evaporation, condensation, and so on. Add a caption explaining what is happening to the energy and to the attractive forces between particles.",
                tip: "Every transition panel should name the process AND say whether energy is being absorbed or released.",
              },
              {
                num: 6,
                title: "Check and Submit",
                color: "accent",
                description:
                  "Read your comic as though you were a classmate seeing it for the first time. Does the story make sense? Is every scientific term spelled correctly? Write your name and section, then submit on the due date.",
                tip: "Swap with a partner and check each other's science before submitting — a second reader catches errors you cannot see.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "How You Will Be Graded",
          data: {
            intro:
              "Your comic strip is marked out of 100 points across four criteria. Read these before you start so you know where the marks are.",
            left: {
              label: "Science Content — 50 points",
              color: "primary",
              items: [
                "Particle arrangement is correct in every panel (20 pts)",
                "All required state changes appear and are correctly named (15 pts)",
                "Energy is correctly described as absorbed or released (10 pts)",
                "Scientific vocabulary is used and spelled correctly (5 pts)",
              ],
            },
            right: {
              label: "Presentation — 50 points",
              color: "secondary",
              items: [
                "Story is clear and follows a logical sequence (15 pts)",
                "Minimum of six panels, neatly drawn and coloured (15 pts)",
                "Captions and speech bubbles are readable and relevant (10 pts)",
                "Creativity and originality of the story (10 pts)",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Tips for a Strong Comic",
          data: {
            concepts: [
              "Give your particle a personality — a character who complains about being squeezed in the solid makes the science memorable.",
              "Show the other particles around your main character. Arrangement is half the marks, and you cannot show arrangement with one particle.",
              "Use motion lines: small shaky lines for vibrating solid particles, longer streaks for fast-moving gas particles.",
              "Remember that temperature stays constant during a state change — a panel where the thermometer holds still while ice melts shows real understanding.",
              "Do not forget the return journey. Condensation and freezing are just as important as melting and evaporation.",
              "If you choose sublimation (dry ice) or deposition (frost), say so clearly — skipping the liquid stage must be obvious in the drawing.",
              "Keep your panels in a clear reading order with numbers or arrows so the reader never gets lost.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Why This Task Matters",
          data: {
            apps: [
              {
                title: "Explaining Science Visually",
                description:
                  "Turning an invisible process into a picture sequence is exactly what science communicators, textbook illustrators, and museum designers do for a living.",
                icon: "🎨",
                color: "border-l-primary-500",
              },
              {
                title: "Checking Your Own Understanding",
                description:
                  "You cannot draw a particle diagram wrong and not notice. Drawing forces you to decide exactly how particles sit — which reveals gaps that reading never would.",
                icon: "🔍",
                color: "border-l-secondary-500",
              },
              {
                title: "Storytelling in Science",
                description:
                  "Following one particle through a journey is the same narrative trick used in documentaries that follow a single water drop through the water cycle.",
                icon: "📖",
                color: "border-l-accent-500",
              },
              {
                title: "Preparing for the Summative Test",
                description:
                  "Everything in this comic — arrangement, energy, and the six state changes — is assessed in the First Summative Test next week.",
                icon: "📝",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
