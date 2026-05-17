import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Play,
  Lock,
  Star,
  Globe2,
  Dna,
  ChevronRight,
  CheckCircle2,
  LogIn,
  Shapes,
  Atom,
  Thermometer,
  FlaskConical,
  Ruler,
  Droplets,
  TestTube,
  FlaskRound,
  ShieldCheck,
  ShieldAlert,
  ScanSearch,
  BookOpen,
  CircleDot,
  Leaf,
  Copy,
  Shuffle,
  Heart,
  GitCompare,
  Network,
  Zap,
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import Badge from "../components/Badge";
import { WEEKS_DATA } from "../data/lessonsweek-01";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { xpToNextLevel, levelFromXp } from "../lib/xp-config";

const ICON_MAP = {
  Shapes, // 1. Scientific Models
  Atom, // 2. Particle Model of Matter
  Thermometer, // 3. Changes in State of Matter
  FlaskConical, // 4. Scientific Investigation
  Ruler, // 5. Measurement in Space
  Droplets, // 6. Solutions and Solubility
  TestTube, // 7. Concentration of Solutions
  FlaskRound, // 8. Acids, Bases and Salts
  ShieldCheck, // 9. Laboratory Equipment
  ShieldAlert, // 10. Laboratory Safety
  ScanSearch, // 11. The Microscope
  BookOpen, // 12. Cell Theory
  CircleDot, // 13. Cell Parts and Functions
  Leaf, // 14. Plant and Animal Cells
  Copy, // 15. Cell Reproduction: Mitosis
  Shuffle, // 16. Cell Reproduction: Meiosis
  Heart, // 17. Fertilization and Reproduction
  GitCompare, // 18. Types of Reproduction Compared
  Network, // 19. Food Chains and Food Webs
  Zap, // 20. Energy Flow and Biological Organization
};

function useScrollTrigger(threshold = 0.1) {
  const [el, setEl] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const ref = useCallback((node) => setEl(node), []);
  useEffect(() => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);
  return [ref, triggered];
}

