import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart the dev server.'
  )
}

//KEEPS THEM LOGGED IN IF persistSession TRUE. refresh will logout if false. 
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true },
})
