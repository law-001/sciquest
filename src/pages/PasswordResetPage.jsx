import React, { useEffect, useState } from 'react'
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'

const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'At least 1 uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'At least 1 lowercase letter', test: (v) => /[a-z]/.test(v) },
  { id: 'number', label: 'At least 1 number', test: (v) => /[0-9]/.test(v) },
]

const isPasswordStrong = (v) => PASSWORD_RULES.every((rule) => rule.test(v))

// Lands here after the user clicks the recovery link in the email. Supabase
// auto-restores a temporary recovery session, which lets us call
// updateUser({ password }). Afterwards we sign out so the user has to log in
// with the new password fresh.
export function PasswordResetPage({ onDone }) {
  const { user, loading, updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [focused, setFocused] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  // Supabase processes the recovery URL async; brief loading flash is fine.
  const expiredScreen = (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-black text-stone-900 dark:text-white">Reset link expired</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          This password reset link is invalid or has expired. Request a new one from the login screen.
        </p>
        <Button className="w-full mt-2" onClick={onDone}>
          Back to home
        </Button>
      </div>
    </div>
  )

  // Give Supabase ~2s to process the hash tokens before deciding the link is dead.
  const [waited, setWaited] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setWaited(true), 2000)
    return () => clearTimeout(id)
  }, [])

  if (loading || (!user && !waited)) {
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
    if (!isPasswordStrong(password)) {
      setError('Please make sure your password meets all the requirements.')
      setFocused(true)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await updatePassword(password)
      // Close the temporary recovery session so the user signs in fresh.
      await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
      setDone(true)
    } catch (err) {
      setError(err.message ?? 'Could not update password. Please try again.')
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
          <h1 className="text-xl font-black text-stone-900 dark:text-white">Password updated</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Sign in with your new password to continue.
          </p>
          <Button className="w-full mt-2" onClick={onDone}>
            Back to login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">Choose a new password</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              You&apos;re resetting the password for
              <strong className="block text-stone-700 dark:text-stone-200 break-all">
                {user.email}
              </strong>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-orange-100 dark:border-stone-700 p-6 flex flex-col gap-4"
        >
          <Input
            label="New password"
            icon={<Lock className="w-4 h-4" />}
            type={showPw ? 'text' : 'password'}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
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

          {focused && (
            <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 px-4 py-3 space-y-1.5 text-sm">
              {PASSWORD_RULES.map((rule) => {
                const pass = rule.test(password)
                return (
                  <div
                    key={rule.id}
                    className={`flex items-center gap-2 font-medium ${
                      pass
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {pass ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                    )}
                    <span>{rule.label}</span>
                  </div>
                )
              })}
            </div>
          )}

          <Input
            label="Confirm new password"
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
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-1"
            isLoading={submitting}
            disabled={!password || !confirm}
          >
            Update password
          </Button>
        </form>
      </div>
    </div>
  )
}
