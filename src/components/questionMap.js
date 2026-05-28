import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillInTheBlanks,
  ShortAnswer,
  EssayQuestion,
  MatchingQuestion,
  IdentificationQuestion,
  OrderingQuestion,
  PictureBasedQuestion,
  CaseStudyQuestion,
} from './quiz-slots'

export const QUESTION_MAP = {
  'multiple-choice': MultipleChoiceQuestion,
  'true-false': TrueFalseQuestion,
  'fill-blanks': FillInTheBlanks,
  'short-answer': ShortAnswer,
  essay: EssayQuestion,
  matching: MatchingQuestion,
  identification: IdentificationQuestion,
  ordering: OrderingQuestion,
  'picture-based': PictureBasedQuestion,
  'case-study': CaseStudyQuestion,
}

export const TYPE_LABELS = {
  'multiple-choice': 'Multiple Choice',
  'true-false': 'True / False',
  'fill-blanks': 'Fill in the Blanks',
  'short-answer': 'Short Answer',
  essay: 'Essay',
  matching: 'Matching',
  identification: 'Identification',
  ordering: 'Ordering',
  'picture-based': 'Picture-Based',
  'case-study': 'Case Study',
}
