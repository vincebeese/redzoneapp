import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

const hubspotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions, please try again later.' },
});

router.post('/whitepaper', hubspotLimiter, async (req, res) => {
  const { firstName, lastName, company, email, linkedinUrl } = req.body;

  if (!firstName || !lastName || !company || !email || !linkedinUrl) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = process.env.HUBSPOT_FORM_GUID;

  if (!portalId || !formGuid) {
    console.error('HubSpot credentials not configured (HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID)');
    return res.json({ ok: true, hubspotSkipped: true });
  }

  const payload = {
    fields: [
      { objectTypeId: '0-1', name: 'firstname',           value: firstName },
      { objectTypeId: '0-1', name: 'lastname',            value: lastName },
      { objectTypeId: '0-1', name: 'company',             value: company },
      { objectTypeId: '0-1', name: 'email',               value: email },
      { objectTypeId: '0-1', name: 'linkedin_bio',        value: linkedinUrl },
      { objectTypeId: '0-1', name: 'last_downloaded_asset', value: 'Scale or Transform Whitepaper' },
    ],
    context: {
      pageUri:  'https://redzoneselling.co/whitepaper',
      pageName: 'Red Zone Selling — Scale or Transform Whitepaper',
    },
  };

  try {
    const hsRes = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!hsRes.ok) {
      const text = await hsRes.text();
      console.error(`HubSpot submission failed (${hsRes.status}):`, text);
      return res.json({ ok: true, hubspotError: true });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('HubSpot fetch error:', err.message);
    return res.json({ ok: true, hubspotError: true });
  }
});

export default router;
