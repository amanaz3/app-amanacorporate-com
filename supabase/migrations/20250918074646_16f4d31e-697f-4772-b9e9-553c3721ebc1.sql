-- Fix the is_admin function to properly filter by user_id parameter
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE((SELECT role = 'admin' FROM public.profiles WHERE id = $1), false);
$function$