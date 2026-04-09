import Anthropic from '@anthropic-ai/sdk';
import { query } from '../db/index.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const ANALYSIS_MODEL = 'claude-sonnet-4-6';

function logDocumentSpend(tokensIn, tokensOut, userId, documentType) {
  const estCost = (tokensIn / 1_000_000) * 3.0 + (tokensOut / 1_000_000) * 15.0;
  query(
    `INSERT INTO api_spend_log (model, tokens_in, tokens_out, est_cost, user_id, mode_slug)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [ANALYSIS_MODEL, tokensIn, tokensOut, estCost, userId || null, `document_analysis_${documentType}`]
  ).catch((err) => console.error('Document spend log error:', err));
}

const PROPOSAL_SYSTEM_PROMPT = `
You are analyzing a B2B enterprise sales proposal using the Red Zone Selling™ framework.

Assess whether this proposal leads with buyer outcomes and pain — or with product features and seller priorities.

A great RZS proposal:
- Opens with the buyer's problem in their language — not with company overview
- Quantifies the cost of inaction before presenting the solution
- Frames every capability as an outcome the buyer cares about
- Is written for the Economic Buyer — not the champion or the technical buyer
- References the specific pain confirmed in discovery
- Has a clear next step that the buyer owns

Red flags in a weak proposal:
- Leads with "About Our Company" section
- Lists features and integrations before establishing pain
- Uses seller-centric language ("our solution provides...")
- No ROI or cost of inaction quantified
- Generic — could have been sent to any prospect

Return ONLY valid JSON. No prose. No markdown. Schema provided in user message.
`.trim();

const BUSINESS_CASE_SYSTEM_PROMPT = `
You are analyzing a B2B enterprise sales business case using the Red Zone Selling™ framework.

A strong RZS business case:
- Opens with the buyer's confirmed pain in their own language
- Quantifies the cost of inaction — what does staying with the status quo actually cost per quarter?
- Ties ROI claims to the specific KPIs the economic buyer owns
- Is written to be presented by the champion to the EB — not by the seller
- Has a clear investment section that frames cost as ROI, not expense

A weak business case:
- Leads with the vendor's value proposition
- Uses generic ROI claims not tied to this prospect's numbers
- Missing cost of inaction section
- Written for the seller's pipeline review, not the buyer's internal approval
- Champion cannot present it independently

Return ONLY valid JSON. No prose. No markdown. Schema provided in user message.
`.trim();

const PROPOSAL_SCHEMA = {
  document_type: 'proposal',
  overall_assessment: 'outcome_led | feature_led | mixed',
  strengths: [{ observation: 'string' }],
  gaps: [{ issue: 'string', recommendation: 'string', play: 'string or null' }],
  discovery_alignment: { aligned: 'boolean', misalignments: ['string'] },
  pain_referenced: 'boolean',
  eb_perspective: 'boolean',
  cost_of_inaction_present: 'boolean',
  recommended_edits: [{ section: 'string', current_approach: 'string', recommended_approach: 'string' }],
  overall_coaching: 'string',
  next_step: 'string',
};

const BUSINESS_CASE_SCHEMA = {
  document_type: 'business_case',
  pain_quantified: 'boolean',
  cost_of_inaction_present: 'boolean',
  eb_ready: 'boolean',
  buyer_facing: 'boolean',
  gaps: [{ issue: 'string', recommendation: 'string' }],
  roi_assessment: { numbers_present: 'boolean', tied_to_stated_pain: 'boolean', credible: 'boolean', notes: 'string' },
  recommended_edits: [{ section: 'string', current_approach: 'string', recommended_approach: 'string' }],
  overall_coaching: 'string',
  next_step: 'string',
};

export async function analyzeDocument(rawText, documentType, deal) {
  const systemPrompt = documentType === 'proposal' ? PROPOSAL_SYSTEM_PROMPT : BUSINESS_CASE_SYSTEM_PROMPT;
  const schema = documentType === 'proposal' ? PROPOSAL_SCHEMA : BUSINESS_CASE_SCHEMA;

  const response = await anthropic.messages.create({
    model: ANALYSIS_MODEL,
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Deal context:
Company: ${deal.company}
Zone: ${deal.zone}
Value: ${deal.deal_value || 'unknown'}
Champion: ${deal.context_summary?.champion || 'unknown'}

Return analysis as JSON matching this schema exactly:
${JSON.stringify(schema, null, 2)}

Document to analyze:
${rawText}`,
      },
    ],
  });

  logDocumentSpend(
    response.usage?.input_tokens || 0,
    response.usage?.output_tokens || 0,
    deal.user_id,
    documentType
  );

  try {
    const clean = response.content[0].text
      .trim()
      .replace(/^```(?:json)?\s*\n?/, '')
      .replace(/\n?```\s*$/, '');
    return JSON.parse(clean);
  } catch (e) {
    console.error('Document analysis parse failed:', e);
    return { parse_error: true, raw: response.content[0].text, document_type: documentType };
  }
}

