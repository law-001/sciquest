import React from 'react'

// Click-to-place editor shared by the Hotspot and Drag-to-Label forms.
//
// Coordinates are stored as percentages of the image box rather than pixels, so
// a marker placed on a 900px-wide preview still lands correctly on a phone.
//
// `mode` is 'point' (a round marker at x/y) or 'zone' (a rectangle at x/y sized
// w/h). Zones are placed centred on the click and then resized via the fields
// in the list beside this editor.
export default function ImagePointEditor({
  image,
  items = [],
  mode = 'point',
  selectedId,
  onSelect,
  onAddAt,
  labelFor,
}) {
  if (!image) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-orange-200 text-sm font-bold text-stone-400 dark:border-stone-600">
        Choose an image first, then click it to place markers.
      </div>
    )
  }

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10
    onAddAt(Math.min(100, Math.max(0, x)), Math.min(100, Math.max(0, y)))
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-bold text-stone-500 dark:text-stone-400">
        Click anywhere on the image to add a {mode === 'zone' ? 'drop zone' : 'marker'}.
      </p>
      <div
        onClick={handleClick}
        className="relative cursor-crosshair overflow-hidden rounded-xl border-2 border-orange-200 dark:border-stone-600"
      >
        <img src={image} alt="" className="block w-full select-none" draggable={false} />

        {items.map((item, i) => {
          const isSelected = item.id === selectedId
          const common = {
            key: item.id,
            onClick: (e) => {
              // Selecting an existing marker must not also drop a new one.
              e.stopPropagation()
              onSelect?.(item.id)
            },
          }

          if (mode === 'zone') {
            return (
              <div
                {...common}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${item.w}%`,
                  height: `${item.h}%`,
                }}
                className={`absolute flex items-center justify-center rounded-lg border-2 bg-white/80 text-xs font-black text-stone-800 ${
                  isSelected ? 'border-primary-500 ring-4 ring-primary-500/30' : 'border-stone-500'
                }`}
              >
                {labelFor?.(item) || i + 1}
              </div>
            )
          }

          return (
            <div
              {...common}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-xs font-black text-white shadow-md ${
                isSelected ? 'bg-primary-500 ring-4 ring-primary-500/30' : 'bg-accent-600'
              }`}
            >
              {labelFor?.(item) || i + 1}
            </div>
          )
        })}
      </div>
    </div>
  )
}
