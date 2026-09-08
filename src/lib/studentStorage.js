// Keys for per-student browser storage.
//
// These hold in-progress work — quiz answers a student has not submitted, the
// countdown start, partly-finished interactive blocks. Scoping every key by
// user id keeps one student's draft out of the next student's session on a
// shared school computer, which is the normal case in a lab.
//
// Signed-out visitors share the 'anon' scope. Nothing they do is graded, and
// the keys are replaced by their own once they sign in.

const ANON = 'anon'

function scopeFor(userId) {
  return userId || ANON
}

export function quizAnswersKey(userId, lessonId) {
  return `sq-quiz-answers-${scopeFor(userId)}-${lessonId}`
}

export function quizTimerKey(userId, lessonId) {
  return `sq-quiz-started-${scopeFor(userId)}-${lessonId}`
}

// `scope` is normally the lesson id; the lesson editor passes a `preview-` one
// so a teacher trying a block out never writes into their own student progress.
export function interactiveStateKey(userId, scope, blockId) {
  return `sq-lesson-interact-${scopeFor(userId)}-${scope}-${blockId}`
}

// The keys above previously carried no user id, so any answers written before
// this change are readable by whoever logs in next on the same machine. Nothing
// reads them any more; this removes them from disk. Safe to run on every boot —
// once they are gone it does nothing.
const LEGACY_PREFIXES = ['quiz-answers-', 'quiz-started-', 'sq_lesson_interact_']

export function purgeLegacyStudentKeys() {
  try {
    const stale = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && LEGACY_PREFIXES.some((p) => key.startsWith(p))) stale.push(key)
    }
    for (const key of stale) localStorage.removeItem(key)
  } catch {
    /* private mode — nothing to clean up */
  }
}
