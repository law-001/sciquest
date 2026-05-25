import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Users,
  BarChart3,
  ClipboardList,
  Settings,
  Plus,
  Eye,
  EyeOff,
  Edit2,
  TrendingUp,
  Clock,
  CheckCircle2,
  Star,
  GraduationCap,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  ChevronLeft,
  AlertCircle,
  Loader2,
  X,
  Award,
  Trash2,
  Gamepad2,
  Search,
  ClipboardCheck,
  RotateCcw,
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  fetchTeacherDashboard,
  gradeQuizAttempt,
  previewGrade,
  removeStudentFromSection,
  fetchGameProgressForStudents,
} from "../lib/teacher";
import { fetchAllSections, createSection } from "../lib/sections";
import { GAMES } from "../lib/games/registry";
import { QuizAnswersReview } from "../components/QuizAnswersReview";
import { getQuizByLesson } from "../data/quizzesweek-01";
import { WEEKS_DATA } from "../data/lessonsweek-01";
import {
  getPublishedWeekIds,
  savePublishedWeekIds,
  isWeekPublished,
  isWeekOpen,
  getPublishedQuizWeekIds,
  savePublishedQuizWeekIds,
  getOpenWeekIds,
  saveOpenWeekIds,
  fetchPublishedWeekIds,
  fetchPublishedQuizWeekIds,
  fetchOpenWeekIds,
  subscribeToPublishedState,
} from "../lib/publishedWeeks";
import {
  getCachedQuizSettings,
  fetchQuizSettings,
  saveQuizTimeLimit,
  saveQuizMaxAttempts,
  saveQuizShowAnswers,
  subscribeToQuizSettings,
  getQuizTimeLimit,
  getQuizMaxAttempts,
  getQuizShowAnswers,
} from "../lib/quizSettings";

// --- Slot components ---
// Every slot receives the fetched `data` bundle plus the active sectionId
// (null = all sections).

function OverviewSlot({ data, sectionId, onGrade, publishedWeekIds }) {
  const { sections, lessons, submissions } = data;
  const filteredSubs = sectionId
    ? submissions.filter((s) => s.section === sectionId)
    : submissions;
  const pendingCount = filteredSubs.filter(
    (s) => s.status === "pending",
  ).length;
  const totalStudents = sectionId
    ? (sections.find((s) => s.id === sectionId)?.students ?? 0)
    : sections.reduce((sum, s) => sum + s.students, 0);
  const publishedLessons = WEEKS_DATA.reduce(
    (sum, w) =>
      sum + (isWeekPublished(w.id, publishedWeekIds) ? w.lessons.length : 0),
    0,
  );
  const avgScore = sectionId
    ? (sections.find((s) => s.id === sectionId)?.avgScore ?? 0)
    : sections.length
      ? Math.round(
          sections.reduce((sum, s) => sum + s.avgScore, 0) / sections.length,
        )
      : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: totalStudents,
            icon: <Users className="w-5 h-5 text-primary-500" />,
            color: "bg-primary-50 dark:bg-primary-900/20",
          },
          {
            label: "Published Lessons",
            value: publishedLessons,
            icon: <BookOpen className="w-5 h-5 text-secondary-500" />,
            color: "bg-secondary-50 dark:bg-secondary-900/20",
          },
          {
            label: "Avg. Score",
            value: `${avgScore}%`,
            icon: <TrendingUp className="w-5 h-5 text-accent-500" />,
            color: "bg-accent-50 dark:bg-accent-900/20",
          },
          {
            label: "Pending Grading",
            value: pendingCount,
            icon: <ClipboardList className="w-5 h-5 text-science-pink" />,
            color: "bg-pink-50 dark:bg-pink-900/20",
          },
        ].map((stat, i) => (
          <Card key={i} className="p-5">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                stat.color,
              )}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-black text-stone-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-1">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-orange-100 dark:border-stone-700">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">
              Recent Submissions
            </h2>
          </div>
          <div className="divide-y divide-orange-100 dark:divide-stone-700">
            {filteredSubs.length > 0 ? (
              filteredSubs.slice(0, 5).map((sub) => (
                <div
                  key={sub.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                      {sub.student.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900 dark:text-white">
                        {sub.student}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {sub.quiz}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {sub.status === "pending" ? (
                      <Badge
                        variant="outline"
                        className="text-xs text-amber-600 border-amber-300"
                      >
                        Pending
                      </Badge>
                    ) : (
                      <span
                        className={cn(
                          "text-sm font-black",
                          sub.score >= sub.total * 0.8
                            ? "text-secondary-600"
                            : sub.score >= sub.total * 0.6
                              ? "text-accent-600"
                              : "text-red-600",
                        )}
                      >
                        {sub.score}/{sub.total}
                      </span>
                    )}
                    <span className="text-xs text-stone-400 font-medium hidden sm:flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sub.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-6 py-8 text-sm text-stone-400 text-center">
                No submissions yet.
              </p>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-6 border-b border-orange-100 dark:border-stone-700">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">
              Pending To-Do
            </h2>
          </div>
          <div className="p-6 space-y-3">
            {pendingCount > 0 ? (
              filteredSubs
                .filter((s) => s.status === "pending")
                .map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-stone-900 dark:text-white">
                          {sub.student}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {sub.quiz}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => onGrade(sub)}
                    >
                      Grade
                    </Button>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-secondary-400 mb-2" />
                <p className="text-sm font-bold text-stone-500 dark:text-stone-400">
                  All caught up!
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AddSectionModal({ existingSectionNames, onAdd, onClose }) {
  const [mode, setMode] = useState("existing");
  const [dbSections, setDbSections] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    const exclude = existingSectionNames;
    fetchAllSections()
      .then((all) => {
        setDbSections(all.filter((s) => !exclude.includes(s.name)));
        setLoadingDb(false);
      })
      .catch(() => setLoadingDb(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canAdd = mode === "existing" ? !!selected : newName.trim().length > 0;

  async function handleAdd() {
    const name = mode === "existing" ? selected : newName.trim();
    if (!name) return;
    if (mode === "create") {
      setCreating(true);
      setCreateError("");
      try {
        await createSection(name, "teacher");
      } catch (err) {
        setCreateError(err.message ?? "Failed to create section");
        setCreating(false);
        return;
      }
      setCreating(false);
    }
    onAdd(name);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-orange-100 dark:border-stone-700">
        <div className="flex items-center gap-3 p-6 border-b border-orange-100 dark:border-stone-700">
          <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-white">
              Add Section
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Join an existing section or create a new one
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-700/50 rounded-xl">
            {[
              { id: "existing", label: "Existing Section" },
              { id: "create", label: "Create New" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setMode(opt.id); setCreateError(""); }}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors",
                  mode === opt.id
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {mode === "existing" ? (
            loadingDb ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-secondary-500 animate-spin" />
              </div>
            ) : dbSections.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {dbSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelected(selected === section.name ? null : section.name)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors",
                      selected === section.name
                        ? "border-secondary-400 bg-secondary-50 dark:bg-stone-700 dark:border-secondary-500"
                        : "border-orange-100 dark:border-stone-600 hover:bg-orange-50/50 dark:hover:bg-stone-700",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                        selected === section.name
                          ? "border-secondary-500 bg-secondary-500"
                          : "border-stone-300 dark:border-stone-500",
                      )}
                    >
                      {selected === section.name && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {section.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-stone-400">
                  No available sections found.
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Switch to "Create New" to add a new section.
                </p>
              </div>
            )
          ) : (
            <div>
              <label
                htmlFor="new-section-name"
                className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5"
              >
                Section Name
              </label>
              <input
                id="new-section-name"
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setCreateError(""); }}
                onKeyDown={(e) => e.key === "Enter" && canAdd && !creating && handleAdd()}
                placeholder="e.g. Section A, Grade 7-Narra"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm font-bold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-400 dark:focus:ring-secondary-600"
              />
              {createError && (
                <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                  {createError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-orange-100 dark:border-stone-700 p-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleAdd}
            disabled={!canAdd || creating}
            isLoading={creating}
          >
            {mode === "create" ? "Create & Add" : "Add Section"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionsSlot({
  data,
  sectionId,
  onViewSection,
  onRefresh,
  mySectionNames,
  onSectionNamesChange,
}) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [removeError, setRemoveError] = useState(null);
  const [confirmingSection, setConfirmingSection] = useState(null);

  const dataByName = new Map(data.sections.map((s) => [s.name, s]));
  const displaySections =
    mySectionNames !== null
      ? mySectionNames.map(
          (name) =>
            dataByName.get(name) ?? {
              id: name,
              name,
              students: 0,
              avgScore: 0,
            },
        )
      : data.sections;

  useEffect(() => {
    if (!sectionId && displaySections.length === 0) setAddModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAddSection(name) {
    const next = [...new Set([...(mySectionNames ?? []), name])];
    onSectionNamesChange(next);
  }

  async function handleRemoveStudent(studentId) {
    setRemovingId(studentId);
    setRemoveError(null);
    try {
      await removeStudentFromSection(studentId);
      onRefresh?.();
    } catch (err) {
      setRemoveError(err.message ?? "Failed to remove student");
    } finally {
      setRemovingId(null);
    }
  }

  const activeSection = sectionId
    ? data.sections.find((s) => s.id === sectionId)
    : null;
  const rosterStudents = sectionId
    ? data.students.filter((s) => s.section === sectionId)
    : [];

  return (
    <div className="space-y-8">
      {sectionId ? (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewSection?.(null)}
            aria-label="Back to sections"
            className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-orange-50 dark:hover:bg-stone-700 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white">
              {activeSection?.name ?? "Section"}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-0.5">
              Roster and section details
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white">
              My Sections
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
              All sections overview
            </p>
          </div>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setAddModalOpen(true)}
          >
            Add Section
          </Button>
        </div>
      )}

      {sectionId ? (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                {activeSection?.name}
              </h3>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
                    Students
                  </p>
                  <p className="text-2xl font-black text-stone-900 dark:text-white">
                    {rosterStudents.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
                    Avg Score
                  </p>
                  <p className="text-2xl font-black text-stone-900 dark:text-white">
                    {activeSection?.avgScore ?? 0}%
                  </p>
                </div>
              </div>
            </div>
            <ProgressBar
              progress={activeSection?.avgScore ?? 0}
              color="secondary"
              size="sm"
            />
          </Card>

          <Card className="overflow-hidden">
            <div className="p-6 border-b border-orange-100 dark:border-stone-700 flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Students
              </h3>
              <span className="text-xs font-bold text-stone-400">
                {rosterStudents.length} enrolled
              </span>
            </div>
            {removeError && (
              <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800/30">
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {removeError}
                </p>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-800 border-b border-orange-100 dark:border-stone-700">
                    {["Student", "Progress", "Avg Score", ""].map((h, i) => (
                      <th
                        key={i}
                        className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
                  {rosterStudents.length > 0 ? (
                    rosterStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                              {student.name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-stone-900 dark:text-white">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-20 hidden sm:block">
                              <ProgressBar
                                progress={student.progress}
                                color="secondary"
                                size="sm"
                              />
                            </div>
                            <span className="text-sm font-black text-stone-700 dark:text-stone-300 whitespace-nowrap">
                              {student.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "text-sm font-black",
                              student.avgScore >= 75
                                ? "text-secondary-600"
                                : student.avgScore >= 50
                                  ? "text-accent-600"
                                  : "text-red-600",
                            )}
                          >
                            {student.avgScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleRemoveStudent(student.id)}
                            isLoading={removingId === student.id}
                            disabled={!!removingId}
                            aria-label={`Remove ${student.name}`}
                          >
                            {removingId !== student.id && (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-sm text-stone-400 text-center"
                      >
                        No students in this section yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : displaySections.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySections.map((section) => (
            <Card key={section.id} className="p-6" hoverable>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                  {section.name}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmingSection(section.name);
                  }}
                  aria-label={`Remove ${section.name}`}
                  className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">
                    Students
                  </span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {section.students}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">
                    Avg. Score
                  </span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {section.avgScore}%
                  </span>
                </div>
                <ProgressBar
                  progress={section.avgScore}
                  color="secondary"
                  size="sm"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<Eye className="w-4 h-4" />}
                onClick={() => onViewSection?.(section.id)}
              >
                View
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users className="w-10 h-10 text-stone-300 mb-3" />
          <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">
            No sections yet.
          </p>
        </div>
      )}

      {addModalOpen && (
        <AddSectionModal
          existingSectionNames={displaySections.map((s) => s.name)}
          onAdd={handleAddSection}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {confirmingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-orange-100 dark:border-stone-700">
            <div className="flex items-center gap-3 p-6 border-b border-orange-100 dark:border-stone-700">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-900 dark:text-white">
                  Remove Section
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  This only removes it from your view.
                </p>
              </div>
              <button
                onClick={() => setConfirmingSection(null)}
                aria-label="Close"
                className="ml-auto p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Remove{" "}
                <span className="font-black text-stone-900 dark:text-white">
                  {confirmingSection}
                </span>{" "}
                from your sections list? Students in this section are not
                affected.
              </p>
            </div>
            <div className="border-t border-orange-100 dark:border-stone-700 p-6 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setConfirmingSection(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-500! hover:bg-red-600!"
                onClick={() => {
                  const next = (
                    mySectionNames ?? displaySections.map((s) => s.name)
                  ).filter((n) => n !== confirmingSection);
                  onSectionNamesChange(next);
                  setConfirmingSection(null);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonsSlot({
  data,
  sectionId,
  publishedWeekIds,
  onPublishedWeekIdsChange,
  openWeekIds,
  onOpenWeekIdsChange,
}) {
  const [expandedWeekId, setExpandedWeekId] = useState(null);
  const [search, setSearch] = useState("");

  // Weeks have three states a teacher can cycle through:
  //   hidden    → not in publish set, not in open set        (locked for everyone)
  //   published → in publish set, not in open set            (locked until previous week is done)
  //   open      → in publish set AND in open set             (accessible regardless of prior progress)
  function getWeekState(weekId) {
    if (!isWeekPublished(weekId, publishedWeekIds)) return "hidden";
    if (isWeekOpen(weekId, openWeekIds)) return "open";
    return "published";
  }

  function cycleWeekState(weekId) {
    const state = getWeekState(weekId);
    const publishBase = publishedWeekIds ?? new Set(WEEKS_DATA.map((w) => w.id));
    const nextPublish = new Set(publishBase);
    const nextOpen = new Set(openWeekIds ?? []);

    if (state === "hidden") {
      // hidden → published
      nextPublish.add(weekId);
      nextOpen.delete(weekId);
    } else if (state === "published") {
      // published → open
      nextPublish.add(weekId);
      nextOpen.add(weekId);
    } else {
      // open → hidden
      nextPublish.delete(weekId);
      nextOpen.delete(weekId);
    }

    onPublishedWeekIdsChange(nextPublish);
    onOpenWeekIdsChange(nextOpen);
  }

  // Build a lookup from lesson id → activity data (completion map).
  const activityById = new Map(data.lessons.map((l) => [l.id, l]));

  function getCompletion(lessonId) {
    const activity = activityById.get(lessonId);
    if (!activity) return 0;
    if (sectionId) return activity.completion[sectionId] ?? 0;
    const vals = Object.values(activity.completion);
    return vals.length
      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      : 0;
  }

  const expandedWeek = WEEKS_DATA.find((w) => w.id === expandedWeekId) ?? null;
  const q = search.toLowerCase();
  const filteredWeeks = q
    ? WEEKS_DATA.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.category?.toLowerCase().includes(q) ||
          String(w.weekNumber).includes(q) ||
          w.lessons.some((l) => l.title.toLowerCase().includes(q)),
      )
    : WEEKS_DATA;
  const filteredLessons = expandedWeek
    ? q
      ? expandedWeek.lessons.filter((l) => l.title.toLowerCase().includes(q))
      : expandedWeek.lessons
    : [];

  return (
    <div className="space-y-8">
      {expandedWeek ? (
        // ── Lesson cards for the selected week ──
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => { setExpandedWeekId(null); setSearch(""); }}
              aria-label="Back to weeks"
              className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-orange-50 dark:hover:bg-stone-700 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                Week {expandedWeek.weekNumber} — {expandedWeek.title}
              </h2>
              <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-0.5">
                {expandedWeek.lessons.length}{" "}
                {expandedWeek.lessons.length === 1 ? "lesson" : "lessons"}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search lessons…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-bold text-stone-900 dark:text-white placeholder:font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 dark:focus:ring-secondary-600 w-40"
                />
              </div>
              {(() => {
                const state = getWeekState(expandedWeek.id);
                const meta =
                  state === "open"
                    ? {
                        cls: "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200",
                        Icon: Eye,
                        label: "Open for All",
                        nextLabel: "Click to hide",
                      }
                    : state === "published"
                      ? {
                          cls: "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 border-secondary-200 dark:border-secondary-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200",
                          Icon: Eye,
                          label: "Published",
                          nextLabel: "Click to open for all",
                        }
                      : {
                          cls: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700 hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-200",
                          Icon: EyeOff,
                          label: "Hidden",
                          nextLabel: "Click to publish",
                        };
                return (
                  <button
                    onClick={() => cycleWeekState(expandedWeek.id)}
                    title={meta.nextLabel}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-colors",
                      meta.cls,
                    )}
                  >
                    <meta.Icon className="w-4 h-4" />
                    {meta.label}
                  </button>
                );
              })()}
            </div>
          </div>

          {filteredLessons.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLessons.map((lesson) => {
                const pct = getCompletion(lesson.id);
                return (
                  <Card key={lesson.id} className="p-5" hoverable>
                    <div className="w-10 h-10 rounded-xl bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center mb-4">
                      <BookOpen className="w-5 h-5 text-secondary-500" />
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white leading-snug">
                        {lesson.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        Published
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                      {expandedWeek.category}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                        <span>Completion</span>
                        <span>{pct}%</span>
                      </div>
                      <ProgressBar progress={pct} color="secondary" size="sm" />
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-8 h-8 text-stone-300 mb-3" />
              <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">
                No lessons match your search.
              </p>
            </div>
          )}
        </>
      ) : (
        // ── Week cards ──
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                Lessons
              </h2>
              <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
                All weeks · click a week to see its lessons
              </p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search weeks or lessons…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-bold text-stone-900 dark:text-white placeholder:font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 dark:focus:ring-secondary-600 w-52"
              />
            </div>
          </div>

          {filteredWeeks.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWeeks.map((week) => {
                const avgPct = week.lessons.length
                  ? Math.round(
                      week.lessons.reduce(
                        (sum, l) => sum + getCompletion(l.id),
                        0,
                      ) / week.lessons.length,
                    )
                  : 0;
                const state = getWeekState(week.id);
                const visible = state !== "hidden";
                const badgeMeta =
                  state === "open"
                    ? {
                        cls: "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200",
                        Icon: Eye,
                        label: "Open for All",
                        nextLabel: `Hide week ${week.weekNumber}`,
                      }
                    : state === "published"
                      ? {
                          cls: "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 border-secondary-200 dark:border-secondary-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200",
                          Icon: Eye,
                          label: "Published",
                          nextLabel: `Open week ${week.weekNumber} for all`,
                        }
                      : {
                          cls: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700 hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-200",
                          Icon: EyeOff,
                          label: "Hidden",
                          nextLabel: `Publish week ${week.weekNumber}`,
                        };
                return (
                  <Card
                    key={week.id}
                    className={cn(
                      "p-5 transition-opacity",
                      visible ? "cursor-pointer" : "opacity-60",
                    )}
                    hoverable={visible}
                    onClick={
                      visible
                        ? () => { setExpandedWeekId(week.id); setSearch(""); }
                        : undefined
                    }
                  >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-secondary-500" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cycleWeekState(week.id);
                      }}
                      className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border transition-colors",
                        badgeMeta.cls,
                      )}
                      title={badgeMeta.nextLabel}
                      aria-label={badgeMeta.nextLabel}
                    >
                      <badgeMeta.Icon className="w-3 h-3" />
                      {badgeMeta.label}
                    </button>
                  </div>
                  <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1 block">
                    Week {week.weekNumber}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                    {week.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                    {week.lessons.length}{" "}
                    {week.lessons.length === 1 ? "lesson" : "lessons"}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                      <span>Avg completion</span>
                      <span>{avgPct}%</span>
                    </div>
                    <ProgressBar
                      progress={avgPct}
                      color="secondary"
                      size="sm"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-8 h-8 text-stone-300 mb-3" />
              <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">
                No weeks match your search.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Quiz types that require a teacher to read and judge the student's response.
// Auto-graded types (MCQ, True/False, Matching, Ordering, Identification,
// Fill-in-Blanks, Picture-Based) are intentionally excluded.
const MANUAL_QUESTION_TYPES = new Set(["essay", "short-answer", "case-study"]);

const MANUAL_TYPE_META = {
  essay: {
    label: "Essay",
    className:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30",
  },
  "short-answer": {
    label: "Short Answer",
    className:
      "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
  },
  "case-study": {
    label: "Case Study",
    className:
      "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/30",
  },
};

function getManualQuestionTypes(lessonId) {
  const quiz = getQuizByLesson(lessonId);
  if (!quiz?.questions) return [];
  const types = new Set();
  for (const q of quiz.questions) {
    if (MANUAL_QUESTION_TYPES.has(q.type)) types.add(q.type);
  }
  return [...types];
}

// Returns a short preview of the student's first written response so the
// teacher can scan submissions without opening the full grade modal.
function getAnswerSnippet(lessonId, answers) {
  const quiz = getQuizByLesson(lessonId);
  if (!quiz?.questions || !answers) return null;
  for (const q of quiz.questions) {
    if (!MANUAL_QUESTION_TYPES.has(q.type)) continue;
    let text = null;
    if (
      q.type === "case-study" &&
      typeof answers[q.id] === "object" &&
      answers[q.id]
    ) {
      for (const v of Object.values(answers[q.id])) {
        if (typeof v === "string" && v.trim()) {
          text = v.trim();
          break;
        }
      }
    } else if (typeof answers[q.id] === "string" && answers[q.id].trim()) {
      text = answers[q.id].trim();
    }
    if (text) return text.length > 150 ? text.slice(0, 150) + "…" : text;
  }
  return null;
}

function getEssayWordCount(lessonId, answers) {
  const quiz = getQuizByLesson(lessonId);
  if (!quiz?.questions || !answers) return null;
  for (const q of quiz.questions) {
    if (q.type === "essay") {
      const val = answers[q.id];
      if (typeof val === "string" && val.trim())
        return val.trim().split(/\s+/).length;
    }
  }
  return null;
}

// Returns rubric strings for all manually-graded questions in a quiz.
// Shown to the teacher in the grade modal so they have grading criteria handy.
function getRubricItems(lessonId) {
  const quiz = getQuizByLesson(lessonId);
  if (!quiz?.questions) return [];
  return quiz.questions
    .filter((q) => MANUAL_QUESTION_TYPES.has(q.type) && q.rubric)
    .map((q) => ({ id: q.id, type: q.type, question: q.question, rubric: q.rubric, points: q.points ?? null }));
}

function QuizCheckingSlot({ data, sectionId, onGrade }) {
  const [tab, setTab] = useState("pending");

  const allSubs = sectionId
    ? data.submissions.filter((s) => s.section === sectionId)
    : data.submissions;

  // Oldest first: students who submitted earlier have been waiting longest.
  const pending = [...allSubs.filter((s) => s.status === "pending")].reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-white">
            Quiz Checking
          </h2>
          <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
            Manual review for essays, short answers, and case studies
          </p>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {pending.length} awaiting review
            </span>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl w-fit">
        {[
          {
            id: "pending",
            label: `Needs Grading${pending.length ? ` (${pending.length})` : ""}`,
          },
          {
            id: "all",
            label: `All Submissions${allSubs.length ? ` (${allSubs.length})` : ""}`,
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
              tab === t.id
                ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm"
                : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pending" ? (
        pending.length > 0 ? (
          <div className="space-y-4">
            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Oldest first &mdash;{" "}
              {pending.length === 1
                ? "1 submission"
                : `${pending.length} submissions`}{" "}
              to review
            </p>
            {pending.map((sub) => {
              const types = getManualQuestionTypes(sub.lessonId);
              const snippet = getAnswerSnippet(sub.lessonId, sub.answers);
              const wordCount = getEssayWordCount(sub.lessonId, sub.answers);
              const hasEssay = types.includes("essay");
              const minWords = (() => {
                const quiz = getQuizByLesson(sub.lessonId);
                return quiz?.questions?.find((q) => q.type === "essay")?.minWords ?? null;
              })();

              return (
                <Card key={sub.id} className="p-5 space-y-3">
                  {/* Student row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {sub.student.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900 dark:text-white">
                          {sub.student}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {sub.quiz}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-stone-400 font-medium hidden sm:flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {sub.time}
                      </span>
                      <Button size="sm" onClick={() => onGrade(sub)}>
                        Grade
                      </Button>
                    </div>
                  </div>

                  {/* Type badges + essay word count */}
                  <div className="flex gap-2 flex-wrap">
                    {types.map((type) => {
                      const meta = MANUAL_TYPE_META[type] ?? {};
                      return (
                        <span
                          key={type}
                          className={cn(
                            "px-2 py-0.5 rounded-md text-xs font-bold",
                            meta.className,
                          )}
                        >
                          {meta.label ?? type}
                        </span>
                      );
                    })}
                    {hasEssay && wordCount !== null && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-xs font-bold border",
                          minWords && wordCount < minWords
                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30"
                            : "bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-600",
                        )}
                      >
                        {wordCount} words
                        {minWords && wordCount < minWords
                          ? ` (min ${minWords})`
                          : ""}
                      </span>
                    )}
                  </div>

                  {/* Answer snippet so teacher can gauge content at a glance */}
                  {snippet && (
                    <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                      <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1.5">
                        Student&rsquo;s response
                      </p>
                      <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                        &ldquo;{snippet}&rdquo;
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
            <p className="text-lg font-black text-stone-700 dark:text-stone-300">
              All caught up!
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              No submissions are waiting for review.
            </p>
          </Card>
        )
      ) : (
        /* All Submissions table */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800 border-b border-orange-100 dark:border-stone-700">
                  {[
                    "Student",
                    "Quiz",
                    "Type",
                    "Score",
                    "Status",
                    "Submitted",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
                {allSubs.length > 0 ? (
                  allSubs.map((sub) => {
                    const types = getManualQuestionTypes(sub.lessonId);
                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                              {sub.student.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-stone-900 dark:text-white">
                              {sub.student}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400">
                          {sub.quiz}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {types.map((type) => {
                              const meta = MANUAL_TYPE_META[type] ?? {};
                              return (
                                <span
                                  key={type}
                                  className={cn(
                                    "px-1.5 py-0.5 rounded text-xs font-bold",
                                    meta.className,
                                  )}
                                >
                                  {meta.label ?? type}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {sub.status === "graded" ? (
                            <span
                              className={cn(
                                "text-sm font-black",
                                sub.score >= sub.total * 0.8
                                  ? "text-secondary-600"
                                  : sub.score >= sub.total * 0.6
                                    ? "text-accent-600"
                                    : "text-red-600",
                              )}
                            >
                              {sub.score}/{sub.total}
                            </span>
                          ) : (
                            <span className="text-sm text-stone-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                sub.status === "graded" ? "secondary" : "outline"
                              }
                              className={cn(
                                "text-xs",
                                sub.status === "pending" &&
                                  "text-amber-600 border-amber-300",
                              )}
                            >
                              {sub.status === "graded" ? "Graded" : "Pending"}
                            </Badge>
                            {sub.status === "pending" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs px-2 h-7"
                                onClick={() => onGrade(sub)}
                              >
                                Grade
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-500 dark:text-stone-400">
                          {sub.time}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-sm text-stone-400 text-center"
                    >
                      No submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// DepEd numerical grading descriptors used in Philippine schools.
function gradeDescriptor(pct) {
  if (pct >= 90)
    return { label: "Outstanding", short: "O", color: "text-emerald-600 dark:text-emerald-400" };
  if (pct >= 85)
    return { label: "Very Satisfactory", short: "VS", color: "text-secondary-600 dark:text-secondary-400" };
  if (pct >= 80)
    return { label: "Satisfactory", short: "S", color: "text-blue-600 dark:text-blue-400" };
  if (pct >= 75)
    return { label: "Fairly Satisfactory", short: "FS", color: "text-accent-600 dark:text-accent-500" };
  return {
    label: "Did Not Meet Expectations",
    short: "DNME",
    color: "text-red-600 dark:text-red-400",
  };
}

function GradebookSlot({ data, sectionId }) {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [search, setSearch] = useState("");

  if (!sectionId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Star className="w-12 h-12 text-stone-300 mb-4" />
        <h2 className="text-xl font-black text-stone-700 dark:text-stone-300 mb-2">
          Select a Section
        </h2>
        <p className="text-stone-500 dark:text-stone-400 max-w-xs text-sm">
          Use the section switcher above to view the gradebook for a specific
          section.
        </p>
      </div>
    );
  }

  const sectionStudents = data.students.filter((s) => s.section === sectionId);
  const { quizColumns } = data;

  const withData = sectionStudents.filter((s) => s.best.size > 0);
  const classAvg = withData.length
    ? Math.round(
        withData.reduce((sum, s) => sum + s.avgScore, 0) / withData.length,
      )
    : 0;
  const passCount = sectionStudents.filter((s) => s.avgScore >= 75).length;
  const highest = withData.length
    ? Math.max(...withData.map((s) => s.avgScore))
    : 0;

  const pendingNames = new Set(
    data.submissions
      .filter((s) => s.status === "pending" && s.section === sectionId)
      .map((s) => s.student),
  );

  const rankMap = new Map(
    [...sectionStudents]
      .sort((a, b) => b.avgScore - a.avgScore)
      .map((s, i) => [s.id, i + 1]),
  );

  // ── Student detail view ──────────────────────────────────────────────────
  const selectedStudent = sectionStudents.find(
    (s) => s.id === selectedStudentId,
  );

  if (selectedStudent) {
    const rank = rankMap.get(selectedStudent.id) ?? "—";
    const desc = gradeDescriptor(selectedStudent.avgScore);
    const hasPending = pendingNames.has(selectedStudent.name);
    const attempted = quizColumns.filter((q) =>
      selectedStudent.best.has(q.id),
    ).length;
    const notAttempted = quizColumns.filter(
      (q) => !selectedStudent.best.has(q.id),
    );

    return (
      <div className="space-y-6">
        {/* Back navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedStudentId(null)}
            aria-label="Back to gradebook"
            className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-orange-50 dark:hover:bg-stone-700 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white">
              {selectedStudent.name}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-0.5">
              Student record · {sectionId}
            </p>
          </div>
        </div>

        {/* Profile + grade card */}
        <Card className="p-6">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-black text-2xl shrink-0">
              {selectedStudent.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-stone-900 dark:text-white">
                {selectedStudent.name}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                {sectionId} · Rank #{rank} in section
              </p>
              {hasPending && (
                <p className="text-xs font-bold text-amber-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  Has ungraded submission — average may change after grading
                </p>
              )}
            </div>
            {selectedStudent.best.size > 0 && (
              <div className="text-right shrink-0">
                <p className={cn("text-4xl font-black", desc.color)}>
                  {selectedStudent.avgScore}%
                </p>
                <p className={cn("text-sm font-bold mt-0.5", desc.color)}>
                  {desc.label}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Quiz Average",
              value:
                selectedStudent.best.size > 0
                  ? `${selectedStudent.avgScore}%`
                  : "—",
              icon: <BarChart3 className="w-5 h-5 text-secondary-500" />,
              bg: "bg-secondary-50 dark:bg-secondary-900/20",
            },
            {
              label: "Section Rank",
              value:
                selectedStudent.best.size > 0 ? `#${rank}` : "—",
              icon: <Award className="w-5 h-5 text-science-pink" />,
              bg: "bg-pink-50 dark:bg-pink-900/20",
            },
            {
              label: "Curriculum Progress",
              value: `${selectedStudent.progress}%`,
              icon: <TrendingUp className="w-5 h-5 text-primary-500" />,
              bg: "bg-primary-50 dark:bg-primary-900/20",
            },
            {
              label: "Quizzes Taken",
              value: `${attempted} / ${quizColumns.length}`,
              icon: <ClipboardList className="w-5 h-5 text-accent-600" />,
              bg: "bg-accent-50 dark:bg-accent-900/20",
            },
          ].map((stat, i) => (
            <Card key={i} className="p-4">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center mb-2",
                  stat.bg,
                )}
              >
                {stat.icon}
              </div>
              <p className="text-xl font-black text-stone-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-0.5">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>

        {/* Curriculum progress bar */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
              Lessons Completed
            </p>
            <span className="text-sm font-black text-stone-900 dark:text-white">
              {selectedStudent.progress}%
            </span>
          </div>
          <ProgressBar
            progress={selectedStudent.progress}
            color={
              selectedStudent.progress >= 75
                ? "secondary"
                : selectedStudent.progress >= 50
                  ? "accent"
                  : "primary"
            }
            size="sm"
          />
        </Card>

        {/* Quiz performance list */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-orange-100 dark:border-stone-700">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Quiz Performance
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
              Best attempt per quiz
            </p>
          </div>

          {quizColumns.length > 0 ? (
            <div className="divide-y divide-orange-100 dark:divide-stone-700">
              {quizColumns.map((q, idx) => {
                const cell = selectedStudent.best.get(q.id) ?? null;
                const pct =
                  cell && cell.maxScore
                    ? Math.round((cell.score / cell.maxScore) * 100)
                    : null;
                const d = pct !== null ? gradeDescriptor(pct) : null;
                const isPending = data.submissions.some(
                  (s) =>
                    s.lessonId === q.id &&
                    s.student === selectedStudent.name &&
                    s.status === "pending",
                );

                return (
                  <div key={q.id} className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-xs font-black text-stone-400 dark:text-stone-500 mt-0.5 shrink-0 w-5 text-right">
                          {idx + 1}.
                        </span>
                        <p className="text-sm font-bold text-stone-800 dark:text-stone-200 leading-snug">
                          {q.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {cell ? (
                          <>
                            <span className="text-xs text-stone-400 font-medium">
                              {cell.score}/{cell.maxScore} pts
                            </span>
                            <span
                              className={cn(
                                "text-base font-black",
                                d?.color,
                              )}
                            >
                              {pct}%
                            </span>
                            <span
                              className={cn(
                                "text-xs font-bold px-2 py-0.5 rounded-md border",
                                pct >= 90
                                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
                                  : pct >= 85
                                    ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-400 border-secondary-200 dark:border-secondary-700"
                                    : pct >= 80
                                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
                                      : pct >= 75
                                        ? "bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-500 border-accent-200 dark:border-accent-700"
                                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30",
                              )}
                            >
                              {d?.short}
                            </span>
                          </>
                        ) : isPending ? (
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Awaiting grade
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 italic">
                            Not attempted
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Score bar */}
                    <div className="pl-8">
                      <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            !cell
                              ? "w-0"
                              : pct >= 75
                                ? "bg-secondary-400"
                                : "bg-red-400",
                          )}
                          style={{ width: cell ? `${pct}%` : "0%" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-stone-400">No quizzes recorded yet.</p>
            </div>
          )}

          {/* Footer summary */}
          {selectedStudent.best.size > 0 && (
            <div className="p-5 border-t border-orange-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Overall average
                  </p>
                  <p className="text-xs text-stone-400">
                    Based on {selectedStudent.best.size} quiz
                    {selectedStudent.best.size !== 1 ? "zes" : ""} ·{" "}
                    {notAttempted.length > 0
                      ? `${notAttempted.length} not attempted`
                      : "all quizzes attempted"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-3xl font-black",
                      gradeDescriptor(selectedStudent.avgScore).color,
                    )}
                  >
                    {selectedStudent.avgScore}%
                  </span>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-black",
                        gradeDescriptor(selectedStudent.avgScore).color,
                      )}
                    >
                      {gradeDescriptor(selectedStudent.avgScore).short}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-bold",
                        gradeDescriptor(selectedStudent.avgScore).color,
                      )}
                    >
                      {gradeDescriptor(selectedStudent.avgScore).label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // ── Class list view ──────────────────────────────────────────────────────

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const displayed = sectionStudents
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let v = 0;
      if (sortKey === "name") v = a.name.localeCompare(b.name);
      else if (sortKey === "avg") v = a.avgScore - b.avgScore;
      else if (sortKey === "progress") v = a.progress - b.progress;
      else if (sortKey === "rank")
        v = (rankMap.get(a.id) ?? 99) - (rankMap.get(b.id) ?? 99);
      return sortDir === "asc" ? v : -v;
    });

  const sortTh = (label, key) => (
    <th
      key={key}
      onClick={() => toggleSort(key)}
      className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === key && (
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform",
              sortDir === "asc" && "rotate-180",
            )}
          />
        )}
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Header + search */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-white">
            Gradebook
          </h2>
          <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
            {sectionStudents.length} student
            {sectionStudents.length !== 1 ? "s" : ""} · click a student to see
            their full record
          </p>
        </div>
        <input
          type="text"
          placeholder="Search student…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-bold text-stone-900 dark:text-white placeholder:font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 dark:focus:ring-secondary-600 w-52"
        />
      </div>

      {/* Class stats */}
      {sectionStudents.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Students",
              value: sectionStudents.length,
              icon: <Users className="w-5 h-5 text-primary-500" />,
              bg: "bg-primary-50 dark:bg-primary-900/20",
            },
            {
              label: "Class Average",
              value: withData.length ? `${classAvg}%` : "—",
              icon: <BarChart3 className="w-5 h-5 text-secondary-500" />,
              bg: "bg-secondary-50 dark:bg-secondary-900/20",
            },
            {
              label: "Passed (≥ 75%)",
              value: `${passCount} / ${sectionStudents.length}`,
              icon: <CheckCircle2 className="w-5 h-5 text-accent-600" />,
              bg: "bg-accent-50 dark:bg-accent-900/20",
            },
            {
              label: "Top Score",
              value: withData.length ? `${highest}%` : "—",
              icon: <Award className="w-5 h-5 text-science-pink" />,
              bg: "bg-pink-50 dark:bg-pink-900/20",
            },
          ].map((stat, i) => (
            <Card key={i} className="p-4">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center mb-2",
                  stat.bg,
                )}
              >
                {stat.icon}
              </div>
              <p className="text-xl font-black text-stone-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-0.5">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Student roster table */}
      {sectionStudents.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800 border-b border-orange-100 dark:border-stone-700">
                  {sortTh("#", "rank")}
                  {sortTh("Student", "name")}
                  {sortTh("Progress", "progress")}
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Quizzes
                  </th>
                  {sortTh("Avg Score", "avg")}
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
                {displayed.length > 0 ? (
                  displayed.map((student) => {
                    const rank = rankMap.get(student.id) ?? "—";
                    const desc = gradeDescriptor(student.avgScore);
                    const hasPending = pendingNames.has(student.name);

                    return (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        className="cursor-pointer hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-black text-stone-400 dark:text-stone-500 w-12">
                          {rank}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-stone-900 dark:text-white">
                                {student.name}
                              </p>
                              {hasPending && (
                                <p className="text-xs font-bold text-amber-500 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Pending
                                  grade
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 min-w-25">
                            <div className="flex-1 h-1.5 rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-secondary-400 dark:bg-secondary-500 transition-all"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-stone-600 dark:text-stone-400 whitespace-nowrap">
                              {student.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                            {student.best.size}
                            <span className="text-stone-400 font-medium">
                              {" "}
                              / {quizColumns.length}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {student.best.size > 0 ? (
                            <span
                              className={cn("text-sm font-black", desc.color)}
                            >
                              {student.avgScore}%
                            </span>
                          ) : (
                            <span className="text-sm text-stone-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {student.best.size > 0 ? (
                            <span
                              className={cn("text-xs font-bold", desc.color)}
                            >
                              {desc.short}
                              <span className="hidden lg:inline text-stone-400 font-medium">
                                {" "}
                                · {desc.label}
                              </span>
                            </span>
                          ) : (
                            <span className="text-xs text-stone-400">
                              No data
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-sm text-stone-400 text-center"
                    >
                      No students match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <Star className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 dark:text-stone-400 font-medium">
            No students in this section yet.
          </p>
        </Card>
      )}
    </div>
  );
}

// Active (unlocked) games from the registry.
const ACTIVE_GAMES = Object.values(GAMES).filter((g) => !g.locked);
const TOTAL_LESSONS_COUNT = WEEKS_DATA.reduce(
  (sum, w) => sum + w.lessons.length,
  0,
);

function engagementStatus(student, hasSubs) {
  if (!hasSubs && student.progress === 0)
    return {
      label: "Not Started",
      dot: "bg-stone-300",
      text: "text-stone-500 dark:text-stone-400",
      bg: "bg-stone-100 dark:bg-stone-700/50",
    };
  if (student.avgScore > 0 && student.avgScore < 75)
    return {
      label: "Needs Help",
      dot: "bg-red-400",
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
    };
  if (student.avgScore >= 75 && student.progress >= 40)
    return {
      label: "On Track",
      dot: "bg-secondary-400",
      text: "text-secondary-600 dark:text-secondary-400",
      bg: "bg-secondary-50 dark:bg-secondary-900/20",
    };
  return {
    label: "In Progress",
    dot: "bg-blue-400",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  };
}

function ProgressSlot({ data, sectionId }) {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [sortKey, setSortKey] = useState("progress");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");
  // gameProgress: Map<studentId, Map<gameId, row[]>>
  const [gameProgress, setGameProgress] = useState(new Map());
  const [gameLoading, setGameLoading] = useState(false);

  // Fetch game data whenever the section changes.
  useEffect(() => {
    if (!sectionId) return;
    const ids = data.students
      .filter((s) => s.section === sectionId)
      .map((s) => s.id);
    if (!ids.length) return;
    let cancelled = false;
    setGameLoading(true);
    fetchGameProgressForStudents(ids)
      .then((rows) => {
        if (cancelled) return;
        const byStudent = new Map();
        for (const row of rows) {
          if (!byStudent.has(row.student_id))
            byStudent.set(row.student_id, new Map());
          const byGame = byStudent.get(row.student_id);
          if (!byGame.has(row.game_id)) byGame.set(row.game_id, []);
          byGame.get(row.game_id).push(row);
        }
        setGameProgress(byStudent);
      })
      .catch(() => {
        if (!cancelled) setGameProgress(new Map());
      })
      .finally(() => {
        if (!cancelled) setGameLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  if (!sectionId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <TrendingUp className="w-12 h-12 text-stone-300 mb-4" />
        <h2 className="text-xl font-black text-stone-700 dark:text-stone-300 mb-2">
          Select a Section
        </h2>
        <p className="text-stone-500 dark:text-stone-400 max-w-xs text-sm">
          Use the section switcher above to view student progress for a specific
          section.
        </p>
      </div>
    );
  }

  const sectionStudents = data.students.filter((s) => s.section === sectionId);

  // ── Student detail view ──────────────────────────────────────────────────
  const selectedStudent = sectionStudents.find(
    (s) => s.id === selectedStudentId,
  );

  if (selectedStudent) {
    const studentSubs = data.submissions.filter(
      (s) => s.student === selectedStudent.name && s.section === sectionId,
    );
    const studentGames = gameProgress.get(selectedStudent.id) ?? new Map();
    const lessonsCompleted = Math.round(
      (selectedStudent.progress / 100) * TOTAL_LESSONS_COUNT,
    );
    const lastSub = studentSubs[0] ?? null;
    const hasSubs = studentSubs.length > 0;
    const status = engagementStatus(selectedStudent, hasSubs);
    const pendingSubs = studentSubs.filter((s) => s.status === "pending");

    // Week-by-week quiz engagement (from student.best which tracks quiz scores)
    const weekBreakdown = WEEKS_DATA.map((week) => {
      const lessonResults = week.lessons.map((lesson) => {
        const cell = selectedStudent.best.get(lesson.id) ?? null;
        return {
          id: lesson.id,
          title: lesson.title,
          cell,
          pct:
            cell && cell.maxScore
              ? Math.round((cell.score / cell.maxScore) * 100)
              : null,
        };
      });
      const attempted = lessonResults.filter((r) => r.pct !== null).length;
      const weekAvg = attempted
        ? Math.round(
            lessonResults
              .filter((r) => r.pct !== null)
              .reduce((s, r) => s + r.pct, 0) / attempted,
          )
        : null;
      return { week, lessonResults, attempted, weekAvg };
    });

    return (
      <div className="space-y-6">
        {/* Back nav */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedStudentId(null)}
            aria-label="Back to student list"
            className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-orange-50 dark:hover:bg-stone-700 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white">
              {selectedStudent.name}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-0.5">
              Student progress · {sectionId}
            </p>
          </div>
        </div>

        {/* Profile card */}
        <Card className="p-6">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-black text-2xl shrink-0">
              {selectedStudent.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-xl font-black text-stone-900 dark:text-white">
                  {selectedStudent.name}
                </h3>
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold",
                    status.bg,
                    status.text,
                  )}
                >
                  <span
                    className={cn("w-1.5 h-1.5 rounded-full", status.dot)}
                  />
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                {sectionId}
              </p>
              {lastSub && (
                <p className="text-xs text-stone-400 font-medium mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last active: {lastSub.time}
                </p>
              )}
              {pendingSubs.length > 0 && (
                <p className="text-xs font-bold text-amber-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {pendingSubs.length} submission
                  {pendingSubs.length !== 1 ? "s" : ""} awaiting grade
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-4xl font-black text-stone-900 dark:text-white">
                {selectedStudent.progress}%
              </p>
              <p className="text-sm font-bold text-stone-500 dark:text-stone-400 mt-0.5">
                curriculum done
              </p>
            </div>
          </div>
        </Card>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Lessons Done",
              value: `${lessonsCompleted} / ${TOTAL_LESSONS_COUNT}`,
              icon: <BookOpen className="w-5 h-5 text-secondary-500" />,
              bg: "bg-secondary-50 dark:bg-secondary-900/20",
            },
            {
              label: "Quiz Attempts",
              value: studentSubs.length,
              icon: <ClipboardList className="w-5 h-5 text-primary-500" />,
              bg: "bg-primary-50 dark:bg-primary-900/20",
            },
            {
              label: "Quiz Average",
              value:
                selectedStudent.avgScore > 0
                  ? `${selectedStudent.avgScore}%`
                  : "—",
              icon: <BarChart3 className="w-5 h-5 text-accent-600" />,
              bg: "bg-accent-50 dark:bg-accent-900/20",
            },
            {
              label: "Games Played",
              value: gameLoading
                ? "…"
                : `${studentGames.size} / ${ACTIVE_GAMES.length}`,
              icon: <Gamepad2 className="w-5 h-5 text-science-pink" />,
              bg: "bg-pink-50 dark:bg-pink-900/20",
            },
          ].map((stat, i) => (
            <Card key={i} className="p-4">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center mb-2",
                  stat.bg,
                )}
              >
                {stat.icon}
              </div>
              <p className="text-xl font-black text-stone-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-0.5">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>

        {/* Curriculum progress bar */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
              Curriculum Progress
            </p>
            <span className="text-sm font-black text-stone-900 dark:text-white">
              {lessonsCompleted} of {TOTAL_LESSONS_COUNT} lessons
            </span>
          </div>
          <ProgressBar
            progress={selectedStudent.progress}
            color={
              selectedStudent.progress >= 75
                ? "secondary"
                : selectedStudent.progress >= 40
                  ? "accent"
                  : "primary"
            }
            size="sm"
          />
        </Card>

        {/* Week-by-week quiz activity */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-orange-100 dark:border-stone-700">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Week-by-Week Activity
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
              Quiz performance per week — lesson progress tracked separately
            </p>
          </div>
          <div className="divide-y divide-orange-100 dark:divide-stone-700">
            {weekBreakdown.map(({ week, attempted, weekAvg }) => {
              const d = weekAvg !== null ? gradeDescriptor(weekAvg) : null;
              return (
                <div
                  key={week.id}
                  className="px-5 py-4 flex items-center gap-4"
                >
                  <div className="w-14 shrink-0 text-center">
                    <p className="text-xs font-black text-stone-400 dark:text-stone-500 uppercase">
                      Wk {week.weekNumber}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate">
                      {week.title}
                    </p>
                    <p className="text-xs text-stone-400 font-medium mt-0.5">
                      {week.lessons.length} lesson
                      {week.lessons.length !== 1 ? "s" : ""}
                      {attempted > 0 ? ` · ${attempted} quiz${attempted !== 1 ? "zes" : ""} taken` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {weekAvg !== null ? (
                      <>
                        <p className={cn("text-sm font-black", d?.color)}>
                          {weekAvg}%
                        </p>
                        <p className={cn("text-xs font-bold", d?.color)}>
                          {d?.short}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-stone-400 italic">
                        No quiz yet
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quiz submission history */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-orange-100 dark:border-stone-700 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Quiz History
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                All attempts · newest first
              </p>
            </div>
            <span className="text-xs font-bold text-stone-400">
              {studentSubs.length} total
            </span>
          </div>
          {studentSubs.length > 0 ? (
            <div className="divide-y divide-orange-100 dark:divide-stone-700">
              {studentSubs.slice(0, 15).map((sub) => {
                const pct =
                  sub.status === "graded" && sub.total
                    ? Math.round((sub.score / sub.total) * 100)
                    : null;
                const d = pct !== null ? gradeDescriptor(pct) : null;
                return (
                  <div
                    key={sub.id}
                    className="px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          sub.status === "pending"
                            ? "bg-amber-400"
                            : pct !== null && pct >= 75
                              ? "bg-secondary-400"
                              : "bg-red-400",
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate">
                          {sub.quiz}
                        </p>
                        <p className="text-xs text-stone-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {sub.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {sub.status === "pending" ? (
                        <Badge
                          variant="outline"
                          className="text-xs text-amber-600 border-amber-300"
                        >
                          Pending
                        </Badge>
                      ) : (
                        <>
                          <span className="text-xs text-stone-400">
                            {sub.score}/{sub.total}
                          </span>
                          <span className={cn("text-sm font-black", d?.color)}>
                            {pct}%
                          </span>
                          <span className={cn("text-xs font-bold", d?.color)}>
                            {d?.short}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {studentSubs.length > 15 && (
                <p className="px-5 py-3 text-xs text-stone-400 font-medium text-center">
                  Showing 15 of {studentSubs.length} attempts
                </p>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-stone-400">No quiz attempts yet.</p>
            </div>
          )}
        </Card>

        {/* Games activity */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-orange-100 dark:border-stone-700 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Games
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                Challenges completed per game
              </p>
            </div>
            {gameLoading && (
              <Loader2 className="w-4 h-4 text-secondary-500 animate-spin" />
            )}
          </div>
          <div className="divide-y divide-orange-100 dark:divide-stone-700">
            {ACTIVE_GAMES.map((game) => {
              const rows = studentGames.get(game.id) ?? [];
              const played = rows.length > 0;
              const totalAttempts = rows.reduce(
                (sum, r) => sum + (r.attempts ?? 1),
                0,
              );
              const bestScore =
                rows.length > 0
                  ? Math.max(...rows.map((r) => r.best_score ?? 0))
                  : null;

              return (
                <div
                  key={game.id}
                  className={cn(
                    "px-5 py-4 flex items-center gap-4",
                    !played && "opacity-50",
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-700 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-5 h-5 text-stone-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                      {game.title}
                    </p>
                    <p className="text-xs text-stone-400 font-medium mt-0.5">
                      {game.category} · ~{game.estimatedMinutes} min
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {played ? (
                      <>
                        <p className="text-sm font-black text-secondary-600 dark:text-secondary-400">
                          {rows.length} challenge
                          {rows.length !== 1 ? "s" : ""} done
                        </p>
                        <p className="text-xs text-stone-400 font-medium">
                          {totalAttempts} attempt
                          {totalAttempts !== 1 ? "s" : ""}
                          {bestScore !== null ? ` · best: ${bestScore}★` : ""}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-stone-400 italic">
                        Not played yet
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  // ── Class list view ──────────────────────────────────────────────────────

  const progressRankMap = new Map(
    [...sectionStudents]
      .sort((a, b) => b.progress - a.progress)
      .map((s, i) => [s.id, i + 1]),
  );

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const displayed = sectionStudents
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let v = 0;
      if (sortKey === "name") v = a.name.localeCompare(b.name);
      else if (sortKey === "progress") v = a.progress - b.progress;
      else if (sortKey === "avg") v = a.avgScore - b.avgScore;
      else if (sortKey === "attempts")
        v =
          data.submissions.filter(
            (s) => s.student === a.name && s.section === sectionId,
          ).length -
          data.submissions.filter(
            (s) => s.student === b.name && s.section === sectionId,
          ).length;
      else if (sortKey === "games")
        v =
          (gameProgress.get(a.id)?.size ?? 0) -
          (gameProgress.get(b.id)?.size ?? 0);
      return sortDir === "asc" ? v : -v;
    });

  // Class-level stats
  const withActivity = sectionStudents.filter(
    (s) => s.progress > 0 || s.best.size > 0,
  );
  const avgProgress = withActivity.length
    ? Math.round(
        withActivity.reduce((sum, s) => sum + s.progress, 0) /
          withActivity.length,
      )
    : 0;
  const needsHelp = sectionStudents.filter(
    (s) => s.avgScore > 0 && s.avgScore < 75,
  ).length;
  const notStarted = sectionStudents.filter(
    (s) =>
      s.progress === 0 &&
      !data.submissions.some(
        (sub) => sub.student === s.name && sub.section === sectionId,
      ),
  ).length;

  const sortTh = (label, key) => (
    <th
      key={key}
      onClick={() => toggleSort(key)}
      className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === key && (
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform",
              sortDir === "asc" && "rotate-180",
            )}
          />
        )}
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Header + search */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-white">
            Student Progress
          </h2>
          <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
            {sectionStudents.length} student
            {sectionStudents.length !== 1 ? "s" : ""} · click a student for
            their full activity record
          </p>
        </div>
        <input
          type="text"
          placeholder="Search student…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-bold text-stone-900 dark:text-white placeholder:font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 dark:focus:ring-secondary-600 w-52"
        />
      </div>

      {/* Section summary cards */}
      {sectionStudents.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Students",
              value: sectionStudents.length,
              icon: <Users className="w-5 h-5 text-primary-500" />,
              bg: "bg-primary-50 dark:bg-primary-900/20",
            },
            {
              label: "Avg Progress",
              value: withActivity.length ? `${avgProgress}%` : "—",
              icon: <TrendingUp className="w-5 h-5 text-secondary-500" />,
              bg: "bg-secondary-50 dark:bg-secondary-900/20",
            },
            {
              label: "Need Help",
              value: needsHelp,
              icon: <AlertCircle className="w-5 h-5 text-red-500" />,
              bg: "bg-red-50 dark:bg-red-900/20",
            },
            {
              label: "Not Started",
              value: notStarted,
              icon: <Clock className="w-5 h-5 text-stone-400" />,
              bg: "bg-stone-100 dark:bg-stone-700/50",
            },
          ].map((stat, i) => (
            <Card key={i} className="p-4">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center mb-2",
                  stat.bg,
                )}
              >
                {stat.icon}
              </div>
              <p className="text-xl font-black text-stone-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-0.5">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Student table */}
      {sectionStudents.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800 border-b border-orange-100 dark:border-stone-700">
                  {sortTh("#", "rank")}
                  {sortTh("Student", "name")}
                  {sortTh("Progress", "progress")}
                  {sortTh("Quiz Attempts", "attempts")}
                  {sortTh("Quiz Avg", "avg")}
                  {sortTh("Games", "games")}
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
                {displayed.length > 0 ? (
                  displayed.map((student) => {
                    const rank = progressRankMap.get(student.id) ?? "—";
                    const studentSubs = data.submissions.filter(
                      (s) =>
                        s.student === student.name && s.section === sectionId,
                    );
                    const gamesPlayed =
                      gameProgress.get(student.id)?.size ?? 0;
                    const status = engagementStatus(
                      student,
                      studentSubs.length > 0,
                    );
                    const desc =
                      student.avgScore > 0
                        ? gradeDescriptor(student.avgScore)
                        : null;

                    return (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        className="cursor-pointer hover:bg-orange-50/50 dark:hover:bg-stone-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-black text-stone-400 dark:text-stone-500 w-12">
                          {rank}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <p className="text-sm font-bold text-stone-900 dark:text-white">
                              {student.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 min-w-25">
                            <div className="flex-1 h-1.5 rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-secondary-400 dark:bg-secondary-500 transition-all"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-stone-600 dark:text-stone-400 whitespace-nowrap">
                              {student.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                            {studentSubs.length}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {desc ? (
                            <span
                              className={cn("text-sm font-black", desc.color)}
                            >
                              {student.avgScore}%
                            </span>
                          ) : (
                            <span className="text-sm text-stone-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {gameLoading ? (
                            <Loader2 className="w-3 h-3 text-stone-400 animate-spin" />
                          ) : (
                            <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                              {gamesPlayed}
                              <span className="text-stone-400 font-medium">
                                {" "}
                                / {ACTIVE_GAMES.length}
                              </span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full",
                              status.bg,
                              status.text,
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                status.dot,
                              )}
                            />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-sm text-stone-400 text-center"
                    >
                      No students match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <TrendingUp className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 dark:text-stone-400 font-medium">
            No students in this section yet.
          </p>
        </Card>
      )}
    </div>
  );
}

function SettingsSlot() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mb-4">
        <Settings className="w-8 h-8 text-stone-400" />
      </div>
      <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">
        Settings
      </h2>
      <p className="text-stone-500 dark:text-stone-400 max-w-md">
        Account settings and preferences will be available here soon.
      </p>
    </div>
  );
}

// --- Grade modal ---
// Opened by any "Grade" button. The teacher enters an overall percentage;
// it's converted to a score + XP (see previewGrade) and written to the
// attempt, which automatically lifts the student's leaderboard / profile XP.

function GradeModal({ submission, onClose, onSaved }) {
  const maxScore = submission.total ?? 0;
  const quiz = getQuizByLesson(submission.lessonId);
  const initialPct =
    submission.status === "graded" && maxScore > 0
      ? String(Math.round((submission.score / maxScore) * 100))
      : "";
  const [percent, setPercent] = useState(initialPct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const hasValue = percent !== "" && !Number.isNaN(Number(percent));
  const { pct, score, xp } = previewGrade(percent, maxScore);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await gradeQuizAttempt({
        attemptId: submission.id,
        percent: pct,
        maxScore,
      });
      onSaved();
    } catch (err) {
      setError(err.message ?? "Failed to save grade");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-orange-100 dark:border-stone-700">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-orange-100 dark:border-stone-700 shrink-0">
          <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-white">
              Grade Submission
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Review what the student submitted, then enter a percentage
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body: submission summary + answer review */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500 dark:text-stone-400 font-medium">
                Student
              </span>
              <span className="font-bold text-stone-900 dark:text-white">
                {submission.student}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 dark:text-stone-400 font-medium">
                Activity
              </span>
              <span className="font-bold text-stone-900 dark:text-white text-right">
                {submission.quiz}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 dark:text-stone-400 font-medium">
                Submitted
              </span>
              <span className="font-bold text-stone-900 dark:text-white">
                {submission.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 dark:text-stone-400 font-medium">
                Current
              </span>
              <span className="font-bold text-stone-900 dark:text-white">
                {submission.status === "graded"
                  ? `${submission.score}/${maxScore}`
                  : "Ungraded"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
              Student's submission
            </h3>
            <QuizAnswersReview quiz={quiz} answers={submission.answers} />
          </div>

          {/* Rubric reference — shown only when the quiz has grading criteria */}
          {getRubricItems(submission.lessonId).length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
                Rubric / Answer Guide
              </h3>
              <div className="space-y-3">
                {getRubricItems(submission.lessonId).map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-100 dark:border-secondary-800/30"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-xs font-bold",
                          MANUAL_TYPE_META[item.type]?.className,
                        )}
                      >
                        {MANUAL_TYPE_META[item.type]?.label ?? item.type}
                      </span>
                      {item.points !== null && (
                        <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400">
                          {item.points} pts
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-1.5 leading-snug">
                      Q{idx + 1}:{" "}
                      {item.question.length > 90
                        ? item.question.slice(0, 90) + "…"
                        : item.question}
                    </p>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {item.rubric}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: grade input + XP preview + actions */}
        <div className="border-t border-orange-100 dark:border-stone-700 p-6 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label
                htmlFor="grade-percent"
                className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5"
              >
                Grade (%)
              </label>
              <div className="relative">
                <input
                  id="grade-percent"
                  type="number"
                  min={0}
                  max={100}
                  value={percent}
                  autoFocus
                  onChange={(e) => setPercent(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm font-bold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-400 dark:focus:ring-secondary-600"
                  placeholder="0–100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400 pointer-events-none">
                  %
                </span>
              </div>
            </div>
            {hasValue && (
              <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-100 dark:border-secondary-800/30 px-4 py-2.5 sm:py-3">
                <span className="text-sm font-bold text-stone-600 dark:text-stone-300">
                  Score {Math.round(pct)}/100
                </span>
                <span className="text-sm font-black text-secondary-600 dark:text-secondary-400">
                  +{xp} XP
                </span>
              </div>
            )}
          </div>

          {error && (
            <p className="mt-3 text-sm font-bold text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleSave}
              disabled={!hasValue || saving}
              isLoading={saving}
            >
              Save Grade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lets a teacher attach (or clear) a time limit on a single quiz. Choices are
// human-friendly minute buckets plus a custom field; "No timer" clears any
// existing limit. The control writes through to Supabase so other devices
// pick up the change via the realtime subscription.
const TIMER_PRESETS_MIN = [0, 5, 10, 15, 20, 30, 45, 60];

function QuizTimerControl({ lessonId, currentSeconds }) {
  const currentMin = currentSeconds ? Math.round(currentSeconds / 60) : 0;
  const isPreset = TIMER_PRESETS_MIN.includes(currentMin);
  const [selection, setSelection] = useState(() =>
    isPreset ? String(currentMin) : "custom",
  );
  const [customMin, setCustomMin] = useState(() =>
    isPreset ? "" : String(currentMin || ""),
  );
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const min = currentSeconds ? Math.round(currentSeconds / 60) : 0;
    if (TIMER_PRESETS_MIN.includes(min)) {
      setSelection(String(min));
      setCustomMin("");
    } else {
      setSelection("custom");
      setCustomMin(String(min));
    }
  }, [currentSeconds]);

  async function commit(nextSeconds) {
    setSaving(true);
    try {
      await saveQuizTimeLimit(lessonId, nextSeconds);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    } catch (err) {
      console.error("Failed to save quiz timer:", err);
    } finally {
      setSaving(false);
    }
  }

  function handlePresetChange(e) {
    const val = e.target.value;
    setSelection(val);
    if (val === "custom") return;
    const min = Number(val);
    commit(min > 0 ? min * 60 : null);
  }

  function handleCustomCommit() {
    const min = Number(customMin);
    if (!Number.isFinite(min) || min <= 0) {
      commit(null);
      return;
    }
    commit(Math.round(min) * 60);
  }

  return (
    <div className="pt-3 border-t border-orange-100 dark:border-stone-700">
      <label
        htmlFor={`timer-${lessonId}`}
        className="flex items-center gap-1.5 text-xs font-bold text-stone-500 dark:text-stone-400 mb-1.5"
      >
        <Clock className="w-3.5 h-3.5" />
        Time limit
      </label>
      <div className="flex items-center gap-1.5">
        <select
          id={`timer-${lessonId}`}
          value={selection}
          onChange={handlePresetChange}
          disabled={saving}
          className="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-secondary-400"
        >
          <option value="0">No timer</option>
          {TIMER_PRESETS_MIN.filter((m) => m > 0).map((m) => (
            <option key={m} value={String(m)}>
              {m} min
            </option>
          ))}
          <option value="custom">Custom…</option>
        </select>
        {selection === "custom" && (
          <>
            <input
              type="number"
              min="1"
              step="1"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              onBlur={handleCustomCommit}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              placeholder="min"
              disabled={saving}
              className="w-16 px-2 py-1.5 rounded-lg border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-secondary-400"
            />
            <span className="text-xs font-bold text-stone-400">min</span>
          </>
        )}
        {savedFlash && (
          <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400">
            Saved
          </span>
        )}
      </div>
      <p className="text-[10px] font-medium text-stone-400 dark:text-stone-500 mt-1">
        {currentSeconds
          ? "Quiz auto-submits when the timer runs out."
          : "Students get unlimited time."}
      </p>
    </div>
  );
}

// Attempts presets shown in the dropdown. "0" is rendered as "Unlimited".
const ATTEMPTS_PRESETS = [1, 2, 3, 4, 5];

function QuizAttemptsControl({ lessonId, currentAttempts }) {
  // null = unlimited (saved value); the <select> uses "0" for that.
  const [selection, setSelection] = useState(() =>
    currentAttempts == null ? "0" : String(currentAttempts),
  );
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setSelection(currentAttempts == null ? "0" : String(currentAttempts));
  }, [currentAttempts]);

  async function commit(value) {
    setSaving(true);
    try {
      await saveQuizMaxAttempts(lessonId, value);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    } catch (err) {
      console.error("Failed to save quiz attempts:", err);
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    const val = e.target.value;
    setSelection(val);
    const n = Number(val);
    commit(n > 0 ? n : null);
  }

  return (
    <div className="pt-3 border-t border-orange-100 dark:border-stone-700">
      <label
        htmlFor={`attempts-${lessonId}`}
        className="flex items-center gap-1.5 text-xs font-bold text-stone-500 dark:text-stone-400 mb-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Attempts
      </label>
      <div className="flex items-center gap-1.5">
        <select
          id={`attempts-${lessonId}`}
          value={selection}
          onChange={handleChange}
          disabled={saving}
          className="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-secondary-400"
        >
          {ATTEMPTS_PRESETS.map((n) => (
            <option key={n} value={String(n)}>
              {n} {n === 1 ? "attempt" : "attempts"}
            </option>
          ))}
          <option value="0">Unlimited</option>
        </select>
        {savedFlash && (
          <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400">
            Saved
          </span>
        )}
      </div>
      <p className="text-[10px] font-medium text-stone-400 dark:text-stone-500 mt-1">
        XP scales 100% / 50% / 25% across the first 3 attempts. Anything
        beyond attempt 3 earns no XP.
      </p>
    </div>
  );
}

function QuizShowAnswersControl({ lessonId, currentShow }) {
  // currentShow defaults to true upstream — treat undefined as on.
  const enabled = currentShow !== false;
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  async function handleToggle() {
    if (saving) return;
    setSaving(true);
    try {
      await saveQuizShowAnswers(lessonId, !enabled);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    } catch (err) {
      console.error("Failed to save show-answers setting:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pt-3 border-t border-orange-100 dark:border-stone-700">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={`show-answers-${lessonId}`}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-500 dark:text-stone-400"
        >
          {enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          Show correct answers
        </label>
        <button
          id={`show-answers-${lessonId}`}
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Show correct answers after submit"
          onClick={handleToggle}
          disabled={saving}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-400",
            enabled
              ? "bg-secondary-500 border-secondary-500"
              : "bg-stone-200 dark:bg-stone-700 border-stone-300 dark:border-stone-600",
            saving && "opacity-60 cursor-not-allowed",
          )}
        >
          <span
            className={cn(
              "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-[2px]",
            )}
          />
        </button>
      </div>
      <p className="text-[10px] font-medium text-stone-400 dark:text-stone-500 mt-1 flex items-center gap-1.5">
        {enabled
          ? "Per-question review reveals the right answer after submit."
          : "Results screen hides the per-question review."}
        {savedFlash && (
          <span className="text-secondary-600 dark:text-secondary-400 font-bold">
            Saved
          </span>
        )}
      </p>
    </div>
  );
}

const QUIZ_TYPE_LABELS = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True/False",
  matching: "Matching",
  ordering: "Ordering",
  identification: "Identification",
  "fill-in-the-blanks": "Fill in Blanks",
  "picture-based": "Picture Based",
  essay: "Essay",
  "short-answer": "Short Answer",
  "case-study": "Case Study",
};

function QuizzesManagementSlot({
  data,
  sectionId,
  publishedQuizWeekIds,
  onPublishedQuizWeekIdsChange,
  quizSettings,
}) {
  const [expandedWeekId, setExpandedWeekId] = useState(null);
  const [search, setSearch] = useState("");

  function togglePublish(weekId) {
    const base = publishedQuizWeekIds ?? new Set(WEEKS_DATA.map((w) => w.id));
    const next = new Set(base);
    if (next.has(weekId)) {
      next.delete(weekId);
    } else {
      next.add(weekId);
    }
    onPublishedQuizWeekIdsChange(next);
  }

  const activityById = new Map(data.lessons.map((l) => [l.id, l]));

  function getCompletion(lessonId) {
    const activity = activityById.get(lessonId);
    if (!activity) return 0;
    if (sectionId) return activity.completion[sectionId] ?? 0;
    const vals = Object.values(activity.completion);
    return vals.length
      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      : 0;
  }

  const expandedWeek = WEEKS_DATA.find((w) => w.id === expandedWeekId) ?? null;
  const q = search.toLowerCase();

  const filteredWeeks = q
    ? WEEKS_DATA.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.category?.toLowerCase().includes(q) ||
          String(w.weekNumber).includes(q) ||
          w.lessons.some((l) => {
            const quiz = getQuizByLesson(l.id);
            return (
              l.title.toLowerCase().includes(q) ||
              quiz?.title?.toLowerCase().includes(q) ||
              quiz?.description?.toLowerCase().includes(q)
            );
          }),
      )
    : WEEKS_DATA;

  const filteredLessons = expandedWeek
    ? q
      ? expandedWeek.lessons.filter((l) => {
          const quiz = getQuizByLesson(l.id);
          return (
            l.title.toLowerCase().includes(q) ||
            quiz?.title?.toLowerCase().includes(q) ||
            quiz?.description?.toLowerCase().includes(q)
          );
        })
      : expandedWeek.lessons
    : [];

  return (
    <div className="space-y-8">
      {expandedWeek ? (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => { setExpandedWeekId(null); setSearch(""); }}
              aria-label="Back to weeks"
              className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-orange-50 dark:hover:bg-stone-700 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                Week {expandedWeek.weekNumber} — {expandedWeek.title}
              </h2>
              <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-0.5">
                {expandedWeek.lessons.length}{" "}
                {expandedWeek.lessons.length === 1 ? "quiz" : "quizzes"}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search quizzes…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-bold text-stone-900 dark:text-white placeholder:font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 dark:focus:ring-secondary-600 w-40"
                />
              </div>
              <button
                onClick={() => togglePublish(expandedWeek.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-colors",
                  isWeekPublished(expandedWeek.id, publishedQuizWeekIds)
                    ? "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 border-secondary-200 dark:border-secondary-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700 hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-200",
                )}
              >
                {isWeekPublished(expandedWeek.id, publishedQuizWeekIds) ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hidden
                  </>
                )}
              </button>
            </div>
          </div>

          {filteredLessons.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLessons.map((lesson) => {
                const pct = getCompletion(lesson.id);
                const quiz = getQuizByLesson(lesson.id);
                const types = quiz?.questions
                  ? [...new Set(quiz.questions.map((qs) => qs.type))]
                  : [];
                const published = isWeekPublished(
                  expandedWeek.id,
                  publishedQuizWeekIds,
                );
                const currentLimit = getQuizTimeLimit(quizSettings, lesson.id);
                const currentAttempts = getQuizMaxAttempts(quizSettings, lesson.id);
                const currentShow = getQuizShowAnswers(quizSettings, lesson.id);
                return (
                  <Card key={lesson.id} className="p-5" hoverable>
                    <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center mb-4">
                      <ClipboardCheck className="w-5 h-5 text-accent-500" />
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white leading-snug">
                        {quiz?.title ?? lesson.title}
                      </h3>
                      <Badge
                        variant={published ? "secondary" : "outline"}
                        className="text-xs shrink-0"
                      >
                        {published ? "Published" : "Hidden"}
                      </Badge>
                    </div>
                    {quiz?.description && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-2 leading-relaxed line-clamp-2">
                        {quiz.description}
                      </p>
                    )}
                    {types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {types.map((type) => (
                          <span
                            key={type}
                            className="px-1.5 py-0.5 rounded text-xs font-bold bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
                          >
                            {QUIZ_TYPE_LABELS[type] ?? type}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-stone-400 dark:text-stone-500 mb-3">
                      {quiz?.questions?.length ?? 0}{" "}
                      {quiz?.questions?.length === 1 ? "question" : "questions"}
                    </p>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                        <span>Completion</span>
                        <span>{pct}%</span>
                      </div>
                      <ProgressBar progress={pct} color="secondary" size="sm" />
                    </div>
                    <QuizTimerControl
                      lessonId={lesson.id}
                      currentSeconds={currentLimit}
                    />
                    <QuizAttemptsControl
                      lessonId={lesson.id}
                      currentAttempts={currentAttempts}
                    />
                    <QuizShowAnswersControl
                      lessonId={lesson.id}
                      currentShow={currentShow}
                    />
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-8 h-8 text-stone-300 mb-3" />
              <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">
                No quizzes match your search.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                Quizzes
              </h2>
              <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
                All weeks · click a week to manage its quizzes
              </p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search weeks or quizzes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-bold text-stone-900 dark:text-white placeholder:font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 dark:focus:ring-secondary-600 w-52"
              />
            </div>
          </div>

          {filteredWeeks.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWeeks.map((week) => {
                const avgPct = week.lessons.length
                  ? Math.round(
                      week.lessons.reduce(
                        (sum, l) => sum + getCompletion(l.id),
                        0,
                      ) / week.lessons.length,
                    )
                  : 0;
                const published = isWeekPublished(week.id, publishedQuizWeekIds);
                return (
                  <Card
                    key={week.id}
                    className={cn(
                      "p-5 transition-opacity",
                      published ? "cursor-pointer" : "opacity-60",
                    )}
                    hoverable={published}
                    onClick={
                      published
                        ? () => { setExpandedWeekId(week.id); setSearch(""); }
                        : undefined
                    }
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center">
                        <ClipboardCheck className="w-5 h-5 text-accent-500" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePublish(week.id);
                        }}
                        className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border transition-colors",
                          published
                            ? "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 border-secondary-200 dark:border-secondary-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700 hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-200",
                        )}
                        title={published ? "Click to hide" : "Click to publish"}
                        aria-label={
                          published
                            ? `Hide quizzes for week ${week.weekNumber}`
                            : `Publish quizzes for week ${week.weekNumber}`
                        }
                      >
                        {published ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {published ? "Published" : "Hidden"}
                      </button>
                    </div>
                    <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1 block">
                      Week {week.weekNumber}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                      {week.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                      {week.lessons.length}{" "}
                      {week.lessons.length === 1 ? "quiz" : "quizzes"}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                        <span>Avg completion</span>
                        <span>{avgPct}%</span>
                      </div>
                      <ProgressBar
                        progress={avgPct}
                        color="secondary"
                        size="sm"
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-8 h-8 text-stone-300 mb-3" />
              <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">
                No weeks match your search.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Slot map ---

const TAB_SLOTS = {
  overview: OverviewSlot,
  sections: SectionsSlot,
  lessons: LessonsSlot,
  "quiz-management": QuizzesManagementSlot,
  quizzes: QuizCheckingSlot,
  gradebook: GradebookSlot,
  progress: ProgressSlot,
  settings: SettingsSlot,
};

const SIDEBAR_TABS = [
  {
    id: "overview",
    label: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  { id: "sections", label: "My Sections", icon: <Users className="w-5 h-5" /> },
  { id: "lessons", label: "Lessons", icon: <BookOpen className="w-5 h-5" /> },
  {
    id: "quiz-management",
    label: "Quizzes",
    icon: <ClipboardCheck className="w-5 h-5" />,
  },
  {
    id: "quizzes",
    label: "Quiz Checking",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  { id: "gradebook", label: "Gradebook", icon: <Star className="w-5 h-5" /> },
  {
    id: "progress",
    label: "Student Progress",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

// --- Main page ---

export function TeacherPortalPage({ onBack }) {
  const { signOut, profile, user } = useAuth();
  const { isDark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [gradingSub, setGradingSub] = useState(null);
  const dropdownRef = useRef(null);

  const storageKey = `sq_teacher_sections_${user?.id ?? "guest"}`;
  const [mySectionNames, setMySectionNamesState] = useState(() => {
    try {
      const val = localStorage.getItem(
        `sq_teacher_sections_${user?.id ?? "guest"}`,
      );
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  });

  function setMySectionNames(next) {
    setMySectionNamesState(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const [publishedWeekIds, setPublishedWeekIdsState] = useState(() =>
    getPublishedWeekIds(),
  );

  function setPublishedWeekIds(ids) {
    setPublishedWeekIdsState(ids);
    savePublishedWeekIds(ids).catch((err) => {
      console.error("Failed to save published week ids:", err);
    });
  }

  const [publishedQuizWeekIds, setPublishedQuizWeekIdsState] = useState(() =>
    getPublishedQuizWeekIds(),
  );

  function setPublishedQuizWeekIds(ids) {
    setPublishedQuizWeekIdsState(ids);
    savePublishedQuizWeekIds(ids).catch((err) => {
      console.error("Failed to save published quiz week ids:", err);
    });
  }

  const [openWeekIds, setOpenWeekIdsState] = useState(() => getOpenWeekIds());

  function setOpenWeekIds(ids) {
    setOpenWeekIdsState(ids);
    saveOpenWeekIds(ids).catch((err) => {
      console.error("Failed to save open week ids:", err);
    });
  }

  const [quizSettings, setQuizSettings] = useState(() => getCachedQuizSettings());

  // Hydrate global settings from Supabase on mount, then subscribe so other
  // teachers' edits show up live in this portal too.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchPublishedWeekIds(),
      fetchPublishedQuizWeekIds(),
      fetchOpenWeekIds(),
      fetchQuizSettings(),
    ])
      .then(([lessons, quizzes, open, settings]) => {
        if (cancelled) return;
        setPublishedWeekIdsState(lessons);
        setPublishedQuizWeekIdsState(quizzes);
        setOpenWeekIdsState(open);
        setQuizSettings(settings);
      })
      .catch((err) => console.error("Failed to load course settings:", err));

    const unsubPublish = subscribeToPublishedState((scope, ids) => {
      if (scope === "lessons") setPublishedWeekIdsState(ids);
      else if (scope === "quizzes") setPublishedQuizWeekIdsState(ids);
      else if (scope === "open") setOpenWeekIdsState(ids);
    });
    const unsubQuiz = subscribeToQuizSettings(() => {
      fetchQuizSettings().then((m) => { if (!cancelled) setQuizSettings(m); }).catch(() => {});
    });

    return () => {
      cancelled = true;
      unsubPublish();
      unsubQuiz();
    };
  }, []);

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchTeacherDashboard()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err.message ?? "Failed to load dashboard");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Silent re-fetch after a grade is saved — no spinner, the table just
  // updates in place and the submission flips from pending to graded.
  async function refreshDashboard() {
    try {
      setData(await fetchTeacherDashboard());
    } catch (err) {
      setLoadError(err.message ?? "Failed to load dashboard");
    }
  }

  function handleGraded() {
    setGradingSub(null);
    refreshDashboard();
  }

  const teacherName = profile
    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
      "Teacher"
    : "Teacher";

  const ActiveSlot = TAB_SLOTS[activeTab] ?? OverviewSlot;
  const allSections = data?.sections ?? [];
  const sections =
    mySectionNames !== null
      ? mySectionNames.map(
          (name) =>
            allSections.find((s) => s.name === name) ?? { id: name, name, students: 0, avgScore: 0 },
        )
      : allSections;

  // Scope all slot data to only the teacher's assigned sections so "All"
  // aggregates across their sections only, not the entire database.
  const mySectionIds = new Set(sections.map((s) => s.id));
  const slotData = data
    ? {
        ...data,
        sections,
        submissions: data.submissions.filter((s) =>
          mySectionIds.has(s.section),
        ),
        students: data.students.filter((s) => mySectionIds.has(s.section)),
      }
    : null;

  return (
    <div className="min-h-screen font-body text-stone-800 dark:text-stone-100 bg-[#fdf6e3] dark:bg-stone-900">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-orange-200/50 dark:border-stone-700 shadow-warm bg-[rgba(255,251,245,0.85)] dark:bg-stone-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg text-secondary-600 dark:text-secondary-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-heading font-black text-lg text-stone-900 dark:text-white">
                Teacher Portal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
                className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 flex items-center justify-center font-bold text-sm">
                    {teacherName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-stone-700 dark:text-stone-300 hidden sm:inline">
                    {teacherName}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-stone-500 transition-transform duration-200",
                      profileOpen && "rotate-180",
                    )}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-orange-100 dark:border-stone-700 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-orange-100 dark:border-stone-700">
                      <p className="text-sm font-black text-stone-900 dark:text-white">
                        {teacherName}
                      </p>
                      {profile?.email && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                          {profile.email}
                        </p>
                      )}
                      <span className="inline-block mt-1.5 text-xs font-bold text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/30 px-2 py-0.5 rounded-md">
                        Teacher
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        onBack();
                      }}
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
          <div className="w-full md:w-60 shrink-0">
            <Card className="p-3 sticky top-24">
              <div className="space-y-1">
                {SIDEBAR_TABS.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors",
                      activeTab === id
                        ? "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400"
                        : "text-stone-600 dark:text-stone-400 hover:bg-orange-50 dark:hover:bg-stone-700 hover:text-secondary-600 dark:hover:text-secondary-400",
                    )}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab !== "settings" && !loading && !loadError && (
              <div className="mb-6 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mr-1">
                  Section
                </span>
                {[{ id: null, name: "All" }, ...sections].map((s) => (
                  <button
                    key={s.id ?? "all"}
                    onClick={() => setSelectedSectionId(s.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap",
                      selectedSectionId === s.id
                        ? "bg-secondary-600 text-white shadow-sm"
                        : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-orange-200 dark:border-stone-600 hover:border-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-400",
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Loader2 className="w-10 h-10 text-secondary-500 animate-spin mb-4" />
                <p className="text-sm font-bold text-stone-500 dark:text-stone-400">
                  Loading dashboard…
                </p>
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
                <h2 className="text-lg font-black text-stone-700 dark:text-stone-300 mb-1">
                  Couldn't load data
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xs">
                  {loadError}
                </p>
              </div>
            ) : activeTab === "settings" ? (
              <SettingsSlot />
            ) : (
              <ActiveSlot
                data={slotData}
                sectionId={selectedSectionId}
                onGrade={setGradingSub}
                onViewSection={(id) => setSelectedSectionId(id)}
                onRefresh={refreshDashboard}
                mySectionNames={mySectionNames}
                onSectionNamesChange={setMySectionNames}
                publishedWeekIds={publishedWeekIds}
                onPublishedWeekIdsChange={setPublishedWeekIds}
                openWeekIds={openWeekIds}
                onOpenWeekIdsChange={setOpenWeekIds}
                publishedQuizWeekIds={publishedQuizWeekIds}
                onPublishedQuizWeekIdsChange={setPublishedQuizWeekIds}
                quizSettings={quizSettings}
              />
            )}
          </div>
        </div>
      </div>

      {gradingSub && (
        <GradeModal
          submission={gradingSub}
          onClose={() => setGradingSub(null)}
          onSaved={handleGraded}
        />
      )}
    </div>
  );
}
