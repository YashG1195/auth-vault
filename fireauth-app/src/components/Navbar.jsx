// src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { currentUser, logout } = useAuth()

  return (
    <nav>
      <Link to="/dashboard">Home</Link>
      {currentUser ? (
        <>
          <Link to="/profile">Profile</Link>
          <button onClick={logout}>Sign out</button>
        </>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </nav>
  )
}
