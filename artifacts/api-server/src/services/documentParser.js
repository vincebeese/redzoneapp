import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import path from 'path';

export async function parseDocument(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  let text = '';

  switch (ext) {
    case '.pdf': {
      const pdfData = await pdfParse(file.buffer);
      text = pdfData.text;
      break;
    }
    case '.docx': {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
      break;
    }
    case '.txt': {
      text = file.buffer.toString('utf-8');
      break;
    }
    default:
      throw new Error(`Unsupported format: ${ext}. Upload a PDF, Word (.docx), or text (.txt) file.`);
  }

  text = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!text || text.length < 100) {
    throw new Error(
      'Could not extract text from this file. The document may be image-based or password-protected. Try copy-pasting the content directly.'
    );
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount > 15000) {
    throw new Error(
      'Document too long — maximum 15,000 words. Try uploading the executive summary or key sections only.'
    );
  }

  return { text, wordCount, format: ext.replace('.', '') };
}
