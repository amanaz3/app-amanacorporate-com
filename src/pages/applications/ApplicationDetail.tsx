import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Building, 
  MessageSquare, 
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Application {
  id: string;
  customer_id: string;
  status: string;
  application_data: any;
  created_at: string;
  updated_at: string;
  customer: {
    name: string;
    email: string;
    company: string;
  };
}

interface ApplicationOwner {
  id: string;
  name: string;
  nationality: string;
  passport_number: string;
  ownership_percentage: number;
}

interface ApplicationMessage {
  id: string;
  sender_id: string;
  sender_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const ApplicationDetail = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [owners, setOwners] = useState<ApplicationOwner[]>([]);
  const [messages, setMessages] = useState<ApplicationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationData();
    }
  }, [applicationId]);

  const fetchApplicationData = async () => {
    try {
      setLoading(true);

      // Fetch application with customer data
      const { data: appData, error: appError } = await supabase
        .from('account_applications')
        .select(`
          *,
          customer:customers(name, email, company)
        `)
        .eq('id', applicationId)
        .single();

      if (appError) throw appError;
      setApplication(appData);
      setNewStatus(appData.status);

      // Fetch application owners
      const { data: ownersData, error: ownersError } = await supabase
        .from('application_owners')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });

      if (ownersError) throw ownersError;
      setOwners(ownersData || []);

      // Fetch application messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('application_messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

    } catch (error) {
      console.error('Error fetching application data:', error);
      toast({
        title: "Error",
        description: "Failed to load application data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'submitted': return <FileText className="h-4 w-4" />;
      case 'under_review': return <AlertCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'submitted': return 'default';
      case 'under_review': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleStatusChange = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can change application status",
        variant: "destructive"
      });
      return;
    }

    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('account_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      // Add status change message
      await supabase
        .from('application_messages')
        .insert({
          application_id: applicationId,
          sender_id: user?.id,
          sender_type: 'admin',
          message: `Application status changed to: ${newStatus}`
        });

      setApplication(prev => prev ? { ...prev, status: newStatus } : null);
      
      toast({
        title: "Success",
        description: "Application status updated successfully"
      });

      // Refresh messages to show the status change
      fetchApplicationData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('application_messages')
        .insert({
          application_id: applicationId,
          sender_id: user?.id,
          sender_type: isAdmin ? 'admin' : 'user',
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      fetchApplicationData(); // Refresh messages

      toast({
        title: "Success",
        description: "Message sent successfully"
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Application Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested application could not be found.</p>
          <Button onClick={() => navigate('/customers')}>
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate(`/customers/${application.customer_id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customer
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Application Details</h1>
              <p className="text-muted-foreground">
                Application for <strong>{application.customer.name}</strong> ({application.customer.company})
              </p>
            </div>
            <Badge variant={getStatusColor(application.status)} className="flex items-center gap-2">
              {getStatusIcon(application.status)}
              {application.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Business Type</span>
                    <p className="text-sm">{application.application_data?.business_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Company Name</span>
                    <p className="text-sm">{application.application_data?.company_name || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Business Activity</span>
                  <p className="text-sm">{application.application_data?.business_activity || 'Not specified'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Capital Amount</span>
                    <p className="text-sm">AED {application.application_data?.capital_amount?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">License Jurisdiction</span>
                    <p className="text-sm">{application.application_data?.license_jurisdiction || 'Not specified'}</p>
                  </div>
                </div>

                {application.application_data?.special_requirements && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Special Requirements</span>
                    <p className="text-sm">{application.application_data.special_requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Owners */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Application Owners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {owners.map((owner, index) => (
                    <div key={owner.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Owner {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Name:</span>
                          <p>{owner.name}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Nationality:</span>
                          <p>{owner.nationality}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Passport Number:</span>
                          <p>{owner.passport_number || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Ownership:</span>
                          <p>{owner.ownership_percentage}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newStatus !== application.status && (
                    <Button 
                      onClick={handleStatusChange} 
                      disabled={updatingStatus}
                      className="w-full"
                    >
                      {updatingStatus ? 'Updating...' : 'Update Status'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Application Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={message.sender_type === 'admin' ? 'default' : 'secondary'} className="text-xs">
                          {message.sender_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="w-full">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Application Info */}
            <Card>
              <CardHeader>
                <CardTitle>Application Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(application.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date(application.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application ID:</span>
                  <span className="font-mono text-xs">{application.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;