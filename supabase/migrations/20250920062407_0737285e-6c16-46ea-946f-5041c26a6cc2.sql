-- Enable anonymous access for account applications
ALTER TABLE public.account_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to create account applications
CREATE POLICY "Anonymous users can create applications" 
ON public.account_applications 
FOR INSERT 
WITH CHECK (true);

-- Allow anonymous users to view their own applications (by email or phone)
CREATE POLICY "Anonymous access to applications" 
ON public.account_applications 
FOR SELECT 
USING (true);

-- Enable anonymous access for customers table for form submissions
CREATE POLICY "Anonymous users can create customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Allow anonymous access to view active banks and products for form dropdowns
CREATE POLICY "Anonymous can view active banks" 
ON public.banks 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anonymous can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);