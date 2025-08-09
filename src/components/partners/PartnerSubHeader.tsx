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

const PartnerSubHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const subPages = [
    { 
      title: "Dashboard", 
      path: "/partners", 
      icon: BarChart3, 
      priority: "info",
      description: "Partner overview"
    },
    { 
      title: "Need More Info", 
      path: "/partners/need-more-info", 
      icon: AlertCircle, 
      priority: "high",
      description: "Partner apps needing info"
    },
    { 
      title: "Return", 
      path: "/partners/return", 
      icon: ArrowLeft, 
      priority: "high",
      description: "Returned partner apps"
    },
    { 
      title: "Submit", 
      path: "/partners/submit", 
      icon: FileText, 
      priority: "medium",
      description: "Submitted partner apps"
    },
    { 
      title: "Draft", 
      path: "/partners/draft", 
      icon: FileText, 
      priority: "medium",
      description: "Draft partner apps"
    },
    { 
      title: "Paid", 
      path: "/partners/paid", 
      icon: DollarSign, 
      priority: "low",
      description: "Paid partner apps"
    },
    { 
      title: "Completed", 
      path: "/partners/completed", 
      icon: CheckCircle, 
      priority: "low",
      description: "Completed partner apps"
    },
    { 
      title: "Rejected", 
      path: "/partners/rejected", 
      icon: XCircle, 
      priority: "low",
      description: "Rejected partner apps"
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
      title: "Partner Management", 
      path: "/partners/management", 
      icon: UserCog, 
      priority: "info",
      description: "Manage partners"
    },
    { 
      title: "Company Management", 
      path: "/partners/company-management", 
      icon: Package, 
      priority: "info",
      description: "Manage partner companies"
    },
    { 
      title: "Partner Signup", 
      path: "/partners/signup", 
      icon: UserCog, 
      priority: "info",
      description: "Partner application form"
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

export default PartnerSubHeader;