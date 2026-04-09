import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatThread from '../components/chat/ChatThread';
import ChatInput from '../components/chat/ChatInput';
import CommandPalette from '../components/search/CommandPalette';
import { formatDistanceToNow } from '../utils/dateUtils';

export default function DynamicMode() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [modeConfig, setModeConfig] = useState(null);
  const [modeError, setModeError] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sessionsError, setSessionsError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const [showPalette, setShowPalette] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const renameCommitted = useRef(false);
  const renameCancelled = useRef(false);

  // Load mode config
  useEffect(() => {
    setModeConfig(null);
    setModeError(false);
    setSessions([]);
    setActiveSession(null);
    setMessages([]);
    fetch(`/api/modes/${slug}`, { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        setModeConfig(await r.json());
      })
      .catch(() => setModeError(true));
  }, [slug]);

  const loadSessions = useCallback(async () => {
    if (!slug) return;
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const res = await fetch(`/api/sessions?mode=${slug}`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      setSessions(await res.json());
    } catch {
      setSessionsError('Could not load sessions.');
    } finally {
      setSessionsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (modeConfig) loadSessions();
  }, [modeConfig, loadSessions]);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette((v) => !v);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  async function loadSession(session) {
    setDrawerOpen(false);
    setActiveSession(session);
    setMessages([]);
    setStreamingContent('');
    setMessagesError(null);
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/sessions/${session.id}/messages`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(data.map((m) => ({ role: m.role, content: m.content })));
    } catch {
      setMessagesError('Could not load this session.');
    } finally {
      setMessagesLoading(false);
    }
  }

  async function handleNewSession() {
    setDrawerOpen(false);
    setMessagesError(null);
    setSendError(null);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mode_slug: slug }),
      });
      if (!res.ok) throw new Error();
      const session = await res.json();
      setActiveSession(session);
      setMessages([]);
      setStreamingContent('');
      setSessions((prev) => [{ ...session, message_count: 0, first_message: null }, ...prev]);
    } catch {
      setSendError('Could not create a new session. Please try again.');
    }
  }

  async function handleSend(content) {
    if (!activeSession) return;
    setSendError(null);
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch(`/api/chat/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: content, session_id: activeSession.id }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let streamError = null;

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              if (!streamError) {
                setMessages((prev) => [...prev, { role: 'assistant', content: assistantContent }]);
                setStreamingContent('');
                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === activeSession.id
                      ? {
                          ...s,
                          updated_at: new Date().toISOString(),
                          first_message: s.first_message || content,
                          message_count: Number(s.message_count || 0) + 2,
                        }
                      : s
                  )
                );
              }
              break outer;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantContent += parsed.text;
                setStreamingContent(assistantContent);
              } else if (parsed.error) {
                streamError = parsed.error;
              }
            } catch {
              // skip invalid JSON frames
            }
          }
        }
      }

      if (streamError) throw new Error(streamError);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
      setSendError('Failed to send message.');
      setLastFailedMessage(content);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  }

  async function handleRename(sessionId, newTitle) {
    if (renameCommitted.current || renameCancelled.current) return;
    renameCommitted.current = true;
    const title = newTitle.trim() || 'New Chat';
    setRenamingId(null);
    setRenameValue('');
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Failed to rename');
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, title } : s))
      );
      if (activeSession?.id === sessionId) {
        setActiveSession((prev) => ({ ...prev, title }));
      }
    } catch {
      setSendError('Could not rename session.');
    }
  }

  async function handleDelete(sessionId, e) {
    e.stopPropagation();
    if (deletingId === sessionId) {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE', credentials: 'include' });
        if (!res.ok) throw new Error();
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (activeSession?.id === sessionId) {
          setActiveSession(null);
          setMessages([]);
        }
      } catch {
        setSendError('Could not delete session.');
      } finally {
        setDeletingId(null);
      }
    } else {
      setDeletingId(sessionId);
    }
  }

  if (modeError) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">This mode is not available.</p>
          <button onClick={() => navigate('/deals')} className="btn-primary">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!modeConfig) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-rzs-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = modeConfig.display_name;
  const description = modeConfig.description || '';

  const sessionList = (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100 flex items-center gap-2">
        <button
          onClick={() => setShowPalette(true)}
          className="flex-1 flex items-center gap-2 text-sm text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors text-left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="flex-1">Search</span>
          <kbd className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      <div className="p-3">
        <button
          onClick={handleNewSession}
          className="w-full flex items-center gap-2 text-sm font-medium text-rzs-red hover:bg-rzs-red/5 rounded-lg px-3 py-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessionsLoading && <div className="py-6 text-center text-sm text-gray-400">Loading...</div>}
        {sessionsError && (
          <div className="px-3 py-4 text-center">
            <p className="text-sm text-red-500 mb-2">{sessionsError}</p>
            <button onClick={loadSessions} className="text-xs text-rzs-red underline">Retry</button>
          </div>
        )}
        {!sessionsLoading && !sessionsError && sessions.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-400 px-3">No past conversations yet</div>
        )}
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group relative mx-2 mb-1 rounded-lg transition-colors ${
              renamingId === session.id ? 'bg-gray-50' : activeSession?.id === session.id ? 'bg-rzs-red/10' : 'hover:bg-gray-50'
            }`}
          >
            <div
              className="px-3 py-2.5 pr-8 cursor-pointer"
              onClick={() => renamingId !== session.id && loadSession(session)}
            >
              {renamingId === session.id ? (
                <input
                  autoFocus
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRename(session.id, renameValue)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); handleRename(session.id, renameValue); }
                    else if (e.key === 'Escape') { renameCancelled.current = true; setRenamingId(null); setRenameValue(''); }
                  }}
                  className="text-sm w-full bg-white border border-rzs-red/40 rounded px-1.5 py-0.5 outline-none text-gray-700"
                  placeholder="New Chat"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p
                  className={`text-sm truncate hover:underline decoration-dotted cursor-text ${activeSession?.id === session.id ? 'text-rzs-red font-medium' : 'text-gray-700'}`}
                  title="Click to rename"
                  onClick={(e) => {
                    e.stopPropagation();
                    renameCommitted.current = false;
                    renameCancelled.current = false;
                    setRenamingId(session.id);
                    setRenameValue(session.title || session.first_message || '');
                  }}
                >
                  {session.title || session.first_message || 'New Chat'}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">
                {session.message_count} {Number(session.message_count) === 1 ? 'message' : 'messages'} · {formatDistanceToNow(session.updated_at)}
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(session.id, e)}
              className={`absolute right-2 top-2.5 p-1 rounded transition-colors ${
                deletingId === session.id
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100'
              }`}
              title={deletingId === session.id ? 'Click again to confirm delete' : 'Delete session'}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex">
      {showPalette && (
        <CommandPalette
          modeSlug={slug}
          onSelect={loadSession}
          onClose={() => setShowPalette(false)}
        />
      )}

      {/* Left panel — desktop */}
      <div className="hidden md:flex flex-col w-[260px] flex-shrink-0 bg-white border-r border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{displayName}</h2>
        </div>
        {sessionList}
      </div>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transition-transform duration-200 md:hidden flex flex-col ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{displayName}</h2>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {sessionList}
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setDrawerOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-rzs-charcoal">{displayName}</h1>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
          {!activeSession ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-rzs-red/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {modeConfig.icon || '💬'}
                </div>
                <h2 className="text-xl font-semibold text-rzs-charcoal mb-2">Welcome to {displayName}</h2>
                {description && <p className="text-gray-500 mb-6">{description}</p>}
                <button onClick={handleNewSession} className="btn-primary">+ New Conversation</button>
              </div>
            </div>
          ) : messagesLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-sm text-gray-400">Loading conversation...</div>
            </div>
          ) : messagesError ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-red-500 mb-2">{messagesError}</p>
                <button onClick={() => loadSession(activeSession)} className="text-sm text-rzs-red underline">Retry</button>
              </div>
            </div>
          ) : (
            <>
              {messages.length === 0 && !streamingContent ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <p className="text-gray-500">Ask your first question to get started.</p>
                  </div>
                </div>
              ) : (
                <ChatThread
                  messages={messages}
                  streamingContent={streamingContent}
                  isLoading={isLoading}
                />
              )}
              {sendError && (
                <div className="px-4 pb-2 text-sm text-red-500 flex items-center gap-2 flex-wrap">
                  <span>{sendError}</span>
                  {lastFailedMessage && (
                    <button
                      onClick={() => {
                        const msg = lastFailedMessage;
                        setLastFailedMessage(null);
                        setSendError(null);
                        setMessages((prev) => {
                          let msgs = [...prev];
                          if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') msgs = msgs.slice(0, -1);
                          if (msgs.length > 0 && msgs[msgs.length - 1].role === 'user' && msgs[msgs.length - 1].content === msg) msgs = msgs.slice(0, -1);
                          return msgs;
                        });
                        handleSend(msg);
                      }}
                      className="underline font-medium"
                    >
                      Retry
                    </button>
                  )}
                  <button onClick={() => { setSendError(null); setLastFailedMessage(null); }} className="underline">Dismiss</button>
                </div>
              )}
              <ChatInput
                onSend={handleSend}
                disabled={isLoading}
                placeholder={`Ask ${displayName} anything…`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
