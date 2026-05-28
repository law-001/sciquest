import React, { useState } from 'react'
import {
  ArrowLeft,
  Save,
  Plus,
  AlertCircle,
  Loader2,
  Hash,
  BookOpen,
} from 'lucide-react'
import { useLessonsData } from '../context/LessonsDataContext'
import { upsertQuiz } from '../lib/quizzes'
import { TYPE_LABELS } from '../components/questionMap'
import EditableSlotFrame from '../components/EditableSlotFrame'
import QuestionPickerModal from '../components/QuestionPickerModal'
import { QUESTION_FORM_MAP, QUESTION_META, DEFAULT_QUESTION_DATA } from '../components/quiz-slot-forms'
import Badge from '../components/Badge'

// ── Helpers ──────────────────────────────────────────────────────────────────

function blankDraft(lessonId) {
  return {
    lessonId: lessonId || '',
    title: '',
    description: '',
    timeLimit: 900,
    questions: [],
  }
}

function quizToEditorDraft(quiz, lessonId) {
  return {
    lessonId: lessonId || quiz.lessonId || '',
    title: quiz.title || '',
    description: quiz.description || '',
    timeLimit: quiz.timeLimit ?? 900,
    questions: JSON.parse(JSON.stringify(quiz.questions || [])),
  }
}

function draftToDbRow(draft) {
  return {
    lesson_id: draft.lessonId,
    title: draft.title,
    description: draft.description || null,
    time_limit: Number(draft.timeLimit) || 900,
    questions: draft.questions,
    is_custom: false,
    is_hidden: false,
  }
}

function genId() {
  try { return crypto.randomUUID() } catch { return `q-${Date.now()}-${Math.random().toString(36).slice(2)}` }
}

function getQuestionSummary(q) {
  switch (q.type) {
    case 'multiple-choice':
    case 'picture-based':
      return `${(q.options || []).filter(o => o).length} options`
    case 'true-false':
      return `Answer: ${q.correctAnswer ? 'True' : 'False'}`
    case 'fill-blanks':
      return `${(q.blanks || []).length} blank${(q.blanks || []).length !== 1 ? 's' : ''}`
    case 'matching':
      return `${(q.leftItems || []).filter(i => i).length} pairs`
    case 'ordering':
      return `${(q.items || []).filter(i => i).length} items to order`
    case 'identification':
      return q.correctAnswer ? `Answer: "${q.correctAnswer}"` : 'No answer set'
    case 'case-study':
      return `${(q.subQuestions || []).length} sub-question${(q.subQuestions || []).length !== 1 ? 's' : ''}`
    default:
      return ''
  }
}

// ── QuestionPreviewCard ───────────────────────────────────────────────────────

