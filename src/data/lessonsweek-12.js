// Week 12: The Cell — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd term Week 12.
//   Lesson 1 — The Cell Theory and Its Diversity
//   Lesson 2 — Parts and Function of the Cell

import microscope from "../assets/week1/Microscopic.jpg";
import globe from "../assets/week1/globe.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week12 = {
  id: "week-12",
  weekNumber: 12,
  title: "The Cell",
  category: "Life Science",
  description:
    "Trace the development of cell theory, compare the huge diversity of cell types, and learn what every organelle inside a cell actually does.",
  icon: "BookOpen",
  color: "primary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — The Cell Theory and Its Diversity
    // ═══════════════════════════════════════════════════
    {
      id: "w12-l1",
      weekId: "week-12",
      lessonNumber: 1,
      title: "The Cell Theory and Its Diversity",
      badge: "Lesson 1",
      subtitle:
        "Follow the discoveries that built cell theory, then meet the enormous variety of cells that theory covers — from bacteria to nerve cells a metre long.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt:
        "Microscope view representing the development of cell theory",

      sections: [
        "Overview",
        "Key Terms",
        "Scientists and Their Contributions",
        "Prokaryotes and Eukaryotes",
        "Specialized Cell Types",
        "Key Distinctions",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Cell Theory",
          url: "https://www.khanacademy.org/science/biology/structure-of-a-cell",
        },
        {
          label: "Britannica — Cell Theory",
          url: "https://www.britannica.com/science/cell-theory",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>cell theory</strong> is one of the most fundamental principles in all of biology. It did not appear overnight — it was assembled over two centuries by scientists whose microscopes kept getting better.",
              "Modern cell theory has three principles: (1) all living organisms are composed of one or more <strong class='text-primary-700'>cells</strong>, (2) the cell is the basic unit of structure and function in living things, and (3) all cells arise from <strong class='text-primary-700'>pre-existing cells</strong> through cell division.",
              "Yet 'cell' covers an astonishing range. A bacterium and a human nerve cell are both cells, but one is a millionth of a metre across with no nucleus, and the other can stretch a full metre from your spine to your toe. This lesson covers both the theory and the diversity it has to account for.",
            ],
            didYouKnow:
              "Rudolf Virchow's Latin phrase 'Omnis cellula e cellula' — every cell from a cell — remains one of the most important statements ever made in biology. It ruled out the idea that living things could arise spontaneously from non-living matter.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Cell Theory",
                desc: "The principle that all living things are made of cells, the cell is the basic unit of life, and all cells come from pre-existing cells.",
              },
              {
                term: "Cell",
                desc: "The smallest structural and functional unit of all living organisms — the basic building block of life.",
              },
              {
                term: "Unicellular",
                desc: "An organism made of only one cell that performs every life function by itself — bacteria, amoeba, paramecium.",
              },
              {
                term: "Multicellular",
                desc: "An organism made of many specialised cells working together — plants, animals, and fungi.",
              },
              {
                term: "Prokaryote",
                desc: "An organism whose cells have no membrane-bound nucleus; the DNA floats freely in the cytoplasm. Bacteria and archaea.",
              },
              {
                term: "Eukaryote",
                desc: "An organism whose cells have a true membrane-bound nucleus containing the DNA. Plants, animals, fungi, and protists.",
              },
              {
                term: "Specialized Cell",
                desc: "A cell whose structure has adapted to perform one specific job — a nerve cell transmitting signals, a muscle cell contracting.",
              },
              {
                term: "Tissue",
                desc: "A group of similar cells working together to perform a shared function.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Scientists and Their Contributions",
          data: {
            intro:
              "Five scientists over two hundred years each added a piece. Notice how often a better instrument came first and the discovery followed.",
            steps: [
              {
                num: 1,
                title: "Robert Hooke — 1665",
                color: "primary",
                description:
                  "Hooke examined thin slices of cork under a compound microscope and saw tiny box-like structures, which he named 'cells' from the Latin for small room. He published his drawings in Micrographia.",
                tip: "Hooke saw only dead cell walls — he did not observe living cells or know what they did.",
              },
              {
                num: 2,
                title: "Antonie van Leeuwenhoek — 1670s",
                color: "secondary",
                description:
                  "Using lenses he ground himself, van Leeuwenhoek observed pond water and dental scrapings, becoming the first person to see living microorganisms — bacteria, protozoa, and red blood cells.",
                tip: "His lenses magnified over 200×, far beyond anything else available at the time.",
              },
              {
                num: 3,
                title: "Matthias Schleiden — 1838",
                color: "accent",
                description:
                  "German botanist Schleiden studied plant tissue and concluded that all plants are composed of cells, proposing the cell as the basic building unit of all plant life.",
                tip: "Schleiden worked closely with Theodor Schwann — their combined conclusion became the first principle of cell theory.",
              },
              {
                num: 4,
                title: "Theodor Schwann — 1839",
                color: "primary",
                description:
                  "German zoologist Schwann extended Schleiden's conclusion to animals, showing animal tissues are also made of cells. Together they established that ALL living things are made of cells.",
                tip: "Schwann also introduced the phrase 'cell theory' into scientific writing.",
              },
              {
                num: 5,
                title: "Rudolf Virchow — 1855",
                color: "secondary",
                description:
                  "German physician Virchow added the third and most powerful principle: all cells come from pre-existing cells. This ruled out spontaneous generation and established cell division as the basis of all growth and repair.",
                tip: "Virchow's principle is the foundation of cancer research — cancer is cell division that has stopped obeying the rules.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Prokaryotes and Eukaryotes",
          data: {
            intro:
              "Every cell on Earth belongs to one of two categories. The dividing line is a single feature: whether the DNA is enclosed in a membrane-bound nucleus.",
            left: {
              label: "Prokaryotic Cell",
              color: "primary",
              items: [
                "No membrane-bound nucleus — DNA sits in the nucleoid region",
                "Smaller: 0.1–5 micrometres across",
                "No membrane-bound organelles",
                "DNA is a single circular loop, not chromosomes",
                "Always unicellular. Examples: bacteria and archaea",
              ],
            },
            right: {
              label: "Eukaryotic Cell",
              color: "secondary",
              items: [
                "Has a true membrane-bound nucleus enclosing the DNA",
                "Larger: 10–100 micrometres across",
                "Many membrane-bound organelles, each with a job",
                "DNA is linear and organised into chromosomes",
                "Unicellular or multicellular. Examples: plants, animals, fungi, protists",
              ],
            },
          },
        },

        {
          type: "reasonCards",
          heading: "Specialized Cell Types",
          data: {
            intro:
              "In a multicellular organism, cells specialise — their shape changes to suit one job. In every case the structure explains the function.",
            reasons: [
              {
                num: 1,
                title: "Nerve Cell (Neuron)",
                color: "primary",
                desc: "Long branching extensions for fast signal transmission",
                content:
                  "Neurons have axons that can stretch over a metre, carrying electrical impulses from the brain to distant muscles in a fraction of a second.",
              },
              {
                num: 2,
                title: "Muscle Cell (Myocyte)",
                color: "secondary",
                desc: "Packed with contractile protein fibres",
                content:
                  "Overlapping actin and myosin filaments slide past each other to shorten the cell, and millions doing it together produce movement.",
              },
              {
                num: 3,
                title: "Red Blood Cell (Erythrocyte)",
                color: "accent",
                desc: "Biconcave and without a nucleus, maximising oxygen capacity",
                content:
                  "The dished disc shape increases surface area for gas exchange, and losing the nucleus frees interior space for more haemoglobin.",
              },
              {
                num: 4,
                title: "White Blood Cell (Leukocyte)",
                color: "primary",
                desc: "Flexible shape that can engulf and destroy invaders",
                content:
                  "White blood cells change shape to squeeze through capillary walls and swallow bacteria whole in a process called phagocytosis.",
              },
              {
                num: 5,
                title: "Leaf Cell (Mesophyll Cell)",
                color: "secondary",
                desc: "Crowded with chloroplasts to capture sunlight",
                content:
                  "Mesophyll cells hold dozens of chloroplasts arranged to catch as much light as possible for photosynthesis.",
              },
              {
                num: 6,
                title: "Root Hair Cell",
                color: "accent",
                desc: "A long thin extension that maximises absorbing surface",
                content:
                  "The hair-like projection reaches out between soil particles, hugely increasing the surface area available for absorbing water and minerals.",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Key Distinctions",
          data: {
            concepts: [
              "The defining feature of a eukaryotic cell is a true, membrane-bound nucleus protecting and organising the DNA.",
              "Prokaryotic cells are always unicellular — each cell is a complete, independent organism.",
              "Eukaryotic cells may be unicellular (amoeba, yeast) or part of a multicellular organism (plant, animal).",
              "All cells — prokaryotic and eukaryotic alike — share four features: a cell membrane, cytoplasm, DNA, and ribosomes.",
              "Prokaryotes reproduce by binary fission; eukaryotes use mitosis or meiosis.",
              "Specialisation is why a complex organism works: no single cell could think, move, digest, and fight infection all at once.",
              "In multicellular organisms, specialised cells form tissues, tissues form organs, and organs form organ systems.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Cancer Research",
                description:
                  "Cancer is cells dividing without the normal controls. Virchow's principle that every cell comes from another cell is the foundation for understanding and treating it.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
              {
                title: "Antibiotic Development",
                description:
                  "Antibiotics work by targeting features prokaryotic bacteria have and human eukaryotic cells do not — killing the infection without harming the patient.",
                icon: "💊",
                color: "border-l-secondary-500",
              },
              {
                title: "Stem Cell Therapy",
                description:
                  "Stem cells are unspecialised cells that can develop into many types. Scientists direct them to replace damaged specialised cells in the heart, spine, or brain.",
                icon: "🧬",
                color: "border-l-accent-500",
              },
              {
                title: "Agricultural Biotechnology",
                description:
                  "Understanding how plant cells specialise lets scientists engineer crops that resist pests, tolerate drought, or carry more nutrients.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Parts and Function of the Cell
    // ═══════════════════════════════════════════════════
    {
      id: "w12-l2",
      weekId: "week-12",
      lessonNumber: 2,
      title: "Parts and Function of the Cell",
      badge: "Lesson 2",
      subtitle:
        "Tour the inside of a cell — the membrane that guards it, the nucleus that runs it, and every organelle that keeps it alive.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt: "Diagram of a cell showing its internal organelles",

      sections: [
        "Overview",
        "Key Terms",
        "The Cell Membrane and Cell Wall",
        "Organelle Gallery",
        "What Each Organelle Does",
        "Cytoplasm and Cytoskeleton",
        "Practical Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Cell Parts and Functions",
          url: "https://www.khanacademy.org/science/biology/structure-of-a-cell",
        },
        {
          label: "Britannica — Cell Organelle",
          url: "https://www.britannica.com/science/organelle",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Inside every eukaryotic cell is a collection of specialised structures called <strong class='text-primary-700'>organelles</strong>, each with a specific job. Together they work like departments in a factory — and the factory dies if any critical department shuts down.",
              "The <strong class='text-primary-700'>cell membrane</strong> forms the boundary, controlling what enters and leaves. The <strong class='text-primary-700'>nucleus</strong> is the control centre, holding the DNA that directs everything. Around them, other organelles handle energy production, protein building, packaging, transport, waste disposal, and storage.",
            ],
            didYouKnow:
              "Mitochondria have their own DNA, separate from the nucleus. Scientists believe they were once free-living bacteria engulfed by an ancestral cell billions of years ago — and simply stayed.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Cell Membrane",
                desc: "A flexible, selectively permeable barrier found in every cell that controls what moves in and out.",
              },
              {
                term: "Selective Permeability",
                desc: "The property of letting some substances through while restricting or blocking others.",
              },
              {
                term: "Cell Wall",
                desc: "A rigid outer layer outside the membrane in plant, fungal, and bacterial cells, giving shape and support. Made of cellulose in plants.",
              },
              {
                term: "Nucleus",
                desc: "The control centre of the cell, containing the DNA and directing all cell activities.",
              },
              {
                term: "Mitochondria",
                desc: "The organelle that produces ATP energy through cellular respiration — the 'powerhouse of the cell'.",
              },
              {
                term: "Ribosome",
                desc: "The site of protein synthesis, translating instructions from the nucleus into protein chains. Found in all cells.",
              },
              {
                term: "Endoplasmic Reticulum",
                desc: "A network of membranes that processes proteins (rough ER, studded with ribosomes) and makes lipids and detoxifies (smooth ER).",
              },
              {
                term: "Golgi Apparatus",
                desc: "The organelle that sorts, modifies, and packages proteins into vesicles for transport or export.",
              },
              {
                term: "Lysosome",
                desc: "A sac of digestive enzymes that breaks down waste, worn-out organelles, and engulfed bacteria.",
              },
              {
                term: "Vacuole",
                desc: "A storage compartment for water, nutrients, and waste. Plant cells have one very large central vacuole.",
              },
              {
                term: "Cytoplasm",
                desc: "The gel-like fluid filling the cell, holding organelles in place and hosting most chemical reactions.",
              },
              {
                term: "Cytoskeleton",
                desc: "A network of protein filaments giving the cell its shape, moving organelles, and pulling chromosomes apart during division.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "The Cell Membrane and Cell Wall",
          data: {
            intro:
              "Both are outer layers, but they are made of different materials and do different jobs. Only one of them is found in every living cell.",
            left: {
              label: "Cell Membrane",
              color: "primary",
              items: [
                "Made of a phospholipid bilayer with proteins embedded in it",
                "Found in ALL cells — plant, animal, fungus, bacterium",
                "Controls what enters and exits (selective permeability)",
                "Flexible and fluid — the cell can change shape",
                "Highly selective: it decides molecule by molecule",
              ],
            },
            right: {
              label: "Cell Wall",
              color: "secondary",
              items: [
                "Made of cellulose (plants), chitin (fungi), or peptidoglycan (bacteria)",
                "Found in plant, fungal, and bacterial cells — NOT animal cells",
                "Provides structural support and protection",
                "Rigid and stiff — holds a fixed cell shape",
                "Non-selective: most molecules pass straight through",
              ],
            },
          },
        },

        {
          type: "imageCards",
          heading: "Organelle Gallery",
          data: {
            cards: [
              {
                title: "Nucleus",
                label: "Control Centre",
                variant: "primary",
                color: "primary",
                desc: "Holds the cell's DNA and directs every activity — growth, metabolism, and reproduction.",
                image: microscope,
                imageAlt:
                  "Nucleus of a cell showing nuclear membrane and nucleolus",
                examples: [
                  "Contains DNA — the genetic instructions",
                  "The nucleolus inside it builds ribosomes",
                  "The nuclear membrane protects the DNA",
                ],
              },
              {
                title: "Energy Organelles",
                label: "Powerhouse",
                variant: "secondary",
                color: "secondary",
                desc: "Mitochondria convert glucose and oxygen into ATP through cellular respiration.",
                image: simulation,
                imageAlt: "Diagram of mitochondria showing inner membrane folds",
                examples: [
                  "Mitochondria produce ATP, the cell's energy currency",
                  "Folded inner membranes increase the working surface",
                  "They carry their own separate DNA",
                ],
              },
              {
                title: "Protein Factory",
                label: "Build and Ship",
                variant: "primary",
                color: "primary",
                desc: "Ribosomes, the endoplasmic reticulum, and the Golgi apparatus build, process, and dispatch proteins.",
                image: globe,
                imageAlt: "Diagram of rough ER, ribosomes, and Golgi apparatus",
                examples: [
                  "Ribosomes assemble amino acids into proteins",
                  "Rough ER folds and processes those proteins",
                  "Golgi packages and ships them where they are needed",
                ],
              },
              {
                title: "Cleanup and Storage",
                label: "Waste Management",
                variant: "secondary",
                color: "secondary",
                desc: "Lysosomes break down waste while vacuoles store water, nutrients, and by-products.",
                image: lab,
                imageAlt: "Diagram of lysosomes digesting cellular waste",
                examples: [
                  "Lysosomes digest waste and worn-out organelles",
                  "Vacuoles store water and materials",
                  "Smooth ER detoxifies harmful chemicals",
                ],
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "What Each Organelle Does",
          data: {
            concepts: [
              "The nucleus is the control centre — it holds the DNA and directs all cell activity through gene expression.",
              "Mitochondria produce ATP, the cell's energy currency, through cellular respiration using glucose and oxygen.",
              "Ribosomes are the site of protein synthesis, translating genetic instructions into chains of amino acids.",
              "The rough endoplasmic reticulum processes and folds newly made proteins; the smooth ER makes lipids and breaks down toxins.",
              "The Golgi apparatus sorts, modifies, and packages proteins into vesicles for delivery inside or outside the cell.",
              "Lysosomes contain digestive enzymes that break down old organelles, bacteria, and waste — the cell's recycling system.",
              "Vacuoles store water, nutrients, and waste. In plant cells the large central vacuole also maintains turgor pressure.",
              "The cell membrane controls every substance entering or leaving, using selective permeability.",
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Cytoplasm and Cytoskeleton",
          data: {
            intro:
              "Organelles do not float randomly. The cytoplasm is the medium they sit in, and the cytoskeleton is the scaffolding that holds everything in place and moves it around.",
            reasons: [
              {
                num: 1,
                title: "Maintain Cell Shape",
                color: "primary",
                desc: "An internal framework that stops the cell collapsing",
                content:
                  "Without the cytoskeleton, a cell full of watery cytoplasm would sag into a shapeless blob. Protein filaments resist both squeezing and stretching.",
              },
              {
                num: 2,
                title: "Anchor Organelles",
                color: "secondary",
                desc: "Holds each organelle in the right place",
                content:
                  "Filaments tether the nucleus and mitochondria where they belong, so each organelle works in the right part of the cell.",
              },
              {
                num: 3,
                title: "Power Cilia and Flagella",
                color: "accent",
                desc: "Drives the beating and whipping that moves cells",
                content:
                  "Cilia lining the windpipe sweep mucus upward, and a sperm cell's flagellum propels it forward. Both are built from bundled microtubules.",
              },
              {
                num: 4,
                title: "Separate Chromosomes",
                color: "primary",
                desc: "Forms the spindle that pulls DNA apart in division",
                content:
                  "During cell division, microtubules assemble into the spindle apparatus, attach to chromosomes, and pull them to opposite ends of the cell.",
              },
              {
                num: 5,
                title: "Transport Cargo",
                color: "secondary",
                desc: "Acts as rails for motor proteins carrying vesicles",
                content:
                  "Motor proteins walk along microtubule tracks carrying vesicles from the ER to the Golgi and out to the membrane — a rail network inside the cell.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Practical Scenarios",
          data: {
            intro:
              "Each of these situations is explained by one organelle doing — or failing to do — its job.",
            scenarios: [
              {
                title: "The Cell That Cannot Make Protein",
                situation:
                  "A researcher blocks the ribosomes in a cell. Within hours the cell stops producing enzymes, its repairs stall, and it begins to die.",
                question:
                  "Which organelle was disabled, and why does blocking it shut down so many different processes?",
                skill:
                  "Ribosomes build every protein the cell needs. Since enzymes, membrane channels, and structural fibres are all proteins, disabling ribosomes stops nearly every other process downstream.",
              },
              {
                title: "Muscle Cells and Mitochondria",
                situation:
                  "A biologist counts organelles and finds heart muscle cells contain far more mitochondria than skin cells do.",
                question:
                  "Why would a heart muscle cell need so many more mitochondria than a skin cell?",
                skill:
                  "Mitochondria produce ATP. Heart muscle contracts continuously for a lifetime and needs an enormous, constant energy supply, so it packs in far more mitochondria than a cell with lower energy demands.",
              },
              {
                title: "Why Cells Don't Collapse",
                situation:
                  "A cell is filled mostly with water-based cytoplasm. Water holds no shape on its own, yet cells keep their form even when squeezed or jostled.",
                question: "What stops a cell collapsing into a formless blob?",
                skill:
                  "The cytoskeleton — a network of microtubules and microfilaments running through the cytoplasm that resists compression and tension, exactly like the steel frame of a building.",
              },
              {
                title: "The Salty Water Experiment",
                situation:
                  "A student places plant cells in very salty water and watches under the microscope. Water leaves the cells and the contents shrink away from the cell wall.",
                question:
                  "Which structure allowed the water to leave, and what does this show about it?",
                skill:
                  "The cell membrane, through osmosis. Water passed through it from high to low water concentration, demonstrating selective permeability — the membrane let water through while holding other substances back.",
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
                title: "Drug Delivery",
                description:
                  "Medicines must cross the cell membrane to reach targets inside. Understanding selective permeability lets chemists design molecules that can get through.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "Dialysis Machines",
                description:
                  "Kidney dialysis uses an artificial selectively permeable membrane — copying the cell membrane — to filter waste from a patient's blood.",
                icon: "🏥",
                color: "border-l-secondary-500",
              },
              {
                title: "Antibiotics and Ribosomes",
                description:
                  "Bacterial ribosomes differ from human ones. Antibiotics such as erythromycin target bacterial ribosomes specifically, killing the microbe without harming you.",
                icon: "🦠",
                color: "border-l-accent-500",
              },
              {
                title: "Dietary Fibre",
                description:
                  "The cellulose in plant cell walls is the fibre in your diet. Humans cannot digest it, which is exactly why it keeps the digestive system working properly.",
                icon: "🥦",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
