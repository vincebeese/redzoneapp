import { query } from '../db/index.js';

let cachedModes = {};
let cacheTime = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function getModeConfig(slug) {
  const now = Date.now();
  
  // Return cached if fresh
  if (cachedModes[slug] && now - cacheTime < CACHE_TTL) {
    return cachedModes[slug];
  }
  
  // Fetch and cache
  try {
    const result = await query(
      `SELECT system_prompt, max_tokens FROM modes WHERE slug = $1 AND is_active = true`,
      [slug]
    );
    const config = result.rows[0] || { system_prompt: '', max_tokens: 1200 };
    cachedModes[slug] = config;
    cacheTime = now;
    return config;
  } catch (err) {
    console.error(`Failed to fetch mode config for slug ${slug}:`, err);
    return { system_prompt: '', max_tokens: 1200 };
  }
}

export async function getSystemPrompt(slug) {
  const config = await getModeConfig(slug);
  return config.system_prompt;
}

export function clearCache() {
  cachedModes = {};
  cacheTime = 0;
}

export function getCacheStats() {
  return {
    cachedSlugs: Object.keys(cachedModes),
    cacheAgeMs: Date.now() - cacheTime,
    isFresh: Date.now() - cacheTime < CACHE_TTL,
  };
}
