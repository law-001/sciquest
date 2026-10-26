import React from "react";
import { Zap } from "lucide-react";

// The extras a teacher-written question can carry: a points badge and an
// image. Lesson-quiz questions have neither, so this renders nothing for them.
export function QuestionExtras({ question }) {
  const points = question?.points;
  const hasBadge = points === "double" || points === "none";
  if (!hasBadge && !question?.imageUrl) return null;

  return (
    <div className="flex flex-col gap-3">
      {hasBadge && (
        <span
          className={
            points === "double"
              ? "self-start flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200"
              : "self-start rounded-full px-3 py-1 text-xs font-black bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-200"
          }
        >
          {points === "double" && <Zap className="w-3.5 h-3.5" aria-hidden="true" />}
          {points === "double" ? "Double points" : "No points — just for fun"}
        </span>
      )}
      {question?.imageUrl && (
        <img
          src={question.imageUrl}
          alt=""
          width={640}
          height={360}
          className="w-full max-h-[320px] object-contain rounded-2xl bg-stone-100 dark:bg-stone-900"
        />
      )}
    </div>
  );
}
