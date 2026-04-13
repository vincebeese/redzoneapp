-- Create or grant admin access to vince@vincebeese.com
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'vince@vincebeese.com') THEN
    INSERT INTO users (id, email, password_hash, is_admin, has_beta_access, subscription_status)
    VALUES (
      gen_random_uuid()::text,
      'vince@vincebeese.com',
      '$2b$12$c88EqqYxSaU2iKBUVDOnK.WIrN3kIlAWKTmOSbXk.68Hr/L93kaqq',
      true,
      true,
      'active'
    );
  ELSE
    UPDATE users
    SET is_admin = true, has_beta_access = true
    WHERE email = 'vince@vincebeese.com';
  END IF;
END $$;
