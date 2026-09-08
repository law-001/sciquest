import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Plus,
  Save,
  X,
} from 'lucide-react'

import { useLessonsData } from '../context/LessonsDataContext'
import { useAuth } from '../context/AuthContext'
import { upsertLesson } from '../lib/lessons'
import { getSlotIssues } from '../lib/editorValidation'
import { WEEKS_DATA } from '../data/lessonsweek-01'
import { useModalDismiss } from '../hooks/useModalDismiss'
import { useUnsavedChanges } from '../hooks/useUnsavedChanges'
import { SLOT_MAP } from '../components/slotMap'
import { LessonTemplate } from '../components/LessonTemplate'
import EditableSlotFrame from '../components/EditableSlotFrame'
import SlotPickerModal from '../components/SlotPickerModal'
import ImagePicker from '../components/ImagePicker'
import MaterialPicker from '../components/MaterialPicker'
import DiscardChangesModal from '../components/editor/DiscardChangesModal'
import OutlinePanel from '../components/editor/OutlinePanel'
import UndoBar from '../components/editor/UndoBar'
import { FORM_MAP, SLOT_META, DEFAULT_SLOT_DATA } from '../components/lesson-slot-forms'

// ── Helpers ──────────────────────────────────────────────────────────────────

function isStaticLessonId(id) {
  return WEEKS_DATA.some((w) => w.lessons.some((l) => l.id === id))
}

