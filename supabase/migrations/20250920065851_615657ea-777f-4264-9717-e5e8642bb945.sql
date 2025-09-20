-- Allow null user_id for anonymous customer submissions
ALTER TABLE customers ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy to ensure data security with nullable user_id
DROP POLICY IF EXISTS "Enhanced customer data protection" ON customers;
CREATE POLICY "Enhanced customer data protection" 
ON customers FOR SELECT
USING (
  (user_id IS NULL AND auth.uid() IS NULL) OR  -- Anonymous submissions viewable by anonymous users
  (auth.uid() = user_id) OR                    -- Users can view their own records
  (is_admin(auth.uid()) AND auth.uid() IS NOT NULL) -- Admins can view all
);