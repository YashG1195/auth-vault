import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length

  const barColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  if (!password) return null

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? barColors[score - 1] : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${
          score <= 1 ? 'text-red-400' : score === 2 ? 'text-orange-400' : score === 3 ? 'text-yellow-400' : 'text-emerald-400'
        }`}>
          {labels[score - 1] ?? 'Weak'}
        </span>
        <div className="flex gap-2">
          {checks.map(c => (
            <span
              key={c.label}
              className={`text-xs flex items-center gap-1 transition-colors ${c.pass ? 'text-emerald-400' : 'text-slate-600'}`}
              title={c.label}
            >
              <CheckIcon />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Signup() {
  const { signup, authLoading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) return setError('Please enter your display name.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')

    setSubmitting(true)
    try {
      await signup(form.email, form.password, form.name.trim())
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getFriendlyError(err.code))
    } finally {
      setSubmitting(false)
    }
  }

  const isLoading = submitting || authLoading

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Auth Vault — it's free, always"
    >
      {error && (
        <div className="alert-error animate-fade-in-up">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-name" className="text-sm font-medium text-slate-300">
            Display name
          </label>
          <input
            id="signup-name"
            type="text"
            className="auth-input"
            placeholder="Your full name"
            value={form.name}
            onChange={update('name')}
            required
            autoComplete="name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-sm font-medium text-slate-300">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={update('email')}
            required
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium text-slate-300">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input pr-11"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={update('password')}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          <PasswordStrength password={form.password} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-confirm" className="text-sm font-medium text-slate-300">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type={showPassword ? 'text' : 'password'}
            className="auth-input"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={update('confirm')}
            required
            autoComplete="new-password"
          />
          {form.confirm && form.password !== form.confirm && (
            <p className="text-xs text-rose-400 mt-1">Passwords don&apos;t match</p>
          )}
        </div>

        <button
          id="signup-submit-btn"
          type="submit"
          className="btn-primary mt-1"
          disabled={isLoading}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" />
              Creating account…
            </span>
          ) : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

function getFriendlyError(code) {
  const errors = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger one.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/operation-not-allowed': 'Email/password sign-up is not enabled. Enable it in Firebase Console under Authentication → Sign-in method.',
    'auth/unauthorized-domain': 'This domain is not authorized. Add it in Firebase Console under Authentication → Settings → Authorized domains.',
    'auth/invalid-api-key': 'Invalid Firebase configuration. Check your environment variables.',
  }
  return errors[code] ?? `Sign-up failed (${code ?? 'unknown'}). Please try again.`
}
