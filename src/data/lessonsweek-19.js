// Week 19: Energy Flow in the Circle of Life — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd Quarter Week 9 (site Week 19).
//   Lesson 1 — Energy Flow in the Circle of Life
//   Lesson 2 — 3rd Performance Task: 3D Ecosystem Diorama

import foodchain from "../assets/foodchain.png";
import globe from "../assets/week1/globe.jpg";
import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import classroom from "../assets/classroom.webp";
import lab from "../assets/lab.jpg";

export const week19 = {
  id: "week-19",
  weekNumber: 19,
  title: "Energy Flow in the Circle of Life",
  category: "Ecology",
  description:
    "Follow energy from the sun up the energy pyramid and see why it keeps balance in Philippine ecosystems, then build a 3D diorama of life's levels from cell to biosphere.",
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
        "Explain how energy flows through food chains, food webs and the energy pyramid, show how energy shrinks at every trophic level, and see why that flow keeps ecosystems balanced.",
      readTime: "~17 min read",
      xp: 50,
      heroImage: foodchain,
      heroImageAlt:
        "Energy pyramid diagram with producers at the wide base and a top predator at the narrow tip",

      signature: {
        widgetId: "ten-percent",
        heading: "Watch It: Energy Out, Atoms Round",
        intro:
          "Energy climbs once and leaks away. The same atoms keep circling.",
        instruction: "Send energy to the top, then follow one carbon atom.",
        xp: 25,
        explainer: {
          title: "Why the pyramid narrows",
          points: [
            "Each time you sent energy up, ninety percent drifted off as heat and only a tenth climbed.",
            "That is why every bar was thinner than the one below it, and why one unit reached the snakes.",
            "The heat is gone for good, so the sun has to keep refilling the bottom bar.",
            "Your carbon atom lost nothing at all. It went dead snake, decomposer, soil, new grass, and started over.",
          ],
        },
      },

      sections: [
        "Overview",
        "From the Sun to the Top Predator",
        "The Energy Pyramid",
        "Where Does the Lost Energy Go?",
        "Draw Your Own Energy Pyramid",
        "Energy Flows, Nutrients Cycle",
        "Why Energy Flow Keeps Ecosystems Balanced",
        "Think About It",
        "Living Wisely With Energy Flow",
      ],

      references: [
        {
          label: "National Geographic Education — Energy Pyramid",
          url: "https://education.nationalgeographic.org/resource/energy-pyramid/",
        },
        {
          label: "National Geographic Education — Food Web",
          url: "https://education.nationalgeographic.org/resource/food-web/",
        },
        {
          label: "Khan Academy — Energy flow and primary productivity",
          url: "https://www.khanacademy.org/science/biology/ecology/intro-to-ecosystems/a/energy-flow-primary-productivity",
        },
        {
          label: "Philippine Eagle Foundation",
          url: "https://www.philippineeaglefoundation.org/",
        },
        {
          label: "Tubbataha Reefs Natural Park",
          url: "https://tubbatahareef.org/",
        },
        {
          label: "Bureau of Fisheries and Aquatic Resources (BFAR)",
          url: "https://www.bfar.da.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Last lesson you built food chains and food webs, like Rice → Rice bug → Frog → Snake → Hawk. Each arrow carries <strong class='text-primary-700'>energy</strong> from the organism that is eaten to the one that eats it. Now you will see how much of that energy actually gets through.",
              "The answer: not much. At each step only about <strong class='text-primary-700'>10%</strong> of the energy passes to the next trophic level. The rest, about 90%, is used up for living and is lost as <strong class='text-primary-700'>heat</strong>. An <strong class='text-primary-700'>energy pyramid</strong> shows this as a picture: wide at the bottom, narrow at the top.",
              "The “circle of life” has two parts. Energy flows <strong class='text-primary-700'>one way</strong>, from the sun to producers to consumers, and leaves as heat. Matter, like carbon and nitrogen, goes <strong class='text-primary-700'>round and round</strong> with the help of decomposers. Understanding both helps us keep ecosystems balanced. Doing this lesson carefully, checking every number and every arrow, is how you show <strong class='text-primary-700'>excellence</strong>.",
            ],
            didYouKnow:
              "The Philippine eagle sits at the very top of its forest food web. Because so little energy reaches the top, one pair needs thousands of hectares of forest to find enough food. Only about 400 pairs are thought to be left in the wild.",
          },
        },

        {
          type: "timeline",
          heading: "From the Sun to the Top Predator",
          data: {
            intro:
              "Follow the energy in a Philippine sea: Phytoplankton → Zooplankton → Dilis (anchovy) → Tuna. Every food chain and food web starts and ends the same way.",
            steps: [
              {
                num: 1,
                title: "The Sun Supplies the Energy",
                color: "primary",
                description:
                  "Almost all energy in an ecosystem comes from sunlight. Without a steady supply from the sun, every food chain would stop.",
                tip: "The sun is the source of energy, but it is not a trophic level. Trophic levels start with the producers.",
              },
              {
                num: 2,
                title: "Producers Capture It (1st Trophic Level)",
                color: "secondary",
                description:
                  "Phytoplankton, tiny floating algae, use sunlight to make food by photosynthesis. They store the energy in their bodies. On land, the producers are plants like rice, grass and trees.",
                tip: "Producers hold the most energy of any level, so they form the base of the pyramid.",
              },
              {
                num: 3,
                title: "Primary Consumers Eat the Producers (2nd Level)",
                color: "accent",
                description:
                  "Zooplankton, tiny drifting animals, eat the phytoplankton. They get only about 10% of the energy the phytoplankton stored.",
                tip: "Primary consumers are herbivores (plant or algae eaters).",
              },
              {
                num: 4,
                title: "Secondary Consumers Eat the Herbivores (3rd Level)",
                color: "primary",
                description:
                  "Schools of dilis feed on zooplankton. Again, only about a tenth of the energy moves up.",
                tip: "In a food web, one organism can sit at more than one level if it eats from more than one level.",
              },
              {
                num: 5,
                title: "Tertiary Consumers at the Top (4th Level)",
                color: "secondary",
                description:
                  "Tuna eat dilis and other small fish. Very little of the sun's original energy is left by now, which is why big predators are few.",
                tip: "This is why most food chains have only four or five links. There is not enough energy left for another level.",
              },
              {
                num: 6,
                title: "Decomposers Recycle What Is Left",
                color: "accent",
                description:
                  "When any organism dies or leaves waste, bacteria and fungi break it down. They use the last bit of energy and return the nutrients to the water or soil for producers to use again.",
                tip: "Decomposers work at every level, so they are usually drawn beside the pyramid, not on top of it.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "The Energy Pyramid",
          data: {
            cards: [
              {
                title: "Producers",
                label: "1st level · 10,000 kcal",
                variant: "primary",
                color: "primary",
                desc: "The wide base of the pyramid. Rice plants in a field capture sunlight and hold the most energy of any level.",
                image: simulation,
                imageAlt:
                  "Wide green Philippine rice field in sunlight, the producers at the base of the pyramid",
                examples: [
                  "Rice, grass, kangkong, mango trees",
                  "Phytoplankton and seagrass in the sea",
                  "Energy in this example: 10,000 kcal",
                  "Holds 100% of the energy that enters the chain",
                ],
              },
              {
                title: "Primary Consumers",
                label: "2nd level · 1,000 kcal",
                variant: "secondary",
                color: "secondary",
                desc: "Herbivores that eat the producers. They get only about one tenth of the producers' energy.",
                image: equation,
                imageAlt:
                  "Rice bug (atangya) feeding on a rice grain, a primary consumer",
                examples: [
                  "Rice bugs, grasshoppers, golden apple snails",
                  "Zooplankton in the sea",
                  "Energy: 10% of 10,000 = 1,000 kcal",
                  "The bar is ten times narrower than the base",
                ],
              },
              {
                title: "Secondary Consumers",
                label: "3rd level · 100 kcal",
                variant: "accent",
                color: "accent",
                desc: "Animals that eat the herbivores. Only about 1% of the original energy reaches them.",
                image: globe,
                imageAlt:
                  "Rice-field frog sitting among green rice plants, a secondary consumer",
                examples: [
                  "Frogs, spiders, ducks, dilis",
                  "Energy: 10% of 1,000 = 100 kcal",
                  "Fewer of them can live in the same field",
                  "They need to eat many herbivores to survive",
                ],
              },
              {
                title: "Tertiary Consumers",
                label: "4th level · 10 kcal",
                variant: "primary",
                color: "primary",
                desc: "Top predators at the narrow tip. Only about 0.1% of the producers' energy is left for them.",
                image: lab,
                imageAlt:
                  "Rat snake or hawk hunting at the edge of a rice field, a top predator",
                examples: [
                  "Snakes, hawks, the Philippine eagle, tuna",
                  "Energy: 10% of 100 = 10 kcal",
                  "Always the fewest organisms in the ecosystem",
                  "Need a large area to find enough food",
                ],
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Where Does the Lost Energy Go?",
          isSubsection: true,
          data: {
            intro:
              "If a frog eats rice bugs holding 1,000 kcal, why does the frog keep only about 100 kcal? The other 90% is not destroyed. It is used up or passed out in these ways.",
            reasons: [
              {
                num: 1,
                title: "Released as Heat",
                color: "primary",
                desc: "Cellular respiration gives off heat",
                content:
                  "Every cell breaks down food to get energy, and much of it escapes as body heat. This heat goes into the air and can never be used by another organism.",
              },
              {
                num: 2,
                title: "Used for Living",
                color: "secondary",
                desc: "Moving, breathing, hunting, growing",
                content:
                  "A frog spends energy hopping, catching insects, breathing and repairing its body. Energy that is spent on activity is not stored, so a predator cannot get it later.",
              },
              {
                num: 3,
                title: "Not Eaten",
                color: "accent",
                desc: "Some parts are left behind",
                content:
                  "Predators rarely eat every part of their prey. Bones, shells, feathers, roots and tough stems are left behind, so their energy never moves up the chain.",
              },
              {
                num: 4,
                title: "Not Digested",
                color: "primary",
                desc: "Waste passes out of the body",
                content:
                  "Some food passes through the body without being absorbed and leaves as waste (feces). Decomposers use that energy instead of the next consumer.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Draw Your Own Energy Pyramid",
          data: {
            intro:
              "Illustrate how energy decreases from one trophic level to the next. Use this food chain from a Philippine forest: Leaves → Caterpillar → Maya bird → Philippine hawk-eagle. The leaves hold 20,000 kcal.",
            steps: [
              {
                num: 1,
                title: "List the Levels in Order",
                color: "primary",
                description:
                  "Write the producer first, then each consumer in feeding order: Leaves (producer), Caterpillar (primary), Maya bird (secondary), Hawk-eagle (tertiary).",
                tip: "Check your food chain arrows first. The order of the pyramid follows the direction of the arrows.",
              },
              {
                num: 2,
                title: "Compute the Energy at Each Level",
                color: "secondary",
                description:
                  "Multiply by 10% (or divide by 10) each time you go up: 20,000 kcal → 2,000 kcal → 200 kcal → 20 kcal.",
                tip: "Show your solution beside each number. Accurate computation is part of the grade.",
              },
              {
                num: 3,
                title: "Draw the Bars From the Bottom Up",
                color: "accent",
                description:
                  "Draw the producer bar widest at the bottom. Make each bar above it clearly narrower. A simple guide: 16 cm, 12 cm, 8 cm, 4 cm wide.",
                tip: "The bars don't need to be exactly to scale, but each one must be smaller than the one below it.",
              },
              {
                num: 4,
                title: "Label Every Bar",
                color: "primary",
                description:
                  "Write the trophic level, the organism and its energy on each bar, for example “2nd level: Caterpillar, 2,000 kcal.”",
                tip: "Use the same units (kcal) on every bar.",
              },
              {
                num: 5,
                title: "Show the Energy Loss",
                color: "secondary",
                description:
                  "Beside each step, draw a wavy arrow going out to the side and label it “90% lost as heat.” Add decomposers at the side with an arrow from every level.",
                tip: "These side arrows explain WHY the pyramid narrows, not just that it does.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Energy Flows, Nutrients Cycle",
          isSubsection: true,
          data: {
            intro:
              "Energy and matter behave very differently in an ecosystem. This is what makes the “circle of life” a circle for matter but a one-way street for energy.",
            left: {
              label: "Energy: a One-Way Flow",
              color: "primary",
              items: [
                "Enters the ecosystem as sunlight",
                "Captured by producers through photosynthesis",
                "Passes up the trophic levels, about 90% lost at each step",
                "Leaves the ecosystem as heat and never comes back",
                "Must be resupplied by the sun every day",
              ],
            },
            right: {
              label: "Nutrients: a Repeating Cycle",
              color: "secondary",
              items: [
                "Carbon, nitrogen and minerals are already on Earth",
                "Taken in from soil, water and air by producers",
                "Passed along when organisms eat each other",
                "Released by decomposers when organisms die",
                "Returned to the soil and used again, like compost in a garden",
              ],
            },
          },
        },

        {
          type: "reasonCards",
          heading: "Why Energy Flow Keeps Ecosystems Balanced",
          data: {
            intro:
              "Energy flow decides how many organisms each level can support. When the flow is steady, populations stay in balance. When one level is damaged, the effect spreads up and down the web.",
            reasons: [
              {
                num: 1,
                title: "Each Level Feeds the Next",
                color: "primary",
                desc: "More producers support more consumers",
                content:
                  "A healthy rice field or forest has plenty of producers, so it can feed many herbivores, some predators and a few top predators. Cutting forests removes the base and the whole pyramid shrinks.",
              },
              {
                num: 2,
                title: "Predators Control Prey",
                color: "secondary",
                desc: "Top levels keep lower levels in check",
                content:
                  "Snakes and owls eat rats in rice fields. If farmers kill the snakes, rats can multiply and eat more rice. Each level helps hold the others in balance.",
              },
              {
                num: 3,
                title: "Top Predators Are Few and at Risk",
                color: "accent",
                desc: "Little energy reaches the top",
                content:
                  "The Philippine eagle and big fish like tuna and sharks need large areas and lots of prey. Hunting them or losing their habitat hits them hardest, because their numbers are already small.",
              },
              {
                num: 4,
                title: "Decomposers Keep It Sustainable",
                color: "primary",
                desc: "They return nutrients to producers",
                content:
                  "Without decomposers, dead leaves and animals would pile up and soil would run out of nutrients. Then producers could not grow, and the energy flow would stop at its source.",
              },
              {
                num: 5,
                title: "Balance Means Taking Only What Grows Back",
                color: "secondary",
                desc: "Sustainability",
                content:
                  "An ecosystem is sustainable when we take food from it no faster than its producers and consumers can replace it. Overfishing removes fish faster than energy can rebuild their numbers.",
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
              "Use the energy pyramid and the 10% rule. Then check the model answer.",
            scenarios: [
              {
                title: "How Much Reaches the Top?",
                situation:
                  "The seagrass in a coastal ecosystem holds 50,000 kcal. The chain is Seagrass → Sea urchin → Fish → Shark.",
                question:
                  "About how much energy reaches the shark?",
                skill:
                  "50,000 → 5,000 (sea urchin) → 500 (fish) → 50 kcal (shark). Only about 50 kcal, or 0.1% of the seagrass energy, reaches the shark.",
              },
              {
                title: "Why So Few Eagles?",
                situation:
                  "A forest has millions of leaves, thousands of insects, hundreds of birds and only one pair of Philippine eagles.",
                question:
                  "Explain the numbers using energy flow.",
                skill:
                  "Each level gets only about 10% of the energy of the level below, so less energy can support fewer organisms at each step. By the top, there is only enough energy for very few eagles.",
              },
              {
                title: "Snakes Removed From a Rice Field",
                situation:
                  "Farmers kill all the snakes they find in their rice fields.",
                question:
                  "What may happen to the rice harvest? Explain using the food web.",
                skill:
                  "Snakes eat rats. Without snakes, the rat population can grow quickly, and more rats eat more rice plants and grain, so the harvest may go down. Removing one level upsets the balance of the whole web.",
              },
              {
                title: "Rice or Chicken?",
                situation:
                  "Some land can grow rice for people to eat, or rice to feed chickens that people then eat.",
                question:
                  "Which choice feeds more people, and why?",
                skill:
                  "Eating the rice directly feeds more people. Feeding it to chickens first adds a trophic level, and about 90% of the energy is lost as the chickens live and grow.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Living Wisely With Energy Flow",
          data: {
            apps: [
              {
                title: "Protecting the Philippine Eagle",
                description:
                  "Saving the forest saves the whole pyramid under the eagle. The Philippine Eagle Foundation protects forests in Mindanao so the eagle's prey, and the producers they eat, can thrive.",
                icon: "🦅",
                color: "border-l-primary-500",
              },
              {
                title: "No-Take Zones at Tubbataha",
                description:
                  "Fishing is not allowed in Tubbataha Reefs Natural Park. With every level of the food web left whole, fish grow big and many, and some swim out to nearby fishing grounds.",
                icon: "🐠",
                color: "border-l-secondary-500",
              },
              {
                title: "Closed Fishing Seasons",
                description:
                  "BFAR stops sardine fishing in the Zamboanga Peninsula every year from December 1 to March 1, during the spawning season. This gives the fish population time to rebuild.",
                icon: "🐟",
                color: "border-l-accent-500",
              },
              {
                title: "Composting at Home and in School",
                description:
                  "Putting fruit peels and dry leaves in a compost pit lets decomposers return nutrients to the soil, so garden plants (the producers) grow well again.",
                icon: "🪱",
                color: "border-l-primary-500",
              },
              {
                title: "Doing It With Excellence",
                description:
                  "Scientists who manage fisheries and forests depend on careful, accurate counts and computations. Checking each number in your own energy pyramid builds that same habit.",
                icon: "⭐",
                color: "border-l-secondary-500",
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
        "Build a labeled 3D shoebox diorama that shows the levels of biological organization, from a single cell to the whole biosphere, and explain how each level connects to the next.",
      readTime: "~15 min read",
      xp: 100,
      heroImage: classroom,
      heroImageAlt:
        "Students presenting a labeled shoebox diorama of a Philippine ecosystem in a classroom",

      sections: [
        "The Task",
        "From Cell to Biosphere",
        "How the Levels Connect",
        "Choosing Your Ecosystem",
        "Building Your Diorama",
        "Explaining Your Diorama",
        "How You Will Be Graded",
        "Tips for a Strong Diorama",
        "Why This Task Matters",
      ],

      references: [
        {
          label: "OpenStax Biology 2e — Themes and Concepts of Biology (levels of organization)",
          url: "https://openstax.org/books/biology-2e/pages/1-2-themes-and-concepts-of-biology",
        },
        {
          label: "National Geographic Education — Ecosystem",
          url: "https://education.nationalgeographic.org/resource/ecosystem/",
        },
        {
          label: "National Geographic Education — Biosphere",
          url: "https://education.nationalgeographic.org/resource/biosphere/",
        },
        {
          label: "Philippine Carabao Center",
          url: "https://www.pcc.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "The Task",
          data: {
            paragraphs: [
              "In this performance task you become a <strong class='text-primary-700'>young biologist and artist</strong>. With your group, you will build a <strong class='text-primary-700'>3D shoebox diorama</strong> that shows the <strong class='text-primary-700'>levels of biological organization</strong>: cell, tissue, organ, organ system, organism, population, community, ecosystem and biosphere.",
              "<strong class='text-primary-700'>GRASPS.</strong> <em>Goal:</em> show how life is organized from the simplest to the most complex level. <em>Role:</em> young biologist and artist. <em>Audience:</em> your classmates, your teacher and the school community. <em>Situation:</em> your diorama will be displayed and you will explain it. <em>Product:</em> a labeled 3D diorama made from clay, drawings, cutouts or recyclables. <em>Standards:</em> the rubric below.",
              "This task brings the whole quarter together: the cells you saw under the microscope, the organisms that reproduce, and the food chains and energy flow that connect them in an ecosystem. Use recycled materials and share what you learn with others. That is how this project serves your school community.",
            ],
            didYouKnow:
              "Your body is made of trillions of cells, yet each one came from a single fertilized egg cell. Every level of organization in you was built up from that one cell.",
          },
        },

        {
          type: "timeline",
          heading: "From Cell to Biosphere",
          data: {
            intro:
              "Each level is made of the levels below it. Follow one example all the way up: a carabao in a rice field.",
            steps: [
              {
                num: 1,
                title: "Cell",
                color: "primary",
                description:
                  "The basic unit of life. Example: one muscle cell in the carabao's heart.",
                tip: "This is the smallest level that is alive by itself.",
              },
              {
                num: 2,
                title: "Tissue",
                color: "secondary",
                description:
                  "A group of similar cells doing the same job. Example: heart muscle tissue, made of many muscle cells that contract together.",
                tip: "Plants have tissues too, like the xylem that carries water up a rice plant.",
              },
              {
                num: 3,
                title: "Organ",
                color: "accent",
                description:
                  "Different tissues working together for one function. Example: the carabao's heart, which pumps blood.",
                tip: "A leaf is a plant organ. It has several tissues that work together to make food.",
              },
              {
                num: 4,
                title: "Organ System",
                color: "primary",
                description:
                  "Organs working together for a major job. Example: the circulatory system (heart, blood vessels, blood) carries food and oxygen to every cell.",
                tip: "The digestive system is another good example to show in a diorama.",
              },
              {
                num: 5,
                title: "Organism",
                color: "secondary",
                description:
                  "One complete living thing. Example: one carabao that can live, grow and reproduce on its own.",
                tip: "A bacterium is an organism made of one cell. It skips the tissue-to-organ-system levels.",
              },
              {
                num: 6,
                title: "Population",
                color: "accent",
                description:
                  "All the organisms of the same species living in one area at the same time. Example: all the carabaos in one barangay.",
                tip: "Same species only. Carabaos and cows together are not one population.",
              },
              {
                num: 7,
                title: "Community",
                color: "primary",
                description:
                  "All the populations of different species living together in one area. Example: the carabaos, rice plants, frogs, golden apple snails, egrets and rats in the rice field.",
                tip: "A community has living things only.",
              },
              {
                num: 8,
                title: "Ecosystem",
                color: "secondary",
                description:
                  "The community plus the non-living (abiotic) things it depends on: water, soil, sunlight and air. Example: the whole rice-field ecosystem.",
                tip: "This is the level where food chains, food webs and energy flow happen.",
              },
              {
                num: 9,
                title: "Biosphere",
                color: "accent",
                description:
                  "All the ecosystems on Earth together: every place where life exists, from the deep sea to the mountains.",
                tip: "The biosphere is the largest level. In a diorama you can show it as a small globe or an Earth drawing.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "How the Levels Connect",
          isSubsection: true,
          data: {
            intro:
              "Your diorama must show more than nine labels. It must show that the levels depend on one another. Use these ideas when you explain your model.",
            reasons: [
              {
                num: 1,
                title: "Each Level Is Built From the One Below",
                color: "primary",
                desc: "Cells → tissues → organs → systems",
                content:
                  "No level appears from nothing. A heart exists because tissues are joined together, and a population exists because there are many organisms of one kind.",
              },
              {
                num: 2,
                title: "Higher Levels Can Do New Things",
                color: "secondary",
                desc: "The whole is more than its parts",
                content:
                  "One heart cell cannot pump blood, but a whole heart can. One frog cannot control a rice field's insects, but a healthy frog population helps do it.",
              },
              {
                num: 3,
                title: "A Change at One Level Spreads",
                color: "accent",
                desc: "Small causes, big effects",
                content:
                  "If a disease damages a carabao's cells and organs, the carabao weakens. If many carabaos get sick, the farmers' population of work animals drops, and the whole rice-field ecosystem is affected.",
              },
              {
                num: 4,
                title: "Energy Links the Upper Levels",
                color: "primary",
                desc: "Food chains connect populations",
                content:
                  "In the community and ecosystem levels, populations are linked by food chains. Energy from the sun flows from rice to snails to ducks, just like in the energy pyramid.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Choosing Your Ecosystem",
          data: {
            cards: [
              {
                title: "Rice Field",
                label: "Farm ecosystem",
                variant: "primary",
                color: "primary",
                desc: "Easy to observe in real life. Follow a carabao or a rice plant from cell to biosphere.",
                image: globe,
                imageAlt:
                  "Carabao standing in a flooded rice paddy with green rice plants",
                examples: [
                  "Organism: carabao or rice plant",
                  "Population: all the rice plants in the paddy",
                  "Community: rice, frogs, snails, egrets, rats",
                  "Abiotic: water, mud, sunlight, air",
                ],
              },
              {
                title: "Mangrove Forest",
                label: "Coastal ecosystem",
                variant: "secondary",
                color: "secondary",
                desc: "Shows land meeting sea. Follow a mangrove tree from its leaf cells up.",
                image: equation,
                imageAlt:
                  "Mangrove trees with arching prop roots standing in shallow coastal water",
                examples: [
                  "Organism: bakawan (mangrove tree)",
                  "Population: all the bakawan along the shore",
                  "Community: mangroves, crabs, mudskippers, fish, birds",
                  "Abiotic: salt water, mud, tides, sunlight",
                ],
              },
              {
                title: "Coral Reef",
                label: "Marine ecosystem",
                variant: "accent",
                color: "accent",
                desc: "Colorful and full of life, like Tubbataha. Follow a sea turtle or a clownfish.",
                image: simulation,
                imageAlt:
                  "Healthy coral reef with colorful fish and a sea turtle swimming above the corals",
                examples: [
                  "Organism: sea turtle (pawikan)",
                  "Population: all the clownfish on one reef",
                  "Community: corals, algae, fish, turtles, sharks",
                  "Abiotic: seawater, sunlight, sand, rocks",
                ],
              },
              {
                title: "Rainforest",
                label: "Forest ecosystem",
                variant: "primary",
                color: "primary",
                desc: "Has tall layers that are fun to build. Follow the Philippine eagle from cell to biosphere.",
                image: lab,
                imageAlt:
                  "Philippine eagle perched on a branch in a lush green rainforest",
                examples: [
                  "Organism: Philippine eagle",
                  "Population: all the eagles in one mountain range",
                  "Community: trees, ferns, monkeys, birds, fungi",
                  "Abiotic: soil, rain, rivers, sunlight",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Building Your Diorama",
          data: {
            intro:
              "Plan before you build. Agree on one ecosystem and one main organism, then share the work among your group.",
            steps: [
              {
                num: 1,
                title: "Pick Your Ecosystem and Main Organism",
                color: "primary",
                description:
                  "Choose one ecosystem and one organism to follow through all nine levels. Every organism in your diorama must really live in that ecosystem.",
                tip: "A tamaraw does not belong on a coral reef. Check your research.",
              },
              {
                num: 2,
                title: "Sketch the Plan on Paper",
                color: "secondary",
                description:
                  "Draw where each level will go. A good layout: cell, tissue, organ and organ system on cards or a side panel; organism, population and community inside the box; ecosystem as the whole scene; biosphere as a small globe on top or beside it.",
                tip: "Use numbered arrows (1 → 9) so viewers can follow the order from smallest to largest.",
              },
              {
                num: 3,
                title: "Gather Recycled Materials",
                color: "accent",
                description:
                  "Use a shoebox, used paper, old magazines, bottle caps, cardboard, clay, twigs, sand and dry leaves. Buying new materials is not required.",
                tip: "Reusing materials is part of the creativity score and shows care for the environment.",
              },
              {
                num: 4,
                title: "Build the Background and Abiotic Parts",
                color: "primary",
                description:
                  "Paint or paper the inside of the box first (sky, water, forest). Then add soil, water, rocks and a sun. These non-living parts are what make it an ecosystem.",
                tip: "Let the paint dry fully before you glue anything on top.",
              },
              {
                num: 5,
                title: "Add the Living Levels",
                color: "secondary",
                description:
                  "Model the main organism, then several of the same kind (population), then other species (community). Place each one where it really lives.",
                tip: "Make the population easy to see: three or more of the same animal or plant grouped together.",
              },
              {
                num: 6,
                title: "Show the Small Levels",
                color: "accent",
                description:
                  "Draw or model the cell, tissue, organ and organ system of your main organism. A magnifying-glass cutout pointing to the organism makes the link clear.",
                tip: "Draw the cell with the parts you learned: cell membrane, nucleus and cytoplasm (add a cell wall and chloroplasts if it is a plant cell).",
              },
              {
                num: 7,
                title: "Label Every Level and Practice Your Explanation",
                color: "primary",
                description:
                  "Attach a neat label to each of the nine levels with its name and a one-line description. Then practice explaining how the levels connect, in about 2 minutes.",
                tip: "Take a photo of your finished diorama in case it gets damaged on the way to school.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Explaining Your Diorama",
          data: {
            intro:
              "During the presentation, your teacher or classmates may ask questions like these. Try answering first, then compare with the model answer.",
            scenarios: [
              {
                title: "Population or Community?",
                situation:
                  "Your diorama shows five carabaos, rice plants, frogs and egrets in a paddy.",
                question:
                  "Which part is the population and which is the community?",
                skill:
                  "The five carabaos are a population, because they are all the same species. The carabaos, rice, frogs and egrets together are the community, because it includes all the different species living in that area.",
              },
              {
                title: "Community or Ecosystem?",
                situation:
                  "A classmate says a community and an ecosystem are the same thing.",
                question:
                  "How do you explain the difference using your diorama?",
                skill:
                  "A community is only the living things. An ecosystem is the community plus the non-living things it needs, like the water, soil, sunlight and air in the diorama.",
              },
              {
                title: "Missing Levels",
                situation:
                  "Someone asks why your diorama doesn't show tissues or organs for the bacteria in the soil.",
                question:
                  "What is the correct answer?",
                skill:
                  "Bacteria are unicellular. One cell is already the whole organism, so they have no tissues, organs or organ systems.",
              },
              {
                title: "How the Levels Depend on Each Other",
                situation:
                  "The audience asks what would happen to your ecosystem if pollution killed most of the frogs.",
                question:
                  "Explain the effect across the levels.",
                skill:
                  "The frog population would drop, so the community changes. With fewer frogs, insects like rice bugs can increase and damage the rice, and snakes that eat frogs lose food. A change in one population affects the whole community and ecosystem.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "How You Will Be Graded",
          data: {
            intro:
              "This task is scored out of 100 points using the rubric from your curriculum map. Correct science is worth the most.",
            left: {
              label: "Science and Organization — 55 points",
              color: "primary",
              items: [
                "Scientific Accuracy (35 pts): every level is correct, in the right order, with true examples from one real ecosystem",
                "Completeness and Organization (20 pts): all nine levels, cell to biosphere, are present, labeled and easy to follow",
              ],
            },
            right: {
              label: "Design, Explanation and Timeliness — 45 points",
              color: "secondary",
              items: [
                "Creativity and Design (20 pts): neat, sturdy, uses the depth of the box and creative use of recycled materials",
                "Explanation and Presentation (15 pts): clearly explains how the levels connect and depend on each other",
                "Punctuality (10 pts): submitted and presented on time",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Tips for a Strong Diorama",
          isSubsection: true,
          data: {
            concepts: [
              "Follow ONE main organism through the small levels (cell to organism). Switching organisms halfway confuses the viewer.",
              "Use real 3D depth: put the organisms in front, the community in the middle and the background scenery at the back.",
              "Don't forget the non-living parts. Without water, soil, sunlight and air, you have a community, not an ecosystem.",
              "Keep the order of the levels clear with numbers or arrows from 1 (cell) to 9 (biosphere).",
              "Labels should be large enough to read from one meter away.",
              "Divide the work fairly: researchers, builders, label makers and speakers, so every member helps.",
              "Practice your explanation together so anyone in the group can answer questions.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Why This Task Matters",
          isSubsection: true,
          data: {
            apps: [
              {
                title: "Seeing the Order of Life",
                description:
                  "Life is organized from tiny cells to the whole planet. Building it with your hands helps you remember how each level fits.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
              {
                title: "Serving Your School Community",
                description:
                  "Your finished diorama can be displayed for younger students. Explaining it to them is a way of serving others with what you have learned.",
                icon: "🤝",
                color: "border-l-secondary-500",
              },
              {
                title: "Caring for Ecosystems",
                description:
                  "Knowing that a change in one population affects the whole ecosystem helps people protect rice fields, mangroves and reefs.",
                icon: "🌿",
                color: "border-l-accent-500",
              },
              {
                title: "Review for the Periodical Exam",
                description:
                  "The Second Periodical Examination covers Weeks 11–19. This diorama reviews cells, organisms and ecosystems in one project.",
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
