// Week 12: The Cell — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd Quarter Week 2 (site Week 12).
//   Lesson 1 — The Cell Theory and Its Diversity
//   Lesson 2 — Parts and Function of the Cell

import microscope from "../assets/week1/Microscopic.jpg";
import globe from "../assets/week1/globe.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week12 = {
  id: "week-12",
  weekNumber: 12,
  title: "The Cell",
  category: "Life Science",
  description:
    "Learn the cell theory, sort living things into unicellular and multicellular, tell prokaryotic from eukaryotic cells, and find out what each major part of a cell does.",
  icon: "BookOpen",
  color: "primary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — The Cell Theory and Its Diversity
    // ═══════════════════════════════════════════════════
    {
      id: "w12-l1",
      weekId: "week-12",
      lessonNumber: 1,
      title: "The Cell Theory and Its Diversity",
      badge: "Lesson 1",
      subtitle:
        "Learn the three ideas of the cell theory, classify organisms as unicellular or multicellular, and tell prokaryotic cells from eukaryotic cells.",
      readTime: "~15 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt:
        "Microscope view of many different kinds of cells, such as bacteria, a paramecium and plant cells",

      signature: {
        widgetId: "scope-field",
        heading: "Watch It: Six Cells, Two Kinds",
        intro: "Six living cells drift under the lens. Two have no nucleus.",
        instruction: "Zoom past 2.5x on every one of the six cells.",
        xp: 25,
        explainer: {
          title: "Why cells come in two kinds",
          points: [
            "Four of the cells you zoomed into kept their DNA inside a nucleus. Those are eukaryotic cells.",
            "The bacterium and the cyanobacterium had no nucleus at all, just a loose loop of DNA in the cytoplasm. Those are prokaryotic cells.",
            "Each cell's shape matched its job: the nerve cell was long and stretched out, and the sperm cell had a tail for swimming.",
            "All six are cells, and the cell theory has to explain every one of them.",
          ],
        },
      },

      sections: [
        "Overview",
        "The Three Ideas of the Cell Theory",
        "Unicellular or Multicellular?",
        "Prokaryotic vs. Eukaryotic Cells",
        "Classify It!",
        "Why Cell Diversity Matters",
      ],

      references: [
        {
          label: "Britannica — Cell theory",
          url: "https://www.britannica.com/science/cell-theory",
        },
        {
          label: "Khan Academy — Prokaryotic and eukaryotic cells",
          url: "https://www.khanacademy.org/science/biology/structure-of-a-cell/prokaryotic-and-eukaryotic-cells/a/prokaryotic-and-eukaryotic-cells",
        },
        {
          label: "CK-12 — Prokaryotic and Eukaryotic Cells",
          url: "https://www.ck12.org/c/biology/prokaryotic-and-eukaryotic-cells/",
        },
        {
          label: "BFAR — Red tide / shellfish bulletins",
          url: "https://www.bfar.da.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "A carabao, a mango tree, a mushroom and the bacteria in a bottle of Yakult look nothing alike. Yet they all have one thing in common: they are made of <strong class='text-primary-700'>cells</strong>. The cell is the basic unit of life.",
              "Some living things are made of only one cell. They are <strong class='text-primary-700'>unicellular</strong>. Others, like you, are made of trillions of cells working together. They are <strong class='text-primary-700'>multicellular</strong>.",
              "Cells also differ on the inside. <strong class='text-primary-700'>Prokaryotic</strong> cells have no nucleus, while <strong class='text-primary-700'>eukaryotic</strong> cells keep their DNA inside a nucleus. Learning these differences helps us <strong class='text-primary-700'>respect</strong> the amazing variety of life, from the tiniest bacterium to the biggest tree.",
            ],
            didYouKnow:
              "The red tide that sometimes closes shellfish harvesting in Philippine bays is caused by a tiny one-celled organism called Pyrodinium bahamense. When millions of them bloom, the water can turn reddish brown, and shellfish that eat them become poisonous to people.",
          },
        },

        {
          type: "reasonCards",
          heading: "The Three Ideas of the Cell Theory",
          data: {
            intro:
              "Last week you saw how microscopes revealed cells. By the 1850s, scientists had put what they saw into three big ideas, known together as the cell theory.",
            reasons: [
              {
                num: 1,
                title: "All Living Things Are Made of Cells",
                color: "primary",
                desc: "Matthias Schleiden (1838) and Theodor Schwann (1839)",
                content:
                  "Schleiden studied plants and Schwann studied animals. Both found cells in every living thing they looked at, so they concluded that all organisms are made of one or more cells.",
              },
              {
                num: 2,
                title: "The Cell Is the Basic Unit of Life",
                color: "secondary",
                desc: "Structure and function",
                content:
                  "The cell is the smallest part that is alive. It takes in food, uses energy, gets rid of wastes, grows and reproduces. Anything smaller, like a single organelle, cannot live on its own.",
              },
              {
                num: 3,
                title: "All Cells Come from Existing Cells",
                color: "accent",
                desc: "Rudolf Virchow (1855)",
                content:
                  "Virchow said “Omnis cellula e cellula,” Latin for “every cell from a cell.” New cells form only when an existing cell divides. Living things do not appear from non-living matter.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Unicellular or Multicellular?",
          data: {
            cards: [
              {
                title: "Bacteria",
                label: "Unicellular",
                variant: "primary",
                color: "primary",
                desc: "Each bacterium is one complete living cell. Most are harmless, and many are helpful.",
                image: simulation,
                imageAlt:
                  "Microscope view of rod-shaped bacteria, each one a single cell",
                examples: [
                  "Lactobacillus, the bacteria in Yakult and yogurt",
                  "The bacteria that turn coconut water into nata de coco",
                  "Cyanobacteria (blue-green algae) in ponds",
                ],
              },
              {
                title: "Protists",
                label: "Unicellular",
                variant: "secondary",
                color: "secondary",
                desc: "Many protists are single cells that swim, crawl or float in water.",
                image: globe,
                imageAlt:
                  "Microscope view of a slipper-shaped paramecium covered in tiny hairs (cilia)",
                examples: [
                  "Paramecium and amoeba from pond or rice-paddy water",
                  "Chlorella, a green alga sold as a health supplement",
                  "Pyrodinium, the cause of red tide",
                ],
              },
              {
                title: "Yeast",
                label: "Unicellular",
                variant: "accent",
                color: "accent",
                desc: "Yeast is a fungus made of only one cell. It releases gas that makes dough rise.",
                image: lab,
                imageAlt:
                  "Microscope view of oval yeast cells, some with small buds growing on them",
                examples: [
                  "Baker's yeast in pandesal and ensaymada",
                  "Yeast used to ferment rice into tapuy (rice wine)",
                  "Each yeast cell can bud to form a new cell",
                ],
              },
              {
                title: "Plants",
                label: "Multicellular",
                variant: "primary",
                color: "primary",
                desc: "Plants are made of many cells. Some cells make food, some carry water and some form the bark or skin.",
                image: microscope,
                imageAlt:
                  "A green kangkong plant growing in water, an example of a multicellular plant",
                examples: [
                  "Kangkong, malunggay and rice",
                  "Narra and mango trees",
                  "Even moss has many cells",
                ],
              },
              {
                title: "Animals",
                label: "Multicellular",
                variant: "secondary",
                color: "secondary",
                desc: "Animals are made of many kinds of cells, such as muscle, nerve, skin and blood cells.",
                image: globe,
                imageAlt:
                  "A carabao standing in a rice field, an example of a multicellular animal",
                examples: [
                  "Carabao, tarsier and bangus (milkfish)",
                  "Humans have about 30 trillion cells",
                  "Even a tiny ant has millions of cells",
                ],
              },
              {
                title: "Mushrooms",
                label: "Multicellular",
                variant: "accent",
                color: "accent",
                desc: "Unlike yeast, mushrooms are fungi made of many cells joined into long threads.",
                image: simulation,
                imageAlt:
                  "Oyster mushrooms (kabuteng pamaypay) growing in a cluster",
                examples: [
                  "Oyster mushrooms grown by local farmers",
                  "Molds on old bread",
                  "Shows that one group (fungi) can have both kinds",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Prokaryotic vs. Eukaryotic Cells",
          data: {
            intro:
              "Every cell on Earth is either prokaryotic (“before the nucleus”) or eukaryotic (“true nucleus”). The main clue is the nucleus: does the cell keep its DNA inside one? All prokaryotes are unicellular, but not every unicellular organism is a prokaryote: yeast and paramecium are single cells with a nucleus. All multicellular organisms are made of eukaryotic cells.",
            left: {
              label: "Prokaryotic Cell",
              color: "primary",
              items: [
                "No nucleus: DNA sits in the cytoplasm in an area called the nucleoid",
                "No organelles wrapped in membranes (no mitochondria or chloroplasts)",
                "Very small: about 1 to 5 micrometers long",
                "Has a cell membrane, cytoplasm, ribosomes and usually a cell wall",
                "Always unicellular. Examples: bacteria, cyanobacteria",
              ],
            },
            right: {
              label: "Eukaryotic Cell",
              color: "secondary",
              items: [
                "Has a true nucleus that holds the DNA",
                "Has organelles wrapped in membranes, such as mitochondria",
                "Larger: about 10 to 100 micrometers across",
                "Has a cell membrane, cytoplasm and ribosomes too",
                "Unicellular or multicellular. Examples: plants, animals, fungi, protists",
              ],
            },
          },
        },

        {
          type: "scenario",
          heading: "Classify It!",
          data: {
            intro:
              "Use what you know about the number of cells and the nucleus to answer each one.",
            scenarios: [
              {
                title: "The Yakult Bacteria",
                situation:
                  "Under a microscope, a Lactobacillus cell has a cell membrane, cytoplasm and ribosomes, but its DNA is not inside a nucleus.",
                question:
                  "Is it unicellular or multicellular? Prokaryotic or eukaryotic?",
                skill:
                  "Unicellular, because each bacterium is one cell, and prokaryotic, because it has no nucleus.",
              },
              {
                title: "Pond Water Sample",
                situation:
                  "Ana finds a slipper-shaped organism in pond water. It is a single cell, and with stain she can see a nucleus inside it.",
                question: "How should Ana classify it?",
                skill:
                  "It is unicellular (one cell) and eukaryotic (it has a nucleus). It is likely a paramecium, a protist.",
              },
              {
                title: "Yeast vs. Mushroom",
                situation:
                  "Both yeast and oyster mushrooms are fungi.",
                question:
                  "How are they different in terms of cell number, and what do they have in common?",
                skill:
                  "Yeast is unicellular, while a mushroom is multicellular. Both are made of eukaryotic cells, since all fungi have cells with a nucleus.",
              },
              {
                title: "Spot the Mistake",
                situation:
                  "A classmate says, “All unicellular organisms are prokaryotic, because they are so small.”",
                question: "Is your classmate correct? Explain.",
                skill:
                  "No. Bacteria are unicellular and prokaryotic, but some unicellular organisms, like yeast, amoeba and paramecium, have a nucleus, so they are eukaryotic. Size alone does not decide; the nucleus does.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Why Cell Diversity Matters",
          data: {
            apps: [
              {
                title: "Food Made by Tiny Cells",
                description:
                  "Bacteria make nata de coco and sukang Iloko (sugarcane vinegar), and yeast makes pandesal rise. Filipino food would not be the same without unicellular organisms.",
                icon: "🥥",
                color: "border-l-primary-500",
              },
              {
                title: "Medicine That Targets Bacteria",
                description:
                  "Antibiotics attack parts that only prokaryotic bacteria have, such as their kind of cell wall. That is how they can kill germs without harming your eukaryotic cells.",
                icon: "💊",
                color: "border-l-secondary-500",
              },
              {
                title: "Keeping Seafood Safe",
                description:
                  "BFAR monitors red tide organisms in coastal waters and posts shellfish bulletins, so families know when tahong and talaba from an area are unsafe to eat.",
                icon: "🦪",
                color: "border-l-accent-500",
              },
              {
                title: "Respecting All Life",
                description:
                  "From bacteria in the soil to the trees in a forest, every organism has a role. Understanding cells helps us care for living things big and small, instead of only the ones we can see.",
                icon: "🌱",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Parts and Function of the Cell
    // ═══════════════════════════════════════════════════
    {
      id: "w12-l2",
      weekId: "week-12",
      lessonNumber: 2,
      title: "Parts and Function of the Cell",
      badge: "Lesson 2",
      subtitle:
        "Identify the cell membrane, nucleus, cytoplasm, mitochondria, chloroplasts and ribosomes, describe what each does, and learn how to observe cells carefully under a microscope.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: simulation,
      heroImageAlt:
        "Labeled diagram of a cell showing the cell membrane, nucleus, cytoplasm, mitochondria and ribosomes",

      signature: {
        widgetId: "cell-cutaway",
        heading: "Watch It: Switch an Organelle Off",
        intro: "Five organelles, one production line. Switch one off and watch.",
        instruction: "Switch each of the five organelles off once.",
        xp: 25,
        explainer: {
          title: "Why one failure stops the line",
          points: [
            "Switching the nucleus off cut the instructions, so the ribosomes had nothing left to build from.",
            "Switching the Golgi off left the proteins unpacked, so nothing reached the membrane.",
            "The mitochondria were different: with no energy, every station stopped at once instead of one by one.",
            "Stations before the broken one kept working, which is how you could tell what depends on what.",
          ],
        },
      },

      sections: [
        "Overview",
        "Six Major Cell Parts",
        "Observing Cells Under the Microscope",
        "Good Habits When Observing",
        "Practical Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "Britannica — Cell (biology): organelles",
          url: "https://www.britannica.com/science/cell-biology",
        },
        {
          label: "Khan Academy — Tour of a eukaryotic cell",
          url: "https://www.khanacademy.org/science/biology/structure-of-a-cell/tour-of-organelles/a/nucleus-and-ribosomes",
        },
        {
          label: "CK-12 — Cell Structures (Life Science)",
          url: "https://www.ck12.org/c/life-science/cell-structures/",
        },
        {
          label: "DepEd LR Portal — Grade 7 Science learning resources",
          url: "https://lrmds.deped.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Think of a cell as a small <strong class='text-primary-700'>panaderya</strong> (bakery). It has a door that controls who comes in, a recipe book, bakers, a work area, and a generator for power. Each part inside a cell, called an <strong class='text-primary-700'>organelle</strong>, also has its own job.",
              "In this lesson you will learn six major parts: the <strong class='text-primary-700'>cell membrane</strong>, <strong class='text-primary-700'>nucleus</strong>, <strong class='text-primary-700'>cytoplasm</strong>, <strong class='text-primary-700'>mitochondria</strong>, <strong class='text-primary-700'>chloroplasts</strong> and <strong class='text-primary-700'>ribosomes</strong>. You will also learn which ones you can actually see with your school microscope.",
              "Other helper organelles work alongside them. The endoplasmic reticulum carries proteins around the cell, and the Golgi apparatus packs them and sends them where they are needed. You will meet the vacuole and the cell wall next week.",
              "Good scientists aim for <strong class='text-primary-700'>excellence</strong>: careful technique, patient focusing and neat, accurate drawings of what they really see.",
            ],
            didYouKnow:
              "Mitochondria have their own small set of DNA, separate from the DNA in the nucleus. Scientists think they were once free-living bacteria that were taken in by a larger cell long ago and stayed.",
          },
        },

        {
          type: "imageCards",
          heading: "Six Major Cell Parts",
          data: {
            cards: [
              {
                title: "Cell Membrane",
                label: "The Gatekeeper",
                variant: "primary",
                color: "primary",
                desc: "A thin, flexible layer around the cell. It lets water, food and oxygen in and lets wastes out, but keeps other substances out. This is called being selectively permeable.",
                image: simulation,
                imageAlt:
                  "Microscope view of cheek cells, with the thin outer edge of each cell (the cell membrane) clearly visible",
                examples: [
                  "Found in all cells",
                  "Like the bakery door that only lets in deliveries and customers",
                  "Under the microscope, you see it as the cell's outline",
                ],
              },
              {
                title: "Nucleus",
                label: "The Control Center",
                variant: "secondary",
                color: "secondary",
                desc: "A round structure that holds the DNA. It controls growth, the making of proteins and cell division.",
                image: microscope,
                imageAlt:
                  "Stained onion skin cells under a microscope, each brick-shaped cell with a dark round nucleus",
                examples: [
                  "Found in eukaryotic cells (not in bacteria)",
                  "Like the bakery owner's recipe book",
                  "Shows up as a dark dot when stained with iodine or methylene blue",
                ],
              },
              {
                title: "Cytoplasm",
                label: "The Work Area",
                variant: "accent",
                color: "accent",
                desc: "The jelly-like fluid that fills the cell. Organelles float in it, and many of the cell's chemical reactions happen here.",
                image: lab,
                imageAlt:
                  "Microscope view of a cell showing the clear jelly-like cytoplasm around the nucleus",
                examples: [
                  "Found in all cells",
                  "Like the bakery's work floor where everything happens",
                  "Looks clear or slightly grainy under the microscope",
                ],
              },
              {
                title: "Mitochondria",
                label: "The Powerhouse",
                variant: "primary",
                color: "primary",
                desc: "Bean-shaped organelles that break down food (glucose) using oxygen to release energy the cell can use.",
                image: globe,
                imageAlt:
                  "Diagram of a bean-shaped mitochondrion with folded inner membranes",
                examples: [
                  "Found in plant and animal cells",
                  "Like the bakery's generator that powers the ovens",
                  "Muscle cells have many, because they need lots of energy",
                ],
              },
              {
                title: "Chloroplasts",
                label: "The Food Makers",
                variant: "secondary",
                color: "secondary",
                desc: "Green organelles that use sunlight, water and carbon dioxide to make sugar (food) for the plant. Their green color comes from chlorophyll.",
                image: simulation,
                imageAlt:
                  "Hydrilla leaf cells under a microscope, packed with small green oval chloroplasts",
                examples: [
                  "Found in plant cells and algae, not in animal cells",
                  "Like solar panels that make the bakery's own flour",
                  "Easy to see as green dots in a hydrilla or kangkong leaf",
                ],
              },
              {
                title: "Ribosomes",
                label: "The Builders",
                variant: "accent",
                color: "accent",
                desc: "Very tiny structures that build proteins by following the instructions sent from the nucleus.",
                image: lab,
                imageAlt:
                  "Electron microscope image or diagram showing tiny ribosome dots along a membrane inside a cell",
                examples: [
                  "Found in all cells, even bacteria",
                  "Like the bakers who follow the recipe",
                  "Too small for a school microscope; seen only with an electron microscope",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Observing Cells Under the Microscope",
          data: {
            intro:
              "Use the microscope skills from last week. Onion skin shows the nucleus, cheek cells show an animal cell, and a hydrilla leaf shows chloroplasts.",
            steps: [
              {
                num: 1,
                title: "Prepare the Slide",
                color: "primary",
                description:
                  "Make a wet mount of a thin onion skin. For cheek cells, gently rub the inside of your cheek with a clean, flat toothpick and spread it on a drop of water on the slide.",
                tip: "Use each toothpick only once and throw it in the trash bin your teacher sets out. Never share toothpicks.",
              },
              {
                num: 2,
                title: "Add the Right Stain",
                color: "secondary",
                description:
                  "Add one drop of iodine solution for onion cells, or methylene blue for cheek cells, at the edge of the cover slip. A hydrilla leaf needs no stain because its chloroplasts are already green.",
                tip: "Stains can stain skin and clothes. Wipe spills right away.",
              },
              {
                num: 3,
                title: "Find the Cells at Low Power",
                color: "accent",
                description:
                  "Start with the 4× objective, focus with the coarse knob, then move the slide to center a clear group of cells. Switch to 10×.",
                tip: "Pick an area where cells are flat and not folded over each other.",
              },
              {
                num: 4,
                title: "Look Closer at High Power",
                color: "primary",
                description:
                  "Switch to 40× and use only the fine knob. Slowly turn it back and forth to bring different parts into focus. Adjust the diaphragm until the outline and nucleus are clear.",
                tip: "At 400× you can see the cell outline, nucleus, cytoplasm and chloroplasts, but not mitochondria or ribosomes. Be patient; a clear view can take a few minutes.",
              },
              {
                num: 5,
                title: "Draw What You See",
                color: "secondary",
                description:
                  "Use a sharp pencil to draw two or three cells inside a circle that stands for the field of view. Draw only what you actually see, not what the textbook shows.",
                tip: "Draw neat, solid lines and do not shade. Use a ruler for label lines.",
              },
              {
                num: 6,
                title: "Label and Record",
                color: "accent",
                description:
                  "Label the parts you saw (cell membrane, nucleus, cytoplasm, chloroplasts) and write the specimen name, the stain used and the total magnification, for example “Onion skin, iodine, 400×.”",
                tip: "Labels go on the right side, in straight lines that do not cross.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Good Habits When Observing",
          data: {
            intro:
              "Observing cells takes more than a microscope. These habits help you and your group do excellent work.",
            reasons: [
              {
                num: 1,
                title: "Curiosity",
                color: "primary",
                desc: "Ask questions about what you see",
                content:
                  "Why is the hydrilla cell green but the onion cell is not? Why are cheek cells round and onion cells shaped like bricks? Questions like these lead to discoveries.",
              },
              {
                num: 2,
                title: "Patience",
                color: "secondary",
                desc: "Take your time focusing",
                content:
                  "Rushing makes you turn the knobs too fast and lose the image. Go slowly, and try again if the first slide is not clear.",
              },
              {
                num: 3,
                title: "Responsibility",
                color: "accent",
                desc: "Care for the tools and clean up",
                content:
                  "Handle slides and the microscope carefully, dispose of toothpicks properly, wash your hands and return everything clean and in place.",
              },
              {
                num: 4,
                title: "Respect for Groupmates",
                color: "primary",
                desc: "Take turns and listen",
                content:
                  "Give everyone a chance to look and focus. Listen to what others notice, because a groupmate may spot something you missed.",
              },
              {
                num: 5,
                title: "Excellence",
                color: "secondary",
                desc: "Be accurate and neat",
                content:
                  "Draw carefully, label correctly and record the magnification. An accurate drawing is more valuable than a pretty one copied from a book.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Practical Scenarios",
          data: {
            intro:
              "Each situation is explained by what a cell part does or by good microscope technique.",
            scenarios: [
              {
                title: "No Green in the Onion",
                situation:
                  "Carlo sees green chloroplasts in hydrilla leaf cells, but none in the onion skin cells, even though both are plant cells.",
                question: "Why are there no chloroplasts in the onion skin?",
                skill:
                  "Onion skin comes from the bulb, which grows underground and does not get sunlight, so it does not make food by photosynthesis. Its cells have no chloroplasts. Leaf cells that receive light, like hydrilla, have many.",
              },
              {
                title: "Where Is the Nucleus?",
                situation:
                  "Rina's unstained cheek cells look almost clear, and she cannot find the nucleus.",
                question: "What should she do?",
                skill:
                  "Add a drop of methylene blue stain. The stain makes the nucleus darker so it stands out from the cytoplasm. She can also close the diaphragm a little to improve contrast.",
              },
              {
                title: "Muscle Cells Need Energy",
                situation:
                  "Heart muscle cells have many more mitochondria than skin cells.",
                question: "Why do heart muscle cells need so many mitochondria?",
                skill:
                  "Mitochondria release energy from food. The heart beats all day and night and needs a lot of energy, so its cells have many mitochondria.",
              },
              {
                title: "The Copied Drawing",
                situation:
                  "Leo could not see mitochondria in his onion cells, so he copied them from the textbook diagram into his drawing.",
                question: "Is this good scientific practice? Explain.",
                skill:
                  "No. A scientific drawing must show only what was actually observed. Mitochondria are too small to see clearly at 400× without special stains, so Leo should draw and label only the parts he really saw.",
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
                title: "Blood Tests",
                description:
                  "When you get a CBC (complete blood count) at a clinic, medical technologists count and check your blood cells, often with a microscope, to find infections or anemia.",
                icon: "🩸",
                color: "border-l-primary-500",
              },
              {
                title: "Food from Chloroplasts",
                description:
                  "The rice, vegetables and fruits we eat, and the food fish and animals eat, start with chloroplasts in plant cells turning sunlight into sugar.",
                icon: "🌾",
                color: "border-l-secondary-500",
              },
              {
                title: "Medicines That Target Germs",
                description:
                  "Some antibiotics stop the ribosomes of bacteria from making proteins. Bacterial ribosomes are different from ours, so the medicine harms the germ but not you.",
                icon: "💊",
                color: "border-l-accent-500",
              },
              {
                title: "Fitness and Health",
                description:
                  "Regular exercise helps muscle cells build more mitochondria, so the body can make energy more easily. That is one reason active people tire less quickly.",
                icon: "🏃",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
