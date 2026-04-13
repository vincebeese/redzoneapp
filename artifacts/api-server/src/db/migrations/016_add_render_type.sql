-- Migration 016: Add render_type column to artifact_templates
-- The admin route queries this column; missing it causes 500 errors on the admin page.

ALTER TABLE artifact_templates ADD COLUMN IF NOT EXISTS render_type VARCHAR(50) DEFAULT 'card';
