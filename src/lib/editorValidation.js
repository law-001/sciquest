// Completeness checks for the lesson and quiz editors.
//
// These are warnings, never gates — a teacher has to be able to save a
// half-built draft and come back to it. They exist to catch the failures that
// are invisible from the canvas: a multiple-choice question whose correct
// answer is not one of its options looks perfectly fine right up until every
// student scores zero on it.
//
// Pure functions, no imports: the same results feed the card chip, the outline
// row and the pre-save checklist.

const isBlank = (value) => typeof value !== 'string' || value.trim() === ''
const filled = (list) => (Array.isArray(list) ? list.filter((v) => !isBlank(v)) : [])
const noneFilled = (list) => filled(list).length === 0

// ── Lesson sections ──────────────────────────────────────────────────────────

export function getSlotIssues(slot) {
  const issues = []
  if (!slot) return issues
  const data = slot.data ?? {}

  if (isBlank(slot.heading)) issues.push('No section heading')

  switch (slot.type) {
    case 'intro':
      if (noneFilled(data.paragraphs)) issues.push('No paragraph text')
      break

    case 'keyTerms': {
      const terms = (data.terms ?? []).filter((t) => !isBlank(t?.term))
      if (terms.length === 0) issues.push('No terms added')
      else if (terms.some((t) => isBlank(t.desc))) issues.push('Some terms have no definition')
      break
    }

    case 'reasonCards': {
      const reasons = data.reasons ?? []
      if (reasons.length === 0) issues.push('No reason cards')
      else if (reasons.some((r) => isBlank(r?.title))) issues.push('Some cards have no title')
      break
    }

    case 'imageCards': {
      const cards = data.cards ?? []
      if (cards.length === 0) issues.push('No image cards')
      else {
        if (cards.some((c) => isBlank(c?.title))) issues.push('Some cards have no title')
        if (cards.some((c) => isBlank(c?.image))) issues.push('Some cards have no image')
      }
      break
    }

    case 'conceptList':
      if (noneFilled(data.concepts)) issues.push('No concepts listed')
      break

    case 'applications': {
      const apps = data.apps ?? []
      if (apps.length === 0) issues.push('No applications')
      else if (apps.some((a) => isBlank(a?.title))) issues.push('Some applications have no title')
      break
    }

    case 'timeline': {
      const steps = data.steps ?? []
      if (steps.length === 0) issues.push('No timeline steps')
      else if (steps.some((s) => isBlank(s?.title))) issues.push('Some steps have no title')
      break
    }

    case 'comparison':
      if (isBlank(data.left?.label) || isBlank(data.right?.label)) {
        issues.push('Both columns need a label')
      }
      if (noneFilled(data.left?.items) || noneFilled(data.right?.items)) {
        issues.push('Both columns need at least one point')
      }
      break

    case 'scenario': {
      const scenarios = data.scenarios ?? []
      if (scenarios.length === 0) issues.push('No scenarios')
      else if (scenarios.some((s) => isBlank(s?.situation))) issues.push('Some scenarios have no situation')
      break
    }

    case 'diagram': {
      const nodes = data.nodes ?? []
      if (nodes.length === 0) issues.push('No diagram nodes')
      else if (nodes.some((n) => isBlank(n?.label))) issues.push('Some nodes have no label')
      break
    }

    case 'flipCards': {
      const cards = data.cards ?? []
      if (cards.length === 0) issues.push('No cards')
      else if (cards.some((c) => isBlank(c?.front) || isBlank(c?.back))) {
        issues.push('Some cards are missing a front or back')
      }
      break
    }

    case 'quickCheck': {
      const questions = data.questions ?? []
      if (questions.length === 0) issues.push('No questions')
      else {
        if (questions.some((q) => isBlank(q?.prompt))) issues.push('Some questions have no prompt')
        // correctIndex has to point at a real option, or the question is
        // unwinnable — students can never pick the right answer.
        if (questions.some((q) => !Number.isInteger(q?.correctIndex) || !(q.options ?? [])[q.correctIndex])) {
          issues.push('Some questions have no valid correct answer')
        }
      }
      break
    }

    case 'hotspot':
      if (isBlank(data.image)) issues.push('No image chosen')
      if ((data.points ?? []).length === 0) issues.push('No markers placed')
      else if ((data.points ?? []).some((p) => isBlank(p?.title))) issues.push('Some markers have no title')
      break

    case 'sortBuckets': {
      const buckets = data.buckets ?? []
      const items = data.items ?? []
      if (buckets.length < 2) issues.push('Needs at least two categories')
      if (items.length === 0) issues.push('No items to sort')
      else {
        const bucketIds = new Set(buckets.map((b) => b?.id))
        if (items.some((it) => !bucketIds.has(it?.bucketId))) {
          issues.push('Some items are not assigned to a category')
        }
      }
      break
    }

    case 'dragLabel': {
      const labels = data.labels ?? []
      const zones = data.zones ?? []
      if (isBlank(data.image)) issues.push('No image chosen')
      if (labels.length === 0) issues.push('No labels')
      if (zones.length === 0) issues.push('No drop zones placed')
      else {
        const labelIds = new Set(labels.map((l) => l?.id))
        if (zones.some((z) => !labelIds.has(z?.labelId))) issues.push('Some zones have no matching label')
      }
      break
    }

    case 'customWidget':
      if (isBlank(data.widgetId)) issues.push('No widget chosen')
      break

    case 'materials':
      if ((data.materialIds ?? []).length === 0) issues.push('No materials selected')
      break

    default:
      break
  }

  return issues
}

