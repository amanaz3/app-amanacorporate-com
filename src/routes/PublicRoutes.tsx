import React from 'react';
import { Route } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';

// Lazy load public components
import {
  LazyUserLogin,
  LazyPartnerLogin,
  LazyPartnerSignupApplication,
  LazyPartnerApplication,
  LazyOTPVerification,
  LazyOpenBankAccount
} from '@/components/LazyComponents';

export const PublicRoutes = (
  <>
    {/* Authentication Routes */}
    <Route path="/user/login" element={
      <PageErrorBoundary pageName="User Login">
        <LazyUserLogin />
      </PageErrorBoundary>
    } />
    
    <Route path="/partner/login" element={
      <PageErrorBoundary pageName="Partner Login">
        <LazyPartnerLogin />
      </PageErrorBoundary>
    } />
    
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
  </>
);