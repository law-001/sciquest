// Week 11: The Microscope — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 2nd term Week 11.
//   Lesson 1 — The Microscope: An Introduction
//   Lesson 2 — The Importance of Microscope Discovery

import microscope from "../assets/week1/Microscopic.jpg";
import simulation from "../assets/week1/simulation.jpg";
import lab from "../assets/lab.jpg";

export const week11 = {
  id: "week-11",
  weekNumber: 11,
  title: "The Microscope",
  category: "Life Science",
  description:
    "Meet the instrument that opened up the invisible world — its parts, how to use it correctly, and how its invention changed science forever.",
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
        "Learn the parts of a compound microscope, what each one does, how to calculate magnification, and how to prepare a slide correctly.",
      readTime: "~18 min read",
      xp: 50,
      heroImage: microscope,
      heroImageAlt: "Close-up view of a compound microscope",

      sections: [
        "Overview",
        "Key Terms",
        "Microscope Parts",
        "Using the Microscope Correctly",
        "Preparing a Wet Mount Slide",
        "Practical Scenarios",
        "Applications",
      ],

      references: [
        {
          label: "Britannica — Microscope",
          url: "https://www.britannica.com/technology/microscope",
        },
        {
          label: "Khan Academy — Microscopy",
          url: "https://www.khanacademy.org/science/biology/structure-of-a-cell",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "The <strong class='text-primary-700'>microscope</strong> is one of the most important instruments in science. It magnifies objects far too small for the naked eye — individual cells, bacteria, the structure of a leaf. Without it, biology as we know it could not exist.",
              "A <strong class='text-primary-700'>compound microscope</strong> uses two sets of lenses working together. The <strong class='text-primary-700'>eyepiece</strong> (usually 10×) is the lens you look through; the <strong class='text-primary-700'>objective lenses</strong> on the rotating nosepiece come in 4× (low), 10× (medium), and 40× (high). Total magnification is the two multiplied together — so 10 × 40 = <strong class='text-primary-700'>400×</strong>.",
            ],
            didYouKnow:
              "Antonie van Leeuwenhoek was the first person to see living microorganisms. He called them 'animalcules' — little animals — when he looked at pond water through his handcrafted lenses in the 1670s.",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Compound Microscope",
                desc: "A microscope that uses two or more lenses — an eyepiece and objective lenses — to produce a highly magnified image.",
              },
              {
                term: "Eyepiece (Ocular Lens)",
                desc: "The lens at the top that you look through. It typically magnifies 10 times.",
              },
              {
                term: "Objective Lens",
                desc: "The lens closest to the specimen, mounted on a revolving nosepiece. Common powers are 4×, 10×, and 40×.",
              },
              {
                term: "Magnification",
                desc: "How much larger the image appears. Total magnification = eyepiece power × objective power.",
              },
              {
                term: "Stage",
                desc: "The flat platform where the glass slide is placed. Stage clips hold it in position.",
              },
              {
                term: "Diaphragm",
                desc: "A rotating disc below the stage that controls how much light passes through the specimen, which changes contrast.",
              },
              {
                term: "Coarse Adjustment Knob",
                desc: "The large knob that moves the stage a long way for initial focusing. Used only at low power.",
              },
              {
                term: "Fine Adjustment Knob",
                desc: "The small knob that makes tiny focus adjustments. The only knob safe to use at high power.",
              },
              {
                term: "Wet Mount",
                desc: "A slide preparation where the specimen sits in a drop of water under a cover slip.",
              },
              {
                term: "Cover Slip",
                desc: "A thin square of glass placed over the specimen to protect it and hold it flat.",
              },
              {
                term: "Stain",
                desc: "A coloured solution added to increase contrast so cell structures become visible — iodine for plant cells, methylene blue for animal cells.",
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
                desc: "The eyepiece, arm, and body tube form the upper structure and hold the lenses at the correct distance apart.",
                image: microscope,
                imageAlt:
                  "Upper parts of a microscope including eyepiece and arm",
                examples: [
                  "Eyepiece (ocular lens) — 10× magnification",
                  "Arm — the part you grip when carrying it",
                  "Body tube — holds the lenses at the right separation",
                ],
              },
              {
                title: "Stage and Focus",
                label: "Middle Section",
                variant: "secondary",
                color: "secondary",
                desc: "The stage holds the slide while the focus knobs raise and lower it to bring the image into sharp view.",
                image: lab,
                imageAlt: "Stage area of a microscope with focus knobs",
                examples: [
                  "Stage — flat platform for the slide",
                  "Stage clips — hold the slide still",
                  "Coarse and fine adjustment knobs — focus the image",
                ],
              },
              {
                title: "Light Control",
                label: "Lower Section",
                variant: "primary",
                color: "primary",
                desc: "The light source and diaphragm control the brightness reaching the specimen, and the base supports everything.",
                image: simulation,
                imageAlt: "Light source and diaphragm of a microscope",
                examples: [
                  "Light source (or mirror) — illuminates the specimen",
                  "Diaphragm — regulates the amount of light",
                  "Base — supports the whole instrument",
                ],
              },
            ],
          },
        },

        {
          type: "reasonCards",
          heading: "Using the Microscope Correctly",
          data: {
            intro:
              "A microscope is delicate and expensive. These five rules protect both the instrument and your specimen — and every one of them exists because somebody once broke something.",
            reasons: [
              {
                num: 1,
                title: "Carry with Both Hands",
                color: "primary",
                desc: "One hand on the arm, one under the base",
                content:
                  "Carrying it one-handed risks dropping or tilting the microscope, which can damage the lenses or tip the eyepiece straight out of the tube.",
              },
              {
                num: 2,
                title: "Start with Low Power",
                color: "secondary",
                desc: "Always begin with the 4× objective",
                content:
                  "Low power gives the widest field of view, making it far easier to find the specimen. Starting at 40× usually means staring at an empty field.",
              },
              {
                num: 3,
                title: "Coarse Focus First, Watching from the Side",
                color: "accent",
                desc: "Use the coarse knob only at low power",
                content:
                  "Watch from the side as you raise the stage, so you can see how close the objective is to the slide before you ever look through the eyepiece.",
              },
              {
                num: 4,
                title: "Never Use Coarse Focus at High Power",
                color: "primary",
                desc: "At 40× the lens is millimetres from the glass",
                content:
                  "One turn of the coarse knob at high power can drive the objective through the slide, cracking the glass and scratching a lens that costs more than the rest of the microscope.",
              },
              {
                num: 5,
                title: "Clean Lenses with Lens Paper Only",
                color: "secondary",
                desc: "Never use tissue, cloth, or your shirt",
                content:
                  "Ordinary paper and fabric are abrasive enough to scratch the lens coating, permanently blurring every image the microscope will ever produce.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Preparing a Wet Mount Slide",
          data: {
            intro:
              "Before you can observe anything, you have to mount it. These six steps produce a clear, bubble-free slide.",
            steps: [
              {
                num: 1,
                title: "Clean the Slide",
                color: "primary",
                description:
                  "Wipe the glass slide with lens paper or a clean cloth to remove dust and fingerprints. A dirty slide ruins image quality before you start.",
                tip: "Handle the slide by its edges only.",
              },
              {
                num: 2,
                title: "Add a Drop of Water",
                color: "secondary",
                description:
                  "Place one small drop of clean water at the centre of the slide — about the size of a match head.",
                tip: "Too much water makes the specimen float and drift while you are trying to focus.",
              },
              {
                num: 3,
                title: "Place the Specimen",
                color: "accent",
                description:
                  "Using forceps or a toothpick, lay the specimen flat in the centre of the water drop. Onion skin and cheek cells are the classic school specimens.",
                tip: "The thinner the specimen, the more light passes through and the clearer the image.",
              },
              {
                num: 4,
                title: "Add a Stain if Needed",
                color: "primary",
                description:
                  "Place one drop of stain at the edge of the specimen — iodine for plant cells, methylene blue for animal cells. It will be drawn under the cover slip.",
                tip: "One drop only. Over-staining hides the very structures you are trying to see.",
              },
              {
                num: 5,
                title: "Lower the Cover Slip at an Angle",
                color: "secondary",
                description:
                  "Hold the cover slip at about 45°, touch its edge to the side of the water drop, then lower it slowly. This pushes air ahead of the liquid instead of trapping it.",
                tip: "Dropping it flat traps air bubbles, which appear as thick dark circles that hide the specimen.",
              },
              {
                num: 6,
                title: "Remove Excess Water",
                color: "accent",
                description:
                  "If water spills past the edges, touch a corner of tissue to the edge of the cover slip to draw it off. The slide is now ready.",
                tip: "Touch the edge, never the top — pressing on the cover slip can crush the specimen.",
              },
            ],
          },
        },

        {
          type: "scenario",
          heading: "Practical Scenarios",
          data: {
            intro:
              "Read each situation and work out what went wrong — or what the answer should be — before checking.",
            scenarios: [
              {
                title: "Wrong Focus Knob",
                situation:
                  "Maria is viewing a cheek cell slide at the 40× objective. The image is blurry, so she grabs the coarse adjustment knob and turns it quickly.",
                question:
                  "What mistake is Maria making, and what should she do instead?",
                skill:
                  "At high magnification only the fine adjustment knob should be used. The coarse knob at 40× risks cracking the slide and scratching the objective. She should use the fine knob to sharpen the image slowly.",
              },
              {
                title: "Switching to High Power Too Soon",
                situation:
                  "Carlos places a slide on the stage and immediately clicks the 40× objective into position without finding the specimen first.",
                question:
                  "Why is this a problem, and what should Carlos have done?",
                skill:
                  "He should have started at 4× to locate and centre the specimen. At high power the field of view is tiny, so finding anything is almost impossible — and the lens is dangerously close to the slide.",
              },
              {
                title: "Calculating Total Magnification",
                situation:
                  "A microscope has a 10× eyepiece. A student switches to the 40× objective to view a plant cell.",
                question: "What total magnification is the student seeing?",
                skill:
                  "Total magnification = eyepiece × objective = 10 × 40 = 400×. The plant cell appears 400 times its actual size.",
              },
              {
                title: "Dark Circles in the Field",
                situation:
                  "A student prepares a wet mount and sees several perfectly round dark-edged circles covering parts of the specimen.",
                question:
                  "What are these circles, and what step of the preparation caused them?",
                skill:
                  "Air bubbles, caused by lowering the cover slip flat instead of at a 45° angle. Redo the mount, touching the cover slip edge to the water first and lowering it slowly.",
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
                title: "Diagnosing Diseases",
                description:
                  "Medical laboratories examine blood and tissue under the microscope to identify malaria parasites, tuberculosis bacteria, and cancerous cells.",
                icon: "🩺",
                color: "border-l-primary-500",
              },
              {
                title: "Water Quality Testing",
                description:
                  "Scientists identify harmful microorganisms in drinking water, protecting public supplies from pathogens like giardia.",
                icon: "💧",
                color: "border-l-secondary-500",
              },
              {
                title: "Forensic Science",
                description:
                  "Investigators examine hair, fibres, and soil particles from crime scenes to link evidence to suspects.",
                icon: "🔎",
                color: "border-l-accent-500",
              },
              {
                title: "School Biology Labs",
                description:
                  "Preparing slides of onion skin and cheek cells lets you see cell structure with your own eyes, turning an abstract idea into an observation.",
                icon: "🔬",
                color: "border-l-primary-500",
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
        "Trace how the microscope was invented and improved — and how each improvement unlocked a discovery that changed what humans knew about life.",
      readTime: "~15 min read",
      xp: 50,
      heroImage: lab,
      heroImageAlt:
        "Historical microscope illustration representing scientific discovery",

      sections: [
        "Overview",
        "Key Terms",
        "Historical Milestones",
        "What the Microscope Made Possible",
        "Light vs. Electron Microscopes",
        "Applications",
      ],

      references: [
        {
          label: "Britannica — History of the Microscope",
          url: "https://www.britannica.com/technology/microscope/History-of-the-microscope",
        },
        {
          label: "Royal Society — Hooke's Micrographia",
          url: "https://royalsociety.org/",
        },
      ],

      layout: [
        {
          type: "intro",
          heading: "Overview",
          data: {
            paragraphs: [
              "For most of human history, the smallest thing anyone could study was the smallest thing they could see. Disease was blamed on bad air. Nobody knew what living things were built from. The invention of the microscope did not just improve science — it revealed an entire world that nobody had suspected existed.",
              "Each improvement in lens quality unlocked a new discovery. Better glass meant sharper images, sharper images meant smaller structures became visible, and smaller structures meant new questions. The <strong class='text-primary-700'>cell</strong>, <strong class='text-primary-700'>bacteria</strong>, and eventually the organelles inside cells were all found this way — each one waiting for an instrument good enough to show it.",
            ],
            didYouKnow:
              "Robert Hooke's 1665 book Micrographia was a bestseller. The diarist Samuel Pepys stayed up until two in the morning reading it and called it 'the most ingenious book that ever I read in my life.'",
          },
        },

        {
          type: "keyTerms",
          heading: "Key Terms",
          data: {
            terms: [
              {
                term: "Micrographia",
                desc: "Robert Hooke's 1665 book of microscope observations — the first major scientific work based on what a microscope revealed.",
              },
              {
                term: "Cell",
                desc: "The name Hooke gave to the box-like compartments he saw in cork, from the Latin 'cellula' meaning small room.",
              },
              {
                term: "Animalcules",
                desc: "Van Leeuwenhoek's name for the living microorganisms he was the first to observe — literally 'little animals'.",
              },
              {
                term: "Resolution",
                desc: "The ability of a microscope to show two close-together points as separate. Better resolution reveals finer detail, not just a bigger image.",
              },
              {
                term: "Electron Microscope",
                desc: "An instrument that uses a beam of electrons instead of light, reaching magnifications of up to two million times.",
              },
              {
                term: "Germ Theory",
                desc: "The understanding that many diseases are caused by microorganisms — an idea made possible only once microbes could be seen.",
              },
              {
                term: "Microbiology",
                desc: "The study of microorganisms, a branch of science that could not exist before the microscope.",
              },
            ],
          },
        },

        {
          type: "timeline",
          heading: "Historical Milestones",
          data: {
            intro:
              "The microscope was not invented by one person in one moment. It evolved across four centuries, and each step made a new kind of discovery possible.",
            steps: [
              {
                num: 1,
                title: "Zacharias Janssen — 1590s",
                color: "primary",
                description:
                  "Dutch spectacle-makers Hans and Zacharias Janssen built one of the first compound microscopes by placing two lenses in a tube. It magnified about 9 times — modest, but it proved that combining lenses multiplied their power.",
                tip: "The two-lens principle in that first tube is still the design used in every compound microscope today.",
              },
              {
                num: 2,
                title: "Robert Hooke — 1665",
                color: "secondary",
                description:
                  "English scientist Robert Hooke examined thin slices of cork and saw tiny box-like compartments. He named them 'cells' because they reminded him of the small rooms monks lived in. He published his drawings in Micrographia.",
                tip: "Hooke saw only empty cell walls in dead cork — he did not know cells were alive or what they did.",
              },
              {
                num: 3,
                title: "Antonie van Leeuwenhoek — 1670s",
                color: "accent",
                description:
                  "A Dutch cloth merchant, van Leeuwenhoek ground his own lenses to a quality nobody could match, reaching over 200×. He was the first human to see bacteria, protozoa, and blood cells, and is called the Father of Microbiology.",
                tip: "He kept his lens-grinding method secret, and it took over a century for others to match his images.",
              },
              {
                num: 4,
                title: "Schleiden, Schwann, and Virchow — 1838 to 1855",
                color: "primary",
                description:
                  "Improved achromatic lenses removed the colour blurring that had limited earlier microscopes. With clear images, Schleiden concluded all plants are made of cells, Schwann extended it to animals, and Virchow added that all cells come from existing cells.",
                tip: "Better lenses did not just show more — they made the cell theory possible. You will study it next week.",
              },
              {
                num: 5,
                title: "Louis Pasteur and Robert Koch — 1860s to 1880s",
                color: "secondary",
                description:
                  "Using microscopes, Pasteur and Koch showed that specific microorganisms cause specific diseases. Germ theory replaced centuries of guesswork, and led directly to sterilisation, vaccines, and antibiotics.",
                tip: "This is the microscope's greatest single consequence — it has saved more lives than any other instrument.",
              },
              {
                num: 6,
                title: "The Electron Microscope — 1930s to today",
                color: "accent",
                description:
                  "By replacing light with a beam of electrons, scientists broke through the limit set by the wavelength of visible light. Electron microscopes magnify up to two million times, revealing organelles, viruses, and individual molecules.",
                tip: "Electron microscopes cannot show living specimens — the preparation process kills the sample.",
              },
            ],
          },
        },

        {
          type: "conceptList",
          heading: "What the Microscope Made Possible",
          data: {
            concepts: [
              "The discovery of the cell — the realisation that every living thing is built from the same basic unit.",
              "The discovery of microorganisms — an entire kingdom of life nobody had known existed.",
              "Germ theory of disease — understanding that illness is caused by specific microbes, not bad air or bad luck.",
              "Sterilisation and antiseptic surgery — once surgeons could see that microbes existed, they began killing them before operating, and survival rates transformed.",
              "Vaccines and antibiotics — both depend on being able to identify and study the specific organism causing a disease.",
              "Modern cell biology and genetics — studying organelles, chromosomes, and cell division all require magnification.",
              "A general scientific lesson: a better instrument does not just confirm what we know, it reveals questions nobody thought to ask.",
            ],
          },
        },

        {
          type: "comparison",
          heading: "Light vs. Electron Microscopes",
          data: {
            intro:
              "Both are essential, and neither replaces the other. Which one a scientist reaches for depends entirely on the question being asked.",
            left: {
              label: "Light (Compound) Microscope",
              color: "primary",
              items: [
                "Uses visible light passing through the specimen",
                "Magnifies up to about 1,500×",
                "Can observe LIVING specimens moving in real time",
                "Shows natural colour, and stains add more",
                "Small, affordable, and found in every school laboratory",
              ],
            },
            right: {
              label: "Electron Microscope",
              color: "secondary",
              items: [
                "Uses a beam of electrons instead of light",
                "Magnifies up to about 2,000,000×",
                "Specimens must be dead — the preparation kills them",
                "Images are black and white; colour is added afterwards",
                "Very large and expensive, found only in research institutions",
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
                title: "Fighting Pandemics",
                description:
                  "Electron microscopes let scientists photograph a new virus within days of isolating it — the first step toward designing a vaccine against it.",
                icon: "🦠",
                color: "border-l-primary-500",
              },
              {
                title: "Materials Science",
                description:
                  "Engineers examine metal fractures and semiconductor chips at atomic scale to understand why a component failed.",
                icon: "🔩",
                color: "border-l-secondary-500",
              },
              {
                title: "Food Safety",
                description:
                  "Inspectors check food and water samples for bacterial contamination, preventing outbreaks before products reach shops.",
                icon: "🍽️",
                color: "border-l-accent-500",
              },
              {
                title: "Understanding Life Itself",
                description:
                  "Every fact you will learn about cells over the next six weeks was discovered by someone looking down a microscope.",
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
