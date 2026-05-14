import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export function TrueFalseQuestion({ question, value, onChange, isSubmitted }) {
  const options = [
    { label: "True", val: true },
    { label: "False", val: false },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {options.map(({ label, val }) => {
          const isSelected = value === val;
          const isCorrect = val === question.correctAnswer;

          let cls =
            "border-orange-200 hover:border-primary-300 hover:bg-primary-50/50 text-stone-700 dark:text-stone-200 cursor-pointer border-stone-200 dark:border-stone-500";
          if (isSubmitted) {
            if (isCorrect)
              cls =
                "border-secondary-400 bg-secondary-50 text-secondary-700 cursor-default";
            else if (isSelected)
              cls = "border-red-300 bg-red-50 text-red-700 cursor-default";
            else
              cls =
                "border-orange-100 text-stone-400 opacity-60 cursor-default";
          } else if (isSelected) {
            cls =
              "border-primary-500 bg-primary-50 text-primary-700 ring-4 ring-primary-500/10 cursor-pointer";
          }

          return (
            <button
              key={label}
              onClick={() => !isSubmitted && onChange(val)}
              disabled={isSubmitted}
              className={cn(
                "flex-1 py-6 rounded-xl text-xl font-black border-2 transition-all duration-200 flex flex-col items-center gap-2",
                cls,
              )}
            >
              {isSubmitted && isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-secondary-500" />
              ) : isSubmitted && isSelected ? (
                <XCircle className="w-6 h-6 text-red-400" />
              ) : null}
              {label}
            </button>
          );
        })}
      </div>

      {isSubmitted && question.explanation && (
        <div className="p-3 rounded-lg bg-secondary-50 border border-secondary-100 text-sm text-secondary-700 font-medium">
          💡 {question.explanation}
        </div>
      )}
    </div>
  );
}
