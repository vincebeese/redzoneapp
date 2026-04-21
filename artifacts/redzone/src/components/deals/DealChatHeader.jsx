import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ZoneScorecardModal from './ZoneScorecardModal';

const ZONE_ORDER = ['yellow', 'green', 'red'];

export default function DealChatHeader({ deal, onUpdateDeal, transcriptCount = 0, onOpenTranscripts }) {
  const navigate = useNavigate();
  const [showZoneMenu, setShowZoneMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [pendingZone, setPendingZone] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const titleInputRef = useRef(null);
  const titleCommitted = useRef(false);
  const titleCancelled = useRef(false);

  const zones = ['yellow', 'green', 'red'];
  const statuses = ['active', 'won', 'lost', 'archived'];

  function startEditTitle() {
    titleCommitted.current = false;
    titleCancelled.current = false;
    setTitleValue(deal.company || deal.name || '');
    setEditingTitle(true);
  }

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  function commitTitleEdit() {
    if (titleCommitted.current || titleCancelled.current) return;
    titleCommitted.current = true;
    const trimmed = titleValue.trim();
    const newTitle = trimmed || 'New Deal';
    if (deal.company !== undefined) {
      onUpdateDeal({ company: newTitle });
    } else {
      onUpdateDeal({ name: newTitle });
    }
    setEditingTitle(false);
  }

  function handleTitleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitTitleEdit();
    } else if (e.key === 'Escape') {
      titleCancelled.current = true;
      setEditingTitle(false);
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/deals')}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <div>
            {editingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={commitTitleEdit}
                onKeyDown={handleTitleKeyDown}
                className="font-semibold text-rzs-charcoal bg-transparent border-b border-rzs-charcoal outline-none w-48 sm:w-64"
                placeholder="New Deal"
              />
            ) : (
              <h1
                className="font-semibold text-rzs-charcoal cursor-pointer hover:text-rzs-red group flex items-center gap-1"
                onClick={startEditTitle}
                title="Click to rename"
              >
                {deal.company || deal.name || 'New Deal'}
                <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </h1>
            )}
            {deal.company && !editingTitle && (
              <p className="text-sm text-gray-500">{deal.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Transcripts button */}
          {onOpenTranscripts && (
            <button
              onClick={onOpenTranscripts}
              className="text-sm text-gray-500 hover:text-rzs-charcoal border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-colors flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Transcripts{transcriptCount > 0 ? ` (${transcriptCount})` : ''}
            </button>
          )}

          {/* Zone selector */}
          <div className="relative">
            <button
              onClick={() => setShowZoneMenu(!showZoneMenu)}
              className={`zone-badge cursor-pointer zone-badge-${deal.zone}`}
            >
              {deal.zone?.toUpperCase()} ZONE ▾
            </button>

            {showZoneMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {zones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => {
                      setShowZoneMenu(false);
                      const currentIdx = ZONE_ORDER.indexOf(deal.zone);
                      const targetIdx = ZONE_ORDER.indexOf(zone);
                      // Only gate advances (moving to a higher zone)
                      if (targetIdx > currentIdx) {
                        setPendingZone(zone);
                      } else {
                        onUpdateDeal({ zone });
                      }
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      zone === deal.zone ? 'bg-gray-50' : ''
                    }`}
                  >
                    <span className={`inline-block w-3 h-3 rounded-full bg-zone-${zone} mr-2`} />
                    {zone.toUpperCase()} Zone
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zone Scorecard Modal — soft gate on advancement */}
          {pendingZone && (
            <ZoneScorecardModal
              fromZone={deal.zone}
              toZone={pendingZone}
              onAdvance={() => {
                onUpdateDeal({ zone: pendingZone });
                setPendingZone(null);
              }}
              onCancel={() => setPendingZone(null)}
            />
          )}

          {/* Status selector */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="text-sm text-gray-500 hover:text-gray-700 capitalize"
            >
              {deal.status} ▾
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onUpdateDeal({ status });
                      setShowStatusMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize ${
                      status === deal.status ? 'bg-gray-50' : ''
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deal metadata */}
      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
        {deal.deal_value && (
          <span>${Number(deal.deal_value).toLocaleString()}</span>
        )}
        {deal.close_date && (
          <span>Close: {new Date(deal.close_date).toLocaleDateString()}</span>
        )}
        <span>Turn {deal.turn_count || 0}</span>
      </div>
    </header>
  );
}
