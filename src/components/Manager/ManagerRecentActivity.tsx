import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  XCircle,
  DollarSign,
  Building2,
  User
} from 'lucide-react';

interface ManagerApplication {
  id: string;
  applicant_name: string;
  company: string;
  status: string;
  created_by_role: 'partner' | 'manager';
  created_at: string;
  customer_id?: string;
  application_type?: string;
}

interface ManagerRecentActivityProps {
  applications: ManagerApplication[];
  onApplicationClick?: (application: ManagerApplication) => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    draft: { variant: 'outline' as const, icon: FileText, label: 'Draft' },
    need_more_info: { variant: 'destructive' as const, icon: AlertCircle, label: 'Need More Info' },
    return: { variant: 'secondary' as const, icon: Clock, label: 'Return' },
    submit: { variant: 'default' as const, icon: TrendingUp, label: 'Submit' },
    completed: { variant: 'default' as const, icon: CheckCircle2, label: 'Completed' },
    rejected: { variant: 'destructive' as const, icon: XCircle, label: 'Rejected' },
    paid: { variant: 'default' as const, icon: DollarSign, label: 'Paid' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      <config.icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const getTypeBadge = (type: 'partner' | 'manager') => {
  if (type === 'partner') {
    return (
      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
        <Building2 className="h-3 w-3" />
        Partner
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="flex items-center gap-1 w-fit">
      <User className="h-3 w-3" />
      Referral
    </Badge>
  );
};

export const ManagerRecentActivity: React.FC<ManagerRecentActivityProps> = ({
  applications,
  onApplicationClick
}) => {
  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground">
              Start by creating a new referral application or wait for partner assignments.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow 
                  key={application.id}
                  className={onApplicationClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={onApplicationClick ? () => onApplicationClick(application) : undefined}
                >
                  <TableCell className="font-medium">
                    {application.applicant_name}
                  </TableCell>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>
                    {getTypeBadge(application.created_by_role)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(application.status)}
                  </TableCell>
                  <TableCell>
                    {new Date(application.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};