// Week 17: Fertilization and Reproduction — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import globe from "../assets/globe.jpg";
import web from "../assets/web.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";
import classroom from "../assets/classroom.webp";
import modernclassroom from "../assets/modernclassroom.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week17 = {
  id: "week-17",
  weekNumber: 17,
  title: "Fertilization and Reproduction",
  category: "Life Science",
  description:
    "Learn about fertilization and explore the two main types of reproduction — sexual and asexual.",
  icon: "Heart",
  color: "accent",
  xpReward: 225,
  isLocked: false,
  lessons: [
    {
      id: "lesson-49",
      weekId: "week-17",
      lessonNumber: 49,
      title: "Fertilization",
      badge: "Lesson 1",
      subtitle: "How sperm and egg unite to form a new organism",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt:
        "Microscopic image of a sperm cell approaching an egg cell during fertilization",
      sections: [
        "What Is Fertilization?",
        "Key Terms",
        "Steps of Fertilization",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "What Is Fertilization?",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Fertilization</strong> is the process by which a sperm cell and an egg cell fuse together to form a new cell called a <strong class='text-primary-700'>zygote</strong>. This is the moment a new organism begins its life. The zygote is <strong class='text-primary-700'>diploid</strong> (2n) — it contains the full number of chromosomes, with half coming from the sperm and half from the egg.",
              "Fertilization can happen in two main ways. <strong class='text-primary-700'>Internal fertilization</strong> occurs inside the body of the female — this is how mammals, birds, and reptiles reproduce. <strong class='text-primary-700'>External fertilization</strong> occurs outside the body, usually in water — frogs, fish, and many aquatic animals reproduce this way. External fertilization requires water to keep the gametes moist and allow sperm to swim to the egg.",
              "Once the zygote is formed, it immediately begins to undergo <strong class='text-primary-700'>mitosis</strong> — rapid cell division — to develop into an embryo. The embryo continues to divide and differentiate, eventually forming all the tissues and organs of the new organism.",
            ],
            didYouKnow:
              "A single human male can produce around 1,500 sperm cells every second — that's over 500 billion sperm in a lifetime — yet only one is needed to fertilize an egg!",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Fertilization",
                desc: "The fusion of a sperm cell and an egg cell to form a zygote, which develops into a new organism.",
              },
              {
                term: "Zygote",
                desc: "The diploid cell formed when a sperm and egg fuse during fertilization. It is the first cell of a new organism.",
              },
              {
                term: "Sperm",
                desc: "The male gamete (sex cell), which is small, has a tail for swimming, and carries the male's genetic contribution.",
              },
              {
                term: "Egg (Ovum)",
                desc: "The female gamete (sex cell), which is larger than sperm and contains nutrients to support early embryo development.",
              },
              {
                term: "Internal Fertilization",
                desc: "Fertilization that occurs inside the body of the female. Common in mammals, birds, and reptiles.",
              },
              {
                term: "External Fertilization",
                desc: "Fertilization that occurs outside the body, typically in water. Common in frogs, fish, and many aquatic animals.",
              },
              {
                term: "Embryo",
                desc: "The early stage of development after the zygote begins dividing by mitosis. The embryo eventually develops into a fully formed organism.",
              },
            ],
          },
        },
        {
          type: "timeline",
          heading: "Steps of Fertilization",
          data: {
            intro:
              "From the moment a sperm cell meets an egg cell, a precisely ordered sequence of events leads to the formation of a new organism.",
            steps: [
              {
                num: 1,
                title: "Sperm Meets Egg",
                color: "primary",
                description:
                  "Millions of sperm cells travel toward the egg. In internal fertilization, sperm travel through the female reproductive tract. In external fertilization, sperm swim through water to reach the egg.",
                tip: "Sperm must compete — only one will successfully penetrate and fertilize the egg.",
              },
              {
                num: 2,
                title: "Fertilization Occurs",
                color: "secondary",
                description:
                  "One sperm successfully penetrates the outer layer of the egg cell. The sperm's genetic material (23 chromosomes in humans) fuses with the egg's genetic material (23 chromosomes).",
                tip: "Once a sperm enters, a chemical change in the egg's membrane prevents any other sperm from entering — called the fertilization membrane.",
              },
              {
                num: 3,
                title: "Zygote Is Formed",
                color: "accent",
                description:
                  "The fused cell is now called a zygote — a single diploid cell with 46 chromosomes (in humans). The zygote contains a complete genetic blueprint for the new organism.",
                tip: "The zygote is the first cell of the new organism and contains DNA from both parents.",
              },
              {
                num: 4,
                title: "Mitosis Begins",
                color: "primary",
                description:
                  "The zygote immediately begins to divide by mitosis — first into 2 cells, then 4, then 8, and so on. These early divisions happen rapidly and the cells are called blastomeres.",
                tip: "At this stage, each cell still has the same genetic information as the original zygote.",
              },
              {
                num: 5,
                title: "Embryo Develops",
                color: "secondary",
                description:
                  "As cells continue to divide, they begin to differentiate — specializing into different cell types (muscle, nerve, skin, etc.). The developing organism is now called an embryo and will continue developing into a fully formed organism.",
                tip: "In humans, by week 8 the embryo is called a fetus and has recognizable body structures.",
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
                title: "In Vitro Fertilization (IVF)",
                description:
                  "IVF is a medical procedure where eggs are fertilized by sperm outside the body in a laboratory. The resulting embryos are then implanted into the uterus — helping people who cannot conceive naturally.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Conservation of Endangered Species",
                description:
                  "Scientists use artificial fertilization techniques to help endangered animals reproduce in captivity, preserving species that might otherwise go extinct.",
                icon: "🌿",
                color: "border-l-secondary-500",
              },
              {
                title: "Understanding Miscarriage",
                description:
                  "Knowledge of fertilization and early embryo development helps doctors understand why some pregnancies fail at the earliest stages — often due to chromosomal errors in the zygote.",
                icon: "🔬",
                color: "border-l-accent-500",
              },
              {
                title: "Animal Husbandry",
                description:
                  "Farmers use artificial insemination — introducing sperm into a female without natural mating — to breed livestock with desirable genetic traits more efficiently.",
                icon: "🐄",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-50",
      weekId: "week-17",
      lessonNumber: 50,
      title: "Sexual Reproduction",
      badge: "Lesson 2",
      subtitle:
        "How two parents combine to produce genetically unique offspring",
      readTime: "~12 min read",
      xp: 50,
      heroImage: globe,
      heroImageAlt:
        "Globe showing diverse living organisms that use sexual reproduction",
      sections: [
        "What Is Sexual Reproduction?",
        "Examples Across the Animal Kingdom",
        "Key Characteristics",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "What Is Sexual Reproduction?",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Sexual reproduction</strong> is a type of reproduction that requires two parents — a male and a female. Each parent produces gametes (sex cells) through meiosis: the male produces sperm and the female produces eggs. During fertilization, one sperm and one egg combine to form a zygote.",
              "Because each parent contributes half of the offspring's genetic information, the offspring is genetically different from both parents. This <strong class='text-primary-700'>genetic variation</strong> is the greatest advantage of sexual reproduction — it means that no two offspring (other than identical twins) are exactly alike. This variation makes populations more adaptable to changing environments.",
              "Sexual reproduction is more complex and energy-intensive than asexual reproduction. Organisms must find a mate, and the process of meiosis and fertilization takes time. Despite these costs, the genetic diversity it produces gives populations long-term survival advantages.",
            ],
            didYouKnow:
              "Flowering plants reproduce sexually too — when a bee carries pollen from one flower to another, it is acting as a matchmaker, enabling fertilization between two plants!",
          },
        },
        {
          type: "imageCards",
          heading: "Examples Across the Animal Kingdom",
          data: {
            cards: [
              {
                title: "Mammals: Internal Fertilization",
                label: "Mammals",
                variant: "primary",
                color: "primary",
                desc: "Fertilization occurs inside the female's body; offspring develop internally (most mammals) or in a pouch (marsupials).",
                image: microscope,
                imageAlt:
                  "Microscopic image representing mammalian reproduction",
                examples: [
                  "Humans, dogs, whales",
                  "Fertilization is internal",
                  "Embryo develops inside the mother",
                ],
              },
              {
                title: "Aquatic Animals: External Fertilization",
                label: "Fish and Frogs",
                variant: "secondary",
                color: "secondary",
                desc: "Eggs and sperm are released into water, where fertilization takes place outside the body.",
                image: globe,
                imageAlt:
                  "Globe image representing aquatic animal reproduction in water environments",
                examples: [
                  "Frogs, salmon, sea urchins",
                  "Thousands of eggs released at once",
                  "Water provides the medium for sperm to reach eggs",
                ],
              },
              {
                title: "Plants: Pollination and Fertilization",
                label: "Flowering Plants",
                variant: "primary",
                color: "primary",
                desc: "Pollen (containing sperm) is carried by wind or animals to the egg cells inside a flower's ovary.",
                image: web,
                imageAlt:
                  "Web-like diagram showing how pollination connects plants for sexual reproduction",
                examples: [
                  "Pollen acts as male gamete",
                  "Insects and wind transfer pollen",
                  "Fertilization produces seeds",
                ],
              },
            ],
          },
        },
        {
          type: "conceptList",
          heading: "Key Characteristics",
          data: {
            concepts: [
              "Sexual reproduction requires TWO parents — one male and one female — each contributing genetic material.",
              "Gametes (sperm and eggs) are produced by meiosis and contain half the organism's chromosomes (haploid).",
              "Fertilization combines the two gametes into a diploid zygote that develops into a new organism.",
              "Offspring produced through sexual reproduction are genetically unique — different from both parents.",
              "Sexual reproduction produces greater genetic variation than asexual reproduction, which improves a population's ability to adapt.",
            ],
          },
        },
        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Selective Breeding in Agriculture",
                description:
                  "Farmers use sexual reproduction to breed plants and animals with desired traits — such as disease-resistant crops or faster-growing livestock — by carefully choosing which individuals mate.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Understanding Genetic Diseases",
                description:
                  "Because sexual reproduction mixes genetic material, some genetic diseases can appear unexpectedly in offspring. Doctors study inheritance patterns to help families understand and manage genetic risks.",
                icon: "🧬",
                color: "border-l-secondary-500",
              },
              {
                title: "Conservation Genetics",
                description:
                  "Wildlife conservationists promote genetic diversity in small, endangered populations by facilitating mating between individuals from different groups — preventing inbreeding and improving survival.",
                icon: "🌿",
                color: "border-l-accent-500",
              },
              {
                title: "Human Reproductive Health",
                description:
                  "Understanding sexual reproduction guides medical care during pregnancy, childbirth, and fertility treatment, ensuring healthy outcomes for parents and their children.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-51",
      weekId: "week-17",
      lessonNumber: 51,
      title: "Asexual Reproduction",
      badge: "Lesson 3",
      subtitle: "How organisms reproduce using only one parent",
      readTime: "~13 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Simulation diagram showing different types of asexual reproduction",
      sections: [
        "What Is Asexual Reproduction?",
        "Key Terms",
        "Sexual vs. Asexual: A Comparison",
        "Scenarios in Nature",
      ],
      layout: [
        {
          type: "intro",
          heading: "What Is Asexual Reproduction?",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Asexual reproduction</strong> is a type of reproduction that requires only ONE parent. No gametes are involved, and there is no fertilization. The offspring produced are genetically identical to the parent — they are sometimes called <strong class='text-primary-700'>clones</strong>.",
              "There are many types of asexual reproduction. <strong class='text-primary-700'>Binary fission</strong> is how bacteria divide — the parent cell simply splits into two identical cells. <strong class='text-primary-700'>Budding</strong> occurs when a small offspring grows directly from the parent's body (seen in yeast and Hydra). <strong class='text-primary-700'>Fragmentation</strong> happens when a body part breaks off and grows into a complete new organism (sea stars). <strong class='text-primary-700'>Vegetative propagation</strong> is how many plants reproduce from roots, stems, or leaves (strawberry runners, garlic bulbs, potato eyes).",
              "Asexual reproduction is fast and efficient — no time is spent searching for a mate. However, because all offspring are genetic copies, they are all equally vulnerable to the same diseases and environmental changes. This is the main disadvantage of asexual reproduction.",
            ],
            didYouKnow:
              "Some bacteria can divide by binary fission every 20 minutes — meaning that in just 7 hours, one bacterium could theoretically become over 2 million bacteria!",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Asexual Reproduction",
                desc: "A type of reproduction involving only one parent. Offspring are genetically identical to the parent (clones). No gametes or fertilization are involved.",
              },
              {
                term: "Binary Fission",
                desc: "A form of asexual reproduction in which a parent cell splits into two identical daughter cells. Common in bacteria and single-celled organisms.",
              },
              {
                term: "Budding",
                desc: "A form of asexual reproduction in which a new organism grows as a small outgrowth (bud) from the parent's body. Seen in yeast and Hydra.",
              },
              {
                term: "Fragmentation",
                desc: "A form of asexual reproduction in which a piece of the parent organism breaks off and develops into a complete new organism. Seen in sea stars and flatworms.",
              },
              {
                term: "Vegetative Propagation",
                desc: "A form of asexual reproduction in plants where new plants grow from roots, stems, or leaves — such as strawberry runners, potato eyes, or garlic bulbs.",
              },
              {
                term: "Clone",
                desc: "An organism that is genetically identical to its parent, produced through asexual reproduction.",
              },
            ],
          },
        },
        {
          type: "comparison",
          heading: "Sexual vs. Asexual: A Comparison",
          data: {
            intro:
              "These two fundamental reproductive strategies have very different characteristics, advantages, and trade-offs.",
            left: {
              label: "Sexual Reproduction",
              color: "primary",
              items: [
                "Requires TWO parents (male and female)",
                "Gametes (sperm and egg) are needed",
                "Offspring are genetically UNIQUE",
                "Slower — requires finding a mate",
                "Produces great genetic variation",
              ],
            },
            right: {
              label: "Asexual Reproduction",
              color: "secondary",
              items: [
                "Requires only ONE parent",
                "No gametes or fertilization needed",
                "Offspring are genetically IDENTICAL (clones)",
                "Faster — no need to find a mate",
                "Produces NO genetic variation",
              ],
            },
          },
        },
        {
          type: "scenario",
          heading: "Scenarios in Nature",
          data: {
            intro:
              "Asexual reproduction plays out in many real-world situations. Let's explore some examples.",
            scenarios: [
              {
                title: "Bacteria Causing Infection",
                situation:
                  "A person swallows a small number of harmful bacteria in undercooked food. Within hours, they feel very ill as their immune system struggles to fight off the bacteria.",
                question:
                  "How did a small number of bacteria become a serious infection so quickly?",
                skill:
                  "Binary fission — the bacteria divided every 20 minutes, each splitting into two identical cells, producing millions of bacteria in just a few hours.",
              },
              {
                title: "Strawberry Plant Spreading",
                situation:
                  "A gardener plants one strawberry plant in spring. By summer, she notices new strawberry plants growing several feet away from the original, all connected by long horizontal stems.",
                question:
                  "How did strawberry plants appear without planting seeds?",
                skill:
                  "Vegetative propagation via runners (stolons) — the original plant sent out horizontal stems that touched the soil and grew into new, genetically identical plants.",
              },
              {
                title: "Starfish Regenerating",
                situation:
                  "A sea star (starfish) loses an arm to a predator. A few months later, the sea star has grown a new arm — and the detached arm has grown into a completely new sea star.",
                question:
                  "How can a single arm grow into a whole new organism?",
                skill:
                  "Fragmentation — the detached arm contained enough cells to regenerate a completely new organism through mitosis, as long as part of the central disc was present.",
              },
            ],
          },
        },
      ],
    },
  ],
};
