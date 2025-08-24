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
  return <div className="min-h-screen bg-gradient-to-br from-[hsl(220,100%,95%)] to-[hsl(210,100%,98%)] flex">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-[0_25px_50px_-12px_hsl(213_94%_68%_/_0.25)] p-8">
          <div className="text-left">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-[hsl(213_94%_68%)] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-[hsl(213_94%_68%)] font-semibold text-xl">mana</span>
            </div>
            
            <h1 className="text-3xl font-bold text-[hsl(220_26%_14%)] mb-2">
              Welcome to Amana
            </h1>
            <p className="text-lg text-[hsl(215_25%_27%)] mb-8">
              Sign into your account
            </p>
          </div>

          <div className="space-y-6">
            <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account? Contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="relative">
          <div className="w-[32rem] h-[32rem] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(213_94%_68%)] to-[hsl(200_80%_50%)] rounded-3xl transform rotate-3"></div>
            <div className="absolute inset-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <img 
                src="/lovable-uploads/dc4fd816-6d47-4c2f-bec2-1de9b296c0b8.png" 
                alt="Amana Mobile App"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[hsl(213_94%_68%)] rounded-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[hsl(200_100%_70%)] rounded-lg opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute top-1/4 -left-8 w-8 h-8 bg-[hsl(213_94%_68%)] rounded-full opacity-40 animate-bounce delay-500"></div>
          </div>
        </div>
      </div>
    </div>;
};
export default UserLogin;