// Interactive blocks record completion against this id, so it has to survive
// reordering and editing. Mirrors genId() in QuizEditorPage.
function newSlotId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `slot-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// Seed lessons declare no slot ids, so LessonTemplate falls back to the slot's
// position (`idx-3`) as the blockId that interactive completions are recorded
// against. Reordering a lesson then re-points every id below the change and
// orphans the students' saved rows.
//
// Freeze the current position into an explicit id the first time a lesson is
// opened for editing. The positional value — not a fresh uuid — is what keeps
// already-recorded lesson_interactions attached to the block they came from.
function withStableSlotIds(layout) {
  if (!Array.isArray(layout)) return []
  return layout.map((slot, i) => ({
    ...JSON.parse(JSON.stringify(slot)),
    id: slot.id ?? `idx-${i}`,
  }))
}

function blankDraft(weekId) {
  return {
    id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `lesson-${Date.now()}`,
    weekId: weekId || 'week-1',
    lessonNumber: 999,
    title: '',
    badge: 'Lesson',
    subtitle: '',
    readTime: '~15 min read',
    xp: 50,
    heroImage: null,
    heroImageAlt: '',
    sections: [],
    references: [],
    layout: [],
    is_custom: true,
    is_hidden: false,
  }
}

function lessonToEditorDraft(lesson) {
  return {
    id: lesson.id,
    weekId: lesson.weekId,
    lessonNumber: lesson.lessonNumber,
    title: lesson.title || '',
    badge: lesson.badge || 'Lesson',
    subtitle: lesson.subtitle || '',
    readTime: lesson.readTime || '~15 min read',
    xp: typeof lesson.xp === 'number' ? lesson.xp : 50,
    heroImage: lesson.heroImage || null,
    heroImageAlt: lesson.heroImageAlt || '',
    sections: Array.isArray(lesson.sections) ? [...lesson.sections] : [],
    references: Array.isArray(lesson.references) ? JSON.parse(JSON.stringify(lesson.references)) : [],
    layout: withStableSlotIds(lesson.layout),
    is_custom: !isStaticLessonId(lesson.id),
    is_hidden: !!lesson.isHidden,
  }
}

function draftToDbRow(draft, userId) {
  return {
    id: draft.id,
    week_id: draft.weekId,
    lesson_number: Number(draft.lessonNumber) || 999,
    title: draft.title,
    badge: draft.badge || null,
    subtitle: draft.subtitle || null,
    read_time: draft.readTime || '~15 min read',
    xp: Number(draft.xp) || 50,
    hero_image_url: draft.heroImage || null,
    hero_image_alt: draft.heroImageAlt || null,
    sections: draft.sections,
    references: draft.references,
    layout: draft.layout,
    is_custom: !isStaticLessonId(draft.id),
    // Preserve the teacher's hide toggle — saving an edit must not silently
    // republish a lesson that was deliberately hidden.
    is_hidden: !!draft.is_hidden,
    created_by: userId || null,
  }
}

function draftToPreviewLesson(draft) {
  return {
    id: draft.id,
    weekId: draft.weekId,
    lessonNumber: draft.lessonNumber,
    title: draft.title || 'Untitled Lesson',
    badge: draft.badge || 'Preview',
    subtitle: draft.subtitle || '',
    readTime: draft.readTime || '~15 min read',
    xp: draft.xp || 50,
    heroImage: draft.heroImage || null,
    heroImageAlt: draft.heroImageAlt || '',
    sections: draft.layout.map((s) => s.heading || 'Section'),
    references: draft.references || [],
    layout: draft.layout,
  }
}

// Stable identity so the memos below don't re-run while the draft is loading.
const EMPTY_LAYOUT = []

function moveItem(list, from, to) {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function slotLabel(slot) {
  return slot.heading || `Untitled ${SLOT_META[slot.type]?.label ?? slot.type}`
}

// ── SlotEditModal ─────────────────────────────────────────────────────────────

function SlotEditModal({ slot, lessonId, onSubmit, onCancel }) {
  const panelRef = useModalDismiss(onCancel)
  const FormComponent = FORM_MAP[slot.type]
  if (!FormComponent) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slot-edit-title"
        className="relative w-full max-w-2xl bg-[#fdf6e3] dark:bg-stone-900 rounded-2xl shadow-2xl border border-orange-100 dark:border-stone-700 flex flex-col max-h-[88vh] focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-orange-100 dark:border-stone-700 shrink-0">
          <h2 id="slot-edit-title" className="text-lg font-black text-stone-900 dark:text-white">
            Edit — {SLOT_META[slot.type]?.label ?? slot.type}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {SLOT_META[slot.type]?.desc}
          </p>
        </div>
        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto themed-scrollbar px-6 py-5">
          <FormComponent
            initialHeading={slot.heading}
            initialData={slot.data}
            lessonId={lessonId}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  )
}

// ── InsertButton ──────────────────────────────────────────────────────────────

function InsertButton({ onClick }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-orange-100 dark:bg-stone-700 transition-colors" />
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 text-stone-500 dark:text-stone-400 text-xs font-bold shadow-sm hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300 dark:hover:bg-stone-700 dark:hover:text-primary-400 transition-all duration-150"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Section
      </button>
      <div className="flex-1 h-px bg-orange-100 dark:bg-stone-700 transition-colors" />
    </div>
  )
}

// ── MetadataField ─────────────────────────────────────────────────────────────

function MetaField({ label, value, onChange, type = 'text', placeholder, className = '' }) {
  const base =
    'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      <input
        type={type}
        className={base}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

// ── EditorSkeleton ────────────────────────────────────────────────────────────

function EditorSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-stone-900">
      <div className="sticky top-0 z-30 bg-[#fdf6e3]/95 dark:bg-stone-900/95 border-b border-orange-200/60 dark:border-stone-700 h-14" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-orange-100 dark:border-stone-700 p-6 space-y-4">
          <div className="h-3 w-28 bg-stone-200 dark:bg-stone-700 rounded" />
          <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded-xl" />
          <div className="h-16 bg-stone-200 dark:bg-stone-700 rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-stone-200 dark:bg-stone-700 rounded-xl" />
            ))}
          </div>
          <div className="h-32 bg-stone-200 dark:bg-stone-700 rounded-xl" />
        </div>
        <div className="h-3 w-32 bg-stone-200 dark:bg-stone-700 rounded mx-1" />
        <div className="h-52 bg-stone-100 dark:bg-stone-800 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-700" />
      </div>
    </div>
  )
}

// ── EmptyCanvas ───────────────────────────────────────────────────────────────

function EmptyCanvas({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-orange-200 dark:border-stone-700 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
        <Plus className="w-7 h-7 text-primary-500" />
      </div>
      <h3 className="text-base font-bold text-stone-700 dark:text-stone-300 mb-1">No sections yet</h3>
      <p className="text-sm text-stone-400 dark:text-stone-500 mb-5">Add your first content section to get started</p>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add First Section
      </button>
    </div>
  )
}

// ── ChecklistPanel ────────────────────────────────────────────────────────────

function ChecklistPanel({ entries, onOpen, onDismiss }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/20">
      <div className="mb-3 flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div className="flex-1">
          <p className="text-sm font-black text-amber-800 dark:text-amber-400">
            Saved — but {entries.length} section{entries.length === 1 ? '' : 's'} still need attention
          </p>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/70">
            Students can see this lesson as it is. Finish these when you can.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss checklist"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-amber-600 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onOpen(entry.index)}
              className="w-full rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40"
            >
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                {entry.index + 1}. {entry.label}
              </span>
              <span className="block text-xs text-amber-700 dark:text-amber-400/80">
                {entry.issues.join(' · ')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── LessonEditorPage ──────────────────────────────────────────────────────────

export function LessonEditorPage({ lessonId, weekId, onSave, onCancel }) {
  // Use weeksWithHidden so a hidden lesson can be re-opened in the editor.
  // The student-facing `weeks` filters out is_hidden rows, which would cause
  // this lookup to miss and silently fork the lesson into a new UUID via blankDraft.
  const { weeksWithHidden: weeks, loading, applyLessonRow } = useLessonsData()
  const { user } = useAuth()

  // draft is null only while waiting for a custom lesson's DB row to arrive.
  // Static/cached lessons are found immediately in weeks from useState init.
  const [draft, setDraft] = useState(() => {
    if (!lessonId) return blankDraft(weekId)
    for (const w of weeks) {
      const lesson = w.lessons.find((l) => l.id === lessonId)
      if (lesson) return lessonToEditorDraft(lesson)
    }
    return null
  })

  // React-idiomatic derived state: once loading finishes and draft is still null,
  // update it synchronously during render so React re-renders with the real data.
  if (draft === null && !loading) {
    let resolved = null
    for (const w of weeks) {
      const lesson = w.lessons.find((l) => l.id === lessonId)
      if (lesson) { resolved = lessonToEditorDraft(lesson); break }
    }
    setDraft(resolved ?? blankDraft(weekId))
  }

  const [saving, setSaving] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [checklist, setChecklist] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [confirmingDiscard, setConfirmingDiscard] = useState(false)
  const [undoState, setUndoState] = useState(null)
  const [activeSlotId, setActiveSlotId] = useState(null)
  const [baseline, setBaseline] = useState(null)
  // Materials write straight to the DB against draft.id, so they can only be
  // attached once that id belongs to a real row.
  const [hasBeenSaved, setHasBeenSaved] = useState(() => !!lessonId)

  // Slot picker / edit modal state
  const [insertAt, setInsertAt] = useState(null)
  const [editIdx, setEditIdx] = useState(null)
  const [pickingType, setPickingType] = useState(false)
  // Index of a section added but not yet confirmed, so Cancel can take it back
  // out. null whenever the open modal is editing an existing section.
  const [unconfirmedIdx, setUnconfirmedIdx] = useState(null)

  const titleRef = useRef(null)
  const errorRef = useRef(null)

  const draftJson = useMemo(() => JSON.stringify(draft), [draft])

  // The snapshot the draft is compared against. Kept in state, not a ref, so
  // that "unsaved changes" actually re-renders the header when it flips.
  if (baseline === null && draft !== null) setBaseline(draftJson)

  const isDirty = baseline !== null && baseline !== draftJson

  useUnsavedChanges(isDirty)

  // The banner sits at the top of a long page; without this it is invisible to
  // anyone who pressed Save while scrolled down at the canvas.
  useEffect(() => {
    if (saveError) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [saveError])

  const layout = draft?.layout ?? EMPTY_LAYOUT

  const slotIssues = useMemo(() => layout.map((slot) => getSlotIssues(slot)), [layout])

  const outlineItems = useMemo(
    () =>
      layout.map((slot, i) => ({
        id: slot.id ?? `idx-${i}`,
        label: slotLabel(slot),
        sublabel: SLOT_META[slot.type]?.label ?? slot.type,
        issueCount: slotIssues[i]?.length ?? 0,
      })),
    [layout, slotIssues],
  )

  // Update layout and keep sections in sync
  const updateLayout = useCallback((newLayout) => {
    setDraft((d) => ({
      ...d,
      layout: newLayout,
      sections: newLayout.map((s) => s.heading || 'Section'),
    }))
  }, [])

  function updateDraft(field, value) {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  // Open slot picker to insert at given index
  function openPicker(atIndex) {
    setInsertAt(atIndex)
    setPickingType(true)
  }

  function handleTypeChosen(type) {
    setPickingType(false)
    const newSlot = {
      id: newSlotId(),
      type,
      heading: '',
      data: JSON.parse(JSON.stringify(DEFAULT_SLOT_DATA[type] ?? {})),
    }
    const newLayout = [...draft.layout]
    newLayout.splice(insertAt, 0, newSlot)
    updateLayout(newLayout)
    setEditIdx(insertAt)
    setUnconfirmedIdx(insertAt)
  }

  function handleSlotSave(heading, data) {
    const newLayout = [...draft.layout]
    newLayout[editIdx] = { ...newLayout[editIdx], heading, data }
    updateLayout(newLayout)
    setEditIdx(null)
    setUnconfirmedIdx(null)
  }

  // Backing out of the form for a section just added takes the section with it.
  // The slot is inserted before the form opens, so leaving it behind stranded an
  // empty section in the lesson — and most slot types render nothing at all when
  // empty, making it invisible and all but impossible to select and delete.
  function handleSlotEditCancel() {
    if (unconfirmedIdx !== null) {
      updateLayout(draft.layout.filter((_, idx) => idx !== unconfirmedIdx))
      setUnconfirmedIdx(null)
    }
    setEditIdx(null)
  }

  function moveUp(i) {
    if (i === 0) return
    updateLayout(moveItem(draft.layout, i, i - 1))
  }

  function moveDown(i) {
    if (i >= draft.layout.length - 1) return
    updateLayout(moveItem(draft.layout, i, i + 1))
  }

  function moveTo(from, to) {
    if (from === to) return
    updateLayout(moveItem(draft.layout, from, to))
  }

  function duplicateSlot(i) {
    const copy = { ...JSON.parse(JSON.stringify(draft.layout[i])), id: newSlotId() }
    const newLayout = [...draft.layout]
    newLayout.splice(i + 1, 0, copy)
    updateLayout(newLayout)
  }

  function deleteSlot(i) {
    setUndoState({ slot: draft.layout[i], index: i })
    updateLayout(draft.layout.filter((_, idx) => idx !== i))
  }

  function undoDelete() {
    if (!undoState) return
    const newLayout = [...draft.layout]
    newLayout.splice(undoState.index, 0, undoState.slot)
    updateLayout(newLayout)
    setUndoState(null)
  }

  function jumpToSlot(id) {
    setActiveSlotId(id)
    const el = document.getElementById(`slot-${id}`)
    if (!el) return
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
  }

  function openFromChecklist(index) {
    setChecklist(null)
    setEditIdx(index)
  }

  function handleBack() {
    if (isDirty) setConfirmingDiscard(true)
    else onCancel()
  }

  async function handleSave({ close }) {
    setSaveError(null)
    setChecklist(null)
    if (!draft.title.trim()) {
      setSaveError('Lesson title is required.')
      titleRef.current?.focus()
      return
    }
    if (draft.layout.length === 0) { setSaveError('Add at least one section before saving.'); return }
    setSaving(true)
    try {
      const saved = await upsertLesson(draftToDbRow(draft, user?.id))
      applyLessonRow(saved)
      setBaseline(draftJson)
      setHasBeenSaved(true)
      setSaving(false)
      if (close) { onSave(); return }
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 1500)
      const entries = draft.layout
        .map((slot, index) => ({ id: slot.id ?? `idx-${index}`, index, label: slotLabel(slot), issues: slotIssues[index] }))
        .filter((entry) => entry.issues.length > 0)
      if (entries.length > 0) setChecklist(entries)
    } catch (err) {
      console.error('[lesson editor] save failed:', err)
      setSaveError(err.message || err.error_description || err.hint || 'Failed to save lesson.')
      setSaving(false)
    }
  }

  // ── Loading skeleton ──
  if (draft === null) return <EditorSkeleton />

  // ── Preview mode ──
  if (previewMode) {
    const previewLesson = draftToPreviewLesson(draft)
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900/90 text-white font-bold text-sm backdrop-blur-sm hover:bg-stone-800 transition-colors shadow-lg"
          >
            <EyeOff className="w-4 h-4" />
            Exit Preview
          </button>
        </div>
        <LessonTemplate
          lesson={previewLesson}
          weekLessons={[previewLesson]}
          activeLessonId={draft.id}
          onBack={() => setPreviewMode(false)}
        />
      </div>
    )
  }

  // ── Editor mode ──
  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-stone-900">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 bg-[#fdf6e3]/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-orange-200/60 dark:border-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 font-bold text-sm transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Lesson Editor
              {isDirty && <span className="ml-2 normal-case text-amber-500">Unsaved changes</span>}
            </p>
            <p className="text-sm font-black text-stone-700 dark:text-stone-200 truncate">
              {draft.title || 'Untitled Lesson'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span aria-live="polite" className="text-xs font-bold text-secondary-600 dark:text-secondary-400">
              {savedFlash && (
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </span>
              )}
            </span>
            <button
              onClick={() => setPreviewMode(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 font-bold text-sm hover:bg-orange-50 dark:hover:bg-stone-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => handleSave({ close: false })}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 font-bold text-sm hover:bg-orange-50 dark:hover:bg-stone-700 disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={() => handleSave({ close: true })}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold text-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Save &amp; Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Banners ── */}
      {(saveError || checklist) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-3">
          {saveError && (
            <div
              ref={errorRef}
              role="alert"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm font-bold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {saveError}
            </div>
          )}
          {checklist && (
            <ChecklistPanel
              entries={checklist}
              onOpen={openFromChecklist}
              onDismiss={() => setChecklist(null)}
            />
          )}
        </div>
      )}

      {/* ── Main content ── */}
      <div className="editor-autogrow max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:flex lg:gap-8">

        <OutlinePanel
          title="Sections"
          items={outlineItems}
          activeId={activeSlotId}
          onJump={jumpToSlot}
          onMove={moveTo}
          onDuplicate={duplicateSlot}
          onDelete={deleteSlot}
          emptyLabel="Sections you add will be listed here."
        />

        <div className="min-w-0 flex-1 lg:max-w-4xl">

          {/* ── Metadata section ── */}
          <section className="bg-white dark:bg-stone-800 rounded-2xl border border-orange-100 dark:border-stone-700 p-6 mb-10 space-y-5 shadow-sm">
            <h2 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Lesson Details</h2>

            {/* Title */}
            <div>
              <label
                htmlFor="lesson-title"
                className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1"
              >
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="lesson-title"
                ref={titleRef}
                type="text"
                value={draft.title}
                onChange={(e) => updateDraft('title', e.target.value)}
                placeholder="e.g. Uses of Scientific Models"
                className="w-full px-4 py-3 rounded-xl border border-orange-200 dark:border-stone-600 bg-[#fdf6e3] dark:bg-stone-900 text-stone-900 dark:text-white text-xl font-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Subtitle</label>
              <textarea
                value={draft.subtitle}
                onChange={(e) => updateDraft('subtitle', e.target.value)}
                placeholder="A short description of the lesson"
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none transition-colors"
              />
            </div>

            {/* Row of smaller fields */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetaField label="Badge" value={draft.badge} onChange={(v) => updateDraft('badge', v)} placeholder="e.g. Lesson 1" />
              <MetaField label="XP" value={draft.xp} onChange={(v) => updateDraft('xp', v)} type="number" placeholder="50" />
              <MetaField label="Read Time" value={draft.readTime} onChange={(v) => updateDraft('readTime', v)} placeholder="~15 min read" />
              <MetaField label="Lesson #" value={draft.lessonNumber} onChange={(v) => updateDraft('lessonNumber', v)} type="number" placeholder="1" />
            </div>

            {/* Hero image */}
            <ImagePicker
              value={draft.heroImage || ''}
              onChange={(url) => updateDraft('heroImage', url || null)}
              lessonId={draft.id}
            />

            {/* Hero alt text */}
            {draft.heroImage && (
              <MetaField
                label="Image Alt Text"
                value={draft.heroImageAlt}
                onChange={(v) => updateDraft('heroImageAlt', v)}
                placeholder="Describe the image for accessibility"
              />
            )}
          </section>

          {/* ── Materials ── */}
          <section className="bg-white dark:bg-stone-800 rounded-2xl border border-orange-100 dark:border-stone-700 p-6 mb-10 shadow-sm">
            <h2 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-4">
              Materials
            </h2>
            <p className="text-xs text-stone-400 mb-4">
              Videos and files attached here appear at the bottom of the lesson for
              students. You can also place a &ldquo;Materials&rdquo; section below to
              surface specific ones mid-lesson.
            </p>
            {hasBeenSaved ? (
              <MaterialPicker lessonId={draft.id} />
            ) : (
              // Uploads are written to the database the moment they finish, keyed
              // on this lesson's id. Attaching one to a lesson that is then never
              // saved would leave a row and a stored file with nothing to belong to.
              <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/40 px-5 py-6 dark:border-stone-600 dark:bg-stone-800/40">
                <Lock className="h-5 w-5 shrink-0 text-stone-400" />
                <div>
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-200">
                    Save the lesson first
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Once it exists you can attach videos and handouts here.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* ── Layout canvas ── */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                Content Sections <span className="ml-2 text-primary-500">{draft.layout.length}</span>
              </h2>
              {draft.layout.length > 0 && (
                <button
                  type="button"
                  onClick={() => openPicker(draft.layout.length)}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Section
                </button>
              )}
            </div>

            {draft.layout.length === 0 ? (
              <EmptyCanvas onAdd={() => openPicker(0)} />
            ) : (
              <div className="space-y-2">
                <InsertButton onClick={() => openPicker(0)} />
                {draft.layout.map((slot, i) => {
                  const Component = SLOT_MAP[slot.type]
                  if (!Component) return null
                  const slotId = slot.id ?? `idx-${i}`
                  return (
                    // Keyed by slot id, not position. With an index key, inserting
                    // or moving a section shifts every index below it, so React
                    // matches each position against a different component type and
                    // tears down and rebuilds the whole rest of the canvas — new
                    // observers, re-decoded images, interactive state re-read from
                    // storage. That teardown is what made adding a section drag.
                    <React.Fragment key={slotId}>
                      <div id={`slot-${slotId}`} className="scroll-mt-20">
                        <EditableSlotFrame
                          onEdit={() => setEditIdx(i)}
                          onMoveUp={() => moveUp(i)}
                          onMoveDown={() => moveDown(i)}
                          onDuplicate={() => duplicateSlot(i)}
                          onDelete={() => deleteSlot(i)}
                          isFirst={i === 0}
                          isLast={i === draft.layout.length - 1}
                          issues={slotIssues[i]}
                        >
                          <div className="peer">
                            <Component
                              id={`editor-section-${i}`}
                              heading={slot.heading || `(${SLOT_META[slot.type]?.label ?? slot.type})`}
                              data={slot.data || {}}
                              // Interactive slots are live in the canvas. Scope their
                              // saved state to a preview key so a teacher trying out a
                              // block never writes into their own student progress.
                              blockId={slotId}
                              lessonId={draft.id}
                              stateScope={`preview-${draft.id}`}
                            />
                          </div>
                          {/* Most slot types render nothing at all when their data is
                              empty — a section with no questions, no hotspots, no
                              attached materials. On the page that is correct; in the
                              editor it leaves a section the teacher can neither see
                              nor select. Stand in for it whenever the slot above
                              produced no output. */}
                          <div className="hidden peer-empty:flex items-center gap-3 rounded-2xl border-2 border-dashed border-orange-200 dark:border-stone-600 bg-orange-50/40 dark:bg-stone-800/40 px-5 py-6">
                            <AlertCircle className="w-5 h-5 shrink-0 text-primary-500" />
                            <div>
                              <p className="text-sm font-bold text-stone-700 dark:text-stone-200">
                                Empty {SLOT_META[slot.type]?.label ?? slot.type} section
                              </p>
                              <p className="text-xs text-stone-500 dark:text-stone-400">
                                Students won&rsquo;t see this. Add content with the pencil, or remove it with the bin.
                              </p>
                            </div>
                          </div>
                        </EditableSlotFrame>
                      </div>
                      <InsertButton onClick={() => openPicker(i + 1)} />
                    </React.Fragment>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals & transient UI ── */}
      {pickingType && (
        <SlotPickerModal onSelect={handleTypeChosen} onClose={() => setPickingType(false)} />
      )}
      {editIdx !== null && draft.layout[editIdx] && (
        <SlotEditModal
          slot={draft.layout[editIdx]}
          lessonId={draft.id}
          onSubmit={handleSlotSave}
          onCancel={handleSlotEditCancel}
        />
      )}
      {confirmingDiscard && (
        <DiscardChangesModal
          label="lesson changes"
          onConfirm={onCancel}
          onClose={() => setConfirmingDiscard(false)}
        />
      )}
      {undoState && (
        <UndoBar
          message="Section deleted"
          onUndo={undoDelete}
          onDismiss={() => setUndoState(null)}
        />
      )}
    </div>
  )
}
