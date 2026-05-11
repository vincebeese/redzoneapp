-- Migration 029: Add selected_plan to users
-- Stores the plan a user chose at self-serve trial signup (founding | pro)
-- so the paywall can pre-select it when their trial expires.

ALTER TABLE users ADD COLUMN IF NOT EXISTS selected_plan text;
