-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'partner', 'user');

-- Create application status enum
CREATE TYPE application_status AS ENUM ('draft', 'need_more_info', 'return', 'submit', 'rejected', 'completed', 'paid');

-- Create license type enum
CREATE TYPE license_type AS ENUM ('mainland', 'freezone', 'offshore');

-- Create lead source enum
CREATE TYPE lead_source AS ENUM ('website', 'referral', 'social_media', 'partner', 'manager', 'other');

-- Update profiles table to include role
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(user_id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create managers table
CREATE TABLE IF NOT EXISTS managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{"can_manage_partners": false, "can_manage_users": false}'::jsonb,
  assigned_partners UUID[] DEFAULT '{}',
  created_by UUID REFERENCES profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  company_name VARCHAR,
  business_address TEXT,
  years_experience INTEGER,
  partner_level VARCHAR DEFAULT 'Bronze',
  services_provided JSONB,
  industry_specializations JSONB,
  expected_monthly_clients INTEGER,
  total_clients_count INTEGER DEFAULT 0,
  success_rate DECIMAL DEFAULT 0,
  commission_rate DECIMAL DEFAULT 0.05,
  assigned_manager UUID REFERENCES managers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table (replaces customers table concept)
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  mobile VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  license_type license_type NOT NULL,
  lead_source lead_source NOT NULL,
  amount DECIMAL NOT NULL DEFAULT 0,
  annual_turnover DECIMAL,
  jurisdiction VARCHAR,
  number_of_shareholders INTEGER DEFAULT 1,
  preferred_bank_1 VARCHAR,
  preferred_bank_2 VARCHAR,
  preferred_bank_3 VARCHAR,
  any_suitable_bank BOOLEAN DEFAULT false,
  additional_notes TEXT,
  status application_status DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES profiles(user_id),
  created_by_role user_role NOT NULL,
  assigned_manager UUID REFERENCES managers(id),
  partner_id UUID REFERENCES partners(id),
  document_checklist_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create application_documents table
CREATE TABLE IF NOT EXISTS application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_name VARCHAR NOT NULL,
  document_category VARCHAR NOT NULL, -- mandatory, optional
  is_uploaded BOOLEAN DEFAULT false,
  file_path VARCHAR,
  uploaded_by UUID REFERENCES profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create application_status_history table
CREATE TABLE IF NOT EXISTS application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  previous_status application_status,
  new_status application_status NOT NULL,
  changed_by UUID NOT NULL REFERENCES profiles(user_id),
  changed_by_role user_role NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for managers table
CREATE POLICY "Admins can manage all managers" ON managers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Managers can view their own data" ON managers
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for partners table
CREATE POLICY "Admins can manage all partners" ON partners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Managers can view assigned partners" ON partners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers, profiles
      WHERE managers.user_id = auth.uid()
      AND profiles.user_id = auth.uid()
      AND profiles.role = 'manager'
      AND partners.assigned_manager = managers.id
    )
  );

CREATE POLICY "Partners can view their own data" ON partners
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for applications table
CREATE POLICY "Admins can manage all applications" ON applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Managers can view assigned applications" ON applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM managers, profiles
      WHERE managers.user_id = auth.uid()
      AND profiles.user_id = auth.uid()
      AND profiles.role = 'manager'
      AND (applications.assigned_manager = managers.id OR applications.created_by = auth.uid())
    )
  );

CREATE POLICY "Partners can manage their own applications" ON applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'partner'
      AND applications.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own applications" ON applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'user'
      AND applications.created_by = auth.uid()
    )
  );

-- RLS Policies for application_documents table
CREATE POLICY "Users can manage documents for their applications" ON application_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = application_documents.application_id
      AND (applications.created_by = auth.uid() OR 
           EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'manager')))
    )
  );

-- RLS Policies for application_status_history table
CREATE POLICY "Users can view status history for accessible applications" ON application_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = application_status_history.application_id
      AND (applications.created_by = auth.uid() OR 
           EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'manager')))
    )
  );

CREATE POLICY "Authenticated users can insert status history" ON application_status_history
  FOR INSERT WITH CHECK (
    changed_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = application_status_history.application_id
      AND (applications.created_by = auth.uid() OR 
           EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'manager')))
    )
  );

-- Create triggers for updated_at columns
CREATE TRIGGER update_managers_updated_at
  BEFORE UPDATE ON managers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_documents_updated_at
  BEFORE UPDATE ON application_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default document templates
INSERT INTO application_documents (application_id, document_name, document_category, is_uploaded)
SELECT 
  a.id,
  doc.name,
  doc.category,
  false
FROM applications a
CROSS JOIN (
  VALUES 
    ('Passport Copy', 'mandatory'),
    ('Emirates ID Copy', 'mandatory'),
    ('Trade License Copy', 'mandatory'),
    ('Memorandum of Association (MOA)', 'mandatory'),
    ('Bank Statements (Last 6 months)', 'mandatory'),
    ('Company Profile', 'optional'),
    ('Audited Financial Statements', 'optional'),
    ('Business Plan', 'optional'),
    ('Proof of Address', 'optional'),
    ('Authorized Signatory Documents', 'optional')
) AS doc(name, category)
ON CONFLICT DO NOTHING;