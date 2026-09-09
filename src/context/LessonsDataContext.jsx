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
  subscribeToSignIn,
} from '../lib/lessons'
import {
  fetchAllQuizzes,
  getCachedQuizzes,
  subscribeToQuizChanges,
} from '../lib/quizzes'
import {
  fetchAllMaterials,
  getCachedMaterials,
  subscribeToMaterialChanges,
} from '../lib/materials'
import { resolveImagesDeep, resolveLessonImage } from '../lib/lessonImages'

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
    heroImage: resolveLessonImage(row.hero_image_url) ?? null,
    heroImageAlt: row.hero_image_alt ?? '',
    sections: row.sections ?? [],
    references: row.references ?? [],
    layout: resolveImagesDeep(row.layout ?? []),
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
        // `signature` is developer-owned code, not editable content, so it has
        // no DB column. Carry it over from the seed or a teacher's first edit
        // would silently delete the lesson's pinned interactive.
        if (!override.is_hidden || includeHidden)
          merged.push({ ...dbRowToLesson(override), signature: lesson.signature })
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
  const [materials, setMaterials] = useState(() => getCachedMaterials())
  // loading is true until the first DB fetch completes (cache gives an immediate
  // first paint but custom-lesson editors need the real data before initializing)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    function loadAll() {
      Promise.all([fetchAllLessons(), fetchAllQuizzes(), fetchAllMaterials()]).then(
        ([l, q, m]) => {
          if (!active) return
          setDbLessons(l)
          setDbQuizzes(q)
          setMaterials(m)
          setLoading(false)
        },
      )
    }

    loadAll()

    // RLS hides every content row from anonymous readers, so a load that
    // happened before sign-in came back empty. Run it again once a session
    // exists, or a visitor who signs in would keep seeing the static seed
    // until they reloaded the page.
    const unsubSignIn = subscribeToSignIn(loadAll)
    const unsubLessons = subscribeToLessonChanges(setDbLessons)
    const unsubQuizzes = subscribeToQuizChanges(setDbQuizzes)
    const unsubMaterials = subscribeToMaterialChanges(setMaterials)

    return () => {
      active = false
      unsubSignIn()
      unsubLessons()
      unsubQuizzes()
      unsubMaterials()
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

  const getMaterials = useCallback(
    (lessonId) =>
      materials
        .filter((m) => m.lesson_id === lessonId)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [materials],
  )

  // Optimistic local merge after a teacher saves, matching applyLessonRow.
  const applyMaterialRow = useCallback((row) => {
    if (!row?.id) return
    setMaterials((prev) => {
      const idx = prev.findIndex((m) => m.id === row.id)
      if (idx === -1) return [...prev, row]
      const next = [...prev]
      next[idx] = row
      return next
    })
  }, [])

  const removeMaterialRow = useCallback((id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }, [])

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

  // Restoring a quiz deletes its override row, so there is no row to merge back
  // in — drop it locally rather than waiting on the Realtime push.
  const removeQuizRow = useCallback((lessonId) => {
    if (!lessonId) return
    setDbQuizzes((prev) => {
      if (!prev.has(lessonId)) return prev
      const next = new Map(prev)
      next.delete(lessonId)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      weeks,
      weeksWithHidden,
      getQuiz,
      getMaterials,
      dbLessons,
      dbQuizzes,
      materials,
      loading,
      applyLessonRow,
      applyQuizRow,
      removeQuizRow,
      applyMaterialRow,
      removeMaterialRow,
    }),
    [
      weeks,
      weeksWithHidden,
      getQuiz,
      getMaterials,
      dbLessons,
      dbQuizzes,
      materials,
      loading,
      applyLessonRow,
      applyQuizRow,
      removeQuizRow,
      applyMaterialRow,
      removeMaterialRow,
    ],
  )

  return <LessonsDataCtx.Provider value={value}>{children}</LessonsDataCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLessonsData() {
  return useContext(LessonsDataCtx)
}
