import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SecureAuthContext';
import ManagerSubHeader from '@/components/managers/ManagerSubHeader';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertCircle, 
  ArrowLeft, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  BarChart3,
  TrendingUp,
  Building2,
  Plus,
  Bell,
  Clock
} from 'lucide-react';

interface ManagerDashboardStats {
  assignedPartnerApplications: {
    draft: number;
    needMoreInfo: number;
    return: number;
    submit: number;
    rejected: number;
    completed: number;
    paid: number;
  };
  myReferralApplications: {
    draft: number;
    needMoreInfo: number;
    return: number;
    submit: number;
    rejected: number;
    completed: number;
    paid: number;
  };
}

const ManagerDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ManagerDashboardStats>({
    assignedPartnerApplications: { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 },
    myReferralApplications: { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchManagerStats();
    }
  }, [user?.id]);

  const fetchManagerStats = async () => {
    try {
      // Fetch manager info
      const { data: manager } = await supabase
        .from('managers')
        .select('id, assigned_partners')
        .eq('user_id', user?.id)
        .single();

      if (!manager) {
        setLoading(false);
        return;
      }

      // Fetch applications using account_applications
      const { data: partnerApps } = await supabase
        .from('account_applications')
        .select('status');

      // Fetch applications for referrals
      const { data: referralApps } = await supabase
        .from('account_applications')
        .select('status');

      const processApplications = (apps: any[]) => {
        return apps?.reduce((acc, app) => {
          const statusKey = app.status === 'need_more_info' ? 'needMoreInfo' : app.status;
          if (acc.hasOwnProperty(statusKey)) {
            acc[statusKey as keyof typeof acc]++;
          }
          return acc;
        }, { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 }) || 
        { draft: 0, needMoreInfo: 0, return: 0, submit: 0, rejected: 0, completed: 0, paid: 0 };
      };

      setStats({
        assignedPartnerApplications: processApplications(partnerApps),
        myReferralApplications: processApplications(referralApps)
      });
    } catch (error) {
      console.error('Error fetching manager stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCards = (applications: any, title: string) => [
    { title: 'Draft', value: applications.draft, icon: FileText, color: 'text-muted-foreground' },
    { title: 'Need More Info', value: applications.needMoreInfo, icon: AlertCircle, color: 'text-orange-500' },
    { title: 'Return', value: applications.return, icon: ArrowLeft, color: 'text-yellow-500' },
    { title: 'Submit', value: applications.submit, icon: TrendingUp, color: 'text-blue-500' }
  ];

  // Check if user has manager access by trying to fetch manager data
  const [hasManagerAccess, setHasManagerAccess] = useState(false);
  
  useEffect(() => {
    const checkManagerAccess = async () => {
      if (!user?.id) return;
      
      const { data: manager } = await supabase
        .from('managers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      setHasManagerAccess(!!manager || isAdmin);
    };
    
    checkManagerAccess();
  }, [user?.id, isAdmin]);
  
  if (!hasManagerAccess && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-sm text-muted-foreground text-center">
              Manager dashboard access required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ManagerSubHeader />
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
      <ManagerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground">Overview of assigned partner applications and referral activities</p>
        </div>

        {/* My Assigned Partner Applications */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">My Assigned Partner Applications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getStatusCards(stats.assignedPartnerApplications, 'Partner').map((card, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <CardTitle className="text-sm">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Partner Applications Note */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">
                  Applications from partners assigned to you. Review and submit to Admin when ready.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Created Referral Applications */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">My Created Referral Applications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getStatusCards(stats.myReferralApplications, 'Referral').map((card, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <CardTitle className="text-sm">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Referral Applications Note */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">
                  Applications you've created as referrals. Track their progress through the system.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/managers/create-referral')} 
              className="h-auto py-6 flex flex-col items-center gap-2"
            >
              <Plus className="h-6 w-6" />
              <span>Create New Referral Application</span>
            </Button>
            <Button 
              onClick={() => navigate('/managers/partner-requests')} 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center gap-2"
            >
              <FileText className="h-6 w-6" />
              <span>Request Additional Documents</span>
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
                  New Assigned Partner Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Drafts</span>
                    <Badge>{stats.assignedPartnerApplications.draft}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ready to Submit</span>
                    <Badge variant="outline">{stats.assignedPartnerApplications.submit}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Application Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Returned for Review</span>
                    <Badge variant="secondary">
                      {stats.assignedPartnerApplications.return + stats.myReferralApplications.return}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Need More Info</span>
                    <Badge variant="destructive">
                      {stats.assignedPartnerApplications.needMoreInfo + stats.myReferralApplications.needMoreInfo}
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

export default ManagerDashboard;