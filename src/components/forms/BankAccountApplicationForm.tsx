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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sanitizeInput, validateEmail, validatePhoneNumber, validateCompanyName } from '@/utils/inputValidation';

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
  { value: 'mainland', label: 'Mainland' },
  { value: 'freezone', label: 'Freezone' },
  { value: 'offshore', label: 'Offshore' }
];

const BankAccountApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const additionalNotes = watch('additionalNotes') || '';

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

    try {
      // Here you would normally send the data to your backend
      console.log('Form submitted:', sanitizedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success handling
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
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
                          <SelectItem key={jurisdiction} value={jurisdiction.toLowerCase()}>
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
                            <SelectItem key={bank} value={bank.toLowerCase().replace(/\s+/g, '-')}>
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
                            <SelectItem key={bank} value={bank.toLowerCase().replace(/\s+/g, '-')}>
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
                            <SelectItem key={bank} value={bank.toLowerCase().replace(/\s+/g, '-')}>
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
    </div>
  );
};

export default BankAccountApplicationForm;