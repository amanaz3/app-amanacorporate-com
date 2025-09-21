-- Clean up all existing customer policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can update any customer" ON public.customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON public.customers;
DROP POLICY IF EXISTS "Allow customer creation for anonymous and authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can view only their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;

-- Create clean, non-conflicting policies for customers table
-- 1. INSERT policy - allow anonymous and authenticated users
CREATE POLICY "customers_insert_policy" 
ON public.customers 
FOR INSERT 
WITH CHECK (
  -- Allow anonymous submissions (user_id is NULL)
  (user_id IS NULL) OR 
  -- Allow authenticated users creating their own records
  (auth.uid() = user_id)
);

-- 2. SELECT policy - users can view their own, admins can view all
CREATE POLICY "customers_select_policy" 
ON public.customers 
FOR SELECT 
USING (
  -- Users can view their own records
  (auth.uid() = user_id) OR 
  -- Admins can view all records
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::app_role
  ))
);

-- 3. UPDATE policy - users can update their own, admins can update all
CREATE POLICY "customers_update_policy" 
ON public.customers 
FOR UPDATE 
USING (
  -- Users can update their own records
  (auth.uid() = user_id) OR 
  -- Admins can update all records
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::app_role
  ))
)
WITH CHECK (
  -- Same conditions for the updated data
  (auth.uid() = user_id) OR 
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::app_role
  ))
);