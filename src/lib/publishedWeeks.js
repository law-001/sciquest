const KEY = 'sq_published_weeks'

// Returns a Set of published weekIds, or null if teacher has never configured
// publish state. null means "all published" (preserves default behavior).
export function getPublishedWeekIds() {
  try {
    const val = localStorage.getItem(KEY)
    return val !== null ? new Set(JSON.parse(val)) : null
  } catch {
    return null
  }
}

export function savePublishedWeekIds(ids) {
  localStorage.setItem(KEY, JSON.stringify([...ids]))
}

// A week is published when publishedIds is null (default) OR the id is in the set.
export function isWeekPublished(weekId, publishedIds) {
  if (publishedIds === null) return true
  return publishedIds.has(weekId)
}

const QUIZ_KEY = 'sq_published_quiz_weeks'

export function getPublishedQuizWeekIds() {
  try {
    const val = localStorage.getItem(QUIZ_KEY)
    return val !== null ? new Set(JSON.parse(val)) : null
  } catch {
    return null
  }
}

export function savePublishedQuizWeekIds(ids) {
  localStorage.setItem(QUIZ_KEY, JSON.stringify([...ids]))
}
