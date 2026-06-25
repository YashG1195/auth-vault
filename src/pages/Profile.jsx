import { useState } from 'react'
import { Link } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile } from '../services/userService'
import Navbar from '../components/Navbar'

export default function Profile() {
  const { currentUser, userProfile, setUserProfile } = useAuth()

  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? '')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const initials = (currentUser?.displayName || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const provider = currentUser?.providerData?.[0]?.providerId ?? 'password'

  async function handleSave(e) {
    e.preventDefault()
    if (!displayName.trim()) return setError('Display name cannot be empty.')
    setError('')
    setStatus('saving')
    try {
      await updateProfile(currentUser, { displayName: displayName.trim() })
      try {
        const updated = await updateUserProfile(currentUser.uid, {
          displayName: displayName.trim(),
        })
        setUserProfile(updated)
      } catch (firestoreErr) {
        console.warn('Firestore profile update failed (non-fatal):', firestoreErr?.code)
      }
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to update profile. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen">
      <div className="gradient-mesh" />
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white mb-1">Your Profile</h1>
        <p className="text-slate-500 text-sm mb-8">Manage your personal information</p>

        <div className="glass-card p-6 mb-6 flex items-center gap-5 animate-fade-in-up">
          <div className="relative shrink-0">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={displayName}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-white truncate">{currentUser?.displayName || 'User'}</p>
            <p className="text-sm text-slate-400 truncate">{currentUser?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                provider === 'google.com'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : provider === 'github.com'
                  ? 'bg-slate-500/10 text-slate-300 border-slate-500/20'
                  : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
              }`}>
                {provider === 'google.com' ? 'Google' : provider === 'github.com' ? 'GitHub' : 'Email'}
              </span>
              {currentUser?.emailVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-base font-semibold text-slate-300 mb-5">Edit Information</h2>

          {status === 'success' && (
            <div className="alert-success mb-4 animate-fade-in-up">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Profile updated successfully!
            </div>
          )}

          {error && (
            <div className="alert-error mb-4 animate-fade-in-up">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-name" className="text-sm font-medium text-slate-300">
                Display name
              </label>
              <input
                id="profile-name"
                type="text"
                className="auth-input"
                value={displayName}
                onChange={e => { setDisplayName(e.target.value); setError('') }}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-email" className="text-sm font-medium text-slate-300">
                Email address
                <span className="ml-2 text-xs text-slate-600 font-normal">(cannot be changed)</span>
              </label>
              <input
                id="profile-email"
                type="email"
                className="auth-input opacity-50 cursor-not-allowed"
                value={currentUser?.email ?? ''}
                disabled
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Firebase UID</label>
              <p className="auth-input text-slate-600 text-xs font-mono overflow-hidden text-ellipsis opacity-60 cursor-default select-all">
                {currentUser?.uid}
              </p>
            </div>

            <button
              id="profile-save-btn"
              type="submit"
              className="btn-primary"
              disabled={status === 'saving'}
            >
              {status === 'saving' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner" />
                  Saving changes…
                </span>
              ) : 'Save changes'}
            </button>
          </form>
        </div>

        {userProfile && (
          <div className="glass-card p-5 mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
              Firestore Profile
            </h2>
            <pre className="text-xs text-slate-500 font-mono overflow-auto bg-slate-900/50 rounded-lg p-3 leading-5">
              {JSON.stringify({
                uid: userProfile.uid,
                email: userProfile.email,
                displayName: userProfile.displayName,
                provider: userProfile.provider,
              }, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  )
}
