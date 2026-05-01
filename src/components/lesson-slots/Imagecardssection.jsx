import React from "react";
import { Microscope, ChevronRight } from "lucide-react";
import Card from "../Card";
import Badge from "../Badge";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "imageCards"
 *
 * data shape:
 * {
 *   cards: {
 *     title: string,
 *     label: string,
 *     variant: string,
 *     color: string,
 *     image: string,        // imported asset or URL
 *     imageAlt: string,
 *     desc: string,
 *     examples: string[]
 *   }[]
 * }
 */
export default function ImageCardsSection({ id, heading, data }) {
  const { cards = [] } = data;

  if (cards.length === 0) return null;

  return (
    <section id={id}>
      <SectionHeading
        icon={<Microscope className="w-5 h-5 text-secondary-500" />}
        bg="bg-secondary-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {cards.map((m, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 relative overflow-hidden">
              <img
                src={m.image}
                alt={m.imageAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />
              <Badge variant={m.variant} className="absolute bottom-4 left-4">
                {m.label}
              </Badge>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                {m.title}
              </h3>
              <p className="text-stone-600 text-base mb-3">{m.desc}</p>
              <p className="text-stone-500 text-sm italic">e.g.</p>
              <ul className="space-y-2 text-base text-stone-600">
                {m.examples.map((ex, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <ChevronRight
                      className={`w-4 h-4 text-${m.color}-500 mt-1 shrink-0`}
                    />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
