import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { WEEKS_DATA } from '../data/lessonsweek-01'
import { getQuizByLesson } from '../data/quizzesweek-01'
import {
  fetchAllLessons,
  getCachedLessons,
  subscribeToLessonChanges,
} from '../lib/lessons'
import {
  fetchAllQuizzes,
  getCachedQuizzes,
  subscribeToQuizChanges,
} from '../lib/quizzes'

const LessonsDataCtx = createContext(null)

// ── Converters ────────────────────────────────────────────────────────────────

// Maps a DB row (snake_case) to the lesson shape consumers expect (camelCase).
function dbRowToLesson(row) {
  return {
    id: row.id,
    weekId: row.week_id,
    lessonNumber: row.lesson_number,
    title: row.title,
    badge: row.badge ?? '',
    subtitle: row.subtitle ?? '',
    readTime: row.read_time ?? '~15 min read',
    xp: row.xp ?? 50,
    heroImage: row.hero_image_url ?? null,
    heroImageAlt: row.hero_image_alt ?? '',
    sections: row.sections ?? [],
    references: row.references ?? [],
    layout: row.layout ?? [],
    isHidden: !!row.is_hidden,
    _isFromDb: true,
  }
}

// Maps a DB row to the quiz shape consumers expect.
function dbRowToQuiz(row) {
  return {
    lessonId: row.lesson_id,
    title: row.title,
    description: row.description ?? '',
    timeLimit: row.time_limit ?? 900,
    questions: row.questions ?? [],
    _isFromDb: true,
  }
}

// ── Merge helpers ─────────────────────────────────────────────────────────────

// Merge rule (deterministic, order matters):
// 1. For each static lesson: if DB row with same id → use DB row; is_hidden → drop
//    (unless `includeHidden` is true, in which case the lesson is kept with
//    isHidden: true so teachers can see and unhide it).
// 2. Append DB-only custom lessons into their target week, sorted by lesson_number.
function mergeWeeks(staticWeeks, dbLessons, { includeHidden = false } = {}) {
  return staticWeeks.map((week) => {
    const merged = []
    const staticIds = new Set(week.lessons.map((l) => l.id))

    for (const lesson of week.lessons) {
      const override = dbLessons.get(lesson.id)
      if (override) {
        if (!override.is_hidden || includeHidden)
          merged.push(dbRowToLesson(override))
      } else {
        merged.push(lesson)
      }
    }

    for (const [, row] of dbLessons) {
      if (staticIds.has(row.id)) continue
      if (
        row.is_custom &&
        row.week_id === week.id &&
        (!row.is_hidden || includeHidden)
      ) {
        merged.push(dbRowToLesson(row))
      }
    }

    merged.sort(
      (a, b) =>
        (a.lessonNumber ?? a.lesson_number ?? 0) -
        (b.lessonNumber ?? b.lesson_number ?? 0),
    )

    return { ...week, lessons: merged }
  })
}

// DB row wins unless hidden; falls back to static if no DB override.
function mergeQuiz(staticQuiz, dbRow) {
  if (!dbRow) return staticQuiz
  if (dbRow.is_hidden) return null
  return dbRowToQuiz(dbRow)
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function LessonsDataProvider({ children }) {
  const [dbLessons, setDbLessons] = useState(() => getCachedLessons())
  const [dbQuizzes, setDbQuizzes] = useState(() => getCachedQuizzes())
  // loading is true until the first DB fetch completes (cache gives an immediate
  // first paint but custom-lesson editors need the real data before initializing)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([fetchAllLessons(), fetchAllQuizzes()]).then(([l, q]) => {
      if (!active) return
      setDbLessons(l)
      setDbQuizzes(q)
      setLoading(false)
    })

    const unsubLessons = subscribeToLessonChanges(setDbLessons)
    const unsubQuizzes = subscribeToQuizChanges(setDbQuizzes)

    return () => {
      active = false
      unsubLessons()
      unsubQuizzes()
    }
  }, [])

  const weeks = useMemo(() => mergeWeeks(WEEKS_DATA, dbLessons), [dbLessons])
  // Teacher-facing variant that keeps hidden lessons in the list so the
  // teacher portal can render an unhide control for them.
  const weeksWithHidden = useMemo(
    () => mergeWeeks(WEEKS_DATA, dbLessons, { includeHidden: true }),
    [dbLessons],
  )

  const getQuiz = useCallback(
    (lessonId) => mergeQuiz(getQuizByLesson(lessonId), dbQuizzes.get(lessonId)),
    [dbQuizzes],
  )

  // Optimistic local merges so the UI updates immediately after a save without
  // waiting for the Realtime push (which requires it to be enabled in Supabase).
  const applyLessonRow = useCallback((row) => {
    if (!row?.id) return
    setDbLessons((prev) => {
      const next = new Map(prev)
      next.set(row.id, row)
      return next
    })
  }, [])

  const applyQuizRow = useCallback((row) => {
    if (!row?.lesson_id) return
    setDbQuizzes((prev) => {
      const next = new Map(prev)
      next.set(row.lesson_id, row)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      weeks,
      weeksWithHidden,
      getQuiz,
      dbLessons,
      dbQuizzes,
      loading,
      applyLessonRow,
      applyQuizRow,
    }),
    [
      weeks,
      weeksWithHidden,
      getQuiz,
      dbLessons,
      dbQuizzes,
      loading,
      applyLessonRow,
      applyQuizRow,
    ],
  )

  return <LessonsDataCtx.Provider value={value}>{children}</LessonsDataCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLessonsData() {
  return useContext(LessonsDataCtx)
}
