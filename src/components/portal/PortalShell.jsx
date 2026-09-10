import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  X,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

// Two complete sets per accent — the light pair and the dark pair are chosen
// independently rather than tinting one palette, so neither theme inherits the
// other's contrast. Every pair clears 4.5:1 against the rail it sits on
// (white in light, stone-950 in dark).
const ACCENT = {
  primary: {
    chip: "bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300",
    activeItem:
      "bg-primary-50 text-primary-800 dark:bg-primary-950 dark:text-primary-200",
    marker: "bg-primary-500",
    badge:
      "bg-primary-50 text-primary-800 dark:bg-primary-950 dark:text-primary-200",
  },
  secondary: {
    chip: "bg-secondary-100 text-secondary-700 dark:bg-secondary-950 dark:text-secondary-300",
    activeItem:
      "bg-secondary-50 text-secondary-800 dark:bg-secondary-950 dark:text-secondary-200",
    marker: "bg-secondary-500",
    badge:
      "bg-secondary-50 text-secondary-800 dark:bg-secondary-950 dark:text-secondary-200",
  },
};

// Rail item that is not the current page. stone-400 on stone-950 measured too
// dim in dark mode; stone-300 lands around 12:1.
const NAV_IDLE =
  "text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white";

const RAIL_STORAGE_KEY = "sq_portal_rail_collapsed";

function readCollapsed() {
  try {
    return localStorage.getItem(RAIL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function NavList({ items, activeId, onSelect, expanded, tone, onPick }) {
  return (
    <nav className="flex flex-col gap-0.5 py-1" aria-label="Portal sections">
      {items.map(({ id, label, Icon }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              onSelect(id);
              if (onPick) onPick();
            }}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            title={expanded ? undefined : label}
            className={cn(
              "relative flex items-center h-11 rounded-xl text-sm font-bold transition-colors duration-200",
              expanded ? "gap-3 px-3" : "justify-center px-0",
              isActive ? tone.activeItem : NAV_IDLE,
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full transition-opacity duration-200",
                tone.marker,
                isActive ? "opacity-100" : "opacity-0",
              )}
            />
            <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
            {expanded && <span className="truncate">{label}</span>}
          </button>
        );
      })}
    </nav>
  );
}

