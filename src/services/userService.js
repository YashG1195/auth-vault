import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const USERS_COLLECTION = 'users'

/**
 * Creates a Firestore user profile document at users/{uid}.
 * Uses setDoc with merge:true so it's safe to call on every OAuth login
 * (only creates if not exists, won't overwrite existing data).
 *
 * @param {import('firebase/auth').User} user - Firebase Auth user object
 * @param {object} [additionalData={}] - Extra fields to store (e.g. displayName)
 */
export async function createUserProfile(user, additionalData = {}) {
  if (!user?.uid) return null

  const userRef = doc(db, USERS_COLLECTION, user.uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    const { email, displayName, photoURL, uid } = user
    const createdAt = serverTimestamp()

    await setDoc(userRef, {
      uid,
      email,
      displayName: additionalData.displayName ?? displayName ?? '',
      photoURL: photoURL ?? '',
      provider: user.providerData?.[0]?.providerId ?? 'password',
      createdAt,
      updatedAt: createdAt,
      ...additionalData,
    })
  }

  return getUserProfile(user.uid)
}

/**
 * Fetches a user's Firestore profile document.
 *
 * @param {string} uid - Firebase Auth user ID
 * @returns {object|null} The user profile data or null if not found
 */
export async function getUserProfile(uid) {
  if (!uid) return null

  const userRef = doc(db, USERS_COLLECTION, uid)
  const snapshot = await getDoc(userRef)

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() }
  }

  return null
}

/**
 * Updates a user's Firestore profile document.
 *
 * @param {string} uid - Firebase Auth user ID
 * @param {object} data - Fields to update
 */
export async function updateUserProfile(uid, data) {
  if (!uid) return

  const userRef = doc(db, USERS_COLLECTION, uid)
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })

  return getUserProfile(uid)
}
