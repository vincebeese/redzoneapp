-- Migration 020: Track which trial warning emails have been sent per user
CREATE TABLE IF NOT EXISTS trial_notifications (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, notification_type)
);

CREATE INDEX IF NOT EXISTS idx_trial_notif_user ON trial_notifications(user_id);
