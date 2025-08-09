import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCustomer } from '@/contexts/CustomerContext';
import { FileText } from 'lucide-react';
import ResponsiveCustomerTable from '@/components/Customer/ResponsiveCustomerTable';
import ManagerSubHeader from '@/components/managers/ManagerSubHeader';

const Submit = () => {
  const { customers } = useCustomer();
  
  const submitCustomers = customers.filter(customer => 
    customer.status === 'Submit'
  );

  return (
    <div>
      <ManagerSubHeader />
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-500" />
            Submit
          </h1>
          <p className="text-muted-foreground">
            Newly submitted applications awaiting initial review
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-700" variant="secondary">
          Medium Priority - {submitCustomers.length} applications
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Applications Awaiting Initial Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitCustomers.length > 0 ? (
            <ResponsiveCustomerTable 
              customers={submitCustomers}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No applications currently awaiting review</p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Submit;