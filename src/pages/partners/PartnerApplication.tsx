import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, UserPlus, Building, Send, Check } from 'lucide-react';
import { validateEmail, validatePhoneNumber, sanitizeInput } from '@/utils/inputValidation';

type PartnerType = 'individual' | 'company';

interface FormData {
  partner_type: PartnerType;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  company_name: string;
  role_at_company: string;
  business_description: string;
  otp_code: string;
}

const PartnerApplication: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    partner_type: 'individual',
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    company_name: '',
    role_at_company: '',
    business_description: '',
    otp_code: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = formData.partner_type === 'company' ? 5 : 4;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.partner_type === 'individual' || formData.partner_type === 'company';
      case 2:
        return formData.first_name.trim() !== '' && 
               formData.last_name.trim() !== '' &&
               formData.phone_number.trim() !== '' &&
               formData.email.trim() !== '' &&
               validateEmail(formData.email) &&
               validatePhoneNumber(formData.phone_number);
      case 3:
        if (formData.partner_type === 'company') {
          return formData.company_name.trim() !== '' && formData.role_at_company.trim() !== '';
        }
        return true;
      case 4:
        return formData.otp_code.length === 6;
      default:
        return true;
    }
  };

  const sendOTP = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email: formData.email,
          first_name: formData.first_name
        }
      });

      if (error) throw error;

      setOtpSent(true);
      setCanResendOtp(false);
      setResendTimer(60);
      
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formData.email}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTPAndSubmit = async () => {
    setIsLoading(true);
    try {
      // First verify OTP
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-otp', {
        body: {
          email: formData.email,
          otp: formData.otp_code
        }
      });

      if (verifyError) throw verifyError;

      // If OTP is valid, submit the application
      const applicationData = {
        partner_type: formData.partner_type,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        email: formData.email,
        company_name: formData.partner_type === 'company' ? formData.company_name : null,
        role_at_company: formData.partner_type === 'company' ? formData.role_at_company : null,
        business_description: formData.business_description || null,
        status: 'pending',
        email_verified: true
      };

      const { error: insertError } = await supabase
        .from('partner_signup_requests')
        .insert([applicationData]);

      if (insertError) throw insertError;

      setCurrentStep(totalSteps + 1); // Success step
      
      toast({
        title: "Application Submitted",
        description: "Your partner application has been submitted successfully. We'll review it and get back to you soon.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === 2 && !otpSent) {
      await sendOTP();
      return;
    }

    if (currentStep === (formData.partner_type === 'company' ? 4 : 3)) {
      await verifyOTPAndSubmit();
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Partner Type</h3>
              <RadioGroup
                value={formData.partner_type}
                onValueChange={(value: PartnerType) => handleInputChange('partner_type', value)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="flex items-center cursor-pointer">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Individual Partner
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="company" id="company" />
                  <Label htmlFor="company" className="flex items-center cursor-pointer">
                    <Building className="h-4 w-4 mr-2" />
                    Company Partner
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="+971 50 123 4567"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 3:
        if (formData.partner_type === 'company') {
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Company Details</h3>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role_at_company">Your Role *</Label>
                <Input
                  id="role_at_company"
                  placeholder="e.g., Business Development Manager"
                  value={formData.role_at_company}
                  onChange={(e) => handleInputChange('role_at_company', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_description">Business Description (Optional)</Label>
                <Textarea
                  id="business_description"
                  placeholder="Describe your business activities and services..."
                  value={formData.business_description}
                  onChange={(e) => handleInputChange('business_description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          );
        }
        // For individual partners, skip to OTP step
        return renderOTPStep();

      case 4:
        return formData.partner_type === 'company' ? renderOTPStep() : null;

      default:
        return null;
    }
  };

  const renderOTPStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Email Verification</h3>
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          We've sent a 6-digit verification code to:
        </p>
        <p className="font-medium">{formData.email}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="otp_code">Verification Code *</Label>
        <Input
          id="otp_code"
          type="text"
          maxLength={6}
          placeholder="000000"
          value={formData.otp_code}
          onChange={(e) => handleInputChange('otp_code', e.target.value.replace(/\D/g, ''))}
          className="text-center text-lg tracking-widest"
          required
        />
      </div>
      {canResendOtp ? (
        <Button
          type="button"
          variant="outline"
          onClick={sendOTP}
          disabled={isLoading}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          Resend OTP
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          Resend OTP in {resendTimer} seconds
        </p>
      )}
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your interest in becoming our partner. Your application has been successfully submitted.
        </p>
      </div>
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">What happens next?</h4>
        <ul className="text-sm text-muted-foreground space-y-1 text-left">
          <li>• Our team will review your application within 2-3 business days</li>
          <li>• We'll contact you via email with the next steps</li>
          <li>• Upon approval, you'll receive login credentials and onboarding materials</li>
        </ul>
      </div>
      <Button onClick={() => navigate('/')} className="w-full">
        Return to Home
      </Button>
    </div>
  );

  const getStepTitle = () => {
    if (currentStep > totalSteps) return 'Success';
    
    const titles = formData.partner_type === 'company' 
      ? ['Partner Type', 'Personal Details', 'Company Details', 'Verification', 'Success']
      : ['Partner Type', 'Personal Details', 'Verification', 'Success'];
    
    return titles[currentStep - 1] || '';
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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Partner Application
              </CardTitle>
              {currentStep <= totalSteps && (
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
              )}
            </div>
            {currentStep <= totalSteps && (
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            {currentStep > totalSteps ? (
              renderSuccessStep()
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-medium mb-6">{getStepTitle()}</h2>
                  {renderStepContent()}
                </div>

                <div className="flex justify-between">
                  {currentStep > 1 && currentStep <= totalSteps && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep <= totalSteps && (
                    <Button
                      onClick={nextStep}
                      disabled={isLoading || !validateCurrentStep()}
                      className="ml-auto"
                    >
                      {isLoading ? (
                        'Processing...'
                      ) : currentStep === 2 && !otpSent ? (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send OTP
                        </>
                      ) : currentStep === (formData.partner_type === 'company' ? 4 : 3) ? (
                        'Submit Application'
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerApplication;