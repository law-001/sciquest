// Supabase Edge Function: admin-delete-user
//
// Deletes an auth user — which, via the ON DELETE CASCADE on public.students,
// public.staff, and public.student_progress, also removes any related rows.
// Only callers present in public.staff with role = 'admin' are permitted.
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

  // 4. Delete with the service-role key.
  const admin = createClient(supabaseUrl, serviceKey)
  const { error: delErr } = await admin.auth.admin.deleteUser(userId)
  if (delErr) return json({ error: delErr.message }, 500)

  return json({ success: true })
})
