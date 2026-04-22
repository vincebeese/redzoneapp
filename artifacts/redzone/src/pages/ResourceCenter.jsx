import { useState, useEffect, useMemo } from 'react';

const ZONE_CONFIG = {
  yellow: {
    label: '🟡 Yellow Zone',
    tagline: 'Build value and differentiate before it gets competitive',
    bg: '#FFF9C4',
    codeBg: '#FFF9C4',
    codeText: '#854d0e',
  },
  green: {
    label: '🟢 Green Zone',
    tagline: 'Advance the deal and secure commitment',
    bg: '#dcfce7',
    codeBg: '#dcfce7',
    codeText: '#166534',
  },
  red: {
    label: '🔴 Red Zone',
    tagline: 'Protect the deal when it\'s at risk',
    bg: '#fee2e2',
    codeBg: '#fee2e2',
    codeText: '#991b1b',
  },
  bonus: {
    label: '🏈 Bonus Plays',
    tagline: 'Advanced techniques for elite reps',
    bg: '#f3e8ff',
    codeBg: '#f3e8ff',
    codeText: '#6b21a8',
  },
};

function getLinkLabel(url) {
  if (!url) return null;
  if (url.includes('docs.google.com/spreadsheets')) return '↗ Open in Google Sheets';
  if (url.includes('docs.google.com/document')) return '↗ Open in Google Doc';
  if (url.includes('drive.google.com')) return '↗ Open PDF';
  return '↗ Open resource';
}

function SkeletonZone() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <div className="h-12 bg-gray-100 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-4 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolCard({ tool, zone }) {
  const cfg = ZONE_CONFIG[zone];
  const [showTip, setShowTip] = useState(false);
  const linkLabel = getLinkLabel(tool.url);
  const clickable = !!tool.url;

  function handleClick() {
    if (!tool.url) { setShowTip(true); setTimeout(() => setShowTip(false), 1800); return; }
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ event_type: 'resource_tool_opened', properties: { tool_id: tool.id, tool_name: tool.name, zone } }),
    }).catch(() => {});
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      onClick={handleClick}
      className={`relative flex gap-3 px-4 py-3 bg-white transition-colors ${clickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}`}
    >
      <span
        className="flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono leading-none self-start"
        style={{ background: cfg.codeBg, color: cfg.codeText }}
      >
        {tool.code}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-900 leading-snug">{tool.name}</p>
        <p className="text-[11px] text-gray-500 leading-[1.4] mt-0.5 line-clamp-2">{tool.description}</p>
        {linkLabel ? (
          <p className="text-[10px] font-medium mt-1" style={{ color: '#C62828' }}>{linkLabel}</p>
        ) : (
          <p className="text-[10px] font-medium mt-1 text-amber-500">No link yet</p>
        )}
      </div>
      {showTip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap z-10">
          Coming soon
        </div>
      )}
    </div>
  );
}

function ZoneSection({ zone, tools, search }) {
  const cfg = ZONE_CONFIG[zone];
  const [collapsed, setCollapsed] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return tools;
    const q = search.toLowerCase();
    return tools.filter(t =>
      t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
    );
  }, [tools, search]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ background: cfg.bg }}
      >
        <div>
          <span className="text-sm font-semibold text-gray-900">{cfg.label}</span>
          <span className="ml-2 text-[11px] text-gray-500">{cfg.tagline}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-gray-600 font-medium">
            {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {!collapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200">
          {filtered.length > 0 ? filtered.map(t => (
            <ToolCard key={t.id} tool={t} zone={zone} />
          )) : (
            <div className="bg-white col-span-2 px-4 py-6 text-center text-xs text-gray-400">
              No tools match your search
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResourceCenter() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');

  function load() {
    setLoading(true);
    setError(false);
    fetch('/api/resource-center', { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  const totalActive = useMemo(() => {
    if (!data) return 0;
    const q = search.toLowerCase();
    if (!q) return Object.values(data).flat().length;
    return Object.values(data).flat().filter(t =>
      t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
    ).length;
  }, [data, search]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      <div style={{ background: '#1A1A1A' }} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-base leading-tight">Resource Center</h1>
          <p className="text-gray-400 text-[11px] mt-0.5">
            {loading ? 'Loading…' : `${Object.values(data || {}).flat().length} tools · Yellow, Green & Red Zone · Templates · Plays · Calculators`}
          </p>
        </div>
        <div className="relative flex-shrink-0 w-full sm:w-56">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools…"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white leading-none"
            >×</button>
          )}
        </div>
        {search && !loading && (
          <p className="text-[11px] text-gray-400 flex-shrink-0">{totalActive} tool{totalActive !== 1 ? 's' : ''} found</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Beta FAQ Banner */}
        <div className="flex items-center justify-between gap-3 bg-rzs-charcoal rounded-lg px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-bold tracking-widest uppercase text-rzs-red flex-shrink-0">Beta</span>
            <span className="text-white text-xs font-medium truncate">New to the RZS AI Coach? Read the Beta FAQ.</span>
          </div>
          <a
            href="/faq.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-[11px] font-semibold text-rzs-red border border-rzs-red/40 rounded px-3 py-1 hover:bg-rzs-red hover:text-white transition-colors whitespace-nowrap"
          >
            Read FAQ ↗
          </a>
        </div>

        {loading && (
          <>
            <SkeletonZone />
            <SkeletonZone />
            <SkeletonZone />
            <SkeletonZone />
          </>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-gray-500 mb-3">Couldn't load the Resource Center.</p>
            <button
              onClick={load}
              className="px-4 py-2 bg-rzs-red text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <>
            {Object.keys(ZONE_CONFIG).map(zone => (
              <ZoneSection
                key={zone}
                zone={zone}
                tools={data[zone] || []}
                search={search}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
