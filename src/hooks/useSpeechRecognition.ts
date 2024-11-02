'use client'

import { useState, useCallback, useEffect } from 'react'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const languageMap: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  zh: 'zh-CN',
  ar: 'ar-SA',
  hi: 'hi-IN',
  fr: 'fr-FR',
  de: 'de-DE'
}

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void
  language: string
}

const useSpeechRecognition = ({ onResult, language }: UseSpeechRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      try {
        recognition.abort();
      } catch (e) {
        console.error('Error cleaning up recognition:', e);
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      
      const locale = languageMap[language] || 'en-US';
      newRecognition.lang = locale;
      
      console.log('Created new recognition instance with language:', newRecognition.lang);
      setRecognition(newRecognition);
    }
  }, [language]);

  const startRecording = useCallback(() => {
    if (!recognition) {
      const error = 'Speech recognition is not supported in this browser';
      console.error(error);
      setError(error);
      return;
    }

    try {
      try {
        recognition.abort();
      } catch (e) {
        console.log('No active recognition to abort');
      }

      const locale = languageMap[language] || 'en-US';
      recognition.lang = locale;
      console.log('Starting recognition with language:', recognition.lang);
      
      recognition.start();
      setIsRecording(true);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to start recording';
      console.error('Speech recognition start error:', errorMessage);
      setError(errorMessage);
      setIsRecording(false);
    }
  }, [recognition, language]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
      setIsRecording(false);
    }
  }, [recognition]);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event: SpeechRecognitionEvent) => {
      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0].transcript)
        .join('');

      if (results[results.length - 1].isFinal) {
        console.log('Final transcript:', transcript);
        onResult(transcript);
      }
    };

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    const handleEnd = () => {
      console.log('Speech recognition ended');
      setIsRecording(false);
      
      if (isRecording) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Error restarting recognition:', e);
        }
      }
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [recognition, onResult, isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error
  };
};

export default useSpeechRecognition;