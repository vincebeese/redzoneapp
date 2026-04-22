import { useState, useMemo } from 'react';

const SECTION_CONFIG = {
  courses: {
    label: '🎓 Courses',
    tagline: 'Structured learning paths grounded in the Red Zone Selling framework',
    bg: '#E3F2FD',
    codeBg: '#E3F2FD',
    codeText: '#1565C0',
  },
  masterclasses: {
    label: '🎬 Masterclasses',
    tagline: 'Deep-dive sessions with Vince Beese on specific skills and plays',
    bg: '#FFF3E0',
    codeBg: '#FFF3E0',
    codeText: '#E65100',
  },
};

const STATIC_CONTENT = {
  courses: [
    {
      id: 'c1',
      code: 'C1',
      name: 'Red Zone Selling Foundations',
      description: 'The full RZS framework from Yellow to Red Zone. Qualification, momentum, and closing.',
      url: null,
    },
    {
      id: 'c2',
      code: 'C2',
      name: 'The 4F Deal Filter',
      description: 'Master the Fit / Friction / Funding / Forecast filter. Never advance a bad deal again.',
      url: null,
    },
    {
      id: 'c3',
      code: 'C3',
      name: 'Champion Development',
      description: 'How to build, activate, and coach your champion to win internal deals for you.',
      url: null,
    },
  ],
  masterclasses: [
    {
      id: 'm1',
      code: 'M1',
      name: 'BlueSnap Workshop',
      description: "Vince's live coaching session on enterprise selling with the BlueSnap sales team.",
      url: null,
    },
    {
      id: 'm2',
      code: 'M2',
      name: 'Closing in the Red Zone',
      description: 'The mental game and tactical execution of closing high-stakes enterprise deals.',
      url: null,
    },
    {
      id: 'm3',
      code: 'M3',
      name: 'The Cost of Doing Nothing',
      description: "Why urgency is your most powerful tool — and how to reveal the real cost of inaction for your buyer.",
      url: 'https://youtu.be/SsgWhltNF70',
    },
    {
      id: 'm4',
      code: 'M4',
      name: '3 Non-Negotiables to Win Big Deals',
      description: 'The three things elite sellers never compromise on when pursuing and closing enterprise deals.',
      url: 'https://youtu.be/0KH06spCk7Q',
    },
  ],
};

function getLinkLabel(url) {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) return '▶ Watch on YouTube';
  if (url.includes('vimeo.com')) return '▶ Watch on Vimeo';
  if (url.includes('docs.google.com')) return '↗ Open in Google Docs';
  return '↗ Open resource';
}

function ContentCard({ item, sectionKey }) {
  const cfg = SECTION_CONFIG[sectionKey];
  const [showTip, setShowTip] = useState(false);
  const linkLabel = getLinkLabel(item.url);
  const clickable = !!item.url;

  function handleClick() {
    if (!item.url) {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 1800);
      return;
    }
    window.open(item.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      onClick={handleClick}
      className={`relative flex gap-3 px-4 py-3 bg-white transition-colors ${
        clickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
      }`}
    >
      <span
        className="flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono leading-none self-start"
        style={{ background: cfg.codeBg, color: cfg.codeText }}
      >
        {item.code}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-900 leading-snug">{item.name}</p>
        <p className="text-[11px] text-gray-500 leading-[1.4] mt-0.5 line-clamp-2">{item.description}</p>
        {linkLabel ? (
          <p className="text-[10px] font-medium mt-1" style={{ color: '#C62828' }}>{linkLabel}</p>
        ) : (
          <p className="text-[10px] font-medium mt-1 text-amber-500">Coming soon</p>
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

function Section({ sectionKey, items, search }) {
  const cfg = SECTION_CONFIG[sectionKey];
  const [collapsed, setCollapsed] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ background: cfg.bg }}
      >
        <div>
          <span className="text-sm font-semibold text-gray-900">{cfg.label}</span>
          <span className="ml-2 text-[11px] text-gray-500">{cfg.tagline}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-gray-600 font-medium">
            {filtered.length} {filtered.length !== 1 ? 'items' : 'item'}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {!collapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <ContentCard key={item.id} item={item} sectionKey={sectionKey} />
            ))
          ) : (
            <div className="bg-white col-span-2 px-4 py-6 text-center text-xs text-gray-400">
              No items match your search
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LearningHub() {
  const [search, setSearch] = useState('');

  const totalItems = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return Object.values(STATIC_CONTENT).flat().length;
    return Object.values(STATIC_CONTENT)
      .flat()
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q)
      ).length;
  }, [search]);

  const totalAll = Object.values(STATIC_CONTENT).flat().length;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      <div
        style={{ background: '#1A1A1A' }}
        className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-base leading-tight">Learning Hub</h1>
          <p className="text-gray-400 text-[11px] mt-0.5">
            {totalAll} items · Courses · Masterclasses
          </p>
        </div>
        <div className="relative flex-shrink-0 w-full sm:w-56">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search learning content…"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white leading-none"
            >
              ×
            </button>
          )}
        </div>
        {search && (
          <p className="text-[11px] text-gray-400 flex-shrink-0">
            {totalItems} {totalItems !== 1 ? 'items' : 'item'} found
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {Object.keys(SECTION_CONFIG).map((sectionKey) => (
          <Section
            key={sectionKey}
            sectionKey={sectionKey}
            items={STATIC_CONTENT[sectionKey] || []}
            search={search}
          />
        ))}
      </div>
    </div>
  );
}
