import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Search, Users, UserCog, Building2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Application {
  id: string;
  applicant_name: string;
  email: string;
  company: string;
  status: string;
  amount: number;
  created_at: string;
  created_by_role: 'user' | 'manager' | 'partner';
}

const AllApplicationsOverview = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate loading applications
    const timer = setTimeout(() => {
      const mockApplications: Application[] = [
        {
          id: '1',
          applicant_name: 'John Doe',
          email: 'john@example.com',
          company: 'Tech Corp',
          status: 'draft',
          amount: 50000,
          created_at: '2024-01-15T10:30:00Z',
          created_by_role: 'user'
        },
        {
          id: '2',
          applicant_name: 'Alice Johnson',
          email: 'alice@company.com',
          company: 'Sales Dept',
          status: 'submit',
          amount: 80000,
          created_at: '2024-01-16T14:20:00Z',
          created_by_role: 'manager'
        },
        {
          id: '3',
          applicant_name: 'Partner Corp',
          email: 'contact@partnercorp.com',
          company: 'Partner Corp',
          status: 'completed',
          amount: 150000,
          created_at: '2024-01-17T09:15:00Z',
          created_by_role: 'partner'
        }
      ];
      setApplications(mockApplications);
      setFilteredApplications(mockApplications);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = applications;

    // Filter by role
    if (activeTab !== 'all') {
      filtered = filtered.filter(app => app.created_by_role === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, activeTab, searchTerm]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      "need-more-info": "secondary",
      return: "secondary",
      submit: "default",
      rejected: "destructive",
      completed: "default",
      paid: "default"
    };
    return <Badge variant={variants[status] || "outline"}>{status.replace('-', ' ')}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const config = {
      user: { icon: Users, variant: "outline" as const },
      manager: { icon: UserCog, variant: "secondary" as const },
      partner: { icon: Building2, variant: "default" as const }
    };
    
    const { icon: Icon, variant } = config[role as keyof typeof config] || config.user;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {role}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getApplicationCounts = () => {
    const counts = {
      all: applications.length,
      user: applications.filter(app => app.created_by_role === 'user').length,
      manager: applications.filter(app => app.created_by_role === 'manager').length,
      partner: applications.filter(app => app.created_by_role === 'partner').length
    };
    return counts;
  };

  const counts = getApplicationCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Applications</h1>
        <p className="text-muted-foreground">
          Centralized view of all applications across users, managers, and partners
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/users/applications">User Apps</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/managers/applications">Manager Apps</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/partners/applications">Partner Apps</Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="user">Users ({counts.user})</TabsTrigger>
          <TabsTrigger value="manager">Managers ({counts.manager})</TabsTrigger>
          <TabsTrigger value="partner">Partners ({counts.partner})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Applications Overview</CardTitle>
              <CardDescription>
                {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No applications found matching your criteria.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.applicant_name}
                        </TableCell>
                        <TableCell>{application.email}</TableCell>
                        <TableCell>{application.company}</TableCell>
                        <TableCell>{getRoleBadge(application.created_by_role)}</TableCell>
                        <TableCell>{formatCurrency(application.amount)}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>{formatDate(application.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllApplicationsOverview;