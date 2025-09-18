import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  TrendingUp,
  Users,
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Application {
  id: string;
  status: string;
  created_at: string;
  customer_id: string;
  application_data: any;
  customers?: {
    name: string;
    email: string;
    mobile: string;
    company: string;
    license_type: string;
    lead_source: string;
    amount: number;
  };
}

const ApplicationManagement = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, roleFilter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('account_applications')
        .select(`
          id,
          status,
          created_at,
          customer_id,
          application_data,
          customers(name, email, mobile, company, license_type, lead_source, amount)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.customers?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.customers?.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Role filter - simplified for now
    // if (roleFilter !== 'all') {
    //   filtered = filtered.filter(app => app.created_by_role === roleFilter);
    // }

    setFilteredApplications(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, icon: FileText, label: 'Draft' },
      need_more_info: { variant: 'destructive' as const, icon: AlertCircle, label: 'Need More Info' },
      return: { variant: 'outline' as const, icon: Clock, label: 'Return' },
      submit: { variant: 'default' as const, icon: TrendingUp, label: 'Submit' },
      rejected: { variant: 'destructive' as const, icon: XCircle, label: 'Rejected' },
      completed: { variant: 'default' as const, icon: CheckCircle, label: 'Completed' },
      paid: { variant: 'secondary' as const, icon: CheckCircle, label: 'Paid' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      user: { variant: 'outline' as const, icon: Users, label: 'User' },
      partner: { variant: 'secondary' as const, icon: Building2, label: 'Partner' },
      manager: { variant: 'default' as const, icon: Users, label: 'Manager' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: 'draft' | 'need_more_info' | 'return' | 'submit' | 'rejected' | 'completed' | 'paid') => {
    try {
      const { error } = await supabase
        .from('account_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  const statusCounts = {
    all: applications.length,
    draft: getApplicationsByStatus('draft').length,
    need_more_info: getApplicationsByStatus('need_more_info').length,
    return: getApplicationsByStatus('return').length,
    submit: getApplicationsByStatus('submit').length,
    rejected: getApplicationsByStatus('rejected').length,
    completed: getApplicationsByStatus('completed').length,
    paid: getApplicationsByStatus('paid').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Application Management</h1>
          <p className="text-muted-foreground">Manage all user and partner applications</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses ({statusCounts.all})</SelectItem>
              <SelectItem value="draft">Draft ({statusCounts.draft})</SelectItem>
              <SelectItem value="need_more_info">Need More Info ({statusCounts.need_more_info})</SelectItem>
              <SelectItem value="return">Return ({statusCounts.return})</SelectItem>
              <SelectItem value="submit">Submit ({statusCounts.submit})</SelectItem>
              <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
              <SelectItem value="completed">Completed ({statusCounts.completed})</SelectItem>
              <SelectItem value="paid">Paid ({statusCounts.paid})</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by creator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Creators</SelectItem>
              <SelectItem value="user">User Applications</SelectItem>
              <SelectItem value="partner">Partner Applications</SelectItem>
              <SelectItem value="manager">Manager Applications</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({statusCounts.draft})</TabsTrigger>
            <TabsTrigger value="need_more_info">Need Info ({statusCounts.need_more_info})</TabsTrigger>
            <TabsTrigger value="return">Return ({statusCounts.return})</TabsTrigger>
            <TabsTrigger value="submit">Submit ({statusCounts.submit})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({statusCounts.completed})</TabsTrigger>
            <TabsTrigger value="paid">Paid ({statusCounts.paid})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>License Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.customers?.name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{application.customers?.email || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{application.customers?.mobile || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{application.customers?.company || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{application.customers?.license_type || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>AED {application.customers?.amount?.toLocaleString() || 0}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell><Badge variant="outline">User</Badge></TableCell>
                    <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Select
                          value={application.status}
                          onValueChange={(value: 'draft' | 'need_more_info' | 'return' | 'submit' | 'rejected' | 'completed' | 'paid') => updateApplicationStatus(application.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="need_more_info">Need More Info</SelectItem>
                            <SelectItem value="return">Return</SelectItem>
                            <SelectItem value="submit">Submit</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredApplications.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No applications found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationManagement;