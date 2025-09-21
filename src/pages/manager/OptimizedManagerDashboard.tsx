import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useManagerDashboard } from '@/hooks/useManagerDashboard';
import { ManagerDashboardStats } from '@/components/Manager/ManagerDashboardStats';
import { ManagerRecentActivity } from '@/components/Manager/ManagerRecentActivity';
import { ManagerQuickActions } from '@/components/Manager/ManagerQuickActions';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    {/* Summary cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-12 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Stats sections skeleton */}
    <div className="space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[...Array(7)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-8 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const OptimizedManagerDashboard = () => {
  const navigate = useNavigate();
  const {
    stats,
    recentApplications,
    isLoading,
    error,
    invalidateDashboard,
    prefetchApplication
  } = useManagerDashboard();

  const handleCardClick = (section: string, status: string) => {
    const route = section === 'assigned' 
      ? `/managers/${status}` 
      : `/applications?status=${status}&type=referral`;
    navigate(route);
  };

  const handleApplicationClick = (application: any) => {
    // Prefetch application details
    const type = application.customer_id ? 'customer' : 'application';
    const id = application.customer_id || application.id;
    prefetchApplication(id, type);
    
    // Navigate to application detail
    navigate(`/applications/${application.id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load dashboard data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Manage assigned partner applications and create referral applications
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <ManagerDashboardStats stats={stats} onCardClick={handleCardClick} />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <ManagerQuickActions stats={stats} />
        </div>

        {/* Recent Activity */}
        <ManagerRecentActivity 
          applications={recentApplications}
          onApplicationClick={handleApplicationClick}
        />
      </div>
    </div>
  );
};

export default OptimizedManagerDashboard;