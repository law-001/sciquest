import React, { useState } from "react";
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

  const sections = lesson?.sections ?? [];

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
    <div className="min-h-screen" style={{ backgroundColor: "#fdf6e3" }}>
      {/* ── Sticky Header ── */}
      <div
        className="sticky top-0 z-30 backdrop-blur-md border-b border-orange-200/50"
        style={{ backgroundColor: "rgba(253, 246, 227, 0.9)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="bg-white/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
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
                      {s}
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

          {/* ── Main Content Column ── */}
          <div className="flex-1 min-w-0">
            {/* Title Block */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="primary" className="uppercase tracking-wider">
                  {lesson.badge}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 leading-tight">
                {lesson.title}
              </h1>
              <p className="text-xl text-stone-600 font-medium leading-relaxed">
                {lesson.subtitle}
              </p>
            </div>

            {/* Hero Image */}
            {lesson.heroImage && (
              <div className="rounded-3xl overflow-hidden shadow-card mb-12 border-4 border-white aspect-video relative">
                <img
                  src={lesson.heroImage}
                  alt={lesson.heroImageAlt ?? "Lesson image"}
                  className="w-full h-full object-cover"
                />
                {lesson.heroVideo && (
                  <div className="absolute inset-0 bg-linear-to-t from-stone-900/50 to-transparent flex items-end p-8">
                    <div className="flex items-center gap-4">
                      <button className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:scale-110 transition-transform shadow-lg">
                        <PlayCircle className="w-7 h-7" />
                      </button>
                      <div>
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
            <div className="space-y-16 text-lg text-stone-700 leading-relaxed font-medium">
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
