import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  Building2, 
  UserCog, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ApplicationStats {
  draft: number;
  need_more_info: number;
  return: number;
  submit: number;
  rejected: number;
  completed: number;
  paid: number;
}

interface DetailedStats {
  totalUsers: number;
  totalPartners: number;
  totalManagers: number;
  userApplications: ApplicationStats;
  partnerApplications: ApplicationStats;
  managerApplications: ApplicationStats;
  totalApplications: number;
  monthlyApplications: Array<{ month: string; count: number; }>;
}

const AdminStatistics = () => {
  const [stats, setStats] = useState<DetailedStats>({
    totalUsers: 0,
    totalPartners: 0,
    totalManagers: 0,
    userApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
    partnerApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
    managerApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
    totalApplications: 0,
    monthlyApplications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetailedStats();
  }, []);

  const fetchDetailedStats = async () => {
    try {
      // Fetch user counts by role
      const { data: profiles } = await supabase
        .from('profiles')
        .select('role');

      // Fetch applications using account_applications
      const { data: applications } = await supabase
        .from('account_applications')
        .select('status, created_at');

      const userCounts = profiles?.reduce((acc, profile) => {
        switch (profile.role) {
          case 'user': acc.totalUsers++; break;
          case 'manager': acc.totalManagers++; break;
          case 'admin': break; // Don't count admins as partners
        }
        return acc;
      }, { totalUsers: 0, totalPartners: 0, totalManagers: 0 }) || { totalUsers: 0, totalPartners: 0, totalManagers: 0 };

      const appStats = applications?.reduce((acc, app) => {
        acc.totalApplications++;
        
        // Count by status (simplified as we don't have created_by_role)
        const status = app.status.toLowerCase() as keyof ApplicationStats;
        if (acc.userApplications.hasOwnProperty(status)) {
          acc.userApplications[status]++;
        }

        return acc;
      }, {
        totalApplications: 0,
        userApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
        partnerApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
        managerApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 }
      }) || {
        totalApplications: 0,
        userApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
        partnerApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
        managerApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 }
      };

      // Generate monthly application data (last 6 months)
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        const monthApps = applications?.filter(app => {
          const appDate = new Date(app.created_at);
          return appDate.getMonth() === date.getMonth() && appDate.getFullYear() === date.getFullYear();
        }).length || 0;

        monthlyData.push({ month: monthName, count: monthApps });
      }

      setStats({
        ...userCounts,
        ...appStats,
        monthlyApplications: monthlyData
      });
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: '#6b7280',
      need_more_info: '#f59e0b',
      return: '#eab308',
      submit: '#3b82f6',
      rejected: '#ef4444',
      completed: '#10b981',
      paid: '#059669'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const chartData = [
    { name: 'Draft', user: stats.userApplications.draft, partner: stats.partnerApplications.draft, manager: stats.managerApplications.draft },
    { name: 'Need Info', user: stats.userApplications.need_more_info, partner: stats.partnerApplications.need_more_info, manager: stats.managerApplications.need_more_info },
    { name: 'Return', user: stats.userApplications.return, partner: stats.partnerApplications.return, manager: stats.managerApplications.return },
    { name: 'Submit', user: stats.userApplications.submit, partner: stats.partnerApplications.submit, manager: stats.managerApplications.submit },
    { name: 'Rejected', user: stats.userApplications.rejected, partner: stats.partnerApplications.rejected, manager: stats.managerApplications.rejected },
    { name: 'Completed', user: stats.userApplications.completed, partner: stats.partnerApplications.completed, manager: stats.managerApplications.completed },
    { name: 'Paid', user: stats.userApplications.paid, partner: stats.partnerApplications.paid, manager: stats.managerApplications.paid }
  ];

  const pieData = [
    { name: 'User Applications', value: Object.values(stats.userApplications).reduce((a, b) => a + b, 0), color: '#3b82f6' },
    { name: 'Partner Applications', value: Object.values(stats.partnerApplications).reduce((a, b) => a + b, 0), color: '#10b981' },
    { name: 'Manager Applications', value: Object.values(stats.managerApplications).reduce((a, b) => a + b, 0), color: '#f59e0b' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Statistics</h1>
          <p className="text-muted-foreground">Comprehensive analytics and key performance indicators</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Self-registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
              <Building2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPartners}</div>
              <p className="text-xs text-muted-foreground">Approved partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
              <UserCog className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalManagers}</div>
              <p className="text-xs text-muted-foreground">Internal managers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">All application types</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Application Breakdown</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Application Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Distribution by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Application Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.monthlyApplications}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            {/* Application Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status by Creator Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="user" stackId="a" fill="#3b82f6" name="User Applications" />
                    <Bar dataKey="partner" stackId="a" fill="#10b981" name="Partner Applications" />
                    <Bar dataKey="manager" stackId="a" fill="#f59e0b" name="Manager Applications" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Status Tables */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    User Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(stats.userApplications).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <Badge variant="outline" className="capitalize">{status.replace('_', ' ')}</Badge>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-green-600" />
                    Partner Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(stats.partnerApplications).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <Badge variant="outline" className="capitalize">{status.replace('_', ' ')}</Badge>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-orange-600" />
                    Manager Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(stats.managerApplications).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <Badge variant="outline" className="capitalize">{status.replace('_', ' ')}</Badge>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Submission Trends</CardTitle>
                <p className="text-sm text-muted-foreground">Track application volume over the last 6 months</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats.monthlyApplications}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminStatistics;