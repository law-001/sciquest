// Week 18: Sexual Reproduction and Energy Flow — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd term Week 18.
//   Lesson 1 — Sexual Reproduction
//   Lesson 2 — Energy Flow in an Ecosystem:
//              Food Chain, Food Web, and Energy Transfer

import foodchain from "../assets/foodchain.png";
import globe from "../assets/week1/globe.jpg";
import simulation from "../assets/week1/simulation.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week18 = {
  id: "week-18",
  weekNumber: 18,
  title: "Sexual Reproduction and Energy Flow",
  category: "Life Science",
  description:
    "Compare sexual reproduction with the asexual strategies you have studied, then follow energy as it moves through an ecosystem in food chains and food webs.",
  icon: "Network",
  color: "primary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Sexual Reproduction
    // ═══════════════════════════════════════════════════
    {
      id: "w18-l1",
      weekId: "week-18",
      lessonNumber: 1,
      title: "Sexual Reproduction",
      badge: "Lesson 1",
      subtitle:
        "Two parents, two gametes, and offspring that resemble both without copying either — learn how sexual reproduction works and why its variety is worth the cost.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: globe,
      heroImageAlt:
        "Diverse living organisms that reproduce sexually",

      signature: {
        widgetId: "variation-batch",
        heading: "Watch It: Twelve Offspring, No Two Alike",
        intro:
          "Set the two parents and cross them; twelve offspring are born one at a time, each a different draw. Then fire the same disease that wiped out the clone field — it grips one band of shell tones, and the spread puts some of the litter outside it.",
        instruction: "Breed a litter of twelve, then stress it",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "Examples Across the Living World",
        "Sexual vs. Asexual Reproduction",
        "Why Variation Matters",
        "Key Characteristics",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Sexual Reproduction",
          url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology",
        },
        {
          label: "Britannica — Sexual Reproduction",
          url: "https://www.britannica.com/science/sexual-reproduction",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Sexual reproduction</strong> requires two parents. Each produces gametes through <strong class='text-primary-700'>meiosis</strong> — sperm from the male, eggs from the female — and at fertilization one of each fuses to form a zygote.",
              "Because each parent contributes half of the offspring's genetic material, and because meiosis shuffled that material through crossing over and independent assortment, the offspring is <strong class='text-primary-700'>genetically different from both parents</strong> and from every sibling. This variation is the whole point.",
              "Sexual reproduction is slower and more expensive than asexual reproduction. An organism must find a mate, produce gametes, and only half the population can bear offspring. Despite all that cost, it has become the dominant strategy among complex organisms — because varied populations survive change and identical ones do not.",
            ],
            didYouKnow:
              "Flowering plants reproduce sexually too. When a bee carries pollen from one flower to another it is acting as a matchmaker, enabling fertilization between two plants that can never move toward each other.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Sexual Reproduction",
                desc: "Reproduction requiring two parents, each contributing a gamete, producing genetically unique offspring.",
              },
              {
                term: "Gamete",
                desc: "A haploid sex cell — sperm or egg — produced by meiosis and carrying half the chromosome number.",
              },
              {
                term: "Fertilization",
                desc: "The fusion of two gametes to form a diploid zygote with the full chromosome number restored.",
              },
              {
                term: "Genetic Variation",
                desc: "Differences in the genetic makeup of individuals in a population. Sexual reproduction creates it; asexual reproduction does not.",
              },
              {
                term: "Pollination",
                desc: "The transfer of pollen from one flower to another by wind, water, or animals — the plant equivalent of delivering sperm to the egg.",
              },
              {
                term: "Adaptation",
                desc: "A trait that helps an organism survive and reproduce in its environment. Variation is what new adaptations arise from.",
              },
              {
                term: "Natural Selection",
                desc: "The process by which organisms with traits better suited to their environment survive and reproduce more successfully.",
              },
              {
                term: "Hermaphrodite",
                desc: "An organism producing both male and female gametes, such as an earthworm. It still needs a partner to reproduce sexually.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Examples Across the Living World",
          data: {
            cards: [
              {
                title: "Mammals and Birds",
                label: "Internal Fertilization",
                variant: "primary",
                color: "primary",
                desc: "Fertilization happens inside the female's body. Few offspring are produced, but each is well protected while it develops.",
                image: globe,
                imageAlt: "Mammals and birds that reproduce sexually",
                examples: [
                  "Humans, dogs, whales — embryo develops inside the mother",
                  "Birds — fertilised egg is laid and incubated in a shell",
                  "High survival rate per offspring",
                ],
              },
              {
                title: "Fish and Amphibians",
                label: "External Fertilization",
                variant: "secondary",
                color: "secondary",
                desc: "Eggs and sperm are released into water, where fertilization takes place outside the body.",
                image: simulation,
                imageAlt:
                  "Frogs and fish releasing eggs into water for external fertilization",
                examples: [
                  "Frogs, salmon, sea urchins",
                  "Thousands of eggs released at once",
                  "Water lets sperm swim to the eggs",
                ],
              },
              {
                title: "Flowering Plants",
                label: "Pollination",
                variant: "primary",
                color: "primary",
                desc: "Pollen containing the male gamete is carried by wind or animals to the egg cells in another flower's ovary.",
                image: flowchart,
                imageAlt:
                  "Diagram showing pollination transferring pollen between flowers",
                examples: [
                  "Pollen carries the male gamete",
                  "Insects, birds, and wind transfer it",
                  "Fertilization produces seeds inside a fruit",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Sexual vs. Asexual Reproduction",
          data: {
            intro:
              "You studied asexual reproduction last week. Here are the two strategies side by side — neither is universally better, and many organisms use both.",
            left: {
              label: "Sexual Reproduction",
              color: "primary",
              items: [
                "Requires TWO parents",
                "Gametes produced by meiosis, then fertilization",
                "Offspring are genetically UNIQUE",
                "Slower — a mate must be found",
                "High energy cost",
                "Produces great genetic variation",
                "Examples: humans, frogs, flowering plants",
              ],
            },
            right: {
              label: "Asexual Reproduction",
              color: "secondary",
              items: [
                "Requires only ONE parent",
                "No gametes and no fertilization — uses mitosis",
                "Offspring are genetically IDENTICAL clones",
                "Faster — no mate needed",
                "Low energy cost",
                "Produces NO genetic variation",
                "Examples: bacteria, yeast, sea stars, strawberry plants",
              ],
            },
          },
        },

        {
          type: "reasonCards",
          heading: "Why Variation Matters",
          data: {
            intro:
              "Sexual reproduction costs more in time and energy. Four benefits explain why it has been worth it across billions of years.",
            reasons: [
              {
                num: 1,
                title: "Adapting to a Changing Environment",
                color: "primary",
                desc: "Varied offspring mean some can survive new conditions",
                content:
                  "When climate shifts, a new predator arrives, or food becomes scarce, a varied population is likely to contain individuals that can cope. A clone population either all copes or all dies.",
              },
              {
                num: 2,
                title: "Disease Resistance",
                color: "secondary",
                desc: "No single pathogen can wipe out a varied population",
                content:
                  "A new virus is unlikely to kill every individual when their genes differ — some will carry natural resistance and survive to reproduce.",
              },
              {
                num: 3,
                title: "Driving Evolution",
                color: "accent",
                desc: "Variation is the raw material natural selection works on",
                content:
                  "Natural selection can only favour traits that already exist. Meiosis and fertilization continually generate new combinations for it to act on, which is how species change over time.",
              },
              {
                num: 4,
                title: "Every Individual Is Unique",
                color: "primary",
                desc: "Except identical twins, no two people are genetically the same",
                content:
                  "Crossing over, independent assortment, and random fertilization together produce so many combinations that the same one occurring twice is effectively impossible.",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Key Characteristics",
          data: {
            concepts: [
              "Sexual reproduction requires TWO parents, each contributing genetic material through a gamete.",
              "Gametes are produced by meiosis and are haploid, carrying half the organism's chromosomes.",
              "Fertilization combines two haploid gametes into a diploid zygote that develops into a new organism.",
              "Offspring are genetically unique — different from both parents and from each other.",
              "The variation produced improves a population's ability to adapt to change and resist disease.",
              "Only females bear offspring, which limits how fast a sexually reproducing population can grow.",
              "Some organisms, including aphids and sea anemones, use asexual reproduction when conditions are good and switch to sexual reproduction when conditions worsen.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Selective Breeding",
                description:
                  "Farmers choose which plants and animals mate in order to combine desirable traits — disease-resistant crops, higher-yielding livestock.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Conservation Genetics",
                description:
                  "Conservationists deliberately breed individuals from separate groups to maintain genetic diversity and avoid the dangers of inbreeding.",
                icon: "🌿",
                color: "border-l-secondary-500",
              },
              {
                title: "Understanding Inherited Conditions",
                description:
                  "Because sexual reproduction mixes genetic material, some conditions appear unexpectedly. Studying inheritance patterns helps families understand the risks.",
                icon: "🧬",
                color: "border-l-accent-500",
              },
              {
                title: "Protecting Pollinators",
                description:
                  "Bees and butterflies enable sexual reproduction in flowering plants. Losing them would devastate both wild plants and food crops.",
                icon: "🐝",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Energy Flow in an Ecosystem
    // ═══════════════════════════════════════════════════
    {
      id: "w18-l2",
      weekId: "week-18",
      lessonNumber: 2,
      title:
        "Energy Flow in an Ecosystem: Food Chain, Food Web, and Energy Transfer",
      badge: "Lesson 2",
      subtitle:
        "Follow energy from sunlight into plants and along every arrow of a food chain — then see why real ecosystems are webs, not chains.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: foodchain,
      heroImageAlt:
        "Diagram of a food chain showing energy flowing from grass to a top predator",

      signature: {
        widgetId: "energy-flow",
        heading: "Watch It: Turn an Arrow Round",
        intro:
          "Energy travels as packets you can see, and which organisms are fed is worked out by walking from the sun along the arrows that currently point the right way. Reverse one and everything behind it starves. Then add links, remove the frog, and find out what a web does that a chain cannot.",
        instruction: "Feed the chain, break it, then build the web",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "Roles in an Ecosystem",
        "Trophic Levels and the 10% Rule",
        "Food Chain vs. Food Web",
        "Key Ideas",
        "Ecosystem Disruption Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Energy Flow in Ecosystems",
          url: "https://www.khanacademy.org/science/biology/ecology",
        },
        {
          label: "National Geographic — Food Webs",
          url: "https://education.nationalgeographic.org/resource/food-web/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Every living thing needs energy, and in almost every ecosystem on Earth that energy starts as sunlight. <strong class='text-primary-700'>Producers</strong> capture it through photosynthesis; everything else gets it second-hand by eating.",
              "A <strong class='text-primary-700'>food chain</strong> shows this transfer as a simple line: Grass → Grasshopper → Frog → Snake → Eagle. Each arrow means 'energy flows to' — the arrow always points toward the eater, never toward the eaten. Getting that direction right is the single most common mistake in this topic.",
              "But real ecosystems are not simple lines. Most animals eat several things and are eaten by several things. A <strong class='text-primary-700'>food web</strong> shows all those overlapping connections at once, and it is a far more honest picture of how an ecosystem actually works.",
            ],
            didYouKnow:
              "To produce 1 kilogram of beef, a cow must eat about 8 kilograms of grain. That is the 10% energy rule in action, and it is why eating lower down the food chain uses far less land and water.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Producer (Autotroph)",
                desc: "An organism that makes its own food using energy from the sun through photosynthesis. Plants, algae, phytoplankton.",
              },
              {
                term: "Consumer (Heterotroph)",
                desc: "An organism that cannot make its own food and must eat other organisms to obtain energy.",
              },
              {
                term: "Decomposer",
                desc: "An organism that breaks down dead matter and waste, recycling nutrients back into the ecosystem. Bacteria, fungi, earthworms.",
              },
              {
                term: "Herbivore",
                desc: "A consumer that eats only plants. Also called a primary consumer — rabbit, caterpillar, deer.",
              },
              {
                term: "Carnivore",
                desc: "A consumer that eats only other animals — eagle, shark, frog.",
              },
              {
                term: "Omnivore",
                desc: "A consumer that eats both plants and animals — humans, bears, raccoons.",
              },
              {
                term: "Trophic Level",
                desc: "A feeding position in a food chain. Producers occupy the first level, primary consumers the second, and so on.",
              },
              {
                term: "Food Chain",
                desc: "A simple linear diagram showing energy passing from one organism to the next.",
              },
              {
                term: "Food Web",
                desc: "A network of interconnected food chains showing all the feeding relationships in an ecosystem.",
              },
              {
                term: "10% Rule",
                desc: "Only about 10% of the energy at one trophic level passes to the next; roughly 90% is lost, mostly as heat.",
              },
              {
                term: "Keystone Species",
                desc: "A species with an effect on its ecosystem far larger than its numbers would suggest.",
              },
              {
                term: "Trophic Cascade",
                desc: "A chain reaction in which changing one trophic level causes dramatic changes throughout the whole web.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Roles in an Ecosystem",
          data: {
            cards: [
              {
                title: "Producers",
                label: "Autotrophs",
                variant: "primary",
                color: "primary",
                desc: "Plants, algae, and phytoplankton capture solar energy through photosynthesis and form the base of every food chain.",
                image: globe,
                imageAlt: "Plants and algae acting as producers in ecosystems",
                examples: [
                  "Grass, trees, and shrubs on land",
                  "Algae and phytoplankton in water",
                  "The only organisms that can capture energy from sunlight",
                ],
              },
              {
                title: "Consumers",
                label: "Heterotrophs",
                variant: "secondary",
                color: "secondary",
                desc: "Animals that eat producers or other consumers, arranged into trophic levels according to what they eat.",
                image: foodchain,
                imageAlt:
                  "Diagram showing herbivores and carnivores in a food chain",
                examples: [
                  "Primary: rabbit, grasshopper, deer — they eat plants",
                  "Secondary: frog, fox, small fish — they eat herbivores",
                  "Tertiary: eagle, shark, orca — top predators",
                ],
              },
              {
                title: "Decomposers",
                label: "Recyclers",
                variant: "primary",
                color: "primary",
                desc: "Bacteria, fungi, and earthworms break down dead matter and return its nutrients to the soil and water.",
                image: simulation,
                imageAlt: "Fungi and bacteria decomposing organic matter",
                examples: [
                  "Mushrooms break down fallen logs",
                  "Bacteria decompose animal waste",
                  "Earthworms turn leaf litter into rich soil",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Trophic Levels and the 10% Rule",
          data: {
            intro:
              "Follow the energy from the sun upward, and watch how little survives each step. This is why food chains are short.",
            steps: [
              {
                num: 1,
                title: "First Level: Producers",
                color: "primary",
                description:
                  "Producers capture sunlight through photosynthesis and store it as chemical energy in their tissues. Grass, algae, phytoplankton, and trees are the source of all the energy in the chain.",
                tip: "All energy in a food chain originally comes from the sun — producers are the only organisms that can capture it.",
              },
              {
                num: 2,
                title: "Second Level: Primary Consumers",
                color: "secondary",
                description:
                  "Herbivores eat producers. Only about 10% of the producer's stored energy ends up in the herbivore — grasshoppers, rabbits, caterpillars, deer.",
                tip: "The missing 90% is lost as body heat during movement and metabolism, and in undigested waste.",
              },
              {
                num: 3,
                title: "Third Level: Secondary Consumers",
                color: "accent",
                description:
                  "Secondary consumers eat the herbivores, receiving only about 1% of the producers' original energy — 10% of 10%. Frogs eat grasshoppers; foxes eat rabbits.",
                tip: "So little energy remains that there are always far fewer secondary consumers than primary ones.",
              },
              {
                num: 4,
                title: "Fourth Level: Tertiary Consumers",
                color: "primary",
                description:
                  "Top predators eat secondary consumers and receive roughly 0.1% of the original energy. Eagles eat snakes; sharks eat large fish.",
                tip: "Top predators are always the rarest organisms in an ecosystem — there simply is not energy for many.",
              },
              {
                num: 5,
                title: "Decomposers Close the Loop",
                color: "secondary",
                description:
                  "When an organism at any level dies, decomposers break it down and return its nutrients to the soil and water, where producers absorb them again.",
                tip: "Energy flows one way and is lost as heat. Nutrients cycle round and round — that difference matters.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Food Chain vs. Food Web",
          data: {
            intro:
              "Both show energy flow, but one is a simplification and the other is closer to reality.",
            left: {
              label: "Food Chain",
              color: "primary",
              items: [
                "A simple, LINEAR sequence of organisms",
                "Shows only ONE feeding pathway",
                "Less realistic — most organisms eat many things",
                "Easier to draw and understand",
                "If one link is removed, the chain breaks completely",
              ],
            },
            right: {
              label: "Food Web",
              color: "secondary",
              items: [
                "A complex, INTERCONNECTED network",
                "Shows MANY overlapping feeding pathways",
                "More realistic — matches actual feeding relationships",
                "More complex but far more accurate",
                "If one species is removed, others can adapt — more resilient",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Key Ideas",
          data: {
            concepts: [
              "Arrows in a food chain point in the direction energy flows — from the organism being eaten toward the one eating it.",
              "The 10% rule: only about 10% of the energy at one trophic level reaches the next; about 90% is lost, mostly as heat.",
              "Producers are always at the base because they are the only organisms that can capture energy from sunlight.",
              "Food chains rarely exceed four or five trophic levels, because too little energy remains to support another one.",
              "Shorter food chains are more energy-efficient — feeding grain to people directly delivers far more energy than feeding it to cattle first.",
              "A food web is many overlapping food chains, which makes an ecosystem far more resilient than any single chain.",
              "Removing a keystone species can trigger a trophic cascade that changes the whole ecosystem.",
              "Energy flows one way through an ecosystem and is eventually lost as heat; nutrients, by contrast, are recycled by decomposers.",
            ],
          },
        },

        {
          type: "scenario",
          heading: "Ecosystem Disruption Scenarios",
          data: {
            intro:
              "These are real cases where removing or adding one part of a food web changed everything else.",
            scenarios: [
              {
                title: "Wolves Removed from Yellowstone",
                situation:
                  "For most of the 20th century wolves were hunted out of Yellowstone. With no predator, the elk population exploded and grazed the riverbanks bare, causing erosion and destroying habitat.",
                question:
                  "How did removing one species from the top of the web affect the entire ecosystem?",
                skill:
                  "A trophic cascade. Removing the top predator let the primary consumer population boom, which destroyed the producers, which destabilised everything. When wolves were reintroduced in 1995 the ecosystem recovered — willows regrew and even the rivers changed course.",
              },
              {
                title: "Overfishing Tuna",
                situation:
                  "Commercial fishing removes enormous numbers of bluefin tuna each year. Tuna are apex predators that eat smaller fish such as mackerel and herring.",
                question:
                  "What happens to the rest of the food web when tuna are overfished?",
                skill:
                  "Without tuna controlling them, mackerel and herring populations explode and overgraze the zooplankton and phytoplankton at the base. Since phytoplankton are major oxygen producers, the damage reaches far beyond the fish themselves.",
              },
              {
                title: "Algae Bloom in a Lake",
                situation:
                  "Fertilizer runoff flows into a lake, causing an explosion of algae that covers the surface and blocks sunlight from reaching underwater plants.",
                question:
                  "How can a sudden INCREASE in producers damage the food web?",
                skill:
                  "The bloom blocks light and kills underwater plants. When the algae themselves die, decomposing bacteria consume the dissolved oxygen, and fish and other consumers suffocate. The process is called eutrophication.",
              },
              {
                title: "The Reversed Arrow",
                situation:
                  "A student draws a food chain as Grass ← Grasshopper ← Frog, explaining that the frog eats the grasshopper and the grasshopper eats the grass.",
                question:
                  "The student has the feeding relationships right but the diagram is wrong. Why?",
                skill:
                  "The arrows point the wrong way. An arrow shows the direction ENERGY flows, which is from the eaten to the eater. It should be Grass → Grasshopper → Frog.",
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
                title: "Fisheries Management",
                description:
                  "Scientists use trophic levels and the 10% rule to set sustainable catch limits, since overfishing one level disrupts everything connected to it.",
                icon: "🐟",
                color: "border-l-primary-500",
              },
              {
                title: "Natural Pest Control",
                description:
                  "Protecting or introducing natural predators — ladybugs for aphids, hawks for rodents — controls pests without pesticides.",
                icon: "🐞",
                color: "border-l-secondary-500",
              },
              {
                title: "Agriculture and Land Use",
                description:
                  "The 10% rule explains why growing crops for people directly needs far less land and water than raising livestock on the same grain.",
                icon: "🌾",
                color: "border-l-accent-500",
              },
              {
                title: "Conservation Planning",
                description:
                  "Food web models let scientists predict how habitat loss or hunting will ripple through an entire community before a decision is made.",
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
