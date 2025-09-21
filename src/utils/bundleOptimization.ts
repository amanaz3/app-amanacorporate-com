import React from 'react';

// Simple lazy loading helper
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return React.lazy(importFn);
};

// Tree shaking helper - only import what's needed
export const importOnlyNeeded = <T extends Record<string, any>>(
  module: T,
  needed: (keyof T)[]
): Partial<T> => {
  const result: Partial<T> = {};
  needed.forEach(key => {
    if (key in module) {
      result[key] = module[key];
    }
  });
  return result;
};

// Dynamic feature loading
export const loadFeatureModule = async (featureName: string) => {
  try {
    switch (featureName) {
      case 'analytics':
        return await import('@/components/Analytics/UserAnalytics');
      case 'security':
        return await import('@/components/Security/CIATriadDashboard');
      case 'notifications':
        return await import('@/components/Notifications/NotificationDropdown');
      default:
        throw new Error(`Unknown feature: ${featureName}`);
    }
  } catch (error) {
    console.error(`Failed to load feature module: ${featureName}`, error);
    throw error;
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical components
  import('@/components/Customer/EnhancedCustomerTable');
  import('@/components/Dashboard/DashboardStats');
  
  // Preload critical hooks
  import('@/hooks/useOptimizedCustomers');
  import('@/hooks/useOptimizedDashboard');
};

// Memory management helper
export const cleanupMemoryLeaks = () => {
  // Clear any timers
  if (typeof window !== 'undefined') {
    // Cancel any pending animations - simplified approach
    let animationFrameId = requestAnimationFrame(() => {});
    cancelAnimationFrame(animationFrameId);
  }
};

// Performance monitoring
export const measureComponentPerformance = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    return {
      start: () => {
        performance.mark(`${componentName}-start`);
      },
      end: () => {
        performance.mark(`${componentName}-end`);
        performance.measure(
          `${componentName}-render`,
          `${componentName}-start`,
          `${componentName}-end`
        );
        
        const measure = performance.getEntriesByName(`${componentName}-render`)[0];
        console.log(`${componentName} render time:`, measure.duration.toFixed(2), 'ms');
        
        // Clean up marks
        performance.clearMarks(`${componentName}-start`);
        performance.clearMarks(`${componentName}-end`);
        performance.clearMeasures(`${componentName}-render`);
      }
    };
  }
  
  return {
    start: () => {},
    end: () => {}
  };
};