import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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

  const signIn = async (email, password) => {
    // Wipe any stale local token so signInWithPassword doesn't race with an
    // in-flight auto-refresh of the old session (scope:'local' skips the network call)
    await supabase.auth.signOut({ scope: 'local' })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const metadata = data.user?.user_metadata ?? {}
    // profiles table is authoritative for role (admin/teacher accounts may not have user_metadata.role)
    const profileData = await fetchProfile(data.user.id)
    const role = profileData?.role ?? metadata.role ?? 'student'
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
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' })
    if (error) throw error
    if (data.user) await fetchProfile(data.user.id)
    return data
  }

  const signOut = () => {
    supabase.auth.signOut({ scope: 'local' }).catch(() => {})
    setUser(null)
    setProfile(null)
  }

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
