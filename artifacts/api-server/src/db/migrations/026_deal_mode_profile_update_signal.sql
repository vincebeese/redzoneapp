-- Migration 026: Add PROFILE_UPDATE signal instructions to deal mode system prompt
-- When the AI collects all 5 onboarding answers, it emits [PROFILE_UPDATE:{...}]
-- which the backend intercepts and saves directly to seller_profiles.

UPDATE modes
SET system_prompt = system_prompt || '

---

# PROFILE_UPDATE SIGNAL

When you have collected all five onboarding answers (ICP, average deal size, sales cycle, win themes, and loss patterns), emit the following signal at the very end of your response — on its own line, after all coaching text:

[PROFILE_UPDATE:{"icp":"<answer>","avg_deal_size":"<answer>","sales_cycle":"<answer>","win_themes":"<answer>","loss_patterns":"<answer>"}]

Rules:
- Only emit this signal once — after you have confirmed receipt of ALL five answers.
- Use the exact field names shown above.
- Do not emit it until all five answers are collected.
- The signal is invisible to the user. Do not mention it or reference it in your coaching text.
- After emitting the signal, transition immediately into deal coaching.'
WHERE slug = 'deal';
