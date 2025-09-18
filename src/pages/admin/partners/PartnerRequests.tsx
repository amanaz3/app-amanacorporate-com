import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SecureAuthContext';
import { 
  Users, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  Phone,
  User
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PartnerRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const PartnerRequests: React.FC = () => {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PartnerRequest | null>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchPartnerRequests();
    }
  }, [isAdmin]);

  const fetchPartnerRequests = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('partner_signup_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching partner requests:', error);
      toast({
        title: "Error",
        description: "Failed to load partner requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('partner_signup_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Partner request has been ${status}`,
      });

      fetchPartnerRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error", 
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <p className="ml-2 text-muted-foreground">Loading partner requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Partner Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Partner Requests</h3>
              <p className="text-muted-foreground">No partnership applications have been submitted yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {request.first_name} {request.last_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            {request.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            {request.phone_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Partner Request Details</DialogTitle>
                                <DialogDescription>
                                  Review and manage this partnership application
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium">First Name</h4>
                                      <p className="text-muted-foreground">{selectedRequest.first_name}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Last Name</h4>
                                      <p className="text-muted-foreground">{selectedRequest.last_name}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Email</h4>
                                    <p className="text-muted-foreground">{selectedRequest.email}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Phone</h4>
                                    <p className="text-muted-foreground">{selectedRequest.phone_number}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Current Status</h4>
                                    <Badge variant={getStatusColor(selectedRequest.status)} className="flex items-center gap-1 w-fit">
                                      {getStatusIcon(selectedRequest.status)}
                                      {selectedRequest.status}
                                    </Badge>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    {selectedRequest.status === 'pending' && (
                                      <>
                                        <Button
                                          onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                                          className="flex items-center gap-2"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                          Approve
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                                          className="flex items-center gap-2"
                                        >
                                          <XCircle className="h-4 w-4" />
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerRequests;