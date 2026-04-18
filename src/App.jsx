import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { AuthModal } from './components/modals/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { LessonsPage } from './pages/LessonsPage';
import { QuizPage } from './pages/QuizPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { TeachersManagementPage } from './pages/TeachersManagementPage';
import { LessonContentPage } from './pages/LessonContentPage';
import { TeacherPortalPage } from './pages/TeacherPortalPage';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState(null);

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleStartLearning = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      handleNavigate('lessons');
    }
  };

  const handleStartLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    handleNavigate('lesson-content');
  };

  const handleQuizComplete = () => {
    setActiveLessonId(null);
    handleNavigate('lessons');
  };

  const isPortalView =
    currentView === 'admin' ||
    currentView === 'teachers' ||
    currentView === 'teacher-portal';

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <LandingPage
            onStartLearning={handleStartLearning}
            onTeacherPortal={() => handleNavigate('teacher-portal')}
            onAdminPortal={() => handleNavigate('admin')}
          />
        );
      case 'lessons':
        return <LessonsPage onStartLesson={handleStartLesson} />;
      case 'lesson-content':
        return (
          <LessonContentPage
            onBack={() => handleNavigate('lessons')}
            onComplete={() => handleNavigate('quiz')}
          />
        );
      case 'quiz':
        return (
          <QuizPage
            onComplete={handleQuizComplete}
            onExit={() => handleNavigate('lessons')}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case 'teachers':
        return <TeachersManagementPage onNavigate={handleNavigate} />;
      case 'teacher-portal':
        return <TeacherPortalPage onBack={() => handleNavigate('home')} />;
      default:
        return (
          <LandingPage
            onStartLearning={handleStartLearning}
            onTeacherPortal={() => handleNavigate('teacher-portal')}
            onAdminPortal={() => handleNavigate('admin')}
          />
        );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-body text-stone-800"
      style={{
        backgroundColor: '#fdf6e3',
      }}
    >
      {!isPortalView && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogoutClick={() => {
            setIsLoggedIn(false);
            handleNavigate('home');
          }}
        />
      )}

      <main className="grow animate-slide-up">{renderView()}</main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => {
          setIsLoggedIn(true);
          if (currentView === 'home') {
            handleNavigate('lessons');
          }
        }}
      />
    </div>
  );
}