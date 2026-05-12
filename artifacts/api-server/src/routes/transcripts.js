import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import mammoth from 'mammoth';
import { query } from '../db/index.js';
import { ensureUser } from '../middleware/auth.js';
import { analyzeTranscript, formatAnalysisAsMessage } from '../services/transcriptAnalyzer.js';
import { logEvent } from '../services/analytics.js';

const router = Router();

const VALID_CALL_TYPES = [
  'discovery', 'demo', 'proposal',
  'executive_briefing', 'objection_negotiation', 'other',
];

// Multer — memory storage, 10MB limit, accepted mimetypes
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.srt', '.docx', '.txt'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only .srt, .docx, and .txt files are supported.'));
    }
  },
});

// --- Parsers ---

function parseSRTWithTimestamps(buffer) {
  const text = buffer.toString('utf-8');
  const blocks = text.trim().split(/\n\n+/);
  const output = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 3) continue;

    const timestamp = lines[1]
      .split(' --> ')[0]
      .replace(',', '.')
      .substring(0, 7);

    const dialogue = lines.slice(2).join(' ');
    if (dialogue.trim()) {
      output.push(`[${timestamp}] ${dialogue}`);
    }
  }

  return output.join('\n');
}

async function parseDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function parseTxt(buffer) {
  return buffer.toString('utf-8');
}

async function parseTranscriptFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  switch (ext) {
    case '.srt':
      return { text: parseSRTWithTimestamps(file.buffer), format: 'srt' };
    case '.docx':
      return { text: await parseDocx(file.buffer), format: 'docx' };
    case '.txt':
      return { text: parseTxt(file.buffer), format: 'txt' };
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

// POST /api/transcripts — accepts JSON body (paste) or multipart/form-data (file)
router.post('/', ensureUser, (req, res, next) => {
  // Only run multer if multipart, otherwise skip
  if (req.is('multipart/form-data')) {
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large — maximum 10MB. Try exporting a shorter segment.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ error: 'Only .srt, .docx, and .txt files are supported. For other formats, paste the transcript text directly.' });
        }
        return res.status(400).json({ error: err.message || 'File upload error' });
      }
      next();
    });
  } else {
    next();
  }
}, async (req, res) => {
  try {
    let raw_text;
    let source_format = 'paste';
    let isSRT = false;

    const deal_id = req.body?.deal_id;
    const call_type = req.body?.call_type;

    // Validate required fields and deal ownership BEFORE any expensive parsing
    if (!deal_id || !call_type) {
      return res.status(400).json({ error: 'deal_id and call_type are required' });
    }
    if (!VALID_CALL_TYPES.includes(call_type)) {
      return res.status(400).json({ error: 'Invalid call_type' });
    }

    // Verify deal ownership before doing any file parsing work
    const dealResult = await query(
      `SELECT * FROM deals WHERE id = $1 AND user_id = $2`,
      [deal_id, req.user.id]
    );
    if (dealResult.rows.length === 0) {
      return res.status(403).json({ error: 'Deal not found or access denied' });
    }
    const deal = dealResult.rows[0];

    if (req.file) {
      // File upload path — parsing happens only after ownership is confirmed
      let parsed;
      try {
        parsed = await parseTranscriptFile(req.file);
      } catch (e) {
        return res.status(400).json({ error: "Couldn't read this file. It may be corrupted or in an unsupported format. Try pasting the transcript text directly." });
      }

      raw_text = parsed.text;
      source_format = parsed.format;
      isSRT = parsed.format === 'srt';

      if (!raw_text || !raw_text.trim()) {
        return res.status(400).json({ error: 'No text found in this file. Try pasting the transcript text directly.' });
      }

      // Enforce a character limit in addition to word count to prevent single-token bypass
      if (raw_text.length > 500000) {
        return res.status(400).json({ error: 'Transcript too long. Maximum 500,000 characters. Try splitting into sections by call segment.' });
      }

      const wordCount = raw_text.trim().split(/\s+/).filter(w => w.length > 0).length;
      if (wordCount > 50000) {
        return res.status(400).json({ error: 'Transcript too long. Maximum 50,000 words. Try splitting into sections by call segment.' });
      }
    } else {
      // JSON paste path (existing)
      raw_text = req.body?.raw_text;

      if (!raw_text) {
        return res.status(400).json({ error: 'deal_id, call_type, and raw_text are required' });
      }
      if (raw_text.length > 50000) {
        return res.status(400).json({ error: 'Transcript too long — maximum 50,000 characters' });
      }
    }

    const word_count = raw_text.trim().split(/\s+/).filter((w) => w.length > 0).length;

    const filename = req.file ? req.file.originalname : 'paste';

    const insertResult = await query(
      `INSERT INTO transcripts (deal_id, user_id, call_type, raw_text, content, word_count, source_format, filename)
       VALUES ($1, $2, $3, $4, $4, $5, $6, $7)
       RETURNING id, call_type, word_count, created_at, source_format`,
      [deal_id, req.user.id, call_type, raw_text, word_count, source_format, filename]
    );
    const transcript = insertResult.rows[0];

    logEvent(req.user.id, 'transcript_uploaded', {
      call_type: transcript.call_type,
      word_count: transcript.word_count || 0,
      source_format: transcript.source_format,
      deal_id: parseInt(deal_id),
      zone: deal.zone,
    });

    const analysis = await analyzeTranscript(raw_text, call_type, deal, req.user.id, isSRT);

    await query(
      `UPDATE transcripts SET analysis = $1 WHERE id = $2`,
      [JSON.stringify(analysis), transcript.id]
    );
    transcript.analysis = analysis;

    let messageContent;
    if (analysis.parse_error) {
      messageContent = `I analyzed the transcript but had trouble formatting the results. Here's what I found:\n\n${analysis.raw}`;
    } else {
      messageContent = formatAnalysisAsMessage(analysis, transcript);
    }

    const msgResult = await query(
      `INSERT INTO messages (user_id, deal_id, mode_slug, role, content)
       VALUES ($1, $2, 'deal', 'assistant', $3)
       RETURNING id, role, content, created_at`,
      [req.user.id, deal_id, messageContent]
    );
    const message = msgResult.rows[0];

    res.json({ transcript, message });
  } catch (error) {
    console.error('Transcript upload error:', error);
    res.status(500).json({ error: 'Failed to analyze transcript' });
  }
});

// GET /api/transcripts?deal_id=X — list summaries
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
      `SELECT id, call_type, word_count, created_at, analysis, source_format
       FROM transcripts WHERE deal_id = $1 ORDER BY created_at DESC`,
      [deal_id]
    );

    const summaries = result.rows.map((t) => ({
      id: t.id,
      call_type: t.call_type,
      word_count: t.word_count,
      created_at: t.created_at,
      source_format: t.source_format || 'paste',
      analysis: t.analysis
        ? {
            unhandled_objections: t.analysis.unhandled_objections?.length || 0,
            buying_signals: t.analysis.buying_signals?.length || 0,
            next_step_quality: t.analysis.next_step_quality || null,
            recommended_play: t.analysis.recommended_play || null,
          }
        : null,
    }));

    res.json(summaries);
  } catch (error) {
    console.error('List transcripts error:', error);
    res.status(500).json({ error: 'Failed to fetch transcripts' });
  }
});

// GET /api/transcripts/:id — full transcript + analysis
router.get('/:id', ensureUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT t.* FROM transcripts t
       JOIN deals d ON d.id = t.deal_id
       WHERE t.id = $1 AND d.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get transcript error:', error);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

// DELETE /api/transcripts/:id
router.delete('/:id', ensureUser, async (req, res) => {
  try {
    const check = await query(
      `SELECT t.id FROM transcripts t
       JOIN deals d ON d.id = t.deal_id
       WHERE t.id = $1 AND d.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    await query(`DELETE FROM transcripts WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete transcript error:', error);
    res.status(500).json({ error: 'Failed to delete transcript' });
  }
});

export default router;
