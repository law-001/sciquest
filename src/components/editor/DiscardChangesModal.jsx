import React from 'react'
import { AlertTriangle } from 'lucide-react'

import { useModalDismiss } from '../../hooks/useModalDismiss'

// Follows the confirm-modal shape the teacher portal already uses
// (DeleteLessonModal et al.): danger icon, plain-language consequence,
// Cancel first so the destructive button is never the muscle-memory target.
export default function DiscardChangesModal({ label = 'changes', onConfirm, onClose }) {
  const panelRef = useModalDismiss(onClose)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="discard-changes-title"
        className="relative w-full max-w-md rounded-2xl border border-orange-100 bg-[#fdf6e3] p-6 shadow-2xl focus:outline-none dark:border-stone-700 dark:bg-stone-900"
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2
              id="discard-changes-title"
              className="text-lg font-black text-stone-900 dark:text-white"
            >
              Discard unsaved {label}?
            </h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Everything you have changed since your last save will be lost. This
              cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-bold text-stone-600 transition-colors hover:bg-orange-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
          >
            Keep editing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}
