import React from "react";
import { BookOpen, Lightbulb } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "intro"
 *
 * data shape:
 * {
 *   paragraphs: string[],      // HTML strings rendered via dangerouslySetInnerHTML
 *   didYouKnow?: string        // optional callout card text
 * }
 */
export default function IntroSection({ id, heading, data }) {
  const { paragraphs = [], didYouKnow } = data;

  return (
    <section id={id}>
      <SectionHeading
        icon={<BookOpen className="w-5 h-5 text-primary-500" />}
        bg="bg-primary-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {paragraphs.map((p, i) => (
        <p key={i} className="mb-4" dangerouslySetInnerHTML={{ __html: p }} />
      ))}

      {didYouKnow && (
        <Card className="p-6 bg-secondary-50 border-secondary-200 mt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <h4 className="font-bold text-secondary-800 mb-1">
                Did You Know?
              </h4>
              <p className="text-secondary-700 text-base">{didYouKnow}</p>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}
