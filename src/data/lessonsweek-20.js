// Week 20: Energy Flow and Biological Organization — Grade 7 Science

import web from "../assets/web.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week20 = {
  id: "week-20",
  weekNumber: 20,
  title: "Energy Flow and Biological Organization",
  category: "Ecology",
  description:
    "Learn how energy flows through ecosystems using energy pyramids, and understand how life is organized from cells to the biosphere.",
  icon: "Zap",
  color: "accent",
  xpReward: 225,
  isLocked: false,
  lessons: [
    {
      id: "lesson-58",
      weekId: "week-20",
      lessonNumber: 58,
      title: "Energy Pyramid",
      badge: "Lesson 1",
      subtitle:
        "Understanding how energy decreases at each level of a food chain",
      readTime: "~12 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Simulation diagram of an ecological energy pyramid showing trophic levels",
      sections: [
        "What Is an Energy Pyramid?",
        "Types of Ecological Pyramids",
        "Key Ideas About Energy Flow",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "What Is an Energy Pyramid?",
          data: {
            paragraphs: [
              "An <strong class='text-primary-700'>energy pyramid</strong> is a diagram that shows the amount of energy available at each trophic level in an ecosystem. It is shaped like a pyramid because the amount of energy decreases as you move from producers at the base to top predators at the peak. This happens because only about <strong class='text-primary-700'>10% of energy</strong> is transferred from one trophic level to the next.",
              "The other 90% of energy is lost as <strong class='text-primary-700'>heat</strong> during metabolism — organisms use energy to move, breathe, maintain body temperature, and carry out all life functions. This energy is not available to the next level. This is why producers must produce enormous amounts of energy to support even a small number of top predators.",
              "This is also why there are always more producers than herbivores, and more herbivores than carnivores in any ecosystem. The pyramid shape reflects this decrease — wide at the base (many producers with lots of energy) and narrow at the top (few top predators with very little energy available).",
            ],
            didYouKnow:
              "It takes about 10,000 kilograms of grass to support 1,000 kilograms of grasshoppers, which supports 100 kilograms of frogs, which supports 10 kilograms of snakes, which supports just 1 kilogram of eagle — the 10% rule in action!",
          },
        },
        {
          type: "imageCards",
          heading: "Types of Ecological Pyramids",
          data: {
            cards: [
              {
                title: "Energy Pyramid",
                label: "Energy",
                variant: "primary",
                color: "primary",
                desc: "Shows the amount of energy (in kilocalories) available at each trophic level. Always pyramid-shaped — energy always decreases upward.",
                image: simulation,
                imageAlt:
                  "Simulation diagram of an energy pyramid with kilocalorie values at each level",
                examples: [
                  "Producers at base: most energy (e.g., 10,000 kcal)",
                  "Primary consumers: 1,000 kcal (10%)",
                  "Secondary consumers: 100 kcal (1%)",
                  "Tertiary consumers: 10 kcal (0.1%)",
                ],
              },
              {
                title: "Pyramid of Numbers",
                label: "Numbers",
                variant: "secondary",
                color: "secondary",
                desc: "Shows the count of organisms at each trophic level. Usually pyramid-shaped, but can be inverted if one large producer supports many small consumers.",
                image: equation,
                imageAlt:
                  "Equation diagram showing organism counts per trophic level in a numbers pyramid",
                examples: [
                  "Millions of grass plants at base",
                  "Thousands of grasshoppers",
                  "Hundreds of frogs",
                  "Dozens of snakes",
                  "One or two eagles at the top",
                ],
              },
              {
                title: "Pyramid of Biomass",
                label: "Biomass",
                variant: "primary",
                color: "primary",
                desc: "Shows the total mass (weight) of living organisms at each trophic level. Usually pyramid-shaped but can be inverted in some aquatic ecosystems.",
                image: flowchart,
                imageAlt:
                  "Flowchart diagram showing biomass decreasing at each trophic level",
                examples: [
                  "Biomass = total mass of all organisms at that level",
                  "Usually decreases going up the pyramid",
                  "Measured in grams or kilograms per area",
                  "Can be inverted in oceans (fast-reproducing phytoplankton)",
                ],
              },
            ],
          },
        },
        {
          type: "conceptList",
          heading: "Key Ideas About Energy Flow",
          data: {
            concepts: [
              "Only about 10% of the energy at one trophic level is transferred to the next — 90% is lost as heat (the 10% rule or law of ecological efficiency).",
              "Energy pyramids are always widest at the base (producers) and narrowest at the top (top predators) because energy decreases at every level.",
              "Top predators are always rarer than their prey because there is very little energy available to support them at the top of the pyramid.",
              "Producers must capture enormous amounts of solar energy through photosynthesis to supply enough energy for all the consumers above them.",
              "Shorter food chains are more energy-efficient — fewer trophic levels means less energy is lost, making more energy available.",
              "Humans can increase the energy efficiency of their food by eating more producers (plants) directly rather than eating animals that ate plants.",
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
                  "Scientists use energy pyramid data to calculate sustainable fish harvests. Removing too many fish from any trophic level can collapse the energy flow and destroy the entire fishery.",
                icon: "🐟",
                color: "border-l-primary-500",
              },
              {
                title: "Sustainable Agriculture",
                description:
                  "Producing 1 kg of beef requires about 8 kg of grain — the 10% rule shows why plant-based diets require less farmland, water, and energy, making them more environmentally sustainable.",
                icon: "🌾",
                color: "border-l-secondary-500",
              },
              {
                title: "Conservation",
                description:
                  "Energy pyramid analysis reveals why large predators (wolves, sharks, eagles) need vast territories — they require enormous amounts of prey (and therefore enormous areas of habitat) to get enough energy.",
                icon: "🌿",
                color: "border-l-accent-500",
              },
              {
                title: "Food Security Planning",
                description:
                  "Government planners use energy pyramid principles to make decisions about land use — allocating land for crops (more efficient) vs. livestock (less efficient) to feed growing human populations sustainably.",
                icon: "🏛️",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-59",
      weekId: "week-20",
      lessonNumber: 59,
      title: "Levels of Biological Organization",
      badge: "Lesson 2",
      subtitle:
        "From a single cell to the entire biosphere — life organized at every scale",
      readTime: "~14 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt:
        "Flowchart showing the levels of biological organization from cell to biosphere",
      sections: [
        "Life at Every Scale",
        "The Nine Levels",
        "Why Organization Matters",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "Life at Every Scale",
          data: {
            paragraphs: [
              "Life on Earth is organized into levels, from the tiniest building block — the <strong class='text-primary-700'>cell</strong> — to the entire living world — the <strong class='text-primary-700'>biosphere</strong>. Each level of organization is more complex than the one below it and contains all the levels beneath it. Understanding these levels helps scientists study life at the right scale for each question.",
              "At the small scale, cells group together to form <strong class='text-primary-700'>tissues</strong>, tissues form <strong class='text-primary-700'>organs</strong>, and organs form <strong class='text-primary-700'>organ systems</strong>. These systems work together in a complete <strong class='text-primary-700'>organism</strong>. At larger scales, organisms group into <strong class='text-primary-700'>populations</strong>, populations form <strong class='text-primary-700'>communities</strong>, communities plus their non-living environment form <strong class='text-primary-700'>ecosystems</strong>, and all ecosystems together make up the <strong class='text-primary-700'>biosphere</strong>.",
              "Each level has properties that the levels below it do not have — a single cell cannot walk or think, but billions of cells working together as an organism can. Scientists who study life choose the appropriate level of organization for their work — from doctors treating individual organ systems to ecologists managing entire ecosystems.",
            ],
            didYouKnow:
              "The human body contains approximately 37 trillion cells — all working together, organized into about 200 different cell types, forming tissues, organs, and 11 major organ systems!",
          },
        },
        {
          type: "timeline",
          heading: "The Nine Levels",
          data: {
            intro:
              "Follow the hierarchy of biological organization from the smallest unit of life to the entire living world.",
            steps: [
              {
                num: 1,
                title: "Cell — The Basic Unit of Life",
                color: "primary",
                description:
                  "The cell is the smallest unit that can carry out all life processes (obtaining energy, responding to environment, reproducing). Example: a single muscle cell, nerve cell, or red blood cell.",
                tip: "All living things are made of cells — some organisms are just one cell (bacteria), others have trillions (humans).",
              },
              {
                num: 2,
                title: "Tissue — Groups of Similar Cells",
                color: "secondary",
                description:
                  "A tissue is a group of similar cells that work together to perform a specific function. Example: muscle tissue (cells that contract), nerve tissue (cells that conduct signals), epithelial tissue (skin cells that protect).",
                tip: "Plants also have tissues — leaf tissue captures sunlight; root tissue absorbs water and minerals.",
              },
              {
                num: 3,
                title: "Organ — Groups of Tissues",
                color: "accent",
                description:
                  "An organ is made of multiple tissue types working together to perform a complex function. Example: the heart (made of muscle tissue, nerve tissue, and epithelial tissue) pumps blood throughout the body.",
                tip: "Other organs: lungs (gas exchange), kidneys (filter blood), stomach (digestion), brain (control and coordination).",
              },
              {
                num: 4,
                title: "Organ System — Groups of Organs",
                color: "primary",
                description:
                  "An organ system is a group of organs that together perform a major body function. Example: the circulatory system (heart, blood vessels, blood) transports oxygen and nutrients throughout the body.",
                tip: "Humans have 11 organ systems: circulatory, respiratory, digestive, nervous, endocrine, excretory, skeletal, muscular, reproductive, immune, and integumentary.",
              },
              {
                num: 5,
                title: "Organism — A Complete Living Thing",
                color: "secondary",
                description:
                  "An organism is a complete living thing made of all its organ systems working together. Example: a human being, a dog, a maple tree, a bacterium. Organisms carry out all life processes.",
                tip: "An organism can be unicellular (one cell, like bacteria) or multicellular (many cells, like plants and animals).",
              },
              {
                num: 6,
                title: "Population — Same Species in an Area",
                color: "accent",
                description:
                  "A population is all the individuals of the same species living in the same area at the same time. Example: all the white-tailed deer in a forest, or all the catfish in a lake.",
                tip: "Populations can grow, shrink, and change over time as births, deaths, immigration, and emigration occur.",
              },
              {
                num: 7,
                title: "Community — All Populations Together",
                color: "primary",
                description:
                  "A community includes all the populations of different species living and interacting in the same area. Example: all the deer, wolves, birds, trees, grasses, and insects in a forest — all species present, not just one.",
                tip: "Communities include all living things in an area — producers, consumers, and decomposers all interacting.",
              },
              {
                num: 8,
                title: "Ecosystem — Community + Non-Living Environment",
                color: "secondary",
                description:
                  "An ecosystem includes all the living organisms (community) AND the non-living factors (sunlight, water, soil, temperature, air) in an area. Example: a coral reef ecosystem includes fish, coral, algae, AND the ocean water, temperature, and currents.",
                tip: "The non-living factors in an ecosystem are called abiotic factors; the living factors are biotic factors.",
              },
              {
                num: 9,
                title: "Biosphere — All Life on Earth",
                color: "accent",
                description:
                  "The biosphere is the largest level — it includes ALL ecosystems on Earth, from the deepest ocean trenches to the highest mountain peaks, anywhere on Earth where life exists.",
                tip: "The biosphere extends roughly 8 km into the atmosphere and 11 km below the ocean surface — anywhere life has been found.",
              },
            ],
          },
        },
        {
          type: "reasonCards",
          heading: "Why Organization Matters",
          data: {
            intro:
              "Understanding the levels of biological organization helps scientists and professionals in many practical fields.",
            reasons: [
              {
                num: 1,
                title: "Medicine Targets the Right Level",
                color: "primary",
                desc: "Treating organs and organ systems saves lives",
                content:
                  "Doctors diagnose and treat problems at the organ and organ system level — a cardiologist treats the heart (organ), a neurologist treats the nervous system. Understanding organization helps target the right level of treatment.",
              },
              {
                num: 2,
                title: "Ecology Manages Ecosystems",
                color: "secondary",
                desc: "Protecting ecosystems protects all life within them",
                content:
                  "Ecologists study at the population, community, and ecosystem level. Managing a fishery means managing fish populations within the context of their community and ecosystem — not just counting individual fish.",
              },
              {
                num: 3,
                title: "Conservation Protects Species",
                color: "accent",
                desc: "Saving populations saves species",
                content:
                  "Conservation biologists focus on populations and communities. To save an endangered species, they must protect the population (enough individuals to reproduce) and the community and ecosystem they depend on.",
              },
              {
                num: 4,
                title: "Agriculture Manages Populations",
                color: "primary",
                desc: "Crop and livestock management uses population principles",
                content:
                  "Farmers manage populations of crops and livestock — understanding how populations grow and interact within their community (including pests and pollinators) is essential for sustainable food production.",
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
                title: "Medicine and Healthcare",
                description:
                  "Doctors work at the cell, tissue, organ, and organ system levels. Cancer treatment targets abnormal cells; surgery repairs organs; rehabilitation restores organ system function.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Ecology and Environmental Science",
                description:
                  "Environmental scientists work at the population, community, and ecosystem levels — studying how pollution, climate change, and habitat loss affect entire ecological communities.",
                icon: "🌿",
                color: "border-l-secondary-500",
              },
              {
                title: "Conservation Biology",
                description:
                  "Conservation biologists use population dynamics to assess whether a species has enough individuals to survive. They also protect the community and ecosystem each endangered species depends on.",
                icon: "🦅",
                color: "border-l-accent-500",
              },
              {
                title: "Environmental Science and Policy",
                description:
                  "Governments use the concept of the biosphere when setting global environmental policies — decisions about climate change, deforestation, and ocean conservation affect the entire biosphere.",
                icon: "🌍",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
    {
      id: "lesson-60",
      weekId: "week-20",
      lessonNumber: 60,
      title: "Ecosystem Interactions",
      badge: "Lesson 3",
      subtitle: "How species interact with each other in ecosystems",
      readTime: "~13 min read",
      xp: 50,
      heroImage: web,
      heroImageAlt:
        "Web diagram showing different types of species interactions in ecosystems",
      sections: [
        "How Species Interact",
        "Key Terms",
        "Mutualism vs. Parasitism",
        "Real-World Applications",
      ],
      layout: [
        {
          type: "intro",
          heading: "How Species Interact",
          data: {
            paragraphs: [
              "Organisms in an ecosystem do not live in isolation — they constantly interact with each other. These interactions shape populations, communities, and entire ecosystems. The close, long-term interactions between two different species are called <strong class='text-primary-700'>symbiosis</strong>.",
              "Symbiosis comes in three forms based on how each partner is affected. In <strong class='text-primary-700'>mutualism</strong> (+/+), both species benefit — bees get nectar from flowers while pollinating them. In <strong class='text-primary-700'>commensalism</strong> (+/0), one species benefits while the other is unaffected — barnacles attach to whales, gaining transport to food-rich areas, while the whale is unharmed. In <strong class='text-primary-700'>parasitism</strong> (+/-), one species (the parasite) benefits at the expense of the other (the host) — tapeworms live in the intestines of animals, absorbing nutrients while weakening the host.",
              "Beyond symbiosis, species also interact through <strong class='text-primary-700'>competition</strong> (both species harmed as they compete for the same limited resource like food, water, or territory) and <strong class='text-primary-700'>predation</strong> (predator benefits, prey is harmed). All of these interactions drive evolution and shape the structure of ecological communities.",
            ],
            didYouKnow:
              "The clownfish and sea anemone are a perfect example of mutualism — the anemone's stinging tentacles protect the clownfish from predators, while the clownfish cleans the anemone and chases away fish that would eat it!",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Symbiosis",
                desc: "A close, long-term interaction between two different species. Includes mutualism, commensalism, and parasitism.",
              },
              {
                term: "Mutualism",
                desc: "A symbiotic relationship where BOTH species benefit (+/+). Example: bees and flowers — bees get nectar; flowers get pollinated.",
              },
              {
                term: "Commensalism",
                desc: "A symbiotic relationship where one species benefits and the other is unaffected (+/0). Example: barnacles on a whale — barnacles get transport; whale is unharmed.",
              },
              {
                term: "Parasitism",
                desc: "A symbiotic relationship where one species (the parasite) benefits at the expense of the other (the host) (+/-). Example: tapeworm in a dog's intestine.",
              },
              {
                term: "Predation",
                desc: "An interaction where one organism (the predator) kills and eats another (the prey). The predator benefits; the prey is harmed. Example: a hawk eating a mouse.",
              },
              {
                term: "Competition",
                desc: "An interaction where two species or individuals compete for the same limited resource (food, water, territory, mates). Both are negatively affected (-/-).",
              },
              {
                term: "Host",
                desc: "The organism that a parasite lives on or in, from which the parasite obtains nutrients, usually at the host's expense.",
              },
              {
                term: "Parasite",
                desc: "An organism that benefits by living on or inside a host organism and obtaining nutrients from it, often harming the host.",
              },
            ],
          },
        },
        {
          type: "comparison",
          heading: "Mutualism vs. Parasitism",
          data: {
            intro:
              "Mutualism and parasitism are both long-term relationships between species, but they have very different outcomes for each partner.",
            left: {
              label: "Mutualism",
              color: "primary",
              items: [
                "Species 1: BENEFITS (+)",
                "Species 2: BENEFITS (+)",
                "Long-term: both species thrive together",
                "Example: clownfish and anemone; bees and flowers",
                "Evolutionary pressure: both evolve to help each other",
              ],
            },
            right: {
              label: "Parasitism",
              color: "secondary",
              items: [
                "Species 1 (parasite): BENEFITS (+)",
                "Species 2 (host): HARMED (-)",
                "Long-term: host weakened; parasite depends on host survival",
                "Example: tapeworm in intestines; fleas on a dog",
                "Evolutionary pressure: host evolves defenses; parasite evolves to evade them",
              ],
            },
          },
        },
        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Medicine: Treating Parasitic Infections",
                description:
                  "Understanding parasitism helps doctors diagnose and treat infections like malaria (Plasmodium parasite in red blood cells), tapeworms, and lice — all parasitic relationships that harm human hosts.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Agriculture: Biological Pest Control",
                description:
                  "Farmers use mutualistic relationships (bees for pollination) and predator-prey relationships (ladybugs eating aphids) as natural, sustainable alternatives to chemical pesticides.",
                icon: "🌾",
                color: "border-l-secondary-500",
              },
              {
                title: "Conservation: Protecting Mutualistic Relationships",
                description:
                  "Protecting pollinators (bees, butterflies) is critical because they have mutualistic relationships with flowering plants. Loss of pollinators would devastate food crops and wild plant populations.",
                icon: "🐝",
                color: "border-l-accent-500",
              },
              {
                title: "Ecosystem Restoration",
                description:
                  "When restoring damaged ecosystems, ecologists prioritize rebuilding mutualistic relationships (between plants and their pollinators or seed dispersers) because these interactions drive ecosystem recovery.",
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
