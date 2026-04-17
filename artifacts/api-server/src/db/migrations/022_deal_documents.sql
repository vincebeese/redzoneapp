CREATE TABLE IF NOT EXISTS deal_documents (
  id               SERIAL PRIMARY KEY,
  deal_id          INTEGER NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type    TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  source_format    TEXT DEFAULT 'text',
  raw_text         TEXT,
  word_count       INTEGER DEFAULT 0,
  analysis         JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
