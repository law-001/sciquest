import React, { useState } from "react";
import {
  Play,
  Lock,
  Star,
  Globe2,
  Dna,
  Zap,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import Badge from "../components/Badge";
import { WEEKS_DATA } from "../data/lessonsweek-01";
import { cn } from "../lib/utils";

const ICON_MAP = { Globe2, Dna, Zap };

export function LessonsPage({ onStartWeek, completedLessons = [] }) {
  const categories = [
    "All Topics",
    "1st Quarter",
    "2nd Quarter",
    "3rd Quarter",
    "4thQuarter",
  ];
  const [activeCategory, setActiveCategory] = useState("All Topics");

  const filteredWeeks =
    activeCategory === "All Topics"
      ? WEEKS_DATA
      : WEEKS_DATA.filter((w) => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-amber-50/60 dark:bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-stone-900 dark:text-white mb-2">
              Your Lessons
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
                <p className="text-xl font-black text-stone-900 dark:text-white">Level 5</p>
              </div>
            </div>
            <div className="w-px h-12 bg-orange-200" />
            <div className="w-48">
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-stone-600">XP</span>
                <span className="text-primary-600">1,250 / 2,000</span>
              </div>
              <ProgressBar progress={62.5} color="primary" size="sm" />
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 my-1 rounded-full font-bold whitespace-nowrap transition-all hover:-translate-y-1 hover:shadow-card-hover",
                activeCategory === cat
                  ? "bg-stone-800 dark:bg-stone-600 text-white shadow-md"
                  : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-orange-200 dark:border-stone-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-stone-700",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Week Cards Grid — 1 card = 1 week of lessons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWeeks.map((week) => {
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
              <Card
                key={week.id}
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
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {week.lessons.map((lesson) => {
                      const isDone = completedLessons.includes(lesson.id);
                      return (
                        <span
                          key={lesson.id}
                          className={cn(
                            "text-xs font-bold px-3 py-1 rounded-full border",
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
