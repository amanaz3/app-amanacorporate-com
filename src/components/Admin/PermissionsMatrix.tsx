import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  CheckCircle, 
  XCircle,
  Users,
  FileText,
  Settings,
  Database,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

interface Role {
  id: string;
  name: string;
  label: string;
  color: string;
  permissions: string[];
}

const permissions: Permission[] = [
  // User Management
  { id: 'user.view', name: 'View Users', description: 'View user profiles and information', category: 'User Management', icon: <Eye className="h-4 w-4" /> },
  { id: 'user.create', name: 'Create Users', description: 'Create new user accounts', category: 'User Management', icon: <Plus className="h-4 w-4" /> },
  { id: 'user.edit', name: 'Edit Users', description: 'Modify user profiles and settings', category: 'User Management', icon: <Edit className="h-4 w-4" /> },
  { id: 'user.delete', name: 'Delete Users', description: 'Remove user accounts', category: 'User Management', icon: <Trash2 className="h-4 w-4" /> },
  
  // Customer Management
  { id: 'customer.view', name: 'View Customers', description: 'View customer profiles and data', category: 'Customer Management', icon: <Eye className="h-4 w-4" /> },
  { id: 'customer.create', name: 'Create Customers', description: 'Create new customer records', category: 'Customer Management', icon: <Plus className="h-4 w-4" /> },
  { id: 'customer.edit', name: 'Edit Customers', description: 'Modify customer information', category: 'Customer Management', icon: <Edit className="h-4 w-4" /> },
  { id: 'customer.delete', name: 'Delete Customers', description: 'Remove customer records', category: 'Customer Management', icon: <Trash2 className="h-4 w-4" /> },
  
  // Application Management
  { id: 'application.view', name: 'View Applications', description: 'View application submissions', category: 'Application Management', icon: <Eye className="h-4 w-4" /> },
  { id: 'application.create', name: 'Create Applications', description: 'Submit new applications', category: 'Application Management', icon: <Plus className="h-4 w-4" /> },
  { id: 'application.edit', name: 'Edit Applications', description: 'Modify application data', category: 'Application Management', icon: <Edit className="h-4 w-4" /> },
  { id: 'application.approve', name: 'Approve Applications', description: 'Approve/reject applications', category: 'Application Management', icon: <CheckCircle className="h-4 w-4" /> },
  
  // System Administration
  { id: 'system.config', name: 'System Configuration', description: 'Modify system settings', category: 'System Administration', icon: <Settings className="h-4 w-4" /> },
  { id: 'system.logs', name: 'View System Logs', description: 'Access system logs and audit trails', category: 'System Administration', icon: <FileText className="h-4 w-4" /> },
  { id: 'system.backup', name: 'System Backup', description: 'Create and restore system backups', category: 'System Administration', icon: <Database className="h-4 w-4" /> },
];

const roles: Role[] = [
  {
    id: 'admin',
    name: 'admin',
    label: 'Administrator',
    color: 'destructive',
    permissions: permissions.map(p => p.id) // All permissions
  },
  {
    id: 'manager',
    name: 'manager',
    label: 'Manager',
    color: 'default',
    permissions: [
      'user.view', 'customer.view', 'customer.create', 'customer.edit',
      'application.view', 'application.create', 'application.edit', 'application.approve'
    ]
  },
  {
    id: 'partner',
    name: 'partner',
    label: 'Partner',
    color: 'secondary',
    permissions: [
      'customer.view', 'customer.create', 'customer.edit',
      'application.view', 'application.create', 'application.edit'
    ]
  },
  {
    id: 'user',
    name: 'user',
    label: 'User',
    color: 'outline',
    permissions: [
      'customer.view', 'application.view'
    ]
  }
];

const PermissionsMatrix: React.FC = () => {
  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const hasPermission = (roleId: string, permissionId: string): boolean => {
    const role = roles.find(r => r.id === roleId);
    return role?.permissions.includes(permissionId) || false;
  };

  const getPermissionCount = (roleId: string): number => {
    const role = roles.find(r => r.id === roleId);
    return role?.permissions.length || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions Matrix
          </h2>
          <p className="text-muted-foreground">Overview of role-based permissions</p>
        </div>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant={role.color as any} className="mb-2">
                    {role.label}
                  </Badge>
                  <p className="text-2xl font-bold">{getPermissionCount(role.id)}</p>
                  <p className="text-sm text-muted-foreground">permissions</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 text-foreground">{category}</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Permission</TableHead>
                        {roles.map((role) => (
                          <TableHead key={role.id} className="text-center">
                            <Badge variant={role.color as any}>
                              {role.label}
                            </Badge>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryPermissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {permission.icon}
                              <div>
                                <p className="font-medium">{permission.name}</p>
                                <p className="text-sm text-muted-foreground">{permission.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          {roles.map((role) => (
                            <TableCell key={role.id} className="text-center">
                              {hasPermission(role.id, permission.id) ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsMatrix;