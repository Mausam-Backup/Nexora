import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { RoleRoute } from '@/components/RoleRoute'
import Index from '@/pages/Index.tsx'
import SmartTimetable from '@/pages/SmartTimetable'
import MyCourses from '@/pages/MyCourses'
import CourseCatalog from '@/pages/CourseCatalog'
import Assignments from '@/pages/Assignments'
import ClassSchedule from '@/pages/ClassSchedule'
import ExamSchedule from '@/pages/ExamSchedule'
import StudentAttendance from '@/pages/StudentAttendance'
import ViewMarks from '@/pages/ViewMarks'
import StudentID from '@/pages/StudentID'
import BillingPayments from '@/pages/BillingPayments'
import StudentProfile from '@/pages/StudentProfile'
import AcademicProgress from '@/pages/AcademicProgress'
import AskAI from '@/pages/AskAI'
import Tasks from '@/pages/Tasks'
import Notes from '@/pages/Notes'

export const StudentRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Primary Student Dashboard */}
      <Route path="/" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <Index />
        </RoleRoute>
      } />
      <Route path="/dashboard" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <Index />
        </RoleRoute>
      } />
      <Route path="/overview" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <Index />
        </RoleRoute>
      } />

      {/* Academic & Timetable */}
      <Route path="/timetable" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <SmartTimetable />
        </RoleRoute>
      } />
      <Route path="/courses" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <MyCourses />
        </RoleRoute>
      } />
      <Route path="/courses/catalog" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <CourseCatalog />
        </RoleRoute>
      } />
      <Route path="/assignments" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <Assignments />
        </RoleRoute>
      } />
      <Route path="/classes" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <ClassSchedule />
        </RoleRoute>
      } />
      <Route path="/exams" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <ExamSchedule />
        </RoleRoute>
      } />

      {/* Attendance & Performance */}
      <Route path="/attendance" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <StudentAttendance />
        </RoleRoute>
      } />
      <Route path="/marks" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <ViewMarks />
        </RoleRoute>
      } />
      <Route path="/academic-progress" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <AcademicProgress />
        </RoleRoute>
      } />

      {/* Profile & ID */}
      <Route path="/id" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <StudentID />
        </RoleRoute>
      } />
      <Route path="/profile" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <StudentProfile />
        </RoleRoute>
      } />
      <Route path="/billing" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <BillingPayments />
        </RoleRoute>
      } />

      {/* Tools */}
      <Route path="/ask-ai" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <AskAI />
        </RoleRoute>
      } />
      <Route path="/tasks" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <Tasks />
        </RoleRoute>
      } />
      <Route path="/notes" element={
        <RoleRoute allowedRoles={['student', 'admin']}>
          <Notes />
        </RoleRoute>
      } />

      {/* Catch-all fallback so student navigation never results in a blank screen */}
      <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
    </Routes>
  )
}