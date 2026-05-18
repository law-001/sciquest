// Read-only render of a student's quiz submission: each question with the
// answer they gave. Reuses the same quiz-slot components the student saw,
// in `isSubmitted` mode (disabled, correct answers revealed) — so a teacher
// grading an essay also sees the full surrounding context.

import React from "react";
import Badge from "./Badge";
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

const QUESTION_MAP = {
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

const TYPE_LABELS = {
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

function isBlank(value) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
  );
}

export function QuizAnswersReview({ quiz, answers }) {
  if (!quiz?.questions?.length) {
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400">
        This activity's questions are no longer available.
      </p>
    );
  }
  if (!answers) {
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400">
        Answers weren't recorded for this submission (it was taken before
        answer review was available).
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {quiz.questions.map((q, i) => {
        const Component = QUESTION_MAP[q.type];
        if (!Component) return null;
        const value = answers[q.id];

        return (
          <div
            key={q.id}
            className="rounded-xl border border-orange-100 dark:border-stone-700 p-4 bg-white/50 dark:bg-stone-800/40"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black text-stone-400 uppercase tracking-wider">
                Q{i + 1}
              </span>
              <Badge variant="outline" className="text-xs">
                {TYPE_LABELS[q.type] ?? q.type}
              </Badge>
              {isBlank(value) && (
                <span className="text-xs font-bold text-stone-400">No answer</span>
              )}
            </div>
            <p className="font-bold text-stone-800 dark:text-stone-100 mb-3">
              {q.question}
            </p>
            <Component question={q} value={value} onChange={() => {}} isSubmitted />
          </div>
        );
      })}
    </div>
  );
}