function Brand({ expanded, BrandIcon, brandLabel, tone }) {
  return (
    <div
      className={cn(
        "flex items-center",
        expanded ? "gap-2.5" : "justify-center",
      )}
    >
      <div className={cn("p-1.5 rounded-lg shrink-0", tone.chip)}>
        <BrandIcon className="w-[18px] h-[18px]" />
      </div>
      {expanded && (
        <div className="min-w-0">
          <p className="font-heading font-black text-[15px] leading-tight text-stone-900 dark:text-white truncate">
            {brandLabel}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400 dark:text-stone-400">
            SciQuest
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Full-bleed portal frame. A fixed left navigation rail replaces the old
 * top navbar + sidebar-card pair, so page content starts at the top of the
 * viewport instead of roughly 130px down.
 *
 * accent: "primary" (orange, admin) or "secondary" (teal, teacher).
 */
export function PortalShell({
  accent = "primary",
  brandLabel,
  BrandIcon,
  roleLabel,
  items,
  activeId,
  onSelect,
  userName,
  userEmail,
  onSignOut,
  children,
}) {
  const tone = ACCENT[accent] ?? ACCENT.primary;
  const { isDark, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(RAIL_STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* private mode — the rail just reopens at default width next visit */
    }
  }, [collapsed]);

  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    function handleKey(e) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [drawerOpen]);

  const initial = (userName || "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen font-body text-stone-800 dark:text-stone-100 bg-[#fdf6e3] dark:bg-stone-900">
      {/* Fixed rail — md and up */}
      <aside
        className={cn(
          "hidden md:flex fixed inset-y-0 left-0 z-40 flex-col border-r border-orange-200/70 dark:border-stone-800 bg-white dark:bg-stone-950 transition-[width] duration-300 ease-out",
          collapsed ? "w-[72px]" : "w-[232px]",
        )}
      >
        <div
          className={cn(
            "h-16 flex items-center shrink-0",
            collapsed ? "px-3" : "px-4",
          )}
        >
          <Brand
            expanded={!collapsed}
            BrandIcon={BrandIcon}
            brandLabel={brandLabel}
            tone={tone}
          />
        </div>

        <div className="flex-1 overflow-y-auto themed-scrollbar px-3">
          <NavList
            items={items}
            activeId={activeId}
            onSelect={onSelect}
            expanded={!collapsed}
            tone={tone}
          />
        </div>

        <div className="shrink-0 border-t border-orange-100 dark:border-stone-800 p-3 space-y-1">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
            className={cn(
              "flex items-center h-10 w-full rounded-xl text-sm font-bold transition-colors",
              NAV_IDLE,
              collapsed ? "justify-center" : "gap-3 px-3",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-[18px] h-[18px]" />
            ) : (
              <PanelLeftClose className="w-[18px] h-[18px]" />
            )}
            {!collapsed && <span>Collapse</span>}
          </button>

          <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className={cn(
              "flex items-center h-10 w-full rounded-xl text-sm font-bold transition-colors",
              NAV_IDLE,
              collapsed ? "justify-center" : "gap-3 px-3",
            )}
          >
            {isDark ? (
              <Sun className="w-[18px] h-[18px]" />
            ) : (
              <Moon className="w-[18px] h-[18px]" />
            )}
            {!collapsed && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Account menu"
              title={userName}
              className={cn(
                "flex items-center h-11 w-full rounded-xl hover:bg-orange-50 dark:hover:bg-stone-800 transition-colors",
                collapsed ? "justify-center" : "gap-2.5 px-2",
              )}
            >
              <span
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0",
                  tone.chip,
                )}
              >
                {initial}
              </span>
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-sm font-bold text-stone-700 dark:text-stone-200 truncate">
                      {userName}
                    </span>
                    <span className="block text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {roleLabel}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200",
                      menuOpen && "rotate-180",
                    )}
                  />
                </>
              )}
            </button>

            {menuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 rounded-2xl bg-white dark:bg-stone-800 border border-orange-100 dark:border-stone-700 shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-orange-100 dark:border-stone-700">
                  <p className="text-sm font-black text-stone-900 dark:text-white truncate">
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                      {userEmail}
                    </p>
                  )}
                  <span
                    className={cn(
                      "inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md",
                      tone.badge,
                    )}
                  >
                    {roleLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 h-14 flex items-center gap-2 px-3 border-b border-orange-200/70 dark:border-stone-800 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
          className="w-11 h-11 -ml-1 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <Brand
            expanded
            BrandIcon={BrandIcon}
            brandLabel={brandLabel}
            tone={tone}
          />
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[268px] bg-white dark:bg-stone-950 border-r border-orange-200/70 dark:border-stone-800 flex flex-col">
            <div className="h-14 flex items-center gap-2 px-3 shrink-0">
              <div className="flex-1 min-w-0">
                <Brand
                  expanded
                  BrandIcon={BrandIcon}
                  brandLabel={brandLabel}
                  tone={tone}
                />
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
                className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-500 hover:bg-orange-50 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 themed-scrollbar">
              <NavList
                items={items}
                activeId={activeId}
                onSelect={onSelect}
                expanded
                tone={tone}
                onPick={() => setDrawerOpen(false)}
              />
            </div>
            <div className="shrink-0 border-t border-orange-100 dark:border-stone-800 p-3">
              <div className="flex items-center gap-2.5 px-1 py-2">
                <span
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0",
                    tone.chip,
                  )}
                >
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-200 truncate">
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="text-[11px] text-stone-400 truncate">
                      {userEmail}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="mt-1 w-full flex items-center gap-2.5 h-11 px-3 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "transition-[padding] duration-300 ease-out",
          collapsed ? "md:pl-[72px]" : "md:pl-[232px]",
        )}
      >
        <main className="min-w-0 max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
