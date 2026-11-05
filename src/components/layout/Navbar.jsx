import { Avatar } from "../Avatar";
import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, User, LogOut, ChevronDown, Trophy } from "lucide-react";
import Logo from "../Logo";
import Button from "../Button";
import { LeaderboardModal } from "../modals/LeaderboardModal";
import { useTheme } from "../../context/ThemeContext";

export function Navbar({
  currentView,
  onNavigate,
  isLoggedIn,
  userFirstName,
  avatarId,
  avatarStyle,
  onLoginClick,
  onLogoutClick,
  transparent = false,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
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
    { label: "Games", view: "games" },
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

  // One shape for both mobile bar buttons, so they read as a pair.
  const iconButton = `flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-500 ${
    hero
      ? isDark
        ? "text-white/80 hover:bg-white/10"
        : "text-stone-700 hover:bg-stone-100"
      : "text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
  }`;

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
        {/* 1fr / auto / 1fr — the two side columns are always equal, so the five
            nav links sit dead-centre no matter how wide the logo or right side get */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer justify-self-start"
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
          <div className="hidden md:flex items-center gap-8 text-sm font-medium justify-self-center">
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

          {/* Desktop: leaderboard + theme + auth */}
          <div className="hidden md:flex items-center gap-3 justify-self-end">
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              aria-label="Open the section leaderboard"
              className={`p-2 rounded-xl transition-colors duration-500 ${
                hero
                  ? isDark
                    ? "text-white/80 hover:bg-white/10"
                    : "text-stone-700 hover:bg-stone-100"
                  : "text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              <Trophy className="w-5 h-5" />
            </button>

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
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors duration-500 ${
                    hero
                      ? isDark
                        ? "text-white/80 hover:bg-white/10"
                        : "text-stone-700 hover:bg-stone-100"
                      : "text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                  }`}
                >
                  <Avatar avatarId={avatarId} avatarStyle={avatarStyle} name={userFirstName ?? ""} size={32} />
                  <span className="text-sm font-bold font-heading">{userFirstName ?? "Profile"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => { setIsProfileOpen(false); handleNavClick("profile"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      View My Profile
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

          {/* Mobile: theme toggle then hamburger, hamburger last so it sits on
              the right edge. Both are plain 44px squares — Button's size padding
              would hold the icon in from the edge. The leaderboard lives in the
              menu below, so the bar stays readable next to the logo.
              col-start-3: the centre links column is display:none on mobile, so
              without it this group would auto-place into the middle column. */}
          <div className="md:hidden col-start-3 flex items-center gap-2 justify-self-end">
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={iconButton}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className={iconButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
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

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsLeaderboardOpen(true);
                }}
                className={`text-left flex items-center min-h-[44px] transition-colors duration-500 ${
                  hero
                    ? isDark
                      ? "text-white/80 hover:text-white"
                      : "text-stone-900 hover:text-stone-700"
                    : "text-zinc-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                Leaderboard
              </button>

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
                  {userFirstName ?? "My Profile"}
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

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </nav>
  );
}
