-- Add missing UNIQUE constraints that the production schema was created without.
-- These are needed for ON CONFLICT upserts in seed.js and auth routes.
-- Wrapped in DO blocks so they are idempotent (safe to run multiple times).

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'modes_slug_key'
  ) THEN
    ALTER TABLE modes ADD CONSTRAINT modes_slug_key UNIQUE (slug);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_email_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
END $$;
