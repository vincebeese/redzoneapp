-- Migration 036: Create report_runs table for daily metrics report audit log
CREATE TABLE IF NOT EXISTS report_runs (
  id            SERIAL PRIMARY KEY,
  run_at        TIMESTAMPTZ DEFAULT NOW(),
  status        TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  error_message TEXT,
  metrics_snapshot JSONB
);

CREATE INDEX IF NOT EXISTS idx_report_runs_run_at ON report_runs(run_at DESC);
