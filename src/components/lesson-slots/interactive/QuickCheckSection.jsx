import React from 'react'
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react'

import InteractiveFrame from './InteractiveFrame'
import { useCompletionReport, useInteractiveState } from './useInteractiveState'

// Practice, not assessment: unlimited retries, instant feedback, no grade.
// That is why this doesn't reuse MultipleChoiceQuestion, which is built around
// a single submit and an `isSubmitted` lock.
export default function QuickCheckSection({
  id,
  heading,
  data,
  blockId,
  lessonId,
  stateScope,
  onInteractionComplete,
}) {
  const { intro, questions = [], xp = 0 } = data ?? {}

  const [state, setState, reset] = useInteractiveState(stateScope ?? lessonId, blockId, () => ({
    picks: {},
  }))

  const isQuestionCorrect = (q) => state.picks[q.id] === q.correctIndex
  const correctCount = questions.filter(isQuestionCorrect).length
  const isComplete = questions.length > 0 && correctCount === questions.length

  useCompletionReport({
    isComplete,
    lessonId,
    blockId,
    blockType: 'quickCheck',
    xp,
    onInteractionComplete,
  })

  if (questions.length === 0) return null

  function choose(question, optionIndex) {
    // Once correct the question locks, so a stray tap can't undo a solved item.
    if (isQuestionCorrect(question)) return
    setState((prev) => ({ picks: { ...prev.picks, [question.id]: optionIndex } }))
  }

  return (
    <InteractiveFrame
      id={id}
      heading={heading}
      icon={<HelpCircle className="h-5 w-5 text-secondary-500" />}
      headingBg="bg-secondary-50"
      intro={intro}
      instruction={`Check your understanding — ${correctCount} of ${questions.length} correct`}
      isComplete={isComplete}
      status={
        isComplete
          ? 'All questions answered correctly.'
          : `${correctCount} of ${questions.length} questions correct.`
      }
      onReset={Object.keys(state.picks).length > 0 ? reset : null}
    >
      <div className="space-y-8">
        {questions.map((q, qi) => {
          const picked = state.picks[q.id]
          const answered = picked !== undefined
          const solved = picked === q.correctIndex

          return (
            <div key={q.id ?? qi}>
              <p className="mb-3 text-base font-bold text-stone-900 dark:text-white">
                <span className="mr-2 text-stone-400">{qi + 1}.</span>
                {q.prompt}
              </p>

              <div className="flex flex-col gap-3">
                {(q.options ?? []).map((option, oi) => {
                  const isPicked = picked === oi
                  const showCorrect = answered && solved && isPicked
                  const showWrong = answered && !solved && isPicked

                  let tone =
                    'border-stone-200 bg-white hover:border-primary-300 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-500'
                  if (showCorrect) {
                    tone = 'border-secondary-400 bg-secondary-50 dark:border-secondary-500 dark:bg-secondary-700/25'
                  } else if (showWrong) {
                    tone = 'border-red-300 bg-red-50 dark:border-red-500/60 dark:bg-red-900/20'
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => choose(q, oi)}
                      disabled={solved}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-xl border-2 p-4 text-left font-bold text-stone-700 transition-all disabled:cursor-default dark:text-stone-200 ${tone}`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                        {showCorrect && <CheckCircle2 className="h-5 w-5 text-secondary-600" />}
                        {showWrong && <XCircle className="h-5 w-5 text-red-500" />}
                        {!showCorrect && !showWrong && (
                          <span className="h-5 w-5 rounded-full border-2 border-stone-300 dark:border-stone-600" />
                        )}
                      </span>
                      <span className="text-sm">{option}</span>
                    </button>
                  )
                })}
              </div>

              {/* Correctness is stated in words, never by color alone. */}
              {answered && !solved && (
                <p className="mt-3 text-sm font-bold text-red-600 dark:text-red-400">
                  Not quite — try another answer.
                </p>
              )}
              {solved && (
                <p className="mt-3 text-sm font-bold text-secondary-700 dark:text-secondary-300">
                  Correct!
                </p>
              )}
              {solved && q.explanation && (
                <p className="mt-2 rounded-lg border border-secondary-100 bg-secondary-50 p-3 text-sm font-medium text-stone-700 dark:border-secondary-700/40 dark:bg-secondary-700/20 dark:text-stone-200">
                  💡 {q.explanation}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </InteractiveFrame>
  )
}
