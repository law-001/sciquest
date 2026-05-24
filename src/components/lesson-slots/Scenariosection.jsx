import React, { useState, useEffect, useRef } from "react";
import { FlaskConical } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

export default function ScenarioSection({ id, heading, data }) {
  const { intro, scenarios = [] } = data;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  if (scenarios.length === 0) return null;

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
        icon={<FlaskConical className="w-5 h-5 text-accent-500" />}
        bg="bg-accent-50"
      >
        <p className="dark:text-white">{heading}</p>
      </SectionHeading>

      {intro && <p className="mb-6">{intro}</p>}

      <div className="space-y-6">
        {scenarios.map((sc, i) => (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`,
            }}
          >
            <Card className="group p-6 border-l-4 border-l-accent-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-bold text-stone-900 mb-3 transition-colors duration-300 group-hover:text-accent-400 dark:text-stone-100">
                {sc.title}
              </h3>
              <p className="text-stone-600 text-base mb-4 dark:text-stone-300">
                {sc.situation}
              </p>
              <div className="bg-accent-100 dark:bg-accent-700/20 rounded-xl p-4 transition-all duration-300 group-hover:bg-accent-200 dark:group-hover:bg-accent-700/30 group-hover:scale-[1.01]">
                <p className="text-accent-800 dark:text-accent-300 font-bold text-sm mb-1">
                  🤔 Think About It:
                </p>
                <p className="text-stone-700 dark:text-stone-200 text-base">
                  {sc.question}
                </p>
              </div>
              <p className="text-sm text-stone-500 italic mt-3 transition-colors duration-300 group-hover:text-stone-600 dark:text-stone-300">
                Skill used: {sc.skill}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
