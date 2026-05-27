import { useState, useEffect, useRef } from 'react';
import ArtifactCard from './ArtifactCard';
import { ARTIFACT_TITLES, COMPACT_ABBREVS, COMPACT_HEADER_COLORS, exportToXLSX } from './artifactUtils';

const RICH_TYPES = ['4f_scorecard', 'map', 'otc_scorecard'];

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function ArtifactListCard({ artifact, onOpen, onPDF, onXLSX, onCopy, onDelete }) {
  const type = artifact.artifact_type;
  const headerBg = COMPACT_HEADER_COLORS[type] || '#555';
  const abbrev = COMPACT_ABBREVS[type] || type.slice(0, 2).toUpperCase();
  const title = ARTIFACT_TITLES[type] || type;
  const isRich = RICH_TYPES.includes(type) && artifact.artifact_data;

  return (
    <div className="flex items-stretch rounded-lg border border-gray-200 overflow-hidden bg-white hover:shadow-sm transition-shadow">
      {/* Icon tile */}
      <div
        style={{ background: headerBg, minWidth: 52 }}
        className="flex items-center justify-center flex-shrink-0"
      >
        <span className="text-white text-xs font-bold tracking-wide">{abbrev}</span>
      </div>

      {/* Info */}
      <div className="flex-1 px-3 py-2.5 min-w-0">
        <p className="text-sm font-semibold text-rzs-charcoal truncate">{title}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{artifact.summary}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(artifact.created_at)}</p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1.5 px-3 flex-shrink-0">
        <button
          onClick={() => onOpen(artifact)}
          className="text-xs font-medium text-rzs-red border border-red-200 bg-red-50 hover:bg-red-100 rounded px-2 py-1 transition-colors"
        >
          Open
        </button>
        {isRich ? (
          <>
            <button
              onClick={() => onPDF(artifact)}
              className="text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
            >
              PDF
            </button>
            <button
              onClick={() => onXLSX(artifact)}
              className="text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
            >
              XLSX
            </button>
          </>
        ) : (
          <button
            onClick={() => onCopy(artifact)}
            className="text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
          >
            Copy
          </button>
        )}
        <button
          onClick={() => onDelete(artifact)}
          title="Delete artifact"
          className="text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded p-1 transition-colors"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

export default function ArtifactsPanel({ dealId, dealName, openArtifactId, onOpenArtifactHandled, onCountChange }) {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openArtifact, setOpenArtifact] = useState(null);
  const [autoPrint, setAutoPrint] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const printRef = useRef(false);

  useEffect(() => {
    if (!dealId) return;
    setLoading(true);
    fetch(`/api/artifacts?deal_id=${dealId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setArtifacts(Array.isArray(data) ? data : []);
        onCountChange?.(Array.isArray(data) ? data.length : 0);
        if (openArtifactId) {
          const found = (Array.isArray(data) ? data : []).find(a => a.id === openArtifactId);
          if (found) setOpenArtifact(found);
          onOpenArtifactHandled?.();
        }
      })
      .catch(() => setArtifacts([]))
      .finally(() => setLoading(false));
  }, [dealId]);

  // Handle openArtifactId changes after initial load
  useEffect(() => {
    if (!openArtifactId || !artifacts.length) return;
    const found = artifacts.find(a => a.id === openArtifactId);
    if (found) setOpenArtifact(found);
    onOpenArtifactHandled?.();
  }, [openArtifactId]);

  // Trigger print after artifact mounts in detail view
  useEffect(() => {
    if (!autoPrint || !openArtifact || printRef.current) return;
    printRef.current = true;
    const id = `artifact-${openArtifact.id}`;
    const tryPrint = (attempts = 0) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('is-printing');
        document.body.classList.add('printing-artifact');
        window.print();
        setTimeout(() => {
          el.classList.remove('is-printing');
          document.body.classList.remove('printing-artifact');
          setAutoPrint(false);
          printRef.current = false;
        }, 500);
      } else if (attempts < 10) {
        setTimeout(() => tryPrint(attempts + 1), 150);
      }
    };
    tryPrint();
  }, [autoPrint, openArtifact]);

  function handleOpen(artifact) {
    setOpenArtifact(artifact);
    setAutoPrint(false);
  }

  function handlePDF(artifact) {
    setOpenArtifact(artifact);
    setAutoPrint(true);
    printRef.current = false;
  }

  function handleXLSX(artifact) {
    exportToXLSX(artifact.artifact_type, artifact.artifact_data, artifact.artifact_data?.company || dealName);
  }

  async function handleCopy(artifact) {
    try {
      await navigator.clipboard.writeText(artifact.content || '');
      setCopiedId(artifact.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  }

  function handleDelete(artifact) {
    setConfirmDelete(artifact);
  }

  async function confirmDeleteArtifact() {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      const res = await fetch(`/api/artifacts/${confirmDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const updated = artifacts.filter(a => a.id !== confirmDelete.id);
        setArtifacts(updated);
        onCountChange?.(updated.length);
        if (openArtifact?.id === confirmDelete.id) {
          setOpenArtifact(null);
          setAutoPrint(false);
        }
      }
    } catch (e) {
      console.error('Delete failed:', e);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  }

  // ── CONFIRM DELETE DIALOG ────────────────────────────────────────────────────
  const deleteDialog = confirmDelete && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 className="font-semibold text-rzs-charcoal text-base mb-1">Delete artifact?</h3>
        <p className="text-sm text-gray-500 mb-5">
          <span className="font-medium text-rzs-charcoal">{ARTIFACT_TITLES[confirmDelete.artifact_type] || confirmDelete.artifact_type}</span> will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setConfirmDelete(null)}
            className="text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteArtifact}
            disabled={!!deletingId}
            className="text-sm font-medium text-white bg-rzs-red hover:bg-red-700 rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
          >
            {deletingId ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── DETAIL VIEW ─────────────────────────────────────────────────────────────
  if (openArtifact) {
    return (
      <>
        {deleteDialog}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center justify-between">
            <button
              onClick={() => { setOpenArtifact(null); setAutoPrint(false); }}
              className="text-sm text-rzs-red hover:text-red-700 font-medium flex items-center gap-1"
            >
              ← Artifacts
            </button>
            <button
              onClick={() => handleDelete(openArtifact)}
              title="Delete artifact"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <TrashIcon />
              Delete
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <ArtifactCard
              messageId={openArtifact.id}
              type={openArtifact.artifact_type}
              content={openArtifact.content}
              data={openArtifact.artifact_data}
              dealName={dealName}
              mode="full"
            />
          </div>
        </div>
      </>
    );
  }

  // ── LIST VIEW ────────────────────────────────────────────────────────────────
  return (
    <>
      {deleteDialog}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {loading ? (
          <div className="text-center text-gray-400 py-12 text-sm">Loading artifacts…</div>
        ) : artifacts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 font-medium mb-2">No artifacts yet</p>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Artifacts are generated during your coaching session. Ask the coach to build a 4F Scorecard, MAP, or other tool.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            {artifacts.map(a => (
              <ArtifactListCard
                key={a.id}
                artifact={{ ...a, _copiedId: copiedId }}
                onOpen={handleOpen}
                onPDF={handlePDF}
                onXLSX={handleXLSX}
                onCopy={handleCopy}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
