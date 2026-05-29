import cron from 'node-cron';
import { Resend } from 'resend';
import { query } from '../db/index.js';

const REPORT_TO = 'vince@vincebeese.com';
const FROM_EMAIL = 'noreply@redzoneselling.co';
const PROFILE_FIELDS = ['icp', 'avg_deal_size', 'sales_cycle', 'win_themes', 'loss_patterns', 'user_role', 'has_read_rzs', 'common_deal_killers'];

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n) {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US');
}

function fmtDecimal(n, places = 1) {
  if (!n || isNaN(n)) return '0.0';
  return Number(n).toFixed(places);
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function div(a, b) {
  return b > 0 ? a / b : 0;
}

// ─── Date windows ────────────────────────────────────────────────────────────

function getDateWindows() {
  const now = new Date();
  // Current month start: first day of current month at midnight UTC
  const mtdStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  // MTD end: start of today (exclusive) — "through yesterday"
  const mtdEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  // Previous month
  const prevStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const prevEnd = new Date(mtdStart); // exclusive — same as mtdStart
  // Yesterday window for engagement signals
  const yesterdayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
  const yesterdayEnd = new Date(mtdEnd); // same as today start

  return { mtdStart, mtdEnd, prevStart, prevEnd, yesterdayStart, yesterdayEnd };
}

// ─── Core metrics query for a time window ────────────────────────────────────

async function buildMetricsForPeriod(start, end) {
  const s = start.toISOString();
  const e = end.toISOString();

  // Deal mode: active users, sessions (distinct deals touched), turns
  const { rows: [deal] } = await query(`
    SELECT
      COUNT(DISTINCT user_id)::int  AS active_users,
      COUNT(DISTINCT deal_id)::int  AS sessions,
      COUNT(CASE WHEN role = 'assistant' THEN 1 END)::int AS turns
    FROM messages
    WHERE mode_slug = 'deal'
      AND created_at >= $1 AND created_at < $2
  `, [s, e]);

  // Coach and Mindset: active users, sessions (session rows created), turns (assistant messages)
  const { rows: modeRows } = await query(`
    SELECT
      s.mode_slug,
      COUNT(DISTINCT s.user_id)::int                             AS active_users,
      COUNT(DISTINCT s.id)::int                                  AS sessions,
      COALESCE(SUM(tc.turn_count), 0)::int                       AS turns
    FROM sessions s
    LEFT JOIN (
      SELECT session_id, COUNT(*) AS turn_count
      FROM session_messages
      WHERE role = 'assistant'
      GROUP BY session_id
    ) tc ON tc.session_id = s.id
    WHERE s.mode_slug IN ('coach', 'mindset')
      AND s.created_at >= $1 AND s.created_at < $2
    GROUP BY s.mode_slug
  `, [s, e]);

  const coach   = modeRows.find(r => r.mode_slug === 'coach')   || { active_users: 0, sessions: 0, turns: 0 };
  const mindset = modeRows.find(r => r.mode_slug === 'mindset') || { active_users: 0, sessions: 0, turns: 0 };

  // Paying subscribers (subscription_status = 'active') — current global count
  const { rows: [totUsers] } = await query(`
    SELECT COUNT(*)::int AS active_users FROM users WHERE subscription_status = 'active'
  `);

  // New users (account created in window)
  const { rows: [newU] } = await query(`
    SELECT COUNT(*)::int AS new_users FROM users WHERE created_at >= $1 AND created_at < $2
  `, [s, e]);

  const totalSessions = deal.sessions + coach.sessions + mindset.sessions;
  const totalTurns    = deal.turns    + coach.turns    + mindset.turns;
  const activeUsers   = totUsers.active_users;
  const newUsers      = newU.new_users;

  return {
    platform: {
      active_users:            activeUsers,
      new_users:               newUsers,
      total_sessions:          totalSessions,
      total_turns:             totalTurns,
      avg_sessions_per_user:   fmtDecimal(div(totalSessions, activeUsers)),
      avg_turns_per_session:   fmtDecimal(div(totalTurns, totalSessions)),
      avg_turns_per_user:      fmtDecimal(div(totalTurns, activeUsers)),
    },
    modes: {
      deal:    { active_users: deal.active_users,    sessions: deal.sessions,    turns: deal.turns,    avg_turns_per_session: fmtDecimal(div(deal.turns,    deal.sessions)) },
      coach:   { active_users: coach.active_users,   sessions: coach.sessions,   turns: coach.turns,   avg_turns_per_session: fmtDecimal(div(coach.turns,   coach.sessions)) },
      mindset: { active_users: mindset.active_users, sessions: mindset.sessions, turns: mindset.turns, avg_turns_per_session: fmtDecimal(div(mindset.turns, mindset.sessions)) },
      totals:  {
        active_users: activeUsers,
        sessions:     totalSessions,
        turns:        totalTurns,
        avg_turns_per_session: fmtDecimal(div(totalTurns, totalSessions)),
      },
    },
  };
}

// ─── Top users ───────────────────────────────────────────────────────────────

async function buildTopUsers(start, end, limit = 10) {
  const s = start.toISOString();
  const e = end.toISOString();

  const { rows } = await query(`
    WITH deal_stats AS (
      SELECT user_id,
        COUNT(DISTINCT deal_id)::int                              AS sessions,
        COUNT(CASE WHEN role = 'assistant' THEN 1 END)::int       AS turns
      FROM messages
      WHERE mode_slug = 'deal' AND created_at >= $1 AND created_at < $2
      GROUP BY user_id
    ),
    coach_stats AS (
      SELECT s.user_id,
        COUNT(DISTINCT s.id)::int    AS sessions,
        COALESCE(SUM(tc.turn_count), 0)::int AS turns,
        bool_or(s.mode_slug = 'coach')   AS used_coach,
        bool_or(s.mode_slug = 'mindset') AS used_mindset
      FROM sessions s
      LEFT JOIN (
        SELECT session_id, COUNT(*) AS turn_count
        FROM session_messages WHERE role = 'assistant'
        GROUP BY session_id
      ) tc ON tc.session_id = s.id
      WHERE s.mode_slug IN ('coach','mindset')
        AND s.created_at >= $1 AND s.created_at < $2
      GROUP BY s.user_id
    ),
    profile_check AS (
      SELECT user_id,
        (icp IS NOT NULL AND icp != '' AND
         avg_deal_size IS NOT NULL AND avg_deal_size != '' AND
         sales_cycle IS NOT NULL AND sales_cycle != '' AND
         win_themes IS NOT NULL AND win_themes != '' AND
         loss_patterns IS NOT NULL AND loss_patterns != '' AND
         user_role IS NOT NULL AND user_role != '' AND
         has_read_rzs IS NOT NULL AND has_read_rzs != '' AND
         common_deal_killers IS NOT NULL AND common_deal_killers != '') AS is_complete
      FROM seller_profiles
    )
    SELECT
      u.display_name,
      u.email,
      u.created_at AS member_since,
      COALESCE(ds.sessions, 0) + COALESCE(cs.sessions, 0) AS total_sessions,
      COALESCE(ds.turns, 0)    + COALESCE(cs.turns, 0)    AS total_turns,
      COALESCE(ds.sessions, 0) > 0        AS used_deal,
      COALESCE(cs.used_coach, false)      AS used_coach,
      COALESCE(cs.used_mindset, false)    AS used_mindset,
      COALESCE(pc.is_complete, false)     AS profile_complete
    FROM users u
    LEFT JOIN deal_stats ds  ON ds.user_id  = u.id
    LEFT JOIN coach_stats cs ON cs.user_id  = u.id
    LEFT JOIN profile_check pc ON pc.user_id = u.id
    WHERE COALESCE(ds.sessions, 0) + COALESCE(cs.sessions, 0) > 0
    ORDER BY total_sessions DESC, total_turns DESC
    LIMIT $3
  `, [s, e, limit]);

  return rows;
}

// ─── Engagement signals ───────────────────────────────────────────────────────

async function buildEngagementSignals(mtdStart, mtdEnd, prevStart, prevEnd, yesterdayStart, yesterdayEnd) {
  const ms = mtdStart.toISOString();
  const me = mtdEnd.toISOString();
  const ps = prevStart.toISOString();
  const pe = prevEnd.toISOString();
  const ys = yesterdayStart.toISOString();
  const ye = yesterdayEnd.toISOString();

  // 1. New users yesterday (account created yesterday)
  const { rows: newYesterday } = await query(`
    SELECT display_name, email FROM users
    WHERE created_at >= $1 AND created_at < $2
    ORDER BY created_at
  `, [ys, ye]);

  // 2. Power users: >= 10 sessions this month MTD
  const { rows: powerUsers } = await query(`
    WITH deal_s AS (
      SELECT user_id, COUNT(DISTINCT deal_id)::int AS sessions FROM messages
      WHERE mode_slug='deal' AND created_at >= $1 AND created_at < $2
      GROUP BY user_id
    ),
    coach_s AS (
      SELECT user_id, COUNT(DISTINCT id)::int AS sessions FROM sessions
      WHERE created_at >= $1 AND created_at < $2
      GROUP BY user_id
    )
    SELECT u.display_name, u.email,
      COALESCE(ds.sessions,0) + COALESCE(cs.sessions,0) AS total_sessions
    FROM users u
    LEFT JOIN deal_s ds ON ds.user_id = u.id
    LEFT JOIN coach_s cs ON cs.user_id = u.id
    WHERE COALESCE(ds.sessions,0) + COALESCE(cs.sessions,0) >= 10
    ORDER BY total_sessions DESC
  `, [ms, me]);

  // 3. At-risk: active last month, zero sessions this month
  const { rows: atRisk } = await query(`
    WITH prev_active AS (
      SELECT DISTINCT user_id FROM messages WHERE mode_slug='deal' AND created_at >= $1 AND created_at < $2
      UNION
      SELECT DISTINCT user_id FROM sessions WHERE created_at >= $1 AND created_at < $2
    ),
    curr_active AS (
      SELECT DISTINCT user_id FROM messages WHERE mode_slug='deal' AND created_at >= $3 AND created_at < $4
      UNION
      SELECT DISTINCT user_id FROM sessions WHERE created_at >= $3 AND created_at < $4
    ),
    last_sessions AS (
      SELECT user_id, MAX(created_at) AS last_session FROM (
        SELECT user_id, created_at FROM messages WHERE mode_slug='deal' AND created_at >= $1 AND created_at < $2
        UNION ALL
        SELECT user_id, created_at FROM sessions WHERE created_at >= $1 AND created_at < $2
      ) combined
      GROUP BY user_id
    )
    SELECT u.display_name, u.email, ls.last_session
    FROM prev_active pa
    JOIN users u ON u.id = pa.user_id
    LEFT JOIN curr_active ca ON ca.user_id = pa.user_id
    LEFT JOIN last_sessions ls ON ls.user_id = pa.user_id
    WHERE ca.user_id IS NULL
    ORDER BY ls.last_session DESC
  `, [ps, pe, ms, me]);

  // 4. Profile completion rate
  const { rows: [profileStats] } = await query(`
    SELECT
      COUNT(*)::int AS total_with_profile,
      COUNT(CASE WHEN
        icp IS NOT NULL AND icp != '' AND
        avg_deal_size IS NOT NULL AND avg_deal_size != '' AND
        sales_cycle IS NOT NULL AND sales_cycle != '' AND
        win_themes IS NOT NULL AND win_themes != '' AND
        loss_patterns IS NOT NULL AND loss_patterns != '' AND
        user_role IS NOT NULL AND user_role != '' AND
        has_read_rzs IS NOT NULL AND has_read_rzs != '' AND
        common_deal_killers IS NOT NULL AND common_deal_killers != ''
      THEN 1 END)::int AS complete_count
    FROM seller_profiles
  `);

  const { rows: [totalUsers] } = await query(`SELECT COUNT(*)::int AS cnt FROM users WHERE is_admin = false`);

  const totalU = totalUsers.cnt;
  const completeCount = profileStats.complete_count;
  const incompleteCount = totalU - completeCount;
  const completePct = totalU > 0 ? ((completeCount / totalU) * 100).toFixed(1) : '0.0';
  const incompletePct = totalU > 0 ? (((incompleteCount) / totalU) * 100).toFixed(1) : '0.0';

  return {
    newYesterday,
    powerUsers,
    atRisk,
    profile: { completeCount, incompleteCount, completePct, incompletePct, totalU },
  };
}

// ─── Build full report ────────────────────────────────────────────────────────

async function buildReport() {
  const windows = getDateWindows();
  const { mtdStart, mtdEnd, prevStart, prevEnd, yesterdayStart, yesterdayEnd } = windows;

  const [current, yesterday, previous, topUsers, signals] = await Promise.all([
    buildMetricsForPeriod(mtdStart, mtdEnd),
    buildMetricsForPeriod(yesterdayStart, yesterdayEnd),
    buildMetricsForPeriod(prevStart, prevEnd),
    buildTopUsers(mtdStart, mtdEnd),
    buildEngagementSignals(mtdStart, mtdEnd, prevStart, prevEnd, yesterdayStart, yesterdayEnd),
  ]);

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const mtdLabel = `${mtdStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(mtdEnd.getTime() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const prevLabel = `${prevStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  const yesterdayLabel = yesterdayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return { current, yesterday, previous, topUsers, signals, dateLabel, mtdLabel, prevLabel, yesterdayLabel };
}

// ─── HTML Email ───────────────────────────────────────────────────────────────

function buildHtmlEmail(report) {
  const { current: c, yesterday: y, previous: p, topUsers, signals, dateLabel, mtdLabel, prevLabel, yesterdayLabel } = report;

  const th = (t, bg = '#c8102e') => `<th style="text-align:left;padding:7px 10px;font-size:12px;font-weight:600;color:#fff;background:${bg};white-space:nowrap;">${t}</th>`;
  const td = (t, bold = false) => `<td style="padding:7px 10px;font-size:13px;color:#1a1a2e;border-bottom:1px solid #f0f0f0;${bold ? 'font-weight:700;' : ''}">${t ?? '—'}</td>`;
  const tdYest = (t, bold = false) => `<td style="padding:7px 10px;font-size:13px;color:#1a1a2e;border-bottom:1px solid #f0f0f0;background:#fffbf0;${bold ? 'font-weight:700;' : ''}">${t ?? '—'}</td>`;
  const tdGray = (t) => `<td style="padding:7px 10px;font-size:13px;color:#888;background:#fafafa;border-bottom:1px solid #f0f0f0;">${t ?? '—'}</td>`;

  const modeRows = (label, curr, yest, prev) => `
    <tr>
      ${td(label, true)}
      ${td(fmt(curr.active_users))}
      ${tdYest(fmt(yest.active_users))}
      ${tdGray(fmt(prev.active_users))}
    </tr>
    <tr>
      ${td('&nbsp;&nbsp;Sessions')}
      ${td(fmt(curr.sessions))}
      ${tdYest(fmt(yest.sessions))}
      ${tdGray(fmt(prev.sessions))}
    </tr>
    <tr>
      ${td('&nbsp;&nbsp;Turns')}
      ${td(fmt(curr.turns))}
      ${tdYest(fmt(yest.turns))}
      ${tdGray(fmt(prev.turns))}
    </tr>
    <tr>
      ${td('&nbsp;&nbsp;Avg turns/session')}
      ${td(curr.avg_turns_per_session)}
      ${tdYest(yest.avg_turns_per_session)}
      ${tdGray(prev.avg_turns_per_session)}
    </tr>
  `;

  const modesTable = `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:12px;">
      <thead>
        <tr>
          ${th('Mode / Metric')}
          ${th(`Current MTD<br/><span style="font-weight:400;">${mtdLabel}</span>`)}
          ${th(`Yesterday<br/><span style="font-weight:400;">${yesterdayLabel}</span>`, '#b8860b')}
          ${th(`Previous Month<br/><span style="font-weight:400;">${prevLabel}</span>`, '#555')}
        </tr>
      </thead>
      <tbody>
        ${modeRows('Deal Mode', c.modes.deal, y.modes.deal, p.modes.deal)}
        ${modeRows('Coach Mode', c.modes.coach, y.modes.coach, p.modes.coach)}
        ${modeRows('Mindset Mode', c.modes.mindset, y.modes.mindset, p.modes.mindset)}
        <tr style="background:#fff8f8;">
          ${td('Combined Totals', true)}
          ${td(fmt(c.modes.totals.active_users), true)}
          ${tdYest(fmt(y.modes.totals.active_users), true)}
          ${tdGray(fmt(p.modes.totals.active_users))}
        </tr>
        <tr style="background:#fff8f8;">
          ${td('&nbsp;&nbsp;Sessions')}
          ${td(fmt(c.modes.totals.sessions), true)}
          ${tdYest(fmt(y.modes.totals.sessions))}
          ${tdGray(fmt(p.modes.totals.sessions))}
        </tr>
        <tr style="background:#fff8f8;">
          ${td('&nbsp;&nbsp;Turns')}
          ${td(fmt(c.modes.totals.turns), true)}
          ${tdYest(fmt(y.modes.totals.turns))}
          ${tdGray(fmt(p.modes.totals.turns))}
        </tr>
        <tr style="background:#fff8f8;">
          ${td('&nbsp;&nbsp;Avg turns/session')}
          ${td(c.modes.totals.avg_turns_per_session, true)}
          ${tdYest(y.modes.totals.avg_turns_per_session)}
          ${tdGray(p.modes.totals.avg_turns_per_session)}
        </tr>
      </tbody>
    </table>
  `;

  const topUsersRows = topUsers.map((u, i) => {
    const modes = [u.used_deal && 'Deal', u.used_coach && 'Coach', u.used_mindset && 'Mindset'].filter(Boolean).join(', ') || '—';
    return `<tr>
      <td style="padding:6px 8px;font-size:12px;color:#888;border-bottom:1px solid #f0f0f0;">${i + 1}</td>
      <td style="padding:6px 8px;font-size:12px;color:#1a1a2e;border-bottom:1px solid #f0f0f0;">${u.display_name || '—'}</td>
      <td style="padding:6px 8px;font-size:12px;color:#555;border-bottom:1px solid #f0f0f0;">${u.email}</td>
      <td style="padding:6px 8px;font-size:12px;font-weight:700;color:#1a1a2e;border-bottom:1px solid #f0f0f0;">${fmt(u.total_sessions)}</td>
      <td style="padding:6px 8px;font-size:12px;color:#1a1a2e;border-bottom:1px solid #f0f0f0;">${fmt(u.total_turns)}</td>
      <td style="padding:6px 8px;font-size:12px;color:#555;border-bottom:1px solid #f0f0f0;">${modes}</td>
      <td style="padding:6px 8px;font-size:12px;border-bottom:1px solid #f0f0f0;">${u.profile_complete ? '✓' : '—'}</td>
      <td style="padding:6px 8px;font-size:12px;color:#888;border-bottom:1px solid #f0f0f0;">${fmtDate(u.member_since)}</td>
    </tr>`;
  }).join('');

  const newYesterdayContent = signals.newYesterday.length === 0
    ? '<p style="color:#888;font-size:13px;margin:8px 0 0;">No new users yesterday.</p>'
    : signals.newYesterday.map(u => `<p style="font-size:13px;margin:4px 0;color:#1a1a2e;"><strong>${u.display_name || '—'}</strong> &nbsp;<span style="color:#888;">${u.email}</span></p>`).join('');

  const powerUsersContent = signals.powerUsers.length === 0
    ? '<p style="color:#888;font-size:13px;margin:8px 0 0;">No power users this month yet.</p>'
    : signals.powerUsers.map(u => `<p style="font-size:13px;margin:4px 0;color:#1a1a2e;"><strong>${u.display_name || '—'}</strong> &nbsp;<span style="color:#888;">${u.email}</span> &nbsp;<strong style="color:#c8102e;">${u.total_sessions} sessions</strong></p>`).join('');

  const atRiskContent = signals.atRisk.length === 0
    ? '<p style="color:#888;font-size:13px;margin:8px 0 0;">No at-risk users — everyone is active this month.</p>'
    : signals.atRisk.map(u => `<p style="font-size:13px;margin:4px 0;color:#1a1a2e;"><strong>${u.display_name || '—'}</strong> &nbsp;<span style="color:#888;">${u.email}</span> &nbsp;<span style="color:#888;font-size:12px;">last session ${fmtDate(u.last_session)}</span></p>`).join('');

  const { completeCount, incompleteCount, completePct, incompletePct } = signals.profile;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:sans-serif;">
<div style="max-width:680px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

  <!-- Header -->
  <div style="background:#1a1a2e;padding:24px 28px;">
    <h1 style="color:#c8102e;font-size:20px;margin:0 0 4px;">Red Zone Selling AI Coach</h1>
    <p style="color:#aaa;font-size:13px;margin:0;">Daily Metrics Report &mdash; ${dateLabel}</p>
  </div>

  <div style="padding:28px;">

    <!-- SECTION 1: Platform Summary -->
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#c8102e;margin:0 0 12px;border-bottom:2px solid #c8102e;padding-bottom:6px;">Platform Summary</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <thead>
        <tr>
          ${th('Metric')}
          ${th(`Current MTD<br/><span style="font-weight:400;font-size:11px;">${mtdLabel}</span>`)}
          ${th(`Yesterday<br/><span style="font-weight:400;font-size:11px;">${yesterdayLabel}</span>`, '#b8860b')}
          ${th(`Previous Month<br/><span style="font-weight:400;font-size:11px;">${prevLabel}</span>`, '#555')}
        </tr>
      </thead>
      <tbody>
        <tr>${td('Paying Subscribers')}${td(fmt(c.platform.active_users), true)}${tdYest(fmt(y.platform.active_users))}${tdGray(fmt(p.platform.active_users))}</tr>
        <tr>${td('New Users')}${td(fmt(c.platform.new_users), true)}${tdYest(fmt(y.platform.new_users))}${tdGray(fmt(p.platform.new_users))}</tr>
        <tr>${td('Total Sessions')}${td(fmt(c.platform.total_sessions), true)}${tdYest(fmt(y.platform.total_sessions))}${tdGray(fmt(p.platform.total_sessions))}</tr>
        <tr>${td('Total Coaching Turns')}${td(fmt(c.platform.total_turns), true)}${tdYest(fmt(y.platform.total_turns))}${tdGray(fmt(p.platform.total_turns))}</tr>
        <tr>${td('Avg Sessions / User')}${td(c.platform.avg_sessions_per_user, true)}${tdYest(y.platform.avg_sessions_per_user)}${tdGray(p.platform.avg_sessions_per_user)}</tr>
        <tr>${td('Avg Turns / Session')}${td(c.platform.avg_turns_per_session, true)}${tdYest(y.platform.avg_turns_per_session)}${tdGray(p.platform.avg_turns_per_session)}</tr>
        <tr>${td('Avg Turns / User')}${td(c.platform.avg_turns_per_user, true)}${tdYest(y.platform.avg_turns_per_user)}${tdGray(p.platform.avg_turns_per_user)}</tr>
      </tbody>
    </table>

    <!-- SECTION 2: Mode Breakdown -->
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#c8102e;margin:28px 0 12px;border-bottom:2px solid #c8102e;padding-bottom:6px;">Mode Breakdown</h2>
    ${modesTable}

    <!-- SECTION 3: Top Users -->
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#c8102e;margin:28px 0 12px;border-bottom:2px solid #c8102e;padding-bottom:6px;">Top Users — Current Month MTD</h2>
    <div style="overflow-x:auto;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;min-width:560px;">
        <thead>
          <tr style="background:#1a1a2e;">
            <th style="padding:7px 8px;font-size:11px;font-weight:600;color:#fff;text-align:left;">#</th>
            <th style="padding:7px 8px;font-size:11px;font-weight:600;color:#fff;text-align:left;">Name</th>
            <th style="padding:7px 8px;font-size:11px;font-weight:600;color:#fff;text-align:left;">Email</th>
            <th style="padding:7px 8px;font-size:11px;font-weight:600;color:#fff;text-align:left;">Sessions</th>
            <th style="padding:7px 8px;font-size:11px;font-weight:600;color:#fff;text-align:left;">Turns</th>
            <th style="padding:7px 8px;font-size:11px;font-weight:600;color:#fff;text-align:left;">Modes</th>
            <th style="padding:7px 8px;font-size:11px;font-weight:600;color:#fff;text-align:left;">Profile</th>
            <th style="padding:7px 8px;font-size:11px;font-weight:600;color:#fff;text-align:left;">Member Since</th>
          </tr>
        </thead>
        <tbody>${topUsersRows || '<tr><td colspan="8" style="padding:12px 8px;font-size:13px;color:#888;">No sessions this period.</td></tr>'}</tbody>
      </table>
    </div>

    <!-- SECTION 4: Engagement Signals -->
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#c8102e;margin:28px 0 12px;border-bottom:2px solid #c8102e;padding-bottom:6px;">Engagement Signals</h2>

    <div style="margin-bottom:18px;">
      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#1a1a2e;margin:0 0 6px;">New Users Yesterday (${signals.newYesterday.length})</p>
      ${newYesterdayContent}
    </div>

    <div style="margin-bottom:18px;">
      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#1a1a2e;margin:0 0 6px;">Power Users — 10+ Sessions This Month (${signals.powerUsers.length})</p>
      ${powerUsersContent}
    </div>

    <div style="margin-bottom:18px;">
      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#1a1a2e;margin:0 0 6px;">At-Risk — Active Last Month, Zero Sessions This Month (${signals.atRisk.length})</p>
      ${atRiskContent}
    </div>

    <div style="margin-bottom:8px;">
      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#1a1a2e;margin:0 0 6px;">Profile Completion Rate (All Users)</p>
      <p style="font-size:13px;color:#1a1a2e;margin:4px 0;"><strong style="color:#2e7d32;">${completePct}% complete</strong> &mdash; ${fmt(completeCount)} users</p>
      <p style="font-size:13px;color:#1a1a2e;margin:4px 0;"><strong style="color:#888;">${incompletePct}% incomplete</strong> &mdash; ${fmt(incompleteCount)} users</p>
    </div>

  </div>

  <div style="background:#f9f9f9;padding:16px 28px;border-top:1px solid #eee;">
    <p style="font-size:11px;color:#aaa;margin:0;">Red Zone Selling AI Coach &mdash; Daily Metrics Report &mdash; ${dateLabel}</p>
  </div>
</div>
</body>
</html>`;
}

// ─── Slack Block Kit ──────────────────────────────────────────────────────────

function buildSlackBlocks(report) {
  const { current: c, yesterday: y, previous: p, topUsers, signals, dateLabel, mtdLabel, prevLabel, yesterdayLabel } = report;

  const metricLine = (label, curr, yest, prev) =>
    `*${label}:* ${fmt(curr)} · _Yesterday: ${fmt(yest)}_ · _(prev mo: ${fmt(prev)})_`;

  const topUserLines = topUsers.slice(0, 10).map((u, i) => {
    const modes = [u.used_deal && 'Deal', u.used_coach && 'Coach', u.used_mindset && 'Mindset'].filter(Boolean).join('/') || '—';
    return `${i + 1}. *${u.display_name || u.email}* — ${fmt(u.total_sessions)} sessions · ${fmt(u.total_turns)} turns · ${modes}`;
  }).join('\n');

  const newYestLines = signals.newYesterday.length === 0
    ? '_None_'
    : signals.newYesterday.map(u => `• ${u.display_name || '—'} (${u.email})`).join('\n');

  const powerLines = signals.powerUsers.length === 0
    ? '_None_'
    : signals.powerUsers.map(u => `• ${u.display_name || '—'} (${u.email}) — *${u.total_sessions} sessions*`).join('\n');

  const atRiskLines = signals.atRisk.length === 0
    ? '_None — everyone active this month_ 🎉'
    : signals.atRisk.map(u => `• ${u.display_name || '—'} (${u.email}) — last session ${fmtDate(u.last_session)}`).join('\n');

  const { completeCount, incompleteCount, completePct, incompletePct } = signals.profile;

  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: `📊 RZS AI Coach — Daily Metrics — ${dateLabel}` },
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*PLATFORM SUMMARY* · MTD: ${mtdLabel} · Yesterday: ${yesterdayLabel} · Prev Month: ${prevLabel}\n\n` +
          metricLine('Paying Subscribers', c.platform.active_users, y.platform.active_users, p.platform.active_users) + '\n' +
          metricLine('New Users', c.platform.new_users, y.platform.new_users, p.platform.new_users) + '\n' +
          metricLine('Total Sessions', c.platform.total_sessions, y.platform.total_sessions, p.platform.total_sessions) + '\n' +
          metricLine('Total Coaching Turns', c.platform.total_turns, y.platform.total_turns, p.platform.total_turns) + '\n' +
          `*Avg Sessions/User:* ${c.platform.avg_sessions_per_user} · _Yest: ${y.platform.avg_sessions_per_user}_ · _(prev: ${p.platform.avg_sessions_per_user})_\n` +
          `*Avg Turns/Session:* ${c.platform.avg_turns_per_session} · _Yest: ${y.platform.avg_turns_per_session}_ · _(prev: ${p.platform.avg_turns_per_session})_\n` +
          `*Avg Turns/User:* ${c.platform.avg_turns_per_user} · _Yest: ${y.platform.avg_turns_per_user}_ · _(prev: ${p.platform.avg_turns_per_user})_`,
      },
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*MODE BREAKDOWN* (MTD · Yesterday · Prev Month)\n\n` +
          `*Deal Mode* — Active: *${fmt(c.modes.deal.active_users)}* · Sessions: *${fmt(c.modes.deal.sessions)}* (yest: ${fmt(y.modes.deal.sessions)}) · Turns: *${fmt(c.modes.deal.turns)}* (yest: ${fmt(y.modes.deal.turns)}) · Avg/session: ${c.modes.deal.avg_turns_per_session}\n` +
          `*Coach Mode* — Active: *${fmt(c.modes.coach.active_users)}* · Sessions: *${fmt(c.modes.coach.sessions)}* (yest: ${fmt(y.modes.coach.sessions)}) · Turns: *${fmt(c.modes.coach.turns)}* (yest: ${fmt(y.modes.coach.turns)}) · Avg/session: ${c.modes.coach.avg_turns_per_session}\n` +
          `*Mindset Mode* — Active: *${fmt(c.modes.mindset.active_users)}* · Sessions: *${fmt(c.modes.mindset.sessions)}* (yest: ${fmt(y.modes.mindset.sessions)}) · Turns: *${fmt(c.modes.mindset.turns)}* (yest: ${fmt(y.modes.mindset.turns)}) · Avg/session: ${c.modes.mindset.avg_turns_per_session}\n` +
          `*Totals* — Active: *${fmt(c.modes.totals.active_users)}* · Sessions: *${fmt(c.modes.totals.sessions)}* (yest: ${fmt(y.modes.totals.sessions)}) · Turns: *${fmt(c.modes.totals.turns)}* (yest: ${fmt(y.modes.totals.turns)}) · Avg/session: ${c.modes.totals.avg_turns_per_session}`,
      },
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*TOP USERS — Current Month MTD*\n\n${topUserLines || '_No sessions this period._'}`,
      },
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*ENGAGEMENT SIGNALS*\n\n` +
          `*New Users Yesterday (${signals.newYesterday.length})*\n${newYestLines}\n\n` +
          `*Power Users — 10+ Sessions MTD (${signals.powerUsers.length})*\n${powerLines}\n\n` +
          `*At-Risk — Active Last Month, Zero This Month (${signals.atRisk.length})*\n${atRiskLines}\n\n` +
          `*Profile Completion* — *${completePct}%* complete (${fmt(completeCount)} users) · ${incompletePct}% incomplete (${fmt(incompleteCount)} users)`,
      },
    },
  ];
}

// ─── Delivery ─────────────────────────────────────────────────────────────────

async function sendEmailReport(report) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');

  const resend = new Resend(apiKey);
  const html = buildHtmlEmail(report);
  const subject = `RZS AI Coach — Daily Metrics Report | ${report.dateLabel}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: REPORT_TO,
    subject,
    html,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
}

