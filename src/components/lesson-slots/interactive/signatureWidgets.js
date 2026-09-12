import { lazy } from 'react'

// Signature interactives: one purpose-built simulation per lesson, pinned to
// that lesson by id and owned by developers rather than teachers.
//
// These are things to watch and steer, not questions to answer — the quiz
// section already does assessment. Each one draws the actual object the lesson
// is about and lets the student drive it.
//
// Deliberately a separate registry from CUSTOM_WIDGETS: that one is rendered as
// a radio list in the teacher's section picker, and 59 entries would make it
// unusable. Nothing here is teacher-placeable.
//
// lazy() is called once at module scope, so each widget is its own chunk and
// none of them land in the initial bundle.
export const SIGNATURE_WIDGETS = {
  'model-gallery': lazy(() => import('./widgets/ModelGalleryWidget')),
  'investigation-run': lazy(() => import('./widgets/InvestigationRunWidget')),
  'globe-unroll': lazy(() => import('./widgets/GlobeUnrollWidget')),
  'particle-lab': lazy(() => import('./widgets/ParticleLabWidget')),
  'state-change-lab': lazy(() => import('./widgets/StateChangeLabWidget')),
  'phase-bench': lazy(() => import('./widgets/PhaseBenchWidget')),
  'heating-curve': lazy(() => import('./widgets/HeatingCurveWidget')),
  'investigation-rig': lazy(() => import('./widgets/InvestigationRigWidget')),
  'meniscus-bench': lazy(() => import('./widgets/MeniscusBenchWidget')),
  'solubility-beaker': lazy(() => import('./widgets/SolubilityBeakerWidget')),
  'dilution-jar': lazy(() => import('./widgets/DilutionJarWidget')),
  'titration-drip': lazy(() => import('./widgets/TitrationDripWidget')),
  'equipment-bench': lazy(() => import('./widgets/EquipmentBenchWidget')),
  'hazard-cabinet': lazy(() => import('./widgets/HazardCabinetWidget')),
  'focus-scope': lazy(() => import('./widgets/FocusScopeWidget')),
  'scope-through-time': lazy(() => import('./widgets/ScopeThroughTimeWidget')),
  'scope-field': lazy(() => import('./widgets/ScopeFieldWidget')),
  'cell-cutaway': lazy(() => import('./widgets/CellCutawayWidget')),
  'cell-morph': lazy(() => import('./widgets/CellMorphWidget')),
  'surface-volume': lazy(() => import('./widgets/SurfaceVolumeWidget')),
  'cycle-dial': lazy(() => import('./widgets/CycleDialWidget')),
  'mitosis-run': lazy(() => import('./widgets/MitosisRunWidget')),
  'crossover-lab': lazy(() => import('./widgets/CrossoverLabWidget')),
  'fusion-bench': lazy(() => import('./widgets/FusionBenchWidget')),
  'clone-bench': lazy(() => import('./widgets/CloneBenchWidget')),
  'variation-batch': lazy(() => import('./widgets/VariationBatchWidget')),
  'energy-flow': lazy(() => import('./widgets/EnergyFlowWidget')),
  'ten-percent': lazy(() => import('./widgets/TenPercentWidget')),
}
