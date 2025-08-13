import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Plus,
  Bell,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SecureAuthContext';

interface Application {
  id: string;
  applicant_name: string;
  company: string;
  status: string;
  created_at: string;
}

interface UserStats {
  draft: number;
  need_more_info: number;
  return: number;
  submit: number;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    draft: 0,
    need_more_info: 0,
    return: 0,
    submit: 0
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      if (!user) return;

      // Fetch user applications
      const { data: applications } = await supabase
        .from('applications')
        .select('*')
        .eq('created_by', user.id)
        .eq('created_by_role', 'user')
        .order('created_at', { ascending: false });

      // Calculate stats
      const applicationStats = applications?.reduce((acc, app) => {
        if (['draft', 'need_more_info', 'return', 'submit'].includes(app.status)) {
          acc[app.status as keyof UserStats]++;
        }
        return acc;
      }, { draft: 0, need_more_info: 0, return: 0, submit: 0 }) || { draft: 0, need_more_info: 0, return: 0, submit: 0 };

      setStats(applicationStats);
      setRecentApplications(applications?.slice(0, 10) || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, icon: FileText, label: 'Draft' },
      need_more_info: { variant: 'destructive' as const, icon: AlertCircle, label: 'Need More Info' },
      return: { variant: 'outline' as const, icon: Clock, label: 'Return' },
      submit: { variant: 'default' as const, icon: TrendingUp, label: 'Submitted' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const statusCards = [
    {
      title: 'Draft Applications',
      value: stats.draft,
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      description: 'Applications in draft status'
    },
    {
      title: 'Need More Info',
      value: stats.need_more_info,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Requested by Admin'
    },
    {
      title: 'Return',
      value: stats.return,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Requested by Admin'
    },
    {
      title: 'Submitted',
      value: stats.submit,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Sent to Admin'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-foreground mb-2">User Dashboard</h1>
          <p className="text-muted-foreground">Manage your business license applications</p>
        </div>

        {/* Application Status Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Applications</h2>
            <Button onClick={() => navigate('/customers')}>
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

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/customers')} className="h-auto py-4 flex flex-col items-center">
              <Plus className="h-6 w-6 mb-2" />
              Create New Application
            </Button>
            <Button onClick={() => navigate('/customers')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <Save className="h-6 w-6 mb-2" />
              Save Draft
            </Button>
            <Button onClick={() => navigate('/customers')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <TrendingUp className="h-6 w-6 mb-2" />
              Submit to Admin
            </Button>
          </div>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.applicant_name}</TableCell>
                      <TableCell>{application.company}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                <p className="text-muted-foreground">Start by creating your first business license application.</p>
                <Button 
                  onClick={() => navigate('/customers')} 
                  className="mt-4"
                >
                  Create Application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">No new notifications</div>
              <p className="text-xs text-muted-foreground">
                You'll receive notifications here when the admin updates your application status or requests additional information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;