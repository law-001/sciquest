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
import microscope from "../assets/Microscopic.jpg";
import globe from "../assets/globe.jpg";
import web from "../assets/web.jpg";
import equation from "../assets/equation.jpg";
import simulation from "../assets/simulation.jpg";

function LessonContentPage({ onBack, onComplete }) {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    "Introduction",
    "Key Terms",
    "Why Use Models",
    "Types of Models",
    "Concepts & Principles",
    "Applications",
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
                  Lesson 1
                </Badge>
                <Badge variant="primary" className="uppercase tracking-wider">
                  Lesson 2
                </Badge>
                <Badge variant="primary" className="uppercase tracking-wider">
                  Lesson 3
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 leading-tight">
                Uses of Scientific Models
              </h1>
              <p className="text-xl text-stone-600 font-medium leading-relaxed">
                Explore the world of scientific models and discover how
                scientists use them to understand things that cannot be easily
                seen or observed. In this lesson, you'll learn about the
                different types of models such as physical, conceptual, and
                mathematical, and how they help explain, predict, and explore
                real-world phenomena.
              </p>
            </div>

            {/* Hero Image */}
            <div className="rounded-3xl overflow-hidden shadow-card mb-12 border-4 border-white aspect-video relative">
              <img
                src={microscope}
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
                  Scientific models are{" "}
                  <strong className="text-primary-700">
                    simplified representations
                  </strong>{" "}
                  of real-world objects, systems, or processes. They help
                  scientists understand, explain, and predict natural phenomena
                  that are too small, too large, too fast, too slow, or too
                  dangerous to observe directly.
                </p>
                <p className="mb-4">
                  Models are important in science because they{" "}
                  <strong className="text-primary-700">
                    make complex ideas easier
                  </strong>{" "}
                  to study and communicate. They allow scientists to test ideas
                  safely, make predictions, and improve their understanding step
                  by step. Without models, many important discoveries in
                  physics, chemistry, biology, and Earth science would be much
                  more difficult.
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
                        The early atomic model by <strong>Niels Bohr</strong>{" "}
                        imagined electrons orbiting the nucleus like planets but
                        today, scientists know electrons actually move in
                        unpredictable “clouds,” not fixed paths!
                      </p>
                    </div>
                  </div>
                </Card>
              </section>

              <section id="section-1">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-secondary-500" />
                  </div>
                  Key Terms and Definitions
                </h2>

                <Card className="p-8 bg-secondary-50 border-secondary-200">
                  <ol className="space-y-5">
                    {[
                      {
                        term: "Scientific Model",
                        desc: "A simplified representation of a real object, system, or process that helps scientists explain how something works or predict what will happen.",
                      },
                      {
                        term: "Physical Model",
                        desc: "A three-dimensional, tangible object built to represent something in the real world, often at a different size (scale model).",
                      },
                      {
                        term: "Conceptual Model",
                        desc: "A mental or visual picture that shows the relationships between ideas or parts of a system, often drawn as diagrams or flowcharts.",
                      },
                      {
                        term: "Mathematical Model",
                        desc: "A model that uses mathematical equations and numbers to describe and predict the behavior of a system.",
                      },
                      {
                        term: "Simulation",
                        desc: "A computer-based model that imitates the operation of a real process or system over time, allowing scientists to run “what if” experiments safely.",
                      },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center shrink-0 text-secondary-800 font-black text-sm mt-3">
                          {i + 1}
                        </div>
                        <p className="text-secondary-800 text-base font-medium pt-1">
                          <span className="font-bold text-secondary-700">
                            {item.term}:
                          </span>{" "}
                          {item.desc}
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>
              </section>

              <section id="section-2">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                    <Dna className="w-5 h-5 text-accent-500" />
                  </div>
                  Why Scientists Use Models
                </h2>
                <p className="mb-6">
                  Many scientific phenomena cannot be observed directly. Atoms
                  are too small to see, climate systems are too large and
                  slow-changing, and some events (like volcanic eruptions or
                  spacecraft re-entry) are too dangerous to study in real time.
                  Scientists create models to:
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {/* Organelle Cards */}
                  {[
                    {
                      num: 1,
                      title: "Simplification",
                      color: "primary",
                      desc: "Simplify complex systems",
                      content: "e.g. Solar system diagram",
                    },
                    {
                      num: 2,
                      title: "Visualization",
                      color: "secondary",
                      desc: "Visualize things that cannot be seen",
                      content: "e.g. Atom model",
                    },
                    {
                      num: 3,
                      title: "Testing",
                      color: "accent",
                      desc: "Test ideas without risk",
                      content: "e.g. Volcano simulation",
                    },
                    {
                      num: 4,
                      title: "Predictions",
                      color: "primary",
                      desc: "Make predictions about the future",
                      content: "e.g. Weather forecast model",
                    },
                    {
                      num: 5,
                      title: "Communications",
                      color: "secondary",
                      desc: "Communicate ideas clearly to others",
                      content: "e.g. food chain diagram",
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

              {/* Section 1: Types of Cells */}
              <section id="section-3">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                    <Microscope className="w-5 h-5 text-secondary-500" />
                  </div>
                  Types of Scientific Models and Examples
                </h2>
                <p className="mb-6">
                  Exploring the Types of Scientific Models and Examples
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="overflow-hidden">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={globe}
                        alt="Microscopic view of cells"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />
                      <Badge
                        variant="primary"
                        className="absolute bottom-4 left-4"
                      >
                        Physical
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">
                        Physical Models
                      </h3>
                      <p className="text-stone-600 text-base mb-3">
                        These are actual objects that represent something else.
                      </p>
                      <p className="text-stone-500 text-sm italic">e.g.</p>
                      <ul className="space-y-2 text-base text-stone-600">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                          <span>A globe (model of Earth)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                          <span>
                            A model of the solar system with orbiting planets
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                          <span>
                            A scaled-down model of a bridge used by engineers to
                            test strength
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Card>

                  <Card className="overflow-hidden">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={web}
                        alt="Microscopic view of cells"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />
                      <Badge
                        variant="secondary"
                        className="absolute bottom-4 left-4"
                      >
                        Conceptual
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">
                        Concenptual Models
                      </h3>
                      <p className="text-stone-600 text-base mb-3">
                        These are diagrams or mental pictures that show how
                        parts of a system relate to one another.
                      </p>
                      <p className="text-stone-500 text-sm italic">e.g.</p>
                      <ul className="space-y-2 text-base text-stone-600">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-secondary-500 mt-1 shrink-0" />
                          <span>
                            The Bohr model of the atom (showing electrons
                            orbiting the nucleus)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-secondary-500 mt-1 shrink-0" />
                          <span>
                            Food web diagrams showing energy flow in an
                            ecosystem
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-secondary-500 mt-1 shrink-0" />
                          <span>The water cycle diagram</span>
                        </li>
                      </ul>
                    </div>
                  </Card>

                  <Card className="overflow-hidden">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={equation}
                        alt="Microscopic view of cells"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />
                      <Badge
                        variant="secondary"
                        className="absolute bottom-4 left-4"
                      >
                        Mathematical
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">
                        Mathematical Models
                      </h3>
                      <p className="text-stone-600 text-base mb-3">
                        These use equations to describe relationships and make
                        predictions.
                      </p>
                      <p className="text-stone-500 text-sm italic">e.g.</p>
                      <ul className="space-y-2 text-base text-stone-600">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-secondary-500 mt-1 shrink-0" />
                          <span>
                            Newton’s laws of motion expressed as equations
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-secondary-500 mt-1 shrink-0" />
                          <span>Population growth models in biology</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-secondary-500 mt-1 shrink-0" />
                          <span>
                            Equations used to calculate the trajectory of a
                            rocket
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Card>

                  <Card className="overflow-hidden">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={simulation}
                        alt="Microscopic view of cells"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />
                      <Badge
                        variant="primary"
                        className="absolute bottom-4 left-4"
                      >
                        Simulation
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">
                        Simulation Models
                      </h3>
                      <p className="text-stone-600 text-base mb-3">
                        Computer programs that imitate real processes.
                      </p>
                      <p className="text-stone-500 text-sm italic">e.g.</p>
                      <ul className="space-y-2 text-base text-stone-600">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                          <span>Weather simulation programs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                          <span>Flight simulators used to train pilots</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                          <span>
                            Molecular dynamics simulations that show how
                            medicines interact with viruses
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </section>

              <section id="section-4">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-secondary-500" />
                  </div>
                  Concepts and Principles
                </h2>

                <Card className="p-8 bg-secondary-50 border-secondary-200">
                  <ol className="space-y-4">
                    {[
                      "All scientific models are simplifications; they are not perfect copies of reality.",
                      "Good models are useful even if they are not 100% accurate.",
                      "Models can be improved or replaced when new evidence appears (e.g., atomic models changed from Dalton’s solid sphere to the modern electron cloud model).",
                      "Models help scientists understand unseen phenomena by representing invisible things (such as atoms, gravity, or magnetic fields) in ways we can see, draw, or calculate.",
                      "Models allow scientists to make predictions and test them through experiments or observations.",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center shrink-0 text-secondary-800 font-black text-sm ">
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

                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      title: "Weather Forecasting:",
                      description:
                        "Scientists use computer models to predict future weather.",
                      icon: "☀️",
                      color: "border-l-primary-500",
                    },
                    {
                      title: "Atomic Models",
                      description: "Help explain how atoms behave and react.",
                      icon: "⚛︎",
                      color: "border-l-secondary-500",
                    },
                    {
                      title: "Climate Models",
                      description: "Used to study and predict climate change.",
                      icon: "☁️",
                      color: "border-l-accent-500",
                    },
                    {
                      title: "Engineering Designs",
                      description:
                        "Used to test buildings, cars, and aircraft before building them.",
                      icon: "🏢",
                      color: "border-l-primary-500",
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
              </section>

              {/* Section 6: Key Takeaways */}
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

// ADD THIS AT THE END OF THE FILE
export default LessonContentPage;
