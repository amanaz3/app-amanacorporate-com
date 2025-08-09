import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, User } from 'lucide-react';
import PartnerSubHeader from '@/components/partners/PartnerSubHeader';

const PartnerSubmit = () => {
  const applications = [
    {
      id: 'P004',
      partnerName: 'Smart Consulting',
      company: 'Digital Ventures',
      status: 'Submit',
      submitDate: '2024-01-16',
      bankAccount: 'Business Account - Emirates NBD',
      priority: 'medium'
    },
    {
      id: 'P005',
      partnerName: 'Elite Partners',
      company: 'Trade Solutions',
      status: 'Submit',
      submitDate: '2024-01-16',
      bankAccount: 'Business Account - ADCB',
      priority: 'medium'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PartnerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partners - Submitted Applications</h1>
          <p className="text-muted-foreground">Newly submitted applications awaiting review</p>
        </div>

        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Application {app.id}
                  </CardTitle>
                  <Badge variant="outline">Submitted</Badge>
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
                      <p className="text-sm">Submitted On</p>
                      <p className="text-sm text-muted-foreground">{app.submitDate}</p>
                    </div>
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

export default PartnerSubmit;