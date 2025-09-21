import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SecureAuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  UserCog,
  Settings,
  Shield,
  Building2,
  BarChart3,
  FileCheck,
  Package,
  Bell,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

interface NavigationGroup {
  name: string;
  icon: React.ReactNode;
  items: NavigationItem[];
  roles: string[];
  defaultOpen?: boolean;
}

const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  
  const userRole = user?.profile?.role || 'user';
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  // Check if user has access to a role
  const hasRole = (roles: string[]) => {
    return roles.includes('all') || roles.includes(userRole) || 
           (userRole === 'admin' && roles.includes('admin'));
  };

  // Check if route is active
  const isActive = (path: string) => {
    if (path === '/dashboard') return currentPath === path;
    return currentPath.startsWith(path);
  };

  // Check if any item in group is active
  const isGroupActive = (items: NavigationItem[]) => {
    return items.some(item => hasRole(item.roles) && isActive(item.path));
  };

  // Main navigation structure
  const navigationGroups: NavigationGroup[] = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: <LayoutDashboard className="h-4 w-4" />,
          roles: ['all']
        }
      ],
      roles: ['all']
    },
    {
      name: 'Applications',
      icon: <FileText className="h-4 w-4" />,
      items: [
        {
          name: 'All Applications',
          path: '/applications',
          icon: <FileText className="h-4 w-4" />,
          roles: ['all']
        },
        {
          name: 'Completed',
          path: '/completed',
          icon: <FileCheck className="h-4 w-4" />,
          roles: ['all']
        },
        {
          name: 'Rejected',
          path: '/rejected',
          icon: <FileText className="h-4 w-4" />,
          roles: ['all']
        }
      ],
      roles: ['all'],
      defaultOpen: true
    },
    {
      name: 'People',
      icon: <Users className="h-4 w-4" />,
      items: [
        {
          name: 'Customers',
          path: '/customers',
          icon: <Users className="h-4 w-4" />,
          roles: ['admin', 'manager']
        },
        {
          name: 'Users',
          path: '/users',
          icon: <Users className="h-4 w-4" />,
          roles: ['user']
        },
        {
          name: 'Managers',
          path: '/managers',
          icon: <UserCog className="h-4 w-4" />,
          roles: ['manager']
        },
        {
          name: 'Partners',
          path: '/partners',
          icon: <Building2 className="h-4 w-4" />,
          roles: ['partner']
        }
      ],
      roles: ['all']
    },
    {
      name: 'Admin',
      icon: <Shield className="h-4 w-4" />,
      items: [
        {
          name: 'Admin Portal',
          path: '/admin',
          icon: <Shield className="h-4 w-4" />,
          roles: ['admin']
        },
        {
          name: 'User Management',
          path: '/admin/users',
          icon: <Users className="h-4 w-4" />,
          roles: ['admin']
        },
        {
          name: 'Manager Management',
          path: '/admin/managers',
          icon: <UserCog className="h-4 w-4" />,
          roles: ['admin']
        },
        {
          name: 'Partner Management',
          path: '/admin/partners',
          icon: <Building2 className="h-4 w-4" />,
          roles: ['admin']
        },
        {
          name: 'Statistics',
          path: '/admin/statistics',
          icon: <BarChart3 className="h-4 w-4" />,
          roles: ['admin']
        },
        {
          name: 'System Logs',
          path: '/admin/logs',
          icon: <FileCheck className="h-4 w-4" />,
          roles: ['admin']
        },
        {
          name: 'Products',
          path: '/products',
          icon: <Package className="h-4 w-4" />,
          roles: ['admin']
        },
        {
          name: 'Security Monitor',
          path: '/security/compliance',
          icon: <Shield className="h-4 w-4" />,
          roles: ['admin']
        },
        {
          name: 'Performance',
          path: '/monitoring/performance',
          icon: <BarChart3 className="h-4 w-4" />,
          roles: ['admin']
        }
      ],
      roles: ['admin']
    }
  ];

  // Filter groups based on user role
  const visibleGroups = navigationGroups.filter(group => hasRole(group.roles));

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center space-x-2">
          {!collapsed && (
            <img 
              src="/lovable-uploads/5ccffe54-41ae-4fc6-9a3a-3843049b907b.png" 
              alt="Amana Corporate" 
              className="h-8 w-auto"
            />
          )}
          {collapsed && (
            <img 
              src="/lovable-uploads/5ccffe54-41ae-4fc6-9a3a-3843049b907b.png" 
              alt="Amana Corporate" 
              className="h-8 w-8 object-contain mx-auto"
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {visibleGroups.map((group) => {
          const visibleItems = group.items.filter(item => hasRole(item.roles));
          if (visibleItems.length === 0) return null;

          // Single item groups (like Dashboard) render without collapsible
          if (visibleItems.length === 1) {
            const item = visibleItems[0];
            return (
              <SidebarGroup key={group.name}>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <NavLink to={item.path}>
                        {item.icon}
                        <span>{item.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            );
          }

          // Multi-item groups render as collapsible
          return (
            <SidebarGroup key={group.name}>
              <Collapsible defaultOpen={group.defaultOpen || isGroupActive(visibleItems)}>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="group/collapsible w-full">
                    <div className="flex items-center gap-2">
                      {group.icon}
                      <span>{group.name}</span>
                    </div>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {visibleItems.map((item) => (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton asChild isActive={isActive(item.path)}>
                            <NavLink to={item.path}>
                              {item.icon}
                              <span>{item.name}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          );
        })}

        {/* Settings at bottom */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/settings')}>
                <NavLink to="/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;