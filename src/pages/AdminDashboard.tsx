import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Building2,
  UserCog
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalApplications: number;
  draftApplications: number;
  needMoreInfoApplications: number;
  returnApplications: number;
  submitApplications: number;
  rejectedApplications: number;
  completedApplications: number;
  paidApplications: number;
  totalUsers: number;
  totalPartners: number;
  totalManagers: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    draftApplications: 0,
    needMoreInfoApplications: 0,
    returnApplications: 0,
    submitApplications: 0,
    rejectedApplications: 0,
    completedApplications: 0,
    paidApplications: 0,
    totalUsers: 0,
    totalPartners: 0,
    totalManagers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch applications stats
      const { data: applications } = await supabase
        .from('applications')
        .select('status, created_by_role');

      // Fetch user counts
      const { data: users } = await supabase
        .from('profiles')
        .select('role');

      const appStats = applications?.reduce((acc, app) => {
        acc.totalApplications++;
        switch (app.status) {
          case 'draft': acc.draftApplications++; break;
          case 'need_more_info': acc.needMoreInfoApplications++; break;
          case 'return': acc.returnApplications++; break;
          case 'submit': acc.submitApplications++; break;
          case 'rejected': acc.rejectedApplications++; break;
          case 'completed': acc.completedApplications++; break;
          case 'paid': acc.paidApplications++; break;
        }
        return acc;
      }, {
        totalApplications: 0,
        draftApplications: 0,
        needMoreInfoApplications: 0,
        returnApplications: 0,
        submitApplications: 0,
        rejectedApplications: 0,
        completedApplications: 0,
        paidApplications: 0
      });

      const userStats = users?.reduce((acc, user) => {
        switch (user.role) {
          case 'user': acc.totalUsers++; break;
          case 'partner': acc.totalPartners++; break;
          case 'manager': acc.totalManagers++; break;
        }
        return acc;
      }, { totalUsers: 0, totalPartners: 0, totalManagers: 0 });

      setStats({
        ...appStats,
        ...userStats
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusCards = [
    {
      title: 'Draft Applications',
      value: stats.draftApplications,
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      description: 'Applications in draft status'
    },
    {
      title: 'Need More Info',
      value: stats.needMoreInfoApplications,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Applications requiring additional information'
    },
    {
      title: 'Return',
      value: stats.returnApplications,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Applications returned for revision'
    },
    {
      title: 'Submit',
      value: stats.submitApplications,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Applications submitted for review'
    },
    {
      title: 'Rejected',
      value: stats.rejectedApplications,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Rejected applications'
    },
    {
      title: 'Completed',
      value: stats.completedApplications,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Completed applications'
    },
    {
      title: 'Paid',
      value: stats.paidApplications,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Paid applications'
    }
  ];

  const userTypeCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      path: '/admin/users'
    },
    {
      title: 'Total Partners',
      value: stats.totalPartners,
      icon: Building2,
      path: '/admin/partners'
    },
    {
      title: 'Total Managers',
      value: stats.totalManagers,
      icon: UserCog,
      path: '/admin/managers'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of applications and system statistics</p>
        </div>

        {/* Application Status Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Application Status Overview</h2>
            <Button onClick={() => navigate('/admin/applications')}>
              View All Applications
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statusCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`p-2 rounded-md ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Management Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">User Management Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userTypeCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(card.path)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => navigate('/admin/applications')} className="h-auto py-4 flex flex-col items-center">
              <FileText className="h-6 w-6 mb-2" />
              Manage Applications
            </Button>
            <Button onClick={() => navigate('/admin/users')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <Users className="h-6 w-6 mb-2" />
              User Management
            </Button>
            <Button onClick={() => navigate('/admin/partners')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <Building2 className="h-6 w-6 mb-2" />
              Partner Management
            </Button>
            <Button onClick={() => navigate('/admin/statistics')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <BarChart3 className="h-6 w-6 mb-2" />
              View Statistics
            </Button>
          </div>
        </div>

        {/* Total Applications Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Total Applications: {stats.totalApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Draft: {stats.draftApplications}</Badge>
              <Badge variant="outline">Need Info: {stats.needMoreInfoApplications}</Badge>
              <Badge variant="outline">Return: {stats.returnApplications}</Badge>
              <Badge variant="outline">Submit: {stats.submitApplications}</Badge>
              <Badge variant="destructive">Rejected: {stats.rejectedApplications}</Badge>
              <Badge variant="default">Completed: {stats.completedApplications}</Badge>
              <Badge variant="secondary">Paid: {stats.paidApplications}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;