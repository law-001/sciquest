// Week 13: Cell Parts and Functions — Grade 7 Science

import microscope from "../assets/week1/Microscopic.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week13 = {
  id: "week-13",
  weekNumber: 13,
  title: "Cell Parts and Functions",
  category: "Life Science",
  description:
    "Discover the organelles inside cells and understand what each structure does to keep the cell alive.",
  icon: "CircleDot",
  color: "secondary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 37 — Cell Membrane and Cell Wall
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-37",
      weekId: "week-13",
      lessonNumber: 37,
      title: "Cell Membrane and Cell Wall",
      badge: "Lesson 37",
      subtitle:
        "Understand the structure and function of the cell membrane and cell wall, and how they differ.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt: "Microscopic cross-section showing cell membrane structure",

      sections: [
        "Overview",
        "Key Concepts",
        "Membrane vs. Wall",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>cell membrane</strong> is found in every living cell — plant, animal, fungus, and bacterium. It is made of a <strong class='text-primary-700'>phospholipid bilayer</strong> — two layers of fat-like molecules — with proteins embedded in it. The membrane controls what enters and exits the cell through a property called selective permeability.",
              "The <strong class='text-primary-700'>cell wall</strong> is an additional rigid outer layer found in plant cells, fungal cells, and bacteria. In plants, it is made of <strong class='text-primary-700'>cellulose</strong> — a tough, fibrous carbohydrate. The cell wall provides structural support and protection but is not selective — it allows most molecules to pass through freely.",
            ],
            didYouKnow:
              "The phospholipid bilayer is so thin that 10,000 of them stacked together would be about as thick as a single sheet of paper — yet it controls everything that enters and exits the cell!",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Cell Membrane",
                desc: "A flexible, selectively permeable barrier found in all cells that controls the movement of substances into and out of the cell.",
              },
              {
                term: "Cell Wall",
                desc: "A rigid outer layer found in plant, fungal, and bacterial cells that provides structure, shape, and protection in addition to the cell membrane.",
              },
              {
                term: "Selective Permeability",
                desc: "The property of the cell membrane that allows some substances to pass through freely while restricting or blocking others.",
              },
              {
                term: "Phospholipid Bilayer",
                desc: "The double-layered structure that makes up the cell membrane, consisting of phospholipid molecules with water-attracting heads and water-repelling tails.",
              },
              {
                term: "Cellulose",
                desc: "A complex carbohydrate polymer that forms the main structural component of plant cell walls, providing rigidity and tensile strength.",
              },
              {
                term: "Osmosis",
                desc: "The movement of water molecules through a selectively permeable membrane from an area of high water concentration to low water concentration.",
              },
              {
                term: "Diffusion",
                desc: "The passive movement of molecules from an area of high concentration to an area of low concentration, without requiring energy.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Membrane vs. Wall",
          data: {
            intro:
              "The cell membrane and cell wall are both outer layers of a cell, but they differ greatly in composition, location, rigidity, and function. Here is a direct comparison.",
            left: {
              label: "Cell Membrane",
              color: "primary",
              items: [
                "Made of phospholipid bilayer with embedded proteins",
                "Found in ALL cells — plant, animal, fungus, bacteria",
                "Controls what enters and exits (selective permeability)",
                "Flexible and fluid — can change shape",
                "Highly selective — regulates molecule movement",
              ],
            },
            right: {
              label: "Cell Wall",
              color: "secondary",
              items: [
                "Made of cellulose (plants), chitin (fungi), or peptidoglycan (bacteria)",
                "Found in plant, fungal, and bacterial cells only — NOT animal cells",
                "Provides structural support and protection",
                "Rigid and stiff — maintains fixed cell shape",
                "Non-selective — allows most molecules to pass through",
              ],
            },
          },
        },

        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Drug Delivery",
                description:
                  "Medicines are designed to pass through cell membranes to reach targets inside cells. Understanding selective permeability allows scientists to engineer drug molecules that can cross the membrane effectively.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "Food Science and Fiber",
                description:
                  "Plant cell walls made of cellulose are the dietary fiber we eat. Fiber passes undigested through our system, supporting gut health and reducing the risk of heart disease and diabetes.",
                icon: "🥦",
                color: "border-l-secondary-500",
              },
              {
                title: "Dialysis Machines",
                description:
                  "Kidney dialysis machines use a selectively permeable membrane — mimicking the cell membrane — to filter waste products from the blood of patients with kidney failure.",
                icon: "🏥",
                color: "border-l-accent-500",
              },
              {
                title: "Understanding Diseases",
                description:
                  "Many diseases, including cystic fibrosis, result from defective membrane proteins that disrupt selective permeability. Understanding membrane function is key to finding treatments.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 38 — Nucleus and Cell Organelles
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-38",
      weekId: "week-13",
      lessonNumber: 38,
      title: "Nucleus and Cell Organelles",
      badge: "Lesson 38",
      subtitle:
        "Explore the nucleus and key organelles that power, build, and maintain the cell.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt: "Colorized electron microscope image of cell organelles",

      sections: [
        "Overview",
        "Organelle Gallery",
        "Key Organelle Functions",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Inside every eukaryotic cell is a collection of specialized structures called <strong class='text-primary-700'>organelles</strong> — each with a specific job that keeps the cell alive and functioning. The <strong class='text-primary-700'>nucleus</strong> is the control center, directing all cell activities by containing the cell's DNA.",
              "Other organelles handle energy production, protein synthesis, packaging, waste removal, and storage. Together, they form a highly organized system — much like departments in a factory — where each unit has a specific role that contributes to the overall function of the cell.",
            ],
            didYouKnow:
              "Mitochondria have their own DNA, separate from the nucleus! Scientists believe this is because mitochondria were once free-living bacteria that were engulfed by an ancestral eukaryotic cell billions of years ago — and stayed as permanent 'guests.'",
          },
        },

        {
          type: "imageCards",
          heading: "Organelle Gallery",
          data: {
            cards: [
              {
                title: "Nucleus",
                label: "Control Center",
                variant: "primary",
                color: "primary",
                desc: "The nucleus contains the cell's DNA and directs all cellular activities including growth, metabolism, and reproduction.",
                image: microscope,
                imageAlt:
                  "Nucleus of a cell showing nuclear membrane and nucleolus",
                examples: [
                  "Contains DNA (genetic instructions)",
                  "Nucleolus produces ribosomes",
                  "Nuclear membrane protects DNA",
                ],
              },
              {
                title: "Energy Organelles",
                label: "Powerhouse",
                variant: "secondary",
                color: "secondary",
                desc: "Mitochondria convert glucose and oxygen into ATP energy through cellular respiration.",
                image: simulation,
                imageAlt:
                  "Diagram of mitochondria showing inner membrane folds",
                examples: [
                  "Mitochondria produce ATP",
                  "Site of cellular respiration",
                  "Has its own DNA",
                ],
              },
              {
                title: "Protein Factory",
                label: "Build & Ship",
                variant: "primary",
                color: "primary",
                desc: "Ribosomes, ER, and Golgi apparatus work together to build, process, and ship proteins.",
                image: null,
                imageAlt: "Diagram of rough ER, ribosomes, and Golgi apparatus",
                examples: [
                  "Ribosomes assemble proteins",
                  "Rough ER processes proteins",
                  "Golgi packages and ships proteins",
                ],
              },
              {
                title: "Cleanup Crew",
                label: "Waste Management",
                variant: "secondary",
                color: "secondary",
                desc: "Lysosomes and vacuoles handle waste breakdown and storage inside the cell.",
                image: lab,
                imageAlt: "Diagram of lysosomes digesting cellular waste",
                examples: [
                  "Lysosomes digest waste and old organelles",
                  "Vacuoles store water and materials",
                  "Smooth ER detoxifies chemicals",
                ],
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Key Organelle Functions",
          data: {
            concepts: [
              "The nucleus is the control center — it contains DNA and directs all cell activities through gene expression.",
              "Mitochondria produce ATP (adenosine triphosphate), the cell's energy currency, through cellular respiration using glucose and oxygen.",
              "Ribosomes are the sites of protein synthesis — they translate mRNA instructions from the nucleus into protein chains.",
              "The Golgi apparatus sorts, modifies, and packages proteins into vesicles for transport within the cell or secretion outside the cell.",
              "Lysosomes contain digestive enzymes that break down old organelles, bacteria, and food particles — acting as the cell's recycling and waste disposal system.",
              "Vacuoles store water, nutrients, and waste products — in plant cells, the large central vacuole maintains turgor pressure and stores water.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Cancer Research",
                description:
                  "Cancer begins when DNA damage in the nucleus causes cells to divide uncontrollably. Understanding how the nucleus regulates cell division is central to developing targeted cancer therapies.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
              {
                title: "Genetic Engineering",
                description:
                  "Scientists edit DNA inside the nucleus using tools like CRISPR-Cas9 to correct genetic disorders, produce medicines, and improve crops.",
                icon: "🧬",
                color: "border-l-secondary-500",
              },
              {
                title: "Antibiotic Development",
                description:
                  "Bacterial ribosomes differ from eukaryotic ribosomes. Many antibiotics (like erythromycin and streptomycin) specifically target bacterial ribosomes to kill bacteria without harming human cells.",
                icon: "💊",
                color: "border-l-accent-500",
              },
              {
                title: "Metabolic Disease Research",
                description:
                  "Diseases like diabetes and obesity involve dysfunction in mitochondrial energy production. Research on mitochondrial organelles helps scientists understand and treat these metabolic conditions.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 39 — Cytoplasm and Cytoskeleton
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-39",
      weekId: "week-13",
      lessonNumber: 39,
      title: "Cytoplasm and Cytoskeleton",
      badge: "Lesson 39",
      subtitle:
        "Understand the role of cytoplasm as the cell's internal environment and the cytoskeleton as its structural framework.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Microscope image showing cytoskeleton network inside a cell",

      sections: [
        "Overview",
        "Key Concepts",
        "Cytoskeleton Roles",
        "Practical Scenarios",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>cytoplasm</strong> is the gel-like fluid that fills the interior of the cell. It is mainly composed of water, salts, and proteins — collectively called <strong class='text-primary-700'>cytosol</strong>. The cytoplasm suspends organelles in place and provides the medium in which most of the cell's chemical reactions occur.",
              "Within the cytoplasm, a complex network of protein filaments called the <strong class='text-primary-700'>cytoskeleton</strong> gives the cell its shape, enables movement, and organizes the organelles. Just as a building has a steel framework, the cytoskeleton is the internal scaffold that keeps the cell from collapsing.",
            ],
            didYouKnow:
              "The cytoskeleton is not fixed or rigid — it is constantly being built and broken down. This dynamic quality is what allows cells to change shape, divide, and move. White blood cells use their cytoskeleton to squeeze through tiny gaps in blood vessel walls to reach infection sites!",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Cytoplasm",
                desc: "The gel-like substance that fills the cell between the cell membrane and nucleus, containing organelles and serving as the medium for cellular reactions.",
              },
              {
                term: "Cytosol",
                desc: "The liquid portion of the cytoplasm — a water-based solution of salts, sugars, proteins, and other molecules in which organelles are suspended.",
              },
              {
                term: "Cytoskeleton",
                desc: "A dynamic network of protein filaments (microtubules and microfilaments) inside the cell that provides structure, enables movement, and organizes organelles.",
              },
              {
                term: "Microtubule",
                desc: "Hollow, tube-like protein filaments in the cytoskeleton that provide structural support, move chromosomes during cell division, and form the tracks for organelle transport.",
              },
              {
                term: "Microfilament",
                desc: "Thin, solid protein filaments (made of actin) that support the cell's shape, enable cell movement, and play a role in muscle contraction.",
              },
              {
                term: "Cilia",
                desc: "Short, hair-like extensions on the surface of some cells that beat rhythmically to move substances across the cell surface (e.g., in the trachea).",
              },
              {
                term: "Flagella",
                desc: "Long, whip-like extensions on some cells that rotate to propel the cell through liquid — for example, the flagellum of a sperm cell.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Cytoskeleton Roles",
          data: {
            intro:
              "The cytoskeleton is far more than just a structural scaffold. It is an active, dynamic system with multiple critical roles in keeping the cell functional. Here are five of its most important jobs.",
            reasons: [
              {
                num: 1,
                title: "Maintain Cell Shape",
                color: "primary",
                desc: "Provides the internal framework that gives the cell its characteristic form",
                content:
                  "Without the cytoskeleton, cells would collapse into shapeless blobs. Microfilaments and microtubules resist compression and tension, keeping the cell's shape intact.",
              },
              {
                num: 2,
                title: "Anchor Organelles",
                color: "secondary",
                desc: "Holds organelles in position within the cytoplasm",
                content:
                  "Cytoskeletal filaments anchor organelles like the nucleus and mitochondria to specific locations, ensuring they function in the right cellular compartment.",
              },
              {
                num: 3,
                title: "Cell Movement via Cilia and Flagella",
                color: "accent",
                desc: "Powers the beating of cilia and the rotation of flagella",
                content:
                  "Cilia lining the respiratory tract sweep mucus and debris upward, while flagella propel sperm cells toward an egg. Both are built from microtubule bundles.",
              },
              {
                num: 4,
                title: "Chromosome Movement During Division",
                color: "primary",
                desc: "Pulls chromosomes to opposite poles during mitosis and meiosis",
                content:
                  "During cell division, microtubules form the spindle apparatus, attaching to chromosomes and pulling them apart to ensure each daughter cell receives the correct genetic material.",
              },
              {
                num: 5,
                title: "Intracellular Transport",
                color: "secondary",
                desc: "Acts as tracks along which motor proteins carry organelles and vesicles",
                content:
                  "Motor proteins walk along microtubule tracks, carrying vesicles from the ER to the Golgi, and delivering secretory vesicles to the cell membrane — like a rail system for cargo.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Practical Scenarios",
          data: {
            intro:
              "Understanding cytoplasm and the cytoskeleton becomes clearer when you see how they work in real biological situations. Read each scenario and think about what is happening at the cellular level.",
            scenarios: [
              {
                title: "Muscle Cell Contraction",
                situation:
                  "When you bend your arm, your bicep muscle contracts. At the cellular level, thousands of muscle cells shorten simultaneously to produce this movement.",
                question:
                  "Which cytoskeletal component is responsible for muscle contraction, and how does it work?",
                skill:
                  "Microfilaments made of actin interact with myosin proteins. The myosin proteins grip actin filaments and pull them, shortening the cell. When many muscle cells do this simultaneously, the whole muscle contracts and produces movement.",
              },
              {
                title: "Sperm Cell Swimming",
                situation:
                  "A human sperm cell must swim from the cervix through the uterus and into the fallopian tube to fertilize an egg — a journey that takes hours.",
                question:
                  "How does the sperm cell generate the force needed to swim such a long distance?",
                skill:
                  "The sperm uses a single long flagellum — a whip-like extension built from bundled microtubules. Motor proteins cause the microtubule bundles to slide against each other, creating the rhythmic whipping motion that propels the sperm forward.",
              },
              {
                title: "Why Cells Don't Collapse",
                situation:
                  "A cell is filled mostly with water-based cytoplasm. Water does not hold a shape on its own, yet cells maintain their shape even when jostled or squeezed.",
                question:
                  "What prevents a cell from collapsing into a formless blob?",
                skill:
                  "The cytoskeleton acts as an internal scaffold. A network of microtubules and microfilaments extends throughout the cytoplasm, resisting compression and tension to maintain the cell's structure — much like the steel frame of a building prevents it from collapsing.",
              },
            ],
          },
        },
      ],
    },
  ],
};
