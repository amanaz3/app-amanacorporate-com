import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, User } from 'lucide-react';
import PartnerSubHeader from '@/components/partners/PartnerSubHeader';

const PartnerPaid = () => {
  const applications = [
    {
      id: 'P008',
      partnerName: 'Premium Partners',
      company: 'Consulting Group',
      status: 'Paid',
      paymentDate: '2024-01-15',
      amount: 5000,
      bankAccount: 'Business Account - HSBC',
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PartnerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partners - Paid Applications</h1>
          <p className="text-muted-foreground">Applications with confirmed payments</p>
        </div>

        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Application {app.id}
                  </CardTitle>
                  <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
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
                      <p className="text-sm">Payment Date</p>
                      <p className="text-sm text-muted-foreground">{app.paymentDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Amount:</p>
                    <p className="text-sm text-muted-foreground">${app.amount}</p>
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

export default PartnerPaid;