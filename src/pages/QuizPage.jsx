// pages/QuizPage.jsx

import React from "react";
import { QuizTemplate } from "../components/QuizTemplate";
import { WEEKS_DATA } from "../data/week-01";
import { getQuizByLesson } from "../data/quizzes";

export function QuizPage({
  weekId, // optional — used only if you want to scope the search
  activeLessonId,
  onBack,
  onComplete,
}) {
  // Search all weeks for the lesson — no dependency on weekId being passed
  const allLessons = WEEKS_DATA.flatMap((w) => w.lessons);
  const lesson = allLessons.find((l) => l.id === activeLessonId);
  const quiz = getQuizByLesson(activeLessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-black text-stone-700">Lesson not found.</p>
        <p className="text-stone-400 text-sm">lessonId: "{activeLessonId}"</p>
        <button
          onClick={onBack}
          className="underline text-primary-600 font-bold"
        >
          Back to Lessons
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-stone-500">
        <p className="text-2xl font-black text-stone-900">No quiz yet</p>
        <p>
          The quiz for <strong>{lesson.title}</strong> has not been added yet.
        </p>
        <button
          onClick={onBack}
          className="mt-2 underline text-primary-600 font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <QuizTemplate
      quiz={quiz}
      lesson={lesson}
      onExit={onBack}
      onComplete={onComplete}
    />
  );
}
