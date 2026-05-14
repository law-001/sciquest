// ─── Week 1: Scientific Models ───────────────────
// Data only — no JSX. Each lesson uses layout[] to pick slot types.

import microscope from "../assets/Microscopic.jpg";
import globe from "../assets/globe.jpg";
import web from "../assets/web.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";

import { week02 } from "./lessonsweek-02";
import { week03 } from "./lessonsweek-03";
import { week04 } from "./lessonsweek-04";
import { week05 } from "./lessonsweek-05";
import { week06 } from "./lessonsweek-06";
import { week07 } from "./lessonsweek-07";
import { week08 } from "./lessonsweek-08";
import { week09 } from "./lessonsweek-09";
import { week10 } from "./lessonsweek-10";
import { week11 } from "./lessonsweek-11";
import { week12 } from "./lessonsweek-12";
import { week13 } from "./lessonsweek-13";
import { week14 } from "./lessonsweek-14";
import { week15 } from "./lessonsweek-15";
import { week16 } from "./lessonsweek-16";
import { week17 } from "./lessonsweek-17";
import { week18 } from "./lessonsweek-18";
import { week19 } from "./lessonsweek-19";
import { week20 } from "./lessonsweek-20";

const week01 = {
  id: "week-1",
  weekNumber: 1,
  title: "Scientific Models",
  category: "Scientific Method",
  description:
    "Explore how scientists use models to understand the world around us.",
  icon: "Globe2",
  color: "primary",
  xpReward: 225,
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Uses of Scientific Models
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-1",
      weekId: "week-1",
      lessonNumber: 1,
      title: "Uses of Scientific Models",
      badge: "Lesson 1",
      subtitle:
        "Explore the world of scientific models and discover how scientists use them to understand things that cannot be easily seen or observed.",
      readTime: "~15 min read",
      xp: 75,
      heroImage: microscope,
      heroImageAlt: "Microscopic view of cells",

      sections: [
        "Overview",
        "Key Concepts",
        "Fundamentals",
        "Breakdown",
        "Understanding",
        "Applications",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Scientific models are <strong class='text-primary-700'>simplified representations</strong> of real-world objects, systems, or processes. They help scientists understand, explain, and predict natural phenomena that are too small, too large, too fast, too slow, or too dangerous to observe directly.",
              "Models are important in science because they <strong class='text-primary-700'>make complex ideas easier</strong> to study and communicate. They allow scientists to test ideas safely, make predictions, and improve their understanding step by step. Without models, many important discoveries in physics, chemistry, biology, and Earth science would be much more difficult.",
            ],
            didYouKnow:
              "The early atomic model by Niels Bohr imagined electrons orbiting the nucleus like planets but today, scientists know electrons actually move in unpredictable \u201cclouds,\u201d not fixed paths!",
          },
        },

        // ── Section 1: Key Terms ──
        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Scientific Model",
                desc: "A simplified representation of a real object, system, or process that helps scientists explain how something works or predict what will happen.",
              },
              {
                term: "Physical Model",
                desc: "A three-dimensional, tangible object built to represent something in the real world, often at a different size (scale model).",
              },
              {
                term: "Conceptual Model",
                desc: "A mental or visual picture that shows the relationships between ideas or parts of a system, often drawn as diagrams or flowcharts.",
              },
              {
                term: "Mathematical Model",
                desc: "A model that uses mathematical equations and numbers to describe and predict the behavior of a system.",
              },
              {
                term: "Simulation",
                desc: 'A computer-based model that imitates the operation of a real process or system over time, allowing scientists to run "what if" experiments safely.',
              },
            ],
          },
        },

        // ── Section 2: Why Use Models (reasonCards) ──
        {
          type: "reasonCards",
          heading: "Fundamentals",
          data: {
            intro:
              "Many scientific phenomena cannot be observed directly. Atoms are too small to see, climate systems are too large and slow-changing, and some events are too dangerous to study in real time. Scientists create models to:",
            reasons: [
              {
                num: 1,
                title: "Simplification",
                color: "primary",
                desc: "Simplify complex systems",
                content: "e.g. Solar system diagram",
              },
              {
                num: 2,
                title: "Visualization",
                color: "secondary",
                desc: "Visualize things that cannot be seen",
                content: "e.g. Atom model",
              },
              {
                num: 3,
                title: "Testing",
                color: "accent",
                desc: "Test ideas without risk",
                content: "e.g. Volcano simulation",
              },
              {
                num: 4,
                title: "Predictions",
                color: "primary",
                desc: "Make predictions about the future",
                content: "e.g. Weather forecast model",
              },
              {
                num: 5,
                title: "Communications",
                color: "secondary",
                desc: "Communicate ideas clearly to others",
                content: "e.g. food chain diagram",
              },
            ],
          },
        },

        // ── Section 3: Types of Models (imageCards) ──
        {
          type: "imageCards",
          heading: "Breakdown",
          data: {
            cards: [
              {
                title: "Physical Models",
                label: "Physical",
                variant: "primary",
                color: "primary",
                desc: "These are actual objects that represent something else.",
                image: globe,
                imageAlt: "Globe model",
                examples: [
                  "A globe (model of Earth)",
                  "A model of the solar system with orbiting planets",
                  "A scaled-down model of a bridge used by engineers to test strength",
                ],
              },
              {
                title: "Conceptual Models",
                label: "Conceptual",
                variant: "secondary",
                color: "secondary",
                desc: "These are diagrams or mental pictures that show how parts of a system relate to one another.",
                image: web,
                imageAlt: "Conceptual diagram",
                examples: [
                  "The Bohr model of the atom",
                  "Food web diagrams showing energy flow in an ecosystem",
                  "The water cycle diagram",
                ],
              },
              {
                title: "Mathematical Models",
                label: "Mathematical",
                variant: "secondary",
                color: "secondary",
                desc: "These use equations to describe relationships and make predictions.",
                image: equation,
                imageAlt: "Mathematical equations",
                examples: [
                  "Newton's laws of motion expressed as equations",
                  "Population growth models in biology",
                  "Equations used to calculate the trajectory of a rocket",
                ],
              },
              {
                title: "Simulation Models",
                label: "Simulation",
                variant: "primary",
                color: "primary",
                desc: "Computer programs that imitate real processes.",
                image: simulation,
                imageAlt: "Computer simulation",
                examples: [
                  "Weather simulation programs",
                  "Flight simulators used to train pilots",
                  "Molecular dynamics simulations that show how medicines interact with viruses",
                ],
              },
            ],
          },
        },

        // ── Section 4: Concepts & Principles (conceptList) ──
        {
          type: "conceptList",
          heading: "Understanding",
          data: {
            concepts: [
              "All scientific models are simplifications; they are not perfect copies of reality.",
              "Good models are useful even if they are not 100% accurate.",
              "Models can be improved or replaced when new evidence appears.",
              "Models help scientists understand unseen phenomena by representing invisible things in ways we can see, draw, or calculate.",
              "Models allow scientists to make predictions and test them through experiments or observations.",
            ],
          },
        },

        // ── Section 5: Applications ──
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Weather Forecasting",
                description:
                  "Scientists use computer models to predict future weather.",
                icon: "\u2600\uFE0F",
                color: "border-l-primary-500",
              },
              {
                title: "Atomic Models",
                description: "Help explain how atoms behave and react.",
                icon: "\u269B\uFE0E",
                color: "border-l-secondary-500",
              },
              {
                title: "Climate Models",
                description: "Used to study and predict climate change.",
                icon: "\u2601\uFE0F",
                color: "border-l-accent-500",
              },
              {
                title: "Engineering Designs",
                description:
                  "Used to test buildings, cars, and aircraft before building them.",
                icon: "\uD83C\uDFE2",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Science Process Skills & Scientific Method
    // ═══════════════════════════════════════════════════
    // ─────────────────────────────────────────────────────────────────
    // LESSON 2 — Integrated Science Process Skills & Scientific Method
    // Week 1 | Grade 7 Science
    // Teaching Days: 1 (60 minutes)
    // Competencies:
    //   • Recognize each science process skill
    //   • Use scientific attitudes to seek solutions to human problems
    //   • Appreciate the role and contribution of science in our world
    // ─────────────────────────────────────────────────────────────────

    {
      id: "lesson-2",
      weekId: "week-1",
      lessonNumber: 2,
      title: "Integrated Science Process Skills and the Scientific Method",
      badge: "Lesson 2",
      subtitle:
        "Discover how scientists think, investigate, and solve problems — and how YOU already use these skills every single day.",
      readTime: "~20 min read",
      xp: 75,
      heroImage: microscope, // reuse existing import from week-01.js
      heroImageAlt: "Students conducting a scientific investigation in class",

      // sections[] drives the sidebar TOC — must match layout[] 1-to-1
      sections: [
        "Introduction",
        "Key Terms",
        "The Scientific Method",
        "Science Process Skills",
        "Scientific Attitudes",
        "Skills vs. Attitudes",
        "Real-Life Scenarios",
        "Why Science Matters",
      ],

      layout: [
        // ── SECTION 0 · Introduction ────────────────────────────────
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Have you ever wondered how scientists figure out the answers to big questions — like why the sky is blue, or how diseases spread? Scientific discoveries do not happen by accident. They follow a <strong class='text-primary-700'>structured and logical process</strong> called the <strong class='text-primary-700'>Scientific Method</strong>.",
              "To carry out this process, scientists rely on <strong class='text-primary-700'>Science Process Skills</strong> — a set of thinking and doing skills that help them observe the world carefully, ask meaningful questions, and find evidence-based answers. These same skills are used in everyday life, from choosing what to eat for breakfast to designing the next generation of smartphones.",
              "In this lesson, you will learn to <strong class='text-primary-700'>recognize</strong> each science process skill, understand how <strong class='text-primary-700'>scientific attitudes</strong> guide honest and responsible investigations, and appreciate how science helps us solve real human problems.",
            ],
            didYouKnow:
              "When Myra compares the volumes of two alcohol containers, or when Jesse infers that a loud knock means a guest has arrived — they are already using science process skills without even realizing it!",
          },
        },

        // ── SECTION 1 · Key Terms ────────────────────────────────────
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Scientific Method",
                desc: "A systematic, step-by-step process scientists use to investigate questions, gather evidence, and draw reliable conclusions.",
              },
              {
                term: "Science Process Skills",
                desc: "A set of thinking and investigative skills — such as observing, classifying, and experimenting — that scientists use to study the natural world.",
              },
              {
                term: "Observation",
                desc: "Gathering information about objects or events using the five senses or scientific tools like rulers and thermometers.",
              },
              {
                term: "Inference",
                desc: "An explanation or conclusion drawn from observations and prior knowledge — it goes beyond what is directly seen.",
              },
              {
                term: "Prediction",
                desc: "A statement about what might happen in the future, based on patterns observed in data or prior experience.",
              },
              {
                term: "Classification",
                desc: "Grouping or arranging objects, events, or data based on their similarities and differences.",
              },
              {
                term: "Measurement",
                desc: "Using standard units and tools to describe the quantity of an object or event (e.g., length, volume, temperature).",
              },
              {
                term: "Experimentation",
                desc: "Designing and conducting controlled tests to investigate a hypothesis and collect data.",
              },
              {
                term: "Communication",
                desc: "Sharing the results of scientific work through written reports, graphs, oral presentations, or discussions.",
              },
              {
                term: "Scientific Attitude",
                desc: "A value or disposition — such as curiosity, honesty, and perseverance — that guides responsible and ethical scientific practice.",
              },
            ],
          },
        },

        // ── SECTION 2 · The Scientific Method (Timeline) ─────────────
        {
          type: "timeline",
          heading: "The Scientific Method",
          data: {
            intro:
              "The Scientific Method is the backbone of every scientific investigation. It gives scientists — and students like you — a reliable roadmap for asking questions and finding answers based on evidence, not guesswork.",
            steps: [
              {
                num: 1,
                title: "Ask a Question",
                color: "primary",
                description:
                  "Scientists begin by identifying a problem or curiosity about the natural world. A good scientific question is specific, testable, and based on observation. Example: 'Does the amount of sunlight affect how fast a plant grows?'",
                tip: "Your question should be something you can actually investigate with an experiment.",
              },
              {
                num: 2,
                title: "Gather Background Information",
                color: "secondary",
                description:
                  "Before experimenting, scientists research what is already known about the topic. This prevents repeating past mistakes and helps form a smarter hypothesis. Example: Reading about photosynthesis before designing a plant growth experiment.",
                tip: "Use books, credible websites, and previous experiments as your sources.",
              },
              {
                num: 3,
                title: "Form a Hypothesis",
                color: "accent",
                description:
                  "A hypothesis is an educated, testable guess about the answer to your question. It is written as an 'If... then...' statement. Example: 'If a plant receives more sunlight, then it will grow taller in two weeks.'",
                tip: "A hypothesis is not just a wild guess — it must be based on what you already know.",
              },
              {
                num: 4,
                title: "Conduct an Experiment",
                color: "primary",
                description:
                  "Scientists design a fair test to check whether their hypothesis is correct. They control all variables except the one being tested (the independent variable) and measure the outcome (the dependent variable).",
                tip: "Always repeat your experiment at least 3 times to make sure your results are reliable.",
              },
              {
                num: 5,
                title: "Collect and Analyze Data",
                color: "secondary",
                description:
                  "During and after the experiment, scientists record all measurements and observations carefully. They then organize the data using tables, graphs, and charts to spot patterns and trends.",
                tip: "Honest data collection is essential — never change your data to match your hypothesis.",
              },
              {
                num: 6,
                title: "Draw a Conclusion",
                color: "accent",
                description:
                  "Based on the analyzed data, scientists decide whether their hypothesis was supported or refuted. A conclusion explains what the results mean and what new questions they raise.",
                tip: "It's perfectly fine if your hypothesis was wrong — that's still a valuable scientific finding!",
              },
              {
                num: 7,
                title: "Communicate Results",
                color: "primary",
                description:
                  "Scientists share their findings with others through reports, presentations, or publications. This allows other scientists to verify, challenge, or build on the results.",
                tip: "Clear communication is what makes science a collaborative, growing body of knowledge.",
              },
            ],
          },
        },

        // ── SECTION 3 · Science Process Skills (imageCards) ──────────
        {
          type: "imageCards",
          heading: "Science Process Skills",
          data: {
            cards: [
              {
                title: "Observing",
                label: "Basic Skill",
                variant: "primary",
                color: "primary",
                image: microscope,
                imageAlt: "Student observing through a microscope",
                desc: "Using the five senses — or scientific tools — to gather information about objects and events. This is the most fundamental of all process skills.",
                examples: [
                  "Adrian looked at the traffic light and noticed it turned red. (Sight)",
                  "Jesse heard a loud knock on the door. (Hearing)",
                  "Measuring the temperature of water with a thermometer",
                ],
              },
              {
                title: "Classifying",
                label: "Basic Skill",
                variant: "secondary",
                color: "secondary",
                image: web,
                imageAlt: "Organized categories on a board",
                desc: "Grouping objects, organisms, or data based on their shared properties or characteristics. Classification helps scientists organize information and find patterns.",
                examples: [
                  "Real rearranging clothes in her cabinet by type and color",
                  "Sorting materials as solid, liquid, or gas",
                  "Grouping animals by the number of legs they have",
                ],
              },
              {
                title: "Measuring",
                label: "Basic Skill",
                variant: "primary",
                color: "primary",
                image: equation,
                imageAlt: "Ruler and measuring tools",
                desc: "Using standard units and instruments to describe quantities accurately. Measurement makes observations precise and allows results to be compared.",
                examples: [
                  "Myra comparing the volumes of two alcohol containers",
                  "Recording the mass of a rock sample in grams",
                  "Measuring the growth of a plant in centimeters each day",
                ],
              },
              {
                title: "Inferring",
                label: "Integrated Skill",
                variant: "secondary",
                color: "secondary",
                image: simulation,
                imageAlt: "Student thinking and making connections",
                desc: "Using prior knowledge and observations to form an explanation about something. Unlike observations, inferences cannot be directly verified by the senses alone.",
                examples: [
                  "Jesse inferred his guest arrived after hearing a loud knock",
                  "Concluding that wet grass means it rained earlier",
                  "Inferring that a plant is unhealthy based on its yellowing leaves",
                ],
              },
              {
                title: "Predicting",
                label: "Integrated Skill",
                variant: "primary",
                color: "primary",
                image: globe,
                imageAlt: "Weather forecast chart",
                desc: "Stating what you think will happen in the future based on patterns and prior observations. A prediction must be testable — it is different from a random guess.",
                examples: [
                  "William predicted the watermelon might be sweet based on its size and color",
                  "Predicting that more fertilizer will produce taller plants",
                  "Forecasting tomorrow's weather using wind and cloud patterns",
                ],
              },
              {
                title: "Experimenting & Communicating",
                label: "Integrated Skill",
                variant: "secondary",
                color: "secondary",
                image: equation,
                imageAlt: "Students presenting experiment results",
                desc: "Designing and conducting controlled tests to investigate a hypothesis, then sharing the findings clearly with others through written or oral reports.",
                examples: [
                  "Pam checks and records the results of her experiment accurately",
                  "Presenting lab findings using graphs and tables",
                  "Writing a scientific report and sharing it with classmates",
                ],
              },
            ],
          },
        },

        // ── SECTION 4 · Scientific Attitudes (reasonCards) ───────────
        {
          type: "reasonCards",
          heading: "Scientific Attitudes",
          data: {
            intro:
              "Science process skills tell us WHAT to do. Scientific attitudes tell us HOW to do it — with honesty, respect, and responsibility. These attitudes are just as important as the skills themselves, especially when collecting and reporting data.",
            reasons: [
              {
                num: "🔍",
                title: "Curiosity",
                color: "primary",
                desc: "Always looking for new questions about the world",
                content:
                  "Ben is always wondering about the 'why' behind natural events.",
              },
              {
                num: "✅",
                title: "Integrity",
                color: "secondary",
                desc: "Being honest in collecting and reporting data",
                content:
                  "Dhanna records her results truthfully, even if they don't match her hypothesis.",
              },
              {
                num: "🤝",
                title: "Collaboration",
                color: "accent",
                desc: "Always willing to work with and learn from others",
                content:
                  "Jerrie actively contributes to group investigations and shares responsibilities.",
              },
              {
                num: "🧠",
                title: "Open-mindedness",
                color: "primary",
                desc: "Listening to and accepting new ideas from others",
                content:
                  "Luis considers the ideas of his colleagues even when they differ from his own.",
              },
              {
                num: "💪",
                title: "Perseverance",
                color: "secondary",
                desc: "Not giving up even when things go wrong",
                content:
                  "Dhanna made a mistake in her experiment but kept trying until she got it right.",
              },
              {
                num: "⚖️",
                title: "Objectivity",
                color: "accent",
                desc: "Basing conclusions only on evidence, not personal opinion",
                content:
                  "Scientists report what the data actually shows, not what they hoped it would show.",
              },
            ],
          },
        },

        // ── SECTION 5 · Skills vs. Attitudes (comparison) ────────────
        {
          type: "comparison",
          heading: "Skills vs. Attitudes",
          data: {
            intro:
              "It is important to understand the difference between what scientists DO (process skills) and how they BEHAVE while doing it (scientific attitudes). Both are essential for reliable, ethical science.",
            left: {
              label: "⚙️ Science Process Skills",
              color: "primary",
              items: [
                "Actions and techniques used during investigation",
                "Can be practiced and improved through repeated activities",
                "Examples: Observing, Classifying, Measuring, Inferring, Predicting, Experimenting, Communicating",
                "Answer the question: WHAT does a scientist DO?",
                "Produce data, results, and conclusions",
              ],
            },
            right: {
              label: "🌟 Scientific Attitudes",
              color: "secondary",
              items: [
                "Values and dispositions that guide scientific behavior",
                "Developed through reflection, modeling, and habit",
                "Examples: Curiosity, Integrity, Open-mindedness, Collaboration, Perseverance, Objectivity",
                "Answer the question: HOW does a scientist BEHAVE?",
                "Ensure science is honest, ethical, and trustworthy",
              ],
            },
          },
        },

        // ── SECTION 6 · Real-Life Scenarios (scenario) ───────────────
        {
          type: "scenario",
          heading: "Real-Life Scenarios",
          data: {
            intro:
              "Let's practice identifying science process skills and attitudes in action! Read each scenario below and think about which skill or attitude is being used. These are based on real seatwork situations you will encounter in class.",
            scenarios: [
              {
                title: "Myra and the Alcohol Containers",
                situation:
                  "Myra lines up three alcohol containers side by side and carefully compares how much liquid each one holds, using the markings on the side of each bottle to determine the exact amount.",
                question:
                  "What science process skill is Myra demonstrating? How is this different from simply looking at the containers?",
                skill:
                  "Measuring — she is using standard markings (units) to determine and compare volumes precisely.",
              },
              {
                title: "Adrian at the Traffic Light",
                situation:
                  "While crossing the street, Adrian notices that the traffic light has changed from green to red, and immediately stops walking.",
                question:
                  "Which of the five senses is Adrian using? Is this an observation or an inference? Why?",
                skill:
                  "Observing (sight) — Adrian is using a sense to gather direct information about the environment.",
              },
              {
                title: "Real and the Cabinet",
                situation:
                  "Real notices her clothes are all mixed up. She decides to arrange them by type: school uniforms in one section, casual clothes in another, and sports clothes in a third section.",
                question:
                  "What is Real doing to her clothes? What criteria is she using to organize them?",
                skill:
                  "Classifying — Real is grouping objects based on shared characteristics (type/function).",
              },
              {
                title: "Jesse's Loud Knock",
                situation:
                  "Jesse is studying in his room when he hears a loud knock on the front door. He thinks to himself: 'That must be my guest — they said they would arrive around this time.'",
                question:
                  "Jesse cannot see who is at the door yet. Is his conclusion an observation or an inference? What is the difference?",
                skill:
                  "Inferring — Jesse uses prior knowledge (his guest's expected arrival) combined with an observation (the knock) to form an explanation.",
              },
              {
                title: "William and the Watermelon",
                situation:
                  "At the market, William taps a watermelon and listens to the sound it makes. Based on past experience, he says: 'I think this watermelon will be sweet.'",
                question:
                  "William hasn't tasted the watermelon yet. How is this statement different from an inference? What makes it a prediction?",
                skill:
                  "Predicting — William is using a pattern from past experience to state what will happen in the future.",
              },
              {
                title: "Dhanna Never Gives Up",
                situation:
                  "During the experiment, Dhanna accidentally spills one of her samples. Instead of giving up or making up results, she starts that part of the experiment again from scratch.",
                question:
                  "What scientific attitude is Dhanna demonstrating? Why is this attitude especially important in science?",
                skill:
                  "Perseverance — Dhanna continues despite setbacks, ensuring her results are based on actual evidence.",
              },
            ],
          },
        },

        // ── SECTION 7 · Why Science Matters (applications) ───────────
        {
          type: "applications",
          heading: "Why Science Matters",
          data: {
            apps: [
              {
                title: "Solving Everyday Problems",
                description:
                  "Science process skills are not just for laboratories — they help us solve real problems, from designing better tools to finding cures for diseases. Every invention started with a curious question.",
                icon: "🔧",
                color: "border-l-primary-500",
              },
              {
                title: "Honest Data Saves Lives",
                description:
                  "When scientists collect and report data with integrity, doctors can trust medical research, engineers can build safer structures, and governments can make better decisions for public health.",
                icon: "🏥",
                color: "border-l-secondary-500",
              },
              {
                title: "Science Is Collaborative",
                description:
                  "No scientist works alone. Discoveries like vaccines, space travel, and the internet were all made possible by teams of scientists sharing ideas, challenging each other, and building on each other's work.",
                icon: "🌍",
                color: "border-l-accent-500",
              },
              {
                title: "Critical Thinking for Life",
                description:
                  "Learning to observe carefully, question assumptions, and draw evidence-based conclusions makes you a better thinker — not just in science class, but in every decision you make in life.",
                icon: "💡",
                color: "border-l-primary-500",
              },
              {
                title: "Appreciating Scientific Progress",
                description:
                  "From understanding how diseases spread to predicting earthquakes, science has transformed how humanity lives. These achievements rest on generations of scientists faithfully following the scientific method.",
                icon: "🚀",
                color: "border-l-secondary-500",
              },
              {
                title: "You Are Already a Scientist",
                description:
                  "Every time you observe something unusual, ask 'why?', try something to see what happens, and tell someone what you found — you are practicing the scientific method. Science is a way of thinking, not just a subject.",
                icon: "🧪",
                color: "border-l-accent-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 3 — Models in Real Life
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-3",
      weekId: "week-1",
      lessonNumber: 3,
      badge: "Lesson 3",
      title: "Models in Real Life",
      subtitle: "Discover how scientific models are used every day by doctors, engineers, and scientists to solve real-world problems.",
      readTime: "~12 min read",
      xp: 75,
      heroImage: simulation,
      heroImageAlt: "Computer simulation model",

      sections: ["Introduction", "Models in Action", "Real-Life Scenarios", "Impact of Models"],

      layout: [
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Scientific models are not just for textbooks. They are used every day by <strong class='text-primary-700'>doctors, engineers, weather forecasters, and environmentalists</strong> to solve real problems and make life-changing decisions.",
              "A model does not need to be perfect to be useful. Even a simplified version of a system can help scientists predict outcomes, avoid disasters, and design better technology. In this lesson, we explore how different types of models are applied in the real world.",
            ],
            didYouKnow:
              "NASA engineers use mathematical models called 'finite element models' to simulate stress on rocket parts before launching — preventing costly failures in space!",
          },
        },
        {
          type: "imageCards",
          heading: "Models in Action",
          data: {
            cards: [
              {
                title: "Weather Forecasting",
                label: "Simulation",
                variant: "primary",
                color: "primary",
                desc: "Meteorologists use computer simulation models to predict weather patterns up to 10 days in advance.",
                image: simulation,
                imageAlt: "Weather simulation model",
                examples: [
                  "Track storm and typhoon paths",
                  "Predict rainfall and flooding",
                  "Issue public storm warnings in advance",
                ],
              },
              {
                title: "Medical Models",
                label: "Physical & Math",
                variant: "secondary",
                color: "secondary",
                desc: "Doctors use 3D physical models and mathematical models to understand diseases and plan surgery.",
                image: microscope,
                imageAlt: "Medical imaging model",
                examples: [
                  "3D anatomical models for surgical planning",
                  "Mathematical models predicting drug dosage",
                  "Computer simulations of tumor growth",
                ],
              },
              {
                title: "Engineering Design",
                label: "Physical & Math",
                variant: "primary",
                color: "primary",
                desc: "Engineers build scale models and use equations to test safety before constructing bridges, buildings, and aircraft.",
                image: equation,
                imageAlt: "Engineering blueprint",
                examples: [
                  "Scale models of bridges to test strength",
                  "Aerodynamic simulations for aircraft",
                  "Car crash simulations using computers",
                ],
              },
              {
                title: "Climate Science",
                label: "Simulation",
                variant: "secondary",
                color: "secondary",
                desc: "Climate scientists use powerful computer models to study how Earth's temperature changes over decades.",
                image: globe,
                imageAlt: "Climate model globe",
                examples: [
                  "Predict sea level rise from melting ice caps",
                  "Study the effects of greenhouse gases",
                  "Project long-term global temperature trends",
                ],
              },
            ],
          },
        },
        {
          type: "scenario",
          heading: "Real-Life Scenarios",
          data: {
            intro:
              "Let's see how real people use scientific models in their work. For each scenario, identify the type of model and explain how it helps.",
            scenarios: [
              {
                title: "The Typhoon Warning",
                situation:
                  "A weather forecaster enters data about wind speed, air pressure, and sea temperature into a computer. The program generates a map showing where a typhoon will likely hit in 3 days.",
                question:
                  "What type of model is the computer program? How does it help protect people?",
                skill:
                  "Simulation model — it processes real data to predict future events, giving communities time to evacuate and prepare.",
              },
              {
                title: "Building a Safe Bridge",
                situation:
                  "Before constructing a bridge, engineers build a small-scale version and apply forces to test where it bends or breaks. They then redesign the structure based on the results.",
                question:
                  "What type of model are the engineers using? What is the benefit of testing a small version first?",
                skill:
                  "Physical model — it allows engineers to find weaknesses in the design before spending millions on the real structure.",
              },
              {
                title: "Tracking a New Disease",
                situation:
                  "A scientist creates a computer program that simulates how an illness spreads through a school based on how often students are in contact. She uses it to determine if closing one grade level can stop the spread.",
                question:
                  "What type of model is the scientist using? What assumptions might limit its accuracy?",
                skill:
                  "Simulation model — it imitates real-world spread patterns, but assumes all students have the same contact rates, which may not be true.",
              },
            ],
          },
        },
        {
          type: "applications",
          heading: "Impact of Models",
          data: {
            apps: [
              {
                title: "Disaster Preparedness",
                description:
                  "Simulation models of typhoons, floods, and earthquakes help governments plan evacuations and save thousands of lives each year.",
                icon: "🌀",
                color: "border-l-primary-500",
              },
              {
                title: "Medicine and Surgery",
                description:
                  "3D physical models and mathematical models help surgeons plan complex operations and develop life-saving treatments.",
                icon: "🏥",
                color: "border-l-secondary-500",
              },
              {
                title: "Sustainable Energy",
                description:
                  "Engineers use mathematical and simulation models to design more efficient solar panels, wind turbines, and batteries.",
                icon: "⚡",
                color: "border-l-accent-500",
              },
              {
                title: "Environmental Protection",
                description:
                  "Climate scientists use simulation models to study pollution, deforestation, and ocean acidification, guiding policies that protect ecosystems.",
                icon: "🌍",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};

export const WEEKS_DATA = [
  week01, week02, week03, week04, week05,
  week06, week07, week08, week09, week10,
  week11, week12, week13, week14, week15,
  week16, week17, week18, week19, week20,
];
