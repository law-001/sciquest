import React, { useRef, useState } from 'react'
import {
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  Copy,
  GripVertical,
  List,
  Trash2,
} from 'lucide-react'

// A map of the canvas: jump to any section or question, and reorder without
// clicking the up arrow fourteen times.
//
// Reordering is pointer-events + elementFromPoint rather than HTML5 drag and
// drop, matching useDragOrTap — native DnD never fires on touch. Alt+ArrowUp /
// Alt+ArrowDown is the keyboard equivalent, and the hover cluster covers the
// long moves.
export default function OutlinePanel({
  title,
  items,
  activeId,
  onJump,
  onMove,
  onDuplicate,
  onDelete,
  emptyLabel,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drag, setDrag] = useState(null)
  const listRef = useRef(null)

  function indexAtPoint(x, y) {
    const row = document.elementFromPoint(x, y)?.closest('[data-row-index]')
    if (!row || !listRef.current?.contains(row)) return null
    return Number(row.getAttribute('data-row-index'))
  }

  function handlePointerDown(e, index) {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDrag({ from: index, over: index })
  }

  function handlePointerMove(e) {
    if (!drag) return
    const over = indexAtPoint(e.clientX, e.clientY)
    if (over !== null && over !== drag.over) setDrag({ ...drag, over })
  }

  function handlePointerUp(e) {
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    if (drag && drag.over !== null && drag.over !== drag.from) onMove(drag.from, drag.over)
    setDrag(null)
  }

  function handleRowKeyDown(e, index) {
    if (!e.altKey) return
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      onMove(index, index - 1)
    } else if (e.key === 'ArrowDown' && index < items.length - 1) {
      e.preventDefault()
      onMove(index, index + 1)
    }
  }

  const body =
    items.length === 0 ? (
      <p className="px-3 py-6 text-center text-xs text-stone-400 dark:text-stone-500">{emptyLabel}</p>
    ) : (
      <ol ref={listRef} className="space-y-1" onPointerMove={handlePointerMove}>
        {items.map((item, i) => {
          const isDragging = drag?.from === i
          const isDropTarget = drag && drag.over === i && drag.from !== i
          return (
            <li
              key={item.id}
              data-row-index={i}
              onKeyDown={(e) => handleRowKeyDown(e, i)}
              className={`group/row relative flex items-center gap-1 rounded-xl px-1 transition-colors ${
                item.id === activeId
                  ? 'bg-primary-50 dark:bg-primary-900/20'
                  : 'hover:bg-orange-50 dark:hover:bg-stone-700/50'
              } ${isDragging ? 'opacity-40' : ''} ${
                isDropTarget ? 'ring-2 ring-primary-400' : ''
              }`}
            >
              <button
                type="button"
                aria-label={`Reorder ${item.label} — Alt with arrow keys`}
                onPointerDown={(e) => handlePointerDown(e, i)}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => setDrag(null)}
                className="flex h-7 w-5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-stone-300 transition-colors hover:text-stone-500 dark:text-stone-600 dark:hover:text-stone-400"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onJump(item.id)}
                className="min-w-0 flex-1 py-1.5 pr-1 text-left"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-stone-400 dark:text-stone-500">
                    {i + 1}
                  </span>
                  <span className="truncate text-xs font-bold text-stone-700 dark:text-stone-200">
                    {item.label}
                  </span>
                  {item.issueCount > 0 && (
                    <span
                      className="ml-auto flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 px-1 text-[10px] font-black text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                      title={`${item.issueCount} thing${item.issueCount === 1 ? '' : 's'} to finish`}
                    >
                      {item.issueCount}
                    </span>
                  )}
                </span>
                <span className="block truncate pl-4 text-[11px] text-stone-400 dark:text-stone-500">
                  {item.sublabel}
                </span>
              </button>

              {/* Hover cluster — long moves, duplicate, delete */}
              <span className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-orange-200 bg-white px-1 py-0.5 opacity-0 shadow-sm transition-opacity group-focus-within/row:opacity-100 group-hover/row:opacity-100 dark:border-stone-600 dark:bg-stone-800">
                <RowBtn
                  onClick={() => onMove(i, 0)}
                  disabled={i === 0}
                  title="Move to top"
                  icon={<ChevronsUp className="h-3 w-3" />}
                />
                <RowBtn
                  onClick={() => onMove(i, items.length - 1)}
                  disabled={i === items.length - 1}
                  title="Move to bottom"
                  icon={<ChevronsDown className="h-3 w-3" />}
                />
                <RowBtn
                  onClick={() => onDuplicate(i)}
                  title="Duplicate"
                  icon={<Copy className="h-3 w-3" />}
                />
                <RowBtn
                  onClick={() => onDelete(i)}
                  title="Delete"
                  icon={<Trash2 className="h-3 w-3" />}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                />
              </span>
            </li>
          )
        })}
      </ol>
    )

  return (
    <>
      {/* Mobile / tablet: collapsible drawer above the canvas */}
      <div className="mb-6 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
          className="flex w-full items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-3 dark:border-stone-700 dark:bg-stone-800"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-200">
            <List className="h-4 w-4 text-stone-400" />
            {title}
            <span className="text-primary-500">{items.length}</span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${
              drawerOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {drawerOpen && (
          <div className="mt-2 rounded-2xl border border-orange-100 bg-white p-2 dark:border-stone-700 dark:bg-stone-800">
            {body}
          </div>
        )}
      </div>

      {/* Desktop: sticky column beside the canvas */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto themed-scrollbar rounded-2xl border border-orange-100 bg-white p-2 shadow-sm dark:border-stone-700 dark:bg-stone-800">
          <p className="px-2 py-2 text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            {title} <span className="ml-1 text-primary-500">{items.length}</span>
          </p>
          {body}
        </div>
      </aside>
    </>
  )
}

function RowBtn({ onClick, disabled, title, icon, className = 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`flex h-5 w-5 items-center justify-center rounded transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
    >
      {icon}
    </button>
  )
}
