import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/layout'
import { StudentRoutes } from './student'
import { TeacherRoutes } from './teacher'
import { AdminRoutes } from './admin'
import { CoERoutes } from './examination-controller'
import { CommonRoutes } from './common'

export const ProtectedRoutes: React.FC = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Routes>
          {/* Student specific routes */}
          <Route path="/student/*" element={<StudentRoutes />} />
          
          {/* Teacher specific routes */}
          <Route path="/teacher/*" element={<TeacherRoutes />} />
          
          {/* Admin specific routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Examination Controller specific routes */}
          <Route path="/examination-controller/*" element={<CoERoutes />} />
          
          {/* Common routes for all users - MUST BE LAST */}
          <Route path="/*" element={<CommonRoutes />} />
        </Routes>
      </AppLayout>
    </ProtectedRoute>
  )
}