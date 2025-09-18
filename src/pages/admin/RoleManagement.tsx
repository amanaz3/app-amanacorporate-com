import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SecureAuthContext';
import { 
  Shield, 
  Users, 
  Search,
  Eye,
  Edit,
  UserCog,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const rolePermissions = {
  admin: {
    label: 'Administrator',
    color: 'destructive' as const,
    permissions: ['all_access', 'user_management', 'system_config', 'data_management']
  },
  manager: {
    label: 'Manager', 
    color: 'default' as const,
    permissions: ['customer_management', 'application_review', 'report_access']
  },
  partner: {
    label: 'Partner',
    color: 'secondary' as const, 
    permissions: ['customer_create', 'application_submit', 'own_data_view']
  },
  user: {
    label: 'User',
    color: 'outline' as const,
    permissions: ['basic_access', 'own_profile_edit']
  }
};

const RoleManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: role as any, // Cast to bypass TypeScript strict checking for enum
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: `User role has been updated to ${rolePermissions[role as keyof typeof rolePermissions]?.label}`,
      });

      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `User has been ${!isActive ? 'activated' : 'deactivated'}`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleInfo = (role: string) => {
    return rolePermissions[role as keyof typeof rolePermissions] || {
      label: role,
      color: 'outline' as const,
      permissions: []
    };
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Access denied. Administrator privileges required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <p className="ml-2 text-muted-foreground">Loading user roles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Role Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(rolePermissions).map(([role, info]) => {
          const count = users.filter(user => user.role === role).length;
          return (
            <Card key={role}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{info.label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <Badge variant={info.color as "default" | "secondary" | "destructive" | "outline"}>
                    {info.permissions.length} perms
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Roles ({filteredUsers.length})
          </CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleInfo.color as "default" | "secondary" | "destructive" | "outline"}>
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {user.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage User Role</DialogTitle>
                                <DialogDescription>
                                  Update role and permissions for {user.name}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <p className="text-sm font-medium">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label>Current Role</Label>
                        <Badge variant={getRoleInfo(selectedUser.role).color as "default" | "secondary" | "destructive" | "outline"} className="ml-2">
                          {getRoleInfo(selectedUser.role).label}
                        </Badge>
                                  </div>
                                  
                                  <div>
                                    <Label>Current Permissions</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {getRoleInfo(selectedUser.role).permissions.map(perm => (
                                        <Badge key={perm} variant="outline" className="text-xs">
                                          {perm.replace('_', ' ')}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="newRole">Change Role To</Label>
                                    <Select value={newRole} onValueChange={setNewRole}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select new role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(rolePermissions).map(([role, info]) => (
                                          <SelectItem key={role} value={role}>
                                            {info.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      onClick={() => updateUserRole(selectedUser.id, newRole)}
                                      disabled={!newRole || newRole === selectedUser.role || isUpdating}
                                      className="flex items-center gap-2"
                                    >
                                      <UserCog className="h-4 w-4" />
                                      {isUpdating ? 'Updating...' : 'Update Role'}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => toggleUserStatus(selectedUser.id, selectedUser.is_active)}
                                    >
                                      {selectedUser.is_active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;