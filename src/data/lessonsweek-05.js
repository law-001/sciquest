// Week 5: Measurement in Science — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week05 = {
  id: "week-5",
  weekNumber: 5,
  title: "Measurement in Science",
  category: "Scientific Method",
  description:
    "Master the International System of Units (SI) and learn how to measure length, mass, volume, and temperature accurately.",
  icon: "Ruler",
  color: "secondary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 13 — SI Units and Measurement Tools
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-13",
      weekId: "week-5",
      lessonNumber: 13,
      title: "SI Units and Measurement Tools",
      badge: "Lesson 13",
      subtitle:
        "Understand the International System of Units and how to choose the correct measurement tool for any quantity.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: equation,
      heroImageAlt: "Scientific measurement tools and unit labels",

      sections: [
        "Introduction",
        "Key Terms",
        "Measurement Tools",
        "Applications",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>International System of Units</strong> (SI, from the French Système International d'Unités) is the modern form of the metric system used by scientists worldwide. By agreeing on a single system of measurement, scientists from different countries can share and verify each other's results without confusion.",
              "SI is built on <strong class='text-primary-700'>base units</strong> — fundamental units that measure one specific quantity. From these, all other units are derived. Common metric prefixes like <strong class='text-primary-700'>kilo-</strong>, <strong class='text-primary-700'>centi-</strong>, and <strong class='text-primary-700'>milli-</strong> make it easy to express very large or very small quantities by multiplying or dividing by powers of ten.",
            ],
            didYouKnow:
              "In 1999, NASA lost a $125 million Mars orbiter because one engineering team used metric units while another used imperial (non-metric) units. The spacecraft burned up in the Martian atmosphere — a costly reminder of why standard units matter!",
          },
        },

        // ── Section 1: Key Terms ──
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "SI Units",
                desc: "The International System of Units — the globally agreed standard for scientific measurement. Based on the metric system and used in all countries for science.",
              },
              {
                term: "Meter (m)",
                desc: "The SI base unit of length. A meter is approximately the distance from the floor to a door handle. Smaller lengths use centimeters (cm) or millimeters (mm).",
              },
              {
                term: "Kilogram (kg)",
                desc: "The SI base unit of mass. One kilogram equals 1,000 grams. The mass of everyday objects is typically measured in grams or kilograms.",
              },
              {
                term: "Liter (L)",
                desc: "The SI unit for volume of liquids and gases. One liter equals 1,000 milliliters (mL). Scientists also use cm³ (cubic centimeters) for volume.",
              },
              {
                term: "Metric Prefix",
                desc: "A word part added before an SI unit to indicate a multiple or fraction of that unit. Examples: kilo- (×1,000), centi- (÷100), milli- (÷1,000).",
              },
              {
                term: "Derived Unit",
                desc: "A unit formed by combining two or more base units. Examples: speed (m/s), area (m²), density (g/cm³), and volume (cm³ or m³).",
              },
            ],
          },
        },

        // ── Section 2: Measurement Tools (imageCards) ──
        {
          type: "imageCards",
          heading: "Measurement Tools",
          data: {
            cards: [
              {
                title: "Length Tools",
                label: "Length",
                variant: "primary",
                color: "primary",
                desc: "Length is measured in meters (m), centimeters (cm), or millimeters (mm) using rulers, meter sticks, and calipers.",
                image: equation,
                imageAlt: "Ruler and measurement tools",
                examples: [
                  "Ruler (15–30 cm): measures small objects like pencils or paper",
                  "Meter stick (1 m): measures larger objects like furniture or room dimensions",
                  "Vernier caliper: measures very small lengths with high precision (e.g., wire diameter)",
                ],
              },
              {
                title: "Mass Tools",
                label: "Mass",
                variant: "secondary",
                color: "secondary",
                desc: "Mass is measured in kilograms (kg) or grams (g) using balance scales and digital scales.",
                image: lab,
                imageAlt: "Balance scale in a laboratory",
                examples: [
                  "Triple beam balance: measures mass precisely in grams using sliding masses",
                  "Digital electronic scale: gives a direct mass reading in grams or kilograms",
                  "Platform balance: used in classrooms for measuring larger masses",
                ],
              },
              {
                title: "Volume Tools",
                label: "Volume",
                variant: "primary",
                color: "primary",
                desc: "Volume of liquids is measured in liters (L) or milliliters (mL) using graduated cylinders and beakers.",
                image: simulation,
                imageAlt: "Graduated cylinder with liquid",
                examples: [
                  "Graduated cylinder: most accurate for measuring liquid volume; read at the bottom of the meniscus",
                  "Beaker: used for approximate volume measurements and mixing, not for precise readings",
                  "Measuring pipette: used in labs for very small, precise volumes of liquid",
                ],
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
                title: "Medicine and Dosing",
                description:
                  "Doctors and pharmacists use SI units to measure and prescribe exact drug doses in milligrams (mg) or milliliters (mL). Incorrect measurement could be life-threatening.",
                icon: "💊",
                color: "border-l-primary-500",
              },
              {
                title: "International Trade",
                description:
                  "Countries that trade goods internationally rely on SI units to agree on the mass, volume, and dimensions of products — from food shipments to building materials.",
                icon: "🚢",
                color: "border-l-secondary-500",
              },
              {
                title: "Engineering and Construction",
                description:
                  "Engineers use precise SI measurements when designing bridges, buildings, and machines. A measurement error of even a few millimeters can cause structural failure.",
                icon: "🏗️",
                color: "border-l-accent-500",
              },
              {
                title: "Cooking and Food Science",
                description:
                  "Recipes in science use grams (g) for mass and milliliters (mL) for liquids — not cups or tablespoons — because SI units give consistent, repeatable results every time.",
                icon: "🍳",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 14 — Measuring Length, Mass, and Volume
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-14",
      weekId: "week-5",
      lessonNumber: 14,
      title: "Measuring Length, Mass, and Volume",
      badge: "Lesson 14",
      subtitle:
        "Learn the correct technique for using a ruler, triple beam balance, and graduated cylinder to take accurate measurements.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt: "Student measuring liquid in a graduated cylinder",

      sections: [
        "Introduction",
        "Using a Graduated Cylinder",
        "Measurement Tips",
        "Applications",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "Knowing which measurement tool to use is only half the skill. You must also know <strong class='text-primary-700'>how to use each tool correctly</strong> to get accurate readings. Small mistakes — like reading a ruler at an angle, or forgetting to zero a balance — can produce errors that ruin an entire experiment.",
              "The three most common measurements in Grade 7 science are <strong class='text-primary-700'>length</strong> (using a ruler or meter stick), <strong class='text-primary-700'>mass</strong> (using a triple beam balance), and <strong class='text-primary-700'>volume of liquids</strong> (using a graduated cylinder). Each tool has its own correct technique that must be followed every time for reliable results.",
            ],
            didYouKnow:
              "When you read a graduated cylinder, the water curves up at the edges due to surface tension — forming a curved surface called a meniscus. You must always read from the bottom of the meniscus at eye level for an accurate reading!",
          },
        },

        // ── Section 1: Graduated Cylinder Steps (timeline) ──
        {
          type: "timeline",
          heading: "Using a Graduated Cylinder",
          data: {
            intro:
              "A graduated cylinder is the most accurate tool for measuring liquid volume in a laboratory. Follow these steps every time for a correct and reliable reading.",
            steps: [
              {
                num: 1,
                title: "Choose the Correct Cylinder Size",
                color: "primary",
                description:
                  "Select a graduated cylinder whose capacity is close to the volume you want to measure. Using a 100 mL cylinder for 5 mL of liquid gives less precision than using a 10 mL cylinder.",
                tip: "Use the smallest graduated cylinder that can hold the full volume of your liquid.",
              },
              {
                num: 2,
                title: "Place the Cylinder on a Flat, Level Surface",
                color: "secondary",
                description:
                  "Set the graduated cylinder on a flat bench or table — never hold it in your hand while reading it. A tilted surface will cause the liquid to rest at an angle, giving an incorrect reading.",
                tip: "Always place measuring tools on a stable, level surface before taking any reading.",
              },
              {
                num: 3,
                title: "Pour the Liquid Carefully",
                color: "accent",
                description:
                  "Pour the liquid slowly into the graduated cylinder, stopping when you are close to the desired volume. Avoid splashing or overfilling — it is difficult to remove small amounts of liquid accurately.",
                tip: "Use a dropper or pipette to add the last few milliliters for precise adjustment.",
              },
              {
                num: 4,
                title: "Read at Eye Level",
                color: "primary",
                description:
                  "Bend down or bring the cylinder up so that your eyes are at the same height as the liquid surface. Looking from above or below will cause parallax error — making the volume appear different from the true value.",
                tip: "Your line of sight must be horizontal and level with the bottom of the meniscus.",
              },
              {
                num: 5,
                title: "Read the Meniscus at Its Bottom",
                color: "secondary",
                description:
                  "Water and most liquids form a curved surface (meniscus) that curves upward at the edges. Always read the volume from the lowest point of the meniscus — the bottom of the curve.",
                tip: "Exception: Mercury forms a convex (upward-curved) meniscus — read from the top of the curve for mercury.",
              },
              {
                num: 6,
                title: "Record the Value with Units",
                color: "accent",
                description:
                  "Write down the volume you read, including the correct unit (mL or cm³). Estimate between the smallest markings if needed. A reading without units is meaningless in science.",
                tip: "Always estimate one decimal place beyond the smallest marking on the cylinder (e.g., 23.5 mL if markings are in 1 mL intervals).",
              },
            ],
          },
        },

        // ── Section 2: Concept List (Measurement Tips) ──
        {
          type: "conceptList",
          heading: "Measurement Tips",
          data: {
            concepts: [
              "Always align the zero end of a ruler with the starting edge of the object — never start from the physical end of the ruler, which may not be at zero.",
              "Read measurements at eye level to avoid parallax error — the apparent shift in a measurement caused by viewing it from an angle.",
              "Always record measurements with the correct unit — a number alone (e.g., '15') is meaningless without knowing if it refers to grams, centimeters, or milliliters.",
              "Zero (tare) a balance before placing any object on it, and make sure it is on a level surface before using it.",
              "Always perform multiple measurements and calculate the mean to reduce the effect of random errors on your final result.",
              "Estimate between the smallest scale divisions of a measuring instrument to get one additional significant digit — this improves the precision of your reading.",
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
                title: "Cooking and Baking",
                description:
                  "Bakers measure ingredients by mass (grams) rather than volume (cups) for consistent results. Too much flour by even 20 g can make bread dense and dry.",
                icon: "🍞",
                color: "border-l-primary-500",
              },
              {
                title: "Construction",
                description:
                  "Builders measure length precisely using meter sticks and laser measuring tools. A wall framed even 5 mm out of square can create major problems when fitting doors and windows.",
                icon: "🏠",
                color: "border-l-secondary-500",
              },
              {
                title: "Pharmacy",
                description:
                  "Pharmacists measure liquid medicines in milliliters using graduated cylinders and pipettes. Even a small error in measuring a strong drug could harm a patient.",
                icon: "💉",
                color: "border-l-accent-500",
              },
              {
                title: "Laboratory Research",
                description:
                  "Research scientists measure mass, volume, and concentration with high-precision tools. Accurate measurements are critical for experiments that need to be reproduced by other labs around the world.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 15 — Accuracy, Precision, and Errors
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-15",
      weekId: "week-5",
      lessonNumber: 15,
      title: "Accuracy, Precision, and Errors",
      badge: "Lesson 15",
      subtitle:
        "Understand the difference between accuracy and precision, and learn how to identify and minimize measurement errors.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt: "Target showing accuracy vs precision comparison",

      sections: [
        "Introduction",
        "Accuracy vs. Precision",
        "Measurement Scenarios",
        "Applications",
      ],

      layout: [
        // ── Section 0: Intro ──
        {
          type: "intro",
          heading: "Introduction",
          data: {
            paragraphs: [
              "<strong class='text-primary-700'>Accuracy</strong> and <strong class='text-primary-700'>precision</strong> are two different qualities of a measurement. Accuracy refers to how close a measured value is to the <strong class='text-primary-700'>true (accepted) value</strong>. Precision refers to how <strong class='text-primary-700'>consistent repeated measurements</strong> are with each other — even if they are all wrong.",
              "It is possible to be precise but inaccurate (all measurements are close together but far from the true value), accurate but imprecise (measurements are scattered but average near the true value), both, or neither. Scientists aim for both accuracy AND precision. Measurement <strong class='text-primary-700'>errors</strong> can be systematic (consistent bias) or random (unpredictable variations).",
            ],
            didYouKnow:
              "The GPS in your phone is accurate to about 3–5 meters under open sky. But special GPS systems used by scientists can measure positions to within 1 centimeter — by comparing signals from multiple satellites and using precise timing!",
          },
        },

        // ── Section 1: Comparison ──
        {
          type: "comparison",
          heading: "Accuracy vs. Precision",
          data: {
            intro:
              "Although accuracy and precision both describe measurement quality, they refer to different things. A scientist must understand both concepts to evaluate and improve their measurement technique.",
            left: {
              label: "Accuracy",
              color: "primary",
              items: [
                "Definition: How close a measurement is to the true or accepted value",
                "Example: Measuring a 10.0 g mass and getting 9.9 g is accurate",
                "Type of error: Caused by systematic error (equipment calibration, wrong technique)",
                "How to improve: Calibrate equipment correctly, use the right technique, repeat under different conditions",
                "Formula: Percent Error = |(measured − true) / true| × 100%",
              ],
            },
            right: {
              label: "Precision",
              color: "secondary",
              items: [
                "Definition: How consistent and repeatable a set of measurements is — regardless of the true value",
                "Example: Getting 9.2 g, 9.2 g, and 9.3 g repeatedly is precise (even if the true value is 10.0 g)",
                "Type of error: Caused by random error (reading the scale differently each time, vibrations)",
                "How to improve: Repeat measurements, practice reading the instrument consistently, control the environment",
                "Symbol: Often expressed as ± (e.g., 9.2 ± 0.1 g shows the range of repeated values)",
              ],
            },
          },
        },

        // ── Section 2: Scenarios ──
        {
          type: "scenario",
          heading: "Measurement Scenarios",
          data: {
            intro:
              "Read each scenario and determine whether the measurement situation shows accuracy, precision, both, or neither. Then identify what type of error is present.",
            scenarios: [
              {
                title: "The Archery Target Analogy",
                situation:
                  "Archer A hits near the bullseye every shot but each arrow lands in a slightly different spot. Archer B hits the same spot on the edge of the target every time — far from the bullseye. Archer C hits near the bullseye, consistently grouped tightly together.",
                question:
                  "Which archer is accurate? Which is precise? Which is both accurate and precise?",
                skill:
                  "Archer A = accurate but not precise (near bullseye but scattered). Archer B = precise but not accurate (consistent but wrong). Archer C = both accurate and precise (near bullseye and tightly grouped).",
              },
              {
                title: "Lab Mass Measurements",
                situation:
                  "A student measures the mass of a 50.0 g standard mass five times using a balance. Results: 48.1, 48.0, 48.2, 48.0, 48.1 grams. The balance has not been zeroed correctly.",
                question:
                  "Are these measurements precise? Are they accurate? What type of error is responsible, and how should the student fix it?",
                skill:
                  "Precise — the values are close together (±0.2 g). Not accurate — they are all about 2 g below the true value. Systematic error caused by the balance not being zeroed. Fix: tare the balance before measuring.",
              },
              {
                title: "Clinical Thermometer Calibration",
                situation:
                  "A nurse uses a thermometer to check a patient's temperature three times. Readings: 37.2°C, 36.8°C, 38.1°C. The patient's true temperature (checked with a calibrated device) is 37.0°C.",
                question:
                  "Are these readings precise? Are they accurate? What type of error is present, and what could the nurse do to improve the readings?",
                skill:
                  "Not precise — the readings vary too widely (range: 1.3°C). Mixed accuracy — some are close to 37.0°C, others are not. Random error — inconsistent reading technique or unstable thermometer. Fix: use a calibrated thermometer and repeat measurements carefully.",
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
                title: "Medical Diagnosis",
                description:
                  "Doctors need both accurate and precise measurements of blood glucose, blood pressure, and temperature. Inaccurate readings can lead to misdiagnosis, while imprecise readings make it hard to track changes in a patient's condition.",
                icon: "🩺",
                color: "border-l-primary-500",
              },
              {
                title: "Quality Control",
                description:
                  "Manufacturers measure product dimensions with high precision to ensure every item is identical. If parts are not consistently the right size, machines and assemblies will not fit together correctly.",
                icon: "🔩",
                color: "border-l-secondary-500",
              },
              {
                title: "GPS Navigation",
                description:
                  "GPS systems must be both accurate (correct location) and precise (consistent readings). A GPS that shows your location 100 m away from reality could guide you off a cliff or into a river.",
                icon: "📡",
                color: "border-l-accent-500",
              },
              {
                title: "Scientific Research",
                description:
                  "Research results are only trusted when they are both accurate (reflect the true value) and precise (reproducible by other labs). This is why peer review and replication of experiments are essential in science.",
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
