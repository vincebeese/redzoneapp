import { useState, useRef, useCallback } from 'react';

const ACCEPTED = '.pdf,.docx,.txt,.srt';

export default function TranscriptUploadModal({ onClose, onSend, theme = 'light' }) {
  const [tab, setTab] = useState('file');
  const [pasteText, setPasteText] = useState('');
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  const dark = theme === 'dark';
  const accentColor = dark ? 'rzs-gold' : 'rzs-red';

  async function parseAndSend() {
    setError('');
    let text = '';
    let filename = '';

    if (tab === 'paste') {
      text = pasteText.trim();
      if (!text) { setError('Please paste your transcript text.'); return; }
      filename = 'pasted transcript';
    } else {
      if (!file) { setError('Please select or drop a file.'); return; }
      setIsParsing(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/chat/parse-file', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not read file.');
        text = data.text;
        filename = data.filename;
      } catch (err) {
        setError(err.message);
        setIsParsing(false);
        return;
      }
      setIsParsing(false);
    }

    const message =
      `[Call Transcript: ${filename}]\n` +
      `---\n${text}\n---\n\n` +
      `Please analyze this call transcript and provide coaching feedback.`;

    onSend(message);
    onClose();
  }

  function handleFileSelect(e) {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setError(''); }
    e.target.value = '';
  }

  const handleDragEnter = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current = 0;
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) { setFile(f); setError(''); }
  }, []);

  const overlay = dark
    ? 'bg-black/70'
    : 'bg-black/40';

  const card = dark
    ? 'bg-gray-900 border border-gray-700 text-gray-100'
    : 'bg-white text-gray-800';

  const tabBase = 'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors';
  const tabActive = dark
    ? `border-b-2 border-rzs-gold text-rzs-gold`
    : `border-b-2 border-rzs-red text-rzs-red`;
  const tabInactive = dark
    ? 'text-gray-500 hover:text-gray-300'
    : 'text-gray-400 hover:text-gray-600';

  const dropZone = dark
    ? `border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragOver ? 'border-rzs-gold bg-rzs-gold/10' : 'border-gray-600 hover:border-gray-500'}`
    : `border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragOver ? 'border-rzs-red bg-rzs-red/5' : 'border-gray-300 hover:border-gray-400'}`;

  const textarea = dark
    ? 'w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rzs-gold resize-none h-48'
    : 'w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rzs-red resize-none h-48';

  const btnPrimary = dark
    ? 'bg-rzs-gold text-gray-900 hover:bg-yellow-500 font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm'
    : 'btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed';

  const btnCancel = dark
    ? 'text-gray-400 hover:text-gray-200 text-sm px-4 py-2 rounded-lg transition-colors'
    : 'text-gray-500 hover:text-gray-700 text-sm px-4 py-2 rounded-lg transition-colors';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlay}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`w-full max-w-lg rounded-xl shadow-2xl ${card}`}>
        <div className={`flex items-center justify-between px-6 pt-5 pb-4 border-b ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
          <div>
            <h2 className={`font-semibold text-base ${dark ? 'text-white' : 'text-rzs-charcoal'}`}>Upload Call Transcript</h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>The AI will analyze and provide coaching feedback</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`flex gap-1 px-6 pt-4 border-b ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
          <button className={`${tabBase} ${tab === 'file' ? tabActive : tabInactive}`} onClick={() => setTab('file')}>
            Upload File
          </button>
          <button className={`${tabBase} ${tab === 'paste' ? tabActive : tabInactive}`} onClick={() => setTab('paste')}>
            Paste Text
          </button>
        </div>

        <div className="px-6 py-5">
          {tab === 'file' ? (
            <div
              className={dropZone}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED}
                onChange={handleFileSelect}
                className="hidden"
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <svg className={`w-8 h-8 ${dark ? 'text-rzs-gold' : 'text-rzs-red'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{file.name}</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className={`text-xs underline ${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className={`w-8 h-8 ${dark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Drop your transcript here</p>
                  <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>or click to browse &mdash; PDF, Word, TXT, SRT</p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              className={textarea}
              placeholder="Paste your transcript text here..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
          )}

          {error && (
            <p className="mt-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className={`flex items-center justify-end gap-3 px-6 pb-5`}>
          <button onClick={onClose} className={btnCancel}>Cancel</button>
          <button
            onClick={parseAndSend}
            disabled={isParsing || (tab === 'file' ? !file : !pasteText.trim())}
            className={btnPrimary}
          >
            {isParsing ? (
              <span className="flex items-center gap-2">
                <span className={`inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${dark ? 'border-gray-900' : 'border-white'}`} />
                Reading file...
              </span>
            ) : (
              'Analyze Transcript'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
