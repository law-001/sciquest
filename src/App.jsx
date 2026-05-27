import React, { useState, useEffect, useRef, useCallback } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { AuthModal } from "./components/modals/AuthModal";
import { LandingPage } from "./pages/LandingPage";
import { LessonsPage } from "./pages/LessonsPage";
import { QuizPage } from "./pages/QuizPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { LessonContentPage } from "./pages/LessonContentPage";
import { TeacherPortalPage } from "./pages/TeacherPortalPage";
import { ProfilePage } from "./pages/ProfilePage";
import { GamesHubPage } from "./pages/GamesHubPage";
import { GamePlayPage } from "./pages/GamePlayPage";
import { TeacherSetupPage } from "./pages/TeacherSetupPage";
import { WEEKS_DATA } from "./data/lessonsweek-01";
import {
  fetchProgress,
  markLessonComplete,
  saveQuizAttempt,
  totalXpEarned,
} from "./lib/progress";
import { levelFromXp } from "./lib/xp-config";
import { addScreenSeconds } from "./lib/screentime";
import {
  getPublishedWeekIds,
  getPublishedQuizWeekIds,
  getOpenWeekIds,
  fetchPublishedWeekIds,
  fetchPublishedQuizWeekIds,
  fetchOpenWeekIds,
  isWeekPublished,
  subscribeToPublishedState,
} from "./lib/publishedWeeks";
import {
  getCachedQuizSettings,
  fetchQuizSettings,
  subscribeToQuizSettings,
  getQuizTimeLimit,
  getQuizMaxAttempts,
  getQuizShowAnswers,
} from "./lib/quizSettings";
import { lessonsPassedFromAttempts } from "./lib/lessonGating";
import { fetchAchievements, syncAchievements, awardAchievements } from "./lib/achievements-store";
import { CURIOUS_EXPLORER_KEY, BLACKED_KEY, MYSTERY_LAB_COMPLETE_KEY, CELL_DIVISION_COMPLETE_KEY, MATTER_STATE_SANDBOX_COMPLETE_KEY, achievementLabel, achievementXp, totalAchievementXp } from "./lib/achievements";
import { supabase } from "./lib/supabase";
import { writeGameProgress, fetchCompletedGames } from "./lib/games/progress";
import { XpToast } from "./components/XpToast";
import { NotificationBubble } from "./components/NotificationBubble";

// localStorage helpers — track pending attempt ids per student so the
// "Quiz Graded" notification can fire even after a logout/login cycle.
const pendingKey = (uid) => `sq-pending-${uid}`;
function loadPendingIds(uid) {
  try { return new Set(JSON.parse(localStorage.getItem(pendingKey(uid))) ?? []); }
  catch { return new Set(); }
}
function savePendingIds(uid, ids) {
  localStorage.setItem(pendingKey(uid), JSON.stringify([...ids]));
}

// Notification history is scoped per-user so account A's notifications
// don't bleed into account B after a login switch.
const notifHistoryKey = (uid) => `sq-notif-history-${uid}`;
const unseenCountKey  = (uid) => `sq-notif-unseen-${uid}`;
function loadNotifHistory(uid) {
  try { return JSON.parse(localStorage.getItem(notifHistoryKey(uid))) ?? []; }
  catch { return []; }
}
function loadUnseenCount(uid) {
  try { return Number(localStorage.getItem(unseenCountKey(uid))) || 0; }
  catch { return 0; }
}
function saveNotifHistory(uid, list) {
  try { localStorage.setItem(notifHistoryKey(uid), JSON.stringify(list)); } catch { /* quota */ }
}
function saveUnseenCount(uid, n) {
  try { localStorage.setItem(unseenCountKey(uid), String(n)); } catch { /* quota */ }
}

