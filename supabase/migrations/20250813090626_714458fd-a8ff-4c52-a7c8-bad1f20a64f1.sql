-- Create sample applications data for dashboards with correct enum values

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
  -- User applications (7 applications with different statuses)
  ('11111111-aaaa-bbbb-cccc-111111111111', 'John Doe', 'john@example.com', '+1234567890', 'John Corp', 'website', 'mainland', 5000, 'draft', '44444444-4444-4444-4444-444444444444', 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111112', 'Jane Smith', 'jane@example.com', '+1234567891', 'Jane Ltd', 'referral', 'freezone', 7500, 'need_more_info', '44444444-4444-4444-4444-444444444444', 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111113', 'Bob Wilson', 'bob@example.com', '+1234567892', 'Bob Inc', 'social_media', 'offshore', 4500, 'submit', '55555555-5555-5555-5555-555555555555', 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111114', 'Alice Brown', 'alice@example.com', '+1234567893', 'Alice Co', 'social_media', 'mainland', 8000, 'completed', '55555555-5555-5555-5555-555555555555', 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111115', 'Charlie Davis', 'charlie@example.com', '+1234567894', 'Charlie Corp', 'website', 'freezone', 5500, 'paid', '44444444-4444-4444-4444-444444444444', 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111116', 'Diana Evans', 'diana@example.com', '+1234567895', 'Diana Ltd', 'referral', 'offshore', 9000, 'rejected', '55555555-5555-5555-5555-555555555555', 'user', NULL, NULL),
  ('11111111-aaaa-bbbb-cccc-111111111117', 'Frank Miller', 'frank@example.com', '+1234567896', 'Frank Inc', 'other', 'mainland', 4000, 'return', '44444444-4444-4444-4444-444444444444', 'user', NULL, NULL),
  
  -- Partner applications (7 applications with different statuses)
  ('22222222-aaaa-bbbb-cccc-111111111111', 'Partner Client 1', 'pclient1@example.com', '+1234567897', 'PC1 Corp', 'partner', 'freezone', 10000, 'draft', '33333333-3333-3333-3333-333333333333', 'partner', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111112', 'Partner Client 2', 'pclient2@example.com', '+1234567898', 'PC2 Ltd', 'partner', 'mainland', 6000, 'need_more_info', '33333333-3333-3333-3333-333333333333', 'partner', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111113', 'Partner Client 3', 'pclient3@example.com', '+1234567899', 'PC3 Inc', 'partner', 'offshore', 12000, 'submit', '33333333-3333-3333-3333-333333333333', 'partner', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111114', 'Partner Client 4', 'pclient4@example.com', '+1234567800', 'PC4 Co', 'partner', 'mainland', 5500, 'completed', '44444444-4444-4444-4444-444444444444', 'partner', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111115', 'Partner Client 5', 'pclient5@example.com', '+1234567801', 'PC5 Corp', 'partner', 'freezone', 15000, 'paid', '44444444-4444-4444-4444-444444444444', 'partner', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111116', 'Partner Client 6', 'pclient6@example.com', '+1234567802', 'PC6 Ltd', 'partner', 'offshore', 7000, 'rejected', '33333333-3333-3333-3333-333333333333', 'partner', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-111111111117', 'Partner Client 7', 'pclient7@example.com', '+1234567803', 'PC7 Inc', 'partner', 'mainland', 8500, 'return', '44444444-4444-4444-4444-444444444444', 'partner', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  
  -- Manager referral applications (5 applications with different statuses)
  ('33333333-aaaa-bbbb-cccc-111111111111', 'Manager Referral 1', 'mref1@example.com', '+1234567804', 'MR1 Corp', 'manager', 'freezone', 11000, 'draft', '22222222-2222-2222-2222-222222222222', 'manager', NULL, NULL),
  ('33333333-aaaa-bbbb-cccc-111111111112', 'Manager Referral 2', 'mref2@example.com', '+1234567805', 'MR2 Ltd', 'manager', 'mainland', 6500, 'need_more_info', '22222222-2222-2222-2222-222222222222', 'manager', NULL, NULL),
  ('33333333-aaaa-bbbb-cccc-111111111113', 'Manager Referral 3', 'mref3@example.com', '+1234567806', 'MR3 Inc', 'manager', 'offshore', 13000, 'submit', '22222222-2222-2222-2222-222222222222', 'manager', NULL, NULL),
  ('33333333-aaaa-bbbb-cccc-111111111114', 'Manager Referral 4', 'mref4@example.com', '+1234567807', 'MR4 Co', 'manager', 'mainland', 7500, 'completed', '22222222-2222-2222-2222-222222222222', 'manager', NULL, NULL),
  ('33333333-aaaa-bbbb-cccc-111111111115', 'Manager Referral 5', 'mref5@example.com', '+1234567808', 'MR5 Corp', 'manager', 'freezone', 16000, 'paid', '22222222-2222-2222-2222-222222222222', 'manager', NULL, NULL)
ON CONFLICT (id) DO NOTHING;