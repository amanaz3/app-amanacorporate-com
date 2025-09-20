import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Eye, FileText, User, Building, Phone, Mail, Calendar, MapPin } from 'lucide-react';

interface Application {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  application_data: any;
  customer: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    company: string;
    license_type: string;
    jurisdiction: string;
    preferred_bank: string;
    preferred_bank_2: string;
    preferred_bank_3: string;
    any_suitable_bank: boolean;
    customer_notes: string;
  };
}

const BankAccountApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from('account_applications')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          application_data,
          customers!inner (
            id,
            name,
            email,
            mobile,
            company,
            license_type,
            jurisdiction,
            preferred_bank,
            preferred_bank_2,
            preferred_bank_3,
            any_suitable_bank,
            customer_notes
          )
        `)
        .eq('application_type', 'bank_account')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error",
          description: "Failed to fetch applications. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Map the data to match our interface structure
      const mappedData = (data || []).map(item => ({
        ...item,
        customer: item.customers // Map customers to customer
      }));

      setApplications(mappedData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('account_applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update application status.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Application status updated successfully.",
      });

      // Refresh applications
      fetchApplications();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'default';
      case 'in_review':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bank Account Applications</h1>
          <p className="text-muted-foreground mt-2">
            Manage and review bank account opening applications
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications Overview</CardTitle>
          <CardDescription>
            {applications.length} {statusFilter === 'all' ? 'total' : statusFilter} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.customer.name}
                  </TableCell>
                  <TableCell>{application.customer.company}</TableCell>
                  <TableCell>{application.customer.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(application.status)}>
                      {application.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(application.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                              Review and manage application #{application.id.substring(0, 8)}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedApplication && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="banking">Banking Preferences</TabsTrigger>
                                <TabsTrigger value="actions">Actions</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Personal Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div>
                                        <span className="text-sm font-medium">Name:</span>
                                        <p className="text-sm text-muted-foreground">{selectedApplication.customer.name}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">Email:</span>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                          <Mail className="h-3 w-3" />
                                          {selectedApplication.customer.email}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">Mobile:</span>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {selectedApplication.customer.mobile}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        Business Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div>
                                        <span className="text-sm font-medium">Company:</span>
                                        <p className="text-sm text-muted-foreground">{selectedApplication.customer.company}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">License Type:</span>
                                        <p className="text-sm text-muted-foreground">{selectedApplication.customer.license_type}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">Jurisdiction:</span>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {selectedApplication.customer.jurisdiction || 'Not specified'}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                                
                                {selectedApplication.customer.customer_notes && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Additional Notes
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {selectedApplication.customer.customer_notes}
                                      </p>
                                    </CardContent>
                                  </Card>
                                )}
                                
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      Timeline
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div>
                                      <span className="text-sm font-medium">Submitted:</span>
                                      <p className="text-sm text-muted-foreground">{formatDate(selectedApplication.created_at)}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">Last Updated:</span>
                                      <p className="text-sm text-muted-foreground">{formatDate(selectedApplication.updated_at)}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              
                              <TabsContent value="banking" className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Banking Preferences</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <span className="text-sm font-medium">Any Suitable Bank:</span>
                                      <Badge variant={selectedApplication.customer.any_suitable_bank ? "default" : "outline"} className="ml-2">
                                        {selectedApplication.customer.any_suitable_bank ? 'Yes' : 'No'}
                                      </Badge>
                                    </div>
                                    
                                    {!selectedApplication.customer.any_suitable_bank && (
                                      <div className="space-y-2">
                                        {selectedApplication.customer.preferred_bank && (
                                          <div>
                                            <span className="text-sm font-medium">1st Preference:</span>
                                            <p className="text-sm text-muted-foreground">{selectedApplication.customer.preferred_bank}</p>
                                          </div>
                                        )}
                                        {selectedApplication.customer.preferred_bank_2 && (
                                          <div>
                                            <span className="text-sm font-medium">2nd Preference:</span>
                                            <p className="text-sm text-muted-foreground">{selectedApplication.customer.preferred_bank_2}</p>
                                          </div>
                                        )}
                                        {selectedApplication.customer.preferred_bank_3 && (
                                          <div>
                                            <span className="text-sm font-medium">3rd Preference:</span>
                                            <p className="text-sm text-muted-foreground">{selectedApplication.customer.preferred_bank_3}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              
                              <TabsContent value="actions" className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Update Application Status</CardTitle>
                                    <CardDescription>
                                      Current status: <Badge variant={getStatusBadgeVariant(selectedApplication.status)}>
                                        {selectedApplication.status.replace('_', ' ').toUpperCase()}
                                      </Badge>
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => updateApplicationStatus(selectedApplication.id, 'in_review')}
                                        disabled={selectedApplication.status === 'in_review'}
                                      >
                                        Mark as In Review
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                                        disabled={selectedApplication.status === 'approved'}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                                        disabled={selectedApplication.status === 'rejected'}
                                      >
                                        Reject
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => updateApplicationStatus(selectedApplication.id, 'completed')}
                                        disabled={selectedApplication.status === 'completed'}
                                      >
                                        Mark as Completed
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {applications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No applications found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAccountApplications;