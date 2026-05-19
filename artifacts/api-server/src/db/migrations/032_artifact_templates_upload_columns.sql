ALTER TABLE artifact_templates
  ADD COLUMN IF NOT EXISTS source_filename TEXT,
  ADD COLUMN IF NOT EXISTS source_format   TEXT,
  ADD COLUMN IF NOT EXISTS raw_structure   TEXT,
  ADD COLUMN IF NOT EXISTS created_by      INTEGER;
