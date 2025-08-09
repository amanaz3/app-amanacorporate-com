import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XCircle, Clock, User } from 'lucide-react';
import PartnerSubHeader from '@/components/partners/PartnerSubHeader';

const PartnerRejected = () => {
  const applications = [
    {
      id: 'P010',
      partnerName: 'Failed Venture',
      company: 'Rejected Corp',
      status: 'Rejected',
      rejectionDate: '2024-01-13',
      reason: 'Insufficient documentation and failed verification',
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PartnerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partners - Rejected Applications</h1>
          <p className="text-muted-foreground">Applications that have been rejected</p>
        </div>

        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="border-l-4 border-l-red-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Application {app.id}
                  </CardTitle>
                  <Badge variant="destructive">Rejected</Badge>
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
                      <p className="text-sm">Rejected On</p>
                      <p className="text-sm text-muted-foreground">{app.rejectionDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rejection Reason:</p>
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

export default PartnerRejected;