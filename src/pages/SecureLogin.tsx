
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SecureAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import SignInForm from '@/components/Auth/SignInForm';

const SecureLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, isLoading: authLoading, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Always redirect to dashboard for security and consistent user experience
  // This prevents users from landing on previous user's pages and provides clean UX
  const from = '/dashboard';

  useEffect(() => {
    // Only redirect if we're sure the user is authenticated and has a valid session
    if (!authLoading && isAuthenticated && session) {
      navigate(from, { replace: true });
    }
  }, [authLoading, isAuthenticated, session, navigate, from]);

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is already authenticated
  if (isAuthenticated && session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <CardTitle className="text-2xl font-bold">Amana Corporate</CardTitle>
          </div>
          <CardDescription className="text-center">
            Sign in to access your workflow management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? Contact your administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureLogin;
