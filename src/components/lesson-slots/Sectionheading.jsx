import React from "react";

export default function SectionHeading({ icon, bg, children }) {
  return (
    <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center transition-transform duration-300 hover:scale-110`}
      >
        {icon}
      </div>
      {children}
    </h2>
  );
}
