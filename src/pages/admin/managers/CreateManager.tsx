import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User, Mail, Shield, Settings } from 'lucide-react';

const CreateManager = () => {
  const navigate = useNavigate();
  const { createUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permissions: {
      can_manage_users: false,
      can_manage_partners: true
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user first
      await createUser(formData.email, formData.name, 'user' as any, formData.password);
      
      // Get the created user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', formData.email)
        .single();

      if (profile) {
        // Create manager record with permissions
        await supabase
          .from('managers')
          .insert({
            user_id: profile.user_id,
            permissions: formData.permissions
          });
      }

      toast({
        title: "Success",
        description: "Manager created successfully"
      });
      navigate('/admin/managers');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create manager",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [permission]: checked }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/admin/managers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Managers
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Manager</h1>
          <p className="text-muted-foreground">Add a new manager with specific permissions and access controls</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Manager Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter temporary password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-medium">Permissions</Label>
                </div>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_manage_users"
                      checked={formData.permissions.can_manage_users}
                      onCheckedChange={(checked) => 
                        handlePermissionChange('can_manage_users', checked as boolean)
                      }
                    />
                    <Label htmlFor="can_manage_users" className="text-sm">
                      Can manage users and user applications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_manage_partners"
                      checked={formData.permissions.can_manage_partners}
                      onCheckedChange={(checked) => 
                        handlePermissionChange('can_manage_partners', checked as boolean)
                      }
                    />
                    <Label htmlFor="can_manage_partners" className="text-sm">
                      Can manage assigned partners and their applications
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Manager'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/managers')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateManager;