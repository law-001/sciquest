// The single Supabase client for the whole app.
//
// lessons.js, quizzes.js and materials.js each used to call createClient so they
// could degrade to null when env vars are missing, rather than throwing on
// import the way supabase.js does. That produced four GoTrue clients sharing one
// storage key, which supabase-js warns about: concurrent auth on the same key is
// undefined behavior, and those modules now read sessions and subscribe to auth
// changes, so they need it to be well defined.
//
// This module never throws, so a module that must survive a misconfigured
// environment can import it and branch on null. supabase.js re-exports it with
// the loud failure kept for everything else.

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// KEEPS THEM LOGGED IN IF persistSession TRUE. refresh will logout if false.
export const supabaseOrNull =
  url && anonKey
    ? createClient(url, anonKey, { auth: { persistSession: true } })
    : null
