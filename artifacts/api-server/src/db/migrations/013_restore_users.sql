-- Restore user accounts from the original production data snapshot.
-- Password hashes are preserved exactly so existing passwords continue to work.

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'jeff@revopsimpact.us') THEN
    INSERT INTO users (id, email, password_hash, is_admin, subscription_status, has_beta_access)
    VALUES ('e4c14db4-d087-4108-8aa1-c42d0d1204f0', 'jeff@revopsimpact.us', '$2b$12$DjWTlAehEBhbScfIxJM3AufruJTNFedNO53QrA7tJrgZdCncIeYZi', true, 'active', true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'jeff@revopsimpact.com') THEN
    INSERT INTO users (id, email, password_hash, is_admin, subscription_status, has_beta_access)
    VALUES ('7811b87b-063f-4e85-bed5-e0a3dd2640f9', 'jeff@revopsimpact.com', '$2b$10$BFqKF3TlLrBQJoefLeMMN.KRKMBqIBATmr.6GGMjv2BAwQAQSGwe2', false, 'inactive', true);
  END IF;
END $$;
