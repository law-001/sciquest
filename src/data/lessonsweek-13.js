// Week 13: Plant and Animal Cell — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd Quarter Week 3 (site Week 13).
//   Lesson 1 — Plant and Animal Cell

import plantcell from "../assets/plantcell.png";
import microscope from "../assets/week1/Microscopic.jpg";
import globe from "../assets/week1/globe.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week13 = {
  id: "week-13",
  weekNumber: 13,
  title: "Plant and Animal Cell",
  category: "Life Science",
  description:
    "Label the major organelles of plant and animal cells, describe what each one does, compare the two kinds of cells, and observe both under a microscope.",
  icon: "Leaf",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Plant and Animal Cell
    // ═══════════════════════════════════════════════════
    {
      id: "w13-l1",
      weekId: "week-13",
      lessonNumber: 1,
      title: "Plant and Animal Cell",
      badge: "Lesson 1",
      subtitle:
        "Identify and label the cell membrane, nucleus, cytoplasm, mitochondria, chloroplasts, cell wall and vacuole, describe what each does, and compare plant and animal cells under the microscope.",
      readTime: "~16 min read",
      xp: 100,
      heroImage: plantcell,
      heroImageAlt:
        "Labeled diagram of a plant cell showing the cell wall, cell membrane, nucleus, chloroplasts, mitochondria and large central vacuole",

      signature: {
        widgetId: "cell-morph",
        heading: "Watch It: One Cell, Both Kinds",
        intro: "One slider turns an animal cell into a plant cell.",
        instruction: "Morph both ways, then flood each cell with water.",
        xp: 25,
        explainer: {
          title: "Why the wall changes everything",
          points: [
            "While you dragged the slider, the nucleus, mitochondria and ribosomes never moved. Both kinds of cell keep them.",
            "The wall, the big vacuole and the chloroplasts only grew in on the plant side of the drag.",
            "Pure water pushed into both cells. The plant cell stopped firm against its wall and the pressure climbed instead.",
            "The animal cell had only a membrane, so nothing stopped it swelling until it burst.",
          ],
        },
      },

      sections: [
        "Overview",
        "The Major Organelles",
        "Plant Cell vs. Animal Cell",
        "Observing Plant and Animal Cells",
        "Think Like a Cell Biologist",
        "Why the Differences Matter",
      ],

      references: [
        {
          label: "Britannica — Plant cell",
          url: "https://www.britannica.com/science/plant-cell",
        },
        {
          label: "Britannica — Animal cell",
          url: "https://www.britannica.com/science/animal-cell",
        },
        {
          label: "Khan Academy — Tour of a eukaryotic cell",
          url: "https://www.khanacademy.org/science/biology/structure-of-a-cell/tour-of-organelles/a/nucleus-and-ribosomes",
        },
        {
          label: "CK-12 — Plant Cells and Animal Cells",
          url: "https://www.ck12.org/c/biology/plant-cell-structures/",
        },
        {
          label: "DepEd LRMDS — Learning Resources Portal",
          url: "https://lrmds.deped.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Last week you met the main parts of a cell. This week you will look closely at two kinds of cells: the cells of plants, like kangkong, malunggay and onion, and the cells of animals, like the cells lining your own cheek.",
              "Plant and animal cells are both <strong class='text-primary-700'>eukaryotic</strong>. That means both keep their DNA inside a nucleus, and both have many of the same <strong class='text-primary-700'>organelles</strong>, the tiny parts that each do a job for the cell.",
              "But plant cells have three parts that animal cells do not: a <strong class='text-primary-700'>cell wall</strong>, <strong class='text-primary-700'>chloroplasts</strong> and one <strong class='text-primary-700'>large central vacuole</strong>. These parts fit the way a plant lives. It stays in one place, stands up without bones, and makes its own food from sunlight.",
              "Good scientists aim for <strong class='text-primary-700'>excellence</strong>: they label carefully, observe patiently and describe only what they really see. You will practice all three when you look at cells under the microscope.",
            ],
            didYouKnow:
              "If you look at a hydrilla leaf (the water plant often sold for aquariums) under a microscope, you may see its green chloroplasts slowly sliding around the edge of each cell. This movement is called cytoplasmic streaming.",
          },
        },

        {
          type: "imageCards",
          heading: "The Major Organelles",
          data: {
            cards: [
              {
                title: "Cell Membrane",
                label: "Plant and animal cells",
                variant: "primary",
                color: "primary",
                desc: "A thin, flexible layer around the cell. It controls what goes in and out, like a guard at a gate.",
                image: simulation,
                imageAlt:
                  "Close-up diagram of the thin cell membrane forming the outer edge of an animal cell",
                examples: [
                  "Lets in water, food and oxygen",
                  "Lets out wastes",
                  "In plant cells it sits just inside the cell wall",
                ],
              },
              {
                title: "Nucleus",
                label: "Plant and animal cells",
                variant: "secondary",
                color: "secondary",
                desc: "The control center of the cell. It holds the DNA, the instructions for everything the cell does.",
                image: microscope,
                imageAlt:
                  "Stained cheek cells under a microscope, each with a dark round nucleus in the middle",
                examples: [
                  "Directs growth and cell division",
                  "Usually in the center of an animal cell",
                  "Often pushed to the side by the vacuole in a plant cell",
                ],
              },
              {
                title: "Cytoplasm",
                label: "Plant and animal cells",
                variant: "accent",
                color: "accent",
                desc: "The jelly-like fluid that fills the cell. The organelles float in it, and many of the cell's chemical reactions happen here.",
                image: globe,
                imageAlt:
                  "Diagram of a cell with the jelly-like cytoplasm shaded between the membrane and the nucleus",
                examples: [
                  "Mostly water",
                  "Holds the organelles in place",
                  "Moves materials around the cell",
                ],
              },
              {
                title: "Mitochondria",
                label: "Plant and animal cells",
                variant: "primary",
                color: "primary",
                desc: "The powerhouse of the cell. Mitochondria break down food (glucose) to release the energy the cell needs.",
                image: lab,
                imageAlt:
                  "Diagram of a bean-shaped mitochondrion with folded inner membranes",
                examples: [
                  "Plants have them too, not just animals",
                  "Muscle cells have many mitochondria",
                  "Use oxygen to release energy from food",
                ],
              },
              {
                title: "Chloroplasts",
                label: "Plant cells only",
                variant: "secondary",
                color: "secondary",
                desc: "Green organelles that make food through photosynthesis. They hold chlorophyll, the pigment that traps sunlight.",
                image: plantcell,
                imageAlt:
                  "Leaf cells under a microscope packed with small green oval chloroplasts",
                examples: [
                  "Make glucose from water, carbon dioxide and sunlight",
                  "Give leaves like kangkong and malunggay their green color",
                  "Not found in onion bulb cells, which grow underground",
                ],
              },
              {
                title: "Cell Wall",
                label: "Plant cells only",
                variant: "accent",
                color: "accent",
                desc: "A stiff outer layer made of cellulose, outside the cell membrane. It gives the plant cell support and a fixed, boxy shape.",
                image: simulation,
                imageAlt:
                  "Onion skin cells under a microscope showing rectangular cells outlined by thick cell walls",
                examples: [
                  "Helps a plant stand upright without bones",
                  "Keeps the cell from bursting when it takes in water",
                  "Cotton and paper are made of cell-wall material",
                ],
              },
              {
                title: "Vacuole",
                label: "Large in plants, small in animals",
                variant: "primary",
                color: "primary",
                desc: "A sac that stores water, food and wastes. A plant cell has one large central vacuole; an animal cell has a few small ones, or none.",
                image: microscope,
                imageAlt:
                  "Diagram comparing one large central vacuole in a plant cell with several small vacuoles in an animal cell",
                examples: [
                  "A full vacuole pushes against the wall and keeps the plant firm",
                  "Can fill up to about 90% of a plant cell",
                  "When it loses water, the plant wilts",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Plant Cell vs. Animal Cell",
          data: {
            intro:
              "First, how they are alike: both are eukaryotic, and both have a cell membrane, cytoplasm, a nucleus, mitochondria and ribosomes. Plant cells need mitochondria too, to release energy from the food their chloroplasts make. Here are the main differences you should be able to see and explain. (Animal cells have centrioles, which most plant cells lack.)",
            left: {
              label: "Plant Cell",
              color: "primary",
              items: [
                "Has a cell wall outside the cell membrane",
                "Has chloroplasts, so it can make its own food",
                "Has one large central vacuole",
                "Has a fixed, boxy or rectangular shape",
                "Nucleus is often pushed to one side by the vacuole",
                "Stores extra food as starch",
              ],
            },
            right: {
              label: "Animal Cell",
              color: "secondary",
              items: [
                "Has only a cell membrane, no cell wall",
                "Has no chloroplasts, so it gets food by eating",
                "Has a few small vacuoles, or none",
                "Has a round or irregular shape that can change",
                "Nucleus is usually near the center",
                "Has centrioles, which help during cell division",
              ],
            },
          },
        },

        {
          type: "timeline",
          heading: "Observing Plant and Animal Cells",
          data: {
            intro:
              "You can see the differences yourself with a compound microscope, an onion and a clean cotton swab. Handle the microscope with two hands and follow each step carefully.",
            steps: [
              {
                num: 1,
                title: "Prepare an Onion Skin Slide (Plant Cell)",
                color: "primary",
                description:
                  "Peel the thin, clear skin from the inside of one onion layer. Lay it flat in a drop of water on a clean slide, add one drop of iodine stain, and lower a cover slip at an angle so no air bubbles form.",
                tip: "Iodine makes the cell walls and nuclei easier to see. Wipe up spills right away, because iodine stains skin and clothes.",
              },
              {
                num: 2,
                title: "Prepare a Cheek Cell Slide (Animal Cell)",
                color: "secondary",
                description:
                  "Gently rub the inside of your cheek with a clean cotton swab. Smear it on a drop of water on a new slide, add one drop of methylene blue stain, and cover with a cover slip.",
                tip: "Use your own swab only, and throw it away after use. Never share swabs.",
              },
              {
                num: 3,
                title: "Start on Low Power",
                color: "accent",
                description:
                  "Place the slide on the stage and start with the low-power objective (4× or 10×). Focus with the coarse adjustment knob, then move the slide until you find a clear group of cells.",
                tip: "Low power shows more cells at once, so it is easier to find a good spot.",
              },
              {
                num: 4,
                title: "Switch to High Power",
                color: "primary",
                description:
                  "Turn to the high-power objective (40×) and focus with the fine adjustment knob only. At 400× total magnification you can see the cell wall, cell membrane, nucleus and cytoplasm.",
                tip: "Never use the coarse knob on high power. It can push the lens into the slide and crack it.",
              },
              {
                num: 5,
                title: "Draw, Label and Compare",
                color: "secondary",
                description:
                  "Draw two or three cells from each slide in pencil. Label only the parts you can really see, and write the total magnification under each drawing. Then list how the onion cells and cheek cells are alike and different.",
                tip: "Onion cells look like neat bricks with thick walls. Cheek cells look like flat, rounded shapes with a dark nucleus. You will not see mitochondria at 400×: they are too small.",
              },
              {
                num: 6,
                title: "Performance Task 1: Observing Specimens",
                color: "accent",
                description:
                  "For your first performance task this quarter, you will observe prepared slides of plant and animal cells, then draw, label and compare them. Scoring (100 points): Microscope Use 30, Cell Drawings and Labels 20, Comparison of Plant and Animal Cells 20, Scientific Explanation 20, Presentation and Organization 10.",
                tip: "Label only what you really see, explain what each visible organelle does, and say why the plant cell has parts the animal cell does not.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Think Like a Cell Biologist",
          data: {
            intro:
              "Use what you know about organelles to explain each situation.",
            scenarios: [
              {
                title: "Wilted Pechay at the Palengke",
                situation:
                  "A vendor at the palengke sprinkles water on her pechay and kangkong every few hours. Bundles that are not sprinkled turn limp by noon.",
                question:
                  "Which organelle explains why the vegetables go limp, and why does sprinkling water help?",
                skill:
                  "The large central vacuole. When it loses water, it stops pushing against the cell wall, so the cells and the leaves go limp. Water refills the vacuoles, they press against the walls again, and the leaves become crisp.",
              },
              {
                title: "Is It a Plant Cell?",
                situation:
                  "Under the microscope, Miguel sees cells with a boxy shape, thick outer walls and a nucleus pushed to one side. He sees no green parts at all.",
                question:
                  "Could these still be plant cells? What could they be?",
                skill:
                  "Yes. The cell wall, the boxy shape and the nucleus at the side are signs of plant cells. They have no chloroplasts because they come from a part that gets no sunlight, such as an onion bulb.",
              },
              {
                title: "Mitochondria in Plants",
                situation:
                  "A classmate says, “Plants have chloroplasts, so they do not need mitochondria. Only animals have mitochondria.”",
                question: "Is your classmate correct? Explain.",
                skill:
                  "No. Chloroplasts make food (glucose), but mitochondria are still needed to release the energy stored in that food. Both plant and animal cells have mitochondria.",
              },
              {
                title: "Cells in Plain Water",
                situation:
                  "A plant cell and an animal cell are both placed in pure water, and water moves into both.",
                question: "What happens to each cell, and which part makes the difference?",
                skill:
                  "The plant cell swells until it presses firmly against its cell wall, then stops, so it stays safe. The animal cell has no wall, so it can keep swelling until it bursts. The cell wall makes the difference.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Why the Differences Matter",
          data: {
            apps: [
              {
                title: "Fresh Vegetables",
                description:
                  "Keeping leafy vegetables in a cool, moist place stops their vacuoles from drying out, so pechay and lettuce stay crisp longer.",
                icon: "🥬",
                color: "border-l-primary-500",
              },
              {
                title: "Food for Everyone",
                description:
                  "Chloroplasts in rice, corn and vegetable leaves make the food that feeds people and animals. Without them, food chains would have no starting point.",
                icon: "🌾",
                color: "border-l-secondary-500",
              },
              {
                title: "Cotton, Paper and Abaca",
                description:
                  "Cotton, paper and abaca (Manila hemp) fibers are made mostly of cellulose from plant cell walls.",
                icon: "🧵",
                color: "border-l-accent-500",
              },
              {
                title: "Excellence in Observation",
                description:
                  "Doctors and medical technologists study stained cells under microscopes to find disease. Careful, honest drawings and labels in class build the same habit of accuracy.",
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
