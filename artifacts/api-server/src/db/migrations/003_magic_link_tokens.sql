-- Magic link tokens for passwordless login
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mlt_token ON magic_link_tokens(token);
CREATE INDEX IF NOT EXISTS idx_mlt_user_id ON magic_link_tokens(user_id);
