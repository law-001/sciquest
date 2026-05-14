import React from "react";
import { cn } from "../../lib/utils";

export function IdentificationQuestion({
  question,
  value = "",
  onChange,
  isSubmitted,
}) {
  const normalize = (s) => s?.toLowerCase().trim() ?? "";
  const accepted = question.acceptedAnswers ?? [question.correctAnswer];
  const isCorrect =
    isSubmitted && accepted.some((a) => normalize(a) === normalize(value));

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isSubmitted}
        placeholder="Type your answer…"
        className={cn(
          "w-full p-4 rounded-xl border-2 font-bold focus:outline-none transition-colors",
          isSubmitted
            ? isCorrect
              ? "border-secondary-400 bg-secondary-50 text-secondary-700"
              : "border-red-300 bg-red-50 text-red-700"
            : "border-orange-100 focus:border-primary-400 text-stone-700 placeholder:text-stone-300",
        )}
      />

      {isSubmitted && !isCorrect && (
        <p className="text-sm text-secondary-600 font-bold pl-1">
          Correct answer: {question.correctAnswer}
        </p>
      )}
    </div>
  );
}
