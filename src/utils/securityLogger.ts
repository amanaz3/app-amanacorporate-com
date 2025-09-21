import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, any>;
}

class SecurityLogger {
  private static instance: SecurityLogger;
  
  private constructor() {}
  
  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Get client IP and user agent if available
      const clientInfo = this.getClientInfo();
      
      await supabase.from('security_audit_log').insert({
        event_type: event.event_type,
        user_id: event.user_id,
        ip_address: event.ip_address || clientInfo.ip,
        user_agent: event.user_agent || clientInfo.userAgent,
        details: event.details || {}
      });
    } catch (error) {
      // Fallback to console in development only
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to log security event:', error);
      }
    }
  }

  private getClientInfo(): { ip?: string; userAgent?: string } {
    return {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      // IP will be handled by server-side logging
      ip: undefined
    };
  }

  // Specific security event loggers
  async logLoginAttempt(email: string, success: boolean, userId?: string): Promise<void> {
    await this.logSecurityEvent({
      event_type: success ? 'login_success' : 'login_failed',
      user_id: userId,
      details: {
        email,
        timestamp: new Date().toISOString()
      }
    });
  }

  async logAccessDenied(userId?: string, resource?: string): Promise<void> {
    await this.logSecurityEvent({
      event_type: 'access_denied',
      user_id: userId,
      details: {
        resource,
        timestamp: new Date().toISOString()
      }
    });
  }

  async logDataAccess(userId: string, action: string, resource: string): Promise<void> {
    await this.logSecurityEvent({
      event_type: 'data_access',
      user_id: userId,
      details: {
        action,
        resource,
        timestamp: new Date().toISOString()
      }
    });
  }

  async logSuspiciousActivity(activity: string, userId?: string, details?: Record<string, any>): Promise<void> {
    await this.logSecurityEvent({
      event_type: 'suspicious_activity',
      user_id: userId,
      details: {
        activity,
        ...details,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Export singleton instance
export const securityLogger = SecurityLogger.getInstance();