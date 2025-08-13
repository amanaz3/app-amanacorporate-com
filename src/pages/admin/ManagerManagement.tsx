import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, UserCog, Settings, Edit, Trash2, Plus } from 'lucide-react';

const ManagerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual data from Supabase
  const managers = [
    {
      id: '1',
      name: 'Michael Johnson',
      email: 'michael@company.com',
      permissions: {
        can_manage_partners: true,
        can_manage_users: false
      },
      assigned_partners: 5,
      created_at: '2024-01-10T08:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      permissions: {
        can_manage_partners: true,
        can_manage_users: true
      },
      assigned_partners: 8,
      created_at: '2024-01-05T14:30:00Z'
    }
  ];

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Manager
          </Button>
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
                  <TableHead>Permissions</TableHead>
                  <TableHead>Assigned Partners</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell className="font-medium">{manager.name}</TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {manager.permissions.can_manage_partners && (
                          <Badge variant="outline" className="mr-1">Partners</Badge>
                        )}
                        {manager.permissions.can_manage_users && (
                          <Badge variant="outline" className="mr-1">Users</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{manager.assigned_partners}</TableCell>
                    <TableCell>{new Date(manager.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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