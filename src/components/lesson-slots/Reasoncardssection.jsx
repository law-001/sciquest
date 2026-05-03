import React, { useState, useEffect, useRef } from "react";
import { Dna } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

export default function ReasonCardsSection({ id, heading, data }) {
  const { intro, reasons = [] } = data;
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

  if (!intro && reasons.length === 0) return null;

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
        icon={<Dna className="w-5 h-5 text-accent-500" />}
        bg="bg-accent-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {intro && <p className="mb-6">{intro}</p>}

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {reasons.map((item, i) => (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
            }}
          >
            <Card
              className={`group p-6 border-l-4 border-l-${item.color}-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-${item.color}-50 flex items-center justify-center text-${item.color}-500 font-black text-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-${item.color}-100`}
                >
                  {item.num}
                </div>
                <h3 className="text-xl font-bold text-stone-900 transition-colors duration-300 group-hover:text-accent-700">
                  {item.title}
                </h3>
              </div>
              <p className="text-stone-600 text-base mb-3">{item.desc}</p>
              <p className="text-stone-500 text-sm italic transition-colors duration-300 group-hover:text-stone-600">
                {item.content}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
