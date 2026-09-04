import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Trophy,
  Zap,
  Flame,
  Crown,
  Shield,
  BookOpen,
  Target,
  Star,
  Clock,
  CheckCircle2,
  Lock,
  Edit3,
  X,
  Dna,
  Atom,
  Globe2,
  Award,
  TrendingUp,
  Calendar,
  BarChart3,
  Layers,
  Microscope,
  FlaskConical,
  Leaf,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from "lucide-react";
import { isHiddenAchievement } from "../lib/achievements";
import { levelFromXp, xpToNextLevel } from "../lib/xp-config";
import { WEEKS_DATA } from "../data/lessonsweek-01";
import { fetchLeaderboard } from "../lib/leaderboard";
import { fetchScreenSeconds } from "../lib/screentime";
import { updateStudentProfile } from "../lib/users";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "../components/Avatar";
import { AVATARS } from "../lib/avatars";

/* ─────────────────────────────────────────────────────────── */
/*  Static catalogs (visual only — never holds user state)      */
/* ─────────────────────────────────────────────────────────── */

const LEADERBOARD_PERIODS = ["This Week", "Month", "All Time"];
const PERIOD_API = { "This Week": "week", Month: "month", "All Time": "all" };

// Visual catalog. `key` matches src/lib/achievements.js — unlock
// state comes from the DB (the unlockedAchievements prop), never
// hardcoded here.
const ALL_ACHIEVEMENTS = [
  { key: "first-quiz", Icon: Trophy, label: "First Quiz", bg: "bg-amber-500/20", color: "text-amber-500", req: "Complete your first quiz" },
  { key: "seven-day-streak", Icon: Flame, label: "7-Day Streak", bg: "bg-orange-500/20", color: "text-orange-500", req: "Maintain a 7-day learning streak" },
  { key: "science-nerd", Icon: Shield, label: "Science Nerd", bg: "bg-teal-500/20", color: "text-teal-500", req: "Complete 10 lessons" },
  { key: "speed-learner", Icon: Zap, label: "Speed Learner", bg: "bg-yellow-400/20", color: "text-yellow-500", req: "Finish a quiz in under 2 minutes" },
  { key: "perfect-score", Icon: Star, label: "Perfect Score", bg: "bg-purple-500/20", color: "text-purple-500", req: "Score 100% on any quiz" },
  { key: "bookworm", Icon: BookOpen, label: "Bookworm", bg: "bg-blue-500/20", color: "text-blue-500", req: "Complete 25 lessons" },
  { key: "sharpshooter", Icon: Target, label: "Sharpshooter", bg: "bg-rose-500/20", color: "text-rose-500", req: "Achieve 90%+ accuracy 5 times" },
  { key: "leaderboard-king", Icon: Crown, label: "Leaderboard King", bg: "bg-amber-400/20", color: "text-amber-500", req: "Reach #1 on the weekly leaderboard" },
  { key: "bio-master", Icon: Dna, label: "Bio Master", bg: "bg-green-500/20", color: "text-green-500", req: "Complete all Biology lessons" },
  { key: "physics-wizard", Icon: Atom, label: "Physics Wizard", bg: "bg-sky-500/20", color: "text-sky-500", req: "Complete all Physics lessons" },
  { key: "earth-explorer", Icon: Globe2, label: "Earth Explorer", bg: "bg-yellow-500/20", color: "text-yellow-500", req: "Complete all Earth Science lessons" },
  { key: "on-the-rise", Icon: TrendingUp, label: "On The Rise", bg: "bg-indigo-500/20", color: "text-indigo-500", req: "Gain 100 XP in a single day" },
  { key: "curious-explorer", Icon: Award, label: "Curious Explorer", bg: "bg-pink-500/20", color: "text-pink-500", req: "Explore the SciQuest landing page" },
  { key: "blacked", Icon: Star, label: "BLACKED", bg: "bg-stone-800/20", color: "text-stone-800 dark:text-stone-200", req: "Hidden — discover it for yourself" },
  { key: "matter-state-sandbox-complete", Icon: Layers, label: "State Changer", bg: "bg-blue-500/20", color: "text-blue-500", req: "Complete all levels in Matter State Sandbox" },
  { key: "mystery-lab-complete", Icon: FlaskConical, label: "Lab Detective", bg: "bg-teal-500/20", color: "text-teal-500", req: "Solve the Dying Pond mystery in Mystery Lab" },
  { key: "cell-division-lab-complete", Icon: Dna, label: "Cell Splitter", bg: "bg-emerald-500/20", color: "text-emerald-500", req: "Complete your first division in Cell Division Lab" },
];

// Icon + accent per lesson category. Categories come from
// WEEKS_DATA[].category; anything unmapped falls back to the last entry.
const CATEGORY_STYLE = {
  "Scientific Method": { Icon: Target, color: "#38bdf8" },
  Matter: { Icon: Atom, color: "#8b5cf6" },
  Chemistry: { Icon: FlaskConical, color: "#f97316" },
  "Laboratory Skills": { Icon: Microscope, color: "#14b8a6" },
  "Life Science": { Icon: Dna, color: "#22c55e" },
  Ecology: { Icon: Leaf, color: "#84cc16" },
  _fallback: { Icon: BookOpen, color: "#f59e0b" },
};
const categoryStyle = (cat) => CATEGORY_STYLE[cat] ?? CATEGORY_STYLE._fallback;

/* ─────────────────────────────────────────────────────────── */
/*  Derived lookups from the lesson data (module-level: static) */
/* ─────────────────────────────────────────────────────────── */

// lessonId → { title, category, weekTitle }
const LESSON_INDEX = (() => {
  const map = new Map();
  for (const week of WEEKS_DATA ?? []) {
    for (const lesson of week.lessons ?? []) {
      map.set(lesson.id, {
        title: lesson.title,
        category: week.category,
        weekTitle: week.title,
      });
    }
  }
  return map;
})();

// Ordered list of categories with their total lesson count.
const CATEGORY_TOTALS = (() => {
  const order = [];
  const totals = new Map();
  for (const week of WEEKS_DATA ?? []) {
    const cat = week.category ?? "Other";
    if (!totals.has(cat)) {
      totals.set(cat, 0);
      order.push(cat);
    }
    totals.set(cat, totals.get(cat) + (week.lessons?.length ?? 0));
  }
  return order.map((cat) => ({ category: cat, total: totals.get(cat) }));
})();

/* ─────────────────────────────────────────────────────────── */
/*  Small pure helpers                                          */
/* ─────────────────────────────────────────────────────────── */

