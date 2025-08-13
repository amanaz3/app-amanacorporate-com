import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SecureAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import SignInForm from '@/components/Auth/SignInForm';

const PartnerLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, isLoading: authLoading, session } = useAuth();
  const navigate = useNavigate();

  const from = '/partner-dashboard';

  useEffect(() => {
    if (!authLoading && isAuthenticated && session) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from, session]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
      <Card className="w-[400px] shadow-lg border-0 bg-card/95 backdrop-blur">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-full mr-3">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Partner Portal</CardTitle>
          </div>
          <CardDescription className="text-center text-muted-foreground">
            Sign in to access your partner dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account? Contact your administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerLogin;