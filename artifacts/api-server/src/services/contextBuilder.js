import { query } from '../db/index.js';
import { maybeCompress } from './compression.js';

const CALL_TYPE_LABELS = {
  discovery: 'Discovery Call',
  demo: 'Demo',
  proposal: 'Proposal Walkthrough',
  executive_briefing: 'Executive Briefing',
  objection_negotiation: 'Objection/Negotiation',
  other: 'Call',
};

function formatCallType(callType) {
  return CALL_TYPE_LABELS[callType] || 'Call';
}

/**
 * Build a single transcript's summary text for context injection.
 * Kept focused on actionable coaching signals only.
 */
function buildTranscriptSummary(t, index) {
  const a = t.analysis || {};
  if (a.parse_error) return '';

  const date = new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  let out = `\nCall ${index + 1}: ${formatCallType(t.call_type)} (${date}, ${t.word_count || 0} words)\n`;

  if (a.zone_recalibration?.changed) {
    out += `  Zone shift: ${a.zone_recalibration.from} → ${a.zone_recalibration.to}\n`;
  }

  if (a.unhandled_objections?.length > 0) {
    out += `  Open objections (${a.unhandled_objections.length}):\n`;
    a.unhandled_objections.forEach(o => {
      const text = typeof o === 'string' ? o : o.text;
      if (text) out += `    - ${text}\n`;
    });
  }

  if (a.buying_signals?.length > 0) {
    out += `  Buying signals: ${a.buying_signals.map(s => (s.text || s).substring(0, 60)).join('; ')}\n`;
  }

  if (a.pain_qualification) {
    const pq = a.pain_qualification;
    const missing = [];
    if (!pq.layer1_complete) missing.push('surface pain');
    if (!pq.layer2_complete) missing.push('business impact');
    if (!pq.layer3_complete) missing.push('personal stakes');
    if (missing.length > 0) {
      out += `  Pain gaps: ${missing.join(', ')} not fully established\n`;
    }
  }

  if (a.next_step_quality && a.next_step_quality !== 'strong') {
    out += `  Next step quality: ${a.next_step_quality}${a.next_step_note ? ` — ${a.next_step_note}` : ''}\n`;
  }

  if (a.recommended_play) {
    out += `  Priority play: ${a.recommended_play}\n`;
  }

  return out;
}

/**
 * Build transcript context with token budget awareness.
 * Newest transcripts take priority if budget is exceeded.
 * Target: keep under 3200 chars (~800 tokens).
 */
function buildTranscriptContext(transcripts) {
  const MAX_CHARS = 3200;
  let totalChars = 0;
  const included = [];
  let truncatedCount = 0;

  // Build all summaries in chronological order
  const summaries = transcripts.map((t, i) => ({
    index: i,
    text: buildTranscriptSummary(t, i),
    t,
  }));

  // Iterate newest first for budget allocation, prepend to keep chronological order
  for (let i = summaries.length - 1; i >= 0; i--) {
    const s = summaries[i];
    if (!s.text) continue;
    if (totalChars + s.text.length > MAX_CHARS) {
      truncatedCount = i + 1;
      break;
    }
    included.unshift(s);
    totalChars += s.text.length;
  }

  let out = `CALL TRANSCRIPT RECORD:\n${transcripts.length} call(s) on record for this deal.\n`;
  out += included.map(s => s.text).join('');

  if (truncatedCount > 0) {
    out += `\n[${truncatedCount} earlier call(s) on record — ask to review specific calls]\n`;
  }

  // Cumulative open objections across all included calls
  const allObjections = included.flatMap(s =>
    (s.t.analysis?.unhandled_objections || []).map(o => ({
      text: typeof o === 'string' ? o : o.text,
      play: typeof o === 'string' ? '' : o.play,
    }))
  ).filter(o => o.text);

  if (allObjections.length > 0) {
    out += `\nCUMULATIVE OPEN OBJECTIONS (across all calls):\n`;
    allObjections.forEach(o => {
      out += `  - ${o.text}${o.play ? ` → ${o.play}` : ''}\n`;
    });
  }

  return out;
}

/**
 * Build document context block from deal_documents analyses.
 * Budget: 1600 chars (~400 tokens), oldest dropped first if exceeded.
 */
function buildDocumentContext(documents) {
  const MAX_CHARS = 1600;
  let out = 'DOCUMENT REVIEW RECORD:\n';
  let totalChars = 0;
  const included = [];

  // newest first for priority
  for (let i = documents.length - 1; i >= 0; i--) {
    const doc = documents[i];
    const a = doc.analysis;
    if (!a || a.parse_error) continue;

    const date = new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    let block = `\n${doc.document_type.replace('_', ' ').toUpperCase()}: ${doc.original_filename} (${date})\n`;

    if (doc.document_type === 'proposal') {
      block += `  Assessment: ${a.overall_assessment}\n`;
      if (!a.pain_referenced) block += `  ⚠ Pain not referenced\n`;
      if (!a.cost_of_inaction_present) block += `  ⚠ No COI quantified\n`;
      if (!a.eb_perspective) block += `  ⚠ Not EB-perspective\n`;
      if (a.overall_coaching) block += `  Coach: ${a.overall_coaching}\n`;
    } else {
      if (!a.pain_quantified) block += `  ⚠ Pain not quantified\n`;
      if (!a.cost_of_inaction_present) block += `  ⚠ No COI\n`;
      if (!a.eb_ready) block += `  ⚠ Not EB-ready\n`;
      if (a.roi_assessment?.notes) block += `  ROI: ${a.roi_assessment.notes}\n`;
    }

    if (totalChars + block.length > MAX_CHARS) {
      out += `\n[${i + 1} earlier document(s) on record]\n`;
      break;
    }
    included.unshift(block);
    totalChars += block.length;
  }

  out += included.join('');
  return out;
}

