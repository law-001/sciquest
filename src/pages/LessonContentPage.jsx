import React from 'react';
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Star,
} from 'lucide-react';
import  Button  from '../components/Button';
import  Card  from '../components/Card';
import  Badge  from '../components/Badge';

export function LessonContentPage({ onBack, onComplete }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-stone-500 hover:text-primary-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Lessons
      </button>

      {/* Lesson Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="primary" className="uppercase tracking-wider">
            Biology
          </Badge>
          <span className="flex items-center gap-1 text-sm font-bold text-accent-600">
            <Star className="w-4 h-4 fill-current" />
            +75 XP
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 leading-tight">
          The Cell Structure: Building Blocks of Life
        </h1>
        <p className="text-xl text-stone-600 font-medium leading-relaxed">
          Explore the microscopic world of cells and discover the fascinating
          organelles that keep living things alive.
        </p>
      </div>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden shadow-card mb-12 border-4 border-white aspect-video relative">
        <img
          src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1200"
          alt="Microscopic view of cells"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/20 flex items-center justify-center">
          <button className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:scale-110 transition-transform shadow-lg">
            <PlayCircle className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-12 text-lg text-stone-700 leading-relaxed font-medium">
        <section>
          <h2 className="text-2xl font-black text-stone-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-500" />
            Introduction
          </h2>
          <p className="mb-4">
            Imagine a bustling city with power plants, factories, and a command
            center. That's exactly what a cell is like! Cells are the basic
            building blocks of all living things. The human body is composed of
            trillions of cells.
          </p>
          <p>
            They provide structure for the body, take in nutrients from food,
            convert those nutrients into energy, and carry out specialized
            functions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-stone-900 mb-4">
            Main Organelles
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            <Card className="p-6 border-l-4 border-l-primary-500">
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                The Nucleus
              </h3>
              <p className="text-stone-600 text-base">
                The command center of the cell. It contains the cell's DNA and
                controls all of the cell's activities, just like a mayor
                controls a city.
              </p>
            </Card>
            <Card className="p-6 border-l-4 border-l-secondary-500">
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                Mitochondria
              </h3>
              <p className="text-stone-600 text-base">
                The powerhouses of the cell. They take in nutrients, break them
                down, and create energy rich molecules for the cell.
              </p>
            </Card>
            <Card className="p-6 border-l-4 border-l-accent-500">
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                Cell Membrane
              </h3>
              <p className="text-stone-600 text-base">
                The city wall. It controls what goes in and out of the cell,
                protecting the inside from the outside environment.
              </p>
            </Card>
            <Card className="p-6 border-l-4 border-l-blue-500">
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                Ribosomes
              </h3>
              <p className="text-stone-600 text-base">
                The factories. These tiny structures are responsible for making
                proteins, which the cell needs to survive and function.
              </p>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black text-stone-900 mb-4">
            Real-world Example
          </h2>
          <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="mb-4">
                  Think of a plant leaf. When you look at it under a microscope,
                  you'll see thousands of tiny green boxes. These are plant
                  cells!
                </p>
                <p>
                  Unlike animal cells, plant cells have a rigid{' '}
                  <strong>cell wall</strong> and green organelles called{' '}
                  <strong>chloroplasts</strong> that let them make their own
                  food using sunlight.
                </p>
              </div>
              <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-md border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600"
                  alt="Plant leaf close up"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Completion Action */}
      <div className="mt-16 pt-8 border-t border-orange-200 flex flex-col items-center text-center">
        <h3 className="text-2xl font-black text-stone-900 mb-2">
          Ready to test your knowledge?
        </h3>
        <p className="text-stone-500 mb-8">
          Complete the quiz to earn your XP and unlock the next lesson.
        </p>
        <Button
          size="lg"
          onClick={onComplete}
          rightIcon={<CheckCircle2 className="w-5 h-5" />}
          className="w-full sm:w-auto px-12 py-4 text-lg shadow-glow"
        >
          Complete Lesson & Start Quiz
        </Button>
      </div>
    </div>
  );
}