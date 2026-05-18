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
import { WEEKS_DATA } from "./data/lessonsweek-01";
import {
  fetchProgress,
  markLessonComplete,
  saveQuizAttempt,
  totalXpEarned,
} from "./lib/progress";
import { levelFromXp } from "./lib/xp-config";
import { fetchAchievements, syncAchievements, awardAchievements } from "./lib/achievements-store";
import { CURIOUS_EXPLORER_KEY, BLACKED_KEY, achievementLabel, achievementXp, totalAchievementXp } from "./lib/achievements";
import { XpToast } from "./components/XpToast";

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState("home");
  const initialRedirectDone = useRef(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reachedLessons, setReachedLessons] = useState([]);
  const [activeWeekId, setActiveWeekId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeGameId, setActiveGameId] = useState(null);
  const [completedRows, setCompletedRows] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const isLoggedIn = !!user;
  const isStudent = profile?.role === "student";

  // When the user is not a logged-in student, treat progress as empty so stale
  // state from a previous session never leaks into non-student views.
  const effectiveCompletedLessons = (user && isStudent) ? completedLessons : [];
  const effectiveCompletedRows    = (user && isStudent) ? completedRows    : [];
  const effectiveQuizAttempts     = (user && isStudent) ? quizAttempts     : [];
  const effectiveUnlockedAchievements = (user && isStudent) ? unlockedAchievements : [];

  // Total XP = lesson + quiz XP plus the bonus from every unlocked
  // achievement, so an unlock genuinely moves the student's total and
  // can push them up a level.
  const totalXp =
    totalXpEarned(effectiveCompletedRows, effectiveQuizAttempts) +
    totalAchievementXp(effectiveUnlockedAchievements);
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
    Promise.all([fetchProgress(user.id), fetchAchievements(user.id)])
      .then(async ([{ completedLessons: done, completedRows: rows, attempts }, unlocked]) => {
        if (cancelled) return;
        setCompletedLessons(done);
        setCompletedRows(rows);
        setQuizAttempts(attempts);
        // Anything completed is also "reached" — keeps the lesson tab nav consistent.
        setReachedLessons((prev) => Array.from(new Set([...prev, ...done])));

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
    awardAchievements(user.id, [CURIOUS_EXPLORER_KEY]).catch((err) => {
      console.error("Failed to award Curious Explorer:", err);
    });
  }, [user, isStudent, explorerUnlocked]);

  const pushNotification = (n) => {
    setNotifications((prev) => [...prev, { id: Date.now() + Math.random(), ...n }]);
  };
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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
    });
    awardAchievements(user.id, [BLACKED_KEY]).catch((err) => {
      console.error("Failed to award BLACKED:", err);
    });
  }, [user, isStudent, blackedUnlocked]);

  // On refresh, once the restored session + profile are ready, redirect by role.
  // The ref guard ensures this runs at most once even as deps re-fire.
  useEffect(() => {
    if (loading || initialRedirectDone.current) return;
    initialRedirectDone.current = true;
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
    const firstIncomplete = week.lessons.find(
      (l) => !effectiveCompletedLessons.includes(l.id),
    );
    const target = firstIncomplete ?? week.lessons[0];
    setActiveWeekId(weekId);
    setActiveLessonId(target.id);
    if (!reachedLessons.includes(target.id)) {
      setReachedLessons((prev) => [...prev, target.id]);
    }
    handleNavigate("lesson-content");
  };

  const handleGoToQuiz = () => {
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
      pushNotification({ kind: "xp", amount: lessonXp, detail: lesson?.title });
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
          submitted_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    // Toast(s). XP earned first; level-up next if it crossed a threshold.
    if (quizXp > 0) {
      pushNotification({ kind: "xp", amount: quizXp, detail: lesson?.title });
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
            });
          }
        })
        .catch((err) => {
          console.error("Failed to sync achievements:", err);
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
    currentView === "game-play";

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
            completedLessons={effectiveCompletedLessons}
            quizAttempts={effectiveQuizAttempts}
            totalXp={totalXp}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setIsAuthModalOpen(true)}
          />
        );

      case "lesson-content":
        return (
          <LessonContentPage
            weekId={activeWeekId}
            activeLessonId={activeLessonId}
            completedLessons={effectiveCompletedLessons}
            reachedLessons={reachedLessons}
            onBack={() => handleNavigate("lessons")}
            onGoToQuiz={handleGoToQuiz}
            onLessonComplete={handleLessonComplete}
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
            quizAttempts={effectiveQuizAttempts}
            unlockedAchievements={effectiveUnlockedAchievements}
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