/**
 * Build the deal context block from deal data, transcripts, and documents
 */
function buildDealContextBlock(deal, transcripts = [], documents = []) {
  const contextSummary = deal.context_summary || null;

  let context = `DEAL CONTEXT:
Company: ${deal.company || 'Not specified'}
Zone: ${deal.zone?.toUpperCase() || 'Not specified'}
Value: ${deal.deal_value ? `$${Number(deal.deal_value).toLocaleString()}` : 'Not provided'}
Close Date: ${deal.close_date || 'Not provided'}
Status: ${deal.status}
Deal opened: ${new Date(deal.created_at).toLocaleDateString()}
Last updated: ${new Date(deal.updated_at).toLocaleDateString()}${deal.notes ? `\n\nREP NOTES:\n${deal.notes}` : ''}

${contextSummary ? `ENTITY STATE:\n${JSON.stringify(contextSummary, null, 2)}` : 'No prior context — new deal.'}`;

  if (transcripts && transcripts.length > 0) {
    context += '\n\n' + buildTranscriptContext(transcripts);
  }

  if (documents && documents.length > 0) {
    context += '\n\n' + buildDocumentContext(documents);
  }

  return context;
}

/**
 * Assemble the full context for a Deal Mode turn
 * This is the critical context assembly per turn
 */
export async function assembleDealContext(dealId, currentInput, userId) {
  // Get deal data
  const dealResult = await query(
    `SELECT * FROM deals WHERE id = $1 AND user_id = $2`,
    [dealId, userId]
  );

  if (dealResult.rows.length === 0) {
    throw new Error('Deal not found');
  }

  const deal = dealResult.rows[0];

  // Check and maybe run compression
  const reasoningThread = await maybeCompress(dealId, userId);

  // Update deal with latest reasoning thread if compressed
  if (reasoningThread && !deal.reasoning_thread) {
    deal.reasoning_thread = JSON.stringify(reasoningThread);
  }

  // Get recent messages (last 2 exchanges = 4 messages)
  const recentMessages = await query(
    `SELECT role, content FROM messages
     WHERE deal_id = $1 AND is_compressed = false
     ORDER BY created_at DESC
     LIMIT 4`,
    [dealId]
  );

  // Get transcript summaries for context injection
  const transcriptsResult = await query(
    `SELECT id, word_count, created_at, analysis
     FROM transcripts WHERE deal_id = $1 ORDER BY created_at ASC`,
    [dealId]
  );
  const transcripts = transcriptsResult.rows;

  // Get document summaries for context injection
  const documentsResult = await query(
    `SELECT document_type, original_filename, word_count, analysis, created_at
     FROM deal_documents WHERE deal_id = $1 ORDER BY created_at ASC`,
    [dealId]
  );
  const documents = documentsResult.rows;

  // Build messages array
  const messages = [];

  // 1. Deal context block with transcript + document record (~1,500 tokens)
  messages.push({
    role: 'user',
    content: buildDealContextBlock(deal, transcripts, documents),
  });

  // 2. Reasoning thread if exists (~300 tokens)
  // reasoning_thread is JSONB, already parsed by pg driver
  if (deal.reasoning_thread) {
    messages.push({
      role: 'user',
      content: `COACHING THREAD SO FAR:\n${JSON.stringify(deal.reasoning_thread, null, 2)}`,
    });
  }

  // 3. Recent messages in chronological order (~400 tokens)
  const chronologicalMessages = recentMessages.rows.reverse();
  for (const msg of chronologicalMessages) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  // 4. Current input (~100 tokens)
  messages.push({
    role: 'user',
    content: currentInput,
  });

  return { messages, deal };
}

/**
 * Get rolling window context for Coach/Mindset modes
 * Simple: last 6 messages only, no compression
 */
export async function assembleSessionContext(sessionId, currentInput) {
  const messagesResult = await query(
    `SELECT role, content FROM session_messages
     WHERE session_id = $1
     ORDER BY created_at DESC
     LIMIT 6`,
    [sessionId]
  );

  const messages = messagesResult.rows.reverse().map((m) => ({
    role: m.role,
    content: m.content,
  }));

  messages.push({
    role: 'user',
    content: currentInput,
  });

  return { messages };
}

export default { assembleDealContext, assembleSessionContext };
