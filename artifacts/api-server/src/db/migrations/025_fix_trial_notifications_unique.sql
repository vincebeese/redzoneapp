-- Migration 025: Fix missing unique constraint on trial_notifications
-- The unique constraint was defined in migration 020 but was not applied to
-- the production database, allowing duplicate emails to be sent.
-- This migration deduplicates existing rows and adds the constraint.

-- Step 1: Remove duplicate rows, keeping only the earliest (lowest id) per user+type
DELETE FROM trial_notifications
WHERE id NOT IN (
  SELECT MIN(id)
  FROM trial_notifications
  GROUP BY user_id, notification_type
);

-- Step 2: Add the unique constraint only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trial_notifications_user_id_notification_type_key'
      AND conrelid = 'trial_notifications'::regclass
  ) THEN
    ALTER TABLE trial_notifications
      ADD CONSTRAINT trial_notifications_user_id_notification_type_key
      UNIQUE (user_id, notification_type);
  END IF;
END $$;
