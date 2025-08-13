-- Update the profiles table to set users as approved by default
ALTER TABLE profiles ALTER COLUMN is_approved SET DEFAULT true;

-- Update existing users to be approved by default (if any exist)
UPDATE profiles SET is_approved = true WHERE is_approved = false;