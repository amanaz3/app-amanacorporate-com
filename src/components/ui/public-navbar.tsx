import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn, Home } from 'lucide-react';

const PublicNavbar: React.FC = () => {
  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Home className="h-6 w-6" />
          CRM System
        </Link>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link to="/partner/signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Become a Partner
            </Link>
          </Button>
          
          <Button asChild>
            <Link to="/login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;