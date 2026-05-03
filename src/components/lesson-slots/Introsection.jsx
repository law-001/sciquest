import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Lightbulb } from "lucide-react";
import Card from "../Card";
import SectionHeading from "./SectionHeading";

export default function IntroSection({ id, heading, data }) {
  const { paragraphs = [], didYouKnow } = data;
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

  const fadeUp = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: "opacity 0.6s ease, transform 0.6s ease",
  };

  return (
    <section id={id} ref={ref} style={fadeUp}>
      <SectionHeading
        icon={<BookOpen className="w-5 h-5 text-primary-500" />}
        bg="bg-primary-50"
      >
        <p>{heading}</p>
      </SectionHeading>

      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="mb-4 leading-relaxed"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
          }}
          dangerouslySetInnerHTML={{ __html: p }}
        />
      ))}

      {didYouKnow && (
        <Card
          className="p-6 bg-secondary-50 border-secondary-200 mt-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.5s ease ${paragraphs.length * 80}ms, transform 0.5s ease ${paragraphs.length * 80}ms`,
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-12">
              <Lightbulb className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <h4 className="font-bold text-secondary-800 mb-1">Did You Know?</h4>
              <p className="text-secondary-700 text-base">{didYouKnow}</p>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}