export function formatDocumentAnalysis(analysis, document) {
  const typeLabel = {
    proposal: 'Proposal Review',
    business_case: 'Business Case Review',
  }[document.document_type];

  const date = new Date(document.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  let content = `**${typeLabel} — ${document.original_filename}**\n_${date} · ${document.word_count?.toLocaleString() || 0} words reviewed_\n\n`;

  if (analysis.parse_error) {
    content += `Analysis could not be fully formatted. Raw output:\n\n${analysis.raw}`;
    return content;
  }

  if (document.document_type === 'proposal') {
    const verdictLabel = {
      outcome_led: '✓ Outcome-led',
      feature_led: '✗ Feature-led',
      mixed: '~ Mixed',
    }[analysis.overall_assessment] || analysis.overall_assessment;

    content += `**Overall: ${verdictLabel}**\n\n`;

    const flags = [];
    if (!analysis.pain_referenced) flags.push('Pain not referenced');
    if (!analysis.eb_perspective) flags.push('Not written for EB');
    if (!analysis.cost_of_inaction_present) flags.push('No cost of inaction');
    if (analysis.discovery_alignment && !analysis.discovery_alignment.aligned) flags.push('Misaligned with discovery');

    if (flags.length > 0) {
      content += `**Critical gaps:**\n`;
      flags.forEach(f => { content += `- ${f}\n`; });
      content += '\n';
    }

    if (analysis.gaps?.length > 0) {
      content += `**What needs to change:**\n`;
      analysis.gaps.forEach(g => {
        content += `- **${g.issue}**\n  → ${g.recommendation}\n`;
        if (g.play) content += `  Play: **${g.play}**\n`;
      });
      content += '\n';
    }

    if (!analysis.discovery_alignment?.aligned && analysis.discovery_alignment?.misalignments?.length > 0) {
      content += `**Discovery misalignments:**\n`;
      analysis.discovery_alignment.misalignments.forEach(m => { content += `- ${m}\n`; });
      content += '\n';
    }
  } else {
    const flags = [];
    if (!analysis.pain_quantified) flags.push('Pain not quantified');
    if (!analysis.cost_of_inaction_present) flags.push('No cost of inaction');
    if (!analysis.eb_ready) flags.push('Not EB-ready');
    if (!analysis.buyer_facing) flags.push('Written for seller, not buyer');

    if (flags.length > 0) {
      content += `**Critical gaps:**\n`;
      flags.forEach(f => { content += `- ${f}\n`; });
      content += '\n';
    }

    if (analysis.roi_assessment) {
      content += `**ROI assessment:** ${analysis.roi_assessment.notes}\n\n`;
    }

    if (analysis.gaps?.length > 0) {
      content += `**What needs to change:**\n`;
      analysis.gaps.forEach(g => {
        content += `- **${g.issue}**\n  → ${g.recommendation}\n`;
      });
      content += '\n';
    }
  }

  if (analysis.recommended_edits?.length > 0) {
    content += `**Specific edits:**\n`;
    analysis.recommended_edits.slice(0, 3).forEach(e => {
      content += `- **${e.section}**\n  Now: _${e.current_approach}_\n  Fix: ${e.recommended_approach}\n`;
    });
    content += '\n';
  }

  content += `**Coaching:** ${analysis.overall_coaching}\n\n`;
  content += `**Next step:** ${analysis.next_step}`;

  return content;
}
