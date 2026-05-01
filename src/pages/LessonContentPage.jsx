import React from "react";
import { LessonTemplate } from "../components/LessonTemplate";
import { WEEKS_DATA } from "../data/week-01";

export function LessonContentPage({
  weekId,
  activeLessonId,
  completedLessons = [],
  reachedLessons = [],
  onBack,
  onGoToQuiz,
  onLessonSelect,
}) {
  const week =
    WEEKS_DATA.find((w) => w.id === weekId) ??
    WEEKS_DATA.find((w) => w.lessons.some((l) => l.id === activeLessonId));

  const lesson = week?.lessons.find((l) => l.id === activeLessonId);

  return (
    <LessonTemplate
      lesson={lesson}
      weekLessons={week?.lessons ?? []}
      activeLessonId={activeLessonId}
      completedLessons={completedLessons}
      reachedLessons={reachedLessons}
      onBack={onBack}
      onComplete={onGoToQuiz}
      onLessonSelect={onLessonSelect}
    />
  );
}
