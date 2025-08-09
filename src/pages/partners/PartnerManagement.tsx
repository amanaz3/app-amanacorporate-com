import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Settings, Trash2 } from 'lucide-react';
import PartnerSubHeader from '@/components/partners/PartnerSubHeader';

const PartnerManagement = () => {
  const partners = [
    {
      id: 'P001',
      name: 'ABC Consulting',
      email: 'contact@abcconsulting.com',
      company: 'ABC Consulting Ltd',
      status: 'Active',
      joinDate: '2024-01-10',
      applications: 15
    },
    {
      id: 'P002',
      name: 'XYZ Partners',
      email: 'info@xyzpartners.com',
      company: 'XYZ Business Solutions',
      status: 'Active',
      joinDate: '2024-01-08',
      applications: 22
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PartnerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Partner Management</h1>
              <p className="text-muted-foreground">Manage partner accounts and permissions</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Partner
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {partners.map((partner) => (
            <Card key={partner.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {partner.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{partner.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{partner.company}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Join Date</p>
                    <p className="text-sm text-muted-foreground">{partner.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Applications</p>
                    <p className="text-sm text-muted-foreground">{partner.applications} submitted</p>
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

export default PartnerManagement;