// ── Quiz questions ───────────────────────────────────────────────────────────

export function getQuestionIssues(question) {
  const issues = []
  if (!question) return issues
  const q = question

  if (isBlank(q.question)) issues.push('No question text')

  // Multiple-choice and picture-based are scored identically; the only extra
  // requirement for the latter is the image.
  if (q.type === 'multiple-choice' || q.type === 'picture-based') {
    if (q.type === 'picture-based' && isBlank(q.imageUrl)) issues.push('No image chosen')
    const options = filled(q.options)
    if (options.length < 2) issues.push('Needs at least two options')
    if (isBlank(q.correctAnswer)) issues.push('No correct answer set')
    // The scorer compares the student's pick to correctAnswer by value, so a
    // correct answer that is not one of the options can never be earned.
    else if (!options.includes(q.correctAnswer)) issues.push('Correct answer is not one of the options')
    return issues
  }

  switch (q.type) {
    case 'true-false':
      if (typeof q.correctAnswer !== 'boolean') issues.push('No correct answer set')
      break

    case 'fill-blanks': {
      const blanks = q.blanks ?? []
      const markers = (q.question ?? '').split('___').length - 1
      if (blanks.length === 0) issues.push('No blanks defined')
      else if (blanks.some(isBlank)) issues.push('Some blanks have no answer')
      if (markers !== blanks.length) {
        issues.push(`${markers} ___ in the text but ${blanks.length} answer${blanks.length === 1 ? '' : 's'}`)
      }
      break
    }

    case 'identification':
      if (isBlank(q.correctAnswer)) issues.push('No correct answer set')
      break

    case 'ordering':
      if (filled(q.items).length < 2) issues.push('Needs at least two items to order')
      break

    case 'matching': {
      const left = filled(q.leftItems)
      const right = filled(q.rightItems)
      if (left.length === 0 || right.length === 0) issues.push('Both columns need items')
      else if (left.some((l) => isBlank(q.correctPairs?.[l]))) issues.push('Some items in Column A are unmatched')
      break
    }

    case 'short-answer':
      if (isBlank(q.rubric)) issues.push('No grading rubric')
      break

    case 'essay':
      if (isBlank(q.rubric)) issues.push('No grading rubric')
      if (!Number.isFinite(q.minWords) || q.minWords <= 0) issues.push('Word minimum must be above zero')
      break

    case 'case-study': {
      const subs = q.subQuestions ?? []
      if (isBlank(q.scenario)) issues.push('No scenario text')
      if (subs.length === 0) issues.push('No sub-questions')
      else if (subs.some((sub) => getQuestionIssues(sub).length > 0)) issues.push('Some sub-questions are incomplete')
      break
    }

    default:
      break
  }

  return issues
}
