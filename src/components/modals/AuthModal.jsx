import React, { useState } from 'react'
import {
  X, Mail, Lock, User, Hash, BookOpen,
  Sparkles, AlertCircle, CheckCircle2,
} from 'lucide-react'
import Button from '../Button'
import Input from '../Input'
import { useAuth } from '../../context/AuthContext'

const EMPTY_FORM = {
  email: '', password: '', confirmPassword: '',
  firstName: '', lastName: '', studentNumber: '', section: '',
}

export function AuthModal({ isOpen, onClose, onLogin }) {
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupDone, setSignupDone] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  if (!isOpen) return null

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const handleClose = () => {
    setError('')
    setSignupDone(false)
    setIsLogin(true)
    setForm(EMPTY_FORM)
    onClose()
  }

  const handleToggle = () => {
    setIsLogin((v) => !v)
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const profile = await signIn(form.email, form.password)
      onLogin(profile?.role ?? 'student')
      handleClose()
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required.')
      return
    }
    if (!form.studentNumber.trim()) {
      setError('Student number is required.')
      return
    }
    if (!form.section.trim()) {
      setError('Section is required.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      const result = await signUp({
        email: form.email,
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        studentNumber: form.studentNumber.trim(),
        section: form.section.trim(),
      })
      if (result.session) {
        onLogin('student')
        handleClose()
      } else {
        setSignupDone(true)
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (signupDone) {
    return (
      <div className="modal-backdrop">
        <div
          className="bg-white dark:bg-stone-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden relative animate-bounce-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-br from-green-50 to-emerald-100 opacity-60" />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-white/70 rounded-full transition-all z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="px-8 py-14 relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 text-green-600 mb-6 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-3">
              Account Created!
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium mb-6">
              Check your email{' '}
              <strong className="text-stone-700 dark:text-stone-200">{form.email}</strong>{' '}
              and click the verification link, then log in.
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => { setSignupDone(false); setIsLogin(true); setError('') }}
            >
              Go to Log In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-backdrop">
      <div
        className="bg-white dark:bg-stone-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden relative animate-bounce-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative background */}
        <div
          className={`absolute top-0 left-0 w-full ${isLogin ? 'h-54' : 'h-64'} bg-linear-to-br from-primary-100 to-accent-100 opacity-60 transition-all duration-500`}
        />
        <div
          className={`absolute -top-12 -right-12 w-40 ${isLogin ? 'h-52' : 'h-72'} bg-secondary-100 rounded-full blur-3xl opacity-60 transition-all duration-500`}
        />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-white/70 rounded-full transition-all z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-10 pb-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 mb-4 shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2 mt-4">
              {isLogin ? 'Welcome back, scientist!' : 'Start your journey!'}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium">
              {isLogin
                ? 'Ready to continue your experiments?'
                : 'Create your student account to start.'}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <div
            className={`transition-all duration-500 ${
              isLogin
                ? 'max-h-96 overflow-hidden'
                : 'max-h-128 overflow-y-auto pr-1'
            }`}
          >
            <form
              onSubmit={isLogin ? handleLogin : handleSignup}
              className="space-y-3"
            >
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="First Name"
                      placeholder="Marie"
                      icon={<User className="w-4 h-4" />}
                      value={form.firstName}
                      onChange={set('firstName')}
                      required
                    />
                    <Input
                      label="Last Name"
                      placeholder="Curie"
                      icon={<User className="w-4 h-4" />}
                      value={form.lastName}
                      onChange={set('lastName')}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Student No."
                      placeholder="2024-0001"
                      icon={<Hash className="w-4 h-4" />}
                      value={form.studentNumber}
                      onChange={set('studentNumber')}
                      required
                    />
                    <Input
                      label="Section"
                      placeholder="STEM-A"
                      icon={<BookOpen className="w-4 h-4" />}
                      value={form.section}
                      onChange={set('section')}
                      required
                    />
                  </div>
                </>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="marie@science.lab"
                icon={<Mail className="w-5 h-5" />}
                value={form.email}
                onChange={set('email')}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                value={form.password}
                onChange={set('password')}
                required
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  required
                />
              )}

              {isLogin && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                {isLogin ? 'Enter Lab' : 'Create Account'}
              </Button>
            </form>
          </div>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={handleToggle}
                className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
