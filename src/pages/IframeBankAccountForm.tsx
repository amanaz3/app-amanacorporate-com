import React from 'react';
import BankAccountApplicationForm from '@/components/forms/BankAccountApplicationForm';

/**
 * Dedicated iframe-compatible page for the bank account application form
 * This page is designed to be embedded in iframes on external domains
 */
export default function IframeBankAccountForm() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bank Account Application
          </h1>
          <p className="text-muted-foreground">
            Complete your business bank account application in just a few steps
          </p>
        </div>
        
        <BankAccountApplicationForm />
      </div>
    </div>
  );
}