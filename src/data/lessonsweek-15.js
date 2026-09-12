// Week 15: Cell Division — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd term Week 15.
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
    "Walk through mitosis stage by stage, then follow meiosis through both of its divisions — and see exactly why one makes copies and the other makes variety.",
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
        "Follow the four stages of mitosis — prophase, metaphase, anaphase, telophase — and see how one cell produces two perfect copies of itself.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: celldivision,
      heroImageAlt:
        "Microscope images showing the four stages of mitosis in dividing cells",

      signature: {
        widgetId: "mitosis-run",
        heading: "Watch It: Scrub a Division",
        intro:
          "Every chromosome position is computed from where the slider is, so dragging backwards runs the division in reverse rather than replaying a recording. The plant/animal switch changes only the last leg — a furrow pinching in, or a plate built outward.",
        instruction: "Run it both ways and see both endings",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "The Four Stages of Mitosis",
        "Cytokinesis in Plants and Animals",
        "Key Ideas",
        "Mitosis in Real Life",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Mitosis",
          url: "https://www.khanacademy.org/science/biology/cell-division",
        },
        {
          label: "Britannica — Mitosis",
          url: "https://www.britannica.com/science/mitosis",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Mitosis</strong> is the process by which one cell divides its nucleus to produce two nuclei, each holding an identical copy of the cell's DNA. Scientists divide it into four stages — <strong class='text-primary-700'>Prophase, Metaphase, Anaphase, and Telophase</strong> — remembered by the mnemonic PMAT.",
              "The result of mitosis, followed by cytokinesis, is two <strong class='text-primary-700'>genetically identical daughter cells</strong>, each with the same chromosome number as the parent. In human body cells that means each daughter receives all 46 chromosomes — a complete and accurate copy.",
              "Remember that the DNA was already copied during S phase of interphase, before mitosis started. Mitosis does not copy DNA; it <em>separates</em> copies that already exist.",
            ],
            didYouKnow:
              "Your body produces about 3.8 million new red blood cells every second. Bone marrow cells are almost permanently in the cell cycle to keep up with that demand.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Mitosis",
                desc: "Division of the nucleus producing two genetically identical nuclei, each with the full chromosome number.",
              },
              {
                term: "Prophase",
                desc: "The first stage: chromosomes condense and become visible, spindle fibres form, and the nuclear membrane breaks down.",
              },
              {
                term: "Metaphase",
                desc: "The second stage: chromosomes line up along the centre of the cell, attached to spindle fibres from both poles.",
              },
              {
                term: "Anaphase",
                desc: "The third stage: sister chromatids are pulled apart to opposite poles as the spindle fibres shorten.",
              },
              {
                term: "Telophase",
                desc: "The fourth stage: nuclear membranes reform around each set of chromosomes, which then decondense back into chromatin.",
              },
              {
                term: "Spindle Fibre",
                desc: "A microtubule made of the protein tubulin that extends from the poles and attaches to a chromosome to pull it apart.",
              },
              {
                term: "Metaphase Plate",
                desc: "The imaginary line across the middle of the cell where chromosomes align during metaphase.",
              },
              {
                term: "Cleavage Furrow",
                desc: "The inward pinch of the cell membrane that divides an animal cell during cytokinesis.",
              },
              {
                term: "Cell Plate",
                desc: "The new wall that forms down the middle of a dividing plant cell during cytokinesis.",
              },
              {
                term: "Diploid (2n)",
                desc: "Having the full set of chromosomes — two of each kind. Human body cells are diploid with 46 chromosomes.",
              },
            ],
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
                desc: "Chromosomes condense and become visible, the spindle begins to form, and the nuclear envelope breaks down.",
                image: microscope,
                imageAlt:
                  "Microscope image of a cell in prophase with condensed chromosomes",
                examples: [
                  "Chromosomes condense — short, thick, and visible",
                  "Spindle fibres begin forming from the poles",
                  "Nuclear membrane breaks down, releasing the chromosomes",
                ],
              },
              {
                title: "Metaphase",
                label: "Stage 2",
                variant: "secondary",
                color: "secondary",
                desc: "Chromosomes line up along the cell's equator, each attached to spindle fibres reaching from both poles.",
                image: simulation,
                imageAlt:
                  "Diagram of metaphase showing chromosomes aligned at the centre",
                examples: [
                  "Chromosomes align at the metaphase plate",
                  "Spindle fibres from opposite poles attach at each centromere",
                  "The easiest stage for counting chromosomes",
                ],
              },
              {
                title: "Anaphase",
                label: "Stage 3",
                variant: "primary",
                color: "primary",
                desc: "Sister chromatids are pulled apart to opposite poles as the spindle fibres shorten.",
                image: equation,
                imageAlt:
                  "Diagram showing sister chromatids pulled to opposite poles in anaphase",
                examples: [
                  "Sister chromatids separate at the centromere",
                  "Shortening spindle fibres drag them toward the poles",
                  "The cell begins to elongate",
                ],
              },
              {
                title: "Telophase and Cytokinesis",
                label: "Stage 4",
                variant: "secondary",
                color: "secondary",
                desc: "Nuclear envelopes reform around each set of chromosomes, then the cytoplasm divides into two cells.",
                image: lab,
                imageAlt:
                  "Diagram of telophase showing two forming nuclei and cytokinesis",
                examples: [
                  "Nuclear envelopes reform at each pole",
                  "Chromosomes decondense back into chromatin",
                  "Cytokinesis splits the cytoplasm — two daughter cells",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Cytokinesis in Plants and Animals",
          data: {
            intro:
              "Mitosis itself is the same in plants and animals, but the final physical split differs — because one of them has a rigid cell wall in the way.",
            left: {
              label: "Animal Cell Cytokinesis",
              color: "primary",
              items: [
                "The cell membrane pinches inward at the middle",
                "This inward pinch is called a cleavage furrow",
                "A ring of protein filaments tightens like a drawstring",
                "The membrane is flexible, so it can be squeezed",
                "The cell is eventually pinched fully into two",
              ],
            },
            right: {
              label: "Plant Cell Cytokinesis",
              color: "secondary",
              items: [
                "The rigid cell wall cannot be pinched inward",
                "Instead a new wall is built from the inside out",
                "Vesicles from the Golgi line up along the centre",
                "They fuse to form a structure called the cell plate",
                "The cell plate grows outward and becomes the new cell wall",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Key Ideas",
          data: {
            concepts: [
              "The four stages of mitosis are remembered with PMAT: Prophase, Metaphase, Anaphase, Telophase.",
              "Mitosis produces two daughter cells that are genetically identical to each other and to the parent cell.",
              "In humans, each daughter cell from mitosis has 46 chromosomes — diploid (2n), the same as the parent.",
              "DNA is copied in S phase BEFORE mitosis begins. Mitosis separates existing copies; it does not make them.",
              "Spindle fibres are microtubules that extend from the poles and attach to chromosomes at the centromere.",
              "Mitosis divides the nucleus; cytokinesis divides the cytoplasm. Both are needed to produce two complete cells.",
              "Mitosis is used for growth, repair, replacement, and asexual reproduction — never for making sex cells.",
            ],
          },
        },

        {
          type: "scenario",
          heading: "Mitosis in Real Life",
          data: {
            intro:
              "Mitosis is happening in your body right now. These scenarios connect the four stages to things you can actually observe.",
            scenarios: [
              {
                title: "Skin Healing After a Cut",
                situation:
                  "You scrape your knee and lose several layers of skin cells. Within hours the area begins to heal, and within days new skin covers the wound — then the healing stops exactly when the gap is filled.",
                question:
                  "What is happening at the cellular level, and what makes the process stop at the right moment?",
                skill:
                  "Cells at the wound edge re-enter the cell cycle, complete interphase, and undergo mitosis to produce new skin cells. They stop when they touch neighbouring cells — contact inhibition — which is why healthy healing does not overshoot.",
              },
              {
                title: "Counting Chromosomes",
                situation:
                  "A student is asked to photograph a cell and count its chromosomes. Looking through the microscope, most cells show only a fuzzy nucleus, but a few show clear separate structures lined up in a row.",
                question:
                  "Which stage should the student photograph, and why is that the easiest one for counting?",
                skill:
                  "Metaphase. The chromosomes are fully condensed and neatly lined up along the metaphase plate in a single plane, so each one can be seen and counted separately rather than overlapping.",
              },
              {
                title: "Cancer Cells Dividing Without Stopping",
                situation:
                  "A mutation in a lung cell disables its G1 checkpoint. The cell begins dividing even when signals tell it to stop. After many divisions a visible tumour has formed.",
                question:
                  "How does disabling a checkpoint lead to a tumour, and why is that dangerous?",
                skill:
                  "Checkpoints normally block division when conditions are wrong or DNA is damaged. With one disabled, the cell divides continuously without verification, producing a mass of cells. If they also lose contact inhibition and the ability to stay in place, the cancer spreads — metastasis.",
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
                title: "Growth and Development",
                description:
                  "From one fertilised egg, mitosis produces the trillions of cells in a human body during development.",
                icon: "🌱",
                color: "border-l-primary-500",
              },
              {
                title: "Replacing Dead Cells",
                description:
                  "Skin cells live only two to three weeks. Mitosis in the lower skin layer constantly produces replacements that push upward — you renew your outer skin every month.",
                icon: "🩹",
                color: "border-l-secondary-500",
              },
              {
                title: "Cancer Therapy",
                description:
                  "Most cancer treatments work by disrupting mitosis in rapidly dividing cells, often by blocking spindle formation.",
                icon: "🔬",
                color: "border-l-accent-500",
              },
              {
                title: "Asexual Reproduction",
                description:
                  "Amoeba, yeast, and hydra reproduce through mitosis or mitosis-like division, producing genetically identical offspring.",
                icon: "🔄",
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
        "Follow meiosis through two rounds of division as one diploid cell becomes four genetically unique haploid gametes — and find out where variation comes from.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Diagram of chromosomes during the stages of meiosis",

      signature: {
        widgetId: "crossover-lab",
        heading: "Watch It: Drag the Crossover",
        intro:
          "Four chromatids, six gene loci. Move the crossover by one gene and two of the four gametes at the end change with it — they are computed from where you dragged. The counter beside them shows the halving happening once, at meiosis I, and not again.",
        instruction: "Place a crossover, then run both divisions",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "The Stages of Meiosis",
        "Where Variation Comes From",
        "Mitosis vs. Meiosis",
        "Key Concepts",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Meiosis",
          url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology/meiosis",
        },
        {
          label: "Britannica — Meiosis",
          url: "https://www.britannica.com/science/meiosis",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Meiosis</strong> is a special kind of cell division that produces sex cells, or <strong class='text-primary-700'>gametes</strong> — sperm in males and eggs in females. Unlike mitosis, which makes two identical cells, meiosis makes four genetically unique ones.",
              "Meiosis starts with one <strong class='text-primary-700'>diploid</strong> cell (2n) carrying two full sets of chromosomes — 46 in humans. It ends with four <strong class='text-primary-700'>haploid</strong> cells (n) carrying only 23 each. This halving is essential: when a sperm and egg fuse at fertilisation, 23 + 23 restores the full 46.",
              "Meiosis involves <strong class='text-primary-700'>two rounds of division</strong> and introduces genetic variation through <strong class='text-primary-700'>crossing over</strong> and <strong class='text-primary-700'>independent assortment</strong>. This is why children resemble their parents without being copies of them.",
            ],
            didYouKnow:
              "A human female is born with every egg cell she will ever have — about one to two million immature eggs are present at birth, though only a few hundred are ever released.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Meiosis",
                desc: "Cell division producing four haploid gametes from one diploid parent cell, through two rounds of division.",
              },
              {
                term: "Gamete",
                desc: "A sex cell — sperm or egg — containing half the normal chromosome number.",
              },
              {
                term: "Haploid (n)",
                desc: "A cell with one set of chromosomes — half the number in a body cell. In humans, n = 23.",
              },
              {
                term: "Diploid (2n)",
                desc: "A cell with two complete sets of chromosomes, the normal number for body cells. In humans, 2n = 46.",
              },
              {
                term: "Homologous Chromosomes",
                desc: "A matching pair of chromosomes, one inherited from each parent, carrying the same genes in the same order.",
              },
              {
                term: "Crossing Over",
                desc: "The exchange of DNA segments between homologous chromosomes during Prophase I — the main source of genetic variation.",
              },
              {
                term: "Independent Assortment",
                desc: "The random orientation of each homologous pair at Metaphase I, which shuffles which chromosomes end up together.",
              },
              {
                term: "Meiosis I",
                desc: "The first division, called the reduction division, which separates homologous pairs and halves the chromosome number.",
              },
              {
                term: "Meiosis II",
                desc: "The second division, very similar to mitosis, which separates sister chromatids in each of the two cells.",
              },
              {
                term: "Nondisjunction",
                desc: "An error where chromosomes fail to separate properly, producing gametes with too many or too few chromosomes.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "The Stages of Meiosis",
          data: {
            intro:
              "DNA is replicated once, before meiosis begins — then there are two divisions with no copying in between. That single fact is what halves the chromosome number.",
            steps: [
              {
                num: 1,
                title: "Prophase I",
                color: "primary",
                description:
                  "Chromosomes condense and pair up with their homologous partners. Crossing over occurs — homologous chromosomes exchange matching segments of DNA at points called chiasmata. This is the single most important source of genetic variation.",
                tip: "Crossing over happens only in Meiosis I — never in Meiosis II, and never in mitosis.",
              },
              {
                num: 2,
                title: "Metaphase I",
                color: "secondary",
                description:
                  "Homologous PAIRS line up along the middle of the cell — not single chromosomes as in mitosis. Which member of each pair faces which pole is completely random, and this is called independent assortment.",
                tip: "Random orientation alone can produce over 8 million different chromosome combinations in a human gamete.",
              },
              {
                num: 3,
                title: "Anaphase I and Telophase I",
                color: "accent",
                description:
                  "Whole homologous chromosomes are pulled to opposite poles — the sister chromatids stay joined. The cell then divides into two cells, each now haploid, though each chromosome still consists of two chromatids.",
                tip: "This is the reduction division. The chromosome number is halved here, not in Meiosis II.",
              },
              {
                num: 4,
                title: "Prophase II",
                color: "primary",
                description:
                  "Both cells from Meiosis I enter the second division. Chromosomes condense again and a new spindle forms. Critically, there is no DNA replication before Meiosis II and no further crossing over.",
                tip: "Meiosis II is essentially mitosis, except it starts with haploid cells instead of diploid ones.",
              },
              {
                num: 5,
                title: "Metaphase II and Anaphase II",
                color: "secondary",
                description:
                  "In each of the two cells, chromosomes line up singly at the metaphase plate. Sister chromatids are then pulled apart to opposite poles, exactly as in mitosis.",
                tip: "By the end of Anaphase II each pole holds individual, unpaired chromosomes.",
              },
              {
                num: 6,
                title: "Telophase II — Four Haploid Cells",
                color: "accent",
                description:
                  "Each cell completes division, producing four haploid daughter cells in total. Every one is genetically unique thanks to the crossing over and independent assortment that happened in Meiosis I.",
                tip: "In males all four become sperm. In females one becomes the egg and three become polar bodies that break down.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Where Variation Comes From",
          data: {
            intro:
              "Meiosis does not just halve chromosome number — it deliberately shuffles the genetic deck. Three mechanisms do the shuffling.",
            reasons: [
              {
                num: 1,
                title: "Crossing Over",
                color: "primary",
                desc: "Homologous chromosomes swap matching segments in Prophase I",
                content:
                  "A chromosome that goes into a gamete is not the one that came from either parent — it is a mixture of both, recombined at points chosen essentially at random.",
              },
              {
                num: 2,
                title: "Independent Assortment",
                color: "secondary",
                desc: "Each homologous pair lines up independently at Metaphase I",
                content:
                  "With 23 pairs orienting randomly, a human can produce over 8 million different chromosome combinations from independent assortment alone — before crossing over is even counted.",
              },
              {
                num: 3,
                title: "Random Fertilisation",
                color: "accent",
                desc: "Any one sperm may fertilise any one egg",
                content:
                  "Multiply 8 million possible sperm by 8 million possible eggs and a single couple could produce over 64 trillion genetically different children.",
              },
              {
                num: 4,
                title: "Why Variation Matters",
                color: "primary",
                desc: "Varied populations survive change; identical ones do not",
                content:
                  "When a new disease or a drought arrives, a genetically varied population is likely to contain some individuals that survive. A population of identical clones either all cope or all die.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Mitosis vs. Meiosis",
          data: {
            intro:
              "These two processes are the most commonly confused pair in cell biology. Compare them line by line.",
            left: {
              label: "Mitosis",
              color: "primary",
              items: [
                "Produces 2 daughter cells",
                "Daughter cells are diploid (2n)",
                "Daughter cells are genetically IDENTICAL",
                "ONE round of division",
                "No crossing over",
                "Purpose: growth, repair, and asexual reproduction",
                "Occurs in body (somatic) cells",
              ],
            },
            right: {
              label: "Meiosis",
              color: "secondary",
              items: [
                "Produces 4 daughter cells",
                "Daughter cells are haploid (n)",
                "Daughter cells are genetically UNIQUE",
                "TWO rounds of division (I and II)",
                "Crossing over occurs in Prophase I",
                "Purpose: producing gametes for sexual reproduction",
                "Occurs only in the ovaries and testes",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Key Concepts",
          data: {
            concepts: [
              "Meiosis produces FOUR daughter cells, compared to mitosis which produces two.",
              "All four cells are haploid (n) — they carry half the chromosomes of the parent cell.",
              "Every daughter cell is genetically unique; no two are the same.",
              "There are TWO rounds of division: Meiosis I halves the chromosome number, Meiosis II separates sister chromatids.",
              "DNA is replicated only once, before Meiosis I. There is no replication between the two divisions — this is what halves the count.",
              "Meiosis occurs only in the gonads: the ovaries in females and the testes in males.",
              "Crossing over in Prophase I and independent assortment in Metaphase I are the two main sources of variation.",
              "If chromosomes fail to separate correctly (nondisjunction), the resulting gamete has the wrong chromosome number.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Understanding Fertility",
                description:
                  "Doctors study meiosis to work out why some people cannot produce healthy gametes, guiding fertility treatments such as IVF.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Chromosomal Conditions",
                description:
                  "When chromosomes fail to separate during anaphase, a gamete ends up with an extra or missing chromosome — the cause of conditions such as Down syndrome.",
                icon: "🧬",
                color: "border-l-secondary-500",
              },
              {
                title: "Selective Breeding",
                description:
                  "Farmers rely on the variation meiosis produces to breed crops and livestock with better traits over successive generations.",
                icon: "🌾",
                color: "border-l-accent-500",
              },
              {
                title: "Evolution",
                description:
                  "The genetic variation meiosis creates is the raw material natural selection acts on. Without it, populations could not adapt.",
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
