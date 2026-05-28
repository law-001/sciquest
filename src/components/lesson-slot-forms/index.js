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
}

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
}
