import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const INPUT =
  "w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors resize-none";
const LABEL =
  "block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1";

export default function IntroForm({
  initialHeading,
  initialData,
  onSubmit,
  onCancel,
}) {
  const [heading, setHeading] = useState(initialHeading || "");
  const [paragraphs, setParagraphs] = useState(
    initialData?.paragraphs?.length ? initialData.paragraphs : [""],
  );
  const [didYouKnow, setDidYouKnow] = useState(initialData?.didYouKnow || "");

  function handleSubmit(e) {
    e.preventDefault();
    const cleanParas = paragraphs.filter((p) => p.trim());
    onSubmit(heading, {
      paragraphs: cleanParas,
      didYouKnow: didYouKnow.trim() || undefined,
    });
  }

  function updatePara(i, val) {
    const next = [...paragraphs];
    next[i] = val;
    setParagraphs(next);
  }

  function addPara() {
    setParagraphs([...paragraphs, ""]);
  }

  function removePara(i) {
    if (paragraphs.length === 1) return;
    setParagraphs(paragraphs.filter((_, idx) => idx !== i));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input
          className={INPUT}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="e.g. Overview"
          required
        />
      </div>

      <div>
        <label className={LABEL}>Paragraphs</label>
        <div className="space-y-2">
          {paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                className={INPUT + " min-h-20"}
                value={p}
                onChange={(e) => updatePara(i, e.target.value)}
                placeholder={`Paragraph ${i + 1}`}
                rows={3}
              />
              <button
                type="button"
                onClick={() => removePara(i)}
                disabled={paragraphs.length === 1}
                className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Remove paragraph"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPara}
          className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <Plus className="w-3.5 h-3.5" /> Add Paragraph
        </button>
      </div>

      <div>
        <label className={LABEL}>
          Did You Know?{" "}
          <span className="normal-case font-normal text-stone-400">
            (optional)
          </span>
        </label>
        <textarea
          className={INPUT + " min-h-15"}
          value={didYouKnow}
          onChange={(e) => setDidYouKnow(e.target.value)}
          placeholder="A fun or surprising fact about this topic"
          rows={2}
        />
      </div>

      <FormActions onCancel={onCancel} />
    </form>
  );
}

function FormActions({ onCancel }) {
  return (
    <div className="flex gap-3 pt-4 border-t border-orange-100 dark:border-stone-700">
      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm transition-colors"
      >
        Save Section
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 font-bold text-sm hover:bg-orange-50 dark:hover:bg-stone-700 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
