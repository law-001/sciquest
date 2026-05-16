// Week 18: Types of Reproduction Compared — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import globe from "../assets/globe.jpg";
import web from "../assets/web.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";
import classroom from "../assets/classroom.webp";
import modernclassroom from "../assets/modernclassroom.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week18 = {
  id: "week-18",
  weekNumber: 18,
  title: "Types of Reproduction Compared",
  category: "Life Science",
  description:
    "Compare sexual and asexual reproduction and explore real-world examples from plants and animals.",
  icon: "GitCompare",
  color: "primary",
  xpReward: 225,
  isLocked: false,
  lessons: [
    {
      id: "lesson-52",
      weekId: "week-18",
      lessonNumber: 52,
      title: "Sexual vs. Asexual Reproduction",
      badge: "Lesson 1",
      subtitle:
        "Comparing the two fundamental strategies for producing offspring",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "Lab comparison diagram of sexual and asexual reproduction strategies",
      sections: [
        "Two Ways to Reproduce",
        "Comparison Chart",
        "When and Why Each Strategy Is Used",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "Two Ways to Reproduce",
          data: {
            paragraphs: [
              "All living things reproduce — it is one of the fundamental characteristics of life. There are two main strategies: <strong class='text-primary-700'>sexual reproduction</strong> and <strong class='text-primary-700'>asexual reproduction</strong>. Nature uses both, and many organisms can even switch between them depending on conditions.",
              "<strong class='text-primary-700'>Sexual reproduction</strong> produces genetically varied offspring and provides long-term survival advantages, but it requires a partner and is energy-intensive. <strong class='text-primary-700'>Asexual reproduction</strong> produces offspring quickly with only one parent, but all offspring are genetically identical — making the entire population vulnerable to the same threats.",
              "Neither strategy is universally better. An organism's reproductive strategy is shaped by its environment, lifestyle, and evolutionary history. Understanding both strategies helps us understand how life persists and adapts on Earth.",
            ],
            didYouKnow:
              "Some organisms like the sea anemone can reproduce both sexually and asexually — switching strategies based on environmental conditions. When food is plentiful, they reproduce asexually for speed; when conditions are tough, they switch to sexual reproduction for variety.",
          },
        },
        {
          type: "comparison",
          heading: "Comparison Chart",
          data: {
            intro:
              "A side-by-side look at the key differences between sexual and asexual reproduction.",
            left: {
              label: "Sexual Reproduction",
              color: "primary",
              items: [
                "Requires TWO parents",
                "High genetic variation in offspring",
                "Slower; must find a mate",
                "High energy cost — complex process",
                "Example: humans, frogs, flowering plants",
              ],
            },
            right: {
              label: "Asexual Reproduction",
              color: "secondary",
              items: [
                "Requires only ONE parent",
                "NO genetic variation — offspring are clones",
                "Faster; no mate needed",
                "Low energy cost — simpler process",
                "Example: bacteria, yeast, sea stars, strawberry plants",
              ],
            },
          },
        },
        {
          type: "reasonCards",
          heading: "When and Why Each Strategy Is Used",
          data: {
            intro:
              "Organisms may switch between or favor one reproductive strategy depending on circumstances. Here are four key reasons.",
            reasons: [
              {
                num: 1,
                title: "Unfavorable Environmental Conditions",
                color: "primary",
                desc: "Sexual reproduction when survival is threatened",
                content:
                  "When resources are scarce, temperatures are extreme, or predators are common, sexual reproduction produces varied offspring — increasing the chance that some will survive and adapt to the harsh conditions.",
              },
              {
                num: 2,
                title: "Favorable Conditions for Rapid Growth",
                color: "secondary",
                desc: "Asexual reproduction when conditions are ideal",
                content:
                  "When food and space are abundant and there are few threats, asexual reproduction is ideal. Organisms can rapidly colonize an area — bacteria doubling every 20 minutes is a perfect example of exploiting good conditions.",
              },
              {
                num: 3,
                title: "Seasonal Changes",
                color: "accent",
                desc: "Switching strategies with the seasons",
                content:
                  "Some organisms (like aphids) reproduce asexually all summer when conditions are favorable, then switch to sexual reproduction in autumn. Sexual reproduction produces eggs that can survive harsh winters and hatch in spring.",
              },
              {
                num: 4,
                title: "Population Survival",
                color: "primary",
                desc: "Diversity protects against extinction",
                content:
                  "A population that reproduces only asexually risks total extinction if a new disease or environmental change appears — all individuals are equally vulnerable. Sexual reproduction ensures that some individuals may have natural resistance.",
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
                title: "Agriculture — Vegetative Propagation",
                description:
                  "Farmers use asexual reproduction (cuttings, grafting, tissue culture) to produce crops with consistent traits — every banana plant in a commercial plantation is genetically identical, guaranteeing uniform fruit.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Pest Management",
                description:
                  "Understanding how pests reproduce asexually (rapidly) helps scientists develop targeted strategies to disrupt their reproduction cycle, protecting crops and controlling disease vectors like mosquitoes.",
                icon: "🐛",
                color: "border-l-secondary-500",
              },
              {
                title: "Conservation",
                description:
                  "Conservationists balance both strategies — using sexual reproduction to maintain genetic diversity in endangered populations while using cloning (asexual) to rapidly increase numbers of critically endangered species.",
                icon: "🌿",
                color: "border-l-accent-500",
              },
              {
                title: "Biotechnology and Cloning",
                description:
                  "Scientists use asexual reproduction principles to clone cells and organisms for research, medicine (growing identical cell lines for drug testing), and potentially preserving extinct species.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-53",
      weekId: "week-18",
      lessonNumber: 53,
      title: "Advantages and Disadvantages of Each",
      badge: "Lesson 2",
      subtitle: "Weighing the trade-offs of sexual and asexual reproduction",
      readTime: "~12 min read",
      xp: 50,
      heroImage: equation,
      heroImageAlt:
        "Equation-style diagram showing the pros and cons of different reproduction types",
      sections: [
        "Trade-offs in Reproduction",
        "Key Terms",
        "Key Trade-offs",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "Trade-offs in Reproduction",
          data: {
            paragraphs: [
              "Every reproductive strategy comes with trade-offs — advantages that make it useful in some situations and disadvantages that limit it in others. <strong class='text-primary-700'>Sexual reproduction</strong> produces genetically diverse offspring, which is a powerful long-term advantage. But it requires two parents, takes time, and only females can directly produce offspring.",
              "<strong class='text-primary-700'>Asexual reproduction</strong> is fast and efficient — a single organism can rapidly produce many identical copies of itself. This is ideal when conditions are favorable. However, because all offspring are genetic clones, they share the same weaknesses. A single disease or environmental shift can wipe out an entire asexually-reproducing population.",
              "In nature, organisms have evolved the reproductive strategy best suited to their environment. Understanding these trade-offs helps scientists in agriculture, medicine, and conservation make better decisions about managing living things.",
            ],
            didYouKnow:
              "Commercial banana plants are all genetically identical clones — which is why a fungal disease called Panama disease nearly wiped out the entire global banana crop in the 1950s, and a similar threat faces today's Cavendish banana variety!",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Genetic Variation",
                desc: "Differences in the genetic makeup of individuals in a population. Sexual reproduction creates genetic variation; asexual reproduction does not.",
              },
              {
                term: "Adaptation",
                desc: "A trait that helps an organism survive and reproduce in its environment. Genetic variation is necessary for populations to develop new adaptations over time.",
              },
              {
                term: "Selective Advantage",
                desc: "A trait or strategy that increases an organism's chance of surviving and reproducing compared to others in the same population.",
              },
              {
                term: "Reproductive Fitness",
                desc: "The ability of an organism to survive and successfully reproduce, passing its genes on to the next generation.",
              },
              {
                term: "Population",
                desc: "All the individuals of the same species living in the same area at the same time.",
              },
              {
                term: "Natural Selection",
                desc: "The process by which organisms with traits better suited to their environment survive and reproduce more successfully, passing those traits on.",
              },
            ],
          },
        },
        {
          type: "conceptList",
          heading: "Key Trade-offs",
          data: {
            concepts: [
              "Sexual reproduction creates genetic variation, which helps populations adapt to changing environments and resist new diseases.",
              "Sexual reproduction requires two parents, which costs time and energy — especially in finding and attracting a mate.",
              "In sexually reproducing species, only females can bear offspring — limiting the maximum rate of population growth compared to asexual reproduction.",
              "Asexual reproduction allows any individual to rapidly produce many offspring, making it efficient when conditions are stable and favorable.",
              "Asexual offspring are genetically identical clones — if one individual is susceptible to a disease or environmental change, all offspring are equally susceptible.",
              "Some organisms combine both strategies — reproducing asexually during favorable conditions for speed, then sexually when conditions change to create variation.",
            ],
          },
        },
        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Agricultural Use of Vegetative Propagation",
                description:
                  "Farmers clone crops (potatoes, bananas, sugar cane) using asexual reproduction to guarantee uniform, predictable yields — though this creates vulnerability to disease outbreaks across entire crops.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Crop Disease Vulnerability",
                description:
                  "The Irish Potato Famine (1845–1852) was worsened because farmers planted genetically identical potato varieties — one blight destroyed nearly the entire crop, causing mass starvation.",
                icon: "🥔",
                color: "border-l-secondary-500",
              },
              {
                title: "Antibiotic Resistance in Bacteria",
                description:
                  "Bacteria reproduce asexually at enormous speed. When antibiotics kill most bacteria, any that are naturally resistant quickly clone themselves — leading to antibiotic-resistant infections that are difficult to treat.",
                icon: "🦠",
                color: "border-l-accent-500",
              },
              {
                title: "Evolutionary Biology",
                description:
                  "Scientists study the trade-offs between reproductive strategies to understand how species evolve over time and why sexual reproduction, despite its costs, has become the dominant strategy among complex organisms.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-54",
      weekId: "week-18",
      lessonNumber: 54,
      title: "Examples in Nature",
      badge: "Lesson 3",
      subtitle:
        "Real organisms that illustrate sexual and asexual reproduction",
      readTime: "~13 min read",
      xp: 50,
      heroImage: web,
      heroImageAlt:
        "Web diagram connecting diverse organisms that use different types of reproduction",
      sections: [
        "Reproduction All Around Us",
        "Visual Examples",
        "Scenarios in Nature",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "Reproduction All Around Us",
          data: {
            paragraphs: [
              "Both sexual and asexual reproduction are happening all around us — in the bacteria on your skin, the plants in your garden, and the animals in the ocean. Some organisms are masters of one strategy while others have evolved the ability to use both.",
              "Common examples of <strong class='text-primary-700'>asexual reproduction</strong> include bacteria (binary fission — splitting in two every 20 minutes), yeast (budding — a small bud grows from the parent cell), starfish (fragmentation — a detached arm can grow into a new organism), strawberry plants (vegetative propagation via runners called stolons), garlic (bulb division), and aphids (parthenogenesis — unfertilized eggs develop into offspring).",
              "Common examples of <strong class='text-primary-700'>sexual reproduction</strong> include humans, frogs (external fertilization in ponds), birds (internal fertilization), flowering plants (pollination followed by fertilization), and most fish. Some remarkable organisms — like sea anemones and Hydra — can do <em>both</em>, switching strategies based on environmental conditions.",
            ],
            didYouKnow:
              "Aphids are incredible reproducers — a single female aphid can produce up to 80 offspring per week through asexual parthenogenesis. In summer, all aphids in a colony are female and reproduce without any males!",
          },
        },
        {
          type: "imageCards",
          heading: "Visual Examples",
          data: {
            cards: [
              {
                title: "Asexual Reproduction in Animals",
                label: "Animals",
                variant: "primary",
                color: "primary",
                desc: "Some animals reproduce without a partner through budding or fragmentation.",
                image: simulation,
                imageAlt:
                  "Simulation diagram of starfish fragmentation and yeast budding",
                examples: [
                  "Starfish: fragmentation — arm regrows into new organism",
                  "Yeast: budding — small bud grows off parent cell",
                  "Hydra: budding — can also reproduce sexually",
                ],
              },
              {
                title: "Asexual Reproduction in Plants",
                label: "Plants",
                variant: "secondary",
                color: "secondary",
                desc: "Many plants reproduce asexually through specialized structures — no seeds required.",
                image: globe,
                imageAlt:
                  "Globe image showing plant reproduction through runners and bulbs",
                examples: [
                  "Strawberry: stolons (runners) touch soil and root",
                  "Garlic: bulbs divide to produce new plants",
                  "Potato: eyes (buds) on tubers grow into new plants",
                ],
              },
              {
                title: "Sexual Reproduction in Nature",
                label: "Sexual",
                variant: "primary",
                color: "primary",
                desc: "From frogs spawning in ponds to bees pollinating flowers, sexual reproduction is everywhere.",
                image: web,
                imageAlt:
                  "Web diagram showing frog egg masses in water and flower pollination",
                examples: [
                  "Frogs: lay thousands of eggs in ponds — external fertilization",
                  "Flowering plants: pollen transferred by wind or insects",
                  "Humans: internal fertilization, embryo develops internally",
                ],
              },
            ],
          },
        },
        {
          type: "scenario",
          heading: "Scenarios in Nature",
          data: {
            intro:
              "These real-world scenarios show how reproductive strategies play out in everyday life.",
            scenarios: [
              {
                title: "Bacteria in Food",
                situation:
                  "A student leaves a piece of chicken out of the refrigerator overnight. By morning, the chicken smells bad and has millions of bacteria on it, even though the package was only opened the night before.",
                question:
                  "How did so many bacteria grow overnight from just a few?",
                skill:
                  "Binary fission — bacteria divide every 20 minutes. Starting from just a few cells, 8 hours of division can produce millions of bacteria. All offspring are genetically identical clones of the original bacterium.",
              },
              {
                title: "Aphid Population Explosion",
                situation:
                  "A gardener notices a few aphids on her rose bushes in May. By June, the entire garden is covered in thousands of aphids, even though she never saw any mating.",
                question: "How did so many aphids appear without mating?",
                skill:
                  "Parthenogenesis — in spring and summer, female aphids reproduce asexually. Unfertilized eggs develop into female clones, which immediately start reproducing again, causing rapid population explosions.",
              },
              {
                title: "Strawberry Farm Expansion",
                situation:
                  "A farmer wants to plant a large strawberry crop but does not want to buy thousands of seeds. Instead, she lets her existing strawberry plants spread naturally for one season.",
                question:
                  "How can the farmer get new plants without using seeds?",
                skill:
                  "Vegetative propagation — strawberry plants send out runners (stolons) along the ground. When a runner tip touches soil, it roots and grows into a new plant genetically identical to the parent.",
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
                title: "Food Safety",
                description:
                  "Understanding how bacteria reproduce asexually at alarming speed explains why refrigeration, cooking, and proper food handling are essential to prevent foodborne illness.",
                icon: "🍽️",
                color: "border-l-primary-500",
              },
              {
                title: "Pest Control in Gardens and Farms",
                description:
                  "Knowing that aphids can reproduce asexually in massive numbers helps farmers and gardeners act quickly — introducing natural predators (ladybugs) or using targeted treatments before populations explode.",
                icon: "🐞",
                color: "border-l-secondary-500",
              },
              {
                title: "Agricultural Efficiency",
                description:
                  "Farmers use vegetative propagation to clone their best plants — propagating cuttings, runners, or bulbs guarantees identical yield and quality without waiting for seed germination.",
                icon: "🌾",
                color: "border-l-accent-500",
              },
              {
                title: "Conservation Cloning",
                description:
                  "Scientists have cloned endangered animals (like the gaur and black-footed ferret) using asexual reproduction principles to quickly increase population numbers of critically endangered species.",
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
