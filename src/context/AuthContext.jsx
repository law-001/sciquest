import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

// ---------------------------------------------------------------------------
// Session timeout config — edit these values to change timeout durations.
// ---------------------------------------------------------------------------
const INACTIVITY_TIMEOUT_MS      = 30 * 60 * 1000            // 30 min  — normal session
const REMEMBER_ME_INACTIVITY_MS  = 3 * 24 * 60 * 60 * 1000  // 3 days  — remember-me inactivity cap
const REMEMBER_ME_MAX_MS         = 7 * 24 * 60 * 60 * 1000  // 7 days  — remember-me absolute cap
const ACTIVITY_CHECK_INTERVAL_MS = 60 * 1000                  // 1 min   — polling interval while tab is open

// For quick testing, swap in these values and revert when done:
// const INACTIVITY_TIMEOUT_MS      = 30 * 1000
// const REMEMBER_ME_INACTIVITY_MS  = 30 * 1000
// const REMEMBER_ME_MAX_MS         = 30 * 1000
// const ACTIVITY_CHECK_INTERVAL_MS = 5 * 1000

// ---------------------------------------------------------------------------
// localStorage keys — all session state lives here so it survives tab close,
// browser close, and device sleep.
// ---------------------------------------------------------------------------
const LS_LAST_ACTIVE    = 'sq_last_active'    // Unix ms — last user interaction
const LS_REMEMBER_ME    = 'sq_remember_me'    // '1' | '0'
const LS_SESSION_EXPIRY = 'sq_session_expiry' // Unix ms — absolute remember-me deadline

