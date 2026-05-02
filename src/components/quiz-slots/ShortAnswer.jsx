import React from "react";

export function ShortAnswer({ question, value = "", onChange, isSubmitted }) {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isSubmitted}
        placeholder="Type your answer here..."
        rows={4}
        className="w-full p-4 rounded-xl border-2 border-orange-200 focus:border-primary-400 focus:outline-none text-stone-700 font-medium resize-none bg-white/60 transition-colors disabled:opacity-70"
      />

      {question.rubric && !isSubmitted && (
        <p className="text-xs text-stone-400 font-medium pl-1">
          Hint: {question.rubric}
        </p>
      )}

      {isSubmitted && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-700 font-medium">
          ⭐ Short-answer responses are reviewed manually for full credit.
        </div>
      )}
    </div>
  );
}
