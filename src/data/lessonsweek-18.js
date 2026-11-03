// Week 18: Sexual Reproduction and Energy Flow — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd Quarter Week 8 (site Week 18).
//   Lesson 1 — Sexual Reproduction
//   Lesson 2 — Energy Flow in an Ecosystem:
//              Food Chain, Food Web, and Energy Transfer

import foodchain from "../assets/foodchain.png";
import globe from "../assets/week1/globe.jpg";
import simulation from "../assets/week1/simulation.jpg";
import flowchart from "../assets/flowchart.jpg";
import microscope from "../assets/week1/Microscopic.jpg";
import lab from "../assets/lab.jpg";
import equation from "../assets/week1/equation.jpg";

export const week18 = {
  id: "week-18",
  weekNumber: 18,
  title: "Sexual Reproduction and Energy Flow",
  category: "Life Science",
  description:
    "See how two parents make offspring that are each one of a kind, then follow energy from the sun through food chains and food webs in Philippine ecosystems.",
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
        "Follow the key steps from meiosis to fertilization, learn why offspring are never exact copies of their parents, and see how sexual reproduction passes on traits and creates variety.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: globe,
      heroImageAlt:
        "A mother hen with chicks of slightly different colors and markings",

      signature: {
        widgetId: "variation-batch",
        heading: "Watch It: Twelve Offspring, All Different",
        intro:
          "Two parents, twelve offspring, and a disease that cannot catch them all.",
        instruction: "Breed twelve offspring, then release the disease.",
        xp: 25,
        explainer: {
          title: "Why the litter beat the disease",
          points: [
            "Every offspring took a different mix of the two parents, so no two shells matched.",
            "The disease gripped one band of tones, and your litter spread past both edges of it.",
            "A clone field has one shell tone, so the same disease takes all of it.",
            "Setting both parents inside the parasite zone removed that spread, and nothing survived.",
          ],
        },
      },

      sections: [
        "Overview",
        "Key Steps of Sexual Reproduction",
        "Why Offspring Are Different",
        "Examples in Plants and Animals",
        "Heredity and Variation",
        "Sexual vs. Asexual Reproduction",
        "Think About It",
        "Variation at Work",
      ],

      references: [
        {
          label: "Britannica — Sexual reproduction",
          url: "https://www.britannica.com/science/sexual-reproduction",
        },
        {
          label: "Khan Academy — Variation in a species",
          url: "https://www.khanacademy.org/science/biology/heredity",
        },
        {
          label: "CK-12 — Sexual Reproduction",
          url: "https://www.ck12.org/c/biology/sexual-reproduction/",
        },
        {
          label: "Philippine Rice Research Institute (PhilRice)",
          url: "https://www.philrice.gov.ph/",
        },
        {
          label: "Philippine Carabao Center — Official Website",
          url: "https://www.pcc.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Sexual reproduction</strong> is reproduction that involves <strong class='text-primary-700'>two parents</strong>. Each parent makes sex cells, or <strong class='text-primary-700'>gametes</strong>: the male makes sperm, and the female makes eggs. A sperm and an egg join at <strong class='text-primary-700'>fertilization</strong> to start a new living thing.",
              "The offspring get half of their chromosomes from the mother and half from the father. That is why a child may have the mother's eyes and the father's hair. Passing traits from parents to offspring is called <strong class='text-primary-700'>heredity</strong>.",
              "But the offspring are <strong class='text-primary-700'>not exact copies</strong> of either parent, and brothers and sisters are not copies of each other. These differences are called <strong class='text-primary-700'>variation</strong>. This lesson explains where variation comes from and why it helps living things survive.",
            ],
            didYouKnow:
              "Rice flowers usually pollinate themselves. Each tiny rice flower opens for only a short time in the morning, and pollen falls onto its own stigma. To mix traits from two rice varieties, plant breeders must move pollen by hand.",
          },
        },

        {
          type: "timeline",
          heading: "Key Steps of Sexual Reproduction",
          data: {
            intro:
              "Sexual reproduction always includes two key processes: meiosis, which makes gametes, and fertilization, which joins them.",
            steps: [
              {
                num: 1,
                title: "Meiosis Makes Gametes",
                color: "primary",
                description:
                  "In each parent, special cells divide by meiosis. Each gamete gets only half of the chromosomes: one from each pair. In humans, a body cell has 46 chromosomes and a gamete has 23.",
                tip: "You learned the stages of meiosis I and II in Week 15.",
              },
              {
                num: 2,
                title: "The Gametes Meet",
                color: "secondary",
                description:
                  "The sperm must reach the egg. In many animals, this happens through mating. In flowering plants, wind, insects or birds carry pollen to another flower; this is called pollination.",
                tip: "In fish and frogs, eggs and sperm meet in the water.",
              },
              {
                num: 3,
                title: "Fertilization",
                color: "accent",
                description:
                  "One sperm and one egg fuse. Their nuclei join, and the chromosomes from both parents come together in one cell.",
                tip: "23 + 23 = 46 chromosomes in humans: the full number is restored.",
              },
              {
                num: 4,
                title: "A Zygote Forms",
                color: "primary",
                description:
                  "The fertilized egg, now called a zygote, has a brand-new mix of genes. No other living thing has exactly the same mix.",
                tip: "The only exception is identical twins, who come from the same zygote.",
              },
              {
                num: 5,
                title: "Growth by Mitosis",
                color: "secondary",
                description:
                  "The zygote divides again and again by mitosis to become an embryo, then a young organism. In plants, the fertilized ovule becomes a seed that can grow into a new plant.",
                tip: "Meiosis happens once to make gametes. After fertilization, mitosis does all the growing.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Why Offspring Are Different",
          data: {
            intro:
              "Each offspring gets a new combination of genes. Four things make this happen.",
            reasons: [
              {
                num: 1,
                title: "Two Parents Mix Their Genes",
                color: "primary",
                desc: "Half from the mother, half from the father",
                content:
                  "The offspring's genes come from two different individuals. The new combination is not the same as either parent's.",
              },
              {
                num: 2,
                title: "Crossing Over",
                color: "secondary",
                desc: "Chromosome pairs swap pieces in meiosis I",
                content:
                  "Before the pairs separate, matching chromosomes trade small pieces. This makes new combinations of genes on the same chromosome.",
              },
              {
                num: 3,
                title: "Independent Assortment",
                color: "accent",
                desc: "Each pair splits up in its own random way",
                content:
                  "In meiosis I, each chromosome pair lines up and separates independently of the others. With 23 pairs, one person can make about 8 million (2²³) different kinds of gametes, even before crossing over.",
              },
              {
                num: 4,
                title: "Random Fertilization",
                color: "primary",
                desc: "Any sperm can meet any egg",
                content:
                  "Which sperm joins which egg is a matter of chance. Combined with the first three, this makes every offspring one of a kind.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Examples in Plants and Animals",
          data: {
            cards: [
              {
                title: "Chicken",
                label: "Animal · internal fertilization",
                variant: "primary",
                color: "primary",
                desc: "The rooster's sperm fertilizes the egg inside the hen. The hen then lays the egg, and a chick grows inside the shell.",
                image: globe,
                imageAlt:
                  "Hen and rooster in a backyard with chicks of different colors",
                examples: [
                  "Chicks from the same parents can have different feather colors",
                  "The hen sits on the eggs for about 21 days",
                ],
              },
              {
                title: "Carabao",
                label: "Animal · internal fertilization",
                variant: "secondary",
                color: "secondary",
                desc: "The calf grows inside the mother for about 11 months before it is born, and it takes traits from both parents.",
                image: lab,
                imageAlt: "Mother carabao with her calf standing in a rice field",
                examples: [
                  "A calf may have its mother's horns and its father's size",
                  "Breeders choose parents for strength or milk",
                ],
              },
              {
                title: "Frog",
                label: "Animal · external fertilization",
                variant: "primary",
                color: "primary",
                desc: "The female lays eggs in water, and the male releases sperm over them. Each tadpole has its own mix of genes.",
                image: simulation,
                imageAlt:
                  "Clump of frog eggs and tadpoles in the shallow water of a rice field",
                examples: [
                  "Hundreds of eggs in one clump",
                  "Common in rice fields during the rainy season",
                ],
              },
              {
                title: "Gumamela",
                label: "Plant · pollination and fertilization",
                variant: "secondary",
                color: "secondary",
                desc: "Pollen from the anther reaches the stigma. A pollen tube grows down to the ovule, where a sperm nucleus fertilizes the egg.",
                image: flowchart,
                imageAlt:
                  "Gumamela flower with labeled stamen, anther, stigma and pistil",
                examples: [
                  "Insects and birds carry pollen between flowers",
                  "Breeders cross gumamela plants to get new flower colors",
                ],
              },
              {
                title: "Mango",
                label: "Plant · seeds and fruit",
                variant: "primary",
                color: "primary",
                desc: "After the flowers are pollinated and fertilized, each fertilized ovule becomes a seed, and the ovary grows into the fruit.",
                image: equation,
                imageAlt:
                  "Mango tree branch with small flowers next to young green fruits",
                examples: [
                  "A mango tree grown from seed may give fruit different from its parent",
                  "Bees and flies help pollinate mango flowers",
                ],
              },
              {
                title: "Rice",
                label: "Plant · self-pollination",
                variant: "secondary",
                color: "secondary",
                desc: "Each rice grain is a fertilized ovule. Scientists cross two rice varieties to combine good traits in one new variety.",
                image: microscope,
                imageAlt: "Rice panicle with open flowers and hanging anthers",
                examples: [
                  "PhilRice breeds varieties that survive floods or drought",
                  "Crossing mixes traits from two parent varieties",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Heredity and Variation",
          data: {
            intro:
              "Sexual reproduction does two things at once. It passes traits from parents to offspring (heredity), and it makes every offspring a little different (variation).",
            left: {
              label: "Heredity: Passing On Traits",
              color: "primary",
              items: [
                "Offspring get chromosomes, and so genes, from both parents",
                "That is why children look like their parents",
                "Puppies of two aspin dogs look like aspins, not cats",
                "Fertilization gives the offspring a full set of chromosomes, one from each parent per pair",
                "Traits such as dimples, curly hair and skin color can run in families",
              ],
            },
            right: {
              label: "Variation: Differences Among Offspring",
              color: "secondary",
              items: [
                "Brothers and sisters from the same parents look different",
                "Kittens in one litter can have different fur colors",
                "Meiosis and random fertilization make new gene mixes each time",
                "Variation lets some individuals survive changes, such as a new disease",
                "Natural selection works on these differences: the best-suited individuals survive and reproduce more",
              ],
            },
          },
        },

        {
          type: "comparison",
          heading: "Sexual vs. Asexual Reproduction",
          data: {
            intro:
              "You studied asexual reproduction last week. Here are the two side by side. Neither is always better, and many plants use both.",
            left: {
              label: "Sexual Reproduction",
              color: "primary",
              items: [
                "Two parents",
                "Gametes are made by meiosis, then joined by fertilization",
                "Offspring are genetically different from the parents and from each other",
                "Slower: parents must find a mate, or pollen must be carried",
                "Uses more time and energy",
                "Examples: chicken, carabao, frog, mango, rice",
              ],
            },
            right: {
              label: "Asexual Reproduction",
              color: "secondary",
              items: [
                "One parent",
                "No gametes and no fertilization; cells divide by mitosis",
                "Offspring are identical clones of the parent",
                "Faster: no mate is needed",
                "Uses less time and energy",
                "Examples: bacteria, yeast, planaria, kangkong cuttings",
              ],
            },
          },
        },

        {
          type: "scenario",
          heading: "Think About It",
          isSubsection: true,
          data: {
            intro: "Answer each question, then check the model answer.",
            scenarios: [
              {
                title: "Siblings Who Look Different",
                situation:
                  "Carlo and his sister Bea have the same parents, but Carlo has straight hair and Bea has curly hair.",
                question:
                  "How can two children from the same parents look so different?",
                skill:
                  "Each child came from a different sperm and a different egg. Because of crossing over, independent assortment and random fertilization, each gamete carried a different mix of genes, so each child got a different combination.",
              },
              {
                title: "A Mango Grown from Seed",
                situation:
                  "Lito plants a seed from a very sweet Carabao mango. Years later, the new tree gives fruit that is less sweet.",
                question:
                  "Why is the new fruit different from the parent fruit?",
                skill:
                  "The seed came from sexual reproduction. Its genes are a mix from the parent tree and from the tree that gave the pollen, so its traits can differ. That is why farmers graft mango branches when they want an exact copy.",
              },
              {
                title: "A Disease in the Rice Field",
                situation:
                  "A new plant disease spreads through a region. Some rice plants from many different varieties survive.",
                question:
                  "Why do some plants survive, and why does this matter for the future?",
                skill:
                  "Variation. Some plants happen to carry genes that help them resist the disease. They survive and reproduce, so their offspring can inherit that resistance.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Variation at Work",
          isSubsection: true,
          data: {
            apps: [
              {
                title: "New Rice Varieties",
                description:
                  "PhilRice scientists cross rice plants to combine traits like high yield and flood tolerance, so farmers can still harvest after typhoons.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Stronger Carabaos",
                description:
                  "The Philippine Carabao Center breeds native carabaos with dairy buffaloes so the offspring give more milk for farming families.",
                icon: "🐃",
                color: "border-l-secondary-500",
              },
              {
                title: "Protecting Pollinators",
                description:
                  "Bees, butterflies and birds carry pollen for many fruit and vegetable crops. Protecting them protects our food supply.",
                icon: "🐝",
                color: "border-l-accent-500",
              },
              {
                title: "Saving Endangered Species",
                description:
                  "Conservation breeding of animals like the Philippine eagle pairs individuals carefully to keep the population varied and healthy.",
                icon: "🦅",
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
        "Identify the trophic levels in a food chain and food web, explain how energy passes from one organism to the next when one eats another, and build your own food chain and food web.",
      readTime: "~17 min read",
      xp: 50,
      heroImage: foodchain,
      heroImageAlt:
        "Philippine rice field with a frog sitting among green rice plants",

      signature: {
        widgetId: "energy-flow",
        heading: "Watch It: Turn an Arrow Round",
        intro:
          "Arrows carry the energy. Reverse one and everything behind it starves.",
        instruction: "Feed the chain, break it, then build the web.",
        xp: 25,
        explainer: {
          title: "What the arrows were carrying",
          points: [
            "Reversing one arrow starved everything behind it, because the energy had no way through.",
            "The arrows point from the eaten to the eater, which is the direction energy travels.",
            "Removing the frog broke the chain, and the snake and hawk got nothing.",
            "In the web the hawk had a second route through the rabbit, so it kept eating.",
          ],
        },
      },

      sections: [
        "Overview",
        "Roles in an Ecosystem",
        "Trophic Levels",
        "How Energy Moves Through Feeding",
        "Food Chain vs. Food Web",
        "Build Your Own Food Chain and Food Web",
        "Think About It",
      ],

      references: [
        {
          label: "National Geographic Education — Food Web",
          url: "https://education.nationalgeographic.org/resource/food-web/",
        },
        {
          label: "National Geographic Education — Food Chain",
          url: "https://education.nationalgeographic.org/resource/food-chain/",
        },
        {
          label: "Khan Academy — Food chains and food webs",
          url: "https://www.khanacademy.org/science/biology/ecology/intro-to-ecosystems/a/food-chains-food-webs",
        },
        {
          label: "PhilRice — Golden apple snail management",
          url: "https://www.philrice.gov.ph/",
        },
        {
          label: "Tubbataha Reefs Natural Park",
          url: "https://tubbatahareef.org/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Every living thing needs <strong class='text-primary-700'>energy</strong> to move, grow and stay alive. In almost every ecosystem, that energy starts as <strong class='text-primary-700'>sunlight</strong>. Plants capture it by photosynthesis and store it in their bodies as food.",
              "Animals get energy by eating. A <strong class='text-primary-700'>food chain</strong> shows who eats whom in a single line. In a rice field: Rice → Rice bug → Frog → Snake → Hawk. Each arrow means “gives energy to,” so it points from the one being eaten to the one doing the eating.",
              "Most animals eat more than one kind of food, and many are eaten by more than one kind of animal. When we connect all the food chains in one place, we get a <strong class='text-primary-700'>food web</strong>. In this lesson you will identify each organism's <strong class='text-primary-700'>trophic level</strong> (its feeding level) and build your own chain and web with care and <strong class='text-primary-700'>excellence</strong>.",
            ],
            didYouKnow:
              "Tubbataha Reefs Natural Park in the Sulu Sea is a UNESCO World Heritage Site. Its food web runs from tiny plankton to sharks and sea turtles, and it is home to hundreds of kinds of fish.",
          },
        },

        {
          type: "imageCards",
          heading: "Roles in an Ecosystem",
          data: {
            cards: [
              {
                title: "Producers",
                label: "Make their own food",
                variant: "primary",
                color: "primary",
                desc: "Plants, algae and phytoplankton use sunlight to make food by photosynthesis. Every food chain starts with a producer.",
                image: globe,
                imageAlt:
                  "Green rice plants and mangrove trees growing in sunlight",
                examples: [
                  "Rice, grass and kangkong on land",
                  "Mangrove trees along the coast",
                  "Algae and phytoplankton in the sea",
                ],
              },
              {
                title: "Herbivores",
                label: "Primary consumers",
                variant: "secondary",
                color: "secondary",
                desc: "Animals that eat only plants. They get energy that the producers stored.",
                image: lab,
                imageAlt: "Grasshopper eating a green rice leaf",
                examples: [
                  "Rice bug (atangya) and grasshopper",
                  "Golden apple snail (kuhol) eating rice seedlings",
                  "Carabao and goat eating grass",
                ],
              },
              {
                title: "Carnivores and Omnivores",
                label: "Secondary and tertiary consumers",
                variant: "primary",
                color: "primary",
                desc: "Carnivores eat other animals. Omnivores eat both plants and animals.",
                image: foodchain,
                imageAlt: "Frog catching an insect with its tongue",
                examples: [
                  "Carnivores: frog, snake, hawk, shark",
                  "Omnivores: humans, chickens, rats",
                  "Top predators are at the end of the chain",
                ],
              },
              {
                title: "Decomposers",
                label: "Recyclers",
                variant: "secondary",
                color: "secondary",
                desc: "Bacteria, fungi and earthworms break down dead plants, dead animals and waste. They return nutrients to the soil and water.",
                image: simulation,
                imageAlt:
                  "Mushrooms growing on a fallen log in a forest",
                examples: [
                  "Mushrooms on rotting wood",
                  "Bacteria in a compost pit",
                  "Earthworms in garden soil",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Trophic Levels",
          data: {
            intro:
              "A trophic level is an organism's feeding position in a food chain. Count from the producer upward. Here is the rice field chain: Rice → Rice bug → Frog → Snake → Hawk.",
            steps: [
              {
                num: 1,
                title: "1st Level: Producers",
                color: "primary",
                description:
                  "The rice plant captures energy from sunlight and stores it in its leaves and grains.",
                tip: "Producers are always the first trophic level.",
              },
              {
                num: 2,
                title: "2nd Level: Primary Consumers",
                color: "secondary",
                description:
                  "The rice bug sucks the sap and milky grains of the rice plant. Herbivores are always primary consumers.",
                tip: "“Primary” means first: the first consumer in the chain.",
              },
              {
                num: 3,
                title: "3rd Level: Secondary Consumers",
                color: "accent",
                description:
                  "The frog eats the rice bug. Animals that eat herbivores are secondary consumers.",
                tip: "Frogs help farmers by eating insect pests.",
              },
              {
                num: 4,
                title: "4th Level: Tertiary Consumers",
                color: "primary",
                description:
                  "The snake eats the frog. Animals that eat secondary consumers are tertiary consumers.",
                tip: "An omnivore can sit at more than one level, depending on what it eats.",
              },
              {
                num: 5,
                title: "5th Level: Top Predator",
                color: "secondary",
                description:
                  "The hawk eats the snake. Nothing in this chain eats the hawk, so it is the top predator.",
                tip: "Most food chains have only 4 or 5 levels, because less energy is left at each step.",
              },
              {
                num: 6,
                title: "Decomposers at Every Level",
                color: "accent",
                description:
                  "When any of these organisms dies, decomposers break down its body and return nutrients to the soil, where the rice plants can use them again.",
                tip: "Decomposers are not counted as one trophic level; they feed on every level.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "How Energy Moves Through Feeding",
          data: {
            intro:
              "Energy moves from one organism to another only when one eats the other. Here is what happens to that energy.",
            reasons: [
              {
                num: 1,
                title: "Energy Is Stored in Food",
                color: "primary",
                desc: "Sunlight becomes chemical energy",
                content:
                  "The rice plant turns sunlight into food (sugar) and stores it in its body. That stored food is the energy the next organism will get.",
              },
              {
                num: 2,
                title: "Eating Passes Energy On",
                color: "secondary",
                desc: "Arrows point from the eaten to the eater",
                content:
                  "When the rice bug feeds on the rice, some of the plant's stored energy moves into the rice bug. When the frog eats the rice bug, energy moves into the frog.",
              },
              {
                num: 3,
                title: "Most Energy Is Used or Lost",
                color: "accent",
                desc: "Only about 10% reaches the next level",
                content:
                  "Each organism uses most of its energy to move, breathe and keep warm, and some leaves its body as heat and waste. Only about 10% gets stored in its body and passes to the next level.",
              },
              {
                num: 4,
                title: "Energy Flows One Way",
                color: "primary",
                desc: "From the sun, through the chain, out as heat",
                content:
                  "Energy does not go back to the sun or to the plants. That is why every ecosystem needs a steady supply of sunlight. Nutrients are different: decomposers recycle them again and again.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Food Chain vs. Food Web",
          data: {
            intro:
              "Both show how energy moves. A food chain shows one path. A food web shows many paths together.",
            left: {
              label: "Food Chain",
              color: "primary",
              items: [
                "One straight line of organisms",
                "Shows only one feeding path",
                "Example: Rice → Rice bug → Frog → Snake → Hawk",
                "Easy to draw and read",
                "If one organism disappears, everything after it loses its food",
              ],
            },
            right: {
              label: "Food Web",
              color: "secondary",
              items: [
                "Many food chains connected together",
                "Shows many feeding paths in one ecosystem",
                "Example: the snake also eats rats; the hawk also eats rats and chicks",
                "Closer to real life",
                "If one organism disappears, others can switch food, so the ecosystem is more stable",
              ],
            },
          },
        },

        {
          type: "timeline",
          heading: "Build Your Own Food Chain and Food Web",
          data: {
            intro:
              "Construct a food chain and a food web for a Philippine ecosystem. Work neatly and check each arrow; excellence is in the details.",
            steps: [
              {
                num: 1,
                title: "Choose an Ecosystem",
                color: "primary",
                description:
                  "Pick a place you know, such as a rice field, a mangrove forest, a coral reef or your school garden.",
                tip: "A rice field is a good start: rice, grass, rice bug, grasshopper, golden apple snail, rat, frog, duck, snake, hawk.",
              },
              {
                num: 2,
                title: "List the Organisms and Their Food",
                color: "secondary",
                description:
                  "Write each organism and what it eats. Mark each one as a producer, herbivore, carnivore, omnivore or decomposer.",
                tip: "Use real feeding relationships. A frog eats insects, not rice.",
              },
              {
                num: 3,
                title: "Draw One Food Chain",
                color: "accent",
                description:
                  "Start with a producer on the left. Add a primary consumer, then a secondary consumer, and so on. Draw arrows from the food to the eater.",
                tip: "Read your arrows aloud: “Rice gives energy to the rice bug.” If it sounds wrong, the arrow is backwards.",
              },
              {
                num: 4,
                title: "Label the Trophic Levels",
                color: "primary",
                description:
                  "Under each organism, write its trophic level: producer, primary consumer, secondary consumer, tertiary consumer.",
                tip: "Count from the producer. The producer is always level 1.",
              },
              {
                num: 5,
                title: "Connect Chains into a Web",
                color: "secondary",
                description:
                  "Add the other organisms and draw every feeding arrow. For example, add Grass → Grasshopper → Frog and Rice → Rat → Snake, linking them to your first chain.",
                tip: "Some arrows will cross. That is normal for a food web.",
              },
              {
                num: 6,
                title: "Add Decomposers and Check",
                color: "accent",
                description:
                  "Place decomposers to the side with arrows from several organisms. Then check that every arrow points toward the eater and every organism has a label.",
                tip: "Swap with a classmate and check each other's arrows.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Think About It",
          isSubsection: true,
          data: {
            intro:
              "Use what you know about food chains and food webs. Then check the model answer.",
            scenarios: [
              {
                title: "The Reversed Arrow",
                situation:
                  "A student draws Rice ← Rice bug ← Frog and says, “The frog eats the rice bug, and the rice bug eats the rice.”",
                question:
                  "The feeding relationships are right, but the diagram is wrong. Why?",
                skill:
                  "The arrows point the wrong way. Arrows show the direction energy flows, from the eaten to the eater. It should be Rice → Rice bug → Frog.",
              },
              {
                title: "Frogs Disappear",
                situation:
                  "Heavy pesticide use kills most of the frogs in a rice field.",
                question:
                  "What may happen to the rice bugs and to the snakes?",
                skill:
                  "With fewer frogs to eat them, rice bugs can increase and damage more rice. Snakes lose part of their food and may decrease, or they may eat more rats instead. One change affects many organisms in the web.",
              },
              {
                title: "Ducks and Golden Apple Snails",
                situation:
                  "Golden apple snails (kuhol) eat young rice plants. Some farmers let ducks into their fields after planting to eat the snails.",
                question:
                  "What are the trophic levels of the rice, the snail and the duck in this chain?",
                skill:
                  "Rice → Golden apple snail → Duck. The rice is the producer (1st level), the snail is the primary consumer (2nd level), and the duck is the secondary consumer (3rd level).",
              },
              {
                title: "Wolves Return to Yellowstone",
                situation:
                  "Wolves were removed from Yellowstone National Park in the United States. Elk, which eat young trees, increased, and riverbank trees almost disappeared. Wolves were brought back in 1995.",
                question:
                  "What does this show about food webs?",
                skill:
                  "Removing one top predator changed the whole web: more elk meant fewer young trees along the rivers. After the wolves returned, elk numbers dropped and the trees began to grow back. This chain reaction is called a trophic cascade.",
              },
            ],
          },
        },
      ],
    },
  ],
};
