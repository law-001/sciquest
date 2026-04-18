import React from 'react';
import {
  ArrowRight,
  Star,
  Trophy,
  Target,
  Zap,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react';
import  Button  from '../components/Button';
import  Card  from '../components/Card';

export function LandingPage({
  onStartLearning,
  onTeacherPortal,
  onAdminPortal,
}) {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-primary-500" />,
      title: 'Interactive Lessons',
      description:
        'Learn complex science concepts through engaging, interactive modules.',
      image:
        'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
      color: 'bg-primary-50',
    },
    {
      icon: <Trophy className="w-6 h-6 text-accent-500" />,
      title: 'Gamified Learning',
      description:
        'Earn badges, level up, and compete with friends while learning.',
      image:
        'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&q=80&w=800',
      color: 'bg-accent-50',
    },
    {
      icon: <Zap className="w-6 h-6 text-secondary-500" />,
      title: 'Instant Feedback',
      description:
        'Get real-time feedback on quizzes to understand mistakes quickly.',
      image:
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
      color: 'bg-secondary-50',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-10 pb-24 lg:pt-15 lg:pb-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          style={{
            animationDelay: '2s',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Text Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-orange-100 mb-8 animate-slide-up">
                <Star className="w-5 h-5 text-accent-500 fill-accent-500" />
                <span className="text-sm font-bold text-stone-700 font-heading">
                  Grade 7 Science Curriculum
                </span>
              </div>

              <h1
                className="text-5xl lg:text-7xl font-black text-stone-900 mb-6 tracking-tight animate-slide-up"
                style={{
                  animationDelay: '0.1s',
                }}
              >
                Learn Science the{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-500">
                  Fun Way!
                </span>
              </h1>

              <p
                className="text-xl text-stone-600 mb-8 font-medium animate-slide-up leading-relaxed"
                style={{
                  animationDelay: '0.2s',
                }}
              >
                Explore the universe, dive into biology, and master physics
                through interactive games, quizzes, and rewards. Join thousands
                of students discovering the joy of science.
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 animate-slide-up"
                style={{
                  animationDelay: '0.3s',
                }}
              >
                <Button
                  size="lg"
                  onClick={onStartLearning}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Start Learning Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  leftIcon={<PlayCircle className="w-5 h-5" />}
                >
                  Watch Demo
                </Button>
              </div>

              <div
                className="mt-10 flex items-center gap-4 animate-slide-up"
                style={{
                  animationDelay: '0.4s',
                }}
              >
                <div className="flex -space-x-3">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                    alt="Student"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100"
                    alt="Student"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                    alt="Student"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600">
                    +2k
                  </div>
                </div>
                <div className="text-sm font-medium text-stone-600">
                  Loved by over{' '}
                  <span className="font-bold text-stone-900">2,000+</span>{' '}
                  students
                </div>
              </div>
            </div>

            {/* Right: Image Composition */}
            <div
              className="relative animate-slide-up"
              style={{
                animationDelay: '0.4s',
              }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 lg:aspect-auto lg:h-600px">
                <img
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000"
                  alt="Students in a science lab"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />

                {/* Floating UI Elements over image */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center gap-4 animate-float">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center shrink-0">
                    <Trophy className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">
                      Achievement Unlocked!
                    </p>
                    <p className="text-xs text-stone-500 font-medium">
                      Master of Molecules • +500 XP
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative floating image */}
              {/* <div
                className="absolute -bottom-10 -left-10 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden md:block animate-float"
                style={{
                  animationDelay: '1s',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=500"
                  alt="Student smiling"
                  className="w-full h-full object-cover"
                />
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-4">
              Why learn with SciQuest?
            </h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              We combine proven educational methods with engaging game mechanics
              to make learning science irresistible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="overflow-hidden flex flex-col"
                hoverable
              >
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent" />
                  <div
                    className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-stone-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-stone-600 flex-1">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works / Split Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-primary-100 rounded-[3rem] transform -rotate-3 scale-105" />
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000"
                alt="Students collaborating"
                className="relative rounded-[3rem] shadow-xl w-full object-cover aspect-square lg:aspect-4/5"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-6">
                Designed for the modern classroom
              </h2>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                SciQuest transforms traditional science curriculum into an
                interactive adventure. Students don't just read about
                science—they experience it.
              </p>

              <ul className="space-y-6">
                {[
                  'Curriculum-aligned content for Grade 7',
                  'Progress tracking for teachers and parents',
                  'Adaptive difficulty based on performance',
                  'Accessible on any device, anywhere',
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center mt-1 mr-4">
                      <CheckCircle2 className="w-4 h-4 text-secondary-600" />
                    </div>
                    <span className="text-lg text-stone-700 font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button size="lg" onClick={onStartLearning}>
                  Join the Platform
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Portal Links */}
      <footer className="py-12 border-t border-orange-200/50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-100 rounded-lg text-primary-600">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <span className="font-heading font-black text-stone-900">
                SciQuest
              </span>
            </div>
            <p className="text-sm text-stone-500">
              © 2026 SciQuest. An interactive learning platform for Grade 7
              Science.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={onTeacherPortal}
                className="text-sm font-bold text-stone-500 hover:text-secondary-600 transition-colors"
              >
                Teacher Portal
              </button>
              <span className="text-stone-300">|</span>
              <button
                onClick={onAdminPortal}
                className="text-sm font-bold text-stone-500 hover:text-primary-600 transition-colors"
              >
                Admin Portal
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}