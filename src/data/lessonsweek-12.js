// Week 12: Cell Theory — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import globe from "../assets/globe.jpg";
import simulation from "../assets/simulation.jpg";

export const week12 = {
  id: "week-12",
  weekNumber: 12,
  title: "Cell Theory",
  category: "Life Science",
  description:
    "Explore the development of cell theory and discover the diversity of cells in living organisms.",
  icon: "BookOpen",
  color: "primary",
  xpReward: 225,
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 34 — Development of Cell Theory
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-34",
      weekId: "week-12",
      lessonNumber: 34,
      title: "Development of Cell Theory",
      badge: "Lesson 34",
      subtitle:
        "Trace the discoveries of key scientists that led to the three principles of modern cell theory.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt:
        "Historical microscope illustration representing cell theory development",

      sections: [
        "Overview",
        "Key Concepts",
        "Scientists and Their Contributions",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>cell theory</strong> is one of the most fundamental principles of biology. It states that all living things are made of cells, the cell is the basic unit of life, and all cells come from pre-existing cells. This theory did not appear overnight — it was built over centuries by many scientists.",
              "Today, <strong class='text-primary-700'>modern cell theory</strong> has three core principles: (1) All living organisms are composed of one or more cells, (2) The cell is the most basic unit of life, and (3) All cells arise from pre-existing cells through cell division. Understanding this theory is the foundation of all of biology.",
            ],
            didYouKnow:
              "Rudolf Virchow's famous Latin phrase 'Omnis cellula e cellula' — meaning 'every cell from a cell' — captured the third principle of cell theory and remains one of the most important statements in the history of biology.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Cell Theory",
                desc: "A scientific theory stating that all living things are made of cells, the cell is the basic unit of life, and all cells come from pre-existing cells.",
              },
              {
                term: "Cell",
                desc: "The smallest structural and functional unit of all living organisms; the basic building block of life.",
              },
              {
                term: "Organism",
                desc: "Any living thing — from a single bacterium to a complex multicellular animal — that carries out basic life processes.",
              },
              {
                term: "Unicellular",
                desc: "An organism composed of only one cell that performs all life functions. Examples: bacteria, amoeba, paramecium.",
              },
              {
                term: "Multicellular",
                desc: "An organism composed of many specialized cells that work together. Examples: plants, animals, and fungi.",
              },
              {
                term: "Prokaryote",
                desc: "A type of organism whose cells lack a membrane-bound nucleus; the DNA floats in the cytoplasm. Examples: bacteria and archaea.",
              },
              {
                term: "Eukaryote",
                desc: "An organism whose cells have a membrane-bound nucleus containing the cell's DNA. Examples: plants, animals, fungi, and protists.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Scientists and Their Contributions",
          data: {
            intro:
              "Cell theory was built through the work of several scientists over more than two centuries. Each discovery added a critical piece to our understanding of the living cell.",
            steps: [
              {
                num: 1,
                title: "Robert Hooke — 1665",
                color: "primary",
                description:
                  "Robert Hooke examined thin slices of cork under a compound microscope and observed tiny, box-like structures he called 'cells' (from the Latin 'cellula,' meaning small room). He published his findings in Micrographia.",
                tip: "Hooke saw only dead cell walls in cork — he did not observe living cells or understand their function.",
              },
              {
                num: 2,
                title: "Antonie van Leeuwenhoek — 1670s",
                color: "secondary",
                description:
                  "Van Leeuwenhoek observed pond water and dental scrapings using his powerful handmade lenses, becoming the first person to see living microorganisms. He observed bacteria, protozoa, and red blood cells.",
                tip: "He could magnify specimens more than 200x — far greater than any microscope of his era.",
              },
              {
                num: 3,
                title: "Matthias Schleiden — 1838",
                color: "accent",
                description:
                  "German botanist Matthias Schleiden concluded from his research that all plant tissues are composed of cells. He proposed that the cell is the basic building unit of all plants.",
                tip: "Schleiden collaborated with Theodor Schwann, and their combined work was key to forming the first two principles of cell theory.",
              },
              {
                num: 4,
                title: "Theodor Schwann — 1839",
                color: "primary",
                description:
                  "German zoologist Theodor Schwann extended Schleiden's conclusion to animals, stating that animal tissues are also made of cells. Together, Schleiden and Schwann established that ALL living things are made of cells.",
                tip: "Schwann also introduced the term 'cell theory' in scientific literature.",
              },
              {
                num: 5,
                title: "Rudolf Virchow — 1855",
                color: "secondary",
                description:
                  "German physician Rudolf Virchow added the third and most powerful principle: 'Omnis cellula e cellula' — all cells come from pre-existing cells. This ruled out spontaneous generation of cells and established cell division as the basis of growth.",
                tip: "Virchow's principle is the foundation of our understanding of cancer — cancer is uncontrolled cell division.",
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
                title: "Cancer Research",
                description:
                  "Cancer occurs when cells bypass normal cell division controls and divide uncontrollably. Cell theory is the foundation for understanding, detecting, and treating cancer at the cellular level.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
              {
                title: "Genetic Engineering",
                description:
                  "Scientists manipulate the genetic material inside cells to produce life-saving medicines like insulin and vaccines, based on the principle that cells carry and transmit genetic information.",
                icon: "🧬",
                color: "border-l-secondary-500",
              },
              {
                title: "Disease Treatment",
                description:
                  "Understanding that pathogens are living cells (bacteria) or use living cells (viruses) helps scientists develop antibiotics and antiviral medications that target specific cellular processes.",
                icon: "💊",
                color: "border-l-accent-500",
              },
              {
                title: "Biotechnology",
                description:
                  "Cell theory underpins biotechnology — from growing cells in culture to producing biofuels, developing new materials, and engineering organisms for specific purposes.",
                icon: "🏭",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 35 — Types of Cells: Prokaryotes and Eukaryotes
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-35",
      weekId: "week-12",
      lessonNumber: 35,
      title: "Types of Cells: Prokaryotes and Eukaryotes",
      badge: "Lesson 35",
      subtitle:
        "Compare the two major categories of cells and understand what makes each type unique.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Diagram comparing prokaryotic and eukaryotic cell structures",

      sections: [
        "Overview",
        "Cell Type Gallery",
        "Side-by-Side Comparison",
        "Key Distinctions",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "All cells belong to one of two major categories: <strong class='text-primary-700'>prokaryotic</strong> or <strong class='text-primary-700'>eukaryotic</strong>. The key difference is the presence of a membrane-bound nucleus. Prokaryotic cells lack this nucleus — their DNA floats freely in the cytoplasm. Eukaryotic cells have a true nucleus enclosed in a nuclear membrane.",
              "Prokaryotes are simpler and smaller, appearing on Earth about 3.5 billion years ago. Eukaryotes are larger and more complex, evolving later. Today, all multicellular organisms — plants, animals, and fungi — are made of eukaryotic cells, while bacteria and archaea are prokaryotes.",
            ],
            didYouKnow:
              "Eukaryotic cells are thought to have evolved from prokaryotes through a process called endosymbiosis — where one prokaryote was engulfed by another and gradually became an organelle, like the mitochondrion!",
          },
        },

        {
          type: "imageCards",
          heading: "Cell Type Gallery",
          data: {
            cards: [
              {
                title: "Prokaryotic Cell",
                label: "Bacteria & Archaea",
                variant: "primary",
                color: "primary",
                desc: "Simple cells with no membrane-bound nucleus; DNA is in the nucleoid region of the cytoplasm.",
                image: simulation,
                imageAlt: "Diagram of a simple prokaryotic bacterial cell",
                examples: [
                  "No membrane-bound nucleus",
                  "DNA in cytoplasm (nucleoid region)",
                  "Examples: Bacteria, Archaea",
                ],
              },
              {
                title: "Eukaryotic: Animal Cell",
                label: "Animals & Protists",
                variant: "secondary",
                color: "secondary",
                desc: "Complex cells with a true nucleus and many membrane-bound organelles.",
                image: microscope,
                imageAlt: "Microscopic view of an animal eukaryotic cell",
                examples: [
                  "Has a membrane-bound nucleus",
                  "Many specialized organelles",
                  "Examples: Human cells, Amoeba",
                ],
              },
              {
                title: "Eukaryotic: Plant Cell",
                label: "Plants & Fungi",
                variant: "primary",
                color: "primary",
                desc: "Eukaryotic cells with a nucleus, cell wall, and chloroplasts for photosynthesis.",
                image: globe,
                imageAlt:
                  "Diagram of a plant eukaryotic cell with chloroplasts",
                examples: [
                  "Nucleus, cell wall, chloroplasts",
                  "Large central vacuole",
                  "Examples: Leaf cells, Onion skin cells",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Side-by-Side Comparison",
          data: {
            intro:
              "Prokaryotic and eukaryotic cells share the same basic chemistry of life, but differ significantly in structure and complexity. Here are five key differences.",
            left: {
              label: "Prokaryotic Cell",
              color: "primary",
              items: [
                "No membrane-bound nucleus — DNA in nucleoid region",
                "Smaller (0.1–5 micrometers)",
                "No membrane-bound organelles",
                "Examples: bacteria and archaea",
                "DNA is circular, not in chromosomes",
              ],
            },
            right: {
              label: "Eukaryotic Cell",
              color: "secondary",
              items: [
                "Has a membrane-bound nucleus enclosing DNA",
                "Larger (10–100 micrometers)",
                "Has many membrane-bound organelles",
                "Examples: plants, animals, fungi, protists",
                "DNA is linear, organized into chromosomes",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Key Distinctions",
          data: {
            concepts: [
              "The defining feature of a eukaryotic cell is the presence of a true, membrane-bound nucleus that protects and organizes the DNA.",
              "Prokaryotic cells are always unicellular — each cell is a complete, independent organism, like a bacterium.",
              "Eukaryotic cells can be unicellular (amoeba, yeast) or form part of a multicellular organism (plant, animal).",
              "Both prokaryotic and eukaryotic cells have a cell membrane, cytoplasm, DNA, and ribosomes — these are universal features of life.",
              "Prokaryotic cells typically reproduce by binary fission (splitting in two), while eukaryotic cells use mitosis or meiosis.",
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 36 — Cell Diversity
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-36",
      weekId: "week-12",
      lessonNumber: 36,
      title: "Cell Diversity",
      badge: "Lesson 36",
      subtitle:
        "Explore how cells become specialized for specific functions and why cell diversity is essential for life.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt:
        "Collage of different specialized cell types under microscope",

      sections: [
        "Overview",
        "Key Concepts",
        "Specialized Cell Types",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "All cells share certain fundamental features: a <strong class='text-primary-700'>cell membrane</strong>, cytoplasm, DNA, and ribosomes. However, cells are incredibly diverse because they become <strong class='text-primary-700'>specialized</strong> — their structure adapts to suit a specific function within the organism.",
              "In multicellular organisms, groups of specialized cells form tissues, which form organs, which form organ systems. This specialization is what allows a complex organism like a human being to think, move, breathe, and digest food all at the same time.",
            ],
            didYouKnow:
              "Red blood cells are so specialized for carrying oxygen that they actually lose their nucleus as they mature! Without a nucleus, they cannot reproduce — they live only about 120 days before being replaced by new ones made in the bone marrow.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Specialized Cell",
                desc: "A cell whose structure has adapted to perform a specific function in the body, such as a nerve cell transmitting signals or a muscle cell contracting.",
              },
              {
                term: "Unicellular",
                desc: "An organism consisting of a single cell that carries out all life processes independently. Examples: amoeba, paramecium, bacteria.",
              },
              {
                term: "Multicellular",
                desc: "An organism made up of many different types of specialized cells that work together to carry out life functions.",
              },
              {
                term: "Nerve Cell",
                desc: "A specialized cell (neuron) with long extensions that transmit electrical signals between the brain, spinal cord, and body.",
              },
              {
                term: "Muscle Cell",
                desc: "A specialized cell containing protein fibers (actin and myosin) that contract and relax to produce movement.",
              },
              {
                term: "Red Blood Cell",
                desc: "A specialized, biconcave cell filled with hemoglobin that carries oxygen from the lungs to body tissues. It has no nucleus at maturity.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Specialized Cell Types",
          data: {
            intro:
              "Specialized cells have unique structures that allow them to carry out their function better than a generalized cell could. Here are five important examples of specialized cells and why their structure suits their role.",
            reasons: [
              {
                num: 1,
                title: "Nerve Cell (Neuron)",
                color: "primary",
                desc: "Long, branching extensions for fast signal transmission",
                content:
                  "Neurons have long axons that can stretch over a meter, allowing them to transmit electrical impulses from the brain to distant muscles in a fraction of a second.",
              },
              {
                num: 2,
                title: "Muscle Cell (Myocyte)",
                color: "secondary",
                desc: "Contains contractile protein fibers for movement",
                content:
                  "Muscle cells are packed with overlapping actin and myosin protein filaments that slide past each other to shorten the cell, producing force and movement.",
              },
              {
                num: 3,
                title: "Red Blood Cell (Erythrocyte)",
                color: "accent",
                desc: "Biconcave, no nucleus — maximizes oxygen-carrying surface area",
                content:
                  "The biconcave disc shape increases surface area for oxygen exchange, and lacking a nucleus frees up more space inside the cell for hemoglobin molecules.",
              },
              {
                num: 4,
                title: "White Blood Cell (Leukocyte)",
                color: "primary",
                desc: "Flexible shape that can engulf and destroy pathogens",
                content:
                  "White blood cells can change shape to squeeze through capillary walls and engulf bacteria or foreign particles through a process called phagocytosis.",
              },
              {
                num: 5,
                title: "Leaf Cell (Mesophyll Cell)",
                color: "secondary",
                desc: "Packed with chloroplasts to capture sunlight for photosynthesis",
                content:
                  "Leaf mesophyll cells contain dozens of chloroplasts arranged to maximize sunlight absorption for converting carbon dioxide and water into glucose and oxygen.",
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
                title: "Stem Cell Therapy",
                description:
                  "Stem cells are unspecialized cells that can develop into many different cell types. Scientists use them to repair or replace damaged specialized cells in diseases like Parkinson's and heart disease.",
                icon: "🧬",
                color: "border-l-primary-500",
              },
              {
                title: "Agricultural Biotechnology",
                description:
                  "Scientists engineer plant cells to produce crops that are pest-resistant, drought-tolerant, or more nutritious — based on understanding how specialized plant cells function.",
                icon: "🌾",
                color: "border-l-secondary-500",
              },
              {
                title: "Cancer Research",
                description:
                  "Cancer cells lose their specialization and revert to uncontrolled growth. Studying normal cell diversity helps researchers identify what goes wrong in cancer and develop targeted treatments.",
                icon: "🔬",
                color: "border-l-accent-500",
              },
              {
                title: "Tissue Engineering",
                description:
                  "Biomedical engineers grow specialized cells on scaffolds to create artificial skin, cartilage, and even heart tissue for transplantation and research.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
