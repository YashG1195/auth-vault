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
import { auth, googleProvider } from '../firebase'
import { createUserProfile, getUserProfile } from '../services/userService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  async function signup(email, password, displayName) {
    setAuthLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName })
      // Firestore profile creation is best-effort — don't block auth if it fails
      try {
        await createUserProfile(user, { displayName })
      } catch (profileErr) {
        console.warn('Firestore profile creation failed (non-fatal):', profileErr?.code)
      }
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
      // Firestore profile creation is best-effort — don't block auth if it fails
      try {
        await createUserProfile(result.user)
      } catch (profileErr) {
        console.warn('Firestore profile creation failed (non-fatal):', profileErr?.code)
      }
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
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
    logout,
    resetPassword,
    updateUserDisplayName,
    setUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
