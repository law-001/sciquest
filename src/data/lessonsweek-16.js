// Week 16: Science Fair and Fertilization — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd term Week 16.
//   Lesson 1 — 2nd Performance Task in Science 7: Math and Science Fair 2025
//   Lesson 2 — Fertilization

import classroom from "../assets/classroom.webp";
import microscope from "../assets/week1/Microscopic.jpg";

export const week16 = {
  id: "week-16",
  weekNumber: 16,
  title: "Science Fair and Fertilization",
  category: "Life Science",
  description:
    "Plan and build an investigation for the Math and Science Fair, then study fertilization — the moment two gametes fuse and a new organism begins.",
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
        "Design, run, and present your own scientific investigation — bringing together everything you have learned about the scientific method, measurement, and data.",
      readTime: "~15 min read",
      xp: 100,
      heroImage: classroom,
      heroImageAlt:
        "Classroom set up with student science fair project displays",

      sections: [
        "The Task",
        "Choosing Your Project",
        "What You Will Need",
        "Building Your Project",
        "Your Display Board",
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
      ],

      layout: [
        {
          type: "intro",
          heading: "The Task",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>Math and Science Fair 2025</strong> is your chance to run a real investigation from beginning to end. You choose the question, design the experiment, collect the data, analyse it, and present your conclusions to judges and classmates.",
              "This task pulls together everything from the first term: the <strong class='text-primary-700'>steps of scientific investigation</strong> from Week 5, controlling <strong class='text-primary-700'>variables</strong> for a fair test, accurate <strong class='text-primary-700'>measurement</strong> in SI units, and honest <strong class='text-primary-700'>data recording</strong>. The science content can come from any topic you have studied.",
              "You will produce three things: a working investigation, a <strong class='text-primary-700'>display board</strong>, and a short <strong class='text-primary-700'>oral presentation</strong> explaining what you did and what you found.",
            ],
            didYouKnow:
              "Many working scientists trace their careers to a school science fair. The point is not to discover something nobody knows — it is to experience the full process of finding something out for yourself.",
          },
        },

        {
          type: "reasonCards",
          heading: "Choosing Your Project",
          data: {
            intro:
              "A good science fair question is testable, safe, and genuinely interesting to you. Here are five directions drawn from topics you have already studied.",
            reasons: [
              {
                num: 1,
                title: "States of Matter",
                color: "primary",
                desc: "Investigate what changes a melting or freezing point",
                content:
                  "Which substance melts ice fastest — table salt, sugar, or sand? Measure the time to melt equal ice cubes with equal masses of each, keeping temperature constant.",
              },
              {
                num: 2,
                title: "Solubility and Concentration",
                color: "secondary",
                desc: "Test what controls how much or how fast something dissolves",
                content:
                  "Does water temperature change how much sugar can dissolve? Measure the maximum mass that dissolves in a fixed volume at 10, 30, 50, and 70 °C, then plot a solubility curve.",
              },
              {
                num: 3,
                title: "Acids and Bases",
                color: "accent",
                desc: "Measure pH effects on something you can observe",
                content:
                  "Does the pH of water affect how fast a bean seed germinates? Water identical seed trays with solutions at different pH and count germinated seeds each day.",
              },
              {
                num: 4,
                title: "Cells and Living Things",
                color: "primary",
                desc: "Investigate a living process you can measure",
                content:
                  "Does light colour affect plant growth? Grow identical seedlings under red, blue, and white light, measuring height every day for two weeks.",
              },
              {
                num: 5,
                title: "Everyday Science",
                color: "secondary",
                desc: "Test a claim somebody makes about a household product",
                content:
                  "Which brand of paper towel absorbs the most water? Measure the mass of water absorbed by equal-sized pieces of three brands, repeating each test five times.",
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
                term: "A testable question",
                desc: "Specific enough to answer with one experiment. 'Does X affect Y?' is the right shape. 'How does nature work?' is not.",
              },
              {
                term: "A written hypothesis",
                desc: "An 'If… then… because…' prediction based on what you already know, written BEFORE you collect any data.",
              },
              {
                term: "Materials you can actually obtain",
                desc: "Everything must be safe, affordable, and available at home or school. Check with your teacher before buying anything.",
              },
              {
                term: "A measuring instrument",
                desc: "A ruler, balance, thermometer, stopwatch, or graduated cylinder — whatever your dependent variable requires. Record in SI units.",
              },
              {
                term: "A data table and graph",
                desc: "Prepared before you start, with columns for every trial. A line graph for change over time, a bar graph for comparing groups.",
              },
              {
                term: "A logbook",
                desc: "A notebook where you record what you did each day, including mistakes. Judges value an honest logbook highly.",
              },
              {
                term: "A display board",
                desc: "A tri-fold board, cartolina, or digital poster presenting your whole investigation visually.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Building Your Project",
          data: {
            intro:
              "Follow the same seven steps you learned in Week 5. Do not skip ahead — judges can always tell when the hypothesis was written after the results.",
            steps: [
              {
                num: 1,
                title: "Choose and Narrow Your Question",
                color: "primary",
                description:
                  "Pick a topic that genuinely interests you, then narrow it until it can be answered by changing one variable and measuring another. Get your question approved by your teacher before going further.",
                tip: "If you cannot name your independent and dependent variable in one sentence, the question is still too broad.",
              },
              {
                num: 2,
                title: "Research the Background",
                color: "secondary",
                description:
                  "Find out what is already known. Read at least three reliable sources and write down what you learn, keeping a record of where each fact came from for your bibliography.",
                tip: "Background research is what turns a guess into an informed hypothesis.",
              },
              {
                num: 3,
                title: "Write Your Hypothesis and Plan",
                color: "accent",
                description:
                  "Write your prediction as an 'If… then… because…' statement. Then list your independent variable, dependent variable, and every controlled variable, plus a numbered procedure.",
                tip: "Write the procedure so precisely that a classmate could run your experiment without asking you anything.",
              },
              {
                num: 4,
                title: "Run the Experiment — At Least Three Trials",
                color: "primary",
                description:
                  "Carry out your procedure exactly as written, recording every measurement immediately in your data table. Repeat the whole experiment at least three times.",
                tip: "Record results honestly, including ones that surprise you. Unexpected data is the most interesting kind.",
              },
              {
                num: 5,
                title: "Analyse Your Data",
                color: "secondary",
                description:
                  "Calculate the mean of your trials, then build a graph. Label both axes with the quantity and its unit, and give the graph a clear title.",
                tip: "The graph is the single most looked-at item on your board. Make it large and clear.",
              },
              {
                num: 6,
                title: "Draw a Conclusion",
                color: "accent",
                description:
                  "State plainly whether the data supported your hypothesis. Explain what the numbers show, mention anything that could have caused error, and suggest one follow-up investigation.",
                tip: "A rejected hypothesis honestly reported scores higher than a supported one with doctored data.",
              },
              {
                num: 7,
                title: "Build the Board and Rehearse",
                color: "primary",
                description:
                  "Assemble your display board and practise explaining your project in about two minutes. Rehearse in front of someone who does not know the topic.",
                tip: "Judges ask questions. Practise explaining WHY you chose your controlled variables.",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Your Display Board",
          data: {
            concepts: [
              "Title — large, readable from two metres away, stating your question clearly.",
              "Question and Hypothesis — your testable question and your 'If… then… because…' prediction.",
              "Materials and Procedure — a numbered list precise enough for someone to repeat your work.",
              "Variables — your independent variable, dependent variable, and controlled variables, clearly labelled.",
              "Data Table — your actual recorded measurements, with units on every column heading.",
              "Graph — large, titled, with both axes labelled including units. This is the centrepiece of the board.",
              "Conclusion — what the data showed, whether the hypothesis was supported, and sources of error.",
              "Photographs — pictures of your set-up running, which prove you actually did the work.",
              "Bibliography — the sources you used for your background research.",
            ],
          },
        },

        {
          type: "comparison",
          heading: "How You Will Be Graded",
          data: {
            intro:
              "The project is marked out of 100 points. Note that the investigation itself carries more weight than the board — a beautiful board over weak science will not score well.",
            left: {
              label: "Investigation — 60 points",
              color: "primary",
              items: [
                "Testable question and hypothesis written correctly (10 pts)",
                "Fair test: one variable changed, others controlled (15 pts)",
                "At least three trials, with data accurately recorded in SI units (15 pts)",
                "Correct analysis — mean calculated and graph properly built (10 pts)",
                "Conclusion follows honestly from the data (10 pts)",
              ],
            },
            right: {
              label: "Presentation — 40 points",
              color: "secondary",
              items: [
                "Display board complete with all required sections (15 pts)",
                "Board is neat, readable, and well organised (10 pts)",
                "Oral presentation is clear and answers judges' questions (10 pts)",
                "Logbook and bibliography included (5 pts)",
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
                title: "Know Your Numbers",
                description:
                  "Judges will ask what your results actually were. Be able to state your key measurement and your mean without reading from the board.",
                icon: "🔢",
                color: "border-l-primary-500",
              },
              {
                title: "Explain Your Controls",
                description:
                  "The most common judging question is 'what did you keep the same, and why?' Being able to answer that shows you understand fair testing.",
                icon: "⚖️",
                color: "border-l-secondary-500",
              },
              {
                title: "Admit What Went Wrong",
                description:
                  "Every real experiment has sources of error. Naming yours honestly demonstrates scientific maturity rather than weakness.",
                icon: "📋",
                color: "border-l-accent-500",
              },
              {
                title: "Arrive Early and Set Up Carefully",
                description:
                  "Bring tape, scissors, and spare copies of your graph. Set up before the judging starts, and stand beside your board ready to talk.",
                icon: "🎪",
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
        "See how a sperm and an egg — each carrying half a set of chromosomes — fuse into a single cell that becomes an entirely new organism.",
      readTime: "~15 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt:
        "Microscopic image of a sperm cell approaching an egg cell during fertilization",

      signature: {
        widgetId: "fusion-bench",
        heading: "Watch It: 23 + 23, and What Else Adds Up",
        intro:
          "Load two cells and drive them together; the chromosome total is the sum of what you picked. Get it right and the zygote starts cleaving on its own, with the count staying at 46 in every new cell. Put a body cell in and watch 69 fail.",
        instruction: "Make a correct zygote, then make a wrong one",
        xp: 25,
      },

      sections: [
        "Overview",
        "Key Terms",
        "Steps of Fertilization",
        "Internal vs. External Fertilization",
        "Key Concepts",
        "Applications",
      ],

      references: [
        {
          label: "Khan Academy — Fertilization and Development",
          url: "https://www.khanacademy.org/science/biology/developmental-biology",
        },
        {
          label: "Britannica — Fertilization",
          url: "https://www.britannica.com/science/fertilization-reproduction",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Fertilization</strong> is the process by which a sperm cell and an egg cell fuse to form a single new cell called a <strong class='text-primary-700'>zygote</strong>. This is the moment a new organism begins.",
              "Last lesson you saw that meiosis produces haploid gametes with 23 chromosomes each. Fertilization is the other half of that arrangement: 23 from the sperm plus 23 from the egg restores the full <strong class='text-primary-700'>diploid</strong> set of 46. This is why halving during meiosis was necessary in the first place — without it, the chromosome number would double every generation.",
              "Once formed, the zygote immediately begins dividing by <strong class='text-primary-700'>mitosis</strong>, becoming an embryo and eventually a complete organism — every cell of which traces back to that one fused cell.",
            ],
            didYouKnow:
              "A single human male produces around 1,500 sperm cells every second — over 500 billion in a lifetime — yet only one is needed to fertilise an egg.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Fertilization",
                desc: "The fusion of a sperm cell and an egg cell to form a zygote, which develops into a new organism.",
              },
              {
                term: "Zygote",
                desc: "The single diploid cell formed when sperm and egg fuse — the first cell of a new organism.",
              },
              {
                term: "Sperm",
                desc: "The male gamete: small, with a flagellum for swimming, carrying the father's genetic contribution.",
              },
              {
                term: "Egg (Ovum)",
                desc: "The female gamete: much larger than sperm, containing nutrients to support the early embryo.",
              },
              {
                term: "Internal Fertilization",
                desc: "Fertilization occurring inside the body of the female. Common in mammals, birds, and reptiles.",
              },
              {
                term: "External Fertilization",
                desc: "Fertilization occurring outside the body, usually in water. Common in fish, frogs, and many aquatic animals.",
              },
              {
                term: "Embryo",
                desc: "The developing organism in the early stages after the zygote begins dividing by mitosis.",
              },
              {
                term: "Fertilization Membrane",
                desc: "A barrier that forms around the egg the instant one sperm enters, preventing any other sperm from getting in.",
              },
              {
                term: "Differentiation",
                desc: "The process by which dividing embryo cells become specialised into muscle, nerve, skin, and every other cell type.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Steps of Fertilization",
          data: {
            intro:
              "From the moment a sperm reaches an egg, a precisely ordered sequence produces a new organism.",
            steps: [
              {
                num: 1,
                title: "Sperm Travel Toward the Egg",
                color: "primary",
                description:
                  "Millions of sperm cells move toward the egg, each propelled by its flagellum. In internal fertilization they travel through the female reproductive tract; in external fertilization they swim through water.",
                tip: "Only a tiny fraction of the sperm released ever reach the egg at all.",
              },
              {
                num: 2,
                title: "One Sperm Penetrates the Egg",
                color: "secondary",
                description:
                  "A single sperm breaks through the egg's outer layer. Its genetic material — 23 chromosomes in humans — enters and fuses with the egg's own 23 chromosomes.",
                tip: "The instant one sperm enters, the fertilization membrane forms and blocks every other sperm.",
              },
              {
                num: 3,
                title: "The Zygote Forms",
                color: "accent",
                description:
                  "The fused cell is now a zygote — a single diploid cell with the full 46 chromosomes, half from each parent, carrying a complete and entirely new genetic blueprint.",
                tip: "This is the only moment in a person's life when they consist of exactly one cell.",
              },
              {
                num: 4,
                title: "Mitosis Begins",
                color: "primary",
                description:
                  "The zygote starts dividing by mitosis — first into 2 cells, then 4, then 8, and onward. These early divisions happen rapidly, and every cell carries identical DNA.",
                tip: "Mitosis, not meiosis, does all the work from here — which is why every body cell has the same genes.",
              },
              {
                num: 5,
                title: "The Embryo Develops",
                color: "secondary",
                description:
                  "As division continues, cells begin to differentiate — becoming muscle, nerve, skin, and other specialised types. The developing organism is now called an embryo.",
                tip: "In humans, by week 8 the embryo is called a fetus and has recognisable body structures.",
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Internal vs. External Fertilization",
          data: {
            intro:
              "Both achieve the same fusion, but the strategies differ — and each is a trade-off between safety and numbers.",
            left: {
              label: "Internal Fertilization",
              color: "primary",
              items: [
                "Occurs inside the body of the female",
                "Few eggs produced, but each is well protected",
                "The embryo develops inside the mother or inside a shelled egg",
                "High survival rate per offspring",
                "Examples: humans, dogs, whales, birds, reptiles",
              ],
            },
            right: {
              label: "External Fertilization",
              color: "secondary",
              items: [
                "Occurs outside the body, almost always in water",
                "Huge numbers of eggs released at once",
                "Eggs and embryos are exposed to predators and conditions",
                "Very low survival rate per offspring — numbers compensate",
                "Examples: frogs, salmon, sea urchins, most fish",
              ],
            },
          },
        },

        {
          type: "conceptList",
          heading: "Key Concepts",
          data: {
            concepts: [
              "Fertilization joins two haploid gametes (n = 23 each) into one diploid zygote (2n = 46).",
              "The halving done by meiosis and the doubling done by fertilization balance each other exactly — this keeps the chromosome number constant across generations.",
              "Half of a zygote's chromosomes come from the mother and half from the father, which is why offspring resemble both.",
              "Only one sperm fertilises the egg. The fertilization membrane forms immediately to block all others.",
              "The zygote is the first cell of a new organism and divides by mitosis, not meiosis.",
              "External fertilization requires water so that sperm can swim to the eggs, which is why it is restricted to aquatic animals.",
              "Errors in chromosome number that arose during meiosis show up in the zygote, which is why many early pregnancies do not continue.",
            ],
          },
        },

        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "In Vitro Fertilization (IVF)",
                description:
                  "Eggs are fertilised by sperm in a laboratory dish and the resulting embryo is transferred to the uterus, helping people who cannot conceive naturally.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Conserving Endangered Species",
                description:
                  "Scientists use artificial fertilization to help endangered animals reproduce in captivity, preserving species that would otherwise vanish.",
                icon: "🌿",
                color: "border-l-secondary-500",
              },
              {
                title: "Animal Husbandry",
                description:
                  "Farmers use artificial insemination to breed livestock with desirable traits far more efficiently than natural mating allows.",
                icon: "🐄",
                color: "border-l-accent-500",
              },
              {
                title: "Understanding Early Development",
                description:
                  "Studying fertilization and the first divisions helps doctors understand why some pregnancies fail at the earliest stages.",
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
