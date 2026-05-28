import React from 'react'

const COLORS = [
  { value: 'primary', label: 'Orange', swatch: 'bg-orange-400' },
  { value: 'secondary', label: 'Teal', swatch: 'bg-teal-400' },
  { value: 'accent', label: 'Yellow', swatch: 'bg-yellow-400' },
  { value: 'amber', label: 'Amber', swatch: 'bg-amber-400' },
  { value: 'blue', label: 'Blue', swatch: 'bg-blue-400' },
  { value: 'red', label: 'Red', swatch: 'bg-red-400' },
  { value: 'green', label: 'Green', swatch: 'bg-green-400' },
  { value: 'purple', label: 'Purple', swatch: 'bg-purple-400' },
  { value: 'stone', label: 'Stone', swatch: 'bg-stone-400' },
]

export default function ColorPicker({ value, onChange, label = 'Color' }) {
  return (
    <div>
      <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            title={c.label}
            className={`w-6 h-6 rounded-full ${c.swatch} border-2 transition-all ${
              value === c.value ? 'border-stone-700 dark:border-white scale-125' : 'border-transparent hover:scale-110'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
