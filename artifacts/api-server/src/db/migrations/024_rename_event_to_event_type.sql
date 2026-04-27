-- Migration 024: Rename analytics_events.event to event_type
-- Dev DB had 'event' as the column name; production correctly uses 'event_type'.
-- This aligns dev with production. Safe to run on production (column won't exist there).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_events' AND column_name = 'event'
  ) THEN
    ALTER TABLE analytics_events RENAME COLUMN event TO event_type;
  END IF;
END $$;
