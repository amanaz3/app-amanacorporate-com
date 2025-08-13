import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCog, Building2, FileText, BarChart3, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPortal = () => {
  const navigate = useNavigate();

  const adminSections = [
    {
      title: 'Manage Users',
      description: 'Create, edit, delete users and approve self-registered accounts',
      icon: Users,
      path: '/admin/users',
      actions: ['Create/Edit/Delete Users', 'Approve/Reject Self-Registered Users', 'View User Applications']
    },
    {
      title: 'Manage Managers',
      description: 'Create and manage internal managers with permission controls',
      icon: UserCog,
      path: '/admin/managers',
      actions: ['Create/Edit/Delete Managers', 'Assign Permissions', 'Control Partner Applications']
    },
    {
      title: 'Manage Partners',
      description: 'Approve partner registrations and assign to managers',
      icon: Building2,
      path: '/admin/partners',
      actions: ['Approve/Reject Partner Registrations', 'Create/Edit/Delete Partners', 'Assign Partners to Managers']
    },
    {
      title: 'Manage Applications',
      description: 'Full access to all user, partner, and manager applications',
      icon: FileText,
      path: '/admin/applications',
      actions: ['User Applications (full access)', 'Partner Applications', 'Manager Applications']
    },
    {
      title: 'View Statistics',
      description: 'Comprehensive analytics and reporting dashboard',
      icon: BarChart3,
      path: '/admin/statistics',
      actions: ['User Application Statistics', 'Partner Application Statistics', 'Performance Metrics']
    },
    {
      title: 'Final Status Control',
      description: 'Set final application statuses and approvals',
      icon: CheckCircle,
      path: '/admin/final-status',
      actions: ['Set Rejected Status', 'Set Completed Status', 'Set Paid Status']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Full system access and management controls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <section.icon className="h-6 w-6 text-primary" />
                  {section.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {section.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {action}
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => navigate(section.path)}
                  className="w-full"
                >
                  Access {section.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Pending Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Active Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Active Managers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">No recent activity</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;