import React from "react";
import { cn } from "../../lib/utils";

export function FillInTheBlanks({ question, value = [], onChange, isSubmitted }) {
  const parts = question.question.split("___");

  const handleChange = (index, text) => {
    const next = [...value];
    next[index] = text;
    onChange(next);
  };

  const isBlankCorrect = (i) =>
    question.blanks[i]?.toLowerCase().trim() ===
    value[i]?.toLowerCase().trim();

  return (
    <div className="space-y-3">
      <div className="text-lg font-medium text-stone-800 leading-loose">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="inline-flex items-center mx-1">
                <input
                  type="text"
                  value={value[i] || ""}
                  onChange={(e) => handleChange(i, e.target.value)}
                  disabled={isSubmitted}
                  placeholder="..."
                  className={cn(
                    "border-b-2 bg-transparent px-2 py-0.5 text-center font-bold focus:outline-none min-w-28 transition-colors",
                    isSubmitted
                      ? isBlankCorrect(i)
                        ? "border-secondary-500 text-secondary-700"
                        : "border-red-400 text-red-600"
                      : "border-primary-400 text-primary-700 focus:border-primary-600",
                  )}
                />
                {isSubmitted && !isBlankCorrect(i) && (
                  <span className="ml-1 text-xs font-bold text-secondary-600">
                    ({question.blanks[i]})
                  </span>
                )}
              </span>
            )}
          </span>
        ))}
      </div>

      {isSubmitted && question.explanation && (
        <div className="p-3 rounded-lg bg-secondary-50 border border-secondary-100 text-sm text-secondary-700 font-medium">
          💡 {question.explanation}
        </div>
      )}
    </div>
  );
}
