-- Migration 018: Add UNIQUE constraint on modes.slug
-- seed.js uses ON CONFLICT (slug) which requires a unique index/constraint to exist.
-- Without this, every deploy fails at the seeding step.

ALTER TABLE modes ADD CONSTRAINT modes_slug_unique UNIQUE (slug);
