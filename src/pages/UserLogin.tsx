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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-600/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/30 to-red-600/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Left side - Glass morphic login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Glass card container */}
          <div className="glass-card rounded-3xl p-8 space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-3 border border-white/20">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <span className="text-white font-bold text-2xl">mana</span>
            </div>
            
            {/* Welcome text */}
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-bold text-white">
                Welcome Back
              </h1>
              <p className="text-lg text-white/80">
                Sign into your account
              </p>
            </div>

            {/* Sign in form */}
            <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
            
            <div className="text-center">
              <button className="text-white/90 hover:text-white hover:underline text-sm font-medium transition-colors">
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Floating glass elements */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative z-10">
        <div className="relative w-full h-full max-w-2xl max-h-2xl">
          {/* Central glass device mockup */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="glass-card w-72 h-96 rounded-3xl p-6 rotate-12 hover:rotate-6 transition-transform duration-500">
              <img 
                src="/lovable-uploads/dc4fd816-6d47-4c2f-bec2-1de9b296c0b8.png" 
                alt="Amana Mobile App"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
          
          {/* Floating glass UI elements */}
          <div className="absolute top-8 left-8 glass-card w-24 h-20 rounded-2xl p-3 animate-bounce delay-300">
            <div className="space-y-2">
              <div className="w-full h-2 bg-white/40 rounded-full"></div>
              <div className="w-3/4 h-2 bg-white/30 rounded-full"></div>
              <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute top-20 right-8 glass-card w-28 h-24 rounded-2xl p-4 animate-bounce delay-700">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-white/40 rounded-full"></div>
              <div className="w-full h-1 bg-white/30 rounded-full"></div>
              <div className="w-2/3 h-1 bg-white/20 rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-12 glass-card w-32 h-28 rounded-2xl p-4 animate-bounce delay-500">
            <div className="flex space-x-1 mb-3 justify-center">
              <div className="w-1 h-10 bg-white/50 rounded-full"></div>
              <div className="w-1 h-8 bg-white/40 rounded-full"></div>
              <div className="w-1 h-12 bg-white/60 rounded-full"></div>
              <div className="w-1 h-6 bg-white/30 rounded-full"></div>
            </div>
            <div className="w-full h-1 bg-white/30 rounded-full"></div>
          </div>
          
          <div className="absolute bottom-16 right-12 glass-card w-20 h-20 rounded-3xl p-3 animate-bounce delay-1000">
            <div className="w-full h-full bg-white/30 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white/50 rounded-lg"></div>
            </div>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg rotate-45 animate-spin-slow border border-white/30"></div>
          <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-white/25 backdrop-blur-sm rounded-full animate-pulse border border-white/40"></div>
          <div className="absolute top-2/3 left-1/4 w-10 h-10 bg-white/15 backdrop-blur-sm rounded-2xl rotate-12 animate-bounce border border-white/25"></div>
        </div>
      </div>
    </div>
  );
};
export default UserLogin;