import React from 'react'

// Only the three theme ramps, because interactive blocks style themselves from
// a static class map. Offering colors a block can't actually render (as the
// 9-swatch _ColorPicker does) means the teacher picks blue and sees orange.
const COLORS = [
  { value: 'primary', label: 'Orange', swatch: 'bg-orange-400' },
  { value: 'secondary', label: 'Teal', swatch: 'bg-teal-400' },
  { value: 'accent', label: 'Yellow', swatch: 'bg-yellow-400' },
]

export default function ThemeColorPicker({ value, onChange, label = 'Color' }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            title={c.label}
            aria-label={c.label}
            aria-pressed={value === c.value}
            className={`h-6 w-6 rounded-full ${c.swatch} border-2 transition-all ${
              value === c.value
                ? 'scale-125 border-stone-700 dark:border-white'
                : 'border-transparent hover:scale-110'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
