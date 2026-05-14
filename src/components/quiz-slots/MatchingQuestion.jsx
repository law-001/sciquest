import React from "react";
import { cn } from "../../lib/utils";

export function MatchingQuestion({
  question,
  value = {},
  onChange,
  isSubmitted,
}) {
  const handleSelect = (leftItem, rightItem) => {
    onChange({ ...value, [leftItem]: rightItem });
  };

  return (
    <div className="flex flex-col gap-3">
      {question.leftItems.map((left) => {
        const selected = value[left];
        const correct = question.correctPairs[left];
        const isCorrect = isSubmitted && selected === correct;
        const isWrong = isSubmitted && selected && selected !== correct;

        return (
          <div key={left} className="flex items-center gap-3">
            <div className="flex-1 p-3 rounded-xl bg-white dark:bg-stone-700 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-800 hover:border-orange-200 font-bold text-stone-700 text-sm">
              {left}
            </div>

            <span className="text-stone-400 font-black text-lg shrink-0">
              →
            </span>

            <div className="flex-1 space-y-1">
              <select
                value={selected || ""}
                onChange={(e) => handleSelect(left, e.target.value)}
                disabled={isSubmitted}
                className={cn(
                  "w-full p-3 rounded-xl border-2 font-bold text-sm appearance-none cursor-pointer focus:outline-none transition-colors dark:bg-stone-700 border-stone-200 dark:border-stone-800 hover:border-orange-200 ",
                  isCorrect
                    ? "border-secondary-400 bg-secondary-50 text-secondary-700"
                    : isWrong
                      ? "border-red-300 bg-red-50 text-red-700"
                      : selected
                        ? "border-primary-400 bg-primary-50 text-primary-700"
                        : "border-orange-200 bg-white text-stone-400",
                )}
              >
                <option value="">Select a match…</option>
                {question.rightItems.map((right) => (
                  <option key={right} value={right}>
                    {right}
                  </option>
                ))}
              </select>

              {isWrong && (
                <p className="text-xs text-secondary-600 font-bold pl-1">
                  Correct: {correct}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
