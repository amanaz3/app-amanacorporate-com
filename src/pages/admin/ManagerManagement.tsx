import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, UserCog, Settings, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useToast } from '@/hooks/use-toast';

interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const ManagerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { createUser, deleteUser, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'manager')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setManagers(data || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
      toast({
        title: "Error",
        description: "Failed to load managers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = async () => {
    if (!newManagerName.trim() || !newManagerEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      // Generate a temporary password for the manager
      const tempPassword = `Manager${Date.now()}!`;
      await createUser(newManagerEmail, newManagerName, 'manager', tempPassword);
      toast({
        title: "Success",
        description: "Manager created successfully"
      });
      setIsCreateDialogOpen(false);
      setNewManagerName('');
      setNewManagerEmail('');
      fetchManagers();
    } catch (error) {
      console.error('Error creating manager:', error);
      toast({
        title: "Error",
        description: "Failed to create manager",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteManager = async (managerId: string, managerName: string) => {
    if (confirm(`Are you sure you want to delete manager ${managerName}?`)) {
      try {
        await deleteUser(managerId);
        toast({
          title: "Success",
          description: "Manager deleted successfully"
        });
        fetchManagers();
      } catch (error) {
        console.error('Error deleting manager:', error);
        toast({
          title: "Error",
          description: "Failed to delete manager",
          variant: "destructive"
        });
      }
    }
  };

  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Manager Management</h1>
          <p className="text-muted-foreground">Create and manage internal managers with permission controls</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Manager
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Manager</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newManagerName}
                    onChange={(e) => setNewManagerName(e.target.value)}
                    placeholder="Enter manager name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newManagerEmail}
                    onChange={(e) => setNewManagerEmail(e.target.value)}
                    placeholder="Enter manager email"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateManager}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Manager'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading managers...
                    </TableCell>
                  </TableRow>
                ) : filteredManagers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No managers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredManagers.map((manager) => (
                    <TableRow key={manager.id}>
                      <TableCell className="font-medium">{manager.name}</TableCell>
                      <TableCell>{manager.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {manager.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={manager.is_active ? "default" : "secondary"}>
                          {manager.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(manager.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteManager(manager.id, manager.name)}
                          >
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Permission Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Partner Manager</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked />
                    <span>Control Partner Applications</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <span>Control User Applications</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Full Manager</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked />
                    <span>Control Partner Applications</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked />
                    <span>Control User Applications</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Custom</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom permission sets for specific needs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerManagement;