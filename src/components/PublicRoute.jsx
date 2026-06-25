import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from './LoadingScreen'

export default function PublicRoute() {
  const { currentUser, loading } = useAuth()

  if (loading) return <LoadingScreen />

  return currentUser
    ? <Navigate to="/dashboard" replace />
    : <Outlet />
}
