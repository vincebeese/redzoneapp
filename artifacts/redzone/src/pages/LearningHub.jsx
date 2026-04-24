import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SECTION_CONFIG = {
  'being-curious': {
    label: '📖 Being Curious',
    tagline: 'The Power of Inquisitive Selling — A Red Zone Coaching Short Course',
    bg: '#E3F2FD',
    codeBg: '#E3F2FD',
    codeText: '#1565C0',
    gated: false,
  },
  'companion-course': {
    label: '🏈 Red Zone Ready',
    tagline: 'Companion Course — The Foundation Course for Mastering the Red Zone Selling Framework',
    bg: '#FEE2E2',
    codeBg: '#FEE2E2',
    codeText: '#991B1B',
    gated: true,
  },
  masterclasses: {
    label: '🎬 Masterclasses',
    tagline: 'Deep-dive sessions with Vince Beese on specific skills and plays',
    bg: '#FFF3E0',
    codeBg: '#FFF3E0',
    codeText: '#E65100',
    gated: false,
  },
};

const STATIC_CONTENT = {
  'being-curious': [
    {
      id: 'bc1',
      code: 'L1',
      name: 'Can Curiosity be Taught?',
      description: 'The case for curiosity as a learnable skill — and why most reps stop asking too soon.',
      url: 'https://youtu.be/jFthJeP1gHY',
    },
    {
      id: 'bc2',
      code: 'L2',
      name: 'What Inquisitive Selling Looks Like',
      description: 'Real examples of curiosity in action — the questions that open deals and the ones that close them down.',
      url: 'https://youtu.be/WC89FMioVPo',
    },
    {
      id: 'bc3',
      code: 'L3',
      name: 'How to Train Your Curiosity',
      description: 'Practical drills and habits to sharpen your inquisitive instinct before every call.',
      url: 'https://youtu.be/UQs9GO4feu0',
    },
    {
      id: 'bc4',
      code: 'L4',
      name: 'Recap & Challenge',
      description: 'Key takeaways from the course and a hands-on challenge to put inquisitive selling to work immediately.',
      url: 'https://youtu.be/-rtRGX44rSA',
    },
  ],
  'companion-course': [
    {
      id: 'cc1',
      code: 'L1',
      name: "Kick Off — Let's Go",
      description: "Course overview and what you'll walk away with after mastering the Red Zone Selling framework.",
      url: 'https://youtu.be/riaUeq_B9Qw',
    },
    {
      id: 'cc2',
      code: 'L2',
      name: 'Close More Deals, Make More Money',
      description: 'The mindset shift that separates elite closers from average reps — and how to adopt it immediately.',
      url: 'https://youtu.be/Q0Mm2XZJchw',
    },
    {
      id: 'cc3',
      code: 'L3',
      name: 'Yellow Zone — Qualify Like a Champion',
      description: 'How to qualify ruthlessly, filter bad deals early, and only advance opportunities worth your time.',
      url: 'https://youtu.be/HzhUJoGfKFU',
    },
    {
      id: 'cc4',
      code: 'L4',
      name: 'Green Zone — Keep the Chains Moving',
      description: 'Building momentum, advancing the deal, and securing the commitments that move you toward close.',
      url: 'https://youtu.be/9k-1dmLgQ8g',
    },
    {
      id: 'cc5',
      code: 'L5',
      name: 'Red Zone — Finish Like a Closer',
      description: 'The plays, the language, and the mindset you need when the deal is on the line.',
      url: 'https://youtu.be/3IV7G10mVys',
    },
    {
      id: 'cc6',
      code: 'L6',
      name: 'Putting Red Zone Selling to Work for You',
      description: 'How to apply the full framework to your current pipeline starting today.',
      url: 'https://youtu.be/5tiKwroa1NI',
    },
  ],
  masterclasses: [
    {
      id: 'm3',
      code: 'M3',
      name: 'The Cost of Doing Nothing',
      description: 'Why urgency is your most powerful tool — and how to reveal the real cost of inaction for your buyer.',
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
  return '↗ Open resource';
}

function ContentCard({ item, sectionKey, locked }) {
  const cfg = SECTION_CONFIG[sectionKey];
  const [showTip, setShowTip] = useState(false);

  function handleClick() {
    if (locked) {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 2500);
      return;
    }
    if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      onClick={handleClick}
      className={`relative flex gap-3 px-4 py-3 bg-white transition-colors ${
        locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-50'
      }`}
    >
      <span
        className="flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono leading-none self-start"
        style={{ background: cfg.codeBg, color: cfg.codeText }}
      >
        {item.code}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1.5">
          <p className="text-xs font-semibold text-gray-900 leading-snug flex-1">{item.name}</p>
          {locked && <span className="flex-shrink-0 text-[10px]">🔒</span>}
        </div>
        <p className="text-[11px] text-gray-500 leading-[1.4] mt-0.5 line-clamp-2">{item.description}</p>
        {locked ? (
          <p className="text-[10px] font-medium mt-1 text-gray-400">Unlock to watch</p>
        ) : (
          <p className="text-[10px] font-medium mt-1" style={{ color: '#C62828' }}>{getLinkLabel(item.url)}</p>
        )}
      </div>
      {showTip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1.5 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap z-10">
          Unlock the course to watch
        </div>
      )}
    </div>
  );
}

