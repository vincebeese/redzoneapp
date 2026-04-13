import { Router } from 'express';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';
import Anthropic from '@anthropic-ai/sdk';
import multer from 'multer';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';
import adminOnly from '../middleware/adminOnly.js';
import { sendInviteEmail, sendBetaApprovedEmail } from '../services/email.js';
import { count as sseCount } from '../services/sseCounter.js';
import { bustRCCache } from '../services/resourceCenter.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Anthropic health check cache
let anthropicCache = { status: null, model: null, ts: 0 };

const router = Router();

// All admin routes require authentication and admin status
router.use(ensureUser, adminOnly);

// === MODES MANAGEMENT ===

// Get all modes (including inactive)
router.get('/modes', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM modes ORDER BY sort_order`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching modes:', error);
    res.status(500).json({ error: 'Failed to fetch modes' });
  }
});

// Update mode
router.put('/modes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, description, system_prompt, max_tokens, is_active, sort_order } = req.body;

    const result = await query(
      `UPDATE modes SET
        display_name = COALESCE($1, display_name),
        description = COALESCE($2, description),
        system_prompt = COALESCE($3, system_prompt),
        max_tokens = COALESCE($4, max_tokens),
        is_active = COALESCE($5, is_active),
        sort_order = COALESCE($6, sort_order),
        updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [display_name, description, system_prompt, max_tokens, is_active, sort_order, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mode not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating mode:', error);
    res.status(500).json({ error: 'Failed to update mode' });
  }
});

// Create new mode
router.post('/modes', async (req, res) => {
  try {
    const { display_name, slug, description, system_prompt, max_tokens, sort_order, visibility, icon } = req.body;

    const result = await query(
      `INSERT INTO modes (name, slug, display_name, description, system_prompt, max_tokens, sort_order, visibility, icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        display_name || slug,
        slug,
        display_name || slug,
        description || '',
        system_prompt || '',
        max_tokens || 1200,
        sort_order || 99,
        visibility || 'all',
        icon || '💬',
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating mode:', error);
    res.status(500).json({ error: 'Failed to create mode' });
  }
});

// === USER MANAGEMENT ===
// Paginated GET /users is defined below in === UPDATED USER MANAGEMENT ===

// Update user (beta access, admin status, etc.)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { has_beta_access, beta_expires_at, is_admin } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (has_beta_access !== undefined) {
      updates.push(`has_beta_access = $${paramIndex++}`);
      values.push(has_beta_access);
    }
    if (beta_expires_at !== undefined) {
      updates.push(`beta_expires_at = $${paramIndex++}`);
      values.push(beta_expires_at);
    }
    if (is_admin !== undefined) {
      updates.push(`is_admin = $${paramIndex++}`);
      values.push(is_admin);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get user details
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const dealsResult = await query(
      `SELECT COUNT(*) as total_deals,
              COUNT(*) FILTER (WHERE status = 'active') as active_deals,
              COUNT(*) FILTER (WHERE status = 'won') as won_deals
       FROM deals WHERE user_id = $1`,
      [id]
    );

    res.json({
      ...userResult.rows[0],
      stats: dealsResult.rows[0],
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// === OVERVIEW ===

router.get('/overview', async (req, res) => {
  try {
    const [statsResult, topUsersResult, modeUsageResult] = await Promise.all([
      query(`
        SELECT
          (SELECT COUNT(*)::int FROM users) AS total_users,
          (SELECT COUNT(*)::int FROM users WHERE has_beta_access = true) AS beta_users,
          (SELECT COUNT(*)::int FROM deals WHERE status = 'active') AS active_deals,
          (SELECT COALESCE(SUM(turn_count), 0)::int FROM deals) AS total_turns
      `),
      query(`
        SELECT u.email, u.display_name, u.is_admin, u.has_beta_access, u.subscription_status,
               COUNT(DISTINCT d.id) AS deal_count,
               COALESCE(SUM(d.turn_count), 0)::int AS total_turns,
               MAX(d.updated_at) AS last_active
        FROM users u
        LEFT JOIN deals d ON d.user_id = u.id
          AND d.updated_at > NOW() - INTERVAL '7 days'
        GROUP BY u.id, u.email, u.display_name, u.is_admin, u.has_beta_access, u.subscription_status
        ORDER BY total_turns DESC
        LIMIT 5
      `),
      query(`
        SELECT m.slug, m.display_name, m.is_active,
               COUNT(DISTINCT tc.deal_id) AS session_count,
               COALESCE(ROUND(AVG(tc.turns)::numeric, 1), 0) AS avg_turns
        FROM modes m
        LEFT JOIN (
          SELECT mode_slug, deal_id, COUNT(*) AS turns
          FROM messages WHERE role = 'user'
          GROUP BY mode_slug, deal_id
        ) tc ON tc.mode_slug = m.slug
        GROUP BY m.id, m.slug, m.display_name, m.is_active, m.sort_order
        ORDER BY m.sort_order
      `),
    ]);

    res.json({
      stats: statsResult.rows[0],
      top_users: topUsersResult.rows,
      mode_usage: modeUsageResult.rows,
    });
  } catch (error) {
    console.error('Overview error:', error);
    res.status(500).json({ error: 'Failed to load overview' });
  }
});

// === UPDATED USER MANAGEMENT ===

// Get paginated users with deal stats
router.get('/users', async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = '';

    if (search) {
      params.push(`%${search}%`);
      where = `WHERE u.email ILIKE $${params.length} OR COALESCE(u.display_name,'') ILIKE $${params.length}`;
    }

    params.push(parseInt(limit), offset);

    const [usersResult, countResult] = await Promise.all([
      query(`
        SELECT u.id, u.email, u.display_name, u.is_admin, u.has_beta_access,
               u.beta_expires_at, u.subscription_status, u.created_at,
               COUNT(d.id) FILTER (WHERE d.status = 'active') AS deal_count,
               COALESCE(SUM(d.turn_count), 0)::int AS total_turns
        FROM users u
        LEFT JOIN deals d ON d.user_id = u.id
        ${where}
        GROUP BY u.id, u.email, u.display_name, u.is_admin, u.has_beta_access,
                 u.beta_expires_at, u.subscription_status, u.created_at
        ORDER BY u.created_at DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}
      `, params),
      query(`SELECT COUNT(*)::int AS total FROM users u ${where}`, search ? [`%${search}%`] : []),
    ]);

    res.json({ users: usersResult.rows, total: countResult.rows[0].total, page: parseInt(page) });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PATCH user — replaces/supplements existing PUT
router.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { has_beta_access, beta_expires_at, is_admin, subscription_status } = req.body;

    // Prevent self-lockout
    if (is_admin !== undefined && id === req.user.id) {
      return res.status(400).json({ error: 'Cannot modify your own admin status' });
    }

    // Fetch current user state so we can detect beta approval
    const existing = await query(`SELECT email, display_name, has_beta_access FROM users WHERE id = $1`, [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const existingUser = existing.rows[0];

    const updates = [];
    const values = [];
    let i = 1;

    if (has_beta_access !== undefined) { updates.push(`has_beta_access = $${i++}`); values.push(has_beta_access); }
    if (beta_expires_at !== undefined) { updates.push(`beta_expires_at = $${i++}`); values.push(beta_expires_at || null); }
    if (is_admin !== undefined) { updates.push(`is_admin = $${i++}`); values.push(is_admin); }
    if (subscription_status !== undefined) { updates.push(`subscription_status = $${i++}`); values.push(subscription_status); }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

    values.push(id);
    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    // Send beta approved email if access was just granted
    const beingApproved = has_beta_access === true && !existingUser.has_beta_access;
    if (beingApproved) {
      sendBetaApprovedEmail({ toEmail: existingUser.email, displayName: existingUser.display_name })
        .catch((err) => console.error('Beta approved email failed:', err.message));
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user (admin hard-delete, cannot delete self)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account from the admin panel' });
    }

    const exists = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (exists.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    await query('DELETE FROM messages WHERE user_id = $1', [id]);
    await query('DELETE FROM sessions WHERE user_id = $1', [id]);
    await query('DELETE FROM deals WHERE user_id = $1', [id]);
    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// === SESSION FLUSH ===

router.delete('/sessions', async (req, res) => {
  try {
    await query(
      `UPDATE app_settings SET value = (value::int + 1)::text WHERE key = 'jwt_version'`
    );
    res.json({ ok: true, message: 'All sessions invalidated' });
  } catch (error) {
    console.error('Error flushing sessions:', error);
    res.status(500).json({ error: 'Failed to flush sessions' });
  }
});

// === MODES UPDATE (PATCH alias) ===

router.patch('/modes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, system_prompt, max_tokens, is_active, visibility, icon } = req.body;

    if (max_tokens !== undefined && (max_tokens < 100 || max_tokens > 4000)) {
      return res.status(400).json({ error: 'max_tokens must be between 100 and 4000' });
    }
    if (visibility !== undefined && !['all', 'beta', 'admin'].includes(visibility)) {
      return res.status(400).json({ error: 'visibility must be all, beta, or admin' });
    }

    const result = await query(
      `UPDATE modes SET
        display_name = COALESCE($1, display_name),
        system_prompt = COALESCE($2, system_prompt),
        max_tokens = COALESCE($3, max_tokens),
        is_active = COALESCE($4, is_active),
        visibility = COALESCE($5, visibility),
        icon = COALESCE($6, icon),
        updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [display_name, system_prompt, max_tokens, is_active, visibility, icon, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mode not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating mode:', error);
    res.status(500).json({ error: 'Failed to update mode' });
  }
});

// === MODES DELETE ===

const PROTECTED_MODE_SLUGS = ['deal', 'coach', 'mindset'];

router.delete('/modes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the mode first to check its slug
    const check = await query(`SELECT slug FROM modes WHERE id = $1`, [id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Mode not found' });
    if (PROTECTED_MODE_SLUGS.includes(check.rows[0].slug)) {
      return res.status(403).json({ error: 'The original three modes cannot be deleted.' });
    }

    await query(`DELETE FROM modes WHERE id = $1`, [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting mode:', error);
    res.status(500).json({ error: 'Failed to delete mode' });
  }
});

// === SYSTEM HEALTH ===

router.get('/system', async (req, res) => {
  const start = Date.now();

  // Database check
  let database = { status: 'error', latency_ms: 0 };
  try {
    const t0 = Date.now();
    await query('SELECT 1');
    database = { status: 'ok', latency_ms: Date.now() - t0 };
  } catch { /* already errored */ }

  // Anthropic check (cached 60s)
  let anthropic = { status: 'error', model: null };
  if (Date.now() - anthropicCache.ts < 60_000 && anthropicCache.status) {
    anthropic = { status: anthropicCache.status, model: anthropicCache.model };
  } else {
    try {
      const checkModel = 'claude-haiku-4-5-20251001';
      await anthropicClient.messages.create({
        model: checkModel,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'ping' }],
      });
      anthropic = { status: 'ok', model: checkModel };
      anthropicCache = { status: 'ok', model: checkModel, ts: Date.now() };
    } catch (err) {
      anthropicCache = { status: 'error', model: null, ts: Date.now() };
    }
  }

  // Stripe check
  let stripeStatus = { status: 'error', mode: null };
  if (stripe) {
    try {
      const balance = await stripe.balance.retrieve();
      stripeStatus = {
        status: balance.livemode ? 'ok' : 'test_mode',
        mode: balance.livemode ? 'live' : 'test',
      };
    } catch { /* already errored */ }
  }

  // Spend log (current month)
  let spend = { rows: [], total_cost: 0 };
  try {
    const spendResult = await query(`
      SELECT model,
             COUNT(*)::int AS call_count,
             SUM(tokens_in)::int AS tokens_in,
             SUM(tokens_out)::int AS tokens_out,
             ROUND(SUM(est_cost)::numeric, 4) AS est_cost
      FROM api_spend_log
      WHERE created_at >= date_trunc('month', NOW())
      GROUP BY model
      ORDER BY est_cost DESC
    `);
    const total = spendResult.rows.reduce((acc, r) => acc + parseFloat(r.est_cost || 0), 0);
    spend = { rows: spendResult.rows, total_cost: Math.round(total * 10000) / 10000 };
  } catch { /* spend log may be empty */ }

  res.json({
    database,
    anthropic,
    stripe: stripeStatus,
    spend,
    active_connections: sseCount(),
  });
});

// === INVITE MANAGEMENT ===

// List all invites
router.get('/invites', async (req, res) => {
  try {
    const result = await query(
      `SELECT i.*, u.email AS invited_by_email
       FROM invites i
       LEFT JOIN users u ON u.id = i.invited_by
       ORDER BY i.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
});

// Create and send an invite
router.post('/invites', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const emailTrimmed = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailTrimmed)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  try {
    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [emailTrimmed]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'A user with this email already has an account' });
    }

    // Check for an active (unused, unexpired) invite
    const activeInvite = await query(
      `SELECT id FROM invites WHERE email = $1 AND accepted_at IS NULL AND expires_at > NOW()`,
      [emailTrimmed]
    );
    if (activeInvite.rows.length > 0) {
      return res.status(409).json({ error: 'An active invite for this email already exists' });
    }

    const token = randomUUID();
    const appBase = process.env.APP_BASE_URL || `https://${process.env.REPLIT_DEV_DOMAIN}`;
    const inviteUrl = `${appBase}/register?invite=${token}`;

    await query(
      `INSERT INTO invites (email, token, invited_by, has_beta_access)
       VALUES ($1, $2, $3, true)`,
      [emailTrimmed, token, req.user.id]
    );

    // Look up inviter display name for the email
    const inviterResult = await query(
      'SELECT display_name, email FROM users WHERE id = $1',
      [req.user.id]
    );
    const inviter = inviterResult.rows[0];
    const inviterName = inviter?.display_name || inviter?.email || 'The Red Zone Selling team';

    let emailSent = false;
    try {
      await sendInviteEmail({ toEmail: emailTrimmed, inviteUrl, inviterName });
      emailSent = true;
    } catch (emailErr) {
      console.error('Invite email failed (invite record still created):', emailErr.message);
    }

    res.status(201).json({ ok: true, invite_url: inviteUrl, email_sent: emailSent });
  } catch (error) {
    console.error('Error creating invite:', error);
    res.status(500).json({ error: error.message || 'Failed to create invite' });
  }
});

// Revoke an invite
router.delete('/invites/:id', async (req, res) => {
  try {
    const result = await query(
      `DELETE FROM invites WHERE id = $1 AND accepted_at IS NULL RETURNING id`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invite not found or already accepted' });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error('Error revoking invite:', error);
    res.status(500).json({ error: 'Failed to revoke invite' });
  }
});

// === ARTIFACT TEMPLATES (Tool Builder) ===

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 60);
}

async function parseFile(buffer, mimetype, originalname) {
  const ext = originalname.split('.').pop().toLowerCase();
  if (ext === 'docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value, format: 'docx' };
  }
  if (ext === 'xlsx' || mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const lines = [];
    workbook.SheetNames.forEach(sheetName => {
      lines.push(`=== Sheet: ${sheetName} ===`);
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      lines.push(csv);
    });
    return { text: lines.join('\n'), format: 'xlsx' };
  }
  throw new Error('Unsupported file format. Upload a DOCX or XLSX file.');
}

async function analyzeTemplateWithClaude(name, description, triggerZone, triggerCondition, rawStructure) {
  const systemMsg = `You are analyzing a sales template document to understand its structure and how it should be populated from a live sales coaching conversation.

Extract:
1. What each section/field represents
2. What deal context would populate it
3. The best render type for each section:
   - table: multiple rows of structured data
   - list: bullet items
   - scored_rows: criteria with scores
   - qa_blocks: question + answer pairs
   - action_plan: actions with owner + deadline
   - free_text: open-ended narrative

Return ONLY valid JSON — no prose, no code fences — matching this exact schema:
{
  "name": "string",
  "description": "string",
  "sections": [
    {
      "id": "string (snake_case)",
      "label": "string",
      "type": "table|list|scored_rows|qa_blocks|action_plan|free_text",
      "columns": ["string"],
      "items": ["string"],
      "populated_from": "string describing what deal data fills this",
      "required": true
    }
  ],
  "deal_context_required": ["company", "zone"],
  "generation_prompt": "string — instructions for populating this template from deal context",
  "render_config": {
    "header_color": "#C62828",
    "accent_color": "#1A1A1A",
    "show_rzs_branding": true
  }
}`;

  const userMsg = `Template name: ${name}
Description: ${description}
Used in zone: ${triggerZone}
Trigger condition: ${triggerCondition}

Template content:
${rawStructure.slice(0, 8000)}`;

  const response = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: systemMsg,
    messages: [{ role: 'user', content: userMsg }],
  });

  const text = response.content[0].text.trim()
    .replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(text);
}

// POST /api/admin/artifact-templates — upload + analyze
router.post('/artifact-templates', upload.single('file'), async (req, res) => {
  try {
    const { name, description, trigger_zone, trigger_condition, offer_language } = req.body;
    if (!name || !req.file) return res.status(400).json({ error: 'name and file are required' });

    const { text: rawStructure, format } = await parseFile(req.file.buffer, req.file.mimetype, req.file.originalname);

    let baseSlug = slugify(name);
    const existing = await query(`SELECT slug FROM artifact_templates WHERE slug LIKE $1 || '%'`, [baseSlug]);
    const slug = existing.rows.length ? `${baseSlug}_${Date.now()}` : baseSlug;

    const insertResult = await query(
      `INSERT INTO artifact_templates
         (name, slug, description, source_filename, source_format, raw_structure, offer_language, trigger_zone, trigger_condition, is_active, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false,$10)
       RETURNING *`,
      [name, slug, description || null, req.file.originalname, format, rawStructure,
       offer_language || null, trigger_zone || 'any', trigger_condition || null, req.user.id]
    );
    const template = insertResult.rows[0];

    let builderSpec = null;
    try {
      builderSpec = await analyzeTemplateWithClaude(name, description || '', trigger_zone || 'any', trigger_condition || '', rawStructure);
      await query(`UPDATE artifact_templates SET builder_spec=$1, updated_at=NOW() WHERE id=$2`, [JSON.stringify(builderSpec), template.id]);
      template.builder_spec = builderSpec;
    } catch (err) {
      console.error('Claude analysis failed:', err.message);
    }

    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating artifact template:', error);
    res.status(500).json({ error: error.message || 'Failed to create artifact template' });
  }
});

// GET /api/admin/artifact-templates
router.get('/artifact-templates', async (req, res) => {
  try {
    const result = await query(`
      SELECT id, name, slug, description, trigger_zone, trigger_condition, offer_language,
             is_active, render_type, created_at, source_filename,
             CASE WHEN builder_spec IS NOT NULL THEN jsonb_array_length(builder_spec->'sections') ELSE 0 END AS sections_count
      FROM artifact_templates
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching artifact templates:', error);
    res.status(500).json({ error: 'Failed to fetch artifact templates' });
  }
});

// GET /api/admin/artifact-templates/:id
router.get('/artifact-templates/:id', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM artifact_templates WHERE id=$1`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching artifact template:', error);
    res.status(500).json({ error: 'Failed to fetch artifact template' });
  }
});

// PATCH /api/admin/artifact-templates/:id
router.patch('/artifact-templates/:id', async (req, res) => {
  try {
    const { name, description, trigger_zone, trigger_condition, offer_language, is_active, builder_spec, render_type, resource_center_id, resource_center_url } = req.body;
    const sets = [];
    const vals = [];
    let p = 1;
    if (name !== undefined)               { sets.push(`name=$${p++}`);               vals.push(name); }
    if (description !== undefined)        { sets.push(`description=$${p++}`);        vals.push(description); }
    if (trigger_zone !== undefined)       { sets.push(`trigger_zone=$${p++}`);       vals.push(trigger_zone); }
    if (trigger_condition !== undefined)  { sets.push(`trigger_condition=$${p++}`);  vals.push(trigger_condition); }
    if (offer_language !== undefined)     { sets.push(`offer_language=$${p++}`);     vals.push(offer_language); }
    if (is_active !== undefined)          { sets.push(`is_active=$${p++}`);          vals.push(is_active); }
    if (render_type !== undefined)        { sets.push(`render_type=$${p++}`);        vals.push(render_type); }
    if (builder_spec !== undefined)       { sets.push(`builder_spec=$${p++}`);       vals.push(JSON.stringify(builder_spec)); }
    if (resource_center_id !== undefined) { sets.push(`resource_center_id=$${p++}`); vals.push(resource_center_id || null); }
    if (resource_center_url !== undefined){ sets.push(`resource_center_url=$${p++}`); vals.push(resource_center_url || null); }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    sets.push(`updated_at=NOW()`);
    vals.push(req.params.id);
    const result = await query(`UPDATE artifact_templates SET ${sets.join(',')} WHERE id=$${p} RETURNING *`, vals);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating artifact template:', error);
    res.status(500).json({ error: 'Failed to update artifact template' });
  }
});

// DELETE /api/admin/artifact-templates/:id
router.delete('/artifact-templates/:id', async (req, res) => {
  try {
    const result = await query(`DELETE FROM artifact_templates WHERE id=$1 RETURNING id`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting artifact template:', error);
    res.status(500).json({ error: 'Failed to delete artifact template' });
  }
});

// POST /api/admin/artifact-templates/:id/regenerate
router.post('/artifact-templates/:id/regenerate', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM artifact_templates WHERE id=$1`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    const t = result.rows[0];
    if (!t.raw_structure) return res.status(400).json({ error: 'No raw structure to analyze' });

    const spec = await analyzeTemplateWithClaude(t.name, t.description || '', t.trigger_zone || 'any', t.trigger_condition || '', t.raw_structure);
    const updated = await query(`UPDATE artifact_templates SET builder_spec=$1, updated_at=NOW() WHERE id=$2 RETURNING *`, [JSON.stringify(spec), t.id]);
    res.json(updated.rows[0]);
  } catch (error) {
    console.error('Error regenerating artifact template:', error);
    res.status(500).json({ error: error.message || 'Failed to regenerate' });
  }
});

// POST /api/admin/artifact-templates/:id/preview — generate preview artifact
router.post('/artifact-templates/:id/preview', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM artifact_templates WHERE id=$1`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    const t = result.rows[0];
    if (!t.builder_spec) return res.status(400).json({ error: 'Template has no builder spec yet' });

    const { generateFromTemplate } = await import('../services/artifacts.js');
    const dummyDeal = { company: 'Preview Corp', zone: 'green', deal_value: '$150,000', close_date: '2026-06-30', user_id: req.user.id };
    const dummyMessages = [
      { role: 'user', content: 'We need to close this deal with the ops team.' },
      { role: 'assistant', content: 'Understood. Let me help you map the stakeholders and next steps.' },
    ];
    const generated = await generateFromTemplate(t.id, dummyDeal, dummyMessages);
    res.json(generated);
  } catch (error) {
    console.error('Error previewing artifact template:', error);
    res.status(500).json({ error: error.message || 'Failed to generate preview' });
  }
});

// === RESOURCE CENTER ===

// GET /api/admin/resource-center
router.get('/resource-center', async (req, res) => {
  try {
    const result = await query(`
      SELECT id, code, name, description, zone, url, is_active, sort_order
      FROM resource_center_tools
      ORDER BY zone, sort_order ASC
    `);
    const grouped = { yellow: [], green: [], red: [], bonus: [] };
    result.rows.forEach(t => { if (grouped[t.zone]) grouped[t.zone].push(t); });
    res.json(grouped);
  } catch (error) {
    console.error('Error fetching resource center:', error);
    res.status(500).json({ error: 'Failed to fetch resource center' });
  }
});

// POST /api/admin/resource-center
router.post('/resource-center', async (req, res) => {
  try {
    const { code, name, description, zone, url, sort_order } = req.body;
    if (!code || !name || !zone) return res.status(400).json({ error: 'code, name, zone required' });
    const VALID_ZONES = ['yellow', 'green', 'red', 'bonus'];
    if (!VALID_ZONES.includes(zone)) return res.status(400).json({ error: 'Invalid zone' });

    const result = await query(
      `INSERT INTO resource_center_tools (code, name, description, zone, url, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *`,
      [code, name, description || null, zone, url || null, sort_order ?? 0]
    );
    bustRCCache();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.constraint === 'resource_center_tools_code_key') {
      return res.status(400).json({ error: `Code "${req.body.code}" already exists` });
    }
    console.error('Error creating resource center tool:', error);
    res.status(500).json({ error: 'Failed to create tool' });
  }
});

