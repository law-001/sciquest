import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

/* ─────────────────────────────────────────────────────────── */
/*  Data constants                                              */
/* ─────────────────────────────────────────────────────────── */

const LEADERBOARD = [
  {
    rank: 1,
    name: "Mia Santos",
    xp: 8420,
    subject: "Bio",
    color: "#22c55e",
    isUser: false,
  },
  {
    rank: 2,
    name: "Carlo Reyes",
    xp: 7890,
    subject: "Phys",
    color: "#38bdf8",
    isUser: false,
  },
  {
    rank: 3,
    name: "You",
    xp: 6750,
    subject: "Earth",
    color: "#f97316",
    isUser: true,
  },
  {
    rank: 4,
    name: "Ana Cruz",
    xp: 5340,
    subject: "Bio",
    color: "#22c55e",
    isUser: false,
  },
  {
    rank: 5,
    name: "Luis Torres",
    xp: 4920,
    subject: "Phys",
    color: "#38bdf8",
    isUser: false,
  },
];

const LEADERBOARD_PERIODS = ["This Week", "Month", "All Time"];

const BADGES = [
  {
    Icon: Trophy,
    label: "First Quiz",
    bg: "bg-amber-500/20",
    color: "text-amber-500",
  },
  {
    Icon: Flame,
    label: "7-Day Streak",
    bg: "bg-orange-500/20",
    color: "text-orange-500",
  },
  {
    Icon: Shield,
    label: "Science Nerd",
    bg: "bg-teal-500/20",
    color: "text-teal-500",
  },
  {
    Icon: Zap,
    label: "Speed Learner",
    bg: "bg-yellow-400/20",
    color: "text-yellow-500",
  },
];

const ALL_ACHIEVEMENTS = [
  {
    Icon: Trophy,
    label: "First Quiz",
    bg: "bg-amber-500/20",
    color: "text-amber-500",
    unlocked: true,
    req: "Complete your first quiz",
  },
  {
    Icon: Flame,
    label: "7-Day Streak",
    bg: "bg-orange-500/20",
    color: "text-orange-500",
    unlocked: true,
    req: "Maintain a 7-day learning streak",
  },
  {
    Icon: Shield,
    label: "Science Nerd",
    bg: "bg-teal-500/20",
    color: "text-teal-500",
    unlocked: true,
    req: "Complete 10 lessons",
  },
  {
    Icon: Zap,
    label: "Speed Learner",
    bg: "bg-yellow-400/20",
    color: "text-yellow-500",
    unlocked: true,
    req: "Finish a quiz in under 2 minutes",
  },
  {
    Icon: Star,
    label: "Perfect Score",
    bg: "bg-purple-500/20",
    color: "text-purple-500",
    unlocked: false,
    req: "Score 100% on any quiz",
  },
  {
    Icon: BookOpen,
    label: "Bookworm",
    bg: "bg-blue-500/20",
    color: "text-blue-500",
    unlocked: false,
    req: "Complete 25 lessons",
  },
  {
    Icon: Target,
    label: "Sharpshooter",
    bg: "bg-rose-500/20",
    color: "text-rose-500",
    unlocked: false,
    req: "Achieve 90%+ accuracy 5 times",
  },
  {
    Icon: Crown,
    label: "Leaderboard King",
    bg: "bg-amber-400/20",
    color: "text-amber-500",
    unlocked: false,
    req: "Reach #1 on the weekly leaderboard",
  },
  {
    Icon: Dna,
    label: "Bio Master",
    bg: "bg-green-500/20",
    color: "text-green-500",
    unlocked: false,
    req: "Complete all Biology lessons",
  },
  {
    Icon: Atom,
    label: "Physics Wizard",
    bg: "bg-sky-500/20",
    color: "text-sky-500",
    unlocked: false,
    req: "Complete all Physics lessons",
  },
  {
    Icon: Globe2,
    label: "Earth Explorer",
    bg: "bg-yellow-500/20",
    color: "text-yellow-500",
    unlocked: false,
    req: "Complete all Earth Science lessons",
  },
  {
    Icon: TrendingUp,
    label: "On The Rise",
    bg: "bg-indigo-500/20",
    color: "text-indigo-500",
    unlocked: false,
    req: "Gain 100 XP in a single day",
  },
];

const STAT_CARDS = [
  {
    label: "Lessons Done",
    value: 24,
    suffix: "",
    Icon: BookOpen,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    label: "Quizzes Taken",
    value: 18,
    suffix: "",
    Icon: Target,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    label: "Accuracy",
    value: 84,
    suffix: "%",
    Icon: BarChart3,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "Time Spent",
    value: 12,
    suffix: "h",
    Icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    label: "Badges Earned",
    value: 4,
    suffix: "",
    Icon: Award,
    color: "text-primary-500",
    bg: "bg-primary-500/10",
    border: "border-primary-500/20",
  },
];

