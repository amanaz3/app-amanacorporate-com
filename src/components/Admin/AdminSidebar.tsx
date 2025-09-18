import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { 
  BarChart3, 
  Users, 
  UserCog, 
  Building2, 
  FileText, 
  Settings,
  UserPlus,
  Eye,
  TrendingUp,
  UserCheck,
  FolderKanban,
  FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MenuItem {
  title: string;
  href?: string;
  icon?: React.ElementType;
  children?: MenuItem[];
}

const AdminSidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['users', 'managers', 'partners', 'applications']);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children: MenuItem[]) => 
    children.some(child => child.href && isActive(child.href));

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3
    },
    {
      title: 'Users',
      icon: Users,
      children: [
        { title: 'User Management', href: '/users', icon: Eye },
        { title: 'Create User', href: '/users/create', icon: UserPlus },
        {
          title: 'Applications',
          icon: FolderKanban,
          children: [
            { title: 'Draft', href: '/users/applications/draft' },
            { title: 'Need More Info', href: '/users/applications/need-more-info' },
            { title: 'Return', href: '/users/applications/return' },
            { title: 'Submit', href: '/users/applications/submit' },
            { title: 'Rejected', href: '/users/applications/rejected' },
            { title: 'Completed', href: '/users/applications/completed' },
            { title: 'Paid', href: '/users/applications/paid' }
          ]
        }
      ]
    },
    {
      title: 'Managers',
      icon: UserCog,
      children: [
        { title: 'Manager Management', href: '/managers', icon: Eye },
        { title: 'Create Manager', href: '/managers/create', icon: UserPlus },
        {
          title: 'Applications',
          icon: FolderKanban,
          children: [
            { title: 'Draft', href: '/managers/applications/draft' },
            { title: 'Need More Info', href: '/managers/applications/need-more-info' },
            { title: 'Return', href: '/managers/applications/return' },
            { title: 'Submit', href: '/managers/applications/submit' },
            { title: 'Rejected', href: '/managers/applications/rejected' },
            { title: 'Completed', href: '/managers/applications/completed' },
            { title: 'Paid', href: '/managers/applications/paid' }
          ]
        }
      ]
    },
    {
      title: 'Partners',
      icon: Building2,
      children: [
        { title: 'Partner Management', href: '/partners', icon: Eye },
        { title: 'Create Partner', href: '/partners/create', icon: UserPlus },
        { title: 'Partner Requests', href: '/partners/requests', icon: FileCheck },
        { title: 'Assign to Managers', href: '/partners/assign', icon: UserCheck },
        {
          title: 'Applications',
          icon: FolderKanban,
          children: [
            { title: 'Draft', href: '/partners/applications/draft' },
            { title: 'Need More Info', href: '/partners/applications/need-more-info' },
            { title: 'Return', href: '/partners/applications/return' },
            { title: 'Submit', href: '/partners/applications/submit' },
            { title: 'Rejected', href: '/partners/applications/rejected' },
            { title: 'Completed', href: '/partners/applications/completed' },
            { title: 'Paid', href: '/partners/applications/paid' }
          ]
        }
      ]
    },
    {
      title: 'Applications',
      icon: FileText,
      children: [
        { title: 'All Applications', href: '/admin/applications', icon: Eye },
        { title: 'User Applications', href: '/users/applications', icon: Users },
        { title: 'Manager Applications', href: '/managers/applications', icon: UserCog },
        { title: 'Partner Applications', href: '/partners/applications', icon: Building2 }
      ]
    },
    {
      title: 'Statistics',
      href: '/admin/statistics',
      icon: TrendingUp
    },
    {
      title: 'Settings',
      icon: Settings,
      children: [
        { title: 'General Settings', href: '/admin/settings/general' },
        { title: 'Roles & Permissions', href: '/admin/settings/roles-permissions' },
        { title: 'System Logs', href: '/admin/settings/system-logs' }
      ]
    }
  ];

  const renderMenuItem = (item: MenuItem, level: number = 0, parentKey: string = '') => {
    const menuKey = parentKey ? `${parentKey}-${item.title}` : item.title.toLowerCase();
    const isExpanded = expandedMenus.includes(menuKey);
    const hasChildren = item.children && item.children.length > 0;
    const IconComponent = item.icon;

    if (hasChildren) {
      const parentIsActive = item.children.some(child => 
        child.href && isActive(child.href) || 
        (child.children && isParentActive(child.children))
      );

      return (
        <div key={menuKey} className="mb-1">
          <Button
            variant="ghost"
            onClick={() => toggleMenu(menuKey)}
          className={cn(
            "w-full justify-start text-left h-auto py-2 px-3",
            level === 0 ? "font-medium" : "font-normal text-sm",
            level === 1 ? "ml-4" : level === 2 ? "ml-8" : "",
            parentIsActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
          >
            {IconComponent && level === 0 && <IconComponent className="mr-2 h-4 w-4" />}
            <span className="flex-1">{item.title}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          {isExpanded && (
            <div className="mt-1">
              {item.children.map(child => renderMenuItem(child, level + 1, menuKey))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={menuKey} className="mb-1">
        <Button
          variant="ghost"
          asChild
          className={cn(
            "w-full justify-start text-left h-auto py-2 px-3",
            level === 0 ? "font-medium" : "font-normal text-sm",
            level === 1 ? "ml-4" : level === 2 ? "ml-8" : "",
            isActive(item.href!) ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
        >
          <Link to={item.href!}>
            {IconComponent && level === 0 && <IconComponent className="mr-2 h-4 w-4" />}
            {IconComponent && level === 1 && <IconComponent className="mr-2 h-3 w-3" />}
            {item.title}
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <aside className="w-64 h-full bg-card border-r border-border overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Admin Portal</h2>
        <nav className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;