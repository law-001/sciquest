import React, { useState, useEffect, useRef } from "react";
import { Microscope, ChevronRight } from "lucide-react";
import Card from "../Card";
import Badge from "../Badge";
import SectionHeading from "./SectionHeading";

export default function ImageCardsSection({ id, heading, data }) {
  const { cards = [] } = data;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  if (cards.length === 0) return null;

  return (
    <section
      id={id}
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <SectionHeading
        icon={<Microscope className="w-5 h-5 text-secondary-500" />}
        bg="bg-secondary-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {cards.map((m, i) => (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
            }}
          >
            <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={m.image}
                  alt={m.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />
                <Badge
                  variant={m.variant}
                  className="absolute bottom-4 left-4 transition-transform duration-300 group-hover:scale-105"
                >
                  {m.label}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-900 mb-2 transition-colors duration-300 group-hover:text-secondary-700">
                  {m.title}
                </h3>
                <p className="text-stone-600 text-base mb-3">{m.desc}</p>
                <p className="text-stone-500 text-sm italic">e.g.</p>
                <ul className="space-y-2 text-base text-stone-600">
                  {m.examples.map((ex, j) => (
                    <li
                      key={j}
                      className="group/ex flex items-start gap-2 cursor-default transition-colors duration-200 hover:text-stone-800"
                    >
                      <ChevronRight
                        className={`w-4 h-4 text-${m.color}-500 mt-1 shrink-0 transition-transform duration-200 group-hover/ex:translate-x-1`}
                      />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
