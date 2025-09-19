import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';

// Lazy load application components
import {
  LazyApplicationsList,
  LazyApplicationDetail,
  LazyCreateApplication
} from '@/components/LazyComponents';

export const ApplicationRoutes = (
  <Routes>
    {/* Applications List */}
    <Route index element={
      <PageErrorBoundary pageName="Applications List">
        <LazyApplicationsList />
      </PageErrorBoundary>
    } />
    
    {/* Application Detail */}
    <Route path=":applicationId" element={
      <PageErrorBoundary pageName="Application Detail">
        <LazyApplicationDetail />
      </PageErrorBoundary>
    } />
    
    {/* Create Application for specific customer */}
    <Route path="create/:customerId" element={
      <PageErrorBoundary pageName="Create Application">
        <LazyCreateApplication />
      </PageErrorBoundary>
    } />
  </Routes>
);