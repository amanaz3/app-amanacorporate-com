import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';
import ProtectedRoute from '@/components/Security/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';

// Import route groups
import { AdminRoutes } from './AdminRoutes';
import { UserRoutes } from './UserRoutes';
import { ManagerRoutes } from './ManagerRoutes';
import { PartnerRoutes } from './PartnerRoutes';
import { ApplicationRoutes } from './ApplicationRoutes';

// Lazy load app components
import {
  LazyOptimizedDashboard,
  LazyCustomerList,
  LazyCustomerDetail,
  LazySettings,
  LazyProductManagement,
  LazyBankManagement,
  LazyNotFound
} from '@/components/LazyComponents';

/**
 * AppRoutes - Routes for app.amanacorporate.com domain
 * Handles all authenticated dashboard and application routes
 */
export const AppRoutes = () => {
  return (
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
};