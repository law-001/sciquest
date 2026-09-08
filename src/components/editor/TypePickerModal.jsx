import React, { useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'

import { useModalDismiss } from '../../hooks/useModalDismiss'

// The shell behind both "Choose a Section Type" and "Choose a Question Type".
// The per-type icon and colour maps stay in SlotPickerModal / QuestionPickerModal
// so that adding a new type still means editing exactly the files CLAUDE.md
// names as the registry.
export default function TypePickerModal({
  title,
  subtitle,
  searchPlaceholder,
  groups,
  meta,
  icons,
  colors,
  fallbackIcon: FallbackIcon,
  onSelect,
  onClose,
}) {
  const panelRef = useModalDismiss(onClose)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef(null)

  const visibleGroups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return groups
    return groups
      .map((group) => ({
        ...group,
        types: group.types.filter((type) => {
          const m = meta[type]
          if (!m) return false
          return (
            m.label.toLowerCase().includes(q) || (m.desc ?? '').toLowerCase().includes(q)
          )
        }),
      }))
      .filter((group) => group.types.length > 0)
  }, [groups, meta, query])

  // Flattened in render order, so arrow keys walk the grid the way it reads.
  const flatTypes = useMemo(
    () => visibleGroups.flatMap((group) => group.types),
    [visibleGroups],
  )
  const activeType = flatTypes[Math.min(activeIndex, flatTypes.length - 1)]

  function handleQueryChange(value) {
    setQuery(value)
    setActiveIndex(0)
  }

  function handleKeyDown(e) {
    if (flatTypes.length === 0) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const delta = e.key === 'ArrowDown' ? 1 : -1
      const next = (activeIndex + delta + flatTypes.length) % flatTypes.length
      setActiveIndex(next)
      listRef.current
        ?.querySelector(`[data-type="${flatTypes[next]}"]`)
        ?.scrollIntoView({ block: 'nearest' })
    } else if (e.key === 'Enter' && activeType) {
      e.preventDefault()
      onSelect(activeType)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="type-picker-title"
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-orange-100 bg-[#fdf6e3] shadow-2xl focus:outline-none dark:border-stone-700 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header — the search input is first in the DOM so it takes focus on open */}
        <div className="flex items-start gap-3 border-b border-orange-100 px-6 py-5 dark:border-stone-700">
          <div className="min-w-0 flex-1">
            <h2
              id="type-picker-title"
              className="text-lg font-black text-stone-900 dark:text-white"
            >
              {title}
            </h2>
            <p className="mt-0.5 hidden text-sm text-stone-500 sm:block dark:text-stone-400">
              {subtitle}
            </p>
          </div>
          <div className="relative shrink-0">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-36 rounded-xl border border-orange-200 bg-white py-2 pl-8 pr-3 text-sm font-medium text-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 sm:w-52 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
            />
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-stone-400 transition-colors hover:bg-orange-50 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Grouped grid */}
        <div ref={listRef} className="themed-scrollbar max-h-[60vh] space-y-6 overflow-y-auto p-6">
          {visibleGroups.map((group) => (
            <div key={group.label}>
              <div className="mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  {group.label}
                </p>
                {group.desc && (
                  <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">{group.desc}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {group.types.map((type) => {
                  const m = meta[type]
                  if (!m) return null
                  const Icon = icons[type] || FallbackIcon
                  const tone = colors[type] || 'text-stone-600 bg-stone-50'
                  const isActive = type === activeType
                  return (
                    <button
                      key={type}
                      type="button"
                      data-type={type}
                      onClick={() => onSelect(type)}
                      onMouseEnter={() => setActiveIndex(flatTypes.indexOf(type))}
                      className={`group flex flex-col items-start gap-2 rounded-xl border bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md dark:bg-stone-800 dark:hover:border-stone-500 ${
                        isActive
                          ? 'border-primary-300 ring-2 ring-primary-200 dark:border-primary-500 dark:ring-primary-900/40'
                          : 'border-orange-100 dark:border-stone-700'
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone} transition-transform duration-200 group-hover:scale-110`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight text-stone-900 dark:text-white">
                          {m.label}
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-stone-500 dark:text-stone-400">
                          {m.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {flatTypes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-3 h-7 w-7 text-stone-300" />
              <p className="text-sm font-bold text-stone-500 dark:text-stone-400">
                Nothing matches &ldquo;{query}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
