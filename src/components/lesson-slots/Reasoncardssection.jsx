import React from "react";
import { Dna } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "reasonCards"
 *
 * data shape:
 * {
 *   intro: string,
 *   reasons: { num: number, title: string, color: string, desc: string, content: string }[]
 * }
 */
export default function ReasonCardsSection({ id, heading, data }) {
  const { intro, reasons = [] } = data;

  if (!intro && reasons.length === 0) return null;

  return (
    <section id={id}>
      <SectionHeading
        icon={<Dna className="w-5 h-5 text-accent-500" />}
        bg="bg-accent-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {intro && <p className="mb-6">{intro}</p>}

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {reasons.map((item, i) => (
          <Card key={i} className={`p-6 border-l-4 border-l-${item.color}-500`}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-8 h-8 rounded-lg bg-${item.color}-50 flex items-center justify-center text-${item.color}-500 font-black text-sm`}
              >
                {item.num}
              </div>
              <h3 className="text-xl font-bold text-stone-900">{item.title}</h3>
            </div>
            <p className="text-stone-600 text-base mb-3">{item.desc}</p>
            <p className="text-stone-500 text-sm italic">{item.content}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
