import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Lazy load components for better performance
const OptimizedDashboard = React.lazy(() => import('@/pages/OptimizedDashboard'));
const CustomerList = React.lazy(() => import('@/pages/CustomerList'));

// Manager components
const ManagerDashboard = React.lazy(() => import('@/pages/managers/ManagerDashboard'));
const NeedMoreInfo = React.lazy(() => import('@/pages/managers/NeedMoreInfo'));
const Return = React.lazy(() => import('@/pages/managers/Return'));
const Submit = React.lazy(() => import('@/pages/managers/Submit'));
const Draft = React.lazy(() => import('@/pages/managers/Draft'));
const Paid = React.lazy(() => import('@/pages/managers/Paid'));
const Completed = React.lazy(() => import('@/pages/managers/Completed'));
const Rejected = React.lazy(() => import('@/pages/managers/Rejected'));
const ManagerManagement = React.lazy(() => import('@/pages/managers/ManagerManagement'));

// Partner components
const PartnerDashboard = React.lazy(() => import('@/pages/partners/PartnerDashboard'));
const PartnerNeedMoreInfo = React.lazy(() => import('@/pages/partners/PartnerNeedMoreInfo'));
const PartnerReturn = React.lazy(() => import('@/pages/partners/PartnerReturn'));
const PartnerSubmit = React.lazy(() => import('@/pages/partners/PartnerSubmit'));
const PartnerDraft = React.lazy(() => import('@/pages/partners/PartnerDraft'));
const PartnerPaid = React.lazy(() => import('@/pages/partners/PartnerPaid'));
const PartnerCompleted = React.lazy(() => import('@/pages/partners/PartnerCompleted'));
const PartnerRejected = React.lazy(() => import('@/pages/partners/PartnerRejected'));
const PartnerManagement = React.lazy(() => import('@/pages/partners/PartnerManagement'));
const CompanyManagement = React.lazy(() => import('@/pages/partners/CompanyManagement'));
const PartnerSignupApplication = React.lazy(() => import('@/pages/partners/PartnerSignupApplication'));

// Admin components
const AdminPortal = React.lazy(() => import('@/pages/AdminPortal'));
const UserManagement = React.lazy(() => import('@/pages/admin/UserManagement'));
const AdminManagerManagement = React.lazy(() => import('@/pages/admin/ManagerManagement'));
const AdminPartnerManagement = React.lazy(() => import('@/pages/admin/PartnerManagement'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));
const ApplicationManagement = React.lazy(() => import('@/pages/admin/ApplicationManagement'));

const CustomerDetail = React.lazy(() => import('@/pages/CustomerDetail'));
const SecureUserManagement = React.lazy(() => import('@/pages/SecureUserManagement'));
const CompletedApplications = React.lazy(() => import('@/pages/CompletedApplications'));
const RejectedApplications = React.lazy(() => import('@/pages/RejectedApplications'));

const Settings = React.lazy(() => import('@/pages/Settings'));
const ProductManagement = React.lazy(() => import('@/pages/ProductManagement'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Heavy components
const ProductionMonitor = React.lazy(() => import('@/components/Performance/ProductionMonitor'));
const SecurityCompliance = React.lazy(() => import('@/components/Security/SecurityCompliance'));
const CIATriadDashboard = React.lazy(() => import('@/components/Security/CIATriadDashboard'));

// Loading fallback component
const LoadingFallback: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  </div>
);

// Page loading fallback
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Loading Page</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Please wait while we load the page...</p>
      </CardContent>
    </Card>
  </div>
);

// HOC for lazy loading with error boundary
const withLazyLoading = <P extends object>(
  Component: React.LazyExoticComponent<React.ComponentType<P>>,
  fallbackText?: string
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <Suspense fallback={<LoadingFallback text={fallbackText} />}>
      <Component {...props} ref={ref} />
    </Suspense>
  ));
};

