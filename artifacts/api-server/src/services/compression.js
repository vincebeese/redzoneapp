import { chat, COMPRESSION_MODEL } from './anthropic.js';
import { query } from '../db/index.js';

const COMPRESSION_SYSTEM_PROMPT = `You compress sales coaching conversations for context storage. Extract ONLY:
- Zone diagnosis: confirmed zone and reasoning
- Deal risks: named risks, one sentence each
- Plays recommended: play name + one-line outcome
- Open questions: unresolved coaching questions
- Key stakeholder data: names, roles, engagement status
- Contradictions or zone mismatches flagged

Return valid JSON only. No prose. No commentary.

JSON Schema:
{
  "zone_diagnosis": { "zone": "yellow|green|red", "reasoning": "string" },
  "deal_risks": [{ "risk": "string", "severity": "high|medium|low" }],
  "plays_recommended": [{ "play": "string", "outcome": "string" }],
  "open_questions": ["string"],
  "stakeholders": [{ "name": "string", "role": "string", "status": "engaged|missing|risk" }],
  "flags": ["string"]
}`;

/**
 * Compress the last N turns of a deal conversation using Haiku
 */
export async function compressWithHaiku(turns, deal) {
  const turnsText = turns.map((t) => `${t.role}: ${t.content}`).join('\n\n');

  const response = await chat({
    systemPrompt: COMPRESSION_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Deal: ${deal.name} | Company: ${deal.company || 'Unknown'}

Compress these ${turns.length} turns:

${turnsText}`,
      },
    ],
    maxTokens: 600,
    model: COMPRESSION_MODEL,
  });

  try {
    // Try to extract JSON if Haiku wrapped it in markdown code blocks
    let jsonStr = response;
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse compression response:', error);
    console.error('Raw response:', response);
    // Haiku returned prose instead of JSON — store as raw with metadata
    return {
      zone_diagnosis: { zone: deal.zone, reasoning: 'Compression parse failed - raw stored' },
      deal_risks: [],
      plays_recommended: [],
      open_questions: [],
      stakeholders: [],
      flags: ['Compression parse error - check raw field'],
      raw: response,
      error: 'parse_failed',
      turn_count: deal.turn_count,
    };
  }
}

/**
 * Check if compression should trigger and run it
 * Returns the updated deal context
 */
export async function maybeCompress(dealId, userId) {
  const dealResult = await query(
    `SELECT * FROM deals WHERE id = $1 AND user_id = $2`,
    [dealId, userId]
  );

  if (dealResult.rows.length === 0) {
    return null;
  }

  const deal = dealResult.rows[0];

  // Trigger compression every 6 turns
  if (deal.turn_count > 0 && deal.turn_count % 6 === 0) {
    // Get last 6 turns (3 user + 3 assistant)
    const messagesResult = await query(
      `SELECT role, content FROM messages
       WHERE deal_id = $1
       ORDER BY created_at DESC
       LIMIT 6`,
      [dealId]
    );

    if (messagesResult.rows.length >= 6) {
      const turns = messagesResult.rows.reverse(); // Chronological order
      const compressed = await compressWithHaiku(turns, deal);

      // Update deal with compressed context
      await query(
        `UPDATE deals SET
          reasoning_thread = $1,
          context_summary = $2,
          last_compressed_at = NOW(),
          updated_at = NOW()
         WHERE id = $3`,
        [
          JSON.stringify(compressed),
          JSON.stringify({
            zone: compressed.zone_diagnosis,
            stakeholders: compressed.stakeholders,
            risks: compressed.deal_risks,
          }),
          dealId,
        ]
      );

      // Mark old messages as compressed
      await query(
        `UPDATE messages SET is_compressed = true
         WHERE deal_id = $1 AND created_at < (
           SELECT created_at FROM messages
           WHERE deal_id = $1
           ORDER BY created_at DESC
           LIMIT 1 OFFSET 1
         )`,
        [dealId]
      );

      return compressed;
    }
  }

  // reasoning_thread is JSONB, already parsed by pg driver
  return deal.reasoning_thread || null;
}

export default { compressWithHaiku, maybeCompress };