function Section({ sectionKey, items, search, hasAccess, onUnlock, unlocking }) {
  const cfg = SECTION_CONFIG[sectionKey];
  const [collapsed, setCollapsed] = useState(false);
  const locked = cfg.gated && !hasAccess;

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
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-gray-900">{cfg.label}</span>
          {locked && (
            <span className="text-[10px] font-semibold bg-rzs-red text-white px-1.5 py-0.5 rounded flex-shrink-0">
              PREMIUM
            </span>
          )}
          {cfg.gated && !locked && (
            <span className="text-[10px] font-semibold bg-green-600 text-white px-1.5 py-0.5 rounded flex-shrink-0">
              Premium Offer
            </span>
          )}
          <span className="ml-1 text-[11px] text-gray-500 hidden sm:inline truncate">{cfg.tagline}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-gray-600 font-medium">
            {filtered.length} {filtered.length !== 1 ? 'lessons' : 'lesson'}
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
        <>
          {locked && (
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800">Get full access to this course</p>
                <p className="text-[11px] text-gray-500 mt-0.5">6 lessons · One-time purchase · Use code <span className="font-mono font-semibold text-rzs-red">Companion20</span> for 20% off</p>
              </div>
              <button
                onClick={onUnlock}
                disabled={unlocking}
                className="flex-shrink-0 bg-rzs-red text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {unlocking ? 'Loading…' : 'Unlock Course →'}
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  sectionKey={sectionKey}
                  locked={locked}
                />
              ))
            ) : (
              <div className="bg-white col-span-2 px-4 py-6 text-center text-xs text-gray-400">
                No items match your search
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function LearningHub() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  const hasCompanionCourse = !!(user?.has_companion_course || user?.is_admin);

  const totalAll = Object.values(STATIC_CONTENT).flat().length;

  const totalItems = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return totalAll;
    return Object.values(STATIC_CONTENT)
      .flat()
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q)
      ).length;
  }, [search]);

  // Refresh user after successful purchase redirect
  useMemo(() => {
    if (location.search.includes('course_unlocked=true')) {
      refreshUser();
    }
  }, []);

  async function handleUnlock() {
    setUnlocking(true);
    try {
      const res = await fetch('/api/stripe/companion-course-checkout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Could not start checkout. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      <div
        style={{ background: '#1A1A1A' }}
        className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-base leading-tight">Learning Hub</h1>
          <p className="text-gray-400 text-[11px] mt-0.5">
            {totalAll} lessons · Courses · Masterclasses
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
            hasAccess={sectionKey === 'companion-course' ? hasCompanionCourse : true}
            onUnlock={handleUnlock}
            unlocking={unlocking}
          />
        ))}
      </div>
    </div>
  );
}
