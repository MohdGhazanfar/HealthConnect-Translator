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
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
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
  ur: 'ur-PK',
  fr: 'fr-FR'
}

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void
  language: string
}

const useSpeechRecognition = ({ onResult, language }: UseSpeechRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  const memoizedOnResult = useCallback(onResult, [onResult])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        setRecognition(recognition)
      }
    }
  }, [])

  useEffect(() => {
    if (recognition) {
      recognition.lang = languageMap[language] || 'en-US'
    }
  }, [recognition, language])

  const startRecording = useCallback(() => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser')
      return
    }

    try {
      recognition.start()
      setIsRecording(true)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to start recording')
      setIsRecording(false)
    }
  }, [recognition])

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsRecording(false)
    }
  }, [recognition])

  useEffect(() => {
    if (!recognition) return

    const handleResult = async (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')

      if (event.results[0].isFinal) {
        const formData = new FormData();
        formData.append("file", new Blob([transcript], { type: 'audio/wav' }));
        formData.append("language", language);
        
        memoizedOnResult(transcript)
      }
    }

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error)
      setIsRecording(false)
    }

    const handleEnd = () => {
      setIsRecording(false)
    }

    recognition.onresult = handleResult
    recognition.onerror = handleError
    recognition.onend = handleEnd

    return () => {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
    }
  }, [recognition, memoizedOnResult, language])

  return {
    isRecording,
    startRecording,
    stopRecording,
    error
  }
}

export default useSpeechRecognition