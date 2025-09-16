import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Plus,
  Bell,
  Save,
  DollarSign,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Settings,
  User,
  Shield,
  BarChart3,
  Download,
  Edit,
  Eye,
  Calendar
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
  completed: number;
  paid: number;
  rejected: number;
  totalApplications: number;
  pendingActions: number;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    draft: 0,
    need_more_info: 0,
    return: 0,
    submit: 0,
    completed: 0,
    paid: 0,
    rejected: 0,
    totalApplications: 0,
    pendingActions: 0
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      if (!user) return;

      // Fetch user applications - using account_applications
      const { data: applications } = await supabase
        .from('account_applications')
        .select('*')
        .order('created_at', { ascending: false });

      // Calculate comprehensive stats
      const applicationStats = applications?.reduce((acc, app) => {
        const status = app.status.toLowerCase();
        if (status === 'draft') acc.draft++;
        else if (status === 'need_more_info') acc.need_more_info++;
        else if (status === 'return') acc.return++;
        else if (status === 'submit') acc.submit++;
        else if (status === 'completed') acc.completed++;
        else if (status === 'paid') acc.paid++;
        else if (status === 'rejected') acc.rejected++;
        
        return acc;
      }, { 
        draft: 0, 
        need_more_info: 0, 
        return: 0, 
        submit: 0, 
        completed: 0, 
        paid: 0, 
        rejected: 0, 
        totalApplications: 0, 
        pendingActions: 0 
      }) || { 
        draft: 0, 
        need_more_info: 0, 
        return: 0, 
        submit: 0, 
        completed: 0, 
        paid: 0, 
        rejected: 0, 
        totalApplications: 0, 
        pendingActions: 0 
      };

      applicationStats.totalApplications = applications?.length || 0;
      applicationStats.pendingActions = applicationStats.need_more_info + applicationStats.return;

      setStats(applicationStats);
      setAllApplications(applications || []);
      setRecentApplications(applications?.slice(0, 10) || []);
      setFilteredApplications(applications || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    const statusConfig = {
      draft: { variant: 'outline' as const, icon: FileText, label: 'Draft', color: 'text-muted-foreground' },
      need_more_info: { variant: 'destructive' as const, icon: AlertCircle, label: 'Need More Info', color: 'text-destructive' },
      return: { variant: 'secondary' as const, icon: Clock, label: 'Return', color: 'text-secondary-foreground' },
      submit: { variant: 'default' as const, icon: TrendingUp, label: 'Submitted', color: 'text-primary' },
      completed: { variant: 'default' as const, icon: CheckCircle, label: 'Completed', color: 'text-green-600' },
      paid: { variant: 'default' as const, icon: DollarSign, label: 'Paid', color: 'text-green-700' },
      rejected: { variant: 'destructive' as const, icon: XCircle, label: 'Rejected', color: 'text-destructive' }
    };

    const config = statusConfig[normalizedStatus as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filterApplications = (filter: string, search: string) => {
    let filtered = allApplications;
    
    if (filter !== 'all') {
      filtered = filtered.filter(app => app.status.toLowerCase() === filter);
    }
    
    if (search) {
      filtered = filtered.filter(app => 
        app.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
        app.company.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredApplications(filtered);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    filterApplications(filter, searchTerm);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    filterApplications(selectedFilter, search);
  };

  const overviewCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'All your applications'
    },
    {
      title: 'Pending Actions',
      value: stats.pendingActions,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      description: 'Need attention',
      urgent: stats.pendingActions > 0
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Successfully completed'
    },
    {
      title: 'Recently Paid',
      value: stats.paid,
      icon: DollarSign,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Payment received'
    }
  ];

  const statusFilterCards = [
    { key: 'all', label: 'All', count: stats.totalApplications, icon: BarChart3 },
    { key: 'draft', label: 'Draft', count: stats.draft, icon: FileText },
    { key: 'need_more_info', label: 'Need More Info', count: stats.need_more_info, icon: AlertCircle },
    { key: 'return', label: 'Return', count: stats.return, icon: Clock },
    { key: 'submit', label: 'Submit', count: stats.submit, icon: TrendingUp },
    { key: 'completed', label: 'Completed', count: stats.completed, icon: CheckCircle },
    { key: 'paid', label: 'Paid', count: stats.paid, icon: DollarSign },
    { key: 'rejected', label: 'Rejected', count: stats.rejected, icon: XCircle }
  ];

  const actionItems = allApplications.filter(app => 
    ['need_more_info', 'return'].includes(app.status.toLowerCase())
  );

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
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground">Manage your business license applications</p>
          </div>
          <Button onClick={() => navigate('/customers')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        </div>

        {/* Main Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card, index) => (
            <Card key={index} className={`hover:shadow-lg transition-all cursor-pointer ${card.urgent ? 'ring-2 ring-destructive/20' : ''}`}>
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
                {card.urgent && (
                  <Badge variant="destructive" className="mt-2 text-xs">
                    Requires Attention
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="actions">Action Items</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </CardContent>
            </Card>

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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.applicant_name}</TableCell>
                          <TableCell>{application.company}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                    <p className="text-muted-foreground">Start by creating your first business license application.</p>
                    <Button onClick={() => navigate('/customers')} className="mt-4">
                      Create Application
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Quick Notifications / Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.pendingActions > 0 ? (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">
                          {stats.pendingActions} application(s) require your attention
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No new notifications</div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    You'll receive notifications here when the admin updates your application status or requests additional information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filter Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                  {statusFilterCards.map((filter) => (
                    <Card 
                      key={filter.key} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedFilter === filter.key ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleFilterChange(filter.key)}
                    >
                      <CardContent className="p-3 text-center">
                        <filter.icon className="h-4 w-4 mx-auto mb-1" />
                        <div className="text-sm font-medium">{filter.label}</div>
                        <div className="text-xs text-muted-foreground">{filter.count}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by applicant name or company..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                {/* Applications Table */}
                {filteredApplications.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.applicant_name}</TableCell>
                          <TableCell>{application.company}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {selectedFilter === 'all' ? 'No applications found' : `No ${selectedFilter} applications`}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Try adjusting your search criteria.' : 'Start by creating your first application.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Items Tab */}
          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {actionItems.length > 0 ? (
                  <div className="space-y-4">
                    {actionItems.map((application) => (
                      <Card key={application.id} className="border-l-4 border-l-destructive">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{application.applicant_name}</h4>
                                {getStatusBadge(application.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{application.company}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Created: {new Date(application.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                Action
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">No urgent actions required at this time.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input defaultValue={user?.user_metadata?.name || user?.email || ''} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input defaultValue={user?.email || ''} disabled />
                    </div>
                    <Button>Update Profile</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Password & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full">
                      Enable 2FA
                    </Button>
                    <Separator />
                    <div className="text-sm text-muted-foreground">
                      <p>Last login: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email notifications</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status updates</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Marketing emails</span>
                      <input type="checkbox" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Account History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Account created: {new Date().toLocaleDateString()}</p>
                    <p>Total applications: {stats.totalApplications}</p>
                    <p>Completed applications: {stats.completed}</p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      View full history
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;