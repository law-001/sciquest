// Week 13: Plant and Animal Cell — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd term Week 13.
//   Lesson 1 — Plant and Animal Cell

import plantcell from "../assets/plantcell.png";
import microscope from "../assets/week1/Microscopic.jpg";
import globe from "../assets/week1/globe.jpg";
import simulation from "../assets/week1/simulation.jpg";

export const week13 = {
  id: "week-13",
  weekNumber: 13,
  title: "Plant and Animal Cell",
  category: "Life Science",
  description:
    "Compare plant and animal cells side by side — what they share, what belongs only to plants, and what belongs only to animals.",
  icon: "Leaf",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Plant and Animal Cell
    // ═══════════════════════════════════════════════════
    {
      id: "w13-l1",
      weekId: "week-13",
      lessonNumber: 1,
      title: "Plant and Animal Cell",
      badge: "Lesson 1",
      subtitle:
        "Both are eukaryotic and share most of their organelles — but three structures belong only to plants and two only to animals, and each difference explains how the organism lives.",
      readTime: "~18 min read",
      xp: 100,
      heroImage: plantcell,
      heroImageAlt:
        "Labelled diagram of a plant cell showing its internal structures",

      signature: {
        widgetId: "cell-morph",
        heading: "Watch It: One Cell, Both Kinds",
        intro:
          "One slider drags an animal cell into a plant cell. The shared structures never move at all through the whole morph; the wall, the vacuole and the chloroplasts grow in and label themselves as they appear. Then flood both with pure water — one stops firm against its wall, the other has nothing to stop it.",
        instruction: "Morph both ways, then flood both cells",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "Plant vs. Animal Cells",
        "Structure Gallery",
        "Unique to Plant Cells",
        "Unique to Animal Cells",
        "Real-Life Cell Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Plant and Animal Cells",
          url: "https://www.khanacademy.org/science/biology/structure-of-a-cell",
        },
        {
          label: "Britannica — Plant Cell",
          url: "https://www.britannica.com/science/plant-cell",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Plant and animal cells are both <strong class='text-primary-700'>eukaryotic</strong> — each has a membrane-bound nucleus and a full set of organelles. They share the cell membrane, cytoplasm, nucleus, mitochondria, ribosomes, endoplasmic reticulum, Golgi apparatus, and vacuoles.",
              "But plant cells have three structures animal cells do not: a rigid <strong class='text-primary-700'>cell wall</strong>, <strong class='text-primary-700'>chloroplasts</strong> for photosynthesis, and a large <strong class='text-primary-700'>central vacuole</strong>. Animal cells in turn have <strong class='text-primary-700'>centrioles</strong> and rely far more heavily on lysosomes.",
              "None of these differences is arbitrary. Plants are rooted in place and must make their own food, hold themselves upright without a skeleton, and manage water. Animals move, hunt, and must digest what they eat. Every structural difference follows from those two ways of living.",
            ],
            didYouKnow:
              "A plant cell can be 10 to 100 times larger than a typical animal cell — largely because of the giant central vacuole, which can fill up to 90% of the cell's interior when full of water.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Cell Wall",
                desc: "A rigid outer layer of cellulose surrounding plant cells, providing structural support, protection, and a fixed shape.",
              },
              {
                term: "Chloroplast",
                desc: "The plant organelle containing chlorophyll where photosynthesis happens — converting sunlight, water, and carbon dioxide into glucose and oxygen.",
              },
              {
                term: "Chlorophyll",
                desc: "The green pigment inside chloroplasts that absorbs red and blue light and reflects green, which is why plants look green.",
              },
              {
                term: "Central Vacuole",
                desc: "A large membrane-bound sac in plant cells storing water, nutrients, and waste, and maintaining turgor pressure.",
              },
              {
                term: "Turgor Pressure",
                desc: "The pressure of water in the central vacuole pushing outward against the cell wall — what keeps non-woody plants standing upright.",
              },
              {
                term: "Photosynthesis",
                desc: "The process by which chloroplasts use light energy to convert carbon dioxide and water into glucose and oxygen.",
              },
              {
                term: "Plastid",
                desc: "A family of plant organelles including chloroplasts (photosynthesis), leucoplasts (starch storage), and chromoplasts (colour pigments).",
              },
              {
                term: "Centriole",
                desc: "Paired cylindrical structures in animal cells that organise the spindle fibres needed to separate chromosomes during cell division.",
              },
              {
                term: "Lysosome",
                desc: "A membrane-bound organelle full of digestive enzymes that break down waste, worn-out organelles, and engulfed bacteria.",
              },
              {
                term: "Cilia and Flagella",
                desc: "Hair-like and whip-like extensions built from microtubules that move substances across a cell surface or propel the cell itself.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Plant vs. Animal Cells",
          data: {
            intro:
              "Five differences matter most. Learn these as a pair-by-pair contrast rather than two separate lists.",
            left: {
              label: "Plant Cell",
              color: "primary",
              items: [
                "Has a cell wall of cellulose for rigid structure and protection",
                "One large central vacuole storing water and maintaining turgor",
                "Rectangular, fixed shape because of the rigid wall",
                "Makes its own food by photosynthesis using chloroplasts",
                "No centrioles — organises division by other means",
              ],
            },
            right: {
              label: "Animal Cell",
              color: "secondary",
              items: [
                "No cell wall — only the flexible cell membrane",
                "Many small vacuoles for temporary storage",
                "Rounded, irregular shape that can change",
                "Gets energy from food through cellular respiration",
                "Has centrioles that organise spindle fibres during division",
              ],
            },
          },
        },

        {
          type: "imageCards",
          heading: "Structure Gallery",
          data: {
            cards: [
              {
                title: "Shared Structures",
                label: "Both Cell Types",
                variant: "primary",
                color: "primary",
                desc: "These organelles appear in both plant and animal cells and handle the basic business of staying alive.",
                image: microscope,
                imageAlt:
                  "Diagram showing organelles common to both plant and animal cells",
                examples: [
                  "Nucleus — DNA and control centre",
                  "Mitochondria — ATP energy production",
                  "Ribosomes, ER, and Golgi — protein production and shipping",
                ],
              },
              {
                title: "Plant Cell Only",
                label: "Unique to Plants",
                variant: "secondary",
                color: "secondary",
                desc: "These three structures are found only in plant cells, and each one solves a problem specific to being a plant.",
                image: globe,
                imageAlt:
                  "Diagram of plant cell showing chloroplasts and central vacuole",
                examples: [
                  "Cell wall — rigid cellulose support",
                  "Chloroplasts — photosynthesis",
                  "Central vacuole — water storage and turgor pressure",
                ],
              },
              {
                title: "Animal Cell Only",
                label: "Unique to Animals",
                variant: "primary",
                color: "primary",
                desc: "Animal cells have specialised structures for precise cell division, movement, and internal digestion.",
                image: simulation,
                imageAlt:
                  "Diagram of animal cell showing centrioles and lysosomes",
                examples: [
                  "Centrioles — organise spindle fibres in cell division",
                  "Prominent lysosomes — cellular digestion",
                  "Cilia and flagella — movement",
                ],
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Unique to Plant Cells",
          data: {
            concepts: [
              "The cell wall is built from cellulose fibres in layers, giving enormous tensile strength — this is what lets a tree support its own weight with no skeleton at all.",
              "Chloroplasts have a double membrane and contain stacks of internal membranes called thylakoids, where light is actually captured.",
              "The central vacuole can occupy up to 90% of a mature plant cell's volume, storing water, sugars, salts, and even chemicals that deter animals from eating the plant.",
              "Turgor pressure from the full vacuole presses the membrane against the wall, keeping soft plants firm and upright. When a plant wilts, the vacuoles have lost water — watering refills them and the plant stands again.",
              "Chromoplasts are plastids holding red, orange, and yellow pigments — the colour of ripe tomatoes, carrots, and flower petals.",
              "Leucoplasts are colourless plastids that store starch in roots and tubers, which is why the inside of a potato is white and starchy.",
              "The cell wall is non-selective: it lets almost everything pass. All the selecting is still done by the membrane underneath it.",
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Unique to Animal Cells",
          data: {
            concepts: [
              "Animal cells have no cell wall, which is exactly what lets them change shape, move, and squeeze through narrow gaps.",
              "Centrioles are paired cylinders near the nucleus that organise the spindle fibres pulling chromosomes apart during division.",
              "Lysosomes hold powerful digestive enzymes that break down worn-out organelles, engulfed bacteria, and food particles.",
              "Cilia are short and numerous — cells lining your windpipe carry about 200 each, beating up to 1,000 times a minute to sweep mucus and dust out of your lungs.",
              "Flagella are long and usually single. The classic example is the tail of a sperm cell, which whips to propel it forward.",
              "Because there is no rigid wall, an animal cell placed in pure water can swell and burst — a plant cell in the same water is held safely by its wall.",
              "Animal cells store energy as glycogen rather than starch, and have many small vacuoles instead of one large one.",
            ],
          },
        },

        {
          type: "scenario",
          heading: "Real-Life Cell Scenarios",
          data: {
            intro:
              "Each scenario turns on one structural difference between plant and animal cells. Work out which one before reading the answer.",
            scenarios: [
              {
                title: "The Wilting Plant",
                situation:
                  "A potted plant is left unwatered for three days and droops completely. After watering, it stands fully upright again within a few hours — with no visible damage.",
                question:
                  "Which structure is responsible for the drooping and the recovery? Why does the plant not simply die?",
                skill:
                  "The central vacuole. Without water it shrinks and turgor pressure is lost, so the cells go limp and the plant droops. Watering refills the vacuoles, pressure returns, and the plant stands again — the cells were never damaged, only deflated.",
              },
              {
                title: "Cells in Pure Water",
                situation:
                  "A scientist places a plant cell and an animal cell in pure distilled water. Water enters both. The plant cell swells firm and stops. The animal cell swells and bursts.",
                question:
                  "Why did one survive and the other did not? Name the structure responsible.",
                skill:
                  "The cell wall. It is rigid enough to resist the outward pressure once the plant cell is full, so swelling stops safely. The animal cell has only a flexible membrane with nothing to resist the pressure, so it keeps expanding until it ruptures.",
              },
              {
                title: "Cilia Clearing the Airways",
                situation:
                  "You breathe in air containing dust, pollen, and bacteria. These get trapped in the sticky mucus lining your windpipe.",
                question:
                  "How does your body move these particles back out before they reach the lungs?",
                skill:
                  "The cells lining the trachea are covered in cilia, which beat in coordinated waves to sweep the mucus — and everything trapped in it — upward toward the throat. This is called the mucociliary escalator, and only animal cells have it.",
              },
              {
                title: "Why Leaves Are Green",
                situation:
                  "A student notices that leaves are green, carrots are orange, and potato flesh is white — yet all three are made of plant cells.",
                question:
                  "What explains the three different colours, given they are all plant tissue?",
                skill:
                  "Different plastids. Leaves are packed with chloroplasts containing green chlorophyll; carrots hold chromoplasts with orange carotenoid pigments; potato flesh holds colourless leucoplasts full of stored starch.",
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
                title: "Improving Crops",
                description:
                  "Agricultural scientists engineer chloroplasts to raise photosynthesis efficiency, aiming for higher yields from the same land and sunlight.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Biofuels and Textiles",
                description:
                  "Cellulose from plant cell walls becomes biofuel, paper, cotton, and linen. Cotton fibre is almost pure cell-wall cellulose.",
                icon: "🧵",
                color: "border-l-secondary-500",
              },
              {
                title: "Immune System Research",
                description:
                  "Lysosomes in white blood cells are the body's main weapon against bacterial infection, so understanding them guides treatments for immune disorders.",
                icon: "🛡️",
                color: "border-l-accent-500",
              },
              {
                title: "Respiratory Medicine",
                description:
                  "Diseases such as primary ciliary dyskinesia are caused by defective cilia, leading to chronic lung infections. Research into cilia structure drives the treatments.",
                icon: "🫁",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
