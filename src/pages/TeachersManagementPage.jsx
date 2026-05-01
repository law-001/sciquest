import React from "react";
import {
  Users,
  BookOpen,
  HelpCircle,
  Settings,
  LayoutDashboard,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Eye,
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { cn } from "../lib/utils";

export function TeachersManagementPage({ onNavigate }) {
  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "teachers",
      label: "Teachers",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: "lessons",
      label: "Lessons",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "quizzes",
      label: "Quizzes",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const teachers = [
    {
      id: 1,
      name: "Dr. Sarah Jenkins",
      subject: "Biology",
      email: "s.jenkins@school.edu",
      classes: 4,
      students: 120,
    },
    {
      id: 2,
      name: "Mark Chen",
      subject: "Physics",
      email: "m.chen@school.edu",
      classes: 3,
      students: 95,
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      subject: "Earth Science",
      email: "e.rodriguez@school.edu",
      classes: 5,
      students: 150,
    },
    {
      id: 4,
      name: "Dr. Robert Wilson",
      subject: "Chemistry",
      email: "r.wilson@school.edu",
      classes: 2,
      students: 60,
    },
    {
      id: 5,
      name: "Amanda Taylor",
      subject: "General Science",
      email: "a.taylor@school.edu",
      classes: 4,
      students: 110,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <Card className="p-4 sticky top-24">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "dashboard") {
                      onNavigate("admin");
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors",
                    item.id === "teachers"
                      ? "bg-primary-50 text-primary-700"
                      : "text-stone-600 hover:bg-orange-50 hover:text-primary-600",
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-stone-900 mb-1">
                Teachers Management
              </h1>
              <p className="text-stone-500 font-medium">
                Manage teacher accounts and assignments
              </p>
            </div>
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add Teacher</Button>
          </div>

          {/* Teachers Grid/List */}
          <div className="grid gap-4">
            {teachers.map((teacher) => (
              <Card
                key={teacher.id}
                className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-700 flex items-center justify-center font-black text-lg">
                    {teacher.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      {teacher.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="accent" className="text-xs">
                        {teacher.subject}
                      </Badge>
                      <span className="flex items-center gap-1 text-sm text-stone-500 font-medium">
                        <Mail className="w-3.5 h-3.5" />
                        {teacher.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-orange-100 pt-4 sm:pt-0 mt-2 sm:mt-0">
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-xs font-bold text-stone-500 uppercase">
                        Classes
                      </p>
                      <p className="text-lg font-black text-stone-900">
                        {teacher.classes}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-500 uppercase">
                        Students
                      </p>
                      <p className="text-lg font-black text-stone-900">
                        {teacher.students}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="px-2">
                      <Eye className="w-4 h-4 text-stone-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-2">
                      <Edit2 className="w-4 h-4 text-stone-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-stone-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