// Export lazy-loaded components with proper loading states
export const LazyOptimizedDashboard = withLazyLoading(OptimizedDashboard, "Loading dashboard...");
export const LazyCustomerList = withLazyLoading(CustomerList, "Loading customer list...");

// Manager components
export const LazyManagerDashboard = withLazyLoading(ManagerDashboard, "Loading manager dashboard...");
export const LazyNeedMoreInfo = withLazyLoading(NeedMoreInfo, "Loading applications needing more info...");
export const LazyReturn = withLazyLoading(Return, "Loading returned applications...");
export const LazySubmit = withLazyLoading(Submit, "Loading submitted applications...");
export const LazyDraft = withLazyLoading(Draft, "Loading draft applications...");
export const LazyPaid = withLazyLoading(Paid, "Loading paid applications...");
export const LazyCompleted = withLazyLoading(Completed, "Loading completed applications...");
export const LazyRejected = withLazyLoading(Rejected, "Loading rejected applications...");
export const LazyManagerManagement = withLazyLoading(ManagerManagement, "Loading manager management...");

// Partner components
export const LazyPartnerDashboard = withLazyLoading(PartnerDashboard, "Loading partner dashboard...");
export const LazyPartnerNeedMoreInfo = withLazyLoading(PartnerNeedMoreInfo, "Loading partner applications needing more info...");
export const LazyPartnerReturn = withLazyLoading(PartnerReturn, "Loading returned partner applications...");
export const LazyPartnerSubmit = withLazyLoading(PartnerSubmit, "Loading submitted partner applications...");
export const LazyPartnerDraft = withLazyLoading(PartnerDraft, "Loading partner draft applications...");
export const LazyPartnerPaid = withLazyLoading(PartnerPaid, "Loading paid partner applications...");
export const LazyPartnerCompleted = withLazyLoading(PartnerCompleted, "Loading completed partner applications...");
export const LazyPartnerRejected = withLazyLoading(PartnerRejected, "Loading rejected partner applications...");
export const LazyPartnerManagement = withLazyLoading(PartnerManagement, "Loading partner management...");
export const LazyCompanyManagement = withLazyLoading(CompanyManagement, "Loading company management...");
export const LazyPartnerSignupApplication = withLazyLoading(PartnerSignupApplication, "Loading partner signup application...");

// Admin components
export const LazyAdminPortal = withLazyLoading(AdminPortal, "Loading admin portal...");
export const LazyUserManagement = withLazyLoading(UserManagement, "Loading user management...");
export const LazyAdminManagerManagement = withLazyLoading(AdminManagerManagement, "Loading manager management...");
export const LazyAdminPartnerManagement = withLazyLoading(AdminPartnerManagement, "Loading partner management...");
export const LazyAdminDashboard = withLazyLoading(AdminDashboard, "Loading admin dashboard...");
export const LazyApplicationManagement = withLazyLoading(ApplicationManagement, "Loading application management...");

export const LazyCustomerDetail = withLazyLoading(CustomerDetail, "Loading customer details...");
export const LazySecureUserManagement = withLazyLoading(SecureUserManagement, "Loading user management...");
export const LazyCompletedApplications = withLazyLoading(CompletedApplications, "Loading completed applications...");
export const LazyRejectedApplications = withLazyLoading(RejectedApplications, "Loading rejected applications...");

export const LazySettings = withLazyLoading(Settings, "Loading settings...");
export const LazyProductManagement = withLazyLoading(ProductManagement, "Loading product management...");
export const LazyNotFound = withLazyLoading(NotFound, "Loading page...");

export const LazyProductionMonitor = withLazyLoading(ProductionMonitor, "Loading performance monitor...");
export const LazySecurityCompliance = withLazyLoading(SecurityCompliance, "Loading security compliance...");
export const LazyCIATriadDashboard = withLazyLoading(CIATriadDashboard, "Loading security dashboard...");

export { LoadingFallback, PageLoadingFallback };