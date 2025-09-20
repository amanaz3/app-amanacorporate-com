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
import { ArrowLeft, ArrowRight, UserPlus, Building, Send, Check, Menu, Phone, Mail, MapPin, Clock } from 'lucide-react';
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

      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formData.email}`,
      });

      // Redirect to dedicated OTP verification page
      navigate(`/partners/verify-otp?email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.first_name)}`);
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
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">Become a Partner</h1>
              <p className="text-muted-foreground text-sm">Join our network of financial partners</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">I am applying as</Label>
              </div>
              
              <RadioGroup
                value={formData.partner_type}
                onValueChange={(value: PartnerType) => handleInputChange('partner_type', value)}
                className="grid gap-2 space-y-3"
              >
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="individual" id="individual" className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <UserPlus className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="individual" className="cursor-pointer font-medium text-sm">
                        Individual
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Independent professional or freelancer</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="company" id="company" className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="company" className="cursor-pointer font-medium text-sm">
                        Company
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Business or organization representative</p>
                  </div>
                </div>
              </RadioGroup>
              
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your information is secure and will only be used for partner onboarding.
                </p>
              </div>
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
    <div className="animate-slide-up-slow">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border-b border-border/50 transition-all duration-300 shadow-sm">
          <header className="max-w-7xl mx-auto px-4 xs:px-6 py-3 xs:py-4 pl-safe-left pr-safe-right">
            <div className="flex items-center justify-between min-h-[44px]">
              <a className="flex items-center gap-3 transition-opacity hover:opacity-80 cursor-pointer" aria-label="Go to home page" href="/">
                <div className="h-10 w-10 flex items-center justify-center">
                  <img src="https://amanacorporate.com/uploads/company-logos/amana-corporate.png" alt="Amana Corporate Logo" className="h-full w-full object-contain" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  AMANA <span className="text-muted-foreground">CORPORATE</span>
                </span>
              </a>

              <nav className="hidden md:flex items-center" role="navigation" aria-label="Main navigation">
                <div role="group" dir="ltr" className="flex items-center justify-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/30 cosmic-glass" tabIndex={0} style={{
                  outline: 'none'
                }}>
                  <a href="https://amanacorporate.com/" target="_self" type="button" data-state="off" role="radio" aria-checked="false" className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent h-10 nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" aria-label="Navigate to Home" tabIndex={-1}>
                    Home
                  </a>
                  <a href="https://amanacorporate.com/partners" type="button" data-state="on" role="radio" aria-checked="true" className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent h-10 nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" aria-label="Navigate to Business Partners" tabIndex={-1}>
                    Business Partners
                  </a>
                  <a href="https://amanacorporate.com/contact" type="button" data-state="off" role="radio" aria-checked="false" className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent h-10 nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" aria-label="Navigate to Contact" tabIndex={-1}>
                    Contact
                  </a>
                </div>
              </nav>

              <div className="md:hidden">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target hover:text-accent-foreground h-9 text-xs p-2 min-h-[44px] min-w-[44px] touch-manipulation hover:bg-muted/80 hover:shadow-glow focus-visible:ring-2 focus-visible:ring-primary rounded-lg" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open mobile menu">
                  <Menu className="h-5 w-5" />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target bg-primary text-primary-foreground hover:bg-primary/90 interactive-hover-scale shadow-md hover:shadow-lg h-10 py-2 text-sm custom-gradient-button min-h-[40px] px-4 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary" aria-label="Login to business banking portal">
                  Login
                </button>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target bg-gradient-primary text-primary-foreground shadow-md h-9 rounded-md text-xs min-h-[40px] px-6 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 shadow-glow hover:shadow-xl hover:scale-105 font-semibold" aria-label="Open a business account">
                  Open Account
                </button>
              </div>
            </div>
          </header>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
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
                          className="ml-auto h-12 px-8 text-base min-h-[48px] w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
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
                            'Continue'
                          )}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="w-full bg-muted/30 border-t border-border/50">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <a className="flex items-center gap-3 transition-opacity hover:opacity-80 cursor-pointer" aria-label="Go to home page" href="/">
                    <div className="h-10 w-10 flex items-center justify-center">
                      <img src="https://amanacorporate.com/uploads/company-logos/amana-corporate.png" alt="Amana Corporate Logo" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      AMANA <span className="text-muted-foreground">CORPORATE</span>
                    </span>
                  </a>
                  <p className="text-muted-foreground text-sm mt-4 leading-relaxed max-w-md">
                    UAE business banking specialists providing 100% guaranteed company formation and corporate bank account opening services across Dubai, Abu Dhabi, and the UAE.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <a href="tel:+97142637666" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <span>+971 4 263 7666</span>
                    </a>
                    <a href="mailto:info@amanacorporate.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <span>info@amanacorporate.com</span>
                    </a>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span>Wafi Residence Office Block - LHEU, Umm Hurair 2, Al Razi Street Dubai Healthcare City, Dubai, UAE</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                <nav className="space-y-4">
                  <h4 className="font-semibold text-foreground text-sm">Services</h4>
                  <ul className="space-y-3">
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/apply">Business Banking</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/about">Bank Services</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/track">Track Application</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/start-business-bank-account-uae">UAE Banking</a></li>
                  </ul>
                </nav>
                
                <nav className="space-y-4">
                  <h4 className="font-semibold text-foreground text-sm">Company</h4>
                  <ul className="space-y-3">
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/about">About Us</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/contact">Contact</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/faq">FAQ</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/partners">Partners</a></li>
                  </ul>
                </nav>
                
                <nav className="space-y-4">
                  <h4 className="font-semibold text-foreground text-sm">Legal & Compliance</h4>
                  <ul className="space-y-3">
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/privacy">Privacy Policy</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/terms">Terms of Service</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/cookies">Cookie Policy</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/compliance">Compliance</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/disclaimer">Disclaimer</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/aml-policy">AML Policy</a></li>
                  </ul>
                </nav>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h4 className="font-semibold text-foreground text-sm mb-2">Follow Us</h4>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <a href="https://ae.linkedin.com/company/amanacorporate" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all duration-200" aria-label="LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <a href="https://x.com/CorporateAmana" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all duration-200" aria-label="Twitter">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497 -3.753C20.18 7.773 21.692 5.25 22 4.01z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <a href="https://www.facebook.com/AMANACorporateService" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all duration-200" aria-label="Facebook">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/amanacorporate/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all duration-200" aria-label="Instagram">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        <path d="m16.5 7.5h.01" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="text-center md:text-right">
                  <h4 className="font-semibold text-foreground text-sm mb-2">Business Hours</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2 justify-center md:justify-end">
                      <Clock className="h-3 w-3" />
                      <span>Mon - Sat: 9:00 AM - 5:00 PM (UAE Time)</span>
                    </div>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  © 2025 <strong>AMANA CORPORATE SERVICES L.L.C.</strong> All rights reserved. | Licensed Corporate Services Provider in UAE
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PartnerApplication;