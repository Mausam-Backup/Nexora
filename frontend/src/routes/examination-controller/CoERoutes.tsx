import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleRoute } from '@/components/RoleRoute';

import CoEDashboardOverview from '@/pages/examination-controller/CoEDashboardOverview';
import ExamCycleManager from '@/pages/examination-controller/ExamCycleManager';
import SeatingAllocationEngine from '@/pages/examination-controller/SeatingAllocationEngine';
import InvigilationRosterManager from '@/pages/examination-controller/InvigilationRosterManager';
import HallTicketGatekeeper from '@/pages/examination-controller/HallTicketGatekeeper';
import MarksTrackerModeration from '@/pages/examination-controller/MarksTrackerModeration';
import ResultPublishingEngine from '@/pages/examination-controller/ResultPublishingEngine';
import MalpracticeRegistry from '@/pages/examination-controller/MalpracticeRegistry';

export const CoERoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RoleRoute allowedRoles={['examination_controller', 'admin']}>
            <CoEDashboardOverview />
          </RoleRoute>
        }
      />
      <Route
        path="/cycles"
        element={
          <RoleRoute allowedRoles={['examination_controller', 'admin']}>
            <ExamCycleManager />
          </RoleRoute>
        }
      />
      <Route
        path="/seating"
        element={
          <RoleRoute allowedRoles={['examination_controller', 'admin']}>
            <SeatingAllocationEngine />
          </RoleRoute>
        }
      />
      <Route
        path="/invigilation"
        element={
          <RoleRoute allowedRoles={['examination_controller', 'admin']}>
            <InvigilationRosterManager />
          </RoleRoute>
        }
      />
      <Route
        path="/hall-tickets"
        element={
          <RoleRoute allowedRoles={['examination_controller', 'admin']}>
            <HallTicketGatekeeper />
          </RoleRoute>
        }
      />
      <Route
        path="/moderation"
        element={
          <RoleRoute allowedRoles={['examination_controller', 'admin']}>
            <MarksTrackerModeration />
          </RoleRoute>
        }
      />
      <Route
        path="/publish"
        element={
          <RoleRoute allowedRoles={['examination_controller', 'admin']}>
            <ResultPublishingEngine />
          </RoleRoute>
        }
      />
      <Route
        path="/malpractice"
        element={
          <RoleRoute allowedRoles={['examination_controller', 'admin']}>
            <MalpracticeRegistry />
          </RoleRoute>
        }
      />
      <Route path="*" element={<Navigate to="/examination-controller" replace />} />
    </Routes>
  );
};
