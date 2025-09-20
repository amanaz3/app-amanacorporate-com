
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Add security headers via meta tags where possible
    const addMetaTag = (name: string, content: string) => {
      const existingTag = document.querySelector(`meta[name="${name}"]`);
      if (!existingTag) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Enhanced Content Security Policy for iframe environment
    addMetaTag('Content-Security-Policy', 
      "default-src 'self' 'unsafe-inline'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://*.lovableproject.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.lovableproject.com; " +
      "frame-ancestors 'self' https://*.lovableproject.com https://*.lovable.app https://amanacorporate.com https://*.amanacorporate.com; " +
      "object-src 'none'; " +
      "base-uri 'self';"
    );

    // X-Frame-Options compatible with iframe
    addMetaTag('X-Frame-Options', 'SAMEORIGIN');

    // Enhanced security headers
    addMetaTag('X-Content-Type-Options', 'nosniff');
    addMetaTag('X-XSS-Protection', '1; mode=block');
    addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
    addMetaTag('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Add security event monitoring
    const logSecurityEvent = (event: string, details?: any) => {
      console.warn(`[Security Event] ${event}`, details);
    };

    // Monitor for potential XSS attempts
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('script') || message.includes('eval') || message.includes('innerHTML')) {
        logSecurityEvent('Potential XSS attempt detected', { message });
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return null;
};

export default SecurityHeaders;
