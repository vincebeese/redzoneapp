import { useState } from 'react';

const ARTIFACT_ICONS = {
  stakeholder_map: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  business_case: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  action_plan: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  risk_report: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  followup_email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  '4f_scorecard': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  map: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  otc_scorecard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const ARTIFACT_LABELS = {
  stakeholder_map: 'Key Stakeholder Map',
  business_case: 'Business Case Draft',
  action_plan: '72-Hour Action Plan',
  risk_report: 'Risk Flag Report',
  followup_email: 'Champion Follow-Up Email',
  '4f_scorecard': '4F Deal Filter Scorecard',
  map: 'Mutual Action Plan',
  otc_scorecard: 'Own the Close™ Scorecard',
};

export default function ArtifactOffer({ artifactType, onAccept, onDecline, disabled }) {
  const [accepting, setAccepting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleAccept() {
    setAccepting(true);
    try {
      await onAccept();
      setDone(true);
    } catch (e) {
      console.error('Artifact generation failed:', e);
      setAccepting(false);
    }
  }

  if (done) return null;

  const icon = ARTIFACT_ICONS[artifactType] || ARTIFACT_ICONS.action_plan;
  const label = ARTIFACT_LABELS[artifactType] || artifactType;

  return (
    <div className="bg-gradient-to-r from-rzs-red/5 to-rzs-gold/5 border border-rzs-red/20 rounded-lg p-4 my-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-rzs-red/10 rounded-lg flex items-center justify-center text-rzs-red flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-rzs-charcoal mb-1">
            Would you like me to generate a {label}?
          </p>
          <p className="text-sm text-gray-500 mb-3">
            I'll create a customized artifact based on what we've discussed about this deal.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={disabled || accepting}
              className="px-4 py-2 bg-rzs-red text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {accepting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                'Yes, generate it'
              )}
            </button>
            <button
              onClick={onDecline}
              disabled={disabled || accepting}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to detect artifact offers in AI responses
export function parseArtifactOffer(content) {
  const patterns = [
    { type: 'stakeholder_map', regex: /\[ARTIFACT_OFFER:stakeholder_map\]/i },
    { type: 'business_case', regex: /\[ARTIFACT_OFFER:business_case\]/i },
    { type: 'action_plan', regex: /\[ARTIFACT_OFFER:action_plan\]/i },
    { type: 'risk_report', regex: /\[ARTIFACT_OFFER:risk_report\]/i },
    { type: 'followup_email', regex: /\[ARTIFACT_OFFER:followup_email\]/i },
    { type: '4f_scorecard', regex: /\[ARTIFACT_OFFER:4f_scorecard\]/i },
    { type: 'map', regex: /\[ARTIFACT_OFFER:map\]/i },
    { type: 'otc_scorecard', regex: /\[ARTIFACT_OFFER:otc_scorecard\]/i },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      return {
        type: pattern.type,
        cleanContent: content.replace(pattern.regex, '').trim(),
      };
    }
  }

  return null;
}
