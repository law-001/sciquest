import React from "react";

const darkBgMap = {
  "bg-primary-50": "dark:bg-primary-700/20",
  "bg-secondary-50": "dark:bg-secondary-700/20",
  "bg-accent-50": "dark:bg-accent-700/20",
};

export default function SectionHeading({ icon, bg, children }) {
  const darkBg = darkBgMap[bg] ?? "dark:bg-stone-700/50";
  return (
    <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-6 flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl ${bg} ${darkBg} flex items-center justify-center transition-transform duration-300 hover:scale-110`}
      >
        {icon}
      </div>
      {children}
    </h2>
  );
}
