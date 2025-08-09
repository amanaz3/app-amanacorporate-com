import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useCustomer } from '@/contexts/CustomerContext';
import { 
  AlertCircle, 
  ArrowLeft, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  BarChart3,
  TrendingUp
} from 'lucide-react';

const ManagerDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { customers } = useCustomer();

  // Calculate stats by status
  const getStatusStats = () => {
    const stats = {
      'Need More Info': { count: 0, icon: AlertCircle, color: 'bg-orange-500', urgency: 'High' },
      'Return': { count: 0, icon: ArrowLeft, color: 'bg-red-500', urgency: 'High' },
      'Submit': { count: 0, icon: FileText, color: 'bg-blue-500', urgency: 'Medium' },
      'Draft': { count: 0, icon: FileText, color: 'bg-gray-500', urgency: 'Medium' },
      'Paid': { count: 0, icon: DollarSign, color: 'bg-green-500', urgency: 'Low' },
      'Completed': { count: 0, icon: CheckCircle, color: 'bg-emerald-500', urgency: 'Low' },
      'Rejected': { count: 0, icon: XCircle, color: 'bg-red-600', urgency: 'Low' }
    };

    customers.forEach(customer => {
      if (stats[customer.status as keyof typeof stats]) {
        stats[customer.status as keyof typeof stats].count++;
      }
    });

    return stats;
  };

  const statusStats = getStatusStats();
  const totalApplications = customers.length;

  if (!isAdmin && user?.profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-sm text-muted-foreground text-center">
              Manager dashboard access required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of application statuses and priorities
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statusStats['Need More Info'].count + statusStats['Return'].count}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statusStats['Submit'].count}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusStats['Completed'].count}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(statusStats).map(([status, data]) => {
              const IconComponent = data.icon;
              return (
                <div key={status} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${data.color} text-white`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{status}</p>
                      <Badge className={getUrgencyColor(data.urgency)} variant="secondary">
                        {data.urgency} Priority
                      </Badge>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{data.count}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;