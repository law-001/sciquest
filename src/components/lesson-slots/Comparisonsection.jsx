import React, { useState, useEffect, useRef } from "react";
import { Microscope } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

export default function ComparisonSection({ id, heading, data }) {
  const { intro, left, right } = data;
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

  if (!left || !right) return null;

  const colStyle = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  });

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
        icon={<Microscope className="w-5 h-5 text-accent-500" />}
        bg="bg-accent-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {intro && <p className="mb-6">{intro}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div style={colStyle(0)}>
          <Card className={`group p-6 border-t-4 border-t-${left.color}-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full`}>
            <h3 className={`text-xl font-bold text-${left.color}-700 mb-4 transition-colors duration-300 group-hover:text-${left.color}-800`}>
              {left.label}
            </h3>
            <ul className="space-y-3">
              {left.items.map((item, i) => (
                <li
                  key={i}
                  className="group/item flex items-start gap-3 cursor-default"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-8px)",
                    transition: `opacity 0.4s ease ${i * 70}ms, transform 0.4s ease ${i * 70}ms`,
                  }}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-${left.color}-100 flex items-center justify-center shrink-0 text-${left.color}-700 font-black text-xs mt-0.5 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-${left.color}-200`}
                  >
                    {i + 1}
                  </div>
                  <p className="text-stone-700 text-base font-medium transition-transform duration-300 group-hover/item:translate-x-0.5">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div style={colStyle(120)}>
          <Card className={`group p-6 border-t-4 border-t-${right.color}-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full`}>
            <h3 className={`text-xl font-bold text-${right.color}-700 mb-4 transition-colors duration-300 group-hover:text-${right.color}-800`}>
              {right.label}
            </h3>
            <ul className="space-y-3">
              {right.items.map((item, i) => (
                <li
                  key={i}
                  className="group/item flex items-start gap-3 cursor-default"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-8px)",
                    transition: `opacity 0.4s ease ${i * 70 + 120}ms, transform 0.4s ease ${i * 70 + 120}ms`,
                  }}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-${right.color}-100 flex items-center justify-center shrink-0 text-${right.color}-700 font-black text-xs mt-0.5 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-${right.color}-200`}
                  >
                    {i + 1}
                  </div>
                  <p className="text-stone-700 text-base font-medium transition-transform duration-300 group-hover/item:translate-x-0.5">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
