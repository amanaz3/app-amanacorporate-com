import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/SecureAuthContext';
import { supabase } from '@/integrations/supabase/client';

const SecurityMonitor: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Monitor for suspicious activities
    const securityEvents = {
      failedLoginAttempts: 0,
      suspiciousRequests: 0,
      lastActivity: Date.now()
    };

    // Track failed authentication attempts
    const trackFailedAuth = () => {
      securityEvents.failedLoginAttempts++;
      if (securityEvents.failedLoginAttempts > 5) {
        logSecurityEvent('EXCESSIVE_FAILED_LOGINS', {
          attempts: securityEvents.failedLoginAttempts,
          userId: user?.id,
          timestamp: new Date().toISOString()
        });
      }
    };

    // Track suspicious network requests
    const monitorNetworkRequests = () => {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const url = args[0] as string;
        
        // Monitor for potential data exfiltration
        if (typeof url === 'string' && !url.includes('supabase.co') && 
            !url.includes('lovableproject.com') && url.startsWith('http')) {
          logSecurityEvent('SUSPICIOUS_EXTERNAL_REQUEST', {
            url,
            userId: user?.id,
            timestamp: new Date().toISOString()
          });
        }
        
        return originalFetch.apply(window, args);
      };

      return () => {
        window.fetch = originalFetch;
      };
    };

    // Activity tracking for session timeout
    const trackActivity = () => {
      securityEvents.lastActivity = Date.now();
    };

    // Session timeout check (30 minutes of inactivity)
    const sessionTimeoutCheck = setInterval(() => {
      const inactiveTime = Date.now() - securityEvents.lastActivity;
      if (inactiveTime > 30 * 60 * 1000) { // 30 minutes
        logSecurityEvent('SESSION_TIMEOUT', {
          inactiveTime,
          userId: user?.id,
          timestamp: new Date().toISOString()
        });
        
        // Force logout on extended inactivity
        if (user) {
          supabase.auth.signOut();
        }
      }
    }, 60000); // Check every minute

    // Add activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, trackActivity, true);
    });

    const cleanupFetch = monitorNetworkRequests();

    return () => {
      clearInterval(sessionTimeoutCheck);
      events.forEach(event => {
        document.removeEventListener(event, trackActivity, true);
      });
      cleanupFetch();
    };
  }, [user]);

  return null;
};

// Security event logging function
const logSecurityEvent = async (eventType: string, details: any) => {
  try {
    await supabase.from('logs').insert({
      message: `Security Event: ${eventType}`,
      level: 'warning',
      component: 'security_monitor',
      user_id: details.userId || null,
      stack_trace: JSON.stringify(details)
    });

    // Also log to console for immediate visibility
    console.warn(`[Security Monitor] ${eventType}:`, details);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

export default SecurityMonitor;