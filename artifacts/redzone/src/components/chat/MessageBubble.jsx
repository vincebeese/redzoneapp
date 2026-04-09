import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import StreamingIndicator from './StreamingIndicator';
import ArtifactOffer, { parseArtifactOffer } from '../artifacts/ArtifactOffer';
import ArtifactCard from '../artifacts/ArtifactCard';
import { parseArtifactContent } from '../artifacts/artifactUtils';

function cleanContent(text) {
  return text
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/\$\$/g, '\u0024\u0020\u0024');
}

export default function MessageBubble({
  messageId,
  role,
  content,
  artifactData: dbArtifactData,
  artifactType: dbArtifactType,
  isStreaming,
  onOpenTranscriptPanel,
  onOpenDocumentPanel,
  onAcceptArtifact,
  onViewArtifact,
  dealName,
}) {
  const [offerDismissed, setOfferDismissed] = useState(false);
  const isUser = role === 'user';

  // Detect artifact cards ([ARTIFACT_START:type]...[ARTIFACT_END])
  let artifactData = !isUser && !isStreaming ? parseArtifactContent(content) : null;
  // Override data with DB version (updated via Save, or for backward-compat session resume)
  if (artifactData && dbArtifactData) {
    artifactData = { ...artifactData, data: dbArtifactData };
  }

  // Detect artifact offers ([ARTIFACT_OFFER:type])
  const offerData = !isUser && !isStreaming && !artifactData ? parseArtifactOffer(content) : null;

  // Display content: strip the offer tag if present
  const displayContent = offerData ? offerData.cleanContent : (artifactData ? artifactData.cleanContent : content);

  const lc = displayContent?.toLowerCase() || '';
  const showUploadButton =
    !isUser &&
    !isStreaming &&
    !artifactData &&
    onOpenTranscriptPanel &&
    lc.includes('upload') &&
    lc.includes('transcript');

  const showDocumentButton =
    !isUser &&
    !isStreaming &&
    !artifactData &&
    onOpenDocumentPanel &&
    (
      (lc.includes('upload') && (lc.includes('proposal') || lc.includes('business case'))) ||
      (lc.includes('share') && (lc.includes('business case') || lc.includes('proposal'))) ||
      (lc.includes('review') && lc.includes('proposal'))
    );

  // Render compact artifact card — full width, outside the bubble
  if (artifactData) {
    return (
      <div className="w-full">
        {artifactData.cleanContent && (
          <div className="flex justify-start mb-2">
            <div className="max-w-[85%] lg:max-w-[70%] rounded-lg px-4 py-3 bg-gray-100 text-rzs-charcoal">
              <div className="text-sm prose prose-sm max-w-none [&_p]:mt-2 [&_p]:mb-3 prose-headings:text-rzs-charcoal prose-headings:font-semibold [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {cleanContent(artifactData.cleanContent)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
        <ArtifactCard
          messageId={messageId}
          type={artifactData.type}
          content={artifactData.content}
          data={artifactData.data}
          dealName={dealName}
          mode="compact"
          onViewArtifact={onViewArtifact}
        />
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] lg:max-w-[70%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-rzs-red text-white'
            : 'bg-gray-100 text-rzs-charcoal'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="text-sm prose prose-sm max-w-none [&_p]:mt-2 [&_p]:mb-3 prose-headings:text-rzs-charcoal prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-strong:text-rzs-charcoal prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {cleanContent(displayContent)}
            </ReactMarkdown>
            {isStreaming && <StreamingIndicator />}
            {showUploadButton && (
              <button
                onClick={onOpenTranscriptPanel}
                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rzs-red border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1.5 transition-colors not-prose"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Upload transcript
              </button>
            )}
            {showDocumentButton && (
              <button
                onClick={onOpenDocumentPanel}
                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-700 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors not-prose"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Upload document
              </button>
            )}
            {offerData && !offerDismissed && onAcceptArtifact && (
              <div className="not-prose">
                <ArtifactOffer
                  artifactType={offerData.type}
                  onAccept={() => onAcceptArtifact(offerData.type)}
                  onDecline={() => setOfferDismissed(true)}
                  disabled={isStreaming}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
