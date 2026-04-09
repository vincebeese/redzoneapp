import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { computeSummary, ARTIFACT_TITLES, COMPACT_HEADER_COLORS } from './artifactUtils';

const RICH_TYPES = ['4f_scorecard', 'map', 'otc_scorecard'];
const STATUS_CYCLE = ['Not Started', 'In Progress', 'Complete', 'At Risk'];

// Font scale helper — makes text readable in Artifacts tab full view
function fs(base, dm) {
  if (dm !== 'tab') return base;
  if (base <= 8) return 11;
  if (base <= 9) return 12;
  if (base <= 10) return 13;
  return base;
}

// ─── SHARED VISUAL COMPONENTS ─────────────────────────────────────────────────

const STATUS_STYLES = {
  'Not Started': { background: '#F2F2F2', color: '#555555' },
  'In Progress':  { background: '#FFF2CC', color: '#B85C00' },
  'Complete':     { background: '#D9EAD3', color: '#1E6B3A' },
  'At Risk':      { background: '#F5CCCC', color: '#7B0000' },
};

function StatusBadge({ status, onClick }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Not Started'];
  return (
    <span
      onClick={onClick}
      style={{ ...s, fontSize: 8, fontWeight: 'bold', padding: '2px 7px', display: 'inline-block', whiteSpace: 'nowrap', cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}
      title={onClick ? 'Click to cycle status' : undefined}
    >
      {status}
    </span>
  );
}

function Checkbox({ checked, onClick }) {
  return (
    <span
      onClick={onClick}
      title={checked ? 'Click to uncheck' : 'Click to check'}
      style={{
        display: 'inline-block', width: 11, height: 11, minWidth: 11, marginTop: 1, borderRadius: 1,
        background: checked ? '#C62828' : 'transparent',
        border: checked ? 'none' : '1px solid #ccc',
        cursor: 'pointer', verticalAlign: 'middle', flexShrink: 0,
      }}
    />
  );
}

function ScoreDots({ score, max = 5, onSetScore }) {
  const color = score <= 2 ? '#CC0000' : score === 3 ? '#B85C00' : '#1E6B3A';
  return (
    <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 4 }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          onClick={onSetScore ? () => onSetScore(i + 1) : undefined}
          title={onSetScore ? `Set score to ${i + 1}` : undefined}
          style={{
            display: 'inline-block', width: 9, height: 9, borderRadius: '50%',
            background: i < score ? color : '#e0e0e0',
            cursor: onSetScore ? 'pointer' : 'default',
            transition: 'background 0.1s',
          }}
        />
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle, dm }) {
  return (
    <div style={{ background: '#CC0000', padding: '4px 10px', marginTop: 8 }}>
      <div style={{ fontSize: fs(9, dm), fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }}>{title}</div>
      {subtitle && <div style={{ fontSize: fs(8, dm), color: 'rgba(255,255,255,0.85)' }}>{subtitle}</div>}
    </div>
  );
}

function ActionTable({ actions, accentColor, dm }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '5% 60% 20% 15%', background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
        {['#', 'ACTION', 'OWNER', 'BY WHEN'].map((h) => (
          <div key={h} style={{ padding: '3px 8px', fontSize: fs(8, dm), color: '#888' }}>{h}</div>
        ))}
      </div>
      {(actions || []).map((a, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '5% 60% 20% 15%', background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ padding: '4px 8px', fontSize: fs(9, dm), fontWeight: 'bold', color: accentColor, textAlign: 'center' }}>{i + 1}</div>
          <div style={{ padding: '4px 8px', fontSize: fs(9, dm), color: '#1A1A1A' }}>{a.action}</div>
          <div style={{ padding: '4px 8px', fontSize: fs(9, dm), color: '#1A1A1A' }}>{a.owner}</div>
          <div style={{ padding: '4px 8px', fontSize: fs(9, dm), fontWeight: 'bold', color: accentColor }}>{a.deadline}</div>
        </div>
      ))}
    </>
  );
}

// ─── SHARED HEADER BUTTONS ────────────────────────────────────────────────────

function HeaderButtons({ messageId, hasChanges, saving, saved, onSave, onCopy, copied, onToggle, expanded, onExport }) {
  return (
    <div className="artifact-header-buttons" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {(hasChanges || saving || saved) && (
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            background: saved ? '#27AE60' : '#C62828',
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'white', fontSize: 11, cursor: saving ? 'default' : 'pointer',
            padding: '2px 8px', borderRadius: 3, fontFamily: 'inherit', opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
        </button>
      )}
      <button
        onClick={onCopy}
        style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, background: 'none', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', padding: '2px 8px', borderRadius: 3, fontFamily: 'inherit' }}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
      {messageId && (
        <button
          onClick={onExport}
          style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, background: 'none', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', padding: '2px 8px', borderRadius: 3, fontFamily: 'inherit' }}
        >
          Export PDF
        </button>
      )}
      <button
        onClick={onToggle}
        style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', fontFamily: 'inherit', lineHeight: 1 }}
      >
        {expanded ? '▲' : '▼'}
      </button>
    </div>
  );
}

