import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useMemo } from 'react';

interface UseOptimizedQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
  select?: (data: T) => any;
}

export const useOptimizedQuery = <T>({
  queryKey,
  queryFn,
  staleTime = 5 * 60 * 1000, // 5 minutes
  cacheTime = 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus = false,
  enabled = true,
  select
}: UseOptimizedQueryOptions<T>) => {
  const queryClient = useQueryClient();

  const optimizedQueryFn = useCallback(async () => {
    try {
      return await queryFn();
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }, [queryFn]);

  const query = useQuery({
    queryKey,
    queryFn: optimizedQueryFn,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus,
    enabled,
    select,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.code === 'PGRST301' || error?.code === '401') {
        return false;
      }
      return failureCount < 2;
    }
  });

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const setQueryData = useCallback((data: T) => {
    queryClient.setQueryData(queryKey, data);
  }, [queryClient, queryKey]);

  return useMemo(() => ({
    ...query,
    invalidateQuery,
    setQueryData
  }), [query, invalidateQuery, setQueryData]);
};

// Common query hooks
export const useCustomers = (enabled = true) => {
  return useOptimizedQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled,
    staleTime: 2 * 60 * 1000 // 2 minutes for frequently changing data
  });
};

export const useApplications = (enabled = true) => {
  return useOptimizedQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_applications')
        .select(`
          *,
          customers (
            id,
            name,
            email,
            company
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled
  });
};

export const useProfiles = (enabled = true) => {
  return useOptimizedQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled
  });
};