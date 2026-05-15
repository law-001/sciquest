import React, { useState, useEffect, useRef } from "react";
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
import { WEEKS_DATA } from "./data/lessonsweek-01";
import {
  fetchProgress,
  markLessonComplete,
  saveQuizAttempt,
  totalXpEarned,
} from "./lib/progress";
import { levelFromXp } from "./lib/xp-config";
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
  const [completedRows, setCompletedRows] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const isLoggedIn = !!user;
  const isStudent = profile?.role === "student";

  const totalXp = totalXpEarned(completedRows, quizAttempts);
  const currentLevel = levelFromXp(totalXp);

  // Hydrate progress + quiz attempts from Supabase whenever a student logs in.
  // Staff don't have student_progress rows, so we skip the fetch for them.
  useEffect(() => {
    if (!user || !isStudent) {
      setCompletedLessons([]);
      setCompletedRows([]);
      setQuizAttempts([]);
      return;
    }
    let cancelled = false;
    fetchProgress(user.id)
      .then(({ completedLessons: done, completedRows: rows, attempts }) => {
        if (cancelled) return;
        setCompletedLessons(done);
        setCompletedRows(rows);
        setQuizAttempts(attempts);
        // Anything completed is also "reached" — keeps the lesson tab nav consistent.
        setReachedLessons((prev) => Array.from(new Set([...prev, ...done])));
      })
      .catch((err) => {
        console.error("Failed to load student progress:", err);
      });
    return () => { cancelled = true };
  }, [user?.id, isStudent]);

  const pushNotification = (n) => {
    setNotifications((prev) => [...prev, { id: Date.now() + Math.random(), ...n }]);
  };
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // On refresh, once the restored session + profile are ready, redirect by role
  useEffect(() => {
    if (loading || initialRedirectDone.current) return;
    initialRedirectDone.current = true;
    if (!user) return;
    const role = profile?.role ?? 'student';
    if (role === 'admin') setCurrentView('admin');
    else if (role === 'teacher') setCurrentView('teacher-portal');
    else setCurrentView('lessons');
  }, [loading]);

  const handleNavigate = (view) => {
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
      (l) => !completedLessons.includes(l.id),
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

  // Called by QuizContainer's onComplete with { score, maxScore, xpEarned,
  // pendingGradeCount } (or undefined if the user bailed). Persists the
  // attempt + lesson completion to Supabase for students; optimistically
  // updates local state and fires XP / level-up toasts.
  const handleQuizComplete = (result) => {
    const week = WEEKS_DATA.find((w) => w.id === activeWeekId);
    if (!week) {
      handleNavigate("lessons");
      return;
    }

    const lesson = week.lessons.find((l) => l.id === activeLessonId);
    const lessonId = activeLessonId;
    const weekId = week.id;
    const studentId = user?.id;
    const alreadyComplete = completedLessons.includes(lessonId);

    // Lesson XP is awarded once. Quiz XP fires every attempt.
    const lessonXp = alreadyComplete ? 0 : (lesson?.xp ?? 0);
    const quizXp = result && Number.isFinite(result.xpEarned) ? result.xpEarned : 0;
    const xpDelta = lessonXp + quizXp;

    // Optimistic local update — UI doesn't wait on the network.
    if (!alreadyComplete) {
      setCompletedLessons((prev) => [...prev, lessonId]);
      setCompletedRows((prev) => [
        ...prev,
        { lesson_id: lessonId, week_id: weekId, completed: true, completed_at: new Date().toISOString(), xp_awarded: lessonXp },
      ]);
    }

    if (result && Number.isFinite(result.score) && Number.isFinite(result.maxScore)) {
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
    if (xpDelta > 0) {
      pushNotification({ kind: "xp", amount: xpDelta, detail: lesson?.title });
    }
    const newLevel = levelFromXp(totalXp + xpDelta);
    if (newLevel > currentLevel) {
      pushNotification({ kind: "level-up", level: newLevel });
    }

    // Persist for logged-in students. Staff/anonymous: skip writes silently.
    if (studentId && isStudent) {
      markLessonComplete(studentId, weekId, lessonId, lessonXp).catch((err) => {
        console.error("Failed to mark lesson complete:", err);
      });
      if (result && Number.isFinite(result.score) && Number.isFinite(result.maxScore)) {
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
      }
    }

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
    currentView === "teacher-portal";

  const renderView = () => {
    switch (currentView) {
      case "home":
        return (
          <LandingPage
            onStartLearning={handleStartLearning}
            onTeacherPortal={() => handleNavigate("teacher-portal")}
            onAdminPortal={() => handleNavigate("admin")}
            onNavigate={handleNavigate}
          />
        );

      case "lessons":
        return (
          <LessonsPage
            onStartWeek={handleStartWeek}
            completedLessons={completedLessons}
            quizAttempts={quizAttempts}
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
            completedLessons={completedLessons}
            reachedLessons={reachedLessons}
            onBack={() => handleNavigate("lessons")}
            onGoToQuiz={handleGoToQuiz}
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
            onBack={() => handleNavigate("lessons")}
            onComplete={handleQuizComplete}
          />
        );

      case "about":
        return <AboutPage />;

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
            completedLessons={completedLessons}
            quizAttempts={quizAttempts}
          />
        );

      default:
        return (
          <LandingPage
            onStartLearning={handleStartLearning}
            onTeacherPortal={() => handleNavigate("teacher-portal")}
            onAdminPortal={() => handleNavigate("admin")}
            onNavigate={handleNavigate}
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
