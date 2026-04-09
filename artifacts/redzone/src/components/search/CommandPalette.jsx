import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { formatDistanceToNow } from '../../utils/dateUtils';

export default function CommandPalette({ modeSlug, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const lastQueryRef = useRef('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchResults = useCallback(async (q) => {
    lastQueryRef.current = q;
    setIsLoading(true);
    setSearchError(null);
    try {
      const url = q.trim()
        ? `/api/sessions/search?mode=${modeSlug}&q=${encodeURIComponent(q.trim())}`
        : `/api/sessions?mode=${modeSlug}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data);
      setActiveIndex(0);
    } catch {
      setSearchError('Could not load sessions.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [modeSlug]);

  useEffect(() => {
    fetchResults('');
  }, [fetchResults]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(query);
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query, fetchResults]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        if (results[activeIndex]) {
          onSelect(results[activeIndex]);
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, activeIndex, onSelect, onClose]);

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions..."
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
          <kbd className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="py-8 text-center text-sm text-gray-400">Searching...</div>
          )}

          {!isLoading && searchError && (
            <div className="py-6 text-center">
              <p className="text-sm text-red-500 mb-2">{searchError}</p>
              <button
                onClick={() => fetchResults(lastQueryRef.current)}
                className="text-xs text-gray-600 underline hover:text-gray-800"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !searchError && results.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">
              {query.trim() ? 'No sessions found' : 'No past sessions'}
            </div>
          )}

          {!isLoading && !searchError && results.map((session, i) => (
            <button
              key={session.id}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                i === activeIndex ? 'bg-gray-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => { onSelect(session); onClose(); }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-800 truncate">
                  {session.first_message || 'Empty session'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {session.message_count} {Number(session.message_count) === 1 ? 'message' : 'messages'} · {formatDistanceToNow(session.updated_at)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
