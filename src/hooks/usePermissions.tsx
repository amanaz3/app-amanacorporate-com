import { useMemo } from 'react';
import { useAuth } from '@/contexts/SecureAuthContext';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Define all system permissions
const ALL_PERMISSIONS: Permission[] = [
  // User Management
  { id: 'user.view', name: 'View Users', description: 'View user profiles and information', category: 'User Management' },
  { id: 'user.create', name: 'Create Users', description: 'Create new user accounts', category: 'User Management' },
  { id: 'user.edit', name: 'Edit Users', description: 'Modify user profiles and settings', category: 'User Management' },
  { id: 'user.delete', name: 'Delete Users', description: 'Remove user accounts', category: 'User Management' },
  
  // Customer Management
  { id: 'customer.view', name: 'View Customers', description: 'View customer profiles and data', category: 'Customer Management' },
  { id: 'customer.create', name: 'Create Customers', description: 'Create new customer records', category: 'Customer Management' },
  { id: 'customer.edit', name: 'Edit Customers', description: 'Modify customer information', category: 'Customer Management' },
  { id: 'customer.delete', name: 'Delete Customers', description: 'Remove customer records', category: 'Customer Management' },
  
  // Application Management
  { id: 'application.view', name: 'View Applications', description: 'View application submissions', category: 'Application Management' },
  { id: 'application.create', name: 'Create Applications', description: 'Submit new applications', category: 'Application Management' },
  { id: 'application.edit', name: 'Edit Applications', description: 'Modify application data', category: 'Application Management' },
  { id: 'application.approve', name: 'Approve Applications', description: 'Approve/reject applications', category: 'Application Management' },
  
  // System Administration
  { id: 'system.config', name: 'System Configuration', description: 'Modify system settings', category: 'System Administration' },
  { id: 'system.logs', name: 'View System Logs', description: 'Access system logs and audit trails', category: 'System Administration' },
  { id: 'system.backup', name: 'System Backup', description: 'Create and restore system backups', category: 'System Administration' },
];

// Role-based permission mappings
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ALL_PERMISSIONS.map(p => p.id), // Admins have all permissions
  manager: [
    'user.view', 'customer.view', 'customer.create', 'customer.edit',
    'application.view', 'application.create', 'application.edit', 'application.approve'
  ],
  partner: [
    'customer.view', 'customer.create', 'customer.edit',
    'application.view', 'application.create', 'application.edit'
  ],
  user: [
    'customer.view', 'application.view'
  ]
};

export const usePermissions = () => {
  const { user, isAdmin } = useAuth();

  // Get user role from user object or default to 'user'
  const userRole = user?.user_metadata?.role || 'user';

  const userPermissions = useMemo(() => {
    if (!user) return [];
    
    // Admin gets all permissions
    if (isAdmin) {
      return ALL_PERMISSIONS.map(p => p.id);
    }
    
    // Return role-based permissions
    return ROLE_PERMISSIONS[userRole] || [];
  }, [user, userRole, isAdmin]);

  const hasPermission = (permissionId: string): boolean => {
    return userPermissions.includes(permissionId);
  };

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    return permissionIds.some(id => hasPermission(id));
  };

  const hasAllPermissions = (permissionIds: string[]): boolean => {
    return permissionIds.every(id => hasPermission(id));
  };

  const getPermissionsByCategory = (category: string): Permission[] => {
    return ALL_PERMISSIONS
      .filter(p => p.category === category && hasPermission(p.id));
  };

  const canManageUsers = (): boolean => {
    return hasAnyPermission(['user.create', 'user.edit', 'user.delete']);
  };

  const canManageCustomers = (): boolean => {
    return hasAnyPermission(['customer.create', 'customer.edit', 'customer.delete']);
  };

  const canManageApplications = (): boolean => {
    return hasAnyPermission(['application.create', 'application.edit', 'application.approve']);
  };

  const canAccessSystemSettings = (): boolean => {
    return hasAnyPermission(['system.config', 'system.logs', 'system.backup']);
  };

  return {
    // Core permission checking
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // User permissions
    userPermissions,
    getPermissionsByCategory,
    
    // Convenience methods
    canManageUsers,
    canManageCustomers,
    canManageApplications,
    canAccessSystemSettings,
    
    // Role info
    userRole,
    isAdmin,
    
    // All available permissions (for admin interfaces)
    allPermissions: ALL_PERMISSIONS,
    rolePermissions: ROLE_PERMISSIONS
  };
};

export type { Permission };