import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';

// Lazy load partner components
import {
  LazyPartnerDashboard,
  LazyPartnerNeedMoreInfo,
  LazyPartnerReturn,
  LazyPartnerSubmit,
  LazyPartnerDraft,
  LazyPartnerPaid,
  LazyPartnerCompleted,
  LazyPartnerRejected,
  LazyPartnerManagement,
  LazyCompanyManagement
} from '@/components/LazyComponents';

export const PartnerRoutes = (
  <Routes>
    {/* Partner Dashboard */}
    <Route index element={
      <PageErrorBoundary pageName="Partner Dashboard">
        <LazyPartnerDashboard />
      </PageErrorBoundary>
    } />
    
    {/* Partner Application Status Management */}
    <Route path="need-more-info" element={
      <PageErrorBoundary pageName="Partner Need More Info">
        <LazyPartnerNeedMoreInfo />
      </PageErrorBoundary>
    } />
    <Route path="return" element={
      <PageErrorBoundary pageName="Partner Return">
        <LazyPartnerReturn />
      </PageErrorBoundary>
    } />
    <Route path="submit" element={
      <PageErrorBoundary pageName="Partner Submit">
        <LazyPartnerSubmit />
      </PageErrorBoundary>
    } />
    <Route path="draft" element={
      <PageErrorBoundary pageName="Partner Draft">
        <LazyPartnerDraft />
      </PageErrorBoundary>
    } />
    <Route path="paid" element={
      <PageErrorBoundary pageName="Partner Paid">
        <LazyPartnerPaid />
      </PageErrorBoundary>
    } />
    <Route path="completed" element={
      <PageErrorBoundary pageName="Partner Completed">
        <LazyPartnerCompleted />
      </PageErrorBoundary>
    } />
    <Route path="rejected" element={
      <PageErrorBoundary pageName="Partner Rejected">
        <LazyPartnerRejected />
      </PageErrorBoundary>
    } />
    
    {/* Partner Management */}
    <Route path="management" element={
      <PageErrorBoundary pageName="Partner Management">
        <LazyPartnerManagement />
      </PageErrorBoundary>
    } />
    <Route path="company-management" element={
      <PageErrorBoundary pageName="Company Management">
        <LazyCompanyManagement />
      </PageErrorBoundary>
    } />
  </Routes>
);