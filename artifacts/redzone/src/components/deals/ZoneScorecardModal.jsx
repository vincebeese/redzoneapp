import { useState } from 'react';

const SCORECARDS = {
  yellow: {
    label: 'Yellow Zone',
    advancing: 'Green Zone',
    color: 'zone-yellow',
    threshold: 22,
    max: 30,
    dimensions: [
      { id: 'Y1', label: 'ICP Alignment', description: 'Does this prospect match your ICP on industry, company size, and use case?' },
      { id: 'Y2', label: 'Pain Depth', description: 'Has a real, specific business pain been identified and articulated by the prospect — not assumed by you?' },
      { id: 'Y3', label: 'Priority Confirmation', description: 'Is solving this problem a top-3 priority for the business this quarter?' },
      { id: 'Y4', label: 'Economic Buyer Identified', description: 'Do you know who controls budget and has final authority to say yes?' },
      { id: 'Y5', label: '4F Filter Score', description: 'Does the deal score 3/4 or better on Fit / Friction / Funding / Forecast?' },
      { id: 'Y6', label: 'Disqualification Discipline', description: 'Have you actively looked for reasons to disqualify, not just reasons to advance?' },
    ],
  },
  green: {
    label: 'Green Zone',
    advancing: 'Red Zone',
    color: 'zone-green',
    threshold: 24,
    max: 30,
    dimensions: [
      { id: 'G1', label: 'Champion Strength', description: 'Does your champion have the will, influence, and access to drive this deal internally when you\'re not in the room?' },
      { id: 'G2', label: 'Multi-Threading', description: 'Are you engaged with 2+ stakeholders across different functions? Is the deal protected if one contact goes dark?' },
      { id: 'G3', label: 'Business Case Strength', description: 'Has a quantified business case been built — co-created with the champion and aligned to the economic buyer\'s priorities?' },
      { id: 'G4', label: 'MAP Adoption', description: 'Is a Mutual Action Plan in place with shared milestones, agreed timelines, and active champion participation?' },
      { id: 'G5', label: 'Timeline Anchored', description: 'Is the close date tied to a business event or consequence the prospect owns — not your quarter-end?' },
      { id: 'G6', label: 'Objections Preloaded', description: 'Have likely objections been surfaced and addressed proactively — before they become Red Zone blockers?' },
    ],
  },
};

function ScoreButton({ value, selected, onClick }) {
  const labels = { 1: 'Weak', 2: '', 3: 'OK', 4: '', 5: 'Strong' };
  return (
    <button
      onClick={() => onClick(value)}
      className={`w-9 h-9 rounded-lg text-sm font-semibold border-2 transition-all ${
        selected
          ? 'bg-rzs-charcoal text-white border-rzs-charcoal'
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-rzs-charcoal'
      }`}
      title={labels[value] || ''}
    >
      {value}
    </button>
  );
}

export default function ZoneScorecardModal({ fromZone, toZone, onAdvance, onCancel }) {
  const scorecard = SCORECARDS[fromZone];
  const [scores, setScores] = useState(() =>
    Object.fromEntries(scorecard.dimensions.map((d) => [d.id, 0]))
  );

  if (!scorecard) return null;

  const total = Object.values(scores).reduce((sum, v) => sum + v, 0);
  const scoredCount = Object.values(scores).filter((v) => v > 0).length;
  const allScored = scoredCount === scorecard.dimensions.length;

  const aboveThreshold = total >= scorecard.threshold;
  const atRisk = total > 0 && total < 18;

  function getScoreColor() {
    if (!allScored) return 'text-gray-400';
    if (aboveThreshold) return 'text-green-600';
    if (atRisk) return 'text-red-600';
    return 'text-rzs-gold';
  }

  function getScoreBarColor() {
    if (!allScored) return 'bg-gray-300';
    if (aboveThreshold) return 'bg-green-500';
    if (atRisk) return 'bg-rzs-red';
    return 'bg-rzs-gold';
  }

  function getStatusMessage() {
    if (!allScored) return `Score all ${scorecard.dimensions.length} dimensions to see your readiness.`;
    if (aboveThreshold) return `This deal is ready to advance. You cleared the ${scorecard.threshold}/${scorecard.max} threshold.`;
    if (atRisk) return `Score is below 18/${scorecard.max}. Consider re-qualifying before advancing.`;
    return `Below the ${scorecard.threshold}/${scorecard.max} advance threshold. You can still move forward — address the gaps in ${scorecard.advancing}.`;
  }

  const barWidth = total > 0 ? Math.min((total / scorecard.max) * 100, 100) : 0;
  const thresholdPct = (scorecard.threshold / scorecard.max) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block w-3 h-3 rounded-full bg-zone-${fromZone}`} />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {scorecard.label} Scorecard
            </span>
          </div>
          <h2 className="text-lg font-bold text-rzs-charcoal">
            Ready to advance to {scorecard.advancing}?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Score each dimension 1–5 before moving forward.
          </p>
        </div>

        {/* Dimensions */}
        <div className="px-6 py-4 space-y-5">
          {scorecard.dimensions.map((dim) => (
            <div key={dim.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs font-bold text-gray-400 mr-2">{dim.id}</span>
                  <span className="text-sm font-semibold text-rzs-charcoal">{dim.label}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{dim.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 w-9 text-center">Weak</span>
                {[1, 2, 3, 4, 5].map((v) => (
                  <ScoreButton
                    key={v}
                    value={v}
                    selected={scores[dim.id] === v}
                    onClick={(val) => setScores((prev) => ({ ...prev, [dim.id]: val }))}
                  />
                ))}
                <span className="text-xs text-gray-400 w-12 text-center">Strong</span>
              </div>
            </div>
          ))}
        </div>

        {/* Score summary */}
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Total Score</span>
              <span className={`text-2xl font-bold ${getScoreColor()}`}>
                {total}<span className="text-base font-normal text-gray-400">/{scorecard.max}</span>
              </span>
            </div>

            {/* Progress bar with threshold marker */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-visible mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getScoreBarColor()}`}
                style={{ width: `${barWidth}%` }}
              />
              {/* Threshold marker */}
              <div
                className="absolute top-[-4px] bottom-[-4px] w-0.5 bg-rzs-charcoal opacity-40 rounded"
                style={{ left: `${thresholdPct}%` }}
                title={`Advance threshold: ${scorecard.threshold}`}
              />
            </div>
            <div className="flex justify-end">
              <span className="text-xs text-gray-400">Advance threshold: {scorecard.threshold}/{scorecard.max}</span>
            </div>
            <p className={`text-xs mt-2 font-medium ${getScoreColor()}`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Keep Working
          </button>
          <button
            onClick={() => onAdvance(scores, total)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              aboveThreshold
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-rzs-charcoal hover:bg-black text-white'
            }`}
          >
            {aboveThreshold ? `Advance to ${scorecard.advancing}` : `Advance Anyway`}
          </button>
        </div>
      </div>
    </div>
  );
}
