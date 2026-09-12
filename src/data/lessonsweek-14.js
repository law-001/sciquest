// Week 14: Cell Reproduction and the Cell Cycle — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd term Week 14.
//   Lesson 1 — Cell Reproduction
//   Lesson 2 — The Cell Cycle

import celldivision from "../assets/celldivision.png";
import flowchart from "../assets/flowchart.jpg";

export const week14 = {
  id: "week-14",
  weekNumber: 14,
  title: "Cell Reproduction and the Cell Cycle",
  category: "Life Science",
  description:
    "Discover why cells divide at all, what chromosomes carry, and the ordered cycle every cell passes through between one division and the next.",
  icon: "Copy",
  color: "secondary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Cell Reproduction
    // ═══════════════════════════════════════════════════
    {
      id: "w14-l1",
      weekId: "week-14",
      lessonNumber: 1,
      title: "Cell Reproduction",
      badge: "Lesson 1",
      subtitle:
        "Every cell alive today came from another cell. Find out why cells divide, what gets copied when they do, and why getting it exactly right matters so much.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: celldivision,
      heroImageAlt: "Illustration of a cell dividing into two daughter cells",

      sections: [
        "Overview",
        "Key Terms",
        "Why Cells Divide",
        "What Gets Copied: DNA and Chromosomes",
        "Two Kinds of Cell Division",
        "When Division Goes Wrong",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Cell Division",
          url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology",
        },
        {
          label: "Britannica — Cell Division",
          url: "https://www.britannica.com/science/cell-division",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "In Week 12 you learned Virchow's principle: <strong class='text-primary-700'>all cells come from pre-existing cells</strong>. <strong class='text-primary-700'>Cell reproduction</strong> — also called cell division — is how that happens. One cell becomes two, and each new cell receives a complete, accurate copy of the parent's genetic instructions.",
              "You began as a single fertilised cell. Every one of the roughly 37 trillion cells in your body today is a descendant of that one cell, produced by division after division after division. Cell reproduction is how you grew, how you heal, and how worn-out cells get replaced.",
              "There are two kinds. <strong class='text-primary-700'>Mitosis</strong> produces two identical cells for growth and repair. <strong class='text-primary-700'>Meiosis</strong> produces four genetically unique sex cells for reproduction. You will study both in detail next week.",
            ],
            didYouKnow:
              "Your body replaces about 330 billion cells every single day — roughly 1% of you. Most of them are blood cells and cells lining the gut, which wear out fastest.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Cell Reproduction",
                desc: "The process by which one cell divides to produce new cells, each receiving a copy of the genetic material. Also called cell division.",
              },
              {
                term: "DNA",
                desc: "Deoxyribonucleic acid — the molecule that carries the genetic instructions for building and running a living organism.",
              },
              {
                term: "Chromosome",
                desc: "A structure made of tightly coiled DNA and protein, found in the nucleus. Humans have 46 chromosomes in 23 pairs.",
              },
              {
                term: "Chromatin",
                desc: "The loose, uncoiled form DNA takes when a cell is not dividing. It condenses into visible chromosomes only for division.",
              },
              {
                term: "Sister Chromatids",
                desc: "The two identical copies of a chromosome produced by replication, joined together at the centromere until they are pulled apart.",
              },
              {
                term: "Centromere",
                desc: "The narrow point where two sister chromatids are joined, and where spindle fibres attach during division.",
              },
              {
                term: "Daughter Cells",
                desc: "The new cells produced when a parent cell divides.",
              },
              {
                term: "Mitosis",
                desc: "Cell division producing two genetically identical daughter cells, used for growth, repair, and asexual reproduction.",
              },
              {
                term: "Meiosis",
                desc: "Cell division producing four genetically unique haploid cells (gametes), used for sexual reproduction.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Why Cells Divide",
          data: {
            intro:
              "Cells do not divide at random. Division is triggered for specific reasons, and in a healthy body each one is tightly controlled.",
            reasons: [
              {
                num: 1,
                title: "Growth",
                color: "primary",
                desc: "Organisms get bigger by making more cells, not bigger cells",
                content:
                  "A human grows from one fertilised egg to trillions of cells. Notice that growth means MORE cells, not larger ones — a cell that grows too big cannot move materials through itself efficiently.",
              },
              {
                num: 2,
                title: "Repair",
                color: "secondary",
                desc: "Damaged tissue is rebuilt by dividing the cells around it",
                content:
                  "When you cut your skin or break a bone, healthy cells at the edges divide to produce new cells that fill the gap. Without cell division even a small cut would never heal.",
              },
              {
                num: 3,
                title: "Replacement",
                color: "accent",
                desc: "Worn-out cells are continuously replaced throughout life",
                content:
                  "Red blood cells last about 120 days, skin cells 2–3 weeks, and gut lining cells only 3–5 days. Division produces replacements at exactly the rate they die.",
              },
              {
                num: 4,
                title: "Reproduction",
                color: "primary",
                desc: "New organisms are produced through cell division",
                content:
                  "Bacteria, yeast, and hydra reproduce by dividing directly. Plants and animals produce sex cells by meiosis, which combine to start a new organism.",
              },
              {
                num: 5,
                title: "Surface Area to Volume",
                color: "secondary",
                desc: "There is a physical size limit that forces a cell to divide",
                content:
                  "As a cell grows, its volume increases faster than its surface area, so the membrane can no longer bring in enough nutrients or remove enough waste. Dividing restores a workable ratio.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "What Gets Copied: DNA and Chromosomes",
          data: {
            intro:
              "Before a cell can divide, the instructions inside it must be copied perfectly. Follow what happens to the DNA.",
            steps: [
              {
                num: 1,
                title: "DNA Stores the Instructions",
                color: "primary",
                description:
                  "DNA is a long molecule carrying the complete instructions for building and running the organism. Every cell in your body holds the same full set.",
                tip: "Stretched end to end, the DNA in one human cell would be about two metres long.",
              },
              {
                num: 2,
                title: "DNA Is Packed into Chromosomes",
                color: "secondary",
                description:
                  "To fit two metres of DNA into a microscopic nucleus, it wraps around proteins and coils tightly into structures called chromosomes. Humans have 46, arranged in 23 pairs.",
                tip: "One chromosome of each pair came from your mother and one from your father.",
              },
              {
                num: 3,
                title: "Chromatin Condenses for Division",
                color: "accent",
                description:
                  "Most of the time DNA sits loose and uncoiled as chromatin, so the cell can read it. Only when the cell prepares to divide does it condense into the thick, visible chromosomes you see in a textbook.",
                tip: "This is why you cannot see chromosomes in a normal cell under a microscope — only in a dividing one.",
              },
              {
                num: 4,
                title: "Each Chromosome Is Replicated",
                color: "primary",
                description:
                  "Before division, every chromosome is copied. The original and its copy stay joined at the centromere as identical sister chromatids, forming the familiar X shape.",
                tip: "After replication the cell holds twice the normal DNA — but still the same number of chromosomes, because the copies are still attached.",
              },
              {
                num: 5,
                title: "The Copies Are Separated",
                color: "secondary",
                description:
                  "During division, spindle fibres attach at the centromere and pull the sister chromatids apart, sending one to each end of the cell. Each daughter cell ends up with a complete set.",
                tip: "This separation is the single most important moment. An error here gives one cell too many chromosomes and the other too few.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Two Kinds of Cell Division",
          data: {
            intro:
              "Both start from one cell and both copy the DNA first, but they serve completely different purposes and produce different results. Next week covers each in detail.",
            left: {
              label: "Mitosis",
              color: "primary",
              items: [
                "Produces 2 daughter cells",
                "Daughter cells are genetically IDENTICAL to the parent",
                "Daughter cells are diploid (2n) — the full chromosome number",
                "ONE round of division",
                "Purpose: growth, repair, replacement, asexual reproduction",
              ],
            },
            right: {
              label: "Meiosis",
              color: "secondary",
              items: [
                "Produces 4 daughter cells",
                "Daughter cells are genetically UNIQUE — all different",
                "Daughter cells are haploid (n) — half the chromosome number",
                "TWO rounds of division",
                "Purpose: producing gametes for sexual reproduction",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "When Division Goes Wrong",
          data: {
            concepts: [
              "Cell division is normally controlled by chemical signals telling a cell when to divide and when to stop.",
              "Healthy cells stop dividing when they touch neighbouring cells — a control called contact inhibition. It is why a wound heals over and then stops.",
              "Cancer happens when mutations disable those controls and a cell divides continuously, ignoring every signal to stop.",
              "A mass of these uncontrolled cells forms a tumour, which takes nutrients and space from healthy tissue.",
              "If cancer cells also lose the ability to stay in place, they spread to other organs — a process called metastasis.",
              "Errors in separating chromosomes can leave a cell with too many or too few, which usually stops it working properly.",
              "Most chemotherapy works by attacking rapidly dividing cells — which is why it also affects hair and gut lining cells and causes side effects.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Wound Healing",
                description:
                  "Understanding how injury triggers cell division helps doctors treat chronic wounds, such as diabetic ulcers, that fail to heal on their own.",
                icon: "🩹",
                color: "border-l-primary-500",
              },
              {
                title: "Cancer Treatment",
                description:
                  "Chemotherapy and radiation both work by disrupting cell division in fast-dividing cancer cells.",
                icon: "🔬",
                color: "border-l-secondary-500",
              },
              {
                title: "Growing Replacement Tissue",
                description:
                  "Scientists grow skin, cartilage, and even heart tissue in laboratories by giving cells the right conditions to divide in a controlled way.",
                icon: "🫀",
                color: "border-l-accent-500",
              },
              {
                title: "Plant Cloning",
                description:
                  "Farmers take cuttings and stimulate cell division to grow whole new plants that are genetically identical to a chosen parent.",
                icon: "🌿",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — The Cell Cycle
    // ═══════════════════════════════════════════════════
    {
      id: "w14-l2",
      weekId: "week-14",
      lessonNumber: 2,
      title: "The Cell Cycle",
      badge: "Lesson 2",
      subtitle:
        "Understand the ordered phases of a cell's life — the long preparation of interphase, the division itself, and the checkpoints that police the whole thing.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt:
        "Circular diagram of the cell cycle showing interphase and the mitotic phase",

      sections: [
        "Overview",
        "Key Terms",
        "Phases of the Cell Cycle",
        "Interphase vs. Mitotic Phase",
        "Checkpoints",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — The Cell Cycle",
          url: "https://www.khanacademy.org/science/biology/cell-division",
        },
        {
          label: "Britannica — Cell Cycle",
          url: "https://www.britannica.com/science/cell-cycle",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>cell cycle</strong> is the ordered sequence of events a cell goes through from the moment it forms until it divides into two daughter cells. It has two main stages: <strong class='text-primary-700'>interphase</strong>, where the cell grows and prepares, and the <strong class='text-primary-700'>mitotic phase</strong>, where it actually divides.",
              "The striking thing is the proportion. A cell spends roughly 90% of its life in interphase and only about 10% actually dividing. Interphase is not a rest — it is when the cell does its normal job, grows, and copies every one of its chromosomes.",
              "A system of <strong class='text-primary-700'>checkpoints</strong> checks the cell's work before letting it continue. These checkpoints are what stand between a healthy body and uncontrolled division.",
            ],
            didYouKnow:
              "Cancer is essentially a disease of the cell cycle. Cancer cells carry mutations that disable the checkpoint system, letting them divide without ever confirming that conditions are right.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Cell Cycle",
                desc: "The ordered series of events in a cell's life, from its formation through growth and DNA replication to division into two daughter cells.",
              },
              {
                term: "Interphase",
                desc: "The longest stage of the cycle, made up of G1, S, and G2, during which the cell grows, works normally, and copies its DNA.",
              },
              {
                term: "G1 Phase",
                desc: "The first growth phase. The cell grows in size, carries out its normal functions, and makes the proteins needed for DNA replication.",
              },
              {
                term: "S Phase",
                desc: "The synthesis phase, when the cell replicates all of its DNA so each daughter cell will get a complete genome.",
              },
              {
                term: "G2 Phase",
                desc: "The second growth phase. The cell keeps growing and produces the proteins and organelles needed for division.",
              },
              {
                term: "Mitotic Phase",
                desc: "The stage where division actually happens — mitosis (the nucleus divides) followed by cytokinesis (the cytoplasm divides).",
              },
              {
                term: "Cytokinesis",
                desc: "The final step, in which the cytoplasm splits and two physically separate daughter cells are formed.",
              },
              {
                term: "Checkpoint",
                desc: "A control point where the cell verifies it has correctly completed the previous phase before being allowed to proceed.",
              },
              {
                term: "G0 Phase",
                desc: "A resting state outside the cycle. Cells that are not going to divide — such as most nerve cells — stay here permanently.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Phases of the Cell Cycle",
          data: {
            intro:
              "The cycle runs in a fixed order. The first three phases make up interphase; the last two are the mitotic phase.",
            steps: [
              {
                num: 1,
                title: "G1 Phase — First Growth",
                color: "primary",
                description:
                  "The cell grows in size and carries out its normal functions. It builds proteins, organelles, and everything needed for the DNA copying to come. A checkpoint at the end of G1 confirms the cell is big enough and conditions are favourable.",
                tip: "Cells that will never divide exit here into G0. Most of the neurons in your brain are permanently in G0.",
              },
              {
                num: 2,
                title: "S Phase — DNA Synthesis",
                color: "secondary",
                description:
                  "The cell replicates all of its DNA, producing two identical copies of every chromosome. Afterwards the cell holds twice the normal amount of DNA, with each chromosome now made of two sister chromatids joined at the centromere.",
                tip: "S stands for synthesis — the synthesis of new DNA strands.",
              },
              {
                num: 3,
                title: "G2 Phase — Second Growth",
                color: "accent",
                description:
                  "The cell continues growing and produces the proteins needed for division, including the components of the spindle apparatus. A checkpoint verifies that DNA replication finished correctly and without errors.",
                tip: "If DNA errors are found here, the cycle pauses for repair. Unrepaired errors become permanent mutations.",
              },
              {
                num: 4,
                title: "Mitosis — The Nucleus Divides",
                color: "primary",
                description:
                  "The nucleus divides through four stages — prophase, metaphase, anaphase, telophase — separating the duplicated chromosomes into two identical nuclei. Spindle fibres attach to the chromosomes and pull them apart.",
                tip: "Remember the order with PMAT: Prophase, Metaphase, Anaphase, Telophase. Next week covers each stage.",
              },
              {
                num: 5,
                title: "Cytokinesis — The Cell Divides",
                color: "secondary",
                description:
                  "The cytoplasm splits, completing two genetically identical daughter cells. In animal cells the membrane pinches inward to form a cleavage furrow; in plant cells a new cell plate forms down the middle.",
                tip: "Cytokinesis overlaps the end of mitosis. The result is two complete cells, each with a nucleus and a full set of organelles.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Interphase vs. Mitotic Phase",
          data: {
            intro:
              "Students often assume a cell spends most of its time dividing. The opposite is true, and the proportions matter.",
            left: {
              label: "Interphase (about 90% of the cycle)",
              color: "primary",
              items: [
                "Made up of three sub-phases: G1, S, and G2",
                "The cell performs its everyday job — a liver cell filters, a muscle cell contracts",
                "The cell grows larger and builds organelles",
                "DNA is copied during S phase",
                "DNA is loose chromatin — chromosomes are not visible",
              ],
            },
            right: {
              label: "Mitotic Phase (about 10% of the cycle)",
              color: "secondary",
              items: [
                "Made up of mitosis and cytokinesis",
                "Normal cell functions largely pause",
                "No growth — the cell is busy dividing",
                "The already-copied DNA is separated, not copied again",
                "DNA is condensed into visible chromosomes",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Checkpoints",
          data: {
            concepts: [
              "Checkpoints are quality-control stations where the cell verifies its work before moving on.",
              "The G1 checkpoint asks: is the cell big enough, are nutrients available, and is the DNA undamaged? If not, the cell pauses or exits to G0.",
              "The G2 checkpoint asks: was all the DNA copied, and was it copied correctly? Damaged DNA triggers a pause for repair.",
              "The M checkpoint, during mitosis, asks: is every chromosome properly attached to the spindle before they are pulled apart?",
              "If damage cannot be repaired, a healthy cell triggers its own controlled death — apoptosis — rather than passing on faulty DNA.",
              "Cancer cells carry mutations that disable one or more checkpoints, so they divide regardless of damage or crowding.",
              "This is why understanding the cell cycle is central to cancer research: the disease is a failure of these controls.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Cancer Treatment",
                description:
                  "Chemotherapy drugs target specific points in the cycle — some block DNA replication in S phase, others prevent spindle formation during mitosis.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "Wound Healing",
                description:
                  "Cells at a wound edge re-enter the cycle from G0 and begin dividing. Understanding that trigger helps doctors speed up healing.",
                icon: "🩹",
                color: "border-l-secondary-500",
              },
              {
                title: "Understanding Aging",
                description:
                  "As cells age their DNA accumulates damage and checkpoints become less reliable. Cell cycle research is central to the study of ageing.",
                icon: "⏳",
                color: "border-l-accent-500",
              },
              {
                title: "Stem Cell Therapy",
                description:
                  "Stem cells are guided through their cycle to divide and then specialise into the tissue a patient needs — nerve, heart, or blood.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
