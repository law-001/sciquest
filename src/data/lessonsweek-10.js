// Week 10: Laboratory Safety — Grade 7 Science

import globe from "../assets/week1/globe.jpg";
import equation from "../assets/week1/equation.jpg";
import lab from "../assets/lab.jpg";
import modernclassroom from "../assets/modernclassroom.jpg";
import flowchart from "../assets/flowchart.jpg";

export const week10 = {
  id: "week-10",
  weekNumber: 10,
  title: "Laboratory Safety",
  category: "Laboratory Skills",
  description:
    "Learn essential safety rules, hazard symbols, and emergency procedures to keep yourself and others safe in the laboratory.",
  icon: "ShieldAlert",
  color: "primary",
  isLocked: false,
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 28 — Laboratory Safety Rules
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-28",
      weekId: "week-10",
      lessonNumber: 28,
      title: "Laboratory Safety Rules",
      badge: "Lesson 28",
      subtitle:
        "Understand the essential safety rules every student must follow in the laboratory and why each rule exists.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: modernclassroom,
      heroImageAlt:
        "Students in a science lab wearing safety goggles and lab gowns",

      sections: [
        "Overview",
        "Key Terms",
        "Safety Rules and Reasons",
        "Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The laboratory is a place for discovery, but it can also be dangerous if students do not follow proper safety procedures. Every rule in the science lab exists for a specific reason — to protect you, your classmates, and your teacher. <strong class='text-primary-700'>Personal Protective Equipment (PPE)</strong> such as safety goggles, lab gowns, and gloves must be worn at all times during experiments.",
              "Before beginning any experiment, students should know the location of the nearest <strong class='text-primary-700'>fire extinguisher</strong>, eye wash station, first aid kit, and emergency exit. The <strong class='text-primary-700'>Material Safety Data Sheet (MSDS)</strong> — now more commonly called a Safety Data Sheet (SDS) — provides detailed information about the hazards of any chemical you are using.",
            ],
            didYouKnow:
              "The first recorded laboratory safety guidelines were issued in the early 1900s, but it was not until the 1970s that governments in many countries began requiring formal safety training in schools and workplaces.",
          },
        },
        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "PPE (Personal Protective Equipment)",
                desc: "Equipment worn to minimize exposure to hazards. In the lab, PPE includes safety goggles, a lab gown, and gloves.",
              },
              {
                term: "MSDS",
                desc: "Material Safety Data Sheet — a document that provides information about a chemical's hazards, safe handling procedures, and emergency measures.",
              },
              {
                term: "Lab Gown",
                desc: "A protective coat worn over regular clothes in the laboratory to protect skin and clothing from chemical splashes and spills.",
              },
              {
                term: "Safety Goggles",
                desc: "Protective eyewear that shields the eyes from chemical splashes, flying particles, and other laboratory hazards.",
              },
              {
                term: "Hazard",
                desc: "A source of potential danger or harm in the laboratory environment, such as flammable chemicals, corrosive acids, or sharp glassware.",
              },
              {
                term: "Protocol",
                desc: "A set of established rules or procedures that must be followed to ensure a safe and successful laboratory activity.",
              },
            ],
          },
        },
        {
          type: "reasonCards",
          heading: "Safety Rules and Reasons",
          data: {
            intro:
              "Every laboratory safety rule has a clear reason behind it. Understanding WHY these rules exist makes you more likely to follow them consistently, even when no one is watching.",
            reasons: [
              {
                num: 1,
                title: "Always Wear PPE",
                color: "primary",
                desc: "Protects eyes, skin, and clothing from chemical hazards",
                content:
                  "A single drop of strong acid reaching your eye without protection can cause permanent blindness — goggles must be worn from the start of the lab.",
              },
              {
                num: 2,
                title: "No Food or Drink in the Lab",
                color: "secondary",
                desc: "Prevents accidental ingestion of chemicals",
                content:
                  "Chemicals can contaminate food and drink, and snacking near chemicals is one of the most common causes of accidental poisoning in laboratories.",
              },
              {
                num: 3,
                title: "Dispose of Waste Properly",
                color: "accent",
                desc: "Protects the environment and prevents chemical reactions in drains",
                content:
                  "Pouring certain chemicals down the drain can damage pipes, pollute water, or create dangerous reactions with other waste materials.",
              },
              {
                num: 4,
                title: "Follow Teacher Instructions",
                color: "primary",
                desc: "Ensures the experiment is conducted safely and correctly",
                content:
                  "Teachers know the specific hazards of each experiment. Improvising procedures or skipping steps can lead to unexpected and dangerous chemical reactions.",
              },
              {
                num: 5,
                title: "No Horseplay",
                color: "secondary",
                desc: "Prevents accidents caused by distraction or loss of control",
                content:
                  "A moment of distraction near a Bunsen burner, an open chemical container, or fragile glassware can cause serious injuries to multiple people.",
              },
              {
                num: 6,
                title: "Know the Emergency Exits",
                color: "accent",
                desc: "Enables rapid evacuation in case of fire or gas leak",
                content:
                  "In an emergency, every second counts. Knowing exit routes in advance prevents panic and ensures everyone can evacuate quickly and safely.",
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
                  "All professional laboratories — in chemistry, biology, food science, and engineering — require workers to follow the same types of safety rules you learn in school.",
                icon: "🏭",
                color: "border-l-primary-500",
              },
              {
                title: "Industrial Labs",
                description:
                  "Chemical and pharmaceutical factories enforce strict PPE requirements and safety protocols to protect workers from large-scale hazards.",
                icon: "⚗️",
                color: "border-l-secondary-500",
              },
              {
                title: "Hospital Protocols",
                description:
                  "Medical laboratory workers follow rigorous safety rules when handling blood, tissue samples, and potentially infectious biological materials.",
                icon: "🏥",
                color: "border-l-accent-500",
              },
              {
                title: "School Safety Drills",
                description:
                  "Regular fire and emergency drills train students and staff to respond quickly and calmly in a real emergency, reducing the risk of injury.",
                icon: "🚨",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 29 — Safety Symbols and Hazards
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-29",
      weekId: "week-10",
      lessonNumber: 29,
      title: "Safety Symbols and Hazards",
      badge: "Lesson 29",
      subtitle:
        "Learn to recognize and interpret GHS hazard symbols so you can handle chemicals safely and choose the correct protective equipment.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: equation,
      heroImageAlt: "GHS hazard symbols displayed on chemical containers",

      sections: [
        "Overview",
        "Hazard Categories",
        "Reading Hazard Labels",
        "Real-Lab Scenarios",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>Globally Harmonized System (GHS)</strong> is an international standard for labeling and classifying chemical hazards. GHS labels feature standardized pictograms — simple images inside a red diamond border — that instantly communicate the type of danger a chemical poses. Learning these symbols helps you stay safe before you even open a container.",
              "There are nine GHS hazard pictograms. Each represents a different category of risk: <strong class='text-primary-700'>physical hazards</strong> (such as flammable, explosive, and oxidizing), <strong class='text-primary-700'>health hazards</strong> (such as toxic, irritant, and corrosive), and <strong class='text-primary-700'>environmental hazards</strong> (harmful to aquatic life or the broader environment).",
            ],
            didYouKnow:
              "The skull and crossbones symbol for toxic substances has been used since the Middle Ages as a warning sign. The modern GHS version appears on chemicals that can cause death or serious illness even in small amounts.",
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
                desc: "Physical hazard symbols warn of substances that can catch fire, explode, or react dangerously with other materials. These require strict storage and handling controls.",
                image: equation,
                imageAlt: "Flammable, explosive, and oxidizing GHS symbols",
                examples: [
                  "Flame symbol — flammable liquids, solids, or gases (e.g., ethanol, acetone)",
                  "Exploding bomb — explosive substances (e.g., certain peroxides)",
                  "Flame over circle — oxidizing substances that accelerate burning (e.g., hydrogen peroxide)",
                ],
              },
              {
                title: "Health Hazards",
                label: "Harm to the Body",
                variant: "secondary",
                color: "secondary",
                desc: "Health hazard symbols warn of chemicals that can harm the body through skin contact, inhalation, or ingestion. The level of risk ranges from mild irritation to fatal toxicity.",
                image: lab,
                imageAlt:
                  "Toxic skull, health hazard exclamation, and corrosive GHS symbols",
                examples: [
                  "Skull and crossbones — acutely toxic substances (e.g., methanol, strong acids)",
                  "Exclamation mark — irritants and substances causing mild health effects",
                  "Corrosion symbol — corrosive to skin, eyes, and metals (e.g., concentrated HCl)",
                ],
              },
              {
                title: "Environmental Hazards",
                label: "Harm to Ecosystems",
                variant: "primary",
                color: "primary",
                desc: "The environmental hazard symbol warns of substances that are harmful to aquatic organisms or the broader environment. These must be disposed of carefully to prevent pollution.",
                image: globe,
                imageAlt:
                  "Environmental hazard GHS symbol with dead fish and tree",
                examples: [
                  "Dead fish and tree symbol — harmful to aquatic life (e.g., certain pesticides, heavy metals)",
                  "Chemicals in this category must never be poured down drains",
                  "Proper disposal often involves collection by a licensed waste management company",
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
              "Always read the full GHS label before handling any chemical — including the signal word (Danger or Warning) which indicates severity.",
              "Identify all hazard pictograms on the label and understand what protective equipment is required for each hazard type.",
              "The label also includes first aid measures — read these before starting work so you know what to do if an accident occurs.",
              "Never remove, cover, or deface a chemical label — if a label is illegible, treat the container as hazardous and report it to the teacher.",
              "Store chemicals according to their hazard categories — flammables away from heat, corrosives in ventilated areas, oxidizers away from flammables.",
              "If a chemical has no label, do not use it — an unlabeled container is a serious safety hazard that must be reported immediately.",
            ],
          },
        },
        {
          type: "scenario",
          heading: "Real-Lab Scenarios",
          data: {
            intro:
              "Test your understanding of hazard symbols by deciding the correct action in each of these realistic laboratory situations.",
            scenarios: [
              {
                title: "Unlabeled Bottle",
                situation:
                  "A student finds a clear bottle of liquid on the reagent shelf. The label has been rubbed off and no information is visible. The student needs a solvent for their experiment.",
                question:
                  "Should the student use the liquid? What should they do instead?",
                skill:
                  "Never use an unlabeled chemical. The student should report the bottle to the teacher immediately. Without knowing the identity and hazards of the substance, using it could cause a fire, chemical burns, or toxic exposure.",
              },
              {
                title: "Disposing of Chemicals",
                situation:
                  "After an experiment, a student has leftover sodium hydroxide solution (a corrosive base) and wants to pour it down the laboratory sink to clean up quickly.",
                question:
                  "Is this safe? What factors should the student check before disposing of any chemical?",
                skill:
                  "Check the GHS label and your teacher's disposal instructions first. Many corrosive chemicals can damage pipes or react with other substances in the drain. Dilute bases may be safely flushed with large amounts of water, but this must be confirmed with the teacher.",
              },
              {
                title: "Choosing PPE",
                situation:
                  "A student is about to perform an experiment using a flammable solvent (acetone) and a corrosive acid (hydrochloric acid). The GHS labels show both a flame symbol and a skull and crossbones.",
                question:
                  "What PPE should the student put on before beginning? Is regular clothing sufficient?",
                skill:
                  "The student must wear safety goggles (eye protection from splashes and vapors), chemical-resistant gloves (hand protection from both the acid and solvent), and a lab gown (body protection). No open flames should be present due to the flammable solvent.",
              },
            ],
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 30 — Emergency Procedures
    // ═══════════════════════════════════════════════════
    {
      id: "lesson-30",
      weekId: "week-10",
      lessonNumber: 30,
      title: "Emergency Procedures",
      badge: "Lesson 30",
      subtitle:
        "Learn the step-by-step procedures for responding to common laboratory emergencies, including chemical spills, fires, cuts, and eye injuries.",
      readTime: "~12 min read",
      xp: 50,
      heroImage: flowchart,
      heroImageAlt:
        "Emergency response flowchart showing steps for lab accidents",

      sections: [
        "Overview",
        "Chemical Spill on Skin",
        "Minor vs Major Emergencies",
        "Applications",
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Even when all safety rules are followed, accidents can still happen. Knowing exactly what to do in an emergency can be the difference between a minor incident and a serious injury. The four most common laboratory emergencies are: <strong class='text-primary-700'>chemical spills on skin or eyes</strong>, <strong class='text-primary-700'>fires</strong>, <strong class='text-primary-700'>cuts from broken glassware</strong>, and <strong class='text-primary-700'>eye injuries</strong>.",
              "For a fire, use the <strong class='text-primary-700'>PASS technique</strong> with a fire extinguisher: Pull the pin, Aim at the base of the fire, Squeeze the handle, and Sweep from side to side. For eye injuries, use the emergency eye wash station immediately and rinse continuously for at least 15 minutes. Always know your exit routes before starting any experiment.",
            ],
            didYouKnow:
              "The emergency eye wash station must be activated for a full 15 minutes when a chemical enters the eye — even if it feels fine after 2 minutes. Many chemicals continue to cause damage even after initial washing stops.",
          },
        },
        {
          type: "timeline",
          heading: "Chemical Spill on Skin",
          data: {
            intro:
              "A chemical spill on skin is one of the most common laboratory emergencies. Responding quickly and correctly minimizes damage and prevents serious injury. Follow these steps immediately if a chemical contacts your skin.",
            steps: [
              {
                num: 1,
                title: "Stop What You Are Doing",
                color: "primary",
                description:
                  "Immediately stop the experiment and set down any equipment or chemicals you are holding. Do not try to finish the step or save the experiment — your safety is the only priority.",
                tip: "Time is critical — every second of continued chemical contact increases the potential for injury.",
              },
              {
                num: 2,
                title: "Call the Teacher Immediately",
                color: "secondary",
                description:
                  "Alert your teacher loudly by calling for help. Your teacher needs to know what chemical was involved, the concentration, and the area of skin affected to coordinate the correct response.",
                tip: "Do not panic — stay calm and speak clearly so the teacher can understand you.",
              },
              {
                num: 3,
                title: "Flood the Area with Water",
                color: "accent",
                description:
                  "Move immediately to the nearest sink or safety shower. Flood the affected skin area with large amounts of cold running water. Continue rinsing for a minimum of 15 minutes without stopping.",
                tip: "Do not use ice water — it can cause thermal shock. Use cool or room-temperature running water.",
              },
              {
                num: 4,
                title: "Remove Contaminated Clothing",
                color: "primary",
                description:
                  "While rinsing, carefully remove any clothing or jewellery that is contaminated with the chemical. Clothing that holds a chemical against the skin continues to cause damage even as you rinse.",
                tip: "Cut clothing off if necessary — do not pull clothing over the head and face if it is contaminated.",
              },
              {
                num: 5,
                title: "Seek Medical Attention",
                color: "secondary",
                description:
                  "After rinsing, even if the affected area feels better, seek medical attention. Report the name of the chemical, concentration, and duration of exposure so medical staff can provide appropriate treatment.",
                tip: "Some chemicals cause delayed reactions that appear hours after exposure — always seek professional evaluation.",
              },
            ],
          },
        },
        {
          type: "comparison",
          heading: "Minor vs Major Emergencies",
          data: {
            intro:
              "Correctly identifying whether a lab emergency is minor or major helps you respond appropriately. Overreacting to a small incident can cause unnecessary panic, while underreacting to a major emergency can be life-threatening.",
            left: {
              label: "Minor Emergency",
              color: "primary",
              items: [
                "Low level of risk — limited to one person or a small area",
                "Immediate response: apply first aid and notify teacher",
                "Inform the teacher — teacher manages the situation",
                "Evacuation is not necessary unless situation escalates",
                "Example: small chemical spill on gloved hand, minor cut from glass",
              ],
            },
            right: {
              label: "Major Emergency",
              color: "secondary",
              items: [
                "High level of risk — threatens multiple people or the entire room",
                "Immediate response: alert everyone and activate emergency protocols",
                "Inform teacher, call emergency services (fire department, ambulance)",
                "Evacuate the laboratory and school building immediately",
                "Example: large fire, toxic gas release, serious chemical burn to face or eyes",
              ],
            },
          },
        },
        {
          type: "applications",
          heading: "Applications",
          data: {
            apps: [
              {
                title: "School Safety Drills",
                description:
                  "Schools conduct regular fire and emergency drills so students and teachers can practice evacuation routes and emergency procedures until they become automatic responses.",
                icon: "🚨",
                color: "border-l-primary-500",
              },
              {
                title: "Workplace Health and Safety",
                description:
                  "All workplaces with chemical hazards are legally required to have emergency procedures, trained first aiders, and accessible safety equipment such as eye wash stations and fire extinguishers.",
                icon: "🏗️",
                color: "border-l-secondary-500",
              },
              {
                title: "Fire Brigade Response",
                description:
                  "Professional firefighters use the same PASS technique and hazard identification skills to respond to chemical fires and spills at industrial facilities.",
                icon: "🚒",
                color: "border-l-accent-500",
              },
              {
                title: "Hospital Emergency Protocols",
                description:
                  "Hospital emergency departments have specific decontamination procedures for patients who arrive after chemical exposure, using the same principles taught in school laboratory safety.",
                icon: "🏥",
                color: "border-l-primary-500",
              },
            ],
          },
        },
      ],
    },
  ],
};
