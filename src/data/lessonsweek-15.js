// Week 15: Cell Reproduction: Mitosis — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week15 = {
  id: "week-15",
  weekNumber: 15,
  title: "Cell Reproduction: Mitosis",
  category: "Life Science",
  description:
    "Understand the cell cycle and the stages of mitosis — the process by which cells divide to support growth and repair.",
  icon: "Copy",
  color: "primary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 43 — The Cell Cycle
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-43",
      weekId: "week-15",
      lessonNumber: 43,
      title: "The Cell Cycle",
      badge: "Lesson 43",
      subtitle:
        "Understand the ordered phases of a cell's life and what happens at each stage before and during division.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt:
        "Circular diagram of the cell cycle showing interphase and mitotic phase",

      sections: [
        "Overview",
        "Key Concepts",
        "Phases of the Cell Cycle",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>cell cycle</strong> is the ordered sequence of events that a cell goes through from its formation until it divides into two daughter cells. The cycle has two main stages: <strong class='text-primary-700'>interphase</strong> — where the cell grows and prepares — and the <strong class='text-primary-700'>mitotic phase</strong> — where it actually divides.",
              "Most of a cell's life is spent in interphase, not in active division. During this time, the cell carries out its normal functions, grows larger, and — most critically — copies all of its DNA so that each daughter cell will receive a complete set of genetic instructions. A system of <strong class='text-primary-700'>checkpoints</strong> ensures the cell is ready at each stage before proceeding.",
            ],
            didYouKnow:
              "Cancer is essentially a disease of the cell cycle. Cancer cells have mutations that disable the checkpoint system, allowing them to divide without limit and without completing the preparation phases correctly.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Cell Cycle",
                desc: "The series of ordered events in a cell's life, from its creation through growth, DNA replication, and division into two daughter cells.",
              },
              {
                term: "Interphase",
                desc: "The longest phase of the cell cycle, during which the cell grows, carries out normal functions, and duplicates its DNA in preparation for division.",
              },
              {
                term: "Mitosis",
                desc: "The phase of cell division in which the nucleus divides, distributing one complete copy of DNA to each of the two forming daughter cells.",
              },
              {
                term: "Cytokinesis",
                desc: "The final step of cell division in which the cytoplasm splits, physically separating the two daughter cells.",
              },
              {
                term: "DNA Replication",
                desc: "The process during the S phase of interphase in which the cell makes an exact copy of all its DNA, so each daughter cell will receive a full genome.",
              },
              {
                term: "G1 Phase",
                desc: "The first growth phase of interphase; the cell grows in size, carries out normal metabolic activities, and produces proteins needed for DNA replication.",
              },
              {
                term: "S Phase",
                desc: "The synthesis phase of interphase; the cell replicates (copies) all of its DNA so that each daughter cell will receive a complete and identical genome.",
              },
              {
                term: "G2 Phase",
                desc: "The second growth phase of interphase; the cell continues to grow and produces proteins and organelles needed for the upcoming cell division.",
              },
              {
                term: "Checkpoint",
                desc: "A regulatory control point in the cell cycle where the cell checks whether it has properly completed the previous phase before proceeding to the next one.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Phases of the Cell Cycle",
          data: {
            intro:
              "The cell cycle is divided into distinct phases, each with a specific purpose. The first three phases (G1, S, G2) make up interphase, followed by the mitotic phase.",
            steps: [
              {
                num: 1,
                title: "G1 Phase (First Growth)",
                color: "primary",
                description:
                  "The cell grows in size and carries out its normal functions. It produces proteins, organelles, and other materials needed for DNA replication. A checkpoint at the end of G1 checks that the cell is large enough and the environment is favorable for division.",
                tip: "Cells that are not going to divide exit the cycle here and enter G0 — a resting state. Most neurons in your brain are permanently in G0.",
              },
              {
                num: 2,
                title: "S Phase (DNA Synthesis)",
                color: "secondary",
                description:
                  "The cell replicates all of its DNA, creating two identical copies of every chromosome. After S phase, the cell contains twice the normal amount of DNA. Each duplicated chromosome consists of two identical sister chromatids held together.",
                tip: "S phase stands for 'synthesis' — referring to the synthesis (copying) of new DNA strands.",
              },
              {
                num: 3,
                title: "G2 Phase (Second Growth)",
                color: "accent",
                description:
                  "The cell continues to grow and synthesizes proteins needed for mitosis, including the components of the spindle apparatus. A checkpoint verifies that DNA replication was completed correctly before the cell proceeds to divide.",
                tip: "If DNA errors are detected at the G2 checkpoint, the cycle pauses to allow repair. Unrepaired DNA errors can lead to mutations.",
              },
              {
                num: 4,
                title: "Mitosis",
                color: "primary",
                description:
                  "The nucleus divides through four stages (prophase, metaphase, anaphase, telophase), separating the duplicated chromosomes into two identical nuclei. The spindle apparatus attaches to chromosomes and pulls them apart.",
                tip: "Mitosis is often remembered using the mnemonic PMAT — Prophase, Metaphase, Anaphase, Telophase.",
              },
              {
                num: 5,
                title: "Cytokinesis",
                color: "secondary",
                description:
                  "The cytoplasm divides, completing the formation of two genetically identical daughter cells. In animal cells, the cell membrane pinches inward (cleavage furrow). In plant cells, a new cell wall forms down the middle (cell plate).",
                tip: "Cytokinesis overlaps with the end of mitosis (telophase). The result is two cells, each with a complete nucleus and a full set of organelles.",
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
                title: "Cancer Treatment",
                description:
                  "Chemotherapy drugs target rapidly dividing cancer cells by disrupting the cell cycle — some prevent DNA replication in S phase, others block spindle formation during mitosis.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "Wound Healing",
                description:
                  "When you cut your skin, surrounding cells activate their cell cycles to divide and replace the lost cells. Understanding this process helps scientists develop treatments to speed wound healing.",
                icon: "🩹",
                color: "border-l-secondary-500",
              },
              {
                title: "Understanding Aging",
                description:
                  "As cells age, their DNA accumulates damage and their checkpoints become less effective. Research into the cell cycle is helping scientists understand — and potentially slow — the aging process.",
                icon: "⏳",
                color: "border-l-accent-500",
              },
              {
                title: "Stem Cell Therapy",
                description:
                  "Stem cells are controlled through their cell cycle to differentiate into specific tissues for regenerative medicine — treating conditions from spinal cord injuries to heart damage.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 44 — Stages of Mitosis
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-44",
      weekId: "week-15",
      lessonNumber: 44,
      title: "Stages of Mitosis",
      badge: "Lesson 44",
      subtitle:
        "Walk through each stage of mitosis and understand exactly what happens to the chromosomes at each step.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt:
        "Microscope images showing four stages of mitosis in dividing cells",

      sections: [
        "Overview",
        "Stages of Mitosis",
        "Key Ideas",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Mitosis is the process by which one cell divides its nucleus to produce two nuclei, each containing an identical copy of the cell's DNA. Scientists divide mitosis into four stages — <strong class='text-primary-700'>Prophase, Metaphase, Anaphase, and Telophase</strong> — remembered by the mnemonic PMAT.",
              "The result of mitosis (followed by cytokinesis) is two <strong class='text-primary-700'>genetically identical daughter cells</strong>, each with the same number of chromosomes as the parent cell. In human body cells, this means each daughter cell receives 46 chromosomes — a complete and accurate copy of the genome.",
            ],
            didYouKnow:
              "Your body produces approximately 3.8 million new red blood cells every second through cell division. To keep up with this demand, your bone marrow cells are almost always in the cell cycle, dividing continuously throughout your life!",
          },
        },

        {
          type: "imageCards",
          heading: "Stages of Mitosis",
          data: {
            cards: [
              {
                title: "Prophase",
                label: "Stage 1",
                variant: "primary",
                color: "primary",
                desc: "Chromosomes condense and become visible, the spindle apparatus forms, and the nuclear envelope breaks down.",
                image: microscope,
                imageAlt:
                  "Microscope image of a cell in prophase with condensed chromosomes",
                examples: [
                  "Chromosomes condense — become short and thick",
                  "Spindle fibers begin to form from centrioles",
                  "Nuclear membrane breaks down",
                ],
              },
              {
                title: "Metaphase",
                label: "Stage 2",
                variant: "secondary",
                color: "secondary",
                desc: "Chromosomes line up at the cell's equator (metaphase plate), attached to spindle fibers from both poles.",
                image: simulation,
                imageAlt:
                  "Diagram of metaphase showing chromosomes aligned at the center",
                examples: [
                  "Chromosomes align at the metaphase plate (cell center)",
                  "Spindle fibers from opposite poles attach to centromeres",
                  "This is the easiest stage to count chromosomes",
                ],
              },
              {
                title: "Anaphase",
                label: "Stage 3",
                variant: "primary",
                color: "primary",
                desc: "Sister chromatids are pulled apart to opposite poles of the cell as spindle fibers shorten.",
                image: equation,
                imageAlt:
                  "Diagram showing sister chromatids being pulled to opposite poles in anaphase",
                examples: [
                  "Sister chromatids separate and are pulled apart",
                  "Spindle fibers shorten, pulling chromosomes toward poles",
                  "Cell begins to elongate",
                ],
              },
              {
                title: "Telophase + Cytokinesis",
                label: "Stage 4 + Final",
                variant: "secondary",
                color: "secondary",
                desc: "Nuclear envelopes reform around each set of chromosomes, then the cytoplasm divides to form two daughter cells.",
                image: lab,
                imageAlt:
                  "Diagram of telophase showing two forming nuclei and cytokinesis",
                examples: [
                  "Nuclear envelopes reform around each pole",
                  "Chromosomes decondense back to chromatin",
                  "Cytokinesis: cytoplasm divides — two daughter cells form",
                ],
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Key Ideas",
          data: {
            concepts: [
              "The four stages of mitosis are remembered with the mnemonic PMAT: Prophase, Metaphase, Anaphase, Telophase.",
              "Mitosis produces two daughter cells that are genetically identical to each other and to the original parent cell — each receives a complete, accurate copy of the genome.",
              "In humans, each daughter cell from mitosis contains 46 chromosomes (diploid, 2n) — the same as the parent cell.",
              "Spindle fibers are microtubules made of the protein tubulin that extend from centrioles and attach to chromosomes at structures called kinetochores during mitosis.",
              "Cytokinesis in animal cells occurs by the cell membrane pinching inward (a cleavage furrow), while in plant cells a new cell wall called a cell plate forms between the two nuclei.",
              "Mitosis produces genetically identical cells — it is used for growth, repair, and (in some organisms) asexual reproduction. It is different from meiosis, which produces sex cells.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Tissue Growth and Development",
                description:
                  "From a single fertilized egg, mitosis produces the trillions of cells that make up a human body — all through repeated rounds of the cell cycle during embryonic development.",
                icon: "🌱",
                color: "border-l-primary-500",
              },
              {
                title: "Organ Development",
                description:
                  "Organs grow through precisely controlled mitosis. Scientists study mitotic regulation to understand how organs know when to stop growing — and why tumors keep going.",
                icon: "🫀",
                color: "border-l-secondary-500",
              },
              {
                title: "Replacing Dead Cells",
                description:
                  "Your skin cells live only about two to three weeks before dying. Mitosis in the skin's lower layer constantly produces new cells that push upward to replace dead skin — you replace your entire outer skin every month.",
                icon: "🩹",
                color: "border-l-accent-500",
              },
              {
                title: "Asexual Reproduction",
                description:
                  "Many single-celled organisms (like amoeba and yeast) reproduce entirely by mitosis, creating genetically identical offspring. Some animals like starfish can even regenerate lost body parts through mitosis.",
                icon: "🔄",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 45 — Importance and Applications of Mitosis
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-45",
      weekId: "week-15",
      lessonNumber: 45,
      title: "Importance and Applications of Mitosis",
      badge: "Lesson 45",
      subtitle:
        "Understand why mitosis is essential for life and how its breakdown leads to cancer.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "Lab setting with researchers studying cell division patterns",

      sections: [
        "Overview",
        "Why Mitosis Matters",
        "Mitosis in Real Life",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Mitosis is not just a biological process — it is the foundation of growth, repair, and life itself. From the moment a fertilized egg begins dividing until the day we die, mitosis is constantly occurring in our bodies to grow tissues, replace dead cells, and heal wounds.",
              "When the careful control of mitosis breaks down — when cells divide without following the checkpoint rules — the result is <strong class='text-primary-700'>cancer</strong>. Cancer is essentially mitosis gone wrong: cells that divide uncontrollably, ignoring signals to stop, forming tumors that can invade other tissues. Understanding mitosis is therefore central to understanding and treating cancer.",
            ],
            didYouKnow:
              "Chemotherapy works by targeting cells that are dividing rapidly — which includes cancer cells. Unfortunately, it also affects other rapidly dividing cells in your body, like hair follicle cells and gut lining cells, which is why patients often experience hair loss and nausea during treatment.",
          },
        },

        {
          type: "reasonCards",
          heading: "Why Mitosis Matters",
          data: {
            intro:
              "Mitosis is essential for multiple critical processes in every multicellular organism. Here are five key reasons why mitosis is one of the most important biological processes in nature.",
            reasons: [
              {
                num: 1,
                title: "Growth",
                color: "primary",
                desc: "Every multicellular organism grows from a single cell through repeated mitosis",
                content:
                  "A human being begins as one fertilized egg cell. Through trillions of mitotic divisions, that single cell becomes a complete organism with over 37 trillion cells. Every increase in size is the result of mitosis.",
              },
              {
                num: 2,
                title: "Repair",
                color: "secondary",
                desc: "Mitosis replaces damaged or dead cells to repair injured tissues",
                content:
                  "When you cut your skin or break a bone, mitosis in the surrounding healthy cells produces new cells to fill in the gap. Without mitosis, even a small cut would never heal.",
              },
              {
                num: 3,
                title: "Cell Replacement",
                color: "accent",
                desc: "Old and worn-out cells are continuously replaced throughout life",
                content:
                  "Red blood cells live only 120 days; skin cells live 2–3 weeks; gut lining cells live just 3–5 days. Mitosis continuously produces new cells to replace the ones that die naturally.",
              },
              {
                num: 4,
                title: "Asexual Reproduction",
                color: "primary",
                desc: "Some organisms reproduce entirely by mitosis, producing identical offspring",
                content:
                  "Bacteria, amoeba, yeast, and hydra reproduce by dividing through mitosis (or mitosis-like processes), creating genetically identical copies of themselves. Some plants also reproduce asexually through mitosis.",
              },
              {
                num: 5,
                title: "Development from Fertilized Egg",
                color: "secondary",
                desc: "Embryonic development relies entirely on precisely controlled mitosis",
                content:
                  "After fertilization, a single cell develops into a complete organism through mitosis combined with cell differentiation. The timing, rate, and location of mitosis determines the shape and size of every organ and body structure.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Mitosis in Real Life",
          data: {
            intro:
              "Mitosis happens in your body every second of every day. These scenarios help connect the stages of mitosis to the real biological situations you encounter.",
            scenarios: [
              {
                title: "Skin Healing After a Cut",
                situation:
                  "You scrape your knee and lose several layers of skin cells. Within hours, the area begins to heal, and within days, new skin covers the wound.",
                question:
                  "What is happening at the cellular level during this healing process?",
                skill:
                  "Cells at the edges of the wound receive chemical signals that trigger their cell cycles. They enter the cycle, complete interphase (growing and copying their DNA), then undergo mitosis to produce new skin cells. These new cells fill in and cover the wound. The process continues until the wound is fully covered, then stops when cells make contact (contact inhibition).",
              },
              {
                title: "Cancer Cells Dividing Without Stopping",
                situation:
                  "A mutation in a lung cell disables the G1 checkpoint. The cell begins dividing even when it receives signals telling it to stop. After many divisions, a visible tumor forms.",
                question:
                  "How does disabling the checkpoint lead to a tumor, and why is this dangerous?",
                skill:
                  "Checkpoints normally prevent cells from dividing if conditions are not right or if DNA is damaged. When a checkpoint is disabled by mutation, cells divide continuously without verifying that division is appropriate. The resulting uncontrolled divisions produce a mass of cells (a tumor). If these cells also lose the ability to stay in one place, the cancer can spread to other organs — a process called metastasis.",
              },
              {
                title: "Stem Cells in Therapy",
                situation:
                  "A patient with a damaged spinal cord receives a treatment where laboratory-grown stem cells are injected into the injury site. The stem cells divide and differentiate into nerve cells.",
                question:
                  "How is mitosis involved in this stem cell therapy, and why is it important?",
                skill:
                  "The stem cells use mitosis to produce many daughter cells at the injury site. These daughter cells then receive chemical signals that guide them through differentiation — they become specialized nerve cells. The new nerve cells can form connections and potentially restore some function to the damaged spinal cord. Without controlled mitosis, there would be no way to produce the large number of replacement cells needed for tissue repair.",
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
                title: "Wound Healing Research",
                description:
                  "Scientists study how cells trigger mitosis after injury to develop treatments that speed wound healing — especially for chronic wounds like diabetic ulcers that fail to heal normally.",
                icon: "🩹",
                color: "border-l-primary-500",
              },
              {
                title: "Cancer Research and Therapy",
                description:
                  "Most cancer treatments — chemotherapy, radiation, and targeted therapies — work by disrupting mitosis in rapidly dividing cancer cells. Research focuses on blocking specific mitotic proteins.",
                icon: "🔬",
                color: "border-l-secondary-500",
              },
              {
                title: "Organ Regeneration",
                description:
                  "Scientists are working to grow replacement organs (liver, kidney, skin) by seeding stem cells onto biological scaffolds and triggering controlled mitosis to grow functional tissue.",
                icon: "🫀",
                color: "border-l-accent-500",
              },
              {
                title: "Agricultural Cloning",
                description:
                  "Farmers and scientists use mitosis-based techniques to clone plants — producing genetically identical crops with desirable traits by taking cuttings and stimulating mitotic growth.",
                icon: "🌿",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
