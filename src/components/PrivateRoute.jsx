import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from './LoadingScreen'

export default function PrivateRoute() {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />

  return currentUser
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />
}
