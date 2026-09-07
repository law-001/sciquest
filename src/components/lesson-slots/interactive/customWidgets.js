import { lazy } from 'react'

// The escape hatch for interactivity no generic form can express.
//
// To add one: write the component, register it here, and it becomes available
// in the teacher's section picker under "Custom Widget". The teacher places it;
// only a developer can create one. Widgets receive `{ data, onSolved }` and
// nothing else, so they stay independent of lesson internals.
//
// lazy() is called once at module scope rather than per render: the wrapper is
// cheap, the underlying import() still only fires when a widget is actually
// rendered, and the component identity stays stable so it never remounts.
export const CUSTOM_WIDGETS = {
  'particle-motion': {
    label: 'Particle Motion Explorer',
    desc: 'Students drag a temperature slider and watch particles change state.',
    Component: lazy(() => import('./widgets/ParticleMotionWidget')),
  },
}
