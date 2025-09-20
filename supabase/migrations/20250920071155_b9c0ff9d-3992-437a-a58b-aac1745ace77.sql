-- Update partner_signup_requests table to include all required fields
ALTER TABLE partner_signup_requests 
ADD COLUMN IF NOT EXISTS partner_type text NOT NULL DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS role_at_company text,
ADD COLUMN IF NOT EXISTS business_description text,
ADD COLUMN IF NOT EXISTS otp_code text,
ADD COLUMN IF NOT EXISTS otp_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;

-- Add constraint to ensure company details are provided for company partners
ALTER TABLE partner_signup_requests 
ADD CONSTRAINT check_company_details 
CHECK (
  (partner_type = 'company' AND company_name IS NOT NULL AND role_at_company IS NOT NULL) OR
  partner_type = 'individual'
);

-- Create index for efficient OTP lookups (without time predicate due to immutability requirement)
CREATE INDEX IF NOT EXISTS idx_partner_requests_otp ON partner_signup_requests(email, otp_code);