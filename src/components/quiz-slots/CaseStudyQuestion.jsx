import React from "react";
import { BookOpen } from "lucide-react";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { ShortAnswer } from "./ShortAnswer";

// Only the types expected as sub-questions — avoids circular imports
const SUB_MAP = {
  "multiple-choice": MultipleChoiceQuestion,
  "true-false": TrueFalseQuestion,
  "short-answer": ShortAnswer,
};

export function CaseStudyQuestion({
  question,
  value = {},
  onChange,
  isSubmitted,
}) {
  const handleSubChange = (subId, answer) => {
    onChange({ ...value, [subId]: answer });
  };

  return (
    <div className="space-y-6">
      {/* Scenario card */}
      <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200">
        <div className="flex items-center gap-2 text-amber-700 font-black text-sm uppercase tracking-wider mb-3">
          <BookOpen className="w-4 h-4" />
          Scenario
        </div>
        <p className="text-stone-700 font-medium leading-relaxed">
          {question.scenario}
        </p>
      </div>

      {/* Sub-questions */}
      <div className="space-y-8">
        {question.subQuestions.map((sub, i) => {
          const Component = SUB_MAP[sub.type];
          if (!Component) return null;

          return (
            <div key={sub.id} className="space-y-3">
              <p className="font-bold text-stone-800">
                <span className="text-primary-500 mr-2">{i + 1}.</span>
                {sub.question}
              </p>
              <Component
                question={sub}
                value={value[sub.id]}
                onChange={(answer) => handleSubChange(sub.id, answer)}
                isSubmitted={isSubmitted}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
