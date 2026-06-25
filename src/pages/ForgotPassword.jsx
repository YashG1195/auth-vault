import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setStatus('loading')
    try {
      await resetPassword(email)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(getFriendlyError(err.code))
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send a reset link to your inbox"
    >
      {status === 'success' ? (
        <div className="flex flex-col items-center gap-5 py-4 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-1">Check your email</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We sent a password reset link to<br />
              <span className="text-blue-400 font-medium">{email}</span>
            </p>
          </div>
          <p className="text-xs text-slate-600 text-center">
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button
              onClick={() => setStatus('idle')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              try again
            </button>
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div className="alert-error animate-fade-in-up">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <p className="text-sm text-slate-400 -mt-1 leading-relaxed">
            Enter the email associated with your account and we&apos;ll send you
            a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-email" className="text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                required
                autoComplete="email"
              />
            </div>

            <button
              id="reset-submit-btn"
              type="submit"
              className="btn-primary mt-1"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner" />
                  Sending reset link…
                </span>
              ) : 'Send reset link'}
            </button>
          </form>
        </>
      )}

      <p className="text-center text-sm text-slate-500">
        Remember your password?{' '}
        <Link
          to="/login"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

function getFriendlyError(code) {
  const errors = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many requests. Please wait before trying again.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
  }
  return errors[code] ?? 'Failed to send reset email. Please try again.'
}
