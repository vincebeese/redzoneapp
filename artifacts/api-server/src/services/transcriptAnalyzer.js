import Anthropic from '@anthropic-ai/sdk';
import { query } from '../db/index.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const ANALYSIS_MODEL = 'claude-sonnet-4-6';

const ANALYSIS_SYSTEM_PROMPT = `
You are analyzing a B2B enterprise sales call transcript using the Red Zone Selling™ framework.

Extract the following and return ONLY valid JSON matching the schema exactly. No prose. No markdown. No explanation. Raw JSON only.

Schema:
{
  "unhandled_objections": [
    { "text": "what the prospect said or implied", "play": "specific RZS play to handle it" }
  ],
  "buying_signals": [
    { "text": "exact signal from transcript", "action": "what to do with this signal" }
  ],
  "stakeholder_gaps": [
    { "name": "person name if mentioned", "role": "their role", "note": "why they matter / risk" }
  ],
  "pain_qualification": {
    "layer1_complete": true,
    "layer2_complete": false,
    "layer3_complete": false,
    "gaps": ["gap description"]
  },
  "next_step_quality": "strong|weak|missing",
  "next_step_note": "what happened at end of call",
  "zone_recalibration": {
    "changed": true,
    "from": "yellow|green|red|null",
    "to": "yellow|green|red|null",
    "reason": "why zone changed or didn't"
  },
  "recommended_play": "name of most urgent RZS play",
  "next_step": "one specific action with deadline"
}

RZS Framework reference:
- 3-Layer Pain Probe: Layer 1 = surface pain, Layer 2 = business impact, Layer 3 = personal stakes
- Zones: Yellow (qualification), Green (momentum), Red (closing)
- Key plays: 4F Filter, Stakeholder Map, MAP, Champion Activation, Multi-Thread, Cost-of-Inaction, Confident Close, Scheduled Next Step, Get Personal, Obstacle Forecast, 72-Hour Action Plan

If a field has no findings, return an empty array or null — never omit the field.
`.trim();

function logAnalysisSpend(tokensIn, tokensOut, userId) {
  const estCost = (tokensIn / 1_000_000) * 3.0 + (tokensOut / 1_000_000) * 15.0;
  query(
    `INSERT INTO api_spend_log (model, tokens_in, tokens_out, est_cost, user_id, mode_slug)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [ANALYSIS_MODEL, tokensIn, tokensOut, estCost, userId || null, 'transcript_analysis']
  ).catch((err) => console.error('Transcript spend log error:', err));
}

export async function analyzeTranscript(rawText, callType, deal, userId, isSRT = false) {
  const srtHint = isSRT
    ? '\n\nThis transcript includes timestamps in [HH:MM:SS] format. When referencing specific moments (objections, buying signals, next step quality), include the timestamp so the rep can locate the exact moment in their recording.'
    : '';

  const response = await anthropic.messages.create({
    model: ANALYSIS_MODEL,
    max_tokens: 1500,
    system: ANALYSIS_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Call type: ${callType}
Deal context: ${deal.company}, ${deal.zone} Zone, value: ${deal.deal_value || 'unknown'}, close: ${deal.close_date || 'unknown'}

Transcript:
${rawText}${srtHint}`,
      },
    ],
  });

  logAnalysisSpend(
    response.usage?.input_tokens || 0,
    response.usage?.output_tokens || 0,
    userId
  );

  try {
    const clean = response.content[0].text.trim()
      .replace(/^```(?:json)?\s*\n?/, '')
      .replace(/\n?```\s*$/, '')
      .trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error('Transcript analysis parse failed:', e);
    return { parse_error: true, raw: response.content[0].text };
  }
}

export function formatAnalysisAsMessage(analysis, transcript) {
  const callTypeLabels = {
    discovery: 'Discovery call',
    demo: 'Demo',
    proposal: 'Proposal walkthrough',
    executive_briefing: 'Executive briefing',
    objection_negotiation: 'Objection / negotiation',
    other: 'Call',
  };

  const callLabel = callTypeLabels[transcript.call_type] || transcript.call_type;
  const date = new Date(transcript.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  let content = `**${callLabel} · ${date} · ${transcript.word_count?.toLocaleString()} words analyzed**\n\n`;

  if (analysis.zone_recalibration?.changed) {
    content += `_Zone updated: ${analysis.zone_recalibration.from} → ${analysis.zone_recalibration.to}_\n`;
    if (analysis.zone_recalibration.reason) {
      content += `_${analysis.zone_recalibration.reason}_\n`;
    }
    content += '\n';
  }

  if (analysis.unhandled_objections?.length > 0) {
    content += `**Unhandled objections (${analysis.unhandled_objections.length})**\n`;
    analysis.unhandled_objections.forEach((o) => {
      content += `- ${o.text} → Run the **${o.play}**\n`;
    });
    content += '\n';
  }

  if (analysis.buying_signals?.length > 0) {
    content += `**Buying signals (${analysis.buying_signals.length})**\n`;
    analysis.buying_signals.forEach((s) => {
      content += `- ${s.text} → ${s.action}\n`;
    });
    content += '\n';
  }

  if (analysis.stakeholder_gaps?.length > 0) {
    content += `**Stakeholder gaps**\n`;
    analysis.stakeholder_gaps.forEach((g) => {
      content += `- ${g.name || 'Unknown'} (${g.role}): ${g.note}\n`;
    });
    content += '\n';
  }

  if (analysis.pain_qualification) {
    const pq = analysis.pain_qualification;
    content += `**Pain qualification**\n`;
    content += `- Layer 1 (surface pain): ${pq.layer1_complete ? '✓' : '✗'}\n`;
    content += `- Layer 2 (business impact): ${pq.layer2_complete ? '✓' : '✗'}\n`;
    content += `- Layer 3 (personal stakes): ${pq.layer3_complete ? '✓' : '✗'}\n`;
    if (pq.gaps?.length > 0) {
      pq.gaps.forEach((g) => { content += `  - Gap: ${g}\n`; });
    }
    content += '\n';
  }

  const nsq = analysis.next_step_quality;
  if (nsq === 'weak' || nsq === 'missing') {
    content += `**Next step: ${nsq === 'missing' ? 'Missing' : 'Weak'}**\n`;
    content += `${analysis.next_step_note} → **Scheduled Next Step Play**\n\n`;
  }

  if (analysis.recommended_play) {
    content += `**Recommended play:** ${analysis.recommended_play}\n\n`;
  }

  if (analysis.next_step) {
    content += `**Next step:** ${analysis.next_step}`;
  }

  return content;
}
