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
    "Identify the instruments in a science laboratory, learn what each one is for and how to handle it, and learn the safety rules and hazard symbols that keep everyone safe.",
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
        "Name the common tools of the science laboratory, learn the job each one does, and practice handling them the right way.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "A school laboratory bench with beakers, flasks, test tubes, a graduated cylinder and an alcohol lamp",

      signature: {
        widgetId: "equipment-bench",
        heading: "Watch It: Every Instrument Works",
        intro: "Open the collar, load the pan, pour the mixture through.",
        instruction: "Get all four instruments working.",
        xp: 25,
        explainer: {
          title: "Why each tool has one job",
          points: [
            "Opening the collar mixed air into the gas, so the lazy yellow flame turned blue and hot.",
            "The balance pan swung past the answer first. Only the settled reading was honest.",
            "The paper let water through and kept the mud, so the filtrate came out clear.",
            "One lens height brought the cells into focus. Above and below it, the edges smeared.",
          ],
        },
      },

      sections: [
        "Overview",
        "Glassware and Containers",
        "Measuring Instruments",
        "Heating, Handling and Viewing Tools",
        "Proper Use and Handling",
        "Choosing the Right Tool",
      ],

      references: [
        {
          label: "Britannica — Laboratory",
          url: "https://www.britannica.com/technology/laboratory",
        },
        {
          label: "Britannica — Bunsen Burner",
          url: "https://www.britannica.com/science/Bunsen-burner",
        },
        {
          label: "Royal Society of Chemistry — Education Resources",
          url: "https://edu.rsc.org/resources",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "A carpenter uses a saw to cut and a hammer to pound. Using a hammer to cut wood would not work and could hurt someone. A science laboratory works the same way: every instrument has a job it is made for.",
              "Lab tools fall into a few groups. <strong class='text-primary-700'>Glassware and containers</strong> hold and mix substances. <strong class='text-primary-700'>Measuring instruments</strong> give numbers for volume, mass, temperature, length and time. <strong class='text-primary-700'>Heating and handling tools</strong> let you heat things and hold hot or small objects safely. <strong class='text-primary-700'>Viewing tools</strong> let you see things too small for your eyes.",
              "Using the right tool in the right way gives you accurate results and keeps everyone safe. Handling lab equipment carefully, and putting it back clean, is part of being <strong class='text-primary-700'>responsible</strong>, because the next class needs it too.",
            ],
            didYouKnow:
              "Glassware that can be heated is usually made of borosilicate glass. It expands much less than window glass when it gets hot, so it is far less likely to crack over a flame.",
          },
        },

        {
          type: "imageCards",
          heading: "Glassware and Containers",
          data: {
            cards: [
              {
                title: "Beaker",
                label: "Hold and Heat",
                variant: "primary",
                color: "primary",
                desc: "Holds, mixes and heats liquids. Use its markings only for rough amounts. For exact volume, use a graduated cylinder.",
                image: equation,
                imageAlt:
                  "Three glass beakers of different sizes with white volume markings",
                examples: [
                  "Heating water on a tripod and wire gauze",
                  "Dissolving salt or sugar",
                  "Holding a liquid before measuring it",
                ],
              },
              {
                title: "Erlenmeyer Flask",
                label: "Swirl Safely",
                variant: "secondary",
                color: "secondary",
                desc: "Its narrow neck keeps liquids from splashing out when you swirl the flask, and slows evaporation.",
                image: simulation,
                imageAlt:
                  "A cone-shaped Erlenmeyer flask holding a colored liquid",
                examples: [
                  "Mixing two solutions by swirling",
                  "Storing a prepared solution with a stopper",
                  "Heating a liquid that might splash",
                ],
              },
              {
                title: "Test Tube and Rack",
                label: "Small Amounts",
                variant: "accent",
                color: "accent",
                desc: "Test tubes hold small samples for quick tests. A test tube rack keeps them upright so they don't roll or spill.",
                image: lab,
                imageAlt:
                  "A row of test tubes standing in a test tube rack, some holding colored liquids",
                examples: [
                  "Testing a few drops of a sample with an indicator",
                  "Heating a small amount of a solid",
                  "Comparing several samples side by side",
                ],
              },
              {
                title: "Funnel and Filter Paper",
                label: "Separate Mixtures",
                variant: "primary",
                color: "primary",
                desc: "A funnel guides liquid into a narrow opening. Lined with folded filter paper, it separates solid particles from a liquid.",
                image: modernclassroom,
                imageAlt:
                  "A glass funnel lined with filter paper set over a flask, filtering muddy water",
                examples: [
                  "Filtering sand out of water",
                  "Pouring liquid into a narrow bottle",
                  "Collecting a clear filtrate",
                ],
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Measuring Instruments",
          data: {
            cards: [
              {
                title: "Graduated Cylinder",
                label: "Volume (mL)",
                variant: "primary",
                color: "primary",
                desc: "Measures liquid volume accurately. Set it on a flat surface, bend down to eye level, and read the bottom of the curved surface (the meniscus).",
                image: simulation,
                imageAlt:
                  "Close-up of a graduated cylinder showing the curved meniscus of water at a marked line",
                examples: [
                  "Measuring 50 mL of water for a solution",
                  "Measuring the volume of an irregular stone by water displacement",
                ],
              },
              {
                title: "Balance",
                label: "Mass (g)",
                variant: "secondary",
                color: "secondary",
                desc: "Measures mass in grams. Make sure it reads zero before you start, and wait for the reading to settle before you record it.",
                image: equation,
                imageAlt:
                  "A digital balance showing a reading in grams with a small dish of salt on the pan",
                examples: [
                  "Weighing 10 g of sugar for a solution",
                  "Finding the mass of a rock sample",
                ],
              },
              {
                title: "Thermometer",
                label: "Temperature (°C)",
                variant: "accent",
                color: "accent",
                desc: "Measures temperature in °C. Keep the bulb in the liquid, not touching the bottom of the container. School thermometers today are usually filled with red-dyed alcohol or are digital, because mercury is toxic.",
                image: lab,
                imageAlt:
                  "A laboratory thermometer with red liquid standing in a beaker of warm water",
                examples: [
                  "Checking when water starts to boil",
                  "Comparing hot and cold water before dissolving sugar",
                ],
              },
              {
                title: "Ruler and Stopwatch",
                label: "Length (cm) and Time (s)",
                variant: "primary",
                color: "primary",
                desc: "A ruler or meter stick measures length in centimeters or meters. A stopwatch measures time in seconds. Start and stop it at the exact moment the event begins and ends.",
                image: globe,
                imageAlt:
                  "A meter stick and a digital stopwatch lying on a lab bench",
                examples: [
                  "Measuring how tall a monggo seedling grows",
                  "Timing how long sugar takes to dissolve",
                ],
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Heating, Handling and Viewing Tools",
          data: {
            cards: [
              {
                title: "Alcohol Lamp and Bunsen Burner",
                label: "Heat Sources",
                variant: "primary",
                color: "primary",
                desc: "Give a flame for heating. Most school labs use alcohol lamps. Some use Bunsen burners, which run on gas and have an air collar to control the flame.",
                image: lab,
                imageAlt:
                  "A lit alcohol lamp with its cap beside it on a lab bench",
                examples: [
                  "Light an alcohol lamp with a match, never from another lamp",
                  "Put it out by covering it with its cap, never by blowing",
                  "Never refill an alcohol lamp while it is lit or hot",
                ],
              },
              {
                title: "Tripod and Wire Gauze",
                label: "Support over Heat",
                variant: "secondary",
                color: "secondary",
                desc: "The tripod holds a beaker or flask above the flame. The wire gauze on top spreads the heat evenly so the glass doesn't crack.",
                image: modernclassroom,
                imageAlt:
                  "A beaker of water sitting on wire gauze over a tripod stand above a flame",
                examples: [
                  "Heating water in a beaker",
                  "Warming a solution to dissolve more sugar",
                ],
              },
              {
                title: "Holders, Tongs and Droppers",
                label: "Handling",
                variant: "accent",
                color: "accent",
                desc: "Let you hold hot or small things without touching them. A test tube holder grips a tube over a flame, tongs lift hot objects, and a dropper adds liquid drop by drop.",
                image: equation,
                imageAlt:
                  "A test tube holder, crucible tongs and a medicine dropper laid side by side",
                examples: [
                  "Holding a test tube while heating it",
                  "Lifting a hot evaporating dish",
                  "Adding indicator one drop at a time",
                ],
              },
              {
                title: "Hand Lens and Compound Microscope",
                label: "Viewing",
                variant: "primary",
                color: "primary",
                desc: "A hand lens (magnifying glass) makes small things look a few times bigger. A compound microscope magnifies tiny specimens, such as cells, up to hundreds of times.",
                image: globe,
                imageAlt:
                  "A student using a compound microscope next to a hand lens on the table",
                examples: [
                  "Looking at salt crystals with a hand lens",
                  "Observing onion skin cells under a microscope",
                ],
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Proper Use and Handling",
          data: {
            intro:
              "These habits apply to almost every instrument. Follow them in order each time you use lab equipment.",
            steps: [
              {
                num: 1,
                title: "Check Before You Use",
                color: "primary",
                description:
                  "Look over glassware for cracks or chips. Make sure a balance reads zero and a thermometer is not broken. Report anything damaged to your teacher instead of using it.",
                tip: "Cracked glass can break apart when heated.",
              },
              {
                num: 2,
                title: "Carry Equipment Safely",
                color: "secondary",
                description:
                  "Carry glassware with both hands, one under it. Carry a microscope with one hand on the arm and the other under the base. Walk, don't run.",
                tip: "Never carry several beakers stacked inside each other.",
              },
              {
                num: 3,
                title: "Use the Right Tool for the Job",
                color: "accent",
                description:
                  "Measure exact volumes with a graduated cylinder, not a beaker. Weigh solids on a balance. Hold hot test tubes with a holder, not with your fingers.",
                tip: "The right tool gives accurate results and prevents accidents.",
              },
              {
                num: 4,
                title: "Heat Carefully",
                color: "primary",
                description:
                  "Heat a test tube gently while moving it through the flame, with its mouth pointed away from you and everyone else. Never heat a closed container, because pressure can make it burst.",
                tip: "Hot glass looks exactly like cool glass. Let it cool before touching it.",
              },
              {
                num: 5,
                title: "Clean and Return",
                color: "secondary",
                description:
                  "When you finish, clean the equipment, dry it, and put it back where it belongs. Let hot glassware cool first, because cold water on hot glass can crack it.",
                tip: "Wash glassware with soap right after use, store it upright away from table edges, cap alcohol lamps, and report broken equipment so your teacher can clean up the glass.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Choosing the Right Tool",
          data: {
            intro:
              "Choosing the correct tool is what makes a measurement accurate and an experiment safe. Decide what each student should use before reading the answer.",
            scenarios: [
              {
                title: "Exactly 25 mL",
                situation:
                  "Carla needs exactly 25 mL of water for a solution. She grabs a 250 mL beaker because it is closest.",
                question: "Is the beaker the best choice? What should she use?",
                skill:
                  "No. Beaker markings are only rough estimates. She should use a graduated cylinder and read the bottom of the meniscus at eye level.",
              },
              {
                title: "The Hot Test Tube",
                situation:
                  "Marco is heating a small amount of water in a test tube over an alcohol lamp. He holds the tube with his fingers and points the opening toward his partner.",
                question: "What two mistakes is he making?",
                skill:
                  "He should hold the tube with a test tube holder, not his fingers, and point the mouth away from himself and everyone else, so hot liquid can't splash onto anyone.",
              },
              {
                title: "Mass of Salt",
                situation:
                  "A group needs 5 g of salt. One member suggests using \"about one teaspoon.\"",
                question: "Why is that not good enough, and what should they use?",
                skill:
                  "A teaspoon gives only a rough amount, so their results would not be accurate or repeatable. They should measure the salt on a balance that reads zero before they start.",
              },
              {
                title: "Blowing Out the Flame",
                situation:
                  "When finished, a student leans over the alcohol lamp to blow it out.",
                question: "What is the correct way to put out an alcohol lamp?",
                skill:
                  "Cover the flame with the lamp's cap. Blowing on it can spread burning alcohol or push the flame back into the lamp.",
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
        "Learn the laboratory safety rules and why each one matters, read the hazard symbols on chemical labels, and know what to do when something goes wrong.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: modernclassroom,
      heroImageAlt:
        "Students in a school science lab wearing safety goggles and lab gowns while their teacher watches",

      signature: {
        widgetId: "hazard-cabinet",
        heading: "Watch It: Symbols Keep Their Promise",
        intro: "Open a bottle and its symbol does what it warns.",
        instruction: "Show every symbol, then fix the lab floor.",
        xp: 25,
        explainer: {
          title: "Why the symbols are worth reading",
          points: [
            "Every bottle you opened did what its symbol promised: the acid bored through steel, the vapor found a spark.",
            "One drop of the toxic liquid reached every corner of the tank, so small amounts still count.",
            "The oxidizer added no fuel of its own. It fed oxygen to the ember and the ember flared.",
            "On the lab floor nothing fixed itself. Each hazard grew until you stepped in.",
          ],
        },
      },

      sections: [
        "Overview",
        "Laboratory Safety Rules",
        "Safety Symbols",
        "Reading a Label",
        "If an Accident Happens",
        "What Would You Do?",
      ],

      references: [
        {
          label: "UNECE — Globally Harmonized System of Classification and Labelling of Chemicals (GHS)",
          url: "https://unece.org/about-ghs",
        },
        {
          label: "OSHA — Hazard Communication (GHS pictograms)",
          url: "https://www.osha.gov/hazcom",
        },
        {
          label: "Royal Society of Chemistry — Education Resources",
          url: "https://edu.rsc.org/resources",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "Road signs keep drivers and people walking safe. A red octagon means stop, and everyone knows it without reading a long sentence. The science laboratory has its own signs: <strong class='text-primary-700'>safety symbols</strong> printed on chemical bottles and posted on walls.",
              "Along with the symbols come <strong class='text-primary-700'>laboratory rules</strong>. Each rule exists because of an accident that really can happen: a splash in the eye, a burn from hot glass, a fire from a flammable liquid near a flame.",
              "Following the rules protects you, but it also protects your classmates and teacher. One careless act can hurt the whole group. Being <strong class='text-primary-700'>responsible</strong> in the lab means following the rules even when no one is watching, and knowing what to do when something goes wrong.",
            ],
            didYouKnow:
              "Chemical labels around the world use the same set of nine hazard pictograms, called the GHS (Globally Harmonized System). A bottle made in Japan or Germany carries the same warning symbols as one made in the Philippines.",
          },
        },

        {
          type: "reasonCards",
          heading: "Laboratory Safety Rules",
          data: {
            intro:
              "Each rule has a reason. Knowing the reason makes it easier to remember, and to follow, even when no one is watching.",
            reasons: [
              {
                num: 1,
                title: "Listen and Read First",
                color: "primary",
                desc: "Know the steps before you touch anything",
                content:
                  "Listen to your teacher's instructions and read the whole procedure before you start. Never do an experiment that your teacher has not approved. Skipping or changing steps can cause an unexpected reaction.",
              },
              {
                num: 2,
                title: "Wear Your PPE",
                color: "secondary",
                desc: "Goggles, gown and gloves the whole time",
                content:
                  "Wear safety goggles from start to finish, not only when something looks risky. One splash of acid in the eye can cause permanent damage. Tie back long hair and roll up loose sleeves near flames.",
              },
              {
                num: 3,
                title: "No Eating, Drinking or Tasting",
                color: "accent",
                desc: "Keep chemicals out of your mouth",
                content:
                  "Never eat, drink or taste anything in the lab, even if it looks like water or sugar. Tiny amounts of chemicals on your hands or the table can get into food. Smell a substance only by wafting.",
              },
              {
                num: 4,
                title: "No Horseplay",
                color: "primary",
                desc: "Stay focused at your station",
                content:
                  "Running, pushing or playing near flames, glass and chemicals can hurt several people at once. Stay at your station and move carefully.",
              },
              {
                num: 5,
                title: "Report Accidents at Once",
                color: "secondary",
                desc: "Tell your teacher right away, even small ones",
                content:
                  "Tell your teacher about any spill, cut, burn or broken glass immediately, even if it seems minor. Hiding an accident can turn a small problem into a serious injury.",
              },
              {
                num: 6,
                title: "Clean Up and Dispose Properly",
                color: "accent",
                desc: "Leave your station safe for the next class",
                content:
                  "Throw waste only where your teacher says. Never pour chemicals down the sink unless told to. Put broken glass in the special container, not the trash bin. Wash your hands before you leave.",
              },
            ],
          },
        },

        {
          type: "imageCards",
          heading: "Safety Symbols",
          data: {
            cards: [
              {
                title: "Flammable",
                label: "Flame",
                variant: "primary",
                color: "primary",
                desc: "A flame in a red diamond. The substance catches fire easily. Keep it away from flames, sparks and heat. A flame over a circle means oxidizer, a substance that makes fires burn hotter.",
                image: equation,
                imageAlt:
                  "The GHS flammable pictogram: a black flame inside a red-bordered diamond",
                examples: [
                  "Rubbing alcohol and alcohol-lamp fuel",
                  "Paint thinner and gasoline",
                  "Response: no open flames nearby; keep the cap closed",
                ],
              },
              {
                title: "Corrosive",
                label: "Liquid Eating Hand and Metal",
                variant: "secondary",
                color: "secondary",
                desc: "Liquid dripping onto a hand and a metal bar. It can burn skin and eyes and eat away metal.",
                image: lab,
                imageAlt:
                  "The GHS corrosive pictogram: liquid dripping onto a hand and a metal bar inside a red diamond",
                examples: [
                  "Muriatic acid",
                  "Drain cleaner (sosa)",
                  "Response: gloves and goggles; rinse any splash with water for 15 minutes",
                ],
              },
              {
                title: "Toxic",
                label: "Skull and Crossbones",
                variant: "accent",
                color: "accent",
                desc: "A skull and crossbones. Even a small amount can seriously harm or kill if swallowed, breathed in or absorbed through skin.",
                image: simulation,
                imageAlt:
                  "The GHS toxic pictogram: a skull and crossbones inside a red diamond",
                examples: [
                  "Some rat poisons and pesticides",
                  "Methanol (wood alcohol)",
                  "Response: never touch or smell it; only adults handle it",
                ],
              },
              {
                title: "Irritant / Harmful",
                label: "Exclamation Mark",
                variant: "primary",
                color: "primary",
                desc: "An exclamation mark. It can irritate skin, eyes or the airways, or be harmful in larger amounts.",
                image: globe,
                imageAlt:
                  "The GHS exclamation-mark pictogram for irritants inside a red diamond",
                examples: [
                  "Some detergents and cleaning powders",
                  "Some insect sprays",
                  "Response: avoid skin contact; use only in an airy place",
                ],
              },
              {
                title: "Harmful to the Environment",
                label: "Dead Tree and Fish",
                variant: "secondary",
                color: "secondary",
                desc: "A dead tree and fish. The substance harms living things in water and soil. Never pour it down a drain or into a canal.",
                image: modernclassroom,
                imageAlt:
                  "The GHS environmental hazard pictogram: a bare tree and a dead fish inside a red diamond",
                examples: [
                  "Many pesticides",
                  "Used motor oil",
                  "Response: give it to your teacher for proper disposal",
                ],
              },
              {
                title: "Lab Safety Signs",
                label: "Wear, Watch, Wash",
                variant: "accent",
                color: "accent",
                desc: "Lab manuals and posters also use signs that tell you what to wear or watch out for in an activity.",
                image: lab,
                imageAlt:
                  "A row of lab safety signs: goggles required, gloves required, hot surface and broken glass",
                examples: [
                  "Goggles sign: wear eye protection",
                  "Hot surface sign: use tongs or a holder",
                  "Sharp object or glass sign: handle with care",
                ],
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "Reading a Label",
          data: {
            concepts: [
              "Read the whole label before you open any container: the name, the symbols, the signal word and the directions.",
              "The signal word tells how serious the hazard is. \"Danger\" means more serious than \"Warning.\"",
              "Each symbol tells you what protection you need. A corrosive symbol means gloves and goggles; a flammable symbol means no flames nearby.",
              "Household products carry warnings too. Bleach, muriatic acid and insect spray all have warning labels. Read them at home as carefully as in the lab.",
              "Never use a substance from a container with no label or a torn label. Give it to your teacher.",
              "Older bottles may use orange squares with black symbols instead of red diamonds. The pictures mean the same thing.",
            ],
          },
        },

        {
          type: "timeline",
          heading: "If an Accident Happens",
          data: {
            intro:
              "Stay calm. These steps work for most lab accidents, such as a chemical splash, a small burn or broken glass.",
            steps: [
              {
                num: 1,
                title: "Stop and Tell Your Teacher",
                color: "primary",
                description:
                  "Stop what you are doing and tell your teacher right away. Say what happened and what substance was involved.",
                tip: "Never try to hide an accident, even a small one.",
              },
              {
                num: 2,
                title: "Chemical on Skin or in Eyes",
                color: "secondary",
                description:
                  "Rinse with plenty of clean running water for at least 15 minutes. Use the eyewash station or a faucet for the eyes, holding the eyelids open.",
                tip: "Keep rinsing even after it stops stinging.",
              },
              {
                num: 3,
                title: "Burns from Heat",
                color: "accent",
                description:
                  "Cool a small burn under cool running water for about 10 to 20 minutes. Do not put toothpaste, butter or ice on it.",
                tip: "Toothpaste and butter trap heat in the skin.",
              },
              {
                num: 4,
                title: "Broken Glass or a Spill",
                color: "primary",
                description:
                  "Keep everyone away from the area. Do not pick up broken glass with your hands. Let your teacher clean it up with a brush and dustpan, or with the right spill kit.",
                tip: "Warn others nearby so no one steps on it.",
              },
              {
                num: 5,
                title: "Fire",
                color: "secondary",
                description:
                  "Move away and tell your teacher. Your teacher may smother a small fire with a fire blanket or use the fire extinguisher. If the fire spreads, leave by the nearest exit as you practiced in fire drills.",
                tip: "Know where the exits, extinguisher and eyewash are before the lab starts.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "What Would You Do?",
          data: {
            intro:
              "Decide the safe, responsible action in each situation before reading the answer.",
            scenarios: [
              {
                title: "The Unlabeled Bottle",
                situation:
                  "Your group finds a bottle of clear liquid with no label on the shelf. A groupmate says it's probably just water.",
                question: "Should you use it? What should you do?",
                skill:
                  "No. Never use a substance from an unlabeled container, because it could be an acid, alcohol or anything else. Give it to your teacher.",
              },
              {
                title: "Flame and Alcohol",
                situation:
                  "An alcohol lamp is lit on your table. Your partner opens a bottle of rubbing alcohol right next to it to clean a slide.",
                question: "What hazard does this create, and what should be done?",
                skill:
                  "Rubbing alcohol is flammable, and its vapor can catch fire from the nearby flame. Put out the lamp with its cap first, or move the alcohol far away from the flame.",
              },
              {
                title: "The Corrosive Symbol",
                situation:
                  "The bottle you will use shows the corrosive symbol. You forgot your goggles at your seat, and the activity is starting.",
                question: "What should you do?",
                skill:
                  "Get your goggles and wear them, plus gloves, before touching the bottle. A corrosive substance can burn your eyes, so you can't skip protection, even for a minute.",
              },
              {
                title: "A Small Cut",
                situation:
                  "You cut your finger slightly on a chipped beaker. It doesn't hurt much, and you want to finish the activity.",
                question: "What is the responsible thing to do?",
                skill:
                  "Tell your teacher right away so the cut can be cleaned and covered. The chipped beaker must be removed so no one else gets hurt. Chemicals in a cut can also cause harm.",
              },
            ],
          },
        },

      ],
    },
  ],
};
