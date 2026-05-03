import React, { useState, useEffect, useRef } from "react";
import { Dna } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

export default function DiagramSection({ id, heading, data }) {
  const { title, description, nodes = [] } = data;
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

  if (nodes.length === 0) return null;

  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });

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
        icon={<Dna className="w-5 h-5 text-primary-500" />}
        bg="bg-primary-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {description && <p className="mb-6">{description}</p>}

      <Card className="p-8">
        {title && (
          <h3 className="text-xl font-bold text-stone-900 mb-6 text-center">
            {title}
          </h3>
        )}

        <div className="flex flex-wrap justify-center gap-6">
          {nodes.map((node, i) => (
            <div
              key={node.id}
              className="flex flex-col items-center gap-2"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1) translateY(0)" : "scale(0.85) translateY(12px)",
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
              }}
            >
              <div
                className={`w-28 h-28 rounded-2xl bg-${node.color}-50 border-2 border-${node.color}-300 flex items-center justify-center text-center p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:border-${node.color}-400 cursor-default`}
              >
                <p className={`text-sm font-bold text-${node.color}-800`}>
                  {node.label}
                </p>
              </div>

              {node.connects && node.connects.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {node.connects.map((targetId) => {
                    const target = nodeMap[targetId];
                    if (!target) return null;
                    return (
                      <span
                        key={targetId}
                        className="text-xs font-medium text-stone-500 bg-stone-100 rounded-full px-2 py-0.5 transition-all duration-200 hover:bg-stone-200 hover:text-stone-700 cursor-default"
                      >
                        → {target.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
