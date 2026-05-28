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
}) {
  return (
    <div className="group relative">
      {/* Hover toolbar — floats top-right, invisible until group hover */}
      <div
        className="absolute -top-3 right-2 z-20 flex items-center gap-0.5 bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 rounded-xl shadow-md px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto"
        // stop propagation so clicks on the toolbar don't trigger parent events
        onClick={(e) => e.stopPropagation()}
      >
        <ToolbarBtn
          onClick={onEdit}
          title="Edit section"
          icon={<Pencil className="w-3.5 h-3.5" />}
          className="text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
        />
        <div className="w-px h-4 bg-orange-100 dark:bg-stone-600 mx-0.5" />
        <ToolbarBtn
          onClick={onMoveUp}
          disabled={isFirst}
          title="Move up"
          icon={<ChevronUp className="w-3.5 h-3.5" />}
        />
        <ToolbarBtn
          onClick={onMoveDown}
          disabled={isLast}
          title="Move down"
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

      {/* Slot highlight ring on hover */}
      <div className="rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-orange-200 dark:group-hover:ring-stone-600 transition-all duration-150">
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
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
    >
      {icon}
    </button>
  )
}
