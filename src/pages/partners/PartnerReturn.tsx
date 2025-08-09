import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User } from 'lucide-react';
import ManagerSubHeader from '@/components/managers/ManagerSubHeader';

const PartnerReturn = () => {
  const applications = [
    {
      id: 'P003',
      partnerName: 'Global Solutions',
      company: 'Finance Corp',
      status: 'Return',
      lastUpdate: '2024-01-13',
      reason: 'Incorrect bank account details provided',
      priority: 'high'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ManagerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partners - Returned Applications</h1>
          <p className="text-muted-foreground">Applications returned for corrections</p>
        </div>

        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ArrowLeft className="h-5 w-5 text-orange-500" />
                    Application {app.id}
                  </CardTitle>
                  <Badge variant="secondary">Returned</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <p className="text-sm">Returned On</p>
                      <p className="text-sm text-muted-foreground">{app.lastUpdate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Return Reason:</p>
                    <p className="text-sm text-muted-foreground">{app.reason}</p>
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

export default PartnerReturn;