// PATCH /api/admin/resource-center/:id
router.patch('/resource-center/:id', async (req, res) => {
  try {
    const { name, description, url, is_active, sort_order, code } = req.body;
    const sets = [];
    const vals = [];
    let p = 1;
    if (name !== undefined)        { sets.push(`name=$${p++}`);        vals.push(name); }
    if (description !== undefined) { sets.push(`description=$${p++}`); vals.push(description); }
    if (url !== undefined)         { sets.push(`url=$${p++}`);         vals.push(url); }
    if (is_active !== undefined)   { sets.push(`is_active=$${p++}`);   vals.push(is_active); }
    if (sort_order !== undefined)  { sets.push(`sort_order=$${p++}`);  vals.push(sort_order); }
    if (code !== undefined)        { sets.push(`code=$${p++}`);        vals.push(code); }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    sets.push(`updated_at=NOW()`);
    vals.push(req.params.id);
    const result = await query(`UPDATE resource_center_tools SET ${sets.join(',')} WHERE id=$${p} RETURNING *`, vals);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    bustRCCache();
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating resource center tool:', error);
    res.status(500).json({ error: 'Failed to update tool' });
  }
});

// DELETE /api/admin/resource-center/:id
router.delete('/resource-center/:id', async (req, res) => {
  try {
    const result = await query(`DELETE FROM resource_center_tools WHERE id=$1 RETURNING id`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    bustRCCache();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource center tool:', error);
    res.status(500).json({ error: 'Failed to delete tool' });
  }
});

// === ANALYTICS ===

let analyticsCache = { data: null, ts: 0 };
const ANALYTICS_TTL = 10 * 60 * 1000; // 10 minutes

router.get('/analytics', async (req, res) => {
  if (analyticsCache.data && Date.now() - analyticsCache.ts < ANALYTICS_TTL) {
    return res.json(analyticsCache.data);
  }

  const period = Math.min(parseInt(req.query.period) || 30, 90);

  try {
    const [
      usersResult,
      wauResult,
      wauPriorResult,
      turnsResult,
      turnsPriorResult,
      dauResult,
      turnsSeriesResult,
      modeSessionsResult,
      modeTurnsResult,
      artifactResult,
      featureResult,
      retentionResult,
      dealHealthResult,
      dealTurnsResult,
    ] = await Promise.all([
      // 1. User counts
      query(`SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE has_beta_access = true AND subscription_status != 'active') AS beta,
        COUNT(*) FILTER (WHERE subscription_status = 'active') AS paying
        FROM users`),

      // 2. WAU (current 7 days)
      query(`SELECT COUNT(DISTINCT user_id) AS wau,
        COUNT(*) AS total_sessions
        FROM analytics_events
        WHERE created_at > NOW() - INTERVAL '7 days'
        AND event_type = 'app_session_start'`),

      // 3. WAU (prior 7 days)
      query(`SELECT COUNT(DISTINCT user_id) AS wau
        FROM analytics_events
        WHERE created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'
        AND event_type = 'app_session_start'`),

      // 4. Total coaching turns (current period)
      query(`SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') AS this_week,
        COUNT(*) FILTER (WHERE created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days') AS last_week
        FROM analytics_events WHERE event_type = 'coaching_turn'`),

      // 5. (merged into #4)
      query(`SELECT 1 AS dummy`),

      // 6. DAU series
      query(`SELECT DATE(created_at) AS date, COUNT(DISTINCT user_id) AS count
        FROM analytics_events
        WHERE created_at > NOW() - INTERVAL '${period} days'
        GROUP BY DATE(created_at) ORDER BY date ASC`),

      // 7. Coaching turns series
      query(`SELECT DATE(created_at) AS date, COUNT(*) AS count
        FROM analytics_events
        WHERE event_type = 'coaching_turn'
        AND created_at > NOW() - INTERVAL '${period} days'
        GROUP BY DATE(created_at) ORDER BY date ASC`),

      // 8. Mode sessions
      query(`SELECT properties->>'mode' AS mode, COUNT(*) AS sessions
        FROM analytics_events
        WHERE event_type = 'mode_entered'
        GROUP BY properties->>'mode'`),

      // 9. Mode avg turns (coaching_turn has mode in properties)
      query(`SELECT properties->>'mode' AS mode, COUNT(*) AS turns
        FROM analytics_events
        WHERE event_type = 'coaching_turn'
        GROUP BY properties->>'mode'`),

      // 10. Artifact performance
      query(`SELECT
        properties->>'type' AS artifact_type,
        COUNT(*) FILTER (WHERE event_type = 'artifact_offered') AS offered,
        COUNT(*) FILTER (WHERE event_type = 'artifact_accepted') AS accepted,
        COUNT(*) FILTER (WHERE event_type = 'artifact_dismissed') AS dismissed
        FROM analytics_events
        WHERE event_type IN ('artifact_offered','artifact_accepted','artifact_dismissed')
        GROUP BY properties->>'type'
        ORDER BY offered DESC`),

      // 11. Feature adoption
      query(`SELECT
        COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'transcript_uploaded') AS transcript_users,
        COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'document_uploaded') AS document_users,
        COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'resource_viewed') AS resource_users,
        COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'artifact_accepted') AS artifact_users
        FROM analytics_events`),

      // 12. Retention cohorts (last 8 weeks)
      query(`WITH cohorts AS (
        SELECT
          DATE_TRUNC('week', created_at) AS cohort_week,
          id AS user_id
        FROM users
        WHERE created_at > NOW() - INTERVAL '8 weeks'
      ),
      sessions AS (
        SELECT
          user_id,
          DATE_TRUNC('week', created_at) AS session_week
        FROM analytics_events
        WHERE event_type = 'app_session_start'
      )
      SELECT
        c.cohort_week,
        COUNT(DISTINCT c.user_id) AS new_users,
        COUNT(DISTINCT s1.user_id) FILTER (WHERE s1.session_week = c.cohort_week + INTERVAL '1 week') AS w2,
        COUNT(DISTINCT s2.user_id) FILTER (WHERE s2.session_week = c.cohort_week + INTERVAL '2 weeks') AS w3,
        COUNT(DISTINCT s3.user_id) FILTER (WHERE s3.session_week = c.cohort_week + INTERVAL '3 weeks') AS w4
      FROM cohorts c
      LEFT JOIN sessions s1 ON s1.user_id = c.user_id
      LEFT JOIN sessions s2 ON s2.user_id = c.user_id
      LEFT JOIN sessions s3 ON s3.user_id = c.user_id
      GROUP BY c.cohort_week
      ORDER BY c.cohort_week DESC`),

      // 13. Deal pipeline health
      query(`SELECT
        zone,
        status,
        COUNT(*) AS count
        FROM deals
        GROUP BY zone, status`),

      // 14. Avg turns per deal outcome
      query(`SELECT status, AVG(turn_count) AS avg_turns, COUNT(*) AS deal_count
        FROM deals WHERE status IN ('won','lost') GROUP BY status`),
    ]);

    const totalUsers = parseInt(usersResult.rows[0]?.total || 0);
    const wauData = wauResult.rows[0];
    const wau = parseInt(wauData?.wau || 0);
    const totalSessions = parseInt(wauData?.total_sessions || 0);
    const wauDelta = wau - parseInt(wauPriorResult.rows[0]?.wau || 0);
    const avgSessionsPerUser = wau > 0 ? (totalSessions / wau).toFixed(1) : 0;
    const totalTurns = parseInt(turnsResult.rows[0]?.total || 0);
    const turnsThisWeek = parseInt(turnsResult.rows[0]?.this_week || 0);
    const turnsLastWeek = parseInt(turnsResult.rows[0]?.last_week || 0);

    // Build mode_usage table
    const sessionsByMode = {};
    modeSessionsResult.rows.forEach(r => { sessionsByMode[r.mode] = parseInt(r.sessions); });
    const turnsByMode = {};
    modeTurnsResult.rows.forEach(r => { turnsByMode[r.mode] = parseInt(r.turns); });
    const totalModeSessions = Object.values(sessionsByMode).reduce((a, b) => a + b, 0);
    const modeUsage = ['deal', 'coach', 'mindset', 'resources'].map(m => ({
      mode: m,
      sessions: sessionsByMode[m] || 0,
      avg_turns: sessionsByMode[m] > 0 ? ((turnsByMode[m] || 0) / sessionsByMode[m]).toFixed(1) : '—',
      pct: totalModeSessions > 0 ? Math.round(((sessionsByMode[m] || 0) / totalModeSessions) * 100) : 0,
    }));

    // Build artifact performance table
    const artifactPerf = artifactResult.rows.map(r => ({
      type: r.artifact_type,
      offered: parseInt(r.offered || 0),
      accepted: parseInt(r.accepted || 0),
      dismissed: parseInt(r.dismissed || 0),
      rate: parseInt(r.offered) > 0 ? Math.round((parseInt(r.accepted) / parseInt(r.offered)) * 100) : 0,
    }));

    // Feature adoption
    const fa = featureResult.rows[0];
    const featureAdoption = [
      { feature: 'Transcript upload', users: parseInt(fa?.transcript_users || 0), total: totalUsers },
      { feature: 'Document upload', users: parseInt(fa?.document_users || 0), total: totalUsers },
      { feature: 'Resource Center', users: parseInt(fa?.resource_users || 0), total: totalUsers },
      { feature: 'Artifacts built', users: parseInt(fa?.artifact_users || 0), total: totalUsers },
    ].map(f => ({ ...f, pct: f.total > 0 ? Math.round((f.users / f.total) * 100) : 0 }));

    // Retention cohorts
    const retentionCohorts = retentionResult.rows.map(r => ({
      week: r.cohort_week,
      new_users: parseInt(r.new_users || 0),
      w2: parseInt(r.new_users) > 0 ? Math.round((parseInt(r.w2 || 0) / parseInt(r.new_users)) * 100) : null,
      w3: parseInt(r.new_users) > 0 ? Math.round((parseInt(r.w3 || 0) / parseInt(r.new_users)) * 100) : null,
      w4: parseInt(r.new_users) > 0 ? Math.round((parseInt(r.w4 || 0) / parseInt(r.new_users)) * 100) : null,
    }));

    // Deal pipeline health
    const dealHealthRows = dealHealthResult.rows;
    const activeByZone = { yellow: 0, green: 0, red: 0 };
    let wonCount = 0, lostCount = 0;
    dealHealthRows.forEach(r => {
      if (r.status === 'active' && activeByZone.hasOwnProperty(r.zone)) {
        activeByZone[r.zone] = parseInt(r.count);
      }
      if (r.status === 'won') wonCount += parseInt(r.count);
      if (r.status === 'lost') lostCount += parseInt(r.count);
    });
    const winRate = (wonCount + lostCount) > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : null;
    const wonTurns = dealTurnsResult.rows.find(r => r.status === 'won');
    const lostTurns = dealTurnsResult.rows.find(r => r.status === 'lost');
    const dealHealth = {
      active_by_zone: activeByZone,
      won: wonCount,
      lost: lostCount,
      win_rate: winRate,
      avg_turns_won: wonTurns ? parseFloat(parseFloat(wonTurns.avg_turns).toFixed(1)) : null,
      avg_turns_lost: lostTurns ? parseFloat(parseFloat(lostTurns.avg_turns).toFixed(1)) : null,
    };

    const data = {
      key_metrics: {
        total_users: totalUsers,
        beta_users: parseInt(usersResult.rows[0]?.beta || 0),
        paying_subscribers: parseInt(usersResult.rows[0]?.paying || 0),
        wau,
        wau_delta: wauDelta,
        avg_sessions_per_user: parseFloat(avgSessionsPerUser),
        total_turns: totalTurns,
        turns_this_week: turnsThisWeek,
        turns_last_week: turnsLastWeek,
      },
      dau_series: dauResult.rows.map(r => ({ date: r.date, count: parseInt(r.count) })),
      turns_series: turnsSeriesResult.rows.map(r => ({ date: r.date, count: parseInt(r.count) })),
      mode_usage: modeUsage,
      artifact_performance: artifactPerf,
      feature_adoption: featureAdoption,
      retention_cohorts: retentionCohorts,
      deal_health: dealHealth,
      period,
    };

    analyticsCache = { data, ts: Date.now() };
    res.json(data);
  } catch (error) {
    console.error('Analytics query error:', error);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// === DANGER ZONE ===

// Reset all beta flags (non-admin users only)
router.delete('/beta-flags', async (req, res) => {
  try {
    const result = await query(
      `UPDATE users SET has_beta_access = false WHERE is_admin = false`
    );
    res.json({ ok: true, updated: result.rowCount });
  } catch (error) {
    console.error('Error resetting beta flags:', error);
    res.status(500).json({ error: 'Failed to reset beta flags' });
  }
});

export default router;
