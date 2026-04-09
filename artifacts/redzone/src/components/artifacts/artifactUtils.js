import * as XLSX from 'xlsx';

export function parseArtifactContent(content) {
  const startMatch = content.match(/\[ARTIFACT_START:(\w+)\]/);
  const endMatch = content.match(/\[ARTIFACT_END\]/);

  if (startMatch && endMatch) {
    const type = startMatch[1];
    const startIndex = content.indexOf(startMatch[0]) + startMatch[0].length;
    const endIndex = content.indexOf('[ARTIFACT_END]');
    const artifactContent = content.slice(startIndex, endIndex).trim();
    const cleanContent = content.replace(/\[ARTIFACT_START:\w+\][\s\S]*?\[ARTIFACT_END\]/, '').trim();

    let data = null;
    let markdownContent = artifactContent;

    const jsonMatch = artifactContent.match(/^\[ARTIFACT_JSON\]([\s\S]*?)\[\/ARTIFACT_JSON\]\n?/);
    if (jsonMatch) {
      try {
        data = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.warn('Failed to parse artifact JSON data:', e.message);
      }
      markdownContent = artifactContent.replace(jsonMatch[0], '').trim();
    }

    return { type, content: markdownContent, cleanContent, data };
  }

  return null;
}

export function parseArtifactOffer(content) {
  const match = content.match(/\[ARTIFACT_OFFER:(\w+)\]/);
  if (!match) return null;
  const cleanContent = content.replace(match[0], '').trim();
  return { type: match[1], cleanContent };
}

export const ARTIFACT_TITLES = {
  stakeholder_map:  'Key Stakeholder Map',
  business_case:    'Business Case Draft',
  action_plan:      '72-Hour Action Plan',
  risk_report:      'Risk Flag Report',
  followup_email:   'Champion Follow-Up Email',
  '4f_scorecard':   '4F Deal Filter Scorecard',
  map:              'Mutual Action Plan',
  otc_scorecard:    'Own the Close™ Scorecard',
};

export const COMPACT_HEADER_COLORS = {
  '4f_scorecard':  '#C62828',
  'map':           '#CC0000',
  'otc_scorecard': '#1A1A1A',
};

export const COMPACT_ABBREVS = {
  '4f_scorecard':  '4F',
  'map':           'MAP',
  'otc_scorecard': 'OTC',
  'stakeholder_map': 'SM',
  'business_case':   'BC',
  'action_plan':     '72H',
  'risk_report':     'RR',
  'followup_email':  'CE',
};

export function computeSummary(type, data) {
  if (!data) return '';
  switch (type) {
    case '4f_scorecard': {
      const passes = (data.criteria || []).filter(c => c.verdict === 'PASS').length;
      const verdict = data.score_summary?.verdict || '';
      return verdict ? `${passes}/4 Fs PASS · ${verdict}` : `${passes}/4 Fs PASS`;
    }
    case 'map': {
      const count = (data.milestones || []).length;
      const inProgress = (data.milestones || []).filter(m => m.status === 'In Progress').length;
      return `${count} milestones · ${inProgress} In Progress`;
    }
    case 'otc_scorecard': {
      const total = data.section1?.total_score || 0;
      const risk = data.section1?.risk_level || '';
      return risk ? `${total}/30 · ${risk}` : `${total}/30`;
    }
    case 'stakeholder_map':
      return `${(data.stakeholders || []).length} stakeholders mapped`;
    case 'business_case':
      return 'Business Case Draft';
    case 'action_plan':
    case '72_hour_plan':
      return '72-Hour Action Plan';
    case 'risk_report':
    case 'risk_flag':
      return 'Risk Flag Report';
    case 'followup_email':
    case 'champion_email':
      return data.to ? `To: ${data.to}` : 'Champion Follow-Up Email';
    default:
      return '';
  }
}

export function exportToXLSX(type, data, label) {
  const wb = XLSX.utils.book_new();
  const filename = `${label || type}-${type}.xlsx`;

  if (type === '4f_scorecard') {
    const rows = [['Criterion', 'Checkpoint', 'Checked', 'Verdict']];
    (data.criteria || []).forEach(c => {
      (c.checkpoints || []).forEach(cp => {
        rows.push([c.name, cp.label, cp.checked ? 'Yes' : 'No', c.verdict]);
      });
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, '4F Scorecard');

  } else if (type === 'map') {
    const rows = [['#', 'Action', 'Owner', 'Due Date', 'Status', 'Dependencies', 'Notes']];
    (data.milestones || []).forEach(m => {
      rows.push([m.number, m.action, m.owner, m.due_date, m.status, m.dependencies || '', m.notes || '']);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Mutual Action Plan');

  } else if (type === 'otc_scorecard') {
    const rows = [['Section', 'Criterion', 'Notes', 'Score']];
    (data.section1?.criteria || []).forEach(c => {
      rows.push(['Section 1', c.name, c.notes || '', c.score]);
    });
    rows.push(['', 'TOTAL SCORE', '', data.section1?.total_score]);
    rows.push(['', 'Risk Level', '', data.section1?.risk_level]);
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'OTC Scorecard');
  }

  XLSX.writeFile(wb, filename);
}
