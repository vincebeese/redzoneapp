-- Migration 018: Add UNIQUE constraint on modes.slug (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'modes_slug_unique'
  ) THEN
    ALTER TABLE modes ADD CONSTRAINT modes_slug_unique UNIQUE (slug);
  END IF;
END $$;
