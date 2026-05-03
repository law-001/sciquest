import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

export default function TimelineSection({ id, heading, data }) {
  const { intro, steps = [] } = data;
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

  if (steps.length === 0) return null;

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
        icon={<Clock className="w-5 h-5 text-primary-500" />}
        bg="bg-primary-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {intro && <p className="mb-6">{intro}</p>}

      <div className="space-y-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex gap-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-16px)",
              transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
            }}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full bg-${step.color}-100 flex items-center justify-center text-${step.color}-700 font-black text-sm shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-md cursor-default`}
              >
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 bg-${step.color}-200 mt-2`} />
              )}
            </div>

            <Card
              className={`group flex-1 p-6 border-l-4 border-l-${step.color}-500 mb-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
            >
              <h3 className="text-xl font-bold text-stone-900 mb-2 transition-colors duration-300 group-hover:text-primary-700">
                {step.title}
              </h3>
              <p className="text-stone-600 text-base">{step.description}</p>
              {step.tip && (
                <p className="text-sm text-stone-500 italic mt-3 transition-colors duration-300 group-hover:text-stone-600">
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