// ---------------------------------------------------------------------------
// isSessionExpired — pure function, no React deps.
//
// Reads the three localStorage keys and returns true if the session should be
// terminated. Called in three places:
//   1. App startup / tab reopen  (inside getSession callback)
//   2. Tab becomes visible again  (visibilitychange → 'visible')
//   3. Periodic interval while tab is open
//
// Because this only reads localStorage (which persists across tab/browser
// close and device sleep), the check is equally accurate whether the tab has
// been open for 1 second or 3 days.
// ---------------------------------------------------------------------------
function isSessionExpired() {
  const lastActive = parseInt(localStorage.getItem(LS_LAST_ACTIVE) ?? '0', 10)
  // No activity record means no tracked session — let Supabase handle it.
  if (lastActive === 0) return false

  const now = Date.now()
  const isRemembered = localStorage.getItem(LS_REMEMBER_ME) === '1'

  if (isRemembered) {
    const expiry = parseInt(localStorage.getItem(LS_SESSION_EXPIRY) ?? '0', 10)
    // Expired if the absolute 7-day deadline passed OR 3 days of inactivity.
    return now > expiry || now - lastActive > REMEMBER_ME_INACTIVITY_MS
  }

  // Normal session: expire after X minutes of inactivity.
  return now - lastActive > INACTIVITY_TIMEOUT_MS
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Stable ref so the activity/visibility effects can always call the latest
  // signOut without needing to re-register every listener on each render.
  const signOutRef = useRef(null)
  // Set to true when WE initiate a signOut so onAuthStateChange can block
  // Supabase from restoring the session via TOKEN_REFRESHED / INITIAL_SESSION.
  const signedOutRef = useRef(false)

  // Users live in either `staff` (teachers + admins) or `students`. Look in
  // staff first — its presence is the discriminator for non-student roles.
  // Returns a flat profile shape; for students, role is synthesized.
  const fetchProfile = async (userId) => {
    const { data: staffRow } = await supabase
      .from('staff')
      .select('id, role, first_name, last_name, email, created_at')
      .eq('id', userId)
      .maybeSingle()
    if (staffRow) {
      setProfile(staffRow)
      return staffRow
    }
    const { data: studentRow, error } = await supabase
      .from('students')
      .select('id, first_name, last_name, email, student_number, section, avatar, created_at')
      .eq('id', userId)
      .maybeSingle()
    if (error || !studentRow) return null
    const profileData = { ...studentRow, role: 'student' }
    setProfile(profileData)
    return profileData
  }

  // ---------------------------------------------------------------------------
  // App startup / tab reopen
  //
  // getSession() resolves with the Supabase-persisted session (if any). After
  // confirming a session exists we immediately call isSessionExpired() — this
  // is the check that handles a closed tab, browser restart, or device sleep,
  // because the elapsed time is computed against the persisted LS_LAST_ACTIVE
  // timestamp regardless of whether the tab was ever open in between.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        setLoading(false)
        return
      }

      // Check inactivity before trusting the restored session. This is the
      // primary guard for closed-tab / browser-restart / device-sleep expiry —
      // the elapsed time is computed against the persisted LS_LAST_ACTIVE so the
      // check is accurate even if the tab was closed for hours.
      const lastActive = parseInt(localStorage.getItem(LS_LAST_ACTIVE) ?? '0', 10)
      if (lastActive > 0 && isSessionExpired()) {
        signedOutRef.current = true
        supabase.auth.signOut({ scope: 'local' }).catch(() => {})
        setUser(null)
        setProfile(null)
        localStorage.removeItem(LS_LAST_ACTIVE)
        localStorage.removeItem(LS_REMEMBER_ME)
        localStorage.removeItem(LS_SESSION_EXPIRY)
        setLoading(false)
        return
      }

      setUser(session.user)
      // First load after a fresh login — stamp now so the inactivity clock starts.
      if (lastActive === 0) localStorage.setItem(LS_LAST_ACTIVE, Date.now().toString())
      await fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          // Guard A — we intentionally signed out; block Supabase from
          // restoring the session via a racing TOKEN_REFRESHED event.
          if (signedOutRef.current) {
            supabase.auth.signOut({ scope: 'local' }).catch(() => {})
            setUser(null)
            setProfile(null)
            return
          }
          // Guard B — Supabase is restoring a persisted session on startup or
          // auto-refreshing tokens; check inactivity before accepting it.
          // SIGNED_IN is excluded because it comes from an explicit login call
          // where sq_last_active hasn't been stamped yet.
          if (_event === 'INITIAL_SESSION' || _event === 'TOKEN_REFRESHED') {
            const lastActive = parseInt(localStorage.getItem(LS_LAST_ACTIVE) ?? '0', 10)
            if (lastActive > 0 && isSessionExpired()) {
              signedOutRef.current = true
              supabase.auth.signOut({ scope: 'local' }).catch(() => {})
              setUser(null)
              setProfile(null)
              localStorage.removeItem(LS_LAST_ACTIVE)
              localStorage.removeItem(LS_REMEMBER_ME)
              localStorage.removeItem(LS_SESSION_EXPIRY)
              return
            }
          }
        }

        setUser(session?.user ?? null)
        if (!session?.user) {
          setProfile(null)
          return
        }
        // Defer the profiles query: this callback runs while supabase-js holds
        // the auth lock, and supabase.from(...) needs that same lock to read the
        // access token. Calling it synchronously here deadlocks — which makes a
        // login after a prior logout hang forever (supabase-js #1239).
        setTimeout(() => { fetchProfile(session.user.id) }, 0)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password, rememberMe = false) => {
    // Allow the coming SIGNED_IN event through — user is actively logging in.
    signedOutRef.current = false
    // Wipe any stale local token so signInWithPassword doesn't race with an
    // in-flight auto-refresh of the old session (scope:'local' skips the network call)
    await supabase.auth.signOut({ scope: 'local' })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const metadata = data.user?.user_metadata ?? {}
    // profiles table is authoritative for role (admin/teacher accounts may not have user_metadata.role)
    const profileData = await fetchProfile(data.user.id)
    const role = profileData?.role ?? metadata.role ?? 'student'

    // Stamp the session in localStorage so inactivity tracking starts now.
    const now = Date.now()
    localStorage.setItem(LS_LAST_ACTIVE, now.toString())
    localStorage.setItem(LS_REMEMBER_ME, rememberMe ? '1' : '0')
    if (rememberMe) {
      localStorage.setItem(LS_SESSION_EXPIRY, (now + REMEMBER_ME_MAX_MS).toString())
    } else {
      localStorage.removeItem(LS_SESSION_EXPIRY)
    }
    return { ...metadata, role }
  }

  const signUp = async ({ email, password, firstName, lastName, studentNumber, section }) => {
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('student_number', studentNumber)
      .maybeSingle()
    if (existing) {
      const err = new Error('Student number is already registered.')
      err.code = 'student_number_taken'
      throw err
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'student',
          first_name: firstName,
          last_name: lastName,
          student_number: studentNumber,
          section,
        },
      },
    })
    if (error) throw error
    return data
  }

  const verifyEmailOtp = async (email, token) => {
    signedOutRef.current = false
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' })
    if (error) throw error
    if (data.user) {
      await fetchProfile(data.user.id)
      localStorage.setItem(LS_LAST_ACTIVE, Date.now().toString())
      localStorage.setItem(LS_REMEMBER_ME, '0')
      localStorage.removeItem(LS_SESSION_EXPIRY)
    }
    return data
  }

  const signOut = () => {
    // Flag first so any racing TOKEN_REFRESHED event is blocked immediately.
    signedOutRef.current = true
    supabase.auth.signOut({ scope: 'local' }).catch(() => {})
    setUser(null)
    setProfile(null)
    // Removing LS_LAST_ACTIVE also triggers the storage event in any other
    // open tabs, causing them to log out in sync (see cross-tab handler below).
    localStorage.removeItem(LS_LAST_ACTIVE)
    localStorage.removeItem(LS_REMEMBER_ME)
    localStorage.removeItem(LS_SESSION_EXPIRY)
  }
  // Sync ref every render so effects always hold the latest closure.
  useEffect(() => { signOutRef.current = signOut })

  // ---------------------------------------------------------------------------
  // Activity tracking + multi-vector timeout enforcement
  //
  // Three independent mechanisms ensure the session expires regardless of how
  // the user left the app:
  //
  //  A. Interval timer    — fires every ACTIVITY_CHECK_INTERVAL_MS while the
  //                         tab is open and visible.
  //
  //  B. visibilitychange  — fires the moment the tab becomes visible after
  //                         being hidden (minimize, OS sleep, tab switch, device
  //                         wake). This is what catches "I closed my laptop for
  //                         2 hours" without waiting for the next interval tick.
  //
  //  C. storage event     — fires in every OTHER open tab when localStorage
  //                         changes. Removing LS_LAST_ACTIVE on logout in tab A
  //                         triggers an immediate logout in tabs B, C, etc.
  //
  // None of these rely on an in-memory timer surviving a tab/browser close —
  // the source of truth is always the persisted LS_LAST_ACTIVE timestamp.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!user) return

    // Throttle localStorage writes to at most once every 5 s to avoid
    // hammering storage on every mousemove pixel.
    let lastWrite = 0
    const recordActivity = () => {
      const now = Date.now()
      if (now - lastWrite > 5000) {
        localStorage.setItem(LS_LAST_ACTIVE, now.toString())
        lastWrite = now
      }
    }

    // A. Interval — periodic check while tab is open.
    const handleInterval = () => {
      if (isSessionExpired()) signOutRef.current?.()
    }

    // B. visibilitychange — immediate check when tab/window regains focus.
    // Covers: switching back to the tab, restoring a minimized window,
    // device waking from sleep, returning from another app on mobile.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isSessionExpired()) {
        signOutRef.current?.()
      }
    }

    // C. Cross-tab logout — the storage event only fires in OTHER tabs.
    // When tab A logs out (removes LS_LAST_ACTIVE), every other tab gets
    // this event and mirrors the logout immediately.
    const handleStorageChange = (e) => {
      if (e.key === LS_LAST_ACTIVE && e.newValue === null) {
        signOutRef.current?.()
      }
    }

    const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    ACTIVITY_EVENTS.forEach(e => document.addEventListener(e, recordActivity, { passive: true }))
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(handleInterval, ACTIVITY_CHECK_INTERVAL_MS)

    return () => {
      ACTIVITY_EVENTS.forEach(e => document.removeEventListener(e, recordActivity))
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [user])

  // Re-pull the current user's profile row — call after a profile edit
  // so cached name/section in the UI reflects the saved values.
  const refreshProfile = async () => {
    if (!user?.id) return null
    return fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, verifyEmailOtp, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
