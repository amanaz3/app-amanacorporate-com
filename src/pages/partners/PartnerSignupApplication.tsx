import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, ChevronRight, ChevronLeft, Mail } from 'lucide-react';

const PartnerSignupApplication: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    partner_type: 'individual',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    company_name: '',
    role_at_company: '',
    business_description: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePartnerTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, partner_type: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return true; // Partner type is always selected
      case 2:
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone_number) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required personal details",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 3:
        if (formData.partner_type === 'company' && (!formData.company_name || !formData.role_at_company)) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required company details",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('partner_signup_requests')
        .insert([formData]);

      if (error) throw error;

      // Send OTP email
      const { error: otpError } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email: formData.email,
          first_name: formData.first_name
        }
      });

      if (otpError) {
        console.error('OTP sending error:', otpError);
        toast({
          title: "Application Submitted",
          description: "Your application was submitted but we couldn't send the verification email. Please contact support.",
          variant: "destructive"
        });
      } else {
        setOtpSent(true);
        nextStep(); // Move to verification step
        toast({
          title: "Application Submitted",
          description: "Please check your email for the verification code.",
        });
      }
    } catch (error) {
      console.error('Error submitting partner application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { error } = await supabase.functions.invoke('verify-otp', {
        body: {
          email: formData.email,
          otp: otpCode
        }
      });

      if (error) throw error;

      toast({
        title: "Email Verified!",
        description: "Your email has been verified successfully. Our team will review your application.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Partner Type</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select whether you're applying as an individual or on behalf of a company.
              </p>
            </div>
            
            <RadioGroup value={formData.partner_type} onValueChange={handlePartnerTypeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual Partner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company">Company Partner</Label>
              </div>
            </RadioGroup>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Provide your personal information for identification and communication.
              </p>
            </div>
            
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+971 XX XXX XXXX"
                required
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {formData.partner_type === 'company' ? 'Company Details' : 'Additional Information'}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {formData.partner_type === 'company' 
                  ? 'Provide information about your company.'
                  : 'Optional additional details about your business.'
                }
              </p>
            </div>
            
            {formData.partner_type === 'company' ? (
              <>
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
                    placeholder="e.g., CEO, Business Development Manager"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_description">Business Description</Label>
                  <Textarea
                    id="business_description"
                    name="business_description"
                    value={formData.business_description}
                    onChange={handleInputChange}
                    placeholder="Brief description of your business (optional)"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="business_description">Business Description</Label>
                <Textarea
                  id="business_description"
                  name="business_description"
                  value={formData.business_description}
                  onChange={handleInputChange}
                  placeholder="Brief description of your business or services (optional)"
                  rows={3}
                />
              </div>
            )}
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Email Verification</h3>
              <p className="text-sm text-muted-foreground mb-6">
                We've sent a 6-digit verification code to <strong>{formData.email}</strong>. 
                Please enter the code below to verify your email address.
              </p>
            </div>
            
            <form onSubmit={handleOtpVerification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp_code">Verification Code *</Label>
                <Input
                  id="otp_code"
                  name="otp_code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Next Steps</h4>
              <p className="text-sm text-muted-foreground">
                After email verification, our team will review your partner application and contact you 
                within 2-3 business days with approval status and access credentials.
              </p>
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
              <UserPlus className="h-5 w-5" />
              Partner Application
            </CardTitle>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {currentStep} of 4</span>
                <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentStep < 4 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderStep()}
                
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit & Send Verification'}
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            ) : (
              renderStep()
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerSignupApplication;