import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { currentUser, logout, authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const displayName = currentUser?.displayName ?? 'User'
  const photoURL = currentUser?.photoURL
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const isActive = (path) => location.pathname === path

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="max-w-4xl mx-auto mt-4 mx-4 sm:mx-auto rounded-2xl border border-slate-800/60 bg-[rgba(11,15,26,0.8)] backdrop-blur-xl shadow-xl shadow-black/20 px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L6 9V17C6 22.55 10.16 27.74 16 29C21.84 27.74 26 22.55 26 17V9L16 4Z"
                  fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 16L14.5 18.5L20 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              Auth<span className="text-blue-400">Vault</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              to="/dashboard"
              id="nav-dashboard-link"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-blue-500/15 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              id="nav-profile-link"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive('/profile')
                  ? 'bg-blue-500/15 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Profile
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              id="nav-avatar-btn"
              onClick={() => setMenuOpen(o => !o)}
              className="relative flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-800/60 transition-colors"
              aria-label="Open user menu"
              aria-expanded={menuOpen}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                {photoURL ? (
                  <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                )}
              </div>
              <span className="text-sm text-slate-300 font-medium hidden sm:block max-w-[100px] truncate">
                {displayName.split(' ')[0]}
              </span>
              <svg
                width="14" height="14"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`text-slate-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute top-[4.5rem] right-4 w-52 glass-card !rounded-xl overflow-hidden shadow-2xl z-50">
                <div className="px-4 py-3 border-b border-slate-800/60">
                  <p className="text-sm font-medium text-white truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/dashboard"
                    id="dropdown-dashboard-link"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    id="dropdown-profile-link"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Edit Profile
                  </Link>
                </div>

                <div className="border-t border-slate-800/60 py-1">
                  <button
                    id="dropdown-logout-btn"
                    onClick={() => { setMenuOpen(false); handleLogout() }}
                    disabled={loggingOut || authLoading}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    {loggingOut ? 'Signing out…' : 'Sign out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
