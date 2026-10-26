import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Copy,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import Button from "../Button";
import {
  MAX_IMAGE_BYTES,
  OPTION_MAX_LENGTH,
  POINTS_OPTIONS,
  QUESTION_MAX_LENGTH,
  SECONDS_OPTIONS,
  createBlankQuestion,
  getSetQuestionIssues,
  saveQuestionSet,
  uploadLiveQuestImage,
} from "../../lib/liveQuest";
import { cn } from "../../lib/utils";
import { formatOption, getOptionStyle } from "./options";

const CARD =
  "rounded-2xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-800 p-5";

const FIELD =
  "w-full min-h-[44px] rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 text-sm font-bold text-stone-800 dark:text-stone-100 focus-visible:outline-2 focus-visible:outline-primary-500";

const ICON_BUTTON =
  "flex items-center justify-center w-11 h-11 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-primary-500";

// Kahoot-style editor for one Live Quest set: question list on the left, the
// selected question on the right. Nothing is written until Save.
export function QuestionSetEditor({ ownerId, set, onSaved, onBack }) {
  const [draft, setDraft] = useState(() => ({
    id: set.id ?? null,
    title: set.title ?? "",
    questions: set.questions?.length ? set.questions : [createBlankQuestion()],
  }));
  const [selected, setSelected] = useState(0);
  const [isDirty, setIsDirty] = useState(!set.id);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const safeSelected = Math.min(selected, draft.questions.length - 1);
  const question = draft.questions[safeSelected];
  const issues = question ? getSetQuestionIssues(question) : [];

  function updateDraft(patch) {
    setDraft((prev) => ({ ...prev, ...patch }));
    setIsDirty(true);
  }

  function updateQuestion(patch) {
    updateDraft({
      questions: draft.questions.map((q, i) => (i === safeSelected ? { ...q, ...patch } : q)),
    });
  }

  function addQuestion() {
    updateDraft({ questions: [...draft.questions, createBlankQuestion()] });
    setSelected(draft.questions.length);
  }

  function duplicateQuestion() {
    const copy = { ...question, id: crypto.randomUUID() };
    const next = [...draft.questions];
    next.splice(safeSelected + 1, 0, copy);
    updateDraft({ questions: next });
    setSelected(safeSelected + 1);
  }

  function deleteQuestion() {
    const next = draft.questions.filter((_, i) => i !== safeSelected);
    updateDraft({ questions: next.length ? next : [createBlankQuestion()] });
    setSelected(Math.max(0, safeSelected - 1));
  }

  function moveQuestion(offset) {
    const target = safeSelected + offset;
    const next = [...draft.questions];
    [next[safeSelected], next[target]] = [next[target], next[safeSelected]];
    updateDraft({ questions: next });
    setSelected(target);
  }

  function changeType(type) {
    if (type === question.type) return;
    const blank = createBlankQuestion(type);
    updateQuestion({ type, options: blank.options, correctIndexes: [] });
  }

  function setOptionText(index, text) {
    updateQuestion({ options: question.options.map((o, i) => (i === index ? text : o)) });
  }

  // Multiple choice: any number of answers can be correct. True/false: one.
  function toggleCorrect(index) {
    if (question.type === "true-false") {
      updateQuestion({ correctIndexes: [index] });
      return;
    }
    const isCorrect = question.correctIndexes.includes(index);
    updateQuestion({
      correctIndexes: isCorrect
        ? question.correctIndexes.filter((i) => i !== index)
        : [...question.correctIndexes, index].sort(),
    });
  }

  async function handleImagePick(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Images must be 2 MB or smaller.");
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      const imageUrl = await uploadLiveQuestImage(file, ownerId);
      updateQuestion({ imageUrl });
    } catch (err) {
      setError(err.message ?? "Couldn't upload the image.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave() {
    setError(null);
    setIsSaving(true);
    try {
      const saved = await saveQuestionSet(ownerId, draft);
      setDraft((prev) => ({ ...prev, id: saved.id, title: saved.title }));
      setIsDirty(false);
      onSaved(saved);
    } catch (err) {
      setError(err.message ?? "Couldn't save the set.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    if (isDirty && !window.confirm("Leave without saving? Your changes will be lost.")) return;
    onBack();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={cn(CARD, "flex flex-wrap items-center gap-3 py-3")}>
        <button type="button" className={ICON_BUTTON} aria-label="Back to Live Quest" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <label htmlFor="live-quest-set-title" className="sr-only">
          Set title
        </label>
        <input
          id="live-quest-set-title"
          value={draft.title}
          maxLength={120}
          placeholder="Untitled set"
          onChange={(event) => updateDraft({ title: event.target.value })}
          className={cn(FIELD, "flex-1 min-w-[200px] text-base font-black")}
        />
        <span className="text-xs font-bold text-stone-500 dark:text-stone-400" aria-live="polite">
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </span>
        <Button
          variant="primary"
          leftIcon={<Save className="w-4 h-4" />}
          isLoading={isSaving}
          disabled={!isDirty || isUploading}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm font-bold"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <nav className={cn(CARD, "p-3 flex flex-col gap-2")} aria-label="Questions in this set">
          <ol className="flex flex-col gap-1 max-h-[560px] overflow-y-auto">
            {draft.questions.map((q, index) => {
              const isDone = !getSetQuestionIssues(q).length;
              const isActive = index === safeSelected;
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setSelected(index)}
                    className={cn(
                      "w-full flex items-start gap-2 rounded-xl px-3 py-2 min-h-[44px] text-left border-2 focus-visible:outline-2 focus-visible:outline-primary-500",
                      isActive
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-transparent hover:bg-orange-50 dark:hover:bg-stone-700/50",
                    )}
                  >
                    <span className="shrink-0 font-black text-stone-500 dark:text-stone-400">
                      {index + 1}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block truncate text-sm font-bold text-stone-800 dark:text-stone-100">
                        {q.question.trim() || "Empty question"}
                      </span>
                      <span className="block text-xs text-stone-500 dark:text-stone-400">
                        {q.type === "true-false" ? "True / False" : "Multiple choice"}
                      </span>
                    </span>
                    {!isDone && (
                      <AlertTriangle
                        className="w-4 h-4 shrink-0 text-yellow-700 dark:text-yellow-400"
                        aria-label="Unfinished"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={addQuestion}>
            Add question
          </Button>
        </nav>

        {question && (
          <section className={cn(CARD, "flex flex-col gap-5 min-w-0")} aria-label={`Question ${safeSelected + 1}`}>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[140px]">
                <label htmlFor="lq-type" className="block mb-1 text-xs font-black uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  Type
                </label>
                <select id="lq-type" value={question.type} onChange={(e) => changeType(e.target.value)} className={FIELD}>
                  <option value="multiple-choice">Multiple choice</option>
                  <option value="true-false">True / False</option>
                </select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label htmlFor="lq-seconds" className="block mb-1 text-xs font-black uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  Time limit
                </label>
                <select
                  id="lq-seconds"
                  value={question.seconds ?? ""}
                  onChange={(e) => updateQuestion({ seconds: e.target.value ? Number(e.target.value) : null })}
                  className={FIELD}
                >
                  <option value="">Room default</option>
                  {SECONDS_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value} seconds
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label htmlFor="lq-points" className="block mb-1 text-xs font-black uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  Points
                </label>
                <select
                  id="lq-points"
                  value={question.points}
                  onChange={(e) => updateQuestion({ points: e.target.value })}
                  className={FIELD}
                >
                  {POINTS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className={ICON_BUTTON}
                  aria-label="Move question up"
                  title="Move up"
                  disabled={safeSelected === 0}
                  onClick={() => moveQuestion(-1)}
                >
                  <ArrowUp className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={ICON_BUTTON}
                  aria-label="Move question down"
                  title="Move down"
                  disabled={safeSelected === draft.questions.length - 1}
                  onClick={() => moveQuestion(1)}
                >
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={ICON_BUTTON}
                  aria-label="Duplicate question"
                  title="Duplicate"
                  onClick={duplicateQuestion}
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={cn(ICON_BUTTON, "hover:text-red-700 dark:hover:text-red-400")}
                  aria-label="Delete question"
                  title="Delete"
                  onClick={deleteQuestion}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="lq-question" className="block mb-1 text-xs font-black uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Question
              </label>
              <textarea
                id="lq-question"
                rows={3}
                maxLength={QUESTION_MAX_LENGTH}
                value={question.question}
                placeholder="Type your question"
                onChange={(e) => updateQuestion({ question: e.target.value })}
                className={cn(FIELD, "py-3 text-lg font-bold resize-y")}
              />
              <p className="mt-1 text-right text-xs text-stone-500 dark:text-stone-400">
                {question.question.length}/{QUESTION_MAX_LENGTH}
              </p>
            </div>

            {question.imageUrl ? (
              <div className="flex flex-col gap-2">
                <img
                  src={question.imageUrl}
                  alt=""
                  width={640}
                  height={360}
                  className="w-full max-h-[280px] object-contain rounded-2xl bg-stone-100 dark:bg-stone-900"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<X className="w-4 h-4" />}
                  onClick={() => updateQuestion({ imageUrl: null })}
                  className="self-start"
                >
                  Remove image
                </Button>
              </div>
            ) : (
              <label
                className={cn(
                  "flex items-center justify-center gap-2 min-h-[88px] rounded-2xl border-2 border-dashed border-orange-200 dark:border-stone-600 text-sm font-bold text-stone-600 dark:text-stone-300 focus-within:outline-2 focus-within:outline-primary-500",
                  isUploading ? "opacity-60 cursor-wait" : "cursor-pointer hover:bg-orange-50 dark:hover:bg-stone-700/50",
                )}
              >
                <ImagePlus className="w-5 h-5" aria-hidden="true" />
                {isUploading ? "Uploading…" : "Add an image (optional, up to 2 MB)"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={isUploading}
                  onChange={handleImagePick}
                />
              </label>
            )}

            <fieldset>
              <legend className="mb-2 text-xs font-black uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Answers{" "}
                <span className="normal-case tracking-normal font-bold">
                  {question.type === "true-false"
                    ? "— pick the correct one"
                    : "— tick every answer that should score; blanks are skipped"}
                </span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {question.options.map((option, index) => {
                  const style = getOptionStyle(index);
                  const isCorrect = question.correctIndexes.includes(index);
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-2 rounded-2xl p-2 border-2",
                        isCorrect ? "border-secondary-500" : "border-transparent",
                        style.tile,
                      )}
                    >
                      <style.Icon className="w-5 h-5 shrink-0 ml-1" aria-hidden="true" />
                      <span className="font-black">{style.letter}</span>
                      {question.type === "true-false" ? (
                        <span className="flex-1 min-w-0 px-2 text-lg font-bold">{formatOption(option)}</span>
                      ) : (
                        <input
                          value={option}
                          maxLength={OPTION_MAX_LENGTH}
                          aria-label={`Answer ${style.letter}`}
                          placeholder={index < 2 ? `Answer ${index + 1}` : `Answer ${index + 1} (optional)`}
                          onChange={(e) => setOptionText(index, e.target.value)}
                          className="flex-1 min-w-0 min-h-[44px] rounded-xl bg-white/95 dark:bg-stone-900/90 px-3 text-sm font-bold text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-white"
                        />
                      )}
                      <button
                        type="button"
                        aria-pressed={isCorrect}
                        aria-label={`Mark answer ${style.letter} correct`}
                        onClick={() => toggleCorrect(index)}
                        className={cn(
                          "shrink-0 flex items-center gap-1 rounded-xl px-3 min-h-[44px] text-xs font-black focus-visible:outline-2 focus-visible:outline-white",
                          isCorrect
                            ? "bg-secondary-600 text-white"
                            : "bg-white/90 text-stone-700 dark:bg-stone-900/80 dark:text-stone-200",
                        )}
                      >
                        <Check className={cn("w-4 h-4", !isCorrect && "opacity-30")} aria-hidden="true" />
                        {isCorrect ? "Correct" : "Mark"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {issues.length > 0 && (
              <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 px-4 py-3 text-sm text-yellow-900 dark:text-yellow-200">
                <p className="flex items-center gap-2 font-black">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  Not ready to play yet — it&apos;s skipped until you:
                </p>
                <ul className="mt-1 ml-6 list-disc">
                  {issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
