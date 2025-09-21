import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { sanitizeInput, validateEmail, validatePhoneNumber, validateCompanyName } from '@/utils/inputValidation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  // Step 1: Basic Information
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name cannot exceed 100 characters'),
  email: z.string().email('Invalid email format').max(254, 'Email cannot exceed 254 characters'),
  mobile: z.string().min(1, 'Mobile number is required').max(20, 'Mobile number cannot exceed 20 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name cannot exceed 100 characters'),
  
  // Step 2: Business Details
  licenseType: z.string().min(1, 'License type is required'),
  jurisdiction: z.string().optional(),
  
  // Step 3: Banking Preferences
  anySuitableBank: z.boolean().default(false),
  firstPreferenceBank: z.string().optional(),
  secondPreferenceBank: z.string().optional(),
  thirdPreferenceBank: z.string().optional(),
  
  // Step 4: Additional Information
  additionalNotes: z.string().max(500, 'Additional notes cannot exceed 500 characters').optional(),
});

type FormData = z.infer<typeof formSchema>;

const banks = [
  'Emirates NBD',
  'ADCB',
  'FAB',
  'ENBD Islamic',
  'Dubai Islamic Bank',
  'Mashreq Bank',
  'CBD',
  'RAK Bank',
  'HSBC',
  'Standard Chartered',
  'Citibank',
  'Other'
];

const jurisdictions = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
  'Other'
];

const licenseTypes = [
  { value: 'Mainland', label: 'Mainland' },
  { value: 'Freezone', label: 'Freezone' },
  { value: 'Offshore', label: 'Offshore' }
];

const BankAccountApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      company: '',
      licenseType: '',
      jurisdiction: '',
      anySuitableBank: false,
      firstPreferenceBank: '',
      secondPreferenceBank: '',
      thirdPreferenceBank: '',
      additionalNotes: '',
    },
  });

  const { watch, trigger, getValues } = form;
  const anySuitableBank = watch('anySuitableBank');
  const additionalNotes = String(watch('additionalNotes') || '');

  const validateStep = async (step: number) => {
    switch (step) {
      case 1:
        return await trigger(['fullName', 'email', 'mobile', 'company']);
      case 2:
        return await trigger(['licenseType']);
      case 3:
      case 4:
        return true; // No mandatory fields
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        ...data,
        fullName: sanitizeInput(data.fullName),
        email: data.email.toLowerCase(),
        company: sanitizeInput(data.company),
        additionalNotes: data.additionalNotes ? sanitizeInput(data.additionalNotes) : '',
      };

      // Additional validation
      if (!validateEmail(sanitizedData.email)) {
        form.setError('email', { message: 'Invalid email format' });
        setIsSubmitting(false);
        return;
      }

      if (!validatePhoneNumber(sanitizedData.mobile)) {
        form.setError('mobile', { message: 'Invalid phone number format' });
        setIsSubmitting(false);
        return;
      }

      if (!validateCompanyName(sanitizedData.company)) {
        form.setError('company', { message: 'Invalid company name' });
        setIsSubmitting(false);
        return;
      }

      // Get current user (optional for anonymous submissions)
      const { data: { user } } = await supabase.auth.getUser();

      console.log('📋 Form submission data:', {
        formData: sanitizedData,
        userAuthenticated: !!user,
        userId: user?.id
      });

      // Create customer record (works for both authenticated or anonymous users)
      const customerData = {
        name: sanitizedData.fullName,
        email: sanitizedData.email,
        mobile: sanitizedData.mobile,
        company: sanitizedData.company,
        license_type: sanitizedData.licenseType as 'Mainland' | 'Freezone' | 'Offshore',
        jurisdiction: sanitizedData.jurisdiction || null,
        preferred_bank: sanitizedData.firstPreferenceBank || null,
        preferred_bank_2: sanitizedData.secondPreferenceBank || null,
        preferred_bank_3: sanitizedData.thirdPreferenceBank || null,
        any_suitable_bank: sanitizedData.anySuitableBank,
        customer_notes: sanitizedData.additionalNotes || null,
        user_id: user?.id || null, // Allow null for anonymous submissions
        status: 'Draft' as const,
        lead_source: 'Website' as const,
        amount: 0, // Default amount, can be updated later
      };

      // Create customer record using security definer function to bypass RLS issues
      const { data: customerId, error: customerError } = await supabase.rpc('create_anonymous_customer', {
        customer_name: sanitizedData.fullName,
        customer_email: sanitizedData.email,
        customer_mobile: sanitizedData.mobile,
        customer_company: sanitizedData.company,
        customer_license_type: sanitizedData.licenseType,
        customer_jurisdiction: sanitizedData.jurisdiction || null,
        customer_preferred_bank: sanitizedData.firstPreferenceBank || null,
        customer_preferred_bank_2: sanitizedData.secondPreferenceBank || null,
        customer_preferred_bank_3: sanitizedData.thirdPreferenceBank || null,
        customer_any_suitable_bank: sanitizedData.anySuitableBank,
        customer_notes: sanitizedData.additionalNotes || null,
      });

      if (customerError || !customerId) {
        console.error('❌ Customer creation error:', customerError);
        toast({
          title: "Submission Error",
          description: "There was an error creating your customer record. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Customer created successfully with ID:', customerId);

      // Create application record
      const applicationData = {
        banking_preferences: {
          any_suitable_bank: sanitizedData.anySuitableBank,
          first_preference: sanitizedData.firstPreferenceBank || null,
          second_preference: sanitizedData.secondPreferenceBank || null,
          third_preference: sanitizedData.thirdPreferenceBank || null,
        },
        form_data: sanitizedData,
        submission_timestamp: new Date().toISOString(),
        complete_form_fields: {
          fullName: sanitizedData.fullName,
          email: sanitizedData.email,
          mobile: sanitizedData.mobile,
          company: sanitizedData.company,
          licenseType: sanitizedData.licenseType,
          jurisdiction: sanitizedData.jurisdiction,
          anySuitableBank: sanitizedData.anySuitableBank,
          firstPreferenceBank: sanitizedData.firstPreferenceBank,
          secondPreferenceBank: sanitizedData.secondPreferenceBank,
          thirdPreferenceBank: sanitizedData.thirdPreferenceBank,
          additionalNotes: sanitizedData.additionalNotes,
        }
      };

      console.log('📄 Application data to insert:', applicationData);

      const { error: applicationError } = await supabase
        .from('account_applications')
        .insert({
          customer_id: customerId,
          application_data: applicationData,
          status: 'submitted',
          application_type: 'bank_account',
          submission_source: 'web_form',
        });

      if (applicationError) {
        console.error('❌ Application creation error:', applicationError);
        toast({
          title: "Submission Error",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Application created successfully');

      // Send confirmation email
      try {
        console.log('📧 Sending confirmation email to:', sanitizedData.email);
        
        const emailResult = await supabase.functions.invoke('send-application-confirmation', {
          body: {
            customerName: sanitizedData.fullName,
            customerEmail: sanitizedData.email,
            companyName: sanitizedData.company,
            applicationId: customerId,
          },
        });
        
        console.log('✅ Confirmation email sent successfully:', emailResult);
      } catch (emailError) {
        console.error('❌ Failed to send confirmation email:', emailError);
        // Don't fail the whole submission if email fails
      }

      // Success - show thank you dialog
      setShowThankYou(true);
      
      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your application. A confirmation email has been sent to your email address.",
        variant: "default",
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Provide your personal and contact details for identification and communication.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+971 XX XXX XXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      UAE format (+971XXXXXXXXX)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your company name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Exact registered company name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Business Details</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Provide company-specific information for eligibility assessment.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="licenseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {licenseTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select jurisdiction (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jurisdictions.map((jurisdiction) => (
                          <SelectItem key={jurisdiction} value={jurisdiction}>
                            {jurisdiction}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Country or Free Zone authority
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Banking Preferences</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select your preferred banks to expedite processing.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="anySuitableBank"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Any Suitable Bank
                    </FormLabel>
                    <FormDescription>
                      Check this if you're open to any bank recommendation
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {!anySuitableBank && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="firstPreferenceBank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Preference</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="secondPreferenceBank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Second Preference</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thirdPreferenceBank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Third Preference</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Optional field for special requests and clarifications.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional information or special requests..."
                      className="resize-none"
                      rows={6}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    {additionalNotes.length}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm cosmic-glass">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Business Bank Account Application</h3>
        <p className="text-sm text-muted-foreground">
          Complete the form below to apply for your business bank account
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="w-full" />
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && currentStep < 4) {
                e.preventDefault();
                nextStep();
              }
            }}
          >
            {renderStep()}
            
            <div className="flex justify-between mt-8">
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
              
              {currentStep < 4 ? (
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
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      
      {/* Thank You Dialog */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">
              Application Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-center">
              Thank you for submitting your bank account application. Our team will review your 
              application and contact you within 2-3 business days with the next steps.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowThankYou(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankAccountApplicationForm;