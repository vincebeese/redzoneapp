-- Migration 008: Add builder_spec for Executive Briefing Builder template

UPDATE artifact_templates
SET builder_spec = $spec${
  "name": "Executive Briefing Builder",
  "description": "A concise executive briefing document that helps sellers prepare for C-suite conversations. Frames the deal in terms of business outcomes, strategic alignment, and clear next steps — written for executives who have limited time and high stakes.",
  "generation_prompt": "You are helping a B2B sales rep build an executive briefing document for a senior buyer conversation. Write entirely in business outcomes language — no product features, no technical jargon. Every section must be grounded in what the prospect has shared. Where information is missing, write [CONFIRM WITH PROSPECT] rather than guessing. The document should be tight, confident, and board-room ready. Build the following sections: (1) Situation Overview — 2-3 sentences describing the prospect company, their core challenge, and why solving it matters now; (2) Strategic Alignment — 3-4 bullets connecting the solution to the executive team stated priorities for the year; (3) Business Impact — a table showing Impact Area, Current State, Expected Outcome, and Estimated Annual Value using only numbers the prospect confirmed; (4) Key Stakeholders — a table showing each stakeholder name, title, their stated priority, and whether they are a champion, neutral, or blocker; (5) Key Risks and Mitigations — a short list of the top 2-3 risks to the deal and how each is being addressed; (6) Recommended Next Step — one specific action with a named owner and a target date.",
  "sections": [
    {
      "id": "situation_overview",
      "label": "Situation Overview",
      "type": "free_text",
      "required": true,
      "populated_from": "2-3 sentences covering the prospect company, their core business challenge, and the urgency of solving it — using information from the deal context and conversation history"
    },
    {
      "id": "strategic_alignment",
      "label": "Strategic Alignment",
      "type": "list",
      "required": true,
      "items": [
        "Revenue or growth goal alignment",
        "Cost reduction or efficiency gain",
        "Risk reduction or compliance",
        "Competitive or market positioning"
      ],
      "populated_from": "3-4 bullets connecting the solution to the executive team stated strategic priorities — sourced from discovery conversations and deal context"
    },
    {
      "id": "business_impact",
      "label": "Business Impact",
      "type": "table",
      "required": true,
      "columns": ["Impact Area", "Current State", "Expected Outcome", "Est. Annual Value"],
      "populated_from": "Quantified impact data from prospect-provided numbers — time saved, revenue gained, costs avoided, risk reduced. Flag any estimates as [CONFIRM WITH PROSPECT]"
    },
    {
      "id": "key_stakeholders",
      "label": "Key Stakeholders",
      "type": "table",
      "required": true,
      "columns": ["Name", "Title", "Their Priority", "Position"],
      "populated_from": "Each confirmed stakeholder in the buying committee — champion, economic buyer, technical buyer, blocker — with their stated priorities and current stance on the deal"
    },
    {
      "id": "risks_and_mitigations",
      "label": "Key Risks & Mitigations",
      "type": "list",
      "required": false,
      "populated_from": "Top 2-3 risks to deal progress (budget, timeline, internal politics, competition) with a one-sentence mitigation strategy for each"
    },
    {
      "id": "next_step",
      "label": "Recommended Next Step",
      "type": "action_plan",
      "required": true,
      "columns": ["Action", "Owner", "Deadline"],
      "populated_from": "One agreed-upon next action with a named owner and specific date — sourced from the Mutual Action Plan and confirmed with the champion"
    }
  ],
  "render_config": {
    "header_color": "#C62828",
    "accent_color": "#1A1A1A",
    "show_rzs_branding": true
  },
  "deal_context_required": ["company", "zone", "stakeholders", "strategic_priorities", "deal_value"]
}$spec$::jsonb
WHERE slug = 'executive_briefing_builder';
