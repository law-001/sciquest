import React from "react";
import { LessonTemplate } from "../components/LessonTemplate";
import { useLessonsData } from "../context/LessonsDataContext";

export function LessonContentPage({
  weekId,
  activeLessonId,
  completedLessons = [],
  lessonsPassed = [],
  reachedLessons = [],
  onBack,
  onGoToQuiz,
  onLessonComplete,
  onLessonSelect,
  quizLocked = false,
}) {
  const { weeks } = useLessonsData();
  const week =
    weeks.find((w) => w.id === weekId) ??
    weeks.find((w) => w.lessons.some((l) => l.id === activeLessonId));

  const lesson = week?.lessons.find((l) => l.id === activeLessonId);

  return (
    <LessonTemplate
      lesson={lesson}
      weekLessons={week?.lessons ?? []}
      activeLessonId={activeLessonId}
      completedLessons={completedLessons}
      lessonsPassed={lessonsPassed}
      reachedLessons={reachedLessons}
      onBack={onBack}
      onComplete={onGoToQuiz}
      onLessonComplete={onLessonComplete}
      onLessonSelect={onLessonSelect}
      quizLocked={quizLocked}
    />
  );
}
