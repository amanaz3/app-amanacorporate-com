import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useMemo, useCallback } from 'react';
import { Customer } from '@/types/customer';

interface DashboardStats {
  totalCustomers: number;
  totalAmount: number;
  statusBreakdown: Record<string, number>;
  monthlyRevenue: { month: string; amount: number; count: number }[];
  recentActivity: {
    type: 'customer_created' | 'status_changed' | 'document_uploaded';
    description: string;
    timestamp: Date;
    customerId: string;
  }[];
  topPerformers: {
    userId: string;
    userName: string;
    customerCount: number;
    totalAmount: number;
  }[];
}

export const useOptimizedDashboard = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Main dashboard data query
  const dashboardQuery = useQuery({
    queryKey: ['dashboard', user?.id, isAdmin],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch customers with related data
      let customersQuery = supabase
        .from('customers')
        .select(`
          *,
          status_changes (
            id,
            new_status,
            previous_status,
            created_at,
            changed_by
          ),
          documents (
            id,
            is_uploaded,
            created_at
          )
        `);

      // Apply RLS
      if (!isAdmin && user?.id) {
        customersQuery = customersQuery.eq('user_id', user.id);
      }

      const { data: customers, error: customersError } = await customersQuery;
      if (customersError) throw customersError;

      // Fetch user profiles for user names
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email');
      
      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Calculate stats
      const totalCustomers = customers?.length || 0;
      const totalAmount = customers?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

      // Status breakdown
      const statusBreakdown = customers?.reduce((acc, customer) => {
        acc[customer.status] = (acc[customer.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Monthly revenue (last 12 months)
      const monthlyRevenue = calculateMonthlyRevenue(customers || []);

      // Recent activity (last 50 items)
      const recentActivity = calculateRecentActivity(customers || [], profileMap);

      // Top performers (if admin)
      const topPerformers = isAdmin ? calculateTopPerformers(customers || [], profileMap) : [];

      return {
        totalCustomers,
        totalAmount,
        statusBreakdown,
        monthlyRevenue,
        recentActivity,
        topPerformers
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    enabled: !!user,
    refetchOnWindowFocus: false
  });

  // Optimized customer list query (separate from dashboard stats)
  const customersQuery = useQuery({
    queryKey: ['customers-list', user?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('customers')
        .select('*');

      if (!isAdmin && user?.id) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100); // Limit for performance

      if (error) throw error;
      return data || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!user
  });

  // Memoized filtered data
  const filteredCustomers = useMemo(() => {
    return customersQuery.data || [];
  }, [customersQuery.data]);

  // Cache invalidation
  const invalidateDashboard = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['customers-list'] });
  }, [queryClient]);

  // Prefetch customer details
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
    // Data
    stats: dashboardQuery.data,
    customers: filteredCustomers,
    
    // Loading states
    isLoading: dashboardQuery.isLoading || customersQuery.isLoading,
    isStatsLoading: dashboardQuery.isLoading,
    isCustomersLoading: customersQuery.isLoading,
    
    // Error states
    error: dashboardQuery.error || customersQuery.error,
    
    // Actions
    invalidateDashboard,
    prefetchCustomer,
    
    // Refetch functions
    refetchStats: dashboardQuery.refetch,
    refetchCustomers: customersQuery.refetch
  };
};

// Helper functions
function calculateMonthlyRevenue(customers: any[]) {
  const months = new Map<string, { amount: number; count: number }>();
  const now = new Date();
  
  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toISOString().slice(0, 7); // YYYY-MM
    months.set(key, { amount: 0, count: 0 });
  }
  
  // Aggregate revenue by month for completed/paid customers
  customers
    .filter(c => c.status === 'Complete' || c.status === 'Paid')
    .forEach(customer => {
      if (customer.created_at) {
        const monthKey = customer.created_at.slice(0, 7);
        const existing = months.get(monthKey);
        if (existing) {
          existing.amount += customer.amount || 0;
          existing.count += 1;
        }
      }
    });
  
  return Array.from(months.entries()).map(([month, data]) => ({
    month,
    amount: data.amount,
    count: data.count
  }));
}

function calculateRecentActivity(customers: any[], profileMap: Map<string, any>) {
  const activities: any[] = [];
  
  customers.forEach(customer => {
    // Customer creation
    activities.push({
      type: 'customer_created',
      description: `New customer: ${customer.name}`,
      timestamp: new Date(customer.created_at || ''),
      customerId: customer.id
    });
    
    // Status changes (from status_changes if available)
    // This would need the actual status_changes data from the query
  });
  
  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 20);
}

function calculateTopPerformers(customers: any[], profileMap: Map<string, any>) {
  const performers = new Map<string, { customerCount: number; totalAmount: number }>();
  
  customers.forEach(customer => {
    if (customer.user_id) {
      const existing = performers.get(customer.user_id) || { customerCount: 0, totalAmount: 0 };
      existing.customerCount += 1;
      existing.totalAmount += customer.amount || 0;
      performers.set(customer.user_id, existing);
    }
  });
  
  return Array.from(performers.entries())
    .map(([userId, stats]) => ({
      userId,
      userName: profileMap.get(userId)?.name || 'Unknown',
      customerCount: stats.customerCount,
      totalAmount: stats.totalAmount
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);
}