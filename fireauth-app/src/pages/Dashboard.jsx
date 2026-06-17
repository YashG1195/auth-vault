// src/pages/Dashboard.jsx  — Protected route
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { currentUser, logout } = useAuth()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: <strong>{currentUser?.email}</strong></p>
      <p>UID: {currentUser?.uid}</p>
      <button onClick={logout}>Sign out</button>
    </div>
  )
}
