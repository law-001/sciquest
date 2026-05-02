import React from "react";
import { ImageOff } from "lucide-react";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";

export function PictureBasedQuestion({
  question,
  value,
  onChange,
  isSubmitted,
}) {
  return (
    <div className="space-y-5">
      {/* Image */}
      <div className="rounded-2xl overflow-hidden border-2 border-orange-100 bg-stone-100 flex items-center justify-center min-h-48">
        {question.imageUrl ? (
          <img
            src={question.imageUrl}
            alt={question.imageAlt ?? "Question image"}
            className="w-full max-h-72 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={question.imageUrl ? "hidden" : "flex flex-col items-center gap-2 py-10 text-stone-400"}>
          <ImageOff className="w-10 h-10" />
          <span className="text-sm font-medium">
            {question.imageAlt ?? "Image not available"}
          </span>
        </div>
      </div>

      {/* Options reuse MultipleChoiceQuestion */}
      <MultipleChoiceQuestion
        question={question}
        value={value}
        onChange={onChange}
        isSubmitted={isSubmitted}
      />
    </div>
  );
}
