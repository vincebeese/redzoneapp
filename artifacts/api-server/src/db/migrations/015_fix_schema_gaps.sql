-- Fix schema gaps between what the production DB has and what the code expects.
-- All changes use IF NOT EXISTS / DO blocks so they are safe to run multiple times.

-- 1. analytics_events: production has "event" column but code uses "event_type"
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_events' AND column_name = 'event'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_events' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE analytics_events RENAME COLUMN event TO event_type;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_events' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE analytics_events ADD COLUMN event_type TEXT;
  END IF;
END $$;

-- 2. transcripts: missing call_type, raw_text, analysis, source_format columns
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transcripts' AND column_name = 'call_type'
  ) THEN
    ALTER TABLE transcripts ADD COLUMN call_type TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transcripts' AND column_name = 'raw_text'
  ) THEN
    ALTER TABLE transcripts ADD COLUMN raw_text TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transcripts' AND column_name = 'analysis'
  ) THEN
    ALTER TABLE transcripts ADD COLUMN analysis JSONB;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transcripts' AND column_name = 'source_format'
  ) THEN
    ALTER TABLE transcripts ADD COLUMN source_format TEXT DEFAULT 'text';
  END IF;
END $$;

-- 3. api_spend_log: table doesn't exist at all
CREATE TABLE IF NOT EXISTS api_spend_log (
  id          SERIAL PRIMARY KEY,
  model       TEXT NOT NULL,
  tokens_in   INTEGER DEFAULT 0,
  tokens_out  INTEGER DEFAULT 0,
  est_cost    NUMERIC(10, 6) DEFAULT 0,
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  mode_slug   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. artifact_templates: missing columns that admin panel and chat route query for
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'artifact_templates' AND column_name = 'slug'
  ) THEN
    ALTER TABLE artifact_templates ADD COLUMN slug TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'artifact_templates' AND column_name = 'offer_language'
  ) THEN
    ALTER TABLE artifact_templates ADD COLUMN offer_language TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'artifact_templates' AND column_name = 'trigger_zone'
  ) THEN
    ALTER TABLE artifact_templates ADD COLUMN trigger_zone TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'artifact_templates' AND column_name = 'trigger_condition'
  ) THEN
    ALTER TABLE artifact_templates ADD COLUMN trigger_condition TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'artifact_templates' AND column_name = 'resource_center_id'
  ) THEN
    ALTER TABLE artifact_templates ADD COLUMN resource_center_id TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'artifact_templates' AND column_name = 'resource_center_url'
  ) THEN
    ALTER TABLE artifact_templates ADD COLUMN resource_center_url TEXT;
  END IF;
END $$;
