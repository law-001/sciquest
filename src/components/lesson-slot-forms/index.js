export { default as IntroForm } from './IntroForm'
export { default as KeyTermsForm } from './KeyTermsForm'
export { default as ReasonCardsForm } from './ReasonCardsForm'
export { default as ImageCardsForm } from './ImageCardsForm'
export { default as ConceptListForm } from './ConceptListForm'
export { default as ApplicationsForm } from './ApplicationsForm'
export { default as TimelineForm } from './TimelineForm'
export { default as ComparisonForm } from './ComparisonForm'
export { default as ScenarioForm } from './ScenarioForm'
export { default as DiagramForm } from './DiagramForm'
export { default as FlipCardsForm } from './FlipCardsForm'
export { default as QuickCheckForm } from './QuickCheckForm'
export { default as HotspotForm } from './HotspotForm'
export { default as SortBucketsForm } from './SortBucketsForm'
export { default as DragLabelForm } from './DragLabelForm'
export { default as CustomWidgetForm } from './CustomWidgetForm'
export { default as MaterialsForm } from './MaterialsForm'

import IntroForm from './IntroForm'
import KeyTermsForm from './KeyTermsForm'
import ReasonCardsForm from './ReasonCardsForm'
import ImageCardsForm from './ImageCardsForm'
import ConceptListForm from './ConceptListForm'
import ApplicationsForm from './ApplicationsForm'
import TimelineForm from './TimelineForm'
import ComparisonForm from './ComparisonForm'
import ScenarioForm from './ScenarioForm'
import DiagramForm from './DiagramForm'
import FlipCardsForm from './FlipCardsForm'
import QuickCheckForm from './QuickCheckForm'
import HotspotForm from './HotspotForm'
import SortBucketsForm from './SortBucketsForm'
import DragLabelForm from './DragLabelForm'
import CustomWidgetForm from './CustomWidgetForm'
import MaterialsForm from './MaterialsForm'

export const FORM_MAP = {
  intro: IntroForm,
  keyTerms: KeyTermsForm,
  reasonCards: ReasonCardsForm,
  imageCards: ImageCardsForm,
  conceptList: ConceptListForm,
  applications: ApplicationsForm,
  timeline: TimelineForm,
  comparison: ComparisonForm,
  scenario: ScenarioForm,
  diagram: DiagramForm,
  flipCards: FlipCardsForm,
  quickCheck: QuickCheckForm,
  hotspot: HotspotForm,
  sortBuckets: SortBucketsForm,
  dragLabel: DragLabelForm,
  customWidget: CustomWidgetForm,
  materials: MaterialsForm,
}

export const SLOT_META = {
  intro: { label: 'Introduction', desc: 'Paragraphs with an optional "Did You Know?" fact' },
  keyTerms: { label: 'Key Terms', desc: 'Numbered term: definition list' },
  reasonCards: { label: 'Reason Cards', desc: 'Grid of cards each with a numbered reason' },
  imageCards: { label: 'Image Cards', desc: 'Cards with images, labels, and bullet examples' },
  conceptList: { label: 'Concept List', desc: 'Numbered list of concepts or points' },
  applications: { label: 'Applications', desc: 'Real-world application cards with icons' },
  timeline: { label: 'Timeline', desc: 'Step-by-step timeline with optional tips' },
  comparison: { label: 'Comparison', desc: 'Two-column side-by-side comparison' },
  scenario: { label: 'Scenario', desc: 'Real-world scenario with a think-about-it question' },
  diagram: { label: 'Diagram', desc: 'Visual node diagram with connections' },
  flipCards: { label: 'Flip Cards', desc: 'Cards students tap to reveal the answer' },
  quickCheck: { label: 'Check Understanding', desc: 'Inline questions with instant feedback and retries' },
  hotspot: { label: 'Hotspot Image', desc: 'Image with markers students tap to reveal facts' },
  sortBuckets: { label: 'Sort into Categories', desc: 'Students drag items into the right category' },
  dragLabel: { label: 'Drag to Label', desc: 'Students drag labels onto an image diagram' },
  customWidget: { label: 'Custom Widget', desc: 'A purpose-built interactive installed by a developer' },
  materials: { label: 'Materials', desc: 'Show a video or handout inline, where it is relevant' },
}

// Groups the picker renders under. A type missing from every group still works;
// it just falls into "Content".
export const SLOT_GROUPS = [
  {
    label: 'Content',
    desc: 'Text, images and diagrams students read',
    types: [
      'intro',
      'keyTerms',
      'reasonCards',
      'imageCards',
      'conceptList',
      'applications',
      'timeline',
      'comparison',
      'scenario',
      'diagram',
    ],
  },
  {
    label: 'Interactive',
    desc: 'Blocks students do something with',
    types: [
      'flipCards',
      'quickCheck',
      'hotspot',
      'sortBuckets',
      'dragLabel',
      'customWidget',
    ],
  },
  {
    label: 'Materials',
    desc: 'Videos and files you have attached to this lesson',
    types: ['materials'],
  },
]

export const DEFAULT_SLOT_DATA = {
  intro: { paragraphs: [''], didYouKnow: '' },
  keyTerms: { terms: [{ term: '', desc: '' }] },
  reasonCards: { intro: '', reasons: [{ num: 1, title: '', desc: '', content: '', color: 'primary' }] },
  imageCards: { cards: [{ image: '', imageAlt: '', label: 'Example', variant: 'primary', title: '', desc: '', examples: [''], color: 'primary' }] },
  conceptList: { concepts: [''] },
  applications: { apps: [{ icon: '🔬', title: '', description: '', color: 'border-l-orange-500' }] },
  timeline: { intro: '', steps: [{ num: 1, title: '', description: '', tip: '', color: 'primary' }] },
  comparison: { intro: '', left: { label: '', color: 'primary', items: [''] }, right: { label: '', color: 'secondary', items: [''] } },
  scenario: { intro: '', scenarios: [{ title: '', situation: '', question: '', skill: '' }] },
  diagram: { title: '', description: '', nodes: [{ id: 'node-1', label: '', color: 'primary', connects: [] }] },
  flipCards: { intro: '', xp: 0, cards: [{ front: '', back: '', color: 'primary' }] },
  quickCheck: { intro: '', xp: 0, questions: [] },
  hotspot: { intro: '', xp: 0, image: '', imageAlt: '', points: [] },
  sortBuckets: { intro: '', xp: 0, buckets: [], items: [] },
  dragLabel: { intro: '', xp: 0, image: '', imageAlt: '', labels: [], zones: [] },
  customWidget: { widgetId: '', intro: '', height: undefined, xp: 0 },
  materials: { intro: '', materialIds: [] },
}
