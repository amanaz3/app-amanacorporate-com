import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Building2, Check, X, UserCog, Edit, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useToast } from '@/hooks/use-toast';

interface PartnerSignupRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company_name: string | null;
  partner_type: string;
  business_description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
  otp_code: string | null;
  otp_expires_at: string | null;
  role_at_company: string | null;
}

interface Manager {
  id: string;
  name: string;
  email: string;
}

const PartnerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [partners, setPartners] = useState<PartnerSignupRequest[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchPartners();
      fetchManagers();
    }
  }, [isAdmin]);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_signup_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners((data as any) || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Error",
        description: "Failed to load partners",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('role', 'manager')
        .eq('is_active', true);

      if (error) throw error;
      setManagers(data || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const updatePartnerStatus = async (partnerId: string, newStatus: string) => {
    setUpdating(partnerId);
    try {
      const { error } = await supabase
        .from('partner_signup_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', partnerId);

      if (error) throw error;

      // Update local state
      setPartners(prev => prev.map(partner => 
        partner.id === partnerId 
          ? { ...partner, status: newStatus }
          : partner
      ));

      toast({
        title: "Success",
        description: `Partner request ${newStatus} successfully`
      });
    } catch (error) {
      console.error('Error updating partner status:', error);
      toast({
        title: "Error",
        description: "Failed to update partner status",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      pending: 'outline',
      approved: 'default',
      rejected: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = 
      partner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (partner.company_name && partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || partner.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Only administrators can access partner management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partner Management</h1>
          <p className="text-muted-foreground">Manage partner signup requests and approvals</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partner Signup Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading partner requests...
                    </TableCell>
                  </TableRow>
                ) : filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No partner requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">
                        {partner.first_name} {partner.last_name}
                      </TableCell>
                      <TableCell>{partner.email}</TableCell>
                      <TableCell>{partner.phone_number}</TableCell>
                      <TableCell>{partner.company_name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {partner.partner_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(partner.status)}>
                          {partner.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(partner.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {partner.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updatePartnerStatus(partner.id, 'approved')}
                                disabled={updating === partner.id}
                                title="Approve partner request"
                              >
                                {updating === partner.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updatePartnerStatus(partner.id, 'rejected')}
                                disabled={updating === partner.id}
                                title="Reject partner request"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline" title="Edit partner details">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {partners.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Requests</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {partners.filter(p => p.status === 'approved').length}
                </div>
                <div className="text-sm text-muted-foreground">Approved Partners</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {partners.filter(p => p.status === 'rejected').length}
                </div>
                <div className="text-sm text-muted-foreground">Rejected Requests</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {managers.length}
                </div>
                <div className="text-sm text-muted-foreground">Available Managers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerManagement;