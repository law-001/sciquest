import React from "react";

/**
 * Shared heading used by every slot component.
 * Identical to the original SectionHeading in LessonTemplate.
 */
export default function SectionHeading({ icon, bg, children }) {
  return (
    <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
      >
        {icon}
      </div>
      {children}
    </h2>
  );
}
