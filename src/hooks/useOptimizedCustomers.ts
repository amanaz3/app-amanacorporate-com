import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types/customer';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useCallback, useMemo } from 'react';
import { securityLogger } from '@/utils/securityLogger';

interface CustomerFilters {
  status?: string;
  search?: string;
  assignedUser?: string;
  dateRange?: { from: Date; to: Date };
}

export const useOptimizedCustomers = (filters?: CustomerFilters) => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Generate query key based on filters and user context
  const queryKey = useMemo(() => 
    ['customers', user?.id, isAdmin, filters], 
    [user?.id, isAdmin, filters]
  );

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('customers')
        .select(`
          *,
          documents (
            id,
            category,
            is_uploaded,
            name
          ),
          status_changes (
            id,
            new_status,
            created_at,
            changed_by
          )
        `);

      // Apply RLS automatically - users see their own, admins see all
      if (!isAdmin && user?.id) {
        query = query.eq('user_id', user.id);
      }

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status as any);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      if (filters?.assignedUser) {
        query = query.eq('user_id', filters.assignedUser);
      }

      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.from.toISOString())
          .lte('created_at', filters.dateRange.to.toISOString());
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1000); // Reasonable limit for performance

      if (error) {
        securityLogger.logSuspiciousActivity('database_error', user?.id, {
          error: error.message,
          table: 'customers',
          operation: 'select'
        });
        throw error;
      }

      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - customers change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!user, // Only run when user is authenticated
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
        return false; // Don't retry auth errors
      }
      return failureCount < 2;
    }
  });

  // Memoized derived data
  const stats = useMemo(() => {
    if (!query.data) return null;

    const customers = query.data;
    return {
      total: customers.length,
      byStatus: customers.reduce((acc, customer) => {
        acc[customer.status] = (acc[customer.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalAmount: customers.reduce((sum, customer) => sum + (customer.amount || 0), 0),
      completedCount: customers.filter(c => c.status === 'Complete' || c.status === 'Paid').length,
      pendingCount: customers.filter(c => ['Draft', 'Submit', 'Need More Info'].includes(c.status)).length,
      rejectedCount: customers.filter(c => c.status === 'Rejected').length
    };
  }, [query.data]);

  // Optimized mutation for status updates
  const updateStatusMutation = useMutation({
    mutationFn: async ({ customerId, newStatus, comment }: {
      customerId: string;
      newStatus: string;
      comment?: string;
    }) => {
      const { error } = await supabase
        .from('customers')
        .update({ status: newStatus as any })
        .eq('id', customerId);

      if (error) throw error;

      // Log status change
      if (comment) {
        await supabase.from('status_changes').insert({
          customer_id: customerId,
          previous_status: 'Draft' as any, // Would need to track this properly
          new_status: newStatus as any,
          changed_by: user?.id,
          changed_by_role: user?.profile?.role || 'user',
          comment
        });
      }

      return { customerId, newStatus };
    },
    onSuccess: (data) => {
      // Optimistically update the cache
      queryClient.setQueryData(queryKey, (oldData: Customer[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(customer => 
          customer.id === data.customerId 
            ? { ...customer, status: data.newStatus as any }
            : customer
        );
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => {
      securityLogger.logSuspiciousActivity('mutation_error', user?.id, {
        error: (error as Error).message,
        operation: 'update_customer_status'
      });
    }
  });

  // Bulk operations
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ customerIds, updates }: {
      customerIds: string[];
      updates: Record<string, any>; // Use any to avoid type issues
    }) => {
      const { error } = await supabase
        .from('customers')
        .update(updates)
        .in('id', customerIds);

      if (error) throw error;
      return { customerIds, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  const invalidateCustomers = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  }, [queryClient]);

  const prefetchCustomer = useCallback((customerId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['customer', customerId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60 * 1000
    });
  }, [queryClient]);

  return {
    ...query,
    customers: query.data || [],
    stats,
    updateStatus: updateStatusMutation.mutate,
    bulkUpdate: bulkUpdateMutation.mutate,
    isUpdating: updateStatusMutation.isPending || bulkUpdateMutation.isPending,
    invalidateCustomers,
    prefetchCustomer
  };
};