import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider, githubProvider } from '../firebase/config'
import { createUserProfile, getUserProfile } from '../services/userService'

// Create the auth context
const AuthContext = createContext(null)

/**
 * AuthProvider wraps the entire app and exposes auth state + methods
 * via the onAuthStateChanged observer — the single source of truth.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  // ── Auth Methods ──────────────────────────────────────────────────────

  async function signup(email, password, displayName) {
    setAuthLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      // Update display name on Firebase Auth profile
      await updateProfile(user, { displayName })
      // Create Firestore user profile document
      await createUserProfile(user, { displayName })
      return user
    } finally {
      setAuthLoading(false)
    }
  }

  async function login(email, password) {
    setAuthLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } finally {
      setAuthLoading(false)
    }
  }

  async function loginWithGoogle() {
    setAuthLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // Create profile if first time
      await createUserProfile(result.user)
      return result.user
    } finally {
      setAuthLoading(false)
    }
  }

  async function loginWithGithub() {
    setAuthLoading(true)
    try {
      const result = await signInWithPopup(auth, githubProvider)
      // Create profile if first time
      await createUserProfile(result.user)
      return result.user
    } finally {
      setAuthLoading(false)
    }
  }

  async function logout() {
    setAuthLoading(true)
    try {
      await signOut(auth)
    } finally {
      setAuthLoading(false)
    }
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email)
  }

  async function updateUserDisplayName(displayName) {
    if (!currentUser) return
    await updateProfile(currentUser, { displayName })
    setCurrentUser({ ...currentUser, displayName })
  }

  // ── Auth State Observer ───────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        // Fetch Firestore profile for additional data
        try {
          const profile = await getUserProfile(user.uid)
          setUserProfile(profile)
        } catch {
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    // Cleanup listener on unmount
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    loading,
    authLoading,
    signup,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    resetPassword,
    updateUserDisplayName,
    setUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until auth state is resolved */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth — consume AuthContext anywhere in the app.
 * Throws if used outside AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
