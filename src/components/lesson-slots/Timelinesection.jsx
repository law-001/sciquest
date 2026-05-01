import React from "react";
import { Clock } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "timeline"
 *
 * data shape:
 * {
 *   intro: string,
 *   steps: { num: number, title: string, color: string, description: string, tip?: string }[]
 * }
 */
export default function TimelineSection({ id, heading, data }) {
  const { intro, steps = [] } = data;

  if (steps.length === 0) return null;

  return (
    <section id={id}>
      <SectionHeading
        icon={<Clock className="w-5 h-5 text-primary-500" />}
        bg="bg-primary-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {intro && <p className="mb-6">{intro}</p>}

      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            {/* Vertical line + number */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full bg-${step.color}-100 flex items-center justify-center text-${step.color}-700 font-black text-sm shrink-0`}
              >
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 bg-${step.color}-200 mt-2`} />
              )}
            </div>

            {/* Content card */}
            <Card
              className={`flex-1 p-6 border-l-4 border-l-${step.color}-500 mb-0`}
            >
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                {step.title}
              </h3>
              <p className="text-stone-600 text-base">{step.description}</p>
              {step.tip && (
                <p className="text-sm text-stone-500 italic mt-3">
                  💡 Tip: {step.tip}
                </p>
              )}
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
