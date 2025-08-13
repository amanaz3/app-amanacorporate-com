-- Create sample data for dashboards without violating foreign key constraints

-- Insert sample managers (we'll use existing user IDs if any exist, or create placeholders)
INSERT INTO managers (id, user_id, created_by, permissions, assigned_partners) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'admin' LIMIT 1), gen_random_uuid()), 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'admin' LIMIT 1), gen_random_uuid()),
   '{"can_manage_users": true, "can_manage_partners": true}',
   ARRAY[]::uuid[])
ON CONFLICT (id) DO UPDATE SET
  permissions = EXCLUDED.permissions;

-- Insert sample partners
INSERT INTO partners (id, user_id, assigned_manager, company_name, years_experience) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'user' LIMIT 1), gen_random_uuid()),
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
   'ABC Corp', 5),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'user' LIMIT 1 OFFSET 1), gen_random_uuid()),
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'XYZ Ltd', 3)
ON CONFLICT (id) DO UPDATE SET
  assigned_manager = EXCLUDED.assigned_manager,
  company_name = EXCLUDED.company_name,
  years_experience = EXCLUDED.years_experience;

-- Update manager's assigned partners
UPDATE managers 
SET assigned_partners = ARRAY['bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc']
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Add sample applications with various statuses and roles
INSERT INTO applications (
  id, 
  applicant_name, 
  email, 
  mobile, 
  company, 
  lead_source, 
  license_type, 
  amount, 
  status, 
  created_by, 
  created_by_role,
  partner_id,
  assigned_manager
) VALUES
  -- User applications (using existing user IDs or random UUIDs)
  ('11111111-aaaa-bbbb-cccc-111111111111', 'John Doe', 'john@example.com', '+1234567890', 'John Corp', 'website', 'standard', 5000, 'draft', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'user' LIMIT 1), gen_random_uuid()), 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111112', 'Jane Smith', 'jane@example.com', '+1234567891', 'Jane Ltd', 'referral', 'premium', 7500, 'need_more_info', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'user' LIMIT 1), gen_random_uuid()), 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111113', 'Bob Wilson', 'bob@example.com', '+1234567892', 'Bob Inc', 'advertisement', 'standard', 4500, 'submit', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'user' LIMIT 1), gen_random_uuid()), 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111114', 'Alice Brown', 'alice@example.com', '+1234567893', 'Alice Co', 'social_media', 'premium', 8000, 'completed', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'user' LIMIT 1), gen_random_uuid()), 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111115', 'Charlie Davis', 'charlie@example.com', '+1234567894', 'Charlie Corp', 'website', 'standard', 5500, 'paid', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'user' LIMIT 1), gen_random_uuid()), 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111116', 'Diana Evans', 'diana@example.com', '+1234567895', 'Diana Ltd', 'referral', 'premium', 9000, 'rejected', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'user' LIMIT 1), gen_random_uuid()), 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111117', 'Frank Miller', 'frank@example.com', '+1234567896', 'Frank Inc', 'advertisement', 'standard', 4000, 'return', 
   COALESCE((SELECT user_id FROM profiles WHERE role = 'user' LIMIT 1), gen_random_uuid()), 'user', NULL, NULL),
  
  -- Partner applications
  ('22222222-aaaa-bbbb-cccc-111111111111', 'Partner Client 1', 'pclient1@example.com', '+1234567897', 'PC1 Corp', 'partner_referral', 'premium', 10000, 'draft', 
   COALESCE((SELECT user_id FROM partners WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), gen_random_uuid()), 'partner', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111112', 'Partner Client 2', 'pclient2@example.com', '+1234567898', 'PC2 Ltd', 'partner_referral', 'standard', 6000, 'need_more_info', 
   COALESCE((SELECT user_id FROM partners WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), gen_random_uuid()), 'partner', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111113', 'Partner Client 3', 'pclient3@example.com', '+1234567899', 'PC3 Inc', 'partner_referral', 'premium', 12000, 'submit', 
   COALESCE((SELECT user_id FROM partners WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), gen_random_uuid()), 'partner', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111114', 'Partner Client 4', 'pclient4@example.com', '+1234567800', 'PC4 Co', 'partner_referral', 'standard', 5500, 'completed', 
   COALESCE((SELECT user_id FROM partners WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'), gen_random_uuid()), 'partner', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111115', 'Partner Client 5', 'pclient5@example.com', '+1234567801', 'PC5 Corp', 'partner_referral', 'premium', 15000, 'paid', 
   COALESCE((SELECT user_id FROM partners WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'), gen_random_uuid()), 'partner', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111116', 'Partner Client 6', 'pclient6@example.com', '+1234567802', 'PC6 Ltd', 'partner_referral', 'standard', 7000, 'rejected', 
   COALESCE((SELECT user_id FROM partners WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), gen_random_uuid()), 'partner', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111117', 'Partner Client 7', 'pclient7@example.com', '+1234567803', 'PC7 Inc', 'partner_referral', 'premium', 8500, 'return', 
   COALESCE((SELECT user_id FROM partners WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'), gen_random_uuid()), 'partner', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  
  -- Manager referral applications
  ('33333333-aaaa-bbbb-cccc-111111111111', 'Manager Referral 1', 'mref1@example.com', '+1234567804', 'MR1 Corp', 'manager_referral', 'premium', 11000, 'draft', 
   COALESCE((SELECT user_id FROM managers WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), gen_random_uuid()), 'manager', NULL, NULL),
  ('33333333-aaaa-bbbb-cccc-111111111112', 'Manager Referral 2', 'mref2@example.com', '+1234567805', 'MR2 Ltd', 'manager_referral', 'standard', 6500, 'need_more_info', 
   COALESCE((SELECT user_id FROM managers WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), gen_random_uuid()), 'manager', NULL, NULL),
  ('33333333-aaaa-bbbb-cccc-111111111113', 'Manager Referral 3', 'mref3@example.com', '+1234567806', 'MR3 Inc', 'manager_referral', 'premium', 13000, 'submit', 
   COALESCE((SELECT user_id FROM managers WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), gen_random_uuid()), 'manager', NULL, NULL),
  ('33333333-aaaa-bbbb-cccc-111111111114', 'Manager Referral 4', 'mref4@example.com', '+1234567807', 'MR4 Co', 'manager_referral', 'standard', 7500, 'completed', 
   COALESCE((SELECT user_id FROM managers WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), gen_random_uuid()), 'manager', NULL, NULL),
  ('33333333-aaaa-bbbb-cccc-111111111115', 'Manager Referral 5', 'mref5@example.com', '+1234567808', 'MR5 Corp', 'manager_referral', 'premium', 16000, 'paid', 
   COALESCE((SELECT user_id FROM managers WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), gen_random_uuid()), 'manager', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  applicant_name = EXCLUDED.applicant_name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile,
  company = EXCLUDED.company,
  lead_source = EXCLUDED.lead_source,
  license_type = EXCLUDED.license_type,
  amount = EXCLUDED.amount,
  status = EXCLUDED.status,
  created_by = EXCLUDED.created_by,
  created_by_role = EXCLUDED.created_by_role,
  partner_id = EXCLUDED.partner_id,
  assigned_manager = EXCLUDED.assigned_manager;