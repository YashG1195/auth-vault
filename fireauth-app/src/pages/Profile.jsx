// src/pages/Profile.jsx  — Protected route
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { currentUser } = useAuth()

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Email:</strong>  {currentUser?.email}</p>
      <p><strong>UID:</strong>    {currentUser?.uid}</p>
      <p><strong>Verified:</strong> {currentUser?.emailVerified ? 'Yes' : 'No'}</p>
      <p><strong>Provider:</strong> {currentUser?.providerData?.[0]?.providerId}</p>
    </div>
  )
}
