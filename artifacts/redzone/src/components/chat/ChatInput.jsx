import { useState, useRef, useEffect, useCallback } from 'react';
import { useVoiceInput } from '../../hooks/useVoiceInput';

function MicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

const MIN_HEIGHT = 44;
const MAX_HEIGHT = 160;
const ACCEPTED_TYPES = '.pdf,.docx,.txt';

export default function ChatInput({ onSend, disabled, placeholder = 'Type your message...' }) {
  const [input, setInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [attachError, setAttachError] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);
  const { voiceState, interimText, countdown, isSupported, start, stop } = useVoiceInput();

  const isVoiceActive = voiceState === 'listening' || voiceState === 'countdown';
  const displayValue = isVoiceActive ? interimText : input;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = `${MIN_HEIGHT}px`;
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [displayValue]);

  async function parseFile(file) {
    setAttachError('');
    setAttachment(null);
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/chat/parse-file', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to read file.');
      setAttachment({ filename: data.filename, text: data.text, wordCount: data.wordCount });
    } catch (err) {
      setAttachError(err.message);
    } finally {
      setIsParsing(false);
    }
  }

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (dragCounterRef.current === 1) setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  }, []);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = '';
  }

  function removeAttachment() {
    setAttachment(null);
    setAttachError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = isVoiceActive ? interimText : input;
    if ((!text.trim() && !attachment) || disabled || isParsing) return;
    if (isVoiceActive) stop();

    let finalMessage = text.trim();
    if (attachment) {
      const docBlock = `[Attached document: ${attachment.filename}]\n---\n${attachment.text}\n---`;
      finalMessage = finalMessage
        ? `${docBlock}\n\n${finalMessage}`
        : docBlock;
    }

    onSend(finalMessage);
    setInput('');
    setAttachment(null);
    setAttachError('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function toggleVoice() {
    if (voiceState === 'idle') {
      start((transcript) => setInput(transcript));
    } else {
      stop();
    }
  }

  const canSend = (displayValue.trim() || attachment) && !isParsing;

  return (
    <form
      onSubmit={handleSubmit}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative border-t border-gray-200 p-4 bg-white transition-colors ${isDragOver ? 'bg-blue-50 border-blue-300' : ''}`}
    >
      {isDragOver && (
        <div className="absolute inset-x-4 inset-y-4 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none flex items-center justify-center z-10 bg-blue-50/80">
          <span className="text-blue-600 text-sm font-medium">Drop to attach document</span>
        </div>
      )}

      {isVoiceActive && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${voiceState === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`} />
          <span className="text-xs text-gray-500">
            {voiceState === 'listening' ? 'Listening...' : `Sending in ${countdown}...`}
          </span>
          {voiceState === 'countdown' && (
            <span className="ml-auto text-xs font-mono font-bold text-orange-500">{countdown}</span>
          )}
        </div>
      )}

      {(attachment || isParsing) && (
        <div className="mb-2">
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
            {isParsing ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 italic">Reading file...</span>
              </>
            ) : (
              <>
                <FileIcon />
                <span className="text-gray-700 font-medium max-w-[200px] truncate">{attachment.filename}</span>
                <span className="text-gray-400 text-xs">{attachment.wordCount.toLocaleString()} words</span>
                <button
                  type="button"
                  onClick={removeAttachment}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
                  title="Remove attachment"
                >
                  <XIcon />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {attachError && (
        <div className="mb-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 flex items-center justify-between gap-2">
          <span>{attachError}</span>
          <button type="button" onClick={() => setAttachError('')} className="text-red-400 hover:text-red-600 flex-shrink-0"><XIcon /></button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isParsing}
          title="Attach a document (PDF, Word, or text file)"
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-40"
        >
          <PaperclipIcon />
        </button>

        <textarea
          ref={textareaRef}
          value={displayValue}
          onChange={(e) => { if (!isVoiceActive) setInput(e.target.value); }}
          onKeyDown={handleKeyDown}
          placeholder={isDragOver ? 'Drop to attach...' : isVoiceActive ? 'Speak now...' : placeholder}
          disabled={disabled}
          readOnly={isVoiceActive}
          rows={1}
          className={`flex-1 input-field resize-none overflow-y-auto transition-colors ${
            isVoiceActive ? 'text-gray-500 italic bg-gray-50' : ''
          } ${isDragOver ? 'bg-blue-50' : ''}`}
          style={{ minHeight: `${MIN_HEIGHT}px`, maxHeight: `${MAX_HEIGHT}px` }}
        />

        {isSupported && (
          <button
            type="button"
            onClick={toggleVoice}
            disabled={disabled}
            title={isVoiceActive ? 'Stop recording' : 'Speak your message'}
            className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
              isVoiceActive
                ? 'bg-red-500 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            {isVoiceActive ? <StopIcon /> : <MicIcon />}
          </button>
        )}

        <button
          type="submit"
          disabled={disabled || !canSend}
          className="btn-primary flex-shrink-0"
        >
          {disabled ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Send'
          )}
        </button>
      </div>
    </form>
  );
}
