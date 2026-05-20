-- Fix double-escaped JSON quotes in artifact offer signal examples.
-- The system prompt was stored with ""type"" instead of "type" in signal examples,
-- causing JSON.parse to fail when the AI copied the format from the prompt.

-- Step 1: Fix {""type"":""  →  {"type":"
UPDATE modes SET system_prompt = REPLACE(
  system_prompt,
  '{""type"":""',
  '{"type":"'
) WHERE slug = 'deal';

-- Step 2: Fix "","label"":""  →  ","label":"
UPDATE modes SET system_prompt = REPLACE(
  system_prompt,
  '"",""label"":""',
  '","label":"'
) WHERE slug = 'deal';

-- Step 3: Fix closing ""}]  →  "}]
UPDATE modes SET system_prompt = REPLACE(
  system_prompt,
  '""}]',
  '"}]'
) WHERE slug = 'deal';

-- Step 4: Add explicit instructions for user-requested artifacts.
-- Inserted before the existing "# HANDLING EDGE CASES" section.
UPDATE modes SET system_prompt = REPLACE(
  system_prompt,
  '# HANDLING EDGE CASES',
  '# WHEN THE USER EXPLICITLY REQUESTS AN ARTIFACT

If the user directly asks you to "build", "create", "generate", or "make" an artifact
(e.g. "build the stakeholder map", "create the action plan", "make the business case"):

1. Respond with ONE brief confirming sentence: "Building your [artifact name] now."
2. Immediately emit the correct ARTIFACT_OFFER signal on its own line at the very end.
3. Do NOT describe the artifact content inline — the signal is all that is needed.
4. Do NOT ask for more information if you already have enough context from the conversation.
5. Do NOT say you cannot build it or that it requires an external system.

CRITICAL: Outputting [ARTIFACT_OFFER:{"type":"...","label":"..."}] in your response IS
how you build artifacts. The platform detects the signal in your text and renders the full
artifact automatically. You do not send it separately. You do not trigger anything external.
Including the signal text in your response IS the complete build action.

---

# HANDLING EDGE CASES'
) WHERE slug = 'deal';
