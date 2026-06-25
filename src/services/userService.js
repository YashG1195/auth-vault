import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const USERS_COLLECTION = 'users'

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

export async function getUserProfile(uid) {
  if (!uid) return null

  const userRef = doc(db, USERS_COLLECTION, uid)
  const snapshot = await getDoc(userRef)

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() }
  }

  return null
}

export async function updateUserProfile(uid, data) {
  if (!uid) return

  const userRef = doc(db, USERS_COLLECTION, uid)
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })

  return getUserProfile(uid)
}
