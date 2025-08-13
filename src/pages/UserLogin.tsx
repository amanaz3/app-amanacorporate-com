import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SecureAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import SignInForm from '@/components/Auth/SignInForm';
const UserLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    isAuthenticated,
    isLoading: authLoading,
    session
  } = useAuth();
  const navigate = useNavigate();
  const from = '/user-dashboard';
  useEffect(() => {
    if (!authLoading && isAuthenticated && session) {
      navigate(from, {
        replace: true
      });
    }
  }, [isAuthenticated, authLoading, navigate, from, session]);
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }
  if (isAuthenticated && session) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirecting...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Branding and illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-100 to-blue-100 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            
            <div className="w-[28rem] h-[28rem] bg-white rounded-3xl shadow-lg p-8 mx-auto">
              <div className="bg-gray-100 rounded-2xl h-full overflow-hidden">
                <img 
                  src="/lovable-uploads/dc4fd816-6d47-4c2f-bec2-1de9b296c0b8.png" 
                  alt="Amana Mobile App"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              A small step for you,
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              a giant leap for your business.
            </p>
          </div>

          <div className="space-y-6">
            <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don't have an account? Contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default UserLogin;