import { query } from '../db/index.js';

let rcBlockCache = null;
let rcBlockCachedAt = null;
let rcDataCache = null;
let rcDataCachedAt = null;
const RC_CACHE_TTL = 5 * 60 * 1000;

export function bustRCCache() {
  rcBlockCache = null;
  rcBlockCachedAt = null;
  rcDataCache = null;
  rcDataCachedAt = null;
}

export async function getResourceCenterData() {
  const now = Date.now();
  if (rcDataCache && rcDataCachedAt && (now - rcDataCachedAt) < RC_CACHE_TTL) {
    return rcDataCache;
  }

  const result = await query(`
    SELECT id, code, name, description, url, zone, sort_order
    FROM resource_center_tools
    WHERE is_active = true
    ORDER BY zone, sort_order ASC
  `);

  const grouped = { yellow: [], green: [], red: [], bonus: [] };
  for (const row of result.rows) {
    if (grouped[row.zone]) grouped[row.zone].push(row);
  }

  rcDataCache = grouped;
  rcDataCachedAt = now;
  return grouped;
}

export async function buildResourceCenterBlock() {
  const now = Date.now();
  if (rcBlockCache && rcBlockCachedAt && (now - rcBlockCachedAt) < RC_CACHE_TTL) {
    return rcBlockCache;
  }

  try {
    const tools = await query(`
      SELECT code, name, description, zone, url
      FROM resource_center_tools
      WHERE is_active = true
      ORDER BY zone, sort_order ASC
    `);

    if (!tools.rows.length) {
      rcBlockCache = '';
      rcBlockCachedAt = now;
      return '';
    }

    const byZone = {
      yellow: tools.rows.filter(t => t.zone === 'yellow'),
      green:  tools.rows.filter(t => t.zone === 'green'),
      red:    tools.rows.filter(t => t.zone === 'red'),
      bonus:  tools.rows.filter(t => t.zone === 'bonus'),
    };

    let block = '\n# RED ZONE SELLING™ RESOURCE CENTER\n\n';
    block += 'When recommending a play or tool, reference the specific Resource Center tool by name and code. ';
    block += 'Include the link when the rep is about to run the play right now — not on every mention.\n\n';

    const zoneLabels = {
      yellow: '🟡 YELLOW ZONE TOOLKIT',
      green:  '🟢 GREEN ZONE TOOLKIT',
      red:    '🔴 RED ZONE TOOLKIT',
      bonus:  '🏈 BONUS PLAYS',
    };

    for (const [zone, label] of Object.entries(zoneLabels)) {
      const zoneTools = byZone[zone];
      if (!zoneTools?.length) continue;
      block += `## ${label}\n`;
      zoneTools.forEach(t => {
        block += `${t.code} — ${t.name}\n`;
        block += `  ${t.description}\n`;
        if (t.url) block += `  Link: ${t.url}\n`;
        block += '\n';
      });
    }

    block += '## HOW TO REFERENCE\n';
    block += 'Format: "Use the [Tool Name] (Resource Center [CODE]) → [link]"\n';
    block += 'Only include links at actionable moments. Use judgment.\n';

    rcBlockCache = block;
    rcBlockCachedAt = now;
    return block;
  } catch (err) {
    console.warn('Could not build Resource Center block:', err.message);
    return '';
  }
}