// ─── SHARED HOOKS ─────────────────────────────────────────────────────────────

function useSave(messageId, buildUpdatedData) {
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (hasChanges) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  function markChanged() { setHasChanges(true); }

  async function handleSave() {
    if (!messageId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/deals/messages/${messageId}/artifact`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ artifact_data: buildUpdatedData() }),
      });
      if (res.ok) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save artifact:', err);
    } finally {
      setSaving(false);
    }
  }

  return { hasChanges, saving, saved, markChanged, handleSave };
}

function useExport(messageId) {
  return function exportPDF() {
    if (!messageId) return;
    const el = document.getElementById(`artifact-${messageId}`);
    if (!el) return;
    el.classList.add('is-printing');
    document.body.classList.add('printing-artifact');
    window.print();
    setTimeout(() => {
      el.classList.remove('is-printing');
      document.body.classList.remove('printing-artifact');
    }, 500);
  };
}

// ─── 4F DEAL FILTER SCORECARD ─────────────────────────────────────────────────

function Render4FScorecard({ messageId, data, content, expanded, onToggle, copied, onCopy, dm }) {
  const [checkState, setCheckState] = useState(() => {
    const st = {};
    (data.criteria || []).forEach((c, ci) =>
      (c.checkpoints || []).forEach((cp, pi) => { st[`${ci}-${pi}`] = cp.checked; })
    );
    return st;
  });

  function getCriterionVerdict(ci) {
    const cps = data.criteria[ci]?.checkpoints || [];
    return cps.filter((_, pi) => checkState[`${ci}-${pi}`]).length >= 3 ? 'PASS' : 'FAIL';
  }

  const dynamicPasses = (data.criteria || []).filter((_, ci) => getCriterionVerdict(ci) === 'PASS').length;
  const dynamicVerdict = dynamicPasses >= 3 ? 'STRONG FIT' : dynamicPasses === 2 ? 'CAUTION' : 'DISQUALIFY';

  const buildUpdatedData = () => ({
    ...data,
    criteria: (data.criteria || []).map((c, ci) => ({
      ...c,
      verdict: getCriterionVerdict(ci),
      checkpoints: (c.checkpoints || []).map((cp, pi) => ({ ...cp, checked: checkState[`${ci}-${pi}`] ?? cp.checked })),
    })),
    score_summary: { ...data.score_summary, passes: dynamicPasses, verdict: dynamicVerdict },
  });

  const { hasChanges, saving, saved, markChanged, handleSave } = useSave(messageId, buildUpdatedData);
  const exportPDF = useExport(messageId);

  function toggleCheck(ci, pi) {
    setCheckState(prev => ({ ...prev, [`${ci}-${pi}`]: !prev[`${ci}-${pi}`] }));
    markChanged();
  }

  const verdictColors = { 'STRONG FIT': { bg: '#E8F5E9', text: '#27AE60' }, 'CAUTION': { bg: '#FFF9C4', text: '#F39C12' }, 'DISQUALIFY': { bg: '#FFEBEE', text: '#C0392B' } };
  const vc = verdictColors[dynamicVerdict] || verdictColors['DISQUALIFY'];
  const s = data.score_summary || {};
  const bodyMaxHeight = dm === 'tab' ? 'none' : 600;
  const bodyOverflow = dm === 'tab' ? 'visible' : 'auto';

  const resultRows = [
    { key: 'STRONG FIT', bg: '#E8F5E9', text: '#27AE60', label: '🟢  STRONG FIT — Full speed ahead. Advance to next stage.',         badge: '3–4 Fs PASS' },
    { key: 'CAUTION',    bg: '#FFF9C4', text: '#F39C12', label: '🟡  CAUTION — Investigate weak F(s) before advancing.',             badge: '2 Fs PASS' },
    { key: 'DISQUALIFY', bg: '#FFEBEE', text: '#C0392B', label: '🔴  WEAK FIT — Disqualify, requalify, or park for future trigger.', badge: '0–1 F PASS' },
  ];

  return (
    <div id={`artifact-${messageId}`} style={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden', fontFamily: 'Calibri, "Segoe UI", sans-serif', width: '100%' }}>
      <div style={{ background: '#C62828', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: 14, letterSpacing: '0.04em' }}>
          RED ZONE SELLING™  |  4F DEAL FILTER
        </span>
        <HeaderButtons messageId={messageId} hasChanges={hasChanges} saving={saving} saved={saved} onSave={handleSave} onCopy={onCopy} copied={copied} onToggle={onToggle} expanded={expanded} onExport={exportPDF} />
      </div>

      {expanded && (
        <div className="artifact-body" style={{ maxHeight: bodyMaxHeight, overflowY: bodyOverflow }}>
          <div style={{ background: '#F5C518', padding: '5px 14px', fontSize: fs(9, dm), fontWeight: 'bold', color: '#1A1A1A' }}>
            🟡 &nbsp;YELLOW ZONE  |  QUALIFICATION PLAY — Use at first discovery. Re-run any time deal conditions change.
          </div>
          <div style={{ display: 'flex', background: '#F5F5F5', borderBottom: '1px solid #e0e0e0' }}>
            <div style={{ flex: 1, padding: '5px 10px', fontSize: fs(9, dm), fontWeight: 'bold', color: '#4A4A4A', borderRight: '1px solid #e0e0e0' }}>Company / Prospect: {data.company}</div>
            <div style={{ flex: 1, padding: '5px 10px', fontSize: fs(9, dm), fontWeight: 'bold', color: '#4A4A4A' }}>Deal Stage / Date: {data.date}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '28% 28% 28% 16%', background: '#C0392B' }}>
            {['THE 4F CRITERIA', 'QUALIFYING QUESTION & CHECKPOINTS', 'NOTES / EVIDENCE', 'PASS / FAIL'].map((h) => (
              <div key={h} style={{ padding: '4px 8px', fontSize: fs(8, dm), fontWeight: 'bold', color: 'white', textTransform: 'uppercase', borderRight: '1px solid rgba(255,255,255,0.2)' }}>{h}</div>
            ))}
          </div>

          {(data.criteria || []).map((c, ci) => {
            const verdict = getCriterionVerdict(ci);
            const checkedCount = (c.checkpoints || []).filter((_, pi) => checkState[`${ci}-${pi}`]).length;
            return (
              <div key={ci}>
                <div style={{ display: 'grid', gridTemplateColumns: '28% 28% 28% 16%', background: '#1A1A1A' }}>
                  <div style={{ padding: '6px 10px', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: fs(10, dm) }}>{c.id} &nbsp;{c.name}</div>
                    {c.question && <div style={{ color: '#aaa', fontSize: fs(8, dm), marginTop: 2 }}>{c.question}</div>}
                  </div>
                  <div style={{ padding: '6px 10px', fontSize: fs(8, dm), color: '#D9D9D9', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                    {c.q || c.question || ''}
                  </div>
                  <div style={{ padding: '6px 10px', fontSize: fs(9, dm), fontStyle: 'italic', color: '#EFEFEF', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                    {c.evidence_summary}
                  </div>
                  <div style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    {verdict === 'PASS'
                      ? <span style={{ background: '#E8F5E9', color: '#27AE60', fontWeight: 'bold', fontSize: fs(10, dm), padding: '2px 8px', borderRadius: 2 }}>✓ PASS</span>
                      : <span style={{ background: '#FFEBEE', color: '#C0392B', fontWeight: 'bold', fontSize: fs(10, dm), padding: '2px 8px', borderRadius: 2 }}>✗ FAIL</span>
                    }
                    <span style={{ fontSize: fs(8, dm), color: '#aaa' }}>{checkedCount}/5 checked</span>
                  </div>
                </div>

                {(c.checkpoints || []).map((cp, pi) => {
                  const isChecked = checkState[`${ci}-${pi}`] ?? cp.checked;
                  return (
                    <div
                      key={pi}
                      style={{ background: pi % 2 === 0 ? '#ffffff' : '#F5F5F5', padding: '3px 10px', display: 'flex', alignItems: 'flex-start', gap: 6, cursor: 'pointer' }}
                      onClick={() => toggleCheck(ci, pi)}
                    >
                      <Checkbox checked={isChecked} />
                      <span style={{ fontSize: fs(8.5, dm), color: isChecked ? '#1A1A1A' : '#888', lineHeight: 1.4, userSelect: 'none' }}>
                        {cp.label}
                        {cp.evidence && <span style={{ color: '#757575', fontStyle: 'italic' }}> — {cp.evidence}</span>}
                      </span>
                    </div>
                  );
                })}

                {c.coaching_note && (
                  <div style={{ background: '#FFFBF0', borderTop: '1px solid #f0e0c0', padding: '5px 10px', fontSize: fs(8.5, dm), fontStyle: 'italic', color: '#854d0e' }}>
                    Coach: {c.coaching_note}
                  </div>
                )}
                {ci < (data.criteria || []).length - 1 && <div style={{ height: 4, background: '#f5f5f5' }} />}
              </div>
            );
          })}

          <div>
            <div style={{ background: '#1A1A1A', padding: '4px 10px', fontSize: fs(9, dm), fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }}>Deal Scorecard</div>
            {resultRows.map((row) => {
              const isMatch = dynamicVerdict === row.key;
              return (
                <div key={row.key} style={{ background: row.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', borderLeft: `3px solid ${isMatch ? row.text : 'transparent'}` }}>
                  <span style={{ fontSize: fs(9, dm), color: row.text, fontWeight: isMatch ? 'bold' : 'normal' }}>{row.label}</span>
                  <span style={{ fontSize: fs(8, dm), color: row.text, fontWeight: 'bold' }}>{row.badge}</span>
                </div>
              );
            })}
          </div>

          <div style={{ background: vc.bg, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e0e0e0', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 'bold', color: vc.text }}>{dynamicPasses}/4 Fs PASS — {dynamicVerdict}</span>
            <span style={{ fontSize: 11, color: vc.text }}>Next play: {s.next_play}</span>
          </div>
          {s.verdict_note && (
            <div style={{ background: vc.bg, padding: '0 14px 8px', fontSize: fs(9, dm), color: vc.text }}>{s.verdict_note}</div>
          )}
          <div style={{ background: '#FFEBEE', padding: '6px 14px', fontSize: fs(8.5, dm), fontWeight: 'bold', color: '#C0392B' }}>
            ⚠️ &nbsp;RED ZONE RULE: If 2 or more Fs are weak or missing — the deal is likely a time-waster. Disqualify or park it until the right trigger appears.
          </div>
          <div style={{ background: '#1A1A1A', padding: '4px 14px', fontSize: fs(7.5, dm), color: '#D9D9D9' }}>
            ALL RIGHTS RESERVED  |  RED ZONE SELLING™  |  REDZONESELLING.CO
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MUTUAL ACTION PLAN ───────────────────────────────────────────────────────

function RenderMAP({ messageId, data, content, expanded, onToggle, copied, onCopy, dm }) {
  const [milestoneStatuses, setMilestoneStatuses] = useState(
    () => (data.milestones || []).map(m => m.status || 'Not Started')
  );

  function cycleStatus(i) {
    setMilestoneStatuses(prev => {
      const idx = STATUS_CYCLE.indexOf(prev[i]);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      return prev.map((s, j) => j === i ? next : s);
    });
    markChanged();
  }

  const buildUpdatedData = () => ({
    ...data,
    milestones: (data.milestones || []).map((m, i) => ({ ...m, status: milestoneStatuses[i] || m.status })),
  });

  const { hasChanges, saving, saved, markChanged, handleSave } = useSave(messageId, buildUpdatedData);
  const exportPDF = useExport(messageId);
  const bodyMaxHeight = dm === 'tab' ? 'none' : 600;
  const bodyOverflow = dm === 'tab' ? 'visible' : 'auto';

  return (
    <div id={`artifact-${messageId}`} style={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden', fontFamily: 'Calibri, "Segoe UI", sans-serif', width: '100%' }}>
      <div style={{ background: '#CC0000', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>RED ZONE SELLING™</span>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MUTUAL ACTION PLAN</span>
        </div>
        <HeaderButtons messageId={messageId} hasChanges={hasChanges} saving={saving} saved={saved} onSave={handleSave} onCopy={onCopy} copied={copied} onToggle={onToggle} expanded={expanded} onExport={exportPDF} />
      </div>

      {expanded && (
        <div className="artifact-body" style={{ maxHeight: bodyMaxHeight, overflowY: bodyOverflow }}>
          <div style={{ background: '#1A1A1A', padding: '3px 10px', fontSize: fs(9, dm), fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }}>Deal Information</div>
          {[
            { icon: '📁', label: 'Project Name',          value: data.project_name },
            { icon: '🏢', label: 'Account Name',          value: data.company },
            { icon: '🎯', label: 'Target Close Date',     value: data.target_close_date },
            { icon: '👤', label: 'Client Representative', value: data.champion },
            { icon: '💼', label: 'Sales Person',          value: data.salesperson },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
              <div style={{ width: 160, minWidth: 160, background: '#D9D9D9', padding: '5px 10px', fontSize: fs(9, dm), fontWeight: 'bold', color: '#1A1A1A' }}>{row.icon} &nbsp;{row.label}</div>
              <div style={{ flex: 1, padding: '5px 10px', fontSize: fs(9, dm), color: '#666', background: 'white' }}>{row.value || '—'}</div>
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '32% 14% 10% 12% 14% 18%', background: '#CC0000', marginTop: 8 }}>
            {['# MILESTONE / ACTION', '👤 OWNER', '📅 DUE DATE', '🚦 STATUS', '🔗 DEPENDENCIES', '📝 NOTES'].map((h) => (
              <div key={h} style={{ padding: '5px 8px', fontSize: fs(9, dm), fontWeight: 'bold', color: 'white', borderRight: '1px solid rgba(255,255,255,0.2)' }}>{h}</div>
            ))}
          </div>
          {(data.milestones || []).map((m, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '32% 14% 10% 12% 14% 18%', background: i % 2 === 0 ? '#fff' : '#FAFAFA', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ padding: '5px 8px', fontSize: fs(9.5, dm), color: '#1A1A1A', borderRight: '1px solid #f0f0f0' }}>{m.number}. {m.action}</div>
              <div style={{ padding: '5px 8px', fontSize: fs(9.5, dm), color: '#1A1A1A', borderRight: '1px solid #f0f0f0' }}>{m.owner}</div>
              <div style={{ padding: '5px 8px', fontSize: fs(9.5, dm), color: '#1A1A1A', borderRight: '1px solid #f0f0f0' }}>{m.due_date}</div>
              <div style={{ padding: '4px 8px', borderRight: '1px solid #f0f0f0' }}>
                <StatusBadge status={milestoneStatuses[i] || m.status} onClick={() => cycleStatus(i)} />
              </div>
              <div style={{ padding: '5px 8px', fontSize: fs(9.5, dm), color: '#1A1A1A', borderRight: '1px solid #f0f0f0' }}>{m.dependencies || '—'}</div>
              <div style={{ padding: '5px 8px', fontSize: fs(9.5, dm), color: '#1A1A1A' }}>{m.notes || '—'}</div>
            </div>
          ))}

          <div style={{ marginTop: 4 }}>
            <div style={{ background: '#1A1A1A', padding: '3px 10px', fontSize: fs(9, dm), fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }}>Status Legend</div>
            <div style={{ background: 'white', padding: '6px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.keys(STATUS_STYLES).map((s) => <StatusBadge key={s} status={s} />)}
            </div>
          </div>
          <div style={{ background: '#CC0000', padding: '5px 14px', fontSize: fs(9, dm), fontWeight: 'bold', color: 'white' }}>
            ⚠ &nbsp;INTERNAL USE ONLY — DELETE BEFORE SHARING WITH CLIENT
          </div>
          {data.coaching_note && (
            <div style={{ background: '#FFF5F5', borderLeft: '3px solid #CC0000', padding: '8px 12px', fontSize: fs(9, dm), fontStyle: 'italic', color: '#CC0000', margin: '8px 0' }}>
              {data.coaching_note}
            </div>
          )}
          <div style={{ background: '#1A1A1A', padding: '4px 14px', fontSize: fs(8, dm), color: '#AAAAAA' }}>
            RED ZONE SELLING™  |  Vince Beese, LLC  |  Redzoneselling.co  |  Mutual Action Plan
          </div>
        </div>
      )}
    </div>
  );
}

// ─── OWN THE CLOSE™ SCORECARD ─────────────────────────────────────────────────

const OTC_DESCS = [
  { what: 'All key decision-makers identified, engaged, aligned.',    note: 'Coverage gaps.' },
  { what: 'Buyer can articulate value, ROI, and cost of inaction.',   note: 'Business case strength.' },
  { what: 'A real compelling event drives the close by target date.', note: 'Compelling event.' },
  { what: 'Differentiation is clear to the buyer and champion.',      note: 'Competitive risks.' },
  { what: 'Legal, Procurement, IT/Security engaged and mapped.',      note: 'Process gaps.' },
  { what: 'Buyer has confirmed intent, not just interest.',           note: 'Confidence signals.' },
];

const RISK_ROWS = [
  { range: '5–10',  label: 'CRITICAL RISK',  bg: '#FFF5F5', text: '#991b1b' },
  { range: '11–15', label: 'HIGH RISK',       bg: '#FFFBF0', text: '#92400e' },
  { range: '16–20', label: 'DEVELOPING',      bg: '#FFFDE7', text: '#854d0e' },
  { range: '21–24', label: 'COMPETITIVE',     bg: '#EFF6FF', text: '#1e40af' },
  { range: '25–30', label: 'STRONG / CLOSE',  bg: '#F0FDF4', text: '#166534' },
];

function getRiskLevel(total) {
  if (total <= 10) return 'CRITICAL RISK';
  if (total <= 15) return 'HIGH RISK';
  if (total <= 20) return 'DEVELOPING';
  if (total <= 24) return 'COMPETITIVE';
  return 'STRONG / CLOSE';
}

function scoreColor(score) {
  return score <= 2 ? '#CC0000' : score === 3 ? '#B85C00' : '#1E6B3A';
}

function RenderOTCScorecard({ messageId, data, content, expanded, onToggle, copied, onCopy, dm }) {
  const s1 = data.section1 || {};
  const s2 = data.section2 || {};
  const s3 = data.section3 || {};

  const [scores, setScores] = useState(() => (s1.criteria || []).map(c => c.score || 1));
  const [declaration, setDeclaration] = useState(data.final_declaration || null);

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const dynamicRiskLevel = getRiskLevel(totalScore);
  const bodyMaxHeight = dm === 'tab' ? 'none' : 600;
  const bodyOverflow = dm === 'tab' ? 'visible' : 'auto';

  const buildUpdatedData = () => ({
    ...data,
    section1: {
      ...s1,
      criteria: (s1.criteria || []).map((c, i) => ({ ...c, score: scores[i] ?? c.score })),
      total_score: totalScore,
      risk_level: dynamicRiskLevel,
    },
    final_declaration: declaration,
  });

  const { hasChanges, saving, saved, markChanged, handleSave } = useSave(messageId, buildUpdatedData);
  const exportPDF = useExport(messageId);

  function setScore(i, score) {
    setScores(prev => prev.map((s, j) => j === i ? score : s));
    markChanged();
  }

  function setDeclarationOpt(opt) {
    setDeclaration(opt);
    markChanged();
  }

  const DECL_OPTIONS = ['7 Days', '14 Days', '30 Days', 'Other'];

  return (
    <div id={`artifact-${messageId}`} style={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden', fontFamily: 'Calibri, "Segoe UI", sans-serif', width: '100%' }}>
      <div style={{ background: '#1A1A1A', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#CC0000', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RED ZONE SELLING™</div>
          <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold', lineHeight: 1.2 }}>OWN THE CLOSE™</div>
          <div style={{ color: '#aaa', fontSize: 9, textTransform: 'uppercase', marginTop: 2 }}>Red Zone Execution Worksheet</div>
        </div>
        <HeaderButtons messageId={messageId} hasChanges={hasChanges} saving={saving} saved={saved} onSave={handleSave} onCopy={onCopy} copied={copied} onToggle={onToggle} expanded={expanded} onExport={exportPDF} />
      </div>

      {expanded && (
        <div className="artifact-body" style={{ maxHeight: bodyMaxHeight, overflowY: bodyOverflow }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '2px solid #1A1A1A', background: '#fff' }}>
            {[
              { label: 'Deal Name / Company', value: data.company },
              { label: 'Deal Size',           value: data.deal_size },
              { label: 'Target Close Date',   value: data.target_close_date },
              { label: 'Primary Champion',    value: data.champion },
              { label: 'Salesperson',         value: data.salesperson },
            ].map((f, i) => (
              <div key={i} style={{ flex: '1 1 auto', minWidth: 100, padding: '5px 10px', borderRight: i < 4 ? '1px solid #e0e0e0' : 'none' }}>
                <span style={{ fontSize: fs(9, dm), fontWeight: 'bold', color: '#1A1A1A', display: 'block' }}>{f.label}</span>
                <span style={{ fontSize: fs(9, dm), color: '#555', fontStyle: 'italic' }}>{f.value || '—'}</span>
              </div>
            ))}
          </div>

          <SectionHeader title="SECTION 1 — RED ZONE DEAL SCORECARD" subtitle="Click a dot to set score (1–5)" dm={dm} />

          <div style={{ display: 'grid', gridTemplateColumns: '22% 52% 26%', background: '#1A1A1A' }}>
            {['CRITERION', 'WHAT IT MEASURES | WHAT TO NOTE', 'SCORE 1–5'].map((h) => (
              <div key={h} style={{ padding: '4px 8px', fontSize: fs(8, dm), fontWeight: 'bold', color: '#D9D9D9', borderRight: '1px solid rgba(255,255,255,0.1)' }}>{h}</div>
            ))}
          </div>

          {(s1.criteria || []).map((c, i) => {
            const desc = OTC_DESCS[i] || {};
            const currentScore = scores[i] ?? c.score;
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '22% 52% 26%', background: i % 2 === 0 ? '#fff' : '#FAFAFA', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ padding: '5px 8px', fontSize: fs(9, dm), fontWeight: 'bold', color: '#1A1A1A', borderRight: '1px solid #f0f0f0' }}>{c.name}</div>
                <div style={{ padding: '5px 8px', borderRight: '1px solid #f0f0f0' }}>
                  <div style={{ fontSize: fs(8.5, dm), color: '#333' }}>{desc.what}</div>
                  {c.notes && <div style={{ fontSize: fs(8.5, dm), color: '#666', marginTop: 1 }}>{c.notes}</div>}
                  {currentScore <= 2 && c.coaching && (
                    <div style={{ fontSize: fs(8, dm), color: '#CC0000', fontStyle: 'italic', marginTop: 2 }}>{c.coaching}</div>
                  )}
                </div>
                <div style={{ padding: '5px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: scoreColor(currentScore) }}>{currentScore}</div>
                  <ScoreDots score={currentScore} onSetScore={(v) => setScore(i, v)} />
                  <div style={{ fontSize: fs(7.5, dm), color: '#aaa', marginTop: 2 }}>click dot to set</div>
                </div>
              </div>
            );
          })}

          <div style={{ display: 'grid', gridTemplateColumns: '74% 26%', background: '#1A1A1A' }}>
            <div style={{ padding: '5px 8px', fontSize: fs(9, dm), fontWeight: 'bold', color: 'white' }}>TOTAL SCORE (max 30)</div>
            <div style={{ padding: '5px 8px', fontSize: 14, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>{totalScore}</div>
          </div>

          {RISK_ROWS.map((r) => {
            const isMatch = dynamicRiskLevel === r.label;
            return (
              <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '10% 22% 68%', background: r.bg, borderLeft: `3px solid ${isMatch ? r.text : 'transparent'}` }}>
                <div style={{ padding: '3px 8px', fontSize: fs(8.5, dm), color: r.text, fontWeight: isMatch ? 'bold' : 'normal' }}>{r.range}</div>
                <div style={{ padding: '3px 8px', fontSize: fs(8.5, dm), fontWeight: 'bold', color: r.text }}>{r.label}</div>
                <div style={{ padding: '3px 8px', fontSize: fs(8.5, dm), color: r.text }}>{isMatch && s1.risk_description ? s1.risk_description : ''}</div>
              </div>
            );
          })}

          <SectionHeader title="SECTION 2 — RISK DIAGNOSIS" subtitle="Answer from your deal conversation" dm={dm} />
          {[
            { label: "BIGGEST RISK TO CLOSE",            hint: 'What could kill this deal?',    value: s2.biggest_risk },
            { label: "CONVERSATION YOU'RE AVOIDING",     hint: 'Say the hard thing.',            value: s2.avoided_conversation },
            { label: 'STAKEHOLDER NOT FULLY ENGAGED',    hint: 'Who needs more access?',         value: s2.missing_stakeholder },
            { label: "QUESTION YOU HAVEN'T ASKED",       hint: "What are you afraid to ask?",    value: s2.unasked_question },
            { label: 'IF THIS SLIPS IT WILL BE BECAUSE', hint: 'Be honest.',                     value: s2.if_this_slips },
          ].map((q, i) => (
            <div key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ background: '#F5F5F5', padding: '4px 12px', fontSize: fs(8.5, dm), fontWeight: 'bold', textTransform: 'uppercase', color: '#555' }}>
                {q.label} <span style={{ fontSize: fs(8, dm), color: '#888', fontWeight: 'normal', textTransform: 'none' }}>— {q.hint}</span>
              </div>
              <div style={{ background: 'white', padding: '8px 12px', fontSize: fs(9, dm), fontStyle: 'italic', color: '#666', minHeight: 28 }}>{q.value || '—'}</div>
            </div>
          ))}

          <SectionHeader title="SECTION 3 — 72-HOUR ACTION PLAN" subtitle="What you commit to doing in the next 72 hours" dm={dm} />
          <div style={{ background: '#FFF5F5', padding: '4px 12px', fontSize: fs(8.5, dm), fontWeight: 'bold', color: '#CC0000', textTransform: 'uppercase' }}>Within 24 Hours</div>
          <ActionTable actions={s3.within_24_hours} accentColor="#CC0000" dm={dm} />
          <div style={{ background: '#FFFBF0', padding: '4px 12px', fontSize: fs(8.5, dm), fontWeight: 'bold', color: '#B85C00', textTransform: 'uppercase', marginTop: 4 }}>Within 72 Hours</div>
          <ActionTable actions={s3.within_72_hours} accentColor="#B85C00" dm={dm} />

          <div style={{ background: '#1A1A1A', padding: '10px 14px' }}>
            <div style={{ fontSize: fs(9, dm), textTransform: 'uppercase', color: '#aaa', marginBottom: 6, letterSpacing: '0.03em' }}>
              I will close or disqualify this deal within:
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              {DECL_OPTIONS.map((opt) => {
                const selected = declaration === opt;
                return (
                  <span
                    key={opt}
                    onClick={() => setDeclarationOpt(opt)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: fs(9, dm), color: 'white', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <span style={{ display: 'inline-block', width: 10, height: 10, background: selected ? '#CC0000' : 'transparent', border: `1px solid ${selected ? '#CC0000' : '#666'}`, flexShrink: 0 }} />
                    {opt}
                  </span>
                );
              })}
            </div>
          </div>

          <div style={{ background: '#CC0000', padding: '5px 14px', fontSize: fs(8.5, dm), fontStyle: 'italic', color: 'white' }}>
            Pro Tip: Create a short Closing MAP with your champion before your final presentation — it forces alignment on process, stakeholders, and timeline.
          </div>
          <div style={{ background: '#1A1A1A', padding: '5px 14px' }}>
            <div style={{ fontSize: fs(8, dm), color: '#666' }}>RED ZONE SELLING™  |  Own the Close™ Worksheet  |  Confidential  |  Internal Use</div>
            <div style={{ fontSize: fs(8, dm), color: '#666' }}>REDZONESELLING.CO  |  Page 1 of 2</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPACT CARD (chat thread) ────────────────────────────────────────────────

function CompactArtifactCard({ messageId, type, data, onViewArtifact }) {
  const headerBg = COMPACT_HEADER_COLORS[type] || '#1A1A1A';
  const title = ARTIFACT_TITLES[type] || type;
  const summary = computeSummary(type, data);
  const isSaved = !!data;

  return (
    <div style={{ border: '0.5px solid #e0e0e0', borderRadius: 8, overflow: 'hidden', marginTop: 8, marginBottom: 8 }}>
      <div style={{ background: headerBg, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px' }}>
        <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{title}</span>
        <button
          onClick={() => onViewArtifact?.(messageId)}
          style={{ color: 'white', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', opacity: onViewArtifact ? 1 : 0.5 }}
        >
          View in Artifacts →
        </button>
      </div>
      <div style={{ background: '#F5F5F5', height: 28, display: 'flex', alignItems: 'center', padding: '0 12px', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#666' }}>{summary || 'Artifact generated'}</span>
        {isSaved && <span style={{ fontSize: 11, color: '#27AE60', fontWeight: 600 }}>Saved ✓</span>}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

const ARTIFACT_COLORS = {
  stakeholder_map: 'border-blue-200 bg-blue-50',
  business_case:   'border-purple-200 bg-purple-50',
  action_plan:     'border-green-200 bg-green-50',
  risk_report:     'border-orange-200 bg-orange-50',
  followup_email:  'border-cyan-200 bg-cyan-50',
};

export default function ArtifactCard({ messageId, type, content, data, dealName, mode = 'compact', onViewArtifact }) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  // Compact mode — shown in chat thread
  if (mode === 'compact') {
    return <CompactArtifactCard messageId={messageId} type={type} data={data} onViewArtifact={onViewArtifact} />;
  }

  // Full mode — shown in Artifacts tab (with readability overrides)
  const dm = 'tab';
  const isRich = RICH_TYPES.includes(type) && data;

  if (isRich) {
    const props = {
      messageId,
      data,
      content,
      expanded,
      onToggle: () => setExpanded((e) => !e),
      copied,
      onCopy: handleCopy,
      dm,
    };
    return (
      <div>
        {type === '4f_scorecard'  && <Render4FScorecard  {...props} />}
        {type === 'map'           && <RenderMAP          {...props} />}
        {type === 'otc_scorecard' && <RenderOTCScorecard {...props} />}
      </div>
    );
  }

  // Full mode — legacy markdown (with readable formatting)
  const title = ARTIFACT_TITLES[type] || 'Artifact';
  const colorClass = ARTIFACT_COLORS[type] || 'border-gray-200 bg-gray-50';

  return (
    <div className={`rounded-lg border-2 ${colorClass} overflow-hidden`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-inherit bg-white/50">
        <div className="flex items-center gap-2">
          <span className="font-medium text-rzs-charcoal">{title}</span>
          {dealName && <span className="text-sm text-gray-500">• {dealName}</span>}
        </div>
        <button onClick={handleCopy} className="text-sm text-gray-500 hover:text-rzs-charcoal flex items-center gap-1">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-5 bg-white">
        <div className="prose max-w-none prose-table:text-sm prose-th:bg-gray-100 prose-td:border prose-th:border prose-table:border-collapse leading-relaxed" style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 680 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
