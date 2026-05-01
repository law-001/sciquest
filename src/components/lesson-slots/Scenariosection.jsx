import React from "react";
import { FlaskConical } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "scenario"
 *
 * data shape:
 * {
 *   intro: string,
 *   scenarios: { title: string, situation: string, question: string, skill: string }[]
 * }
 */
export default function ScenarioSection({ id, heading, data }) {
  const { intro, scenarios = [] } = data;

  if (scenarios.length === 0) return null;

  return (
    <section id={id}>
      <SectionHeading
        icon={<FlaskConical className="w-5 h-5 text-accent-500" />}
        bg="bg-accent-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {intro && <p className="mb-6">{intro}</p>}

      <div className="space-y-6">
        {scenarios.map((sc, i) => (
          <Card key={i} className="p-6 border-l-4 border-l-accent-500">
            <h3 className="text-xl font-bold text-stone-900 mb-3">
              {sc.title}
            </h3>
            <p className="text-stone-600 text-base mb-4">{sc.situation}</p>
            <div className="bg-accent-50 rounded-xl p-4">
              <p className="text-accent-800 font-bold text-sm mb-1">
                🤔 Think About It:
              </p>
              <p className="text-accent-700 text-base">{sc.question}</p>
            </div>
            <p className="text-sm text-stone-500 italic mt-3">
              Skill used: {sc.skill}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
