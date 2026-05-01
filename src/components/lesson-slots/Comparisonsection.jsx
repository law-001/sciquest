import React from "react";
import { Microscope } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "comparison"
 *
 * data shape:
 * {
 *   intro: string,
 *   left:  { label: string, color: string, items: string[] },
 *   right: { label: string, color: string, items: string[] }
 * }
 */
export default function ComparisonSection({ id, heading, data }) {
  const { intro, left, right } = data;

  if (!left || !right) return null;

  return (
    <section id={id}>
      <SectionHeading
        icon={<Microscope className="w-5 h-5 text-accent-500" />}
        bg="bg-accent-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {intro && <p className="mb-6">{intro}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <Card className={`p-6 border-t-4 border-t-${left.color}-500`}>
          <h3 className={`text-xl font-bold text-${left.color}-700 mb-4`}>
            {left.label}
          </h3>
          <ul className="space-y-3">
            {left.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full bg-${left.color}-100 flex items-center justify-center shrink-0 text-${left.color}-700 font-black text-xs mt-0.5`}
                >
                  {i + 1}
                </div>
                <p className="text-stone-700 text-base font-medium">{item}</p>
              </li>
            ))}
          </ul>
        </Card>

        {/* Right column */}
        <Card className={`p-6 border-t-4 border-t-${right.color}-500`}>
          <h3 className={`text-xl font-bold text-${right.color}-700 mb-4`}>
            {right.label}
          </h3>
          <ul className="space-y-3">
            {right.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full bg-${right.color}-100 flex items-center justify-center shrink-0 text-${right.color}-700 font-black text-xs mt-0.5`}
                >
                  {i + 1}
                </div>
                <p className="text-stone-700 text-base font-medium">{item}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
