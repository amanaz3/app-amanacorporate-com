import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Building2,
  TrendingUp,
  FileText,
  Users,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ManagerQuickActionsProps {
  stats: {
    pendingReview: number;
    totalApplications: number;
  };
}

export const ManagerQuickActions: React.FC<ManagerQuickActionsProps> = ({ stats }) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Create New Referral',
      description: 'Start a new referral application',
      icon: Plus,
      variant: 'default' as const,
      onClick: () => navigate('/applications/create'),
      highlight: true
    },
    {
      title: 'Review Partner Applications',
      description: `${stats.totalApplications} applications to review`,
      icon: Building2,
      variant: 'outline' as const,
      onClick: () => navigate('/managers'),
      badge: stats.totalApplications > 0 ? stats.totalApplications : undefined
    },
    {
      title: 'Submit to Admin',
      description: `${stats.pendingReview} ready for submission`,
      icon: TrendingUp,
      variant: 'outline' as const,
      onClick: () => navigate('/managers/submit'),
      badge: stats.pendingReview > 0 ? stats.pendingReview : undefined,
      highlight: stats.pendingReview > 0
    },
    {
      title: 'View All Applications',
      description: 'Browse all applications',
      icon: FileText,
      variant: 'outline' as const,
      onClick: () => navigate('/applications')
    },
    {
      title: 'Manage Partners',
      description: 'View assigned partners',
      icon: Users,
      variant: 'outline' as const,
      onClick: () => navigate('/partners')
    },
    {
      title: 'View Reports',
      description: 'Application analytics',
      icon: BarChart3,
      variant: 'outline' as const,
      onClick: () => navigate('/reports')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className={`h-auto py-4 flex flex-col items-center relative ${
                action.highlight ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
              onClick={action.onClick}
            >
              {action.badge && (
                <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {action.badge > 99 ? '99+' : action.badge}
                </div>
              )}
              <action.icon className="h-6 w-6 mb-2" />
              <div className="text-center">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};