import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCustomer } from '@/contexts/CustomerContext';
import { CheckCircle } from 'lucide-react';
import ResponsiveCustomerTable from '@/components/Customer/ResponsiveCustomerTable';

const Completed = () => {
  const { customers } = useCustomer();
  
  const completedCustomers = customers.filter(customer => 
    customer.status === 'Completed'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            Completed
          </h1>
          <p className="text-muted-foreground">
            Fully processed applications ready for archival
          </p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700" variant="secondary">
          Completed - {completedCustomers.length} applications
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Completed Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedCustomers.length > 0 ? (
            <ResponsiveCustomerTable 
              customers={completedCustomers}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No completed applications found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Completed;