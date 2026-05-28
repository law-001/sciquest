export { default as MultipleChoiceForm } from './MultipleChoiceForm'
export { default as TrueFalseForm } from './TrueFalseForm'
export { default as FillInTheBlanksForm } from './FillInTheBlanksForm'
export { default as ShortAnswerForm } from './ShortAnswerForm'
export { default as EssayForm } from './EssayForm'
export { default as MatchingForm } from './MatchingForm'
export { default as IdentificationForm } from './IdentificationForm'
export { default as OrderingForm } from './OrderingForm'
export { default as PictureBasedForm } from './PictureBasedForm'
export { default as CaseStudyForm } from './CaseStudyForm'

import MultipleChoiceForm from './MultipleChoiceForm'
import TrueFalseForm from './TrueFalseForm'
import FillInTheBlanksForm from './FillInTheBlanksForm'
import ShortAnswerForm from './ShortAnswerForm'
import EssayForm from './EssayForm'
import MatchingForm from './MatchingForm'
import IdentificationForm from './IdentificationForm'
import OrderingForm from './OrderingForm'
import PictureBasedForm from './PictureBasedForm'
import CaseStudyForm from './CaseStudyForm'

export const QUESTION_FORM_MAP = {
  'multiple-choice': MultipleChoiceForm,
  'true-false': TrueFalseForm,
  'fill-blanks': FillInTheBlanksForm,
  'short-answer': ShortAnswerForm,
  essay: EssayForm,
  matching: MatchingForm,
  identification: IdentificationForm,
  ordering: OrderingForm,
  'picture-based': PictureBasedForm,
  'case-study': CaseStudyForm,
}

export const QUESTION_META = {
  'multiple-choice': { label: 'Multiple Choice', desc: 'Pick one correct answer from several options' },
  'true-false': { label: 'True / False', desc: 'Decide if a statement is true or false' },
  'fill-blanks': { label: 'Fill in the Blanks', desc: 'Complete sentences with missing words' },
  'short-answer': { label: 'Short Answer', desc: 'Written response graded by teacher' },
  essay: { label: 'Essay', desc: 'Long-form written response with word minimum' },
  matching: { label: 'Matching', desc: 'Match items in Column A to descriptions in Column B' },
  identification: { label: 'Identification', desc: 'Type the exact word or phrase that answers the question' },
  ordering: { label: 'Ordering', desc: 'Arrange items in the correct sequence' },
  'picture-based': { label: 'Picture-Based', desc: 'Answer a question about an image' },
  'case-study': { label: 'Case Study', desc: 'Analyze a scenario and answer follow-up questions' },
}

export const DEFAULT_QUESTION_DATA = {
  'multiple-choice': {
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
  },
  'true-false': {
    question: '',
    correctAnswer: true,
    explanation: '',
  },
  'fill-blanks': {
    question: 'The ___ and ___ are examples of this concept.',
    blanks: ['', ''],
    explanation: '',
  },
  'short-answer': {
    question: '',
    rubric: '',
  },
  essay: {
    question: '',
    minWords: 50,
    rubric: '',
  },
  matching: {
    question: 'Match each item in Column A with its correct description in Column B.',
    leftItems: ['', ''],
    rightItems: ['', ''],
    correctPairs: {},
  },
  identification: {
    question: '',
    correctAnswer: '',
    acceptedAnswers: [],
  },
  ordering: {
    question: '',
    items: ['', '', ''],
  },
  'picture-based': {
    question: '',
    imageUrl: '',
    imageAlt: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
  },
  'case-study': {
    question: 'Read the scenario and answer the questions below.',
    scenario: '',
    subQuestions: [],
  },
}
