-- Migration 025: Remove duplicate trial notification rows
-- The trial_notifications table accumulated duplicate rows because the
-- unique constraint defined in migration 020 was never applied to production.
-- This migration removes existing duplicates, keeping only the earliest row
-- per user+type. Duplicate prevention is now handled in application code.

DELETE FROM trial_notifications
WHERE id NOT IN (
  SELECT MIN(id)
  FROM trial_notifications
  GROUP BY user_id, notification_type
);
