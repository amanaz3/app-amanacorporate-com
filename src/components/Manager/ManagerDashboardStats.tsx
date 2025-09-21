import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  XCircle,
  DollarSign
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, description, onClick }) => (
  <Card 
    className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

interface ManagerDashboardStatsProps {
  stats: {
    assignedPartnerApplications: {
      draft: number;
      need_more_info: number;
      return: number;
      submit: number;
      completed: number;
      rejected: number;
      paid: number;
    };
    myReferralApplications: {
      draft: number;
      need_more_info: number;
      return: number;
      submit: number;
      completed: number;
      rejected: number;
      paid: number;
    };
    totalApplications: number;
    pendingReview: number;
  };
  onCardClick?: (section: string, status: string) => void;
}

export const ManagerDashboardStats: React.FC<ManagerDashboardStatsProps> = ({ 
  stats, 
  onCardClick 
}) => {
  const assignedCards = [
    {
      title: 'Draft',
      value: stats.assignedPartnerApplications.draft,
      icon: FileText,
      description: 'Partner applications in draft',
      status: 'draft'
    },
    {
      title: 'Need More Info',
      value: stats.assignedPartnerApplications.need_more_info,
      icon: AlertCircle,
      description: 'Require additional information',
      status: 'need_more_info'
    },
    {
      title: 'Return',
      value: stats.assignedPartnerApplications.return,
      icon: Clock,
      description: 'Returned for revision',
      status: 'return'
    },
    {
      title: 'Ready to Submit',
      value: stats.assignedPartnerApplications.submit,
      icon: TrendingUp,
      description: 'Ready for submission',
      status: 'submit'
    },
    {
      title: 'Completed',
      value: stats.assignedPartnerApplications.completed,
      icon: CheckCircle2,
      description: 'Successfully completed',
      status: 'completed'
    },
    {
      title: 'Rejected',
      value: stats.assignedPartnerApplications.rejected,
      icon: XCircle,
      description: 'Applications rejected',
      status: 'rejected'
    },
    {
      title: 'Paid',
      value: stats.assignedPartnerApplications.paid,
      icon: DollarSign,
      description: 'Applications paid',
      status: 'paid'
    }
  ];

  const referralCards = [
    {
      title: 'Draft',
      value: stats.myReferralApplications.draft,
      icon: FileText,
      description: 'My referrals in draft',
      status: 'draft'
    },
    {
      title: 'Need More Info',
      value: stats.myReferralApplications.need_more_info,
      icon: AlertCircle,
      description: 'Require additional information',
      status: 'need_more_info'
    },
    {
      title: 'Return',
      value: stats.myReferralApplications.return,
      icon: Clock,
      description: 'Returned for revision',
      status: 'return'
    },
    {
      title: 'Submitted',
      value: stats.myReferralApplications.submit,
      icon: TrendingUp,
      description: 'Submitted for review',
      status: 'submit'
    },
    {
      title: 'Completed',
      value: stats.myReferralApplications.completed,
      icon: CheckCircle2,
      description: 'Successfully completed',
      status: 'completed'
    },
    {
      title: 'Rejected',
      value: stats.myReferralApplications.rejected,
      icon: XCircle,
      description: 'Applications rejected',
      status: 'rejected'
    },
    {
      title: 'Paid',
      value: stats.myReferralApplications.paid,
      icon: DollarSign,
      description: 'Applications paid',
      status: 'paid'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">All applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReview}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for submission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Partners</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(stats.assignedPartnerApplications).reduce((a, b) => a + b, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Partner applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Referrals</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(stats.myReferralApplications).reduce((a, b) => a + b, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Referral applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Partner Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Assigned Partner Applications</h2>
          <Badge variant="outline">
            {Object.values(stats.assignedPartnerApplications).reduce((a, b) => a + b, 0)} total
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {assignedCards.map((card) => (
            <StatsCard
              key={card.status}
              title={card.title}
              value={card.value}
              icon={card.icon}
              description={card.description}
              onClick={onCardClick ? () => onCardClick('assigned', card.status) : undefined}
            />
          ))}
        </div>
      </div>

      {/* My Referral Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Referral Applications</h2>
          <Badge variant="outline">
            {Object.values(stats.myReferralApplications).reduce((a, b) => a + b, 0)} total
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {referralCards.map((card) => (
            <StatsCard
              key={card.status}
              title={card.title}
              value={card.value}
              icon={card.icon}
              description={card.description}
              onClick={onCardClick ? () => onCardClick('referral', card.status) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};