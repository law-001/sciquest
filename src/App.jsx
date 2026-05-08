import React, { useState } from "react";
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
import { TeachersManagementPage } from "./pages/TeachersManagementPage";
import { LessonContentPage } from "./pages/LessonContentPage";
import { TeacherPortalPage } from "./pages/TeacherPortalPage";
import { ProfilePage } from "./pages/ProfilePage";
import { WEEKS_DATA } from "./data/lessonsweek-01";

function AppContent() {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reachedLessons, setReachedLessons] = useState([]);
  const [activeWeekId, setActiveWeekId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  const isLoggedIn = !!user;

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

  const handleLogout = async () => {
    await signOut();
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
            onNavigate={handleNavigate}
          />
        );

      case "lessons":
        return (
          <LessonsPage
            onStartWeek={handleStartWeek}
            completedLessons={completedLessons}
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

      case "teachers":
        return <TeachersManagementPage onNavigate={handleNavigate} />;

      case "teacher-portal":
        return <TeacherPortalPage onBack={() => handleNavigate("home")} />;

      case "profile":
        return <ProfilePage onNavigate={handleNavigate} />;

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
