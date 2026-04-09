import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';
import { parseDocument } from '../services/documentParser.js';
import { analyzeDocument, formatDocumentAnalysis } from '../services/documentAnalyzer.js';
import { logEvent } from '../services/analytics.js';

const router = Router();

const VALID_DOCUMENT_TYPES = ['proposal', 'business_case'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimes.includes(file.mimetype) || ['.pdf', '.docx'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF and Word (.docx) files are supported.'));
    }
  },
});

// POST /api/documents — upload + analyze
router.post('/', ensureUser, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large — maximum 10MB.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Only PDF and Word (.docx) files are supported.' });
      }
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { deal_id, document_type } = req.body;

    if (!deal_id || !document_type) {
      return res.status(400).json({ error: 'deal_id and document_type are required' });
    }
    if (!VALID_DOCUMENT_TYPES.includes(document_type)) {
      return res.status(400).json({ error: 'Invalid document_type. Must be proposal or business_case.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'A file is required' });
    }

    // Verify deal ownership
    const dealResult = await query(
      `SELECT * FROM deals WHERE id = $1 AND user_id = $2`,
      [deal_id, req.user.id]
    );
    if (dealResult.rows.length === 0) {
      return res.status(403).json({ error: 'Deal not found or access denied' });
    }
    const deal = dealResult.rows[0];

    // Parse file
    let parsed;
    try {
      parsed = await parseDocument(req.file);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const { text: raw_text, wordCount: word_count, format: source_format } = parsed;

    // Insert document row
    const insertResult = await query(
      `INSERT INTO deal_documents
         (deal_id, user_id, document_type, original_filename, source_format, raw_text, word_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, document_type, original_filename, source_format, word_count, created_at`,
      [deal_id, req.user.id, document_type, req.file.originalname, source_format, raw_text, word_count]
    );
    const document = insertResult.rows[0];

    // Analyze with Claude
    const analysis = await analyzeDocument(raw_text, document_type, deal);

    // Update document with analysis
    await query(
      `UPDATE deal_documents SET analysis = $1 WHERE id = $2`,
      [JSON.stringify(analysis), document.id]
    );
    document.analysis = analysis;

    // Format as chat message
    const messageContent = formatDocumentAnalysis(analysis, document);

    // Save as assistant message in deal thread
    const msgResult = await query(
      `INSERT INTO messages (user_id, deal_id, mode_slug, role, content)
       VALUES ($1, $2, 'deal', 'assistant', $3)
       RETURNING id, role, content, created_at`,
      [req.user.id, deal_id, messageContent]
    );
    const message = msgResult.rows[0];

    logEvent(req.user.id, 'document_uploaded', {
      document_type,
      word_count: word_count || 0,
      source_format,
      deal_id: parseInt(deal_id),
      zone: deal.zone,
    });

    res.json({ document, message });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
});

// GET /api/documents?deal_id=X
router.get('/', ensureUser, async (req, res) => {
  const { deal_id } = req.query;
  if (!deal_id) return res.status(400).json({ error: 'deal_id is required' });

  try {
    const dealCheck = await query(
      `SELECT id FROM deals WHERE id = $1 AND user_id = $2`,
      [deal_id, req.user.id]
    );
    if (dealCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await query(
      `SELECT id, document_type, original_filename, source_format, word_count, created_at, analysis
       FROM deal_documents WHERE deal_id = $1 ORDER BY created_at DESC`,
      [deal_id]
    );

    const docs = result.rows.map((d) => {
      let summary = '';
      const a = d.analysis;
      if (a && !a.parse_error) {
        if (d.document_type === 'proposal') {
          summary = `${a.overall_assessment || 'assessed'} · ${a.gaps?.length || 0} gaps found`;
        } else {
          const coi = a.cost_of_inaction_present ? 'COI present' : 'COI missing';
          const eb = a.eb_ready ? 'EB ready: yes' : 'EB ready: no';
          summary = `${coi} · ${eb}`;
        }
      }
      return {
        id: d.id,
        document_type: d.document_type,
        original_filename: d.original_filename,
        source_format: d.source_format,
        word_count: d.word_count,
        created_at: d.created_at,
        summary,
      };
    });

    res.json(docs);
  } catch (error) {
    console.error('List documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// GET /api/documents/:id
router.get('/:id', ensureUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT dd.* FROM deal_documents dd
       JOIN deals d ON d.id = dd.deal_id
       WHERE dd.id = $1 AND d.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', ensureUser, async (req, res) => {
  try {
    const check = await query(
      `SELECT dd.id FROM deal_documents dd
       JOIN deals d ON d.id = dd.deal_id
       WHERE dd.id = $1 AND d.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    await query(`DELETE FROM deal_documents WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
