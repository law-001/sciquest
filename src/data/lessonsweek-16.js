// Week 16: Cell Reproduction: Meiosis — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week16 = {
  id: "week-16",
  weekNumber: 16,
  title: "Cell Reproduction: Meiosis",
  category: "Life Science",
  description:
    "Understand meiosis — the process that produces sex cells — and how it differs from mitosis.",
  icon: "Shuffle",
  color: "secondary",
  xpReward: 225,
  isLocked: false,
  lessons: [
    {
      id: "lesson-46",
      weekId: "week-16",
      lessonNumber: 46,
      title: "Introduction to Meiosis",
      badge: "Lesson 1",
      subtitle: "What meiosis is and why it matters for reproduction",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt: "Microscopic view of dividing cells undergoing meiosis",
      sections: [
        "What Is Meiosis?",
        "Key Terms",
        "Key Concepts",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "What Is Meiosis?",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Meiosis</strong> is a special type of cell division that produces sex cells, also called <strong class='text-primary-700'>gametes</strong> — sperm in males and eggs in females. Unlike mitosis, which produces two identical daughter cells, meiosis produces four genetically unique daughter cells.",
              "Meiosis starts with one <strong class='text-primary-700'>diploid</strong> cell (2n), meaning it has two full sets of chromosomes. In humans, this means 46 chromosomes. After meiosis, each resulting cell is <strong class='text-primary-700'>haploid</strong> (n), meaning it has only half the chromosomes — 23 in humans. When a sperm and egg combine during fertilization, the full 46-chromosome count is restored.",
              "Meiosis involves two rounds of cell division and introduces genetic variation through a process called <strong class='text-primary-700'>crossing over</strong>, where chromosomes exchange segments of DNA. This is why children look similar to — but not identical to — their parents.",
            ],
            didYouKnow:
              "A human female is born with all the eggs she will ever have — about 1 to 2 million immature egg cells are present at birth, though most are never released!",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Meiosis",
                desc: "A type of cell division that produces four haploid sex cells (gametes) from one diploid parent cell, involving two rounds of division.",
              },
              {
                term: "Gamete",
                desc: "A sex cell (sperm or egg) that contains half the normal number of chromosomes (haploid).",
              },
              {
                term: "Haploid (n)",
                desc: "A cell containing only one set of chromosomes — half the number found in a typical body cell. In humans, n = 23.",
              },
              {
                term: "Diploid (2n)",
                desc: "A cell containing two complete sets of chromosomes — the normal number for body cells. In humans, 2n = 46.",
              },
              {
                term: "Chromosome",
                desc: "A structure inside the cell nucleus made of DNA and protein that carries genetic information. Humans have 46 chromosomes arranged in 23 pairs.",
              },
              {
                term: "Crossing Over",
                desc: "The exchange of DNA segments between homologous chromosomes during Prophase I of meiosis, creating genetic variation in offspring.",
              },
            ],
          },
        },
        {
          type: "conceptList",
          heading: "Key Concepts",
          data: {
            concepts: [
              "Meiosis produces FOUR daughter cells, compared to mitosis which produces only two.",
              "All four daughter cells resulting from meiosis are haploid (n), meaning they have half the chromosomes of the parent cell.",
              "Each daughter cell produced by meiosis is genetically unique — no two cells are identical.",
              "Meiosis involves TWO rounds of cell division: Meiosis I (reduces chromosome number) and Meiosis II (separates sister chromatids).",
              "Meiosis occurs only in the gonads — the ovaries (in females) and testes (in males).",
              "Crossing over during Prophase I and independent assortment during Metaphase I are the two main sources of genetic variation in meiosis.",
            ],
          },
        },
        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Understanding Fertility and Infertility",
                description:
                  "Doctors study meiosis to understand why some individuals cannot produce healthy gametes, helping develop treatments for infertility such as hormone therapy or IVF.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Genetic Diversity in Populations",
                description:
                  "Because meiosis creates genetically unique gametes, sexual reproduction produces diverse offspring — no two siblings (except identical twins) are genetically the same.",
                icon: "🌍",
                color: "border-l-secondary-500",
              },
              {
                title: "Understanding Evolution",
                description:
                  "Genetic variation produced by meiosis is the raw material for natural selection and evolution. Populations with more variation adapt more successfully to changing environments.",
                icon: "🔬",
                color: "border-l-accent-500",
              },
              {
                title: "Genetic Counseling",
                description:
                  "Genetic counselors use knowledge of meiosis to advise families about the risk of passing on inherited diseases and chromosomal abnormalities to future children.",
                icon: "🧬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-47",
      weekId: "week-16",
      lessonNumber: 47,
      title: "Stages of Meiosis",
      badge: "Lesson 2",
      subtitle: "Walking through each phase of Meiosis I and Meiosis II",
      readTime: "~14 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Simulation diagram of chromosomes during the stages of meiosis",
      sections: [
        "Overview of Meiosis Stages",
        "Timeline of Meiosis",
        "Visual Summary",
        "Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "Overview of Meiosis Stages",
          data: {
            paragraphs: [
              "Meiosis is divided into two main rounds of division: <strong class='text-primary-700'>Meiosis I</strong> and <strong class='text-primary-700'>Meiosis II</strong>. Before either round begins, DNA replication occurs during the S phase of interphase, just as it does before mitosis.",
              "<strong class='text-primary-700'>Meiosis I</strong> is the reduction division — it separates homologous chromosome pairs so that each resulting cell has half the original number of chromosomes. This is where <strong class='text-primary-700'>crossing over</strong> occurs during Prophase I, shuffling genetic information between homologous chromosomes and creating new combinations of traits.",
              "<strong class='text-primary-700'>Meiosis II</strong> is very similar to mitosis — it separates sister chromatids from each other. The result is four haploid cells, each genetically unique. In males, all four cells become sperm. In females, one cell becomes the egg and the other three become polar bodies that are discarded.",
            ],
            didYouKnow:
              "During crossing over in Prophase I, chromosomes can exchange hundreds of DNA segments simultaneously — this single event can create millions of possible genetic combinations!",
          },
        },
        {
          type: "timeline",
          heading: "Timeline of Meiosis",
          data: {
            intro:
              "Follow the step-by-step progression of meiosis from the first phase through the final production of four haploid cells.",
            steps: [
              {
                num: 1,
                title: "Prophase I",
                color: "primary",
                description:
                  "Chromosomes condense and pair up with their homologous partners to form bivalents. Crossing over occurs — homologous chromosomes exchange DNA segments at points called chiasmata. This is the most important source of genetic variation in meiosis.",
                tip: "Crossing over only happens in Meiosis I, not in Meiosis II or in mitosis.",
              },
              {
                num: 2,
                title: "Metaphase I",
                color: "secondary",
                description:
                  "Homologous chromosome pairs line up along the middle (metaphase plate) of the cell. The orientation of each pair is random — this is called independent assortment and is another source of genetic variation.",
                tip: "The random orientation of chromosome pairs can produce over 8 million different chromosome combinations in human gametes.",
              },
              {
                num: 3,
                title: "Anaphase I & Telophase I",
                color: "accent",
                description:
                  "Homologous chromosomes are pulled to opposite poles of the cell. The cell then divides into two cells, each with half the original chromosome number (haploid) but with chromosomes still consisting of two sister chromatids.",
                tip: "After Telophase I, two haploid cells exist, but their chromosomes are still doubled (each made of two chromatids).",
              },
              {
                num: 4,
                title: "Prophase II",
                color: "primary",
                description:
                  "The two cells from Meiosis I each enter Meiosis II. Chromosomes condense again. No new crossing over occurs in Prophase II — DNA is not replicated before Meiosis II begins.",
                tip: "Meiosis II is much like mitosis but starts with haploid cells rather than diploid cells.",
              },
              {
                num: 5,
                title: "Metaphase II & Anaphase II",
                color: "secondary",
                description:
                  "In each of the two cells, chromosomes align at the metaphase plate. Sister chromatids are then pulled apart to opposite poles of the cell, just as in mitosis.",
                tip: "At the end of Anaphase II, each pole of each cell contains individual chromosomes — no longer paired.",
              },
              {
                num: 6,
                title: "Telophase II — Final Result",
                color: "accent",
                description:
                  "Each cell completes division, producing a total of four haploid daughter cells. Every cell is genetically unique due to crossing over and independent assortment that occurred in Meiosis I.",
                tip: "The four resulting cells are now ready to become functional gametes — sperm or eggs.",
              },
            ],
          },
        },
        {
          type: "imageCards",
          heading: "Visual Summary",
          data: {
            cards: [
              {
                title: "Meiosis I: Reduction Division",
                label: "Meiosis I",
                variant: "primary",
                color: "primary",
                desc: "Crossing over shuffles DNA; homologous pairs separate, halving the chromosome number.",
                image: simulation,
                imageAlt:
                  "Diagram showing chromosomes crossing over and separating during Meiosis I",
                examples: [
                  "Crossing over in Prophase I",
                  "Homologs separate in Anaphase I",
                  "Two haploid cells formed",
                ],
              },
              {
                title: "Meiosis II: Chromatid Separation",
                label: "Meiosis II",
                variant: "secondary",
                color: "secondary",
                desc: "Similar to mitosis — sister chromatids are pulled apart in each of the two haploid cells.",
                image: microscope,
                imageAlt:
                  "Microscope view of chromatids separating during Meiosis II",
                examples: [
                  "No DNA replication before Meiosis II",
                  "Sister chromatids pulled apart",
                  "Four cells produced total",
                ],
              },
              {
                title: "Final Result: Four Haploid Cells",
                label: "End Product",
                variant: "primary",
                color: "primary",
                desc: "Four genetically unique haploid cells — each destined to become a sperm or egg cell.",
                image: equation,
                imageAlt:
                  "Equation diagram showing one diploid cell becoming four haploid cells",
                examples: [
                  "Each cell has n = 23 chromosomes (in humans)",
                  "All four cells are genetically different",
                  "Ready to participate in fertilization",
                ],
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
                title: "Fertility Treatment",
                description:
                  "Understanding the stages of meiosis helps doctors diagnose problems in egg or sperm development and design treatments such as IVF or ICSI to help people conceive.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Chromosomal Abnormalities",
                description:
                  "If chromosomes fail to separate properly during Anaphase I or II (nondisjunction), gametes may have too many or too few chromosomes — leading to conditions like Down syndrome (trisomy 21).",
                icon: "🧬",
                color: "border-l-secondary-500",
              },
              {
                title: "Genetic Disease Inheritance",
                description:
                  "Knowing which stage of meiosis errors occur helps geneticists predict the probability of inheriting genetic disorders and counsel families about their risks.",
                icon: "🔬",
                color: "border-l-accent-500",
              },
              {
                title: "Reproductive Medicine",
                description:
                  "Researchers use detailed knowledge of meiosis stages to improve techniques for freezing eggs and sperm, extending the window for biological reproduction.",
                icon: "💊",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-48",
      weekId: "week-16",
      lessonNumber: 48,
      title: "Comparing Mitosis and Meiosis",
      badge: "Lesson 3",
      subtitle: "Key differences and similarities between mitosis and meiosis",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt: "Lab diagram comparing mitosis and meiosis side by side",
      sections: [
        "Mitosis vs. Meiosis",
        "Comparison Chart",
        "Why Variation Matters",
        "Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "Mitosis vs. Meiosis",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Mitosis</strong> and <strong class='text-primary-700'>meiosis</strong> are both types of cell division, but they serve very different purposes. Mitosis is used for growth, repair, and asexual reproduction — it produces two genetically identical diploid daughter cells. Meiosis is used for sexual reproduction — it produces four genetically unique haploid daughter cells.",
              "Both processes begin with DNA replication during the S phase of interphase. After DNA is copied, mitosis undergoes one round of division while meiosis undergoes two rounds. In mitosis, there is no crossing over and no reduction in chromosome number. In meiosis, crossing over occurs during Prophase I, and the chromosome number is halved.",
              "Understanding the differences between these two processes is fundamental to understanding how living things grow, heal, and reproduce.",
            ],
            didYouKnow:
              "Your body performs mitosis billions of times every day — your skin alone replaces about 30,000 to 40,000 dead cells every hour through mitosis!",
          },
        },
        {
          type: "comparison",
          heading: "Comparison Chart",
          data: {
            intro:
              "Compare the key features of mitosis and meiosis side by side.",
            left: {
              label: "Mitosis",
              color: "primary",
              items: [
                "Produces 2 daughter cells",
                "Daughter cells are diploid (2n)",
                "Daughter cells are genetically identical",
                "Only ONE round of cell division",
                "Purpose: growth, repair, and asexual reproduction",
              ],
            },
            right: {
              label: "Meiosis",
              color: "secondary",
              items: [
                "Produces 4 daughter cells",
                "Daughter cells are haploid (n)",
                "Daughter cells are genetically unique",
                "TWO rounds of cell division (I and II)",
                "Purpose: sexual reproduction — produces gametes",
              ],
            },
          },
        },
        {
          type: "reasonCards",
          heading: "Why Variation Matters",
          data: {
            intro:
              "Genetic variation produced by meiosis is essential for life on Earth. Here are four key reasons why.",
            reasons: [
              {
                num: 1,
                title: "Adaptation to Changing Environments",
                color: "primary",
                desc: "Varied offspring can survive new conditions",
                content:
                  "When environments change — due to climate, new predators, or disease — genetically varied populations are more likely to have some individuals that can survive and reproduce.",
              },
              {
                num: 2,
                title: "Disease Resistance",
                color: "secondary",
                desc: "No single pathogen can wipe out a diverse population",
                content:
                  "Genetic variation means that a new virus or bacterial infection is unlikely to kill every individual in a population — some will have natural resistance due to different gene combinations.",
              },
              {
                num: 3,
                title: "Driving Evolution",
                color: "accent",
                desc: "Variation is the raw material for natural selection",
                content:
                  "Natural selection acts on genetic differences produced by meiosis. Over time, beneficial traits become more common in a population — this is how species evolve and new species arise.",
              },
              {
                num: 4,
                title: "Uniqueness of Individuals",
                color: "primary",
                desc: "Every person (except identical twins) is genetically unique",
                content:
                  "The crossing over and independent assortment in meiosis produce such enormous variation that it is virtually impossible for the same gamete combination to occur twice — making every individual one-of-a-kind.",
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
                title: "Understanding Heredity",
                description:
                  "Knowing how meiosis produces genetic variation helps explain why children resemble but are not identical to their parents, and how traits are passed from generation to generation.",
                icon: "🧬",
                color: "border-l-primary-500",
              },
              {
                title: "Genetic Counseling",
                description:
                  "Genetic counselors apply knowledge of meiosis and mitosis to advise families about inherited conditions and the probability of passing on genetic disorders.",
                icon: "🏥",
                color: "border-l-secondary-500",
              },
              {
                title: "Selective Breeding",
                description:
                  "Farmers and breeders use their understanding of meiosis and genetic variation to selectively breed animals and plants with desirable traits over many generations.",
                icon: "🌾",
                color: "border-l-accent-500",
              },
              {
                title: "Evolutionary Biology",
                description:
                  "Scientists study meiosis to understand how genetic diversity fuels evolution, how new species arise, and how populations adapt over thousands of generations.",
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
