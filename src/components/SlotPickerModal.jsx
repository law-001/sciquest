import React from 'react'
import {
  X,
  BookOpen,
  Award,
  Layers,
  Image,
  List,
  FlaskConical,
  Clock,
  GitCompare,
  Lightbulb,
  Network,
  HelpCircle,
  Copy,
  MapPin,
  FolderTree,
  Tag,
  Paperclip,
  Sparkles,
} from 'lucide-react'
import { SLOT_META, SLOT_GROUPS } from './lesson-slot-forms/index'

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
  flipCards: Copy,
  quickCheck: HelpCircle,
  hotspot: MapPin,
  sortBuckets: FolderTree,
  dragLabel: Tag,
  customWidget: Sparkles,
  materials: Paperclip,
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
  flipCards: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  quickCheck: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20',
  hotspot: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20',
  sortBuckets: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  dragLabel: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20',
  customWidget: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  materials: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
}

function SlotTile({ type, onSelect }) {
  const meta = SLOT_META[type]
  if (!meta) return null
  const Icon = SLOT_ICONS[type] || BookOpen
  const colors = SLOT_COLORS[type] || 'text-stone-600 bg-stone-50'
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      className="group flex flex-col items-start gap-2 rounded-xl border border-orange-100 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-500"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors} transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-sm font-bold leading-tight text-stone-900 dark:text-white">
          {meta.label}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-stone-500 dark:text-stone-400">
          {meta.desc}
        </p>
      </div>
    </button>
  )
}

export default function SlotPickerModal({ onSelect, onClose }) {
  // Any type not named in a group still gets offered, so adding a type to
  // SLOT_META alone can never make it unreachable.
  const grouped = new Set(SLOT_GROUPS.flatMap((g) => g.types))
  const ungrouped = Object.keys(SLOT_META).filter((t) => !grouped.has(t))
  const groups = ungrouped.length
    ? [...SLOT_GROUPS, { label: 'Other', desc: '', types: ungrouped }]
    : SLOT_GROUPS

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-orange-100 bg-[#fdf6e3] shadow-2xl dark:border-stone-700 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-orange-100 px-6 py-5 dark:border-stone-700">
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-white">
              Choose a Section Type
            </h2>
            <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
              Pick the kind of content you want to add
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 transition-colors hover:bg-orange-50 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Grouped grid */}
        <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  {group.label}
                </p>
                {group.desc && (
                  <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">
                    {group.desc}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {group.types.map((type) => (
                  <SlotTile key={type} type={type} onSelect={onSelect} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
