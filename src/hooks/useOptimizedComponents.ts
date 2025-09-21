import { useCallback, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Hook for optimized component rendering
export const useOptimizedComponents = () => {
  const queryClient = useQueryClient();
  const renderCountRef = useRef(0);

  // Memoized callback factory to reduce re-renders
  const createOptimizedCallback = useCallback(<T extends any[]>(
    fn: (...args: T) => void,
    deps: React.DependencyList
  ) => {
    return useCallback(fn, deps);
  }, []);

  // Memoized value factory
  const createOptimizedValue = useCallback(<T>(
    factory: () => T,
    deps: React.DependencyList
  ) => {
    return useMemo(factory, deps);
  }, []);

  // Prefetch helper for optimized navigation
  const prefetchQuery = useCallback((
    queryKey: string[],
    queryFn: () => Promise<any>,
    options?: { staleTime?: number }
  ) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options?.staleTime || 5 * 60 * 1000
    });
  }, [queryClient]);

  // Invalidate queries helper
  const invalidateQueries = useCallback((queryKey: string[]) => {
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  // Component render tracking (development only)
  const trackRender = useCallback((componentName: string) => {
    if (process.env.NODE_ENV === 'development') {
      renderCountRef.current += 1;
      console.log(`${componentName} rendered: ${renderCountRef.current}`);
    }
  }, []);

  return {
    createOptimizedCallback,
    createOptimizedValue,
    prefetchQuery,
    invalidateQueries,
    trackRender
  };
};

// Hook for optimized list operations
export const useOptimizedList = <T extends { id: string }>(
  items: T[],
  options: {
    pageSize?: number;
    searchFields?: (keyof T)[];
    sortField?: keyof T;
    sortDirection?: 'asc' | 'desc';
  } = {}
) => {
  const {
    pageSize = 50,
    searchFields = [],
    sortField,
    sortDirection = 'asc'
  } = options;

  // Memoized search function
  const searchItems = useCallback((searchTerm: string) => {
    if (!searchTerm.trim() || searchFields.length === 0) return items;

    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(term);
      })
    );
  }, [items, searchFields]);

  // Memoized sort function
  const sortItems = useCallback((itemsToSort: T[]) => {
    if (!sortField) return itemsToSort;

    return [...itemsToSort].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection]);

  // Memoized pagination
  const paginateItems = useCallback((itemsToPaginate: T[], page: number) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return itemsToPaginate.slice(startIndex, endIndex);
  }, [pageSize]);

  return {
    searchItems,
    sortItems,
    paginateItems,
    totalPages: Math.ceil(items.length / pageSize)
  };
};

// Hook for optimized form handling
export const useOptimizedForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void
) => {
  const valuesRef = useRef(initialValues);
  const errorsRef = useRef<Partial<Record<keyof T, string>>>({});

  const updateField = useCallback((field: keyof T, value: any) => {
    valuesRef.current = {
      ...valuesRef.current,
      [field]: value
    };
    
    // Clear error when field is updated
    if (errorsRef.current[field]) {
      errorsRef.current = {
        ...errorsRef.current,
        [field]: undefined
      };
    }
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    errorsRef.current = {
      ...errorsRef.current,
      [field]: error
    };
  }, []);

  const clearErrors = useCallback(() => {
    errorsRef.current = {};
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    clearErrors();
    
    try {
      await onSubmit(valuesRef.current);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [onSubmit, clearErrors]);

  const reset = useCallback(() => {
    valuesRef.current = initialValues;
    clearErrors();
  }, [initialValues, clearErrors]);

  return {
    values: valuesRef.current,
    errors: errorsRef.current,
    updateField,
    setError,
    clearErrors,
    handleSubmit,
    reset
  };
};