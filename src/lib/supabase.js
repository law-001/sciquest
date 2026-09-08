import { supabaseOrNull } from "./supabaseClient";

if (!supabaseOrNull) {
  throw new Error(
    "Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
  );
}

// The app cannot run without auth, so importing this asserts the client exists.
// Modules that must degrade instead of crashing import supabaseClient directly.
export const supabase = supabaseOrNull;
