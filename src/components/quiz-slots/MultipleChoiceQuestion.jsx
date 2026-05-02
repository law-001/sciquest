import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export function MultipleChoiceQuestion({
  question,
  value,
  onChange,
  isSubmitted,
}) {
  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option) => {
        const isSelected = value === option;
        const isCorrect = option === question.correctAnswer;

        let cls =
          "border-orange-200 hover:border-primary-300 hover:bg-primary-50/50 text-stone-700 cursor-pointer";
        if (isSubmitted) {
          if (isCorrect)
            cls = "border-secondary-400 bg-secondary-50 text-secondary-700 cursor-default";
          else if (isSelected)
            cls = "border-red-300 bg-red-50 text-red-700 cursor-default";
          else cls = "border-orange-100 text-stone-400 opacity-60 cursor-default";
        } else if (isSelected) {
          cls =
            "border-primary-500 bg-primary-50 text-primary-700 ring-4 ring-primary-500/10 cursor-pointer";
        }

        return (
          <button
            key={option}
            onClick={() => !isSubmitted && onChange(option)}
            disabled={isSubmitted}
            className={cn(
              "p-4 rounded-xl font-bold transition-all duration-200 text-left border-2 flex items-center gap-4",
              cls,
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                isSubmitted && isCorrect
                  ? "border-secondary-500 bg-secondary-100"
                  : isSubmitted && isSelected
                    ? "border-red-400 bg-red-100"
                    : isSelected
                      ? "border-primary-500"
                      : "border-stone-300",
              )}
            >
              {isSubmitted && isCorrect ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary-600" />
              ) : isSubmitted && isSelected ? (
                <XCircle className="w-3.5 h-3.5 text-red-500" />
              ) : isSelected ? (
                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
              ) : null}
            </div>
            {option}
          </button>
        );
      })}

      {isSubmitted && question.explanation && (
        <div className="mt-1 p-3 rounded-lg bg-secondary-50 border border-secondary-100 text-sm text-secondary-700 font-medium">
          💡 {question.explanation}
        </div>
      )}
    </div>
  );
}
