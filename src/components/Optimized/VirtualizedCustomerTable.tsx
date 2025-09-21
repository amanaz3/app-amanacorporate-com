import React, { memo, useCallback, useMemo, useState } from 'react';
import { useVirtualizedSearch } from '@/hooks/useVirtualizedTable';
import { Customer } from '@/types/customer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface VirtualizedCustomerTableProps {
  customers: Customer[];
  onCustomerClick?: (customer: Customer) => void;
  containerHeight?: number;
  className?: string;
}

const ITEM_HEIGHT = 72; // Height of each row in pixels

const CustomerRow = memo(({ 
  customer, 
  onClick, 
  index 
}: { 
  customer: Customer & { virtualIndex?: number; absoluteIndex?: number }; 
  onClick?: (customer: Customer) => void;
  index: number;
}) => {
  const navigate = useNavigate();

  const handleView = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/customers/${customer.id}`);
  }, [customer.id, navigate]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/customers/${customer.id}/edit`);
  }, [customer.id, navigate]);

  const handleRowClick = useCallback(() => {
    onClick?.(customer);
  }, [customer, onClick]);

  const getStatusVariant = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'secondary';
      case 'submit': return 'default';
      case 'need more info': return 'destructive';
      case 'complete': return 'default';
      case 'paid': return 'default';
      case 'return': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b bg-white hover:bg-gray-50 cursor-pointer transition-colors",
        index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
      )}
      style={{ height: ITEM_HEIGHT }}
      onClick={handleRowClick}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {customer.name}
            </h3>
            <Badge variant={getStatusVariant(customer.status) as any} className="text-xs">
              {customer.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
            <span className="truncate">{customer.email}</span>
            <span className="truncate">{customer.company}</span>
            <span>${(customer.amount || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

const VirtualizedCustomerTable: React.FC<VirtualizedCustomerTableProps> = ({
  customers,
  onCustomerClick,
  containerHeight = 600,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchFields = useMemo(() => 
    ['name', 'email', 'company', 'mobile'] as (keyof Customer)[], 
    []
  );

  const {
    visibleItems,
    scrollElementProps,
    containerProps,
    filteredData,
    totalItems,
    filteredItems,
    isFiltered
  } = useVirtualizedSearch(
    customers,
    searchTerm,
    searchFields,
    ITEM_HEIGHT,
    containerHeight
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  if (customers.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No customers found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Customers</span>
            <span className="text-sm text-gray-500">
              ({isFiltered ? filteredItems : totalItems})
            </span>
          </CardTitle>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div {...scrollElementProps}>
          <div {...containerProps}>
            {visibleItems.map((customer, index) => (
              <CustomerRow
                key={customer.id || customer.virtualIndex}
                customer={customer}
                onClick={onCustomerClick}
                index={customer.absoluteIndex || index}
              />
            ))}
          </div>
        </div>

        {isFiltered && filteredItems === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">No customers match your search</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(VirtualizedCustomerTable);