import React, { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { AuthModal } from "./components/modals/AuthModal";
import { LandingPage } from "./pages/LandingPage";
import { LessonsPage } from "./pages/LessonsPage";
import { QuizPage } from "./pages/QuizPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { TeachersManagementPage } from "./pages/TeachersManagementPage";
import { LessonContentPage } from "./pages/LessonContentPage";
import { TeacherPortalPage } from "./pages/TeacherPortalPage";
import { WEEKS_DATA } from "./data/week-01"; // ← import your data

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reachedLessons, setReachedLessons] = useState([]);

  // ── New week/lesson state (replaces old activeLessonId) ──
  const [activeWeekId, setActiveWeekId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]); // ["lesson-1", "lesson-2", ...]

  // ─────────────────────────────────────────────────────────
  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartLearning = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      handleNavigate("lessons");
    }
  };

  // Called when a week card is clicked on LessonsPage
  // Finds the first incomplete lesson in that week and opens it
  const handleStartWeek = (weekId) => {
    const week = WEEKS_DATA.find((w) => w.id === weekId);
    if (!week) return;
    const firstIncomplete = week.lessons.find(
      (l) => !completedLessons.includes(l.id),
    );
    const target = firstIncomplete ?? week.lessons[0];
    setActiveWeekId(weekId);
    setActiveLessonId(target.id);
    // mark it as reached
    if (!reachedLessons.includes(target.id)) {
      setReachedLessons((prev) => [...prev, target.id]);
    }
    handleNavigate("lesson-content");
  };

  // Called when "Complete Lesson & Start Quiz" is clicked in LessonTemplate
  // Just navigates to the quiz — completion is recorded AFTER quiz is done
  const handleGoToQuiz = () => {
    handleNavigate("quiz");
  };

  // Called when the quiz is submitted/completed
  // Marks the current lesson done, then either opens the next lesson or returns home
  const handleQuizComplete = () => {
    const week = WEEKS_DATA.find((w) => w.id === activeWeekId);
    if (!week) {
      handleNavigate("lessons");
      return;
    }

    const updated = completedLessons.includes(activeLessonId)
      ? completedLessons
      : [...completedLessons, activeLessonId];
    setCompletedLessons(updated);

    const currentIndex = week.lessons.findIndex((l) => l.id === activeLessonId);
    const nextLesson = week.lessons[currentIndex + 1];

    if (nextLesson) {
      setActiveLessonId(nextLesson.id);
      // mark next lesson as reached
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

  // ─────────────────────────────────────────────────────────
  const isPortalView =
    currentView === "admin" ||
    currentView === "teachers" ||
    currentView === "teacher-portal";

  const renderView = () => {
    switch (currentView) {
      case "home":
        return (
          <LandingPage
            onStartLearning={handleStartLearning}
            onTeacherPortal={() => handleNavigate("teacher-portal")}
            onAdminPortal={() => handleNavigate("admin")}
          />
        );

      case "lessons":
        return (
          <LessonsPage
            onStartWeek={handleStartWeek} // ← week card click
            completedLessons={completedLessons} // ← for progress bars & pill badges
          />
        );

      case "lesson-content":
        return (
          <LessonContentPage
            weekId={activeWeekId}
            activeLessonId={activeLessonId}
            completedLessons={completedLessons}
            reachedLessons={reachedLessons} // ← add this
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
            activeLessonId={activeLessonId} // ✅ matches what QuizPage destructures
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

      case "teachers":
        return <TeachersManagementPage onNavigate={handleNavigate} />;

      case "teacher-portal":
        return <TeacherPortalPage onBack={() => handleNavigate("home")} />;

      default:
        return (
          <LandingPage
            onStartLearning={handleStartLearning}
            onTeacherPortal={() => handleNavigate("teacher-portal")}
            onAdminPortal={() => handleNavigate("admin")}
          />
        );
    }
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col font-body text-stone-800"
      style={{ backgroundColor: "#fdf6e3" }}
    >
      {!isPortalView && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogoutClick={() => {
            setIsLoggedIn(false);
            handleNavigate("home");
          }}
        />
      )}

      <main className="grow animate-slide-up">{renderView()}</main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => {
          setIsLoggedIn(true);
          if (currentView === "home") handleNavigate("lessons");
        }}
      />
    </div>
  );
}
