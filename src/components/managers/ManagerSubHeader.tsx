import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  AlertCircle, 
  ArrowLeft, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  UserCog,
  Users,
  Package
} from 'lucide-react';

const ManagerSubHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const subPages = [
    { 
      title: "Dashboard", 
      path: "/managers", 
      icon: BarChart3, 
      priority: "info",
      description: "Overview and statistics"
    },
    { 
      title: "Need More Info", 
      path: "/managers/need-more-info", 
      icon: AlertCircle, 
      priority: "high",
      description: "Awaiting client information"
    },
    { 
      title: "Return", 
      path: "/managers/return", 
      icon: ArrowLeft, 
      priority: "high",
      description: "Returned for corrections"
    },
    { 
      title: "Submit", 
      path: "/managers/submit", 
      icon: FileText, 
      priority: "medium",
      description: "Awaiting initial review"
    },
    { 
      title: "Draft", 
      path: "/managers/draft", 
      icon: FileText, 
      priority: "medium",
      description: "Incomplete applications"
    },
    { 
      title: "Paid", 
      path: "/managers/paid", 
      icon: DollarSign, 
      priority: "low",
      description: "Payment received"
    },
    { 
      title: "Completed", 
      path: "/managers/completed", 
      icon: CheckCircle, 
      priority: "low",
      description: "Fully processed"
    },
    { 
      title: "Rejected", 
      path: "/managers/rejected", 
      icon: XCircle, 
      priority: "low",
      description: "Final rejection"
    },
    { 
      title: "Customers", 
      path: "/customers", 
      icon: Users, 
      priority: "info",
      description: "Manage customers"
    },
    { 
      title: "Completed Applications", 
      path: "/completed", 
      icon: CheckCircle, 
      priority: "info",
      description: "View completed applications"
    },
    { 
      title: "Rejected Applications", 
      path: "/rejected", 
      icon: XCircle, 
      priority: "info",
      description: "View rejected applications"
    },
    { 
      title: "Manager Management", 
      path: "/managers/management", 
      icon: UserCog, 
      priority: "info",
      description: "Manage system managers"
    },
    { 
      title: "Product Management", 
      path: "/products", 
      icon: Package, 
      priority: "info",
      description: "Manage products"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100';
      case 'low': return 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100';
      default: return 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100';
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-background border-b border-border mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 p-4">
          {subPages.map((page) => {
            const IconComponent = page.icon;
            return (
              <Button
                key={page.path}
                variant={isActive(page.path) ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex items-center gap-2 transition-all duration-200",
                  !isActive(page.path) && getPriorityColor(page.priority)
                )}
                onClick={() => navigate(page.path)}
              >
                <IconComponent className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-xs font-medium">{page.title}</span>
                  <span className="text-xs opacity-75 hidden sm:block">{page.description}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManagerSubHeader;