import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  BookOpen,
  Trophy,
  Users,
  Sparkles,
  Brain,
  Target,
} from 'lucide-react';
import Card from '../components/Card';   // Default import

function useScrollTrigger(threshold = 0.15) {
  const [el, setEl] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const ref = useCallback((node) => setEl(node), []);
  useEffect(() => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);
  return [ref, triggered];
}

export function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const benefits = [
    {
      icon: <Brain className="w-8 h-8 text-primary-500" />,
      title: 'Enhanced Retention',
      description:
        'Interactive elements and immediate feedback help solidify complex scientific concepts in memory.',
      color: 'bg-primary-50',
    },
    {
      icon: <Trophy className="w-8 h-8 text-accent-500" />,
      title: 'Increased Motivation',
      description:
        'Gamification mechanics like points, badges, and levels keep students engaged and eager to learn more.',
      color: 'bg-accent-50',
    },
    {
      icon: <Target className="w-8 h-8 text-secondary-500" />,
      title: 'Self-Paced Learning',
      description:
        'Students can progress through modules at their own speed, ensuring mastery before moving forward.',
      color: 'bg-secondary-50',
    },
  ];

  const team = [
    {
      name: 'Mark Dumayag',
      role: 'UI/UX Designer',
      initials: 'MD',
      color: 'bg-secondary-100 text-secondary-700',
    },
    {
      name: 'Miguel Porciuncula',
      role: 'Backend Developer',
      initials: 'MP',
      color: 'bg-primary-100 text-primary-700',
    },
    {
      name: 'Francesca Ricafort',
      role: 'Fashionista',
      initials: 'FR',
      color: 'bg-accent-100 text-accent-700',
    },
    {
      name: 'Aezen Alcantara',
      role: 'Motorista',
      initials: 'AC',
      color: 'bg-accent-100 text-accent-700',
    },
  ];

  const [benefitsRef, benefitsTriggered] = useScrollTrigger(0.1);
  const [teamRef, teamTriggered] = useScrollTrigger(0.1);

  return (
    <div className="min-h-screen pb-20 bg-[#fdf6e3] dark:bg-stone-900">
      {/* Hero Section */}
      <div className="border-b border-orange-200/50 dark:border-stone-700 pt-20 pb-16 relative overflow-hidden bg-primary-50 dark:bg-stone-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"
          style={{ animationDelay: '2s' }}
        />

        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-100 text-primary-600 mb-8 shadow-warm animate-bounce-in">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white mb-6 tracking-tight">
            About{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-500">
              SciQuest
            </span>
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto font-medium leading-relaxed">
            An interactive web-based system designed specifically for Grade 7
            students. We believe that learning science shouldn't be about
            memorizing textbooks, but about experiencing the wonder of
            discovery.
          </p>
        </div>
      </div>

      {/* Gamification Benefits */}
      <div ref={benefitsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            benefitsTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 font-bold text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Why Gamification?
          </div>
          <h2 className="text-3xl font-black text-stone-900 dark:text-white">
            The Power of Play in Education
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ease-out ${
                benefitsTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${150 + index * 120}ms` }}
            >
              <Card className="p-8 text-center h-full" hoverable>
                <div
                  className={`w-20 h-20 mx-auto rounded-3xl ${benefit.color} flex items-center justify-center mb-6 shadow-warm`}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div ref={teamRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-stone-800 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-xl transition-all duration-700 ease-out ${
            teamTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-700 text-white mb-8">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">
              Meet the Creators
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto mb-16 text-lg">
              A dedicated team of educators, designers, and developers
              passionate about transforming science education.
            </p>

            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center transition-all duration-700 ease-out ${
                    teamTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <div
                    className={`w-24 h-24 rounded-full ${member.color} flex items-center justify-center text-2xl font-black mb-4 border-4 border-stone-700 shadow-lg`}
                  >
                    {member.initials}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-stone-400 font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}