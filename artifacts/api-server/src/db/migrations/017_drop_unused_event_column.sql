-- Migration 017: Drop the unused 'event' column from analytics_events
-- This column was created as a side-effect of a schema conflict resolution during deployment.
-- The correct column is 'event_type', which already exists and is used by all API queries.

ALTER TABLE analytics_events DROP COLUMN IF EXISTS event;
