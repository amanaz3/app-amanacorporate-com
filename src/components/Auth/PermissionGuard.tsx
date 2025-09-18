import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions,
  requireAll = false,
  fallback,
  children
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // Determine if user has required permissions
  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    // No permissions specified, allow access
    hasAccess = true;
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert className="max-w-md mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Access denied. You don't have the required permissions to view this content.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;