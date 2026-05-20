import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Users,
  BarChart3,
  ClipboardList,
  Settings,
  Plus,
  Eye,
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
  fetchDistinctSections,
  removeStudentFromSection,
} from "../lib/teacher";
import { QuizAnswersReview } from "../components/QuizAnswersReview";
import { getQuizByLesson } from "../data/quizzesweek-01";
import { WEEKS_DATA } from "../data/lessonsweek-01";

// --- Slot components ---
// Every slot receives the fetched `data` bundle plus the active sectionId
// (null = all sections).

function OverviewSlot({ data, sectionId, onGrade }) {
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
  const activeLessons = sectionId
    ? lessons.filter((l) => (l.completion[sectionId] ?? 0) > 0).length
    : lessons.length;
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
            label: "Active Lessons",
            value: activeLessons,
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

  useEffect(() => {
    const exclude = existingSectionNames;
    fetchDistinctSections()
      .then((names) => {
        setDbSections(names.filter((n) => !exclude.includes(n)));
        setLoadingDb(false);
      })
      .catch(() => setLoadingDb(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canAdd = mode === "existing" ? !!selected : newName.trim().length > 0;

  function handleAdd() {
    const name = mode === "existing" ? selected : newName.trim();
    if (!name) return;
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
                onClick={() => setMode(opt.id)}
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
                {dbSections.map((name) => (
                  <button
                    key={name}
                    onClick={() => setSelected(selected === name ? null : name)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors",
                      selected === name
                        ? "border-secondary-400 bg-secondary-50 dark:bg-stone-700 dark:border-secondary-500"
                        : "border-orange-100 dark:border-stone-600 hover:bg-orange-50/50 dark:hover:bg-stone-700",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                        selected === name
                          ? "border-secondary-500 bg-secondary-500"
                          : "border-stone-300 dark:border-stone-500",
                      )}
                    >
                      {selected === name && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {name}
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
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canAdd && handleAdd()}
                placeholder="e.g. Section A, Grade 7-Narra"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm font-bold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-400 dark:focus:ring-secondary-600"
              />
            </div>
          )}
        </div>

        <div className="border-t border-orange-100 dark:border-stone-700 p-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleAdd}
            disabled={!canAdd}
          >
            Add Section
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

function LessonsSlot({ data, sectionId }) {
  const [expandedWeekId, setExpandedWeekId] = useState(null);

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

  const expandedWeek =
    WEEKS_DATA.find((w) => w.id === expandedWeekId) ?? null;

  return (
    <div className="space-y-8">
      {expandedWeek ? (
        // ── Lesson cards for the selected week ──
        <>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpandedWeekId(null)}
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
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expandedWeek.lessons.map((lesson) => {
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
        </>
      ) : (
        // ── Week cards ──
        <>
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white">
              Lessons
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
              All weeks · click a week to see its lessons
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WEEKS_DATA.map((week) => {
              const avgPct = week.lessons.length
                ? Math.round(
                    week.lessons.reduce(
                      (sum, l) => sum + getCompletion(l.id),
                      0,
                    ) / week.lessons.length,
                  )
                : 0;
              return (
                <Card
                  key={week.id}
                  className="p-5 cursor-pointer"
                  hoverable
                  onClick={() => setExpandedWeekId(week.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-secondary-500" />
                    </div>
                    <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                      Week {week.weekNumber}
                    </span>
                  </div>
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
                    <ProgressBar progress={avgPct} color="secondary" size="sm" />
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function QuizCheckingSlot({ data, sectionId, onGrade }) {
  const allSubs = sectionId
    ? data.submissions.filter((s) => s.section === sectionId)
    : data.submissions;
  const pending = allSubs.filter((s) => s.status === "pending");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-stone-900 dark:text-white">
          Quiz Checking
        </h2>
        <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
          Review and grade pending quiz submissions
        </p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Needs Grading ({pending.length})
          </h3>
          {pending.map((sub) => (
            <Card
              key={sub.id}
              className="p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
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
                <span className="text-xs text-stone-400 font-medium hidden sm:flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {sub.time}
                </span>
                <Badge
                  variant="outline"
                  className="text-xs text-amber-600 border-amber-300"
                >
                  Pending
                </Badge>
                <Button size="sm" onClick={() => onGrade(sub)}>
                  Grade
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          All Submissions
        </h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800 border-b border-orange-100 dark:border-stone-700">
                  {["Student", "Quiz", "Score", "Status", "Submitted"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
                {allSubs.length > 0 ? (
                  allSubs.map((sub) => (
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
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-500 dark:text-stone-400">
                        {sub.time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
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
      </div>
    </div>
  );
}

function GradebookSlot({ data, sectionId }) {
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

  const students = data.students.filter((s) => s.section === sectionId);
  const { quizColumns } = data;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-stone-900 dark:text-white">
          Gradebook
        </h2>
        <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
          Best quiz scores for selected section
        </p>
      </div>

      {students.length > 0 && quizColumns.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800 border-b border-orange-100 dark:border-stone-700">
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Student
                  </th>
                  {quizColumns.map((q) => (
                    <th
                      key={q.id}
                      className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider"
                    >
                      {q.title}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Average
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 dark:divide-stone-700">
                {students.map((student) => {
                  const cells = quizColumns.map(
                    (q) => student.best.get(q.id) ?? null,
                  );
                  const taken = cells.filter(Boolean);
                  const avg = taken.length
                    ? Math.round(
                        (taken.reduce(
                          (sum, c) =>
                            sum + (c.maxScore ? c.score / c.maxScore : 0),
                          0,
                        ) /
                          taken.length) *
                          100,
                      )
                    : 0;
                  return (
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
                      {cells.map((cell, i) => (
                        <td key={i} className="px-6 py-4">
                          {cell ? (
                            <span
                              className={cn(
                                "text-sm font-black",
                                cell.score >= cell.maxScore * 0.8
                                  ? "text-secondary-600"
                                  : cell.score >= cell.maxScore * 0.6
                                    ? "text-accent-600"
                                    : "text-red-600",
                              )}
                            >
                              {cell.score}/{cell.maxScore}
                            </span>
                          ) : (
                            <span className="text-sm text-stone-400">—</span>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-stone-900 dark:text-white">
                          {avg}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <Star className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 dark:text-stone-400 font-medium">
            No quiz scores recorded for this section yet.
          </p>
        </Card>
      )}
    </div>
  );
}

function ProgressSlot({ data, sectionId }) {
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

  const students = data.students.filter((s) => s.section === sectionId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-stone-900 dark:text-white">
          Student Progress
        </h2>
        <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mt-1">
          Individual progress tracking for this section
        </p>
      </div>

      <div className="space-y-4">
        {students.length > 0 ? (
          students.map((student) => {
            const assessments = student.best.size;
            return (
              <Card key={student.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 dark:text-white">
                        {student.name}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {assessments}{" "}
                        {assessments === 1 ? "assessment" : "assessments"}{" "}
                        completed
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-2xl font-black",
                      student.progress >= 75
                        ? "text-secondary-600"
                        : student.progress >= 50
                          ? "text-accent-600"
                          : "text-red-500",
                    )}
                  >
                    {student.progress}%
                  </span>
                </div>
                <ProgressBar
                  progress={student.progress}
                  color={
                    student.progress >= 75
                      ? "secondary"
                      : student.progress >= 50
                        ? "accent"
                        : "primary"
                  }
                  size="sm"
                />
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <TrendingUp className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 dark:text-stone-400 font-medium">
              No students in this section yet.
            </p>
          </Card>
        )}
      </div>
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
                  Score {score}/{maxScore}
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

// --- Slot map ---

const TAB_SLOTS = {
  overview: OverviewSlot,
  sections: SectionsSlot,
  lessons: LessonsSlot,
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
      const val = localStorage.getItem(`sq_teacher_sections_${user?.id ?? "guest"}`);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  });

  function setMySectionNames(next) {
    setMySectionNamesState(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

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
      ? allSections.filter((s) => mySectionNames.includes(s.name))
      : allSections;

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
                data={data}
                sectionId={selectedSectionId}
                onGrade={setGradingSub}
                onViewSection={(id) => setSelectedSectionId(id)}
                onRefresh={refreshDashboard}
                mySectionNames={mySectionNames}
                onSectionNamesChange={setMySectionNames}
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
