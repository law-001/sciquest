// Live Quest — teacher-hosted live quiz rooms (supabase/migrations/
// 20261024000000_live_quest.sql). Every Live Quest read and write goes
// through here; components never talk to these tables directly.
//
// Scoring and answer checks run server-side in submit_live_answer, and the
// answers sit in host-only live_room_questions, so nothing a student's
// browser receives gives the answer away before the reveal.
//
// Practice only: never touches quiz_attempts, XP, or the gradebook.

import { supabase } from './supabase'

// Only question types that fit a tap-an-option screen can be played live.
export const LIVE_QUESTION_TYPES = ['multiple-choice', 'true-false']

export const SECONDS_OPTIONS = [5, 10, 20, 30, 60, 90, 120]

export const DEFAULT_SECONDS = 20

// No 0/O or 1/I so a code read off the board can't be mistyped.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6

function toRoom(row) {
  return {
    id: row.id,
    code: row.code,
    hostId: row.host_id,
    lessonIds: row.lesson_ids ?? [],
    setIds: row.set_ids ?? [],
    secondsPerQuestion: row.seconds_per_question,
    status: row.status,
    questionCount: row.question_count,
    currentIndex: row.current_index,
    currentQuestion: row.current_question,
    currentAnswer: row.current_answer,
    questionStartedAt: row.question_started_at,
  }
}

function toPlayer(row) {
  return {
    studentId: row.student_id,
    displayName: row.display_name,
    score: row.score,
  }
}

function toAnswer(row) {
  return {
    studentId: row.student_id,
    questionIndex: row.question_index,
    answer: row.answer,
    isCorrect: row.is_correct,
    points: row.points,
  }
}

// --- Question pool ---------------------------------------------------------

function isPlayable(q) {
  return (
    LIVE_QUESTION_TYPES.includes(q.type) &&
    (q.type === 'true-false' || q.options?.length >= 2)
  )
}

export function toQuestionKey(groupId, pickId) {
  return `${groupId}:${pickId}`
}

// Playable questions tagged with a `pickId` (their index in the quiz), which
// per-question picks are keyed on.
export function getPlayableQuestions(quiz) {
  return (quiz?.questions ?? []).flatMap((q, index) =>
    isPlayable(q) ? [{ ...q, pickId: index }] : [],
  )
}

// Flattens the chosen lessons' quizzes into the playable question list,
// minus any questions the host unticked (`excludedKeys`, from toQuestionKey).
// `getQuiz` is LessonsDataContext's, so teacher quiz edits are included.
export function buildQuestionPool(lessonIds, getQuiz, excludedKeys = []) {
  return lessonIds.flatMap((lessonId) => {
    const quiz = getQuiz(lessonId)
    return getPlayableQuestions(quiz)
      .filter((q) => !excludedKeys.includes(toQuestionKey(lessonId, q.pickId)))
      .map((q) => ({
        type: q.type,
        question: q.question,
        options: q.type === 'true-false' ? [true, false] : q.options,
        correctAnswer: q.correctAnswer,
        correctAnswers: [q.correctAnswer],
        explanation: q.explanation ?? null,
        lessonTitle: quiz.title ?? null,
      }))
  })
}

// --- Question sets (teacher-written) ---------------------------------------
//
// A set question is stored as written in the editor:
//   { id, type, question, options, correctIndexes, seconds, points, imageUrl }
// `options` keeps all four multiple-choice slots (blanks allowed) and
// `correctIndexes` points into them, so retyping an answer keeps its tick.
// True/false questions use options [true, false].

export const MAX_OPTIONS = 4
export const QUESTION_MAX_LENGTH = 200
export const OPTION_MAX_LENGTH = 80
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export const POINTS_OPTIONS = [
  { value: 'standard', label: 'Standard points' },
  { value: 'double', label: 'Double points' },
  { value: 'none', label: 'No points' },
]

export function createBlankQuestion(type = 'multiple-choice') {
  return {
    id: crypto.randomUUID(),
    type,
    question: '',
    options: type === 'true-false' ? [true, false] : Array(MAX_OPTIONS).fill(''),
    correctIndexes: [],
    seconds: null,
    points: 'standard',
    imageUrl: null,
  }
}

// What still blocks a question from being played, in editor wording.
export function getSetQuestionIssues(q) {
  const issues = []
  if (!q.question?.trim()) issues.push('Write the question')
  if (q.type === 'true-false') {
    if (q.correctIndexes.length !== 1) issues.push('Pick True or False as the answer')
    return issues
  }
  const filled = q.options.map((o) => String(o).trim()).filter(Boolean)
  if (filled.length < 2) issues.push('Add at least 2 answers')
  if (new Set(filled.map((o) => o.toLowerCase())).size !== filled.length) {
    issues.push('Answers must all be different')
  }
  if (!q.correctIndexes.some((i) => String(q.options[i] ?? '').trim())) {
    issues.push('Tick at least one correct answer')
  }
  return issues
}

// Keyed by the question's own id, so reordering a set keeps the host's picks.
export function getPlayableSetQuestions(set) {
  return (set?.questions ?? []).flatMap((q) =>
    getSetQuestionIssues(q).length ? [] : [{ ...q, pickId: q.id }],
  )
}

function toPoolQuestion(q, setTitle) {
  const isTrueFalse = q.type === 'true-false'
  const options = isTrueFalse ? [true, false] : q.options.map((o) => o.trim())
  const correctAnswers = q.correctIndexes.map((i) => options[i]).filter((o) => o !== '')
  return {
    type: q.type,
    question: q.question.trim(),
    options: options.filter((o) => o !== ''),
    correctAnswer: correctAnswers[0],
    correctAnswers,
    explanation: null,
    lessonTitle: setTitle,
    seconds: q.seconds ?? null,
    points: q.points ?? 'standard',
    imageUrl: q.imageUrl ?? null,
  }
}

// Same as buildQuestionPool, for the host's own sets.
export function buildSetQuestionPool(setIds, sets, excludedKeys = []) {
  return setIds.flatMap((setId) => {
    const set = sets.find((s) => s.id === setId)
    return getPlayableSetQuestions(set)
      .filter((q) => !excludedKeys.includes(toQuestionKey(setId, q.pickId)))
      .map((q) => toPoolQuestion(q, set.title))
  })
}

function toQuestionSet(row) {
  return {
    id: row.id,
    title: row.title,
    questions: row.questions ?? [],
    updatedAt: row.updated_at,
  }
}

export async function fetchQuestionSets(ownerId) {
  const { data, error } = await supabase
    .from('live_quest_sets')
    .select('id, title, questions, updated_at')
    .eq('owner_id', ownerId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toQuestionSet)
}

// Inserts when `id` is missing, otherwise overwrites that set.
export async function saveQuestionSet(ownerId, { id, title, questions }) {
  const row = { owner_id: ownerId, title: title.trim() || 'Untitled set', questions }
  const query = id
    ? supabase.from('live_quest_sets').update(row).eq('id', id)
    : supabase.from('live_quest_sets').insert(row)
  const { data, error } = await query.select('id, title, questions, updated_at').single()
  if (error) throw error
  return toQuestionSet(data)
}

export async function deleteQuestionSet(setId) {
  const { error } = await supabase.from('live_quest_sets').delete().eq('id', setId)
  if (error) throw error
}

