import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';
import SecureLogin from '@/pages/SecureLogin';

// Lazy load public components  
import {
  LazyPartnerSignupApplication,
  LazyPartnerApplication,
  LazyOTPVerification,
  LazyOpenBankAccount
} from '@/components/LazyComponents';

/**
 * AuthRoutes - Routes for auth.amanacorporate.com domain
 * Only handles login and public authentication-related routes
 */
export const AuthRoutes = () => {
  return (
    <Routes>
      {/* Login Page */}
      <Route path="/login" element={
        <PageErrorBoundary pageName="Login">
          <SecureLogin />
        </PageErrorBoundary>
      } />
      
      {/* Root redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public Partner Signup */}
      <Route path="/partners/signup" element={
        <PageErrorBoundary pageName="Partner Signup Application">
          <LazyPartnerSignupApplication />
        </PageErrorBoundary>
      } />
      
      {/* Public Partner Application */}
      <Route path="/partners/apply" element={
        <PageErrorBoundary pageName="Partner Application">
          <LazyPartnerApplication />
        </PageErrorBoundary>
      } />
      
      {/* OTP Verification */}
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
          <LazyIframeBankAccountForm />
        </PageErrorBoundary>
      } />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Lazy load iframe form
const LazyIframeBankAccountForm = React.lazy(() => import('@/pages/IframeBankAccountForm'));