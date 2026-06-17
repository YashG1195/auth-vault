import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from './LoadingScreen'

/**
 * PublicRoute — prevents already-authenticated users from accessing
 * auth pages (login, signup, reset-password).
 * Redirects to /dashboard if already signed in.
 */
export default function PublicRoute() {
  const { currentUser, loading } = useAuth()

  if (loading) return <LoadingScreen />

  return currentUser
    ? <Navigate to="/dashboard" replace />
    : <Outlet />
}
