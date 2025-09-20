import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Shield, Send, Check, AlertCircle } from 'lucide-react';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const firstName = searchParams.get('name') || '';
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (!email) {
      toast({
        title: "Missing Information",
        description: "Email address is required for verification",
        variant: "destructive"
      });
      navigate('/partners/apply');
    }
  }, [email, navigate, toast]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste operation
      const digits = value.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6 && /^\d$/.test(digit)) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(index + digits.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  const verifyOTP = async () => {
    if (!isOtpComplete) {
      toast({
        title: "Incomplete Code",
        description: "Please enter all 6 digits",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const otpCode = otp.join('');
      const { error } = await supabase.functions.invoke('verify-otp', {
        body: {
          email,
          otp: otpCode
        }
      });

      if (error) throw error;

      setIsVerified(true);
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
      });

      // Redirect after a short delay to show success state
      setTimeout(() => {
        navigate('/partners/apply?verified=true');
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive"
      });
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email,
          first_name: firstName
        }
      });

      if (error) throw error;

      setCanResend(false);
      setResendTimer(60);
      
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Code Resent",
        description: `New verification code sent to ${email}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">Email Verified!</h2>
                <p className="text-muted-foreground">
                  Your email has been successfully verified. You'll be redirected shortly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/partners/apply')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Application
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Verify Your Email</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              We've sent a 6-digit verification code to:
            </p>
            <p className="font-medium text-foreground">{email}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Enter verification code</Label>
              
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={6} // Allow paste
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-mono border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={verifyOTP}
                disabled={!isOtpComplete || isLoading}
                className="w-full h-12"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Code
                  </>
                )}
              </Button>

              <div className="text-center">
                {canResend ? (
                  <Button
                    variant="ghost"
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Resend Code
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Resend code in {resendTimer} seconds
                  </p>
                )}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Didn't receive the code?</p>
                  <ul className="space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Make sure {email} is correct</li>
                    <li>• Wait a few minutes for delivery</li>
                    <li>• Click "Resend Code" if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerification;