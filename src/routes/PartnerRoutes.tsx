import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';

// Lazy load partner components
import {
  LazyOptimizedDashboard,
  LazyAdminPartnerManagement,
  LazyCompanyManagement,
  LazyCompletedApplications,
  LazyRejectedApplications
} from '@/components/LazyComponents';

export const PartnerRoutes = (
  <Routes>
    {/* Partner Dashboard */}
    <Route index element={
      <PageErrorBoundary pageName="Partner Dashboard">
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
    
    {/* Partner Management */}
    <Route path="management" element={
      <PageErrorBoundary pageName="Partner Management">
        <LazyAdminPartnerManagement />
      </PageErrorBoundary>
    } />
    <Route path="company-management" element={
      <PageErrorBoundary pageName="Company Management">
        <LazyCompanyManagement />
      </PageErrorBoundary>
    } />
  </Routes>
);