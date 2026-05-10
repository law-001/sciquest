import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (!error && data) setProfile(data)
    return data ?? null
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
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
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
      .from('profiles')
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
    console.log('[signOut] called, current user:', user?.id ?? 'none')
    supabase.auth.signOut({ scope: 'local' }).catch(err => {
      console.error('[signOut] Supabase background error:', err)
    })
    console.log('[signOut] clearing user/profile state')
    setUser(null)
    setProfile(null)
    console.log('[signOut] done')
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, verifyEmailOtp }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
