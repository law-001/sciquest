import React, { useEffect } from 'react'
import { Undo2, X } from 'lucide-react'

const DISMISS_MS = 8000

// Deleting a section or question is one click with no confirm. Rather than put
// a modal in front of every delete, the delete goes through and this offers the
// way back — the same trade-off mail clients make.
export default function UndoBar({ message, onUndo, onDismiss }) {
  useEffect(() => {
    const id = setTimeout(onDismiss, DISMISS_MS)
    return () => clearTimeout(id)
  }, [onDismiss])

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 shadow-2xl dark:border-stone-600 dark:bg-stone-800"
      role="status"
      aria-live="polite"
    >
      <span className="text-sm font-bold text-white">{message}</span>
      <button
        type="button"
        onClick={onUndo}
        className="flex items-center gap-1.5 rounded-xl bg-primary-500 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
      >
        <Undo2 className="h-3.5 w-3.5" />
        Undo
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-700 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
