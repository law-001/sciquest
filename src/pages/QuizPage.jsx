import React, { useEffect, useState } from 'react';
import {
  Clock,
  Star,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import  Card  from '../components/Card';
import  Button  from '../components/Button';
import  ProgressBar  from '../components/ProgressBar';
import  { cn } from '../lib/utils';

export function QuizPage({ onComplete, onExit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showConfetti, setShowConfetti] = useState(false);

  const questions = [
    {
      id: 'q1',
      prompt: 'Which part of the cell is known as the "powerhouse"?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cell Membrane'],
      correctAnswer: 'Mitochondria',
    },
    {
      id: 'q2',
      prompt: 'What is the main function of the cell membrane?',
      options: [
        'Produce energy',
        'Store DNA',
        'Control what enters and exits',
        'Make proteins',
      ],
      correctAnswer: 'Control what enters and exits',
    },
    {
      id: 'q3',
      prompt: 'Which organelle is considered the "command center" of the cell?',
      options: ['Nucleus', 'Cytoplasm', 'Golgi Apparatus', 'Lysosome'],
      correctAnswer: 'Nucleus',
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    if (!isSubmitted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerSelect = (answer) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score > questions.length / 2) {
      setShowConfetti(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setTimeLeft(60);
    setShowConfetti(false);
  };

  // Results Screen
  if (isSubmitted) {
    const score = calculateScore();
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none flex justify-center">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm animate-confetti-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#f97316', '#14b8a6', '#eab308', '#fb7185'][
                    Math.floor(Math.random() * 4)
                  ],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <Card className="max-w-md w-full p-8 text-center animate-bounce-in relative z-10">
          <div className="w-24 h-24 mx-auto bg-accent-100 rounded-full flex items-center justify-center mb-6 shadow-glow">
            <Trophy className="w-12 h-12 text-accent-500" />
          </div>
          <h2 className="text-3xl font-black text-stone-900 mb-2">
            Quiz Complete!
          </h2>
          <p className="text-stone-500 mb-8">
            Great job completing the assessment.
          </p>

          <div className="rounded-2xl p-6 mb-8 bg-orange-50 border border-orange-100">
            <div className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">
              Your Score
            </div>
            <div className="text-5xl font-black text-primary-600 mb-2">
              {score}{' '}
              <span className="text-2xl text-stone-400">
                / {questions.length}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-accent-600 font-bold">
              <Star className="w-5 h-5 fill-current" />
              <span>+{score * 50} XP Earned</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="primary" onClick={onComplete} size="lg">
              Back to Lessons
            </Button>
            <Button
              variant="outline"
              onClick={handleRetry}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retry Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Exit Quiz
        </Button>
        <div className="flex items-center gap-6">
          <div
            className={cn(
              'flex items-center gap-2 font-bold px-4 py-1.5 rounded-full border-2',
              timeLeft <= 10
                ? 'text-red-600 border-red-200 bg-red-50 animate-pulse'
                : 'text-stone-600 border-orange-200 bg-white',
            )}
          >
            <Clock className="w-4 h-4" />
            <span>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-bold text-stone-500 mb-2">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <ProgressBar progress={progress} color="secondary" size="lg" />
      </div>

      {/* Question Card */}
      <Card className="p-8 md:p-12 mb-8 shadow-lg border-2 border-primary-100">
        <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-10 text-center leading-tight">
          {currentQuestion.prompt}
        </h2>

        <div className="grid sm:grid-cols-1 gap-4">
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswer === option;
            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={cn(
                  'p-5 rounded-xl text-lg font-bold transition-all duration-200 text-left relative overflow-hidden border-2 flex items-center gap-4',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700 ring-4 ring-primary-500/10'
                    : 'border-orange-200 hover:border-primary-300 hover:bg-primary-50/50 text-stone-700',
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0',
                    isSelected ? 'border-primary-500' : 'border-stone-300',
                  )}
                >
                  {isSelected && (
                    <div className="w-3 h-3 bg-primary-500 rounded-full" />
                  )}
                </div>
                {option}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            variant="primary"
            onClick={handleSubmitQuiz}
            disabled={Object.keys(answers).length !== questions.length}
            rightIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!currentAnswer}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
}