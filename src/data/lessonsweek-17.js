// Week 17: Asexual Reproduction — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd Quarter Week 7 (site Week 17).
//   Lesson 1 — Asexual Reproduction
//   (2nd Quarter Summative Test is given this week.)

import simulation from "../assets/week1/simulation.jpg";
import microscope from "../assets/week1/Microscopic.jpg";
import globe from "../assets/week1/globe.jpg";
import lab from "../assets/lab.jpg";
import equation from "../assets/week1/equation.jpg";

export const week17 = {
  id: "week-17",
  weekNumber: 17,
  title: "Asexual Reproduction",
  category: "Life Science",
  description:
    "Learn how living things reproduce with only one parent, from bacteria splitting in two to kangkong growing from a stem cutting, and review for the 2nd Quarter Summative Test.",
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
        "One parent, no sex cells and offspring that are exact copies. Learn the types of asexual reproduction, compare how plants and animals do it, and follow one real-life example.",
      readTime: "~17 min read",
      xp: 100,
      heroImage: simulation,
      heroImageAlt:
        "Banana plant with young suckers growing around the base of the parent plant",

      signature: {
        widgetId: "clone-bench",
        heading: "Watch It: Copy Yourself Four Ways",
        intro: "One parent, four methods, and every offspring an exact copy.",
        instruction: "Run all four methods, then release the disease.",
        xp: 25,
        explainer: {
          title: "Why clones share one weakness",
          points: [
            "You ran four methods, and every one of them needed just a single parent.",
            "Each offspring you made carried a copy of the parent's genes, so your field held no variety.",
            "The disease found the same weakness in all of them, and nothing was left standing.",
            "Mixed genes would have left a few individuals the disease could not touch.",
          ],
        },
      },

      sections: [
        "Overview",
        "Types of Asexual Reproduction",
        "Why Only One Parent and Identical Offspring",
        "Plants vs. Animals",
        "Real-Life Example: Kangkong from Cuttings",
        "Think About It",
        "Asexual Reproduction at Work",
        "Summative Test Review",
      ],

      references: [
        {
          label: "Britannica — Asexual reproduction",
          url: "https://www.britannica.com/science/asexual-reproduction",
        },
        {
          label: "CK-12 — Asexual Reproduction",
          url: "https://www.ck12.org/c/biology/asexual-reproduction/",
        },
        {
          label: "Khan Academy — Asexual and sexual reproduction",
          url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology",
        },
        {
          label: "Department of Agriculture — Banana Fusarium wilt (Panama disease) management",
          url: "https://www.da.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Asexual reproduction</strong> is reproduction that needs only <strong class='text-primary-700'>one parent</strong>. No sperm or egg cells are made, and no fertilization happens.",
              "The new living things, called <strong class='text-primary-700'>offspring</strong>, are <strong class='text-primary-700'>genetically identical</strong> to the parent. They are <strong class='text-primary-700'>clones</strong>. This is because the parent's cells divide by <strong class='text-primary-700'>mitosis</strong>, which you studied in Week 15. Mitosis copies the chromosomes exactly.",
              "You can see asexual reproduction all around you: bacteria multiplying in spoiled food, molds (amag) growing on old bread, yeast making pandesal dough rise, and new banana plants (suckers) sprouting around a parent plant. Farmers use it to <strong class='text-primary-700'>serve</strong> their communities by growing many good, healthy plants quickly.",
            ],
            didYouKnow:
              "Some bacteria can split in two about every 20 minutes. Starting with one bacterium, that is more than 2 million bacteria in just 7 hours. This is why leftover food should go into the refrigerator.",
          },
        },

        {
          type: "imageCards",
          heading: "Types of Asexual Reproduction",
          data: {
            cards: [
              {
                title: "Binary Fission",
                label: "Bacteria, amoeba, paramecium",
                variant: "primary",
                color: "primary",
                desc: "One cell copies its DNA, grows, and splits into two equal cells. Each new cell is a complete organism.",
                image: microscope,
                imageAlt:
                  "Microscope image of a bacterium pinching in the middle as it splits into two cells",
                examples: [
                  "Bacteria in food left out on the table",
                  "Amoeba and paramecium in pond water",
                  "One cell becomes two equal cells",
                ],
              },
              {
                title: "Budding",
                label: "Yeast and hydra",
                variant: "secondary",
                color: "secondary",
                desc: "A small bud grows out from the parent. It may break off or stay attached, and it grows into a new organism.",
                image: simulation,
                imageAlt:
                  "Microscope image of yeast cells with small buds growing from their sides",
                examples: [
                  "Yeast in pandesal dough buds and multiplies",
                  "Hydra grows a tiny new hydra on its side",
                  "The bud starts smaller than the parent",
                ],
              },
              {
                title: "Fragmentation",
                label: "Planaria, sea stars, algae",
                variant: "primary",
                color: "primary",
                desc: "The parent's body breaks into pieces, and each piece grows the missing parts to become a whole new organism.",
                image: equation,
                imageAlt:
                  "Diagram of a planarian flatworm cut into pieces, each piece regrowing into a whole worm",
                examples: [
                  "A planarian (flatworm) piece regrows a head or a tail",
                  "A sea star arm with part of the central disc can become a new sea star",
                  "Spirogyra, a green alga, breaks into strands that keep growing",
                ],
              },
              {
                title: "Spore Formation",
                label: "Molds, mushrooms, ferns",
                variant: "secondary",
                color: "secondary",
                desc: "The parent makes many tiny cells called spores. When a spore lands in a damp, warm place, it grows into a new organism.",
                image: globe,
                imageAlt:
                  "Close-up of black bread mold (amag) with tiny round spore cases on thin stalks",
                examples: [
                  "Amag on old bread or rice",
                  "Mushrooms release spores from their gills",
                  "Ferns have spore dots under their leaves",
                ],
              },
              {
                title: "Vegetative Propagation",
                label: "Plants",
                variant: "primary",
                color: "primary",
                desc: "A new plant grows from a root, stem or leaf of the parent plant. No flower or seed is needed.",
                image: lab,
                imageAlt:
                  "Kamote stem cuttings and a sprouting onion bulb showing new roots and shoots",
                examples: [
                  "Kangkong and kamote from stem cuttings",
                  "Banana and pineapple from suckers",
                  "Katakataka from its leaves; strawberry from runners",
                ],
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Why Only One Parent and Identical Offspring",
          data: {
            intro:
              "Asexual reproduction always makes copies. Here is why, step by step.",
            reasons: [
              {
                num: 1,
                title: "Only One Parent Is Involved",
                color: "primary",
                desc: "There is no partner to add new genes",
                content:
                  "The offspring comes from the body or cells of just one parent. All its genetic information comes from that single parent.",
              },
              {
                num: 2,
                title: "No Sex Cells Are Made",
                color: "secondary",
                desc: "No meiosis and no fertilization",
                content:
                  "In sexual reproduction, meiosis shuffles the chromosomes and fertilization mixes genes from two parents. Asexual reproduction skips both steps, so nothing gets mixed.",
              },
              {
                num: 3,
                title: "Mitosis Copies the DNA Exactly",
                color: "accent",
                desc: "Same chromosomes, same number",
                content:
                  "The cells that form the offspring are made by mitosis or by simple cell division. The DNA is copied, and each new cell gets the same set of chromosomes as the parent.",
              },
              {
                num: 4,
                title: "The Result Is a Clone",
                color: "primary",
                desc: "Same genes, same traits",
                content:
                  "Because the offspring has the same genes as the parent, it has the same traits, such as the sweetness of a fruit or the shape of a leaf. Rare copying mistakes, called mutations, are the only source of small changes.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Plants vs. Animals",
          data: {
            intro:
              "Both plants and animals can reproduce asexually, but in different ways. Many plants do it easily. In animals, it happens mostly in simple ones.",
            left: {
              label: "Asexual Reproduction in Plants",
              color: "primary",
              items: [
                "Very common, even in plants that also make flowers and seeds",
                "Mainly by vegetative propagation from roots, stems or leaves",
                "Stems: kangkong, kamote tops, sugarcane, strawberry runners",
                "Roots and underground parts: kamote, ginger, onion and garlic bulbs",
                "Leaves: katakataka grows tiny plants along the leaf edges",
                "People help it along with cuttings, grafting and marcotting (air layering), for example in mango",
              ],
            },
            right: {
              label: "Asexual Reproduction in Animals",
              color: "secondary",
              items: [
                "Found mostly in simple animals with few kinds of tissues",
                "Budding: hydra, corals and sponges",
                "Fragmentation and regeneration: planaria and sea stars",
                "A few animals, such as aphids and some lizards, use parthenogenesis: an egg grows without being fertilized",
                "Complex animals like birds, carabaos and humans cannot reproduce asexually",
                "Many of these animals also reproduce sexually when conditions change",
              ],
            },
          },
        },

        {
          type: "timeline",
          heading: "Real-Life Example: Kangkong from Cuttings",
          data: {
            intro:
              "Kangkong from the palengke can grow into new plants at home. This is vegetative propagation, a real example of asexual reproduction you can try yourself.",
            steps: [
              {
                num: 1,
                title: "Choose Healthy Stems",
                color: "primary",
                description:
                  "From a bundle of fresh kangkong, choose a few thick, green stems. Cut pieces about 15 to 20 cm long, each with at least two or three nodes (the bumps where leaves grow).",
                tip: "Roots grow from the nodes, so every cutting needs nodes.",
              },
              {
                num: 2,
                title: "Remove the Lower Leaves",
                color: "secondary",
                description:
                  "Pull off the leaves from the bottom half of each cutting. Keep a few leaves at the top so the cutting can still make food by photosynthesis.",
                tip: "Leaves left under water rot and can spoil the water.",
              },
              {
                num: 3,
                title: "Put Them in Water or Moist Soil",
                color: "accent",
                description:
                  "Stand the cuttings in a glass of water, or plant them in moist soil. Place them where they get sunlight. If using water, change it every two days.",
                tip: "Measure and record root length in centimeters to see how fast they grow.",
              },
              {
                num: 4,
                title: "Watch the Roots Grow",
                color: "primary",
                description:
                  "In about a week, thin white roots grow from the nodes. These roots grow by mitosis, using cells from the parent stem.",
                tip: "No flower, pollen or seed was needed. The only parent is the original kangkong plant.",
              },
              {
                num: 5,
                title: "Harvest a New Crop",
                color: "secondary",
                description:
                  "Move the rooted cuttings to soil. In about a month, they grow into new kangkong plants with the same traits as the parent, ready to cook.",
                tip: "Every new plant is a clone of the plant the cutting came from.",
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
              "Name the type of asexual reproduction in each situation. Then check the model answer.",
            scenarios: [
              {
                title: "Amag on Pandesal",
                situation:
                  "Pandesal was left in a closed plastic bag for a week. Gray-green and black fuzzy spots now cover it.",
                question:
                  "How did the mold spread across the bread so quickly?",
                skill:
                  "Spore formation. Mold spores from the air landed on the damp bread and grew. The new mold then made millions of spores of its own, which spread to the rest of the bread.",
              },
              {
                title: "Bacteria in Leftover Food",
                situation:
                  "A dish of adobo was left on the table overnight in hot weather. The next day, people who ate it got stomachaches.",
                question:
                  "How did a few bacteria become enough to make people sick?",
                skill:
                  "Binary fission. Each bacterium split into two identical cells about every 20 minutes in the warm food, so a few became millions overnight. Refrigerating food slows this down.",
              },
              {
                title: "Strawberries in La Trinidad",
                situation:
                  "A strawberry farmer in Benguet plants one plant. After some weeks, long stems grow along the ground, and new small plants grow where they touch the soil.",
                question:
                  "What type of asexual reproduction is this, and how are the new plants related to the parent?",
                skill:
                  "Vegetative propagation by runners (stolons). The new plants grow from the parent's stems, so they are clones with the same genes and traits as the parent.",
              },
              {
                title: "A Planarian in Two",
                situation:
                  "In a science class, a planarian (a small flatworm) is cut into two pieces. After about two weeks, there are two complete worms.",
                question:
                  "What type of asexual reproduction is this, and how did each piece become a whole worm?",
                skill:
                  "Fragmentation with regeneration. Each piece used mitosis to grow back the parts it was missing: a new head for the tail piece and a new tail for the head piece.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Asexual Reproduction at Work",
          isSubsection: true,
          data: {
            apps: [
              {
                title: "Banana Plantlets",
                description:
                  "Banana farms in Mindanao plant clones grown from suckers or from tissue culture in laboratories. Every plant gives the same sweet, seedless fruit.",
                icon: "🍌",
                color: "border-l-primary-500",
              },
              {
                title: "Grafted Mango Seedlings",
                description:
                  "Farmers graft or marcot branches of the best Carabao mango trees, so the new trees bear the same sweet fruit and bear fruit sooner than trees grown from seed.",
                icon: "🥭",
                color: "border-l-secondary-500",
              },
              {
                title: "The Risk: One Disease for All",
                description:
                  "Because clone banana plants have the same genes, Fusarium wilt (Panama disease) can spread through a whole farm. This is the main weakness of asexual reproduction: no variety.",
                icon: "⚠️",
                color: "border-l-accent-500",
              },
              {
                title: "Food Safety at Home",
                description:
                  "Knowing that bacteria multiply by binary fission helps families keep food safe: cook it well, cover it, and refrigerate leftovers quickly.",
                icon: "🍲",
                color: "border-l-primary-500",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Summative Test Review",
          data: {
            concepts: [
              "This week you take the 2nd Quarter Summative Test. Review these big ideas from Weeks 11 to 13.",
              "Microscope: the eyepiece and objectives magnify, the coarse and fine adjustment knobs focus, and the diaphragm and light source control the light. Total magnification = eyepiece × objective (10× × 40× = 400×).",
              "Handle a microscope with two hands (one on the arm, one under the base), clean lenses only with lens paper, and store it with the low-power objective in place and the dust cover on.",
              "Cell theory: all living things are made of cells, the cell is the basic unit of life, and all cells come from existing cells.",
              "Prokaryotic cells (bacteria) have no nucleus. Eukaryotic cells (plants, animals, fungi, protists) have a nucleus and other organelles.",
              "Plant cells have a cell wall, chloroplasts and a large central vacuole. Animal cells have none of these and are usually rounder in shape.",
              "Organelle jobs: the nucleus controls the cell, the cell membrane controls what goes in and out, mitochondria release energy, chloroplasts make food, and ribosomes make proteins.",
              "Asexual reproduction (this lesson): one parent, no sex cells, offspring identical to the parent, made by mitosis.",
            ],
          },
        },
      ],
    },
  ],
};
