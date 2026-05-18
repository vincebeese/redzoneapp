import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommandPalette from '../components/search/CommandPalette';
import TranscriptUploadModal from '../components/chat/TranscriptUploadModal';
import { formatDistanceToNow } from '../utils/dateUtils';

export default function MindsetMode() {
  const { user } = useAuth();
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
  const [editingHeaderTitle, setEditingHeaderTitle] = useState(false);
  const [headerTitleValue, setHeaderTitleValue] = useState('');
  const headerTitleRef = useRef(null);
  const headerTitleCommitted = useRef(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const res = await fetch('/api/sessions?mode=mindset', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load sessions');
      const data = await res.json();
      setSessions(data);
    } catch {
      setSessionsError('Could not load sessions.');
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

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
      if (!res.ok) throw new Error('Failed to load messages');
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
        body: JSON.stringify({ mode_slug: 'mindset' }),
      });
      if (!res.ok) throw new Error('Failed to create session');
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
    const userMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat/mindset', {
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
              if (parsed.type === 'complete') {
                if (parsed.profile_saved) {
                  window.dispatchEvent(new CustomEvent('rz:profile-updated'));
                }
              } else if (parsed.text) {
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

      if (streamError) {
        throw new Error(streamError);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
      setSendError('Failed to send message.');
      setLastFailedMessage(content);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  }

  useEffect(() => {
    if (editingHeaderTitle && headerTitleRef.current) {
      headerTitleRef.current.focus();
      headerTitleRef.current.select();
    }
  }, [editingHeaderTitle]);

  function startHeaderEdit() {
    headerTitleCommitted.current = false;
    setHeaderTitleValue(activeSession.title || activeSession.first_message || '');
    setEditingHeaderTitle(true);
  }

  async function commitHeaderEdit() {
    if (headerTitleCommitted.current) return;
    headerTitleCommitted.current = true;
    setEditingHeaderTitle(false);
    const title = headerTitleValue.trim() || 'New Chat';
    try {
      const res = await fetch(`/api/sessions/${activeSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error();
      setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? { ...s, title } : s)));
      setActiveSession((prev) => ({ ...prev, title }));
    } catch {
      setSendError('Could not rename session.');
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
        const res = await fetch(`/api/sessions/${sessionId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
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

  const sessionList = (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-700 flex items-center gap-2">
        <button
          onClick={() => setShowPalette(true)}
          className="flex-1 flex items-center gap-2 text-sm text-gray-500 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors text-left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="flex-1">Search</span>
          <kbd className="text-xs font-mono bg-gray-700 px-1.5 py-0.5 rounded text-gray-400">⌘K</kbd>
        </button>
      </div>

      <div className="p-3">
        <button
          onClick={handleNewSession}
          className="w-full flex items-center gap-2 text-sm font-medium text-rzs-gold hover:bg-rzs-gold/10 rounded-lg px-3 py-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessionsLoading && (
          <div className="py-6 text-center text-sm text-gray-500">Loading...</div>
        )}
        {sessionsError && (
          <div className="px-3 py-4 text-center">
            <p className="text-sm text-red-400 mb-2">{sessionsError}</p>
            <button onClick={loadSessions} className="text-xs text-rzs-gold underline">Retry</button>
          </div>
        )}
        {!sessionsLoading && !sessionsError && sessions.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-500 px-3">No past conversations yet</div>
        )}
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group relative mx-2 mb-1 rounded-lg transition-colors ${
              renamingId === session.id ? 'bg-gray-800' : activeSession?.id === session.id ? 'bg-rzs-gold/10' : 'hover:bg-gray-700/50'
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
                  className="text-sm w-full bg-gray-700 border border-rzs-gold/40 rounded px-1.5 py-0.5 outline-none text-gray-200"
                  placeholder="New Chat"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p
                  className={`text-sm truncate hover:underline decoration-dotted cursor-text ${activeSession?.id === session.id ? 'text-rzs-gold font-medium' : 'text-gray-300'}`}
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
              <p className="text-xs text-gray-500 mt-0.5">
                {session.message_count} {Number(session.message_count) === 1 ? 'message' : 'messages'} · {formatDistanceToNow(session.updated_at)}
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(session.id, e)}
              className={`absolute right-2 top-2.5 p-1 rounded transition-colors ${
                deletingId === session.id
                  ? 'text-red-400 bg-red-900/30'
                  : 'text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100'
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
    <div className="h-full flex bg-gradient-to-b from-gray-900 to-gray-800">
      {showTranscriptModal && activeSession && (
        <TranscriptUploadModal
          theme="dark"
          onClose={() => setShowTranscriptModal(false)}
          onSend={(msg) => { setShowTranscriptModal(false); handleSend(msg); }}
        />
      )}
      {showPalette && (
        <CommandPalette
          modeSlug="mindset"
          onSelect={loadSession}
          onClose={() => setShowPalette(false)}
        />
      )}

      {/* Left panel — desktop */}
      <div className="hidden md:flex flex-col w-[260px] flex-shrink-0 bg-gray-900 border-r border-gray-700">
        <div className="px-4 py-3 border-b border-gray-700">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mindset Mode</h2>
        </div>
        {sessionList}
      </div>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 shadow-xl transition-transform duration-200 md:hidden flex flex-col border-r border-gray-700 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mindset Mode</h2>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {sessionList}
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-gray-900/50 border-b border-gray-700 px-4 py-3 flex items-center gap-3">
          <button
            className="md:hidden text-gray-400 hover:text-gray-200"
            onClick={() => setDrawerOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            {activeSession ? (
              editingHeaderTitle ? (
                <input
                  ref={headerTitleRef}
                  type="text"
                  value={headerTitleValue}
                  onChange={(e) => setHeaderTitleValue(e.target.value)}
                  onBlur={commitHeaderEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); commitHeaderEdit(); }
                    else if (e.key === 'Escape') { headerTitleCommitted.current = true; setEditingHeaderTitle(false); }
                  }}
                  className="font-semibold text-white bg-transparent border-b border-white/60 outline-none w-56 sm:w-72"
                  placeholder="New Chat"
                />
              ) : (
                <h1
                  className="font-semibold text-white cursor-pointer hover:text-gray-300 group flex items-center gap-1 w-fit"
                  onClick={startHeaderEdit}
                  title="Click to rename"
                >
                  <span className="truncate max-w-[200px] sm:max-w-xs">
                    {activeSession.title || activeSession.first_message || 'New Chat'}
                  </span>
                  <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </h1>
              )
            ) : (
              <>
                <h1 className="font-semibold text-white">Mindset Mode</h1>
                <p className="text-sm text-gray-400">Performance & mental game coaching</p>
              </>
            )}
          </div>
          {activeSession && (
            <button
              onClick={() => setShowTranscriptModal(true)}
              className="flex-shrink-0 flex items-center gap-1.5 text-sm text-rzs-gold border border-rzs-gold/30 hover:bg-rzs-gold/10 px-3 py-1.5 rounded-lg transition-colors"
              title="Upload a call transcript for analysis"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="hidden sm:inline">Transcript</span>
            </button>
          )}
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!activeSession ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-rzs-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-rzs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Welcome to Mindset Mode</h2>
                <p className="text-gray-400 mb-6">
                  Build the mental edge that separates closers from everyone else.
                  Work on confidence, resilience, and peak performance.
                </p>
                <button
                  onClick={handleNewSession}
                  className="bg-rzs-gold text-gray-900 font-medium px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  + New Conversation
                </button>
              </div>
            </div>
          ) : messagesLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-sm text-gray-500">Loading conversation...</div>
            </div>
          ) : messagesError ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-red-400 mb-2">{messagesError}</p>
                <button onClick={() => loadSession(activeSession)} className="text-sm text-rzs-gold underline">Retry</button>
              </div>
            </div>
          ) : (
            <>
              {messages.length === 0 && !streamingContent ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <p className="text-gray-400 mb-4">Share what's on your mind to get started.</p>
                    <div className="space-y-2 text-left">
                      <p className="text-sm text-gray-500 font-medium">Try asking:</p>
                      <button
                        onClick={() => handleSend("I lost a big deal and I'm struggling to bounce back.")}
                        className="block w-full text-left text-sm text-gray-400 hover:text-rzs-gold hover:bg-gray-700/50 p-2 rounded"
                      >
                        "I lost a big deal and I'm struggling to bounce back."
                      </button>
                      <button
                        onClick={() => handleSend("How do I stay confident after multiple rejections?")}
                        className="block w-full text-left text-sm text-gray-400 hover:text-rzs-gold hover:bg-gray-700/50 p-2 rounded"
                      >
                        "How do I stay confident after multiple rejections?"
                      </button>
                      <button
                        onClick={() => handleSend("I have a huge presentation tomorrow and I'm nervous.")}
                        className="block w-full text-left text-sm text-gray-400 hover:text-rzs-gold hover:bg-gray-700/50 p-2 rounded"
                      >
                        "I have a huge presentation tomorrow and I'm nervous."
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <MindsetChatThread
                  messages={messages}
                  streamingContent={streamingContent}
                  isLoading={isLoading}
                />
              )}
              {sendError && (
                <div className="px-4 pb-2 text-sm text-red-400 flex items-center gap-2 flex-wrap">
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
              <MindsetChatInput
                onSend={handleSend}
                disabled={isLoading}
                placeholder="Share what's on your mind..."
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MindsetChatThread({ messages, streamingContent, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, i) => (
        <MindsetMessageBubble key={i} role={msg.role} content={msg.content} />
      ))}
      {streamingContent && (
        <MindsetMessageBubble role="assistant" content={streamingContent} isStreaming />
      )}
      <div ref={bottomRef} />
    </div>
  );
}

function MindsetMessageBubble({ role, content, isStreaming }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] lg:max-w-[70%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-rzs-gold text-gray-900'
            : 'bg-gray-700 text-gray-100'
        }`}
      >
        <div className="prose prose-sm max-w-none prose-invert [&_p]:mt-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-rzs-gold animate-pulse ml-1" />
          )}
        </div>
      </div>
    </div>
  );
}

function MindsetChatInput({ onSend, disabled, placeholder }) {
  const [input, setInput] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4 bg-gray-900/50">
      <div className="flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rzs-gold focus:border-transparent resize-none max-h-32"
          style={{ minHeight: '44px' }}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-rzs-gold text-gray-900 font-medium px-6 py-3 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {disabled ? (
            <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            'Send'
          )}
        </button>
      </div>
    </form>
  );
}
