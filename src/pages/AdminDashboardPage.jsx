import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { WEEKS_DATA } from "../data/lessonsweek-01";
import { QUIZZES_DATA } from "../data/quizzesweek-01";
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
          <path key={i} d={s.path} fill={s.color} className="transition-opacity hover:opacity-80" />
        ))}
      </svg>
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-stone-900 dark:text-white leading-none">{label.value}</span>
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-0.5">{label.sub}</span>
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

function RemoveUserModal({ user, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-stone-900 dark:text-white">Remove User</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">This action cannot be undone</p>
        </div>
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-300 mb-6">
        Are you sure you want to remove{" "}
        <strong className="text-stone-900 dark:text-white">{user.name}</strong>{" "}
        ({user.email})? Their account, progress, and all associated records will be permanently deleted.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <button
          onClick={() => onConfirm(user)}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors active:scale-95"
        >
          Remove User
        </button>
      </div>
    </Modal>
  );
}

// ─── Invite Teacher Modal ─────────────────────────────────────────────────────

function InviteTeacherModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;
    setLoading(true);
    // TODO: call Supabase Edge Function to send teacher invite email
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-stone-900 dark:text-white">Invite Teacher</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">Send a setup link via email</p>
        </div>
      </div>
      {sent ? (
        <div className="flex flex-col items-center py-4 gap-3">
          <CheckCircle2 className="w-12 h-12 text-secondary-500" />
          <p className="text-base font-bold text-stone-900 dark:text-white">Invite sent!</p>
          <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">{email}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 text-center mt-1">
            They will receive an email with a link to set up their teacher account and password.
          </p>
          <Button className="mt-3 w-full" onClick={onClose}>Done</Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
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
              The teacher will receive a link to create their account and set their password.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
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
const ACTIVITY_COLORS = ["#22c55e", "#a8a29e"];

function DashboardTab({ stats, recentUsers }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", { y: 18, opacity: 0, duration: 0.45, ease: "power2.out" });
      gsap.from(".stat-card", { y: 28, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.1 });
      gsap.from(".users-table", { y: 22, opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.22 });
      gsap.from(".users-table tbody tr", { x: -16, opacity: 0, duration: 0.38, stagger: 0.05, ease: "power2.out", delay: 0.38 });
      gsap.from(".analytics-card", { x: 24, opacity: 0, duration: 0.55, stagger: 0.12, ease: "power2.out", delay: 0.18 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const sectionData = [
    { label: "STEM-A", value: 318, color: SECTION_COLORS[0] },
    { label: "STEM-B", value: 287, color: SECTION_COLORS[1] },
    { label: "STEM-C", value: 256, color: SECTION_COLORS[2] },
    { label: "STEM-D", value: 231, color: SECTION_COLORS[3] },
    { label: "Others",  value: 156, color: SECTION_COLORS[4] },
  ];
  const activityData = [
    { label: "Active",   value: 987, color: ACTIVITY_COLORS[0] },
    { label: "Inactive", value: 261, color: ACTIVITY_COLORS[1] },
  ];

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="anim-heading">
        <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-stone-500 dark:text-stone-400 font-medium">Overview and system management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="stat-card p-6">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bgLight, stat.bgDark)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-500 dark:text-stone-400">{stat.label}</p>
                <p className="text-2xl font-black text-stone-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users Table */}
        <Card className="users-table lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-orange-100 dark:border-stone-700">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-700/50 border-b border-orange-100 dark:border-stone-700">
                  <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="bg-white dark:bg-stone-800 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === "Teacher" ? "secondary" : "primary"}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold", user.status === "Active" ? "text-secondary-600 dark:text-secondary-400" : "text-stone-400 dark:text-stone-500")}>
                        <span className={cn("w-2 h-2 rounded-full", user.status === "Active" ? "bg-secondary-500" : "bg-stone-300 dark:bg-stone-600")} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400 font-medium">{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Analytics Charts */}
        <div className="space-y-4">
          <Card className="analytics-card p-5">
            <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-4">Student Sections</h3>
            <div className="flex justify-center mb-4">
              <DonutChart data={sectionData} size={160} label={{ value: "1,248", sub: "students" }} />
            </div>
            <div className="space-y-2">
              {sectionData.map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">{d.label}</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900 dark:text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="analytics-card p-5">
            <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-4">Weekly Activity</h3>
            <div className="flex justify-center mb-4">
              <DonutChart data={activityData} size={140} label={{ value: "79%", sub: "active" }} />
            </div>
            <div className="space-y-2">
              {activityData.map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">{d.label} this week</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900 dark:text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ─────────────────────────────────────────────────────────────────

const INITIAL_USERS = [
  { id: 1, name: "Alex Johnson",      role: "Student", email: "alex.j@school.edu",       status: "Active",   joined: "2 days ago",  section: "STEM-A" },
  { id: 2, name: "Sarah Smith",       role: "Teacher", email: "s.smith@school.edu",       status: "Active",   joined: "5 days ago",  section: "—" },
  { id: 3, name: "Michael Brown",     role: "Student", email: "m.brown@school.edu",       status: "Inactive", joined: "1 week ago",  section: "STEM-B" },
  { id: 4, name: "Emily Davis",       role: "Student", email: "e.davis@school.edu",       status: "Active",   joined: "1 week ago",  section: "STEM-A" },
  { id: 5, name: "Dr. Robert Wilson", role: "Teacher", email: "r.wilson@school.edu",      status: "Active",   joined: "2 weeks ago", section: "—" },
  { id: 6, name: "James Martinez",    role: "Student", email: "j.mart@school.edu",        status: "Active",   joined: "2 weeks ago", section: "STEM-C" },
  { id: 7, name: "Lisa Chen",         role: "Student", email: "l.chen@school.edu",        status: "Inactive", joined: "3 weeks ago", section: "STEM-D" },
  { id: 8, name: "David Kim",         role: "Student", email: "d.kim@school.edu",         status: "Active",   joined: "1 month ago", section: "STEM-B" },
];

function UsersTab() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [userToRemove, setUserToRemove] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", { y: 18, opacity: 0, duration: 0.45, ease: "power2.out" });
      gsap.from(".anim-card", { y: 22, opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.15 });
      gsap.from(".anim-card tbody tr", { x: -15, opacity: 0, duration: 0.35, stagger: 0.04, ease: "power2.out", delay: 0.3 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleConfirmRemove = (user) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setUserToRemove(null);
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="anim-heading">
        <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-1">Users</h1>
        <p className="text-stone-500 dark:text-stone-400 font-medium">Manage all student and teacher accounts</p>
      </div>

      <Card className="anim-card overflow-hidden">
        <div className="p-6 border-b border-orange-100 dark:border-stone-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">All Users</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">{users.length} accounts</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-700/50 border-b border-orange-100 dark:border-stone-700">
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
              {users.map((user) => (
                <tr key={user.id} className="bg-white dark:bg-stone-800 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === "Teacher" ? "secondary" : "primary"}>{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400 font-medium">{user.section}</td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold", user.status === "Active" ? "text-secondary-600 dark:text-secondary-400" : "text-stone-400 dark:text-stone-500")}>
                      <span className={cn("w-2 h-2 rounded-full", user.status === "Active" ? "bg-secondary-500" : "bg-stone-300 dark:bg-stone-600")} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400 font-medium">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setUserToRemove(user)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {userToRemove && (
        <RemoveUserModal
          user={userToRemove}
          onConfirm={handleConfirmRemove}
          onClose={() => setUserToRemove(null)}
        />
      )}
    </div>
  );
}

// ─── Teachers Tab ──────────────────────────────────────────────────────────────

const TEACHERS_LIST = [
  { id: 1, name: "Sarah Smith",       email: "s.smith@school.edu",  classes: 3, students: 87,  status: "Active",   joined: "5 days ago" },
  { id: 2, name: "Dr. Robert Wilson", email: "r.wilson@school.edu", classes: 4, students: 112, status: "Active",   joined: "2 weeks ago" },
  { id: 3, name: "Maria Garcia",      email: "m.garcia@school.edu", classes: 2, students: 65,  status: "Active",   joined: "1 month ago" },
  { id: 4, name: "James Patterson",   email: "j.patt@school.edu",   classes: 1, students: 34,  status: "Inactive", joined: "2 months ago" },
];

function TeachersTab() {
  const [showInvite, setShowInvite] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", { y: 18, opacity: 0, duration: 0.45, ease: "power2.out" });
      gsap.from(".anim-invite-btn", { x: 20, opacity: 0, duration: 0.45, ease: "power2.out", delay: 0.05 });
      gsap.from(".anim-card", { y: 22, opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.15 });
      gsap.from(".anim-card tbody tr", { x: -15, opacity: 0, duration: 0.35, stagger: 0.05, ease: "power2.out", delay: 0.3 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex items-center justify-between">
        <div className="anim-heading">
          <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-1">Teachers</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium">Manage teacher accounts and send invites</p>
        </div>
        <div className="anim-invite-btn">
        <Button leftIcon={<Mail className="w-4 h-4" />} onClick={() => setShowInvite(true)}>
          Invite Teacher
        </Button>
        </div>
      </div>

      <Card className="anim-card overflow-hidden">
        <div className="p-6 border-b border-orange-100 dark:border-stone-700">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white">All Teachers</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">{TEACHERS_LIST.length} teachers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-700/50 border-b border-orange-100 dark:border-stone-700">
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Classes</th>
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
              {TEACHERS_LIST.map((teacher) => (
                <tr key={teacher.id} className="bg-white dark:bg-stone-800 hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900 dark:text-white">{teacher.name}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-stone-800 dark:text-stone-200">{teacher.classes}</td>
                  <td className="px-6 py-4 text-sm font-bold text-stone-800 dark:text-stone-200">{teacher.students}</td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold", teacher.status === "Active" ? "text-secondary-600 dark:text-secondary-400" : "text-stone-400 dark:text-stone-500")}>
                      <span className={cn("w-2 h-2 rounded-full", teacher.status === "Active" ? "bg-secondary-500" : "bg-stone-300 dark:bg-stone-600")} />
                      {teacher.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400 font-medium">{teacher.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showInvite && <InviteTeacherModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}

// ─── Lessons Tab ──────────────────────────────────────────────────────────────

function LessonsTab() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", { y: 18, opacity: 0, duration: 0.45, ease: "power2.out" });
      ScrollTrigger.batch(".week-card", {
        onEnter: (batch) =>
          gsap.from(batch, { y: 32, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }),
        start: "top 90%",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="anim-heading">
        <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-1">Lessons</h1>
        <p className="text-stone-500 dark:text-stone-400 font-medium">Browse lesson content by week</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WEEKS_DATA.map((week) => (
          <Card key={week.id} className="week-card p-6" hoverable>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Week {week.weekNumber}
                  </p>
                  <h3 className="text-base font-black text-stone-900 dark:text-white">{week.title}</h3>
                </div>
              </div>
              <Badge variant="primary">{week.category}</Badge>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 mb-4 line-clamp-2">{week.description}</p>
            <div className="flex items-center gap-4 text-xs font-bold text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {week.lessons.length} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                {week.xpReward} XP
              </span>
              {week.isLocked && (
                <span className="text-rose-500 dark:text-rose-400">Locked</span>
              )}
            </div>
          </Card>
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
      gsap.from(".anim-heading", { y: 18, opacity: 0, duration: 0.45, ease: "power2.out" });
      ScrollTrigger.batch(".week-card", {
        onEnter: (batch) =>
          gsap.from(batch, { y: 32, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }),
        start: "top 90%",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="anim-heading">
        <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-1">Quizzes</h1>
        <p className="text-stone-500 dark:text-stone-400 font-medium">Browse quiz content by week</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WEEKS_DATA.map((week) => {
          const weekQuizzes = week.lessons.map((l) => QUIZZES_DATA[l.id]).filter(Boolean);
          const totalQuestions = weekQuizzes.reduce((s, q) => s + q.questions.length, 0);
          const totalPoints = weekQuizzes.reduce(
            (s, q) => s + q.questions.reduce((ps, qu) => ps + (qu.points ?? 0), 0),
            0
          );
          const totalMinutes = Math.round(
            weekQuizzes.reduce((s, q) => s + (q.timeLimit ?? 0), 0) / 60
          );

          return (
            <Card key={week.id} className="week-card p-6" hoverable>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      Week {week.weekNumber}
                    </p>
                    <h3 className="text-base font-black text-stone-900 dark:text-white">{week.title}</h3>
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
            </Card>
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
        on ? "bg-primary-600" : "bg-stone-300 dark:bg-stone-600"
      )}
    >
      <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform", on ? "translate-x-6" : "translate-x-1")} />
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
        <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{label}</p>
        {hint && <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsSection({ icon, title, description, children }) {
  return (
    <Card className="settings-section p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-black text-stone-900 dark:text-white">{title}</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">{description}</p>
        </div>
      </div>
      <div className="pl-14">{children}</div>
    </Card>
  );
}

function SettingsTab() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-heading", { y: 18, opacity: 0, duration: 0.45, ease: "power2.out" });
      ScrollTrigger.batch(".settings-section", {
        onEnter: (batch) =>
          gsap.from(batch, { y: 28, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }),
        start: "top 90%",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="anim-heading">
        <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-1">Settings</h1>
        <p className="text-stone-500 dark:text-stone-400 font-medium">Configure your SciQuest platform</p>
      </div>

      <SettingsSection
        icon={<Building2 className="w-5 h-5" />}
        title="School Profile"
        description="Basic information about your institution"
      >
        <SettingRow label="School Name" hint="Displayed in the app and outgoing emails">
          <SettingsInput defaultValue="SciQuest Academy" />
        </SettingRow>
        <SettingRow label="School Email" hint="Used for system notifications and replies">
          <SettingsInput placeholder="admin@school.edu" />
        </SettingRow>
        <SettingRow label="School Address" hint="For reports and official documents">
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
        <SettingRow label="Dark Mode Default" hint="Default theme applied to new user accounts">
          <Toggle defaultChecked={false} />
        </SettingRow>
        <SettingRow label="Show School Logo" hint="Display school logo on public-facing pages">
          <Toggle defaultChecked={true} />
        </SettingRow>
      </SettingsSection>

      <SettingsSection
        icon={<Bell className="w-5 h-5" />}
        title="Notifications"
        description="Control automated email and in-app alerts"
      >
        <SettingRow label="New Student Signup" hint="Notify admin when a new student registers">
          <Toggle defaultChecked={true} />
        </SettingRow>
        <SettingRow label="Teacher Invite Accepted" hint="Alert when a teacher completes their account setup">
          <Toggle defaultChecked={true} />
        </SettingRow>
        <SettingRow label="Weekly Quiz Summary" hint="Digest of quiz attempts and scores every Monday">
          <Toggle defaultChecked={false} />
        </SettingRow>
        <SettingRow label="Inactivity Alert" hint="Flag students inactive for 7 or more days">
          <Toggle defaultChecked={true} />
        </SettingRow>
      </SettingsSection>

      <SettingsSection
        icon={<Link2 className="w-5 h-5" />}
        title="Integrations"
        description="Connect external tools and platforms"
      >
        <SettingRow label="Google Classroom" hint="Sync class rosters automatically">
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-700 px-3 py-1.5 rounded-lg">
            Coming Soon
          </span>
        </SettingRow>
        <SettingRow label="Microsoft Teams" hint="Send lesson notifications via Teams channels">
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-700 px-3 py-1.5 rounded-lg">
            Coming Soon
          </span>
        </SettingRow>
        <SettingRow label="LMS Export" hint="Export grades to an external Learning Management System">
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-700 px-3 py-1.5 rounded-lg">
            Coming Soon
          </span>
        </SettingRow>
      </SettingsSection>
    </div>
  );
}

// ─── Sidebar slot map ─────────────────────────────────────────────────────────

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "users",     label: "Users",     Icon: Users },
  { id: "teachers",  label: "Teachers",  Icon: GraduationCap },
  { id: "lessons",   label: "Lessons",   Icon: BookOpen },
  { id: "quizzes",   label: "Quizzes",   Icon: HelpCircle },
  { id: "settings",  label: "Settings",  Icon: Settings },
];

// ─── Admin content slot map ───────────────────────────────────────────────────

const ADMIN_TAB_MAP = {
  dashboard: DashboardTab,
  users:     UsersTab,
  teachers:  TeachersTab,
  lessons:   LessonsTab,
  quizzes:   QuizzesTab,
  settings:  SettingsTab,
};

// ─── Main ────────────────────────────────────────────────────────────────────

export function AdminDashboardPage({ onNavigate }) {
  const { signOut, profile } = useAuth();
  const { isDark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const stats = [
    {
      label:   "Total Students",
      value:   "1,248",
      icon:    <Users className="w-6 h-6 text-primary-500" />,
      bgLight: "bg-primary-50",
      bgDark:  "dark:bg-primary-900/20",
    },
    {
      label:   "Total Teachers",
      value:   "42",
      icon:    <GraduationCap className="w-6 h-6 text-secondary-500" />,
      bgLight: "bg-secondary-50",
      bgDark:  "dark:bg-secondary-900/20",
    },
    {
      label:   "Active Lessons",
      value:   "156",
      icon:    <BookOpen className="w-6 h-6 text-accent-500" />,
      bgLight: "bg-accent-50",
      bgDark:  "dark:bg-accent-900/20",
    },
    {
      label:   "Quiz Attempts",
      value:   "8,932",
      icon:    <HelpCircle className="w-6 h-6 text-blue-500" />,
      bgLight: "bg-blue-50",
      bgDark:  "dark:bg-blue-900/20",
    },
  ];

  const recentUsers = [
    { id: 1, name: "Alex Johnson",      role: "Student", email: "alex.j@school.edu",   status: "Active",   joined: "2 days ago" },
    { id: 2, name: "Sarah Smith",       role: "Teacher", email: "s.smith@school.edu",  status: "Active",   joined: "5 days ago" },
    { id: 3, name: "Michael Brown",     role: "Student", email: "m.brown@school.edu",  status: "Inactive", joined: "1 week ago" },
    { id: 4, name: "Emily Davis",       role: "Student", email: "e.davis@school.edu",  status: "Active",   joined: "1 week ago" },
    { id: 5, name: "Dr. Robert Wilson", role: "Teacher", email: "r.wilson@school.edu", status: "Active",   joined: "2 weeks ago" },
  ];

  const TabContent = ADMIN_TAB_MAP[activeTab] ?? DashboardTab;
  const adminName = profile
    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Admin"
    : "Admin";

  return (
    <div className="min-h-screen font-body text-stone-800 dark:text-stone-100 bg-[#fdf6e3] dark:bg-stone-900">
      {/* Admin Navbar — always visible */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-orange-200/50 dark:border-stone-700 shadow-warm bg-[rgba(255,251,245,0.85)] dark:bg-stone-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-heading font-black text-lg text-stone-900 dark:text-white">
                Admin Portal
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-stone-700 dark:text-stone-300 hidden sm:inline">
                    {adminName}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-stone-500 transition-transform duration-200",
                      profileOpen && "rotate-180"
                    )}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-orange-100 dark:border-stone-700 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-orange-100 dark:border-stone-700">
                      <p className="text-sm font-black text-stone-900 dark:text-white">{adminName}</p>
                      {profile?.email && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">{profile.email}</p>
                      )}
                      <span className="inline-block mt-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-md">
                        Admin
                      </span>
                    </div>
                    <button
                      onClick={() => { signOut(); onNavigate("home"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar — driven by SIDEBAR_ITEMS slot map */}
          <aside className="w-full md:w-52 shrink-0">
            <Card className="p-3 sticky top-24">
              <nav className="space-y-1" aria-label="Admin navigation">
                {SIDEBAR_ITEMS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors text-left",
                      activeTab === id
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                        : "text-stone-600 dark:text-stone-400 hover:bg-orange-50 dark:hover:bg-stone-700 hover:text-primary-600 dark:hover:text-primary-400"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {label}
                  </button>
                ))}
              </nav>
            </Card>
          </aside>

          {/* Main content — rendered via ADMIN_TAB_MAP slot map */}
          <main className="flex-1 min-w-0">
            <TabContent stats={stats} recentUsers={recentUsers} />
          </main>
        </div>
      </div>
    </div>
  );
}
