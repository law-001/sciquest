import {
  IntroSection,
  KeyTermsSection,
  ReasonCardsSection,
  ImageCardsSection,
  ConceptListSection,
  ApplicationsSection,
  TimelineSection,
  ComparisonSection,
  ScenarioSection,
  DiagramSection,
  FlipCardsSection,
  QuickCheckSection,
  HotspotSection,
  SortBucketsSection,
  DragLabelSection,
  CustomWidgetSection,
  MaterialsSection,
} from './lesson-slots'

export const SLOT_MAP = {
  intro: IntroSection,
  keyTerms: KeyTermsSection,
  reasonCards: ReasonCardsSection,
  imageCards: ImageCardsSection,
  conceptList: ConceptListSection,
  applications: ApplicationsSection,
  timeline: TimelineSection,
  comparison: ComparisonSection,
  scenario: ScenarioSection,
  diagram: DiagramSection,
  flipCards: FlipCardsSection,
  quickCheck: QuickCheckSection,
  hotspot: HotspotSection,
  sortBuckets: SortBucketsSection,
  dragLabel: DragLabelSection,
  customWidget: CustomWidgetSection,
  materials: MaterialsSection,
}

// Slot types that hold per-student state and report completion upward.
// LessonTemplate uses this only for documentation of intent; the extra props it
// passes are inert for the presentational slots.
export const INTERACTIVE_SLOT_TYPES = new Set([
  'flipCards',
  'quickCheck',
  'hotspot',
  'sortBuckets',
  'dragLabel',
  'customWidget',
])