// QuizContainer auto-saves answers to `quiz-answers-<lessonId>` and clears the
// key on submit, so a lesson with a non-empty entry has an in-progress quiz.
// Iterates in reverse so the most-advanced in-progress quiz wins when multiple
// lessons have stale data. Already-submitted lessons (in lessonsPassed) are
// skipped so cleared-but-not-removed entries don't cause false positives.
function findOngoingQuizLessonId(week, lessonsPassed = []) {
  if (!week?.lessons) return null;
  for (let i = week.lessons.length - 1; i >= 0; i--) {
    const lesson = week.lessons[i];
    if (lessonsPassed.includes(lesson.id)) continue;
    try {
      const raw = localStorage.getItem(`quiz-answers-${lesson.id}`);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        return lesson.id;
      }
    } catch {
      /* corrupt entry — ignore */
    }
  }
  return null;
}

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  // Detect an invite link before Supabase clears the URL params. Must be a ref
  // so the value is captured synchronously at render time, before any async
  // effects run. Three cases to handle:
  //   1. Fresh invite (PKCE): ?token_hash=...&type=invite
  //   2. Fresh invite (implicit): #access_token=...&type=invite
  //   3. Expired/used invite: ?error=access_denied&error_code=otp_expired
  const _urlParams  = new URLSearchParams(window.location.search);
  const _hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const isInviteFlow = useRef(
    _urlParams.get('type') === 'invite' ||
    _hashParams.get('type') === 'invite' ||
    _urlParams.get('error_code') === 'otp_expired' ||
    _hashParams.get('error_code') === 'otp_expired'
  );
  const isExpiredInvite = useRef(
    _urlParams.get('error_code') === 'otp_expired' ||
    _hashParams.get('error_code') === 'otp_expired'
  );
  const [currentView, setCurrentView] = useState(
    () => isInviteFlow.current ? 'teacher-setup' : 'home'
  );
  const initialRedirectDone = useRef(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reachedLessons, setReachedLessons] = useState([]);
  const [activeWeekId, setActiveWeekId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeGameId, setActiveGameId] = useState(null);
  const [completedGames, setCompletedGames] = useState([]);
  const [completedRows, setCompletedRows] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifHistory, setNotifHistory] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [highlightedAchievement, setHighlightedAchievement] = useState(null);
  const [profileScrollTarget, setProfileScrollTarget] = useState(null);
  const [highlightedActivity, setHighlightedActivity] = useState(null);
  const [publishedWeekIds, setPublishedWeekIds] = useState(() =>
    getPublishedWeekIds(),
  );
  const [publishedQuizWeekIds, setPublishedQuizWeekIds] = useState(() =>
    getPublishedQuizWeekIds(),
  );
  const [openWeekIds, setOpenWeekIds] = useState(() => getOpenWeekIds());
  const [quizSettings, setQuizSettings] = useState(() => getCachedQuizSettings());

  // Stable refs so interval callbacks always see the latest values without
  // being listed as effect deps (which would reset the interval constantly).
  const quizAttemptsRef = useRef(quizAttempts);
  // eslint-disable-next-line react-hooks/refs
  quizAttemptsRef.current = quizAttempts;
  const pushNotificationRef = useRef(null);

  const isLoggedIn = !!user;
  const isStudent = profile?.role === "student";

  // When the user is not a logged-in student, treat progress as empty so stale
  // state from a previous session never leaks into non-student views.
  const effectiveCompletedLessons = (user && isStudent) ? completedLessons : [];
  const effectiveCompletedRows    = (user && isStudent) ? completedRows    : [];
  const effectiveQuizAttempts     = (user && isStudent) ? quizAttempts     : [];
  const effectiveUnlockedAchievements = (user && isStudent) ? unlockedAchievements : [];
  const effectiveCompletedGames   = (user && isStudent) ? completedGames   : [];

  // Lesson + week gating now keys off submitted quiz attempts, not lesson reads.
  const lessonsPassed = lessonsPassedFromAttempts(effectiveQuizAttempts);

  // Total XP = lesson + quiz XP + game XP (best run per game) + achievement bonuses.
  const gameXpTotal = effectiveCompletedGames.reduce((sum, g) => sum + (g.xpEarned ?? 0), 0);
  const totalXp =
    totalXpEarned(effectiveCompletedRows, effectiveQuizAttempts) +
    totalAchievementXp(effectiveUnlockedAchievements) +
    gameXpTotal;
  const currentLevel = levelFromXp(totalXp);

  // Submissions already made for the active lesson's quiz — drives the
  // 3-attempt cap and the per-attempt XP scaling.
  const quizPriorAttempts = effectiveQuizAttempts.filter(
    (a) => a.lesson_id === activeLessonId,
  ).length;

  // Hydrate progress + quiz attempts from Supabase whenever a student logs in.
  // Staff don't have student_progress rows, so we skip the fetch for them.
  useEffect(() => {
    if (!user?.id || !isStudent) return;
    let cancelled = false;
    Promise.all([fetchProgress(user.id), fetchAchievements(user.id), fetchCompletedGames(supabase, { studentId: user.id })])
      .then(async ([{ completedLessons: done, completedRows: rows, attempts }, unlocked, games]) => {
        if (cancelled) return;
        setCompletedLessons(done);
        setCompletedRows(rows);
        setQuizAttempts(attempts);
        setCompletedGames(games);
        // Anything completed is also "reached" — keeps the lesson tab nav consistent.
        setReachedLessons((prev) => Array.from(new Set([...prev, ...done])));

        // Fire "Quiz Graded" for any attempt that was pending when the student
        // last logged out and has since been graded by a teacher.
        const pendingIds = loadPendingIds(user.id);
        if (pendingIds.size > 0) {
          const newlyGraded = attempts.filter(
            (a) => a.id && pendingIds.has(a.id) && (a.pending_grade_count ?? 0) === 0,
          );
          if (newlyGraded.length > 0) {
            for (const a of newlyGraded) pendingIds.delete(a.id);
            savePendingIds(user.id, pendingIds);
            for (const a of newlyGraded) {
              const week = WEEKS_DATA.find((w) => w.lessons.some((l) => l.id === a.lesson_id));
              const lesson = week?.lessons.find((l) => l.id === a.lesson_id);
              const pct = a.max_score > 0 ? Math.round((a.score / a.max_score) * 100) : null;
              pushNotificationRef.current?.({
                kind: 'quiz-graded',
                label: lesson?.title ?? a.lesson_id,
                score: a.score,
                maxScore: a.max_score,
                detail: pct !== null ? `Score: ${pct}%` : null,
              });
            }
          }
        }

        // Auto-award everything the current progress now qualifies for.
        const ctx = {
          completedLessons: done,
          completedRows: rows,
          attempts,
          totalXp: totalXpEarned(rows, attempts),
        };
        const { unlocked: nextUnlocked } = await syncAchievements(
          user.id,
          ctx,
          unlocked,
        );
        if (!cancelled) setUnlockedAchievements(nextUnlocked);
      })
      .catch((err) => {
        console.error("Failed to load student progress:", err);
      });
    return () => { cancelled = true };
  }, [user?.id, isStudent]);

  // Poll for essay grade updates every 30 s when the student has pending attempts.
  // Compares the fresh DB rows against the in-memory snapshot; any attempt that
  // flipped from pending_grade_count > 0 → 0 fires a "quiz graded" notification.
  useEffect(() => {
    if (!user?.id || !isStudent) return;

    const POLL_MS = 30_000;

    const poll = async () => {
      const current = quizAttemptsRef.current;
      const hasPending = current.some((a) => (a.pending_grade_count ?? 0) > 0);
      if (!hasPending) return;

      try {
        const { attempts: fresh } = await fetchProgress(user.id);

        const newlyGraded = fresh.filter((f) => {
          if ((f.pending_grade_count ?? 0) !== 0) return false;
          return current.some((old) => {
            if ((old.pending_grade_count ?? 0) === 0) return false;
            // Primary match: DB id (available once saveQuizAttempt patch lands).
            if (old.id && f.id) return old.id === f.id;
            // Fallback: lesson + 60s window for entries not yet patched.
            return (
              old.lesson_id === f.lesson_id &&
              Math.abs(
                new Date(old.submitted_at).getTime() -
                  new Date(f.submitted_at).getTime(),
              ) < 60_000
            );
          });
        });

        if (newlyGraded.length > 0) {
          setQuizAttempts(fresh);
          for (const a of newlyGraded) {
            const week = WEEKS_DATA.find((w) => w.lessons.some((l) => l.id === a.lesson_id));
            const lesson = week?.lessons.find((l) => l.id === a.lesson_id);
            const pct = a.max_score > 0 ? Math.round((a.score / a.max_score) * 100) : null;
            pushNotificationRef.current({
              kind: 'quiz-graded',
              label: lesson?.title ?? a.lesson_id,
              score: a.score,
              maxScore: a.max_score,
              detail: pct !== null ? `Score: ${pct}%` : null,
            });
          }
        }
      } catch {
        // Silent — grade polling is best-effort
      }
    };

    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [user?.id, isStudent]);

  // Pull the global publish state + per-quiz timer config on mount, then
  // subscribe to realtime changes so a teacher's toggle on one device
  // propagates to every open client.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchPublishedWeekIds(),
      fetchPublishedQuizWeekIds(),
      fetchOpenWeekIds(),
      fetchQuizSettings(),
    ])
      .then(([lessons, quizzes, open, settings]) => {
        if (cancelled) return;
        setPublishedWeekIds(lessons);
        setPublishedQuizWeekIds(quizzes);
        setOpenWeekIds(open);
        setQuizSettings(settings);
      })
      .catch((err) => {
        console.error("Failed to load course settings:", err);
      });

    const unsubPublish = subscribeToPublishedState((scope, ids) => {
      if (scope === "lessons") setPublishedWeekIds(ids);
      else if (scope === "quizzes") setPublishedQuizWeekIds(ids);
      else if (scope === "open") setOpenWeekIds(ids);
    });
    const unsubQuiz = subscribeToQuizSettings(() => {
      // Pull a fresh map rather than patching in place — keeps the cached
      // snapshot authoritative and avoids stale entries on rapid edits.
      fetchQuizSettings().then((m) => { if (!cancelled) setQuizSettings(m); }).catch(() => {});
    });

    return () => {
      cancelled = true;
      unsubPublish();
      unsubQuiz();
    };
  }, []);

  // Curious Explorer is the one achievement earned by a UI action
  // (scrolling the landing page) rather than derived from progress.
  // Only logged-in students can earn it, and it's written straight to
  // the DB so an admin data wipe clears it like any other row.
  const explorerUnlocked = effectiveUnlockedAchievements.includes(
    CURIOUS_EXPLORER_KEY,
  );
  const handleExplorerUnlock = useCallback(() => {
    if (!user || !isStudent || explorerUnlocked) return;
    setUnlockedAchievements((prev) =>
      prev.includes(CURIOUS_EXPLORER_KEY)
        ? prev
        : [...prev, CURIOUS_EXPLORER_KEY],
    );
    // LandingPage's AchievementToast owns the visible popup, so we only
    // record this in the bell history — no second XpToast.
    pushNotificationRef.current?.(
      {
        kind: "achievement",
        label: achievementLabel(CURIOUS_EXPLORER_KEY),
        amount: achievementXp(CURIOUS_EXPLORER_KEY),
        achievementKey: CURIOUS_EXPLORER_KEY,
      },
      { toast: false },
    );
    awardAchievements(user.id, [CURIOUS_EXPLORER_KEY]).catch((err) => {
      console.error("Failed to award Curious Explorer:", err);
    });
  }, [user, isStudent, explorerUnlocked]);

  // Global screen-time heartbeat: every open tab credits its active
  // seconds to one shared counter (all users, all devices). Only time
  // the tab is actually visible counts; the server caps each call.
  useEffect(() => {
    let lastTick = Date.now();
    const credit = () => {
      const now = Date.now();
      const secs = Math.round((now - lastTick) / 1000);
      lastTick = now;
      if (secs > 0) addScreenSeconds(secs).catch(() => {});
    };
    const tick = () => {
      if (document.visibilityState === "visible") credit();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") lastTick = Date.now();
      else credit();
    };
    const id = setInterval(tick, 20000);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", credit);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", credit);
      if (document.visibilityState === "visible") credit();
    };
  }, []);

  // Hydrate notification history when the active student changes — clears
  // any leftover state from a previous account before loading this user's
  // own history. Non-students get an empty list (no bubble is rendered).
  useEffect(() => {
    setNotifications([]);
    if (!user?.id || !isStudent) {
      setNotifHistory([]);
      setUnseenCount(0);
      return;
    }
    setNotifHistory(loadNotifHistory(user.id));
    setUnseenCount(loadUnseenCount(user.id));
  }, [user?.id, isStudent]);

  // `toast: false` records the notification in the bell history + unread
  // count but skips the XpToast popup — used when another component (e.g.
  // LandingPage's AchievementToast) already owns the visible popup.
  const pushNotification = (n, { toast = true } = {}) => {
    const entry = { id: Date.now() + Math.random(), ...n };
    if (toast) setNotifications((prev) => [...prev, entry]);
    setNotifHistory((prev) => {
      const next = [...prev, entry];
      if (user?.id) saveNotifHistory(user.id, next);
      return next;
    });
    setUnseenCount((prev) => {
      const next = prev + 1;
      if (user?.id) saveUnseenCount(user.id, next);
      return next;
    });
  };
  // eslint-disable-next-line react-hooks/refs
  pushNotificationRef.current = pushNotification;
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  const handleNotifBubbleOpen = () => {
    setUnseenCount(0);
    if (user?.id) saveUnseenCount(user.id, 0);
  };
  const handleClearAllNotifs = () => {
    setNotifHistory([]);
    setUnseenCount(0);
    if (user?.id) {
      saveNotifHistory(user.id, []);
      saveUnseenCount(user.id, 0);
    }
  };
  const handleClearOneNotif = (id) =>
    setNotifHistory((prev) => {
      const next = prev.filter((n) => n.id !== id);
      if (user?.id) saveNotifHistory(user.id, next);
      return next;
    });

  // BLACKED is the hidden achievement: earned by watching the About
  // page portraits cross-fade light → dark. Same explicit-award path as
  // Curious Explorer — only logged-in students, written straight to DB.
  const blackedUnlocked = effectiveUnlockedAchievements.includes(BLACKED_KEY);
  const handleBlackedUnlock = useCallback(() => {
    if (!user || !isStudent || blackedUnlocked) return;
    setUnlockedAchievements((prev) =>
      prev.includes(BLACKED_KEY) ? prev : [...prev, BLACKED_KEY],
    );
    pushNotification({
      kind: "achievement",
      label: achievementLabel(BLACKED_KEY),
      amount: achievementXp(BLACKED_KEY),
      hidden: true,
      achievementKey: BLACKED_KEY,
    });
    awardAchievements(user.id, [BLACKED_KEY]).catch((err) => {
      console.error("Failed to award BLACKED:", err);
    });
  }, [user, isStudent, blackedUnlocked]);

  // On refresh, once the restored session + profile are ready, redirect by role.
  // The ref guard ensures this runs at most once even as deps re-fire.
  // Skip when the user arrived via an invite link — they need to set up their
  // account first before being sent to the teacher portal.
  useEffect(() => {
    if (loading || initialRedirectDone.current) return;
    initialRedirectDone.current = true;
    if (isInviteFlow.current) return;
    if (!user) return;
    const role = profile?.role ?? 'student';
    /* eslint-disable react-hooks/set-state-in-effect */
    if (role === 'admin') setCurrentView('admin');
    else if (role === 'teacher') setCurrentView('teacher-portal');
    else setCurrentView('lessons');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [loading, user, profile?.role]);

  const handleNavigate = (view, payload) => {
    if (view === 'game-play' && payload?.gameId) {
      setActiveGameId(payload.gameId);
    }
    if (view === 'profile' && payload?.achievementKey) {
      // Use a fresh token so re-clicking the same achievement notification
      // re-triggers the highlight effect on ProfilePage.
      setHighlightedAchievement({ key: payload.achievementKey, token: Date.now() });
    } else if (view !== 'profile') {
      setHighlightedAchievement(null);
    }
    if (view === 'profile' && payload?.scrollTo) {
      setProfileScrollTarget({ target: payload.scrollTo, token: Date.now() });
    } else if (view !== 'profile') {
      setProfileScrollTarget(null);
    }
    if (view === 'profile' && payload?.highlightLesson) {
      setHighlightedActivity({ lessonId: payload.highlightLesson, token: Date.now() });
    } else if (view !== 'profile') {
      setHighlightedActivity(null);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Called by AuthModal after successful login — navigates by role
  const handleLogin = (role) => {
    if (role === "admin") handleNavigate("admin");
    else if (role === "teacher") handleNavigate("teacher-portal");
    else handleNavigate("lessons");
  };

  const handleLogout = () => {
    signOut();
    handleNavigate("home");
  };

  const handleStartLearning = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      handleNavigate("lessons");
    }
  };

  const handleStartWeek = (weekId) => {
    const week = WEEKS_DATA.find((w) => w.id === weekId);
    if (!week) return;

    // If the student left a quiz mid-attempt (saved answers in localStorage),
    // jump straight into that quiz so they don't lose the in-progress work.
    const ongoingQuizLessonId = findOngoingQuizLessonId(week, lessonsPassed);
    if (ongoingQuizLessonId && !isQuizLockedForWeek(weekId)) {
      setActiveWeekId(weekId);
      setActiveLessonId(ongoingQuizLessonId);
      if (!reachedLessons.includes(ongoingQuizLessonId)) {
        setReachedLessons((prev) => [...prev, ongoingQuizLessonId]);
      }
      handleNavigate("quiz");
      return;
    }

    // Otherwise resume at the first lesson whose quiz hasn't been submitted.
    const firstUntaken = week.lessons.find(
      (l) => !lessonsPassed.includes(l.id),
    );
    const target = firstUntaken ?? week.lessons[0];
    setActiveWeekId(weekId);
    setActiveLessonId(target.id);
    if (!reachedLessons.includes(target.id)) {
      setReachedLessons((prev) => [...prev, target.id]);
    }
    handleNavigate("lesson-content");
  };

  const isQuizLockedForWeek = (weekId) => {
    if (!weekId) return false;
    return !isWeekPublished(weekId, publishedQuizWeekIds);
  };

  const handleGoToQuiz = () => {
    if (isQuizLockedForWeek(activeWeekId)) return;
    handleNavigate("quiz");
  };

  // Fired by LessonTemplate the moment the reader scrolls a lesson to 100%.
  // Lesson XP is awarded once per lesson (guarded by completedLessons) and the
  // lesson is marked complete + persisted for students.
  const handleLessonComplete = (lessonId) => {
    const week = WEEKS_DATA.find((w) =>
      w.lessons.some((l) => l.id === lessonId),
    );
    if (!week) return;
    if (effectiveCompletedLessons.includes(lessonId)) return;

    const lesson = week.lessons.find((l) => l.id === lessonId);
    const weekId = week.id;
    const studentId = user?.id;
    const lessonXp = lesson?.xp ?? 0;

    // Optimistic local update — UI doesn't wait on the network.
    setCompletedLessons((prev) => [...prev, lessonId]);
    setCompletedRows((prev) => [
      ...prev,
      { lesson_id: lessonId, week_id: weekId, completed: true, completed_at: new Date().toISOString(), xp_awarded: lessonXp },
    ]);

    if (lessonXp > 0) {
      pushNotification({ kind: "xp", amount: lessonXp, detail: lesson?.title, source: "lesson", lessonId });
    }
    const newLevel = levelFromXp(totalXp + lessonXp);
    if (newLevel > currentLevel) {
      pushNotification({ kind: "level-up", level: newLevel });
    }

    if (studentId && isStudent) {
      markLessonComplete(studentId, weekId, lessonId, lessonXp).catch((err) => {
        console.error("Failed to mark lesson complete:", err);
      });

      // Re-derive achievements against progress that now includes this
      // lesson, so lesson-count ones (Science Nerd at 10, Bookworm at
      // 25) unlock the moment the lesson hits 100%, not after its quiz.
      const completedWithThis = [...completedLessons, lessonId];
      const rowsWithThis = [
        ...completedRows,
        {
          lesson_id: lessonId,
          week_id: weekId,
          completed: true,
          completed_at: new Date().toISOString(),
          xp_awarded: lessonXp,
        },
      ];
      const ctx = {
        completedLessons: completedWithThis,
        completedRows: rowsWithThis,
        attempts: quizAttempts,
        totalXp: totalXpEarned(rowsWithThis, quizAttempts),
      };
      syncAchievements(studentId, ctx, unlockedAchievements)
        .then(({ unlocked, newlyUnlocked }) => {
          setUnlockedAchievements(unlocked);
          for (const key of newlyUnlocked) {
            pushNotification({
              kind: "achievement",
              label: achievementLabel(key),
              amount: achievementXp(key),
              achievementKey: key,
            });
          }
        })
        .catch((err) => {
          console.error("Failed to sync achievements:", err);
        });
    }
  };

  // Called by QuizContainer's onComplete on submit with { score, maxScore,
  // xpEarned, pendingGradeCount }. Quiz XP only — lesson completion/XP is
  // handled separately by handleLessonComplete. Fires every attempt.
  const handleQuizComplete = (result) => {
    const week = WEEKS_DATA.find((w) => w.id === activeWeekId);
    if (!week) return;

    const lesson = week.lessons.find((l) => l.id === activeLessonId);
    const lessonId = activeLessonId;
    const weekId = week.id;
    const studentId = user?.id;

    const quizXp = result && Number.isFinite(result.xpEarned) ? result.xpEarned : 0;
    const hasScore =
      result && Number.isFinite(result.score) && Number.isFinite(result.maxScore);

    // Capture the client-side timestamp once so we can identify this
    // optimistic entry later and patch it with the real DB id + timestamp.
    const clientTs = new Date().toISOString();

    // Optimistic local update — UI doesn't wait on the network.
    if (hasScore) {
      setQuizAttempts((prev) => [
        {
          lesson_id: lessonId,
          week_id: weekId,
          score: result.score,
          max_score: result.maxScore,
          xp_awarded: quizXp,
          pending_grade_count: result.pendingGradeCount ?? 0,
          submitted_at: clientTs,
        },
        ...prev,
      ]);
    }

    // Toast(s). XP earned first; level-up next if it crossed a threshold.
    if (quizXp > 0) {
      pushNotification({ kind: "xp", amount: quizXp, detail: lesson?.title, source: "quiz" });
    }
    const newLevel = levelFromXp(totalXp + quizXp);
    if (newLevel > currentLevel) {
      pushNotification({ kind: "level-up", level: newLevel });
    }

    // Persist for logged-in students. Staff/anonymous: skip writes silently.
    if (studentId && isStudent && hasScore) {
      saveQuizAttempt({
        studentId,
        weekId,
        lessonId,
        score: result.score,
        maxScore: result.maxScore,
        xpAwarded: quizXp,
        pendingGradeCount: result.pendingGradeCount ?? 0,
        answers: result.answers ?? null,
      }).then((saved) => {
        if (saved?.id) {
          // Patch the optimistic entry so the grade-poll can match it by id.
          setQuizAttempts((prev) =>
            prev.map((a) =>
              a.lesson_id === lessonId && a.submitted_at === clientTs
                ? { ...a, id: saved.id, submitted_at: saved.submitted_at }
                : a,
            ),
          );
          // Remember pending attempt ids so the notification fires even after
          // the student logs out and back in before the teacher grades.
          if ((result.pendingGradeCount ?? 0) > 0) {
            const ids = loadPendingIds(studentId);
            ids.add(saved.id);
            savePendingIds(studentId, ids);
          }
        }
      }).catch((err) => {
        console.error("Failed to save quiz attempt:", err);
      });

      // Re-derive achievements against progress that now includes this
      // attempt, so quiz-driven ones (First Quiz, Perfect Score, …)
      // unlock and toast immediately instead of waiting for next login.
      const attemptsWithThis = [
        {
          lesson_id: lessonId,
          score: result.score,
          max_score: result.maxScore,
          xp_awarded: quizXp,
          submitted_at: new Date().toISOString(),
        },
        ...quizAttempts,
      ];
      const ctx = {
        completedLessons,
        completedRows,
        attempts: attemptsWithThis,
        totalXp: totalXpEarned(completedRows, attemptsWithThis),
      };
      syncAchievements(studentId, ctx, unlockedAchievements)
        .then(({ unlocked, newlyUnlocked }) => {
          setUnlockedAchievements(unlocked);
          for (const key of newlyUnlocked) {
            pushNotification({
              kind: "achievement",
              label: achievementLabel(key),
              amount: achievementXp(key),
              achievementKey: key,
            });
          }
        })
        .catch((err) => {
          console.error("Failed to sync achievements:", err);
        });
    }
  };

  // Maps game IDs to their completion achievement keys.
  const GAME_ACHIEVEMENT_KEYS = {
    'mystery-lab': MYSTERY_LAB_COMPLETE_KEY,
    'cell-division-defense': CELL_DIVISION_COMPLETE_KEY,
    'matter-state-sandbox': MATTER_STATE_SANDBOX_COMPLETE_KEY,
  };

  // Human-readable names for XP toast detail text.
  const GAME_NAMES = {
    'mystery-lab': 'Mystery Lab',
    'cell-division-defense': 'Cell Division Defense',
    'matter-state-sandbox': 'Matter State Sandbox',
  };

  // Called by GamePlayPage → GameComponent when a game run ends.
  // Mystery Lab payload: { gameId, challengeId, completed, xp, stars }
  // Cell Division payload: { stars, mutations, hpLeft, xpEarned, levelId, reason? }
  const handleGameProgressUpdate = (payload) => {
    const gameId = payload.gameId ?? activeGameId;
    if (!gameId) return;

    const challengeId = payload.challengeId ?? payload.levelId ?? gameId;
    const stars = payload.stars ?? 0;
    const xpEarned = payload.xp ?? payload.xpEarned ?? 0;
    // reason:'nucleusDestroyed' signals a loss for Cell Division; absence = win.
    const isWin = payload.reason !== 'nucleusDestroyed';
    const isCompleted = isWin && payload.completed !== false;

    // Always persist to DB for attempt-tracking, even on losses.
    if (user?.id && isStudent) {
      writeGameProgress(supabase, {
        userId: user.id,
        gameId,
        levelId: challengeId,
        stars,
        xpEarned: isCompleted ? xpEarned : 0,
        completedAt: new Date().toISOString(),
      }).catch((err) => console.error('Failed to save game progress:', err));
    }

    if (!isCompleted) return;

    const existingEntry = completedGames.find(
      (g) => g.gameId === gameId && g.challengeId === challengeId,
    );
    const isFirstCompletion = !existingEntry;
    const isImprovedScore = existingEntry && xpEarned > existingEntry.xpEarned;
    const achievementKey = GAME_ACHIEVEMENT_KEYS[gameId];
    const alreadyHasAchievement = achievementKey ? unlockedAchievements.includes(achievementKey) : false;

    if (isFirstCompletion) {
      setCompletedGames((prev) => [...prev, { gameId, challengeId, xpEarned }]);
      if (xpEarned > 0 && !alreadyHasAchievement) {
        pushNotification({ kind: 'xp', amount: xpEarned, detail: GAME_NAMES[gameId] ?? gameId, source: 'game' });
      }
      const newLevel = levelFromXp(totalXp + (alreadyHasAchievement ? 0 : xpEarned));
      if (newLevel > currentLevel) {
        pushNotification({ kind: 'level-up', level: newLevel });
      }
    } else if (isImprovedScore) {
      setCompletedGames((prev) =>
        prev.map((g) =>
          g.gameId === gameId && g.challengeId === challengeId
            ? { ...g, xpEarned }
            : g,
        ),
      );
      const diff = xpEarned - existingEntry.xpEarned;
      if (diff > 0 && !alreadyHasAchievement) {
        pushNotification({ kind: 'xp', amount: diff, detail: GAME_NAMES[gameId] ?? gameId, source: 'game' });
        const newLevel = levelFromXp(totalXp + diff);
        if (newLevel > currentLevel) {
          pushNotification({ kind: 'level-up', level: newLevel });
        }
      }
    }

    // Award completion achievement (idempotent — DB ignores duplicates).
    if (achievementKey && user?.id && isStudent && !unlockedAchievements.includes(achievementKey)) {
      setUnlockedAchievements((prev) => [...prev, achievementKey]);
      awardAchievements(user.id, [achievementKey]).catch((err) =>
        console.error('Failed to award game achievement:', err),
      );
      const achXp = achievementXp(achievementKey);
      pushNotification({
        kind: 'achievement',
        label: achievementLabel(achievementKey),
        amount: achXp,
        achievementKey,
      });
    }
  };

  // Called by the "Back to Lessons" button on the results screen. XP/persistence
  // already happened on submit; this only advances to the next lesson (or the
  // lessons list if this was the last one in the week).
  const handleQuizFinish = () => {
    const week = WEEKS_DATA.find((w) => w.id === activeWeekId);
    if (!week) {
      handleNavigate("lessons");
      return;
    }

    const lessonId = activeLessonId;
    const currentIndex = week.lessons.findIndex((l) => l.id === lessonId);
    const nextLesson = week.lessons[currentIndex + 1];

    if (nextLesson) {
      setActiveLessonId(nextLesson.id);
      if (!reachedLessons.includes(nextLesson.id)) {
        setReachedLessons((prev) => [...prev, nextLesson.id]);
      }
      handleNavigate("lesson-content");
    } else {
      setActiveWeekId(null);
      setActiveLessonId(null);
      handleNavigate("lessons");
    }
  };

  const isPortalView =
    currentView === "admin" ||
    currentView === "teacher-portal" ||
    currentView === "game-play" ||
    currentView === "teacher-setup";

  const renderView = () => {
    switch (currentView) {
      case "home":
        return (
          <LandingPage
            onStartLearning={handleStartLearning}
            onTeacherPortal={() => handleNavigate("teacher-portal")}
            onAdminPortal={() => handleNavigate("admin")}
            onNavigate={handleNavigate}
            canEarnExplorer={isLoggedIn && isStudent && !explorerUnlocked}
            onExplore={handleExplorerUnlock}
          />
        );

      case "lessons":
        return (
          <LessonsPage
            onStartWeek={handleStartWeek}
            quizAttempts={effectiveQuizAttempts}
            totalXp={totalXp}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setIsAuthModalOpen(true)}
            publishedWeekIds={publishedWeekIds}
            openWeekIds={openWeekIds}
          />
        );

      case "lesson-content":
        return (
          <LessonContentPage
            weekId={activeWeekId}
            activeLessonId={activeLessonId}
            completedLessons={effectiveCompletedLessons}
            lessonsPassed={lessonsPassed}
            reachedLessons={reachedLessons}
            onBack={() => handleNavigate("lessons")}
            onGoToQuiz={handleGoToQuiz}
            onLessonComplete={handleLessonComplete}
            quizLocked={isQuizLockedForWeek(activeWeekId)}
            onLessonSelect={(lessonId) => {
              setActiveLessonId(lessonId);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        );

      case "quiz":
        return (
          <QuizPage
            activeLessonId={activeLessonId}
            priorAttempts={quizPriorAttempts}
            onBack={() => handleNavigate("lessons")}
            onComplete={handleQuizComplete}
            onFinish={handleQuizFinish}
            timeLimitSeconds={getQuizTimeLimit(quizSettings, activeLessonId)}
            maxAttempts={getQuizMaxAttempts(quizSettings, activeLessonId)}
            showCorrectAnswers={getQuizShowAnswers(quizSettings, activeLessonId)}
          />
        );

      case "about":
        return <AboutPage onBlacked={handleBlackedUnlock} />;

      case "contact":
        return <ContactPage />;

      case "admin":
        return <AdminDashboardPage onNavigate={handleNavigate} />;

      case "teacher-portal":
        return <TeacherPortalPage onBack={() => handleNavigate("home")} />;

      case "profile":
        return (
          <ProfilePage
            onNavigate={handleNavigate}
            completedLessons={effectiveCompletedLessons}
            completedRows={effectiveCompletedRows}
            quizAttempts={effectiveQuizAttempts}
            unlockedAchievements={effectiveUnlockedAchievements}
            totalXp={totalXp}
            highlightAchievement={highlightedAchievement}
            scrollTarget={profileScrollTarget}
            highlightActivity={highlightedActivity}
          />
        );

      case "games":
        return (
          <GamesHubPage
            onNavigate={handleNavigate}
            totalXp={totalXp}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setIsAuthModalOpen(true)}
          />
        );

      case "game-play":
        return (
          <GamePlayPage
            activeGameId={activeGameId}
            user={user}
            profile={profile}
            onNavigate={handleNavigate}
            onProgressUpdate={handleGameProgressUpdate}
          />
        );

      case "teacher-setup":
        return (
          <TeacherSetupPage
            expired={isExpiredInvite.current}
            onComplete={() => {
              isInviteFlow.current = false;
              handleNavigate("teacher-portal");
            }}
          />
        );

      default:
        return (
          <LandingPage
            onStartLearning={handleStartLearning}
            onTeacherPortal={() => handleNavigate("teacher-portal")}
            onAdminPortal={() => handleNavigate("admin")}
            onNavigate={handleNavigate}
            canEarnExplorer={isLoggedIn && isStudent && !explorerUnlocked}
            onExplore={handleExplorerUnlock}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body text-stone-800 dark:text-stone-100 bg-[#fdf6e3] dark:bg-stone-900">
      {!isPortalView && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          userFirstName={profile?.first_name}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogoutClick={handleLogout}
          transparent={currentView === "home"}
        />
      )}

      <main className="grow">{renderView()}</main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <XpToast notifications={notifications} onDismiss={dismissNotification} />
      {isLoggedIn && isStudent && !isPortalView && (
        <NotificationBubble
          notifications={notifHistory}
          unseenCount={unseenCount}
          onNavigate={handleNavigate}
          onOpen={handleNotifBubbleOpen}
          onClearAll={handleClearAllNotifs}
          onClearOne={handleClearOneNotif}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
