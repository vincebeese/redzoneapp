-- Migration 027: Add onboarding_skipped flag to users
-- When a user opts out of the seller profile onboarding questions,
-- this flag is set so they are never asked again.

ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_skipped boolean NOT NULL DEFAULT false;
