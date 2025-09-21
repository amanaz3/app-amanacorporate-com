import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SecureAuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  XCircle,
  UserCog,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Package,
  Shield,
  Building2,
  BarChart3,
  FileCheck,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Auto-collapse on mobile and handle desktop responsive behavior
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
      setMobileOpen(false);
    } else {
      // Auto-expand on desktop if collapsed was due to mobile
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ['admin', 'manager', 'partner', 'user'],
    },
    // Admin-only navigation
    {
      name: 'Admin Portal',
      path: '/admin',
      icon: <Shield className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'manager', 'partner', 'user'],
    },
    {
      name: 'Applications',
      path: '/applications',
      icon: <FileText className="h-5 w-5" />,
      roles: ['admin', 'manager', 'partner', 'user'],
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Manager Management',
      path: '/admin/managers',
      icon: <UserCog className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Partner Management',
      path: '/admin/partners',
      icon: <Building2 className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'System Logs',
      path: '/admin/logs',
      icon: <FileCheck className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Products',
      path: '/products',
      icon: <Package className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Statistics',
      path: '/admin/statistics',
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Security Monitor',
      path: '/security/compliance',
      icon: <Shield className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Performance',
      path: '/monitoring/performance',
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ['admin'],
    },
    // Manager navigation
    {
      name: 'Managers',
      path: '/managers',
      icon: <UserCog className="h-5 w-5" />,
      roles: ['manager'],
    },
    // Partner navigation
    {
      name: 'Partners',
      path: '/partners',
      icon: <Building2 className="h-5 w-5" />,
      roles: ['partner'],
    },
    // User navigation
    {
      name: 'Users',
      path: '/users',
      icon: <Users className="h-5 w-5" />,
      roles: ['user'],
    },
    // Common navigation
    {
      name: 'Completed',
      path: '/completed',
      icon: <CheckSquare className="h-5 w-5" />,
      roles: ['admin', 'manager', 'partner', 'user'],
    },
    {
      name: 'Rejected',
      path: '/rejected',
      icon: <XCircle className="h-5 w-5" />,
      roles: ['admin', 'manager', 'partner', 'user'],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['admin', 'manager', 'partner', 'user'],
    }
  ];

  const isActiveRoute = (path: string) => {
    // Exact match for most routes
    if (path === '/settings' || path === '/dashboard') {
      return location.pathname === path;
    }
    
    // Admin routes - check if any admin route is active
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    if (path === '/admin/users') {
      return location.pathname === '/admin/users';
    }
    if (path === '/admin/managers') {
      return location.pathname === '/admin/managers';
    }
    if (path === '/admin/partners') {
      return location.pathname === '/admin/partners';
    }
    if (path === '/admin/applications') {
      return location.pathname === '/admin/applications';
    }
    if (path === '/admin/statistics') {
      return location.pathname === '/admin/statistics';
    }
    if (path === '/admin/banks') {
      return location.pathname === '/admin/banks';
    }
    if (path === '/admin/notifications') {
      return location.pathname === '/admin/notifications';
    }
    if (path === '/admin/logs') {
      return location.pathname === '/admin/logs';
    }
    
    // Manager routes - check if any manager route is active
    if (path === '/managers') {
      return location.pathname.startsWith('/managers');
    }
    
    if (path === '/partners') {
      return location.pathname.startsWith('/partners');
    }
    
    if (path === '/users') {
      return location.pathname.startsWith('/users');
    }
    
    // For other routes, don't highlight any sidebar item to avoid confusion
    return false;
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-3 left-3 z-50 md:hidden bg-background/95 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div 
          className={cn(
            "fixed top-0 left-0 h-screen bg-sidebar/95 backdrop-blur-md border-r border-sidebar-border z-50 md:hidden transition-transform duration-300 ease-in-out",
            "w-72 sm:w-80 transform shadow-2xl",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/5ccffe54-41ae-4fc6-9a3a-3843049b907b.png" 
                alt="Amana Corporate" 
                className="h-8 w-auto"
              />
            </div>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(false)}
              className="touch-friendly"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                // Role-based filtering
                const { isAdmin } = useAuth();
                if (item.roles.includes('admin') && !isAdmin) {
                  return null;
                }
                if (item.roles.includes('manager') && !isAdmin) {
                  // TODO: Add manager role check when implemented
                  return null;
                }
                if (item.roles.includes('partner') && !isAdmin) {
                  // TODO: Add partner role check when implemented
                  return null;
                }

                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-3 py-3 rounded-md text-sm font-medium responsive-transition touch-friendly",
                        isActiveRoute(item.path)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </>
    );
  }

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar/95 backdrop-blur-sm flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out hidden md:flex",
        collapsed ? "w-16 xl:w-20" : "w-64 lg:w-72 xl:w-80"
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/5ccffe54-41ae-4fc6-9a3a-3843049b907b.png" 
              alt="Amana Corporate" 
              className="h-8 w-auto"
            />
          </div>
        )}
        {collapsed && (
          <img 
            src="/lovable-uploads/5ccffe54-41ae-4fc6-9a3a-3843049b907b.png" 
            alt="Amana Corporate" 
            className="h-8 w-8 object-contain mx-auto"
          />
        )}
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "responsive-transition touch-friendly",
            collapsed ? "ml-0" : "ml-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            // Role-based filtering
            const { isAdmin } = useAuth();
            if (item.roles.includes('admin') && !isAdmin) {
              return null;
            }
            if (item.roles.includes('manager') && !isAdmin) {
              // TODO: Add manager role check when implemented
              return null;
            }
            if (item.roles.includes('partner') && !isAdmin) {
              // TODO: Add partner role check when implemented
              return null;
            }

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md text-sm font-medium responsive-transition touch-friendly",
                    "px-3 py-2.5",
                    isActiveRoute(item.path)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed ? "justify-center px-2" : ""
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;