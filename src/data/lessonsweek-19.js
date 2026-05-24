// Week 19: Food Chains and Food nulls — Grade 7 Science

import globe from "../assets/week1/globe.jpg";
import simulation from "../assets/week1/simulation.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week19 = {
  id: "week-19",
  weekNumber: 19,
  title: "Food Chains and Food nulls",
  category: "Ecology",
  description:
    "Explore how energy flows through ecosystems via food chains and food nulls, and understand the roles of producers, consumers, and decomposers.",
  icon: "Network",
  color: "secondary",
  isLocked: false,
  lessons: [
    {
      id: "lesson-55",
      weekId: "week-19",
      lessonNumber: 55,
      title: "Producers, Consumers, and Decomposers",
      badge: "Lesson 1",
      subtitle: "The fundamental roles organisms play in an ecosystem",
      readTime: "~12 min read",
      xp: 50,
      heroImage: globe,
      heroImageAlt:
        "Globe image showing diverse ecosystems with producers, consumers, and decomposers",
      sections: [
        "Roles in an Ecosystem",
        "Key Terms",
        "Visual Guide to Roles",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "Roles in an Ecosystem",
          data: {
            paragraphs: [
              "Every living thing in an ecosystem plays a specific role based on how it obtains energy. <strong class='text-primary-700'>Producers</strong> (also called autotrophs) make their own food through photosynthesis, using sunlight, water, and carbon dioxide to produce glucose. Plants, algae, and phytoplankton are producers — they form the foundation of all food chains.",
              "<strong class='text-primary-700'>Consumers</strong> (heterotrophs) cannot make their own food and must eat other organisms to get energy. <strong class='text-primary-700'>Primary consumers</strong> are herbivores that eat producers (e.g., rabbits, caterpillars, deer). <strong class='text-primary-700'>Secondary consumers</strong> eat primary consumers (e.g., frogs eat caterpillars). <strong class='text-primary-700'>Tertiary consumers</strong> are top predators that eat secondary consumers (e.g., eagles, sharks).",
              "<strong class='text-primary-700'>Decomposers</strong> are the ecosystem's recyclers. Bacteria and fungi break down dead organisms and waste, releasing nutrients back into the soil and water. Without decomposers, ecosystems would be buried in dead matter and essential nutrients would be locked away forever.",
            ],
            didYouKnow:
              "A single teaspoon of healthy garden soil contains more microorganisms (mostly decomposers) than there are people on Earth — more than 1 billion bacteria in just one teaspoon!",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Producer (Autotroph)",
                desc: "An organism that makes its own food using energy from the sun (photosynthesis) or chemical reactions. Examples: plants, algae, phytoplankton.",
              },
              {
                term: "Consumer (Heterotroph)",
                desc: "An organism that cannot make its own food and must eat other organisms. Consumers are classified by what they eat.",
              },
              {
                term: "Decomposer",
                desc: "An organism that breaks down dead organisms and waste, recycling nutrients back into the ecosystem. Examples: bacteria, fungi, earthworms.",
              },
              {
                term: "Herbivore",
                desc: "A consumer that eats only plants (producers). Also called a primary consumer. Examples: rabbit, caterpillar, deer, cow.",
              },
              {
                term: "Carnivore",
                desc: "A consumer that eats only other animals. Examples: eagles, sharks, frogs. Can be secondary or tertiary consumers.",
              },
              {
                term: "Omnivore",
                desc: "A consumer that eats both plants and animals. Examples: humans, bears, raccoons.",
              },
              {
                term: "Trophic Level",
                desc: "A feeding position in a food chain. Producers are at the first trophic level; primary consumers at the second; and so on.",
              },
            ],
          },
        },
        {
          type: "imageCards",
          heading: "Visual Guide to Roles",
          data: {
            cards: [
              {
                title: "Producers",
                label: "Autotrophs",
                variant: "primary",
                color: "primary",
                desc: "Plants, algae, and other photosynthetic organisms form the base of all food chains.",
                image: globe,
                imageAlt:
                  "Globe image showing diverse plant and algae producers in ecosystems",
                examples: [
                  "Grass, trees, shrubs (land ecosystems)",
                  "Algae, phytoplankton (aquatic ecosystems)",
                  "Seaweed, water plants (wetlands)",
                ],
              },
              {
                title: "Consumers",
                label: "Heterotrophs",
                variant: "secondary",
                color: "secondary",
                desc: "Animals that eat producers or other consumers, organized into trophic levels.",
                image: null,
                imageAlt:
                  "null diagram showing consumer relationships between herbivores and carnivores",
                examples: [
                  "Primary: rabbit, grasshopper, deer (eat plants)",
                  "Secondary: frog, fox, small fish (eat herbivores)",
                  "Tertiary: eagle, shark, orca (top predators)",
                ],
              },
              {
                title: "Decomposers",
                label: "Recyclers",
                variant: "primary",
                color: "primary",
                desc: "Bacteria, fungi, and earthworms break down dead matter and return nutrients to the soil.",
                image: simulation,
                imageAlt:
                  "Simulation diagram showing decomposers breaking down organic matter",
                examples: [
                  "Mushrooms break down fallen logs",
                  "Bacteria decompose animal waste",
                  "Earthworms break down leaf litter into rich soil",
                ],
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
                title: "Agriculture and Soil Health",
                description:
                  "Farmers rely on decomposers to recycle nutrients. Adding compost (decomposed organic matter) enriches soil, reducing the need for chemical fertilizers and improving crop yields sustainably.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Natural Pest Control",
                description:
                  "Introducing natural predators (consumers) to control pest populations is safer and more sustainable than pesticides. Ladybugs eat aphids; hawks control rodent populations.",
                icon: "🐞",
                color: "border-l-secondary-500",
              },
              {
                title: "Fisheries Management",
                description:
                  "Understanding which fish are producers, primary consumers, or top predators helps fisheries managers decide sustainable catch limits and protect ocean food nulls from collapse.",
                icon: "🐟",
                color: "border-l-accent-500",
              },
              {
                title: "Conservation",
                description:
                  "Protecting producers (forests, wetlands, coral reefs) is essential because all consumers depend on them. Deforestation and coral bleaching threaten entire food chains built upon these producers.",
                icon: "🌿",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-56",
      weekId: "week-19",
      lessonNumber: 56,
      title: "Food Chains",
      badge: "Lesson 2",
      subtitle: "How energy flows in a linear sequence through an ecosystem",
      readTime: "~12 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt: "Flowchart showing a linear food chain from grass to eagle",
      sections: [
        "What Is a Food Chain?",
        "Trophic Levels",
        "Key Ideas About Food Chains",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "What Is a Food Chain?",
          data: {
            paragraphs: [
              "A <strong class='text-primary-700'>food chain</strong> is a linear diagram that shows the flow of energy from one organism to the next in an ecosystem. Each arrow in a food chain means 'is eaten by' or 'energy flows to'. For example: Grass → Grasshopper → Frog → Snake → Eagle. In this chain, grass is eaten by the grasshopper, the grasshopper is eaten by the frog, and so on.",
              "Each position in a food chain is called a <strong class='text-primary-700'>trophic level</strong>. Producers are at the first trophic level. Each time energy moves up to the next trophic level, about <strong class='text-primary-700'>90% of that energy is lost</strong> as heat — this is known as the 10% rule. Only 10% of the energy is passed on to the next consumer.",
              "This is why food chains rarely have more than four or five trophic levels — there simply is not enough energy to support a sixth or seventh level. It also explains why top predators like eagles and sharks are relatively rare compared to the producers and herbivores at the base of the chain.",
            ],
            didYouKnow:
              "To produce 1 kilogram of beef, a cow must eat about 8 kilograms of grain — this is the 10% energy rule in action. Eating lower on the food chain is far more energy-efficient!",
          },
        },
        {
          type: "timeline",
          heading: "Trophic Levels",
          data: {
            intro:
              "Follow the path of energy through a food chain, from the sun-powered producers at the base to the decomposers that complete the cycle.",
            steps: [
              {
                num: 1,
                title: "First Trophic Level: Producers",
                color: "primary",
                description:
                  "Producers capture energy from sunlight through photosynthesis and store it as chemical energy in their tissues. Examples: grass, algae, phytoplankton, trees. They are the source of all energy in a food chain.",
                tip: "All the energy in a food chain originally comes from the sun — producers are the only organisms that can capture it.",
              },
              {
                num: 2,
                title: "Second Trophic Level: Primary Consumers",
                color: "secondary",
                description:
                  "Primary consumers (herbivores) eat producers to get energy. Only about 10% of the producer's energy is transferred to the herbivore. Examples: grasshoppers, rabbits, caterpillars, deer, zebras.",
                tip: "90% of the energy is lost at each step — mostly as body heat during metabolism and in waste products.",
              },
              {
                num: 3,
                title: "Third Trophic Level: Secondary Consumers",
                color: "accent",
                description:
                  "Secondary consumers eat primary consumers. They receive only about 1% of the original energy from the producers (10% of 10%). Examples: frogs eat grasshoppers, foxes eat rabbits, small fish eat zooplankton.",
                tip: "Because so little energy remains, there are always far fewer secondary consumers than primary consumers in an ecosystem.",
              },
              {
                num: 4,
                title: "Fourth Trophic Level: Tertiary Consumers",
                color: "primary",
                description:
                  "Tertiary consumers (top predators) eat secondary consumers. They receive only about 0.1% of the original energy from producers. Examples: eagles eat snakes, sharks eat large fish, orcas eat seals.",
                tip: "Top predators are always the rarest organisms in a food chain due to the tiny amount of energy available at this level.",
              },
              {
                num: 5,
                title: "Decomposers: Completing the Cycle",
                color: "secondary",
                description:
                  "When organisms at any trophic level die, decomposers (bacteria, fungi) break them down. Nutrients are returned to the soil and water, where producers can absorb them — completing the nutrient cycle.",
                tip: "Decomposers are essential — without them, ecosystems would run out of the minerals and nutrients that producers need to grow.",
              },
            ],
          },
        },
        {
          type: "conceptList",
          heading: "Key Ideas About Food Chains",
          data: {
            concepts: [
              "A food chain shows the linear transfer of energy from one organism to the next using arrows that point in the direction energy flows.",
              "The 10% rule: only about 10% of the energy at one trophic level is transferred to the next — 90% is lost mainly as heat.",
              "Producers are always at the base of a food chain because they are the only organisms that can capture energy from sunlight.",
              "The number of trophic levels is limited — usually 4 to 5 — because too little energy remains to support higher levels.",
              "Shorter food chains are more energy-efficient — a field of grain feeding humans directly provides far more energy than feeding it to cows and then eating the cows.",
              "Decomposers are not always shown in food chains, but they play a vital role in returning nutrients to the ecosystem.",
            ],
          },
        },
        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Fisheries Management",
                description:
                  "Understanding trophic levels and the 10% rule helps scientists calculate sustainable fish populations. Overfishing a top predator disrupts the entire chain below it.",
                icon: "🐟",
                color: "border-l-primary-500",
              },
              {
                title: "Controlling Pest Populations",
                description:
                  "Introducing or protecting natural predators (secondary or tertiary consumers) to control pest species (primary consumers) is a cost-effective and environmentally friendly strategy.",
                icon: "🦅",
                color: "border-l-secondary-500",
              },
              {
                title: "Understanding Biodiversity Loss",
                description:
                  "When a species is removed from a food chain (through extinction or hunting), all species above and below it are affected. Protecting biodiversity means protecting all trophic levels.",
                icon: "🌿",
                color: "border-l-accent-500",
              },
              {
                title: "Agricultural Planning",
                description:
                  "Farmers apply the 10% rule when deciding whether to grow crops for direct human consumption or to raise livestock. Direct consumption requires less land and fewer resources.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-57",
      weekId: "week-19",
      lessonNumber: 57,
      title: "Food nulls",
      badge: "Lesson 3",
      subtitle: "How interconnected food chains create a complex null of life",
      readTime: "~13 min read",
      xp: 50,
      heroImage: null,
      heroImageAlt:
        "null diagram showing the interconnected food null of an ecosystem",
      sections: [
        "Beyond the Food Chain",
        "Food Chain vs. Food null",
        "Ecosystem Disruption Scenarios",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "Beyond the Food Chain",
          data: {
            paragraphs: [
              "A food chain gives us a simple picture of energy flow, but nature is rarely that simple. In reality, most animals eat more than one type of food and are preyed upon by more than one predator. A <strong class='text-primary-700'>food null</strong> shows the complex, interconnected network of ALL the feeding relationships in an ecosystem.",
              "In a food null, many food chains overlap and interlink. For example, a frog might eat grasshoppers AND flies, while the frog is eaten by both snakes AND herons. These overlapping connections mean that food nulls are far more resilient than simple food chains — if one food source disappears, an animal may switch to another.",
              "However, removing a <strong class='text-primary-700'>keystone species</strong> — a species that has an outsized effect on its ecosystem — can trigger a <strong class='text-primary-700'>trophic cascade</strong>, where changes at one trophic level cause dramatic changes throughout the entire food null. The more biodiversity an ecosystem has, the more stable its food null.",
            ],
            didYouKnow:
              "When wolves were reintroduced to Yellowstone National Park in 1995, they reduced elk grazing near rivers — allowing willows and aspens to grow back, which stabilized riverbanks, reduced erosion, and even changed the course of rivers. This is a trophic cascade!",
          },
        },
        {
          type: "comparison",
          heading: "Food Chain vs. Food null",
          data: {
            intro:
              "While food chains and food nulls both show energy flow, they differ significantly in complexity and accuracy.",
            left: {
              label: "Food Chain",
              color: "primary",
              items: [
                "Simple, LINEAR sequence of organisms",
                "Less realistic — most organisms eat many things",
                "Shows ONE feeding pathway only",
                "Easier to draw and understand",
                "If one link is removed, the chain breaks completely",
              ],
            },
            right: {
              label: "Food null",
              color: "secondary",
              items: [
                "Complex, INTERCONNECTED network of organisms",
                "More realistic — shows actual feeding relationships",
                "Shows MANY overlapping feeding pathways",
                "More complex but far more accurate",
                "If one species is removed, others can adapt — more resilient",
              ],
            },
          },
        },
        {
          type: "scenario",
          heading: "Ecosystem Disruption Scenarios",
          data: {
            intro:
              "These real-world examples show how removing or disrupting one part of a food null can affect everything else.",
            scenarios: [
              {
                title: "Wolves Removed from Yellowstone",
                situation:
                  "For most of the 20th century, wolves were hunted to extinction in Yellowstone National Park. With no natural predators, the elk population exploded and heavily grazed the riverbanks, causing erosion and destroying habitat.",
                question:
                  "How did removing one species from the top of the food null affect the entire ecosystem?",
                skill:
                  "Trophic cascade — removing the top predator (wolves) caused the primary consumer (elk) population to boom, which overconsumption of plants (producers) destabilized the ecosystem. When wolves were reintroduced in 1995, the entire ecosystem recovered.",
              },
              {
                title: "Overfishing Tuna",
                situation:
                  "Commercial fishing removes enormous numbers of bluefin tuna from the ocean every year. Tuna are apex predators that eat smaller fish like mackerel and herring.",
                question:
                  "What happens to the rest of the food null when tuna are overfished?",
                skill:
                  "Without tuna to control them, populations of mackerel and herring explode, leading to overgrazing of zooplankton and phytoplankton (producers). This reduces oxygen production in the ocean and disrupts the entire aquatic food null.",
              },
              {
                title: "Algae Bloom in a Lake",
                situation:
                  "Agricultural runoff containing fertilizers flows into a lake, causing an explosion of algae growth — an algal bloom. The algae cover the water surface, blocking sunlight from reaching underwater plants.",
                question:
                  "How does a sudden increase in producers (algae) disrupt the food null?",
                skill:
                  "The algae bloom blocks light, killing underwater plants and reducing oxygen in the water (when algae decompose). Fish and other aquatic consumers suffocate and die, collapsing the entire aquatic food null — a process called eutrophication.",
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
                title: "Conservation Biology",
                description:
                  "Scientists use food null models to identify keystone species and predict how ecosystem changes (habitat loss, hunting, climate change) will affect entire communities of organisms.",
                icon: "🌿",
                color: "border-l-primary-500",
              },
              {
                title: "Wildlife Management",
                description:
                  "Wildlife managers use food null knowledge to determine sustainable hunting and fishing limits, preventing the removal of key species that would destabilize entire ecosystems.",
                icon: "🦅",
                color: "border-l-secondary-500",
              },
              {
                title: "Invasive Species Control",
                description:
                  "Invasive species disrupt food nulls by competing with native species or lacking natural predators. Understanding the food null helps managers decide how to control invasive species most effectively.",
                icon: "🦎",
                color: "border-l-accent-500",
              },
              {
                title: "Environmental Impact Assessment",
                description:
                  "Before construction projects (dams, highways, factories) are approved, scientists use food null analysis to predict how the project will affect local ecosystems — protecting biodiversity while allowing development.",
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
