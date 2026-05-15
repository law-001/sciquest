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
} from "./lib/progress";

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState("home");
  const initialRedirectDone = useRef(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reachedLessons, setReachedLessons] = useState([]);
  const [activeWeekId, setActiveWeekId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);

  const isLoggedIn = !!user;
  const isStudent = profile?.role === "student";

  // Hydrate progress + quiz attempts from Supabase whenever a student logs in.
  // Staff don't have student_progress rows, so we skip the fetch for them.
  useEffect(() => {
    if (!user || !isStudent) {
      setCompletedLessons([]);
      setQuizAttempts([]);
      return;
    }
    let cancelled = false;
    fetchProgress(user.id)
      .then(({ completedLessons: done, attempts }) => {
        if (cancelled) return;
        setCompletedLessons(done);
        setQuizAttempts(attempts);
        // Anything completed is also "reached" — keeps the lesson tab nav consistent.
        setReachedLessons((prev) => Array.from(new Set([...prev, ...done])));
      })
      .catch((err) => {
        console.error("Failed to load student progress:", err);
      });
    return () => { cancelled = true };
  }, [user?.id, isStudent]);

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

  // Called by QuizContainer's onComplete with { score, maxScore } (or undefined
  // if the user bailed before submitting). Persists the attempt + lesson
  // completion to Supabase for students; optimistically updates local state.
  const handleQuizComplete = (result) => {
    const week = WEEKS_DATA.find((w) => w.id === activeWeekId);
    if (!week) {
      handleNavigate("lessons");
      return;
    }

    const lessonId = activeLessonId;
    const weekId = week.id;
    const studentId = user?.id;

    // Optimistic local update — UI doesn't wait on the network.
    const updated = completedLessons.includes(lessonId)
      ? completedLessons
      : [...completedLessons, lessonId];
    setCompletedLessons(updated);

    if (result && Number.isFinite(result.score) && Number.isFinite(result.maxScore)) {
      setQuizAttempts((prev) => [
        { lesson_id: lessonId, week_id: weekId, score: result.score, max_score: result.maxScore, submitted_at: new Date().toISOString() },
        ...prev,
      ]);
    }

    // Persist for logged-in students. Staff/anonymous: skip writes silently.
    if (studentId && isStudent) {
      markLessonComplete(studentId, weekId, lessonId).catch((err) => {
        console.error("Failed to mark lesson complete:", err);
      });
      if (result && Number.isFinite(result.score) && Number.isFinite(result.maxScore)) {
        saveQuizAttempt({
          studentId,
          weekId,
          lessonId,
          score: result.score,
          maxScore: result.maxScore,
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
