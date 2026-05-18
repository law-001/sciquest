// ============================================================
// Achievement catalog + auto-award criteria.
//
// `key` is the STABLE identifier persisted in
// student_achievements.achievement_key. Never rename a key — add a
// new entry instead. Visual presentation (icon, colors) is mapped by
// key in ProfilePage so this module stays free of React/JSX.
//
// Each `criteria(ctx)` is a pure predicate over already-stored
// progress data. Achievements that depend on data we don't capture
// yet (quiz duration, live leaderboard rank, subject taxonomy)
// return false and are documented inline — the engine still supports
// them once the data exists or they are awarded explicitly.
//
// ctx shape:
//   completedLessons : string[]                       lesson ids
//   completedRows    : { completed_at, xp_awarded }[] lesson completions
//   attempts         : { score, max_score, xp_awarded, submitted_at }[]
//   totalXp          : number
// ============================================================

export const CURIOUS_EXPLORER_KEY = 'curious-explorer'

// The landing page has no authenticated user, so the explore reward
// is flagged in localStorage and bridged into the DB on next login.
export const CURIOUS_EXPLORER_STORAGE_KEY = 'sciquest:curious-explorer-seen'

// Local calendar day for a timestamp, as YYYY-MM-DD. Streaks and
// "in a single day" are judged in the student's own timezone.
function dayKey(ts) {
  if (!ts) return null
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function activeDayKeys(ctx) {
  const days = new Set()
  for (const r of ctx.completedRows ?? []) {
    const k = dayKey(r.completed_at)
    if (k) days.add(k)
  }
  for (const a of ctx.attempts ?? []) {
    const k = dayKey(a.submitted_at)
    if (k) days.add(k)
  }
  return days
}

// Longest run of consecutive calendar days with any activity.
function longestStreak(ctx) {
  const days = [...activeDayKeys(ctx)]
    .map((k) => {
      const [y, m, d] = k.split('-').map(Number)
      return new Date(y, m, d).getTime()
    })
    .sort((a, b) => a - b)
  if (days.length === 0) return 0
  const DAY = 86400000
  let best = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const gap = Math.round((days[i] - days[i - 1]) / DAY)
    if (gap === 1) run += 1
    else if (gap > 1) run = 1
    best = Math.max(best, run)
  }
  return best
}

function maxXpInOneDay(ctx) {
  const byDay = new Map()
  const add = (ts, xp) => {
    const k = dayKey(ts)
    if (!k) return
    byDay.set(k, (byDay.get(k) ?? 0) + (xp ?? 0))
  }
  for (const r of ctx.completedRows ?? []) add(r.completed_at, r.xp_awarded)
  for (const a of ctx.attempts ?? []) add(a.submitted_at, a.xp_awarded)
  let best = 0
  for (const v of byDay.values()) best = Math.max(best, v)
  return best
}

function highAccuracyCount(ctx) {
  return (ctx.attempts ?? []).filter(
    (a) => a.max_score > 0 && a.score / a.max_score >= 0.9,
  ).length
}

// NOTE(achievements): always-false until the backing data exists.
// Speed Learner needs per-attempt duration (quiz_attempts has no
// timing column). Leaderboard King needs a real leaderboard. The
// three subject masters need a week→subject taxonomy — week.category
// today is "Chemistry/Ecology/..." not "Biology/Physics/Earth".
const NOT_YET_DERIVABLE = () => false

export const ACHIEVEMENTS = [
  {
    key: 'first-quiz',
    label: 'First Quiz',
    req: 'Complete your first quiz',
    criteria: (ctx) => (ctx.attempts?.length ?? 0) >= 1,
  },
  {
    key: 'seven-day-streak',
    label: '7-Day Streak',
    req: 'Maintain a 7-day learning streak',
    criteria: (ctx) => longestStreak(ctx) >= 7,
  },
  {
    key: 'science-nerd',
    label: 'Science Nerd',
    req: 'Complete 10 lessons',
    criteria: (ctx) => (ctx.completedLessons?.length ?? 0) >= 10,
  },
  {
    key: 'speed-learner',
    label: 'Speed Learner',
    req: 'Finish a quiz in under 2 minutes',
    criteria: NOT_YET_DERIVABLE,
  },
  {
    key: 'perfect-score',
    label: 'Perfect Score',
    req: 'Score 100% on any quiz',
    criteria: (ctx) =>
      (ctx.attempts ?? []).some(
        (a) => a.max_score > 0 && a.score === a.max_score,
      ),
  },
  {
    key: 'bookworm',
    label: 'Bookworm',
    req: 'Complete 25 lessons',
    criteria: (ctx) => (ctx.completedLessons?.length ?? 0) >= 25,
  },
  {
    key: 'sharpshooter',
    label: 'Sharpshooter',
    req: 'Achieve 90%+ accuracy 5 times',
    criteria: (ctx) => highAccuracyCount(ctx) >= 5,
  },
  {
    key: 'leaderboard-king',
    label: 'Leaderboard King',
    req: 'Reach #1 on the weekly leaderboard',
    criteria: NOT_YET_DERIVABLE,
  },
  {
    key: 'bio-master',
    label: 'Bio Master',
    req: 'Complete all Biology lessons',
    criteria: NOT_YET_DERIVABLE,
  },
  {
    key: 'physics-wizard',
    label: 'Physics Wizard',
    req: 'Complete all Physics lessons',
    criteria: NOT_YET_DERIVABLE,
  },
  {
    key: 'earth-explorer',
    label: 'Earth Explorer',
    req: 'Complete all Earth Science lessons',
    criteria: NOT_YET_DERIVABLE,
  },
  {
    key: 'on-the-rise',
    label: 'On The Rise',
    req: 'Gain 100 XP in a single day',
    criteria: (ctx) => maxXpInOneDay(ctx) >= 100,
  },
  {
    key: CURIOUS_EXPLORER_KEY,
    label: 'Curious Explorer',
    req: 'Explore the SciQuest landing page',
    // Awarded via the localStorage bridge on login, not derived.
    criteria: NOT_YET_DERIVABLE,
  },
]

const KEYS = new Set(ACHIEVEMENTS.map((a) => a.key))
export function isAchievementKey(key) {
  return KEYS.has(key)
}

// Keys whose criteria pass for the given progress context. Pure —
// no DB, no side effects. The caller diffs this against what's
// already persisted and writes only the new ones.
export function deriveUnlockedKeys(ctx) {
  return ACHIEVEMENTS.filter((a) => a.criteria(ctx)).map((a) => a.key)
}
