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
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Clean login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-[hsl(260_100%_70%)] rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-[hsl(var(--text-heading))] font-bold text-2xl">mana</span>
          </div>
          
          {/* Welcome section */}
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold text-[hsl(var(--text-heading))] leading-tight">
              Welcome back
            </h1>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed">
              Sign in to your account to continue
            </p>
          </div>

          {/* Sign in form */}
          <div className="space-y-6">
            <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
            
            <div className="text-center">
              <button className="text-primary hover:text-[hsl(260_100%_70%)] hover:underline text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-md px-2 py-1">
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Futuristic isometric illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background with mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(213_94%_68%)] via-[hsl(260_85%_65%)] to-[hsl(320_90%_70%)]"></div>
        <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)' }}></div>
        
        {/* Content container */}
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="relative w-full h-full max-w-2xl max-h-2xl">
            
            {/* Central device mockup */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="illustration-float bg-white/10 backdrop-blur-sm border border-white/20 w-80 h-[28rem] rounded-3xl shadow-2xl p-6 rotate-12 hover:rotate-6 transition-all duration-700">
                <div className="w-full h-full bg-gradient-to-b from-white/5 to-white/10 rounded-2xl overflow-hidden">
                  <img 
                    src="/lovable-uploads/dc4fd816-6d47-4c2f-bec2-1de9b296c0b8.png" 
                    alt="Amana Platform Interface"
                    className="w-full h-full object-cover rounded-2xl opacity-90"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating isometric UI cards */}
            <div className="absolute top-16 left-16 bg-white/10 backdrop-blur-sm border border-white/20 w-28 h-24 rounded-2xl p-4 animate-bounce delay-300 shadow-xl">
              <div className="space-y-2">
                <div className="w-full h-2 bg-white/60 rounded-full"></div>
                <div className="w-4/5 h-2 bg-white/40 rounded-full"></div>
                <div className="w-3/5 h-2 bg-white/30 rounded-full"></div>
              </div>
            </div>
            
            <div className="absolute top-24 right-12 bg-white/10 backdrop-blur-sm border border-white/20 w-32 h-28 rounded-2xl p-4 animate-bounce delay-700 shadow-xl">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-white/50 to-white/30 rounded-full"></div>
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-white/40 rounded-full"></div>
                  <div className="w-3/4 h-1.5 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-20 left-8 bg-white/10 backdrop-blur-sm border border-white/20 w-36 h-32 rounded-2xl p-5 animate-bounce delay-500 shadow-xl">
              <div className="flex items-end space-x-1 mb-3 justify-center h-16">
                <div className="w-2 h-12 bg-gradient-to-t from-white/60 to-white/40 rounded-full"></div>
                <div className="w-2 h-8 bg-gradient-to-t from-white/50 to-white/30 rounded-full"></div>
                <div className="w-2 h-16 bg-gradient-to-t from-white/70 to-white/50 rounded-full"></div>
                <div className="w-2 h-6 bg-gradient-to-t from-white/40 to-white/20 rounded-full"></div>
                <div className="w-2 h-10 bg-gradient-to-t from-white/55 to-white/35 rounded-full"></div>
              </div>
              <div className="w-full h-1 bg-white/30 rounded-full"></div>
            </div>
            
            <div className="absolute bottom-32 right-16 bg-white/10 backdrop-blur-sm border border-white/20 w-24 h-24 rounded-3xl p-3 animate-bounce delay-1000 shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-white/40 to-white/20 rounded-2xl flex items-center justify-center">
                <div className="w-10 h-10 bg-white/60 rounded-xl shadow-inner"></div>
              </div>
            </div>
            
            {/* Geometric accent elements */}
            <div className="absolute top-32 left-1/3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl rotate-45 animate-spin-slow border border-white/30 shadow-lg"></div>
            <div className="absolute bottom-40 right-1/4 w-8 h-8 bg-white/25 backdrop-blur-sm rounded-full animate-pulse border border-white/40 shadow-lg"></div>
            <div className="absolute top-3/5 left-1/5 w-12 h-12 bg-white/15 backdrop-blur-sm rounded-3xl rotate-12 animate-bounce border border-white/25 shadow-lg"></div>
            
            {/* Ambient light orbs */}
            <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-200"></div>
            <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-white/3 rounded-full blur-3xl animate-pulse delay-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserLogin;