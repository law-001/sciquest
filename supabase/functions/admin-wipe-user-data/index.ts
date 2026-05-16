// Supabase Edge Function: admin-wipe-user-data
//
// Wipes a user's learning/game data — student_progress, quiz_attempts,
// game_progress, game_saves, game_sessions — WITHOUT deleting the auth
// account or the students/staff row. Intended for resetting a test account
// back to a clean slate without re-creating it.
//
// RLS only lets a user delete their own progress rows, so this runs with the
// service-role key (like admin-delete-user). Only callers present in
// public.staff with role = 'admin' are permitted.
//
// Deploy:
//   supabase functions deploy admin-wipe-user-data
//
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are injected
// into the function runtime automatically — no manual secrets needed.

import { createClient } from 'jsr:@supabase/supabase-js@2'
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Tables holding per-user learning/game data, all keyed by student_id.
const DATA_TABLES = [
  'student_progress',
  'quiz_attempts',
  'game_progress',
  'game_saves',
  'game_sessions',
]

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Missing authorization header' }, 401)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // 1. Identify the caller from their JWT.
  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: { user }, error: userErr } = await caller.auth.getUser()
  if (userErr || !user) return json({ error: 'Invalid or expired token' }, 401)

  // 2. Confirm the caller is an admin (admins live in public.staff).
  const { data: staffRow, error: staffErr } = await caller
    .from('staff')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  if (staffErr || staffRow?.role !== 'admin') return json({ error: 'Forbidden: admin only' }, 403)

  // 3. Validate input.
  let body: { userId?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }
  const userId = body.userId
  if (!userId) return json({ error: 'userId is required' }, 400)

  // 4. Delete the data rows with the service-role key. The account row in
  //    students/staff and the auth.users entry are left untouched.
  const admin = createClient(supabaseUrl, serviceKey)
  for (const table of DATA_TABLES) {
    const { error } = await admin.from(table).delete().eq('student_id', userId)
    if (error) return json({ error: `Failed to wipe ${table}: ${error.message}` }, 500)
  }

  return json({ success: true })
})
