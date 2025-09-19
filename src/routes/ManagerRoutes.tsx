import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';

// Lazy load manager components
import {
  LazyManagerDashboard,
  LazyNeedMoreInfo,
  LazyReturn,
  LazySubmit,
  LazyDraft,
  LazyPaid,
  LazyCompleted,
  LazyRejected,
  LazyManagerManagement
} from '@/components/LazyComponents';

export const ManagerRoutes = (
  <Routes>
    {/* Manager Dashboard */}
    <Route index element={
      <PageErrorBoundary pageName="Manager Dashboard">
        <LazyManagerDashboard />
      </PageErrorBoundary>
    } />
    
    {/* Application Status Management */}
    <Route path="need-more-info" element={
      <PageErrorBoundary pageName="Need More Info">
        <LazyNeedMoreInfo />
      </PageErrorBoundary>
    } />
    <Route path="return" element={
      <PageErrorBoundary pageName="Return">
        <LazyReturn />
      </PageErrorBoundary>
    } />
    <Route path="submit" element={
      <PageErrorBoundary pageName="Submit">
        <LazySubmit />
      </PageErrorBoundary>
    } />
    <Route path="draft" element={
      <PageErrorBoundary pageName="Draft">
        <LazyDraft />
      </PageErrorBoundary>
    } />
    <Route path="paid" element={
      <PageErrorBoundary pageName="Paid">
        <LazyPaid />
      </PageErrorBoundary>
    } />
    <Route path="completed" element={
      <PageErrorBoundary pageName="Completed">
        <LazyCompleted />
      </PageErrorBoundary>
    } />
    <Route path="rejected" element={
      <PageErrorBoundary pageName="Rejected">
        <LazyRejected />
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