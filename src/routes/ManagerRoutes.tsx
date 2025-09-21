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

// Import the new optimized manager dashboard
const OptimizedManagerDashboard = React.lazy(() => import('@/pages/manager/OptimizedManagerDashboard'));

export const ManagerRoutes = (
  <Routes>
    {/* Manager Dashboard - Use optimized version */}
    <Route index element={
      <PageErrorBoundary pageName="Manager Dashboard">
        <React.Suspense fallback={<div>Loading dashboard...</div>}>
          <OptimizedManagerDashboard />
        </React.Suspense>
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