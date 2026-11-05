// Week 15: Cell Division — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd Quarter Week 5 (site Week 15).
//   Lesson 1 — Mitosis Cell Division
//   Lesson 2 — Meiosis Cell Division

import celldivision from "../assets/celldivision.png";
import microscope from "../assets/week1/Microscopic.jpg";
import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week15 = {
  id: "week-15",
  weekNumber: 15,
  title: "Cell Division",
  category: "Life Science",
  description:
    "Follow mitosis through its four stages, then follow meiosis through two divisions, and learn why one makes identical cells and the other makes sex cells that are all different.",
  icon: "Shuffle",
  color: "primary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Mitosis Cell Division
    // ═══════════════════════════════════════════════════
    {
      id: "w15-l1",
      weekId: "week-15",
      lessonNumber: 1,
      title: "Mitosis Cell Division",
      badge: "Lesson 1",
      subtitle:
        "Define mitosis and its purpose, describe prophase, metaphase, anaphase and telophase, build a model of the process, and review the microscope, cell parts and early scientists.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: celldivision,
      heroImageAlt:
        "Microscope image of onion root tip cells in different stages of mitosis",

      signature: {
        widgetId: "mitosis-run",
        heading: "Watch It: Scrub a Division",
        intro: "One slider runs the whole division, forwards or backwards.",
        instruction: "Run it forwards and back, then switch to a plant cell",
        xp: 25,
        explainer: {
          title: "What the slider showed you",
          points: [
            "Dragging backwards worked because each chromosome position is worked out from the slider, not replayed from a recording.",
            "The chromatids only split in anaphase, so each pole ended with a full set of four chromosomes.",
            "The animal cell pinched inward. The plant cell built a plate outward, because a wall cannot be pinched.",
            "Both endings left two cells with matching chromosomes, which is the whole point of mitosis.",
          ],
        },
      },

      sections: [
        "Overview",
        "The Four Stages of Mitosis",
        "Build a Mitosis Model",
        "Review: Microscope, Cell Parts and Early Scientists",
        "Think About It",
        "Mitosis at Work",
      ],

      references: [
        {
          label: "Britannica — Mitosis",
          url: "https://www.britannica.com/science/mitosis",
        },
        {
          label: "Khan Academy — Phases of mitosis",
          url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology/mitosis/a/phases-of-mitosis",
        },
        {
          label: "CK-12 — Mitosis and Cytokinesis",
          url: "https://www.ck12.org/c/biology/mitosis/",
        },
        {
          label: "Britannica — Walther Flemming",
          url: "https://www.britannica.com/biography/Walther-Flemming",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Mitosis</strong> is the kind of cell division that makes two new cells that are exactly the same as the parent cell. Each new cell, called a <strong class='text-primary-700'>daughter cell</strong>, gets the same number and kind of chromosomes. In humans, that is 46.",
              "The purpose of mitosis is to make more of the same cells. Living things use it to <strong class='text-primary-700'>grow</strong>, to <strong class='text-primary-700'>repair</strong> wounds, to <strong class='text-primary-700'>replace</strong> worn-out cells, and, in some organisms, to reproduce asexually.",
              "Mitosis has four stages: <strong class='text-primary-700'>prophase, metaphase, anaphase and telophase</strong>. An easy way to remember them is PMAT. Remember, the DNA was already copied during interphase. Mitosis does not copy DNA; it separates the copies so each new cell gets one full set.",
            ],
            didYouKnow:
              "The word “mitosis” comes from the Greek word for “thread.” The German scientist Walther Flemming gave it this name in 1882, after he saw thread-like chromosomes in dividing cells under his microscope.",
          },
        },

        {
          type: "imageCards",
          heading: "The Four Stages of Mitosis",
          data: {
            cards: [
              {
                title: "Prophase",
                label: "Stage 1",
                variant: "primary",
                color: "primary",
                desc: "The chromosomes coil up and become thick enough to see. The nuclear membrane breaks down, and spindle fibers begin to form.",
                image: microscope,
                imageAlt:
                  "Microscope image of a cell in prophase with thick, visible chromosomes and no clear nuclear membrane",
                examples: [
                  "Each chromosome looks like an X: two sister chromatids",
                  "Spindle fibers stretch from the two ends of the cell",
                  "Usually the longest stage of mitosis",
                ],
              },
              {
                title: "Metaphase",
                label: "Stage 2",
                variant: "secondary",
                color: "secondary",
                desc: "The chromosomes line up in a single row across the middle of the cell. Spindle fibers from both ends attach to each one.",
                image: simulation,
                imageAlt:
                  "Microscope image of a cell in metaphase with chromosomes lined up in a row across the middle",
                examples: [
                  "M for Middle: the chromosomes meet in the middle",
                  "The easiest stage for counting chromosomes",
                ],
              },
              {
                title: "Anaphase",
                label: "Stage 3",
                variant: "primary",
                color: "primary",
                desc: "The spindle fibers shorten and pull the sister chromatids apart. One copy of each chromosome moves to each end of the cell.",
                image: equation,
                imageAlt:
                  "Microscope image of a cell in anaphase with two groups of chromosomes moving to opposite ends",
                examples: [
                  "A for Apart: the copies are pulled apart",
                  "The cell starts to stretch longer",
                ],
              },
              {
                title: "Telophase",
                label: "Stage 4",
                variant: "secondary",
                color: "secondary",
                desc: "A new nuclear membrane forms around each group of chromosomes, making two nuclei. Then cytokinesis splits the cell: an animal cell pinches in at a cleavage furrow, while a plant cell builds a cell plate that becomes the new wall.",
                image: lab,
                imageAlt:
                  "Microscope image of a cell in telophase with two new nuclei forming at opposite ends",
                examples: [
                  "T for Two: two nuclei are formed",
                  "Ends with two identical daughter cells",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Build a Mitosis Model",
          data: {
            intro:
              "Show the stages of mitosis with simple materials: a sheet of manila paper, colored yarn or pipe cleaners in two colors, and a marker. One color stands for the chromosomes from the mother, the other for the chromosomes from the father.",
            steps: [
              {
                num: 1,
                title: "Interphase: Set Up the Cell",
                color: "primary",
                description:
                  "Draw a big circle for the cell and a smaller circle inside for the nucleus. Place four short pieces of yarn (two of each color) inside the nucleus. Then add a matching copy beside each one to show the DNA was copied.",
                tip: "Twist each pair together in the middle to show the centromere joining the sister chromatids.",
              },
              {
                num: 2,
                title: "Prophase",
                color: "secondary",
                description:
                  "Erase or cross out the nucleus line to show the nuclear membrane breaking down. Draw lines from the top and bottom of the cell for the spindle fibers.",
                tip: "Make the chromosomes look thick and X-shaped now.",
              },
              {
                num: 3,
                title: "Metaphase",
                color: "accent",
                description:
                  "Line up all four X-shaped chromosomes in a row across the middle of the cell. Draw spindle fibers from both ends to each centromere.",
                tip: "Check that each chromosome is attached to fibers from both sides.",
              },
              {
                num: 4,
                title: "Anaphase",
                color: "primary",
                description:
                  "Untwist each pair and move one copy up and one copy down. Each end of the cell should now have four single chromosomes, two of each color.",
                tip: "Count them. If one end has more than the other, the model is wrong.",
              },
              {
                num: 5,
                title: "Telophase and Cytokinesis",
                color: "secondary",
                description:
                  "Draw a new nucleus around each group of chromosomes. Then draw a line across the middle to split the cell into two daughter cells. Label every stage.",
                tip: "Compare the two daughter cells with the cell you started with. Each should have the same four chromosomes as the parent.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Review: Microscope, Cell Parts and Early Scientists",
          data: {
            intro:
              "Mitosis brings together everything you have learned this quarter. Use these key ideas to connect the microscope, the cell and the scientists who studied it.",
            reasons: [
              {
                num: 1,
                title: "The Microscope Makes It Visible",
                color: "primary",
                desc: "Seeing mitosis",
                content:
                  "You need a compound microscope at about 400× to see chromosomes in an onion root tip. Start on low power, focus with the coarse knob, then switch to high power and use only the fine knob.",
              },
              {
                num: 2,
                title: "Cell Parts in Action",
                color: "secondary",
                desc: "Who does what",
                content:
                  "The nucleus holds the chromosomes. The nuclear membrane breaks down and forms again. The cell membrane pinches in an animal cell, while a new cell wall forms in a plant cell.",
              },
              {
                num: 3,
                title: "Early Scientists",
                color: "accent",
                desc: "Building the cell theory",
                content:
                  "Robert Hooke named “cells” (1665), Antonie van Leeuwenhoek saw the first living microbes, and Schleiden and Schwann said all living things are made of cells.",
              },
              {
                num: 4,
                title: "Every Cell from a Cell",
                color: "primary",
                desc: "Virchow and Flemming",
                content:
                  "Rudolf Virchow said that all cells come from existing cells (1855). Walther Flemming later watched cells divide and named the process mitosis (1882), showing how it happens.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Think About It",
          data: {
            intro:
              "Use what you know about the stages of mitosis to explain each one.",
            scenarios: [
              {
                title: "Counting Chromosomes",
                situation:
                  "Ana needs to count the chromosomes in an onion root tip cell. Most cells show only a round nucleus, but a few show chromosomes lined up in a row.",
                question:
                  "Which stage should she choose, and why?",
                skill:
                  "Metaphase. The chromosomes are thick and lined up in one row across the middle, so they do not overlap and each one can be counted.",
              },
              {
                title: "Name the Stage",
                situation:
                  "Under the microscope, Miguel sees a stretched cell with two groups of chromosomes moving toward opposite ends.",
                question: "Which stage of mitosis is this?",
                skill:
                  "Anaphase. The sister chromatids have been pulled apart, and each group is moving to an opposite end of the cell.",
              },
              {
                title: "How Many Chromosomes?",
                situation:
                  "A human skin cell with 46 chromosomes divides by mitosis.",
                question:
                  "How many daughter cells are formed, and how many chromosomes does each have?",
                skill:
                  "Two daughter cells, each with 46 chromosomes. Mitosis makes cells identical to the parent, so the number stays the same.",
              },
              {
                title: "Out of Order",
                situation:
                  "Your classmate's model shows the chromosomes lined up in the middle before the nuclear membrane has broken down.",
                question: "What is wrong with the model?",
                skill:
                  "The nuclear membrane breaks down in prophase, before the chromosomes line up in metaphase. The chromosomes cannot reach the middle of the cell while the nucleus is still whole.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Mitosis at Work",
          data: {
            apps: [
              {
                title: "Growing Up",
                description:
                  "From one cell, mitosis makes all the cells of your body. It is also why a tiny monggo seed can sprout into a seedling in just a few days.",
                icon: "🌱",
                color: "border-l-primary-500",
              },
              {
                title: "Healing and Replacing",
                description:
                  "Mitosis heals cuts and replaces the outer layer of your skin every few weeks. Your stomach lining is replaced every few days.",
                icon: "🩹",
                color: "border-l-secondary-500",
              },
              {
                title: "Copies of Good Plants",
                description:
                  "Farmers grow new banana, kamote and sugarcane plants from parts of a parent plant. Mitosis makes the new plants identical to the parent.",
                icon: "🍌",
                color: "border-l-accent-500",
              },
              {
                title: "Serving Cancer Patients",
                description:
                  "Some cancer medicines stop the spindle fibers from working, so cancer cells cannot finish mitosis. Knowing the stages helps doctors and researchers help patients.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Meiosis Cell Division
    // ═══════════════════════════════════════════════════
    {
      id: "w15-l2",
      weekId: "week-15",
      lessonNumber: 2,
      title: "Meiosis Cell Division",
      badge: "Lesson 2",
      subtitle:
        "Define meiosis and its purpose, follow the stages of meiosis I and meiosis II, compare meiosis with mitosis, and show the process with a diagram or model.",
      readTime: "~17 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Diagram of meiosis showing one cell dividing twice to make four sex cells",

      signature: {
        widgetId: "crossover-lab",
        heading: "Watch It: Drag the Crossover",
        intro: "Move the crossover one gene and two gametes change with it.",
        instruction: "Place a crossover, then run both divisions",
        xp: 25,
        explainer: {
          title: "Where your four gametes came from",
          points: [
            "Sliding the crossover changed the gene bands on two of the four gametes, and left the other two untouched.",
            "The count halved once, at meiosis I. Meiosis II split the chromatids but did not halve it again.",
            "With no crossover you only ever got two kinds of gamete, pure orange and pure teal.",
            "That swap is why no two of your gametes carry the same set of genes.",
          ],
        },
      },

      sections: [
        "Overview",
        "The Stages of Meiosis I and II",
        "Mitosis vs. Meiosis",
        "Draw a Meiosis Diagram",
        "Think About It",
        "Meiosis in Real Life",
      ],

      references: [
        {
          label: "Britannica — Meiosis",
          url: "https://www.britannica.com/science/meiosis",
        },
        {
          label: "Khan Academy — Phases of meiosis I and II",
          url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology/meiosis/a/phases-of-meiosis",
        },
        {
          label: "CK-12 — Meiosis",
          url: "https://www.ck12.org/c/biology/meiosis/",
        },
        {
          label: "PhilRice — Philippine Rice Research Institute",
          url: "https://www.philrice.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Meiosis</strong> is a special kind of cell division that makes sex cells, or <strong class='text-primary-700'>gametes</strong>: sperm cells in males and egg cells in females. It happens only in the reproductive organs, the testes and the ovaries. In flowering plants, it happens in the flowers.",
              "The purpose of meiosis is to make gametes with <strong class='text-primary-700'>half</strong> the number of chromosomes. A human body cell has 46 chromosomes, but each gamete has only 23. When a sperm and an egg join during fertilization, 23 + 23 = 46, the right number again.",
              "Meiosis has <strong class='text-primary-700'>two divisions</strong>, called meiosis I and meiosis II. One cell becomes four cells, and each of the four is genetically different. That is why brothers and sisters from the same parents do not look exactly alike.",
            ],
            didYouKnow:
              "Because of how meiosis shuffles chromosomes, one person can make more than 8 million different kinds of gametes, even before crossing over is counted.",
          },
        },

        {
          type: "timeline",
          heading: "The Stages of Meiosis I and II",
          data: {
            intro:
              "Before meiosis starts, the cell copies its DNA once during interphase, just like before mitosis. Meiosis I separates each pair of matching chromosomes. Meiosis II, with no DNA copying in between, separates the sister chromatids, a lot like mitosis.",
            steps: [
              {
                num: 1,
                title: "Prophase I",
                color: "primary",
                description:
                  "The chromosomes coil up and become visible. Each chromosome finds its matching partner (one from the mother, one from the father) and they pair up. The partners swap small pieces of DNA. This swap is called crossing over.",
                tip: "Crossing over happens only in prophase I. It never happens in mitosis.",
              },
              {
                num: 2,
                title: "Metaphase I",
                color: "secondary",
                description:
                  "The chromosome PAIRS line up across the middle of the cell. Which partner faces which side is random for every pair. This is called independent assortment, and it mixes the mother's and father's chromosomes differently in every gamete.",
                tip: "In mitosis, single chromosomes line up. In meiosis I, pairs line up.",
              },
              {
                num: 3,
                title: "Anaphase I",
                color: "accent",
                description:
                  "The partners in each pair are pulled to opposite ends of the cell. The sister chromatids of each chromosome stay joined together.",
                tip: "This is the step where the chromosome number is cut in half.",
              },
              {
                num: 4,
                title: "Telophase I",
                color: "primary",
                description:
                  "The cell divides into two cells. Each new cell has only one chromosome from each pair. In humans, each cell now has 23 chromosomes, each still made of two chromatids.",
                tip: "The two cells are already different from each other because of crossing over.",
              },
              {
                num: 5,
                title: "Prophase II and Metaphase II",
                color: "secondary",
                description:
                  "In each of the two cells, the chromosomes coil up again and new spindle fibers form. Then the chromosomes line up one by one across the middle, just like in mitosis.",
                tip: "No crossing over happens in meiosis II, and single chromosomes line up, not pairs.",
              },
              {
                num: 6,
                title: "Anaphase II",
                color: "accent",
                description:
                  "The sister chromatids are pulled apart and move to opposite ends of each cell.",
                tip: "Now each chromatid is a separate chromosome.",
              },
              {
                num: 7,
                title: "Telophase II",
                color: "primary",
                description:
                  "Both cells divide, making four cells in all. Each has 23 single chromosomes in humans, and no two cells have the same mix of genes, because of crossing over and independent assortment.",
                tip: "In males, all four become sperm cells. In females, usually one becomes an egg cell and the other three break down.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Mitosis vs. Meiosis",
          data: {
            intro:
              "Mitosis and meiosis both start with a cell that has copied its DNA, but they work differently and have different jobs.",
            left: {
              label: "Mitosis",
              color: "primary",
              items: [
                "Purpose: growth, repair and replacing cells",
                "Happens in body cells",
                "ONE division",
                "Makes 2 daughter cells",
                "Daughter cells are diploid: 46 chromosomes in humans",
                "Daughter cells are identical to the parent",
                "No pairing and no crossing over",
              ],
            },
            right: {
              label: "Meiosis",
              color: "secondary",
              items: [
                "Purpose: making sex cells (gametes)",
                "Happens only in the testes, ovaries or flowers",
                "TWO divisions: meiosis I and meiosis II",
                "Makes 4 daughter cells",
                "Daughter cells are haploid: 23 chromosomes in humans",
                "Daughter cells are all different from each other",
                "Matching chromosomes pair up and cross over",
              ],
            },
          },
        },

        {
          type: "timeline",
          heading: "Draw a Meiosis Diagram",
          data: {
            intro:
              "Illustrate meiosis on a sheet of bond paper using two colors of pencil: one for chromosomes from the mother and one for chromosomes from the father. Use a cell with 4 chromosomes (2 pairs) to keep it simple.",
            steps: [
              {
                num: 1,
                title: "Start with One Cell",
                color: "primary",
                description:
                  "Draw one cell with 4 X-shaped chromosomes: two long and two short, one of each in each color. Label it “2n = 4, DNA already copied.”",
                tip: "Each X is one chromosome made of two sister chromatids.",
              },
              {
                num: 2,
                title: "Show Crossing Over",
                color: "secondary",
                description:
                  "Draw the matching chromosomes side by side in pairs. Color a small tip of each chromosome with its partner's color to show the swapped pieces.",
                tip: "This step is what makes your four gametes different at the end.",
              },
              {
                num: 3,
                title: "Draw the End of Meiosis I",
                color: "accent",
                description:
                  "Draw two cells. Each gets one long and one short X-shaped chromosome. Label each “n = 2.”",
                tip: "Check: the pairs were split, but each chromosome still has two chromatids.",
              },
              {
                num: 4,
                title: "Draw the End of Meiosis II",
                color: "primary",
                description:
                  "Draw four cells. Each gets one long and one short single chromosome (no X shape). Label each “gamete, n = 2.”",
                tip: "Look at the colors: no two of your four gametes should be exactly the same.",
              },
              {
                num: 5,
                title: "Compare with Mitosis",
                color: "secondary",
                description:
                  "Beside your diagram, write how many cells you ended with, how many chromosomes each has, and whether they are identical. Compare with your mitosis model from Lesson 1.",
                tip: "Mitosis: 2 identical cells with 4 chromosomes. Meiosis: 4 different cells with 2 chromosomes.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Think About It",
          data: {
            intro:
              "Use what you know about meiosis and mitosis to answer each one.",
            scenarios: [
              {
                title: "Rice Gametes",
                situation:
                  "A rice plant has 24 chromosomes in each body cell. A cell in its flower goes through meiosis.",
                question:
                  "How many cells are made, and how many chromosomes does each have?",
                skill:
                  "Four cells, each with 12 chromosomes. Meiosis makes four haploid cells with half the chromosome number of the parent cell.",
              },
              {
                title: "Mitosis or Meiosis?",
                situation:
                  "A cell divides once and makes two cells with the same chromosomes as the parent.",
                question: "Which type of cell division is this?",
                skill:
                  "Mitosis. Meiosis would have two divisions, making four cells with half the chromosomes, and they would not be identical.",
              },
              {
                title: "Why Halve the Number?",
                situation:
                  "A classmate asks, “Why don't gametes just have all 46 chromosomes like other cells?”",
                question: "What would happen if they did?",
                skill:
                  "At fertilization, 46 + 46 would give the baby 92 chromosomes, double the normal number. Each generation would double again. Halving the number in meiosis keeps it at 46 in every generation.",
              },
              {
                title: "Brothers and Sisters",
                situation:
                  "Three siblings have the same parents, but they all look different.",
                question:
                  "Which events in meiosis explain the differences?",
                skill:
                  "Crossing over in prophase I and independent assortment (the random line-up of pairs) in metaphase I make every gamete different. Fertilization is also random: different sperm and eggs joined to form each sibling, so each got a different mix of genes.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Meiosis in Real Life",
          data: {
            apps: [
              {
                title: "Better Rice Varieties",
                description:
                  "PhilRice breeds new rice varieties by crossing parent plants. Meiosis mixes their genes, and breeders pick offspring with useful traits, such as resistance to floods or pests.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Stronger Farm Animals",
                description:
                  "The Philippine Carabao Center breeds carabaos that give more milk. Each calf gets a new mix of genes from both parents through meiosis and fertilization.",
                icon: "🐃",
                color: "border-l-secondary-500",
              },
              {
                title: "Chromosome Conditions",
                description:
                  "Sometimes chromosomes do not separate properly in meiosis, so a gamete gets an extra or a missing chromosome. Down syndrome happens when a person has an extra copy of chromosome 21.",
                icon: "🧬",
                color: "border-l-accent-500",
              },
              {
                title: "Helping Families",
                description:
                  "Doctors who understand meiosis can help couples who have trouble having children, and can explain conditions caused by chromosome differences with care and respect.",
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
