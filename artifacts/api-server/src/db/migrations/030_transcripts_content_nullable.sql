-- The transcripts table has a legacy `content` column (NOT NULL) from the original schema.
-- The route now uses `raw_text` as the canonical column. Drop the NOT NULL constraint
-- so inserts that only populate `raw_text` succeed, and backfill content from raw_text
-- for any rows that have raw_text but no content.

ALTER TABLE transcripts ALTER COLUMN content DROP NOT NULL;

UPDATE transcripts SET content = raw_text WHERE content IS NULL AND raw_text IS NOT NULL;
