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
  FolderKanban
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
        { title: 'View Users', href: '/admin/users', icon: Eye },
        { title: 'Create User', href: '/admin/users/create', icon: UserPlus },
        {
          title: 'Applications',
          icon: FolderKanban,
          children: [
            { title: 'Draft', href: '/admin/users/applications/draft' },
            { title: 'Need More Info', href: '/admin/users/applications/need-more-info' },
            { title: 'Return', href: '/admin/users/applications/return' },
            { title: 'Submit', href: '/admin/users/applications/submit' },
            { title: 'Rejected', href: '/admin/users/applications/rejected' },
            { title: 'Completed', href: '/admin/users/applications/completed' },
            { title: 'Paid', href: '/admin/users/applications/paid' }
          ]
        }
      ]
    },
    {
      title: 'Managers',
      icon: UserCog,
      children: [
        { title: 'View Managers', href: '/admin/managers', icon: Eye },
        { title: 'Create Manager', href: '/admin/managers/create', icon: UserPlus },
        {
          title: 'Applications',
          icon: FolderKanban,
          children: [
            { title: 'Draft', href: '/admin/managers/applications/draft' },
            { title: 'Need More Info', href: '/admin/managers/applications/need-more-info' },
            { title: 'Return', href: '/admin/managers/applications/return' },
            { title: 'Submit', href: '/admin/managers/applications/submit' },
            { title: 'Rejected', href: '/admin/managers/applications/rejected' },
            { title: 'Completed', href: '/admin/managers/applications/completed' },
            { title: 'Paid', href: '/admin/managers/applications/paid' }
          ]
        }
      ]
    },
    {
      title: 'Partners',
      icon: Building2,
      children: [
        { title: 'View Partners', href: '/admin/partners', icon: Eye },
        { title: 'Create Partner', href: '/admin/partners/create', icon: UserPlus },
        { title: 'Assign to Managers', href: '/admin/partners/assign', icon: UserCheck },
        {
          title: 'Applications',
          icon: FolderKanban,
          children: [
            { title: 'Draft', href: '/admin/partners/applications/draft' },
            { title: 'Need More Info', href: '/admin/partners/applications/need-more-info' },
            { title: 'Return', href: '/admin/partners/applications/return' },
            { title: 'Submit', href: '/admin/partners/applications/submit' },
            { title: 'Rejected', href: '/admin/partners/applications/rejected' },
            { title: 'Completed', href: '/admin/partners/applications/completed' },
            { title: 'Paid', href: '/admin/partners/applications/paid' }
          ]
        }
      ]
    },
    {
      title: 'Applications',
      icon: FileText,
      children: [
        { title: 'All Applications', href: '/admin/applications', icon: Eye },
        { title: 'User Applications', href: '/admin/users/applications', icon: Users },
        { title: 'Manager Applications', href: '/admin/managers/applications', icon: UserCog },
        { title: 'Partner Applications', href: '/admin/partners/applications', icon: Building2 }
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