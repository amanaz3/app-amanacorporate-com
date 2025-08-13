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
  UserCog,
  Plus,
  Bell,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ApplicationsByRole {
  draft: number;
  needMoreInfo: number;
  return: number;
  submit: number;
  rejected: number;
  completed: number;
  paid: number;
}

interface DashboardStats {
  totalUsers: number;
  totalPartners: number;
  totalManagers: number;
  userApplications: ApplicationsByRole;
  partnerApplications: ApplicationsByRole;
  managerApplications: ApplicationsByRole;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPartners: 0,
    totalManagers: 0,
    userApplications: { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
    partnerApplications: { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
    managerApplications: { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch applications with role information
      const { data: applications } = await supabase
        .from('applications')
        .select('status, created_by_role');

      // Fetch user counts
      const { data: users } = await supabase
        .from('profiles')
        .select('role');

      // Initialize empty stats
      const userApps: ApplicationsByRole = { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 };
      const partnerApps: ApplicationsByRole = { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 };
      const managerApps: ApplicationsByRole = { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 };

      // Process applications by role
      applications?.forEach(app => {
        const statusKey = app.status === 'need_more_info' ? 'needMoreInfo' : app.status;
        
        if (app.created_by_role === 'user' && userApps.hasOwnProperty(statusKey)) {
          userApps[statusKey as keyof ApplicationsByRole]++;
        } else if (app.created_by_role === 'partner' && partnerApps.hasOwnProperty(statusKey)) {
          partnerApps[statusKey as keyof ApplicationsByRole]++;
        } else if (app.created_by_role === 'manager' && managerApps.hasOwnProperty(statusKey)) {
          managerApps[statusKey as keyof ApplicationsByRole]++;
        }
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
        ...userStats,
        userApplications: userApps,
        partnerApplications: partnerApps,
        managerApplications: managerApps
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCards = (applications: ApplicationsByRole, title: string) => [
    { title: 'Draft', value: applications.draft, icon: FileText, color: 'text-muted-foreground' },
    { title: 'Need More Info', value: applications.needMoreInfo, icon: AlertCircle, color: 'text-orange-500' },
    { title: 'Return', value: applications.return, icon: Clock, color: 'text-yellow-500' },
    { title: 'Submit', value: applications.submit, icon: TrendingUp, color: 'text-blue-500' },
    { title: 'Rejected', value: applications.rejected, icon: XCircle, color: 'text-red-500' },
    { title: 'Completed', value: applications.completed, icon: CheckCircle, color: 'text-green-500' },
    { title: 'Paid', value: applications.paid, icon: CheckCircle, color: 'text-emerald-500' }
  ];

  const userTypeCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      path: '/admin/users',
      color: 'text-blue-500'
    },
    {
      title: 'Total Partners',
      value: stats.totalPartners,
      icon: Building2,
      path: '/admin/partners',
      color: 'text-green-500'
    },
    {
      title: 'Total Managers',
      value: stats.totalManagers,
      icon: UserCog,
      path: '/admin/managers',
      color: 'text-purple-500'
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
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Complete overview of applications, users, and system statistics</p>
        </div>

        {/* Statistics / KPIs */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Statistics / KPIs</h2>
          
          {/* User Management Overview */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">User Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userTypeCards.map((card, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(card.path)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
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

          {/* User Applications */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Applications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {getStatusCards(stats.userApplications, 'User').map((card, index) => (
                <Card key={index} className="text-center">
                  <CardHeader className="pb-2">
                    <div className="flex justify-center mb-2">
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                    <CardTitle className="text-xs">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Partner Applications */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Partner Applications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {getStatusCards(stats.partnerApplications, 'Partner').map((card, index) => (
                <Card key={index} className="text-center">
                  <CardHeader className="pb-2">
                    <div className="flex justify-center mb-2">
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                    <CardTitle className="text-xs">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Manager Referral Applications */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Manager Referral Applications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {getStatusCards(stats.managerApplications, 'Manager').map((card, index) => (
                <Card key={index} className="text-center">
                  <CardHeader className="pb-2">
                    <div className="flex justify-center mb-2">
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                    <CardTitle className="text-xs">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button onClick={() => navigate('/admin/users/create')} className="h-auto py-4 flex flex-col items-center">
              <UserPlus className="h-6 w-6 mb-2" />
              Create User
            </Button>
            <Button onClick={() => navigate('/admin/managers/create')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <UserCog className="h-6 w-6 mb-2" />
              Create Manager
            </Button>
            <Button onClick={() => navigate('/admin/partners/create')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <Building2 className="h-6 w-6 mb-2" />
              Create Partner
            </Button>
            <Button onClick={() => navigate('/admin/partners/assign')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <UserCheck className="h-6 w-6 mb-2" />
              Assign Partners
            </Button>
            <Button onClick={() => navigate('/admin/applications')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <FileText className="h-6 w-6 mb-2" />
              All Applications
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  New Application Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Applications</span>
                    <Badge>{stats.userApplications.submit}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Partner Applications</span>
                    <Badge>{stats.partnerApplications.submit}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Manager Applications</span>
                    <Badge>{stats.managerApplications.submit}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Status Updates from Managers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Need More Info</span>
                    <Badge variant="secondary">
                      {stats.userApplications.needMoreInfo + stats.partnerApplications.needMoreInfo}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Returned Applications</span>
                    <Badge variant="outline">
                      {stats.userApplications.return + stats.partnerApplications.return}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;