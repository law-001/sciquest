import React, { useState } from 'react'
import { Eye, EyeOff, GraduationCap, CheckCircle2, User, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'

export function TeacherSetupPage({ onComplete, expired = false }) {
  const { user, loading, refreshProfile } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [showCf, setShowCf]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [done, setDone]           = useState(false)

  const expiredScreen = (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-black text-stone-900 dark:text-white">Invite link expired</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          This link has already been used or has expired. Ask your admin to send a new invite.
        </p>
      </div>
    </div>
  )

  if (expired) return expiredScreen

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-900 flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    )
  }

  if (!user) return expiredScreen

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      // Update auth user: set password + write name into user_metadata
      const { error: authErr } = await supabase.auth.updateUser({
        password,
        data: { first_name: firstName.trim(), last_name: lastName.trim() },
      })
      if (authErr) throw authErr

      // Update the staff row created by the DB trigger when the invite was sent
      const { error: dbErr } = await supabase
        .from('staff')
        .update({ first_name: firstName.trim(), last_name: lastName.trim() })
        .eq('id', user.id)
      if (dbErr) throw dbErr

      await refreshProfile()
      setDone(true)
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-xl font-black text-stone-900 dark:text-white">Account ready!</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Welcome, {firstName}. Your teacher account is all set up.
          </p>
          <Button className="w-full mt-2" onClick={onComplete}>
            Go to Teacher Portal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">Set up your account</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Complete your teacher profile to get started.
            </p>
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-orange-100 dark:border-stone-700 p-6 flex flex-col gap-4"
        >
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              icon={<User className="w-4 h-4" />}
              placeholder="Maria"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              required
            />
            <Input
              label="Last name"
              placeholder="Santos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              required
            />
          </div>

          {/* Email (read-only, for reference) */}
          {user?.email && (
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Email
              </label>
              <div className="w-full h-10 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 px-4 flex items-center text-sm text-stone-500 dark:text-stone-400">
                {user.email}
              </div>
            </div>
          )}

          {/* Password */}
          <Input
            label="Set a password"
            icon={<Lock className="w-4 h-4" />}
            type={showPw ? 'text' : 'password'}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Confirm password */}
          <Input
            label="Confirm password"
            icon={<Lock className="w-4 h-4" />}
            type={showCf ? 'text' : 'password'}
            placeholder="Same password again"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowCf((v) => !v)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                aria-label={showCf ? 'Hide password' : 'Show password'}
              >
                {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full mt-1"
            isLoading={submitting}
            disabled={!firstName.trim() || !lastName.trim() || !password || !confirm}
          >
            Create my account
          </Button>
        </form>
      </div>
    </div>
  )
}
