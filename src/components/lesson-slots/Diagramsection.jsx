import React from "react";
import { Dna } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "diagram"
 *
 * data shape:
 * {
 *   title: string,
 *   description: string,
 *   nodes: { id: string, label: string, color: string, connects: string[] }[]
 * }
 *
 * Renders a visual node-and-arrow relationship diagram.
 * Each node shows its label and draws arrows to its connected nodes.
 */
export default function DiagramSection({ id, heading, data }) {
  const { title, description, nodes = [] } = data;

  if (nodes.length === 0) return null;

  // Build a lookup for quick label access
  const nodeMap = {};
  nodes.forEach((n) => {
    nodeMap[n.id] = n;
  });

  return (
    <section id={id}>
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
          {nodes.map((node) => (
            <div key={node.id} className="flex flex-col items-center gap-2">
              {/* Node bubble */}
              <div
                className={`w-28 h-28 rounded-2xl bg-${node.color}-50 border-2 border-${node.color}-300 flex items-center justify-center text-center p-3`}
              >
                <p className={`text-sm font-bold text-${node.color}-800`}>
                  {node.label}
                </p>
              </div>

              {/* Connection labels */}
              {node.connects && node.connects.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {node.connects.map((targetId) => {
                    const target = nodeMap[targetId];
                    if (!target) return null;
                    return (
                      <span
                        key={targetId}
                        className="text-xs font-medium text-stone-500 bg-stone-100 rounded-full px-2 py-0.5"
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
