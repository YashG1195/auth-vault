// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────
// Global auth state via onAuthStateChanged.
// Wrap your app with <AuthProvider> in main.jsx.
// Consume anywhere with: const { currentUser } = useAuth()
// ─────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading]         = useState(true)

  // ── Auth actions ─────────────────────────────────────
  const signup      = (email, pw) => createUserWithEmailAndPassword(auth, email, pw)
  const login       = (email, pw) => signInWithEmailAndPassword(auth, email, pw)
  const loginGoogle = ()          => signInWithPopup(auth, googleProvider)
  const logout      = ()          => signOut(auth)
  const resetPw     = (email)     => sendPasswordResetEmail(auth, email)

  // ── Persistent session observer ───────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe   // cleanup on unmount
  }, [])

  const value = { currentUser, loading, signup, login, loginGoogle, logout, resetPw }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
