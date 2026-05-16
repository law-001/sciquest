// Week 11: The Microscope — Grade 7 Science

import microscope from "../assets/Microscopic.jpg";
import globe from "../assets/globe.jpg";
import web from "../assets/web.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";
import lab from "../assets/lab.jpg";
import classroom from "../assets/classroom.webp";
import modernclassroom from "../assets/modernclassroom.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week11 = {
  id: "week-11",
  weekNumber: 11,
  title: "The Microscope",
  category: "Life Science",
  description:
    "Learn the history and parts of the microscope and how to prepare and observe slides correctly.",
  icon: "ScanSearch",
  color: "accent",
  xpReward: 225,
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 31 — History and Parts of the Microscope
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-31",
      weekId: "week-11",
      lessonNumber: 31,
      title: "History and Parts of the Microscope",
      badge: "Lesson 31",
      subtitle:
        "Discover how the microscope was invented and learn the names and functions of its main parts.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt: "Close-up view of a compound microscope",

      sections: [
        "Overview",
        "Key Concepts",
        "Historical Milestones",
        "Microscope Parts",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>microscope</strong> is one of the most important instruments in science. It allows scientists to magnify objects that are far too small to see with the naked eye — from individual cells to tiny microorganisms. Without the microscope, biology as we know it could not exist.",
              "A <strong class='text-primary-700'>compound microscope</strong> uses two or more lenses to produce a magnified image. The development of this tool across centuries changed how humans understand life, disease, and the natural world at a microscopic level.",
            ],
            didYouKnow:
              "Antonie van Leeuwenhoek was the first person to observe living microorganisms. He called them 'animalcules' — tiny animals — when he looked at pond water under his handcrafted lenses in the 1670s!",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Compound Microscope",
                desc: "A microscope that uses two or more lenses — an eyepiece and objective lenses — to produce a highly magnified image of a specimen.",
              },
              {
                term: "Eyepiece (Ocular Lens)",
                desc: "The lens at the top of the microscope that you look through; it typically magnifies the image 10 times (10x).",
              },
              {
                term: "Objective Lens",
                desc: "The lens closest to the specimen; available in different magnifications (4x, 10x, 40x) and mounted on the revolving nosepiece.",
              },
              {
                term: "Stage",
                desc: "The flat platform where the glass slide holding the specimen is placed for viewing.",
              },
              {
                term: "Diaphragm",
                desc: "A rotating disc below the stage that controls the amount of light passing through the specimen, improving contrast.",
              },
              {
                term: "Magnification",
                desc: "The degree to which an image is enlarged. Total magnification = eyepiece power × objective lens power.",
              },
              {
                term: "Specimen",
                desc: "The object or sample being examined under the microscope, usually mounted on a glass slide.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Historical Milestones",
          data: {
            intro:
              "The microscope was not invented by a single person — it evolved over centuries through the work of curious scientists and inventors. Here are the four most important milestones in microscope history.",
            steps: [
              {
                num: 1,
                title: "Zacharias Janssen — 1590s",
                color: "primary",
                description:
                  "Dutch spectacle-maker Zacharias Janssen is credited with building one of the first compound microscopes by placing two lenses in a tube. His device could magnify objects up to 9 times, opening the door to microscopic exploration.",
                tip: "Janssen's design used two lenses — the same basic principle used in modern compound microscopes today.",
              },
              {
                num: 2,
                title: "Robert Hooke — 1665",
                color: "secondary",
                description:
                  "English scientist Robert Hooke used a compound microscope to examine thin slices of cork. He observed tiny box-like compartments and named them 'cells' because they reminded him of small rooms (cells) in a monastery.",
                tip: "Hooke's book Micrographia was the first major scientific work based on microscope observations.",
              },
              {
                num: 3,
                title: "Antonie van Leeuwenhoek — 1670s",
                color: "accent",
                description:
                  "Dutch scientist van Leeuwenhoek ground his own powerful lenses and was the first to observe living microorganisms — bacteria, protozoa, and sperm cells. He is known as the 'Father of Microbiology.'",
                tip: "Leeuwenhoek's lenses could magnify over 200x — far beyond anything available at the time.",
              },
              {
                num: 4,
                title: "Modern Electron Microscope — 1930s–Present",
                color: "primary",
                description:
                  "The electron microscope, developed in the 1930s, uses beams of electrons instead of light to magnify specimens up to 2,000,000 times. It revealed the internal structure of organelles, viruses, and atomic-scale materials.",
                tip: "Electron microscopes cannot observe living specimens because the preparation process kills cells.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Microscope Parts",
          data: {
            cards: [
              {
                title: "Structural Parts",
                label: "Upper Body",
                variant: "primary",
                color: "primary",
                desc: "The eyepiece, arm, and body tube form the upper structure of the microscope.",
                image: microscope,
                imageAlt:
                  "Upper parts of a microscope including eyepiece and arm",
                examples: [
                  "Eyepiece (Ocular Lens) — 10x magnification",
                  "Arm — used to carry the microscope",
                  "Body Tube — holds lenses at proper distance",
                ],
              },
              {
                title: "Stage and Focus",
                label: "Middle Section",
                variant: "secondary",
                color: "secondary",
                desc: "The stage holds the slide, while focus knobs bring the image into sharp view.",
                image: lab,
                imageAlt: "Stage area of a microscope with focus knobs",
                examples: [
                  "Stage — flat platform for the slide",
                  "Stage Clips — hold the slide in place",
                  "Coarse / Fine Adjustment Knobs — focus the image",
                ],
              },
              {
                title: "Light Control",
                label: "Lower Section",
                variant: "primary",
                color: "primary",
                desc: "The light source and diaphragm control the brightness reaching the specimen.",
                image: simulation,
                imageAlt: "Light source and diaphragm of a microscope",
                examples: [
                  "Light Source (or Mirror) — illuminates the specimen",
                  "Diaphragm — regulates the amount of light",
                  "Base — supports the entire microscope",
                ],
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 32 — Using the Microscope Correctly
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-32",
      weekId: "week-11",
      lessonNumber: 32,
      title: "Using the Microscope Correctly",
      badge: "Lesson 32",
      subtitle:
        "Learn the proper techniques for carrying, focusing, and calculating magnification with a microscope.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt: "Student using a microscope in a science lab",

      sections: [
        "Overview",
        "Proper Handling Rules",
        "Practical Scenarios",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "A microscope is a delicate and expensive scientific instrument. Knowing how to use it correctly is just as important as knowing its parts. Improper use can damage the lenses, break slides, or produce blurry, inaccurate images.",
              "To find the <strong class='text-primary-700'>total magnification</strong>, multiply the eyepiece power by the objective lens power. For example, using a 10x eyepiece with a 40x objective gives a total magnification of <strong class='text-primary-700'>400x</strong>. Always begin with the lowest objective lens and work your way up for safe, clear focusing.",
            ],
            didYouKnow:
              "The coarse adjustment knob can move the stage several millimeters at once — that's why it should only be used with the lowest power objective. At high power, even a tiny movement can crack the slide or scratch the lens!",
          },
        },

        {
          type: "reasonCards",
          heading: "Proper Handling Rules",
          data: {
            intro:
              "Following proper microscope procedures protects both the instrument and the specimen. Here are five essential rules every student must remember when using a microscope.",
            reasons: [
              {
                num: 1,
                title: "Carry with Both Hands",
                color: "primary",
                desc: "Always use one hand on the arm and one under the base",
                content:
                  "This prevents dropping or tilting the microscope, which could damage the lenses or the light source.",
              },
              {
                num: 2,
                title: "Start with Low Power",
                color: "secondary",
                desc: "Begin with the 4x objective before switching to higher magnification",
                content:
                  "Low power gives a wider field of view, making it easier to locate the specimen before zooming in.",
              },
              {
                num: 3,
                title: "Coarse Focus First",
                color: "accent",
                desc: "Use the coarse knob first, then fine-tune with the fine knob",
                content:
                  "The coarse knob makes large adjustments for initial focusing; the fine knob sharpens the image without risk of breaking the slide.",
              },
              {
                num: 4,
                title: "Never Focus Downward on High Power",
                color: "primary",
                desc: "Avoid moving the objective down toward the slide at high magnification",
                content:
                  "At high power, the objective lens is very close to the slide. Moving it down can crack the slide and scratch the expensive lens.",
              },
              {
                num: 5,
                title: "Clean Lenses Properly",
                color: "secondary",
                desc: "Use only lens paper — never tissue or cloth — to clean microscope lenses",
                content:
                  "Regular cloth or tissue can scratch the lens coating, permanently blurring the image and damaging the microscope.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Practical Scenarios",
          data: {
            intro:
              "Let's apply what you've learned to real situations. Read each scenario and identify what went wrong or what the correct answer should be.",
            scenarios: [
              {
                title: "Wrong Focus Knob",
                situation:
                  "Maria is viewing a cheek cell slide at 40x objective. The image is blurry, so she grabs the coarse adjustment knob and turns it quickly.",
                question:
                  "What mistake is Maria making, and what should she do instead?",
                skill:
                  "At high magnification, only the fine adjustment knob should be used. Using the coarse knob at 40x risks cracking the slide or scratching the lens. Maria should use the fine knob to slowly sharpen the image.",
              },
              {
                title: "Switching to High Power Too Soon",
                situation:
                  "Carlos places a slide on the stage and immediately clicks the 40x objective into position without locating the specimen first.",
                question:
                  "Why is this a problem, and what should Carlos have done first?",
                skill:
                  "Carlos should have started with the lowest power (4x) to locate and center the specimen first. Jumping to high power without locating the specimen makes it nearly impossible to find what you're looking for.",
              },
              {
                title: "Calculating Total Magnification",
                situation:
                  "A microscope has a 10x eyepiece. A student is using the 40x objective lens to view a plant cell.",
                question:
                  "What is the total magnification the student is seeing?",
                skill:
                  "Total magnification = eyepiece × objective = 10x × 40x = 400x. The student is viewing the plant cell at 400 times its actual size.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Medical Diagnosis",
                description:
                  "Doctors examine blood and tissue samples under microscopes to diagnose diseases like malaria, tuberculosis, and certain cancers by looking at cell shape and structure.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Water Quality Testing",
                description:
                  "Scientists use microscopes to identify harmful microorganisms in drinking water, ensuring public water supplies are safe from pathogens like giardia and cryptosporidium.",
                icon: "💧",
                color: "border-l-secondary-500",
              },
              {
                title: "Tissue Analysis in Biology",
                description:
                  "Biologists study plant and animal tissue samples to understand how organs are structured and how diseases affect cellular organization.",
                icon: "🔬",
                color: "border-l-accent-500",
              },
              {
                title: "Forensic Science",
                description:
                  "Forensic analysts use microscopes to examine trace evidence such as hair, fibers, and soil particles collected from crime scenes.",
                icon: "🕵️",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 33 — Preparing Microscope Slides
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-33",
      weekId: "week-11",
      lessonNumber: 33,
      title: "Preparing Microscope Slides",
      badge: "Lesson 33",
      subtitle:
        "Learn how to prepare wet and dry mount slides and use stains to observe cells more clearly.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "Prepared microscope slides and staining equipment on a lab bench",

      sections: [
        "Overview",
        "Key Concepts",
        "Slide Preparation Steps",
        "Real-World Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Before you can observe a specimen under a microscope, you must prepare a <strong class='text-primary-700'>microscope slide</strong>. The way you prepare a slide affects the clarity and quality of what you see. Two common methods are the <strong class='text-primary-700'>wet mount</strong> and the dry mount.",
              "Scientists also use <strong class='text-primary-700'>stains</strong> — colored chemical solutions — to increase contrast and make certain cell parts easier to see. For example, iodine stains starch dark blue-black, and methylene blue highlights the nucleus of animal cells.",
            ],
            didYouKnow:
              "Onion skin cells are a favorite for school labs because the cells are large, arranged in a neat single layer, and easy to peel — making them perfect for a first microscope observation!",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Concepts",
          data: {
            terms: [
              {
                term: "Wet Mount",
                desc: "A slide preparation method where the specimen is placed in a drop of water on a glass slide and covered with a cover slip.",
              },
              {
                term: "Dry Mount",
                desc: "A slide preparation method where the specimen is placed directly on the slide without water, used for specimens that do not need a liquid medium.",
              },
              {
                term: "Cover Slip",
                desc: "A thin, square piece of glass or plastic placed over the specimen to protect it and keep it flat on the slide.",
              },
              {
                term: "Slide",
                desc: "A flat, rectangular piece of glass on which the specimen is placed for microscope observation.",
              },
              {
                term: "Stain",
                desc: "A colored chemical solution applied to a specimen to increase contrast and make specific cell structures visible under the microscope.",
              },
              {
                term: "Specimen",
                desc: "The biological sample (e.g., onion skin, cheek cells, or leaf tissue) prepared and observed under the microscope.",
              },
              {
                term: "Preparation",
                desc: "The process of mounting and, if needed, staining a specimen on a glass slide so it can be examined under a microscope.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Slide Preparation Steps",
          data: {
            intro:
              "Preparing a wet mount slide requires careful steps to avoid air bubbles and ensure the specimen is clearly visible. Follow this sequence for a successful slide preparation.",
            steps: [
              {
                num: 1,
                title: "Clean the Slide",
                color: "primary",
                description:
                  "Wipe the glass slide with a clean cloth or lens paper to remove dust, fingerprints, and debris. A dirty slide will interfere with the image quality.",
                tip: "Handle the slide only by its edges to avoid leaving fingerprints on the viewing area.",
              },
              {
                num: 2,
                title: "Add a Water Drop",
                color: "secondary",
                description:
                  "Place one small drop of clean water (or appropriate mounting medium) at the center of the slide using a dropper. The drop should be small — about the size of a match head.",
                tip: "Too much water will cause the specimen to float and move under the microscope.",
              },
              {
                num: 3,
                title: "Place the Specimen",
                color: "accent",
                description:
                  "Carefully place the specimen (e.g., a thin piece of onion skin or a cheek cell sample) into the center of the water drop. Use forceps or a toothpick to position it flat.",
                tip: "The specimen should be as thin as possible — thicker specimens block light and appear dark.",
              },
              {
                num: 4,
                title: "Add a Stain (Optional)",
                color: "primary",
                description:
                  "Place a drop of stain (iodine for plant cells, methylene blue for animal cells) at the edge of the specimen. The stain will flow under the cover slip when it is placed.",
                tip: "Add only one small drop of stain — too much will over-stain and obscure cell details.",
              },
              {
                num: 5,
                title: "Lower the Cover Slip",
                color: "secondary",
                description:
                  "Hold the cover slip at a 45° angle touching the edge of the water drop, then slowly lower it down. This technique prevents air bubbles from being trapped underneath.",
                tip: "Air bubbles appear as dark circles under the microscope and can hide parts of the specimen.",
              },
              {
                num: 6,
                title: "Remove Excess Water",
                color: "accent",
                description:
                  "If water overflows from the edges, gently touch a piece of tissue or paper towel to the edge of the cover slip (not on top) to absorb the excess liquid.",
                tip: "The slide is now ready for observation. Start with the lowest objective lens first.",
              },
            ],
          },
        },

        {
          type: "applications",
          heading: "Real-World Applications",
          data: {
            apps: [
              {
                title: "Pathology",
                description:
                  "Medical pathologists prepare thin tissue slices (biopsies) as slides and stain them to detect cancer cells, infections, and other diseases under a microscope.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
              {
                title: "Marine Biology",
                description:
                  "Marine scientists prepare wet mount slides of ocean water to identify and count microscopic algae, plankton, and larvae that form the base of marine food webs.",
                icon: "🌊",
                color: "border-l-secondary-500",
              },
              {
                title: "Microbiology",
                description:
                  "Microbiologists use staining techniques (like Gram staining) to classify bacteria by their cell wall structure, which guides antibiotic treatment decisions.",
                icon: "🦠",
                color: "border-l-accent-500",
              },
              {
                title: "School Biology Labs",
                description:
                  "Students learn to prepare slides of onion skin, cheek cells, and plant leaves to directly observe cell structure — making abstract biology concepts visible and concrete.",
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
