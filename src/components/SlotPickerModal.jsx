import React from 'react'
import { X, BookOpen, Award, Layers, Image, List, FlaskConical, Clock, GitCompare, Lightbulb, Network } from 'lucide-react'
import { SLOT_META } from './lesson-slot-forms/index'

const SLOT_ICONS = {
  intro: BookOpen,
  keyTerms: Award,
  reasonCards: Layers,
  imageCards: Image,
  conceptList: List,
  applications: FlaskConical,
  timeline: Clock,
  comparison: GitCompare,
  scenario: Lightbulb,
  diagram: Network,
}

const SLOT_COLORS = {
  intro: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  keyTerms: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20',
  reasonCards: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20',
  imageCards: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20',
  conceptList: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20',
  applications: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20',
  timeline: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  comparison: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20',
  scenario: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20',
  diagram: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
}

export default function SlotPickerModal({ onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fdf6e3] dark:bg-stone-900 rounded-2xl shadow-2xl border border-orange-100 dark:border-stone-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100 dark:border-stone-700">
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-white">Choose a Section Type</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Pick the kind of content you want to add</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-orange-50 dark:hover:bg-stone-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
          {Object.keys(SLOT_META).map((type) => {
            const meta = SLOT_META[type]
            const Icon = SLOT_ICONS[type] || BookOpen
            const colors = SLOT_COLORS[type] || 'text-stone-600 bg-stone-50'
            return (
              <button
                key={type}
                type="button"
                onClick={() => onSelect(type)}
                className="group flex flex-col items-start gap-2 p-4 rounded-xl bg-white dark:bg-stone-800 border border-orange-100 dark:border-stone-700 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-orange-200 dark:hover:border-stone-500"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900 dark:text-white leading-tight">{meta.label}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">{meta.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
