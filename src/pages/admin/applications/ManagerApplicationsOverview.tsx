import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, DollarSign, AlertCircle, RotateCcw } from 'lucide-react';

const ManagerApplicationsOverview = () => {
  const statusConfig = [
    { 
      status: 'draft', 
      label: 'Draft', 
      count: 8, 
      icon: FileText, 
      variant: 'outline' as const,
      description: 'Manager applications in draft state'
    },
    { 
      status: 'need-more-info', 
      label: 'Need More Info', 
      count: 4, 
      icon: AlertCircle, 
      variant: 'secondary' as const,
      description: 'Applications requiring additional information'
    },
    { 
      status: 'return', 
      label: 'Return', 
      count: 2, 
      icon: RotateCcw, 
      variant: 'secondary' as const,
      description: 'Applications returned for revision'
    },
    { 
      status: 'submit', 
      label: 'Submit', 
      count: 11, 
      icon: Clock, 
      variant: 'default' as const,
      description: 'Applications under review'
    },
    { 
      status: 'rejected', 
      label: 'Rejected', 
      count: 1, 
      icon: XCircle, 
      variant: 'destructive' as const,
      description: 'Applications that have been rejected'
    },
    { 
      status: 'completed', 
      label: 'Completed', 
      count: 16, 
      icon: CheckCircle, 
      variant: 'default' as const,
      description: 'Applications that have been completed'
    },
    { 
      status: 'paid', 
      label: 'Paid', 
      count: 12, 
      icon: DollarSign, 
      variant: 'default' as const,
      description: 'Applications that have been paid'
    }
  ];

  const totalApplications = statusConfig.reduce((sum, status) => sum + status.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/applications">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Manager Applications</h1>
          <p className="text-muted-foreground">
            Overview of all manager applications by status - {totalApplications} total applications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statusConfig.map((config) => {
          const Icon = config.icon;
          return (
            <Card key={config.status} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {config.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{config.count}</div>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {config.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  asChild
                >
                  <Link to={`/admin/managers/applications/${config.status}`}>
                    View {config.label}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Manager application statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Applications</span>
              <span className="font-medium">{totalApplications}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pending Review</span>
              <span className="font-medium">{statusConfig.find(s => s.status === 'submit')?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="font-medium">{statusConfig.find(s => s.status === 'completed')?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-medium">
                {Math.round(((statusConfig.find(s => s.status === 'completed')?.count || 0) / totalApplications) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest manager application updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Alice Johnson's application was completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">New application submitted by Bob Wilson</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Department transfer application pending</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerApplicationsOverview;