import { Circle, Diamond, Square, Triangle } from 'lucide-react'

// Each option gets a shape + letter as well as a color, so it never relies on
// color alone. 700 shades keep white text above 4.5:1.
export const OPTION_STYLES = [
  {
    letter: 'A',
    Icon: Triangle,
    tile: 'bg-primary-700 text-white',
    hover: 'hover:bg-primary-800',
    bar: 'bg-primary-600',
  },
  {
    letter: 'B',
    Icon: Diamond,
    tile: 'bg-secondary-700 text-white',
    hover: 'hover:bg-secondary-800',
    bar: 'bg-secondary-600',
  },
  {
    letter: 'C',
    Icon: Circle,
    tile: 'bg-yellow-400 text-stone-900',
    hover: 'hover:bg-yellow-500',
    bar: 'bg-yellow-400',
  },
  {
    letter: 'D',
    Icon: Square,
    tile: 'bg-stone-700 text-white dark:bg-stone-600',
    hover: 'hover:bg-stone-800 dark:hover:bg-stone-500',
    bar: 'bg-stone-500',
  },
]

export function getOptionStyle(index) {
  return OPTION_STYLES[index % OPTION_STYLES.length]
}

// Rooms started before multiple correct answers existed only reveal one.
export function getCorrectAnswers(currentAnswer) {
  if (currentAnswer?.correctAnswers) return currentAnswer.correctAnswers
  return currentAnswer ? [currentAnswer.correctAnswer] : []
}

export function formatOption(option) {
  if (option === true) return 'True'
  if (option === false) return 'False'
  return String(option)
}
