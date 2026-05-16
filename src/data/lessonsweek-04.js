// Week 4: Scientific Investigation — Grade 7 Science

import equation from "../assets/equation.jpg";
import lab from "../assets/lab.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week04 = {
  id: "week-4",
  weekNumber: 4,
  title: "Scientific Investigation",
  category: "Scientific Method",
  description:
    "Learn how to design and conduct a proper scientific investigation by identifying variables, collecting data, and drawing conclusions.",
  icon: "FlaskConical",
  color: "primary",
  xpReward: 225,
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 10 — Parts of a Scientific Investigation
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-10",
      weekId: "week-4",
      lessonNumber: 10,
      title: "Parts of a Scientific Investigation",
      badge: "Lesson 10",
      subtitle:
        "Discover the structured steps scientists use to investigate questions and find reliable, evidence-based answers.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt: "Flowchart showing the steps of a scientific investigation",

      sections: [
        "Introduction",
        "Key Terms",
        "Steps of a Scientific Investigation",
        "Applications",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "A <strong class='text-primary-700'>scientific investigation</strong> is a systematic process used by scientists to answer questions about the natural world. Unlike guessing, a scientific investigation gathers real <strong class='text-primary-700'>evidence</strong> through careful observation and experimentation. Every good investigation follows a similar set of steps to ensure that the results are valid and reliable.",
              "Understanding how to conduct a proper scientific investigation is one of the most valuable skills you can learn. Whether you want to find out which fertilizer helps plants grow best, or why a bridge might be unsafe, the same logical steps apply. The <strong class='text-primary-700'>scientific method</strong> gives us a reliable roadmap for discovering the truth through evidence.",
            ],
            didYouKnow:
              "The first known written scientific investigation was conducted by the ancient Egyptian physician Imhotep around 2650 BCE. He recorded medical observations and treatments systematically — thousands of years before the modern scientific method was formalized!",
          },
        },

        // ── Section 1: Key Terms ──
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Hypothesis",
                desc: "An educated, testable prediction that answers a scientific question. Written as an 'If... then...' statement based on prior knowledge and observations.",
              },
              {
                term: "Experiment",
                desc: "A controlled procedure designed to test a hypothesis by changing one variable and measuring the effect on another while keeping all other conditions the same.",
              },
              {
                term: "Data",
                desc: "Factual information — measurements, observations, and records — collected during an investigation. Data is the evidence used to support or reject a hypothesis.",
              },
              {
                term: "Conclusion",
                desc: "A summary statement that explains what the data shows and whether the hypothesis was supported or rejected. A good conclusion also suggests further questions.",
              },
              {
                term: "Research",
                desc: "The process of gathering background information about a topic before designing an investigation. Research helps form a stronger hypothesis and avoids repeating known mistakes.",
              },
              {
                term: "Scientific Method",
                desc: "A systematic, step-by-step process for investigating questions, collecting evidence, and drawing conclusions in a reliable and reproducible way.",
              },
            ],
          },
        },

        // ── Section 2: Steps (timeline) ──
        {
          type: "timeline",
          heading: "Steps of a Scientific Investigation",
          data: {
            intro:
              "Every scientific investigation follows these seven steps. Following them carefully ensures that results are valid, reliable, and meaningful.",
            steps: [
              {
                num: 1,
                title: "Identify the Problem or Question",
                color: "primary",
                description:
                  "Start by identifying a specific, testable question about something you want to understand. A good scientific question is clear, focused, and can be answered through investigation. Example: 'Does the amount of water affect the height of bean plants after 2 weeks?'",
                tip: "Avoid questions that are too broad or cannot be tested with an experiment.",
              },
              {
                num: 2,
                title: "Research the Topic",
                color: "secondary",
                description:
                  "Before designing your experiment, gather background information about the topic. Read textbooks, articles, or reports to understand what is already known. This prevents duplicating past work and helps you form a smarter hypothesis.",
                tip: "Use reliable sources — science journals, textbooks, and educational websites are more trustworthy than random internet pages.",
              },
              {
                num: 3,
                title: "Form a Hypothesis",
                color: "accent",
                description:
                  "Based on your research, write a testable prediction about what you think will happen in your experiment. Example: 'If a bean plant receives more water per day, then it will grow taller after 2 weeks.'",
                tip: "A hypothesis is not a fact — it is your best prediction based on available evidence. It must be something you can test.",
              },
              {
                num: 4,
                title: "Design the Experiment",
                color: "primary",
                description:
                  "Plan how you will test your hypothesis. Identify the independent variable (what you change), the dependent variable (what you measure), and the controlled variables (what stays the same). Write a clear step-by-step procedure.",
                tip: "Change only ONE variable at a time to ensure your results are meaningful and not caused by multiple factors.",
              },
              {
                num: 5,
                title: "Collect Data",
                color: "secondary",
                description:
                  "Carry out your experiment and record all observations and measurements carefully. Use tables, charts, and notes to organize your data. Always record what actually happens — never change data to match your hypothesis.",
                tip: "Perform multiple trials (at least 3) to improve the reliability of your results.",
              },
              {
                num: 6,
                title: "Analyze Data and Identify Patterns",
                color: "accent",
                description:
                  "Look at your data and identify patterns, trends, or relationships. Calculate averages, create graphs, and compare results across your trials. Ask yourself: What does the data actually show?",
                tip: "Graphs (bar, line, pie) make patterns in data easier to see and communicate to others.",
              },
              {
                num: 7,
                title: "Draw Conclusions and Communicate Results",
                color: "primary",
                description:
                  "Write a conclusion that states whether your hypothesis was supported or rejected, and why. Explain any unexpected results. Then share your findings with others through a report, presentation, or poster.",
                tip: "A rejected hypothesis is still a valuable finding — it narrows down possible explanations and guides future investigations.",
              },
            ],
          },
        },

        // ── Section 3: Applications ──
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Medicine",
                description:
                  "Medical researchers use scientific investigations (clinical trials) to test whether new treatments, vaccines, and drugs are safe and effective before they are given to patients.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "Engineering",
                description:
                  "Engineers use investigations to test the strength of materials, the efficiency of new designs, and the safety of structures before they are built at full scale.",
                icon: "🏗️",
                color: "border-l-secondary-500",
              },
              {
                title: "Environmental Science",
                description:
                  "Scientists conduct investigations to measure pollution levels, track the health of ecosystems, and study the effects of human activities on the natural environment.",
                icon: "🌿",
                color: "border-l-accent-500",
              },
              {
                title: "Agriculture",
                description:
                  "Farmers and agricultural scientists use investigations to find the best growing conditions, most effective fertilizers, and most resistant crop varieties to improve food production.",
                icon: "🌾",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 11 — Variables and Controls
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-11",
      weekId: "week-4",
      lessonNumber: 11,
      title: "Variables and Controls",
      badge: "Lesson 11",
      subtitle:
        "Learn to identify the independent variable, dependent variable, controlled variables, and control group in any experiment.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt: "Laboratory setup showing controlled experiment",

      sections: [
        "Introduction",
        "Independent vs. Dependent Variable",
        "Key Concepts",
        "Experiment Scenarios",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "For an experiment to produce reliable results, scientists must carefully control what changes and what stays the same. In every experiment there are three types of variables: the <strong class='text-primary-700'>independent variable</strong> (what you deliberately change), the <strong class='text-primary-700'>dependent variable</strong> (what you measure as a result), and <strong class='text-primary-700'>controlled variables</strong> (everything else that must stay constant).",
              "A <strong class='text-primary-700'>control group</strong> is a group in the experiment that receives no treatment and is used as a baseline for comparison. Without a control group, it is impossible to know whether the independent variable truly caused the observed changes. A fair test changes only one variable at a time.",
            ],
            didYouKnow:
              "The concept of the controlled experiment was pioneered by the Arab scientist Ibn al-Haytham around 1000 CE. He used controlled tests of light and vision — setting the foundation for modern experimental design!",
          },
        },

        // ── Section 1: Comparison ──
        {
          type: "comparison",
          heading: "Independent vs. Dependent Variable",
          data: {
            intro:
              "The independent variable and dependent variable play different roles in an experiment. Understanding their distinction is essential for designing a fair test.",
            left: {
              label: "Independent Variable",
              color: "primary",
              items: [
                "Definition: The variable that is deliberately changed or manipulated by the experimenter",
                "Example: The amount of fertilizer added to each plant group (0g, 5g, 10g)",
                "Who controls it: The experimenter — it is intentionally varied",
                "How identified: Ask 'What am I changing in this experiment?'",
                "Role: The cause — changes in this variable are expected to produce changes in the dependent variable",
              ],
            },
            right: {
              label: "Dependent Variable",
              color: "secondary",
              items: [
                "Definition: The variable that is observed and measured to see the effect of the independent variable",
                "Example: The height of the plant (in cm) after 2 weeks",
                "Who controls it: Nobody — it responds naturally to changes in the independent variable",
                "How identified: Ask 'What am I measuring or observing?'",
                "Role: The effect — changes in this variable show whether the independent variable had an impact",
              ],
            },
          },
        },

        // ── Section 2: Concept List ──
        {
          type: "conceptList",
          heading: "Key Concepts",
          data: {
            concepts: [
              "In a fair test, only the independent variable is changed — all other conditions (controlled variables) must remain the same for each group.",
              "Controlled variables are factors that could affect the dependent variable but are kept constant to prevent them from interfering with results (e.g., pot size, soil type, watering schedule).",
              "A control group receives no treatment and is used as a baseline for comparing the results from the experimental groups.",
              "If more than one variable is changed at the same time, it is impossible to determine which change caused the observed results.",
              "Every experiment should be repeated (multiple trials) to check if results are consistent and not due to random chance.",
              "The more controlled variables an experiment has, the more confident a scientist can be that the independent variable caused the observed changes in the dependent variable.",
            ],
          },
        },

        // ── Section 3: Scenarios ──
        {
          type: "scenario",
          heading: "Experiment Scenarios",
          data: {
            intro:
              "Practice identifying variables in these experiment scenarios. For each one, identify the independent variable, dependent variable, and at least two controlled variables.",
            scenarios: [
              {
                title: "Plant Growth Experiment",
                situation:
                  "A student sets up 4 groups of bean plants. Group A gets 0 mL of water per day, Group B gets 50 mL, Group C gets 100 mL, and Group D gets 150 mL. All plants use the same soil, pot size, amount of sunlight, and room temperature. After 2 weeks, the student measures plant height.",
                question:
                  "What is the independent variable, dependent variable, and the control group? What are two controlled variables?",
                skill:
                  "IV: amount of water per day. DV: plant height after 2 weeks. Control group: Group A (0 mL). Controlled variables: soil type, pot size, sunlight, temperature.",
              },
              {
                title: "Dissolving Sugar Experiment",
                situation:
                  "A student tests whether temperature affects how quickly sugar dissolves. She dissolves 10 g of sugar in 200 mL of water at temperatures of 10°C, 30°C, 50°C, and 70°C. She uses the same brand of sugar and the same volume of water in each trial.",
                question:
                  "What is the independent variable? What is the dependent variable? What would the control group look like?",
                skill:
                  "IV: temperature of the water. DV: time it takes for the sugar to dissolve. Control: a trial at room temperature (~25°C) with no special heating or cooling. Controlled: amount of sugar, volume of water, brand of sugar.",
              },
              {
                title: "Sunscreen Effectiveness",
                situation:
                  "A student wants to test which brand of sunscreen blocks more UV rays. She applies three different sunscreens (Brand A, B, C) to separate pieces of UV-sensitive paper and exposes all of them to sunlight for 15 minutes at the same time of day.",
                question:
                  "Identify the independent variable, dependent variable, and one controlled variable. Why is it important that all papers are exposed at the same time?",
                skill:
                  "IV: brand of sunscreen (A, B, or C). DV: amount of UV light that passes through (color change of paper). Controlled: exposure time, time of day, distance from sunlight source. Exposing all at the same time controls sunlight intensity.",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 12 — Data Collection and Recording
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-12",
      weekId: "week-4",
      lessonNumber: 12,
      title: "Data Collection and Recording",
      badge: "Lesson 12",
      subtitle:
        "Master the skills of collecting, organizing, and presenting scientific data accurately and honestly.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: equation,
      heroImageAlt: "Data table and graphs on a laboratory worksheet",

      sections: [
        "Introduction",
        "Key Terms",
        "Why Multiple Trials Matter",
        "Applications",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Collecting and recording data accurately is one of the most important steps in any scientific investigation. Scientists collect two main types of data: <strong class='text-primary-700'>quantitative data</strong> (numerical measurements) and <strong class='text-primary-700'>qualitative data</strong> (descriptive observations). Both types provide valuable information about what is happening in an experiment.",
              "Once data is collected, scientists organize it into <strong class='text-primary-700'>tables</strong> and represent it visually using <strong class='text-primary-700'>graphs</strong> — such as bar graphs, line graphs, and pie charts. Good data recording requires accuracy, honesty, and consistency. Always record what you actually observe, even if the results are unexpected.",
            ],
            didYouKnow:
              "Florence Nightingale, the founder of modern nursing, was also a brilliant data scientist. She created detailed statistical charts of hospital death rates in the 1850s — and her visual data convinced the British government to improve sanitation in military hospitals, saving thousands of lives.",
          },
        },

        // ── Section 1: Key Terms ──
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Quantitative Data",
                desc: "Data expressed as numbers and measurements, such as mass in grams, temperature in °C, or height in centimeters. Quantitative data can be graphed and calculated.",
              },
              {
                term: "Qualitative Data",
                desc: "Data expressed as descriptions or observations, such as color, texture, shape, or smell. Qualitative data cannot be directly measured with a ruler or scale.",
              },
              {
                term: "Table",
                desc: "An organized grid used to record and display data with clearly labeled rows and columns. Tables make it easy to compare values across different conditions or trials.",
              },
              {
                term: "Graph",
                desc: "A visual representation of data. Bar graphs compare categories, line graphs show change over time, and pie charts show percentages of a whole.",
              },
              {
                term: "Mean",
                desc: "The average of a set of data values, calculated by adding all values and dividing by the number of values. The mean helps summarize results across multiple trials.",
              },
              {
                term: "Multiple Trials",
                desc: "Repeating an experiment more than once under the same conditions. Multiple trials reduce the effect of random error and increase the reliability of results.",
              },
            ],
          },
        },

        // ── Section 2: Reason Cards (Why Multiple Trials Matter) ──
        {
          type: "reasonCards",
          heading: "Why Multiple Trials Matter",
          data: {
            intro:
              "Running an experiment only once can give misleading results. Repeating an experiment multiple times under the same conditions is one of the most important habits in science. Here is why:",
            reasons: [
              {
                num: 1,
                title: "Reduces Random Error",
                color: "primary",
                desc: "Random errors affect one trial but not all trials",
                content:
                  "If a scale gives a slightly off reading on one trial, averaging multiple trials reduces the impact of that single error on your final result.",
              },
              {
                num: 2,
                title: "Confirms Reproducibility",
                color: "secondary",
                desc: "Results that repeat are more trustworthy",
                content:
                  "If you get the same result every time you repeat the experiment, it is much more likely to be real rather than a fluke or accident.",
              },
              {
                num: 3,
                title: "Allows Calculation of Mean",
                color: "accent",
                desc: "Multiple results can be averaged for a better estimate",
                content:
                  "Taking the mean of multiple trials gives a more accurate picture of the true result than any single measurement alone.",
              },
              {
                num: 4,
                title: "Identifies Outliers",
                color: "primary",
                desc: "Unusual results stand out when compared to others",
                content:
                  "If one trial gives a very different result from the others, you can identify it as an outlier and investigate what went wrong.",
              },
              {
                num: 5,
                title: "Strengthens Scientific Conclusions",
                color: "secondary",
                desc: "More data = more confidence in the conclusion",
                content:
                  "Scientists and peer reviewers trust conclusions more when they are based on many consistent trials rather than a single observation.",
              },
            ],
          },
        },

        // ── Section 3: Applications ──
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Clinical Trials",
                description:
                  "Medical researchers test drugs and treatments using thousands of patients across multiple trials. This large-scale data collection ensures that only safe and effective treatments are approved for public use.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Quality Control",
                description:
                  "Factories test products repeatedly during manufacturing to ensure consistency and safety. Data from multiple tests helps identify defects early before products reach consumers.",
                icon: "🏭",
                color: "border-l-secondary-500",
              },
              {
                title: "Weather Monitoring",
                description:
                  "Weather stations record temperature, rainfall, and pressure thousands of times per day. This continuous data collection enables accurate forecasts and long-term climate tracking.",
                icon: "🌤️",
                color: "border-l-accent-500",
              },
              {
                title: "Sports Analytics",
                description:
                  "Coaches and trainers use quantitative data (speed, jump height, heart rate) and qualitative data (technique observations) to track athlete performance and design better training programs.",
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
