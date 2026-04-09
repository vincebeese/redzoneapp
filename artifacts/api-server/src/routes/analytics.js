import { Router } from 'express';
import { ensureUser } from '../middleware/auth.js';
import { logEvent } from '../services/analytics.js';

const router = Router();

const ALLOWED_CLIENT_EVENTS = new Set([
  'mode_entered',
  'artifact_dismissed',
  'resource_tool_opened',
  'resource_viewed',
]);

router.post('/event', ensureUser, async (req, res) => {
  try {
    const { event_type, properties = {} } = req.body;
    if (ALLOWED_CLIENT_EVENTS.has(event_type)) {
      logEvent(req.user.id, event_type, properties);
    }
  } catch {
    // silent
  }
  res.json({ success: true });
});

export default router;
