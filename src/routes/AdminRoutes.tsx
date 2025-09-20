import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';

// Lazy load admin components
import {
  LazyAdminDashboard,
  LazyAdminStatistics,
  LazyUserManagement,
  LazyAdminManagerManagement,
  LazyAdminPartnerManagement,
  LazyApplicationManagement,
  LazyCreateUser,
  LazyCreateManager,
  LazyCreatePartner,
  LazyPartnerRequests,
  LazyRoleManagement,
  LazyGeneralSettings,
  LazyAllApplicationsOverview,
  LazyUserApplicationsOverview,
  LazyManagerApplicationsOverview,
  LazyPartnerApplicationsOverview,
  LazyUserApplicationsByStatus,
  LazyManagerApplicationsByStatus,
  LazyPartnerApplicationsByStatus,
  LazyBankAccountApplications
} from '@/components/LazyComponents';

export const AdminRoutes = (
  <Routes>
    {/* Main Admin Dashboard */}
    <Route index element={
      <PageErrorBoundary pageName="Admin Dashboard">
        <LazyAdminDashboard />
      </PageErrorBoundary>
    } />
    
    {/* Admin Statistics */}
    <Route path="statistics" element={
      <PageErrorBoundary pageName="Admin Statistics">
        <LazyAdminStatistics />
      </PageErrorBoundary>
    } />
    
    {/* User Management */}
    <Route path="users" element={
      <PageErrorBoundary pageName="User Management">
        <LazyUserManagement />
      </PageErrorBoundary>
    } />
    <Route path="users/create" element={
      <PageErrorBoundary pageName="Create User">
        <LazyCreateUser />
      </PageErrorBoundary>
    } />
    
    {/* Manager Management */}
    <Route path="managers" element={
      <PageErrorBoundary pageName="Manager Management">
        <LazyAdminManagerManagement />
      </PageErrorBoundary>
    } />
    <Route path="managers/create" element={
      <PageErrorBoundary pageName="Create Manager">
        <LazyCreateManager />
      </PageErrorBoundary>
    } />
    
    {/* Partner Management */}
    <Route path="partners" element={
      <PageErrorBoundary pageName="Partner Management">
        <LazyAdminPartnerManagement />
      </PageErrorBoundary>
    } />
    <Route path="partners/create" element={
      <PageErrorBoundary pageName="Create Partner">
        <LazyCreatePartner />
      </PageErrorBoundary>
    } />
    <Route path="partners/requests" element={
      <PageErrorBoundary pageName="Partner Requests">
        <LazyPartnerRequests />
      </PageErrorBoundary>
    } />
    
    {/* Application Management */}
    <Route path="applications" element={
      <PageErrorBoundary pageName="All Applications">
        <LazyAllApplicationsOverview />
      </PageErrorBoundary>
    } />
    
    {/* Bank Account Applications */}
    <Route path="bank-account-applications" element={
      <PageErrorBoundary pageName="Bank Account Applications">
        <LazyBankAccountApplications />
      </PageErrorBoundary>
    } />
    
    {/* Application Overviews by Role */}
    <Route path="applications/users" element={
      <PageErrorBoundary pageName="User Applications Overview">
        <LazyUserApplicationsOverview />
      </PageErrorBoundary>
    } />
    <Route path="applications/managers" element={
      <PageErrorBoundary pageName="Manager Applications Overview">
        <LazyManagerApplicationsOverview />
      </PageErrorBoundary>
    } />
    <Route path="applications/partners" element={
      <PageErrorBoundary pageName="Partner Applications Overview">
        <LazyPartnerApplicationsOverview />
      </PageErrorBoundary>
    } />
    
    {/* Application Status Routes */}
    <Route path="applications/users/:status" element={
      <PageErrorBoundary pageName="User Applications">
        <LazyUserApplicationsByStatus />
      </PageErrorBoundary>
    } />
    <Route path="applications/managers/:status" element={
      <PageErrorBoundary pageName="Manager Applications">
        <LazyManagerApplicationsByStatus />
      </PageErrorBoundary>
    } />
    <Route path="applications/partners/:status" element={
      <PageErrorBoundary pageName="Partner Applications">
        <LazyPartnerApplicationsByStatus />
      </PageErrorBoundary>
    } />
    
    {/* Role Management */}
    <Route path="roles" element={
      <PageErrorBoundary pageName="Role Management">
        <LazyRoleManagement />
      </PageErrorBoundary>
    } />
    
    {/* Settings */}
    <Route path="settings/general" element={
      <PageErrorBoundary pageName="General Settings">
        <LazyGeneralSettings />
      </PageErrorBoundary>
    } />
  </Routes>
);