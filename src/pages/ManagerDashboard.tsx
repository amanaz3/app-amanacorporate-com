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
  Building2, 
  Plus,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SecureAuthContext';

interface Application {
  id: string;
  applicant_name: string;
  company: string;
  status: string;
  created_by_role: string;
  created_at: string;
  assigned_manager?: string;
}

interface ManagerStats {
  assignedPartnerApplications: {
    draft: number;
    need_more_info: number;
    return: number;
    submit: number;
  };
  myReferralApplications: {
    draft: number;
    need_more_info: number;
    return: number;
    submit: number;
  };
}

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<ManagerStats>({
    assignedPartnerApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0 },
    myReferralApplications: { draft: 0, need_more_info: 0, return: 0, submit: 0 }
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchManagerData();
    }
  }, [user]);

  const fetchManagerData = async () => {
    try {
      if (!user) return;

      // Get manager record
      const { data: managerData } = await supabase
        .from('managers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!managerData) return;

      // Fetch assigned partner applications
      const { data: assignedApps } = await supabase
        .from('applications')
        .select('*')
        .eq('assigned_manager', managerData.id)
        .eq('created_by_role', 'partner')
        .order('created_at', { ascending: false });

      // Fetch my referral applications (created by this manager)
      const { data: myApps } = await supabase
        .from('applications')
        .select('*')
        .eq('created_by', user.id)
        .eq('created_by_role', 'manager')
        .order('created_at', { ascending: false });

      // Calculate stats for assigned partner applications
      const assignedStats = assignedApps?.reduce((acc, app) => {
        if (['draft', 'need_more_info', 'return', 'submit'].includes(app.status)) {
          acc[app.status as keyof typeof acc]++;
        }
        return acc;
      }, { draft: 0, need_more_info: 0, return: 0, submit: 0 }) || { draft: 0, need_more_info: 0, return: 0, submit: 0 };

      // Calculate stats for my referral applications
      const myStats = myApps?.reduce((acc, app) => {
        if (['draft', 'need_more_info', 'return', 'submit'].includes(app.status)) {
          acc[app.status as keyof typeof acc]++;
        }
        return acc;
      }, { draft: 0, need_more_info: 0, return: 0, submit: 0 }) || { draft: 0, need_more_info: 0, return: 0, submit: 0 };

      setStats({
        assignedPartnerApplications: assignedStats,
        myReferralApplications: myStats
      });

      // Set recent applications (combined, limited to 10)
      const allApps = [...(assignedApps || []), ...(myApps || [])];
      setRecentApplications(allApps.slice(0, 10));

    } catch (error) {
      console.error('Error fetching manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, icon: FileText, label: 'Draft' },
      need_more_info: { variant: 'destructive' as const, icon: AlertCircle, label: 'Need More Info' },
      return: { variant: 'outline' as const, icon: Clock, label: 'Return' },
      submit: { variant: 'default' as const, icon: TrendingUp, label: 'Submit' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const assignedCards = [
    {
      title: 'Draft',
      value: stats.assignedPartnerApplications.draft,
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Need More Info',
      value: stats.assignedPartnerApplications.need_more_info,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Return',
      value: stats.assignedPartnerApplications.return,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Ready to Submit',
      value: stats.assignedPartnerApplications.submit,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const referralCards = [
    {
      title: 'Draft',
      value: stats.myReferralApplications.draft,
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Need More Info',
      value: stats.myReferralApplications.need_more_info,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Return',
      value: stats.myReferralApplications.return,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Submitted',
      value: stats.myReferralApplications.submit,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Manager Dashboard</h1>
          <p className="text-muted-foreground">Manage assigned partner applications and create referral applications</p>
        </div>

        {/* Assigned Partner Applications */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Assigned Partner Applications</h2>
            <Button onClick={() => navigate('/managers')}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assignedCards.map((card, index) => (
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
                    Partner applications
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Referral Applications */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Created Referral Applications</h2>
            <Button onClick={() => navigate('/managers/draft')}>
              Create New Referral
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {referralCards.map((card, index) => (
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
                    My referral applications
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
            <Button onClick={() => navigate('/managers/draft')} className="h-auto py-4 flex flex-col items-center">
              <Plus className="h-6 w-6 mb-2" />
              Create New Referral Application
            </Button>
            <Button onClick={() => navigate('/managers')} variant="outline" className="h-auto py-4 flex flex-col items-center">
              <Building2 className="h-6 w-6 mb-2" />
              Review Partner Applications
            </Button>
            <Button onClick={() => navigate('/managers/submit')} variant="outline" className="h-auto py-4 flex flex-col items-center">
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
                    <TableHead>Applicant</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.applicant_name}</TableCell>
                      <TableCell>{application.company}</TableCell>
                      <TableCell>
                        <Badge variant={application.created_by_role === 'partner' ? 'secondary' : 'outline'}>
                          {application.created_by_role === 'partner' ? 'Partner' : 'Referral'}
                        </Badge>
                      </TableCell>
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
                <p className="text-muted-foreground">Start by creating a new referral application or wait for partner assignments.</p>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;