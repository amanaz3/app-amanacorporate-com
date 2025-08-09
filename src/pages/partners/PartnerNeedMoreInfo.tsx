import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, User } from 'lucide-react';
import ManagerSubHeader from '@/components/managers/ManagerSubHeader';

const PartnerNeedMoreInfo = () => {
  const applications = [
    {
      id: 'P001',
      partnerName: 'ABC Consulting',
      company: 'Tech Solutions Ltd',
      status: 'Need More Info',
      lastUpdate: '2024-01-15',
      missingInfo: 'Bank account verification documents',
      priority: 'high'
    },
    {
      id: 'P002',
      partnerName: 'XYZ Partners',
      company: 'Innovation Hub',
      status: 'Need More Info',
      lastUpdate: '2024-01-14',
      missingInfo: 'Company registration certificate',
      priority: 'medium'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ManagerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partners - Need More Info</h1>
          <p className="text-muted-foreground">Applications awaiting additional information from partners</p>
        </div>

        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Application {app.id}
                  </CardTitle>
                  <Badge variant="destructive">High Priority</Badge>
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
                      <p className="text-sm">Last Update</p>
                      <p className="text-sm text-muted-foreground">{app.lastUpdate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Missing Information:</p>
                    <p className="text-sm text-muted-foreground">{app.missingInfo}</p>
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

export default PartnerNeedMoreInfo;