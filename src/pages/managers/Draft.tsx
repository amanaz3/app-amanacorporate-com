import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCustomer } from '@/contexts/CustomerContext';
import { FileText } from 'lucide-react';
import ResponsiveCustomerTable from '@/components/Customer/ResponsiveCustomerTable';

const Draft = () => {
  const { customers } = useCustomer();
  
  const draftCustomers = customers.filter(customer => 
    customer.status === 'Draft'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-gray-500" />
            Draft
          </h1>
          <p className="text-muted-foreground">
            Incomplete applications that may need follow-up
          </p>
        </div>
        <Badge className="bg-gray-100 text-gray-700" variant="secondary">
          Medium Priority - {draftCustomers.length} applications
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            Draft Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {draftCustomers.length > 0 ? (
            <ResponsiveCustomerTable 
              customers={draftCustomers}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No draft applications found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Draft;