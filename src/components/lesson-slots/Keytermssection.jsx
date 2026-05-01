import React from "react";
import { Award } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "keyTerms"
 *
 * data shape:
 * {
 *   terms: { term: string, desc: string }[]
 * }
 */
export default function KeyTermsSection({ id, heading, data }) {
  const { terms = [] } = data;

  if (terms.length === 0) return null;

  return (
    <section id={id}>
      <SectionHeading
        icon={<Award className="w-5 h-5 text-secondary-500" />}
        bg="bg-secondary-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      <Card className="p-8 bg-secondary-50 border-secondary-200">
        <ol className="space-y-5">
          {terms.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center shrink-0 text-secondary-800 font-black text-sm mt-3">
                {i + 1}
              </div>
              <p className="text-secondary-800 text-base font-medium pt-1">
                <span className="font-bold text-secondary-700">
                  {item.term}:
                </span>{" "}
                {item.desc}
              </p>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
