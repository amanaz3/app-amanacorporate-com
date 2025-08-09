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
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Managers']);
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

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-muted-foreground';
    }
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ['admin', 'user'],
    },
    {
      name: 'Managers',
      path: '/managers',
      icon: <UserCog className="h-5 w-5" />,
      roles: ['admin'],
      submenu: [
        { title: "Dashboard", path: "/managers", priority: "info" },
        { title: "Need More Info", path: "/managers/need-more-info", priority: "high" },
        { title: "Return", path: "/managers/return", priority: "high" },
        { title: "Submit", path: "/managers/submit", priority: "medium" },
        { title: "Draft", path: "/managers/draft", priority: "medium" },
        { title: "Paid", path: "/managers/paid", priority: "low" },
        { title: "Completed", path: "/managers/completed", priority: "low" },
        { title: "Rejected", path: "/managers/rejected", priority: "low" },
        { title: "Management", path: "/managers/management", priority: "info" }
      ]
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'user'],
    },
    {
      name: 'Completed Applications',
      path: '/completed',
      icon: <CheckSquare className="h-5 w-5" />,
      roles: ['admin', 'user'],
    },
    {
      name: 'Rejected Applications',
      path: '/rejected',
      icon: <XCircle className="h-5 w-5" />,
      roles: ['admin', 'user'],
    },
    {
      name: 'User Management',
      path: '/users',
      icon: <UserCog className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Product Management',
      path: '/products',
      icon: <Package className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['admin', 'user'],
    }
  ];

  const isActiveRoute = (path: string) => {
    // Exact match for most routes
    if (path === '/completed' || path === '/rejected' || path === '/settings' || path === '/users' || path === '/dashboard' || path === '/products') {
      return location.pathname === path;
    }
    
    // Manager routes - check if any manager route is active
    if (path === '/managers') {
      return location.pathname.startsWith('/managers');
    }
    
    // Special handling for customers - only active when exactly on /customers
    if (path === '/customers') {
      return location.pathname === '/customers';
    }
    
    // For customer detail pages, don't highlight any sidebar item to avoid confusion
    return false;
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu?.some(item => location.pathname === item.path);
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
                if (!isAdmin && item.roles.includes('admin') && !item.roles.includes('user')) {
                  return null;
                }

                return (
                  <li key={item.name}>
                    <div>
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
                        <span className="ml-3 flex-1">{item.name}</span>
                        {item.submenu && (
                          expandedItems.includes(item.name) ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </Link>
                      
                      {/* Mobile Submenu */}
                      {item.submenu && expandedItems.includes(item.name) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem: any) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={cn(
                                "flex items-center px-3 py-2 rounded-md text-sm",
                                location.pathname === subItem.path
                                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                              onClick={() => setMobileOpen(false)}
                            >
                              <span className={cn("flex-1", getPriorityColor(subItem.priority))}>
                                {subItem.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
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
            // Skip items that shouldn't be visible to the current user role
            if (!isAdmin && item.roles.includes('admin') && !item.roles.includes('user')) {
              return null;
            }

            return (
              <li key={item.name}>
                <div>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center rounded-md text-sm font-medium responsive-transition touch-friendly",
                      "px-3 py-2.5",
                      isActiveRoute(item.path) || isSubmenuActive(item.submenu)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed ? "justify-center px-2" : ""
                    )}
                    onClick={(e) => {
                      if (item.submenu && !collapsed) {
                        e.preventDefault();
                        toggleExpanded(item.name);
                      }
                    }}
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span className="ml-3 flex-1">{item.name}</span>
                        {item.submenu && (
                          expandedItems.includes(item.name) ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </Link>
                  
                  {/* Desktop Submenu */}
                  {item.submenu && !collapsed && expandedItems.includes(item.name) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem: any) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md text-sm responsive-transition touch-friendly",
                            location.pathname === subItem.path
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <span className={cn("flex-1", getPriorityColor(subItem.priority))}>
                            {subItem.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;