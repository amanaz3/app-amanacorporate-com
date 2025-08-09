import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building, Settings, Trash2 } from 'lucide-react';
import ManagerSubHeader from '@/components/managers/ManagerSubHeader';

const CompanyManagement = () => {
  const companies = [
    {
      id: 'C001',
      name: 'Tech Solutions Ltd',
      type: 'LLC',
      registration: 'REG123456',
      partner: 'ABC Consulting',
      bankAccount: 'Emirates NBD - Business Account',
      status: 'Active'
    },
    {
      id: 'C002',
      name: 'Innovation Hub',
      type: 'FZE',
      registration: 'REG789012',
      partner: 'XYZ Partners',
      bankAccount: 'ADCB - Corporate Account',
      status: 'Pending'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ManagerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Company Management</h1>
              <p className="text-muted-foreground">Manage partner companies and their business bank accounts</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Company
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {company.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Company Type</p>
                    <p className="text-sm text-muted-foreground">{company.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Registration</p>
                    <p className="text-sm text-muted-foreground">{company.registration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Partner</p>
                    <p className="text-sm text-muted-foreground">{company.partner}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium">Business Bank Account</p>
                  <p className="text-sm text-muted-foreground">{company.bankAccount}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;