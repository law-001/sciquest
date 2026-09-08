import React from 'react'
import {
  AlignLeft,
  BookOpen,
  CheckSquare,
  FileText,
  GitCompare,
  Hash,
  Image,
  ListOrdered,
  PenLine,
  ToggleLeft,
} from 'lucide-react'
import { QUESTION_META, QUESTION_GROUPS } from './quiz-slot-forms'
import TypePickerModal from './editor/TypePickerModal'

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
  // Same safeguard as the slot picker: a type added to QUESTION_META but not to
  // a group is still offered rather than silently unreachable.
  const grouped = new Set(QUESTION_GROUPS.flatMap((g) => g.types))
  const ungrouped = Object.keys(QUESTION_META).filter((t) => !grouped.has(t))
  const groups = ungrouped.length
    ? [...QUESTION_GROUPS, { label: 'Other', desc: '', types: ungrouped }]
    : QUESTION_GROUPS

  return (
    <TypePickerModal
      title="Choose a Question Type"
      subtitle="Pick the kind of question you want to add"
      searchPlaceholder="Search questions…"
      groups={groups}
      meta={QUESTION_META}
      icons={QUESTION_ICONS}
      colors={QUESTION_COLORS}
      fallbackIcon={CheckSquare}
      onSelect={onSelect}
      onClose={onClose}
    />
  )
}
