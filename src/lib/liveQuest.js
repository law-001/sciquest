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

// Flattens the chosen lessons' quizzes into the playable question list.
// `getQuiz` is LessonsDataContext's, so teacher quiz edits are included.
export function buildQuestionPool(lessonIds, getQuiz) {
  return lessonIds.flatMap((lessonId) => {
    const quiz = getQuiz(lessonId)
    return (quiz?.questions ?? [])
      .filter(isPlayable)
      .map((q) => ({
        type: q.type,
        question: q.question,
        options: q.type === 'true-false' ? [true, false] : q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation ?? null,
        lessonTitle: quiz.title ?? null,
      }))
  })
}

export function countPlayableQuestions(quiz) {
  return (quiz?.questions ?? []).filter(isPlayable).length
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

export async function updateRoomSettings(roomId, { lessonIds, secondsPerQuestion }) {
  const patch = {}
  if (lessonIds) patch.lesson_ids = lessonIds
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
