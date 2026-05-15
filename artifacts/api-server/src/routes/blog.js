import { Router } from 'express';
import https from 'https';
import { XMLParser } from 'fast-xml-parser';

const router = Router();

const SUBSTACK_FEED_URL = 'https://vbeese.substack.com/feed';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cache = null;
let cacheTimestamp = 0;

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'RZS-Blog-Fetcher/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function parseRssFeed(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
  });
  const result = parser.parse(xml);
  const channel = result?.rss?.channel;
  if (!channel) return [];

  const rawItems = channel.item || [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items.slice(0, 20).map(item => {
    const title = extractText(item.title);
    const link = extractText(item.link) || extractText(item['atom:link']?.['@_href']);
    const pubDate = extractText(item.pubDate);
    const description = extractText(item.description);
    const content = extractText(item['content:encoded']);

    const excerptSource = description || content || '';
    const stripped = excerptSource.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();
    const excerpt = stripped.length > 220 ? stripped.slice(0, 220).replace(/\s+\S*$/, '') + '…' : stripped;

    return { title, link, pubDate, excerpt };
  });
}

function extractText(val) {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (val.__cdata) return val.__cdata.trim();
  if (typeof val === 'object') return String(val).trim();
  return '';
}

router.get('/feed', async (req, res) => {
  try {
    const now = Date.now();
    if (cache && now - cacheTimestamp < CACHE_TTL_MS) {
      return res.json({ posts: cache, cached: true });
    }

    const xml = await fetchUrl(SUBSTACK_FEED_URL);
    const posts = parseRssFeed(xml);

    cache = posts;
    cacheTimestamp = now;

    res.set('Cache-Control', 'public, max-age=3600');
    return res.json({ posts });
  } catch (err) {
    req.log?.error({ err }, 'Blog feed fetch error');
    if (cache) {
      return res.json({ posts: cache, cached: true, stale: true });
    }
    return res.status(502).json({ error: 'Failed to fetch blog feed', posts: [] });
  }
});

export default router;
