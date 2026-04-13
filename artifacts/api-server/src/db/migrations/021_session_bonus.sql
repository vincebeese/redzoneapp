-- Migration 021: Add session_bonus for Session Pack add-on purchases
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_bonus INTEGER NOT NULL DEFAULT 0;
