import Anthropic from '@anthropic-ai/sdk';
import { query } from '../db/index.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SONNET = 'claude-sonnet-4-6';

function stripCodeFences(text) {
  return text.trim().replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
}

function extractJSON(text) {
  // 1. Try stripping code fences and parsing directly
  const stripped = stripCodeFences(text.trim());
  try { return JSON.parse(stripped); } catch (_) {}
  // 2. Find first { to last } in the stripped text
  const s1 = stripped.indexOf('{');
  const e1 = stripped.lastIndexOf('}');
  if (s1 !== -1 && e1 > s1) {
    try { return JSON.parse(stripped.slice(s1, e1 + 1)); } catch (_) {}
  }
  // 3. Find first { to last } in the raw text (handles preamble + fenced block)
  const s2 = text.indexOf('{');
  const e2 = text.lastIndexOf('}');
  if (s2 !== -1 && e2 > s2) {
    return JSON.parse(text.slice(s2, e2 + 1));
  }
  throw new Error('No valid JSON found in AI response');
}

function logSpend(tokensIn, tokensOut, userId, modeSlug) {
  const estCost = (tokensIn / 1_000_000) * 3.0 + (tokensOut / 1_000_000) * 15.0;
  query(
    `INSERT INTO api_spend_log (model, tokens_in, tokens_out, est_cost, user_id, mode_slug)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [SONNET, tokensIn, tokensOut, estCost, userId || null, modeSlug || null]
  ).catch((err) => console.error('Artifact spend log error:', err));
}

// ─── EXISTING 5 ARTIFACT PROMPTS (unchanged) ────────────────────────────────

const ARTIFACT_PROMPTS = {
  stakeholder_map: `Generate a Key Stakeholder Map for this deal. Include:
- Decision Maker(s) with role, influence level, and stance
- Champions/Supporters with role and engagement level
- Blockers/Skeptics with role and concerns
- Unknown/To Investigate stakeholders
- Recommended actions for each stakeholder
Format with clear sections and bullet points.`,

  business_case: `Draft a Business Case for this deal. Include:
- Executive Summary (2-3 sentences)
- Current State / Problem Statement
- Proposed Solution
- Expected Benefits (quantified where possible)
- Investment Required
- Risk Considerations
- Recommended Next Steps
Make it ready to share with the prospect's internal team.`,

  action_plan: `Create a 72-Hour Action Plan for this deal. Include:
- Immediate Actions (next 24 hours)
- Short-term Actions (24-48 hours)
- Follow-up Actions (48-72 hours)
Each action should be specific, assignable, and have a clear outcome.
Prioritize actions that move the deal forward.`,

  risk_report: `Generate a Risk Flag Report for this deal. Include:
- Critical Risks (deal-breaking potential)
- Moderate Risks (need attention)
- Low Risks (monitor)
For each risk:
- Description of the risk
- Potential impact
- Mitigation strategy
- Warning signs to watch for`,

  followup_email: `Draft a Champion Follow-Up Email for this deal. Include:
- Professional greeting
- Quick recap of value discussed
- Clear next step or ask
- Offer to provide additional resources
- Professional close
Keep it concise, action-oriented, and easy for them to forward internally.`,
};

export async function generateArtifact(artifactType, dealContext, conversationHistory) {
  const artifactPrompt = ARTIFACT_PROMPTS[artifactType];
  if (!artifactPrompt) throw new Error(`Unknown artifact type: ${artifactType}`);

  const systemPrompt = `You are an expert sales strategist generating a specific artifact for a sales deal.
Be direct, actionable, and professional. Use the deal context and conversation history to make the artifact specific and valuable.
Do not include any meta-commentary - just generate the artifact content directly.`;

  const userPrompt = `${artifactPrompt}

Deal Context:
${JSON.stringify(dealContext, null, 2)}

Recent Conversation:
${conversationHistory.map((m) => `${m.role}: ${m.content}`).join('\n\n')}

Generate the artifact now:`;

  const response = await client.messages.create({
    model: SONNET,
    max_tokens: 1500,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  logSpend(response.usage?.input_tokens || 0, response.usage?.output_tokens || 0, dealContext?.user_id, `artifact_${artifactType}`);

  return {
    type: artifactType,
    content: response.content[0].text,
    generated_at: new Date().toISOString(),
  };
}

export async function streamArtifact(artifactType, dealContext, conversationHistory, onChunk) {
  const artifactPrompt = ARTIFACT_PROMPTS[artifactType];
  if (!artifactPrompt) throw new Error(`Unknown artifact type: ${artifactType}`);

  const systemPrompt = `You are an expert sales strategist generating a specific artifact for a sales deal.
Be direct, actionable, and professional. Use the deal context and conversation history to make the artifact specific and valuable.
Do not include any meta-commentary - just generate the artifact content directly.`;

  const userPrompt = `${artifactPrompt}

Deal Context:
${JSON.stringify(dealContext, null, 2)}

Recent Conversation:
${conversationHistory.map((m) => `${m.role}: ${m.content}`).join('\n\n')}

Generate the artifact now:`;

  const stream = await client.messages.stream({
    model: SONNET,
    max_tokens: 1500,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  let fullContent = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullContent += event.delta.text;
      onChunk(event.delta.text);
    }
  }

  return { type: artifactType, content: fullContent, generated_at: new Date().toISOString() };
}

// ─── 4F DEAL FILTER SCORECARD ────────────────────────────────────────────────

const SCORECARD_4F_SYSTEM = `You are generating a 4F Deal Filter Scorecard based on a Red Zone Selling™ coaching conversation.

The 4F Deal Filter has four criteria. Each criterion has 5 checkpoints and a Pass/Fail rating.

Criteria:
01 FIT — Does the prospect match the seller's ICP and use case?
   Checkpoints: (1) Operates in a high-fit industry/vertical, (2) Company size and growth stage match ICP, (3) Compatible tech stack or infrastructure, (4) Solvable use case — problem we win often, (5) Similar successful customers / referenceability

02 FRICTION — What pain are they experiencing?
   Checkpoints: (1) Pain is clearly defined and documented by the prospect, (2) Pain owner (stakeholder) has been identified, (3) Consequence of inaction has been articulated, (4) Prospect has expressed urgency or frustration, (5) Pain is tied to a business outcome, not a preference

03 FUNDING — Do they have budget or a path to it?
   Checkpoints: (1) Budget already allocated or in-cycle, (2) Deal size fits their typical spend range, (3) Champion can secure funds if not yet approved, (4) Path to funding is clear (business case, ROI, exec approval), (5) Timeline aligns with budget cycle or fiscal urgency

04 FORECAST — Is urgency anchored to a real date?
   Checkpoints: (1) Implementation or deadline tied to a specific date, (2) External driver exists (launch, audit, renewal, market pressure), (3) Prospect has initiated next steps or begun internal evaluation, (4) Not likely to be deprioritized by competing internal initiatives, (5) Timeline is seller-confirmed, not assumed

Scoring: 3-4 Fs PASS = STRONG FIT — advance | 2 Fs PASS = CAUTION — investigate | 0-1 Fs PASS = DISQUALIFY

Based on the conversation, extract evidence for each checkpoint, assign Pass/Fail to each F, and write a 1-sentence coaching note for each.

Return ONLY valid JSON matching this schema:
{
  "company": string,
  "date": string,
  "criteria": [
    {
      "id": "01",
      "name": "FIT",
      "question": "Do they match your ICP and use case?",
      "checkpoints": [{"label": string, "evidence": string|null, "checked": boolean}],
      "verdict": "PASS"|"FAIL",
      "coaching_note": string,
      "evidence_summary": string
    }
  ],
  "score_summary": {
    "passes": number,
    "verdict": "STRONG FIT"|"CAUTION"|"DISQUALIFY",
    "verdict_note": string,
    "next_play": string
  }
}`;

async function generate4FScorecard(deal, messages, userId) {
  const conversationText = messages.slice(-20).map((m) => `${m.role}: ${m.content}`).join('\n\n');

  const response = await client.messages.create({
    model: SONNET,
    max_tokens: 2000,
    system: SCORECARD_4F_SYSTEM,
    messages: [{
      role: 'user',
      content: `Deal: ${deal.company}, ${deal.zone?.toUpperCase()} Zone, value: ${deal.deal_value || 'unknown'}, close: ${deal.close_date || 'unknown'}\nToday: ${new Date().toLocaleDateString()}\n\nConversation:\n${conversationText}`,
    }],
  });

  logSpend(response.usage?.input_tokens || 0, response.usage?.output_tokens || 0, userId, 'artifact_4f');

  let data;
  try {
    data = extractJSON(response.content[0].text);
  } catch (e) {
    console.error('4F scorecard JSON parse error:', e.message, '\nRaw:', response.content[0].text.slice(0, 200));
    return { markdown: response.content[0].text, data: null };
  }

  return { markdown: format4FScorecard(data), data };
}

function format4FScorecard(data) {
  const verdictEmoji = data.score_summary.verdict === 'STRONG FIT' ? '🟢' : data.score_summary.verdict === 'CAUTION' ? '🟡' : '🔴';

  let md = `**4F Deal Filter Scorecard — ${data.company}**\n_${data.date}_\n\n---\n\n`;

  for (const c of data.criteria || []) {
    const icon = c.verdict === 'PASS' ? '✓' : '✗';
    md += `**${c.id} ${c.name}** — ${c.verdict} ${icon}\n`;
    md += `${c.evidence_summary}\n\n`;
    md += `Checkpoints:\n`;
    for (const cp of c.checkpoints || []) {
      const box = cp.checked ? '☑' : '☐';
      md += `${box} ${cp.label}${cp.evidence ? ` — ${cp.evidence}` : ''}\n`;
    }
    md += `\n_Coach: ${c.coaching_note}_\n\n---\n\n`;
  }

  const s = data.score_summary;
  md += `**SCORECARD RESULT: ${s.passes}/4 Fs PASS**\n`;
  md += `${verdictEmoji} ${s.verdict}\n\n`;
  md += `${s.verdict_note}\n\n`;
  md += `**Next play:** ${s.next_play}`;

  return md;
}

// ─── MUTUAL ACTION PLAN ──────────────────────────────────────────────────────

const MAP_SYSTEM = `You are generating a Mutual Action Plan (MAP) based on a Red Zone Selling™ coaching conversation.

A MAP is a co-owned milestone plan that aligns buyer and seller on steps, owners, and deadlines needed to reach a signed agreement.

The MAP should include 6-10 milestones from current deal stage to signed agreement and kickoff.
Work backwards from the target close date.
Use deal zone: Yellow = start from Discovery, Green = start from Business Case, Red = start from Final Approval steps.

Standard milestones: Discovery Complete, ROI & Business Case Review, Proposal Review / Demo, Implementation Plan Review, Business Approval, Legal/Procurement Review, Security/IT Review, Final Approval, Agreement Signed, Kickoff Scheduled.

Owner format: use names from conversation where available, otherwise "(Buyer)" or "(Seller)".
Status: Completed = "Complete", Current = "In Progress", Future = "Not Started".

Return ONLY valid JSON:
{
  "company": string,
  "project_name": string,
  "target_close_date": string,
  "champion": string|null,
  "salesperson": string|null,
  "created_date": string,
  "milestones": [{"number": "01", "action": string, "owner": string, "due_date": string, "status": "Not Started"|"In Progress"|"Complete"|"At Risk", "dependencies": string|null, "notes": string|null}],
  "coaching_note": string
}`;

async function generateMAP(deal, messages, userId) {
  const conversationText = messages.slice(-20).map((m) => `${m.role}: ${m.content}`).join('\n\n');

  const response = await client.messages.create({
    model: SONNET,
    max_tokens: 2000,
    system: MAP_SYSTEM,
    messages: [{
      role: 'user',
      content: `Deal: ${deal.company}, ${deal.zone?.toUpperCase()} Zone, value: ${deal.deal_value || 'unknown'}, close: ${deal.close_date || 'unknown'}\nToday: ${new Date().toLocaleDateString()}\n\nConversation:\n${conversationText}`,
    }],
  });

  logSpend(response.usage?.input_tokens || 0, response.usage?.output_tokens || 0, userId, 'artifact_map');

  let data;
  try {
    data = extractJSON(response.content[0].text);
  } catch (e) {
    console.error('MAP JSON parse error:', e.message, '\nRaw:', response.content[0].text.slice(0, 200));
    return { markdown: response.content[0].text, data: null };
  }

  return { markdown: formatMAP(data), data };
}

function formatMAP(data) {
  let md = `**Mutual Action Plan — ${data.company}**\n`;
  md += `_Target close: ${data.target_close_date} · Created: ${data.created_date}_\n\n`;
  md += `Project: ${data.project_name}\n`;
  if (data.champion) md += `Champion: ${data.champion}`;
  if (data.champion && data.salesperson) md += `  |  `;
  if (data.salesperson) md += `Salesperson: ${data.salesperson}`;
  md += '\n\n---\n\n';
  md += `| # | Milestone | Owner | Due | Status |\n`;
  md += `|---|-----------|-------|-----|--------|\n`;

  for (const m of data.milestones || []) {
    const statusIcon = m.status === 'Complete' ? '✓' : m.status === 'In Progress' ? '→' : m.status === 'At Risk' ? '⚠' : '○';
    md += `| ${m.number} | ${m.action} | ${m.owner} | ${m.due_date} | ${statusIcon} ${m.status} |\n`;
  }

  md += `\n---\n\n`;
  md += `_Coach: ${data.coaching_note}_\n`;
  md += `_Review this MAP at the start of every client meeting. If a milestone slips, re-date it transparently — this builds trust._`;

  return md;
}

// ─── OWN THE CLOSE™ SCORECARD ────────────────────────────────────────────────

const OTC_SYSTEM = `You are generating an Own the Close™ Scorecard based on a Red Zone Selling™ coaching conversation.

SECTION 1 — Red Zone Deal Scorecard. Rate each criterion 1-5 (1=Weak, 5=Locked):
1. Stakeholder Alignment — All key decision-makers identified, engaged, aligned. Coverage gaps.
2. ROI & Business Case — Buyer can articulate value, ROI, and cost of inaction.
3. Urgency Level — A real compelling event drives the close by the target date.
4. Competitive Positioning — Differentiation is clear to the buyer and champion.
5. Procurement Readiness — Legal, Procurement, IT/Security engaged and mapped.
6. Decision Confidence — Buyer has confirmed intent, not just interest.

Score thresholds (max 30): 5-10=CRITICAL RISK | 11-15=HIGH RISK | 16-20=DEVELOPING | 21-24=COMPETITIVE | 25-30=STRONG / CLOSE

SECTION 2 — Risk Diagnosis. Answer from conversation:
1. Biggest Risk to Close, 2. Conversation You're Avoiding, 3. Stakeholder Not Fully Engaged, 4. Question You Haven't Asked, 5. If This Slips It Will Be Because...

SECTION 3 — 72-Hour Action Plan. Generate 3 actions within 24 hours AND 3 within 72 hours based on gaps.

Return ONLY valid JSON:
{
  "company": string,
  "deal_size": string|null,
  "target_close_date": string|null,
  "champion": string|null,
  "salesperson": string|null,
  "date": string,
  "section1": {
    "criteria": [{"name": string, "score": number, "notes": string, "coaching": string}],
    "total_score": number,
    "risk_level": "CRITICAL RISK"|"HIGH RISK"|"DEVELOPING"|"COMPETITIVE"|"STRONG / CLOSE",
    "risk_description": string
  },
  "section2": {"biggest_risk": string, "avoided_conversation": string, "missing_stakeholder": string, "unasked_question": string, "if_this_slips": string},
  "section3": {
    "within_24_hours": [{"action": string, "owner": string, "deadline": string}],
    "within_72_hours": [{"action": string, "owner": string, "deadline": string}]
  },
  "final_declaration": "7 Days"|"14 Days"|"30 Days"
}`;

async function generateOTCScorecard(deal, messages, userId) {
  const conversationText = messages.slice(-20).map((m) => `${m.role}: ${m.content}`).join('\n\n');

  const response = await client.messages.create({
    model: SONNET,
    max_tokens: 2000,
    system: OTC_SYSTEM,
    messages: [{
      role: 'user',
      content: `Deal: ${deal.company}, ${deal.zone?.toUpperCase()} Zone, value: ${deal.deal_value || 'unknown'}, close: ${deal.close_date || 'unknown'}\nToday: ${new Date().toLocaleDateString()}\n\nConversation:\n${conversationText}`,
    }],
  });

  logSpend(response.usage?.input_tokens || 0, response.usage?.output_tokens || 0, userId, 'artifact_otc');

  let data;
  try {
    data = extractJSON(response.content[0].text);
  } catch (e) {
    console.error('OTC scorecard JSON parse error:', e.message, '\nRaw:', response.content[0].text.slice(0, 200));
    return { markdown: response.content[0].text, data: null };
  }

  return { markdown: formatOTCScorecard(data), data };
}

function formatOTCScorecard(data) {
  const s1 = data.section1 || {};
  const s2 = data.section2 || {};
  const s3 = data.section3 || {};

  let md = `**Own the Close™ Scorecard — ${data.company}**\n`;
  md += `_${data.date}`;
  if (data.target_close_date) md += ` · Target close: ${data.target_close_date}`;
  md += '_\n';
  if (data.deal_size) md += `Deal size: ${data.deal_size}`;
  if (data.deal_size && data.champion) md += ` · `;
  if (data.champion) md += `Champion: ${data.champion}`;
  md += '\n\n---\n\n';

  md += `**SECTION 1 — Red Zone Deal Scorecard**\n\n`;
  md += `| Criterion | Score | Notes |\n|-----------|-------|-------|\n`;
  let weakCriteria = [];
  for (const c of s1.criteria || []) {
    md += `| ${c.name} | ${c.score}/5 | ${c.notes} |\n`;
    if (c.score <= 2) weakCriteria.push(c);
  }
  md += `| **TOTAL** | **${s1.total_score}/30** | |\n\n`;
  md += `**${s1.risk_level}** — ${s1.risk_description}\n`;

  if (weakCriteria.length > 0) {
    md += `\nGap coaching:\n`;
    for (const c of weakCriteria) {
      md += `- **${c.name}**: ${c.coaching}\n`;
    }
  }

  md += `\n---\n\n**SECTION 2 — Risk Diagnosis**\n\n`;
  md += `**Biggest risk to close:** ${s2.biggest_risk}\n`;
  md += `**Conversation you're avoiding:** ${s2.avoided_conversation}\n`;
  md += `**Stakeholder not fully engaged:** ${s2.missing_stakeholder}\n`;
  md += `**Question you haven't asked:** ${s2.unasked_question}\n`;
  md += `**If this slips it will be because:** ${s2.if_this_slips}\n`;

  md += `\n---\n\n**SECTION 3 — 72-Hour Action Plan**\n\n`;
  md += `Within 24 Hours:\n`;
  (s3.within_24_hours || []).forEach((a, i) => {
    md += `${i + 1}. ${a.action} — ${a.owner} — by ${a.deadline}\n`;
  });
  md += `\nWithin 72 Hours:\n`;
  (s3.within_72_hours || []).forEach((a, i) => {
    md += `${i + 1}. ${a.action} — ${a.owner} — by ${a.deadline}\n`;
  });

  md += `\n---\n\n**FINAL DECLARATION:** Close or disqualify within ${data.final_declaration}.\n\n`;
  md += `_"The closer who controls the process controls the outcome."_`;

  return md;
}

// ─── ROUTER FOR STRUCTURED ARTIFACTS ────────────────────────────────────────

export async function generateStructuredArtifact(type, deal, messages, userId) {
  switch (type) {
    case '4f_scorecard': return await generate4FScorecard(deal, messages, userId);
    case 'map': return await generateMAP(deal, messages, userId);
    case 'otc_scorecard': return await generateOTCScorecard(deal, messages, userId);
    default: throw new Error(`Unknown structured artifact type: ${type}`);
  }
}

// ─── DETECTION ───────────────────────────────────────────────────────────────

export function detectArtifactOffer(content) {
  const patterns = [
    { type: 'stakeholder_map', patterns: [/stakeholder map/i, /map out.*stakeholders/i] },
    { type: 'business_case', patterns: [/business case/i, /build a case/i] },
    { type: 'action_plan', patterns: [/action plan/i, /72.?hour/i] },
    { type: 'risk_report', patterns: [/risk.*report/i, /risk flags/i] },
    { type: 'followup_email', patterns: [/follow.?up email/i, /champion email/i] },
    { type: '4f_scorecard', patterns: [/4F Filter Scorecard/i] },
    { type: 'map', patterns: [/Mutual Action Plan/i] },
    { type: 'otc_scorecard', patterns: [/Own the Close/i] },
  ];

  for (const { type, patterns: typePatterns } of patterns) {
    for (const pattern of typePatterns) {
      if (pattern.test(content)) return type;
    }
  }

  return null;
}

// ─── TEMPLATE-BASED ARTIFACT GENERATION ─────────────────────────────────────

function formatTemplateArtifact(spec, populated) {
  let md = `**${spec.name}**\n\n`;
  populated.forEach(section => {
    md += `**${section.label}**\n`;
    switch (section.type) {
      case 'table':
        if (Array.isArray(section.data) && section.data.length > 0) {
          const cols = Object.keys(section.data[0]);
          md += '| ' + cols.join(' | ') + ' |\n';
          md += '| ' + cols.map(() => '---').join(' | ') + ' |\n';
          section.data.forEach(row => {
            md += '| ' + cols.map(c => row[c] || '—').join(' | ') + ' |\n';
          });
        }
        break;
      case 'list':
        (section.data || []).forEach(item => { md += `- ${item}\n`; });
        break;
      case 'qa_blocks':
        (section.data || []).forEach(qa => { md += `**${qa.question}**\n${qa.answer}\n\n`; });
        break;
      case 'action_plan':
        (section.data || []).forEach((action, i) => {
          md += `${i + 1}. ${action.action} — ${action.owner} — ${action.deadline}\n`;
        });
        break;
      case 'scored_rows':
        (section.data || []).forEach(row => {
          md += `- ${row.criteria}: ${row.score}/10 — ${row.notes || ''}\n`;
        });
        break;
      default:
        md += `${section.data || ''}\n`;
    }
    md += '\n';
  });
  return md;
}

export async function generateFromTemplate(templateId, deal, messages) {
  const templateResult = await query(
    `SELECT * FROM artifact_templates WHERE id = $1 AND is_active = true`,
    [templateId]
  );
  if (!templateResult.rows[0]) throw new Error('Template not found or inactive');

  const template = templateResult.rows[0];
  const spec = template.builder_spec;
  if (!spec) throw new Error('Template has no builder spec');

  const generationPrompt = `You are populating a "${spec.name}" template for a live sales deal.

${spec.generation_prompt || ''}

Deal context:
Company: ${deal.company}
Zone: ${deal.zone}
Value: ${deal.deal_value || 'unknown'}
Close date: ${deal.close_date || 'unknown'}

Recent conversation:
${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}

Return ONLY valid JSON — no prose, no code fences — as an array matching this structure:
${JSON.stringify(
  spec.sections.map(s => ({
    id: s.id,
    label: s.label,
    type: s.type,
    data: s.type === 'table'
      ? [Object.fromEntries((s.columns || ['Column']).map(c => [c, 'example']))]
      : s.type === 'list'
      ? ['item 1', 'item 2']
      : s.type === 'qa_blocks'
      ? [{ question: 'Q?', answer: 'A.' }]
      : s.type === 'action_plan'
      ? [{ action: 'Do X', owner: 'Rep', deadline: 'This week' }]
      : s.type === 'scored_rows'
      ? [{ criteria: 'Fit', score: 8, notes: 'Strong fit' }]
      : 'Content here'
  })), null, 2
)}`;

  const response = await client.messages.create({
    model: SONNET,
    max_tokens: 2000,
    system: 'You populate sales document templates from deal context. Return ONLY valid JSON array. No prose.',
    messages: [{ role: 'user', content: generationPrompt }],
  });

  logSpend(response.usage?.input_tokens || 0, response.usage?.output_tokens || 0, deal.user_id, `artifact_template_${template.slug}`);

  let populated;
  try {
    const raw = response.content[0].text;
    // Try extracting JSON array (find first [ to last ])
    const stripped = stripCodeFences(raw.trim());
    let parsed;
    try { parsed = JSON.parse(stripped); } catch (_) {
      const sa = stripped.indexOf('['), ea = stripped.lastIndexOf(']');
      if (sa !== -1 && ea > sa) parsed = JSON.parse(stripped.slice(sa, ea + 1));
      else throw new Error('No JSON array found');
    }
    populated = parsed;
  } catch (err) {
    console.error('Failed to parse template response JSON:', response.content[0].text.substring(0, 200));
    throw new Error(`Failed to parse template response: ${err.message}`);
  }

  const content = formatTemplateArtifact(spec, populated);
  const data = { spec, populated, template_id: templateId, template_name: template.name };

  return { content, data, artifact_type: 'template_artifact', markdown: content };
}
