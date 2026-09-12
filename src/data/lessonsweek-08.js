// Week 8: The Science Laboratory — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 8.
//   Lesson 1 — Science Laboratory Instruments and Equipment
//   Lesson 2 — Science Laboratory Rules and Science Laboratory Safety Symbols

import globe from "../assets/week1/globe.jpg";
import equation from "../assets/week1/equation.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";
import modernclassroom from "../assets/modernclassroom.jpg";

export const week08 = {
  id: "week-8",
  weekNumber: 8,
  title: "The Science Laboratory",
  category: "Laboratory Skills",
  description:
    "Identify the instruments used in a science laboratory, learn what each one is for, and master the safety rules and hazard symbols that keep everyone safe.",
  icon: "ShieldCheck",
  color: "secondary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1 — Science Laboratory Instruments and Equipment
    // ═══════════════════════════════════════════════════
    {
      id: "w08-l1",
      weekId: "week-8",
      lessonNumber: 1,
      title: "Science Laboratory Instruments and Equipment",
      badge: "Lesson 1",
      subtitle:
        "Identify the common instruments of a science laboratory, learn the job each one is designed for, and know how to care for them.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "Array of common laboratory glassware and equipment on a bench",

      sections: [
        "Overview",
        "Key Terms",
        "Types of Equipment",
        "The Compound Microscope",
        "Care and Storage",
        "Applications",
      ],

      references: [
        {
          label: "Royal Society of Chemistry — Practical Chemistry Equipment",
          url: "https://edu.rsc.org/resources",
        },
        {
          label: "Britannica — Laboratory Apparatus",
          url: "https://www.britannica.com/technology/laboratory",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "A science laboratory contains many specialised tools, each designed for one specific purpose. Learning to identify and use them correctly is a fundamental skill. Common equipment includes <strong class='text-primary-700'>beakers</strong> for holding and heating liquids, <strong class='text-primary-700'>Erlenmeyer flasks</strong> for mixing without spilling, <strong class='text-primary-700'>graduated cylinders</strong> for measuring volume precisely, and <strong class='text-primary-700'>test tubes</strong> for small-scale reactions.",
              "Heating equipment such as the <strong class='text-primary-700'>Bunsen burner</strong>, tripod stand, and wire gauze work together to heat substances safely. Supporting tools — funnels, glass rods, rubber stoppers, forceps, and tongs — complete the toolkit. Using the correct tool for each task produces accurate results and prevents accidents.",
            ],
            didYouKnow:
              "The Erlenmeyer flask was invented by German chemist Emil Erlenmeyer in 1861. Its tapered neck reduces evaporation and stops splashing while swirling — which is why it is still the standard flask for mixing reactions.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Beaker",
                desc: "A wide cylindrical container with a pouring lip, used for holding, mixing, and heating liquids. Its volume markings are approximate only.",
              },
              {
                term: "Erlenmeyer Flask",
                desc: "A cone-shaped flask with a narrow neck, ideal for swirling and mixing without spilling the contents.",
              },
              {
                term: "Graduated Cylinder",
                desc: "A tall, narrow tube with precise volume markings — the most accurate common tool for measuring liquid volume.",
              },
              {
                term: "Test Tube",
                desc: "A small glass tube for holding tiny amounts of substance during individual reactions or tests.",
              },
              {
                term: "Bunsen Burner",
                desc: "A gas burner that produces a controllable flame. The air collar adjusts the flame between a cool yellow safety flame and a hot blue flame.",
              },
              {
                term: "Tripod Stand and Wire Gauze",
                desc: "A three-legged stand that supports glassware over a flame, with wire gauze on top to spread the heat evenly and protect the glass.",
              },
              {
                term: "Forceps and Tongs",
                desc: "Gripping tools used to handle solid chemicals or hot equipment without touching them directly.",
              },
              {
                term: "Compound Microscope",
                desc: "An instrument that uses two sets of lenses — eyepiece and objective — to magnify specimens far beyond what the eye can see.",
              },
            ],
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
                desc: "Measuring tools collect precise quantitative data. Accurate measurement is what makes results reproducible.",
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
                desc: "Heating equipment applies controlled heat. These tools demand the most caution of anything on the bench.",
                image: lab,
                imageAlt: "Bunsen burner on a tripod with wire gauze",
                examples: [
                  "Bunsen burner — a controllable gas flame for heating",
                  "Tripod stand — supports beakers or flasks over the heat",
                  "Wire gauze — spreads heat evenly and protects glassware",
                ],
              },
              {
                title: "Containment Equipment",
                label: "Holding Vessels",
                variant: "primary",
                color: "primary",
                desc: "Containment equipment holds substances and lets reactions happen safely. Different vessels suit different jobs.",
                image: simulation,
                imageAlt:
                  "Beakers, Erlenmeyer flask, and test tubes arranged on a shelf",
                examples: [
                  "Beaker — holds liquids for mixing and heating",
                  "Erlenmeyer flask — for reactions that need swirling",
                  "Test tube — holds small amounts for single reactions",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "The Compound Microscope",
          data: {
            intro:
              "The microscope is the most valuable instrument in a school laboratory and the easiest to damage. Follow these steps in order every time you use one.",
            steps: [
              {
                num: 1,
                title: "Carry It with Both Hands",
                color: "primary",
                description:
                  "Always carry a microscope with one hand on the arm and the other supporting the base. Carrying it one-handed risks dropping the instrument or tipping the eyepiece out.",
                tip: "Set it down gently on a flat bench, away from the edge.",
              },
              {
                num: 2,
                title: "Start with the Lowest Power Objective",
                color: "secondary",
                description:
                  "Rotate the nosepiece to the lowest power objective (4×). This gives the widest field of view, which makes finding the specimen far easier before you magnify further.",
                tip: "Jumping straight to high power can drive the lens into the slide and crack it.",
              },
              {
                num: 3,
                title: "Place and Secure the Slide",
                color: "accent",
                description:
                  "Place the slide on the stage with the specimen centred over the light hole, and secure it with the stage clips so it cannot shift while you work.",
                tip: "Check the cover slip is face up and the specimen sits over the opening.",
              },
              {
                num: 4,
                title: "Focus Coarsely, Watching from the Side",
                color: "primary",
                description:
                  "Looking from the side rather than through the eyepiece, turn the coarse focus knob to bring the stage close to the objective. Then look through the eyepiece and turn it slowly the other way until the image appears.",
                tip: "Watching from the side is what prevents the objective from crashing into the slide.",
              },
              {
                num: 5,
                title: "Switch Up and Use Fine Focus Only",
                color: "secondary",
                description:
                  "Once focused at low power, rotate to a higher objective (10× or 40×). Sharpen using only the fine focus knob, and adjust the diaphragm to control light.",
                tip: "Never use the coarse knob at high power — the lens is millimetres from the glass.",
              },
              {
                num: 6,
                title: "Calculate the Magnification",
                color: "accent",
                description:
                  "Total magnification = eyepiece power × objective power. A standard 10× eyepiece with a 40× objective gives 10 × 40 = 400× magnification.",
                tip: "Always record the magnification alongside any drawing you make.",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Care and Storage",
          data: {
            concepts: [
              "Inspect glassware for cracks or chips before every use — damaged glass can shatter during heating and cause serious injury.",
              "Clean equipment with water and the appropriate cleaning agent immediately after use, before residue hardens.",
              "Let heated glassware cool completely before rinsing with cold water, or thermal shock will crack it.",
              "Clean microscope lenses with lens paper only — tissue and cloth scratch the coating permanently.",
              "Store glassware upright on its designated shelf, never near the edge of a bench.",
              "Return every instrument to its labelled storage place so it is ready for the next person.",
              "Report damaged or broken equipment to the teacher immediately, and never use a broken tool.",
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
                  "Beakers, flasks, and test tubes are used worldwide to mix reagents, observe reactions, and collect products.",
                icon: "🧪",
                color: "border-l-primary-500",
              },
              {
                title: "Biology Labs",
                description:
                  "Microscopes, slides, and forceps let biologists observe cells, microorganisms, and plant tissue directly.",
                icon: "🔬",
                color: "border-l-secondary-500",
              },
              {
                title: "Medical Testing",
                description:
                  "Hospital laboratories use the same basic tools — test tubes, pipettes, balances — to analyse blood, urine, and tissue samples.",
                icon: "🏥",
                color: "border-l-accent-500",
              },
              {
                title: "Food Science",
                description:
                  "Food laboratories use graduated cylinders, balances, and thermometers to check ingredient quantities and processing temperatures.",
                icon: "🍳",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2 — Science Laboratory Rules and Safety Symbols
    // ═══════════════════════════════════════════════════
    {
      id: "w08-l2",
      weekId: "week-8",
      lessonNumber: 2,
      title: "Science Laboratory Rules and Science Laboratory Safety Symbols",
      badge: "Lesson 2",
      subtitle:
        "Learn the safety rules every student must follow, the reason behind each one, and how to read the hazard symbols printed on chemical containers.",
      readTime: "~16 min read",
      xp: 50,
      heroImage: modernclassroom,
      heroImageAlt:
        "Students in a science lab wearing safety goggles and lab gowns",

      sections: [
        "Overview",
        "Key Terms",
        "Safety Rules and Reasons",
        "Hazard Categories",
        "Reading Hazard Labels",
        "Responding to an Emergency",
        "Real-Lab Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "UNECE — Globally Harmonized System (GHS)",
          url: "https://unece.org/about-ghs",
        },
        {
          label: "Royal Society of Chemistry — Safety in the Lab",
          url: "https://edu.rsc.org/resources",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The laboratory is a place for discovery, but it can be dangerous when procedures are ignored. Every rule exists for a specific reason — to protect you, your classmates, and your teacher. <strong class='text-primary-700'>Personal Protective Equipment (PPE)</strong> such as safety goggles, a lab gown, and gloves must be worn for the whole session, not only when you expect a splash.",
              "Before starting, know where the nearest <strong class='text-primary-700'>fire extinguisher</strong>, eye wash station, first aid kit, and emergency exit are. Chemical containers carry standardised <strong class='text-primary-700'>hazard symbols</strong> from the Globally Harmonized System (GHS), which tell you what a substance can do before you ever open it.",
            ],
            didYouKnow:
              "The skull-and-crossbones warning for poison has been in use since the Middle Ages. The modern GHS version appears only on chemicals that can cause death or serious illness in small amounts.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "PPE (Personal Protective Equipment)",
                desc: "Equipment worn to minimise exposure to hazards. In a school lab this means safety goggles, a lab gown, and gloves.",
              },
              {
                term: "GHS",
                desc: "The Globally Harmonized System — the international standard for classifying and labelling chemical hazards with standard pictograms.",
              },
              {
                term: "Pictogram",
                desc: "A standardised hazard image inside a red diamond border that communicates a type of danger at a glance.",
              },
              {
                term: "MSDS / SDS",
                desc: "Material Safety Data Sheet — a document listing a chemical's hazards, safe handling, storage, first aid, and disposal instructions.",
              },
              {
                term: "Hazard",
                desc: "A source of potential harm — a flammable liquid, a corrosive acid, a sharp piece of glassware.",
              },
              {
                term: "Corrosive",
                desc: "Able to destroy skin, eyes, or metal on contact. Both strong acids and strong bases are corrosive.",
              },
              {
                term: "Signal Word",
                desc: "The word 'Danger' or 'Warning' on a GHS label, indicating how severe the hazard is. 'Danger' is the more serious of the two.",
              },
              {
                term: "Wafting",
                desc: "The correct technique for smelling a chemical — fanning vapour toward your nose with a hand rather than inhaling directly over the container.",
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Safety Rules and Reasons",
          data: {
            intro:
              "Every laboratory rule has a clear reason behind it. Understanding WHY makes you far more likely to follow it, even when nobody is watching.",
            reasons: [
              {
                num: 1,
                title: "Always Wear PPE",
                color: "primary",
                desc: "Protects eyes, skin, and clothing from chemical hazards",
                content:
                  "A single drop of strong acid reaching an unprotected eye can cause permanent blindness. Goggles go on before the experiment starts, not when it looks risky.",
              },
              {
                num: 2,
                title: "No Food or Drink in the Lab",
                color: "secondary",
                desc: "Prevents accidental ingestion of chemicals",
                content:
                  "Chemical residue contaminates food and drink invisibly. Snacking near chemicals is one of the most common causes of accidental poisoning in laboratories.",
              },
              {
                num: 3,
                title: "Follow Teacher Instructions Exactly",
                color: "accent",
                desc: "Ensures the experiment is conducted safely and correctly",
                content:
                  "Your teacher knows the specific hazards of each experiment. Improvising steps or starting an unauthorised experiment can cause dangerous and unexpected reactions.",
              },
              {
                num: 4,
                title: "No Horseplay",
                color: "primary",
                desc: "Prevents accidents caused by distraction",
                content:
                  "A moment of distraction near an open flame, an unsealed chemical, or fragile glassware can injure several people at once.",
              },
              {
                num: 5,
                title: "Dispose of Waste Properly",
                color: "secondary",
                desc: "Protects the environment and prevents reactions in drains",
                content:
                  "Pouring the wrong chemical down a drain can damage pipes, pollute water supplies, or react dangerously with other waste already there.",
              },
              {
                num: 6,
                title: "Know the Emergency Exits",
                color: "accent",
                desc: "Enables rapid evacuation in a fire or gas leak",
                content:
                  "In an emergency there is no time to search. Knowing the exit route, extinguisher, and eyewash location in advance prevents panic and saves seconds that matter.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Hazard Categories",
          data: {
            cards: [
              {
                title: "Physical Hazards",
                label: "Fire and Explosion",
                variant: "primary",
                color: "primary",
                desc: "These symbols warn of substances that can catch fire, explode, or react dangerously with other materials.",
                image: equation,
                imageAlt: "Flammable, explosive, and oxidizing GHS symbols",
                examples: [
                  "Flame — flammable liquids, solids, or gases (ethanol, acetone)",
                  "Exploding bomb — explosive substances",
                  "Flame over circle — oxidisers that accelerate burning (hydrogen peroxide)",
                ],
              },
              {
                title: "Health Hazards",
                label: "Harm to the Body",
                variant: "secondary",
                color: "secondary",
                desc: "These warn of chemicals that harm the body through skin contact, inhalation, or swallowing — from mild irritation to fatal poisoning.",
                image: lab,
                imageAlt:
                  "Toxic skull, health hazard exclamation, and corrosive GHS symbols",
                examples: [
                  "Skull and crossbones — acutely toxic (methanol, strong acids)",
                  "Exclamation mark — irritant or mild health effects",
                  "Corrosion — destroys skin, eyes, and metals (concentrated HCl)",
                ],
              },
              {
                title: "Environmental Hazards",
                label: "Harm to Ecosystems",
                variant: "primary",
                color: "primary",
                desc: "This symbol warns of substances harmful to aquatic life or the wider environment, which must never enter a drain.",
                image: globe,
                imageAlt:
                  "Environmental hazard GHS symbol with dead fish and tree",
                examples: [
                  "Dead fish and tree — harmful to aquatic life (pesticides, heavy metals)",
                  "Never pour these down a sink",
                  "Disposal usually requires a licensed waste company",
                ],
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Reading Hazard Labels",
          data: {
            concepts: [
              "Read the full label before handling any chemical, including the signal word — 'Danger' is more severe than 'Warning'.",
              "Identify every pictogram and work out what protective equipment each hazard requires.",
              "Read the first aid measures before you start, so you already know what to do if something goes wrong.",
              "Never remove, cover, or deface a chemical label.",
              "Store chemicals by hazard category — flammables away from heat, oxidisers away from flammables, corrosives in ventilated cabinets.",
              "If a container has no label, do not use it. Report it to the teacher immediately — an unlabelled chemical is a serious hazard.",
            ],
          },
        },

        {
          type: "timeline",
          heading: "Responding to an Emergency",
          data: {
            intro:
              "A chemical spill on skin is the most common serious laboratory emergency. These five steps are the difference between a scare and an injury.",
            steps: [
              {
                num: 1,
                title: "Stop What You Are Doing",
                color: "primary",
                description:
                  "Put down any equipment immediately. Do not try to finish the step or rescue the experiment — your safety is the only priority.",
                tip: "Every extra second of contact increases the damage.",
              },
              {
                num: 2,
                title: "Call the Teacher Loudly",
                color: "secondary",
                description:
                  "Alert your teacher at once. They need to know which chemical, what concentration, and how much skin is affected to respond correctly.",
                tip: "Stay calm and speak clearly so the information is understood the first time.",
              },
              {
                num: 3,
                title: "Flood the Area with Water",
                color: "accent",
                description:
                  "Move to the nearest sink or safety shower and flood the affected skin with large amounts of cool running water. Keep rinsing for a full 15 minutes without stopping.",
                tip: "Fifteen minutes even if it feels fine after two — many chemicals keep working after the sting fades.",
              },
              {
                num: 4,
                title: "Remove Contaminated Clothing",
                color: "primary",
                description:
                  "While rinsing, carefully remove any clothing or jewellery holding the chemical against your skin.",
                tip: "Cut clothing off rather than pulling it over your face.",
              },
              {
                num: 5,
                title: "Seek Medical Attention",
                color: "secondary",
                description:
                  "Get checked afterwards even if the area feels better. Report the chemical name, concentration, and exposure time so medical staff can treat it properly.",
                tip: "Some chemical burns develop hours after exposure.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Real-Lab Scenarios",
          data: {
            intro:
              "Decide the correct action in each of these realistic situations before reading the answer.",
            scenarios: [
              {
                title: "The Unlabelled Bottle",
                situation:
                  "A student finds a clear bottle of liquid on the reagent shelf. The label has rubbed off and no information is visible. The student needs a solvent for their experiment.",
                question:
                  "Should the student use the liquid? What should they do instead?",
                skill:
                  "Never use an unlabelled chemical. Report it to the teacher immediately. Without knowing what it is, using it risks fire, chemical burns, or toxic exposure.",
              },
              {
                title: "Broken Glass on the Bench",
                situation:
                  "A student knocks a beaker off the bench and it shatters across the floor. Nobody is injured.",
                question:
                  "What should the student do immediately, and what must they NOT do?",
                skill:
                  "Tell the teacher at once. Do not pick up glass with bare hands — use a dustpan and brush, keep others away, and dispose of it in the broken-glass container.",
              },
              {
                title: "Choosing PPE",
                situation:
                  "A student is about to use a flammable solvent (acetone) and a corrosive acid. The GHS labels show a flame symbol and a corrosion symbol.",
                question:
                  "What PPE is required before beginning? Is ordinary clothing enough?",
                skill:
                  "Safety goggles, chemical-resistant gloves, and a lab gown are all required. Ordinary clothing is not enough. No open flame may be present because of the flammable solvent.",
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
                title: "Workplace Safety",
                description:
                  "Every professional laboratory — chemistry, biology, food science, engineering — enforces the same categories of rule you learn at school.",
                icon: "🏭",
                color: "border-l-primary-500",
              },
              {
                title: "Reading Household Labels",
                description:
                  "GHS pictograms appear on bleach, drain cleaner, and paint thinner at home. Recognising them tells you how to store and use them safely.",
                icon: "🧴",
                color: "border-l-secondary-500",
              },
              {
                title: "Hospital Protocols",
                description:
                  "Medical laboratory workers follow rigorous rules when handling blood, tissue, and potentially infectious material.",
                icon: "🏥",
                color: "border-l-accent-500",
              },
              {
                title: "Emergency Response",
                description:
                  "Firefighters read the same hazard symbols on containers and tankers to decide how to fight a chemical fire safely.",
                icon: "🚒",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
