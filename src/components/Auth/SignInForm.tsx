
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useToast } from '@/hooks/use-toast';
import { rateLimiter, validateAndSanitizeInput } from '@/utils/enhancedInputValidation';
import { securityLogger } from '@/utils/securityLogger';

interface SignInFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ isLoading, setIsLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    // Input validation and sanitization
    const emailValidation = validateAndSanitizeInput(email, 'email');
    if (!emailValidation.isValid) {
      toast({
        title: 'Error',
        description: emailValidation.errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    // Rate limiting check
    const rateLimitKey = `login_${emailValidation.sanitized}`;
    if (!rateLimiter.canAttempt(rateLimitKey)) {
      toast({
        title: 'Error',
        description: 'Too many login attempts. Please try again later.',
        variant: 'destructive',
      });
      await securityLogger.logSuspiciousActivity('rate_limit_exceeded', undefined, {
        email: emailValidation.sanitized,
        type: 'login'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signIn(emailValidation.sanitized, password);
      
      if (error) {
        await securityLogger.logLoginAttempt(emailValidation.sanitized, false);
        toast({
          title: 'Sign In Failed',
          description: error.message || 'Invalid email or password',
          variant: 'destructive',
        });
      } else {
        await securityLogger.logLoginAttempt(emailValidation.sanitized, true);
        // Reset rate limit on successful login
        rateLimiter.reset(rateLimitKey);
        
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in successfully.',
        });
        // Navigation will be handled by the auth state change
      }
    } catch (error) {
      await securityLogger.logLoginAttempt(emailValidation.sanitized, false);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-6">
      <div className="space-y-2">
        <Label 
          htmlFor="signin-email" 
          className="text-sm font-semibold text-[hsl(var(--text-heading))] block"
        >
          Email or Phone
        </Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Enter your email or phone number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="input-modern h-14 text-base placeholder:text-[hsl(var(--text-muted))] rounded-xl"
          aria-describedby="email-help"
        />
      </div>
      
      <div className="space-y-2">
        <Label 
          htmlFor="signin-password" 
          className="text-sm font-semibold text-[hsl(var(--text-heading))] block"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="input-modern h-14 text-base placeholder:text-[hsl(var(--text-muted))] pr-12 rounded-xl"
            aria-describedby="password-help"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-gray-50 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-heading))] rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="btn-primary w-full h-14 text-base font-semibold rounded-xl mt-8 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={isLoading}
        aria-describedby="signin-status"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
            Signing you in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
      
      <div id="signin-status" className="sr-only" aria-live="polite">
        {isLoading ? 'Signing in, please wait...' : ''}
      </div>
    </form>
  );
};

export default SignInForm;
