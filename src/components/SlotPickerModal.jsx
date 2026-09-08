import React from 'react'
import {
  Award,
  BookOpen,
  Clock,
  Copy,
  FlaskConical,
  FolderTree,
  GitCompare,
  HelpCircle,
  Image,
  Layers,
  Lightbulb,
  List,
  MapPin,
  Network,
  Paperclip,
  Sparkles,
  Tag,
} from 'lucide-react'
import { SLOT_META, SLOT_GROUPS } from './lesson-slot-forms/index'
import TypePickerModal from './editor/TypePickerModal'

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

export default function SlotPickerModal({ onSelect, onClose }) {
  // Any type not named in a group still gets offered, so adding a type to
  // SLOT_META alone can never make it unreachable.
  const grouped = new Set(SLOT_GROUPS.flatMap((g) => g.types))
  const ungrouped = Object.keys(SLOT_META).filter((t) => !grouped.has(t))
  const groups = ungrouped.length
    ? [...SLOT_GROUPS, { label: 'Other', desc: '', types: ungrouped }]
    : SLOT_GROUPS

  return (
    <TypePickerModal
      title="Choose a Section Type"
      subtitle="Pick the kind of content you want to add"
      searchPlaceholder="Search sections…"
      groups={groups}
      meta={SLOT_META}
      icons={SLOT_ICONS}
      colors={SLOT_COLORS}
      fallbackIcon={BookOpen}
      onSelect={onSelect}
      onClose={onClose}
    />
  )
}
