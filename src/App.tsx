
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SecureAuthContext';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageErrorBoundary from '@/components/PageErrorBoundary';
import ProtectedRoute from '@/components/Security/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import SecureLogin from '@/pages/SecureLogin';
import {
  LazyOptimizedDashboard,
  LazyCustomerList,
  LazyManagerDashboard,
  LazyNeedMoreInfo,
  LazyReturn,
  LazySubmit,
  LazyDraft,
  LazyPaid,
  LazyCompleted,
  LazyRejected,
  LazyManagerManagement,
  LazyPartnerDashboard,
  LazyPartnerNeedMoreInfo,
  LazyPartnerReturn,
  LazyPartnerSubmit,
  LazyPartnerDraft,
  LazyPartnerPaid,
  LazyPartnerCompleted,
  LazyPartnerRejected,
  LazyPartnerManagement,
  LazyCompanyManagement,
  LazyPartnerSignupApplication,
  LazyCustomerDetail,
  LazySecureUserManagement,
  LazyCompletedApplications,
  LazyRejectedApplications,
  LazySettings,
  LazyProductManagement,
  LazyNotFound,
  
  LazyUserManagement,
  LazyAdminManagerManagement,
  LazyAdminPartnerManagement,
  LazyAdminDashboard,
  LazyApplicationManagement,
  LazyAdminStatistics,
  LazyCreateUser,
  LazyCreateManager,
  LazyCreatePartner,
  LazyUserApplications,
  LazyGeneralSettings,
  LazyUserApplicationsByStatus,
  LazyManagerApplicationsByStatus,
  LazyPartnerApplicationsByStatus,
  LazyAllApplicationsOverview,
  LazyUserApplicationsOverview,
  LazyManagerApplicationsOverview,
  LazyPartnerApplicationsOverview,
  LazyUserDashboard,
  PageLoadingFallback
} from '@/components/LazyComponents';
import ErrorTracker from '@/utils/errorTracking';
import PerformanceMonitor from '@/utils/performanceMonitoring';
import FeatureAnalytics from '@/utils/featureAnalytics';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize monitoring systems
    ErrorTracker.init();
    PerformanceMonitor.init();
    PerformanceMonitor.trackPageLoad();
    FeatureAnalytics.init();

    // Track app initialization
    FeatureAnalytics.trackUserEngagement('session_start');

    return () => {
      // Cleanup on unmount
      PerformanceMonitor.cleanup();
      FeatureAnalytics.clearData();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        onError={(error, errorInfo) => {
          // Log application-level errors
          ErrorTracker.captureError(error, { component: 'App', ...errorInfo });
        }}
      >
        <Router>
          <AuthProvider>
            <CustomerProvider>
              <NotificationProvider>
                <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/login" element={
                    <PageErrorBoundary pageName="Login">
                      <SecureLogin />
                    </PageErrorBoundary>
                  } />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Dashboard">
                          <LazyAdminDashboard />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/statistics" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Admin Statistics">
                          <LazyAdminStatistics />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/customers" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <PageErrorBoundary pageName="Customer List">
                          <LazyCustomerList />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  
                   {/* Manager routes */}
                   <Route path="/manager-dashboard" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Manager Dashboard">
                           <LazyManagerDashboard />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                  <Route path="/managers/need-more-info" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Need More Info">
                          <LazyNeedMoreInfo />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/managers/return" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Return">
                          <LazyReturn />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/managers/submit" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Submit">
                          <LazySubmit />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/managers/draft" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Draft">
                          <LazyDraft />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/managers/paid" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Paid">
                          <LazyPaid />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/managers/completed" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Completed">
                          <LazyCompleted />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/managers/rejected" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Rejected">
                          <LazyRejected />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                   <Route path="/managers/management" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Manager Management">
                           <LazyManagerManagement />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   
                     {/* User routes */}
                     <Route path="/user-dashboard" element={
                       <ProtectedRoute>
                         <MainLayout>
                           <PageErrorBoundary pageName="User Dashboard">
                             <LazyUserDashboard />
                           </PageErrorBoundary>
                         </MainLayout>
                       </ProtectedRoute>
                     } />

                     {/* Partner routes */}
                     <Route path="/partner-dashboard" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="Partner Dashboard">
                            <LazyPartnerDashboard />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                   <Route path="/partners/need-more-info" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Partner Need More Info">
                           <LazyPartnerNeedMoreInfo />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   <Route path="/partners/return" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Partner Return">
                           <LazyPartnerReturn />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   <Route path="/partners/submit" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Partner Submit">
                           <LazyPartnerSubmit />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   <Route path="/partners/draft" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Partner Draft">
                           <LazyPartnerDraft />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   <Route path="/partners/paid" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Partner Paid">
                           <LazyPartnerPaid />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   <Route path="/partners/completed" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Partner Completed">
                           <LazyPartnerCompleted />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   <Route path="/partners/rejected" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Partner Rejected">
                           <LazyPartnerRejected />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   <Route path="/partners/management" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Partner Management">
                           <LazyPartnerManagement />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   <Route path="/partners/company-management" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Company Management">
                           <LazyCompanyManagement />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                    <Route path="/partners/signup" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="Partner Signup Application">
                           <LazyPartnerSignupApplication />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   
                    {/* Admin Routes */}
                    <Route path="/users" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="User Management">
                            <LazyUserManagement />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                     <Route path="/managers" element={
                       <ProtectedRoute requireAdmin>
                         <MainLayout>
                           <PageErrorBoundary pageName="Manager Management">
                             <LazyAdminManagerManagement />
                           </PageErrorBoundary>
                         </MainLayout>
                       </ProtectedRoute>
                     } />
                    <Route path="/partners" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="Partner Management">
                            <LazyAdminPartnerManagement />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                     } />
                   {/* All Applications Overview */}
                   <Route path="/admin/applications" element={
                     <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="All Applications">
                            <LazyAllApplicationsOverview />
                         </PageErrorBoundary>
                       </MainLayout>
                     </ProtectedRoute>
                   } />
                   
                    {/* Admin User Routes */}
                    <Route path="/users/create" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="Create User">
                            <LazyCreateUser />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Manager Routes */}
                    <Route path="/managers/create" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="Create Manager">
                            <LazyCreateManager />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Partner Routes */}
                    <Route path="/partners/create" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="Create Partner">
                            <LazyCreatePartner />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                   
                    {/* Application Overview Routes */}
                    <Route path="/users/applications" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="User Applications Overview">
                            <LazyUserApplicationsOverview />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/managers/applications" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="Manager Applications Overview">
                            <LazyManagerApplicationsOverview />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/partners/applications" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="Partner Applications Overview">
                            <LazyPartnerApplicationsOverview />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    {/* Application Status Routes */}
                    <Route path="/users/applications/:status" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="User Applications">
                            <LazyUserApplicationsByStatus />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/managers/applications/:status" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="Manager Applications">
                            <LazyManagerApplicationsByStatus />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/partners/applications/:status" element={
                      <ProtectedRoute requireAdmin>
                        <MainLayout>
                          <PageErrorBoundary pageName="Partner Applications">
                            <LazyPartnerApplicationsByStatus />
                          </PageErrorBoundary>
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                   
                   {/* Settings Routes */}
                   <Route path="/admin/settings/general" element={
                     <ProtectedRoute requireAdmin>
                       <MainLayout>
                         <PageErrorBoundary pageName="General Settings">
                           <LazyGeneralSettings />
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
                  
                  <Route path="/products" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout>
                        <PageErrorBoundary pageName="Product Management">
                          <LazyProductManagement />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <PageErrorBoundary pageName="Settings">
                          <LazySettings />
                        </PageErrorBoundary>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={
                    <PageErrorBoundary pageName="Not Found">
                      <LazyNotFound />
                    </PageErrorBoundary>
                  } />
                  </Routes>
                </div>
              </NotificationProvider>
            </CustomerProvider>
          </AuthProvider>
          <Toaster />
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
