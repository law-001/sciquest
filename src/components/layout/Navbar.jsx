import React, { useState } from "react";
import { Sun, Moon, User } from "lucide-react";
import Logo from "../Logo";
import Button from "../Button";
import { useTheme } from "../../context/ThemeContext";

export function Navbar({
  currentView,
  onNavigate,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  const navItems = [
    { label: "Home", view: "home" },
    { label: "Lessons", view: "lessons" },
    { label: "About", view: "about" },
    { label: "Contact", view: "contact" },
  ];

  const handleNavClick = (view) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-primary-50 dark:bg-stone-900 sticky top-0 z-50 shadow-md dark:shadow-stone-900/50 border-b border-transparent dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick("home")}
          >
            <Logo className="animate-[spin_5s_linear_infinite] text-orange-500" />
            <span className="font-heading font-black text-2xl tracking-tight text-stone-900 dark:text-white">
              SciQuest
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`text-sm font-bold font-heading transition-colors hover:text-primary-600 dark:hover:text-primary-400
                  ${currentView === item.view
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-stone-700 dark:text-stone-300"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleNavClick("profile")}
              aria-label="Profile"
              className={`p-2 rounded-xl transition-colors hover:bg-stone-200 dark:hover:bg-stone-700 ${
                currentView === "profile"
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-stone-500 dark:text-stone-400"
              }`}
            >
              <User className="w-5 h-5" />
            </button>
            {isLoggedIn ? (
              <Button variant="outline" onClick={onLogoutClick} size="sm">
                Logout
              </Button>
            ) : (
              <Button onClick={onLoginClick} size="sm">
                Login / Sign Up
              </Button>
            )}
          </div>

          {/* Mobile: Theme toggle + Menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
              variant="ghost"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                  stroke={isDark ? "#d6d3d1" : "#57534E"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6h12v12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                  stroke={isDark ? "#d6d3d1" : "#57534E"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-stone-200 dark:border-stone-700">
            <div className="flex flex-col gap-6 text-lg font-medium">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`text-left transition-colors ${
                    currentView === item.view
                      ? "text-primary-600 dark:text-primary-400 font-bold"
                      : "text-zinc-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => handleNavClick("profile")}
                className={`text-left flex items-center gap-2 transition-colors ${
                  currentView === "profile"
                    ? "text-primary-600 dark:text-primary-400 font-bold"
                    : "text-zinc-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                {isLoggedIn ? (
                  <Button onClick={onLogoutClick} className="w-full">
                    Logout
                  </Button>
                ) : (
                  <Button onClick={onLoginClick} className="w-full">
                    Login / Sign Up
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
