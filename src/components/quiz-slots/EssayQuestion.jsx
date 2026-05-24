import React from "react";
import { cn } from "../../lib/utils";

export function EssayQuestion({ question, value = "", onChange, isSubmitted }) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const minWords = question.minWords ?? 50;
  const meetsMin = words >= minWords;

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isSubmitted}
        placeholder={`Write your response here (minimum ${minWords} words)...`}
        rows={9}
        className="w-full p-4 rounded-xl border-2 border-orange-200 focus:border-primary-400 focus:outline-none text-stone-700 font-medium resize-none bg-white/60 transition-colors disabled:opacity-70 dark:bg-stone-800"
      />

      <div className="flex justify-between items-center text-xs font-bold pl-1">
        <span
          className={cn(meetsMin ? "text-secondary-600" : "text-stone-400")}
        >
          {words} / {minWords} words minimum
          {meetsMin && " ✓"}
        </span>
        {isSubmitted && (
          <span className="text-amber-600">Essay submitted for review</span>
        )}
      </div>
    </div>
  );
}
