import { Router } from 'express';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';

const router = Router();

function deriveSummary(type, data, turnCount) {
  if (!data) return type;
  const tc = `Turn ${turnCount}`;
  switch (type) {
    case '4f_scorecard': {
      const passes = (data.criteria || []).filter(c => c.verdict === 'PASS').length;
      const verdict = data.score_summary?.verdict || '';
      return [passes + '/4 Fs PASS', verdict, tc].filter(Boolean).join(' · ');
    }
    case 'map': {
      const count = (data.milestones || []).length;
      const inProgress = (data.milestones || []).filter(m => m.status === 'In Progress').length;
      return `${count} milestones · ${inProgress} In Progress · ${tc}`;
    }
    case 'otc_scorecard': {
      const total = data.section1?.total_score || 0;
      const risk = data.section1?.risk_level || '';
      return [total + '/30', risk, tc].filter(Boolean).join(' · ');
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
      return type;
  }
}

router.get('/', ensureUser, async (req, res) => {
  const { deal_id } = req.query;
  if (!deal_id) return res.status(400).json({ error: 'deal_id required' });

  try {
    const dealCheck = await query(
      `SELECT id FROM deals WHERE id = $1 AND user_id = $2`,
      [deal_id, req.user.id]
    );
    if (!dealCheck.rows.length) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const result = await query(
      `SELECT m.id, m.artifact_type, m.artifact_data, m.content, m.created_at,
              (SELECT COUNT(*) FROM messages m2
               WHERE m2.deal_id = m.deal_id
                 AND m2.role = 'assistant'
                 AND m2.created_at <= m.created_at) AS turn_count
       FROM messages m
       WHERE m.deal_id = $1 AND m.artifact_type IS NOT NULL
       ORDER BY m.created_at DESC`,
      [deal_id]
    );

    const artifacts = result.rows.map(row => ({
      id: row.id,
      artifact_type: row.artifact_type,
      artifact_data: row.artifact_data,
      content: row.content,
      created_at: row.created_at,
      summary: deriveSummary(row.artifact_type, row.artifact_data, Number(row.turn_count)),
    }));

    res.json(artifacts);
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    res.status(500).json({ error: 'Failed to fetch artifacts' });
  }
});

router.delete('/:id', ensureUser, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      `DELETE FROM messages
       WHERE id = $1 AND user_id = $2 AND artifact_type IS NOT NULL
       RETURNING id`,
      [id, req.user.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Artifact not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting artifact:', error);
    res.status(500).json({ error: 'Failed to delete artifact' });
  }
});

export default router;
