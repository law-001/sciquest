import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { cn } from "../../lib/utils";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function OrderingQuestion({ question, value, onChange, isSubmitted }) {
  const [order, setOrder] = useState(() =>
    value?.length === question.items.length ? value : shuffle(question.items),
  );

  // On first render: push initial shuffled state up to parent if not restored
  const synced = useRef(false);
  useEffect(() => {
    if (!synced.current) {
      synced.current = true;
      if (!value?.length) onChange(order);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When parent pushes a restored value (e.g. localStorage), sync down
  useEffect(() => {
    if (value?.length === question.items.length) setOrder(value);
  }, [value, question.items.length]);

  const move = (i, dir) => {
    const next = [...order];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setOrder(next);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {order.map((item, i) => {
        const isCorrectPos = isSubmitted && item === question.items[i];
        const isWrongPos = isSubmitted && item !== question.items[i];

        return (
          <div
            key={item}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 font-bold transition-all",
              isCorrectPos
                ? "border-secondary-400 bg-secondary-50 text-secondary-700"
                : isWrongPos
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-orange-200 bg-white text-stone-700 dark:bg-stone-700 dark:text-stone-100",
            )}
          >
            <span className="w-6 text-center text-xs font-black text-stone-400 shrink-0">
              {i + 1}
            </span>
            <GripVertical className="w-4 h-4 text-stone-300 shrink-0" />
            <span className="flex-1 text-sm">{item}</span>

            {!isSubmitted && (
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1.5 rounded-lg hover:bg-orange-100 disabled:opacity-20 transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  className="p-1.5 rounded-lg hover:bg-orange-100 disabled:opacity-20 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {isSubmitted && (
        <div className="p-3 rounded-lg bg-secondary-50 border border-secondary-100 text-sm text-secondary-700 font-medium">
          <strong>Correct order:</strong>
          <ol className="mt-1 list-decimal list-inside space-y-0.5">
            {question.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
