import React, { useCallback, useState } from 'react'
import { Paperclip } from 'lucide-react'

import Card from './Card'
import MaterialsList from './MaterialsList'
import { useLessonsData } from '../context/LessonsDataContext'

// Auto-renders near the bottom of every lesson. Nothing to author — it appears
// only once a teacher has attached something.
export default function MaterialsPanel({ lessonId }) {
  const { getMaterials } = useLessonsData()
  const materials = getMaterials(lessonId)

  const [visible, setVisible] = useState(false)

  // A callback ref rather than an effect: materials load asynchronously, so the
  // first render returns null and there is no node to observe. React re-runs
  // this once the node mounts. An effect with [] deps fires only on that first
  // render, against a null ref, leaving the section stuck at opacity 0.
  const observeRef = useCallback((node) => {
    if (!node) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  if (materials.length === 0) return null

  return (
    <section
      ref={observeRef}
      className="mt-16 border-t border-orange-200 pt-8 dark:border-stone-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-stone-900 dark:text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 transition-transform duration-300 hover:scale-110 dark:bg-primary-700/20">
          <Paperclip className="h-5 w-5 text-primary-500" />
        </div>
        Lesson Materials
      </h2>

      <Card className="bg-stone-50 p-6 dark:bg-stone-800/40">
        <MaterialsList materials={materials} />
      </Card>
    </section>
  )
}
