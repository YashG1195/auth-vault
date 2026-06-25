import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

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
  const { currentUser, userProfile, logout, authLoading } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

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
  const joined = userProfile?.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }) ?? 'Recently'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen">
      <div className="gradient-mesh" />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16">
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
              <p className="text-slate-400 text-sm mt-0.5">{email}</p>
            </div>
          </div>

          <p className="text-slate-500 text-sm">
            Your account is protected and your session is active.
          </p>
        </div>

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
            value={currentUser?.emailVerified ? '✓ Verified' : '✗ Not verified'}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            }
            color={currentUser?.emailVerified ? 'bg-emerald-500/10' : 'bg-amber-500/10'}
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
