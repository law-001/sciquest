// Week 9: Laboratory Equipment — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import globe from "../assets/globe.jpg";
import web from "../assets/web.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";
import classroom from "../assets/classroom.webp";
import modernclassroom from "../assets/modernclassroom.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week09 = {
  id: "week-9",
  weekNumber: 9,
  title: "Laboratory Equipment",
  category: "Laboratory Skills",
  description:
    "Identify and learn how to properly use common laboratory equipment found in a science laboratory.",
  icon: "ShieldCheck",
  color: "accent",
  xpReward: 225,
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 25 — Common Laboratory Equipment
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-25",
      weekId: "week-9",
      lessonNumber: 25,
      title: "Common Laboratory Equipment",
      badge: "Lesson 25",
      subtitle:
        "Identify the purpose of common laboratory equipment and learn the rules for their proper care and storage.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "Array of common laboratory glassware and equipment on a bench",

      sections: [
        "Overview",
        "Types of Equipment",
        "Care and Storage",
        "Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "A science laboratory contains many specialized tools, each designed for a specific purpose. Learning to correctly identify and use these tools is a fundamental skill for any scientist. Common equipment includes <strong class='text-primary-700'>beakers</strong> (for holding and heating liquids), <strong class='text-primary-700'>Erlenmeyer flasks</strong> (for mixing without spilling), <strong class='text-primary-700'>graduated cylinders</strong> (for measuring volume precisely), and <strong class='text-primary-700'>test tubes</strong> (for small-scale reactions).",
              "Heating equipment such as the <strong class='text-primary-700'>Bunsen burner</strong>, tripod stand, and wire gauze work together to heat substances safely. Supporting tools like funnels, glass rods, rubber stoppers, forceps, and tongs complete the laboratory toolkit. Using the correct tool for each task ensures accurate results and prevents accidents.",
            ],
            didYouKnow:
              "The Erlenmeyer flask was invented by German chemist Emil Erlenmeyer in 1861. Its tapered neck reduces evaporation and prevents splashing during stirring — making it ideal for chemical reactions.",
          },
        },
        {
          type: "imageCards",
          heading: "Types of Equipment",
          data: {
            cards: [
              {
                title: "Measuring Equipment",
                label: "Precision Tools",
                variant: "primary",
                color: "primary",
                desc: "Measuring tools allow scientists to collect precise quantitative data. Accurate measurement is essential for reproducible and reliable results.",
                image: equation,
                imageAlt:
                  "Graduated cylinder, thermometer, and balance on a lab bench",
                examples: [
                  "Graduated cylinder — measures liquid volume in millilitres",
                  "Thermometer — measures temperature in °C",
                  "Triple-beam balance — measures mass in grams",
                ],
              },
              {
                title: "Heating Equipment",
                label: "Heat Sources",
                variant: "secondary",
                color: "secondary",
                desc: "Heating equipment is used to apply controlled heat to substances. Always use these tools with caution and follow safety guidelines.",
                image: lab,
                imageAlt: "Bunsen burner on a tripod with wire gauze",
                examples: [
                  "Bunsen burner — provides a controllable gas flame for heating",
                  "Tripod stand — supports beakers or flasks over a heat source",
                  "Wire gauze — distributes heat evenly and protects glassware",
                ],
              },
              {
                title: "Containment Equipment",
                label: "Holding Vessels",
                variant: "primary",
                color: "primary",
                desc: "Containment equipment holds, stores, and allows reactions to take place safely. Different vessels are used for different purposes.",
                image: simulation,
                imageAlt:
                  "Beakers, Erlenmeyer flask, and test tubes arranged on a shelf",
                examples: [
                  "Beaker — holds liquids and is used for mixing and heating",
                  "Erlenmeyer flask — ideal for reactions requiring swirling",
                  "Test tube — holds small amounts for individual reactions",
                ],
              },
            ],
          },
        },
        {
          type: "conceptList",
          heading: "Care and Storage",
          data: {
            concepts: [
              "Always inspect glassware for cracks or chips before use — damaged glassware can break during heating and cause injury.",
              "Clean all equipment with water and appropriate cleaning agents immediately after use to prevent chemical residue from hardening.",
              "Store glassware upright on designated shelves and never place it near the edge of a bench where it can fall.",
              "Allow heated glassware to cool completely before rinsing with cold water to prevent thermal shock and cracking.",
              "Return all equipment to its proper labeled storage location after use so it is ready for the next person.",
              "Report any damaged or broken equipment to the teacher immediately — never use broken lab tools.",
            ],
          },
        },
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "Chemistry Experiments",
                description:
                  "Beakers, flasks, and test tubes are used in chemistry labs worldwide to mix reagents, observe reactions, and collect products.",
                icon: "🧪",
                color: "border-l-primary-500",
              },
              {
                title: "Biology Labs",
                description:
                  "Microscopes, slides, and forceps are used in biology labs to observe specimens such as cells, microorganisms, and plant tissues.",
                icon: "🔬",
                color: "border-l-secondary-500",
              },
              {
                title: "Food Science",
                description:
                  "Food laboratories use graduated cylinders, balances, and thermometers to measure precise ingredient quantities and monitor cooking temperatures.",
                icon: "🍳",
                color: "border-l-accent-500",
              },
              {
                title: "Medical Testing",
                description:
                  "Hospital and clinical labs use many of the same basic tools — test tubes, pipettes, and balances — to analyze blood, urine, and tissue samples.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 26 — Using the Microscope
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-26",
      weekId: "week-9",
      lessonNumber: 26,
      title: "Using the Microscope",
      badge: "Lesson 26",
      subtitle:
        "Learn the parts of a compound microscope, how to calculate magnification, and the correct procedure for making observations.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt: "Close-up of a compound microscope with labeled parts",

      sections: [
        "Overview",
        "Key Terms",
        "How to Use a Microscope",
        "Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>compound microscope</strong> is one of the most important tools in biology. It uses two sets of lenses — the eyepiece (ocular lens) and the objective lenses — to magnify specimens to hundreds of times their actual size. The total magnification is calculated by multiplying the eyepiece power by the objective lens power.",
              "The standard eyepiece has a magnification of <strong class='text-primary-700'>10×</strong>. The objective lenses typically provide 4× (low power), 10× (medium power), and 40× (high power). So the total magnification at high power is 10 × 40 = <strong class='text-primary-700'>400×</strong>. Always start with the lowest power objective when viewing a new slide.",
            ],
            didYouKnow:
              "The first compound microscope was invented around 1590 by Dutch spectacle makers Hans and Zacharias Janssen. Today, electron microscopes can magnify objects up to 10 million times their actual size!",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Compound Microscope",
                desc: "A microscope that uses two or more lenses — an eyepiece and one or more objective lenses — to magnify specimens.",
              },
              {
                term: "Eyepiece",
                desc: "The lens at the top of the microscope through which the observer looks. Also called the ocular lens; usually 10× magnification.",
              },
              {
                term: "Objective Lens",
                desc: "The lens closest to the specimen on a rotating nosepiece. Comes in different magnifications: 4× (low), 10× (medium), 40× (high).",
              },
              {
                term: "Magnification",
                desc: "The degree to which an object is enlarged. Total magnification = eyepiece power × objective lens power.",
              },
              {
                term: "Stage",
                desc: "The flat platform on which the glass slide holding the specimen is placed. Stage clips hold the slide in position.",
              },
              {
                term: "Focus",
                desc: "Adjusting the lens distance to produce a sharp, clear image. The coarse focus knob makes large adjustments; the fine focus knob makes small precise adjustments.",
              },
              {
                term: "Specimen",
                desc: "The object being observed under the microscope, prepared on a glass slide and usually covered with a cover slip.",
              },
            ],
          },
        },
        {
          type: "timeline",
          heading: "How to Use a Microscope",
          data: {
            intro:
              "Follow these steps in order every time you use a compound microscope. Using the correct procedure protects both the microscope lenses and your specimen.",
            steps: [
              {
                num: 1,
                title: "Start with the Lowest Power Objective",
                color: "primary",
                description:
                  "Rotate the nosepiece to the lowest power objective (4×). This gives the widest field of view and makes it easiest to locate your specimen before magnifying further.",
                tip: "Always start at low power — jumping straight to high power can damage the lens or slide if the stage is too high.",
              },
              {
                num: 2,
                title: "Place and Secure the Slide",
                color: "secondary",
                description:
                  "Place the prepared glass slide on the stage with the specimen centered over the light hole. Secure it with the stage clips so it does not shift during observation.",
                tip: "Make sure the cover slip is face up and the specimen is directly above the stage opening.",
              },
              {
                num: 3,
                title: "Use the Coarse Focus Knob",
                color: "accent",
                description:
                  "While looking from the side (not through the eyepiece), turn the coarse focus knob to raise the stage close to the objective lens. Then look through the eyepiece and turn the coarse knob slowly to bring the image into rough focus.",
                tip: "Watch from the side first to prevent the objective from crashing into and breaking the slide.",
              },
              {
                num: 4,
                title: "Switch to a Higher Power Objective",
                color: "primary",
                description:
                  "Once the specimen is focused at low power, rotate the nosepiece to the next objective (10× or 40×). The specimen should remain roughly in focus — only small adjustments are needed.",
                tip: "Never use the coarse focus knob at high power — it can drive the lens into the slide and cause damage.",
              },
              {
                num: 5,
                title: "Use the Fine Focus Knob",
                color: "secondary",
                description:
                  "Turn the fine focus knob in small increments to sharpen the image at higher magnification. Adjust the diaphragm to control the amount of light for the clearest image.",
                tip: "Reducing light slightly with the diaphragm often improves contrast and makes details more visible.",
              },
              {
                num: 6,
                title: "Draw Your Observation",
                color: "accent",
                description:
                  "Sketch what you see accurately in a circle representing the field of view. Label key structures, note the magnification used, and write the name of the specimen.",
                tip: "Draw what you actually see, not what you think you should see — scientific illustration requires accuracy.",
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
                title: "Studying Microorganisms",
                description:
                  "Microscopes allow biologists to observe bacteria, protozoa, algae, and fungi that are invisible to the naked eye.",
                icon: "🦠",
                color: "border-l-primary-500",
              },
              {
                title: "Diagnosing Diseases",
                description:
                  "Medical laboratories use microscopes to examine blood cells, identify pathogens, and diagnose infections, cancers, and parasitic diseases.",
                icon: "🩺",
                color: "border-l-secondary-500",
              },
              {
                title: "Identifying Plant Cells",
                description:
                  "Botanists use microscopes to study plant cell structure — including cell walls, chloroplasts, and vacuoles — to understand plant biology.",
                icon: "🌿",
                color: "border-l-accent-500",
              },
              {
                title: "Forensic Science",
                description:
                  "Crime scene investigators use microscopes to analyze hair, fiber, soil, and other trace evidence to link suspects to crime scenes.",
                icon: "🔎",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 27 — Proper Handling of Lab Materials
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-27",
      weekId: "week-9",
      lessonNumber: 27,
      title: "Proper Handling of Lab Materials",
      badge: "Lesson 27",
      subtitle:
        "Learn the correct procedures for safely handling chemicals, glassware, heat sources, and biological specimens in the laboratory.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: modernclassroom,
      heroImageAlt:
        "Students properly handling lab materials while wearing safety equipment",

      sections: [
        "Overview",
        "Why Safe Handling Matters",
        "Emergency Scenarios",
        "Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Proper handling of laboratory materials is the foundation of laboratory safety. When working with <strong class='text-primary-700'>chemicals</strong>, never taste them, avoid breathing vapors directly, and always use the minimum amount needed. When using <strong class='text-primary-700'>glassware</strong>, inspect each piece for cracks before use and report any breakage immediately.",
              "Heat sources require constant attention — never leave a lit Bunsen burner unattended and always use tongs or heat-resistant holders when handling hot objects. When working with <strong class='text-primary-700'>biological specimens</strong> such as dissected animals or bacteria cultures, wear gloves and dispose of all materials according to your teacher's instructions.",
            ],
            didYouKnow:
              "When smelling a chemical in the lab, scientists use a technique called 'wafting' — gently fanning the vapors toward the nose with one hand instead of placing the nose directly over the container. This prevents inhaling a dangerous concentration of fumes.",
          },
        },
        {
          type: "reasonCards",
          heading: "Why Safe Handling Matters",
          data: {
            intro:
              "Each category of lab material carries specific risks. Understanding why proper handling is necessary helps you make smart decisions in any situation that arises in the lab.",
            reasons: [
              {
                num: 1,
                title: "Prevent Cuts from Broken Glass",
                color: "primary",
                desc: "Broken glassware causes the most common lab injuries",
                content:
                  "Always inspect glassware for chips and cracks. Use dustpan and brush (never bare hands) to clean up broken glass.",
              },
              {
                num: 2,
                title: "Prevent Chemical Burns",
                color: "secondary",
                desc: "Corrosive chemicals can permanently damage skin and eyes",
                content:
                  "Wear gloves and goggles. In case of spill on skin, flush immediately with large amounts of water for at least 15 minutes.",
              },
              {
                num: 3,
                title: "Prevent Fire and Burns",
                color: "accent",
                desc: "Open flames and hot glassware are serious burn hazards",
                content:
                  "Never leave a Bunsen burner unattended. Use tongs to handle hot equipment. Keep flammable materials away from open flames.",
              },
              {
                num: 4,
                title: "Prevent Contamination",
                color: "primary",
                desc: "Biological specimens and chemicals can cause illness if ingested",
                content:
                  "Never eat or drink in the laboratory. Wash hands thoroughly after every lab session. Dispose of biological waste properly.",
              },
              {
                num: 5,
                title: "Protect the Environment",
                color: "secondary",
                desc: "Improper disposal of chemicals harms ecosystems",
                content:
                  "Never pour chemicals down the drain without checking disposal instructions. Follow your teacher's guidelines for chemical disposal.",
              },
            ],
          },
        },
        {
          type: "scenario",
          heading: "Emergency Scenarios",
          data: {
            intro:
              "Knowing the correct response to a lab emergency can prevent a minor incident from becoming a serious injury. Read each scenario and identify the proper procedure.",
            scenarios: [
              {
                title: "Broken Glass on the Bench",
                situation:
                  "During an experiment, a student accidentally knocks a beaker off the bench. It shatters on the floor, scattering glass fragments. The student is not injured.",
                question:
                  "What should the student do immediately? What should NOT be done?",
                skill:
                  "Notify the teacher immediately. Do not pick up glass with bare hands — use a dustpan and brush. Keep other students away from the area until it is fully cleaned. Dispose of glass in a labeled 'sharps' or 'broken glass' container.",
              },
              {
                title: "Chemical Spill on Skin",
                situation:
                  "A student accidentally spills a small amount of dilute acid on their forearm while pouring. The skin begins to feel warm and slightly irritated.",
                question:
                  "What is the correct first response? How long should the treatment continue?",
                skill:
                  "Immediately flood the affected area with large amounts of cold running water for at least 15 minutes. Remove any contaminated clothing if safe to do so. Notify the teacher and seek medical attention if irritation persists.",
              },
              {
                title: "Overheating Test Tube",
                situation:
                  "A student is heating a liquid in a test tube over a Bunsen burner. The liquid begins to boil rapidly and the student notices small droplets of liquid being ejected from the tube.",
                question:
                  "What should the student do to prevent injury to themselves and classmates?",
                skill:
                  "Point the open end of the test tube away from all people immediately. Remove the heat source. Hold the test tube at a 45° angle while heating — never point it at anyone. Heat gently and continuously move the tube through the flame.",
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
                title: "Accident Prevention",
                description:
                  "Following proper handling procedures dramatically reduces the risk of the most common lab accidents: cuts, burns, spills, and chemical exposures.",
                icon: "🛡️",
                color: "border-l-primary-500",
              },
              {
                title: "Protecting the Environment",
                description:
                  "Correct disposal of chemicals and biological waste prevents harmful substances from entering water supplies, soil, and ecosystems.",
                icon: "🌍",
                color: "border-l-secondary-500",
              },
              {
                title: "Long-Term Safety Culture",
                description:
                  "Good habits learned in school labs carry over into professional scientific, medical, and industrial workplaces throughout a person's career.",
                icon: "📚",
                color: "border-l-accent-500",
              },
              {
                title: "Protecting Expensive Equipment",
                description:
                  "Proper handling extends the life of microscopes, balances, and glassware, keeping laboratory resources available for future students and experiments.",
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
