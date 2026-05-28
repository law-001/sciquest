// pages/QuizPage.jsx

import React from "react";
import { QuizContainer } from "../components/QuizContainer";
import { useLessonsData } from "../context/LessonsDataContext";

export function QuizPage({
  activeLessonId,
  priorAttempts = 0,
  onBack,
  onComplete,
  onFinish,
  timeLimitSeconds = null,
  maxAttempts = null,
  showCorrectAnswers = true,
}) {
  const { weeks, getQuiz } = useLessonsData();
  const allLessons = weeks.flatMap((w) => w.lessons);
  const lesson = allLessons.find((l) => l.id === activeLessonId);
  const quiz = getQuiz(activeLessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-black text-stone-700">Lesson not found.</p>
        <p className="text-stone-400 text-sm">lessonId: "{activeLessonId}"</p>
        <button onClick={onBack} className="underline text-primary-600 font-bold">
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
        <button onClick={onBack} className="mt-2 underline text-primary-600 font-bold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <QuizContainer
      quiz={quiz}
      lesson={lesson}
      priorAttempts={priorAttempts}
      onExit={onBack}
      onComplete={onComplete}
      onFinish={onFinish}
      timeLimitSeconds={timeLimitSeconds}
      maxAttempts={maxAttempts}
      showCorrectAnswers={showCorrectAnswers}
    />
  );
}
