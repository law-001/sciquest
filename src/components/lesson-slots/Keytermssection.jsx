import React, { useState, useEffect, useRef } from "react";
import { Award } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

export default function KeyTermsSection({ id, heading, data }) {
  const { terms = [] } = data;
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

  if (terms.length === 0) return null;

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
        icon={<Award className="w-5 h-5 text-secondary-500" />}
        bg="bg-secondary-50"
      >
        <p className="dark:text-white">{heading}</p>
      </SectionHeading>

      <Card className="p-8 bg-secondary-50 dark:bg-secondary-700/20 border-secondary-200 dark:border-secondary-700/40">
        <ol className="space-y-5">
          {terms.map((item, i) => (
            <li
              key={i}
              className="group/item flex items-start gap-4 cursor-default"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
              }}
            >
              <div className="w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-700/40 flex items-center justify-center shrink-0 text-stone-700 dark:text-secondary-200 font-black text-sm mt-3 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-secondary-300 dark:group-hover/item:bg-secondary-600/50">
                {i + 1}
              </div>
              <p className="text-secondary-800 dark:text-stone-200 text-base font-medium pt-1 transition-colors duration-300 group-hover/item:text-secondary-900 dark:group-hover/item:text-white">
                <span className="font-bold text-secondary-500 dark:text-secondary-400 group-hover/item:text-secondary-700 dark:group-hover/item:text-secondary-300 transition-colors duration-300">
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
