// src/components/PrivateRoute.jsx
// Redirects unauthenticated users to /login
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute() {
  const { currentUser } = useAuth()
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />
}
