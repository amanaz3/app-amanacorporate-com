import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCustomer } from '@/contexts/CustomerContext';
import { XCircle } from 'lucide-react';
import ResponsiveCustomerTable from '@/components/Customer/ResponsiveCustomerTable';

const Rejected = () => {
  const { customers } = useCustomer();
  
  const rejectedCustomers = customers.filter(customer => 
    customer.status === 'Rejected'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <XCircle className="h-8 w-8 text-red-600" />
            Rejected
          </h1>
          <p className="text-muted-foreground">
            Final rejected applications - no action unless appeal/retry needed
          </p>
        </div>
        <Badge className="bg-red-100 text-red-700" variant="secondary">
          Final Status - {rejectedCustomers.length} applications
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Rejected Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rejectedCustomers.length > 0 ? (
            <ResponsiveCustomerTable 
              customers={rejectedCustomers}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No rejected applications found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Rejected;