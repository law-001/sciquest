// Week 16: Science Fair and Fertilization — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd Quarter Week 6 (site Week 16).
//   Lesson 1 — 2nd Performance Task in Science 7: Math and Science Fair 2025
//   Lesson 2 — Fertilization

import classroom from "../assets/classroom.webp";
import microscope from "../assets/week1/Microscopic.jpg";
import simulation from "../assets/week1/simulation.jpg";
import globe from "../assets/week1/globe.jpg";
import lab from "../assets/lab.jpg";
import celldivision from "../assets/celldivision.png";
import foodchain from "../assets/foodchain.png";

export const week16 = {
  id: "week-16",
  weekNumber: 16,
  title: "Science Fair and Fertilization",
  category: "Life Science",
  description:
    "Build and present a science fair exhibit with your team, then learn how a sperm cell and an egg cell join to start a new living thing.",
  icon: "Heart",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — 2nd Performance Task: Math and Science Fair 2025
    // ═══════════════════════════════════════════════════
    {
      id: "w16-l1",
      weekId: "week-16",
      lessonNumber: 1,
      title: "2nd Performance Task in Science 7: Math and Science Fair 2025",
      badge: "Performance Task",
      subtitle:
        "Work with your team to build an exhibit, experiment or model that uses what you learned this quarter, then explain it clearly and confidently at the fair.",
      readTime: "~14 min read",
      xp: 100,
      heroImage: classroom,
      heroImageAlt:
        "Students standing beside their science fair exhibits and models in a school gym",

      sections: [
        "The Task",
        "Choosing Your Project",
        "Building Your Exhibit as a Team",
        "Team Roles",
        "Make It Original and Green",
        "Presenting Your Exhibit",
        "How You Will Be Graded",
        "Tips for Fair Day",
      ],

      references: [
        {
          label: "Science Buddies — Science Fair Project Guide",
          url: "https://www.sciencebuddies.org/science-fair-projects/science-fair",
        },
        {
          label: "Science Buddies — Display Board Tips",
          url: "https://www.sciencebuddies.org/science-fair-projects/project-display-boards",
        },
        {
          label: "DOST Science Education Institute — Science and Technology Programs",
          url: "https://www.sei.dost.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "The Task",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>Math and Science Fair 2025</strong> is your 2nd Performance Task. With your group, you will make an <strong class='text-primary-700'>exhibit, experiment or model</strong> that explains one science idea you learned this quarter, and then present it to visitors.",
              "<strong class='text-primary-700'>GRASPS:</strong> Your <strong class='text-primary-700'>goal</strong> is to design and present a creative, informative exhibit that explains one concept accurately. Your <strong class='text-primary-700'>role</strong> is a young scientist representing your class. Your <strong class='text-primary-700'>audience</strong> is your classmates, teachers, school administrators and fair visitors. The <strong class='text-primary-700'>situation</strong>: you show a model, experiment or visual display on a topic such as cell structure or ecosystems, and you explain how it works and why it matters. Your <strong class='text-primary-700'>product</strong> is the exhibit plus a short oral explanation.",
              "Topics can come from anything this quarter: the <strong class='text-primary-700'>microscope</strong>, the <strong class='text-primary-700'>cell</strong> and its parts, plant and animal cells, <strong class='text-primary-700'>mitosis and meiosis</strong>, reproduction, or <strong class='text-primary-700'>ecosystems</strong>. Be <strong class='text-primary-700'>reliable</strong>: make your own original project, and choose materials and ideas that help people care for the environment.",
            ],
            didYouKnow:
              "Every year, Filipino high school students compete in the National Science and Technology Fair (NSTF), and winners can represent the country at international science fairs. Many of them started with a simple school exhibit like yours.",
          },
        },

        {
          type: "imageCards",
          heading: "Choosing Your Project",
          data: {
            cards: [
              {
                title: "3D Cell Model",
                label: "Model",
                variant: "primary",
                color: "primary",
                desc: "Build a plant cell or an animal cell from recycled materials. Label each organelle and explain what it does.",
                image: celldivision,
                imageAlt:
                  "Student-made 3D model of a plant cell built from recycled materials with labeled organelles",
                examples: [
                  "Plastic container as the cell wall of a plant cell",
                  "Bottle caps as mitochondria, a ping-pong ball as the nucleus",
                  "Show what makes plant and animal cells different",
                ],
              },
              {
                title: "Cells Under the Microscope",
                label: "Exhibit",
                variant: "secondary",
                color: "secondary",
                desc: "Prepare slides of onion skin or kangkong leaf, show your labeled drawings, and let visitors look through the microscope.",
                image: microscope,
                imageAlt:
                  "Compound microscope on a table beside labeled drawings of onion skin cells",
                examples: [
                  "Explain the parts of the microscope you used",
                  "Compare what you see at low power and high power",
                ],
              },
              {
                title: "Mitosis or Meiosis Model",
                label: "Model",
                variant: "primary",
                color: "primary",
                desc: "Use clay, yarn or pipe cleaners to show each stage of cell division, step by step.",
                image: simulation,
                imageAlt:
                  "Clay and pipe-cleaner model showing the stages of mitosis in a row",
                examples: [
                  "Use two colors for chromosomes from each parent",
                  "Explain why mitosis makes identical cells and meiosis does not",
                ],
              },
              {
                title: "Grow Plants Without Seeds",
                label: "Experiment",
                variant: "secondary",
                color: "secondary",
                desc: "Grow kangkong or kamote from stem cuttings and record how fast the roots grow under different conditions.",
                image: lab,
                imageAlt:
                  "Kangkong stem cuttings in clear cups of water with new white roots",
                examples: [
                  "Change one thing only, such as light or amount of water",
                  "Measure root length in centimeters every two days",
                ],
              },
              {
                title: "Local Ecosystem Display",
                label: "Visual Display",
                variant: "primary",
                color: "primary",
                desc: "Show the food web of a rice field, mangrove forest or coral reef and explain why each organism matters.",
                image: foodchain,
                imageAlt:
                  "Poster of a mangrove food web with arrows from mangrove leaves to crabs, fish and birds",
                examples: [
                  "Mangroves, crabs, fish and herons",
                  "Add a message on protecting the ecosystem",
                ],
              },
              {
                title: "Microscope Through Time",
                label: "Visual Display",
                variant: "secondary",
                color: "secondary",
                desc: "Make a timeline of early scientists such as Hooke and Leeuwenhoek and show how their discoveries led to the cell theory.",
                image: globe,
                imageAlt:
                  "Timeline poster of early microscopes and the scientists who used them",
                examples: [
                  "Include a simple model of Leeuwenhoek's microscope",
                  "Explain how microscopes help doctors today",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Building Your Exhibit as a Team",
          data: {
            intro:
              "Work in your group from start to finish. Every member should help plan, build and explain the exhibit.",
            steps: [
              {
                num: 1,
                title: "Pick One Clear Concept",
                color: "primary",
                description:
                  "As a group, choose one idea from this quarter that you can explain well. Write it as one sentence, for example: “Plant cells have a cell wall and chloroplasts, but animal cells do not.”",
                tip: "One idea explained well beats five ideas explained poorly. Ask your teacher to approve your topic.",
              },
              {
                num: 2,
                title: "Check the Science",
                color: "secondary",
                description:
                  "Read your lessons and at least two reliable sources, such as your textbook, DepEd learning materials or Britannica. Write down every fact you will use and where you got it.",
                tip: "Your exhibit is worth 40 points for correct science, so check every label and number twice.",
              },
              {
                num: 3,
                title: "Plan and Divide the Work",
                color: "accent",
                description:
                  "Sketch your exhibit on paper. List the materials you need and give each member a job. Set a deadline for each part.",
                tip: "If you are doing an experiment, name the one thing you will change, the one thing you will measure, and everything you will keep the same.",
              },
              {
                num: 4,
                title: "Build and Test",
                color: "primary",
                description:
                  "Build your model or run your experiment. Record measurements in standard units (cm, mL, g, °C) in a data table. Test that your model is sturdy and every label is easy to read.",
                tip: "Take photos while you work. They show visitors that the project is your own.",
              },
              {
                num: 5,
                title: "Write Your Display",
                color: "secondary",
                description:
                  "Add a title, a short explanation of the concept, labels, and, for experiments, your data table, graph and conclusion. Use big, clear letters.",
                tip: "Visitors should understand your main idea in 10 seconds just by looking.",
              },
              {
                num: 6,
                title: "Practice Together",
                color: "accent",
                description:
                  "Practice your explanation as a group. Decide who explains which part, then practice in front of a classmate or family member who does not know the topic.",
                tip: "Each member should be able to explain the whole exhibit, not just their own part.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Team Roles",
          isSubsection: true,
          data: {
            intro:
              "Good teams share the work fairly. Here are roles your group can use. In a small group, one member can take two roles.",
            reasons: [
              {
                num: 1,
                title: "Leader",
                color: "primary",
                desc: "Keeps the team on schedule",
                content:
                  "Runs short meetings, checks that every job is moving, and makes sure every member's ideas are heard.",
              },
              {
                num: 2,
                title: "Science Checker",
                color: "secondary",
                desc: "Makes sure the facts are right",
                content:
                  "Reads the sources, checks every label and number on the exhibit, and keeps the list of references.",
              },
              {
                num: 3,
                title: "Builder",
                color: "accent",
                desc: "Turns the plan into a model or setup",
                content:
                  "Gathers the materials and leads the building or the experiment. Makes sure everything is safe and sturdy.",
              },
              {
                num: 4,
                title: "Designer",
                color: "primary",
                desc: "Makes the display clear and attractive",
                content:
                  "Plans the layout, lettering and colors so that visitors can read the display from about two meters away.",
              },
              {
                num: 5,
                title: "Speaker",
                color: "secondary",
                desc: "Leads the oral explanation",
                content:
                  "Opens the presentation and passes parts of it to teammates. Every member still speaks and answers questions.",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Make It Original and Green",
          isSubsection: true,
          data: {
            concepts: [
              "Make your own exhibit. Do not copy or buy a ready-made project. Visitors and judges can tell.",
              "Give credit to every source you used, including pictures you printed.",
              "Use recycled materials when you can: plastic bottles, bottle caps, cardboard, old magazines and scrap cloth.",
              "Avoid single-use plastic and glitter that ends up as trash after the fair.",
              "Add one message that helps people care for the environment, such as protecting mangroves or not wasting water.",
              "After the fair, take your exhibit apart and recycle or reuse the materials.",
            ],
          },
        },

        {
          type: "timeline",
          heading: "Presenting Your Exhibit",
          data: {
            intro:
              "Your oral explanation should take about two minutes. Follow this order so visitors can follow your idea.",
            steps: [
              {
                num: 1,
                title: "Greet and Introduce",
                color: "primary",
                description:
                  "Smile, greet the visitor, and say your group's names and your topic in one sentence.",
                tip: "“Good morning! We are Group 3, and our model shows how a plant cell is different from an animal cell.”",
              },
              {
                num: 2,
                title: "Explain the Science",
                color: "secondary",
                description:
                  "Point to your model or display as you explain. Use the correct science words, such as “nucleus,” “chloroplast” or “trophic level,” and say what each one means.",
                tip: "Point and explain at the same time. It helps visitors see what you mean.",
              },
              {
                num: 3,
                title: "Show How It Works",
                color: "accent",
                description:
                  "Demonstrate your model or share your results. For an experiment, state what you changed, what you measured and what you found.",
                tip: "Know your key numbers by heart so you don't have to read them from the board.",
              },
              {
                num: 4,
                title: "Say Why It Matters",
                color: "primary",
                description:
                  "Connect your topic to real life in the Philippines, such as health, farming, fishing or caring for the environment.",
                tip: "This is where your environmental message fits best.",
              },
              {
                num: 5,
                title: "Answer Questions",
                color: "secondary",
                description:
                  "Listen to the whole question, then answer calmly. If you don't know, say so honestly and explain how you could find out.",
                tip: "“We're not sure, but we could test it by…” is a good scientific answer.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "How You Will Be Graded",
          data: {
            intro:
              "Your exhibit is graded out of 100 points. Correct science is worth the most, so check your facts before you decorate.",
            left: {
              label: "Science and Design — 70 points",
              color: "primary",
              items: [
                "Application of Scientific Concepts (40 pts): the concept is correct, clearly explained and uses what you learned this quarter",
                "Labels, terms and data are accurate",
                "Creativity, Design and Organization (30 pts): the exhibit is original, neat and easy to follow",
                "Materials are used wisely, with recycled materials where possible",
              ],
            },
            right: {
              label: "Teamwork and Communication — 30 points",
              color: "secondary",
              items: [
                "Collaboration and Teamwork (15 pts): every member contributed and the work was shared fairly",
                "The team helped and respected one another",
                "Communication and Presentation Skills (15 pts): explanation is clear, confident and well organized",
                "Questions are answered correctly and honestly",
              ],
            },
          },
        },

        {
          type: "applications",
          heading: "Tips for Fair Day",
          data: {
            apps: [
              {
                title: "Arrive Early",
                description:
                  "Bring tape, scissors and extra labels. Set up before visitors arrive, then check that every part of the exhibit is in place.",
                icon: "⏰",
                color: "border-l-primary-500",
              },
              {
                title: "Stand Beside Your Exhibit",
                description:
                  "Stay at your table, face the visitors and invite them to look closer. A friendly “Can we show you our model?” works well.",
                icon: "🙋",
                color: "border-l-secondary-500",
              },
              {
                title: "Speak Clearly",
                description:
                  "Talk loudly enough for the whole group of visitors to hear, and not too fast. Look at your audience, not at the board.",
                icon: "🗣️",
                color: "border-l-accent-500",
              },
              {
                title: "Visit Other Exhibits",
                description:
                  "Take turns watching your table so everyone can visit other groups. Ask them good questions, just as you hope visitors will ask you.",
                icon: "🔍",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Fertilization
    // ═══════════════════════════════════════════════════
    {
      id: "w16-l2",
      weekId: "week-16",
      lessonNumber: 2,
      title: "Fertilization",
      badge: "Lesson 2",
      subtitle:
        "Learn how a sperm cell and an egg cell fuse into one new cell, compare internal and external fertilization, and see how 23 + 23 brings back the full set of 46 chromosomes.",
      readTime: "~15 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt:
        "Microscope image of many sperm cells surrounding a much larger egg cell",

      signature: {
        widgetId: "fusion-bench",
        heading: "Watch It: Build a Zygote",
        intro: "The zygote's chromosome count is just the two cells added up.",
        instruction: "Make a real zygote, then make one that fails",
        xp: 25,
        explainer: {
          title: "Why 23 plus 23 works",
          points: [
            "You drove two half sets together, and the new cell ended up with 46, one full set.",
            "The fertilization membrane closed the moment they fused, so no second sperm could get in.",
            "Your zygote kept dividing, and every new cell still held 46, because mitosis copies rather than adds.",
            "A body cell gave 69, a whole extra set, and no amount of dividing could fix that.",
          ],
        },
      },

      sections: [
        "Overview",
        "Meet the Gametes",
        "Steps of Fertilization",
        "Restoring the Diploid Number",
        "Internal vs. External Fertilization",
        "Fertilization at Work",
        "Illustrate Fertilization",
        "Think About It",
      ],

      references: [
        {
          label: "Britannica — Fertilization",
          url: "https://www.britannica.com/science/fertilization-reproduction",
        },
        {
          label: "CK-12 — Fertilization",
          url: "https://www.ck12.org/c/biology/fertilization/",
        },
        {
          label: "Khan Academy — Fertilization and development",
          url: "https://www.khanacademy.org/science/biology/developmental-biology",
        },
        {
          label: "Philippine Carabao Center — Official Website",
          url: "https://www.pcc.gov.ph/",
        },
        {
          label: "BFAR — National Freshwater Fisheries Technology Center",
          url: "https://www.bfar.da.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Fertilization</strong> is the joining, or fusion, of a male sex cell and a female sex cell. The male sex cell is the <strong class='text-primary-700'>sperm</strong>, and the female sex cell is the <strong class='text-primary-700'>egg</strong>. Together, they form one new cell called a <strong class='text-primary-700'>zygote</strong>, the first cell of a new living thing.",
              "Sex cells are also called <strong class='text-primary-700'>gametes</strong>. You learned last week that meiosis makes gametes with only half the usual number of chromosomes. In humans, each gamete has <strong class='text-primary-700'>23</strong>. At fertilization, 23 from the sperm plus 23 from the egg gives the zygote the full set of <strong class='text-primary-700'>46</strong>.",
              "Fertilization happens in animals and in plants. A carabao calf, a chick inside an egg, a tilapia fry and a mango seed all began as a single fertilized cell. Knowing how fertilization works lets people <strong class='text-primary-700'>serve</strong> others, for example by helping farmers breed healthier animals and helping fish hatcheries grow more fish for food.",
            ],
            didYouKnow:
              "The human egg cell is one of the largest cells in the body. It is about 0.1 mm across, just big enough to see as a tiny dot without a microscope. A sperm cell is much smaller, and its head is only about 0.005 mm long.",
          },
        },

        {
          type: "imageCards",
          heading: "Meet the Gametes",
          data: {
            cards: [
              {
                title: "Sperm Cell",
                label: "Male gamete (animals)",
                variant: "primary",
                color: "primary",
                desc: "A tiny cell with a head that holds the nucleus and a long tail called a flagellum that lets it swim toward the egg.",
                image: simulation,
                imageAlt:
                  "Labeled diagram of a sperm cell showing the head, midpiece and tail",
                examples: [
                  "Carries half the father's chromosomes (23 in humans)",
                  "Made in very large numbers",
                  "The midpiece has many mitochondria for energy to swim",
                ],
              },
              {
                title: "Egg Cell",
                label: "Female gamete (animals)",
                variant: "secondary",
                color: "secondary",
                desc: "A large, round cell that cannot move on its own. It holds the nucleus and stored food for the early embryo.",
                image: globe,
                imageAlt:
                  "Labeled diagram of a round egg cell with its nucleus, cytoplasm and outer layer",
                examples: [
                  "Carries half the mother's chromosomes (23 in humans)",
                  "Much bigger than a sperm cell",
                  "The yolk of a chicken egg is stored food for the chick",
                ],
              },
              {
                title: "Pollen Grain",
                label: "Male gamete carrier (plants)",
                variant: "primary",
                color: "primary",
                desc: "In flowering plants, pollen made in the anther carries the male sex cells. Wind, insects or birds move it to a flower's stigma.",
                image: lab,
                imageAlt:
                  "Close-up of yellow pollen grains on the anthers of a gumamela flower",
                examples: [
                  "A bee carries pollen from flower to flower",
                  "Pollen grows a tube down to the egg cell",
                ],
              },
              {
                title: "Ovule",
                label: "Holds the egg cell (plants)",
                variant: "secondary",
                color: "secondary",
                desc: "The ovule sits inside the ovary of a flower and holds the plant's egg cell. After fertilization, the ovule becomes a seed.",
                image: classroom,
                imageAlt:
                  "Cut-open flower showing the ovary with small ovules inside",
                examples: [
                  "Fertilized ovule → seed",
                  "Ovary around it → fruit, like a mango or a pod of sitaw",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Steps of Fertilization",
          data: {
            intro:
              "Fertilization follows the same order in most animals. Here are the steps from the sperm's journey to the start of a new organism.",
            steps: [
              {
                num: 1,
                title: "Sperm Swim Toward the Egg",
                color: "primary",
                description:
                  "Many sperm cells swim toward the egg using their tails. In internal fertilization, they travel inside the female's body. In external fertilization, they swim through water.",
                tip: "Only a few of the many sperm released ever reach the egg.",
              },
              {
                num: 2,
                title: "One Sperm Enters the Egg",
                color: "secondary",
                description:
                  "One sperm attaches to the outer layer of the egg and breaks through. Its nucleus moves into the egg.",
                tip: "Right away, a fertilization membrane forms around the egg and blocks every other sperm.",
              },
              {
                num: 3,
                title: "The Two Nuclei Fuse",
                color: "accent",
                description:
                  "The sperm's nucleus and the egg's nucleus join into one nucleus. The chromosomes from the father and the mother are now together in one cell.",
                tip: "This fusion is the actual moment of fertilization.",
              },
              {
                num: 4,
                title: "A Zygote Forms",
                color: "primary",
                description:
                  "The fertilized egg is now a zygote. It is diploid, so it has the full number of chromosomes, half from each parent.",
                tip: "In humans, the zygote has 46 chromosomes: 23 from the sperm and 23 from the egg.",
              },
              {
                num: 5,
                title: "The Zygote Divides and Grows",
                color: "secondary",
                description:
                  "The zygote divides by mitosis into 2 cells, then 4, then 8, and so on. The growing group of cells is called an embryo. Its cells later become skin, muscle, nerve and other kinds of cells.",
                tip: "From here on, mitosis does the work, so every body cell gets the same 46 chromosomes.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Restoring the Diploid Number",
          data: {
            intro:
              "A body cell is diploid (2n): it has two sets of chromosomes. A gamete is haploid (n): it has only one set. Fertilization brings the two sets back together.",
            reasons: [
              {
                num: 1,
                title: "Meiosis Halves the Number",
                color: "primary",
                desc: "46 → 23",
                content:
                  "When the body makes sperm or egg cells, meiosis cuts the chromosome number in half. Each human gamete gets 23 chromosomes, one from each pair.",
              },
              {
                num: 2,
                title: "Fertilization Doubles It Back",
                color: "secondary",
                desc: "23 + 23 = 46",
                content:
                  "When the sperm and egg fuse, their chromosomes add up. The zygote has 23 pairs, or 46 chromosomes, the same number as the parents' body cells.",
              },
              {
                num: 3,
                title: "Why Halving Is Needed",
                color: "accent",
                desc: "Without meiosis, the number would keep doubling",
                content:
                  "If gametes had 46 chromosomes, the zygote would have 92, and the next generation would have 184. Halving first and joining later keeps the number the same in every generation.",
              },
              {
                num: 4,
                title: "Every Species Has Its Own Number",
                color: "primary",
                desc: "The rule works for all of them",
                content:
                  "A dog's body cells have 78 chromosomes, so its gametes have 39. Rice plants have 24, so their gametes have 12. Corn has 20, so its gametes have 10.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Internal vs. External Fertilization",
          data: {
            intro:
              "Both kinds join a sperm and an egg. The difference is WHERE it happens: inside the female's body or outside it, usually in water.",
            left: {
              label: "Internal Fertilization",
              color: "primary",
              items: [
                "Happens inside the female's body",
                "Sperm do not need to swim through open water",
                "Fewer eggs are made, but each one is well protected",
                "The young grow inside the mother or inside a shelled egg",
                "Examples: carabao, dog, chicken, snake, humans",
              ],
            },
            right: {
              label: "External Fertilization",
              color: "secondary",
              items: [
                "Happens outside the body, usually in water",
                "Water lets the sperm swim to the eggs",
                "Many eggs are released at once, because most get eaten or die",
                "Eggs and young are not protected by the parent's body",
                "Examples: tilapia, bangus (milkfish), frogs in rice fields, sea urchins",
              ],
            },
          },
        },

        {
          type: "applications",
          heading: "Fertilization at Work",
          isSubsection: true,
          data: {
            apps: [
              {
                title: "Better Carabaos for Farmers",
                description:
                  "The Philippine Carabao Center uses artificial insemination, placing sperm from strong, high-milk breeds into female carabaos, so farmers get calves that give more milk.",
                icon: "🐃",
                color: "border-l-primary-500",
              },
              {
                title: "Fish Hatcheries",
                description:
                  "In bangus and tilapia hatcheries, eggs are fertilized in water tanks. Because fertilization is external, workers can protect the eggs and raise many young fish for fishponds.",
                icon: "🐟",
                color: "border-l-secondary-500",
              },
              {
                title: "Seeds for Our Food",
                description:
                  "Every grain of rice and every mango seed is a fertilized ovule. Farmers depend on pollination and fertilization for each harvest.",
                icon: "🌾",
                color: "border-l-accent-500",
              },
              {
                title: "Helping Families",
                description:
                  "Doctors who study fertilization can help couples who have trouble having children, a service that brings joy to many families.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Illustrate Fertilization",
          data: {
            intro:
              "Show the steps of fertilization with a diagram or a clay model. Use two colors so you can see which chromosomes came from each parent.",
            steps: [
              {
                num: 1,
                title: "Prepare Your Materials",
                color: "primary",
                description:
                  "You need paper and colored pens, or clay in three colors: one for the cells, one for the father's chromosomes (blue) and one for the mother's chromosomes (red).",
                tip: "Small sticks of clay or short pieces of yarn work well as chromosomes.",
              },
              {
                num: 2,
                title: "Draw or Build the Gametes",
                color: "secondary",
                description:
                  "Make a small sperm cell with a head and a tail, and a large round egg cell. Put 3 blue chromosomes in the sperm's head and 3 red chromosomes in the egg's nucleus.",
                tip: "We use 3 instead of 23 to keep the model simple. Label it “n = 3.”",
              },
              {
                num: 3,
                title: "Show the Sperm Entering",
                color: "accent",
                description:
                  "In the next picture, show one sperm entering the egg. Draw a line around the egg for the fertilization membrane, and show the other sperm blocked outside.",
                tip: "Add arrows to show the direction the sperm moves.",
              },
              {
                num: 4,
                title: "Show the Zygote",
                color: "primary",
                description:
                  "Show one cell with one nucleus that holds 3 blue and 3 red chromosomes. Label it “zygote, 2n = 6.”",
                tip: "Point out that the pairs are now complete: one from each parent.",
              },
              {
                num: 5,
                title: "Show the First Divisions",
                color: "secondary",
                description:
                  "Draw the zygote dividing by mitosis into 2 cells and then 4 cells. Each new cell still has 3 blue and 3 red chromosomes.",
                tip: "Write a caption under each picture so anyone can follow your steps.",
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
              "Use what you learned to answer each question. Then check the model answer.",
            scenarios: [
              {
                title: "Frog Eggs in the Rice Field",
                situation:
                  "During the rainy season, Ana sees clumps of frog eggs floating in a flooded rice field. There are hundreds of tiny eggs in each clump.",
                question:
                  "What kind of fertilization do frogs use, and why do they lay so many eggs?",
                skill:
                  "Frogs use external fertilization. The female lays eggs in the water and the male releases sperm over them. Many eggs are laid because the eggs are not protected, so many are eaten or die before they grow up.",
              },
              {
                title: "A Chicken Egg",
                situation:
                  "A hen lays an egg with a hard shell. Later, a chick hatches from it.",
                question:
                  "Was this fertilization internal or external? Explain.",
                skill:
                  "Internal. The sperm fertilized the egg inside the hen's body before the shell formed around it. The shell then protected the growing chick until it hatched.",
              },
              {
                title: "Counting Chromosomes",
                situation:
                  "A carabao's body cells have 48 chromosomes.",
                question:
                  "How many chromosomes are in a carabao's egg cell, and how many are in a carabao zygote?",
                skill:
                  "The egg cell has 24 chromosomes, half the body-cell number, because it was made by meiosis. The zygote has 48: 24 from the sperm plus 24 from the egg.",
              },
              {
                title: "Only One Sperm",
                situation:
                  "Millions of sperm may reach the area around an egg, but only one fertilizes it.",
                question:
                  "What would go wrong if two sperm entered the egg, and what prevents it?",
                skill:
                  "The zygote would get an extra set of chromosomes (23 + 23 + 23 = 69 in humans), and it could not develop normally. The fertilization membrane forms right after the first sperm enters and blocks the others.",
              },
            ],
          },
        },
      ],
    },
  ],
};
