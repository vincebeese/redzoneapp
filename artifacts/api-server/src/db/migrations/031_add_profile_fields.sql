-- Migration 031: Add user_role, has_read_rzs, common_deal_killers to seller_profiles
-- Expands the seller profile from 5 to 8 fields.
-- Also updates the deal mode system prompt to collect all 8 fields during onboarding.

-- Step 1: Add new columns
ALTER TABLE seller_profiles
  ADD COLUMN IF NOT EXISTS user_role TEXT,
  ADD COLUMN IF NOT EXISTS has_read_rzs TEXT,
  ADD COLUMN IF NOT EXISTS common_deal_killers TEXT;

-- Step 2: Update deal mode system prompt
-- Strip the old 5-field PROFILE_UPDATE SIGNAL section (added by migration 026)
-- and replace it with the new 8-field version.
UPDATE modes
SET system_prompt =
  CASE
    WHEN POSITION(E'\n\n---\n\n# PROFILE_UPDATE SIGNAL' IN system_prompt) > 0
    THEN
      LEFT(system_prompt, POSITION(E'\n\n---\n\n# PROFILE_UPDATE SIGNAL' IN system_prompt) - 1)
      || E'\n\n---\n\n# PROFILE_UPDATE SIGNAL\n\nWhen you have collected all eight onboarding answers (ICP, average deal size, sales cycle, win themes, loss patterns, user role, whether they have read Red Zone Selling, and common deal killers), emit the following signal at the very end of your response \x2014 on its own line, after all coaching text:\n\n[PROFILE_UPDATE:{"icp":"<answer>","avg_deal_size":"<answer>","sales_cycle":"<answer>","win_themes":"<answer>","loss_patterns":"<answer>","user_role":"<answer>","has_read_rzs":"<yes or no>","common_deal_killers":"<answer>"}]\n\nRules:\n- Only emit this signal once \x2014 after you have confirmed receipt of ALL eight answers.\n- Use the exact field names shown above.\n- For has_read_rzs use only "yes" or "no".\n- Do not emit it until all eight answers are collected.\n- The signal is invisible to the user. Do not mention it or reference it in your coaching text.\n- After emitting the signal, transition immediately into deal coaching.'
    ELSE
      system_prompt
      || E'\n\n---\n\n# PROFILE_UPDATE SIGNAL\n\nWhen you have collected all eight onboarding answers (ICP, average deal size, sales cycle, win themes, loss patterns, user role, whether they have read Red Zone Selling, and common deal killers), emit the following signal at the very end of your response \x2014 on its own line, after all coaching text:\n\n[PROFILE_UPDATE:{"icp":"<answer>","avg_deal_size":"<answer>","sales_cycle":"<answer>","win_themes":"<answer>","loss_patterns":"<answer>","user_role":"<answer>","has_read_rzs":"<yes or no>","common_deal_killers":"<answer>"}]\n\nRules:\n- Only emit this signal once \x2014 after you have confirmed receipt of ALL eight answers.\n- Use the exact field names shown above.\n- For has_read_rzs use only "yes" or "no".\n- Do not emit it until all eight answers are collected.\n- The signal is invisible to the user. Do not mention it or reference it in your coaching text.\n- After emitting the signal, transition immediately into deal coaching.'
  END
WHERE slug = 'deal';