function dayKey(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Active-day set across lesson completions + quiz submissions.
function activeDayKeys(completedRows, attempts) {
  const set = new Set();
  for (const r of completedRows ?? []) {
    const k = dayKey(r.completed_at);
    if (k) set.add(k);
  }
  for (const a of attempts ?? []) {
    const k = dayKey(a.submitted_at);
    if (k) set.add(k);
  }
  return set;
}

// Length of the streak that is still "alive" — the most recent active
// day must be today or yesterday, otherwise the streak is broken (0).
function currentStreak(dayKeys) {
  if (dayKeys.size === 0) return 0;
  const DAY = 86_400_000;
  const times = [...dayKeys]
    .map((k) => {
      const [y, m, d] = k.split("-").map(Number);
      return new Date(y, m, d).getTime();
    })
    .sort((a, b) => b - a);
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  if (times[0] !== today && times[0] !== today - DAY) return 0;
  let streak = 1;
  for (let i = 1; i < times.length; i++) {
    const gap = Math.round((times[i - 1] - times[i]) / DAY);
    if (gap === 1) streak += 1;
    else if (gap === 0) continue;
    else break;
  }
  return streak;
}

function compactXp(n) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k.toFixed(k >= 10 ? 0 : 2)}k`;
}

function relTime(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  if (Number.isNaN(diff)) return "";
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const days = Math.floor(h / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const w = Math.floor(days / 7);
  if (days < 30) return `${w} week${w > 1 ? "s" : ""} ago`;
  const mo = Math.floor(days / 30);
  if (days < 365) return `${mo} month${mo > 1 ? "s" : ""} ago`;
  const y = Math.floor(days / 365);
  return `${y} year${y > 1 ? "s" : ""} ago`;
}

// Global screen-time seconds → a CountUp-friendly { value, suffix }.
function screenTimeStat(seconds) {
  if (seconds >= 3600) return { value: Math.round(seconds / 3600), suffix: "h" };
  if (seconds >= 60) return { value: Math.round(seconds / 60), suffix: "m" };
  return { value: seconds, suffix: "s" };
}

/* ─────────────────────────────────────────────────────────── */
/*  useScrollTrigger                                            */
/* ─────────────────────────────────────────────────────────── */
function useScrollTrigger(threshold = 0.25) {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, triggered];
}

/* ─────────────────────────────────────────────────────────── */
/*  CountUp                                                     */
/* ─────────────────────────────────────────────────────────── */
function CountUp({ target, suffix = "", duration = 1400, triggered }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const start = Date.now();
    const animate = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(eased * target);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [triggered, target, duration]);
  return (
    <>
      {Math.round(val).toLocaleString()}
      {suffix}
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  EditProfileModal — persists first/last name to Supabase     */
/* ─────────────────────────────────────────────────────────── */
function EditProfileModal({ isOpen, onClose, user, profile, onSaved }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFirstName(profile?.first_name ?? "");
      setLastName(profile?.last_name ?? "");
      setAvatar(profile?.avatar ?? null);
      setPickerOpen(false);
      setError("");
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setError("");
    try {
      await updateStudentProfile(user.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar,
      });
      await onSaved?.();
      onClose();
    } catch {
      setError("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-300/80 dark:bg-stone-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-stone-900 dark:text-white font-heading">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 mb-6">
          <Avatar
            avatarId={avatar}
            name={firstName || profile?.first_name}
            size={80}
          />
          {pickerOpen ? (
            <div className="w-full">
              <p className="block text-xs font-bold text-stone-500 dark:text-stone-400 tracking-widest uppercase mb-2 text-center">
                Choose Your Avatar
              </p>
              <div
                role="radiogroup"
                aria-label="Choose your avatar"
                className="grid grid-cols-5 gap-2"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={avatar === null}
                  aria-label="Initial"
                  onClick={() => setAvatar(null)}
                  className={`rounded-full p-0.5 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    avatar === null
                      ? "ring-2 ring-primary-500"
                      : "ring-1 ring-stone-200 dark:ring-stone-700 hover:ring-primary-500/50"
                  }`}
                >
                  <Avatar
                    name={firstName || profile?.first_name}
                    size={48}
                  />
                </button>
                {AVATARS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={avatar === a.id}
                    aria-label={a.label}
                    onClick={() => setAvatar(a.id)}
                    className={`rounded-full p-0.5 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                      avatar === a.id
                        ? "ring-2 ring-primary-500"
                        : "ring-1 ring-stone-200 dark:ring-stone-700 hover:ring-primary-500/50"
                    }`}
                  >
                    <Avatar avatarId={a.id} size={48} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-2 py-1"
            >
              Change Profile
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="edit-first-name"
              className="block text-xs font-bold text-stone-500 dark:text-stone-400 tracking-widest uppercase mb-2"
            >
              First Name
            </label>
            <input
              id="edit-first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="edit-last-name"
              className="block text-xs font-bold text-stone-500 dark:text-stone-400 tracking-widest uppercase mb-2"
            >
              Last Name
            </label>
            <input
              id="edit-last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          {error && (
            <p className="text-xs font-bold text-rose-500" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 font-bold text-sm hover:border-stone-400 dark:hover:border-stone-600 hover:text-stone-700 dark:hover:text-stone-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !firstName.trim()}
            className="flex-1 py-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-bold text-sm transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  ProfilePage                                                 */
/* ─────────────────────────────────────────────────────────── */
export function ProfilePage({
  completedLessons = [],
  completedRows = [],
  quizAttempts = [],
  unlockedAchievements = [],
  totalXp = 0,
  highlightAchievement = null,
  scrollTarget = null,
  highlightActivity = null,
}) {
  const { user, profile, refreshProfile } = useAuth();
  const isStudent = profile?.role === "student";

  const [xpWidth, setXpWidth] = useState(0);
  const [activePeriod, setActivePeriod] = useState("This Week");
  const [editOpen, setEditOpen] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [myQuizzesOpen, setMyQuizzesOpen] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [activeActivityHighlight, setActiveActivityHighlight] = useState(null);

  const [board, setBoard] = useState([]);
  const [boardLoading, setBoardLoading] = useState(true);
  const [allTimeBoard, setAllTimeBoard] = useState([]);
  const [screenSeconds, setScreenSeconds] = useState(null);

  const [headerRef, headerTriggered] = useScrollTrigger(0.1);
  const [statsRef, statsTriggered] = useScrollTrigger(0.2);
  const [subjectRef, subjectTriggered] = useScrollTrigger(0.2);
  const [leaderboardRef, leaderboardTriggered] = useScrollTrigger(0.2);
  const [myQuizzesRef, myQuizzesTriggered] = useScrollTrigger(0.2);
  const [activityRef, activityTriggered] = useScrollTrigger(0.2);
  const [achievementsRef, achievementsTriggered] = useScrollTrigger(0.1);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Derived player + progress data ---- */

  const displayName =
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
    user?.user_metadata?.first_name ||
    "Learner";
  const level = levelFromXp(totalXp);
  const levelProgress = xpToNextLevel(totalXp);
  const xpTargetPct = levelProgress
    ? Math.round((levelProgress.progressXp / levelProgress.neededXp) * 100)
    : 100;

  const streak = useMemo(
    () => currentStreak(activeDayKeys(completedRows, quizAttempts)),
    [completedRows, quizAttempts],
  );

  // One stable "now" per mount — keeps render pure (no Date.now() in body).
  const [nowTs] = useState(() => Date.now());
  const memberSince = profile?.created_at
    ? new Date(profile.created_at)
    : null;
  const memberSinceLabel = memberSince
    ? memberSince.toLocaleString("default", { month: "long", year: "numeric" })
    : "—";
  const monthsLearning = memberSince
    ? Math.max(
        0,
        Math.floor((nowTs - memberSince.getTime()) / (30 * 86_400_000)),
      )
    : 0;

  // Accuracy across every graded quiz attempt.
  const { gradedScore, gradedMax } = useMemo(() => {
    let s = 0;
    let mx = 0;
    for (const a of quizAttempts) {
      if (a.max_score > 0) {
        s += a.score;
        mx += a.max_score;
      }
    }
    return { gradedScore: s, gradedMax: mx };
  }, [quizAttempts]);
  const accuracy = gradedMax > 0 ? Math.round((gradedScore / gradedMax) * 100) : 0;

  const quizzesTaken = useMemo(
    () => new Set(quizAttempts.map((a) => a.lesson_id)).size,
    [quizAttempts],
  );

  // Subject mastery per category from the real lesson taxonomy.
  const subjectProgress = useMemo(() => {
    const done = new Set(completedLessons);
    return CATEGORY_TOTALS.map(({ category, total }) => {
      let completed = 0;
      for (const id of done) {
        if (LESSON_INDEX.get(id)?.category === category) completed += 1;
      }
      const { Icon, color } = categoryStyle(category);
      return {
        label: category,
        Icon,
        color,
        lessons: completed,
        total,
        mastery: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    }).filter((s) => s.total > 0);
  }, [completedLessons]);

  // Merged, newest-first feed of lesson completions + quiz submissions.
  const recentActivity = useMemo(() => {
    const items = [];
    for (const a of quizAttempts) {
      const info = LESSON_INDEX.get(a.lesson_id);
      const pct = a.max_score > 0 ? Math.round((a.score / a.max_score) * 100) : null;
      items.push({
        type: "quiz",
        lessonId: a.lesson_id,
        label: `${info?.category ?? "Quiz"}: ${info?.title ?? a.lesson_id}`,
        score: pct,
        xp: a.xp_awarded ?? 0,
        ts: a.submitted_at,
        Icon: Target,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      });
    }
    for (const r of completedRows) {
      const info = LESSON_INDEX.get(r.lesson_id);
      items.push({
        type: "lesson",
        lessonId: r.lesson_id,
        label: `${info?.category ?? "Lesson"}: ${info?.title ?? r.lesson_id}`,
        score: null,
        xp: r.xp_awarded ?? 0,
        ts: r.completed_at,
        Icon: BookOpen,
        color: "text-sky-500",
        bg: "bg-sky-500/10",
      });
    }
    return items
      .filter((i) => i.ts)
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
      .slice(0, 6);
  }, [quizAttempts, completedRows]);

  // All quiz attempts newest-first, enriched with lesson info and status.
  const quizzesDone = useMemo(() => {
    return quizAttempts
      .slice()
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
      .map((a) => {
        const info = LESSON_INDEX.get(a.lesson_id);
        const pct = a.max_score > 0 ? Math.round((a.score / a.max_score) * 100) : null;
        return {
          lessonId: a.lesson_id,
          title: info?.title ?? a.lesson_id,
          category: info?.category ?? "Quiz",
          score: pct,
          pending: (a.pending_grade_count ?? 0) > 0,
          xp: a.xp_awarded ?? 0,
          ts: a.submitted_at,
        };
      });
  }, [quizAttempts]);

  // Category the student has touched most — "Current Focus".
  const currentFocus = useMemo(() => {
    const tally = new Map();
    const bump = (cat, ts) => {
      if (!cat) return;
      const prev = tally.get(cat) ?? { count: 0, last: 0 };
      tally.set(cat, {
        count: prev.count + 1,
        last: Math.max(prev.last, new Date(ts).getTime() || 0),
      });
    };
    for (const a of quizAttempts)
      bump(LESSON_INDEX.get(a.lesson_id)?.category, a.submitted_at);
    for (const r of completedRows)
      bump(LESSON_INDEX.get(r.lesson_id)?.category, r.completed_at);
    let best = null;
    for (const [cat, v] of tally) {
      if (
        !best ||
        v.count > best.count ||
        (v.count === best.count && v.last > best.last)
      ) {
        best = { category: cat, ...v };
      }
    }
    return best;
  }, [quizAttempts, completedRows]);

  const unlockedKeys = new Set(unlockedAchievements);
  const visibleAchievements = ALL_ACHIEVEMENTS.filter(
    (a) => !isHiddenAchievement(a.key) || unlockedKeys.has(a.key),
  );
  const unlockedCount = visibleAchievements.filter((a) =>
    unlockedKeys.has(a.key),
  ).length;
  const earnedBadges = ALL_ACHIEVEMENTS.filter((a) =>
    unlockedKeys.has(a.key),
  ).slice(0, 4);

  const userRank =
    allTimeBoard.find((e) => e.studentId === user?.id)?.rank ?? null;

  const screen = screenTimeStat(screenSeconds ?? 0);
  const statCards = [
    { label: "Lessons Done", value: completedLessons.length, suffix: "", Icon: BookOpen, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    { label: "Quizzes Taken", value: quizzesTaken, suffix: "", Icon: Target, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Accuracy", value: accuracy, suffix: "%", Icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "SciQuest Time", value: screen.value, suffix: screen.suffix, Icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Badges Earned", value: unlockedAchievements.length, suffix: "", Icon: Award, color: "text-primary-500", bg: "bg-primary-500/10", border: "border-primary-500/20" },
  ];

  const quickStats = [
    {
      label: "Global Rank",
      value: userRank ? `#${userRank}` : "Unranked",
      color: "text-amber-500",
    },
    {
      label: "Streak",
      value: streak > 0 ? `${streak} Day${streak > 1 ? "s" : ""}` : "None",
      color: "text-orange-500",
    },
    {
      label: "Total XP",
      value: compactXp(totalXp),
      color: "text-primary-500",
    },
  ];

  /* ---- Effects ---- */

  useEffect(() => {
    if (!headerTriggered) return;
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setXpWidth(xpTargetPct);
      return;
    }
    const id = setTimeout(() => {
      const start = Date.now();
      const run = () => {
        const t = Math.min((Date.now() - start) / 1200, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setXpWidth(Math.round(eased * xpTargetPct));
        if (t < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }, 400);
    return () => clearTimeout(id);
  }, [headerTriggered, prefersReducedMotion, xpTargetPct]);

  // Period leaderboard — refetches when the period toggle changes.
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBoardLoading(true);
    fetchLeaderboard(PERIOD_API[activePeriod])
      .then((rows) => {
        if (!cancelled) setBoard(rows);
      })
      .catch(() => {
        if (!cancelled) setBoard([]);
      })
      .finally(() => {
        if (!cancelled) setBoardLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activePeriod]);

  // All-time board, fetched once, drives the "Global Rank" quick stat.
  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard("all")
      .then((rows) => {
        if (!cancelled) setAllTimeBoard(rows);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Achievement highlight — when arriving here from an achievement
  // notification, scroll the achievements grid into view and pulse the
  // earned badge for a few seconds. Re-fires when the token changes so
  // re-clicking the same achievement notification re-triggers it.
  useEffect(() => {
    const key = highlightAchievement?.key;
    if (!key) return;
    const highlightId = setTimeout(() => setActiveHighlight(key), 0);
    const scrollId = setTimeout(() => {
      achievementsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 250);
    const clearId = setTimeout(() => setActiveHighlight(null), 3500);
    return () => {
      clearTimeout(highlightId);
      clearTimeout(scrollId);
      clearTimeout(clearId);
    };
  }, [highlightAchievement?.key, highlightAchievement?.token, achievementsRef]);

  // Pulse the most recent matching activity row when a lesson-XP notif
  // sent us to Recent Activity. Token re-fires for repeat clicks.
  useEffect(() => {
    const lessonId = highlightActivity?.lessonId;
    if (!lessonId) return;
    const startId = setTimeout(() => setActiveActivityHighlight(lessonId), 0);
    const id = setTimeout(() => setActiveActivityHighlight(null), 3500);
    return () => { clearTimeout(startId); clearTimeout(id); };
  }, [highlightActivity?.lessonId, highlightActivity?.token]);

  // Scroll target — when arriving here from a notification (e.g. a
  // lesson-complete XP notif), scroll the corresponding section into
  // view. The token re-fires the effect if the user clicks the same
  // notif again while already on this page.
  useEffect(() => {
    const target = scrollTarget?.target;
    if (!target) return;
    const ref =
      target === "activity"
        ? activityRef
        : target === "achievements"
          ? achievementsRef
          : null;
    if (!ref) return;
    const id = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
    return () => clearTimeout(id);
  }, [scrollTarget?.target, scrollTarget?.token, activityRef, achievementsRef]);

  // Global screen-time total — polled so it stays roughly live.
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetchScreenSeconds()
        .then((s) => {
          if (!cancelled) setScreenSeconds(s);
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Cap the rendered board and guarantee the signed-in student sees
  // their own row even if they fall outside the top slice.
  const TOP_N = 8;
  const topBoard = board.slice(0, TOP_N);
  const selfEntry = board.find((e) => e.studentId === user?.id);
  const selfOutsideTop =
    selfEntry && !topBoard.some((e) => e.studentId === user?.id)
      ? selfEntry
      : null;

  const rankBadgeClass = (rank) =>
    rank === 1
      ? "bg-amber-400 text-stone-900"
      : rank === 2
        ? "bg-stone-400 text-stone-900"
        : rank === 3
          ? "bg-amber-700 text-white"
          : "bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300";

  const renderBoardRow = (entry, i) => {
    const isUser = entry.studentId === user?.id;
    return (
      <div
        key={entry.studentId}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-[opacity,transform] duration-500 ease-out ${
          leaderboardTriggered
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4"
        } ${
          isUser
            ? "bg-primary-500/10 border border-primary-500/30"
            : "bg-stone-100 dark:bg-stone-800/60"
        }`}
        style={{
          transitionDelay: leaderboardTriggered ? `${200 + i * 80}ms` : "0ms",
        }}
      >
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${rankBadgeClass(
            entry.rank,
          )}`}
        >
          {entry.rank === 1 ? <Crown className="w-4 h-4" /> : entry.rank}
        </span>
        <Avatar avatarId={entry.avatar} name={entry.name} size={32} />
        <span
          className={`flex-1 text-sm font-bold truncate ${
            isUser
              ? "text-primary-600 dark:text-primary-300"
              : "text-stone-700 dark:text-stone-200"
          }`}
        >
          {isUser ? "You" : entry.name}
        </span>
        <span className="text-sm font-black text-stone-900 dark:text-white font-heading tabular-nums shrink-0">
          {entry.xp.toLocaleString()} XP
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-stone-950">
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        profile={profile}
        onSaved={refreshProfile}
      />

      {/* Decorative radial glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-175 h-80 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* PAGE TITLE + EDIT BUTTON */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-stone-900 dark:text-white font-heading tracking-tight">
              My Profile
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 font-medium">
              Track your progress, streaks, and achievements
            </p>
          </div>
          {user && isStudent && (
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-sm font-bold hover:border-primary-500/60 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* PROFILE HEADER */}
        <section
          ref={headerRef}
          className="grid lg:grid-cols-2 gap-8 items-start"
        >
          {/* Player card */}
          <div
            className={`rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm transition-[opacity,transform] duration-700 ease-out ${
              headerTriggered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-start gap-4 mb-6">
              <Avatar
                avatarId={profile?.avatar}
                name={displayName}
                size={64}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-xl font-black text-stone-900 dark:text-white font-heading">
                    {displayName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold">
                    LVL {level}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-stone-500 dark:text-stone-400">
                    {streak > 0
                      ? `${streak}-day streak`
                      : "No active streak"}
                  </span>
                </div>
                <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                  {profile?.section
                    ? `Section ${profile.section}`
                    : "SciQuest learner"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-stone-900 dark:text-white font-heading tabular-nums">
                  {totalXp.toLocaleString()}
                </p>
                <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                  {levelProgress
                    ? `/ ${levelProgress.nextLevelXp.toLocaleString()} XP`
                    : "Max level"}
                </p>
              </div>
            </div>

            {/* XP progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 font-medium mb-2">
                <span>
                  {levelProgress
                    ? `Progress to Level ${levelProgress.nextLevel}`
                    : "Max level reached"}
                </span>
                <span className="tabular-nums">{xpWidth}%</span>
              </div>
              <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-500 origin-left transition-[transform] duration-1200 ease-out"
                  style={{ transform: `scaleX(${xpWidth / 100})` }}
                />
              </div>
            </div>

            {/* Earned badges */}
            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-widest uppercase mb-3">
              Achievements
            </p>
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {earnedBadges.map(({ key, Icon, label, bg, color }) => (
                  <div
                    key={key}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 text-center font-medium leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                Complete lessons and quizzes to earn your first badge.
              </p>
            )}
          </div>

          {/* Right column */}
          <div
            className={`flex flex-col gap-5 transition-[opacity,transform] duration-700 ease-out delay-150 ${
              headerTriggered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Quick stat strip */}
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
              <p className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-widest uppercase mb-4">
                Quick Stats
              </p>
              <div className="grid grid-cols-3 divide-x divide-stone-200 dark:divide-stone-800">
                {quickStats.map(({ label, value, color }) => (
                  <div key={label} className="text-center px-2">
                    <p
                      className={`text-xl font-black font-heading tabular-nums ${color}`}
                    >
                      {value}
                    </p>
                    <p className="text-[11px] font-bold text-stone-400 dark:text-stone-500 tracking-wide mt-0.5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current focus */}
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
              <p className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-widest uppercase mb-3">
                Current Focus
              </p>
              {currentFocus ? (
                (() => {
                  const { Icon, color } = categoryStyle(
                    currentFocus.category,
                  );
                  return (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}1a` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-stone-900 dark:text-white font-heading">
                          {currentFocus.category}
                        </p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                          Most active subject
                        </p>
                      </div>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                        style={{ backgroundColor: `${color}26`, color }}
                      >
                        Top Pick
                      </span>
                    </div>
                  );
                })()
              ) : (
                <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                  No activity yet — start a lesson to set your focus.
                </p>
              )}
            </div>

            {/* Member since */}
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
              <p className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-widest uppercase mb-3">
                Member Since
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm font-black text-stone-900 dark:text-white font-heading">
                    {memberSinceLabel}
                  </p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                    {memberSince
                      ? monthsLearning >= 1
                        ? `${monthsLearning} month${monthsLearning > 1 ? "s" : ""} of learning`
                        : "New this month"
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS OVERVIEW */}
        <section ref={statsRef}>
          <p
            className={`text-xs font-bold text-stone-400 dark:text-stone-500 tracking-widest uppercase mb-4 transition-[opacity,transform] duration-500 ease-out ${
              statsTriggered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Stats Overview
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map(
              ({ label, value, suffix, Icon, color, bg, border }, i) => (
                <div
                  key={label}
                  className={`rounded-2xl bg-white dark:bg-stone-900 border ${border} p-5 flex flex-col gap-3 shadow-sm transition-[opacity,transform] duration-700 ease-out ${
                    statsTriggered
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: statsTriggered ? `${i * 80}ms` : "0ms",
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-black font-heading tabular-nums ${color}`}
                    >
                      {statsTriggered ? (
                        <CountUp
                          target={value}
                          suffix={suffix}
                          triggered={statsTriggered}
                          duration={1100 + i * 100}
                        />
                      ) : (
                        <span className="opacity-0">0</span>
                      )}
                    </p>
                    <p className="text-xs font-medium text-stone-400 dark:text-stone-500 mt-0.5 leading-tight">
                      {label}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* SUBJECT PROGRESS + LEADERBOARD */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Subject Progress */}
          <section ref={subjectRef}>
            <div
              className={`rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm transition-[opacity,transform] duration-700 ease-out ${
                subjectTriggered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-stone-900 dark:text-white font-heading">
                  Subject Progress
                </h3>
                <Layers
                  className="w-4 h-4 text-stone-400 dark:text-stone-600"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-6">
                {subjectProgress.map(
                  ({ label, Icon, color, mastery, lessons, total }, i) => (
                    <div
                      key={label}
                      className={`transition-[opacity,transform] duration-700 ease-out ${
                        subjectTriggered
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4"
                      }`}
                      style={{
                        transitionDelay: subjectTriggered
                          ? `${i * 120}ms`
                          : "0ms",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        <span className="text-sm font-bold text-stone-700 dark:text-stone-200 flex-1">
                          {label}
                        </span>
                        <span className="text-xs text-stone-400 dark:text-stone-500 tabular-nums">
                          {lessons}/{total}
                        </span>
                        <span
                          className="text-sm font-black font-heading tabular-nums w-10 text-right"
                          style={{ color }}
                        >
                          {mastery}%
                        </span>
                      </div>
                      <div className="h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden ml-11">
                        <div
                          className="h-full rounded-full origin-left transition-[transform] duration-1000 ease-out"
                          style={{
                            backgroundColor: color,
                            transform: `scaleX(${subjectTriggered ? mastery / 100 : 0})`,
                            transitionDelay: subjectTriggered
                              ? `${i * 120 + 200}ms`
                              : "0ms",
                          }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>

          {/* Leaderboard */}
          <section ref={leaderboardRef}>
            <div
              className={`rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm transition-[opacity,transform] duration-700 ease-out delay-150 ${
                leaderboardTriggered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-stone-900 dark:text-white font-heading">
                  Leaderboard
                </h3>
                <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
                  {LEADERBOARD_PERIODS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setActivePeriod(p)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
                        activePeriod === p
                          ? "bg-primary-500 text-white"
                          : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                      }`}
                    >
                      {p === "This Week"
                        ? "Week"
                        : p === "Month"
                          ? "Month"
                          : "All"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {boardLoading ? (
                  <p className="text-sm text-stone-400 dark:text-stone-500 font-medium py-8 text-center">
                    Loading leaderboard…
                  </p>
                ) : topBoard.length === 0 ? (
                  <p className="text-sm text-stone-400 dark:text-stone-500 font-medium py-8 text-center">
                    No XP earned in this period yet.
                  </p>
                ) : (
                  <>
                    {topBoard.map((entry, i) => renderBoardRow(entry, i))}
                    {selfOutsideTop && (
                      <>
                        <p className="text-center text-stone-300 dark:text-stone-700 text-xs">
                          ···
                        </p>
                        {renderBoardRow(selfOutsideTop, TOP_N)}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* MY QUIZZES */}
        <section ref={myQuizzesRef}>
          <div
            className={`rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-[opacity,transform] duration-700 ease-out ${
              myQuizzesTriggered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Header row — always visible */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary-500" aria-hidden="true" />
                <h3 className="text-lg font-black text-stone-900 dark:text-white font-heading">
                  My Quizzes
                </h3>
                <span className="text-xs font-bold text-stone-400 dark:text-stone-500 tabular-nums ml-1">
                  ({quizzesDone.length})
                </span>
              </div>
              <button
                onClick={() => setMyQuizzesOpen((p) => !p)}
                className="flex items-center gap-1.5 text-xs font-bold text-primary-500 hover:text-primary-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-2 py-1"
                aria-expanded={myQuizzesOpen}
              >
                {myQuizzesOpen ? "Show Less" : "Show All"}
                {myQuizzesOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quiz rows */}
            {quizzesDone.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-stone-400 dark:text-stone-500 font-medium">
                No quizzes taken yet.
              </p>
            ) : (
              <div className="px-6 pb-6 space-y-3">
                {(myQuizzesOpen ? quizzesDone : quizzesDone.slice(0, 2)).map((q, i) => (
                  <div
                    key={`${q.lessonId}-${q.ts}-${i}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-stone-100 dark:bg-stone-800/60"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-700 dark:text-stone-200 truncate">
                        {q.category}: {q.title}
                      </p>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                        {relTime(q.ts)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {q.score !== null && (
                        <span className="text-sm font-black text-stone-700 dark:text-stone-200 font-heading tabular-nums">
                          {q.score}%
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${
                          q.pending
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {q.pending ? "Pending" : "Graded"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section ref={activityRef}>
          <div
            className={`rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm transition-[opacity,transform] duration-700 ease-out ${
              activityTriggered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-stone-900 dark:text-white font-heading">
                Recent Activity
              </h3>
              <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span className="text-xs font-medium">Latest</span>
              </div>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-stone-400 dark:text-stone-500 font-medium py-8 text-center">
                No activity yet. Finish a lesson or quiz to see it here.
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item, i) => {
                  const isHighlighted =
                    activeActivityHighlight &&
                    item.type === "lesson" &&
                    item.lessonId === activeActivityHighlight;
                  return (
                  <div
                    key={`${item.type}-${item.ts}-${i}`}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-stone-100 dark:bg-stone-800/60 transition-[opacity,transform] duration-500 ease-out ${
                      activityTriggered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    } ${
                      isHighlighted
                        ? "ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-stone-900 animate-pulse"
                        : ""
                    }`}
                    style={{
                      transitionDelay: activityTriggered
                        ? `${i * 80}ms`
                        : "0ms",
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}
                    >
                      <item.Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-700 dark:text-stone-200 truncate">
                        {item.label}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.score !== null && (
                          <>
                            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                              Score: {item.score}%
                            </span>
                            <span
                              className="text-stone-300 dark:text-stone-700"
                              aria-hidden="true"
                            >
                              ·
                            </span>
                          </>
                        )}
                        <span className="text-xs text-stone-400 dark:text-stone-500">
                          {relTime(item.ts)}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-primary-500 dark:text-primary-400 font-heading tabular-nums shrink-0">
                      +{item.xp} XP
                    </span>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ALL ACHIEVEMENTS */}
        <section ref={achievementsRef}>
          <div
            className={`rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm transition-[opacity,transform] duration-700 ease-out ${
              achievementsTriggered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-stone-900 dark:text-white font-heading">
                All Achievements
              </h3>
              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 tabular-nums">
                {unlockedCount} / {visibleAchievements.length} unlocked
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {visibleAchievements.map(
                ({ key, Icon, label, bg, color, req }, i) => {
                  const unlocked = unlockedKeys.has(key);
                  return (
                    <div
                      key={key}
                      className={`relative flex flex-col items-center gap-2 transition-[opacity,transform] duration-500 ease-out ${
                        achievementsTriggered
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-90"
                      }`}
                      style={{
                        transitionDelay: achievementsTriggered
                          ? `${i * 50}ms`
                          : "0ms",
                      }}
                      onMouseEnter={() => setHoveredBadge(key)}
                      onMouseLeave={() => setHoveredBadge(null)}
                    >
                      <div
                        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center cursor-default transition-transform duration-200 hover:scale-105 ${
                          unlocked ? bg : "bg-stone-200 dark:bg-stone-800/80"
                        } ${
                          activeHighlight === key
                            ? "ring-4 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-stone-900 animate-pulse scale-110"
                            : ""
                        }`}
                      >
                        <Icon
                          className={`w-7 h-7 ${unlocked ? color : "text-stone-400 dark:text-stone-600"}`}
                        />
                        {!unlocked && (
                          <div className="absolute inset-0 rounded-2xl bg-white/50 dark:bg-stone-900/50 flex items-center justify-center">
                            <Lock
                              className="w-4 h-4 text-stone-400 dark:text-stone-500"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] text-center font-medium leading-tight ${
                          unlocked
                            ? "text-stone-500 dark:text-stone-400"
                            : "text-stone-400 dark:text-stone-600"
                        }`}
                      >
                        {label}
                      </span>

                      {hoveredBadge === key && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 z-20 pointer-events-none">
                          <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-3 shadow-2xl">
                            <p className="text-xs font-bold text-stone-900 dark:text-white mb-1 text-center">
                              {label}
                            </p>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-snug text-center">
                              {req}
                            </p>
                            <div className="flex items-center justify-center gap-1 mt-2">
                              {unlocked ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  <span className="text-[9px] font-bold text-emerald-500 tracking-widest uppercase">
                                    Earned
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                                  <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 tracking-widest uppercase">
                                    Locked
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-white dark:bg-stone-800 border-b border-r border-stone-200 dark:border-stone-700 rotate-45 mx-auto -mt-1" />
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
