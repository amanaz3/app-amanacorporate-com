import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Building, User, Mail, Shield, CheckCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { validateEmail, validatePhoneNumber, sanitizeInput } from '@/utils/inputValidation';

interface FormData {
  partner_type: 'individual' | 'company';
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  role_at_company: string;
  business_description: string;
  otp_code: string;
}

const PartnerSignupApplication: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    partner_type: 'individual',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    company_name: '',
    role_at_company: '',
    business_description: '',
    otp_code: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: sanitizeInput(value) }));
  };

  const handleRadioChange = (value: 'individual' | 'company') => {
    setFormData(prev => ({ ...prev, partner_type: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Partner Type Selection
        return !!formData.partner_type;
      case 2: // Personal Details
        return !!(formData.first_name && formData.last_name && formData.email && formData.phone_number) &&
               validateEmail(formData.email) && validatePhoneNumber(formData.phone_number);
      case 3: // Company Details (only for companies)
        if (formData.partner_type === 'company') {
          return !!(formData.company_name && formData.role_at_company);
        }
        return true;
      case 4: // OTP Verification
        return formData.otp_code.length === 6;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 && formData.partner_type === 'individual') {
        setCurrentStep(4); // Skip company details for individuals
      } else if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
      
      // Send OTP when reaching verification step
      if ((currentStep === 2 && formData.partner_type === 'individual') || 
          (currentStep === 3 && formData.partner_type === 'company')) {
        sendOTP();
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      if (currentStep === 4 && formData.partner_type === 'individual') {
        setCurrentStep(2); // Skip company details for individuals going back
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const sendOTP = async () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      // Save OTP to database first
      const { error: dbError } = await supabase
        .from('partner_signup_requests')
        .upsert({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          partner_type: formData.partner_type,
          company_name: formData.company_name || null,
          role_at_company: formData.role_at_company || null,
          business_description: formData.business_description || null,
          otp_code: otpCode,
          otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          email_verified: false,
          status: 'pending'
        }, { onConflict: 'email' });

      if (dbError) throw dbError;

      // Send OTP email
      const { error: emailError } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email: formData.email,
          otp_code: otpCode,
          first_name: formData.first_name
        }
      });

      if (emailError) throw emailError;

      setOtpSent(true);
      setCurrentStep(4);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });

      // Start resend cooldown
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const verifyOTP = async () => {
    if (!formData.otp_code || formData.otp_code.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifyingOTP(true);

    try {
      // Verify OTP and update record
      const { data, error } = await supabase
        .from('partner_signup_requests')
        .update({ 
          email_verified: true,
          company_name: formData.company_name || null,
          role_at_company: formData.role_at_company || null,
          business_description: formData.business_description || null
        })
        .eq('email', formData.email)
        .eq('otp_code', formData.otp_code)
        .gt('otp_expires_at', new Date().toISOString())
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "Invalid OTP",
          description: "The verification code is incorrect or has expired. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Application Submitted Successfully!",
        description: "Your partner application has been submitted. We'll review it and get back to you within 2-3 business days.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify your email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User className="h-5 w-5" />;
      case 2: return <UserPlus className="h-5 w-5" />;
      case 3: return <Building className="h-5 w-5" />;
      case 4: return <Mail className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Partner Type";
      case 2: return "Personal Details";
      case 3: return "Company Details";
      case 4: return "Email Verification";
      default: return "Partner Application";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Partner Type *</Label>
              <RadioGroup value={formData.partner_type} onValueChange={handleRadioChange}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="individual" id="individual" />
                  <div className="flex-1">
                    <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Individual Partner</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Independent professional or freelancer
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="company" id="company" />
                  <div className="flex-1">
                    <Label htmlFor="company" className="flex items-center gap-2 cursor-pointer">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">Company Partner</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Business or organization representative
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@company.com"
                required
              />
              <p className="text-sm text-muted-foreground">
                We'll send a verification code to this email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+971 50 123 4567"
                required
              />
            </div>
          </div>
        );

      case 3:
        return formData.partner_type === 'company' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_at_company">Your Role at Company *</Label>
              <Input
                id="role_at_company"
                name="role_at_company"
                value={formData.role_at_company}
                onChange={handleInputChange}
                placeholder="e.g., Business Development Manager"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_description">Business Description (Optional)</Label>
              <Textarea
                id="business_description"
                name="business_description"
                value={formData.business_description}
                onChange={handleInputChange}
                placeholder="Briefly describe your business and services..."
                rows={4}
              />
            </div>
          </div>
        ) : null;

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Check Your Email</h3>
                <p className="text-muted-foreground">
                  We've sent a 6-digit verification code to<br />
                  <span className="font-medium">{formData.email}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp_code">Verification Code *</Label>
              <Input
                id="otp_code"
                name="otp_code"
                value={formData.otp_code}
                onChange={handleInputChange}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={sendOTP}
                disabled={resendCooldown > 0}
                className="text-sm"
              >
                {resendCooldown > 0 
                  ? `Resend code in ${resendCooldown}s` 
                  : "Resend verification code"
                }
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStepIcon(currentStep)}
              {getStepTitle(currentStep)}
            </CardTitle>
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full ${
                    step <= currentStep ? 'bg-primary' : 'bg-muted'
                  } ${
                    step === 3 && formData.partner_type === 'individual' ? 'hidden' : ''
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of {formData.partner_type === 'individual' ? 3 : 4}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {renderStepContent()}

              <div className="flex gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1"
                    disabled={!validateStep(currentStep)}
                  >
                    {currentStep === 2 && formData.partner_type === 'individual' ? 'Send Verification Code' :
                     currentStep === 3 && formData.partner_type === 'company' ? 'Send Verification Code' :
                     'Next'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={verifyOTP}
                    className="flex-1"
                    disabled={isVerifyingOTP || !validateStep(4)}
                  >
                    {isVerifyingOTP ? 'Verifying...' : 'Complete Application'}
                  </Button>
                )}
              </div>

              {currentStep === 4 && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm">Almost Done!</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        After verification, we'll review your application and contact you within 2-3 business days with next steps.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerSignupApplication;