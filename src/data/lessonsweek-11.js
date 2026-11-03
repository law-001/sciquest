// Week 11: The Microscope — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd Quarter Week 1 (site Week 11).
//   Lesson 1 — The Microscope: An Introduction
//   Lesson 2 — The Importance of Microscope Discovery

import microscope from "../assets/week1/Microscopic.jpg";
import simulation from "../assets/week1/simulation.jpg";
import globe from "../assets/week1/globe.jpg";
import lab from "../assets/lab.jpg";

export const week11 = {
  id: "week-11",
  weekNumber: 11,
  title: "The Microscope",
  category: "Life Science",
  description:
    "Meet the compound microscope: its parts, what each one does, and how to handle and store it properly. Then see how early scientists like Antonie van Leeuwenhoek used microscopes to change what we know about life.",
  icon: "ScanSearch",
  color: "accent",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — The Microscope: An Introduction
    // ═══════════════════════════════════════════════════
    {
      id: "w11-l1",
      weekId: "week-11",
      lessonNumber: 1,
      title: "The Microscope: An Introduction",
      badge: "Lesson 1",
      subtitle:
        "Identify the parts of a compound microscope, describe what each part does, and learn how to use, carry, clean and store it the right way.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt:
        "A compound microscope used in a school science laboratory, showing the eyepiece, objectives, stage and base",

      signature: {
        widgetId: "focus-scope",
        heading: "Watch It: Focus Without Cracking",
        intro: "Turn the knobs, then lower the coverslip.",
        instruction: "Get a sharp 40× view without cracking the slide.",
        xp: 25,
        explainer: {
          title: "Why fine focus exists",
          points: [
            "At 4× the sharp zone was about ten micrometers deep, so the big coarse knob found it easily.",
            "At 40× that zone shrank to under one micrometer, and one coarse step moves two.",
            "That is why the coarse knob cracked the slide, and why only the fine knob could bring the image into focus.",
            "Dropping the coverslip flat trapped air, so bubbles sat in the view until you lowered it on one edge.",
          ],
        },
      },

      sections: [
        "Overview",
        "Parts of a Compound Microscope",
        "Using the Microscope Step by Step",
        "Preparing a Wet Mount Slide",
        "Proper Handling and Storing",
        "Practical Scenarios",
      ],

      references: [
        {
          label: "Britannica — Microscope",
          url: "https://www.britannica.com/technology/microscope",
        },
        {
          label: "Britannica — Compound microscope",
          url: "https://www.britannica.com/technology/compound-microscope",
        },
        {
          label: "CK-12 — Microscopes (Life Science)",
          url: "https://www.ck12.org/c/life-science/microscopes/",
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
              "Cells, bacteria and the tiny green parts inside a leaf are too small to see with your eyes alone. To study them, scientists use a <strong class='text-primary-700'>microscope</strong>, an instrument that makes small things look much bigger.",
              "The microscope in your school lab is a <strong class='text-primary-700'>compound microscope</strong>. It is called “compound” because it uses two lenses at once: the <strong class='text-primary-700'>eyepiece</strong> you look into, and an <strong class='text-primary-700'>objective lens</strong> near the specimen. To get the <strong class='text-primary-700'>total magnification</strong>, multiply the two. A 10× eyepiece with a 40× objective gives 10 × 40 = <strong class='text-primary-700'>400×</strong>.",
              "A school microscope costs many thousands of pesos, and one dropped microscope can mean a whole class has one fewer to share. Being <strong class='text-primary-700'>responsible</strong> with it is part of doing science. In this lesson you will learn each part, what it does, and how to handle and store it properly.",
              "These are the same skills used by medical technologists in rural health units who check sputum smears for tuberculosis and blood smears for malaria, and by BFAR scientists who count red tide organisms in seawater.",
            ],
            didYouKnow:
              "The Philippines is hot and humid most of the year. In damp storage, mold can grow on microscope lenses and leave permanent cloudy spots. That is why many schools keep microscopes in cabinets with silica gel packets, the same little packets you find in new shoes and bags.",
          },
        },

        {
          type: "imageCards",
          heading: "Parts of a Compound Microscope",
          data: {
            cards: [
              {
                title: "Viewing and Magnifying Parts",
                label: "Lenses",
                variant: "primary",
                color: "primary",
                desc: "These parts make the specimen look bigger. Light passes through the objective lens first, then through the eyepiece to your eye.",
                image: microscope,
                imageAlt:
                  "Close-up of the top of a compound microscope showing the eyepiece, body tube, revolving nosepiece and three objective lenses",
                examples: [
                  "Eyepiece (ocular lens): the lens you look into; usually 10×",
                  "Body tube: holds the eyepiece and objectives the right distance apart",
                  "Revolving nosepiece: turns to switch from one objective to another",
                  "Objective lenses: scanner 4× (shortest), low power 10×, high power 40× (longest)",
                ],
              },
              {
                title: "Support Parts",
                label: "Body",
                variant: "secondary",
                color: "secondary",
                desc: "These parts hold the microscope together and keep the slide steady.",
                image: lab,
                imageAlt:
                  "Side view of a compound microscope showing the curved arm, the flat stage with stage clips and the heavy base",
                examples: [
                  "Arm: the curved part you hold when carrying the microscope",
                  "Base: the heavy bottom that keeps the microscope from tipping over",
                  "Stage: the flat platform where the slide is placed",
                  "Stage clips: hold the slide in place so it does not slide around",
                ],
              },
              {
                title: "Focusing Parts",
                label: "Knobs",
                variant: "accent",
                color: "accent",
                desc: "These knobs move the stage (or body tube) up and down until the image becomes sharp.",
                image: simulation,
                imageAlt:
                  "Close-up of the large coarse adjustment knob and the smaller fine adjustment knob on the side of a microscope",
                examples: [
                  "Coarse adjustment knob: the big knob; moves the stage a lot for first focusing at 4× or 10×",
                  "Fine adjustment knob: the small knob; moves the stage a tiny bit to sharpen the image",
                  "At 40×, use only the fine adjustment knob",
                ],
              },
              {
                title: "Lighting Parts",
                label: "Light",
                variant: "primary",
                color: "primary",
                desc: "A specimen must be lit from below so light can pass through it. These parts give and control that light.",
                image: globe,
                imageAlt:
                  "Underside of a microscope stage showing the light source, the condenser and the diaphragm disc with different-sized holes",
                examples: [
                  "Light source (lamp) or mirror: sends light up through the specimen",
                  "Diaphragm: opens or closes to control how much light passes through",
                  "Condenser: gathers and focuses the light onto the specimen",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Using the Microscope Step by Step",
          data: {
            intro:
              "Follow these steps in order every time. They protect the lenses and the slide, and they help you find the specimen quickly.",
            steps: [
              {
                num: 1,
                title: "Set It on a Flat, Steady Table",
                color: "primary",
                description:
                  "Place the microscope about 10 cm from the edge of the table with the arm facing you. Plug in the lamp, or tilt the mirror toward a window if your microscope has no lamp.",
                tip: "Never point the mirror at direct sunlight. It can hurt your eyes.",
              },
              {
                num: 2,
                title: "Start with the Shortest Objective",
                color: "secondary",
                description:
                  "Turn the revolving nosepiece until the 4× scanner objective clicks into place. Raise the objective away from the stage.",
                tip: "The click tells you the objective is lined up with the body tube.",
              },
              {
                num: 3,
                title: "Place the Slide",
                color: "accent",
                description:
                  "Put the slide on the stage with the specimen over the hole in the center. Hold it down with the stage clips.",
                tip: "Hold slides by their edges so your fingerprints do not smudge the view.",
              },
              {
                num: 4,
                title: "Focus with the Coarse Knob, Watching from the Side",
                color: "primary",
                description:
                  "Look at the microscope from the side and bring the objective close to the slide without touching it. Then look into the eyepiece and slowly turn the coarse knob to move them apart until the image appears.",
                tip: "Watching from the side first keeps you from crashing the lens into the slide.",
              },
              {
                num: 5,
                title: "Sharpen and Center",
                color: "secondary",
                description:
                  "Use the fine adjustment knob to make the image sharp. Move the slide gently until the part you want to see is in the center of the field of view. Adjust the diaphragm for good contrast.",
                tip: "The image moves the opposite way you move the slide. Push the slide left and the image goes right.",
              },
              {
                num: 6,
                title: "Switch to Higher Power",
                color: "accent",
                description:
                  "Turn the nosepiece to 10×, then to 40×. After each switch, use only the fine adjustment knob. At high power the specimen looks bigger and more detailed, but you see a smaller area, the image gets darker, and the objective is very close to the slide. Open the diaphragm a little to let in more light.",
                tip: "If you lose the specimen at 40×, go back to 10×, find it and center it again.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Preparing a Wet Mount Slide",
          data: {
            intro:
              "A wet mount is the simplest slide to make. Thin specimens such as onion (sibuyas) skin or a hydrilla leaf work best, because light can pass through them.",
            steps: [
              {
                num: 1,
                title: "Clean the Slide and Cover Slip",
                color: "primary",
                description:
                  "Wipe both with lens paper or a clean, soft cloth. Hold them by the edges.",
                tip: "Cover slips are very thin and break easily. Handle them gently.",
              },
              {
                num: 2,
                title: "Add One Drop of Water",
                color: "secondary",
                description:
                  "Use a dropper to put one small drop of clean water in the center of the slide.",
                tip: "Too much water makes the cover slip float and the specimen drift.",
              },
              {
                num: 3,
                title: "Place a Thin Specimen",
                color: "accent",
                description:
                  "Use forceps (tweezers) to lay a thin piece of the specimen flat on the water drop. Peel the thin, clear layer from the inside of an onion scale for a good first slide.",
                tip: "The thinner the specimen, the clearer the image.",
              },
              {
                num: 4,
                title: "Lower the Cover Slip at an Angle",
                color: "primary",
                description:
                  "Hold the cover slip at about 45°, touch one edge to the water, and lower it slowly onto the specimen.",
                tip: "Dropping it flat traps air bubbles, which look like dark-edged circles under the microscope.",
              },
              {
                num: 5,
                title: "Stain if Your Teacher Says So",
                color: "secondary",
                description:
                  "Put one drop of iodine solution at one edge of the cover slip and touch a piece of tissue to the opposite edge. The tissue pulls the stain under the cover slip.",
                tip: "One drop is enough. Too much stain hides the details.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Proper Handling and Storing",
          data: {
            intro:
              "A well-cared-for microscope can serve students for many years. These habits show responsibility for equipment that your whole school shares.",
            reasons: [
              {
                num: 1,
                title: "Carry with Two Hands",
                color: "primary",
                desc: "One hand on the arm, one hand under the base",
                content:
                  "Hold it upright and close to your body. Carrying it by the arm alone can make it swing, and the eyepiece can slide out and break.",
              },
              {
                num: 2,
                title: "Touch Lenses Only with Lens Paper",
                color: "secondary",
                desc: "No tissue, shirt, or fingers",
                content:
                  "Tissue and cloth can scratch the lens, and the oil from fingers blurs every image. Wipe gently in small circles with lens paper.",
              },
              {
                num: 3,
                title: "Keep It Dry and Clean",
                color: "accent",
                desc: "Wipe spills right away",
                content:
                  "Water or stain on the stage can get into the knobs and rust the metal parts. Dry the stage with a clean cloth before you put the microscope away.",
              },
              {
                num: 4,
                title: "Prepare It for Storage",
                color: "primary",
                desc: "Leave it the way you want to find it",
                content:
                  "Remove the slide, turn off and unplug the lamp, turn the nosepiece back to the 4× objective, lower the stage (or raise the body tube), and wrap the cord loosely around the base.",
              },
              {
                num: 5,
                title: "Cover and Store It Properly",
                color: "secondary",
                desc: "Dust cover on, then into a dry cabinet",
                content:
                  "Put on the dust cover and store the microscope upright in a dry cabinet or its box, ideally with silica gel packets. Damp storage lets mold grow on the lenses.",
              },
              {
                num: 6,
                title: "Report Damage Right Away",
                color: "accent",
                desc: "Honesty protects the next user",
                content:
                  "If a slide cracks or a part feels loose, tell your teacher at once. Hiding damage means the next group may cut themselves or break the microscope further.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Practical Scenarios",
          data: {
            intro:
              "Read each situation and decide what is right or wrong before checking the answer.",
            scenarios: [
              {
                title: "The Wrong Knob",
                situation:
                  "Bea is viewing onion cells with the 40× objective. The image is a bit blurry, so she turns the coarse adjustment knob quickly.",
                question:
                  "What mistake is Bea making, and what should she do instead?",
                skill:
                  "At 40× the objective is very close to the slide, so the coarse knob can crash it into the slide and crack it or scratch the lens. She should use only the fine adjustment knob and turn it slowly.",
              },
              {
                title: "Computing Magnification",
                situation:
                  "A microscope has a 10× eyepiece. Miguel looks at a hydrilla leaf with the 4× objective, then with the 40× objective.",
                question: "What is the total magnification each time?",
                skill:
                  "Total magnification = eyepiece × objective. With the 4× objective: 10 × 4 = 40×. With the 40× objective: 10 × 40 = 400×.",
              },
              {
                title: "Too Dark to See",
                situation:
                  "Paolo switches from 10× to 40×. The specimen is in focus, but the image is now very dark.",
                question: "Which part should Paolo adjust, and how?",
                skill:
                  "The diaphragm. At higher power less light reaches the eye, so he should open the diaphragm a little (or turn up the lamp) to let more light pass through the specimen.",
              },
              {
                title: "End of the Period",
                situation:
                  "The bell rings. Jessa's group leaves the slide on the stage, the 40× objective in place, and the lamp on, then pushes the microscope into the cabinet without its cover.",
                question:
                  "List what the group did wrong and the correct way to store the microscope.",
                skill:
                  "They should remove and clean the slide, turn off and unplug the lamp, turn the nosepiece to the 4× objective, lower the stage, wrap the cord, put on the dust cover, and store it upright in a dry cabinet, carrying it with two hands.",
              },
            ],
          },
        },

      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — The Importance of Microscope Discovery
    // ═══════════════════════════════════════════════════
    {
      id: "w11-l2",
      weekId: "week-11",
      lessonNumber: 2,
      title: "The Importance of Microscope Discovery",
      badge: "Lesson 2",
      subtitle:
        "See how the invention of the microscope changed what people knew about living things, meet Antonie van Leeuwenhoek and other early scientists, and find out why microscopes still matter today.",
      readTime: "~15 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "A replica of Antonie van Leeuwenhoek's small single-lens microscope held between two fingers",

      signature: {
        widgetId: "scope-through-time",
        heading: "Watch It: Same Cork, Better Lenses",
        intro: "Drag the year. The instrument changes, the cork does not.",
        instruction: "Drag the year through all three instruments.",
        xp: 25,
        explainer: {
          title: "Why better lenses found more",
          points: [
            "In 1665 the best lens could only show details about five micrometers apart, so cork showed empty boxes with nothing inside.",
            "The 1830 lens removed the colored blur and could show details one micrometer apart, so a nucleus appeared.",
            "Electrons have a much shorter wavelength than light, so the 1933 electron microscope showed ribosomes that no light lens could reach.",
            "Each discovery had to wait for a better instrument, not for someone clever enough to look.",
          ],
        },
      },

      sections: [
        "Overview",
        "Early Scientists of Microscopy",
        "Antonie van Leeuwenhoek's Discoveries",
        "Before and After the Microscope",
        "Microscopes in Modern Science",
        "Think About It",
      ],

      references: [
        {
          label: "Britannica — History of the microscope",
          url: "https://www.britannica.com/technology/microscope/Historical-background",
        },
        {
          label: "Britannica — Antonie van Leeuwenhoek",
          url: "https://www.britannica.com/biography/Antonie-van-Leeuwenhoek",
        },
        {
          label: "Britannica — Robert Hooke",
          url: "https://www.britannica.com/biography/Robert-Hooke",
        },
        {
          label: "Nobel Prize — Ernst Ruska, Nobel Prize in Physics 1986",
          url: "https://www.nobelprize.org/prizes/physics/1986/ruska/facts/",
        },
        {
          label: "Research Institute for Tropical Medicine (RITM), DOH Philippines",
          url: "https://ritm.gov.ph/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Four hundred years ago, nobody knew that living things are made of cells, or that tiny living things too small to see are everywhere: in water, in soil and even in your mouth. People thought diseases came from “bad air” and that maggots grew out of rotting meat by themselves.",
              "The <strong class='text-primary-700'>microscope</strong> changed all of that. Each time lenses got better, people saw something new: first <strong class='text-primary-700'>cells</strong>, then <strong class='text-primary-700'>microorganisms</strong>, then the parts inside cells. These discoveries led to germ theory, vaccines, antibiotics and modern medicine.",
              "This lesson is also about <strong class='text-primary-700'>respect</strong>: respect for the patient, careful work of scientists who came before us, and for the tools that let us explore life. Many of them worked for years with simple equipment, and their records are the reason you can learn about cells today.",
            ],
            didYouKnow:
              "Antonie van Leeuwenhoek was not a trained scientist. He was a cloth seller in Delft, Netherlands, who first used lenses to check the threads in fabric. He became so skilled at making lenses that he is now called the Father of Microbiology.",
          },
        },

        {
          type: "timeline",
          heading: "Early Scientists of Microscopy",
          data: {
            intro:
              "The microscope was not invented by one person in one day. Many people improved it over about 250 years, and each improvement led to new discoveries.",
            steps: [
              {
                num: 1,
                title: "Hans and Zacharias Janssen — 1590s",
                color: "primary",
                description:
                  "These Dutch eyeglass makers are often credited with one of the first compound microscopes: two lenses inside a tube. It magnified objects only about 3 to 9 times.",
                tip: "Historians still debate who built the very first one, but the two-lens idea is still used in your school microscope.",
              },
              {
                num: 2,
                title: "Galileo Galilei — 1620s",
                color: "secondary",
                description:
                  "The Italian scientist best known for his telescope also built a small compound microscope and used it to look at insects. In 1625 a member of his science academy gave the instrument its name, “microscope.”",
                tip: "“Microscope” comes from Greek words meaning “small” and “to look.”",
              },
              {
                num: 3,
                title: "Robert Hooke — 1665",
                color: "accent",
                description:
                  "The English scientist looked at a thin slice of cork and saw rows of tiny empty boxes. He called them “cells.” He published his drawings of cork, fleas and other objects in the book Micrographia.",
                tip: "Cork comes from dead tree bark, so Hooke saw only empty cell walls, not living cells.",
              },
              {
                num: 4,
                title: "Antonie van Leeuwenhoek — 1670s to 1680s",
                color: "primary",
                description:
                  "Using tiny single-lens microscopes he made himself, he magnified objects over 200 times. He was the first to describe living microorganisms and bacteria, gave some of the first detailed descriptions of red blood cells, and sent his findings in letters to the Royal Society in London.",
                tip: "He made hundreds of microscopes in his lifetime.",
              },
              {
                num: 5,
                title: "Marcello Malpighi — 1661 onward",
                color: "secondary",
                description:
                  "The Italian doctor used a microscope to discover capillaries, the tiny blood vessels that connect arteries and veins, in the lungs of a frog. He also studied the fine structure of plants and insects.",
                tip: "His discovery showed how blood gets from arteries to veins, a question nobody could answer before.",
              },
              {
                num: 6,
                title: "Robert Brown, Schleiden and Schwann — 1830s",
                color: "accent",
                description:
                  "Better lenses that removed blurry colored edges let Robert Brown describe the nucleus in plant cells (1831). Matthias Schleiden (plants) and Theodor Schwann (animals) then concluded that all living things are made of cells.",
                tip: "This led to the cell theory, which you will study next week.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Antonie van Leeuwenhoek's Discoveries",
          data: {
            cards: [
              {
                title: "His Tiny Microscope",
                label: "The Tool",
                variant: "primary",
                color: "primary",
                desc: "His microscopes were small metal plates, about the size of your palm, holding one tiny, carefully ground glass lens. He held them close to his eye.",
                image: microscope,
                imageAlt:
                  "A replica of van Leeuwenhoek's microscope: a small brass plate with a single tiny lens and a screw that holds the specimen",
                examples: [
                  "Only one lens, but very high quality",
                  "Magnified objects about 200 to 270 times",
                  "Better than the compound microscopes of his time",
                ],
              },
              {
                title: "Animalcules in Water",
                label: "1674–1676",
                variant: "secondary",
                color: "secondary",
                desc: "He looked at lake water and rainwater and saw tiny living things swimming around. He called them animalcules.",
                image: simulation,
                imageAlt:
                  "Microscope view of a drop of pond water with tiny single-celled organisms such as paramecium",
                examples: [
                  "First person to describe living microorganisms",
                  "Many were protists, like those in a rice paddy or pond",
                  "Showed that a drop of water is full of life",
                ],
              },
              {
                title: "Bacteria from Teeth",
                label: "1683",
                variant: "accent",
                color: "accent",
                desc: "He scraped the white material (plaque) from between his teeth and saw even smaller moving things. These were bacteria.",
                image: lab,
                imageAlt:
                  "Van Leeuwenhoek's drawings of bacteria from tooth plaque, showing rod, round and spiral shapes",
                examples: [
                  "First drawings of bacteria in history",
                  "He drew rod, round and spiral shapes",
                  "A reason we brush our teeth today",
                ],
              },
              {
                title: "Blood Cells and Blood Flow",
                label: "1670s–1680s",
                variant: "primary",
                color: "primary",
                desc: "He described red blood cells and watched blood moving through capillaries in the tail of a small fish.",
                image: globe,
                imageAlt:
                  "Microscope view of red blood cells, small round disc-shaped cells",
                examples: [
                  "Described red blood cells in detail",
                  "Saw blood flowing through capillaries",
                  "Supported Malpighi's discovery of capillaries",
                ],
              },
            ],
          },
        },

        {
          type: "comparison",
          heading: "Before and After the Microscope",
          data: {
            intro:
              "The microscope did not only make things look bigger. It changed how people understood living things.",
            left: {
              label: "Before the Microscope",
              color: "primary",
              items: [
                "People did not know living things are made of cells",
                "Nobody knew microorganisms existed",
                "Diseases were blamed on “bad air,” curses or bad luck",
                "Many believed life could appear from non-living things, like maggots from meat",
                "Food spoilage and infections could not be explained",
              ],
            },
            right: {
              label: "After the Microscope",
              color: "secondary",
              items: [
                "All living things are known to be made of one or more cells",
                "A whole world of bacteria, protists and fungi was discovered",
                "Germ theory showed that specific germs cause specific diseases",
                "Cells were shown to come only from other cells",
                "Vaccines, antibiotics and safer surgery became possible",
              ],
            },
          },
        },

        {
          type: "applications",
          heading: "Microscopes in Modern Science",
          data: {
            apps: [
              {
                title: "Diagnosing Diseases",
                description:
                  "Hospital laboratories use microscopes to count blood cells and to find the germs that cause tuberculosis, malaria and other diseases, so doctors can give the right medicine.",
                icon: "🩺",
                color: "border-l-primary-500",
              },
              {
                title: "Studying Viruses",
                description:
                  "Viruses are too small for a light microscope. Electron microscopes let scientists see the shape of viruses like SARS-CoV-2, which helped in making COVID-19 vaccines. In the Philippines, RITM studies infectious diseases like these.",
                icon: "🦠",
                color: "border-l-secondary-500",
              },
              {
                title: "Food and Farming",
                description:
                  "Scientists check food and water for harmful bacteria, and plant scientists study crop diseases, such as those that attack rice, under the microscope.",
                icon: "🌾",
                color: "border-l-accent-500",
              },
              {
                title: "Protecting the Sea",
                description:
                  "BFAR counts red tide organisms in seawater samples to keep shellfish safe to eat, and marine scientists study plankton that feed the fish we catch.",
                icon: "🐚",
                color: "border-l-primary-500",
              },
              {
                title: "Solving Crimes",
                description:
                  "Forensic scientists, like those in the PNP Crime Laboratory, compare hair, fibers and soil under the microscope to connect evidence to a crime scene.",
                icon: "🔎",
                color: "border-l-secondary-500",
              },
              {
                title: "Light and Electron Microscopes",
                description:
                  "A light microscope (up to about 1,000 to 1,500×) can show living cells moving and is affordable for schools. The electron microscope, first built by Ernst Ruska and Max Knoll in 1931, magnifies more than a million times but needs dead, specially prepared specimens.",
                icon: "🔬",
                color: "border-l-primary-500",
              },
              {
                title: "Making New Materials",
                description:
                  "Engineers look at metals, plastics and computer chips under powerful microscopes to find tiny cracks and to design stronger, smaller parts.",
                icon: "🔩",
                color: "border-l-accent-500",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Think About It",
          data: {
            intro:
              "Use what you learned about the history of the microscope to answer these.",
            scenarios: [
              {
                title: "Hooke's Empty Boxes",
                situation:
                  "Robert Hooke saw tiny boxes in cork, but he saw nothing inside them.",
                question: "Why did Hooke's cells look empty?",
                skill:
                  "Cork comes from the dead outer bark of a cork oak tree. The living parts of the cells were already gone, so Hooke saw only the empty cell walls.",
              },
              {
                title: "One Lens Beats Two",
                situation:
                  "Van Leeuwenhoek's microscope had only one lens, while Hooke's had two or more. Yet van Leeuwenhoek saw much smaller things.",
                question: "How was this possible?",
                skill:
                  "His single lenses were very carefully made and gave clearer, more magnified images (over 200×) than the compound microscopes of that time, which had blurry, low-quality lenses.",
              },
              {
                title: "Germs and Handwashing",
                situation:
                  "Your lola says washing your hands before eating is important, even if your hands look clean.",
                question:
                  "How does the discovery of the microscope support her advice?",
                skill:
                  "Microscopes showed that microorganisms, including germs that cause disease, are too small to see. Hands can look clean but still carry germs, so washing with soap removes them.",
              },
              {
                title: "Choosing a Microscope",
                situation:
                  "A scientist wants to watch a living paramecium swim. Another wants to see the shape of a virus.",
                question: "Which type of microscope should each scientist use?",
                skill:
                  "The first should use a light microscope, because it can show living organisms moving. The second needs an electron microscope, because viruses are too small for a light microscope to show.",
              },
            ],
          },
        },
      ],
    },
  ],
};
