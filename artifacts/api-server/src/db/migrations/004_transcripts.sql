CREATE TABLE IF NOT EXISTS transcripts (
  id              SERIAL PRIMARY KEY,
  deal_id         INTEGER REFERENCES deals(id) ON DELETE CASCADE,
  user_id         TEXT REFERENCES users(id) ON DELETE CASCADE,
  call_type       TEXT NOT NULL CHECK (call_type IN (
                    'discovery', 'demo', 'proposal',
                    'executive_briefing', 'objection_negotiation', 'other'
                  )),
  raw_text        TEXT NOT NULL,
  word_count      INTEGER,
  analysis        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transcripts_deal_id ON transcripts(deal_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_user_id ON transcripts(user_id);
