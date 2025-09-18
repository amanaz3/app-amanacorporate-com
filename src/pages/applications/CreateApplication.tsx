import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, Trash2, User, FileText, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ApplicationOwner {
  name: string;
  nationality: string;
  passport_number: string;
  ownership_percentage: number;
}

interface ApplicationData {
  business_type: string;
  company_name: string;
  business_activity: string;
  capital_amount: number;
  license_jurisdiction: string;
  expected_timeline: string;
  additional_services: string[];
  special_requirements: string;
}

const CreateApplication = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const [owners, setOwners] = useState<ApplicationOwner[]>([
    { name: '', nationality: '', passport_number: '', ownership_percentage: 0 }
  ]);
  
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    business_type: '',
    company_name: '',
    business_activity: '',
    capital_amount: 0,
    license_jurisdiction: '',
    expected_timeline: '',
    additional_services: [],
    special_requirements: ''
  });

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error) throw error;
      setCustomer(data);
      
      // Pre-fill company name from customer data
      setApplicationData(prev => ({
        ...prev,
        company_name: data.company || ''
      }));
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast({
        title: "Error",
        description: "Failed to load customer information",
        variant: "destructive"
      });
    }
  };

  const addOwner = () => {
    setOwners([...owners, { name: '', nationality: '', passport_number: '', ownership_percentage: 0 }]);
  };

  const removeOwner = (index: number) => {
    if (owners.length > 1) {
      setOwners(owners.filter((_, i) => i !== index));
    }
  };

  const updateOwner = (index: number, field: keyof ApplicationOwner, value: string | number) => {
    const updatedOwners = [...owners];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    setOwners(updatedOwners);
  };

  const updateApplicationData = (field: keyof ApplicationData, value: any) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!applicationData.business_type || !applicationData.company_name || !applicationData.business_activity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required business information fields",
        variant: "destructive"
      });
      return false;
    }

    const totalOwnership = owners.reduce((sum, owner) => sum + owner.ownership_percentage, 0);
    if (Math.abs(totalOwnership - 100) > 0.01) {
      toast({
        title: "Validation Error",
        description: "Total ownership percentage must equal 100%",
        variant: "destructive"
      });
      return false;
    }

    const hasIncompleteOwner = owners.some(owner => 
      !owner.name || !owner.nationality || owner.ownership_percentage <= 0
    );
    if (hasIncompleteOwner) {
      toast({
        title: "Validation Error",
        description: "Please complete all owner information",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Create the application
      const { data: application, error: appError } = await supabase
        .from('account_applications')
        .insert({
          customer_id: customerId,
          status: 'draft',
          application_data: applicationData as any
        })
        .select()
        .single();

      if (appError) throw appError;

      // Create application owners
      const ownersData = owners.map(owner => ({
        application_id: application.id,
        name: owner.name,
        nationality: owner.nationality,
        passport_number: owner.passport_number,
        ownership_percentage: owner.ownership_percentage
      }));

      const { error: ownersError } = await supabase
        .from('application_owners')
        .insert(ownersData);

      if (ownersError) throw ownersError;

      // Create initial application message
      const { error: messageError } = await supabase
        .from('application_messages')
        .insert({
          application_id: application.id,
          sender_id: user?.id,
          sender_type: 'user',
          message: 'Application created and submitted for review'
        });

      if (messageError) console.warn('Failed to create initial message:', messageError);

      toast({
        title: "Success",
        description: "Application created successfully"
      });

      navigate(`/applications/${application.id}`);
    } catch (error) {
      console.error('Error creating application:', error);
      toast({
        title: "Error",
        description: "Failed to create application",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading customer information...</p>
        </div>
      </div>
    );
  }

  const totalOwnership = owners.reduce((sum, owner) => sum + owner.ownership_percentage, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate(`/customers/${customerId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customer
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account Application</h1>
          <p className="text-muted-foreground">
            Creating application for <strong>{customer.name}</strong> ({customer.email})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type *</Label>
                  <Select 
                    value={applicationData.business_type} 
                    onValueChange={(value) => updateApplicationData('business_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                      <SelectItem value="freezone">Free Zone Company</SelectItem>
                      <SelectItem value="offshore">Offshore Company</SelectItem>
                      <SelectItem value="branch">Branch Office</SelectItem>
                      <SelectItem value="representative">Representative Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={applicationData.company_name}
                    onChange={(e) => updateApplicationData('company_name', e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_activity">Business Activity *</Label>
                <Textarea
                  id="business_activity"
                  value={applicationData.business_activity}
                  onChange={(e) => updateApplicationData('business_activity', e.target.value)}
                  placeholder="Describe the main business activities"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capital_amount">Capital Amount (AED)</Label>
                  <Input
                    id="capital_amount"
                    type="number"
                    value={applicationData.capital_amount}
                    onChange={(e) => updateApplicationData('capital_amount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter capital amount"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_jurisdiction">License Jurisdiction</Label>
                  <Select 
                    value={applicationData.license_jurisdiction} 
                    onValueChange={(value) => updateApplicationData('license_jurisdiction', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dubai">Dubai</SelectItem>
                      <SelectItem value="abu_dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="sharjah">Sharjah</SelectItem>
                      <SelectItem value="ajman">Ajman</SelectItem>
                      <SelectItem value="ras_al_khaimah">Ras Al Khaimah</SelectItem>
                      <SelectItem value="fujairah">Fujairah</SelectItem>
                      <SelectItem value="umm_al_quwain">Umm Al Quwain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special_requirements">Special Requirements</Label>
                <Textarea
                  id="special_requirements"
                  value={applicationData.special_requirements}
                  onChange={(e) => updateApplicationData('special_requirements', e.target.value)}
                  placeholder="Any special requirements or additional information"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Application Owners */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Application Owners
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addOwner}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Owner
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Total Ownership: {totalOwnership}% 
                {Math.abs(totalOwnership - 100) > 0.01 && (
                  <span className="text-destructive ml-2">
                    (Must equal 100%)
                  </span>
                )}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {owners.map((owner, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Owner {index + 1}</h4>
                    {owners.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOwner(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`owner_name_${index}`}>Full Name *</Label>
                      <Input
                        id={`owner_name_${index}`}
                        value={owner.name}
                        onChange={(e) => updateOwner(index, 'name', e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`owner_nationality_${index}`}>Nationality *</Label>
                      <Input
                        id={`owner_nationality_${index}`}
                        value={owner.nationality}
                        onChange={(e) => updateOwner(index, 'nationality', e.target.value)}
                        placeholder="Enter nationality"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`owner_passport_${index}`}>Passport Number</Label>
                      <Input
                        id={`owner_passport_${index}`}
                        value={owner.passport_number}
                        onChange={(e) => updateOwner(index, 'passport_number', e.target.value)}
                        placeholder="Enter passport number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`owner_percentage_${index}`}>Ownership % *</Label>
                      <Input
                        id={`owner_percentage_${index}`}
                        type="number"
                        value={owner.ownership_percentage}
                        onChange={(e) => updateOwner(index, 'ownership_percentage', parseFloat(e.target.value) || 0)}
                        placeholder="Enter ownership percentage"
                        min="0"
                        max="100"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating Application...' : 'Create Application'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/customers/${customerId}`)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateApplication;