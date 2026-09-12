// Week 19: Energy Flow in the Circle of Life — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd term Week 19.
//   Lesson 1 — Energy Flow in the Circle of Life
//   Lesson 2 — 3rd Performance Task: 3D Ecosystem Diorama

import foodchain from "../assets/foodchain.png";
import globe from "../assets/week1/globe.jpg";
import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import classroom from "../assets/classroom.webp";

export const week19 = {
  id: "week-19",
  weekNumber: 19,
  title: "Energy Flow in the Circle of Life",
  category: "Ecology",
  description:
    "See why energy pyramids narrow toward the top, how nutrients cycle endlessly, and how species interact — then build a 3D ecosystem diorama.",
  icon: "Zap",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Energy Flow in the Circle of Life
    // ═══════════════════════════════════════════════════
    {
      id: "w19-l1",
      weekId: "week-19",
      lessonNumber: 1,
      title: "Energy Flow in the Circle of Life",
      badge: "Lesson 1",
      subtitle:
        "Energy flows one way and runs out; nutrients go round forever. Learn the energy pyramid, the nutrient cycle, and the relationships that hold an ecosystem together.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: foodchain,
      heroImageAlt:
        "Energy pyramid showing energy decreasing at each trophic level",

      signature: {
        widgetId: "ten-percent",
        heading: "Watch It: Where the Other 90% Goes",
        intro:
          "A thousand units enter the grass. Send them up and ninety per cent peel off sideways as heat while a tenth climbs, so the pyramid shape builds itself out of the losses. Beside it, one carbon atom takes the other road — dead snake, decomposer, soil, grass, and round again.",
        instruction: "Trace energy to the top, then follow one atom round",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "Types of Ecological Pyramids",
        "Energy Flows, Nutrients Cycle",
        "How Species Interact",
        "Mutualism vs. Parasitism",
        "Key Ideas",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Ecology and Energy Flow",
          url: "https://www.khanacademy.org/science/biology/ecology",
        },
        {
          label: "National Geographic — Energy Pyramid",
          url: "https://education.nationalgeographic.org/resource/food-chain/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Last lesson you followed energy along a food chain and met the 10% rule. An <strong class='text-primary-700'>energy pyramid</strong> turns that rule into a picture: it shows how much energy is available at each trophic level, and it is always widest at the base and narrowest at the top.",
              "The other 90% is lost as <strong class='text-primary-700'>heat</strong> — organisms spend it moving, breathing, and staying alive. That energy is gone from the ecosystem for good. This is the crucial difference in ecology: <strong class='text-primary-700'>energy flows one way and runs out; nutrients cycle round and are used again</strong>.",
              "Holding the whole system together are the relationships between species — predation, competition, and the three forms of <strong class='text-primary-700'>symbiosis</strong>. The 'circle of life' is really these two things at once: a one-way river of energy and an endless loop of matter.",
            ],
            didYouKnow:
              "It takes roughly 10,000 kg of grass to support 1,000 kg of grasshoppers, which supports 100 kg of frogs, which supports 10 kg of snakes, which supports just 1 kg of eagle.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Energy Pyramid",
                desc: "A diagram showing the energy available at each trophic level, always widest at the base and narrowest at the top.",
              },
              {
                term: "Biomass",
                desc: "The total mass of living organisms at a trophic level, usually measured in grams or kilograms per unit area.",
              },
              {
                term: "Pyramid of Numbers",
                desc: "A diagram showing the COUNT of organisms at each trophic level. It can be inverted when one large producer supports many small consumers.",
              },
              {
                term: "Nutrient Cycle",
                desc: "The repeated movement of nutrients such as carbon and nitrogen between living things and the environment.",
              },
              {
                term: "Symbiosis",
                desc: "A close, long-term interaction between two different species. It includes mutualism, commensalism, and parasitism.",
              },
              {
                term: "Mutualism",
                desc: "A relationship where BOTH species benefit (+/+) — bees get nectar while flowers get pollinated.",
              },
              {
                term: "Commensalism",
                desc: "A relationship where one benefits and the other is unaffected (+/0) — barnacles ride on a whale.",
              },
              {
                term: "Parasitism",
                desc: "A relationship where one benefits at the other's expense (+/−) — a tapeworm in an animal's intestine.",
              },
              {
                term: "Predation",
                desc: "One organism kills and eats another. The predator benefits, the prey is harmed.",
              },
              {
                term: "Competition",
                desc: "Two organisms compete for the same limited resource. Both are negatively affected (−/−).",
              },
              {
                term: "Host",
                desc: "The organism a parasite lives on or in, and takes nutrients from.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Types of Ecological Pyramids",
          data: {
            cards: [
              {
                title: "Pyramid of Energy",
                label: "Energy",
                variant: "primary",
                color: "primary",
                desc: "Shows the energy available at each level in kilocalories. It is ALWAYS pyramid-shaped, because energy can only decrease going up.",
                image: simulation,
                imageAlt:
                  "Energy pyramid with kilocalorie values at each trophic level",
                examples: [
                  "Producers at base: most energy, e.g. 10,000 kcal",
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
                desc: "Shows how many organisms occupy each level. Usually pyramid-shaped, but it CAN be inverted.",
                image: equation,
                imageAlt:
                  "Diagram showing organism counts at each trophic level",
                examples: [
                  "Millions of grass plants at the base",
                  "Thousands of grasshoppers, hundreds of frogs",
                  "One or two eagles at the top",
                  "Inverted case: one oak tree supports thousands of insects",
                ],
              },
              {
                title: "Pyramid of Biomass",
                label: "Biomass",
                variant: "primary",
                color: "primary",
                desc: "Shows the total mass of living material at each level. Usually a pyramid, but inverted in some ocean ecosystems.",
                image: globe,
                imageAlt: "Diagram showing biomass decreasing at each level",
                examples: [
                  "Total mass of all organisms at that level",
                  "Measured in grams or kilograms per area",
                  "Usually decreases going upward",
                  "Inverted in oceans, where fast-breeding phytoplankton are eaten as fast as they grow",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Energy Flows, Nutrients Cycle",
          data: {
            intro:
              "This is the single most important idea in ecology, and the one most often confused. Energy and matter behave completely differently in an ecosystem.",
            left: {
              label: "Energy — a One-Way Flow",
              color: "primary",
              items: [
                "Enters the ecosystem from the sun",
                "Captured by producers through photosynthesis",
                "Passes upward through trophic levels, losing 90% at each step",
                "Lost permanently as heat during metabolism",
                "Must be constantly resupplied by sunlight — it never returns",
              ],
            },
            right: {
              label: "Nutrients — an Endless Cycle",
              color: "secondary",
              items: [
                "Carbon, nitrogen, and minerals already exist on Earth",
                "Absorbed from soil and air by producers",
                "Passed along as organisms eat one another",
                "Released by decomposers when organisms die",
                "Returned to soil and water and used again — round and round",
              ],
            },
          },
        },

        {
          type: "reasonCards",
          heading: "How Species Interact",
          data: {
            intro:
              "Organisms do not live in isolation. Five kinds of interaction shape populations, and each one is defined by who benefits and who is harmed.",
            reasons: [
              {
                num: "+/+",
                title: "Mutualism",
                color: "primary",
                desc: "Both species benefit",
                content:
                  "The clownfish and sea anemone: the anemone's stinging tentacles protect the clownfish, while the clownfish cleans the anemone and chases off fish that would eat it.",
              },
              {
                num: "+/0",
                title: "Commensalism",
                color: "secondary",
                desc: "One benefits, the other is unaffected",
                content:
                  "Barnacles attach to a whale's skin and are carried to food-rich waters. The barnacles gain transport and feeding opportunities; the whale is neither helped nor harmed.",
              },
              {
                num: "+/−",
                title: "Parasitism",
                color: "accent",
                desc: "One benefits at the other's expense",
                content:
                  "A tapeworm lives in an animal's intestine absorbing nutrients. The parasite gains food and shelter while the host is weakened — but usually not killed, since the parasite needs it alive.",
              },
              {
                num: "+/−",
                title: "Predation",
                color: "primary",
                desc: "The predator benefits, the prey is killed",
                content:
                  "A hawk catches and eats a mouse. Unlike parasitism this is immediate and fatal, and it is the main force controlling prey population sizes.",
              },
              {
                num: "−/−",
                title: "Competition",
                color: "secondary",
                desc: "Both species are harmed",
                content:
                  "Two plant species growing side by side compete for the same light, water, and soil minerals. Both grow less well than either would alone.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Mutualism vs. Parasitism",
          data: {
            intro:
              "Both are long-term relationships between two species, but the outcome for the partner could not be more different.",
            left: {
              label: "Mutualism (+/+)",
              color: "primary",
              items: [
                "Species 1: BENEFITS",
                "Species 2: BENEFITS",
                "Long term: both species thrive together",
                "Examples: clownfish and anemone; bees and flowers",
                "Each evolves traits that help the other",
              ],
            },
            right: {
              label: "Parasitism (+/−)",
              color: "secondary",
              items: [
                "Species 1 (parasite): BENEFITS",
                "Species 2 (host): IS HARMED",
                "Long term: host weakened, but the parasite needs it alive",
                "Examples: tapeworm in intestines; fleas on a dog",
                "The host evolves defences; the parasite evolves ways around them",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Key Ideas",
          data: {
            concepts: [
              "Only about 10% of the energy at one trophic level reaches the next; roughly 90% is lost as heat.",
              "Energy pyramids are always widest at the base and narrowest at the top, because energy only decreases upward.",
              "Top predators are always rare, because so little energy reaches the top of the pyramid to support them.",
              "A pyramid of numbers or biomass can be inverted, but a pyramid of energy never can.",
              "Energy flows one way through an ecosystem and is lost; nutrients cycle and are reused indefinitely.",
              "Decomposers are what close the nutrient cycle — without them, nutrients would stay locked in dead matter.",
              "Symbiosis covers three relationships: mutualism (+/+), commensalism (+/0), and parasitism (+/−).",
              "Shorter food chains waste less energy, which is why eating plants directly is more efficient than eating animals that ate plants.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Sustainable Agriculture",
                description:
                  "Producing 1 kg of beef takes about 8 kg of grain. The 10% rule is why plant-based diets need less farmland, water, and energy.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
              {
                title: "Composting and Soil Health",
                description:
                  "Composting is the nutrient cycle put to work — decomposers turn kitchen waste back into the minerals plants need.",
                icon: "🪱",
                color: "border-l-secondary-500",
              },
              {
                title: "Protecting Pollinators",
                description:
                  "Bees and flowering plants are mutualists. Losing pollinators would devastate both wild plants and the crops that depend on them.",
                icon: "🐝",
                color: "border-l-accent-500",
              },
              {
                title: "Treating Parasitic Disease",
                description:
                  "Malaria, tapeworms, and lice are all parasitic relationships. Understanding how a parasite depends on its host guides the treatment.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — 3rd Performance Task: 3D Ecosystem Diorama
    // ═══════════════════════════════════════════════════
    {
      id: "w19-l2",
      weekId: "week-19",
      lessonNumber: 2,
      title: "3rd Performance Task: 3D Ecosystem Diorama",
      badge: "Performance Task",
      subtitle:
        "Build a three-dimensional model of a real ecosystem, complete with a labelled food web showing exactly how energy moves through it.",
      readTime: "~14 min read",
      xp: 100,
      heroImage: classroom,
      heroImageAlt:
        "Classroom display of student-built three-dimensional ecosystem models",

      sections: [
        "The Task",
        "Choosing Your Ecosystem",
        "What You Will Need",
        "Building Your Diorama",
        "How You Will Be Graded",
        "Tips for a Strong Diorama",
        "Why This Task Matters",
      ],

      references: [
        {
          label: "National Geographic — Ecosystems",
          url: "https://education.nationalgeographic.org/resource/ecosystem/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "The Task",
          data: {
            paragraphs: [
              "Your final performance task is to build a <strong class='text-primary-700'>3D ecosystem diorama</strong> — a three-dimensional model of a real ecosystem inside a box, showing the organisms that live there and how they are connected.",
              "This is not just a craft project. Your diorama must show at least <strong class='text-primary-700'>eight organisms</strong> covering producers, consumers at more than one trophic level, and decomposers. It must include both the <strong class='text-primary-700'>biotic</strong> (living) and <strong class='text-primary-700'>abiotic</strong> (non-living) parts of the ecosystem, and it must carry a labelled <strong class='text-primary-700'>food web</strong> with arrows pointing in the correct direction.",
              "This single model pulls together everything from the last two weeks: producers and consumers, trophic levels, the 10% rule, food webs, and species interactions.",
            ],
            didYouKnow:
              "Museum dioramas are built by teams of scientists and artists working together. The habitat backgrounds at natural history museums are painted from field sketches made at the actual location.",
          },
        },

        {
          type: "reasonCards",
          heading: "Choosing Your Ecosystem",
          data: {
            intro:
              "Pick one ecosystem and stick to it. Mixing organisms that would never meet in real life is the most common way to lose marks.",
            reasons: [
              {
                num: 1,
                title: "Forest Ecosystem",
                color: "primary",
                desc: "Trees, undergrowth, and layered habitats",
                content:
                  "Producers: trees, ferns, grasses. Consumers: deer, insects, birds, snakes, owls. Decomposers: mushrooms, earthworms, bacteria in the leaf litter.",
              },
              {
                num: 2,
                title: "Pond or Freshwater Ecosystem",
                color: "secondary",
                desc: "Easy to show layers from surface to bottom",
                content:
                  "Producers: algae, water lilies, pondweed. Consumers: tadpoles, small fish, frogs, herons, dragonflies. Decomposers: bacteria in the mud.",
              },
              {
                num: 3,
                title: "Coral Reef",
                color: "accent",
                desc: "Visually striking and full of interactions",
                content:
                  "Producers: algae and zooxanthellae. Consumers: parrotfish, clownfish, sea turtles, reef sharks. A clownfish and anemone also give you a clear mutualism to label.",
              },
              {
                num: 4,
                title: "Rice Field or Farm Ecosystem",
                color: "primary",
                desc: "A local ecosystem you can observe yourself",
                content:
                  "Producers: rice plants, weeds. Consumers: snails, frogs, rats, snakes, egrets. Decomposers: bacteria and fungi in the paddy mud. Easy to research from direct observation.",
              },
              {
                num: 5,
                title: "Mangrove or Coastal Ecosystem",
                color: "secondary",
                desc: "Shows a boundary between two habitats",
                content:
                  "Producers: mangrove trees, seagrass. Consumers: crabs, mudskippers, fish, wading birds. Decomposers: bacteria in the sediment.",
              },
            ],
          },
        },

        {
          type: "keyTerms",
          heading: "What You Will Need",
          data: {
            terms: [
              {
                term: "A box",
                desc: "A shoebox or similar, opened on one long side. This is your stage — everything is built inside it.",
              },
              {
                term: "Background materials",
                desc: "Paper or paint for the sky, water, or forest depth. Painting the background first makes everything else look finished.",
              },
              {
                term: "Modelling materials",
                desc: "Clay, cardboard, paper, cotton, twigs, sand, leaves. Natural materials collected outdoors look better than bought ones.",
              },
              {
                term: "At least eight organisms",
                desc: "Producers, primary consumers, secondary or tertiary consumers, and decomposers. Each must be modelled and labelled.",
              },
              {
                term: "Abiotic components",
                desc: "Water, soil, rocks, sunlight, air. These are part of the ecosystem and carry marks, so show them deliberately.",
              },
              {
                term: "Labels and arrows",
                desc: "Small flags or tags naming each organism and its role, plus a food web with arrows showing energy flow.",
              },
              {
                term: "A written information card",
                desc: "One page naming your ecosystem, listing each organism with its trophic level, and explaining one species interaction.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Building Your Diorama",
          data: {
            intro:
              "Research before you build. A diorama that looks good but contains organisms that never coexist will not score well.",
            steps: [
              {
                num: 1,
                title: "Research Your Ecosystem",
                color: "primary",
                description:
                  "Choose your ecosystem and research which organisms actually live there. List at least eight, and make sure you have producers, consumers from two or more levels, and decomposers.",
                tip: "Every organism must genuinely belong. A polar bear does not belong in a coral reef.",
              },
              {
                num: 2,
                title: "Draw Your Food Web First",
                color: "secondary",
                description:
                  "Before building anything, sketch the food web on paper. Draw arrows showing who eats whom, with each arrow pointing from the eaten toward the eater.",
                tip: "Doing this first means you find the gaps in your organism list before you have glued anything down.",
              },
              {
                num: 3,
                title: "Prepare the Box and Background",
                color: "accent",
                description:
                  "Paint or paper the inside of the box: sky and distant trees for a forest, water and light rays for a pond. Let it dry completely before adding anything.",
                tip: "Paint the background before adding models. Painting around finished models is very difficult.",
              },
              {
                num: 4,
                title: "Build the Abiotic Layer",
                color: "primary",
                description:
                  "Add the non-living parts first — soil, sand, rocks, water. These form the base everything else sits on, and they carry marks in their own right.",
                tip: "Use real soil, sand, or small stones where you can. They look far better than painted cardboard.",
              },
              {
                num: 5,
                title: "Add Your Organisms",
                color: "secondary",
                description:
                  "Model each organism from clay, paper, or natural materials and place it where it actually lives — birds in the canopy, worms in the soil, fish below the water line.",
                tip: "Placement carries meaning. An organism in the wrong layer suggests you do not know its habitat.",
              },
              {
                num: 6,
                title: "Label Everything and Add the Food Web",
                color: "accent",
                description:
                  "Attach a small label to each organism giving its name and role (producer, primary consumer, decomposer). Mount your food web inside the lid or on a card beside the box.",
                tip: "Check every arrow direction one final time. Reversed arrows are the most commonly lost marks on this task.",
              },
              {
                num: 7,
                title: "Write Your Information Card",
                color: "primary",
                description:
                  "Write one page naming the ecosystem, listing each organism with its trophic level, describing one species interaction you have included, and explaining what would happen if one organism were removed.",
                tip: "The removal question is where you show real understanding — describe the knock-on effects along the web.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "How You Will Be Graded",
          data: {
            intro:
              "This task is marked out of 100 points. Science content outweighs craftwork — a neat model with a wrong food web scores poorly.",
            left: {
              label: "Science Content — 60 points",
              color: "primary",
              items: [
                "At least eight organisms that genuinely coexist in the ecosystem (15 pts)",
                "Producers, consumers at two or more levels, and decomposers all present (15 pts)",
                "Food web arrows all point in the correct direction (15 pts)",
                "Biotic and abiotic components both shown and labelled (10 pts)",
                "Information card correctly explains one species interaction (5 pts)",
              ],
            },
            right: {
              label: "Construction and Presentation — 40 points",
              color: "secondary",
              items: [
                "Diorama is three-dimensional and uses the depth of the box (10 pts)",
                "Organisms are placed in their correct habitat layer (10 pts)",
                "All labels are present, readable, and accurate (10 pts)",
                "Neat, sturdy, creative, and submitted on time (10 pts)",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Tips for a Strong Diorama",
          data: {
            concepts: [
              "Use the depth of the box. A flat picture glued to the back wall is a poster, not a diorama — build foreground, middle, and background layers.",
              "Do not forget decomposers. They are the most commonly missed category, and they are worth marks: show mushrooms, worms, or a labelled patch of soil bacteria.",
              "Check every arrow twice. Arrows run from the organism being eaten toward the organism eating it.",
              "Include abiotic factors deliberately and label them — sunlight, water, soil, and air are part of the ecosystem.",
              "Natural materials beat bought ones. Real twigs, sand, leaves, and small stones look better and cost nothing.",
              "Keep the scale roughly sensible — an insect the same size as a deer confuses the model.",
              "Add one clear species interaction you can explain out loud, such as a clownfish and anemone for mutualism.",
              "Photograph your finished diorama before transporting it, in case anything is damaged on the way to school.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Why This Task Matters",
          data: {
            apps: [
              {
                title: "How Museums Teach Ecology",
                description:
                  "Natural history museums use dioramas for exactly this reason: a three-dimensional scene shows relationships between organisms that a diagram cannot.",
                icon: "🏛️",
                color: "border-l-primary-500",
              },
              {
                title: "Modelling in Science",
                description:
                  "This is the modelling idea from Week 1 again. Your diorama is a physical model — simplified, imperfect, and useful precisely because of that.",
                icon: "🔬",
                color: "border-l-secondary-500",
              },
              {
                title: "Conservation Planning",
                description:
                  "Ecologists map food webs exactly as you are doing to predict how removing one species would affect an entire habitat.",
                icon: "🌿",
                color: "border-l-accent-500",
              },
              {
                title: "Preparing for the Periodical Exam",
                description:
                  "The Second Periodical Examination covers Weeks 11–19, and this diorama reviews the ecology half of that material in one piece of work.",
                icon: "📝",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
