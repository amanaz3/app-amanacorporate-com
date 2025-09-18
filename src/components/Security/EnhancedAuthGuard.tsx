import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedAuthGuardProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'manager' | 'user';
}

const EnhancedAuthGuard: React.FC<EnhancedAuthGuardProps> = ({ 
  children, 
  requireRole 
}) => {
  const { user, session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [securityCheck, setSecurityCheck] = useState<boolean>(false);

  useEffect(() => {
    const performSecurityValidation = async () => {
      if (!session || !user) {
        setSecurityCheck(false);
        return;
      }

      try {
        // Validate session security
        const { data: validationResult, error } = await supabase
          .rpc('validate_session_security');

        if (error) {
          console.error('Session validation error:', error);
          setSecurityCheck(false);
          return;
        }

        // Check if user must change password (skip this check for now as field doesn't exist in profile)
        // TODO: Add must_change_password field to profile table if needed
        // if (user.profile?.must_change_password) {
        //   navigate('/change-password');
        //   return;
        // }

        // Check role requirements
        if (requireRole && user.profile?.role !== requireRole && user.profile?.role !== 'admin') {
          console.warn('Insufficient permissions for required role:', requireRole);
          setSecurityCheck(false);
          return;
        }

        setSecurityCheck(validationResult === true);
      } catch (error) {
        console.error('Security validation failed:', error);
        setSecurityCheck(false);
      }
    };

    if (!isLoading) {
      performSecurityValidation();
    }
  }, [session, user, isLoading, requireRole, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Validating security...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!session || !user) {
    navigate('/login');
    return null;
  }

  // Check security validation
  if (!securityCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-destructive mb-2">Security Validation Failed</h1>
          <p className="text-muted-foreground mb-4">
            Your session failed security validation. Please log in again.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnhancedAuthGuard;