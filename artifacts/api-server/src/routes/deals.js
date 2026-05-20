import { Router } from 'express';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';
import requireSubscription from '../middleware/subscription.js';
import { logEvent } from '../services/analytics.js';

const router = Router();

const MAX_ACTIVE_DEALS = 10;

// Get all deals for user
router.get('/', ensureUser, requireSubscription, async (req, res) => {
  try {
    const result = await query(
      `SELECT d.id, d.name, d.company, d.zone, d.deal_value, d.close_date,
              d.status, d.turn_count, d.created_at, d.updated_at,
              COALESCE(COUNT(m.id), 0)::int AS artifact_count
       FROM deals d
       LEFT JOIN messages m ON m.deal_id = d.id AND m.artifact_data IS NOT NULL
       WHERE d.user_id = $1
       GROUP BY d.id
       ORDER BY
         CASE d.status WHEN 'active' THEN 0 ELSE 1 END,
         d.updated_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get single deal with messages
router.get('/:id', ensureUser, requireSubscription, async (req, res) => {
  try {
    const { id } = req.params;

    const dealResult = await query(
      `SELECT * FROM deals WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (dealResult.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const messagesResult = await query(
      `SELECT id, role, content, artifact_data, artifact_type, created_at
       FROM messages
       WHERE deal_id = $1
       ORDER BY created_at ASC`,
      [id]
    );

    res.json({
      ...dealResult.rows[0],
      messages: messagesResult.rows,
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

// Create new deal
router.post('/', ensureUser, requireSubscription, async (req, res) => {
  try {
    const { name, company, zone, deal_value, close_date } = req.body;

    // Check active deal count
    const countResult = await query(
      `SELECT COUNT(*) FROM deals WHERE user_id = $1 AND status = 'active'`,
      [req.user.id]
    );

    const activeCount = parseInt(countResult.rows[0].count);

    if (activeCount >= MAX_ACTIVE_DEALS) {
      return res.status(400).json({
        error: 'Deal limit reached',
        message: `You have reached the maximum of ${MAX_ACTIVE_DEALS} active deals. Archive or close existing deals to add more.`,
      });
    }

    const { notes } = req.body;

    const result = await query(
      `INSERT INTO deals (user_id, name, company, zone, deal_value, close_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, name, company, zone, deal_value || null, close_date || null, notes || null]
    );

    const deal = result.rows[0];
    logEvent(req.user.id, 'deal_created', {
      zone: deal.zone,
      has_value: !!deal.deal_value,
      has_close_date: !!deal.close_date,
    });
    res.status(201).json(deal);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Update deal
router.patch('/:id', ensureUser, requireSubscription, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, zone, deal_value, close_date, status } = req.body;

    // Verify ownership
    const existing = await query(
      `SELECT id, zone, status, turn_count FROM deals WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    const oldDeal = existing.rows[0];

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (company !== undefined) {
      updates.push(`company = $${paramCount++}`);
      values.push(company);
    }
    if (zone !== undefined) {
      updates.push(`zone = $${paramCount++}`);
      values.push(zone);
    }
    if (deal_value !== undefined) {
      updates.push(`deal_value = $${paramCount++}`);
      values.push(deal_value);
    }
    if (close_date !== undefined) {
      updates.push(`close_date = $${paramCount++}`);
      values.push(close_date);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE deals SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    const updated = result.rows[0];
    if (zone !== undefined && zone !== oldDeal.zone) {
      logEvent(req.user.id, 'deal_zone_changed', { from: oldDeal.zone, to: zone });
    }
    if (status !== undefined && status !== oldDeal.status) {
      logEvent(req.user.id, 'deal_status_changed', {
        status,
        turn_count: oldDeal.turn_count || 0,
        zone: updated.zone,
      });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// Delete deal
router.delete('/:id', ensureUser, requireSubscription, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM deals WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// Generate structured artifact for a deal
router.post('/:id/artifacts', ensureUser, requireSubscription, async (req, res) => {
  try {
    const { type } = req.body;
    const dealId = parseInt(req.params.id);

    const dealResult = await query(
      'SELECT * FROM deals WHERE id = $1 AND user_id = $2',
      [dealId, req.user.id]
    );
    if (!dealResult.rows.length) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    const deal = dealResult.rows[0];

    const historyResult = await query(
      `SELECT role, content FROM messages
       WHERE deal_id = $1 ORDER BY created_at ASC`,
      [dealId]
    );
    const messages = historyResult.rows;

    // Built-in structured (rich) artifact types
    const HARDCODED_TYPES = ['4f_scorecard', 'map', 'otc_scorecard'];

    // Built-in text artifact types — generated by generateArtifact()
    const TEXT_TYPES = ['stakeholder_map', 'business_case', 'action_plan', 'risk_flag', 'champion_email'];

    // Internal name mapping: external type → ARTIFACT_PROMPTS key in artifacts.js
    const TYPE_MAP = { risk_flag: 'risk_report', champion_email: 'followup_email' };

    let content, data, artifactType;

    if (HARDCODED_TYPES.includes(type)) {
      const { generateStructuredArtifact } = await import('../services/artifacts.js');
      const result = await generateStructuredArtifact(type, deal, messages, req.user.id);
      data = result.data;
      const jsonPart = data ? `[ARTIFACT_JSON]${JSON.stringify(data)}[/ARTIFACT_JSON]\n` : '';
      content = `[ARTIFACT_START:${type}]\n${jsonPart}${result.markdown}\n[ARTIFACT_END]`;
      artifactType = type;
    } else if (TEXT_TYPES.includes(type)) {
      const internalType = TYPE_MAP[type] || type;
      const { generateArtifact } = await import('../services/artifacts.js');
      const result = await generateArtifact(internalType, { ...deal, user_id: req.user.id }, messages);
      content = `[ARTIFACT_START:${type}]\n${result.content}\n[ARTIFACT_END]`;
      artifactType = type;
    } else {
      // Try to find a matching active artifact template by slug
      const templateResult = await query(
        `SELECT id FROM artifact_templates WHERE slug = $1 AND is_active = true`,
        [type]
      );
      if (!templateResult.rows.length) {
        return res.status(400).json({ error: `Unknown artifact type: ${type}` });
      }
      const templateId = templateResult.rows[0].id;
      const { generateFromTemplate } = await import('../services/artifacts.js');
      const result = await generateFromTemplate(templateId, { ...deal, user_id: req.user.id }, messages);
      data = result.data;
      content = `[ARTIFACT_START:${type}]\n[ARTIFACT_JSON]${JSON.stringify(data)}[/ARTIFACT_JSON]\n${result.content}\n[ARTIFACT_END]`;
      artifactType = 'template_artifact';
    }

    const msgResult = await query(
      `INSERT INTO messages (user_id, deal_id, mode_slug, role, content, artifact_data, artifact_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, role, content, artifact_data, artifact_type, created_at`,
      [req.user.id, dealId, 'deal', 'assistant', content, data ? JSON.stringify(data) : null, artifactType]
    );

    await logEvent(req.user.id, 'artifact_accepted', { type, deal_id: dealId, zone: deal.zone });
    res.json({ message: msgResult.rows[0] });
  } catch (error) {
    console.error('Error generating artifact:', error);
    res.status(500).json({ error: 'Failed to generate artifact' });
  }
});

// Update artifact interactive state (checkbox toggles, score edits, etc.)
router.patch('/messages/:messageId/artifact', ensureUser, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { artifact_data } = req.body;
    if (!artifact_data || typeof artifact_data !== 'object') {
      return res.status(400).json({ error: 'artifact_data must be an object' });
    }

    const result = await query(
      `UPDATE messages
       SET artifact_data = $1
       WHERE id = $2
         AND user_id = $3
         AND artifact_data IS NOT NULL
       RETURNING id`,
      [JSON.stringify(artifact_data), messageId, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Message not found or not an artifact' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating artifact:', error);
    res.status(500).json({ error: 'Failed to update artifact' });
  }
});

export default router;
