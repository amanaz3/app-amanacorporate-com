import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCustomer } from '@/contexts/CustomerContext';
import { AlertCircle } from 'lucide-react';
import ResponsiveCustomerTable from '@/components/Customer/ResponsiveCustomerTable';

const NeedMoreInfo = () => {
  const { customers } = useCustomer();
  
  const needMoreInfoCustomers = customers.filter(customer => 
    customer.status === 'Need More Info'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            Need More Info
          </h1>
          <p className="text-muted-foreground">
            Applications requiring additional information from clients
          </p>
        </div>
        <Badge className="bg-orange-100 text-orange-700" variant="secondary">
          High Priority - {needMoreInfoCustomers.length} applications
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Applications Awaiting Client Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {needMoreInfoCustomers.length > 0 ? (
            <ResponsiveCustomerTable 
              customers={needMoreInfoCustomers}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No applications currently need more information</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NeedMoreInfo;