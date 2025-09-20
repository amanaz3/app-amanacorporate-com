-- Ensure we have all necessary fields for the bank account application
-- Add any missing fields to customers table

-- Update customers table to ensure we have all required fields
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS preferred_bank_2 text,
ADD COLUMN IF NOT EXISTS preferred_bank_3 text,
ADD COLUMN IF NOT EXISTS any_suitable_bank boolean DEFAULT false;

-- Update account_applications table to have better structure
ALTER TABLE account_applications 
ADD COLUMN IF NOT EXISTS application_type text DEFAULT 'bank_account',
ADD COLUMN IF NOT EXISTS submission_source text DEFAULT 'web_form';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_account_applications_customer_id ON account_applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_account_applications_status ON account_applications(status);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);

-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Users can update their applications" ON account_applications;

-- Create policy for users to update their applications
CREATE POLICY "Users can update their applications" ON account_applications
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM customers 
    WHERE customers.id = account_applications.customer_id 
    AND customers.user_id = auth.uid()
  ) OR is_admin(auth.uid())
);