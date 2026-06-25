import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

function VerifyEmailBanner({ email, onResend, onDismiss }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [checking, setChecking] = useState(false)
  const { reloadUser, currentUser } = useAuth()

  async function handleResend() {
    setSending(true)
    try {
      await onResend()
      setSent(true)
    } catch {
      // ignore
    } finally {
      setSending(false)
    }
  }

  async function handleCheckVerified() {
    setChecking(true)
    try {
      await reloadUser()
      // After reload, currentUser.emailVerified updates — parent will re-render and hide banner
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="mx-4 sm:mx-0 mb-6 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in-up">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-amber-300">Verify your email address</p>
          <p className="text-xs text-amber-400/70 mt-0.5 truncate">
            We sent a link to <span className="font-medium text-amber-300">{email}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pl-11 sm:pl-0">
        {sent ? (
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Email sent!
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={sending}
            className="text-xs text-amber-300 hover:text-amber-200 font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            {sending ? (
              <><span className="spinner !w-3 !h-3 !border-amber-400/30 !border-t-amber-400" /> Sending…</>
            ) : 'Resend email'}
          </button>
        )}

        <span className="text-amber-700 text-xs">·</span>

        <button
          onClick={handleCheckVerified}
          disabled={checking}
          className="text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {checking ? (
            <><span className="spinner !w-3 !h-3 !border-slate-500/30 !border-t-slate-400" /> Checking…</>
          ) : 'I verified it'}
        </button>

        <button
          onClick={onDismiss}
          className="ml-1 text-slate-600 hover:text-slate-400 transition-colors"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-lg font-semibold text-white mt-0.5 truncate max-w-[160px]">{value}</p>
      </div>
    </div>
  )
}

function ProviderBadge({ provider }) {
  const map = {
    'google.com': { label: 'Google', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'github.com': { label: 'GitHub', color: 'bg-slate-500/10 text-slate-300 border-slate-500/20' },
    'password': { label: 'Email', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  }
  const { label, color } = map[provider] ?? { label: provider, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {label}
    </span>
  )
}

export default function Dashboard() {
  const { currentUser, userProfile, logout, authLoading, sendVerificationEmail } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      setLoggingOut(false)
    }
  }

  const displayName = currentUser?.displayName || userProfile?.displayName || 'User'
  const email = currentUser?.email ?? ''
  const photoURL = currentUser?.photoURL
  const provider = currentUser?.providerData?.[0]?.providerId ?? 'password'
  const emailVerified = currentUser?.emailVerified
  const isEmailProvider = provider === 'password'
  const showVerifyBanner = isEmailProvider && !emailVerified && !bannerDismissed

  const joined = userProfile?.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }) ?? 'Recently'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen">
      <div className="gradient-mesh" />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        {/* Email verification banner */}
        {showVerifyBanner && (
          <VerifyEmailBanner
            email={email}
            onResend={sendVerificationEmail}
            onDismiss={() => setBannerDismissed(true)}
          />
        )}

        {/* Welcome header */}
        <div className="animate-fade-in-up mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-xl font-bold">
                  {initials}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0b0f1a]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, <span className="gradient-text">{displayName.split(' ')[0]}</span>
              </h1>
              <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-2">
                {email}
                {emailVerified && (
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    verified
                  </span>
                )}
              </p>
            </div>
          </div>

          <p className="text-slate-500 text-sm">
            Your account is protected and your session is active.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <StatCard
            label="Signed in with"
            value={<ProviderBadge provider={provider} />}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            color="bg-blue-500/10"
          />
          <StatCard
            label="Email"
            value={email}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            }
            color="bg-sky-500/10"
          />
          <StatCard
            label="Email verified"
            value={emailVerified ? '✓ Verified' : '✗ Not verified'}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            }
            color={emailVerified ? 'bg-emerald-500/10' : 'bg-amber-500/10'}
          />
          <StatCard
            label="Member since"
            value={joined}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            }
            color="bg-cyan-500/10"
          />
        </div>

        {/* Actions */}
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-base font-semibold text-slate-300 mb-4">Account Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/profile"
              id="dashboard-profile-btn"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-sm font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Edit Profile
            </Link>

            <button
              id="dashboard-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut || authLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all text-sm font-medium disabled:opacity-50"
            >
              {loggingOut ? (
                <>
                  <span className="spinner !border-rose-400/30 !border-t-rose-400 !w-4 !h-4" />
                  Signing out…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </>
              )}
            </button>
          </div>
        </div>

        {/* UID */}
        <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Firebase UID</p>
              <p className="text-xs text-slate-400 font-mono truncate">{currentUser?.uid}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
