import React, { Suspense, useState } from 'react'
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react'

import Card from '../../Card'
import SectionHeading from '../SectionHeading'
import { SIGNATURE_WIDGETS } from './signatureWidgets'
import { useCompletionReport } from './useInteractiveState'

// Host for a lesson's pinned signature interactive.
//
// It does not reuse InteractiveFrame on purpose: that shell keeps its content
// at opacity 0 until an IntersectionObserver fires, and a simulation that never
// appears is indistinguishable from one that was never built. This block is
// always painted.
//
// `blockId` is the fixed string "signature", so a completion record can never
// be orphaned by a teacher inserting a section above it.
export default function SignatureWidgetSection({
  id,
  lessonId,
  signature,
  onInteractionComplete,
}) {
  const [solved, setSolved] = useState(false)

  useCompletionReport({
    isComplete: solved,
    lessonId,
    blockId: 'signature',
    blockType: 'signature',
    xp: signature?.xp ?? 0,
    onInteractionComplete,
  })

  // An unknown id means the lesson data is ahead of the registry — a developer
  // problem, not something a student can act on.
  const Widget = SIGNATURE_WIDGETS[signature?.widgetId]
  if (!Widget) return null

  // Chrome is kept deliberately short here. The simulation and the controls
  // that drive it have to share one screen, so every line above them costs the
  // student a scroll away from the thing they are steering.
  return (
    <section id={id}>
      <SectionHeading icon={<Sparkles className="h-5 w-5 text-primary-500" />} bg="bg-primary-50">
        <p className="dark:text-white">{signature.heading}</p>
      </SectionHeading>

      {signature.intro && (
        <p className="mb-4 text-sm font-medium text-stone-600 dark:text-stone-300 sm:text-base">
          {signature.intro}
        </p>
      )}

      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-stone-500 dark:text-stone-400">
            {signature.instruction ?? 'Try it yourself'}
          </p>
          {solved && (
            <span className="flex items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1.5 text-xs font-black text-secondary-700 dark:bg-secondary-700/25 dark:text-secondary-200">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </span>
          )}
        </div>

        <Suspense
          fallback={
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
            </div>
          }
        >
          <Widget onSolved={() => setSolved(true)} />
        </Suspense>
      </Card>
    </section>
  )
}
