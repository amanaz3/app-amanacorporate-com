import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BankAccountApplicationForm from '@/components/forms/BankAccountApplicationForm';

/**
 * Authenticated page for creating bank account applications
 * Available to logged-in Partners, Managers, and other authenticated users
 */
const CreateApplication: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              New Bank Account Application
            </h1>
            <p className="text-muted-foreground">
              Create a new business bank account application for your client
            </p>
          </div>
        </div>
        
        <BankAccountApplicationForm />
      </div>
    </div>
  );
};

export default CreateApplication;