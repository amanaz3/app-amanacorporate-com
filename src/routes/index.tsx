import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';
import ProtectedRoute from '@/components/Security/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';

// Route Group Imports
import { AdminRoutes } from './AdminRoutes';
import { UserRoutes } from './UserRoutes';
import { ManagerRoutes } from './ManagerRoutes';
import { PartnerRoutes } from './PartnerRoutes';
import { ApplicationRoutes } from './ApplicationRoutes';
import { PublicRoutes } from './PublicRoutes';
import { isAuthDomain, isAppDomain } from '@/utils/domainConfig';

// Lazy Component Imports
import {
  LazyOptimizedDashboard,
  LazyCustomerList,
  LazyCustomerDetail,
  LazySettings,
  LazyProductManagement,
  LazyBankManagement,
  LazySystemLogs,
  LazyProductionMonitor,
  LazyCIATriadDashboard,
  LazyNotFound,
  LazyPartnerSignupApplication,
  LazyPartnerApplication,
  LazyOTPVerification,
  LazyOpenBankAccount
} from '@/components/LazyComponents';

// Additional lazy components
const SecureLogin = React.lazy(() => import('@/pages/SecureLogin'));
const IframeBankAccountForm = React.lazy(() => import('@/pages/IframeBankAccountForm'));

/**
 * Auth Domain Routes - for auth.amanacorporate.com
 * Only handles login and public authentication-related routes
 */
const AuthDomainRoutes = () => (
  <Routes>
    {/* Login Page */}
    <Route path="/login" element={
      <PageErrorBoundary pageName="Login">
        <React.Suspense fallback={<div>Loading...</div>}>
          <SecureLogin />
        </React.Suspense>
      </PageErrorBoundary>
    } />
    
    {/* Root redirect to login */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    
    {/* Public Partner Routes */}
    <Route path="/partners/signup" element={
      <PageErrorBoundary pageName="Partner Signup Application">
        <LazyPartnerSignupApplication />
      </PageErrorBoundary>
    } />
    
    <Route path="/partners/apply" element={
      <PageErrorBoundary pageName="Partner Application">
        <LazyPartnerApplication />
      </PageErrorBoundary>
    } />
    
    <Route path="/partners/verify-otp" element={
      <PageErrorBoundary pageName="OTP Verification">
        <LazyOTPVerification />
      </PageErrorBoundary>
    } />
    
    {/* Open Bank Account Page */}
    <Route path="/open-bank-account" element={
      <PageErrorBoundary pageName="Open Bank Account">
        <LazyOpenBankAccount />
      </PageErrorBoundary>
    } />
    
    {/* Iframe-compatible form */}
    <Route path="/iframe/bank-account-form" element={
      <PageErrorBoundary pageName="Bank Account Form">
        <React.Suspense fallback={<div>Loading...</div>}>
          <IframeBankAccountForm />
        </React.Suspense>
      </PageErrorBoundary>
    } />
    
    {/* Catch all - redirect to login */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

/**
 * App Domain Routes - for app.amanacorporate.com
 * Handles all authenticated dashboard and application routes
 */
const AppDomainRoutes = () => (
  <Routes>
    {/* Protected Routes with MainLayout */}
    <Route path="/*" element={
      <ProtectedRoute>
        <MainLayout>
          <Routes>
            {/* Dashboard - Default route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <PageErrorBoundary pageName="Dashboard">
                <LazyOptimizedDashboard />
              </PageErrorBoundary>
            } />
            
            {/* Admin Routes - Admin access required */}
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin>
                {AdminRoutes}
              </ProtectedRoute>
            } />
            
            {/* User Dashboard Routes */}
            <Route path="/user/*" element={UserRoutes} />
            
            {/* Manager Routes */}
            <Route path="/manager/*" element={ManagerRoutes} />
            
            {/* Partner Routes */}
            <Route path="/partner/*" element={PartnerRoutes} />
            
            {/* Applications Routes */}
            <Route path="/applications/*" element={ApplicationRoutes} />
            
            {/* Customer Management */}
            <Route path="/customers" element={
              <PageErrorBoundary pageName="Customer List">
                <LazyCustomerList />
              </PageErrorBoundary>
            } />
            <Route path="/customers/:customerId" element={
              <PageErrorBoundary pageName="Customer Detail">
                <LazyCustomerDetail />
              </PageErrorBoundary>
            } />
            
            {/* Settings */}
            <Route path="/settings" element={
              <PageErrorBoundary pageName="Settings">
                <LazySettings />
              </PageErrorBoundary>
            } />
            
            {/* Product Management */}
            <Route path="/products" element={
              <PageErrorBoundary pageName="Product Management">
                <LazyProductManagement />
              </PageErrorBoundary>
            } />
            
            {/* Bank Management */}
            <Route path="/bank-management" element={
              <ProtectedRoute requireAdmin>
                <PageErrorBoundary pageName="Bank Management">
                  <LazyBankManagement />
                </PageErrorBoundary>
              </ProtectedRoute>
            } />

            {/* System Logs - Admin only */}
            <Route path="/system-logs" element={
              <ProtectedRoute requireAdmin>
                <PageErrorBoundary pageName="System Logs">
                  <LazySystemLogs />
                </PageErrorBoundary>
              </ProtectedRoute>
            } />

            {/* Security Monitoring - Admin only */}
            <Route path="/security-monitor" element={
              <ProtectedRoute requireAdmin>
                <PageErrorBoundary pageName="Security Monitor">
                  <LazyCIATriadDashboard />
                </PageErrorBoundary>
              </ProtectedRoute>
            } />

            {/* Performance Monitoring - Admin only */}
            <Route path="/analytics" element={
              <ProtectedRoute requireAdmin>
                <PageErrorBoundary pageName="Analytics Dashboard">
                  <LazyProductionMonitor />
                </PageErrorBoundary>
              </ProtectedRoute>
            } />
            
            {/* Legacy redirects */}  
            <Route path="/completed" element={<Navigate to="/admin/applications/all?status=completed" replace />} />
            <Route path="/rejected" element={<Navigate to="/admin/applications/all?status=rejected" replace />} />
            <Route path="/pending" element={<Navigate to="/admin/applications/all?status=pending" replace />} />
            
            {/* 404 for app routes */}
            <Route path="*" element={
              <PageErrorBoundary pageName="Not Found">
                <LazyNotFound />
              </PageErrorBoundary>
            } />
          </Routes>
        </MainLayout>
      </ProtectedRoute>
    } />
  </Routes>
);

/**
 * Main App Routes Component
 * Determines which routing to use based on domain
 */
const AppRoutes = () => {
  const currentDomain = window.location.hostname;
  
  // For development, check current path to determine intent
  if (currentDomain === 'localhost') {
    const currentPath = window.location.pathname;
    const authPaths = ['/login', '/partners', '/open-bank-account', '/iframe'];
    const isAuthPath = authPaths.some(path => currentPath.startsWith(path)) || currentPath === '/';
    
    if (isAuthPath) {
      return <AuthDomainRoutes />;
    } else {
      return <AppDomainRoutes />;
    }
  }
  
  // Production domain routing
  if (isAuthDomain()) {
    return <AuthDomainRoutes />;
  } else if (isAppDomain()) {
    return <AppDomainRoutes />;
  }
  
  // Fallback - show auth routes
  return <AuthDomainRoutes />;
};

export default AppRoutes;