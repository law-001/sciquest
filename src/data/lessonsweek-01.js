// ─── Week 1: Scientific Models ───────────────────
// Data only   no JSX. Each lesson uses layout[] to pick slot types.

import microscope from "../assets/week1/Microscopic.jpg";
import globe from "../assets/week1/globe.jpg";
import web from "../assets/week1/web.jpg";
import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import scimethod from "../assets/week1/scimethod.jpg";
import model from "../assets/week1/model.jpg";
import weatherforecast from "../assets/week1/weatherforecast.webp";
import medicalmodel from "../assets/week1/medicalmodel.jpg";
import engrmodel from "../assets/week1/engrmodel.webp";
import climate from "../assets/week1/climate.jpg";

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
  icon: "Shapes",
  color: "primary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1   Uses of Scientific Models
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
      xp: 50,
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

      references: [
        {
          label: "SERC Carleton   Teaching With Models",
          url: "https://serc.carleton.edu/introgeo/models/index.html",
        },
        {
          label: "SERC Carleton   What Is a Model?",
          url: "https://serc.carleton.edu/teachearth/teaching_methods/models/WhatIsAModel.html",
        },
        {
          label: "NSTA   Using Models to Teach Science",
          url: "https://www.nsta.org/using-models-teach-science",
        },
        {
          label: "Texas Gateway   Scientific Models",
          url: "https://texasgateway.org/resource/scientific-models",
        },
        {
          label: "University of Hawaii   Practices of Science: Using Models",
          url: "https://manoa.hawaii.edu/exploringourfluidearth/physical/density-effects/density-driven-currents/practices-science-using-models",
        },
        {
          label: "Wikipedia   Scientific Modelling",
          url: "https://en.wikipedia.org/wiki/Scientific_modelling",
        },
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
    // LESSON 2   Integrated Science Process Skills & Scientific Method
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-2",
      weekId: "week-1",
      lessonNumber: 2,
      title: "Integrated Science Process Skills and the Scientific Method",
      badge: "Lesson 2",
      subtitle:
        "Discover how scientists think, investigate, and solve problems   and how YOU already use these skills every single day.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: scimethod,
      heroImageAlt: "Students conducting a scientific investigation in class",

      sections: [
        "Introduction",
        "The Scientific Method",
        "Skills vs. Attitudes",
        "Scientific Attitudes",
        "Real-Life Scenarios",
        "Why Science Matters",
      ],

      references: [
        {
          label: "Science Buddies   Steps of the Scientific Method",
          url: "https://www.sciencebuddies.org/science-fair-projects/science-fair/steps-of-the-scientific-method",
        },
        {
          label: "National Geographic Education   The Scientific Method",
          url: "https://education.nationalgeographic.org/resource/scientific-method/",
        },
        {
          label: "UC Berkeley   Understanding Science: How Science Works",
          url: "https://undsci.berkeley.edu/understanding-science/how-science-works/the-scientific-method/",
        },
        {
          label: "Khan Academy   The Scientific Method",
          url: "https://www.khanacademy.org/science/biology/intro-to-biology/science-of-biology/a/the-science-of-biology",
        },
      ],

      layout: [
        // ── SECTION 0 · Introduction ──────────────────────────────────
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Have you ever wondered how scientists figure out the answers to big questions   like why the sky is blue, or how diseases spread? Scientific discoveries do not happen by accident. They follow a <strong class='text-primary-700'>structured and logical process</strong> called the <strong class='text-primary-700'>Scientific Method</strong>.",
              "To carry out this process, scientists rely on <strong class='text-primary-700'>Science Process Skills</strong>   a set of thinking and doing skills that help them observe the world carefully, ask meaningful questions, and find evidence-based answers. These same skills appear in everyday life: from choosing what to eat for breakfast to designing the next generation of smartphones.",
            ],
            didYouKnow:
              "When Myra compares the volumes of two alcohol containers, or when Jesse infers that a loud knock means a guest has arrived   they are already using science process skills without even realizing it!",
          },
        },

        // ── SECTION 1 · The Scientific Method (timeline) ─────────────
        {
          type: "timeline",
          heading: "The Scientific Method",
          data: {
            intro:
              "The Scientific Method is the backbone of every scientific investigation. It gives scientists   and students like you   a reliable roadmap for asking questions and finding answers based on evidence, not guesswork.",
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
                  "Before experimenting, scientists research what is already known about the topic. This prevents repeating past mistakes and helps form a smarter hypothesis. Example: reading about photosynthesis before designing a plant growth experiment.",
                tip: "Use books, credible websites, and previous experiments as your sources.",
              },
              {
                num: 3,
                title: "Form a Hypothesis",
                color: "accent",
                description:
                  "A hypothesis is an educated, testable guess written as an 'If… then…' statement. Example: 'If a plant receives more sunlight, then it will grow taller in two weeks.'",
                tip: "A hypothesis must be based on prior knowledge   it is not a random guess.",
              },
              {
                num: 4,
                title: "Conduct an Experiment",
                color: "primary",
                description:
                  "Scientists design a fair test to check whether their hypothesis is correct. They control all variables except the one being tested (the independent variable) and measure the outcome (the dependent variable).",
                tip: "Always repeat your experiment at least 3 times to ensure your results are reliable.",
              },
              {
                num: 5,
                title: "Analyze Data and Draw a Conclusion",
                color: "secondary",
                description:
                  "Scientists record all measurements, organize the data using tables and graphs, and then decide whether their hypothesis was supported or refuted by the evidence.",
                tip: "It is perfectly fine if your hypothesis was wrong   that is still a valuable scientific finding!",
              },
              {
                num: 6,
                title: "Communicate Results",
                color: "accent",
                description:
                  "Scientists share their findings through reports, presentations, or publications so that others can verify, challenge, or build on the results.",
                tip: "Clear communication is what makes science a collaborative, growing body of knowledge.",
              },
            ],
          },
        },

        // ── SECTION 2 · Skills vs. Attitudes (comparison) ────────────
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

        // ── SECTION 3 · Scientific Attitudes (reasonCards) ───────────
        {
          type: "reasonCards",
          heading: "Scientific Attitudes",
          data: {
            intro:
              "Science process skills tell us WHAT to do. Scientific attitudes tell us HOW to do it   with honesty, respect, and responsibility. These attitudes are just as important as the skills themselves, especially when collecting and reporting data.",
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

        // ── SECTION 4 · Real-Life Scenarios (scenario) ───────────────
        {
          type: "scenario",
          heading: "Real-Life Scenarios",
          data: {
            intro:
              "Practice identifying science process skills and attitudes in action! Read each scenario below and decide which skill or attitude is being demonstrated.",
            scenarios: [
              {
                title: "Myra and the Alcohol Containers",
                situation:
                  "Myra lines up three alcohol containers side by side and carefully compares how much liquid each one holds, using the markings on the side of each bottle to determine the exact amount.",
                question:
                  "What science process skill is Myra demonstrating? How is this different from simply looking at the containers?",
                skill:
                  "Measuring   she is using standard markings (units) to determine and compare volumes precisely.",
              },
              {
                title: "Jesse's Loud Knock",
                situation:
                  "Jesse is studying in his room when he hears a loud knock on the front door. He thinks to himself: 'That must be my guest   they said they would arrive around this time.'",
                question:
                  "Jesse cannot see who is at the door yet. Is his conclusion an observation or an inference? What is the difference?",
                skill:
                  "Inferring   Jesse uses prior knowledge (his guest's expected arrival) combined with an observation (the knock) to form an explanation.",
              },
              {
                title: "William and the Watermelon",
                situation:
                  "At the market, William taps a watermelon and listens to the sound it makes. Based on past experience, he says: 'I think this watermelon will be sweet.'",
                question:
                  "William hasn't tasted the watermelon yet. How is this different from an inference? What makes it a prediction?",
                skill:
                  "Predicting   William is using a pattern from past experience to state what will happen in the future.",
              },
              {
                title: "Dhanna Never Gives Up",
                situation:
                  "During the experiment, Dhanna accidentally spills one of her samples. Instead of giving up or making up results, she starts that part of the experiment again from scratch.",
                question:
                  "What scientific attitude is Dhanna demonstrating? Why is this attitude especially important in science?",
                skill:
                  "Perseverance   Dhanna continues despite setbacks, ensuring her results are based on actual evidence.",
              },
            ],
          },
        },

        // ── SECTION 5 · Why Science Matters (applications) ───────────
        {
          type: "applications",
          heading: "Why Science Matters",
          data: {
            apps: [
              {
                title: "Solving Everyday Problems",
                description:
                  "Science process skills are not just for laboratories   they help us solve real problems, from designing better tools to finding cures for diseases. Every invention started with a curious question.",
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
                  "No scientist works alone. Discoveries like vaccines, space travel, and the internet were all made possible by teams sharing ideas, challenging each other, and building on each other's work.",
                icon: "🌍",
                color: "border-l-accent-500",
              },
              {
                title: "You Are Already a Scientist",
                description:
                  "Every time you observe something unusual, ask 'why?', try something to see what happens, and tell someone what you found   you are practicing the scientific method. Science is a way of thinking, not just a subject.",
                icon: "🧪",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 3   Models in Real Life
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-3",
      weekId: "week-1",
      lessonNumber: 3,
      badge: "Lesson 3",
      title: "Models in Real Life",
      subtitle:
        "Discover how scientific models are used every day by doctors, engineers, and scientists to solve real-world problems.",
      readTime: "~15 min read",
      xp: 50,
      heroImage: model,
      heroImageAlt: "Computer simulation model",

      sections: [
        "Key Concepts",
        "Introduction",
        "Models in Action",
        "Why Models Matter",
        "Core Principles",
        "Real-Life Scenarios",
      ],

      references: [
        {
          label: "NASA Earth Observatory   Modeling Climate",
          url: "https://earthobservatory.nasa.gov/features/ModelingClimate",
        },
        {
          label: "NOAA   Climate.gov: What Are Climate Models?",
          url: "https://www.climate.gov/maps-pubs/news/no-models-no-forecasts-inside-science-weather-prediction",
        },
        {
          label: "Wikipedia   Scientific Modelling",
          url: "https://en.wikipedia.org/wiki/Scientific_modelling",
        },
        {
          label: "PBS Learning Media   Computer Simulations in Science",
          url: "https://www.pbslearningmedia.org/",
        },
        {
          label: "Science Daily   Engineering Models",
          url: "https://www.sciencedaily.com/news/matter_energy/engineering/",
        },
      ],

      layout: [
        // ── SECTION 0 · Key Concepts (keyTerms) ──────────────────────

        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Scientific models are not just for textbooks. They are used every day by <strong class='text-primary-700'>doctors, engineers, weather forecasters, and environmentalists</strong> to solve real problems and make life-changing decisions.",
              "A model does not need to be perfect to be useful. Even a simplified version of a system can help scientists predict outcomes, avoid disasters, and design better technology. The key is that a model captures the most important features of the real thing   and in this lesson, we explore exactly how that works across many fields.",
            ],
            didYouKnow:
              "NASA engineers use mathematical models called 'finite element models' to simulate stress on rocket parts before launching   preventing costly failures in space!",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Finite Element Model",
                desc: "A mathematical model that breaks a complex structure like a rocket part or a bridge into thousands of small sections to analyze stress, heat, or vibration before real construction begins.",
              },
              {
                term: "Epidemiological Model",
                desc: "A mathematical or simulation model used to track how a disease spreads through a population, helping governments decide on health interventions and policies.",
              },
              {
                term: "Climate Model",
                desc: "A computer simulation representing Earth's atmosphere, oceans, land, and ice to study how global temperatures and weather patterns change over time.",
              },
              {
                term: "Scale Model",
                desc: "A physical replica of an object built at a proportionally different size   larger or smaller   that preserves the shape and relative dimensions of the original.",
              },
              {
                term: "Predictive Model",
                desc: "Any model   physical, mathematical, or computer-based   used to forecast future events or conditions based on current data and known patterns.",
              },
            ],
          },
        },

        // ── SECTION 1 · Introduction (intro) ─────────────────────────

        // ── SECTION 2 · Models in Action (imageCards) ────────────────
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
                image: weatherforecast,
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
                desc: "Doctors use 3D physical models and mathematical models to understand diseases and plan complex surgeries.",
                image: medicalmodel,
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
                image: engrmodel,
                imageAlt: "Engineering blueprint",
                examples: [
                  "Scale models of bridges to test structural strength",
                  "Aerodynamic simulations for aircraft design",
                  "Car crash simulations using computers",
                ],
              },
              {
                title: "Climate Science",
                label: "Simulation",
                variant: "secondary",
                color: "secondary",
                desc: "Climate scientists use powerful computer models to study how Earth's temperature and weather change over decades.",
                image: climate,
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

        // ── SECTION 3 · Why Models Matter (reasonCards) ──────────────
        {
          type: "reasonCards",
          heading: "Why Models Matter",
          data: {
            intro:
              "Real-world models are not just convenient tools   they are often essential for safety, efficiency, and human survival. Here is why scientists and professionals depend on them every day:",
            reasons: [
              {
                num: 1,
                title: "Safety First",
                color: "primary",
                desc: "Test designs before they are built",
                content:
                  "Engineers crash-test virtual car models thousands of times before a single physical prototype is manufactured.",
              },
              {
                num: 2,
                title: "Save Lives",
                color: "secondary",
                desc: "Predict disasters and disease spread",
                content:
                  "Typhoon simulation models give coastal communities hours or days of warning so they can evacuate safely.",
              },
              {
                num: 3,
                title: "Save Resources",
                color: "accent",
                desc: "Reduce the cost of real-world trials",
                content:
                  "Drug companies use mathematical models to narrow thousands of chemical compounds down to the most promising candidates before lab testing.",
              },
              {
                num: 4,
                title: "Understand the Invisible",
                color: "primary",
                desc: "Simulate what cannot be directly seen",
                content:
                  "Climate models let scientists observe how greenhouse gases warm the planet over 100-year timescales   something no human could watch in real time.",
              },
              {
                num: 5,
                title: "Improve Over Time",
                color: "secondary",
                desc: "Update models as new data arrives",
                content:
                  "Weather prediction models improve every year as satellites provide more precise atmospheric and ocean temperature data.",
              },
            ],
          },
        },

        // ── SECTION 4 · Core Principles (conceptList) ────────────────
        {
          type: "conceptList",
          heading: "Core Principles",
          data: {
            concepts: [
              "All real-world models are simplifications   they represent the most important features of a system, not every detail.",
              "A model's usefulness is judged by how well it predicts or explains real events, not by how realistic it looks.",
              "Models must be validated: their predictions are checked against actual observed data before they are trusted.",
              "When new data contradicts a model's predictions, scientists update or replace the model   models are never final.",
              "The same mathematical framework can often be applied to many different problems (e.g., fluid dynamics equations work for air, water, and blood alike).",
              "Ethical use of models matters: a flawed medical or safety model used carelessly can lead to serious harm.",
            ],
          },
        },

        // ── SECTION 5 · Real-Life Scenarios (scenario) ───────────────
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
                  "Simulation model   it processes real data to predict future events, giving communities time to evacuate and prepare.",
              },
              {
                title: "Building a Safe Bridge",
                situation:
                  "Before constructing a bridge, engineers build a small-scale version and apply forces to test where it bends or breaks. They then redesign the structure based on the results.",
                question:
                  "What type of model are the engineers using? What is the benefit of testing a small version first?",
                skill:
                  "Physical model   it allows engineers to find weaknesses in the design before spending millions on the real structure.",
              },
              {
                title: "Tracking a New Disease",
                situation:
                  "A scientist creates a computer program that simulates how an illness spreads through a school based on how often students are in contact. She uses it to determine if closing one grade level can stop the spread.",
                question:
                  "What type of model is the scientist using? What assumptions might limit its accuracy?",
                skill:
                  "Simulation model   it imitates real-world spread patterns, but assumes all students have the same contact rates, which may not be true.",
              },
              {
                title: "Predicting a Tsunami",
                situation:
                  "After a large earthquake is detected under the ocean floor, scientists run a mathematical model that calculates how fast the resulting wave will travel and where it will reach land.",
                question:
                  "Why is this mathematical model critical for public safety? What data does it need to work correctly?",
                skill:
                  "Mathematical model   it uses earthquake location, depth, and magnitude to calculate wave arrival times, giving coastal communities critical minutes or hours to evacuate.",
              },
            ],
          },
        },
      ],
    },
  ],
};

export const WEEKS_DATA = [
  week01,
  week02,
  week03,
  week04,
  week05,
  week06,
  week07,
  week08,
  week09,
  week10,
  week11,
  week12,
  week13,
  week14,
  week15,
  week16,
  week17,
  week18,
  week19,
  week20,
];
