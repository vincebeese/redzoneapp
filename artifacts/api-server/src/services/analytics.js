import { query } from '../db/index.js';

export async function logEvent(userId, eventType, properties = {}) {
  try {
    await query(
      `INSERT INTO analytics_events (user_id, event_type, properties) VALUES ($1, $2, $3)`,
      [userId || null, eventType, JSON.stringify(properties)]
    );
  } catch (err) {
    console.error('Analytics log failed:', eventType, err.message);
  }
}
