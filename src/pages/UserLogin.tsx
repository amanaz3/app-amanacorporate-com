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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[hsl(213_94%_68%)] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-[hsl(213_94%_68%)] font-semibold text-xl">mana</span>
          </div>
          
          {/* Welcome text */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-[hsl(220_26%_14%)]">
              Welcome to Amana
            </h1>
            <p className="text-lg text-[hsl(215_25%_27%)]">
              Sign into your account
            </p>
          </div>

          {/* Sign in form */}
          <div className="space-y-6">
            <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
            
            <div className="text-left">
              <button className="text-[hsl(213_94%_68%)] hover:underline text-sm font-medium">
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Isometric illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gradient-to-br from-[hsl(213_94%_68%)] to-[hsl(200_80%_50%)] relative overflow-hidden">
        <div className="relative w-full h-full max-w-2xl max-h-2xl">
          {/* Main illustration container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-96 h-96">
              {/* Central device mockup */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 bg-white rounded-2xl shadow-2xl p-4 rotate-12 animate-pulse">
                <img 
                  src="/lovable-uploads/dc4fd816-6d47-4c2f-bec2-1de9b296c0b8.png" 
                  alt="Amana Mobile App"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              {/* Floating UI elements */}
              <div className="absolute top-0 left-0 w-20 h-16 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 animate-bounce delay-300">
                <div className="p-2">
                  <div className="w-full h-2 bg-white/50 rounded mb-1"></div>
                  <div className="w-3/4 h-2 bg-white/30 rounded mb-1"></div>
                  <div className="w-1/2 h-2 bg-white/30 rounded"></div>
                </div>
              </div>
              
              <div className="absolute top-20 right-0 w-24 h-20 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 animate-bounce delay-700">
                <div className="p-3">
                  <div className="w-8 h-8 bg-white/50 rounded-full mb-2"></div>
                  <div className="w-full h-1 bg-white/30 rounded mb-1"></div>
                  <div className="w-2/3 h-1 bg-white/30 rounded"></div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-12 w-28 h-24 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 animate-bounce delay-500">
                <div className="p-3">
                  <div className="flex space-x-1 mb-2">
                    <div className="w-1 h-8 bg-white/50 rounded"></div>
                    <div className="w-1 h-6 bg-white/40 rounded"></div>
                    <div className="w-1 h-10 bg-white/60 rounded"></div>
                    <div className="w-1 h-4 bg-white/30 rounded"></div>
                  </div>
                  <div className="w-full h-1 bg-white/30 rounded"></div>
                </div>
              </div>
              
              <div className="absolute bottom-12 right-8 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 animate-bounce delay-1000">
                <div className="p-2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white/50 rounded-lg"></div>
                </div>
              </div>
              
              {/* Geometric shapes */}
              <div className="absolute -top-8 left-1/2 w-6 h-6 bg-white/30 rounded transform rotate-45 animate-spin-slow"></div>
              <div className="absolute top-1/3 -left-8 w-4 h-4 bg-white/40 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/4 -right-6 w-8 h-8 bg-white/25 rounded transform rotate-12 animate-bounce"></div>
            </div>
          </div>
          
          {/* Background geometric elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-200"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-800"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-white/15 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
      </div>
    </div>;
};
export default UserLogin;