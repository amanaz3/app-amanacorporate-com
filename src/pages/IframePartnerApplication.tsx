import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Building, User, Mail, Phone, Briefcase, FileText } from 'lucide-react';

interface FormData {
  partner_type: 'individual' | 'company' | '';
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  role_at_company: string;
  business_description: string;
}

/**
 * Dedicated iframe-compatible page for the partner application form
 * This page is designed to be embedded in iframes on external domains
 */
export default function IframePartnerApplication() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    partner_type: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    company_name: '',
    role_at_company: '',
    business_description: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePartnerTypeChange = (value: 'individual' | 'company') => {
    setFormData(prev => ({ ...prev, partner_type: value }));
  };

  const sendOtp = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-otp-email', {
        body: { email: formData.email }
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.partner_type || !formData.first_name || !formData.last_name || 
        !formData.email || !formData.phone_number || !otpCode) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and verify your email",
        variant: "destructive"
      });
      return;
    }

    // Additional validation for company applications
    if (formData.partner_type === 'company' && (!formData.company_name || !formData.role_at_company)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all company details",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Verify OTP first
      const { error: otpError } = await supabase.functions.invoke('verify-otp-email', {
        body: { 
          email: formData.email,
          otp: otpCode
        }
      });

      if (otpError) {
        toast({
          title: "Invalid OTP",
          description: "Please check your OTP code and try again",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Submit application
      const { error } = await supabase
        .from('partner_signup_requests')
        .insert([{
          ...formData,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your application. We'll review it and contact you within 2-3 business days.",
      });

      // Reset form or show success state
      setStep(5);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.partner_type) {
      toast({
        title: "Selection Required",
        description: "Please select your partner type",
        variant: "destructive"
      });
      return;
    }
    if (step === 2) {
      if (!formData.first_name || !formData.last_name || !formData.phone_number || !formData.email) {
        toast({
          title: "Required Fields",
          description: "Please fill in all personal details",
          variant: "destructive"
        });
        return;
      }
    }
    if (step === 3 && formData.partner_type === 'company') {
      if (!formData.company_name || !formData.role_at_company) {
        toast({
          title: "Required Fields",
          description: "Please fill in all company details",
          variant: "destructive"
        });
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  if (step === 5) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
            <p className="text-muted-foreground">
              Thank you for applying to become our partner. We'll review your application and 
              contact you within 2-3 business days.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Partner Application
          </h1>
          <p className="text-muted-foreground">
            Join our partner network and grow your business with us
          </p>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full ${
                    s <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && <><Briefcase className="h-5 w-5" />Partner Type</>}
              {step === 2 && <><User className="h-5 w-5" />Personal Details</>}
              {step === 3 && <><Building className="h-5 w-5" />Company Details</>}
              {step === 4 && <><Mail className="h-5 w-5" />Email Verification</>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Partner Type Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <Label>Choose your partner type *</Label>
                  <RadioGroup
                    value={formData.partner_type}
                    onValueChange={handlePartnerTypeChange}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="cursor-pointer flex-1">
                        <div>
                          <div className="font-medium">Individual Partner</div>
                          <div className="text-sm text-muted-foreground">
                            Independent professional or freelancer
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="cursor-pointer flex-1">
                        <div>
                          <div className="font-medium">Company Partner</div>
                          <div className="text-sm text-muted-foreground">
                            Business or organization representative
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="flex justify-end">
                    <Button onClick={nextStep} disabled={!formData.partner_type}>
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {step === 2 && (
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
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        placeholder="+971 50 123 4567"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button onClick={nextStep}>
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Company Details (conditional) */}
              {step === 3 && (
                <div className="space-y-6">
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
                          placeholder="e.g., Business Development Manager"
                          value={formData.role_at_company}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business_description">Business Description (Optional)</Label>
                        <Textarea
                          id="business_description"
                          name="business_description"
                          placeholder="Describe your business and services..."
                          rows={4}
                          value={formData.business_description}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                          Previous
                        </Button>
                        <Button onClick={nextStep}>
                          Next Step
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-6">
                        No additional information needed for individual partners.
                      </p>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                          Previous
                        </Button>
                        <Button onClick={nextStep}>
                          Next Step
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Email Verification */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Verify Your Email</h3>
                    <p className="text-muted-foreground mb-4">
                      We'll send a 6-digit verification code to: <strong>{formData.email}</strong>
                    </p>
                  </div>

                  {!otpSent ? (
                    <Button 
                      onClick={sendOtp} 
                      disabled={isSubmitting} 
                      className="w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Verification Code'}
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter 6-Digit Code *</Label>
                        <Input
                          id="otp"
                          type="text"
                          maxLength={6}
                          placeholder="123456"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="text-center text-lg tracking-wider"
                        />
                      </div>

                      <div className="flex flex-col gap-4">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || otpCode.length !== 6}
                          className="w-full"
                        >
                          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                        </Button>

                        <Button 
                          variant="outline" 
                          onClick={sendOtp} 
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          Resend Code
                        </Button>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                      Previous
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {step === 4 && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• We'll review your application within 2-3 business days</li>
              <li>• You'll receive an email with our decision and next steps</li>
              <li>• Approved partners will get access credentials and onboarding materials</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}