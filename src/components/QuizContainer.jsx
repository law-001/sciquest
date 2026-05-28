// components/QuizContainer.jsx
// Single-page quiz: all questions visible at once, auto-saves to localStorage,
// Submit Quiz button at bottom, results screen after submission.

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
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
import {
  calcQuizXp,
  questionUnits,
  QUIZ_XP_PER_CORRECT,
  MANUAL_GRADE_TYPES,
  MAX_QUIZ_ATTEMPTS,
  attemptXpFactor,
} from "../lib/xp-config";
import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillInTheBlanks,
  ShortAnswer,
  EssayQuestion,
  MatchingQuestion,
  IdentificationQuestion,
  OrderingQuestion,
  PictureBasedQuestion,
  CaseStudyQuestion,
} from "./quiz-slots";

// ── SLOT MAP ──────────────────────────────────────────────────────────────────
export const QUESTION_MAP = {
  "multiple-choice": MultipleChoiceQuestion,
  "true-false": TrueFalseQuestion,
  "fill-blanks": FillInTheBlanks,
  "short-answer": ShortAnswer,
  essay: EssayQuestion,
  matching: MatchingQuestion,
  identification: IdentificationQuestion,
  ordering: OrderingQuestion,
  "picture-based": PictureBasedQuestion,
  "case-study": CaseStudyQuestion,
};

export const TYPE_LABELS = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  "fill-blanks": "Fill in the Blanks",
  "short-answer": "Short Answer",
  essay: "Essay",
  matching: "Matching",
  identification: "Identification",
  ordering: "Ordering",
  "picture-based": "Picture-Based",
  "case-study": "Case Study",
};

// ── Scoring helpers ───────────────────────────────────────────────────────────
// Essay / short-answer return 0 here — they need a teacher to grade them.
// `isManualGrade(q)` exposes the rule so other code can branch on it.
function isManualGrade(q) {
  return MANUAL_GRADE_TYPES.has(q.type);
}

// Returns the number of correct *units*: 1 per normal question (all-or-
// nothing), one per correctly matched pair, and the recursive sum for a
// case study. This is the score — 1 point per correct unit.
function scoreQuestion(q, answer) {
  if (answer === undefined || answer === null) return 0;

  switch (q.type) {
    case "multiple-choice":
    case "picture-based":
      return answer === q.correctAnswer ? 1 : 0;

    case "true-false":
      return answer === q.correctAnswer ? 1 : 0;

    case "fill-blanks": {
      if (!Array.isArray(answer)) return 0;
      const allCorrect = q.blanks.every(
        (b, i) =>
          b.toLowerCase().trim() === (answer[i] ?? "").toLowerCase().trim(),
      );
      return allCorrect ? 1 : 0;
    }

    case "identification": {
      const accepted = q.acceptedAnswers ?? [q.correctAnswer];
      const norm = (s) => s?.toLowerCase().trim() ?? "";
      return accepted.some((a) => norm(a) === norm(answer)) ? 1 : 0;
    }

    case "ordering":
      if (!Array.isArray(answer) || answer.length !== q.items.length) return 0;
      return answer.every((item, i) => item === q.items[i]) ? 1 : 0;

    case "matching": {
      if (!answer || typeof answer !== "object") return 0;
      // Partial credit: one point per correctly matched pair.
      return q.leftItems.filter((l) => answer[l] === q.correctPairs[l]).length;
    }

    case "short-answer":
    case "essay":
      // Awaiting teacher grading — 0 until reviewed.
      return 0;

    case "case-study":
      return (q.subQuestions ?? []).reduce(
        (sum, sq) => sum + scoreQuestion(sq, answer?.[sq.id]),
        0,
      );

    default:
      return 0;
  }
}

function totalUnits(questions) {
  return questions.reduce((sum, q) => sum + questionUnits(q), 0);
}

// Total units for questions that can be auto-graded — the max score.
// Essays/short-answer are excluded until a teacher grades them.
function autoGradableUnits(questions) {
  return questions.reduce((sum, q) => {
    if (q.type === "case-study") {
      return sum + autoGradableUnits(q.subQuestions ?? []);
    }
    if (isManualGrade(q)) return sum;
    return sum + questionUnits(q);
  }, 0);
}

