import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCustomer } from '@/contexts/CustomerContext';
import { DollarSign } from 'lucide-react';
import ResponsiveCustomerTable from '@/components/Customer/ResponsiveCustomerTable';

const Paid = () => {
  const { customers } = useCustomer();
  
  const paidCustomers = customers.filter(customer => 
    customer.status === 'Paid'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-green-500" />
            Paid
          </h1>
          <p className="text-muted-foreground">
            Payment received but process not yet closed
          </p>
        </div>
        <Badge className="bg-green-100 text-green-700" variant="secondary">
          Low Priority - {paidCustomers.length} applications
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Paid Applications Awaiting Closure
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paidCustomers.length > 0 ? (
            <ResponsiveCustomerTable 
              customers={paidCustomers}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No paid applications awaiting closure</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Paid;