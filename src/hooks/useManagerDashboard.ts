import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useMemo, useCallback } from 'react';

interface ManagerApplication {
  id: string;
  applicant_name: string;
  company: string;
  status: string;
  created_by_role: 'partner' | 'manager';
  created_at: string;
  customer_id?: string;
  application_type?: string;
}

interface ManagerStats {
  assignedPartnerApplications: {
    draft: number;
    need_more_info: number;
    return: number;
    submit: number;
    completed: number;
    rejected: number;
    paid: number;
  };
  myReferralApplications: {
    draft: number;
    need_more_info: number;
    return: number;
    submit: number;
    completed: number;
    rejected: number;
    paid: number;
  };
  totalApplications: number;
  pendingReview: number;
}

export const useManagerDashboard = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Fetch applications assigned to this manager (customers they manage)
  const assignedApplicationsQuery = useQuery({
    queryKey: ['manager-assigned-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Fetch customers assigned to this manager
      const { data: customers, error } = await supabase
        .from('customers')
        .select(`
          id,
          name,
          company,
          status,
          created_at,
          user_id,
          account_applications (
            id,
            status,
            application_type,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return customers?.map(customer => ({
        id: customer.id,
        applicant_name: customer.name,
        company: customer.company,
        status: customer.status || 'draft',
        created_by_role: 'partner' as const,
        created_at: customer.created_at,
        customer_id: customer.id
      })) || [];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });

  // Fetch applications created by this manager (their referrals)
  const myApplicationsQuery = useQuery({
    queryKey: ['manager-my-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Fetch account applications created by this manager
      const { data: applications, error } = await supabase
        .from('account_applications')
        .select(`
          id,
          status,
          application_type,
          created_at,
          application_data,
          customers (
            id,
            name,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return applications?.map(app => {
        // Safely parse application_data if it exists
        const appData = app.application_data as any;
        return {
          id: app.id,
          applicant_name: appData?.applicant_name || 'Manager Referral',
          company: appData?.company || 'N/A',
          status: app.status,
          created_by_role: 'manager' as const,
          created_at: app.created_at,
          application_type: app.application_type
        };
      }) || [];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Calculate dashboard stats
  const stats = useMemo((): ManagerStats => {
    const assignedApps = assignedApplicationsQuery.data || [];
    const myApps = myApplicationsQuery.data || [];

    // Calculate assigned applications stats
    const assignedStats = assignedApps.reduce((acc, app) => {
      const status = app.status.toLowerCase();
      if (status in acc) {
        acc[status as keyof typeof acc]++;
      }
      return acc;
    }, {
      draft: 0,
      need_more_info: 0,
      return: 0,
      submit: 0,
      completed: 0,
      rejected: 0,
      paid: 0
    });

    // Calculate my applications stats
    const myStats = myApps.reduce((acc, app) => {
      const status = app.status.toLowerCase();
      if (status in acc) {
        acc[status as keyof typeof acc]++;
      }
      return acc;
    }, {
      draft: 0,
      need_more_info: 0,
      return: 0,
      submit: 0,
      completed: 0,
      rejected: 0,
      paid: 0
    });

    const totalApplications = assignedApps.length + myApps.length;
    const pendingReview = assignedStats.submit + myStats.submit;

    return {
      assignedPartnerApplications: assignedStats,
      myReferralApplications: myStats,
      totalApplications,
      pendingReview
    };
  }, [assignedApplicationsQuery.data, myApplicationsQuery.data]);

  // Get recent applications (combined and sorted)
  const recentApplications = useMemo(() => {
    const assigned = assignedApplicationsQuery.data || [];
    const my = myApplicationsQuery.data || [];
    
    return [...assigned, ...my]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }, [assignedApplicationsQuery.data, myApplicationsQuery.data]);

  // Cache invalidation
  const invalidateDashboard = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['manager-assigned-applications'] });
    queryClient.invalidateQueries({ queryKey: ['manager-my-applications'] });
  }, [queryClient]);

  // Prefetch application details
  const prefetchApplication = useCallback((applicationId: string, type: 'customer' | 'application') => {
    if (type === 'customer') {
      queryClient.prefetchQuery({
        queryKey: ['customer', applicationId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', applicationId)
            .single();
          if (error) throw error;
          return data;
        },
        staleTime: 5 * 60 * 1000
      });
    } else {
      queryClient.prefetchQuery({
        queryKey: ['application', applicationId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('account_applications')
            .select('*')
            .eq('id', applicationId)
            .single();
          if (error) throw error;
          return data;
        },
        staleTime: 5 * 60 * 1000
      });
    }
  }, [queryClient]);

  return {
    // Data
    stats,
    recentApplications,
    assignedApplications: assignedApplicationsQuery.data || [],
    myApplications: myApplicationsQuery.data || [],
    
    // Loading states
    isLoading: assignedApplicationsQuery.isLoading || myApplicationsQuery.isLoading,
    isAssignedLoading: assignedApplicationsQuery.isLoading,
    isMyAppsLoading: myApplicationsQuery.isLoading,
    
    // Error states
    error: assignedApplicationsQuery.error || myApplicationsQuery.error,
    assignedError: assignedApplicationsQuery.error,
    myAppsError: myApplicationsQuery.error,
    
    // Actions
    invalidateDashboard,
    prefetchApplication,
    
    // Refetch functions
    refetchAssigned: assignedApplicationsQuery.refetch,
    refetchMyApps: myApplicationsQuery.refetch
  };
};