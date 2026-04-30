import React, { useState } from "react";
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Star,
  Lightbulb,
  FlaskConical,
  Microscope,
  Dna,
  AlertTriangle,
  ChevronRight,
  Clock,
  Award,
} from "lucide-react";

import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";

export function LessonContentPage({ onBack, onComplete }) {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    "Introduction",
    "Types of Cells",
    "Cell Organelles",
    "Cell Processes",
    "Plant vs Animal Cells",
    "Real-World Applications",
    "Key Takeaways",
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fdf6e3" }}>
      {/* Sticky Lesson Header */}
      <div
        className="sticky top-0 z-30 backdrop-blur-md border-b border-orange-200/50 shadow-warm"
        style={{ backgroundColor: "rgba(253, 246, 227, 0.9)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-stone-500 hover:text-primary-600 font-bold transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lessons
            </button>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-500">
                <Clock className="w-4 h-4" />
                ~15 min read
              </div>
              <Badge
                variant="accent"
                icon={<Star className="w-3 h-3 fill-current" />}
              >
                +75 XP
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Table of Contents — desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <Card className="p-4">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  Contents
                </p>
                <nav className="space-y-1">
                  {sections.map((section, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveSection(i);
                        document
                          .getElementById(`section-${i}`)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                        activeSection === i
                          ? "bg-primary-50 text-primary-700"
                          : "text-stone-500 hover:text-primary-600 hover:bg-orange-50"
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </nav>
                <div className="mt-4 pt-4 border-t border-orange-100">
                  <ProgressBar
                    progress={Math.round(
                      ((activeSection + 1) / sections.length) * 100,
                    )}
                    color="secondary"
                    size="sm"
                    showLabel
                  />
                </div>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Lesson Title */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="primary" className="uppercase tracking-wider">
                  Biology
                </Badge>
                <Badge variant="outline">Grade 7</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 leading-tight">
                The Cell Structure: Building Blocks of Life
              </h1>
              <p className="text-xl text-stone-600 font-medium leading-relaxed">
                Explore the microscopic world of cells and discover the
                fascinating organelles that keep living things alive. In this
                lesson, you'll learn about the different types of cells, their
                structures, and how they work together to sustain life.
              </p>
            </div>

            {/* Hero Image */}
            <div className="rounded-3xl overflow-hidden shadow-card mb-12 border-4 border-white aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1200"
                alt="Microscopic view of cells"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-900/50 to-transparent flex items-end p-8">
                <div className="flex items-center gap-4">
                  <button className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:scale-110 transition-transform shadow-lg">
                    <PlayCircle className="w-7 h-7" />
                  </button>
                  <div>
                    <p className="text-white font-bold text-lg">
                      Watch Introduction Video
                    </p>
                    <p className="text-white/70 text-sm">
                      3 min overview of cell biology
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-16 text-lg text-stone-700 leading-relaxed font-medium">
              {/* Section 0: Introduction */}
              <section id="section-0">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                  </div>
                  Introduction
                </h2>
                <p className="mb-4">
                  Imagine a bustling city with power plants, factories, and a
                  command center. That's exactly what a cell is like! Cells are
                  the{" "}
                  <strong className="text-primary-700">
                    basic building blocks of all living things
                  </strong>
                  . The human body is composed of trillions of cells, each
                  performing specific tasks to keep you alive and healthy.
                </p>
                <p className="mb-4">
                  They provide structure for the body, take in nutrients from
                  food, convert those nutrients into energy, and carry out
                  specialized functions. Some cells fight infections, others
                  carry oxygen, and some transmit electrical signals in your
                  brain.
                </p>

                <Card className="p-6 bg-secondary-50 border-secondary-200 mt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary-800 mb-1">
                        Did You Know?
                      </h4>
                      <p className="text-secondary-700 text-base">
                        The human body contains approximately{" "}
                        <strong>37.2 trillion cells</strong>! If you could line
                        up all the cells in your body end to end, they would
                        stretch around the Earth about 4.5 times.
                      </p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Section 1: Types of Cells */}
              <section id="section-1">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                    <Microscope className="w-5 h-5 text-secondary-500" />
                  </div>
                  Types of Cells
                </h2>
                <p className="mb-6">
                  All living organisms are made up of cells, but not all cells
                  are the same. There are two main categories of cells based on
                  their structure:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="overflow-hidden">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600"
                        alt="Prokaryotic cell illustration"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />
                      <Badge
                        variant="primary"
                        className="absolute bottom-4 left-4"
                      >
                        Prokaryotic
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">
                        Prokaryotic Cells
                      </h3>
                      <p className="text-stone-600 text-base mb-3">
                        Simple cells <strong>without a nucleus</strong>. Their
                        DNA floats freely in the cytoplasm. These are the oldest
                        type of cells on Earth.
                      </p>
                      <ul className="space-y-2 text-base text-stone-600">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                          <span>Found in bacteria and archaea</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                          <span>Very small (1-10 micrometers)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                          <span>No membrane-bound organelles</span>
                        </li>
                      </ul>
                    </div>
                  </Card>

                  <Card className="overflow-hidden">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=600"
                        alt="Eukaryotic cell illustration"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />
                      <Badge
                        variant="secondary"
                        className="absolute bottom-4 left-4"
                      >
                        Eukaryotic
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">
                        Eukaryotic Cells
                      </h3>
                      <p className="text-stone-600 text-base mb-3">
                        Complex cells <strong>with a true nucleus</strong> that
                        houses the DNA. These make up all plants, animals,
                        fungi, and protists.
                      </p>
                      <ul className="space-y-2 text-base text-stone-600">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-secondary-500 mt-1 shrink-0" />
                          <span>Found in animals, plants, fungi</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-secondary-500 mt-1 shrink-0" />
                          <span>Larger (10-100 micrometers)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-secondary-500 mt-1 shrink-0" />
                          <span>Contains membrane-bound organelles</span>
                        </li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </section>

              {/* Section 2: Cell Organelles */}
              <section id="section-2">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                    <Dna className="w-5 h-5 text-accent-500" />
                  </div>
                  Cell Organelles
                </h2>
                <p className="mb-6">
                  Think of organelles as the "organs" of a cell. Each one has a
                  specific job that keeps the cell alive and functioning. Let's
                  explore the most important ones:
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {/* Organelle Cards */}
                  {[
                    {
                      num: 1,
                      title: "The Nucleus",
                      color: "primary",
                      desc: "The command center of the cell...",
                      content: "Contains: DNA, nucleolus, nuclear membrane",
                    },
                    {
                      num: 2,
                      title: "Mitochondria",
                      color: "secondary",
                      desc: "The powerhouses of the cell...",
                      content:
                        "Function: Cellular respiration, energy production",
                    },
                    {
                      num: 3,
                      title: "Cell Membrane",
                      color: "accent",
                      desc: "The city wall...",
                      content: "Made of: Phospholipid bilayer with proteins",
                    },
                    {
                      num: 4,
                      title: "Ribosomes",
                      color: "blue",
                      desc: "The factories...",
                      content: "Location: Free in cytoplasm or on rough ER",
                    },
                    {
                      num: 5,
                      title: "Endoplasmic Reticulum",
                      color: "purple",
                      desc: "The highway system...",
                      content:
                        "Types: Rough ER (protein transport), Smooth ER (lipid synthesis)",
                    },
                    {
                      num: 6,
                      title: "Golgi Apparatus",
                      color: "pink",
                      desc: "The post office...",
                      content:
                        "Function: Sorting, packaging, and distributing molecules",
                    },
                  ].map((item, i) => (
                    <Card
                      key={i}
                      className={`p-6 border-l-4 border-l-${item.color}-500`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-8 h-8 rounded-lg bg-${item.color}-50 flex items-center justify-center text-${item.color}-500 font-black text-sm`}
                        >
                          {item.num}
                        </div>
                        <h3 className="text-xl font-bold text-stone-900">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-stone-600 text-base mb-3">
                        {item.desc}
                      </p>
                      <p className="text-stone-500 text-sm italic">
                        {item.content}
                      </p>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Section 3: Cell Processes */}
              <section id="section-3">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-primary-500" />
                  </div>
                  Cell Processes
                </h2>
                <p className="mb-6">
                  Cells are not just static structures — they are constantly
                  busy performing essential life processes. Here are the key
                  processes that keep cells (and you!) alive:
                </p>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-2/5 aspect-4/3 rounded-2xl overflow-hidden shadow-md border-4 border-white">
                      <img
                        src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600"
                        alt="Cellular respiration concept"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">
                        Cellular Respiration
                      </h3>
                      <p className="text-base text-stone-600 mb-3">
                        This is how cells convert{" "}
                        <strong>
                          glucose (sugar) and oxygen into energy (ATP)
                        </strong>
                        . It happens primarily in the mitochondria and is
                        essential for all cell activities.
                      </p>
                      <Card className="p-4 bg-orange-50 border-orange-100">
                        <p className="text-sm font-bold text-stone-700 font-heading">
                          Formula:
                        </p>
                        <p className="text-base text-primary-700 font-bold mt-1">
                          C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP)
                        </p>
                      </Card>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
                    <div className="w-full md:w-2/5 aspect-4/3 rounded-2xl overflow-hidden shadow-md border-4 border-white">
                      <img
                        src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600"
                        alt="Photosynthesis in plants"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">
                        Photosynthesis
                      </h3>
                      <p className="text-base text-stone-600 mb-3">
                        The process by which{" "}
                        <strong>
                          plant cells use sunlight to convert carbon dioxide and
                          water into glucose and oxygen
                        </strong>
                        . This happens in the chloroplasts.
                      </p>
                      <Card className="p-4 bg-secondary-50 border-secondary-100">
                        <p className="text-sm font-bold text-stone-700 font-heading">
                          Formula:
                        </p>
                        <p className="text-base text-secondary-700 font-bold mt-1">
                          6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
                        </p>
                      </Card>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-2/5 aspect-4/3 rounded-2xl overflow-hidden shadow-md border-4 border-white">
                      <img
                        src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600"
                        alt="Cell division concept"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">
                        Cell Division (Mitosis)
                      </h3>
                      <p className="text-base text-stone-600 mb-3">
                        The process by which a single cell divides into{" "}
                        <strong>two identical daughter cells</strong>. This is
                        how organisms grow, repair damaged tissue, and replace
                        old cells.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {["Prophase", "Metaphase", "Anaphase", "Telophase"].map(
                          (phase) => (
                            <Badge
                              key={phase}
                              variant="outline"
                              className="text-xs"
                            >
                              {phase}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Plant vs Animal Cells */}
              <section id="section-4">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                    <Dna className="w-5 h-5 text-secondary-500" />
                  </div>
                  Plant vs Animal Cells
                </h2>
                <p className="mb-6">
                  While plant and animal cells share many organelles, there are
                  some key differences that set them apart:
                </p>

                <Card className="overflow-hidden mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-stone-50 border-b border-orange-100">
                          <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Feature
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Plant Cell
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Animal Cell
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-100 text-base">
                        {[
                          ["Cell Wall", "Present (rigid)", "Absent"],
                          [
                            "Chloroplasts",
                            "Present (for photosynthesis)",
                            "Absent",
                          ],
                          [
                            "Vacuole",
                            "One large central vacuole",
                            "Small or multiple",
                          ],
                          [
                            "Shape",
                            "Fixed rectangular shape",
                            "Irregular / round shape",
                          ],
                          ["Centrioles", "Absent (in most)", "Present"],
                          [
                            "Energy Source",
                            "Sunlight (photosynthesis)",
                            "Food (cellular respiration)",
                          ],
                        ].map(([feature, plant, animal], i) => (
                          <tr
                            key={i}
                            className="hover:bg-orange-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-stone-900">
                              {feature}
                            </td>
                            <td className="px-6 py-4 text-secondary-700">
                              {plant}
                            </td>
                            <td className="px-6 py-4 text-primary-700">
                              {animal}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-stone-900 mb-3">
                        🌿 Why Do Plant Cells Have a Cell Wall?
                      </h3>
                      <p className="text-base text-stone-600 mb-3">
                        Think of a plant leaf. When you look at it under a
                        microscope, you'll see thousands of tiny green boxes.
                        These are plant cells!
                      </p>
                      <p className="text-base text-stone-600">
                        Unlike animal cells, plant cells have a rigid{" "}
                        <strong>cell wall</strong> made of cellulose that
                        provides structural support. This is why plants can
                        stand upright without a skeleton! They also have{" "}
                        <strong>chloroplasts</strong> — green organelles that
                        let them make their own food using sunlight through
                        photosynthesis.
                      </p>
                    </div>
                    <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-md border-4 border-white shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600"
                        alt="Plant leaf close up"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: Real-World Applications */}
              <section id="section-5">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-accent-500" />
                  </div>
                  Real-World Applications
                </h2>
                <p className="mb-6">
                  Understanding cell biology isn't just for textbooks — it has
                  real-world applications that affect our daily lives:
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      title: "Medicine & Health",
                      description:
                        "Understanding how cells work helps doctors develop treatments for diseases like cancer, where cells divide uncontrollably.",
                      icon: "🏥",
                      color: "border-l-primary-500",
                    },
                    {
                      title: "Agriculture",
                      description:
                        "Knowledge of plant cells helps scientists develop crops that are more resistant to disease and produce higher yields.",
                      icon: "🌾",
                      color: "border-l-secondary-500",
                    },
                    {
                      title: "Biotechnology",
                      description:
                        "Scientists can modify cells to produce insulin, create biofuels, and even grow artificial organs for transplants.",
                      icon: "🧬",
                      color: "border-l-accent-500",
                    },
                  ].map((app, i) => (
                    <Card key={i} className={`p-6 border-l-4 ${app.color}`}>
                      <span className="text-3xl mb-3 block">{app.icon}</span>
                      <h3 className="text-lg font-bold text-stone-900 mb-2">
                        {app.title}
                      </h3>
                      <p className="text-stone-600 text-base">
                        {app.description}
                      </p>
                    </Card>
                  ))}
                </div>

                <Card className="p-6 bg-primary-50 border-primary-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-800 mb-1">
                        Think About It!
                      </h4>
                      <p className="text-primary-700 text-base">
                        When you get a cut, your body immediately starts
                        repairing the damage through cell division. White blood
                        cells rush to the wound to fight infection, while skin
                        cells divide rapidly to close the gap. All of this
                        happens automatically thanks to the incredible machinery
                        inside your cells!
                      </p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Section 6: Key Takeaways */}
              <section id="section-6">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-secondary-500" />
                  </div>
                  Key Takeaways
                </h2>

                <Card className="p-8 bg-secondary-50 border-secondary-200">
                  <ol className="space-y-4">
                    {[
                      "Cells are the basic building blocks of all living things.",
                      "There are two main types: prokaryotic (no nucleus) and eukaryotic (with nucleus).",
                      "Key organelles include the nucleus, mitochondria, cell membrane, ribosomes, ER, and Golgi apparatus.",
                      "Cellular respiration converts glucose + oxygen into energy (ATP).",
                      "Photosynthesis (in plants) converts sunlight + CO₂ + water into glucose + oxygen.",
                      "Plant cells differ from animal cells by having a cell wall, chloroplasts, and a large central vacuole.",
                      "Cell division (mitosis) allows organisms to grow and repair damaged tissue.",
                      "Cell biology has real-world applications in medicine, agriculture, and biotechnology.",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center shrink-0 text-secondary-800 font-black text-sm">
                          {i + 1}
                        </div>
                        <p className="text-secondary-800 text-base font-medium pt-1">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>
              </section>
            </div>

            {/* Completion Action */}
            <div className="mt-16 pt-8 border-t border-orange-200">
              <Card className="p-8 text-center bg-white">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-2">
                  Ready to test your knowledge?
                </h3>
                <p className="text-stone-500 mb-8 max-w-md mx-auto">
                  You've completed the lesson! Take the quiz to earn your XP and
                  unlock the next lesson.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    onClick={onComplete}
                    rightIcon={<CheckCircle2 className="w-5 h-5" />}
                    className="px-12"
                  >
                    Complete Lesson & Start Quiz
                  </Button>
                  <Button size="lg" variant="outline" onClick={onBack}>
                    Back to Lessons
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