function QuestionPreviewCard({ question, index }) {
  const summary = getQuestionSummary(question)
  return (
    <div className="p-4 bg-white dark:bg-stone-800 rounded-2xl border border-orange-100 dark:border-stone-700">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-black text-sm flex items-center justify-center">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="outline" className="text-xs shrink-0">
              {TYPE_LABELS[question.type] ?? question.type}
            </Badge>
          </div>
          <p className="text-sm font-bold text-stone-900 dark:text-white line-clamp-3">
            {question.question
              ? question.type === 'fill-blanks'
                ? question.question.replace(/___/g, '___')
                : question.question
              : <span className="text-stone-400 italic">(No question text)</span>}
          </p>
          {summary && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{summary}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── QuestionEditModal ─────────────────────────────────────────────────────────

function QuestionEditModal({ question, onSubmit, onCancel, lessonId }) {
  const FormComponent = QUESTION_FORM_MAP[question.type]
  if (!FormComponent) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fdf6e3] dark:bg-stone-900 rounded-2xl shadow-2xl border border-orange-100 dark:border-stone-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-orange-100 dark:border-stone-700 shrink-0">
          <h2 className="text-lg font-black text-stone-900 dark:text-white">
            Edit — {QUESTION_META[question.type]?.label ?? question.type}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {QUESTION_META[question.type]?.desc}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto themed-scrollbar px-6 py-5">
          <FormComponent
            initialData={question}
            onSubmit={onSubmit}
            onCancel={onCancel}
            lessonId={lessonId}
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
      <button type="button" onClick={onClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 text-stone-500 dark:text-stone-400 text-xs font-bold shadow-sm hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300 dark:hover:bg-stone-700 dark:hover:text-primary-400 transition-all duration-150">
        <Plus className="w-3.5 h-3.5" />
        Add Question
      </button>
      <div className="flex-1 h-px bg-orange-100 dark:bg-stone-700 transition-colors" />
    </div>
  )
}

// ── MetaField ─────────────────────────────────────────────────────────────────

function MetaField({ label, value, onChange, type = 'text', placeholder, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">{label}</label>
      <input type={type}
        className="w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors"
        value={value}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder} />
    </div>
  )
}

// ── QuizEditorSkeleton ────────────────────────────────────────────────────────

function QuizEditorSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-stone-900">
      <div className="sticky top-0 z-30 bg-[#fdf6e3]/95 dark:bg-stone-900/95 border-b border-orange-200/60 dark:border-stone-700 h-14" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-orange-100 dark:border-stone-700 p-6 space-y-4">
          <div className="h-3 w-24 bg-stone-200 dark:bg-stone-700 rounded" />
          <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded-xl" />
          <div className="h-16 bg-stone-200 dark:bg-stone-700 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded-xl" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded-xl" />
          </div>
        </div>
        <div className="h-3 w-24 bg-stone-200 dark:bg-stone-700 rounded mx-1" />
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
      <h3 className="text-base font-bold text-stone-700 dark:text-stone-300 mb-1">No questions yet</h3>
      <p className="text-sm text-stone-400 dark:text-stone-500 mb-5">Add your first question to build the quiz</p>
      <button type="button" onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm transition-colors">
        <Plus className="w-4 h-4" />
        Add First Question
      </button>
    </div>
  )
}

// ── LessonPickerField ─────────────────────────────────────────────────────────
//
// Pairs a quiz to a lesson within a week. When creating a new quiz we need a
// teacher decision; when editing an existing quiz the pairing is shown but
// fixed (re-keying a saved quiz to a different lesson would require deleting
// the old row, which is out of scope here).

function LessonPickerField({ week, value, onChange, disabled, getQuiz, originalLessonId }) {
  const lessons = week?.lessons ?? []

  return (
    <div>
      <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
        <BookOpen className="w-3 h-3 inline mr-1" />
        Quiz for lesson <span className="text-red-400">*</span>
      </label>
      {week ? (
        <>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value || '')}
            disabled={disabled}
            className="w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <option value="">— Pick a lesson —</option>
            {lessons.map((l) => {
              const existingQuiz = getQuiz(l.id)
              const alreadyPaired = !!existingQuiz && l.id !== originalLessonId
              return (
                <option key={l.id} value={l.id} disabled={alreadyPaired && !disabled}>
                  Lesson {l.lessonNumber}: {l.title}
                  {alreadyPaired ? ' (already has a quiz)' : ''}
                </option>
              )
            })}
          </select>
          <p className="text-xs text-stone-400 mt-1">
            Week {week.weekNumber} — {week.title}
            {disabled && ' · lesson pairing is fixed once a quiz is saved'}
          </p>
        </>
      ) : (
        <p className="text-xs text-stone-500 dark:text-stone-400 italic">
          No week selected — open this editor from a week to pick a lesson.
        </p>
      )}
    </div>
  )
}

// ── QuizEditorPage ────────────────────────────────────────────────────────────

