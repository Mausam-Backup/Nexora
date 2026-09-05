import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface RoleRouteProps {
  allowedRoles: Array<'student' | 'teacher' | 'admin' | 'parent' | 'examination_controller'>
  children: React.ReactNode
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Fallback to localStorage in case of fast redirect before React state update
  let activeUser = user
  if (!activeUser) {
    try {
      const saved = localStorage.getItem('campussync-user')
      if (saved) activeUser = JSON.parse(saved)
    } catch (e) {}
  }

  const isAuthed = isAuthenticated || !!activeUser

  if (!isAuthed) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  const role = activeUser?.role
  if (!role || !allowedRoles.includes(role)) {
    // Instead of bouncing to '/', send the user to their own valid portal!
    const roleHome = 
      role === 'admin' 
        ? '/admin/overview' 
        : role === 'teacher' 
        ? '/teacher/attendance' 
        : role === 'examination_controller' 
        ? '/examination-controller' 
        : '/student/dashboard'
    return <Navigate to={roleHome} replace />
  }

  return <>{children}</>
}
