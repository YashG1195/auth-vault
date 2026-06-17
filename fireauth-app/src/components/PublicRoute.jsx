// src/components/PublicRoute.jsx
// Redirects already-logged-in users away from auth pages
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PublicRoute() {
  const { currentUser } = useAuth()
  return currentUser ? <Navigate to="/dashboard" replace /> : <Outlet />
}
