import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  HelpCircle,
  Settings,
  LayoutDashboard,
  GraduationCap,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import  Card  from '../components/Card';
import  Button  from '../components/Button';
import  Badge  from '../components/Badge';
import { cn } from '../lib/utils';

export function AdminDashboardPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    {
      label: 'Total Students',
      value: '1,248',
      icon: <Users className="w-6 h-6 text-primary-500" />,
      color: 'bg-primary-50',
    },
    {
      label: 'Total Teachers',
      value: '42',
      icon: <GraduationCap className="w-6 h-6 text-secondary-500" />,
      color: 'bg-secondary-50',
    },
    {
      label: 'Active Lessons',
      value: '156',
      icon: <BookOpen className="w-6 h-6 text-accent-500" />,
      color: 'bg-accent-50',
    },
    {
      label: 'Quiz Attempts',
      value: '8,932',
      icon: <HelpCircle className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-50',
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Student',
      email: 'alex.j@school.edu',
      status: 'Active',
      joined: '2 days ago',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      role: 'Teacher',
      email: 's.smith@school.edu',
      status: 'Active',
      joined: '5 days ago',
    },
    {
      id: 3,
      name: 'Michael Brown',
      role: 'Student',
      email: 'm.brown@school.edu',
      status: 'Inactive',
      joined: '1 week ago',
    },
    {
      id: 4,
      name: 'Emily Davis',
      role: 'Student',
      email: 'e.davis@school.edu',
      status: 'Active',
      joined: '1 week ago',
    },
    {
      id: 5,
      name: 'Dr. Robert Wilson',
      role: 'Teacher',
      email: 'r.wilson@school.edu',
      status: 'Active',
      joined: '2 weeks ago',
    },
  ];

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'teachers',
      label: 'Teachers',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'lessons',
      label: 'Lessons',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'quizzes',
      label: 'Quizzes',
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className="min-h-screen font-body text-stone-800"
      style={{
        backgroundColor: '#fdf6e3',
      }}
    >
      {/* Admin Portal Header */}
      <header
        className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-orange-200/50 shadow-warm"
        style={{
          backgroundColor: 'rgba(255, 251, 245, 0.85)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-stone-500 hover:text-primary-600 font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
              <div className="w-px h-8 bg-orange-200" />
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary-100 rounded-lg text-primary-600">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="font-heading font-black text-lg text-stone-900">
                  Admin Portal
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                A
              </div>
              <span className="text-sm font-bold text-stone-700 hidden sm:inline">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

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
                      if (item.id === 'teachers') {
                        onNavigate('teachers');
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors',
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-stone-600 hover:bg-orange-50 hover:text-primary-600',
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
                  Admin Dashboard
                </h1>
                <p className="text-stone-500 font-medium">
                  Overview and system management
                </p>
              </div>
              <Button leftIcon={<Plus className="w-4 h-4" />}>Add User</Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        stat.color,
                      )}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-500">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-black text-stone-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Users Table */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-orange-100 flex justify-between items-center bg-white">
                <h2 className="text-xl font-bold text-stone-900">
                  Recent Users
                </h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-orange-100">
                      <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100 bg-white">
                    {recentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-orange-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-stone-900">
                                {user.name}
                              </p>
                              <p className="text-xs text-stone-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              user.role === 'Teacher' ? 'secondary' : 'primary'
                            }
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 text-xs font-bold',
                              user.status === 'Active'
                                ? 'text-secondary-600'
                                : 'text-stone-400',
                            )}
                          >
                            <span
                              className={cn(
                                'w-2 h-2 rounded-full',
                                user.status === 'Active'
                                  ? 'bg-secondary-500'
                                  : 'bg-stone-300',
                              )}
                            />
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-600 font-medium">
                          {user.joined}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-stone-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}