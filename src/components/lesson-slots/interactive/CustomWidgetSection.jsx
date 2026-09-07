import React, { Suspense, useState } from 'react'
import { AlertTriangle, Loader2, Sparkles } from 'lucide-react'

import InteractiveFrame from './InteractiveFrame'
import { CUSTOM_WIDGETS } from './customWidgets'
import { useCompletionReport } from './useInteractiveState'

export default function CustomWidgetSection({
  id,
  heading,
  data,
  blockId,
  lessonId,
  onInteractionComplete,
}) {
  const { widgetId, height, xp = 0, ...rest } = data ?? {}
  const [solved, setSolved] = useState(false)

  useCompletionReport({
    isComplete: solved,
    lessonId,
    blockId,
    blockType: 'customWidget',
    xp,
    onInteractionComplete,
  })

  const meta = CUSTOM_WIDGETS[widgetId]
  const Widget = meta?.Component

  // A widget can be removed from the registry while a lesson still references
  // it. Say so plainly instead of rendering an empty section a teacher can't
  // diagnose.
  if (!Widget) {
    return (
      <InteractiveFrame
        id={id}
        heading={heading}
        icon={<AlertTriangle className="h-5 w-5 text-accent-600" />}
        headingBg="bg-accent-50"
        instruction="This interactive is unavailable"
        status="This interactive is unavailable."
      >
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
          The widget &ldquo;{widgetId || 'none selected'}&rdquo; is not installed. A teacher
          can pick a different one by editing this section.
        </p>
      </InteractiveFrame>
    )
  }

  return (
    <InteractiveFrame
      id={id}
      heading={heading}
      icon={<Sparkles className="h-5 w-5 text-primary-500" />}
      headingBg="bg-primary-50"
      intro={rest.intro}
      instruction={meta?.desc ?? 'Explore the interactive below'}
      isComplete={solved}
      status={solved ? 'Interactive completed.' : 'Interactive in progress.'}
    >
      <div style={height ? { minHeight: Number(height) } : undefined}>
        <Suspense
          fallback={
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
            </div>
          }
        >
          <Widget data={rest} onSolved={() => setSolved(true)} />
        </Suspense>
      </div>
    </InteractiveFrame>
  )
}
