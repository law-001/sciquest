// Week 17: Asexual Reproduction — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd term Week 17.
//   Lesson 1 — Asexual Reproduction
//   (SECOND QUARTER SUMMATIVE TEST)

import simulation from "../assets/week1/simulation.jpg";

export const week17 = {
  id: "week-17",
  weekNumber: 17,
  title: "Asexual Reproduction",
  category: "Life Science",
  description:
    "Study reproduction that needs only one parent — binary fission, budding, fragmentation, and vegetative propagation. Covered by the Second Quarter Summative Test.",
  icon: "Copy",
  color: "secondary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Asexual Reproduction
    // ═══════════════════════════════════════════════════
    {
      id: "w17-l1",
      weekId: "week-17",
      lessonNumber: 1,
      title: "Asexual Reproduction",
      badge: "Lesson 1",
      subtitle:
        "One parent, no gametes, no fertilization — and offspring that are exact genetic copies. Learn the four main types and where each one appears in nature.",
      readTime: "~18 min read",
      xp: 100,
      heroImage: simulation,
      heroImageAlt:
        "Diagram showing different types of asexual reproduction",

      signature: {
        widgetId: "clone-bench",
        heading: "Watch It: Four Ways to Copy Yourself",
        intro:
          "The bacterium stretches and closes a wall across itself, the bud swells until it drops, the broken starfish arm regrows what it is missing, the runner crawls out and roots. Then one disease sweeps the field — and because every organism is identical, it misses none of them.",
        instruction: "Run all four, then release the disease",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "Four Types of Asexual Reproduction",
        "Advantages and Disadvantages",
        "Key Concepts",
        "Scenarios in Nature",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Asexual Reproduction",
          url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology",
        },
        {
          label: "Britannica — Asexual Reproduction",
          url: "https://www.britannica.com/science/asexual-reproduction",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Asexual reproduction</strong> requires only ONE parent. No gametes are produced, no fertilization takes place, and the offspring are genetically identical to the parent — they are <strong class='text-primary-700'>clones</strong>.",
              "Because no meiosis is involved, there is no crossing over and no independent assortment. The offspring inherit an exact copy of the parent's DNA, produced by <strong class='text-primary-700'>mitosis</strong>. Everything you learned about mitosis last week is the machinery behind this.",
              "Asexual reproduction is fast and efficient — no time is spent finding a mate, and every individual can reproduce. But because all offspring share the same genes, they also share the same weaknesses. A single disease or environmental change can destroy an entire population.",
            ],
            didYouKnow:
              "Some bacteria divide by binary fission every 20 minutes. Starting from a single cell, that is over 2 million bacteria in just 7 hours — assuming nothing slows them down.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Asexual Reproduction",
                desc: "Reproduction involving only one parent, producing offspring genetically identical to it. No gametes or fertilization are involved.",
              },
              {
                term: "Clone",
                desc: "An organism genetically identical to its parent, produced through asexual reproduction.",
              },
              {
                term: "Binary Fission",
                desc: "A parent cell splits into two equal, identical daughter cells. The method used by bacteria and many single-celled organisms.",
              },
              {
                term: "Budding",
                desc: "A new organism grows as a small outgrowth from the parent's body, then detaches or stays attached. Seen in yeast and Hydra.",
              },
              {
                term: "Fragmentation",
                desc: "A piece of the parent breaks off and develops into a complete new organism. Seen in sea stars, flatworms, and many plants.",
              },
              {
                term: "Vegetative Propagation",
                desc: "Plants producing new plants from roots, stems, or leaves rather than seeds — strawberry runners, potato eyes, garlic bulbs.",
              },
              {
                term: "Regeneration",
                desc: "Regrowing a lost body part. In some organisms the detached part can also grow into a whole new individual.",
              },
              {
                term: "Parthenogenesis",
                desc: "An unfertilised egg developing into a complete organism without any sperm. Seen in aphids, some lizards, and certain fish.",
              },
              {
                term: "Stolon (Runner)",
                desc: "A horizontal stem that grows along the ground and roots where it touches soil, producing a new plant.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Four Types of Asexual Reproduction",
          data: {
            cards: [
              {
                title: "Binary Fission",
                label: "Bacteria and Protists",
                variant: "primary",
                color: "primary",
                desc: "The parent cell copies its DNA, grows, then splits straight down the middle into two equal daughter cells.",
                image: simulation,
                imageAlt: "Diagram of a bacterium dividing by binary fission",
                examples: [
                  "Bacteria — can divide every 20 minutes",
                  "Amoeba and paramecium",
                  "Produces two equal-sized identical cells",
                ],
              },
              {
                title: "Budding",
                label: "Yeast and Hydra",
                variant: "secondary",
                color: "secondary",
                desc: "A small bud grows out from the parent's body, develops into a miniature version, then breaks away or stays attached.",
                image: null,
                imageAlt: "Diagram showing a bud growing from a Hydra",
                examples: [
                  "Yeast — a small bud pinches off the parent cell",
                  "Hydra — a complete miniature hydra grows off the side",
                  "Produces one large parent and one small offspring",
                ],
              },
              {
                title: "Fragmentation",
                label: "Sea Stars and Flatworms",
                variant: "primary",
                color: "primary",
                desc: "A piece breaks off the parent and regenerates into a complete new organism, provided it carries the necessary tissue.",
                image: null,
                imageAlt:
                  "Diagram of a sea star regenerating from a detached arm",
                examples: [
                  "Sea star — a detached arm with part of the central disc regrows a whole animal",
                  "Flatworms — a cut piece regenerates the missing parts",
                  "Many algae and fungi spread this way too",
                ],
              },
              {
                title: "Vegetative Propagation",
                label: "Plants",
                variant: "secondary",
                color: "secondary",
                desc: "New plants grow directly from the roots, stems, or leaves of the parent plant — no seeds and no pollination required.",
                image: null,
                imageAlt: "Diagram of a strawberry plant sending out runners",
                examples: [
                  "Strawberry — runners (stolons) root where they touch soil",
                  "Potato — eyes on the tuber sprout into new plants",
                  "Garlic and onion — bulbs divide into new plants",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Advantages and Disadvantages",
          data: {
            intro:
              "Asexual reproduction is not better or worse than sexual reproduction — it is a trade-off. Speed is bought at the cost of variety.",
            left: {
              label: "Advantages",
              color: "primary",
              items: [
                "Very fast — a population can grow explosively",
                "No mate needed, so no time or energy spent finding one",
                "EVERY individual can reproduce, not just half the population",
                "Low energy cost — a simpler process than meiosis and fertilization",
                "Ideal when conditions are stable and favourable",
              ],
            },
            right: {
              label: "Disadvantages",
              color: "secondary",
              items: [
                "NO genetic variation — every offspring is a clone",
                "The whole population shares the same weaknesses",
                "One new disease can wipe out every individual at once",
                "Cannot adapt to a changing environment",
                "Overcrowding happens quickly, exhausting local resources",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Key Concepts",
          data: {
            concepts: [
              "Asexual reproduction needs only one parent and produces genetically identical offspring.",
              "No gametes, no meiosis, and no fertilization are involved — the cell division used is mitosis.",
              "Binary fission splits a cell into two equal halves; budding produces one large parent and one small offspring.",
              "Fragmentation requires the detached piece to contain enough tissue to regenerate the rest.",
              "Vegetative propagation lets a plant reproduce without seeds, flowers, or pollinators.",
              "Parthenogenesis is asexual even though an egg is involved, because the egg is never fertilised.",
              "The complete absence of genetic variation is the single greatest weakness of asexual reproduction.",
              "Some organisms, such as Hydra and sea anemones, switch between asexual and sexual reproduction depending on conditions.",
            ],
          },
        },

        {
          type: "scenario",
          heading: "Scenarios in Nature",
          data: {
            intro:
              "Each of these situations is asexual reproduction at work. Identify the type before reading the answer.",
            scenarios: [
              {
                title: "Bacteria Causing Infection",
                situation:
                  "A person swallows a small number of harmful bacteria in undercooked food. Within hours they feel seriously ill as their immune system struggles against enormous numbers of bacteria.",
                question:
                  "How did a handful of bacteria become a serious infection so quickly?",
                skill:
                  "Binary fission. The bacteria divided roughly every 20 minutes, each splitting into two identical cells, producing millions within a few hours. Every one is a clone of the original.",
              },
              {
                title: "Strawberry Plant Spreading",
                situation:
                  "A gardener plants one strawberry plant in spring. By summer there are new strawberry plants several feet away, all connected to the original by long horizontal stems.",
                question:
                  "How did new plants appear without anyone planting seeds?",
                skill:
                  "Vegetative propagation using runners (stolons). The parent sent out horizontal stems that rooted where they touched soil, growing into new plants genetically identical to the parent.",
              },
              {
                title: "Sea Star Regenerating",
                situation:
                  "A sea star loses an arm to a predator. Months later the sea star has regrown the arm — and the detached arm has grown into a complete new sea star.",
                question:
                  "How can a single arm become a whole new organism, and what condition must it meet?",
                skill:
                  "Fragmentation. The detached arm regenerated a full organism through mitosis — but only because it carried part of the central disc. An arm without it cannot regenerate.",
              },
              {
                title: "The Aphid Population Explosion",
                situation:
                  "A gardener notices a few aphids on her roses in May. By June the garden is covered in thousands, though she never saw any aphids mating.",
                question:
                  "How did so many aphids appear without mating taking place?",
                skill:
                  "Parthenogenesis. In spring and summer female aphids produce female clones from unfertilised eggs, and each of those offspring can immediately reproduce too, causing explosive growth.",
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
                title: "Agriculture and Cloning Crops",
                description:
                  "Farmers propagate bananas, potatoes, and sugar cane from cuttings, guaranteeing every plant carries identical, predictable traits.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Crop Disease Vulnerability",
                description:
                  "Because commercial bananas are all clones, a single fungal disease can threaten the entire global crop — the clearest real-world cost of no genetic variation.",
                icon: "🍌",
                color: "border-l-secondary-500",
              },
              {
                title: "Antibiotic Resistance",
                description:
                  "Bacteria reproduce asexually at enormous speed. When antibiotics kill most of a population, any naturally resistant survivor clones itself into a resistant infection.",
                icon: "🦠",
                color: "border-l-accent-500",
              },
              {
                title: "Food Safety",
                description:
                  "Understanding binary fission explains exactly why refrigeration, thorough cooking, and careful food handling prevent foodborne illness.",
                icon: "🍽️",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
