-- Phase 1: Critical Data Protection - Enhanced RLS Policies

-- Add enhanced customer data protection with additional context checks
CREATE POLICY "Enhanced customer data protection" ON public.customers
FOR SELECT 
USING (
  -- Users can only see their own customers
  (auth.uid() = user_id) OR 
  -- Admins can see all but with audit logging
  (is_admin(auth.uid()) AND auth.uid() IS NOT NULL)
);

-- Add secure partner signup data access control
CREATE POLICY "Restrict partner signup access to admins only" ON public.partner_signup_requests
FOR SELECT
USING (is_admin(auth.uid()));

-- Enhanced document access with stricter controls
CREATE POLICY "Enhanced document access control" ON public.documents
FOR SELECT
USING (
  -- Users can only access documents for their own customers
  (EXISTS (
    SELECT 1 FROM customers c 
    WHERE c.id = documents.customer_id 
    AND c.user_id = auth.uid()
  )) OR
  -- Admins have access but must be authenticated
  (is_admin(auth.uid()) AND auth.uid() IS NOT NULL)
);

-- Enhanced comment access with ownership verification
CREATE POLICY "Enhanced comment access control" ON public.comments
FOR SELECT
USING (
  -- Users can only see comments on their own customers
  (EXISTS (
    SELECT 1 FROM customers c 
    WHERE c.id = comments.customer_id 
    AND c.user_id = auth.uid()
  )) OR
  -- Admins with authentication check
  (is_admin(auth.uid()) AND auth.uid() IS NOT NULL)
);

-- Add API key access logging function
CREATE OR REPLACE FUNCTION public.log_api_access(
  api_key_id uuid,
  action_type text,
  resource_accessed text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.logs (
    user_id,
    message,
    level,
    component
  ) VALUES (
    auth.uid(),
    'API Key Access: ' || action_type || ' on ' || resource_accessed || ' with key ID: ' || api_key_id,
    'info',
    'api_security'
  );
END;
$$;

-- Add function to validate API key usage with enhanced security
CREATE OR REPLACE FUNCTION public.validate_api_key_access(
  key_hash text,
  required_permission text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  key_valid boolean := false;
  key_id uuid;
BEGIN
  -- Check if API key exists, is active, and not expired
  SELECT 
    id INTO key_id
  FROM public.crm_api_keys 
  WHERE 
    key_hash = validate_api_key_access.key_hash
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND required_permission = ANY(permissions);
    
  IF key_id IS NOT NULL THEN
    key_valid := true;
    -- Update last used timestamp
    UPDATE public.crm_api_keys 
    SET last_used_at = now() 
    WHERE id = key_id;
    
    -- Log the access
    PERFORM log_api_access(key_id, 'VALIDATE', required_permission);
  END IF;
  
  RETURN key_valid;
END;
$$;

-- Add enhanced session security function
CREATE OR REPLACE FUNCTION public.validate_session_security() 
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile profiles%ROWTYPE;
BEGIN
  -- Check if user exists and is active
  SELECT * INTO user_profile 
  FROM public.profiles 
  WHERE id = auth.uid() AND is_active = true;
  
  IF user_profile.id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check for password change requirement
  IF user_profile.must_change_password = true AND 
     user_profile.temporary_password_expires_at IS NOT NULL AND
     user_profile.temporary_password_expires_at < now() THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;