import { Router } from 'express';
import { ensureUser } from '../middleware/auth.js';
import { getResourceCenterData } from '../services/resourceCenter.js';
import { logEvent } from '../services/analytics.js';

const router = Router();

router.use(ensureUser);

router.get('/', async (req, res) => {
  try {
    logEvent(req.user.id, 'resource_viewed');
    const data = await getResourceCenterData();
    res.json(data);
  } catch (err) {
    console.error('Resource Center fetch error:', err);
    res.status(500).json({ error: 'Failed to load Resource Center' });
  }
});

export default router;
