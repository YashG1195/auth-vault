import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from './LoadingScreen'

/**
 * PrivateRoute — protects authenticated-only pages.
 * Redirects to /login if user is not signed in.
 * Preserves the attempted URL so we can redirect back after login.
 */
export default function PrivateRoute() {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />

  return currentUser
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />
}
