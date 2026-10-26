import React from "react";
import { Copy, FileQuestion, Pencil, Plus, Trash2 } from "lucide-react";

import Button from "../Button";
import { getPlayableSetQuestions } from "../../lib/liveQuest";
import { cn } from "../../lib/utils";

const CARD =
  "rounded-2xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-800 p-5";

const ICON_BUTTON =
  "flex items-center justify-center w-11 h-11 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-primary-500";

// The teacher's own Live Quest question sets, newest edit first.
export function QuestionSetLibrary({ sets, isLoading, busySetId, onNew, onEdit, onDuplicate, onDelete }) {
  return (
    <section className={CARD} aria-labelledby="live-quest-sets-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h2
            id="live-quest-sets-heading"
            className="font-heading font-black text-stone-900 dark:text-white"
          >
            My question sets
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Write your own questions, then pick them in the lobby — on their own or
            mixed with lesson questions.
          </p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={onNew}>
          New set
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-stone-500 dark:text-stone-400">Loading your sets…</p>
      ) : !sets.length ? (
        <div className="flex flex-col items-center text-center gap-2 py-8 rounded-xl border-2 border-dashed border-orange-100 dark:border-stone-700">
          <FileQuestion className="w-8 h-8 text-stone-400" aria-hidden="true" />
          <p className="text-sm font-bold text-stone-600 dark:text-stone-300">No sets yet</p>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Click <strong>New set</strong> to write your first questions.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-orange-100 dark:divide-stone-700">
          {sets.map((set) => {
            const readyCount = getPlayableSetQuestions(set).length;
            const total = set.questions.length;
            const isBusy = busySetId === set.id;
            return (
              <li key={set.id} className="flex items-center gap-2 py-2">
                <button
                  type="button"
                  onClick={() => onEdit(set)}
                  className="flex-1 min-w-0 text-left rounded-lg px-2 py-2 min-h-[44px] hover:bg-orange-50 dark:hover:bg-stone-700/50 focus-visible:outline-2 focus-visible:outline-primary-500"
                >
                  <span className="block truncate font-bold text-stone-800 dark:text-stone-100">
                    {set.title}
                  </span>
                  <span
                    className={cn(
                      "block text-xs font-bold",
                      readyCount < total
                        ? "text-yellow-800 dark:text-yellow-300"
                        : "text-stone-500 dark:text-stone-400",
                    )}
                  >
                    {total} question{total === 1 ? "" : "s"}
                    {readyCount < total && ` · ${total - readyCount} unfinished`}
                    {set.updatedAt && ` · edited ${new Date(set.updatedAt).toLocaleDateString()}`}
                  </span>
                </button>
                <button
                  type="button"
                  className={ICON_BUTTON}
                  aria-label={`Edit ${set.title}`}
                  title="Edit"
                  disabled={isBusy}
                  onClick={() => onEdit(set)}
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={ICON_BUTTON}
                  aria-label={`Duplicate ${set.title}`}
                  title="Duplicate"
                  disabled={isBusy}
                  onClick={() => onDuplicate(set)}
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={cn(ICON_BUTTON, "hover:text-red-700 dark:hover:text-red-400")}
                  aria-label={`Delete ${set.title}`}
                  title="Delete"
                  disabled={isBusy}
                  onClick={() => onDelete(set)}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
