import React, { useEffect, useRef, useState } from 'react'
import { CheckCircle2, RotateCcw } from 'lucide-react'

import Card from '../../Card'
import SectionHeading from '../SectionHeading'

// Shared shell for every interactive block, so the whole family reads as one
// component: heading, optional intro, an aria-live status line, a completion
// pill, and a reset control.
export default function InteractiveFrame({
  id,
  heading,
  icon,
  headingBg = 'bg-primary-50',
  intro,
  instruction,
  isComplete = false,
  status,
  onReset,
  children,
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <SectionHeading icon={icon} bg={headingBg}>
        <p className="dark:text-white">{heading}</p>
      </SectionHeading>

      {intro && (
        <p className="mb-6 text-base font-medium text-stone-600 dark:text-stone-300">
          {intro}
        </p>
      )}

      <Card className="p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-stone-500 dark:text-stone-400">
            {instruction}
          </p>

          <div className="flex items-center gap-2">
            {isComplete && (
              <span className="flex items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1.5 text-xs font-black text-secondary-700 dark:bg-secondary-700/25 dark:text-secondary-200">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </span>
            )}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-stone-500 transition-colors hover:bg-orange-50 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-100"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {children}

        {/* Announced to screen readers as the block's state changes. */}
        <p aria-live="polite" className="sr-only">
          {status}
        </p>
      </Card>
    </section>
  )
}
