import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Users,
  BookOpen,
  HelpCircle,
  Settings,
  LayoutDashboard,
  GraduationCap,
  Trash2,
  X,
  Mail,
  Send,
  Sun,
  Moon,
  Shield,
  LogOut,
  ChevronDown,
  Bell,
  Building2,
  Palette,
  Link2,
  Clock,
  CheckCircle2,
  UserX,
  Award,
  Eraser,
  RotateCcw,
  FolderOpen,
  Plus,
  UserCheck,
} from "lucide-react";
import Button from "../components/Button";
import Badge from "../components/Badge";
import {
  MetricRibbon,
  PanelHeader,
  PortalPanel,
  PortalShell,
  ProportionBar,
  TabHead,
} from "../components/portal";
import { cn } from "../lib/utils";
import {
  fetchUsers,
  fetchRecentUsers,
  fetchTeachers,
  fetchStudents,
  fetchDashboardCounts,
  fetchSectionCounts,
  deleteUser,
  wipeUserData,
  inviteTeacher,
} from "../lib/users";
import {
  fetchAllSections,
  createSection,
  deleteSection,
} from "../lib/sections";
import { useAuth } from "../context/AuthContext";
import { WEEKS_DATA } from "../data/lessonsweek-01";
import { QUIZZES_DATA } from "../data/quizzesweek-01";
import { questionUnits } from "../lib/xp-config";
import { weekMaxXp } from "../lib/week-xp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function polarToCartesian(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function DonutChart({ data, size = 160, label }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const cx = size / 2;
  const cy = size / 2;
  const ro = size / 2 - 8;
  const ri = ro * 0.58;
  let angle = 0;
  const slices = data.map((d) => {
    const start = angle;
    const sweep = (d.value / total) * 360;
    // eslint-disable-next-line react-hooks/immutability
    angle += sweep;
    const s = polarToCartesian(cx, cy, ro, start);
    const e = polarToCartesian(cx, cy, ro, start + sweep);
    const si = polarToCartesian(cx, cy, ri, start);
    const ei = polarToCartesian(cx, cy, ri, start + sweep);
    const lg = sweep > 180 ? 1 : 0;
    return {
      ...d,
      path: `M ${s.x} ${s.y} A ${ro} ${ro} 0 ${lg} 1 ${e.x} ${e.y} L ${ei.x} ${ei.y} A ${ri} ${ri} 0 ${lg} 0 ${si.x} ${si.y} Z`,
    };
  });
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ display: "block" }}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            className="transition-opacity hover:opacity-80"
          />
        ))}
      </svg>
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-stone-900 dark:text-white leading-none">
            {label.value}
          </span>
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-0.5">
            {label.sub}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Modal Base ───────────────────────────────────────────────────────────────

function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-orange-100 dark:border-stone-700 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

// ─── Remove User Modal ────────────────────────────────────────────────────────

function RemoveUserModal({ user, onConfirm, onClose, isLoading, error }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-stone-900 dark:text-white">
            Remove User
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            This action cannot be undone
          </p>
        </div>
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
        Are you sure you want to remove{" "}
        <strong className="text-stone-900 dark:text-white">{user.name}</strong>{" "}
        ({user.email})? Their account, progress, and all associated records will
        be permanently deleted.
      </p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <button
          onClick={() => onConfirm(user)}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors active:scale-95"
        >
          {isLoading ? "Removing…" : "Remove User"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </Modal>
  );
}

// ─── Wipe User Data Modal ─────────────────────────────────────────────────────

function WipeDataModal({ user, onConfirm, onClose, isLoading, error }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
          <Eraser className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-stone-900 dark:text-white">
            Reset User Data
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            The account is kept — only progress is wiped
          </p>
        </div>
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
        Wipe all learning and game data for{" "}
        <strong className="text-stone-900 dark:text-white">{user.name}</strong>{" "}
        ({user.email})? Lesson progress, quiz attempts, and game records will be
        permanently deleted, but their account stays active so they can be
        re-tested from a clean slate.
      </p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <button
          onClick={() => onConfirm(user)}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors active:scale-95"
        >
          {isLoading ? "Wiping…" : "Wipe Data"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </Modal>
  );
}

// ─── Invite Teacher Modal ─────────────────────────────────────────────────────

function InviteTeacherModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await inviteTeacher(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message ?? "Failed to send invite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-stone-900 dark:text-white">
            Invite Teacher
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Send a setup link via email
          </p>
        </div>
      </div>
      {sent ? (
        <div className="flex flex-col items-center py-4 gap-3">
          <CheckCircle2 className="w-12 h-12 text-secondary-500" />
          <p className="text-base font-bold text-stone-900 dark:text-white">
            Invite sent!
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">
            {email}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 text-center mt-1">
            They will receive an email with a link to set up their teacher
            account and password.
          </p>
          <Button className="mt-3 w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
              Teacher Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.edu"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
            />
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
              The teacher will receive a link to create their account and set
              their password.
            </p>
          </div>
          {error && (
            <p className="text-sm text-red-500 font-medium mb-2">{error}</p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={handleSend}
              isLoading={loading}
              disabled={!email.trim()}
            >
              Send Invite
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────

const SECTION_COLORS = ["#f97316", "#14b8a6", "#eab308", "#8b5cf6", "#3b82f6"];
const MIX_COLORS = ["#f97316", "#14b8a6"];

function DashboardTab({
  metrics,
  counts,
  recentUsers,
  sectionData,
  teachers,
  totalLessons,
  adminName,
}) {
  const containerRef = useRef(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".anim-ribbon", {
        y: 14,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.from(".anim-panel", {
        y: 20,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.1,
      });
      gsap.from(".roster-row", {
        x: -12,
        opacity: 0,
        duration: 0.32,
        stagger: 0.045,
        ease: "power2.out",
        delay: 0.3,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const sectionSlices = (sectionData ?? []).map((d, i) => ({
    ...d,
    color: SECTION_COLORS[i % SECTION_COLORS.length],
  }));
  const totalSectionStudents = sectionSlices.reduce((s, d) => s + d.value, 0);

  const mix = [
    { label: "Students", value: counts?.students ?? 0, color: MIX_COLORS[0] },
    { label: "Teachers", value: counts?.teachers ?? 0, color: MIX_COLORS[1] },
  ];
  const mixTotal = mix.reduce((s, d) => s + d.value, 0);

  // How much of the curriculum the student body has actually worked through:
  // completions against every lesson every enrolled student could finish.
  const possible = (counts?.students ?? 0) * totalLessons;
  const done = counts?.completedLessons ?? 0;
  const reachPct = possible ? Math.round((done / possible) * 100) : 0;

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="anim-ribbon">
        <MetricRibbon
          accent="primary"
          eyebrow="Live"
          title="Control Center"
          subtitle={`${today} · signed in as ${adminName}`}
          metrics={metrics}
          action={
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              leftIcon={<Mail className="w-4 h-4" />}
              onClick={() => setInviteOpen(true)}
            >
              Invite a teacher
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Tall: the account roster runs the height of the two panels beside it */}
        <PortalPanel className="anim-panel xl:col-span-7 xl:row-span-2">
          <PanelHeader title="Newest accounts" count={recentUsers.length} />

          {recentUsers.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <UserCheck className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
              <p className="mt-2 text-sm font-bold text-stone-600 dark:text-stone-300">
                No accounts yet
              </p>
              <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                Invite a teacher or add students to see them here.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop rows */}
              <table className="hidden md:table w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-orange-100 dark:border-stone-700">
                    <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                      Person
                    </th>
                    <th className="px-3 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                      Role
                    </th>
                    <th className="px-3 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                      Status
                    </th>
                    <th className="px-5 py-2 text-right text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
                  {recentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="roster-row hover:bg-orange-50/60 dark:hover:bg-stone-700/40 transition-colors"
                    >
                      <td className="px-5 py-2.5 max-w-0 w-full">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-200 flex items-center justify-center font-black text-[11px] shrink-0">
                            {user.name.charAt(0)}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[13px] font-bold text-stone-900 dark:text-white truncate">
                              {user.name}
                            </span>
                            <span
                              className="block text-[11px] text-stone-500 dark:text-stone-400 truncate"
                              title={user.email}
                            >
                              {user.email}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge
                          variant={
                            user.role === "Teacher" ? "secondary" : "primary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-[11px] font-bold whitespace-nowrap",
                            user.status === "Active"
                              ? "text-secondary-600 dark:text-secondary-400"
                              : "text-stone-400 dark:text-stone-500",
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              user.status === "Active"
                                ? "bg-secondary-500"
                                : "bg-stone-300 dark:bg-stone-600",
                            )}
                          />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right text-[12px] tabular-nums text-stone-500 dark:text-stone-400 font-medium whitespace-nowrap">
                        {user.joined}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile rows */}
              <div className="md:hidden divide-y divide-orange-100 dark:divide-stone-700">
                {recentUsers.map((user) => (
                  <div key={user.id} className="roster-row px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-200 flex items-center justify-center font-black text-[11px] shrink-0">
                        {user.name.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-stone-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant={
                          user.role === "Teacher" ? "secondary" : "primary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <div className="mt-1.5 pl-[42px] flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-[11px] font-bold",
                          user.status === "Active"
                            ? "text-secondary-600 dark:text-secondary-400"
                            : "text-stone-400 dark:text-stone-500",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            user.status === "Active"
                              ? "bg-secondary-500"
                              : "bg-stone-300 dark:bg-stone-600",
                          )}
                        />
                        {user.status}
                      </span>
                      <span className="text-[11px] tabular-nums text-stone-500 dark:text-stone-400 font-medium">
                        {user.joined}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </PortalPanel>

        {/* Distribution — two blocks, one panel, hairline between */}
        <PortalPanel className="anim-panel xl:col-span-5">
          <PanelHeader title="Distribution" />

          <div className="px-5 py-4">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[13px] font-bold text-stone-700 dark:text-stone-300">
                Students by section
              </h3>
              <span className="text-[11px] font-black tabular-nums text-stone-400">
                {totalSectionStudents}
              </span>
            </div>
            {totalSectionStudents === 0 ? (
              <p className="text-[12px] text-stone-500 dark:text-stone-400 py-3">
                No students are assigned to a section yet.
              </p>
            ) : (
              <ProportionBar data={sectionSlices} unit="students" />
            )}
          </div>

          <div className="px-5 py-4 border-t border-orange-100 dark:border-stone-700">
            <h3 className="text-[13px] font-bold text-stone-700 dark:text-stone-300 mb-3">
              Account mix
            </h3>
            {mixTotal === 0 ? (
              <p className="text-[12px] text-stone-500 dark:text-stone-400 py-3">
                No accounts yet.
              </p>
            ) : (
              <div className="flex items-center gap-5">
                <DonutChart
                  data={mix}
                  size={104}
                  label={{ value: mixTotal.toLocaleString(), sub: "people" }}
                />
                <dl className="flex-1 min-w-0 space-y-2">
                  {mix.map((d) => (
                    <div key={d.label} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-4 rounded-full shrink-0"
                        style={{ background: d.color }}
                      />
                      <dt className="text-[12px] font-medium text-stone-600 dark:text-stone-400">
                        {d.label}
                      </dt>
                      <dd className="ml-auto text-[12px] font-black tabular-nums text-stone-900 dark:text-white">
                        {d.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </PortalPanel>

        {/* Square-ish: one big figure carrying the whole story */}
        <PortalPanel className="anim-panel xl:col-span-5">
          <PanelHeader title="Curriculum reach" />
          <div className="px-5 py-5">
            <p className="text-[44px] leading-none font-black tabular-nums text-stone-900 dark:text-white">
              {reachPct}
              <span className="text-[20px] align-top">%</span>
            </p>
            <p className="mt-1.5 text-[12px] font-medium text-stone-500 dark:text-stone-400">
              of everything the student body could have finished
            </p>
            <div
              className="mt-4 h-2 w-full rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden"
              role="img"
              aria-label={`Curriculum reach: ${reachPct} percent`}
            >
              <div
                className="h-full rounded-full bg-primary-500"
                style={{ width: `${Math.min(100, reachPct)}%` }}
              />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-orange-100 dark:border-stone-700">
              {[
                { label: "Completed", value: done.toLocaleString() },
                { label: "Possible", value: possible.toLocaleString() },
                { label: "Lessons each", value: totalLessons.toLocaleString() },
              ].map((cell) => (
                <div key={cell.label}>
                  <dt className="text-[10px] font-black uppercase tracking-[0.13em] text-stone-400 dark:text-stone-500">
                    {cell.label}
                  </dt>
                  <dd className="mt-0.5 text-[15px] font-black tabular-nums text-stone-900 dark:text-white">
                    {cell.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </PortalPanel>
      </div>

      {/* Wide and short: who holds teaching access, at a glance */}
      <PortalPanel className="anim-panel">
        <PanelHeader title="Teaching staff" count={teachers.length}>
          <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500">
            Accounts with portal access
          </span>
        </PanelHeader>
        {teachers.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <GraduationCap className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
            <p className="mt-2 text-sm font-bold text-stone-600 dark:text-stone-300">
              No teachers yet
            </p>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
              Invite one and they will appear here.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-orange-100 dark:bg-stone-700">
            {/* gap-px over a tinted track draws the hairlines, so they stay
                correct however the grid wraps */}
            {teachers.slice(0, 8).map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2.5 px-5 py-3 bg-white dark:bg-stone-800"
              >
                <span className="w-8 h-8 shrink-0 rounded-full bg-secondary-100 dark:bg-secondary-950 text-secondary-700 dark:text-secondary-200 flex items-center justify-center font-black text-[11px]">
                  {t.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-stone-900 dark:text-white truncate">
                    {t.name}
                  </span>
                  <span
                    className="block text-[11px] text-stone-500 dark:text-stone-400 truncate"
                    title={t.email}
                  >
                    joined {t.joined}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </PortalPanel>

      {inviteOpen && <InviteTeacherModal onClose={() => setInviteOpen(false)} />}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [userToRemove, setUserToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState(null);
  const [showRemoveSearch, setShowRemoveSearch] = useState(false);
  const [removeQuery, setRemoveQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchUsers()
      .then((rows) => {
        if (!cancelled) {
          setUsers(rows);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err.message ?? "Failed to load users");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const removeSearchResults = removeQuery.trim()
    ? users.filter((u) =>
        u.name.toLowerCase().includes(removeQuery.toLowerCase()),
      )
    : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", {
        y: 18,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
      gsap.from(".anim-card", {
        y: 22,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.15,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleConfirmRemove = async (user) => {
    setRemoving(true);
    setRemoveError(null);
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setUserToRemove(null);
    } catch (err) {
      setRemoveError(err.message ?? "Failed to remove user");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="anim-heading">
        <TabHead
          title="Users"
          subtitle="Manage all student and teacher accounts"
        />
      </div>

      <PortalPanel className="anim-card">
        <div className="px-5 py-3.5 border-b border-orange-100 dark:border-stone-700 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-black uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
              All Users
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-stone-400 dark:text-stone-500">
              {loading ? "Loading…" : `${users.length} accounts`}
            </p>
          </div>
          <button
            onClick={() => {
              setShowRemoveSearch((v) => !v);
              setRemoveQuery("");
            }}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors",
              showRemoveSearch
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
            )}
          >
            <UserX className="w-4 h-4" />
            Remove User
          </button>
        </div>

        {showRemoveSearch && (
          <div className="px-5 py-2.5 border-b border-orange-100 dark:border-stone-700 bg-red-50/40 dark:bg-red-900/10">
            <input
              autoFocus
              type="text"
              value={removeQuery}
              onChange={(e) => setRemoveQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            />
            {removeQuery.trim() && (
              <div className="mt-3 space-y-1.5">
                {removeSearchResults.length === 0 ? (
                  <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-2">
                    No users found
                  </p>
                ) : (
                  removeSearchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-orange-100 dark:border-stone-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUserToRemove(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-700/50 border-b border-orange-100 dark:border-stone-700">
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Name
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Role
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Section
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Status
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Joined
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-stone-500 dark:text-stone-400"
                  >
                    Loading users…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-red-600 dark:text-red-400"
                  >
                    {loadError}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-stone-500 dark:text-stone-400"
                  >
                    No users yet
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white dark:bg-stone-800 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                  >
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge
                        variant={
                          user.role === "Teacher" ? "secondary" : "primary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-2.5 text-sm text-stone-600 dark:text-stone-400 font-medium">
                      {user.section}
                    </td>
                    <td className="px-5 py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-bold",
                          user.status === "Active"
                            ? "text-secondary-600 dark:text-secondary-400"
                            : "text-stone-400 dark:text-stone-500",
                        )}
                      >
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            user.status === "Active"
                              ? "bg-secondary-500"
                              : "bg-stone-300 dark:bg-stone-600",
                          )}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-sm text-stone-600 dark:text-stone-400 font-medium">
                      {user.joined}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <button
                        onClick={() => setUserToRemove(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-orange-100 dark:divide-stone-700">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              Loading users…
            </p>
          ) : loadError ? (
            <p className="px-5 py-10 text-center text-sm text-red-600 dark:text-red-400">
              {loadError}
            </p>
          ) : users.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              No users yet
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <Badge
                        variant={
                          user.role === "Teacher" ? "secondary" : "primary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {user.section !== "—" && (
                        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                          {user.section}
                        </span>
                      )}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-bold",
                          user.status === "Active"
                            ? "text-secondary-600 dark:text-secondary-400"
                            : "text-stone-400 dark:text-stone-500",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            user.status === "Active"
                              ? "bg-secondary-500"
                              : "bg-stone-300 dark:bg-stone-600",
                          )}
                        />
                        {user.status}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">
                        {user.joined}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setUserToRemove(user)}
                  className="shrink-0 p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label={`Remove ${user.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </PortalPanel>

      {userToRemove && (
        <RemoveUserModal
          user={userToRemove}
          onConfirm={handleConfirmRemove}
          onClose={() => {
            if (!removing) {
              setUserToRemove(null);
              setRemoveError(null);
            }
          }}
          isLoading={removing}
          error={removeError}
        />
      )}
    </div>
  );
}

// ─── Reset Data Tab ────────────────────────────────────────────────────────────

function ResetDataTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [query, setQuery] = useState("");
  const [userToWipe, setUserToWipe] = useState(null);
  const [wiping, setWiping] = useState(false);
  const [wipeError, setWipeError] = useState(null);
  const [wipedName, setWipedName] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchUsers()
      .then((rows) => {
        if (!cancelled) {
          setUsers(rows);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err.message ?? "Failed to load users");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", {
        y: 18,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
      gsap.from(".anim-card", {
        y: 22,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.15,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const results = query.trim()
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()),
      )
    : users;

  const handleConfirmWipe = async (user) => {
    setWiping(true);
    setWipeError(null);
    try {
      await wipeUserData(user.id);
      setUserToWipe(null);
      setWipedName(user.name);
    } catch (err) {
      setWipeError(err.message ?? "Failed to wipe user data");
    } finally {
      setWiping(false);
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="anim-heading">
        <TabHead
          title="Reset Data"
          subtitle="Wipe a user's progress for testing — their account stays intact"
        />
      </div>

      {wipedName && (
        <div
          role="status"
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 text-sm font-bold text-secondary-700 dark:text-secondary-300"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Data for {wipedName} was wiped. Their account is still active.
        </div>
      )}

      <PortalPanel className="anim-card">
        <div className="px-5 py-3.5 border-b border-orange-100 dark:border-stone-700">
          <h2 className="text-[13px] font-black uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
              Select a User
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-stone-400 dark:text-stone-500">
              {loading ? "Loading…" : `${users.length} accounts`}
            </p>
        </div>

        <div className="px-5 py-2.5 border-b border-orange-100 dark:border-stone-700 bg-amber-50/40 dark:bg-amber-900/10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-700/50 border-b border-orange-100 dark:border-stone-700">
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Name
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Role
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Section
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-stone-500 dark:text-stone-400"
                  >
                    Loading users…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-red-600 dark:text-red-400"
                  >
                    {loadError}
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-stone-500 dark:text-stone-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                results.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white dark:bg-stone-800 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                  >
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge
                        variant={
                          user.role === "Teacher" ? "secondary" : "primary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-2.5 text-sm text-stone-600 dark:text-stone-400 font-medium">
                      {user.section}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <button
                        onClick={() => {
                          setUserToWipe(user);
                          setWipedName(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Data
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-orange-100 dark:divide-stone-700">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              Loading users…
            </p>
          ) : loadError ? (
            <p className="px-5 py-10 text-center text-sm text-red-600 dark:text-red-400">
              {loadError}
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              No users found
            </p>
          ) : (
            results.map((user) => (
              <div
                key={user.id}
                className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <Badge
                        variant={
                          user.role === "Teacher" ? "secondary" : "primary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                      {user.email}
                    </p>
                    {user.section !== "—" && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                        {user.section}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUserToWipe(user);
                    setWipedName(null);
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            ))
          )}
        </div>
      </PortalPanel>

      {userToWipe && (
        <WipeDataModal
          user={userToWipe}
          onConfirm={handleConfirmWipe}
          onClose={() => {
            if (!wiping) {
              setUserToWipe(null);
              setWipeError(null);
            }
          }}
          isLoading={wiping}
          error={wipeError}
        />
      )}
    </div>
  );
}

// ─── Teachers Tab ──────────────────────────────────────────────────────────────

function TeachersTab() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [teacherToRemove, setTeacherToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState(null);
  const [showRemoveSearch, setShowRemoveSearch] = useState(false);
  const [removeQuery, setRemoveQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchTeachers()
      .then((rows) => {
        if (!cancelled) {
          setTeachers(rows);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err.message ?? "Failed to load teachers");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const removeSearchResults = removeQuery.trim()
    ? teachers.filter((t) =>
        t.name.toLowerCase().includes(removeQuery.toLowerCase()),
      )
    : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", {
        y: 18,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
      gsap.from(".anim-invite-btn", {
        x: 20,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
        delay: 0.05,
      });
      gsap.from(".anim-card", {
        y: 22,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.15,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleConfirmRemove = async (teacher) => {
    setRemoving(true);
    setRemoveError(null);
    try {
      await deleteUser(teacher.id);
      setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
      setTeacherToRemove(null);
    } catch (err) {
      setRemoveError(err.message ?? "Failed to remove teacher");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="anim-heading">
        <TabHead
          title="Teachers"
          subtitle="Manage teacher accounts and send invites"
        >
          <Button
            size="sm"
            className="anim-invite-btn"
            leftIcon={<Mail className="w-4 h-4" />}
            onClick={() => setShowInvite(true)}
          >
            Invite Teacher
          </Button>
        </TabHead>
      </div>

      <PortalPanel className="anim-card">
        <div className="px-5 py-3.5 border-b border-orange-100 dark:border-stone-700 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-black uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
              All Teachers
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-stone-400 dark:text-stone-500">
              {loading ? "Loading…" : `${teachers.length} teachers`}
            </p>
          </div>
          <button
            onClick={() => {
              setShowRemoveSearch((v) => !v);
              setRemoveQuery("");
            }}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors",
              showRemoveSearch
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
            )}
          >
            <UserX className="w-4 h-4" />
            Remove Teacher
          </button>
        </div>

        {showRemoveSearch && (
          <div className="px-5 py-2.5 border-b border-orange-100 dark:border-stone-700 bg-red-50/40 dark:bg-red-900/10">
            <input
              autoFocus
              type="text"
              value={removeQuery}
              onChange={(e) => setRemoveQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            />
            {removeQuery.trim() && (
              <div className="mt-3 space-y-1.5">
                {removeSearchResults.length === 0 ? (
                  <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-2">
                    No teachers found
                  </p>
                ) : (
                  removeSearchResults.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-orange-100 dark:border-stone-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setTeacherToRemove(teacher)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-700/50 border-b border-orange-100 dark:border-stone-700">
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Teacher
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Classes
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Students
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Status
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Joined
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-stone-500 dark:text-stone-400"
                  >
                    Loading teachers…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-red-600 dark:text-red-400"
                  >
                    {loadError}
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-stone-500 dark:text-stone-400"
                  >
                    No teachers yet
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="bg-white dark:bg-stone-800 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                  >
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-sm font-bold text-stone-800 dark:text-stone-200">
                      {teacher.classes}
                    </td>
                    <td className="px-5 py-2.5 text-sm font-bold text-stone-800 dark:text-stone-200">
                      {teacher.students}
                    </td>
                    <td className="px-5 py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-bold",
                          teacher.status === "Active"
                            ? "text-secondary-600 dark:text-secondary-400"
                            : "text-stone-400 dark:text-stone-500",
                        )}
                      >
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            teacher.status === "Active"
                              ? "bg-secondary-500"
                              : "bg-stone-300 dark:bg-stone-600",
                          )}
                        />
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-sm text-stone-600 dark:text-stone-400 font-medium">
                      {teacher.joined}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <button
                        onClick={() => setTeacherToRemove(teacher)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-orange-100 dark:divide-stone-700">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              Loading teachers…
            </p>
          ) : loadError ? (
            <p className="px-5 py-10 text-center text-sm text-red-600 dark:text-red-400">
              {loadError}
            </p>
          ) : teachers.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              No teachers yet
            </p>
          ) : (
            teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {teacher.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {teacher.email}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                        {teacher.classes} classes · {teacher.students} students
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-bold",
                          teacher.status === "Active"
                            ? "text-secondary-600 dark:text-secondary-400"
                            : "text-stone-400 dark:text-stone-500",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            teacher.status === "Active"
                              ? "bg-secondary-500"
                              : "bg-stone-300 dark:bg-stone-600",
                          )}
                        />
                        {teacher.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setTeacherToRemove(teacher)}
                  className="shrink-0 p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label={`Remove ${teacher.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </PortalPanel>

      {showInvite && (
        <InviteTeacherModal onClose={() => setShowInvite(false)} />
      )}

      {teacherToRemove && (
        <RemoveUserModal
          user={teacherToRemove}
          onConfirm={handleConfirmRemove}
          onClose={() => {
            if (!removing) {
              setTeacherToRemove(null);
              setRemoveError(null);
            }
          }}
          isLoading={removing}
          error={removeError}
        />
      )}
    </div>
  );
}

// ─── Students Tab ─────────────────────────────────────────────────────────────

function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filterSection, setFilterSection] = useState("all");
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState(null);
  const [showRemoveSearch, setShowRemoveSearch] = useState(false);
  const [removeQuery, setRemoveQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchStudents(), fetchAllSections()])
      .then(([rows, sectionRows]) => {
        if (!cancelled) {
          setStudents(rows);
          setSections(sectionRows);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err.message ?? "Failed to load students");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const removeSearchResults = removeQuery.trim()
    ? students.filter((u) =>
        u.name.toLowerCase().includes(removeQuery.toLowerCase()),
      )
    : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", {
        y: 18,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
      gsap.from(".anim-card", {
        y: 22,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.15,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const filtered =
    filterSection === "all"
      ? students
      : students.filter((u) => u.section === filterSection);

  const handleConfirmRemove = async (student) => {
    setRemoving(true);
    setRemoveError(null);
    try {
      await deleteUser(student.id);
      setStudents((prev) => prev.filter((u) => u.id !== student.id));
      setStudentToRemove(null);
    } catch (err) {
      setRemoveError(err.message ?? "Failed to remove student");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="anim-heading">
        <TabHead
          title="Students"
          subtitle="Manage enrolled student accounts"
        />
      </div>

      <PortalPanel className="anim-card">
        <div className="px-5 py-3.5 border-b border-orange-100 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h2 className="text-[13px] font-black uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
              All Students
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-stone-400 dark:text-stone-500">
              {loading
                ? "Loading…"
                : `${filtered.length} student${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="all">All Sections</option>
              {sections.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setShowRemoveSearch((v) => !v);
                setRemoveQuery("");
              }}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors",
                showRemoveSearch
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
              )}
            >
              <UserX className="w-4 h-4" />
              Remove Student
            </button>
          </div>
        </div>

        {showRemoveSearch && (
          <div className="px-5 py-2.5 border-b border-orange-100 dark:border-stone-700 bg-red-50/40 dark:bg-red-900/10">
            <input
              autoFocus
              type="text"
              value={removeQuery}
              onChange={(e) => setRemoveQuery(e.target.value)}
              placeholder="Search student by name..."
              className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            />
            {removeQuery.trim() && (
              <div className="mt-3 space-y-1.5">
                {removeSearchResults.length === 0 ? (
                  <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-2">
                    No students found
                  </p>
                ) : (
                  removeSearchResults.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-orange-100 dark:border-stone-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">
                            {student.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setStudentToRemove(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-700/50 border-b border-orange-100 dark:border-stone-700">
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Name
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Section
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Status
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Joined
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-stone-500 dark:text-stone-400"
                  >
                    Loading students…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-red-600 dark:text-red-400"
                  >
                    {loadError}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-stone-500 dark:text-stone-400"
                  >
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="bg-white dark:bg-stone-800 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                  >
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">
                            {student.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-sm text-stone-600 dark:text-stone-400 font-medium">
                      {student.section}
                    </td>
                    <td className="px-5 py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-bold",
                          student.status === "Active"
                            ? "text-secondary-600 dark:text-secondary-400"
                            : "text-stone-400 dark:text-stone-500",
                        )}
                      >
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            student.status === "Active"
                              ? "bg-secondary-500"
                              : "bg-stone-300 dark:bg-stone-600",
                          )}
                        />
                        {student.status}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-sm text-stone-600 dark:text-stone-400 font-medium">
                      {student.joined}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <button
                        onClick={() => setStudentToRemove(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-orange-100 dark:divide-stone-700">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              Loading students…
            </p>
          ) : loadError ? (
            <p className="px-5 py-10 text-center text-sm text-red-600 dark:text-red-400">
              {loadError}
            </p>
          ) : filtered.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              No students found
            </p>
          ) : (
            filtered.map((student) => (
              <div
                key={student.id}
                className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                      {student.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {student.email}
                      </span>
                      {student.section !== "—" && (
                        <Badge variant="outline" className="text-xs py-0">
                          {student.section}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStudentToRemove(student)}
                  className="shrink-0 p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label={`Remove ${student.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </PortalPanel>

      {studentToRemove && (
        <RemoveUserModal
          user={studentToRemove}
          onConfirm={handleConfirmRemove}
          onClose={() => {
            if (!removing) {
              setStudentToRemove(null);
              setRemoveError(null);
            }
          }}
          isLoading={removing}
          error={removeError}
        />
      )}
    </div>
  );
}

// ─── Lessons Tab ──────────────────────────────────────────────────────────────

function LessonsTab() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", {
        y: 18,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
      gsap.from(".week-card", {
        y: 32,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.15,
        clearProps: "all",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="anim-heading">
        <TabHead
          title="Lessons"
          subtitle="Browse lesson content by week"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {WEEKS_DATA.map((week) => (
          <PortalPanel className="week-card p-5" key={week.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Week {week.weekNumber}
                  </p>
                  <h3 className="text-base font-black text-stone-900 dark:text-white">
                    {week.title}
                  </h3>
                </div>
              </div>
              <Badge variant="primary">{week.category}</Badge>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 mb-4 line-clamp-2">
              {week.description}
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {week.lessons.length} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                {weekMaxXp(week)} XP
              </span>
              {week.isLocked && (
                <span className="text-rose-500 dark:text-rose-400">Locked</span>
              )}
            </div>
          </PortalPanel>
        ))}
      </div>
    </div>
  );
}

// ─── Quizzes Tab ──────────────────────────────────────────────────────────────

function QuizzesTab() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", {
        y: 18,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
      gsap.from(".week-card", {
        y: 32,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.15,
        clearProps: "all",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="anim-heading">
        <TabHead
          title="Quizzes"
          subtitle="Browse quiz content by week"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {WEEKS_DATA.map((week) => {
          const weekQuizzes = week.lessons
            .map((l) => QUIZZES_DATA[l.id])
            .filter(Boolean);
          const totalQuestions = weekQuizzes.reduce(
            (s, q) => s + q.questions.length,
            0,
          );
          const totalPoints = weekQuizzes.reduce(
            (s, q) =>
              s + q.questions.reduce((ps, qu) => ps + questionUnits(qu), 0),
            0,
          );
          const totalMinutes = Math.round(
            weekQuizzes.reduce((s, q) => s + (q.timeLimit ?? 0), 0) / 60,
          );

          return (
            <PortalPanel className="week-card p-5" key={week.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      Week {week.weekNumber}
                    </p>
                    <h3 className="text-base font-black text-stone-900 dark:text-white">
                      {week.title}
                    </h3>
                  </div>
                </div>
                <Badge variant="secondary">{weekQuizzes.length} quizzes</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  {totalQuestions} questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  {totalPoints} pts
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {totalMinutes} min
                </span>
              </div>
            </PortalPanel>
          );
        })}
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function Toggle({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      aria-pressed={on}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
        on ? "bg-primary-600" : "bg-stone-300 dark:bg-stone-600",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          on ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

function SettingsInput({ placeholder, defaultValue }) {
  return (
    <input
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary-400"
    />
  );
}

function SettingRow({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-3.5 border-b border-orange-100 dark:border-stone-700 last:border-0 last:pb-0">
      <div className="flex-1">
        <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
          {label}
        </p>
        {hint && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {hint}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsSection({ icon, title, description, children }) {
  return (
    <PortalPanel className="settings-section p-5">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-black text-stone-900 dark:text-white">{title}</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {description}
          </p>
        </div>
      </div>
      <div className="pl-14">{children}</div>
    </PortalPanel>
  );
}

function SettingsTab() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", {
        y: 18,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
      ScrollTrigger.batch(".settings-section", {
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 28,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all",
          }),
        start: "top 90%",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="anim-heading">
        <TabHead
          title="Settings"
          subtitle="Configure your SciQuest platform"
        />
      </div>

      <SettingsSection
        icon={<Building2 className="w-5 h-5" />}
        title="School Profile"
        description="Basic information about your institution"
      >
        <SettingRow
          label="School Name"
          hint="Displayed in the app and outgoing emails"
        >
          <SettingsInput defaultValue="SciQuest Academy" />
        </SettingRow>
        <SettingRow
          label="School Email"
          hint="Used for system notifications and replies"
        >
          <SettingsInput placeholder="admin@school.edu" />
        </SettingRow>
        <SettingRow
          label="School Address"
          hint="For reports and official documents"
        >
          <SettingsInput placeholder="123 Education Lane" />
        </SettingRow>
      </SettingsSection>

      <SettingsSection
        icon={<Palette className="w-5 h-5" />}
        title="Branding"
        description="Customize the look and feel of the platform"
      >
        <SettingRow label="App Name" hint="Shown in the browser tab and emails">
          <SettingsInput defaultValue="SciQuest" />
        </SettingRow>
        <SettingRow
          label="Dark Mode Default"
          hint="Default theme applied to new user accounts"
        >
          <Toggle defaultChecked={false} />
        </SettingRow>
        <SettingRow
          label="Show School Logo"
          hint="Display school logo on public-facing pages"
        >
          <Toggle defaultChecked={true} />
        </SettingRow>
      </SettingsSection>

      <SettingsSection
        icon={<Bell className="w-5 h-5" />}
        title="Notifications"
        description="Control automated email and in-app alerts"
      >
        <SettingRow
          label="New Student Signup"
          hint="Notify admin when a new student registers"
        >
          <Toggle defaultChecked={true} />
        </SettingRow>
        <SettingRow
          label="Teacher Invite Accepted"
          hint="Alert when a teacher completes their account setup"
        >
          <Toggle defaultChecked={true} />
        </SettingRow>
        <SettingRow
          label="Weekly Quiz Summary"
          hint="Digest of quiz attempts and scores every Monday"
        >
          <Toggle defaultChecked={false} />
        </SettingRow>
        <SettingRow
          label="Inactivity Alert"
          hint="Flag students inactive for 7 or more days"
        >
          <Toggle defaultChecked={true} />
        </SettingRow>
      </SettingsSection>

      <SettingsSection
        icon={<Link2 className="w-5 h-5" />}
        title="Integrations"
        description="Connect external tools and platforms"
      >
        <SettingRow
          label="Google Classroom"
          hint="Sync class rosters automatically"
        >
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-700 px-3 py-1.5 rounded-lg">
            Coming Soon
          </span>
        </SettingRow>
        <SettingRow
          label="Microsoft Teams"
          hint="Send lesson notifications via Teams channels"
        >
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-700 px-3 py-1.5 rounded-lg">
            Coming Soon
          </span>
        </SettingRow>
        <SettingRow
          label="LMS Export"
          hint="Export grades to an external Learning Management System"
        >
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-700 px-3 py-1.5 rounded-lg">
            Coming Soon
          </span>
        </SettingRow>
      </SettingsSection>
    </div>
  );
}

// ─── Sections Tab ─────────────────────────────────────────────────────────────

function shortDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CreateSectionModal({ onCreated, onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    try {
      const section = await createSection(trimmed, "admin");
      onCreated(section);
      onClose();
    } catch (err) {
      setError(err.message ?? "Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
          <FolderOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-stone-900 dark:text-white">
            Create Section
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Add a new platform-wide section
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
          Section Name
        </label>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && handleCreate()}
          placeholder="e.g. STEM-A, BIO-1, CHEM-2"
          className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium mb-4">{error}</p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          className="flex-1"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleCreate}
          isLoading={loading}
          disabled={!name.trim()}
        >
          Create
        </Button>
      </div>
    </Modal>
  );
}

function DeleteSectionModal({ section, onConfirm, onClose, isLoading, error }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-stone-900 dark:text-white">
            Delete Section
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            This removes the section platform-wide
          </p>
        </div>
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
        Permanently delete{" "}
        <strong className="text-stone-900 dark:text-white">{section.name}</strong>?
        Students currently assigned to this section will not be affected, but it
        will no longer appear in section lists or the signup dropdown.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <button
          onClick={() => onConfirm(section)}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors active:scale-95"
        >
          {isLoading ? "Deleting…" : "Delete Section"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </Modal>
  );
}

function SectionsTab() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const containerRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetchAllSections()
      .then((rows) => {
        setSections(rows);
        setLoading(false);
      })
      .catch((err) => {
        setLoadError(err.message ?? "Failed to load sections");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", {
        y: 18,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
      gsap.from(".anim-card", {
        y: 22,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.15,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleConfirmDelete = async (section) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteSection(section.id);
      setSections((prev) => prev.filter((s) => s.id !== section.id));
      setSectionToDelete(null);
    } catch (err) {
      setDeleteError(err.message ?? "Failed to delete section");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="anim-heading">
        <TabHead
          title="Sections"
          subtitle="Manage platform-wide science sections"
        >
          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreate(true)}
          >
            Create Section
          </Button>
        </TabHead>
      </div>

      <PortalPanel className="anim-card">
        <div className="px-5 py-3.5 border-b border-orange-100 dark:border-stone-700">
          <h2 className="text-[13px] font-black uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
              All Sections
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-stone-400 dark:text-stone-500">
              {loading ? "Loading…" : `${sections.length} section${sections.length !== 1 ? "s" : ""}`}
            </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-700/50 border-b border-orange-100 dark:border-stone-700">
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Name
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Created By
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Students
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em]">
                  Created
                </th>
                <th className="px-5 py-2 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.13em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
                    Loading sections…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-red-600 dark:text-red-400">
                    {loadError}
                  </td>
                </tr>
              ) : sections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <FolderOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      No sections yet. Create one to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                sections.map((section) => (
                  <tr
                    key={section.id}
                    className="bg-white dark:bg-stone-800 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                  >
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                          <FolderOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {section.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge
                        variant={section.createdByRole === "admin" ? "primary" : "secondary"}
                      >
                        {section.createdByRole === "admin" ? "Admin" : "Teacher"}
                      </Badge>
                    </td>
                    <td className="px-5 py-2.5 text-sm font-bold text-stone-800 dark:text-stone-200">
                      {section.students}
                    </td>
                    <td className="px-5 py-2.5 text-sm text-stone-600 dark:text-stone-400 font-medium">
                      {shortDate(section.createdAt)}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <button
                        onClick={() => {
                          setSectionToDelete(section);
                          setDeleteError(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PortalPanel>

      {showCreate && (
        <CreateSectionModal
          onCreated={(section) => setSections((prev) => [...prev, section].sort((a, b) => a.name.localeCompare(b.name)))}
          onClose={() => setShowCreate(false)}
        />
      )}

      {sectionToDelete && (
        <DeleteSectionModal
          section={sectionToDelete}
          onConfirm={handleConfirmDelete}
          onClose={() => {
            if (!deleting) {
              setSectionToDelete(null);
              setDeleteError(null);
            }
          }}
          isLoading={deleting}
          error={deleteError}
        />
      )}
    </div>
  );
}

// ─── Sidebar slot map ─────────────────────────────────────────────────────────

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "users", label: "Users", Icon: Users },
  { id: "teachers", label: "Teachers", Icon: GraduationCap },
  { id: "students", label: "Students", Icon: UserCheck },
  { id: "sections", label: "Sections", Icon: FolderOpen },
  { id: "lessons", label: "Lessons", Icon: BookOpen },
  { id: "quizzes", label: "Quizzes", Icon: HelpCircle },
  { id: "reset-data", label: "Reset Data", Icon: Eraser },
  { id: "settings", label: "Settings", Icon: Settings },
];

// ─── Admin content slot map ───────────────────────────────────────────────────

const ADMIN_TAB_MAP = {
  dashboard: DashboardTab,
  users: UsersTab,
  "reset-data": ResetDataTab,
  teachers: TeachersTab,
  students: StudentsTab,
  sections: SectionsTab,
  lessons: LessonsTab,
  quizzes: QuizzesTab,
  settings: SettingsTab,
};

// ─── Main ────────────────────────────────────────────────────────────────────

export function AdminDashboardPage({ onNavigate }) {
  const { signOut, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [recentUsers, setRecentUsers] = useState([]);
  const [counts, setCounts] = useState(null);
  const [sectionData, setSectionData] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchRecentUsers(5),
      fetchDashboardCounts(),
      fetchSectionCounts(),
      fetchTeachers(),
    ])
      .then(([rows, dashboardCounts, sections, staff]) => {
        if (cancelled) return;
        setRecentUsers(rows);
        setCounts(dashboardCounts);
        setSectionData(sections);
        setTeachers(staff);
      })
      .catch(() => {
        /* dashboard falls back to placeholders on failure */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalLessons = WEEKS_DATA.reduce(
    (sum, week) => sum + week.lessons.length,
    0,
  );
  const showCount = (n) => (n == null ? "…" : n.toLocaleString());

  const metrics = [
    {
      label: "Students",
      value: showCount(counts?.students),
      hint: "enrolled learners",
      tone: "orange",
    },
    {
      label: "Teachers",
      value: showCount(counts?.teachers),
      hint: "staff accounts",
      tone: "teal",
    },
    {
      label: "Lessons",
      value: totalLessons.toLocaleString(),
      hint: `across ${WEEKS_DATA.length} weeks`,
      tone: "yellow",
    },
    {
      label: "Completions",
      value: showCount(counts?.completedLessons),
      hint: "lessons finished",
      tone: "blue",
    },
  ];

  const TabContent = ADMIN_TAB_MAP[activeTab] ?? DashboardTab;
  const adminName = profile
    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Admin"
    : "Admin";

  return (
    <PortalShell
      accent="primary"
      brandLabel="Admin Portal"
      BrandIcon={Shield}
      roleLabel="Admin"
      items={SIDEBAR_ITEMS}
      activeId={activeTab}
      onSelect={setActiveTab}
      userName={adminName}
      userEmail={profile?.email}
      onSignOut={() => {
        signOut();
        onNavigate("home");
      }}
    >
      <TabContent
        metrics={metrics}
        counts={counts}
        recentUsers={recentUsers}
        sectionData={sectionData}
        teachers={teachers}
        totalLessons={totalLessons}
        adminName={adminName}
      />
    </PortalShell>
  );
}
