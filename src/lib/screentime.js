import { supabase } from './supabase'

// Global, all-users-all-devices screen-time counter. Every open
// SciQuest tab contributes its active seconds; the total is shared.

// Credits `seconds` of active time to the global counter and returns
// the new total. The server clamps a single call to 120s.
export async function addScreenSeconds(seconds) {
  const whole = Math.round(seconds)
  if (!whole || whole <= 0) return null
  const { data, error } = await supabase.rpc('add_screen_seconds', {
    p_seconds: whole,
  })
  if (error) throw error
  return Number(data) || 0
}

// Current global total, in seconds.
export async function fetchScreenSeconds() {
  const { data, error } = await supabase
    .from('site_metrics')
    .select('value')
    .eq('key', 'total_screen_seconds')
    .maybeSingle()
  if (error) throw error
  return Number(data?.value) || 0
}