// lesson-media is public, so students' devices can load the image by URL.
export async function uploadLiveQuestImage(file, ownerId) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `live-quest/${ownerId}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage
    .from('lesson-media')
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('lesson-media').getPublicUrl(path)
  return data.publicUrl
}

// --- Host ------------------------------------------------------------------

function createCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH))
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

// Retries on a code collision (unique violation) — rare at 32^6 codes.
export async function createLiveRoom(hostId) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await supabase
      .from('live_rooms')
      .insert({ code: createCode(), host_id: hostId, seconds_per_question: DEFAULT_SECONDS })
      .select()
      .single()
    if (!error) return toRoom(data)
    if (error.code !== '23505') throw error
  }
  throw new Error('Could not pick a free room code. Try again.')
}

export async function fetchOpenHostedRoom(hostId) {
  const { data, error } = await supabase
    .from('live_rooms')
    .select()
    .eq('host_id', hostId)
    .neq('status', 'ended')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data ? toRoom(data) : null
}

export async function updateRoomSettings(roomId, { lessonIds, setIds, secondsPerQuestion }) {
  const patch = {}
  if (lessonIds) patch.lesson_ids = lessonIds
  if (setIds) patch.set_ids = setIds
  if (secondsPerQuestion) patch.seconds_per_question = secondsPerQuestion
  const { error } = await supabase.from('live_rooms').update(patch).eq('id', roomId)
  if (error) throw error
}

// Writes the question list, then opens question 0. Re-running replaces the
// list, so a failed start can simply be retried.
export async function startLiveRoom(roomId, questions) {
  const { error: clearError } = await supabase
    .from('live_room_questions')
    .delete()
    .eq('room_id', roomId)
  if (clearError) throw clearError
  const { error: insertError } = await supabase
    .from('live_room_questions')
    .insert(questions.map((question, idx) => ({ room_id: roomId, idx, question })))
  if (insertError) throw insertError
  const { error: countError } = await supabase
    .from('live_rooms')
    .update({ question_count: questions.length })
    .eq('id', roomId)
  if (countError) throw countError
  await startQuestion(roomId, 0)
}

export async function startQuestion(roomId, index) {
  const { error } = await supabase.rpc('start_live_question', {
    p_room_id: roomId,
    p_index: index,
  })
  if (error) throw error
}

export async function revealQuestion(roomId) {
  const { error } = await supabase.rpc('reveal_live_question', { p_room_id: roomId })
  if (error) throw error
}

export async function endLiveRoom(roomId) {
  const { error } = await supabase
    .from('live_rooms')
    .update({ status: 'ended' })
    .eq('id', roomId)
  if (error) throw error
}

export async function fetchQuestionAnswers(roomId, questionIndex) {
  const { data, error } = await supabase
    .from('live_room_answers')
    .select('student_id, question_index, answer, is_correct, points')
    .eq('room_id', roomId)
    .eq('question_index', questionIndex)
  if (error) throw error
  return (data ?? []).map(toAnswer)
}

// --- Student ---------------------------------------------------------------

export async function joinLiveRoom(code) {
  const { data, error } = await supabase.rpc('join_live_room', { p_code: code })
  if (error) throw error
  return data
}

export async function submitLiveAnswer(roomId, questionIndex, answer) {
  const { data, error } = await supabase.rpc('submit_live_answer', {
    p_room_id: roomId,
    p_index: questionIndex,
    p_answer: answer,
  })
  if (error) throw error
  return data
}

// RLS returns only the caller's own row to a student.
export async function fetchMyAnswer(roomId, questionIndex) {
  const { data, error } = await supabase
    .from('live_room_answers')
    .select('student_id, question_index, answer, is_correct, points')
    .eq('room_id', roomId)
    .eq('question_index', questionIndex)
    .maybeSingle()
  if (error) throw error
  return data ? toAnswer(data) : null
}

// --- Shared ----------------------------------------------------------------

export async function fetchLiveRoom(roomId) {
  const { data, error } = await supabase
    .from('live_rooms')
    .select()
    .eq('id', roomId)
    .maybeSingle()
  if (error) throw error
  return data ? toRoom(data) : null
}

// Highest score first; ties keep join order.
export async function fetchPlayers(roomId) {
  const { data, error } = await supabase
    .from('live_room_players')
    .select('student_id, display_name, score')
    .eq('room_id', roomId)
    .order('score', { ascending: false })
    .order('joined_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(toPlayer)
}

// Channel names must be unique per subscriber — duplicate names across
// components silently break Supabase realtime.
function subscribe(table, filter, onChange) {
  const channel = supabase
    .channel(`${table}_${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table, filter }, (payload) =>
      onChange(payload),
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}

export function subscribeToLiveRoom(roomId, onChange) {
  return subscribe('live_rooms', `id=eq.${roomId}`, (payload) => {
    if (payload.new?.id) onChange(toRoom(payload.new))
  })
}

export function subscribeToPlayers(roomId, onChange) {
  return subscribe('live_room_players', `room_id=eq.${roomId}`, () => onChange())
}

export function subscribeToAnswers(roomId, onChange) {
  return subscribe('live_room_answers', `room_id=eq.${roomId}`, () => onChange())
}
