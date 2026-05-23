// Supabase Edge Function: admin-delete-user
//
// Deletes an auth user along with every row that belongs to them across the
// public schema. We delete explicitly (using the service-role key) rather than
// relying on ON DELETE CASCADE so a missing or out-of-sync FK in production
// can't leave orphan rows behind. Only callers present in public.staff with
// role = 'admin' are permitted.
//
// Deploy:
//   supabase functions deploy admin-delete-user
//
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are injected
// into the function runtime automatically — no manual secrets needed.

import { createClient } from 'jsr:@supabase/supabase-js@2'
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// Tables keyed by student_id that should be wiped before the auth user goes.
// Order doesn't matter — none of these reference each other.
const STUDENT_OWNED_TABLES = [
  'student_progress',
  'quiz_attempts',
  'student_achievements',
  'game_progress',
  'game_saves',
  'game_sessions',
] as const

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
  if (userId === user.id) return json({ error: 'You cannot delete your own account' }, 400)

  // 4. Wipe owned rows with the service-role key, then delete the auth user.
  const admin = createClient(supabaseUrl, serviceKey)

  for (const table of STUDENT_OWNED_TABLES) {
    const { error } = await admin.from(table).delete().eq('student_id', userId)
    if (error) return json({ error: `Failed to clear ${table}: ${error.message}` }, 500)
  }

  // students and staff are keyed by the auth user id directly.
  const { error: studentsErr } = await admin.from('students').delete().eq('id', userId)
  if (studentsErr) return json({ error: `Failed to clear students: ${studentsErr.message}` }, 500)

  const { error: staffDelErr } = await admin.from('staff').delete().eq('id', userId)
  if (staffDelErr) return json({ error: `Failed to clear staff: ${staffDelErr.message}` }, 500)

  const { error: delErr } = await admin.auth.admin.deleteUser(userId)
  if (delErr) return json({ error: delErr.message }, 500)

  return json({ success: true })
})
