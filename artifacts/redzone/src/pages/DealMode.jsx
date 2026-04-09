import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import DealList from '../components/deals/DealList';
import NewDealModal from '../components/deals/NewDealModal';
import ChatThread from '../components/chat/ChatThread';
import ChatInput from '../components/chat/ChatInput';
import DealChatHeader from '../components/deals/DealChatHeader';
import TranscriptPanel from '../components/deals/TranscriptPanel';
import ArtifactsPanel from '../components/artifacts/ArtifactsPanel';

const RECAP_PHRASES = [
  'remind me where i left off',
  'where did we leave off',
  'catch me up',
  "what's the status",
  'summarize this deal',
  'what did we discuss',
];

/** Strip structured signals from AI response text — mirrors backend extractSignals() */
function parseSignals(text) {
  let cleanText = text;
  let artifactOffer = null;
  let transcriptPrompt = null;

  // JSON ARTIFACT_OFFER signal
  const aoJson = cleanText.match(/\n?\[ARTIFACT_OFFER:(\{.*?\})\]/s);
  if (aoJson) {
    try { artifactOffer = JSON.parse(aoJson[1]); } catch (_) {}
    cleanText = cleanText.replace(/\n?\[ARTIFACT_OFFER:\{.*?\}\]/s, '').trim();
  }
  // Fallback: plain type
  if (!artifactOffer) {
    const aoPlain = cleanText.match(/\n?\[ARTIFACT_OFFER:([a-z0-9_]+)\]/i);
    if (aoPlain) {
      artifactOffer = { type: aoPlain[1] };
      cleanText = cleanText.replace(/\n?\[ARTIFACT_OFFER:[a-z0-9_]+\]/i, '').trim();
    }
  }

  // TRANSCRIPT_PROMPT signal
  const tp = cleanText.match(/\n?\[TRANSCRIPT_PROMPT:(\{.*?\})\]/s);
  if (tp) {
    try { transcriptPrompt = JSON.parse(tp[1]); } catch (_) {}
    cleanText = cleanText.replace(/\n?\[TRANSCRIPT_PROMPT:\{.*?\}\]/s, '').trim();
  }

  return { cleanText, artifactOffer, transcriptPrompt };
}

export default function DealMode() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [transcriptPanelOpen, setTranscriptPanelOpen] = useState(false);
  const [transcriptPanelInitialTab, setTranscriptPanelInitialTab] = useState('transcripts');
  const [transcriptCount, setTranscriptCount] = useState(0);

  // Artifacts tab state
  const [activeTab, setActiveTab] = useState('chat');
  const [openArtifactId, setOpenArtifactId] = useState(null);
  const [artifactCount, setArtifactCount] = useState(0);

  // Temporal re-engagement state
  const [temporalMessage, setTemporalMessage] = useState(null);
  const [loadingTemporal, setLoadingTemporal] = useState(false);
  const [daysSince, setDaysSince] = useState(null);

  // New deal continuity note
  const [showContinuityNote, setShowContinuityNote] = useState(false);

  // Artifact offer state (signal-driven)
  const [artifactOffer, setArtifactOffer] = useState(null);
  const [dismissedOfferTypes, setDismissedOfferTypes] = useState(new Set());

  // Transcript prompt state (signal-driven)
  const [transcriptPrompt, setTranscriptPrompt] = useState(null);
  const [shownTranscriptTriggers, setShownTranscriptTriggers] = useState(new Set());

  useEffect(() => {
    fetchDeals();
  }, []);

  // Auto-dismiss transcript prompts once deal has transcripts
  useEffect(() => {
    if (transcriptCount > 0) {
      setTranscriptPrompt(null);
    }
  }, [transcriptCount]);

  useEffect(() => {
    if (dealId) {
      // Reset temporal + tab state before fetching new deal
      setTemporalMessage(null);
      setLoadingTemporal(false);
      setDaysSince(null);
      setShowContinuityNote(false);
      setActiveTab('chat');
      setOpenArtifactId(null);
      setTranscriptPanelOpen(false);
      setTranscriptPanelInitialTab('transcripts');
      setArtifactOffer(null);
      setDismissedOfferTypes(new Set());
      setTranscriptPrompt(null);
      setShownTranscriptTriggers(new Set());
      fetchDeal(dealId);
    } else {
      setSelectedDeal(null);
      setMessages([]);
      setTranscriptPanelOpen(false);
      setTranscriptPanelInitialTab('transcripts');
      setActiveTab('chat');
      setOpenArtifactId(null);
      setArtifactCount(0);
      setTemporalMessage(null);
      setLoadingTemporal(false);
      setDaysSince(null);
      setShowContinuityNote(false);
      setArtifactOffer(null);
      setDismissedOfferTypes(new Set());
      setTranscriptPrompt(null);
      setShownTranscriptTriggers(new Set());
    }
  }, [dealId]);

  async function fetchDeals() {
    try {
      const res = await fetch('/api/deals');
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDeal(id) {
    try {
      const res = await fetch(`/api/deals/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedDeal(data);
        const msgs = data.messages || [];
        setMessages(msgs);
        setArtifactCount(msgs.filter(m => m.artifact_data).length);

        // Check for temporal gap
        if (msgs.length > 0) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg.created_at) {
            const gap = Math.floor((Date.now() - new Date(lastMsg.created_at)) / 86400000);
            if (gap >= 1) {
              setDaysSince(gap);
              generateTemporalOpening(id, gap);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch deal:', error);
    }
  }

  async function generateTemporalOpening(dealId, gap) {
    setLoadingTemporal(true);
    try {
      const res = await fetch('/api/chat/deal/temporal-opening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ deal_id: dealId, days_since: gap }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setTemporalMessage(message);
      }
    } catch (e) {
      console.error('Failed to generate temporal opening:', e);
    } finally {
      setLoadingTemporal(false);
    }
  }

  async function handleCreateDeal(dealData) {
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData),
      });

      if (res.ok) {
        const newDeal = await res.json();
        setDeals([newDeal, ...deals]);
        setShowNewDeal(false);
        navigate(`/deals/${newDeal.id}`);
        await generateOpeningMessage(newDeal);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to create deal');
      }
    } catch (error) {
      console.error('Failed to create deal:', error);
    }
  }

  async function generateOpeningMessage(deal) {
    setStreaming(true);
    const tempMessage = { role: 'assistant', content: '', id: 'temp' };
    setMessages([tempMessage]);

    try {
      const res = await fetch('/api/chat/deal/opening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          zone: deal.zone,
          company: deal.company,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                content += parsed.text;
                setMessages([{ ...tempMessage, content }]);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      setMessages([{ role: 'assistant', content, id: Date.now() }]);
      setShowContinuityNote(true);
    } catch (error) {
      console.error('Failed to generate opening:', error);
    } finally {
      setStreaming(false);
    }
  }

  async function handleRecap(userContent) {
    if (!selectedDeal || streaming) return;
    const userMessage = { role: 'user', content: userContent, id: `user-${Date.now()}` };
    setMessages(prev => [...prev, userMessage]);
    setStreaming(true);
    try {
      const res = await fetch('/api/chat/deal/recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ deal_id: selectedDeal.id }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages(prev => [...prev, { ...message, id: message.id || Date.now() }]);
      }
    } catch (e) {
      console.error('Recap failed:', e);
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setStreaming(false);
    }
  }

  async function handleSendMessage(content) {
    if (!selectedDeal || streaming) return;

    // Intercept on-demand recap phrases
    if (RECAP_PHRASES.some(p => content.toLowerCase().includes(p))) {
      await handleRecap(content);
      return;
    }

    setShowContinuityNote(false);

    const userMessage = { role: 'user', content, id: `user-${Date.now()}` };
    setMessages((prev) => [...prev, userMessage]);
    setStreaming(true);

    const tempMessage = { role: 'assistant', content: '', id: 'temp' };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch('/api/chat/deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          dealId: selectedDeal.id,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      let completePayload = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'complete') {
                completePayload = parsed;
              } else if (parsed.text) {
                assistantContent += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === 'temp' ? { ...m, content: assistantContent } : m
                  )
                );
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Strip signals from the final displayed content
      const { cleanText, artifactOffer: streamOffer, transcriptPrompt: streamPrompt } = parseSignals(assistantContent);
      const finalId = completePayload?.message_id || Date.now();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === 'temp'
            ? { role: 'assistant', content: cleanText, id: finalId }
            : m
        )
      );

      // Process artifact offer (prefer complete payload, fall back to stream parse)
      const offer = completePayload?.artifact_offer || streamOffer;
      if (offer?.type && !dismissedOfferTypes.has(offer.type)) {
        setArtifactOffer(offer);
      }

      // Process transcript prompt (only show each trigger once per session, only if no transcripts)
      const prompt = completePayload?.transcript_prompt || streamPrompt;
      if (prompt?.trigger && !shownTranscriptTriggers.has(prompt.trigger) && transcriptCount === 0) {
        setTranscriptPrompt(prompt);
        setShownTranscriptTriggers((prev) => new Set([...prev, prompt.trigger]));
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => prev.filter((m) => m.id !== 'temp'));
    } finally {
      setStreaming(false);
    }
  }

  async function handleAcceptArtifact(type) {
    if (!selectedDeal) return;
    const res = await fetch(`/api/deals/${selectedDeal.id}/artifacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ type }),
    });
    if (!res.ok) throw new Error('Artifact generation failed');
    const { message } = await res.json();
    setMessages((prev) => [...prev, { ...message, id: message.id || Date.now() }]);
    setArtifactCount((prev) => prev + 1);
  }

  async function handleUpdateDeal(updates) {
    if (!selectedDeal) return;

    try {
      const res = await fetch(`/api/deals/${selectedDeal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedDeal(updated);
        setDeals((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d))
        );
      }
    } catch (error) {
      console.error('Failed to update deal:', error);
    }
  }

  function handleAnalysisComplete(message) {
    setMessages((prev) => [...prev, { ...message, id: message.id || Date.now() }]);
  }

  function handleViewArtifact(messageId) {
    setActiveTab('artifacts');
    setOpenArtifactId(messageId);
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    if (tab === 'chat') {
      setOpenArtifactId(null);
    }
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Deal list sidebar (desktop) */}
      <div className="hidden lg:block w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-rzs-charcoal">Deals</h2>
            <button
              onClick={() => setShowNewDeal(true)}
              className="btn-primary text-sm"
            >
              + New Deal
            </button>
          </div>
        </div>
        <DealList
          deals={deals}
          selectedId={selectedDeal?.id}
          onSelect={(id) => navigate(`/deals/${id}`)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedDeal ? (
          <>
            <DealChatHeader
              deal={selectedDeal}
              onUpdateDeal={handleUpdateDeal}
              transcriptCount={transcriptCount}
              onOpenTranscripts={() => setTranscriptPanelOpen(true)}
            />

            {/* Tab bar */}
            <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
              <button
                onClick={() => handleTabChange('chat')}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'chat'
                    ? 'border-rzs-red text-rzs-red'
                    : 'border-transparent text-gray-500 hover:text-rzs-charcoal'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => handleTabChange('artifacts')}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'artifacts'
                    ? 'border-rzs-red text-rzs-red'
                    : 'border-transparent text-gray-500 hover:text-rzs-charcoal'
                }`}
              >
                Artifacts
                {artifactCount > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight font-semibold ${
                    activeTab === 'artifacts'
                      ? 'bg-rzs-red text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {artifactCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {activeTab === 'chat' ? (
                <div className="flex flex-col flex-1 overflow-hidden">
                  <ChatThread
                    messages={messages}
                    streaming={streaming}
                    onOpenTranscriptPanel={() => { setTranscriptPanelInitialTab('transcripts'); setTranscriptPanelOpen(true); }}
                    onOpenDocumentPanel={() => { setTranscriptPanelInitialTab('documents'); setTranscriptPanelOpen(true); }}
                    onAcceptArtifact={handleAcceptArtifact}
                    onViewArtifact={handleViewArtifact}
                    dealName={selectedDeal?.company}
                    temporalMessage={temporalMessage}
                    loadingTemporal={loadingTemporal}
                    daysSince={daysSince}
                    showContinuityNote={showContinuityNote}
                  />

                  {/* Artifact offer card — state-driven, signal-based */}
                  {artifactOffer && !streaming && (
                    <div className="px-4 pb-2 flex-shrink-0">
                      <div className="bg-gradient-to-r from-rzs-red/5 to-rzs-gold/5 border border-rzs-red/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-rzs-red/10 rounded-lg flex items-center justify-center text-rzs-red flex-shrink-0 text-base">📄</div>
                          <div className="flex-1">
                            <p className="font-medium text-rzs-charcoal text-sm mb-1">
                              Build your {artifactOffer.label || artifactOffer.type}?
                            </p>
                            <p className="text-xs text-gray-500 mb-3">I'll generate a customized version based on what we've discussed.</p>
                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  const type = artifactOffer.type;
                                  setArtifactOffer(null);
                                  try { await handleAcceptArtifact(type); } catch (_) {}
                                }}
                                className="px-3 py-1.5 bg-rzs-red text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Yes, build it
                              </button>
                              <button
                                onClick={() => {
                                  setDismissedOfferTypes((prev) => new Set([...prev, artifactOffer.type]));
                                  fetch('/api/analytics/event', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    credentials: 'include',
                                    body: JSON.stringify({ event_type: 'artifact_dismissed', properties: { type: artifactOffer.type } }),
                                  }).catch(() => {});
                                  setArtifactOffer(null);
                                }}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Not now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transcript prompt card — state-driven, signal-based */}
                  {transcriptPrompt && !streaming && (
                    <div className="px-4 pb-2 flex-shrink-0">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-base">📞</div>
                          <div className="flex-1">
                            <p className="text-sm text-rzs-charcoal mb-3">{transcriptPrompt.message}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setTranscriptPrompt(null);
                                  setTranscriptPanelInitialTab('transcripts');
                                  setTranscriptPanelOpen(true);
                                }}
                                className="px-3 py-1.5 bg-rzs-red text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Upload transcript
                              </button>
                              <button
                                onClick={() => setTranscriptPrompt(null)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Skip
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <ChatInput onSend={handleSendMessage} disabled={streaming} />
                </div>
              ) : (
                <ArtifactsPanel
                  dealId={selectedDeal.id}
                  dealName={selectedDeal.company}
                  openArtifactId={openArtifactId}
                  onOpenArtifactHandled={() => setOpenArtifactId(null)}
                  onCountChange={setArtifactCount}
                />
              )}

              {activeTab === 'chat' && transcriptPanelOpen && (
                <TranscriptPanel
                  dealId={selectedDeal.id}
                  onClose={() => setTranscriptPanelOpen(false)}
                  onAnalysisComplete={handleAnalysisComplete}
                  onCountChange={setTranscriptCount}
                  initialTab={transcriptPanelInitialTab}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <TopBar title="Deal Mode" subtitle="Select a deal or create a new one" />

            {/* Mobile deal list */}
            <div className="lg:hidden flex-1 overflow-y-auto">
              <div className="p-4">
                <button
                  onClick={() => setShowNewDeal(true)}
                  className="w-full btn-primary mb-4"
                >
                  + New Deal
                </button>
              </div>
              <DealList
                deals={deals}
                selectedId={selectedDeal?.id}
                onSelect={(id) => navigate(`/deals/${id}`)}
              />
            </div>

            {/* Desktop empty state */}
            <div className="hidden lg:flex flex-1 items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-4">Select a deal to start coaching</p>
                <button
                  onClick={() => setShowNewDeal(true)}
                  className="btn-primary"
                >
                  + Create New Deal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Deal Modal */}
      {showNewDeal && (
        <NewDealModal
          onClose={() => setShowNewDeal(false)}
          onCreate={handleCreateDeal}
        />
      )}
    </div>
  );
}
