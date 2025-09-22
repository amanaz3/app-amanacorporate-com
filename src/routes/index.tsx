import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';
import ProtectedRoute from '@/components/Security/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import SecureLogin from '@/pages/SecureLogin';
import IframeBankAccountForm from '@/pages/IframeBankAccountForm';

// Import route groups
import { PublicRoutes } from './PublicRoutes';
import { AdminRoutes } from './AdminRoutes';
import { UserRoutes } from './UserRoutes';
import { ManagerRoutes } from './ManagerRoutes';
import { PartnerRoutes } from './PartnerRoutes';
import { ApplicationRoutes } from './ApplicationRoutes';

// Import lazy components
import { 
  LazyNotFound, 
  LazySettings, 
  LazyProductManagement, 
  LazyOptimizedDashboard,
  LazyCustomerList,
  LazyCustomerDetail,
  LazyCompletedApplications,
  LazyRejectedApplications,
  LazyApplicationsList,
  LazyApplicationDetail,
  LazyCreateApplication,
  LazyProductionMonitor,
  LazyCIATriadDashboard,
  LazyBankManagement,
  LazyNotificationCenter,
  LazySystemLogs
} from '@/components/LazyComponents';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Iframe-compatible routes - No authentication required */}
      <Route path="/iframe/bank-account-form" element={
        <PageErrorBoundary pageName="Iframe Bank Account Form">
          <IframeBankAccountForm />
        </PageErrorBoundary>
      } />
      
      {/* Public Routes - No authentication required */}
      <Route path="/login" element={
        <PageErrorBoundary pageName="Login">
          <SecureLogin />
        </PageErrorBoundary>
      } />
      
      {/* Public Routes */}
      {PublicRoutes}
      
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Admin Routes - Admin access required */}
      <Route path="/admin/*" element={
        <ProtectedRoute requireAdmin>
          <MainLayout>
            {AdminRoutes}
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requireAdmin>
          <MainLayout>
            <PageErrorBoundary pageName="Admin Dashboard">
              <LazyOptimizedDashboard />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* User Routes - Any authenticated user */}
      <Route path="/user/*" element={
        <ProtectedRoute>
          <MainLayout>
            {UserRoutes}
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Manager Routes - Admin access required */}
      <Route path="/managers/*" element={
        <ProtectedRoute requireAdmin>
          <MainLayout>
            {ManagerRoutes}
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Partner Routes - Admin access required */}
      <Route path="/partners/*" element={
        <ProtectedRoute requireAdmin>
          <MainLayout>
            {PartnerRoutes}
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Application Routes - Any authenticated user */}
      <Route path="/applications" element={
        <ProtectedRoute>
          <MainLayout>
            <PageErrorBoundary pageName="Applications List">
              <LazyApplicationsList />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/applications/new" element={
        <ProtectedRoute>
          <MainLayout>
            <PageErrorBoundary pageName="New Bank Account Application">
              <LazyCreateApplication />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/applications/:applicationId" element={
        <ProtectedRoute>
          <MainLayout>
            <PageErrorBoundary pageName="Application Detail">
              <LazyApplicationDetail />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/customers/:customerId/applications/create" element={
        <ProtectedRoute>
          <MainLayout>
            <PageErrorBoundary pageName="Create Application">
              <LazyCreateApplication />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Customer Routes - Any authenticated user */}
      <Route path="/customers" element={
        <ProtectedRoute>
          <MainLayout>
            <PageErrorBoundary pageName="Customer List">
              <LazyCustomerList />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/customers/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <PageErrorBoundary pageName="Customer Details">
              <LazyCustomerDetail />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/completed" element={
        <ProtectedRoute>
          <MainLayout>
            <PageErrorBoundary pageName="Completed Applications">
              <LazyCompletedApplications />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/rejected" element={
        <ProtectedRoute>
          <MainLayout>
            <PageErrorBoundary pageName="Rejected Applications">
              <LazyRejectedApplications />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Settings Routes - Any authenticated user */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <PageErrorBoundary pageName="Settings">
              <LazySettings />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Products Routes - Admin only */}
      <Route path="/products" element={
        <ProtectedRoute requireAdmin>
          <MainLayout>
            <PageErrorBoundary pageName="Product Management">
              <LazyProductManagement />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Bank Management Routes - Admin only */}
      <Route path="/admin/banks" element={
        <ProtectedRoute requireAdmin>
          <MainLayout>
            <PageErrorBoundary pageName="Bank Management">
              <LazyBankManagement />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* System Logs Routes - Admin only */}
      <Route path="/admin/logs" element={
        <ProtectedRoute requireAdmin>
          <MainLayout>
            <PageErrorBoundary pageName="System Logs">
              <LazySystemLogs />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Monitoring Routes - Admin only */}
      <Route path="/monitoring/performance" element={
        <ProtectedRoute requireAdmin>
          <MainLayout>
            <PageErrorBoundary pageName="Performance Monitor">
              <LazyProductionMonitor />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Security Routes - Admin only */}
      <Route path="/security/cia-dashboard" element={
        <ProtectedRoute requireAdmin>
          <MainLayout>
            <PageErrorBoundary pageName="CIA Triad Dashboard">
              <LazyCIATriadDashboard />
            </PageErrorBoundary>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Legacy route redirects */}
      <Route path="/manager-dashboard" element={<Navigate to="/managers" replace />} />
      <Route path="/partner-dashboard" element={<Navigate to="/partners" replace />} />
      <Route path="/user-dashboard" element={<Navigate to="/user" replace />} />
      
      {/* 404 - Not Found */}
      <Route path="*" element={
        <PageErrorBoundary pageName="Not Found">
          <LazyNotFound />
        </PageErrorBoundary>
      } />
    </Routes>
  );
};

export default AppRoutes;