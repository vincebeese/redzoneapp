import { Router } from 'express';
import multer from 'multer';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';
import requireSubscription from '../middleware/subscription.js';
import { streamChat, chat } from '../services/anthropic.js';
import { assembleDealContext } from '../services/contextBuilder.js';
import { getModeConfig, getSystemPrompt } from '../services/promptCache.js';
import { increment as sseIncrement, decrement as sseDecrement } from '../services/sseCounter.js';
import { buildResourceCenterBlock } from '../services/resourceCenter.js';
import { logEvent } from '../services/analytics.js';
import { parseDocument } from '../services/documentParser.js';

const router = Router();

const parseFileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = ['.pdf', '.docx', '.txt'];
    const ext = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (ext && allowed.includes(ext)) return cb(null, true);
    cb(new Error('Only PDF, Word (.docx), and text (.txt) files are supported.'));
  },
});

router.post('/parse-file', ensureUser, (req, res, next) => {
  parseFileUpload.single('file')(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large — maximum 10 MB.'
        : err.message || 'Upload failed.';
      return res.status(400).json({ error: msg });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  try {
    const result = await parseDocument(req.file);
    res.json({ text: result.text, wordCount: result.wordCount, format: result.format, filename: req.file.originalname });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Parse and strip structured signals from a completed AI response.
 * Handles [ARTIFACT_OFFER:{...}] and [TRANSCRIPT_PROMPT:{...}] tags.
 */
function extractSignals(fullText) {
  let cleanText = fullText;
  let artifactOffer = null;
  let transcriptPrompt = null;

  // Extract ARTIFACT_OFFER signal (JSON format)
  const aoJsonRegex = /\n?\[ARTIFACT_OFFER:(\{.*?\})\]/s;
  const aoJsonMatch = cleanText.match(aoJsonRegex);
  if (aoJsonMatch) {
    try { artifactOffer = JSON.parse(aoJsonMatch[1]); } catch (e) {
      console.warn('Artifact offer JSON parse failed:', e.message);
    }
    cleanText = cleanText.replace(aoJsonRegex, '').trim();
  }

  // Fallback: old plain-type format [ARTIFACT_OFFER:type]
  if (!artifactOffer) {
    const aoPlainRegex = /\n?\[ARTIFACT_OFFER:([a-z0-9_]+)\]/i;
    const aoPlainMatch = cleanText.match(aoPlainRegex);
    if (aoPlainMatch) {
      artifactOffer = { type: aoPlainMatch[1] };
      cleanText = cleanText.replace(aoPlainRegex, '').trim();
    }
  }

  // Extract TRANSCRIPT_PROMPT signal
  const tpRegex = /\n?\[TRANSCRIPT_PROMPT:(\{.*?\})\]/s;
  const tpMatch = cleanText.match(tpRegex);
  if (tpMatch) {
    try { transcriptPrompt = JSON.parse(tpMatch[1]); } catch (e) {
      console.warn('Transcript prompt JSON parse failed:', e.message);
    }
    cleanText = cleanText.replace(tpRegex, '').trim();
  }

  return { cleanText, artifactOffer, transcriptPrompt };
}

// Chat endpoint with SSE streaming
router.post('/:mode', ensureUser, requireSubscription, async (req, res) => {
  const { mode } = req.params;
  const { message, dealId, session_id } = req.body;

  // Validate session_id requirements BEFORE starting SSE stream (all non-deal modes)
  if (mode !== 'deal') {
    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' });
    }
    // Validate session ownership before streaming
    try {
      const sessionResult = await query(
        `SELECT id FROM sessions WHERE id = $1 AND user_id = $2 AND mode_slug = $3`,
        [session_id, req.user.id, mode]
      );
      if (sessionResult.rows.length === 0) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    } catch (err) {
      console.error('Session validation error:', err);
      return res.status(500).json({ error: 'Failed to validate session' });
    }
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  sseIncrement();
  res.on('close', () => sseDecrement());

  try {
    // Get mode configuration from cache
    const modeConfig = await getModeConfig(mode);

    if (!modeConfig.system_prompt) {
      res.write(`data: ${JSON.stringify({ error: 'Mode not found' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }
    let messages = [];
    let systemPrompt = modeConfig.system_prompt;

    // Inject Resource Center block for Deal and Coach modes
    if (mode === 'deal' || mode === 'coach') {
      const rcBlock = await buildResourceCenterBlock();
      if (rcBlock) systemPrompt += rcBlock;
    }

    // Inject active artifact templates into Deal Mode system prompt
    if (mode === 'deal') {
      try {
        const templatesResult = await query(`
          SELECT slug, name, offer_language, trigger_zone, trigger_condition, resource_center_id, resource_center_url
          FROM artifact_templates
          WHERE is_active = true
          ORDER BY created_at ASC
        `);
        if (templatesResult.rows.length > 0) {
          systemPrompt += '\n\n# ADDITIONAL ARTIFACTS\nThese custom artifacts are also available. Offer them using the ARTIFACT_OFFER signal.\n\n';
          templatesResult.rows.forEach(t => {
            systemPrompt += `${t.slug}:\n`;
            systemPrompt += `  Zone: ${t.trigger_zone}\n`;
            systemPrompt += `  When: ${t.trigger_condition}\n`;
            systemPrompt += `  Offer: "${t.offer_language || 'Would you like me to build this?'}"\n`;
            if (t.resource_center_url) {
              systemPrompt += `  Resource: ${t.resource_center_id || 'RC'} → ${t.resource_center_url}\n`;
            }
            systemPrompt += `  Signal: [ARTIFACT_OFFER:{"type":"${t.slug}","label":"${t.name}"}]\n\n`;
          });
        }
      } catch (err) {
        console.warn('Could not load active artifact templates:', err.message);
      }
    }

    // Handle Deal Mode context assembly
    if (mode === 'deal' && dealId) {
      const context = await assembleDealContext(dealId, message, req.user.id);
      messages = context.messages;
    } else if (session_id) {
      // Any non-deal mode with a session: fetch last 6 messages for context
      const historyResult = await query(
        `SELECT role, content FROM session_messages WHERE session_id = $1 ORDER BY created_at DESC LIMIT 6`,
        [session_id]
      );
      const history = historyResult.rows.reverse();
      messages = [...history, { role: 'user', content: message }];
    } else {
      messages = [{ role: 'user', content: message }];
    }

    // Save user message for deal mode
    if (mode === 'deal' && dealId) {
      await query(
        `INSERT INTO messages (user_id, deal_id, mode_slug, role, content)
         VALUES ($1, $2, $3, 'user', $4)`,
        [req.user.id, dealId, mode, message]
      );
      await query(
        `UPDATE deals SET turn_count = turn_count + 1, updated_at = NOW() WHERE id = $1`,
        [dealId]
      );
    }

    // Save user message for all non-deal modes
    if (mode !== 'deal' && session_id) {
      await query(
        `INSERT INTO session_messages (session_id, role, content) VALUES ($1, 'user', $2)`,
        [session_id, message]
      );
    }

    // Stream the response
    let fullResponse = '';

    await streamChat({
      systemPrompt,
      messages,
      maxTokens: modeConfig.max_tokens,
      userId: req.user.id,
      modeSlug: mode,
      onChunk: (text) => {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      },
    });

    // Save assistant response for deal mode (strip signals, send complete event)
    if (mode === 'deal' && dealId) {
      const { cleanText, artifactOffer, transcriptPrompt } = extractSignals(fullResponse);

      const savedMsg = await query(
        `INSERT INTO messages (user_id, deal_id, mode_slug, role, content)
         VALUES ($1, $2, $3, 'assistant', $4)
         RETURNING id`,
        [req.user.id, dealId, mode, cleanText]
      );
      const messageId = savedMsg.rows[0]?.id || null;

      res.write(`data: ${JSON.stringify({
        type: 'complete',
        message_id: messageId,
        artifact_offer: artifactOffer,
        transcript_prompt: transcriptPrompt,
      })}\n\n`);

      logEvent(req.user.id, 'coaching_turn', {
        mode,
        deal_id: dealId || null,
        turn_count: null,
        had_artifact_offer: !!artifactOffer,
        had_transcript_prompt: !!transcriptPrompt,
      });

      if (artifactOffer && dealId) {
        try {
          const dealRow = await query(`SELECT zone, turn_count FROM deals WHERE id = $1`, [dealId]);
          const d = dealRow.rows[0];
          logEvent(req.user.id, 'artifact_offered', {
            type: artifactOffer.type,
            label: artifactOffer.label || '',
            deal_id: dealId,
            zone: d?.zone || '',
            turn_count: d?.turn_count || 0,
          });
        } catch { /* silent */ }
      }
    } else {
      // Save assistant response and bump updated_at for all non-deal modes
      if (mode !== 'deal' && session_id) {
        await query(
          `INSERT INTO session_messages (session_id, role, content) VALUES ($1, 'assistant', $2)`,
          [session_id, fullResponse]
        );
        await query(
          `UPDATE sessions SET updated_at = NOW() WHERE id = $1`,
          [session_id]
        );
        logEvent(req.user.id, 'coaching_turn', {
          mode,
          deal_id: null,
          turn_count: null,
          had_artifact_offer: false,
          had_transcript_prompt: false,
        });
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Chat failed' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// Get opening message for new deal
router.post('/deal/opening', ensureUser, requireSubscription, async (req, res) => {
  const { dealId, zone, company } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  sseIncrement();
  res.on('close', () => sseDecrement());

  try {
    // Verify the deal belongs to the authenticated user before doing any work
    const dealCheck = await query(
      `SELECT id FROM deals WHERE id = $1 AND user_id = $2`,
      [dealId, req.user.id]
    );
    if (dealCheck.rows.length === 0) {
      res.write(`data: ${JSON.stringify({ error: 'Deal not found' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const modeConfig = await getModeConfig('deal');

    if (!modeConfig.system_prompt) {
      res.write(`data: ${JSON.stringify({ error: 'Mode not found' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const openingPrompt = `A new deal has just been opened.
Company: ${company || 'Not specified'}
Zone: ${zone.toUpperCase()} ZONE

Provide an opening coaching message appropriate for this zone.
- If Yellow Zone: Start with qualification questions
- If Green Zone: Ask about momentum and next steps
- If Red Zone: Focus on what's needed to close

Be concise but set the right tone for coaching this deal.`;

    let fullResponse = '';

    await streamChat({
      systemPrompt: modeConfig.system_prompt,
      messages: [{ role: 'user', content: openingPrompt }],
      maxTokens: modeConfig.max_tokens,
      userId: req.user.id,
      modeSlug: 'deal',
      onChunk: (text) => {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      },
    });

    // Save the opening message
    await query(
      `INSERT INTO messages (user_id, deal_id, mode_slug, role, content)
       VALUES ($1, $2, 'deal', 'assistant', $3)`,
      [req.user.id, dealId, fullResponse]
    );

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Opening message error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate opening' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// Temporal re-engagement opening (NOT saved to messages — display only)
router.post('/deal/temporal-opening', ensureUser, requireSubscription, async (req, res) => {
  const { deal_id, days_since } = req.body;
  if (!deal_id) return res.status(400).json({ error: 'deal_id required' });

  try {
    const dealResult = await query(
      `SELECT id, company, zone, deal_value, close_date, turn_count, reasoning_thread
       FROM deals WHERE id = $1 AND user_id = $2`,
      [deal_id, req.user.id]
    );
    if (!dealResult.rows.length) return res.status(404).json({ error: 'Deal not found' });

    const deal = dealResult.rows[0];

    const msgResult = await query(
      `SELECT role, content FROM messages WHERE deal_id = $1 ORDER BY created_at DESC LIMIT 3`,
      [deal_id]
    );
    const lastMessages = msgResult.rows.reverse();

    let toneInstruction;
    if (days_since <= 3) {
      toneInstruction = 'Acknowledge the gap briefly and ask what happened';
    } else if (days_since <= 7) {
      toneInstruction = 'Note that a week has passed and reference any urgency from the last session';
    } else if (days_since <= 14) {
      toneInstruction = 'Be direct — flag the risk of inactivity on this deal';
    } else {
      toneInstruction = 'Challenge the deal status directly — after 15+ days the deal health is in question';
    }

    const contextStr = deal.reasoning_thread
      ? JSON.stringify(deal.reasoning_thread, null, 2)
      : lastMessages.map(m => `${m.role}: ${m.content}`).join('\n\n');

    const prompt = `The rep is returning to this deal after ${days_since} day${days_since !== 1 ? 's' : ''} away. Generate a brief re-engagement opening message that:
- Acknowledges the time gap naturally (not robotically)
- Summarizes the deal status in 1-2 sentences
- References the last coaching action or next step that was discussed
- Asks one specific question about what happened or what changed

Tone instruction: ${toneInstruction}

Keep it under 100 words. Direct and conversational — not formal. Sound like a coach who picks up exactly where they left off.

Deal context:
Company: ${deal.company}
Zone: ${deal.zone}
Days since last session: ${days_since}
Turn count: ${deal.turn_count}
Close date: ${deal.close_date || 'Not specified'}

Last coaching context:
${contextStr}

Do NOT say "Welcome back" or "Great to see you again". Just get straight into the deal.`;

    const systemPrompt = await getSystemPrompt('deal');

    const message = await chat({
      systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 200,
      userId: req.user.id,
      modeSlug: 'temporal_reengagement',
    });

    res.json({ message });
  } catch (error) {
    console.error('Temporal opening error:', error);
    res.status(500).json({ error: 'Failed to generate temporal opening' });
  }
});

// On-demand deal recap (IS saved to messages — coaching content worth keeping)
router.post('/deal/recap', ensureUser, requireSubscription, async (req, res) => {
  const { deal_id } = req.body;
  if (!deal_id) return res.status(400).json({ error: 'deal_id required' });

  try {
    const dealResult = await query(
      `SELECT d.id, d.company, d.zone, d.deal_value, d.close_date, d.turn_count, d.reasoning_thread,
              (SELECT created_at FROM messages WHERE deal_id = d.id ORDER BY created_at DESC LIMIT 1) AS last_message_at
       FROM deals d WHERE d.id = $1 AND d.user_id = $2`,
      [deal_id, req.user.id]
    );
    if (!dealResult.rows.length) return res.status(404).json({ error: 'Deal not found' });

    const deal = dealResult.rows[0];
    const daysSince = deal.last_message_at
      ? Math.floor((Date.now() - new Date(deal.last_message_at)) / 86400000)
      : 0;

    const contextStr = deal.reasoning_thread
      ? JSON.stringify(deal.reasoning_thread, null, 2)
      : '(No coaching history yet)';

    const prompt = `Generate a structured deal recap for the rep. Use this exact format:

"Here's where we are on ${deal.company}:

Zone: ${deal.zone}
Last session: ${daysSince > 0 ? daysSince + ' day' + (daysSince !== 1 ? 's' : '') + ' ago' : 'Today'}, Turn ${deal.turn_count}

What we diagnosed:
[1-3 concise bullet points based on the coaching context below]

Last recommended play:
[Play name or action from coaching context]

Next step we agreed on:
[The specific next step from coaching context]

What to focus on today:
[One specific actionable recommendation based on time elapsed and deal status]"

Deal context:
Company: ${deal.company}
Zone: ${deal.zone}
Deal size: ${deal.deal_value ? '$' + Number(deal.deal_value).toLocaleString() : 'Not specified'}
Close date: ${deal.close_date || 'Not specified'}
Turn count: ${deal.turn_count}
Days since last session: ${daysSince}

Coaching context:
${contextStr}

Fill in only what's in the coaching context. If something isn't there, say "Not yet discussed." Keep it tight and actionable.`;

    const systemPrompt = await getSystemPrompt('deal');

    const recap = await chat({
      systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 400,
      userId: req.user.id,
      modeSlug: 'temporal_reengagement',
    });

    const insertResult = await query(
      `INSERT INTO messages (user_id, deal_id, mode_slug, role, content)
       VALUES ($1, $2, 'deal', 'assistant', $3)
       RETURNING id, role, content, created_at`,
      [req.user.id, deal_id, recap]
    );

    await query(`UPDATE deals SET updated_at = NOW() WHERE id = $1`, [deal_id]);

    res.json({ message: insertResult.rows[0] });
  } catch (error) {
    console.error('Recap error:', error);
    res.status(500).json({ error: 'Failed to generate recap' });
  }
});

export default router;
