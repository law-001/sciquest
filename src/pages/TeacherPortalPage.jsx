import React, { useState } from "react";
import {
  ArrowLeft,
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
  Atom,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function TeacherPortalPage({ onBack }) {
  const { signOut } = useAuth();
  const { isDark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "my-classes",
      label: "My Classes",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "lessons",
      label: "My Lessons",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "quizzes",
      label: "Quiz Results",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const myClasses = [
    {
      id: 1,
      name: "Section 7-A",
      subject: "Biology",
      students: 35,
      avgScore: 82,
    },
    {
      id: 2,
      name: "Section 7-B",
      subject: "Biology",
      students: 32,
      avgScore: 76,
    },
    {
      id: 3,
      name: "Section 7-C",
      subject: "Earth Science",
      students: 38,
      avgScore: 88,
    },
  ];

  const recentSubmissions = [
    {
      student: "Alex Johnson",
      quiz: "Cell Structure Quiz",
      score: 9,
      total: 10,
      time: "2 hours ago",
    },
    {
      student: "Maria Santos",
      quiz: "Cell Structure Quiz",
      score: 7,
      total: 10,
      time: "3 hours ago",
    },
    {
      student: "James Lee",
      quiz: "Forces & Motion Quiz",
      score: 8,
      total: 10,
      time: "5 hours ago",
    },
    {
      student: "Emily Chen",
      quiz: "Cell Structure Quiz",
      score: 10,
      total: 10,
      time: "6 hours ago",
    },
    {
      student: "David Kim",
      quiz: "Layers of Earth Quiz",
      score: 6,
      total: 10,
      time: "1 day ago",
    },
  ];

  const myLessons = [
    {
      id: 1,
      title: "The Cell Structure",
      category: "Biology",
      status: "Published",
      students: 67,
      completion: 72,
    },
    {
      id: 2,
      title: "Ecosystems & Biodiversity",
      category: "Biology",
      status: "Published",
      students: 45,
      completion: 58,
    },
    {
      id: 3,
      title: "Layers of the Earth",
      category: "Earth Science",
      status: "Draft",
      students: 0,
      completion: 0,
    },
    {
      id: 4,
      title: "The Water Cycle",
      category: "Earth Science",
      status: "Published",
      students: 52,
      completion: 85,
    },
  ];

  return (
    <div className="min-h-screen font-body text-stone-800 dark:text-stone-100 bg-[#fdf6e3] dark:bg-stone-900">
      {/* Teacher Portal Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-orange-200/50 dark:border-stone-700 shadow-warm bg-[rgba(255,251,245,0.85)] dark:bg-stone-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              {/* <button
                onClick={onBack}
                className="flex items-center gap-2 text-stone-500 hover:text-primary-600 font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </button> */}
              <div className="w-px h-8 bg-orange-200" />
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg text-secondary-600 dark:text-secondary-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-heading font-black text-lg text-stone-900 dark:text-white">
                  Teacher Portal
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
              <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 flex items-center justify-center font-bold text-sm">
                TC
              </div>
              <span className="text-sm font-bold text-stone-700 dark:text-stone-300 hidden sm:inline">
                Ms. Chen
              </span>
              <button
                onClick={() => {
                  console.log("[TeacherPortal] logout clicked");
                  signOut();
                  console.log("[TeacherPortal] navigating back");
                  onBack();
                }}
                className="flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-60 shrink-0">
            <Card className="p-3 sticky top-24">
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors",
                      activeTab === item.id
                        ? "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400"
                        : "text-stone-600 dark:text-stone-400 hover:bg-orange-50 dark:hover:bg-stone-700 hover:text-secondary-600 dark:hover:text-secondary-400",
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {activeTab === "overview" && (
              <>
                <div>
                  <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-1">
                    Welcome back, Ms. Chen!
                  </h1>
                  <p className="text-stone-500 dark:text-stone-400 font-medium">
                    Here's what's happening with your classes today.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Students",
                      value: "105",
                      icon: <Users className="w-5 h-5 text-primary-500" />,
                      color: "bg-primary-50",
                    },
                    {
                      label: "Active Lessons",
                      value: "4",
                      icon: <BookOpen className="w-5 h-5 text-secondary-500" />,
                      color: "bg-secondary-50",
                    },
                    {
                      label: "Avg. Score",
                      value: "82%",
                      icon: <TrendingUp className="w-5 h-5 text-accent-500" />,
                      color: "bg-accent-50",
                    },
                    {
                      label: "Quizzes Today",
                      value: "23",
                      icon: (
                        <ClipboardList className="w-5 h-5 text-science-pink" />
                      ),
                      color: "bg-pink-50",
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
                      <p className="text-2xl font-black text-stone-900">
                        {stat.value}
                      </p>
                      <p className="text-xs font-bold text-stone-500 mt-1">
                        {stat.label}
                      </p>
                    </Card>
                  ))}
                </div>

                {/* Recent Submissions */}
                <Card className="overflow-hidden">
                  <div className="p-6 border-b border-orange-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-stone-900">
                      Recent Quiz Submissions
                    </h2>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="divide-y divide-orange-100">
                    {recentSubmissions.map((sub, i) => (
                      <div
                        key={i}
                        className="px-6 py-4 flex items-center justify-between hover:bg-orange-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                            {sub.student.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-stone-900">
                              {sub.student}
                            </p>
                            <p className="text-xs text-stone-500">{sub.quiz}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={cn(
                              "text-sm font-black",
                              sub.score >= 8
                                ? "text-secondary-600"
                                : sub.score >= 6
                                  ? "text-accent-600"
                                  : "text-red-600",
                            )}
                          >
                            {sub.score}/{sub.total}
                          </span>
                          <span className="text-xs text-stone-400 font-medium hidden sm:inline">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {sub.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {activeTab === "my-classes" && (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-black text-stone-900 mb-1">
                      My Classes
                    </h1>
                    <p className="text-stone-500 font-medium">
                      Manage your class sections and student progress
                    </p>
                  </div>
                  <Button leftIcon={<Plus className="w-4 h-4" />}>
                    Add Class
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myClasses.map((cls) => (
                    <Card key={cls.id} className="p-6" hoverable>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-stone-900">
                          {cls.name}
                        </h3>
                        <Badge variant="secondary">{cls.subject}</Badge>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-500 font-medium">
                            Students
                          </span>
                          <span className="font-bold text-stone-900">
                            {cls.students}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-500 font-medium">
                            Avg. Score
                          </span>
                          <span className="font-bold text-stone-900">
                            {cls.avgScore}%
                          </span>
                        </div>
                        <ProgressBar
                          progress={cls.avgScore}
                          color="secondary"
                          size="sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          leftIcon={<Eye className="w-4 h-4" />}
                        >
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="px-3">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {activeTab === "lessons" && (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-black text-stone-900 mb-1">
                      My Lessons
                    </h1>
                    <p className="text-stone-500 font-medium">
                      Create and manage your lesson content
                    </p>
                  </div>
                  <Button leftIcon={<Plus className="w-4 h-4" />}>
                    Create Lesson
                  </Button>
                </div>

                <div className="space-y-4">
                  {myLessons.map((lesson) => (
                    <Card
                      key={lesson.id}
                      className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-secondary-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-stone-900">
                              {lesson.title}
                            </h3>
                            <Badge
                              variant={
                                lesson.status === "Published"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {lesson.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-stone-500">
                            {lesson.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        {lesson.status === "Published" && (
                          <div className="flex gap-6 text-center">
                            <div>
                              <p className="text-xs font-bold text-stone-500">
                                Students
                              </p>
                              <p className="text-lg font-black text-stone-900">
                                {lesson.students}
                              </p>
                            </div>
                            <div className="w-24">
                              <p className="text-xs font-bold text-stone-500 mb-1">
                                Completion
                              </p>
                              <ProgressBar
                                progress={lesson.completion}
                                color="secondary"
                                size="sm"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="px-2">
                            <Eye className="w-4 h-4 text-stone-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="px-2">
                            <Edit2 className="w-4 h-4 text-stone-500" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {activeTab === "quizzes" && (
              <>
                <div>
                  <h1 className="text-3xl font-black text-stone-900 mb-1">
                    Quiz Results
                  </h1>
                  <p className="text-stone-500 font-medium">
                    View detailed quiz performance across your classes
                  </p>
                </div>

                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-stone-50 border-b border-orange-100">
                          <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Quiz
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-100">
                        {recentSubmissions.map((sub, i) => (
                          <tr
                            key={i}
                            className="hover:bg-orange-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                                  {sub.student.charAt(0)}
                                </div>
                                <span className="text-sm font-bold text-stone-900">
                                  {sub.student}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-600">
                              {sub.quiz}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  "text-sm font-black",
                                  sub.score >= 8
                                    ? "text-secondary-600"
                                    : sub.score >= 6
                                      ? "text-accent-600"
                                      : "text-red-600",
                                )}
                              >
                                {sub.score}/{sub.total}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-500">
                              {sub.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}

            {activeTab === "settings" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-stone-400" />
                </div>
                <h2 className="text-2xl font-black text-stone-900 mb-2">
                  Settings
                </h2>
                <p className="text-stone-500 max-w-md">
                  Account settings and preferences will be available here soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
