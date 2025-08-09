import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import ManagerSubHeader from '@/components/managers/ManagerSubHeader';

const PartnerSignupApplication = () => {
  return (
    <div className="min-h-screen bg-background">
      <ManagerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partner Signup Application</h1>
          <p className="text-muted-foreground">Application form for new partner registration (filled by consultants)</p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              New Partner Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Partner Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="partnerName">Partner Name *</Label>
                  <Input id="partnerName" placeholder="Enter partner name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="partner@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="+971 XX XXX XXXX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerType">Partner Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select partner type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Consultant</SelectItem>
                      <SelectItem value="company">Consulting Company</SelectItem>
                      <SelectItem value="agency">Business Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input id="companyName" placeholder="Enter company name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyType">Company Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="fze">FZE</SelectItem>
                      <SelectItem value="fzco">FZCO</SelectItem>
                      <SelectItem value="branch">Branch Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tradeLicense">Trade License Number *</Label>
                  <Input id="tradeLicense" placeholder="Enter trade license number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dubai">Dubai</SelectItem>
                      <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="sharjah">Sharjah</SelectItem>
                      <SelectItem value="ajman">Ajman</SelectItem>
                      <SelectItem value="rak">Ras Al Khaimah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Bank Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Preferred Bank *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emirates-nbd">Emirates NBD</SelectItem>
                      <SelectItem value="adcb">ADCB</SelectItem>
                      <SelectItem value="fab">First Abu Dhabi Bank</SelectItem>
                      <SelectItem value="hsbc">HSBC</SelectItem>
                      <SelectItem value="mashreq">Mashreq Bank</SelectItem>
                      <SelectItem value="cbd">CBD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Account</SelectItem>
                      <SelectItem value="savings">Business Savings</SelectItem>
                      <SelectItem value="corporate">Corporate Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialDeposit">Initial Deposit Amount (AED) *</Label>
                <Input id="initialDeposit" type="number" placeholder="Enter initial deposit amount" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description</Label>
                <Textarea 
                  id="businessDescription" 
                  placeholder="Describe the nature of business activities"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultantNotes">Consultant Notes</Label>
                <Textarea 
                  id="consultantNotes" 
                  placeholder="Any additional notes or requirements"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline">Save as Draft</Button>
              <Button>Submit Application</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerSignupApplication;