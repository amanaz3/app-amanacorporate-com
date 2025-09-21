-- Drop existing conflicting INSERT policies for customers table
DROP POLICY IF EXISTS "Anonymous users can create customers" ON public.customers;
DROP POLICY IF EXISTS "Users can create their own customers" ON public.customers;

-- Create a single comprehensive INSERT policy that allows both anonymous and authenticated users
CREATE POLICY "Allow customer creation for anonymous and authenticated users" 
ON public.customers 
FOR INSERT 
WITH CHECK (
  -- Allow anonymous submissions (user_id is NULL)
  (user_id IS NULL) OR 
  -- Allow authenticated users creating their own records
  (auth.uid() = user_id)
);