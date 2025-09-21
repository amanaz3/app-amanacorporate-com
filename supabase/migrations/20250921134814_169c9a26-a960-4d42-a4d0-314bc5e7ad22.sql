-- Fix the RLS policy issue by creating a public access policy for anonymous customer creation
-- This is needed for the iframe form to work without authentication

-- First, let's test if we can bypass RLS temporarily by creating a service role accessible function
CREATE OR REPLACE FUNCTION public.create_anonymous_customer(
  customer_name text,
  customer_email text,
  customer_mobile text,
  customer_company text,
  customer_license_type text,
  customer_jurisdiction text DEFAULT NULL,
  customer_preferred_bank text DEFAULT NULL,
  customer_preferred_bank_2 text DEFAULT NULL,
  customer_preferred_bank_3 text DEFAULT NULL,
  customer_any_suitable_bank boolean DEFAULT false,
  customer_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_customer_id uuid;
BEGIN
  INSERT INTO public.customers (
    name, email, mobile, company, license_type, jurisdiction,
    preferred_bank, preferred_bank_2, preferred_bank_3, any_suitable_bank,
    customer_notes, user_id, status, lead_source, amount
  ) VALUES (
    customer_name, customer_email, customer_mobile, customer_company,
    customer_license_type::license_type, customer_jurisdiction,
    customer_preferred_bank, customer_preferred_bank_2, customer_preferred_bank_3,
    customer_any_suitable_bank, customer_notes, NULL, 'Draft'::customer_status,
    'Website'::lead_source, 0
  ) RETURNING id INTO new_customer_id;
  
  RETURN new_customer_id;
END;
$$;