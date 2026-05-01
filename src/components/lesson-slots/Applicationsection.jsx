import React from "react";
import { FlaskConical } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

/**
 * Slot type: "applications"
 *
 * data shape:
 * {
 *   apps: { title: string, description: string, icon: string, color: string }[]
 * }
 */
export default function ApplicationsSection({ id, heading, data }) {
  const { apps = [] } = data;

  if (apps.length === 0) return null;

  return (
    <section id={id}>
      <SectionHeading
        icon={<FlaskConical className="w-5 h-5 text-accent-500" />}
        bg="bg-accent-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {apps.map((app, i) => (
          <Card key={i} className={`p-6 border-l-4 ${app.color}`}>
            <span className="text-3xl mb-3 block">{app.icon}</span>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {app.title}
            </h3>
            <p className="text-stone-600 text-base">
              {app.description || app.desc}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
