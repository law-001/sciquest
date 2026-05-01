import React from "react";
import { Award } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "conceptList"
 *
 * data shape:
 * {
 *   concepts: string[]
 * }
 */
export default function ConceptListSection({ id, heading, data }) {
  const { concepts = [] } = data;

  if (concepts.length === 0) return null;

  return (
    <section id={id}>
      <SectionHeading
        icon={<Award className="w-5 h-5 text-secondary-500" />}
        bg="bg-secondary-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      <Card className="p-8 bg-secondary-50 border-secondary-200">
        <ol className="space-y-4">
          {concepts.map((point, i) => (
            <li key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center shrink-0 text-secondary-800 font-black text-sm">
                {i + 1}
              </div>
              <p className="text-secondary-800 text-base font-medium pt-1">
                {point}
              </p>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
