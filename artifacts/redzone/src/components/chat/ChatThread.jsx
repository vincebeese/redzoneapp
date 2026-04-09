import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MessageBubble from './MessageBubble';
import StreamingIndicator from './StreamingIndicator';

function TemporalBubble({ message, daysSince, loading }) {
  const label = daysSince === 1
    ? '↩ 1 day since your last session'
    : `↩ ${daysSince} days since your last session`;

  return (
    <div>
      <p className="text-[10px] text-gray-400 mb-1.5 ml-0.5 select-none">{label}</p>
      <div className="flex justify-start">
        <div className="max-w-[85%] lg:max-w-[70%] rounded-lg px-4 py-3 bg-gray-100 text-rzs-charcoal">
          {loading ? (
            <StreamingIndicator />
          ) : (
            <div className="text-sm prose prose-sm max-w-none [&_p]:mt-2 [&_p]:mb-3 prose-headings:text-rzs-charcoal prose-headings:font-semibold [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatThread({
  messages,
  streaming,
  onOpenTranscriptPanel,
  onOpenDocumentPanel,
  onAcceptArtifact,
  onViewArtifact,
  dealName,
  temporalMessage,
  loadingTemporal,
  daysSince,
  showContinuityNote,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, temporalMessage, loadingTemporal]);

  const showTemporal = loadingTemporal || !!temporalMessage;

  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-4 lg:p-6 space-y-4">
      {/* Temporal re-engagement message — appears before saved messages */}
      {showTemporal && daysSince != null && (
        <TemporalBubble
          message={temporalMessage}
          daysSince={daysSince}
          loading={loadingTemporal}
        />
      )}

      {messages.length === 0 && !streaming && !showTemporal && (
        <div className="text-center text-gray-500 py-12">
          <p>Start the conversation to get coaching</p>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || index}
          messageId={message.id}
          role={message.role}
          content={message.content}
          artifactData={message.artifact_data}
          artifactType={message.artifact_type}
          isStreaming={streaming && index === messages.length - 1 && message.role === 'assistant'}
          onOpenTranscriptPanel={onOpenTranscriptPanel}
          onOpenDocumentPanel={onOpenDocumentPanel}
          onAcceptArtifact={onAcceptArtifact}
          onViewArtifact={onViewArtifact}
          dealName={dealName}
        />
      ))}

      {/* New deal continuity note — shown once after opening message */}
      {showContinuityNote && (
        <p className="text-center text-[11px] text-gray-400 select-none pt-1">
          This deal is saved. Come back any time and I'll pick up exactly where we left off.
        </p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