// Number of manual-grade questions answered by the student. Used to show
// "N essay(s) awaiting grading" and to persist on the attempt row.
function pendingGradeCount(questions, answers) {
  return questions.reduce((count, q) => {
    if (q.type === "case-study") {
      return count + pendingGradeCount(q.subQuestions ?? [], answers);
    }
    if (!isManualGrade(q)) return count;
    return isAnswered(q, answers[q.id]) ? count + 1 : count;
  }, 0);
}

function isAnswered(q, answer) {
  switch (q.type) {
    case "multiple-choice":
    case "picture-based":
      return answer !== undefined && answer !== null && answer !== "";
    case "true-false":
      return answer === true || answer === false;
    case "fill-blanks":
      return Array.isArray(answer) && answer.some((a) => a?.trim());
    case "short-answer":
    case "essay":
    case "identification":
      return typeof answer === "string" && answer.trim().length > 0;
    case "ordering":
      return Array.isArray(answer) && answer.length > 0;
    case "matching":
      return answer && Object.keys(answer).length > 0;
    case "case-study":
      return (q.subQuestions ?? []).some((sq) =>
        isAnswered(sq, answer?.[sq.id]),
      );
    default:
      return false;
  }
}

function formatRemaining(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

// Confetti positions computed at module load — not during render — so Math.random is safe here.
const CONFETTI_ITEMS = Array.from({ length: 50 }, () => ({
  left: `${Math.random() * 100}%`,
  backgroundColor: ["#f97316", "#14b8a6", "#eab308", "#fb7185"][
    Math.floor(Math.random() * 4)
  ],
  animationDelay: `${Math.random() * 2}s`,
  animationDuration: `${2 + Math.random() * 2}s`,
}));

// ── Component ─────────────────────────────────────────────────────────────────
// onComplete receives { score, maxScore } so the caller can persist the attempt.
export function QuizContainer({
  quiz,
  lesson,
  priorAttempts = 0,
  onExit,
  onComplete,
  onFinish,
  timeLimitSeconds = null,
  maxAttempts = null,
  showCorrectAnswers = true,
}) {
  const { questions } = quiz;
  const storageKey = `quiz-answers-${quiz.lessonId}`;
  const timerStartKey = `quiz-started-${quiz.lessonId}`;
  const hasTimer = Number.isFinite(timeLimitSeconds) && timeLimitSeconds > 0;

  // Per-quiz override: null/undefined ⇒ "unlimited". A positive int caps
  // submissions; anything else falls back to the app-wide default so old
  // quizzes without a setting still behave as they used to.
  const attemptCap =
    maxAttempts == null
      ? Infinity
      : Number.isFinite(maxAttempts) && maxAttempts > 0
        ? maxAttempts
        : MAX_QUIZ_ATTEMPTS;
  const isUnlimited = !Number.isFinite(attemptCap);

  // 1-indexed number of the attempt being taken now. Once priorAttempts hits
  // the cap, no further submissions are allowed.
  const attemptNumber = priorAttempts + 1;
  const attemptsExhausted = priorAttempts >= attemptCap;
  const attemptsLeft = isUnlimited
    ? Infinity
    : Math.max(0, attemptCap - priorAttempts);

  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) ?? {};
    } catch {
      return {};
    }
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  // Auto-save answers on every change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);

  // ── Timer ────────────────────────────────────────────────────────────────
  // Start time is persisted so a refresh mid-quiz resumes the countdown from
  // where it left off; otherwise students could just reload to reset.
  const [now, setNow] = useState(() => Date.now());
  const [startedAt, setStartedAt] = useState(() => {
    if (!hasTimer || attemptsExhausted) return null;
    try {
      const stored = localStorage.getItem(timerStartKey);
      const parsed = stored ? Number(stored) : NaN;
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    } catch {
      /* ignore */
    }
    const ts = Date.now();
    try {
      localStorage.setItem(timerStartKey, String(ts));
    } catch {
      /* quota */
    }
    return ts;
  });

  const remainingSec =
    hasTimer && startedAt
      ? Math.max(0, timeLimitSeconds - Math.floor((now - startedAt) / 1000))
      : null;

  // Keep submit handler reachable from the timer effect without re-binding
  // it every render (which would tear down the interval).
  const handleSubmitRef = useRef(null);

  useEffect(() => {
    if (!hasTimer || isSubmitted || attemptsExhausted) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [hasTimer, isSubmitted, attemptsExhausted]);

  useEffect(() => {
    if (remainingSec === 0 && !isSubmitted && !attemptsExhausted) {
      handleSubmitRef.current?.(true);
    }
  }, [remainingSec, isSubmitted, attemptsExhausted]);

  const answeredCount = questions.filter((q) =>
    isAnswered(q, answers[q.id]),
  ).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const handleChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = (autoSubmitted = false) => {
    if (attemptsExhausted) return;

    const earned = questions.reduce(
      (sum, q) => sum + scoreQuestion(q, answers[q.id]),
      0,
    );
    const max = totalUnits(questions);
    const autoMax = autoGradableUnits(questions);
    const pending = pendingGradeCount(questions, answers);
    // Retries are capped: attempt 2 earns ≤50%, attempt 3 ≤25% of the first.
    const xpEarned = Math.round(
      calcQuizXp(earned) * attemptXpFactor(attemptNumber),
    );

    const result = {
      score: earned,
      maxScore: max,
      autoMaxScore: autoMax,
      xpEarned,
      pendingGradeCount: pending,
      autoSubmitted,
      // Snapshot of what the student submitted, keyed by question id —
      // persisted so a teacher can review it later when grading.
      answers,
    };

    if (autoMax > 0 && earned > autoMax / 2) setShowConfetti(true);
    setIsSubmitted(true);
    setSubmittedResult(result);
    localStorage.removeItem(storageKey);
    try {
      localStorage.removeItem(timerStartKey);
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    // XP / persistence fires here on submit — not when leaving the results screen.
    onComplete?.(result);
  };

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  const handleDone = () => {
    onFinish?.();
  };

  const handleRetry = () => {
    if (attemptsExhausted) return;
    setAnswers({});
    setIsSubmitted(false);
    setShowConfetti(false);
    if (hasTimer) {
      const ts = Date.now();
      try {
        localStorage.setItem(timerStartKey, String(ts));
      } catch {
        /* quota */
      }
      setStartedAt(ts);
      setNow(ts);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // No attempts left and not currently viewing a fresh result — lock the quiz.
  if (attemptsExhausted && !isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 bg-[#fdf6e3] dark:bg-stone-900">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 bg-stone-100 dark:bg-stone-700">
            <Trophy className="w-10 h-10 text-stone-400" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-2">
            No attempts remaining
          </h2>
          <p className="text-stone-500 dark:text-stone-400 font-bold mb-6">
            You've used all {attemptCap} attempts for
            {lesson ? ` "${lesson.title}"` : " this quiz"}. Your best score has
            been saved.
          </p>
          <Button variant="primary" size="lg" onClick={onFinish ?? onExit}>
            Back to Lessons
          </Button>
        </Card>
      </div>
    );
  }

  // ── Results screen ──────────────────────────────────────────────────────────
  if (isSubmitted) {
    const earned = questions.reduce(
      (sum, q) => sum + scoreQuestion(q, answers[q.id]),
      0,
    );
    const autoMax = autoGradableUnits(questions);
    const pending = pendingGradeCount(questions, answers);
    const xpEarned = submittedResult?.xpEarned ?? calcQuizXp(earned);
    // Pass/percent are based on auto-gradable portion only; essays are TBD.
    const passed = autoMax > 0 && earned > autoMax / 2;
    const pct = autoMax > 0 ? Math.round((earned / autoMax) * 100) : 0;

    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-12 relative overflow-hidden bg-[#fdf6e3] dark:bg-stone-900">
        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {CONFETTI_ITEMS.map((style, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm animate-confetti-fall"
                style={style}
              />
            ))}
          </div>
        )}

        <Card className="max-w-md w-full p-8 text-center relative z-10 mb-10">
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

          <h2 className="text-3xl font-black text-stone-900 mb-1 dark:text-stone-100">
            {passed ? "Quiz Complete!" : "Keep Practicing!"}
          </h2>
          {submittedResult?.autoSubmitted && (
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
              Auto-submitted — time ran out
            </p>
          )}
          {lesson && (
            <p className="text-stone-400 text-sm font-bold uppercase tracking-wider mb-6">
              {lesson.title}
            </p>
          )}

          <div className="rounded-2xl p-6 mb-8 bg-orange-50 dark:bg-stone-700/50 border border-orange-100 dark:border-stone-600">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
              Your Score
            </div>
            <div className="text-5xl font-black text-primary-600 mb-1">
              {earned}
              <span className="text-2xl text-stone-300"> / {autoMax}</span>
            </div>
            <div className="text-sm font-bold text-stone-400 mb-4">{pct}%</div>
            <ProgressBar
              progress={pct}
              color={passed ? "secondary" : "primary"}
              size="lg"
            />
            <div className="flex items-center justify-center gap-2 text-accent-600 font-bold mt-4">
              <Star className="w-4 h-4 fill-current" />
              <span>+{xpEarned} XP Earned</span>
            </div>
            <p className="text-xs font-bold text-stone-400 mt-2">
              {isUnlimited
                ? `Attempt ${priorAttempts} — unlimited attempts`
                : `Attempt ${Math.min(priorAttempts, attemptCap)} of ${attemptCap}`}
              {!isUnlimited && attemptsExhausted && " — no attempts left"}
              {!isUnlimited && !attemptsExhausted && (
                priorAttempts >= MAX_QUIZ_ATTEMPTS
                  ? " — no more XP"
                  : ` — ${attemptsLeft} left (reduced XP)`
              )}
              {isUnlimited && priorAttempts >= MAX_QUIZ_ATTEMPTS && " — no more XP"}
            </p>
            {pending > 0 && (
              <p className="text-xs font-bold text-amber-600 mt-3">
                {pending} {pending === 1 ? "essay" : "essays"} awaiting teacher
                grading
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="primary" onClick={handleDone} size="lg">
              Back to Lessons
            </Button>
            {!attemptsExhausted && (
              <Button
                variant="outline"
                onClick={handleRetry}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Retry Quiz{isUnlimited ? "" : ` (${attemptsLeft} left)`}
              </Button>
            )}
          </div>
        </Card>

        {/* Per-question review — hidden when the teacher has chosen not to
            reveal correct answers for this quiz. */}
        {showCorrectAnswers && (
        <div className="max-w-2xl w-full relative z-10 space-y-4">
          <h3 className="text-xl font-black text-stone-700 dark:text-stone-200 mb-2">
            Review Your Answers
          </h3>
          {questions.map((q, i) => {
            const Component = QUESTION_MAP[q.type];
            if (!Component) return null;
            const earned = scoreQuestion(q, answers[q.id]);
            const pts = questionUnits(q);
            const manualGrade =
              isManualGrade(q) && isAnswered(q, answers[q.id]);

            return (
              <Card key={q.id} className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black text-stone-400 uppercase tracking-wider">
                        Q{i + 1}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {TYPE_LABELS[q.type] ?? q.type}
                      </Badge>
                    </div>
                    <p className="font-bold text-stone-800">{q.question}</p>
                  </div>
                  {manualGrade ? (
                    <span className="shrink-0 text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                      Not yet graded
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "shrink-0 text-sm font-black px-3 py-1 rounded-full",
                        earned === pts
                          ? "bg-secondary-100 text-secondary-700"
                          : earned > 0
                            ? "bg-accent-100 text-accent-700"
                            : "bg-red-100 text-red-600",
                      )}
                    >
                      {earned}/{pts} pts
                    </span>
                  )}
                </div>
                <Component
                  question={q}
                  value={answers[q.id]}
                  onChange={() => {}}
                  isSubmitted
                />
              </Card>
            );
          })}
        </div>
        )}
      </div>
    );
  }

  // ── Quiz screen (single-page) ───────────────────────────────────────────────
  const xpPossible = autoGradableUnits(questions) * QUIZ_XP_PER_CORRECT;

  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 lg:pt-8 pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)_260px] gap-6 lg:gap-8">
          {/* LEFT rail — Exit (sticks beside the quiz on desktop) */}
          <aside className="order-1 lg:order-0 lg:sticky lg:top-20 lg:self-start">
            <button
              onClick={onExit}
              className="flex items-center gap-2 text-stone-500 hover:text-primary-600 font-bold transition-colors text-sm px-3 py-2 -ml-3"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Quiz
            </button>
          </aside>

          {/* CENTER — questions */}
          <main className="order-3 lg:order-0 w-full max-w-3xl mx-auto space-y-8">
            {questions.map((q, i) => {
              const Component = QUESTION_MAP[q.type];
              if (!Component) return null;
              const answered = isAnswered(q, answers[q.id]);

              return (
                <Card
                  key={q.id}
                  id={`question-${q.id}`}
                  className={cn(
                    "p-6 md:p-8 transition-all border-2",
                    answered ? "border-secondary-200" : "border-orange-100",
                  )}
                >
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-black text-sm flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {TYPE_LABELS[q.type] ?? q.type}
                      </Badge>
                      {answered && (
                        <CheckCircle2 className="w-4 h-4 text-secondary-500" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-stone-400 shrink-0">
                      {questionUnits(q)} pts
                    </span>
                  </div>

                  {/* Question text */}
                  <p className="text-lg md:text-xl font-bold text-stone-900 dark:text-white mb-6 leading-snug">
                    {q.question}
                  </p>

                  {/* Slot component */}
                  <Component
                    question={q}
                    value={answers[q.id]}
                    onChange={(answer) => handleChange(q.id, answer)}
                    isSubmitted={false}
                  />
                </Card>
              );
            })}
          </main>

          {/* RIGHT rail — lesson info, timer, XP, progress (sticks beside the quiz on desktop) */}
          <aside className="order-2 lg:order-0 lg:sticky lg:top-20 lg:self-start flex flex-col gap-3">
            {lesson && (
              <div className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-stone-800/60 backdrop-blur-md border border-orange-200/60 dark:border-stone-700 shadow-sm">
                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                  Lesson
                </div>
                <div className="text-sm font-black text-stone-700 dark:text-stone-200 leading-snug">
                  {lesson.title}
                </div>
              </div>
            )}

            {hasTimer && remainingSec !== null && (
              <div className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-stone-800/60 backdrop-blur-md border border-orange-200/60 dark:border-stone-700 shadow-sm">
                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">
                  Time Limit
                </div>
                <span
                  role="timer"
                  aria-live={remainingSec <= 30 ? "assertive" : "off"}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tabular-nums border",
                    remainingSec <= 30
                      ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 border-red-200 dark:border-red-700 animate-pulse"
                      : remainingSec <= 120
                        ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700"
                        : "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 border-secondary-200 dark:border-secondary-700",
                  )}
                  title="Time remaining"
                >
                  <Clock className="w-3.5 h-3.5" />
                  {formatRemaining(remainingSec)}
                </span>
              </div>
            )}

            <div className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-stone-800/60 backdrop-blur-md border border-orange-200/60 dark:border-stone-700 shadow-sm">
              <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">
                XP Possible
              </div>
              <Badge
                variant="accent"
                icon={<Star className="w-3 h-3 fill-current" />}
              >
                {xpPossible} XP
              </Badge>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-stone-800/60 backdrop-blur-md border border-orange-200/60 dark:border-stone-700 shadow-sm">
              <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">
                Progress
              </div>
              <div className="flex justify-between text-xs font-bold text-stone-500 dark:text-stone-400 mb-1.5">
                <span>
                  {answeredCount} of {questions.length}
                </span>
                <span>{progress}%</span>
              </div>
              <ProgressBar progress={progress} color="secondary" size="sm" />
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Submit footer */}
      <div className="bottom-0 left-0 right-0 z-30 border-t border-orange-200/70 dark:border-stone-700 backdrop-blur-md bg-[#fdf6e3]/95 dark:bg-stone-900/95">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-stone-500">
              {answeredCount === questions.length
                ? "All questions answered — ready to submit!"
                : `${questions.length - answeredCount} question${
                    questions.length - answeredCount !== 1 ? "s" : ""
                  } remaining`}
            </div>
            <div className="text-xs font-bold text-stone-400 mt-0.5">
              {isUnlimited
                ? `Attempt ${attemptNumber} — unlimited attempts`
                : `Attempt ${attemptNumber} of ${attemptCap}`}
              {attemptNumber > MAX_QUIZ_ATTEMPTS
                ? " — no XP for this attempt"
                : attemptNumber > 1 && " — XP reduced for retries"}
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleSubmit(false)}
            disabled={answeredCount === 0 || attemptsExhausted}
            rightIcon={<CheckCircle2 className="w-5 h-5" />}
            className="ml-auto px-8"
          >
            Submit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