export function LessonsPage({
  onStartWeek,
  completedLessons = [],
  totalXp = 0,
  isLoggedIn,
  onLoginClick,
}) {
  const level = levelFromXp(totalXp);
  const levelProgress = xpToNextLevel(totalXp);
  const { user, profile } = useAuth();
  const firstName =
    profile?.first_name || user?.user_metadata?.first_name || "";
  const [mounted, setMounted] = useState(false);
  const [cardsRef, cardsTriggered] = useScrollTrigger(0.05);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const categories = [
    "All Topics",
    "1st Quarter",
    "2nd Quarter",
    "3rd Quarter",
    "4th Quarter", // ← fixed the typo/missing space from your original
  ];

  const QUARTER_RANGES = {
    "1st Quarter": { min: 1, max: 10 },
    "2nd Quarter": { min: 11, max: 20 },
    "3rd Quarter": { min: 21, max: 30 },
    "4th Quarter": { min: 31, max: 40 },
  };
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredWeeks = useMemo(() => {
    if (activeCategory === "All Topics") return WEEKS_DATA;
    const range = QUARTER_RANGES[activeCategory];
    if (!range) return WEEKS_DATA;
    return WEEKS_DATA.filter((week) => {
      const num = parseInt(week.id.replace(/\D/g, ""), 10);
      return num >= range.min && num <= range.max;
    });
  }, [activeCategory]);

  const displayedWeeks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredWeeks;
    return filteredWeeks.filter(
      (week) =>
        week.title?.toLowerCase().includes(q) ||
        week.description?.toLowerCase().includes(q) ||
        week.category?.toLowerCase().includes(q) ||
        String(week.weekNumber).includes(q) ||
        `week ${week.weekNumber}`.includes(q) ||
        week.lessons?.some((l) => l.title?.toLowerCase().includes(q)),
    );
  }, [filteredWeeks, searchQuery]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50/60 dark:bg-stone-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-primary-500" />
          </div>
          <h2 className="text-3xl font-black text-stone-900 dark:text-white mb-3">
            Sign in to access lessons
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mb-8">
            Create a free account or log in to start your scientific journey.
          </p>
          <div className="flex justify-center">
            <Button size="lg" onClick={onLoginClick}>
              Login / Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/60 dark:bg-stone-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
        >
          <div>
            <h1 className="text-4xl font-black text-stone-900 dark:text-white mb-2">
              {firstName ? `Welcome back, ${firstName}!` : "Your Lessons"}
            </h1>
            <p className="text-lg text-stone-500 dark:text-stone-400">
              Continue your scientific journey.
            </p>
          </div>
          <Card className="p-4 flex items-center gap-6 bg-white dark:bg-stone-800 border-2 border-primary-100 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-500 fill-accent-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-500 dark:text-stone-400">
                  Current Level
                </p>
                <p className="text-xl font-black text-stone-900 dark:text-white">
                  Level {level}
                </p>
              </div>
            </div>
            <div className="w-px h-12 bg-orange-200" />
            <div className="w-48">
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-stone-600">XP</span>
                <span className="text-primary-600">
                  {levelProgress
                    ? `${totalXp.toLocaleString()} / ${levelProgress.nextLevelXp.toLocaleString()}`
                    : `${totalXp.toLocaleString()} XP`}
                </span>
              </div>
              <ProgressBar
                progress={
                  levelProgress
                    ? Math.round(
                        (levelProgress.progressXp / levelProgress.neededXp) *
                          100,
                      )
                    : 100
                }
                color="primary"
                size="sm"
              />
            </div>
          </Card>
        </div>

        {/* Category Filter + Search */}
        <div
          className={`mb-8 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          {/* ── Mobile top bar: Filters toggle + Search icon ── */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setFiltersOpen((p) => !p)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm border transition-all",
                filtersOpen
                  ? "bg-stone-800 dark:bg-stone-600 text-white border-stone-800 dark:border-stone-600 shadow-md"
                  : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-orange-200 dark:border-stone-600",
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeCategory !== "All Topics" && (
                <span className="w-2 h-2 rounded-full bg-primary-500" />
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div className="ml-auto">
              {searchOpen ? (
                <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 rounded-full px-3 py-2 focus-within:border-primary-400 dark:focus-within:border-primary-500 transition-colors">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-36 text-sm font-medium bg-transparent text-stone-700 dark:text-stone-200 placeholder-stone-400 outline-none"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="shrink-0 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 transition-colors"
                  aria-label="Search lessons"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ── Mobile collapsible filter pills ── */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
              filtersOpen
                ? "max-h-40 opacity-100 mt-3"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isComingSoon =
                  cat === "3rd Quarter" || cat === "4th Quarter";
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      if (isComingSoon) return;
                      setActiveCategory(cat);
                      setFiltersOpen(false);
                    }}
                    disabled={isComingSoon}
                    className={cn(
                      "relative px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all",
                      isComingSoon
                        ? "bg-white dark:bg-stone-800 text-stone-400 dark:text-stone-500 border border-orange-200 dark:border-stone-600 opacity-60 cursor-not-allowed"
                        : activeCategory === cat
                          ? "bg-stone-800 dark:bg-stone-600 text-white shadow-md"
                          : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-orange-200 dark:border-stone-600",
                    )}
                  >
                    {cat}
                    {isComingSoon && (
                      <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wide bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Desktop: pills + search bar inline ── */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-3 flex-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              {categories.map((cat) => {
                const isComingSoon =
                  cat === "3rd Quarter" || cat === "4th Quarter";
                return (
                  <button
                    key={cat}
                    onClick={() => !isComingSoon && setActiveCategory(cat)}
                    disabled={isComingSoon}
                    className={cn(
                      "relative px-6 py-2.5 my-1 rounded-full font-bold whitespace-nowrap transition-all",
                      isComingSoon
                        ? "bg-white dark:bg-stone-800 text-stone-400 dark:text-stone-500 border border-orange-200 dark:border-stone-600 opacity-60 cursor-not-allowed"
                        : activeCategory === cat
                          ? "bg-stone-800 dark:bg-stone-600 text-white shadow-md hover:-translate-y-1 hover:shadow-card-hover"
                          : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-orange-200 dark:border-stone-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-stone-700 hover:-translate-y-1 hover:shadow-card-hover",
                    )}
                  >
                    {cat}
                    {isComingSoon && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="shrink-0 flex items-center gap-2 bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 rounded-full px-4 py-2.5 w-56 focus-within:border-primary-400 dark:focus-within:border-primary-500 transition-colors">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons..."
                className="bg-transparent text-sm font-medium text-stone-700 dark:text-stone-200 placeholder-stone-400 outline-none w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Week Cards Grid — 1 card = 1 week of lessons */}
        {displayedWeeks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-10 h-10 text-stone-300 dark:text-stone-600 mb-4" />
            <p className="text-stone-500 dark:text-stone-400 font-bold">
              No lessons match "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-sm text-primary-500 hover:underline font-bold"
            >
              Clear search
            </button>
          </div>
        )}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedWeeks.map((week, index) => {
            const IconComponent = ICON_MAP[week.icon] || Globe2;

            // Count how many lessons in this week are completed
            const completedCount = week.lessons.filter((l) =>
              completedLessons.includes(l.id),
            ).length;
            const totalLessons = week.lessons.length;
            const weekProgress = Math.round(
              (completedCount / totalLessons) * 100,
            );
            const isFullyDone = completedCount === totalLessons;

            return (
              <div
                key={week.id}
                className={`transition-all duration-700 ease-out ${
                  cardsTriggered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <Card
                  className={cn(
                    "flex flex-col h-full transition-all duration-300",
                    week.isLocked
                      ? "opacity-75 grayscale-[0.5]"
                      : "hover:-translate-y-1 hover:shadow-card-hover",
                  )}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Icon + XP */}
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-warm",
                          `bg-${week.color}-100`,
                        )}
                      >
                        <IconComponent
                          className={`w-8 h-8 text-${week.color}-500`}
                        />
                      </div>
                      <Badge
                        variant={week.isLocked ? "outline" : "accent"}
                        icon={<Star className="w-3 h-3 fill-current" />}
                      >
                        +{week.xpReward} XP
                      </Badge>
                    </div>

                    {/* Week label */}
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider mb-1",
                        `text-${week.color}-600`,
                      )}
                    >
                      Week {week.weekNumber} · {week.category}
                    </span>

                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                      {week.title}
                    </h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mb-4 flex-1">
                      {week.description}
                    </p>

                    {/* Sub-lesson pills */}
                    <div className="flex gap-2 mb-5 flex-wrap ">
                      {week.lessons.map((lesson) => {
                        const isDone = completedLessons.includes(lesson.id);
                        return (
                          <span
                            key={lesson.id}
                            className={cn(
                              "text-xs font-bold px-3 py-1 rounded-full border dark:text-secondary-700",
                              isDone
                                ? "bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 border-secondary-200 dark:border-secondary-800/50"
                                : "bg-stone-100 dark:bg-stone-700 text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-600",
                            )}
                          >
                            {isDone ? "✓ " : ""}Lesson {lesson.lessonNumber}
                          </span>
                        );
                      })}
                    </div>

                    {/* Progress bar (shown if started) */}
                    {weekProgress > 0 && !week.isLocked && (
                      <div className="mb-5">
                        <ProgressBar
                          progress={weekProgress}
                          color={isFullyDone ? "secondary" : "primary"}
                          showLabel
                        />
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="mt-auto pt-4 border-t border-orange-100 dark:border-stone-700">
                      {week.isLocked ? (
                        <Button
                          variant="ghost"
                          className="w-full"
                          disabled
                          leftIcon={<Lock className="w-4 h-4" />}
                        >
                          Locked
                        </Button>
                      ) : (
                        <Button
                          variant={isFullyDone ? "outline" : "primary"}
                          className="w-full"
                          onClick={() => onStartWeek(week.id)}
                          rightIcon={
                            !isFullyDone && <ChevronRight className="w-4 h-4" />
                          }
                        >
                          {isFullyDone
                            ? "Review Week"
                            : weekProgress > 0
                              ? "Continue"
                              : "Start Week"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
