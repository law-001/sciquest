import React, { useState, useEffect, useRef } from "react";
import { FlaskConical } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

export default function ApplicationsSection({ id, heading, data }) {
  const { apps = [] } = data;
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

  if (apps.length === 0) return null;

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

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {apps.map((app, i) => (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
            }}
          >
            <Card
              className={`group p-6 border-l-4 ${app.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <span className="text-3xl mb-3 inline-block transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">
                {app.icon}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mb-2 transition-colors duration-300 group-hover:text-accent-700 dark:text-stone-100">
                {app.title}
              </h3>
              <p className="text-stone-600 text-base dark:text-stone-100">
                {app.description || app.desc}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
