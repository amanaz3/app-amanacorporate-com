import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, User } from 'lucide-react';
import ManagerSubHeader from '@/components/managers/ManagerSubHeader';

const PartnerCompleted = () => {
  const applications = [
    {
      id: 'P009',
      partnerName: 'Success Partners',
      company: 'Enterprise Solutions',
      status: 'Completed',
      completionDate: '2024-01-14',
      bankAccount: 'Business Account - FAB',
      totalAmount: 7500,
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ManagerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partners - Completed Applications</h1>
          <p className="text-muted-foreground">Successfully processed partner applications</p>
        </div>

        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="border-l-4 border-l-green-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Application {app.id}
                  </CardTitle>
                  <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{app.partnerName}</p>
                      <p className="text-sm text-muted-foreground">{app.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">Completed On</p>
                      <p className="text-sm text-muted-foreground">{app.completionDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Amount:</p>
                    <p className="text-sm text-muted-foreground">${app.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bank Account:</p>
                    <p className="text-sm text-muted-foreground">{app.bankAccount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerCompleted;