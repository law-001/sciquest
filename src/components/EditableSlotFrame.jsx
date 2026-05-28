import React from 'react'
import { Pencil, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'

export default function EditableSlotFrame({
  children,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
  label = 'section',
}) {
  function handleKeyDown(e) {
    // Only reorder when the frame wrapper itself is focused, not a child button
    if (e.target !== e.currentTarget) return
    if (e.key === 'ArrowUp' && !isFirst) { e.preventDefault(); onMoveUp() }
    else if (e.key === 'ArrowDown' && !isLast) { e.preventDefault(); onMoveDown() }
    else if (e.key === 'Enter') { e.preventDefault(); onEdit() }
  }

  return (
    <div
      className="group relative focus-visible:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${label} — ArrowUp/Down to reorder, Enter to edit`}
    >
      {/* Hover/focus toolbar — floats top-right */}
      <div
        className="absolute -top-3 right-2 z-20 flex items-center gap-0.5 bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 rounded-xl shadow-md px-1.5 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ToolbarBtn
          onClick={onEdit}
          title="Edit section (Enter)"
          icon={<Pencil className="w-3.5 h-3.5" />}
          className="text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
        />
        <div className="w-px h-4 bg-orange-100 dark:bg-stone-600 mx-0.5" />
        <ToolbarBtn
          onClick={onMoveUp}
          disabled={isFirst}
          title="Move up (↑)"
          icon={<ChevronUp className="w-3.5 h-3.5" />}
        />
        <ToolbarBtn
          onClick={onMoveDown}
          disabled={isLast}
          title="Move down (↓)"
          icon={<ChevronDown className="w-3.5 h-3.5" />}
        />
        <div className="w-px h-4 bg-orange-100 dark:bg-stone-600 mx-0.5" />
        <ToolbarBtn
          onClick={onDelete}
          title="Delete section"
          icon={<Trash2 className="w-3.5 h-3.5" />}
          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        />
      </div>

      {/* Slot ring — visible on hover or keyboard focus */}
      <div className="rounded-2xl ring-0 group-hover:ring-2 group-focus-within:ring-2 group-hover:ring-orange-200 group-focus-within:ring-orange-400 dark:group-hover:ring-stone-600 dark:group-focus-within:ring-orange-500 transition-all duration-150">
        {children}
      </div>
    </div>
  )
}

function ToolbarBtn({ onClick, disabled, title, icon, className = 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      tabIndex={-1}
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
    >
      {icon}
    </button>
  )
}
