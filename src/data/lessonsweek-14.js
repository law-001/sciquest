// Week 14: Cell Reproduction and the Cell Cycle — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd Quarter Week 4 (site Week 14).
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
    "Find out how parents pass genetic information to their offspring, how many parents sexual and asexual reproduction need, and what a cell does in each stage of the cell cycle.",
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
        "Learn why cells reproduce, how genetic information passes from parents to offspring during fertilization, and how many parents sexual and asexual reproduction need.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: celldivision,
      heroImageAlt: "Illustration of one cell dividing into two daughter cells",

      signature: {
        widgetId: "surface-volume",
        heading: "Watch It: The Middle Starves First",
        intro: "Nutrients only reach 20 µm in. Grow the cell and watch.",
        instruction: "Grow it until the center starves, then divide",
        xp: 25,
        explainer: {
          title: "Why size forces a cell to divide",
          points: [
            "The teal dots always stopped at the same depth, so the fed shell stayed 20 µm thick however big you made the cell.",
            "On the growth race the volume curve pulled away from the surface curve, because volume cubes the radius and surface only squares it.",
            "So the starved core grew while the fed shell did not, and the mitochondria in the middle grayed out.",
            "Dividing halved the volume, and each daughter came out with a smaller core than its parent had.",
          ],
        },
      },

      sections: [
        "Overview",
        "Why Cells Reproduce",
        "From Parents to Offspring",
        "One Parent or Two?",
        "Think About It",
        "Cell Reproduction Helps People",
      ],

      references: [
        {
          label: "Britannica — Cell division",
          url: "https://www.britannica.com/science/cell-division",
        },
        {
          label: "Britannica — Reproduction (biology)",
          url: "https://www.britannica.com/science/reproduction-biology",
        },
        {
          label: "Khan Academy — Chromosomes, chromatids and sister chromatids",
          url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology/mitosis/a/chromosomes-chromatids-and-sister-chromatids",
        },
        {
          label: "CK-12 — Asexual vs. Sexual Reproduction",
          url: "https://www.ck12.org/c/biology/asexual-vs.-sexual-reproduction/",
        },
        {
          label: "Philippine Red Cross — Blood Services",
          url: "https://redcross.org.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "In Week 12 you learned that <strong class='text-primary-700'>all cells come from existing cells</strong>. The way one cell makes new cells is called <strong class='text-primary-700'>cell reproduction</strong>, or cell division.",
              "You started life as just one cell. That cell divided again and again until you had about 30 trillion cells. Cell division is how you grew, how a scraped knee heals, and how your body replaces worn-out cells every day.",
              "Cell reproduction is also how living things pass their traits to their offspring. A mango seedling grows into a mango tree, never a narra, because its cells carry the instructions it received from its parents.",
              "Understanding cell division is a way to <strong class='text-primary-700'>serve</strong> others. Doctors use it to treat cancer, heal wounds and save lives with blood and bone marrow donations.",
            ],
            didYouKnow:
              "Your bone marrow makes more than 2 million new red blood cells every second. That is why a healthy person who donates blood to the Philippine Red Cross can donate again after about three months.",
          },
        },

        {
          type: "reasonCards",
          heading: "Why Cells Reproduce",
          data: {
            intro:
              "Cells do not divide at random. They divide for a reason, and in a healthy body division is carefully controlled.",
            reasons: [
              {
                num: 1,
                title: "Growth",
                color: "primary",
                desc: "More cells, not bigger cells",
                content:
                  "A baby grows into an adult because its cells keep dividing. Living things grow by making more cells, not by making each cell bigger.",
              },
              {
                num: 2,
                title: "Repair",
                color: "secondary",
                desc: "Healing wounds and broken bones",
                content:
                  "When you get a cut, healthy cells at the edge of the wound divide to fill the gap. Without cell division, even a small cut would never heal.",
              },
              {
                num: 3,
                title: "Replacement",
                color: "accent",
                desc: "Worn-out cells are replaced",
                content:
                  "Red blood cells last about 120 days, and the outer skin is replaced every few weeks. Cell division makes new cells to take their place.",
              },
              {
                num: 4,
                title: "Reproduction",
                color: "primary",
                desc: "Making new living things",
                content:
                  "Bacteria and yeast reproduce just by dividing. Plants and animals make special sex cells that join to start a new organism.",
              },
              {
                num: 5,
                title: "Size Limit",
                color: "secondary",
                desc: "A cell cannot grow forever",
                content:
                  "As a cell grows, its inside grows faster than its outer surface. A cell that is too big cannot take in enough food or remove enough wastes through its membrane, so it divides.",
              },
              {
                num: 6,
                title: "When Division Goes Wrong",
                color: "accent",
                desc: "Why control matters",
                content:
                  "Healthy cells stop dividing when they touch their neighbors. This is called contact inhibition, and it is why a wound closes and then stops growing. Cancer happens when a cell loses this control and keeps dividing, forming a lump called a tumor.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "From Parents to Offspring",
          data: {
            intro:
              "How does a baby get traits from both its mother and its father? Follow the genetic information step by step.",
            steps: [
              {
                num: 1,
                title: "Instructions Are Stored in DNA",
                color: "primary",
                description:
                  "Every cell has DNA, the set of instructions for building and running the body. A section of DNA that controls one trait, such as eye color or blood type, is called a gene.",
                tip: "DNA is packed into structures called chromosomes inside the nucleus.",
              },
              {
                num: 2,
                title: "Body Cells Have 46 Chromosomes",
                color: "secondary",
                description:
                  "A human body cell has 46 chromosomes arranged in 23 pairs. In each pair, one chromosome came from the mother and one came from the father.",
                tip: "Other living things have different numbers. Rice has 24 chromosomes in each body cell.",
              },
              {
                num: 3,
                title: "Sex Cells Get Only Half",
                color: "accent",
                description:
                  "Parents make sex cells, also called gametes: sperm cells in males and egg cells in females. Each gamete gets only one chromosome from each pair, so it has 23 chromosomes.",
                tip: "Gametes are made by a special division called meiosis. You will study it next week.",
              },
              {
                num: 4,
                title: "Fertilization Joins Them",
                color: "primary",
                description:
                  "During fertilization, a sperm cell joins with an egg cell. Their nuclei combine: 23 chromosomes from the father plus 23 from the mother makes 46 again. The new cell is called a zygote.",
                tip: "This is how the offspring gets half of its genetic information from each parent.",
              },
              {
                num: 5,
                title: "The Zygote Divides and Grows",
                color: "secondary",
                description:
                  "The zygote divides by mitosis again and again. Each new cell gets an exact copy of the same 46 chromosomes, so every cell of the new organism carries the genes from both parents.",
                tip: "That is why a child can have the father's curly hair and the mother's eye shape.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "One Parent or Two?",
          data: {
            intro:
              "Living things reproduce in two main ways. The biggest difference is the number of parents.",
            left: {
              label: "Sexual Reproduction",
              color: "primary",
              items: [
                "Needs TWO parents, a male and a female",
                "Each parent gives one gamete (sperm or egg)",
                "Fertilization joins the two gametes",
                "Offspring get half of their genes from each parent",
                "Offspring are similar to, but different from, the parents",
                "Examples: humans, chickens, bangus, mango trees",
              ],
            },
            right: {
              label: "Asexual Reproduction",
              color: "secondary",
              items: [
                "Needs only ONE parent",
                "No gametes and no fertilization",
                "The parent's cells divide by mitosis",
                "Offspring get all of their genes from the one parent",
                "Offspring are identical copies of the parent",
                "Examples: bacteria, yeast, katakataka, kamote cuttings",
              ],
            },
          },
        },

        {
          type: "scenario",
          heading: "Think About It",
          data: {
            intro:
              "Use what you learned about chromosomes, fertilization and the number of parents.",
            scenarios: [
              {
                title: "Counting Chromosomes",
                situation:
                  "A rice plant has 24 chromosomes in each body cell.",
                question:
                  "How many chromosomes are in each rice gamete? How many will the zygote have after fertilization?",
                skill:
                  "Each gamete has half, so 12 chromosomes. After fertilization, 12 + 12 = 24 chromosomes in the zygote, the same as the parents' body cells.",
              },
              {
                title: "Like Mother, Like Father",
                situation:
                  "Ana has her mother's dimples and her father's curly hair.",
                question:
                  "Explain how she got traits from both parents.",
                skill:
                  "Ana's first cell (zygote) formed when her father's sperm, with 23 chromosomes, joined her mother's egg, with 23 chromosomes. She got half of her genes from each parent, including genes for dimples and curly hair.",
              },
              {
                title: "Kamote Cuttings",
                situation:
                  "A farmer plants stem cuttings from one kamote plant. All the new plants have the same leaf shape and the same purple roots.",
                question:
                  "How many parents do the new plants have, and why are they all alike?",
                skill:
                  "One parent. This is asexual reproduction: the new plants grow from the parent's cells by mitosis, with no fertilization, so they have exactly the same genes as the parent.",
              },
              {
                title: "A Wound That Heals",
                situation:
                  "Miguel scrapes his elbow playing basketball. A week later, new skin has covered the wound and stopped growing.",
                question:
                  "Why is cell reproduction important here, and why did the skin stop growing?",
                skill:
                  "Skin cells at the edge of the wound divided to make new cells and repair the damage. They stopped dividing once they touched each other and the gap was filled, because healthy cells divide only when needed.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Cell Reproduction Helps People",
          data: {
            apps: [
              {
                title: "Blood Donation",
                description:
                  "Donated blood can save someone in an accident or surgery. The donor's bone marrow divides to replace the lost blood cells within weeks.",
                icon: "🩸",
                color: "border-l-primary-500",
              },
              {
                title: "Cancer Treatment",
                description:
                  "Doctors treat cancer with medicines and radiation that stop fast-dividing cells. Knowing how cells divide helps them choose the right treatment.",
                icon: "🏥",
                color: "border-l-secondary-500",
              },
              {
                title: "Growing More Plants",
                description:
                  "Farmers grow kamote, cassava and sugarcane from cuttings. Plant nurseries use the same idea to grow many copies of a good plant.",
                icon: "🌱",
                color: "border-l-accent-500",
              },
              {
                title: "Healing and Recovery",
                description:
                  "Eating enough protein, vitamins and minerals gives your cells what they need to divide and repair your body after an injury.",
                icon: "🩹",
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
        "Define the cell cycle, describe its two main stages, interphase and the mitotic phase, and find out what a cell does during interphase.",
      readTime: "~15 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt:
        "Circular diagram of the cell cycle showing G1, S and G2 of interphase and the short mitotic phase",

      signature: {
        widgetId: "cycle-dial",
        heading: "Watch It: Turn the Cycle by Hand",
        intro: "One dial runs the whole cycle. Turn it and watch the cell.",
        instruction: "Turn a full cycle, then trigger the checkpoint",
        xp: 25,
        explainer: {
          title: "What the dial showed you",
          points: [
            "Each chromosome grew its second chromatid only while you were inside S, and the DNA graph stepped up in that band and nowhere else.",
            "G₁, S and G₂ took up most of the ring. Mitosis was the short red slice where the chromosomes lined up and were pulled apart.",
            "With the DNA damaged, the dial refused to move past G₂. The checkpoint held the cell rather than letting it copy a fault into two new cells.",
            "Repairing the damage opened the gate again, which is what a healthy cell does before it is allowed to divide.",
          ],
        },
      },

      sections: [
        "Overview",
        "The Stages of the Cell Cycle",
        "What Happens During Interphase",
        "Interphase vs. Mitotic Phase",
        "Think About It",
        "Why the Cell Cycle Matters",
      ],

      references: [
        {
          label: "Britannica — Cell cycle",
          url: "https://www.britannica.com/science/cell-cycle",
        },
        {
          label: "Khan Academy — Phases of the cell cycle",
          url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology/mitosis/a/cell-cycle-phases",
        },
        {
          label: "CK-12 — Cell Cycle",
          url: "https://www.ck12.org/c/biology/cell-cycle/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>cell cycle</strong> is the series of stages a cell goes through from the time it is formed until it divides into two new cells. Then each new cell starts the cycle again.",
              "The cell cycle has two main stages. In <strong class='text-primary-700'>interphase</strong>, the cell grows, does its normal job and copies its DNA. In the <strong class='text-primary-700'>mitotic phase</strong>, the cell divides into two.",
              "Think of it like preparing for a school field trip. Most of the time goes into getting ready: saving money, packing food and checking the list. The trip itself is short. In the same way, a cell spends about 90% of its time in interphase and only about 10% dividing.",
            ],
            didYouKnow:
              "Not all cells keep cycling. Most nerve cells in your brain stop dividing and stay in a resting stage called G0 for the rest of your life.",
          },
        },

        {
          type: "timeline",
          heading: "The Stages of the Cell Cycle",
          data: {
            intro:
              "The cell cycle always goes in the same order. The first three stages make up interphase; the last two make up the mitotic phase.",
            steps: [
              {
                num: 1,
                title: "G1 — First Growth (Interphase)",
                color: "primary",
                description:
                  "The new cell grows bigger, makes more organelles and does its normal job. A liver cell cleans the blood; a leaf cell makes food.",
                tip: "G stands for “gap,” the time between one division and the next.",
              },
              {
                num: 2,
                title: "S — DNA Copying (Interphase)",
                color: "secondary",
                description:
                  "The cell copies all of its DNA. After this stage, each chromosome is made of two identical copies, called sister chromatids, joined at the center.",
                tip: "S stands for “synthesis,” which means making something new. Here, the cell makes new DNA.",
              },
              {
                num: 3,
                title: "G2 — Second Growth (Interphase)",
                color: "accent",
                description:
                  "The cell keeps growing and gets ready to divide. It makes the proteins and structures it will need, and checks that the DNA was copied correctly.",
                tip: "If the cell finds mistakes in its DNA, it stops to fix them first.",
              },
              {
                num: 4,
                title: "Mitosis (Mitotic Phase)",
                color: "primary",
                description:
                  "The nucleus divides. The copied chromosomes are pulled apart so that each new nucleus gets one complete set. Mitosis has four steps: prophase, metaphase, anaphase and telophase.",
                tip: "Remember the steps with PMAT. You will study each one next week.",
              },
              {
                num: 5,
                title: "Cytokinesis (Mitotic Phase)",
                color: "secondary",
                description:
                  "The cytoplasm splits and two separate daughter cells are formed. Each daughter cell has its own nucleus and starts the cycle again at G1.",
                tip: "An animal cell pinches in the middle. A plant cell builds a new wall, called a cell plate, down the middle.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "What Happens During Interphase",
          data: {
            intro:
              "Interphase is sometimes called the “resting stage,” but the cell is not resting at all. It is busy with four important jobs.",
            reasons: [
              {
                num: 1,
                title: "The Cell Does Its Job",
                color: "primary",
                desc: "Normal work, all day long",
                content:
                  "During interphase, a muscle cell contracts, a nerve cell sends signals and a leaf cell makes food. This is what most cells are doing most of the time.",
              },
              {
                num: 2,
                title: "The Cell Grows",
                color: "secondary",
                desc: "G1 and G2",
                content:
                  "The cell gets bigger and makes more organelles, such as mitochondria and ribosomes, so that each daughter cell will have enough.",
              },
              {
                num: 3,
                title: "The DNA Is Copied",
                color: "accent",
                desc: "S phase",
                content:
                  "Every chromosome is copied exactly, so that each daughter cell will receive a complete set of instructions. In humans, that means two full copies of all 46 chromosomes.",
              },
              {
                num: 4,
                title: "The Cell Gets Ready to Divide",
                color: "primary",
                desc: "End of G2",
                content:
                  "The cell makes the proteins that will pull the chromosomes apart and checks that everything is ready. Only then does it move on to mitosis.",
              },
              {
                num: 5,
                title: "Checkpoints Check the Work",
                color: "secondary",
                desc: "The cell's quality control",
                content:
                  "At checkpoints, the cell asks: Am I big enough? Is my DNA undamaged? Was it copied correctly? If a problem cannot be fixed, a healthy cell destroys itself instead of passing on damaged DNA. Cancer cells have broken checkpoints.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Interphase vs. Mitotic Phase",
          data: {
            intro:
              "Many students think a cell spends most of its life dividing. The opposite is true.",
            left: {
              label: "Interphase (about 90% of the time)",
              color: "primary",
              items: [
                "Made of three parts: G1, S and G2",
                "The cell does its normal job",
                "The cell grows and makes more organelles",
                "The DNA is copied (during S)",
                "The DNA is loose, so chromosomes cannot be seen",
                "The nucleus is whole and easy to see",
              ],
            },
            right: {
              label: "Mitotic Phase (about 10% of the time)",
              color: "secondary",
              items: [
                "Made of two parts: mitosis and cytokinesis",
                "The cell's normal work mostly pauses",
                "The cell does not grow",
                "The DNA is not copied again, only separated",
                "The DNA is tightly packed into visible chromosomes",
                "The nuclear membrane breaks down for a while",
              ],
            },
          },
        },

        {
          type: "scenario",
          heading: "Think About It",
          data: {
            intro:
              "Use what you know about the stages of the cell cycle to answer each one.",
            scenarios: [
              {
                title: "Counting Cells",
                situation:
                  "Onion root tips have many dividing cells. A class looks at 100 cells in an onion root tip slide. They find 90 cells with a smooth, round nucleus (interphase) and 10 cells with visible chromosomes (dividing).",
                question:
                  "What does this tell you about how long each stage lasts?",
                skill:
                  "Interphase is much longer than the mitotic phase. Since about 90 out of 100 cells were in interphase, cells spend about 90% of the cell cycle in interphase and only about 10% dividing.",
              },
              {
                title: "The Missing Copy",
                situation:
                  "Suppose a cell skipped the S phase and went straight to mitosis.",
                question: "What problem would the daughter cells have?",
                skill:
                  "The DNA would not have been copied, so there would not be a complete set of chromosomes for each daughter cell. Each one would get only part of the instructions and would not work properly. That is why the G2 checkpoint makes sure the DNA was copied first.",
              },
              {
                title: "Resting or Working?",
                situation:
                  "A classmate says, “Interphase is the resting stage, so the cell is doing nothing.”",
                question: "Is this correct? Explain.",
                skill:
                  "No. During interphase the cell does its normal job, grows, makes organelles and copies its DNA. It is only “resting” from dividing.",
              },
              {
                title: "Order of Stages",
                situation:
                  "The stages of the cell cycle are written on cards in the wrong order: S, cytokinesis, G2, G1, mitosis.",
                question: "Put them in the correct order.",
                skill:
                  "G1 → S → G2 → mitosis → cytokinesis. Then each daughter cell starts again at G1.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Why the Cell Cycle Matters",
          data: {
            apps: [
              {
                title: "Fighting Cancer",
                description:
                  "Some cancer medicines stop cells from copying their DNA in S phase; others stop chromosomes from being pulled apart in mitosis. Both slow down cancer cells.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "Healing Wounds",
                description:
                  "When you get hurt, resting cells near the wound go back into the cell cycle and start dividing to repair the damage.",
                icon: "🩹",
                color: "border-l-secondary-500",
              },
              {
                title: "Growing Crops",
                description:
                  "Plants grow at their root and shoot tips, where cells cycle quickly. Healthy soil and water help these cells keep dividing so rice and corn grow well.",
                icon: "🌾",
                color: "border-l-accent-500",
              },
              {
                title: "Serving Patients",
                description:
                  "Medical technologists study blood and tissue samples to check for cells that divide abnormally. Their work helps doctors find diseases early.",
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
