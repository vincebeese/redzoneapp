import { useRef, useState, useCallback } from 'react';

const COUNTDOWN_SECONDS = 4;

export function useVoiceInput() {
  const [voiceState, setVoiceState] = useState('idle'); // idle | listening | countdown | unsupported
  const [interimText, setInterimText] = useState('');
  const [countdown, setCountdown] = useState(0);

  const recognitionRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const accumulatedRef = useRef('');
  const onTranscriptRef = useRef(null);

  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  function clearTimers() {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  }

  function finalize() {
    clearTimers();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    const transcript = accumulatedRef.current.trim();
    accumulatedRef.current = '';
    setInterimText('');
    setVoiceState('idle');
    setCountdown(0);
    if (transcript && onTranscriptRef.current) {
      onTranscriptRef.current(transcript);
    }
  }

  function startCountdown() {
    clearTimers();
    let remaining = COUNTDOWN_SECONDS;
    setCountdown(remaining);
    setVoiceState('countdown');

    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        finalize();
      }
    }, 1000);
  }

  function resetToListening() {
    clearTimers();
    setVoiceState('listening');
    setCountdown(0);
  }

  const start = useCallback((onTranscript) => {
    if (!isSupported) {
      setVoiceState('unsupported');
      return;
    }

    onTranscriptRef.current = onTranscript;
    accumulatedRef.current = '';
    setInterimText('');

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      resetToListening();
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          accumulatedRef.current += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimText(accumulatedRef.current + interim);
    };

    recognition.onspeechend = () => {
      startCountdown();
    };

    recognition.onspeechstart = () => {
      resetToListening();
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') return;
      console.error('Voice recognition error:', e.error);
      stop();
    };

    recognition.start();
    recognitionRef.current = recognition;
    setVoiceState('listening');
  }, [isSupported]);

  const stop = useCallback(() => {
    clearTimers();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    accumulatedRef.current = '';
    setInterimText('');
    setVoiceState('idle');
    setCountdown(0);
  }, []);

  return {
    voiceState,
    interimText,
    countdown,
    isSupported,
    start,
    stop,
  };
}
