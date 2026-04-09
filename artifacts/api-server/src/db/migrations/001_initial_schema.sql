-- Red Zone Selling Coach™ Database Schema
-- Version: 1.0.0

-- Users (Clerk handles auth, this stores app-specific data)
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY, -- Clerk user ID
  email         TEXT UNIQUE NOT NULL,
  is_admin      BOOLEAN DEFAULT false,
  has_beta_access BOOLEAN DEFAULT false,
  beta_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_ends_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Modes (admin-editable, loaded from DB not hardcoded)
CREATE TABLE IF NOT EXISTS modes (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  description   TEXT,
  system_prompt TEXT NOT NULL,
  max_tokens    INTEGER DEFAULT 1200,
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Deals (Deal Mode only)
CREATE TABLE IF NOT EXISTS deals (
  id              SERIAL PRIMARY KEY,
  user_id         TEXT REFERENCES users(id),
  name            TEXT NOT NULL,
  company         TEXT,
  zone            TEXT CHECK (zone IN ('yellow','green','red')),
  deal_value      NUMERIC,
  close_date      DATE,
  status          TEXT DEFAULT 'active'
                  CHECK (status IN ('active','won','lost','archived')),
  turn_count      INTEGER DEFAULT 0,
  reasoning_thread JSONB,
  context_summary  JSONB,
  last_compressed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (Deal Mode conversations)
CREATE TABLE IF NOT EXISTS messages (
  id            SERIAL PRIMARY KEY,
  user_id       TEXT REFERENCES users(id),
  deal_id       INTEGER REFERENCES deals(id) ON DELETE CASCADE,
  mode_slug     TEXT NOT NULL,
  role          TEXT CHECK (role IN ('user','assistant')),
  content       TEXT NOT NULL,
  is_compressed BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Coach Mode and Mindset Mode sessions
-- (no deal association, simple chat history)
CREATE TABLE IF NOT EXISTS sessions (
  id            SERIAL PRIMARY KEY,
  user_id       TEXT REFERENCES users(id),
  mode_slug     TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_messages (
  id            SERIAL PRIMARY KEY,
  session_id    INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  role          TEXT CHECK (role IN ('user','assistant')),
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_messages_deal_id ON messages(deal_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_messages_session_id ON session_messages(session_id);
