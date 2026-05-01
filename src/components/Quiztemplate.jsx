// components/QuizTemplate.jsx
// Pure UI — receives `quiz` and `lesson` as props, no data imports.
// Mirrors the same prop contract as LessonTemplate.

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCcw,
  Star,
  Trophy,
} from "lucide-react";
import Button from "./Button";
import Card from "./Card";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import { cn } from "../lib/utils";

/**
 * QuizTemplate
 *
 * Props:
 *   quiz       {object}   – quiz object from quizzes.js       (required)
 *   lesson     {object}   – lesson metadata for display       (optional)
 *   onComplete {function} – called after "Back to Lessons" on results screen
 *   onExit     {function} – called when user clicks "Exit Quiz"
 */
export function QuizTemplate({ quiz, lesson, onComplete, onExit }) {
  const { questions, timeLimit, xpPerCorrect } = quiz;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, isSubmitted]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelect = (answer) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (calcScore() > questions.length / 2) setShowConfetti(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setTimeLeft(timeLimit);
    setShowConfetti(false);
  };

  const calcScore = () =>
    questions.reduce(
      (acc, q) => (answers[q.id] === q.correctAnswer ? acc + 1 : acc),
      0,
    );

  // ── Results Screen ─────────────────────────────────────────────────────────
  if (isSubmitted) {
    const score = calcScore();
    const xpEarned = score * xpPerCorrect;
    const passed = score > questions.length / 2;

    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ backgroundColor: "#fdf6e3" }}
      >
        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm animate-confetti-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ["#f97316", "#14b8a6", "#eab308", "#fb7185"][
                    Math.floor(Math.random() * 4)
                  ],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <Card className="max-w-md w-full p-8 text-center relative z-10">
          {/* Trophy */}
          <div
            className={cn(
              "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-glow",
              passed ? "bg-accent-100" : "bg-stone-100",
            )}
          >
            <Trophy
              className={cn(
                "w-12 h-12",
                passed ? "text-accent-500" : "text-stone-400",
              )}
            />
          </div>

          <h2 className="text-3xl font-black text-stone-900 mb-1">
            {passed ? "Quiz Complete!" : "Keep Practicing!"}
          </h2>
          {lesson && (
            <p className="text-stone-400 text-sm font-bold uppercase tracking-wider mb-6">
              {lesson.title}
            </p>
          )}

          {/* Score card */}
          <div className="rounded-2xl p-6 mb-8 bg-orange-50 border border-orange-100">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
              Your Score
            </div>
            <div className="text-5xl font-black text-primary-600 mb-3">
              {score}
              <span className="text-2xl text-stone-300">
                {" "}
                / {questions.length}
              </span>
            </div>

            {/* Per-question breakdown */}
            <div className="flex justify-center gap-2 mb-4">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
                    answers[q.id] === q.correctAnswer
                      ? "bg-secondary-500 text-white"
                      : "bg-red-100 text-red-500",
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-accent-600 font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>+{xpEarned} XP Earned</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="primary" onClick={onComplete} size="lg">
              Back to Lessons
            </Button>
            <Button
              variant="outline"
              onClick={handleRetry}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retry Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Quiz Screen ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fdf6e3" }}>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-30 backdrop-blur-md border-b border-orange-200/50"
        style={{ backgroundColor: "rgba(253, 246, 227, 0.9)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onExit}
              className="flex items-center gap-2 text-stone-500 hover:text-primary-600 font-bold transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Quiz
            </button>

            <div className="flex items-center gap-3">
              {lesson && (
                <span className="hidden sm:block text-xs font-bold text-stone-400 uppercase tracking-wider">
                  {lesson.title}
                </span>
              )}
              <div
                className={cn(
                  "flex items-center gap-2 font-bold px-4 py-1.5 rounded-full border-2 text-sm",
                  timeLeft <= 10
                    ? "text-red-600 border-red-200 bg-red-50 animate-pulse"
                    : "text-stone-600 border-orange-200 bg-white",
                )}
              >
                <Clock className="w-4 h-4" />
                <span>00:{timeLeft.toString().padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold text-stone-500 mb-2">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <Badge
              variant="accent"
              icon={<Star className="w-3 h-3 fill-current" />}
            >
              {questions.length * xpPerCorrect} XP possible
            </Badge>
          </div>
          <ProgressBar progress={progress} color="secondary" size="lg" />
        </div>

        {/* Question card */}
        <Card className="p-8 md:p-12 mb-8 shadow-lg border-2 border-primary-100">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-10 text-center leading-tight">
            {currentQuestion.prompt}
          </h2>

          <div className="flex flex-col gap-4">
            {currentQuestion.options.map((option) => {
              const isSelected = currentAnswer === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "p-5 rounded-xl text-lg font-bold transition-all duration-200 text-left border-2 flex items-center gap-4",
                    isSelected
                      ? "border-primary-500 bg-primary-50 text-primary-700 ring-4 ring-primary-500/10"
                      : "border-orange-200 hover:border-primary-300 hover:bg-primary-50/50 text-stone-700",
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                      isSelected ? "border-primary-500" : "border-stone-300",
                    )}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 bg-primary-500 rounded-full" />
                    )}
                  </div>
                  {option}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={!currentAnswer}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
