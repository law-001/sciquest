import React, { useEffect, useRef, useState } from 'react'
import { Paperclip } from 'lucide-react'

import Card from '../../Card'
import MaterialsList from '../../MaterialsList'
import SectionHeading from '../SectionHeading'
import { useLessonsData } from '../../../context/LessonsDataContext'

// Inline counterpart to MaterialsPanel: lets a teacher surface a specific
// video or handout at the point in the lesson where it's relevant.
// An empty materialIds list means "everything attached to this lesson".
export default function MaterialsSection({ id, heading, data, lessonId }) {
  const { intro, materialIds = [] } = data ?? {}
  const { getMaterials } = useLessonsData()

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

  const all = getMaterials(lessonId)
  const shown = materialIds.length ? all.filter((m) => materialIds.includes(m.id)) : all

  if (shown.length === 0) return null

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
      <SectionHeading
        icon={<Paperclip className="h-5 w-5 text-primary-500" />}
        bg="bg-primary-50"
      >
        <p className="dark:text-white">{heading}</p>
      </SectionHeading>

      {intro && (
        <p className="mb-6 text-base font-medium text-stone-600 dark:text-stone-300">{intro}</p>
      )}

      <Card className="p-6">
        <MaterialsList materials={shown} />
      </Card>
    </section>
  )
}