export function QuizEditorPage({ lessonId, weekId, onSave, onCancel }) {
  // Use weeksWithHidden so quizzes attached to a hidden lesson can still be
  // located and re-edited; otherwise the lesson lookup misses and the editor
  // can't initialize against the correct row.
  const { getQuiz, weeksWithHidden: weeks, dbLessons, dbQuizzes, loading, applyQuizRow } = useLessonsData()

  const isNewQuiz = !lessonId

  const lesson = lessonId
    ? weeks.flatMap(w => w.lessons).find(l => l.id === lessonId) ?? null
    : null

  // For a new quiz we get the week from props; for an existing quiz we
  // derive it from the lesson the quiz is attached to.
  const targetWeekId = weekId || lesson?.weekId || null
  const targetWeek = weeks.find(w => w.id === targetWeekId) ?? null

  // A quiz is custom if its lesson is a teacher-created lesson, or if the
  // existing DB quiz row was already marked custom (e.g. after a previous save).
  const isCustomQuiz = !!(dbLessons?.get(lessonId)?.is_custom)
    || !!(dbQuizzes?.get(lessonId)?.is_custom)

  // draft is null only while waiting for a custom quiz's DB row to arrive.
  const [draft, setDraft] = useState(() => {
    if (!lessonId) return blankDraft(lessonId)
    const existing = getQuiz(lessonId)
    if (existing) return quizToEditorDraft(existing, lessonId)
    return null
  })

  // React-idiomatic derived state: update synchronously during render once
  // loading completes so the skeleton resolves to the real data on next render.
  if (draft === null && !loading) {
    const existing = getQuiz(lessonId)
    setDraft(existing ? quizToEditorDraft(existing, lessonId) : blankDraft(lessonId))
  }

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const [insertAt, setInsertAt] = useState(null)
  const [editIdx, setEditIdx] = useState(null)
  const [pickingType, setPickingType] = useState(false)

  function updateDraft(field, value) {
    setDraft(d => ({ ...d, [field]: value }))
  }

  function openPicker(atIndex) {
    setInsertAt(atIndex)
    setPickingType(true)
  }

  function handleTypeChosen(type) {
    setPickingType(false)
    const newQ = { id: genId(), type, ...JSON.parse(JSON.stringify(DEFAULT_QUESTION_DATA[type] ?? {})) }
    // Use captured at so the functional updater stays pure (no stale closure on insertAt)
    const at = insertAt
    setDraft(d => {
      const newQs = [...d.questions]
      newQs.splice(at, 0, newQ)
      return { ...d, questions: newQs }
    })
    setEditIdx(at)
  }

  function handleQuestionSave(data) {
    const idx = editIdx
    setDraft(d => {
      const newQs = [...d.questions]
      newQs[idx] = { id: newQs[idx].id, type: newQs[idx].type, ...data }
      return { ...d, questions: newQs }
    })
    setEditIdx(null)
  }

  function moveUp(i) {
    if (i === 0) return
    setDraft(d => {
      const nq = [...d.questions];
      [nq[i - 1], nq[i]] = [nq[i], nq[i - 1]]
      return { ...d, questions: nq }
    })
  }

  function moveDown(i) {
    setDraft(d => {
      if (i >= d.questions.length - 1) return d
      const nq = [...d.questions];
      [nq[i], nq[i + 1]] = [nq[i + 1], nq[i]]
      return { ...d, questions: nq }
    })
  }

  function deleteQuestion(i) {
    setDraft(d => ({ ...d, questions: d.questions.filter((_, idx) => idx !== i) }))
  }

  if (draft === null) return <QuizEditorSkeleton />

  // Lesson chosen in the picker (reactive to draft changes when creating new).
  const selectedLesson = draft.lessonId
    ? (targetWeek?.lessons.find(l => l.id === draft.lessonId)
       ?? weeks.flatMap(w => w.lessons).find(l => l.id === draft.lessonId)
       ?? null)
    : null

  async function handleSave() {
    setSaveError(null)
    if (!draft.lessonId) { setSaveError('Pick which lesson this quiz is for.'); return }
    if (!draft.title.trim()) { setSaveError('Quiz title is required.'); return }
    if (draft.questions.length === 0) { setSaveError('Add at least one question before saving.'); return }
    setSaving(true)
    try {
      // For new quizzes, mark as custom if the target lesson is itself custom;
      // otherwise it's an "edited" overlay on a static lesson's quiz slot.
      const customFlag = isNewQuiz
        ? !!(dbLessons?.get(draft.lessonId)?.is_custom)
        : isCustomQuiz
      const saved = await upsertQuiz({ ...draftToDbRow(draft), is_custom: customFlag })
      applyQuizRow(saved)
      onSave()
    } catch (err) {
      console.error('[quiz editor] save failed:', err)
      setSaveError(err.message || err.error_description || err.hint || 'Failed to save quiz.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-stone-900">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 bg-[#fdf6e3]/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-orange-200/60 dark:border-stone-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button onClick={onCancel}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 font-bold text-sm transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Cancel</span>
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              {isNewQuiz ? 'New Quiz' : 'Quiz Editor'}
              {targetWeek ? ` · Week ${targetWeek.weekNumber}` : ''}
            </p>
            <p className="text-sm font-black text-stone-700 dark:text-stone-200 truncate">
              {draft.title || selectedLesson?.title || lesson?.title || 'Untitled Quiz'}
            </p>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold text-sm transition-colors shrink-0">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
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
          <h2 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Quiz Details</h2>

          <LessonPickerField
            week={targetWeek}
            value={draft.lessonId}
            onChange={(id) => updateDraft('lessonId', id)}
            disabled={!isNewQuiz}
            getQuiz={getQuiz}
            originalLessonId={lessonId}
          />

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input type="text" value={draft.title}
              onChange={e => updateDraft('title', e.target.value)}
              placeholder={selectedLesson ? `Quiz: ${selectedLesson.title}` : 'e.g. Quiz: Uses of Scientific Models'}
              className="w-full px-4 py-3 rounded-xl border border-orange-200 dark:border-stone-600 bg-[#fdf6e3] dark:bg-stone-900 text-stone-900 dark:text-white text-xl font-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Description</label>
            <textarea value={draft.description}
              onChange={e => updateDraft('description', e.target.value)}
              placeholder="Brief instructions for students taking this quiz"
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-700 border border-orange-100 dark:border-stone-600 w-fit">
            <Hash className="w-4 h-4 text-stone-400 shrink-0" />
            <span className="text-sm font-black text-stone-700 dark:text-stone-200">
              {draft.questions.length} question{draft.questions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </section>

        {/* ── Questions canvas ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Questions <span className="ml-2 text-primary-500">{draft.questions.length}</span>
            </h2>
            {draft.questions.length > 0 && (
              <button type="button" onClick={() => openPicker(draft.questions.length)}
                className="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add Question
              </button>
            )}
          </div>

          {draft.questions.length === 0 ? (
            <EmptyCanvas onAdd={() => openPicker(0)} />
          ) : (
            <div className="space-y-2">
              <InsertButton onClick={() => openPicker(0)} />
              {draft.questions.map((q, i) => (
                <React.Fragment key={q.id || i}>
                  <EditableSlotFrame
                    onEdit={() => setEditIdx(i)}
                    onMoveUp={() => moveUp(i)}
                    onMoveDown={() => moveDown(i)}
                    onDelete={() => deleteQuestion(i)}
                    isFirst={i === 0}
                    isLast={i === draft.questions.length - 1}
                  >
                    <QuestionPreviewCard question={q} index={i} />
                  </EditableSlotFrame>
                  <InsertButton onClick={() => openPicker(i + 1)} />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {pickingType && (
        <QuestionPickerModal onSelect={handleTypeChosen} onClose={() => setPickingType(false)} />
      )}
      {editIdx !== null && draft.questions[editIdx] && (
        <QuestionEditModal
          question={draft.questions[editIdx]}
          onSubmit={handleQuestionSave}
          onCancel={() => setEditIdx(null)}
          lessonId={lessonId}
        />
      )}
    </div>
  )
}
