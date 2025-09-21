import React, { memo, useCallback, useMemo, useState } from 'react';
import { useOptimizedCustomers } from '@/hooks/useOptimizedCustomers';
import VirtualizedCustomerTable from './VirtualizedCustomerTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle,
  Download,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useNavigate } from 'react-router-dom';

interface OptimizedCustomerListProps {
  className?: string;
  showFilters?: boolean;
  showStats?: boolean;
  containerHeight?: number;
}

const STATUS_OPTIONS = [
  'Draft',
  'Submit', 
  'Need More Info',
  'Complete',
  'Paid',
  'Return',
  'Rejected'
];

const OptimizedCustomerList: React.FC<OptimizedCustomerListProps> = memo(({
  className = '',
  showFilters = true,
  showStats = true,
  containerHeight = 600
}) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedUserFilter, setAssignedUserFilter] = useState('');

  // Build filters object
  const filters = useMemo(() => ({
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    assignedUser: assignedUserFilter || undefined
  }), [searchTerm, statusFilter, assignedUserFilter]);

  const {
    customers,
    stats,
    isLoading,
    error,
    invalidateCustomers,
    prefetchCustomer,
    updateStatus,
    isUpdating
  } = useOptimizedCustomers(filters);

  // Event handlers
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilter = useCallback((value: string) => {
    setStatusFilter(value === 'all' ? '' : value);
  }, []);

  const handleUserFilter = useCallback((value: string) => {
    setAssignedUserFilter(value === 'all' ? '' : value);
  }, []);

  const handleCustomerClick = useCallback((customer: any) => {
    prefetchCustomer(customer.id);
    navigate(`/customers/${customer.id}`);
  }, [prefetchCustomer, navigate]);

  const handleRefresh = useCallback(() => {
    invalidateCustomers();
  }, [invalidateCustomers]);

  const handleCreateCustomer = useCallback(() => {
    navigate('/customers/new');
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load customers. Please try again.
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      {showStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  $
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedCount}</p>
                </div>
                <Badge variant="default" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                  ✓
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingCount}</p>
                </div>
                <Badge variant="secondary" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                  ⏳
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </span>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                {isAdmin && (
                  <Button 
                    onClick={handleCreateCustomer}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Customer
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isAdmin && (
                <Select value={assignedUserFilter || 'all'} onValueChange={handleUserFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {/* Would need to fetch users for this dropdown */}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Virtualized Customer Table */}
      <VirtualizedCustomerTable
        customers={customers as any}
        onCustomerClick={handleCustomerClick}
        containerHeight={containerHeight}
        className="shadow-sm"
      />
    </div>
  );
});

OptimizedCustomerList.displayName = 'OptimizedCustomerList';

export default OptimizedCustomerList;