const SUBJECT_PROGRESS = [
  {
    label: "Biology",
    Icon: Dna,
    color: "#22c55e",
    barClass: "bg-green-500",
    mastery: 72,
    lessons: 8,
    total: 12,
  },
  {
    label: "Physics",
    Icon: Atom,
    color: "#38bdf8",
    barClass: "bg-sky-400",
    mastery: 55,
    lessons: 6,
    total: 11,
  },
  {
    label: "Earth Science",
    Icon: Globe2,
    color: "#f59e0b",
    barClass: "bg-amber-500",
    mastery: 40,
    lessons: 10,
    total: 14,
  },
];

const RECENT_ACTIVITY = [
  {
    type: "quiz",
    label: "Biology: Cell Division Quiz",
    score: 90,
    xp: 45,
    time: "2 hours ago",
    Icon: Target,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    type: "lesson",
    label: "Physics: Newton's Laws",
    score: null,
    xp: 20,
    time: "Yesterday",
    Icon: BookOpen,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    type: "quiz",
    label: "Earth Science: Plate Tectonics Quiz",
    score: 75,
    xp: 35,
    time: "2 days ago",
    Icon: Target,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    type: "lesson",
    label: "Biology: Photosynthesis",
    score: null,
    xp: 20,
    time: "3 days ago",
    Icon: BookOpen,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    type: "quiz",
    label: "Physics: Motion & Forces Quiz",
    score: 85,
    xp: 40,
    time: "4 days ago",
    Icon: Target,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const QUICK_STATS = [
  { label: "Global Rank", value: "#3", color: "text-amber-500" },
  { label: "Streak", value: "7 Days", color: "text-orange-500" },
  { label: "Total XP", value: "6.75k", color: "text-primary-500" },
];

/* ─────────────────────────────────────────────────────────── */
/*  useScrollTrigger — same pattern as LandingPage              */
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
/*  CountUp — same pattern as LandingPage                      */
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
/*  EditProfileModal                                            */
/* ─────────────────────────────────────────────────────────── */
function EditProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;
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

        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-3xl font-black text-white font-heading">
            Y
          </div>
          <button className="text-xs font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-300 transition-colors tracking-wide">
            Change Photo
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 tracking-widest uppercase mb-2">
              Username
            </label>
            <input
              type="text"
              defaultValue="You"
              className="w-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 tracking-widest uppercase mb-2">
              Bio
            </label>
            <textarea
              defaultValue="Grade 7 Science enthusiast"
              rows={3}
              className="w-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 font-bold text-sm hover:border-stone-400 dark:hover:border-stone-600 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-bold text-sm transition-colors active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  ProfilePage                                                 */
/* ─────────────────────────────────────────────────────────── */
export function ProfilePage({ onNavigate }) {
  const [xpWidth, setXpWidth] = useState(0);
  const [activePeriod, setActivePeriod] = useState("This Week");
  const [editOpen, setEditOpen] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState(null);

  const [headerRef, headerTriggered] = useScrollTrigger(0.1);
  const [statsRef, statsTriggered] = useScrollTrigger(0.2);
  const [subjectRef, subjectTriggered] = useScrollTrigger(0.2);
  const [leaderboardRef, leaderboardTriggered] = useScrollTrigger(0.2);
  const [activityRef, activityTriggered] = useScrollTrigger(0.2);
  const [achievementsRef, achievementsTriggered] = useScrollTrigger(0.1);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!headerTriggered) return;
    if (prefersReducedMotion) {
      setXpWidth(73);
      return;
    }
    const id = setTimeout(() => {
      const start = Date.now();
      const run = () => {
        const t = Math.min((Date.now() - start) / 1200, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setXpWidth(Math.round(eased * 73));
        if (t < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }, 400);
    return () => clearTimeout(id);
  }, [headerTriggered, prefersReducedMotion]);

  const unlockedCount = ALL_ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-stone-950">
      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />

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
        {/* ════════════════════════════════════════════════
            PAGE TITLE + EDIT BUTTON
        ════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-stone-900 dark:text-white font-heading tracking-tight">
              My Profile
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 font-medium">
              Track your progress, streaks, and achievements
            </p>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-sm font-bold hover:border-primary-500/60 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* ════════════════════════════════════════════════
            PROFILE HEADER — player card + side info
        ════════════════════════════════════════════════ */}
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
              <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-2xl font-black text-white font-heading shrink-0">
                Y
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-xl font-black text-stone-900 dark:text-white font-heading">
                    You
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold">
                    LVL 12
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-stone-500 dark:text-stone-400">
                    7-day streak
                  </span>
                </div>
                <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                  Grade 7 Science enthusiast
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-stone-900 dark:text-white font-heading tabular-nums">
                  2,840
                </p>
                <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                  / 3,900 XP
                </p>
              </div>
            </div>

            {/* XP progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 font-medium mb-2">
                <span>Progress to Level 13</span>
                <span className="tabular-nums">{xpWidth}%</span>
              </div>
              <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-500 origin-left transition-[transform] duration-1200 ease-out"
                  style={{ transform: `scaleX(${xpWidth / 100})` }}
                />
              </div>
            </div>

            {/* Badges grid */}
            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-widest uppercase mb-3">
              Achievements
            </p>
            <div className="grid grid-cols-4 gap-3">
              {BADGES.map(({ Icon, label, bg, color }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
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
          </div>

          {/* Right column: quick stats + focus + member since */}
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
                {QUICK_STATS.map(({ label, value, color }) => (
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

            {/* Current subject focus */}
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
              <p className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-widest uppercase mb-3">
                Current Focus
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Globe2 className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-stone-900 dark:text-white font-heading">
                    Earth Science
                  </p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                    Most active this week
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                  Top Pick
                </span>
              </div>
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
                    January 2026
                  </p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                    Over 4 months of learning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            STATS OVERVIEW
        ════════════════════════════════════════════════ */}
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
            {STAT_CARDS.map(
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

        {/* ════════════════════════════════════════════════
            SUBJECT PROGRESS  +  LEADERBOARD  (2-col)
        ════════════════════════════════════════════════ */}
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
                {SUBJECT_PROGRESS.map(
                  (
                    { label, Icon, color, barClass, mastery, lessons, total },
                    i,
                  ) => (
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
                          className={`h-full rounded-full ${barClass} origin-left transition-[transform] duration-1000 ease-out`}
                          style={{
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
                {LEADERBOARD.map((entry, i) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-[opacity,transform] duration-500 ease-out ${
                      leaderboardTriggered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    } ${
                      entry.isUser
                        ? "bg-primary-500/10 border border-primary-500/30"
                        : "bg-stone-100 dark:bg-stone-800/60"
                    }`}
                    style={{
                      transitionDelay: leaderboardTriggered
                        ? `${200 + i * 80}ms`
                        : "0ms",
                    }}
                  >
                    {/* Rank badge */}
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        entry.rank === 1
                          ? "bg-amber-400 text-stone-900"
                          : entry.rank === 2
                            ? "bg-stone-400 text-stone-900"
                            : entry.rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      {entry.rank === 1 ? (
                        <Crown className="w-4 h-4" />
                      ) : (
                        entry.rank
                      )}
                    </span>
                    {/* Avatar */}
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ backgroundColor: entry.color }}
                    >
                      {entry.name[0]}
                    </span>
                    {/* Name */}
                    <span
                      className={`flex-1 text-sm font-bold truncate ${
                        entry.isUser
                          ? "text-primary-600 dark:text-primary-300"
                          : "text-stone-700 dark:text-stone-200"
                      }`}
                    >
                      {entry.name}
                    </span>
                    {/* Subject pill */}
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: `${entry.color}22`,
                        color: entry.color,
                      }}
                    >
                      {entry.subject}
                    </span>
                    {/* XP */}
                    <span className="text-sm font-black text-stone-900 dark:text-white font-heading tabular-nums shrink-0">
                      {entry.xp.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ════════════════════════════════════════════════
            RECENT ACTIVITY
        ════════════════════════════════════════════════ */}
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
                <span className="text-xs font-medium">Last 7 days</span>
              </div>
            </div>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl bg-stone-100 dark:bg-stone-800/60 transition-[opacity,transform] duration-500 ease-out ${
                    activityTriggered
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{
                    transitionDelay: activityTriggered ? `${i * 80}ms` : "0ms",
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
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-primary-500 dark:text-primary-400 font-heading tabular-nums shrink-0">
                    +{item.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            ALL ACHIEVEMENTS
        ════════════════════════════════════════════════ */}
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
                {unlockedCount} / {ALL_ACHIEVEMENTS.length} unlocked
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {ALL_ACHIEVEMENTS.map(
                ({ Icon, label, bg, color, unlocked, req }, i) => (
                  <div
                    key={label}
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
                    onMouseEnter={() => setHoveredBadge(label)}
                    onMouseLeave={() => setHoveredBadge(null)}
                  >
                    <div
                      className={`relative w-14 h-14 rounded-2xl flex items-center justify-center cursor-default transition-transform duration-200 hover:scale-105 ${
                        unlocked ? bg : "bg-stone-200 dark:bg-stone-800/80"
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

                    {/* Hover tooltip */}
                    {hoveredBadge === label && (
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
                        {/* Tooltip arrow */}
                        <div className="w-2 h-2 bg-white dark:bg-stone-800 border-b border-r border-stone-200 dark:border-stone-700 rotate-45 mx-auto -mt-1" />
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
