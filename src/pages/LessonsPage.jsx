import React, { useState } from 'react';
import { Play, Lock, Star, Globe2, Dna, Zap, ChevronRight } from 'lucide-react';
import  Card  from '../components/Card';
import  Button  from '../components/Button';
import  ProgressBar  from '../components/ProgressBar';
import  Badge  from '../components/Badge';

import { cn } from '../lib/utils';

export function LessonsPage({ onStartLesson }) {
  const categories = ['All Topics', 'Earth Science', 'Biology', 'Physics'];
  
  const [activeCategory, setActiveCategory] = useState('All Topics');

  const lessons = [
    {
      id: 'earth-1',
      title: 'Layers of the Earth',
      category: 'Earth Science',
      description: 'Journey to the center of the Earth and discover its hidden layers.',
      icon: <Globe2 className="w-8 h-8 text-primary-500" />,
      color: 'primary',
      progress: 100,
      isLocked: false,
      xpReward: 50,
    },
    {
      id: 'bio-1',
      title: 'The Cell Structure',
      category: 'Biology',
      description: 'Explore the microscopic world of cells and their organelles.',
      icon: <Dna className="w-8 h-8 text-secondary-500" />,
      color: 'secondary',
      progress: 60,
      isLocked: false,
      xpReward: 75,
    },
    {
      id: 'phys-1',
      title: 'Forces and Motion',
      category: 'Physics',
      description: 'Understand the invisible forces that govern how objects move.',
      icon: <Zap className="w-8 h-8 text-accent-500" />,
      color: 'accent',
      progress: 0,
      isLocked: false,
      xpReward: 100,
    },
    {
      id: 'earth-2',
      title: 'Weather Systems',
      category: 'Earth Science',
      description: 'Learn how weather patterns form and affect our daily lives.',
      icon: <Globe2 className="w-8 h-8 text-stone-400" />,
      color: 'stone',
      progress: 0,
      isLocked: true,
      xpReward: 150,
    },
  ];

  const filteredLessons =
    activeCategory === 'All Topics'
      ? lessons
      : lessons.filter((l) => l.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Gamification Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-stone-900 mb-2">
            Your Lessons
          </h1>
          <p className="text-lg text-stone-500">
            Continue your scientific journey.
          </p>
        </div>

        <Card className="p-4 flex items-center gap-6 bg-white border-2 border-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-accent-500 fill-accent-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-500 font-heading">
                Current Level
              </p>
              <p className="text-xl font-black text-stone-900">Level 5</p>
            </div>
          </div>
          <div className="w-px h-12 bg-orange-200" />
          <div className="w-48">
            <div className="flex justify-between text-sm font-bold mb-1">
              <span className="text-stone-600">XP</span>
              <span className="text-primary-600">1,250 / 2,000</span>
            </div>
            <ProgressBar progress={62.5} color="primary" size="sm" />
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'px-6 py-2.5 rounded-full font-bold font-heading whitespace-nowrap transition-all',
              activeCategory === category
                ? 'bg-stone-800 text-white shadow-md'
                : 'bg-white text-stone-600 border border-orange-200 hover:border-primary-300 hover:bg-primary-50'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <Card
            key={lesson.id}
            className={cn(
              'flex flex-col h-full transition-all duration-300',
              lesson.isLocked
                ? 'opacity-75 grayscale-[0.5]'
                : 'hover:-translate-y-1 hover:shadow-card-hover'
            )}
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center shadow-warm',
                    `bg-${lesson.color}-100`
                  )}
                >
                  {lesson.icon}
                </div>
                <Badge
                  variant={lesson.isLocked ? 'outline' : 'accent'}
                  icon={<Star className="w-3 h-3 fill-current" />}
                >
                  +{lesson.xpReward} XP
                </Badge>
              </div>

              <div className="mb-2">
                <span
                  className={cn(
                    'text-xs font-bold uppercase tracking-wider',
                    `text-${lesson.color}-600`
                  )}
                >
                  {lesson.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 mb-2">
                {lesson.title}
              </h3>
              <p className="text-stone-500 text-sm mb-6 flex-1">
                {lesson.description}
              </p>

              {!lesson.isLocked && lesson.progress > 0 && (
                <div className="mb-6">
                  <ProgressBar
                    progress={lesson.progress}
                    color={lesson.progress === 100 ? 'secondary' : 'primary'}
                    showLabel
                  />
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-orange-100">
                {lesson.isLocked ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    disabled
                    leftIcon={<Lock className="w-4 h-4" />}
                  >
                    Locked
                  </Button>
                ) : (
                  <Button
                    variant={lesson.progress === 100 ? 'outline' : 'primary'}
                    className="w-full"
                    onClick={() => onStartLesson(lesson.id)}
                    rightIcon={
                      lesson.progress === 100 ? undefined : (
                        <ChevronRight className="w-4 h-4" />
                      )
                    }
                  >
                    {lesson.progress === 100
                      ? 'Review Lesson'
                      : lesson.progress > 0
                        ? 'Continue Lesson'
                        : 'Start Lesson'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}