import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';

// Lazy load manager components
import {
  LazyOptimizedDashboard,
  LazyManagerManagement,
  LazyCompletedApplications,
  LazyRejectedApplications
} from '@/components/LazyComponents';

export const ManagerRoutes = (
  <Routes>
    {/* Manager Dashboard */}
    <Route index element={
      <PageErrorBoundary pageName="Manager Dashboard">
        <LazyOptimizedDashboard />
      </PageErrorBoundary>
    } />
    
    {/* Redirect status routes to unified views */}
    <Route path="completed" element={
      <PageErrorBoundary pageName="Completed Applications">
        <LazyCompletedApplications />
      </PageErrorBoundary>
    } />
    <Route path="rejected" element={
      <PageErrorBoundary pageName="Rejected Applications">
        <LazyRejectedApplications />
      </PageErrorBoundary>
    } />
    
    {/* Manager Management */}
    <Route path="management" element={
      <PageErrorBoundary pageName="Manager Management">
        <LazyManagerManagement />
      </PageErrorBoundary>
    } />
  </Routes>
);