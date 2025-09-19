import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageErrorBoundary from '@/components/PageErrorBoundary';

// Lazy load user components
import {
  LazyUserDashboard
} from '@/components/LazyComponents';

export const UserRoutes = (
  <Routes>
    {/* User Dashboard */}
    <Route index element={
      <PageErrorBoundary pageName="User Dashboard">
        <LazyUserDashboard />
      </PageErrorBoundary>
    } />
  </Routes>
);