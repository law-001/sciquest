import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, User, LogOut, ChevronDown } from "lucide-react";
import Logo from "../Logo";
import Button from "../Button";
import { useTheme } from "../../context/ThemeContext";

export function Navbar({
  currentView,
  onNavigate,
  isLoggedIn,
  userFirstName,
  onLoginClick,
  onLogoutClick,
  transparent = false,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    if (!transparent) return;
    const target = document.getElementById("sq-hero");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [transparent]);

  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isProfileOpen]);

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

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    onLogoutClick();
  };

  const hero = transparent && !isScrolled;

  return (
    <nav className={`${transparent ? "fixed" : "sticky"} top-0 left-0 right-0 z-50`}>

      {/* Solid background — fades in via opacity so the transition is GPU-accelerated */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-primary-50/95 dark:bg-stone-900 backdrop-blur-sm
          border-b border-stone-200/60 dark:border-stone-800 shadow-sm
          transition-opacity duration-500 ease-in-out
          ${hero ? "opacity-0" : "opacity-100"}`}
      />

      {/* ── Content (always above the bg layer) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick("home")}
          >
            <Logo
              className={`animate-[spin_5s_linear_infinite] transition-colors duration-500 ${
                hero ? (isDark ? "text-white" : "text-orange-500") : "text-orange-500"
              }`}
            />
            <span
              className={`font-heading font-black text-2xl tracking-tight transition-colors duration-500 ${
                hero ? (isDark ? "text-white" : "text-stone-900") : "text-stone-900 dark:text-white"
              }`}
            >
              SciQuest
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`text-sm font-bold font-heading transition-colors duration-500 ${
                  hero
                    ? isDark
                      ? "text-white/90 hover:text-primary-400"
                      : "text-stone-900 hover:text-primary-600"
                    : currentView === item.view
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-stone-700 dark:text-stone-300 hover:text-primary-600 dark:hover:text-primary-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop: theme + auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`p-2 rounded-xl transition-colors duration-500 ${
                hero
                  ? isDark
                    ? "text-white/80 hover:bg-white/10"
                    : "text-stone-700 hover:bg-stone-100"
                  : "text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isLoggedIn ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen((o) => !o)}
                  aria-label="Profile menu"
                  aria-expanded={isProfileOpen}
                  className={`flex items-center gap-1 p-2 rounded-xl transition-colors duration-500 ${
                    hero
                      ? isDark
                        ? "text-white/80 hover:bg-white/10"
                        : "text-stone-700 hover:bg-stone-100"
                      : "text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => { setIsProfileOpen(false); handleNavClick("profile"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {userFirstName ?? "My Profile"}
                    </button>
                    <div className="border-t border-stone-200 dark:border-stone-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={onLoginClick} size="sm">
                Login / Sign Up
              </Button>
            )}
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`p-2 rounded-xl transition-colors duration-500 ${
                hero
                  ? isDark
                    ? "text-white/80 hover:bg-white/10"
                    : "text-stone-700 hover:bg-stone-100"
                  : "text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
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
                  stroke={hero ? (isDark ? "white" : "#1c1917") : isDark ? "#d6d3d1" : "#57534E"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6h12v12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                  stroke={hero ? (isDark ? "white" : "#1c1917") : isDark ? "#d6d3d1" : "#57534E"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-6 border-t rounded-b-2xl -mx-6 px-6 ${
            hero
              ? "border-white/20 dark:border-stone-700 backdrop-blur-md bg-white/10 dark:bg-stone-900/60"
              : "border-stone-200 dark:border-stone-700"
          }`}>
            <div className="flex flex-col gap-6 text-lg font-medium">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`text-left transition-colors duration-500 ${
                    hero
                      ? isDark
                        ? "text-white/80 hover:text-white"
                        : "text-stone-900 hover:text-stone-700"
                      : currentView === item.view
                        ? "text-primary-600 dark:text-primary-400 font-bold"
                        : "text-zinc-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {isLoggedIn && !hero && (
                <button
                  onClick={() => handleNavClick("profile")}
                  className={`text-left flex items-center gap-2 transition-colors duration-500 ${
                    currentView === "profile"
                      ? "text-primary-600 dark:text-primary-400 font-bold"
                      : "text-zinc-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                  }`}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
              )}

              <div className={`pt-4 border-t ${
                hero
                  ? "border-white/20 dark:border-stone-700"
                  : "border-stone-200 dark:border-stone-700"
              }`}>
                {isLoggedIn ? (
                  <Button onClick={handleLogout} className="w-full flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" />
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
