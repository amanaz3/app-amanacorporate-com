import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings, Globe, Mail, Database, Shield } from 'lucide-react';

const GeneralSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    systemName: 'Application Management System',
    systemDescription: 'Comprehensive application management platform for partners, managers, and users',
    defaultCurrency: 'USD',
    defaultTimezone: 'UTC',
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    autoApprovalLimit: '1000',
    sessionTimeout: '60',
    maxFileSize: '10',
    supportEmail: 'support@company.com',
    maintenanceMode: false,
    userRegistration: true,
    partnerRegistration: false
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would save to your backend/database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Settings Saved",
        description: "General settings have been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">General Settings</h1>
          </div>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={settings.systemName}
                  onChange={(e) => handleSettingChange('systemName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemDescription">System Description</Label>
                <Textarea
                  id="systemDescription"
                  value={settings.systemDescription}
                  onChange={(e) => handleSettingChange('systemDescription', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select value={settings.defaultCurrency} onValueChange={(value) => handleSettingChange('defaultCurrency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultTimezone">Default Timezone</Label>
                  <Select value={settings.defaultTimezone} onValueChange={(value) => handleSettingChange('defaultTimezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">EST - Eastern Time</SelectItem>
                      <SelectItem value="PST">PST - Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT - Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('enableEmailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send SMS notifications to users</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.enableSMSNotifications}
                  onCheckedChange={(checked) => handleSettingChange('enableSMSNotifications', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="autoApprovalLimit">Auto Approval Limit ($)</Label>
                <Input
                  id="autoApprovalLimit"
                  type="number"
                  value={settings.autoApprovalLimit}
                  onChange={(e) => handleSettingChange('autoApprovalLimit', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Applications below this amount are auto-approved</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="userRegistration">User Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                </div>
                <Switch
                  id="userRegistration"
                  checked={settings.userRegistration}
                  onCheckedChange={(checked) => handleSettingChange('userRegistration', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="partnerRegistration">Partner Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new partner registrations</p>
                </div>
                <Switch
                  id="partnerRegistration"
                  checked={settings.partnerRegistration}
                  onCheckedChange={(checked) => handleSettingChange('partnerRegistration', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable maintenance mode</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={loading} className="min-w-32">
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;