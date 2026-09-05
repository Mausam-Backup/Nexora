import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicRoutes } from './PublicRoutes'
import { ProtectedRoutes } from './ProtectedRoutes'
import ParentComingSoon from '@/pages/ParentComingSoon'
import Landing from '@/pages/Landing'
import ExplorePage from '@/pages/Explore'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing & 360 Tour Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/explore" element={<ExplorePage />} />

      {/* Public auth routes */}
      <Route path="/auth/*" element={<PublicRoutes />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/mobile-login" element={<Navigate to="/auth" replace />} />
      <Route path="/mobile-signup" element={<Navigate to="/auth?mode=signup" replace />} />
      
      {/* Parent coming soon page */}
      <Route path="/parent" element={<ParentComingSoon />} />
      
      {/* Protected routes */}
      <Route path="/*" element={<ProtectedRoutes />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}