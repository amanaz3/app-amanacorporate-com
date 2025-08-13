import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, Edit, FileText, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Application {
  id: string;
  applicant_name: string;
  email: string;
  company: string;
  status: string;
  amount: number;
  created_at: string;
  created_by_role: string;
}

const UserApplications = () => {
  const navigate = useNavigate();
  const { status } = useParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const statusList = ['draft', 'need-more-info', 'return', 'submit', 'rejected', 'completed', 'paid'];

  useEffect(() => {
    fetchApplications();
  }, [status]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, status]);

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from('applications')
        .select('*')
        .eq('created_by_role', 'user');

      if (status && status !== 'all') {
        const dbStatus = status === 'need-more-info' ? 'need_more_info' : status;
        query = query.eq('status', dbStatus as any);
      }

      const { data } = await query.order('created_at', { ascending: false });
      
      if (data) {
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      draft: 'outline',
      need_more_info: 'secondary',
      return: 'outline',
      submit: 'default',
      rejected: 'destructive',
      completed: 'default',
      paid: 'secondary'
    };
    return <Badge variant={variants[status] || 'outline'}>{status.replace('_', ' ')}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
          <div className="flex items-center gap-2 mb-2">
            <User className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">User Applications</h1>
          </div>
          <p className="text-muted-foreground">
            Manage applications created by users - {status ? `${status.replace('-', ' ')} status` : 'all statuses'}
          </p>
        </div>

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
        </div>

        <Tabs value={status || 'all'} onValueChange={(value) => navigate(`/admin/users/applications/${value}`)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            {statusList.map((s) => (
              <TabsTrigger key={s} value={s}>
                {s.replace('-', ' ').replace('_', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={status || 'all'}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Applications ({filteredApplications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.applicant_name}</TableCell>
                        <TableCell>{application.email}</TableCell>
                        <TableCell>{application.company}</TableCell>
                        <TableCell>{formatCurrency(application.amount)}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredApplications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No applications found for the selected criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserApplications;