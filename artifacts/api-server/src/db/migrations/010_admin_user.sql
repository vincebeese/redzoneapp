-- Create admin user if not exists
INSERT INTO users (email, password_hash, is_admin, has_beta_access, subscription_status)
VALUES (
  'vince@vincebeese.com',
  '$2b$12$c88EqqYxSaU2iKBUVDOnK.WIrN3kIlAWKTmOSbXk.68Hr/L93kaqq',
  true,
  true,
  'active'
)
ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  has_beta_access = true;
