import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, User } from 'lucide-react';
import ManagerSubHeader from '@/components/managers/ManagerSubHeader';

const PartnerDraft = () => {
  const applications = [
    {
      id: 'P006',
      partnerName: 'Future Partners',
      company: 'Innovation Labs',
      status: 'Draft',
      lastUpdate: '2024-01-12',
      completionPercentage: 65,
      priority: 'low'
    },
    {
      id: 'P007',
      partnerName: 'Alpha Consulting',
      company: 'Business Hub',
      status: 'Draft',
      lastUpdate: '2024-01-10',
      completionPercentage: 40,
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ManagerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partners - Draft Applications</h1>
          <p className="text-muted-foreground">Incomplete applications requiring follow-up</p>
        </div>

        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="border-l-4 border-l-gray-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    Application {app.id}
                  </CardTitle>
                  <Badge variant="secondary">Draft</Badge>
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
                    <p className="text-sm font-medium">Completion:</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${app.completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{app.completionPercentage}%</span>
                    </div>
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

export default PartnerDraft;