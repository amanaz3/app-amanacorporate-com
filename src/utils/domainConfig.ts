/**
 * Domain Configuration Utility
 * Manages URLs and domains for the two-domain architecture
 */

// Domain configuration
export const DOMAINS = {
  AUTH: 'https://auth.amanacorporate.com',
  APP: 'https://app.amanacorporate.com'
} as const;

// Development domains (fallback)
export const DEV_DOMAINS = {
  AUTH: 'http://localhost:5173',
  APP: 'http://localhost:5173'
} as const;

/**
 * Get the appropriate domain based on environment
 */
export const getDomains = () => {
  const isProduction = window.location.hostname.includes('amanacorporate.com');
  return isProduction ? DOMAINS : DEV_DOMAINS;
};

/**
 * Check if current domain is the auth domain
 */
export const isAuthDomain = (): boolean => {
  const hostname = window.location.hostname;
  return hostname === 'auth.amanacorporate.com' || 
         hostname === 'localhost'; // For development
};

/**
 * Check if current domain is the app domain  
 */
export const isAppDomain = (): boolean => {
  const hostname = window.location.hostname;
  return hostname === 'app.amanacorporate.com' ||
         hostname === 'localhost'; // For development
};

/**
 * Get login URL for redirects
 */
export const getLoginUrl = (): string => {
  const domains = getDomains();
  return `${domains.AUTH}/login`;
};

/**
 * Get dashboard URL for redirects after login
 */
export const getDashboardUrl = (): string => {
  const domains = getDomains();
  return `${domains.APP}/dashboard`;
};

/**
 * Get logout redirect URL
 */
export const getLogoutUrl = (): string => {
  const domains = getDomains();
  return `${domains.AUTH}/login`;
};

/**
 * Create cross-domain URL for navigation
 */
export const createCrossDomainUrl = (domain: 'auth' | 'app', path: string): string => {
  const domains = getDomains();
  const baseUrl = domain === 'auth' ? domains.AUTH : domains.APP;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};