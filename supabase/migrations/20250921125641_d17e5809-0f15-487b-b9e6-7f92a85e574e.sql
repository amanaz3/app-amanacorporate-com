-- CRITICAL SECURITY FIXES
-- Priority 1: Remove anonymous access to sensitive customer data

-- 1. Remove dangerous anonymous access policies from customers table
DROP POLICY IF EXISTS "Enhanced customer data protection" ON public.customers;

-- Replace with secure user-specific access only
CREATE POLICY "Users can view only their own customers"
ON public.customers
FOR SELECT
USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- 2. Remove anonymous access to account applications
DROP POLICY IF EXISTS "Anonymous access to applications" ON public.account_applications;

-- Replace with user-specific access
CREATE POLICY "Users can view their own applications"
ON public.account_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = account_applications.customer_id
    AND c.user_id = auth.uid()
  )
  OR is_admin(auth.uid())
);

-- 3. Secure system logs - remove open system access
DROP POLICY IF EXISTS "System can insert sync logs" ON public.crm_sync_logs;

-- Replace with service role only access
CREATE POLICY "Service role can insert sync logs"
ON public.crm_sync_logs
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- 4. Ensure all sensitive tables have proper RLS
-- Remove any remaining anonymous access to comments
DROP POLICY IF EXISTS "Enhanced comment access control" ON public.comments;

CREATE POLICY "Secure comment access"
ON public.comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = comments.customer_id
    AND c.user_id = auth.uid()
  )
  OR is_admin(auth.uid())
);

-- 5. Secure documents table
DROP POLICY IF EXISTS "Enhanced document access control" ON public.documents;

CREATE POLICY "Secure document access"
ON public.documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = documents.customer_id
    AND c.user_id = auth.uid()
  )
  OR is_admin(auth.uid())
);

-- 6. Fix status changes access
DROP POLICY IF EXISTS "Users can view status changes for own customers" ON public.status_changes;

CREATE POLICY "Secure status changes access"
ON public.status_changes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = status_changes.customer_id
    AND c.user_id = auth.uid()
  )
  OR is_admin(auth.uid())
);

-- 7. Create audit log for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  ip_address inet,
  user_agent text,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security audit log"
ON public.security_audit_log
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "System can insert security events"
ON public.security_audit_log
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');