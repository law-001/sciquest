import React, { useState, useCallback } from 'react'
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Plus,
  AlertCircle,
  Loader2,
  Star,
  Clock,
  Hash,
} from 'lucide-react'

import { useLessonsData } from '../context/LessonsDataContext'
import { useAuth } from '../context/AuthContext'
import { upsertLesson } from '../lib/lessons'
import { WEEKS_DATA } from '../data/lessonsweek-01'
import { SLOT_MAP } from '../components/slotMap'
import { LessonTemplate } from '../components/LessonTemplate'
import EditableSlotFrame from '../components/EditableSlotFrame'
import SlotPickerModal from '../components/SlotPickerModal'
import ImagePicker from '../components/ImagePicker'
import { FORM_MAP, SLOT_META, DEFAULT_SLOT_DATA } from '../components/lesson-slot-forms'

// ── Helpers ──────────────────────────────────────────────────────────────────

function isStaticLessonId(id) {
  return WEEKS_DATA.some((w) => w.lessons.some((l) => l.id === id))
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
    layout: Array.isArray(lesson.layout) ? JSON.parse(JSON.stringify(lesson.layout)) : [],
    is_custom: !isStaticLessonId(lesson.id),
    is_hidden: false,
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
    is_hidden: false,
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

// ── SlotEditModal ─────────────────────────────────────────────────────────────

function SlotEditModal({ slot, onSubmit, onCancel }) {
  const FormComponent = FORM_MAP[slot.type]
  if (!FormComponent) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fdf6e3] dark:bg-stone-900 rounded-2xl shadow-2xl border border-orange-100 dark:border-stone-700 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-orange-100 dark:border-stone-700 shrink-0">
          <h2 className="text-lg font-black text-stone-900 dark:text-white">
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

// ── LessonEditorPage ──────────────────────────────────────────────────────────

export function LessonEditorPage({ lessonId, weekId, onSave, onCancel }) {
  const { weeks, loading, applyLessonRow } = useLessonsData()
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
  const [saveError, setSaveError] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Slot picker / edit modal state
  const [insertAt, setInsertAt] = useState(null)
  const [editIdx, setEditIdx] = useState(null)
  const [pickingType, setPickingType] = useState(false)

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
    const newSlot = { type, heading: '', data: JSON.parse(JSON.stringify(DEFAULT_SLOT_DATA[type] ?? {})) }
    const newLayout = [...draft.layout]
    newLayout.splice(insertAt, 0, newSlot)
    updateLayout(newLayout)
    setEditIdx(insertAt)
  }

  function handleSlotSave(heading, data) {
    const newLayout = [...draft.layout]
    newLayout[editIdx] = { ...newLayout[editIdx], heading, data }
    updateLayout(newLayout)
    setEditIdx(null)
  }

  function moveUp(i) {
    if (i === 0) return
    const nl = [...draft.layout];
    [nl[i - 1], nl[i]] = [nl[i], nl[i - 1]]
    updateLayout(nl)
  }

  function moveDown(i) {
    if (i >= draft.layout.length - 1) return
    const nl = [...draft.layout];
    [nl[i], nl[i + 1]] = [nl[i + 1], nl[i]]
    updateLayout(nl)
  }

  function deleteSlot(i) {
    updateLayout(draft.layout.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    setSaveError(null)
    if (!draft.title.trim()) { setSaveError('Lesson title is required.'); return }
    if (draft.layout.length === 0) { setSaveError('Add at least one section before saving.'); return }
    setSaving(true)
    try {
      const saved = await upsertLesson(draftToDbRow(draft, user?.id))
      applyLessonRow(saved)
      onSave()
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 font-bold text-sm transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Cancel</span>
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Lesson Editor</p>
            <p className="text-sm font-black text-stone-700 dark:text-stone-200 truncate">
              {draft.title || 'Untitled Lesson'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPreviewMode(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 font-bold text-sm hover:bg-orange-50 dark:hover:bg-stone-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold text-sm transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>
      </div>

      {/* ── Error banner ── */}
      {saveError && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {saveError}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="editor-autogrow max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24">

        {/* ── Metadata section ── */}
        <section className="bg-white dark:bg-stone-800 rounded-2xl border border-orange-100 dark:border-stone-700 p-6 mb-10 space-y-5 shadow-sm">
          <h2 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Lesson Details</h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
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
            <MetaField label="XP" icon={Star} value={draft.xp} onChange={(v) => updateDraft('xp', v)} type="number" placeholder="50" />
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
                return (
                  <React.Fragment key={i}>
                    <EditableSlotFrame
                      onEdit={() => setEditIdx(i)}
                      onMoveUp={() => moveUp(i)}
                      onMoveDown={() => moveDown(i)}
                      onDelete={() => deleteSlot(i)}
                      isFirst={i === 0}
                      isLast={i === draft.layout.length - 1}
                    >
                      <Component
                        id={`editor-section-${i}`}
                        heading={slot.heading || `(${SLOT_META[slot.type]?.label ?? slot.type})`}
                        data={slot.data || {}}
                      />
                    </EditableSlotFrame>
                    <InsertButton onClick={() => openPicker(i + 1)} />
                  </React.Fragment>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {pickingType && (
        <SlotPickerModal onSelect={handleTypeChosen} onClose={() => setPickingType(false)} />
      )}
      {editIdx !== null && draft.layout[editIdx] && (
        <SlotEditModal
          slot={draft.layout[editIdx]}
          onSubmit={handleSlotSave}
          onCancel={() => setEditIdx(null)}
        />
      )}
    </div>
  )
}
