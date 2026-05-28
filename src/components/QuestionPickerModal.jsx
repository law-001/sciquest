import React from 'react'
import { X, CheckSquare, ToggleLeft, AlignLeft, PenLine, FileText, GitCompare, Hash, ListOrdered, Image, BookOpen } from 'lucide-react'
import { QUESTION_META } from './quiz-slot-forms'

const QUESTION_ICONS = {
  'multiple-choice': CheckSquare,
  'true-false': ToggleLeft,
  'fill-blanks': AlignLeft,
  'short-answer': PenLine,
  essay: FileText,
  matching: GitCompare,
  identification: Hash,
  ordering: ListOrdered,
  'picture-based': Image,
  'case-study': BookOpen,
}

const QUESTION_COLORS = {
  'multiple-choice': 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  'true-false': 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20',
  'fill-blanks': 'text-accent-600 bg-accent-50 dark:bg-accent-900/20',
  'short-answer': 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  essay: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  matching: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20',
  identification: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20',
  ordering: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  'picture-based': 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20',
  'case-study': 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
}

export default function QuestionPickerModal({ onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fdf6e3] dark:bg-stone-900 rounded-2xl shadow-2xl border border-orange-100 dark:border-stone-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100 dark:border-stone-700">
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-white">Choose a Question Type</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Pick the kind of question you want to add</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-orange-50 dark:hover:bg-stone-700 transition-colors"
            aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
          {Object.keys(QUESTION_META).map(type => {
            const meta = QUESTION_META[type]
            const Icon = QUESTION_ICONS[type] || CheckSquare
            const colors = QUESTION_COLORS[type] || 'text-stone-600 bg-stone-50'
            return (
              <button key={type} type="button" onClick={() => onSelect(type)}
                className="group flex flex-col items-start gap-2 p-4 rounded-xl bg-white dark:bg-stone-800 border border-orange-100 dark:border-stone-700 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-orange-200 dark:hover:border-stone-500">
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
