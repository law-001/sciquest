// Supabase Edge Function: invite-teacher
//
// Sends a Supabase invite email to the given address. When the teacher clicks
// the link they land on SITE_URL with #type=invite in the hash, which the app
// uses to show the account-setup page.
//
// Only callers present in public.staff with role = 'admin' are permitted.
//
// Deploy:
//   supabase functions deploy invite-teacher
//
// Set SITE_URL in Supabase Dashboard → Project Settings → Edge Functions → Secrets
// (e.g. https://your-app.vercel.app or http://localhost:5173 for local dev)

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
  const siteUrl = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'

  // 1. Identify the caller from their JWT.
  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: { user }, error: userErr } = await caller.auth.getUser()
  if (userErr || !user) return json({ error: 'Invalid or expired token' }, 401)

  // 2. Confirm the caller is an admin.
  const { data: staffRow, error: staffErr } = await caller
    .from('staff')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  if (staffErr || staffRow?.role !== 'admin') return json({ error: 'Forbidden: admin only' }, 403)

  // 3. Validate input.
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }
  const email = body.email?.trim()
  if (!email) return json({ error: 'email is required' }, 400)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Invalid email address' }, 400)

  // 4. Send invite via the service-role key. Supabase handles the email.
  //    The teacher will see a setup link that redirects back to SITE_URL with
  //    #access_token=...&type=invite in the hash.
  const admin = createClient(supabaseUrl, serviceKey)
  const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { role: 'teacher' },
    redirectTo: siteUrl,
  })
  if (inviteErr) return json({ error: inviteErr.message }, 500)

  return json({ success: true })
})
