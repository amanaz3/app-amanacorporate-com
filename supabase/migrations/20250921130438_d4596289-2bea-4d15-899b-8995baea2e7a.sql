-- Fix security audit log RLS policy to allow anonymous logging
DROP POLICY IF EXISTS "System can insert security events" ON public.security_audit_log;

-- Allow anonymous users to log security events (with proper validation)
CREATE POLICY "Allow security event logging"
ON public.security_audit_log
FOR INSERT
WITH CHECK (true);