async function sendSlackReport(report) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('Daily report: SLACK_WEBHOOK_URL not set, skipping Slack delivery.');
    return;
  }

  const blocks = buildSlackBlocks(report);
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Slack webhook error ${res.status}: ${text}`);
  }
}

async function sendFailureAlert(errorMessage) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return;

    const resend = new Resend(apiKey);
    const now = new Date().toISOString();
    await resend.emails.send({
      from: FROM_EMAIL,
      to: REPORT_TO,
      subject: `⚠️ RZS Daily Report Failed — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a2e;">
        <h2 style="color:#c8102e;">Daily Metrics Report Failed</h2>
        <p>The daily metrics report job failed at <strong>${now}</strong>.</p>
        <p><strong>Error:</strong></p>
        <pre style="background:#f4f4f4;padding:12px;border-radius:4px;font-size:12px;overflow-x:auto;">${errorMessage}</pre>
        <p style="color:#888;font-size:12px;margin-top:24px;">Red Zone Selling AI Coach</p>
      </div>`,
    });
  } catch (alertErr) {
    console.error('Failed to send failure alert email:', alertErr.message);
  }
}

// ─── Log run to DB ────────────────────────────────────────────────────────────

async function logReportRun(status, errorMessage, metricsSnapshot) {
  try {
    await query(
      `INSERT INTO report_runs (status, error_message, metrics_snapshot)
       VALUES ($1, $2, $3)`,
      [status, errorMessage || null, metricsSnapshot ? JSON.stringify(metricsSnapshot) : null]
    );
  } catch (err) {
    console.error('Failed to log report run:', err.message);
  }
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export async function runDailyReport() {
  console.log('Daily report: starting...');
  let report = null;

  try {
    report = await buildReport();

    await Promise.all([
      sendEmailReport(report),
      sendSlackReport(report),
    ]);

    await logReportRun('success', null, report.current.platform);
    console.log(`Daily report: delivered successfully for ${report.dateLabel}`);
  } catch (err) {
    console.error('Daily report: FAILED —', err.message);
    await sendFailureAlert(err.stack || err.message);
    await logReportRun('failed', err.message, report?.current?.platform || null);
  }
}

// ─── Scheduler ────────────────────────────────────────────────────────────────

/**
 * Check whether today's report has already run successfully.
 * Uses America/New_York "today" so the check is timezone-aware.
 */
async function hasRunTodayET() {
  try {
    // Get today's date in ET as a YYYY-MM-DD string
    const todayET = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    const { rows } = await query(
      `SELECT id FROM report_runs
       WHERE status = 'success'
         AND run_at AT TIME ZONE 'America/New_York' >= $1::date
         AND run_at AT TIME ZONE 'America/New_York' <  ($1::date + INTERVAL '1 day')
       LIMIT 1`,
      [todayET]
    );
    return rows.length > 0;
  } catch (err) {
    console.warn('Daily report: could not check report_runs:', err.message);
    return false; // Assume not run — better to send a duplicate than to miss it
  }
}

/**
 * Returns true if the current ET clock time is at or past 7:30 AM.
 */
function isPast730amET() {
  const etNow = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', hour12: false });
  const [h, m] = etNow.split(':').map(Number);
  return h > 7 || (h === 7 && m >= 30);
}

export function startDailyReportScheduler() {
  // Fire at 7:30 AM Eastern every day — node-cron handles DST via timezone option
  cron.schedule('30 7 * * *', () => {
    runDailyReport().catch(err => console.error('Daily report cron error:', err));
  }, { timezone: 'America/New_York' });

  console.log('Daily report scheduler started (7:30 AM ET).');

  // Catch-up: if the server restarted after 7:30 AM ET and today's report
  // was never sent (e.g. killed mid-cron), fire it now.
  if (isPast730amET()) {
    hasRunTodayET().then(alreadyRan => {
      if (!alreadyRan) {
        console.log('Daily report: catch-up run (missed 7:30 AM window due to restart).');
        runDailyReport().catch(err => console.error('Daily report catch-up error:', err));
      }
    });
  }
}
