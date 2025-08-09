import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCustomer } from '@/contexts/CustomerContext';
import { ArrowLeft } from 'lucide-react';
import ResponsiveCustomerTable from '@/components/Customer/ResponsiveCustomerTable';

const Return = () => {
  const { customers } = useCustomer();
  
  const returnCustomers = customers.filter(customer => 
    customer.status === 'Return'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ArrowLeft className="h-8 w-8 text-red-500" />
            Return
          </h1>
          <p className="text-muted-foreground">
            Applications returned for corrections and re-submission
          </p>
        </div>
        <Badge className="bg-red-100 text-red-700" variant="secondary">
          High Priority - {returnCustomers.length} applications
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5 text-red-500" />
            Applications Returned for Corrections
          </CardTitle>
        </CardHeader>
        <CardContent>
          {returnCustomers.length > 0 ? (
            <ResponsiveCustomerTable 
              customers={returnCustomers}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ArrowLeft className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No applications currently returned for corrections</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Return;