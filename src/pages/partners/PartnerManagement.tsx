import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, Settings, Trash2, Loader2 } from 'lucide-react';
import PartnerSubHeader from '@/components/partners/PartnerSubHeader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useToast } from '@/hooks/use-toast';

interface Partner {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string | null;
  status: string;
  created_at: string;
}

const PartnerManagement = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_signup_requests')
        .select('*')
        .eq('status', 'approved')
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

  const getPartnerApplicationsCount = async (partnerId: string) => {
    try {
      const { count, error } = await supabase
        .from('account_applications')
        .select('*', { count: 'exact', head: true })
        .eq('submission_source', 'partner')
        .eq('customer_id', partnerId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching applications count:', error);
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PartnerSubHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partner Management</h1>
          <p className="text-muted-foreground">Manage your partner network and collaboration</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {partners.length} Active Partners
            </span>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading partners...
                    </TableCell>
                  </TableRow>
                ) : partners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No active partners found
                    </TableCell>
                  </TableRow>
                ) : (
                  partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">
                        {partner.first_name} {partner.last_name}
                      </TableCell>
                      <TableCell>{partner.email}</TableCell>
                      <TableCell>{partner.company_name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(partner.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" title="Partner settings">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Remove partner">
                            <Trash2 className="h-4 w-4" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{partners.length}</div>
              <p className="text-sm text-muted-foreground">Active partnerships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {partners.filter(p => {
                  const partnerDate = new Date(p.created_at);
                  const currentDate = new Date();
                  return partnerDate.getMonth() === currentDate.getMonth() && 
                         partnerDate.getFullYear() === currentDate.getFullYear();
                }).length}
              </div>
              <p className="text-sm text-muted-foreground">New partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">95%</div>
              <p className="text-sm text-muted-foreground">Success rate</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerManagement;