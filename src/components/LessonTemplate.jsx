import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  Star,
  Clock,
  Lock,
} from "lucide-react";
import Button from "./Button";
import Card from "./Card";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import { cn } from "../lib/utils";

// ── Slot imports ──
import {
  IntroSection,
  KeyTermsSection,
  ReasonCardsSection,
  ImageCardsSection,
  ConceptListSection,
  ApplicationsSection,
  TimelineSection,
  ComparisonSection,
  ScenarioSection,
  DiagramSection,
} from "./lesson-slots";

// ── SLOT_MAP: maps type strings → components ──
const SLOT_MAP = {
  intro: IntroSection,
  keyTerms: KeyTermsSection,
  reasonCards: ReasonCardsSection,
  imageCards: ImageCardsSection,
  conceptList: ConceptListSection,
  applications: ApplicationsSection,
  timeline: TimelineSection,
  comparison: ComparisonSection,
  scenario: ScenarioSection,
  diagram: DiagramSection,
};

export function LessonTemplate({
  lesson,
  weekLessons = [],
  activeLessonId,
  completedLessons = [],
  reachedLessons = [],
  onBack,
  onComplete,
  onLessonSelect,
}) {
  const [activeSection, setActiveSection] = useState(0);
  const [prevLessonId, setPrevLessonId] = useState(lesson?.id);
  const [titleVisible, setTitleVisible] = useState(false);
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reset section position when switching lessons (render-phase reset)
  if (lesson?.id !== prevLessonId) {
    setPrevLessonId(lesson?.id);
    setActiveSection(0);
  }

  useEffect(() => {
    const t = setTimeout(() => setTitleVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setScrollProgress(0);
  }, [lesson?.id]);

  useEffect(() => {
    let rafId = null;
    const getOffsetTop = (el) => {
      let top = 0;
      let node = el;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent;
      }
      return top;
    };
    const update = () => {
      rafId = null;
      const startEl = document.getElementById("section-0");
      const endEl = document.getElementById("lesson-cta");
      if (!startEl || !endEl) {
        setScrollProgress(0);
        return;
      }
      const headerOffset = 72;
      const startY = getOffsetTop(startEl) - headerOffset;
      const endY = getOffsetTop(endEl) - window.innerHeight;
      const range = endY - startY;
      if (range <= 0) {
        setScrollProgress(0);
      } else {
        const pct = ((window.scrollY - startY) / range) * 100;
        setScrollProgress(Math.max(0, Math.min(100, Math.round(pct))));
      }

      // Sync active section with scroll position
      let current = 0;
      for (let i = 0; ; i++) {
        const el = document.getElementById(`section-${i}`);
        if (!el) break;
        const top = getOffsetTop(el) - headerOffset;
        if (window.scrollY + 1 >= top) current = i;
        else break;
      }
      setActiveSection(current);
    };
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [lesson?.id]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeroVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const sections = lesson?.sections ?? [];

  const scrollToSection = (i) => {
    setActiveSection(i);
    const el = document.getElementById(`section-${i}`);
    if (!el) return;
    const headerOffset = 72;
    let top = 0;
    let node = el;
    while (node) {
      top += node.offsetTop;
      node = node.offsetParent;
    }
    window.scrollTo({ top: top - headerOffset, behavior: "smooth" });
  };

  useEffect(() => {
    if (sections.length === 0) return;
    const handleKey = (e) => {
      if (e.key !== "Enter") return;
      const t = e.target;
      // Skip when typing in inputs or editable content
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        t instanceof HTMLSelectElement ||
        (t instanceof HTMLElement && t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setActiveSection((curr) => {
        const lastIndex = sections.length - 1;
        // At the final section, Enter scrolls to the completion CTA.
        const targetId =
          curr === lastIndex ? "lesson-cta" : `section-${curr + 1}`;
        requestAnimationFrame(() => {
          const el = document.getElementById(targetId);
          if (!el) return;
          const headerOffset = 72;
          let top = 0;
          let node = el;
          while (node) {
            top += node.offsetTop;
            node = node.offsetParent;
          }
          window.scrollTo({ top: top - headerOffset, behavior: "smooth" });
        });
        return Math.min(curr + 1, lastIndex);
      });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sections.length]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-black text-stone-700">Lesson not found.</p>
        <Button onClick={onBack} variant="outline">
          ← Back to Lessons
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-stone-900">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-30 backdrop-blur-md border-b border-orange-200/50 dark:border-stone-700 bg-[#fdf6e3]/90 dark:bg-stone-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-stone-500 hover:text-primary-600 font-bold transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Lessons
            </button>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-500">
                <Clock className="w-4 h-4" /> {lesson.readTime}
              </div>
              <Badge
                variant="accent"
                icon={<Star className="w-3 h-3 fill-current" />}
              >
                +{lesson.xp} XP
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lesson Tab Nav ── */}
      {weekLessons.length > 0 && (
        <div className="bg-white/80 dark:bg-stone-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-3 py-2">
              {weekLessons.map((l) => {
                const isActive = l.id === activeLessonId;
                const isDone = completedLessons.includes(l.id);
                const isReached = reachedLessons.includes(l.id);
                const isLocked = false;
                const isClickable = true;

                return (
                  <button
                    key={l.id}
                    onClick={() => isClickable && onLessonSelect?.(l.id)}
                    disabled={isLocked}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all",
                      isActive
                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                        : isDone
                          ? "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-700 cursor-pointer"
                          : isReached
                            ? "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-700 cursor-pointer"
                            : "text-stone-300 cursor-not-allowed",
                    )}
                  >
                    {isDone && !isActive && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {isLocked && <Lock className="w-4 h-4" />}
                    {l.badge}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Page Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar TOC ── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <Card className="p-4">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  Contents
                </p>
                <nav className="space-y-1">
                  {sections.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToSection(i)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                        activeSection === i
                          ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                          : "text-stone-500 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-orange-50 dark:hover:bg-stone-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </nav>
                <div className="mt-4 pt-4 border-t border-orange-100 dark:border-stone-700">
                  <ProgressBar
                    progress={scrollProgress}
                    color="secondary"
                    size="sm"
                    showLabel
                  />
                </div>
              </Card>
            </div>
          </aside>

          {/* ── Main Content Column ── */}
          <div className="flex-1 min-w-0">
            {/* Title Block */}
            <div className="mb-10">
              <div
                className="flex items-center gap-3 mb-4"
                style={{
                  opacity: titleVisible ? 1 : 0,
                  transform: titleVisible
                    ? "translateY(0)"
                    : "translateY(16px)",
                  transition: "opacity 0.5s ease 0ms, transform 0.5s ease 0ms",
                }}
              >
                <Badge
                  variant="primary"
                  className="uppercase tracking-wider transition-transform duration-300 hover:scale-105"
                >
                  {lesson.badge}
                </Badge>
              </div>
              <h1
                className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white mb-4 leading-tight"
                style={{
                  opacity: titleVisible ? 1 : 0,
                  transform: titleVisible
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transition:
                    "opacity 0.55s ease 80ms, transform 0.55s ease 80ms",
                }}
              >
                {lesson.title}
              </h1>
              <p
                className="text-xl text-stone-600 dark:text-stone-300 font-medium leading-relaxed"
                style={{
                  opacity: titleVisible ? 1 : 0,
                  transform: titleVisible
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transition:
                    "opacity 0.55s ease 180ms, transform 0.55s ease 180ms",
                }}
              >
                {lesson.subtitle}
              </p>
            </div>

            {/* Hero Image */}
            {lesson.heroImage && (
              <div
                ref={heroRef}
                className="group rounded-3xl overflow-hidden shadow-card mb-12 border-4 border-white aspect-video relative transition-shadow duration-300 hover:shadow-2xl"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible
                    ? "translateY(0) scale(1)"
                    : "translateY(24px) scale(0.98)",
                  transition:
                    "opacity 0.6s ease 260ms, transform 0.6s ease 260ms",
                }}
              >
                <img
                  src={lesson.heroImage}
                  alt={lesson.heroImageAlt ?? "Lesson image"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {lesson.heroVideo && (
                  <div className="absolute inset-0 bg-linear-to-t from-stone-900/50 to-transparent flex items-end p-8 transition-opacity duration-300 group-hover:from-stone-900/60">
                    <div className="flex items-center gap-4">
                      <button className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:scale-110 hover:bg-white transition-all duration-200 shadow-lg">
                        <PlayCircle className="w-7 h-7" />
                      </button>
                      <div
                        style={{
                          opacity: heroVisible ? 1 : 0,
                          transform: heroVisible
                            ? "translateX(0)"
                            : "translateX(-12px)",
                          transition:
                            "opacity 0.5s ease 400ms, transform 0.5s ease 400ms",
                        }}
                      >
                        <p className="text-white font-bold text-lg">
                          {lesson.heroVideo.label}
                        </p>
                        <p className="text-white/70 text-sm">
                          {lesson.heroVideo.sublabel}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Dynamic Content Sections (SLOT_MAP) ── */}
            <div className="space-y-16 text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              {lesson.layout.map((slot, i) => {
                const Component = SLOT_MAP[slot.type];
                if (!Component) return null;
                return (
                  <Component
                    key={i}
                    id={`section-${i}`}
                    heading={slot.heading}
                    data={slot.data}
                  />
                );
              })}
            </div>

            {/* Completion CTA */}
            <div
              id="lesson-cta"
              className="mt-16 pt-8 border-t border-orange-200 dark:border-stone-700"
            >
              <Card className="p-8 text-center bg-white">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-2 dark:text-stone-100">
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
