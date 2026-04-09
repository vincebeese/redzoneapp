import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CALL_TYPE_LABELS = {
  discovery: 'Discovery call',
  demo: 'Demo',
  proposal: 'Proposal walkthrough',
  executive_briefing: 'Executive briefing',
  objection_negotiation: 'Objection / negotiation',
  other: 'Call',
};

const CALL_TYPE_COLORS = {
  discovery: 'bg-blue-100 text-blue-700',
  demo: 'bg-purple-100 text-purple-700',
  proposal: 'bg-green-100 text-green-700',
  executive_briefing: 'bg-amber-100 text-amber-700',
  objection_negotiation: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-700',
};

const FORMAT_BADGE = {
  srt: 'bg-blue-100 text-blue-700',
  docx: 'bg-gray-100 text-gray-600',
  txt: 'bg-gray-100 text-gray-600',
};

const DOC_TYPE_LABELS = {
  proposal: 'Proposal',
  business_case: 'Business Case',
};

function TranscriptDetail({ transcript }) {
  const a = transcript.analysis || {};

  if (a.parse_error) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Analysis could not be fully formatted. Raw output:</p>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{a.raw}</pre>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CALL_TYPE_COLORS[transcript.call_type] || CALL_TYPE_COLORS.other}`}>
          {CALL_TYPE_LABELS[transcript.call_type] || transcript.call_type}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(transcript.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {transcript.word_count ? ` · ${transcript.word_count.toLocaleString()} words` : ''}
        </span>
      </div>

      {a.zone_recalibration?.changed && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <p className="text-xs font-semibold text-amber-700 mb-0.5">Zone Recalibration</p>
          <p className="text-sm font-medium text-rzs-charcoal">{a.zone_recalibration.from} → {a.zone_recalibration.to}</p>
          {a.zone_recalibration.reason && <p className="text-xs text-amber-600 mt-1">{a.zone_recalibration.reason}</p>}
        </div>
      )}

      {a.unhandled_objections?.length > 0 && (
        <div>
          <h4 className="font-semibold text-red-600 mb-2">Unhandled Objections ({a.unhandled_objections.length})</h4>
          <div className="space-y-2">
            {a.unhandled_objections.map((o, i) => (
              <div key={i} className="bg-red-50 rounded-lg px-3 py-2">
                <p className="text-rzs-charcoal text-sm">{o.text}</p>
                <p className="text-xs text-red-600 mt-1 font-medium">Play: {o.play}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {a.buying_signals?.length > 0 && (
        <div>
          <h4 className="font-semibold text-green-600 mb-2">Buying Signals ({a.buying_signals.length})</h4>
          <div className="space-y-2">
            {a.buying_signals.map((s, i) => (
              <div key={i} className="bg-green-50 rounded-lg px-3 py-2">
                <p className="text-rzs-charcoal text-sm">{s.text}</p>
                <p className="text-xs text-green-700 mt-1">{s.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {a.stakeholder_gaps?.length > 0 && (
        <div>
          <h4 className="font-semibold text-amber-600 mb-2">Stakeholder Gaps</h4>
          <div className="space-y-2">
            {a.stakeholder_gaps.map((g, i) => (
              <div key={i} className="bg-amber-50 rounded-lg px-3 py-2">
                <p className="text-sm font-medium text-rzs-charcoal">
                  {g.name || 'Unknown'} <span className="font-normal text-gray-500">({g.role})</span>
                </p>
                <p className="text-xs text-amber-700 mt-1">{g.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {a.pain_qualification && (
        <div>
          <h4 className="font-semibold text-rzs-charcoal mb-2">Pain Qualification</h4>
          <div className="space-y-1 text-sm">
            {[
              { label: 'Layer 1: Surface pain', done: a.pain_qualification.layer1_complete },
              { label: 'Layer 2: Business impact', done: a.pain_qualification.layer2_complete },
              { label: 'Layer 3: Personal stakes', done: a.pain_qualification.layer3_complete },
            ].map(({ label, done }) => (
              <p key={label} className={done ? 'text-green-700' : 'text-red-600'}>
                {done ? '✓' : '✗'} {label}
              </p>
            ))}
            {a.pain_qualification.gaps?.length > 0 && (
              <div className="mt-2 space-y-1">
                {a.pain_qualification.gaps.map((g, i) => (
                  <p key={i} className="text-xs text-gray-500">• {g}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {a.next_step_quality && (
        <div>
          <h4 className="font-semibold text-rzs-charcoal mb-2">Next Step Quality</h4>
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
            a.next_step_quality === 'strong' ? 'bg-green-100 text-green-700' :
            a.next_step_quality === 'weak' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {a.next_step_quality}
          </span>
          {a.next_step_note && <p className="text-gray-600 mt-2 text-sm">{a.next_step_note}</p>}
        </div>
      )}

      {a.recommended_play && (
        <div>
          <h4 className="font-semibold text-rzs-charcoal mb-1">Recommended Play</h4>
          <p className="font-bold text-rzs-red text-sm">{a.recommended_play}</p>
        </div>
      )}

      {a.next_step && (
        <div>
          <h4 className="font-semibold text-rzs-charcoal mb-1">Immediate Next Step</h4>
          <p className="text-gray-700 text-sm">{a.next_step}</p>
        </div>
      )}
    </div>
  );
}

export default function TranscriptPanel({ dealId, onClose, onAnalysisComplete, onCountChange, initialTab = 'transcripts' }) {
  const [tab, setTab] = useState(initialTab);

  // Transcript view state
  const [view, setView] = useState('list');
  const [transcripts, setTranscripts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [detailTranscript, setDetailTranscript] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [callType, setCallType] = useState('discovery');
  const [rawText, setRawText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successTranscriptId, setSuccessTranscriptId] = useState(null);

  // Document view state
  const [docView, setDocView] = useState('list');
  const [documents, setDocuments] = useState([]);
  const [loadingDocList, setLoadingDocList] = useState(false);
  const [docType, setDocType] = useState('proposal');
  const [docFile, setDocFile] = useState(null);
  const [docIsDragging, setDocIsDragging] = useState(false);
  const [docUploading, setDocUploading] = useState(false);
  const [docUploadError, setDocUploadError] = useState('');
  const [docUploadSuccess, setDocUploadSuccess] = useState(false);
  const [confirmDocDeleteId, setConfirmDocDeleteId] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(false);

  const fileInputRef = useRef(null);
  const docFileInputRef = useRef(null);
  const autoCloseRef = useRef(null);

  useEffect(() => {
    fetchTranscripts();
    return () => {
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    };
  }, [dealId]);

  useEffect(() => {
    if (tab === 'documents') {
      fetchDocuments();
    }
  }, [tab, dealId]);

  async function fetchTranscripts() {
    try {
      setLoadingList(true);
      const res = await fetch(`/api/transcripts?deal_id=${dealId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTranscripts(data);
        onCountChange(data.length);
      }
    } catch (e) {
      console.error('Failed to fetch transcripts:', e);
    } finally {
      setLoadingList(false);
    }
  }

  async function fetchDocuments() {
    try {
      setLoadingDocList(true);
      const res = await fetch(`/api/documents?deal_id=${dealId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (e) {
      console.error('Failed to fetch documents:', e);
    } finally {
      setLoadingDocList(false);
    }
  }

  async function fetchDetail(id) {
    setLoadingDetail(true);
    setDetailTranscript(null);
    try {
      const res = await fetch(`/api/transcripts/${id}`, { credentials: 'include' });
      if (res.ok) setDetailTranscript(await res.json());
    } catch (e) {
      console.error('Failed to fetch transcript detail:', e);
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/transcripts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const updated = transcripts.filter((t) => t.id !== id);
        setTranscripts(updated);
        onCountChange(updated.length);
        setConfirmDeleteId(null);
      }
    } catch (e) {
      console.error('Delete failed:', e);
    } finally {
      setDeleting(false);
    }
  }

  async function handleDocDelete(id) {
    setDeletingDoc(true);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        setConfirmDocDeleteId(null);
      }
    } catch (e) {
      console.error('Doc delete failed:', e);
    } finally {
      setDeletingDoc(false);
    }
  }

  function validateFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['srt', 'docx', 'txt'].includes(ext)) {
      return 'Only .srt, .docx, and .txt files are supported. For other formats, paste the transcript text directly.';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File too large — maximum 10MB. Try exporting a shorter segment.';
    }
    return null;
  }

  function validateDocFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      return 'Only PDF and Word (.docx) files are supported.';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File too large — maximum 10MB.';
    }
    return null;
  }

  function handleFileSelect(file) {
    const err = validateFile(file);
    if (err) {
      setUploadError(err);
      return;
    }
    setUploadError('');
    setSelectedFile(file);
  }

  function handleDocFileSelect(file) {
    const err = validateDocFile(file);
    if (err) {
      setDocUploadError(err);
      return;
    }
    setDocUploadError('');
    setDocFile(file);
  }

  function handleFileDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function handleDocFileDrop(e) {
    e.preventDefault();
    setDocIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleDocFileSelect(file);
  }

  async function handleUpload(e) {
    e.preventDefault();
    setUploadError('');
    setUploading(true);
    try {
      let res;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('deal_id', dealId);
        formData.append('call_type', callType);
        res = await fetch('/api/transcripts', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
      } else {
        res = await fetch('/api/transcripts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ deal_id: dealId, call_type: callType, raw_text: rawText }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Analysis failed. Please try again.');
        setUploading(false);
        return;
      }
      setSuccessTranscriptId(data.transcript.id);
      setUploadSuccess(true);
      onAnalysisComplete(data.message);
      await fetchTranscripts();
      autoCloseRef.current = setTimeout(() => onClose(), 3000);
    } catch (e) {
      setUploadError('Upload failed — please try again.');
      setUploading(false);
    }
  }

  async function handleDocUpload(e) {
    e.preventDefault();
    setDocUploadError('');
    if (!docFile) {
      setDocUploadError('Please select a file.');
      return;
    }
    setDocUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', docFile);
      formData.append('deal_id', dealId);
      formData.append('document_type', docType);

      const res = await fetch('/api/documents', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setDocUploadError(data.error || 'Analysis failed. Please try again.');
        setDocUploading(false);
        return;
      }
      setDocUploadSuccess(true);
      onAnalysisComplete(data.message);
      await fetchDocuments();
      autoCloseRef.current = setTimeout(() => onClose(), 3000);
    } catch (e) {
      setDocUploadError('Upload failed — please try again.');
      setDocUploading(false);
    }
  }

  function handleViewAnalysis() {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    setUploadSuccess(false);
    fetchDetail(successTranscriptId);
    setView('detail');
  }

  function resetUploadForm() {
    setUploadSuccess(false);
    setCallType('discovery');
    setRawText('');
    setSelectedFile(null);
    setUploadError('');
  }

  function resetDocUploadForm() {
    setDocUploadSuccess(false);
    setDocType('proposal');
    setDocFile(null);
    setDocUploadError('');
  }

  const charCount = rawText.length;
  const charTooLong = charCount > 50000;
  const charWarning = charCount >= 45000;
  const canSubmit = !uploading && !charTooLong && (rawText.trim().length > 0 || selectedFile !== null);

  return (
    <div className="fixed inset-0 z-50 md:static md:inset-auto md:z-0 w-full md:w-[360px] md:flex-shrink-0 bg-white border-l border-gray-200 flex flex-col shadow-2xl md:shadow-none overflow-hidden">

      {/* TAB BAR */}
      <div className="flex border-b border-gray-200 flex-shrink-0">
        <button
          onClick={() => { setTab('transcripts'); setView('list'); }}
          className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            tab === 'transcripts'
              ? 'border-rzs-red text-rzs-red'
              : 'border-transparent text-gray-500 hover:text-rzs-charcoal'
          }`}
        >
          📞 Transcripts{transcripts.length > 0 ? ` (${transcripts.length})` : ''}
        </button>
        <button
          onClick={() => { setTab('documents'); setDocView('list'); }}
          className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            tab === 'documents'
              ? 'border-rzs-red text-rzs-red'
              : 'border-transparent text-gray-500 hover:text-rzs-charcoal'
          }`}
        >
          📄 Documents{documents.length > 0 ? ` (${documents.length})` : ''}
        </button>
        <button onClick={onClose} className="px-3 text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0">×</button>
      </div>

      {/* ===== TRANSCRIPTS TAB ===== */}
      {tab === 'transcripts' && (
        <>
          {/* LIST VIEW */}
          {view === 'list' && (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
                <h2 className="font-semibold text-rzs-charcoal text-sm">
                  Call Transcripts
                </h2>
                <button
                  onClick={() => { resetUploadForm(); setView('upload'); }}
                  className="text-xs bg-rzs-red text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  + Add
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loadingList ? (
                  <p className="text-center text-gray-400 text-sm py-8">Loading...</p>
                ) : transcripts.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <p className="font-medium text-rzs-charcoal">No transcripts yet</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Upload a call transcript and I'll analyze it against the Red Zone Selling framework.
                    </p>
                    <button
                      onClick={() => { resetUploadForm(); setView('upload'); }}
                      className="mt-1 bg-rzs-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      + Add transcript
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transcripts.map((t) => (
                      <div key={t.id} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${CALL_TYPE_COLORS[t.call_type] || CALL_TYPE_COLORS.other}`}>
                                {CALL_TYPE_LABELS[t.call_type] || t.call_type}
                              </span>
                              {t.source_format && t.source_format !== 'paste' && (
                                <span className={`inline-block text-xs font-bold px-1.5 py-0.5 rounded ${FORMAT_BADGE[t.source_format] || 'bg-gray-100 text-gray-600'}`}>
                                  {t.source_format.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {t.word_count ? ` · ${t.word_count.toLocaleString()} words` : ''}
                            </p>
                            {t.analysis && (
                              <p className="text-xs text-gray-500 mt-1">
                                {t.analysis.unhandled_objections} objection{t.analysis.unhandled_objections !== 1 ? 's' : ''}{' · '}
                                {t.analysis.buying_signals} signal{t.analysis.buying_signals !== 1 ? 's' : ''}{' · '}
                                Next step: {t.analysis.next_step_quality || 'n/a'}
                              </p>
                            )}
                          </div>

                          <div className="flex-shrink-0">
                            {confirmDeleteId === t.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDelete(t.id)}
                                  disabled={deleting}
                                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                                >
                                  {deleting ? 'Deleting…' : 'Delete'}
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-xs text-gray-400 hover:text-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(t.id)}
                                className="text-gray-300 hover:text-red-400 transition-colors p-1"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => { fetchDetail(t.id); setView('detail'); }}
                          className="mt-2 text-xs text-rzs-red hover:underline font-medium"
                        >
                          View analysis →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* DETAIL VIEW */}
          {view === 'detail' && (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
                <button
                  onClick={() => setView('list')}
                  className="text-sm text-gray-500 hover:text-rzs-charcoal"
                >
                  ← Transcripts
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loadingDetail ? (
                  <p className="text-center text-gray-400 text-sm py-8">Loading...</p>
                ) : detailTranscript ? (
                  <TranscriptDetail transcript={detailTranscript} />
                ) : (
                  <p className="text-center text-gray-400 text-sm py-8">Failed to load analysis</p>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <button
                  onClick={() => setView('list')}
                  className="w-full text-sm text-gray-500 hover:text-rzs-charcoal border border-gray-200 rounded-lg py-2 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}

          {/* UPLOAD VIEW */}
          {view === 'upload' && (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
                {!uploading && !uploadSuccess ? (
                  <button
                    onClick={() => setView('list')}
                    className="text-sm text-gray-500 hover:text-rzs-charcoal"
                  >
                    ← Transcripts
                  </button>
                ) : (
                  <span />
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {uploadSuccess ? (
                  <div className="text-center space-y-4 py-8">
                    <div className="text-green-500 flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-rzs-charcoal">Analysis complete</h3>
                    <p className="text-sm text-gray-600">The coaching has been added to your deal thread.</p>
                    <button
                      onClick={handleViewAnalysis}
                      className="text-sm text-rzs-red hover:underline font-medium"
                    >
                      View analysis →
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Closing automatically in 3 seconds…</p>
                  </div>
                ) : uploading ? (
                  <div className="text-center space-y-3 py-8">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-2 border-rzs-red border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="font-medium text-rzs-charcoal">Analyzing…</p>
                    <p className="text-sm text-gray-500">This usually takes 5–10 seconds.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-rzs-charcoal mb-4">Upload transcript</h3>

                    {uploadError && (
                      <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {uploadError}
                      </div>
                    )}

                    <form onSubmit={handleUpload} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Call type</label>
                        <select
                          value={callType}
                          onChange={(e) => setCallType(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent"
                        >
                          <option value="discovery">Discovery call</option>
                          <option value="demo">Demo</option>
                          <option value="proposal">Proposal walkthrough</option>
                          <option value="executive_briefing">Executive briefing</option>
                          <option value="objection_negotiation">Objection / negotiation</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paste transcript</label>
                        <textarea
                          value={rawText}
                          onChange={(e) => { setRawText(e.target.value); if (e.target.value) setSelectedFile(null); }}
                          placeholder="Paste your call transcript here..."
                          rows={8}
                          disabled={!!selectedFile}
                          style={{ minHeight: '140px', resize: 'vertical' }}
                          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent transition-colors ${
                            selectedFile ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                          }`}
                        />
                        {!selectedFile && (
                          <p className={`text-xs mt-1 ${charWarning ? (charTooLong ? 'text-red-500' : 'text-amber-500') : 'text-gray-400'}`}>
                            {charCount.toLocaleString()} / 50,000 characters
                            {charWarning && !charTooLong && ' — approaching limit'}
                            {charTooLong && ' — exceeds maximum'}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-1 border-t border-gray-200" />
                          <span className="text-xs text-gray-400 flex-shrink-0">or upload a file</span>
                          <div className="flex-1 border-t border-gray-200" />
                        </div>

                        <div
                          onClick={() => !rawText && fileInputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); if (!rawText) setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleFileDrop}
                          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                            rawText
                              ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                              : isDragging
                              ? 'border-rzs-red bg-red-50 cursor-pointer'
                              : selectedFile
                              ? 'border-green-300 bg-green-50 cursor-pointer'
                              : 'border-gray-300 hover:border-gray-400 cursor-pointer'
                          }`}
                        >
                          {selectedFile ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setUploadError(''); }}
                                className="text-xs text-red-500 hover:text-red-700 font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Drop file here or click to browse</p>
                              <p className="text-xs text-gray-400">.srt, .docx, or .txt · max 10MB</p>
                            </div>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".srt,.docx,.txt"
                          className="hidden"
                          onChange={(e) => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full bg-rzs-red text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Analyze transcript
                      </button>
                    </form>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ===== DOCUMENTS TAB ===== */}
      {tab === 'documents' && (
        <>
          {/* DOC LIST VIEW */}
          {docView === 'list' && (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
                <h2 className="font-semibold text-rzs-charcoal text-sm">Deal Documents</h2>
                <button
                  onClick={() => { resetDocUploadForm(); setDocView('upload'); }}
                  className="text-xs bg-rzs-red text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  + Upload
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loadingDocList ? (
                  <p className="text-center text-gray-400 text-sm py-8">Loading...</p>
                ) : documents.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <p className="font-medium text-rzs-charcoal">No documents yet</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Upload a proposal or business case and I'll review it against Red Zone Selling principles.
                    </p>
                    <button
                      onClick={() => { resetDocUploadForm(); setDocView('upload'); }}
                      className="mt-1 bg-rzs-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      + Upload document
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((d) => (
                      <div key={d.id} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                {DOC_TYPE_LABELS[d.document_type] || d.document_type}
                              </span>
                              <span className="inline-block text-xs font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                                {(d.source_format || 'file').toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-rzs-charcoal font-medium mt-1 truncate">{d.original_filename}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {d.word_count ? ` · ${d.word_count.toLocaleString()} words` : ''}
                            </p>
                            {d.summary && (
                              <p className="text-xs text-gray-500 mt-1">{d.summary}</p>
                            )}
                          </div>

                          <div className="flex-shrink-0">
                            {confirmDocDeleteId === d.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDocDelete(d.id)}
                                  disabled={deletingDoc}
                                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                                >
                                  {deletingDoc ? 'Deleting…' : 'Delete'}
                                </button>
                                <button
                                  onClick={() => setConfirmDocDeleteId(null)}
                                  className="text-xs text-gray-400 hover:text-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDocDeleteId(d.id)}
                                className="text-gray-300 hover:text-red-400 transition-colors p-1"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* DOC UPLOAD VIEW */}
          {docView === 'upload' && (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
                {!docUploading && !docUploadSuccess ? (
                  <button
                    onClick={() => setDocView('list')}
                    className="text-sm text-gray-500 hover:text-rzs-charcoal"
                  >
                    ← Documents
                  </button>
                ) : (
                  <span />
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {docUploadSuccess ? (
                  <div className="text-center space-y-4 py-8">
                    <div className="text-green-500 flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-rzs-charcoal">Review complete</h3>
                    <p className="text-sm text-gray-600">The coaching has been added to your deal thread.</p>
                    <p className="text-xs text-gray-400 mt-2">Closing automatically in 3 seconds…</p>
                  </div>
                ) : docUploading ? (
                  <div className="text-center space-y-3 py-8">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-2 border-rzs-red border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="font-medium text-rzs-charcoal">Reviewing document…</p>
                    <p className="text-sm text-gray-500">This usually takes 10–20 seconds.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-rzs-charcoal mb-1">Upload document</h3>
                    <p className="text-xs text-gray-500 mb-4">I'll review it against Red Zone Selling principles and post feedback in your deal thread.</p>

                    {docUploadError && (
                      <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {docUploadError}
                      </div>
                    )}

                    <form onSubmit={handleDocUpload} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Document type</label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent"
                        >
                          <option value="proposal">Proposal</option>
                          <option value="business_case">Business Case</option>
                        </select>
                      </div>

                      <div>
                        <div
                          onClick={() => docFileInputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); setDocIsDragging(true); }}
                          onDragLeave={() => setDocIsDragging(false)}
                          onDrop={handleDocFileDrop}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            docIsDragging
                              ? 'border-rzs-red bg-red-50'
                              : docFile
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {docFile ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-green-700">{docFile.name}</p>
                              <p className="text-xs text-gray-500">{(docFile.size / 1024).toFixed(1)} KB</p>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setDocFile(null); setDocUploadError(''); }}
                                className="text-xs text-red-500 hover:text-red-700 font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm text-gray-500">Drop file here or click to browse</p>
                              <p className="text-xs text-gray-400">.pdf or .docx · max 10MB</p>
                            </div>
                          )}
                        </div>
                        <input
                          ref={docFileInputRef}
                          type="file"
                          accept=".pdf,.docx"
                          className="hidden"
                          onChange={(e) => { if (e.target.files[0]) handleDocFileSelect(e.target.files[0]); }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={docUploading || !docFile}
                        className="w-full bg-rzs-red text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Review document
                      </button>
                    </form>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
