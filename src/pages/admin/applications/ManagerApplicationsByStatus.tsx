import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Eye, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Application {
  id: string;
  applicant_name: string;
  email: string;
  department: string;
  status: string;
  amount: number;
  created_at: string;
}

const ManagerApplicationsByStatus = () => {
  const { status } = useParams<{ status: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading applications
    const timer = setTimeout(() => {
      setApplications([
        {
          id: '1',
          applicant_name: 'Alice Johnson',
          email: 'alice@company.com',
          department: 'Sales',
          status: status || 'draft',
          amount: 80000,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          applicant_name: 'Bob Wilson',
          email: 'bob@company.com',
          department: 'Marketing',
          status: status || 'draft',
          amount: 95000,
          created_at: '2024-01-16T14:20:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status]);

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

  const statusTitle = status?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Applications';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/managers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Manager Applications - {statusTitle}</h1>
          <p className="text-muted-foreground">
            Manage manager applications with {status} status
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{statusTitle} Applications</CardTitle>
          <CardDescription>
            {applications.length} application{applications.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No applications found with {status} status.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.applicant_name}
                    </TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.department}</TableCell>
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
    </div>
  );
};

export default ManagerApplicationsByStatus;