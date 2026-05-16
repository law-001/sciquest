// Week 14: Plant and Animal Cells — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import globe from "../assets/globe.jpg";
import simulation from "../assets/simulation.jpg";

export const week14 = {
  id: "week-14",
  weekNumber: 14,
  title: "Plant and Animal Cells",
  category: "Life Science",
  description:
    "Compare plant and animal cells and understand the unique structures that make each type specialized for its role.",
  icon: "Leaf",
  color: "accent",
  xpReward: 225,
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 40 — Comparing Plant and Animal Cells
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-40",
      weekId: "week-14",
      lessonNumber: 40,
      title: "Comparing Plant and Animal Cells",
      badge: "Lesson 40",
      subtitle:
        "Identify what plant and animal cells share and what makes each unique.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt: "Side-by-side comparison diagram of plant and animal cells",

      sections: [
        "Overview",
        "Plant vs. Animal Cells",
        "Structure Gallery",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Both plant and animal cells are <strong class='text-primary-700'>eukaryotic</strong> — they have a membrane-bound nucleus and many specialized organelles. They share key structures including the cell membrane, cytoplasm, nucleus, mitochondria, ribosomes, endoplasmic reticulum, Golgi apparatus, and vacuoles.",
              "However, plant cells have several <strong class='text-primary-700'>unique structures</strong> not found in animal cells: a rigid cell wall, chloroplasts for photosynthesis, and a large central vacuole. Animal cells, in turn, have centrioles for cell division and rely on lysosomes more heavily. These differences reflect the different lifestyles and needs of plants and animals.",
            ],
            didYouKnow:
              "A plant cell can be 10 to 100 times larger than a typical animal cell — largely because of the giant central vacuole that takes up to 90% of the plant cell's interior volume when fully inflated with water!",
          },
        },

        {
          type: "comparison",
          heading: "Plant vs. Animal Cells",
          data: {
            intro:
              "While plant and animal cells share many organelles, they differ in some critical structural features. Here is a direct side-by-side comparison of five key differences.",
            left: {
              label: "Plant Cell",
              color: "primary",
              items: [
                "Has cell wall (cellulose) for rigid structure and protection",
                "Large central vacuole that stores water and maintains turgor",
                "Rectangular, fixed shape due to rigid cell wall",
                "Makes energy via photosynthesis using chloroplasts",
                "No centrioles — uses other structures for cell division",
              ],
            },
            right: {
              label: "Animal Cell",
              color: "secondary",
              items: [
                "No cell wall — only cell membrane (flexible boundary)",
                "Many small vacuoles for temporary storage of materials",
                "Rounded, irregular shape — can change form",
                "Gets energy from food (cellular respiration in mitochondria)",
                "Has centrioles that organize spindle fibers during cell division",
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
                desc: "Both plant and animal cells contain these essential organelles for basic life functions.",
                image: microscope,
                imageAlt:
                  "Diagram showing organelles common to both plant and animal cells",
                examples: [
                  "Nucleus — DNA and control center",
                  "Mitochondria — ATP energy production",
                  "Ribosomes — protein synthesis",
                ],
              },
              {
                title: "Plant Cell Only",
                label: "Unique to Plants",
                variant: "secondary",
                color: "secondary",
                desc: "These three structures are found exclusively in plant cells and are critical to plant life.",
                image: globe,
                imageAlt:
                  "Diagram of plant cell showing chloroplasts and central vacuole",
                examples: [
                  "Cell Wall — rigid cellulose structure",
                  "Chloroplasts — photosynthesis",
                  "Central Vacuole — water storage and turgor pressure",
                ],
              },
              {
                title: "Animal Cell Only",
                label: "Unique to Animals",
                variant: "primary",
                color: "primary",
                desc: "Animal cells have specialized structures for cell division and intracellular digestion.",
                image: simulation,
                imageAlt:
                  "Diagram of animal cell showing centrioles and multiple vacuoles",
                examples: [
                  "Centrioles — organize spindle fibers in cell division",
                  "Multiple small vacuoles — temporary storage",
                  "Prominent lysosomes — cellular digestion",
                ],
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Improving Crop Plants",
                description:
                  "Agricultural scientists engineer plant cells to increase photosynthesis efficiency, improve drought resistance, or boost nutritional content — understanding plant cell structures is the first step.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Understanding Genetic Diseases",
                description:
                  "Many human diseases stem from defects in animal cell organelles. Comparing normal versus diseased cell structures helps researchers pinpoint the molecular cause of conditions like cystic fibrosis.",
                icon: "🧬",
                color: "border-l-secondary-500",
              },
              {
                title: "Stem Cell Research",
                description:
                  "Stem cells are animal cells that can develop into specialized types. Understanding the differences between cell types helps scientists direct stem cells into the correct specialized cell for tissue repair.",
                icon: "🔬",
                color: "border-l-accent-500",
              },
              {
                title: "Evolutionary Biology",
                description:
                  "Comparing plant and animal cell structures reveals their shared eukaryotic ancestry and helps scientists trace the evolutionary history of multicellular life on Earth.",
                icon: "🌍",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 41 — Unique Structures in Plant Cells
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-41",
      weekId: "week-14",
      lessonNumber: 41,
      title: "Unique Structures in Plant Cells",
      badge: "Lesson 41",
      subtitle:
        "Explore the cell wall, chloroplasts, central vacuole, and plastids — structures found only in plant cells.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: globe,
      heroImageAlt:
        "Microscopic image of plant cells showing green chloroplasts",

      sections: [
        "Overview",
        "Key Concepts",
        "Plant-Specific Structures",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Plants are stationary organisms that must capture sunlight, resist physical stresses, and manage their water supply. Their cells have evolved three major unique structures to meet these needs: the <strong class='text-primary-700'>cell wall</strong>, <strong class='text-primary-700'>chloroplasts</strong>, and the <strong class='text-primary-700'>central vacuole</strong>.",
              "These structures are so effective that plants have dominated terrestrial environments for over 400 million years. Understanding how they work explains everything from why a wilting plant revives when watered to why leaves are green and how trees can grow dozens of meters tall without any bones or muscles.",
            ],
            didYouKnow:
              "When a plant wilts, it's not because of damaged cells — it's because the central vacuoles have lost water and shrunk. When you water the plant, the vacuoles refill, turgor pressure is restored, and the plant stands upright again!",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Cell Wall",
                desc: "A rigid outer layer made of cellulose that surrounds plant cells, providing structural support, protection, and helping the cell maintain its shape.",
              },
              {
                term: "Chloroplast",
                desc: "An organelle found in plant cells that contains chlorophyll and is the site of photosynthesis — converting sunlight, water, and carbon dioxide into glucose and oxygen.",
              },
              {
                term: "Chlorophyll",
                desc: "The green pigment inside chloroplasts that absorbs sunlight (mainly red and blue wavelengths) and reflects green light, making plants appear green.",
              },
              {
                term: "Central Vacuole",
                desc: "A large, membrane-bound organelle in plant cells that stores water, nutrients, and waste products, and maintains turgor pressure to keep the plant firm and upright.",
              },
              {
                term: "Turgor Pressure",
                desc: "The pressure exerted by the water inside the central vacuole against the cell wall; this pressure keeps plant cells firm and is what makes non-woody plants stand upright.",
              },
              {
                term: "Photosynthesis",
                desc: "The process by which chloroplasts use sunlight energy to convert carbon dioxide and water into glucose (food) and oxygen.",
              },
              {
                term: "Plastid",
                desc: "A family of plant organelles including chloroplasts (photosynthesis), leucoplasts (starch storage), and chromoplasts (color pigments in flowers and fruits).",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Plant-Specific Structures",
          data: {
            concepts: [
              "The cell wall is made of cellulose fibers arranged in layers, giving it tremendous tensile strength — this is what allows tall trees to support their own weight without an internal skeleton.",
              "Chloroplasts have their own double membrane and contain a system of internal membranes called thylakoids stacked in grana, where the light-absorbing reactions of photosynthesis take place.",
              "The central vacuole occupies up to 90% of a mature plant cell's volume and acts as a storage compartment for water, sugars, salts, proteins, and even defensive chemicals against herbivores.",
              "Turgor pressure — created by water filling the central vacuole — presses the cell membrane against the cell wall, keeping non-woody plants (like herbs and young stems) firm and erect.",
              "Chromoplasts are plastids that contain red, orange, and yellow pigments (carotenoids) — they are responsible for the color of ripe tomatoes, carrots, and flower petals.",
              "Leucoplasts are colorless plastids that store starch in roots and tubers — for example, the white starchy interior of a potato is full of leucoplasts packed with starch grains.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Food Crops and Agriculture",
                description:
                  "Scientists engineer chloroplasts to increase the rate of photosynthesis in crop plants, potentially producing higher yields of food with the same amount of sunlight and land.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Plant-Based Medicine",
                description:
                  "Many medicinal compounds — such as quinine (anti-malarial) and taxol (anti-cancer) — are stored in plant cell vacuoles and plastids. Understanding these storage structures helps scientists harvest and synthesize medicines.",
                icon: "💊",
                color: "border-l-secondary-500",
              },
              {
                title: "Biofuels",
                description:
                  "Cellulose from plant cell walls is a major source of biofuel. Scientists are developing enzymes that break down cellulose into sugars that can be fermented into ethanol as a renewable fuel.",
                icon: "⚡",
                color: "border-l-accent-500",
              },
              {
                title: "Textiles and Materials",
                description:
                  "Cotton fibers are almost pure cellulose from plant cell walls. Paper, linen, and many natural textiles are derived from the cellulose in plant cell walls.",
                icon: "🧵",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 42 — Unique Structures in Animal Cells
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-42",
      weekId: "week-14",
      lessonNumber: 42,
      title: "Unique Structures in Animal Cells",
      badge: "Lesson 42",
      subtitle:
        "Learn about centrioles, lysosomes, cilia, and flagella — structures that give animal cells their distinctive capabilities.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Microscope image of animal cells with visible centrioles and cilia",

      sections: [
        "Overview",
        "Key Concepts",
        "Real-Life Cell Scenarios",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Animal cells lack a cell wall, giving them flexibility to move and change shape. To compensate, they have evolved specialized structures for movement, cell division, and waste management. The three most notable animal-cell-specific structures are <strong class='text-primary-700'>centrioles</strong>, <strong class='text-primary-700'>lysosomes</strong>, and <strong class='text-primary-700'>cilia and flagella</strong>.",
              "These structures make animal cells capable of active movement, precise cell division, and efficient cellular digestion — abilities that are essential for the complex functions of animal bodies, from immune defense to reproduction.",
            ],
            didYouKnow:
              "The cells lining your respiratory tract have about 200 cilia each, beating up to 1,000 times per minute to sweep mucus and trapped particles up and out of your lungs. You produce about 1.5 liters of mucus every day, and your cilia help move all of it!",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Centriole",
                desc: "Paired, cylindrical structures near the nucleus in animal cells that organize the spindle fibers needed to separate chromosomes during cell division (mitosis and meiosis).",
              },
              {
                term: "Lysosome",
                desc: "A membrane-bound organelle in animal cells containing digestive enzymes that break down worn-out organelles, bacteria, food particles, and cellular waste.",
              },
              {
                term: "Cilia",
                desc: "Short, hair-like extensions on the surface of some animal cells that beat in coordinated waves to move substances across the cell surface or propel single-celled organisms.",
              },
              {
                term: "Flagella",
                desc: "Long, whip-like extensions (usually one per cell) made of microtubules that rotate to propel the cell through fluid — most notably seen in sperm cells.",
              },
              {
                term: "Spindle Fiber",
                desc: "A protein fiber (microtubule) that extends from centrioles to attach to chromosomes and pull them to opposite poles during cell division.",
              },
              {
                term: "Cellular Digestion",
                desc: "The process by which lysosomes break down unwanted molecules, old organelles, or engulfed bacteria using digestive enzymes inside the cell.",
              },
              {
                term: "Enzyme",
                desc: "A protein that speeds up a specific chemical reaction inside the cell; lysosomes contain digestive enzymes that break large molecules into smaller ones.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Real-Life Cell Scenarios",
          data: {
            intro:
              "The unique structures of animal cells carry out critical functions every moment in your body. These scenarios show how cilia, lysosomes, and flagella work in real biological situations.",
            scenarios: [
              {
                title: "Cilia Clearing the Airways",
                situation:
                  "You breathe in air containing dust particles, pollen, and bacteria. These get trapped in the sticky mucus that lines your trachea (windpipe).",
                question:
                  "How does your body prevent these particles from reaching and damaging your lungs?",
                skill:
                  "The cells lining the trachea are covered in thousands of cilia. These cilia beat in coordinated, wave-like strokes to sweep mucus — along with the trapped particles — upward and out of the airway toward the throat, where it is swallowed or expelled. This is called the mucociliary escalator.",
              },
              {
                title: "Lysosomes Destroying Bacteria",
                situation:
                  "A white blood cell (neutrophil) detects a bacterium and engulfs it through phagocytosis, forming a pouch (phagosome) around the bacterium inside the cell.",
                question:
                  "How does the white blood cell destroy the bacterium it has captured?",
                skill:
                  "Lysosomes fuse with the phagosome and release their digestive enzymes directly onto the trapped bacterium. The enzymes break down the bacterium's proteins, membrane, and DNA, neutralizing the threat. The broken-down components are then recycled or expelled from the cell.",
              },
              {
                title: "Sperm Propelled by Flagellum",
                situation:
                  "A sperm cell must travel through the female reproductive tract — a fluid environment — to reach and fertilize an egg. The distance it must travel relative to its size is equivalent to a human swimming across an ocean.",
                question:
                  "What structure allows the sperm to move through fluid, and how does it work?",
                skill:
                  "The sperm cell has a single long flagellum — a microtubule-based extension at its tail. Motor proteins cause the microtubule pairs in the flagellum to slide against each other, generating a whipping motion. This rhythmic beating propels the sperm forward through the fluid of the reproductive tract.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Immune System Function",
                description:
                  "Lysosomes in white blood cells are the primary weapon against bacterial infections. Scientists study lysosomal function to develop treatments for immune deficiencies and autoimmune diseases.",
                icon: "🛡️",
                color: "border-l-primary-500",
              },
              {
                title: "Reproductive Biology",
                description:
                  "Sperm motility — the ability of sperm to swim using flagella — is a key factor in male fertility. Research into flagellar structure has led to treatments for male infertility caused by immotile sperm.",
                icon: "🔬",
                color: "border-l-secondary-500",
              },
              {
                title: "Cancer and Centrioles",
                description:
                  "Cancer cells often have extra or abnormal centrioles, leading to errors in chromosome separation during cell division. Understanding centriole function is critical to understanding how cancer spreads.",
                icon: "🏥",
                color: "border-l-accent-500",
              },
              {
                title: "Respiratory Health",
                description:
                  "Diseases like primary ciliary dyskinesia (PCD) result from defective cilia in the airways, causing chronic lung infections. Research into cilia structure guides treatment and drug development.",
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
