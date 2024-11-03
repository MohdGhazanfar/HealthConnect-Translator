'use client'

import { useState, useCallback, useRef, useEffect, Suspense } from 'react'
import useSpeechRecognition from '@/hooks/useSpeechRecognition'
import LanguageSelector from '@/components/LanguageSelector'
import TranscriptDisplay from '@/components/TranscriptDisplay'
import ToggleButton from '@/components/ToggleButton'
import PrivacyNotice from '@/components/PrivacyNotice'
import ErrorAlert from '@/components/ErrorAlert'
import ExportButton from '@/components/ExportButton'

interface Transcript {
  id: string
  timestamp: string
  original: string
  translated: string | null
  sourceLanguage: string
  targetLanguage: string
}

declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice: string, options?: {
        onstart?: () => void;
        onend?: () => void;
        onerror?: (event?: unknown) => void;
        rate?: number;
        pitch?: number;
        volume?: number;
      }) => void;
      cancel: () => void;
      isPlaying: () => boolean;
      voiceSupport: () => boolean;
    };
  }
}

export default function Page() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const speechSynthesis = useRef<SpeechSynthesis | null>(null)
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const voicesLoaded = useRef(false)
  const [isResponsiveVoiceReady, setIsResponsiveVoiceReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return

    const synth = window.speechSynthesis
    speechSynthesis.current = synth

    const loadVoices = () => {
      const availableVoices = synth.getVoices()
      if (availableVoices.length > 0) {
        setVoices(availableVoices)
        voicesLoaded.current = true
        console.log('Voices loaded:', availableVoices.length)
      }
    }

    loadVoices()

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices
    }

    return () => {
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null
      }
    }
  }, [])

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Wait for ResponsiveVoice to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (window.responsiveVoice) {
          // Add click listener to initialize audio context
          const initAudio = () => {
            if (!initialized.current) {
              // Try to speak a silent message to initialize
              window.responsiveVoice.speak('', 'UK English Female', { volume: 0 });
              initialized.current = true;
              document.removeEventListener('click', initAudio);
            }
          };
          
          document.addEventListener('click', initAudio);
          console.log('ResponsiveVoice available');
          setIsResponsiveVoiceReady(true);
        } else {
          console.error('ResponsiveVoice not available');
        }
      } catch (error) {
        console.error('Error initializing ResponsiveVoice:', error);
      }
    };

    initializeAudio();
  }, []);

  const voiceMapping = {
    en: 'UK English Female',
    es: 'Spanish Latin American Female',
    fr: 'French Female',
    de: 'Deutsch Female',
    hi: 'Hindi Female',
    zh: 'Chinese Female',
    ar: 'Arabic Female',
    ja: 'Japanese Female',
    ko: 'Korean Female'
  };

  const handlePlayTranslation = (text: string, language: string) => {
    console.log('Attempting playback:', { text, language });

    if (!window.responsiveVoice) {
      console.error('ResponsiveVoice not loaded');
      setError('Please wait for audio system to initialize');
      return;
    }

    // Make sure we have text to speak
    if (!text || text.trim() === '') {
      console.error('Empty text provided for playback');
      return;
    }

    const voice = voiceMapping[language as keyof typeof voiceMapping];
    if (!voice) {
      console.error('No voice mapping found for language:', language);
      setError(`Audio not supported for ${language}`);
      return;
    }

    try {
      // Cancel any existing speech
      window.responsiveVoice.cancel();

      // Force initialize if needed
      if (!initialized.current) {
        window.responsiveVoice.speak('', 'UK English Female', { volume: 0 });
        initialized.current = true;
      }

      console.log('Starting playback with voice:', voice);
      
      window.responsiveVoice.speak(text, voice, {
        onstart: () => {
          console.log('Playback started');
          setIsPlayingAudio(true);
          setError(null);
        },
        onend: () => {
          console.log('Playback completed');
          setIsPlayingAudio(false);
        },
        onerror: (error) => {
          console.error('Playback error:', error);
          setIsPlayingAudio(false);
          setError('Audio playback failed - trying again...');
          
          // Try again with English voice as fallback
          setTimeout(() => {
            window.responsiveVoice.speak(text, 'UK English Female', {
              onstart: () => setIsPlayingAudio(true),
              onend: () => setIsPlayingAudio(false),
              onerror: () => {
                setIsPlayingAudio(false);
                setError('Audio playback failed completely');
              }
            });
          }, 500);
        },
        rate: 0.9,
        pitch: 1,
        volume: 1
      });

    } catch (error) {
      console.error('Playback error:', error);
      setIsPlayingAudio(false);
      setError('Audio playback error - please try again');
    }
  };

  const handleTranscriptResult = useCallback(async (transcript: string) => {
    // Log the incoming transcript for debugging
    console.log('Received transcript:', transcript, 'Source language:', sourceLanguage);
    
    // Sanitize input but preserve non-English characters
    const sanitizedText = transcript.trim()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control characters but keep non-English

    if (!sanitizedText) {
      console.log('Empty transcript after sanitization');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);

      const newTranscript: Transcript = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        original: sanitizedText,
        translated: 'Translating...',
        sourceLanguage,
        targetLanguage
      }
      
      setTranscripts(prev => [...prev, newTranscript])

      // Log the translation request
      console.log('Sending translation request:', {
        text: sanitizedText,
        sourceLanguage,
        targetLanguage
      });

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: sanitizedText,
          sourceLanguage,
          targetLanguage
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Translation failed:', data);
        throw new Error(data.error || 'Translation failed');
      }

      console.log('Translation successful:', data);

      setTranscripts(prev => prev.map(t => 
        t.id === newTranscript.id 
          ? { ...t, translated: data.translation }
          : t
      ));

    } catch (err) {
      console.error('Error in handleTranscriptResult:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process the speech. Please try again.';
      setError(errorMessage);
      
      setTranscripts(prev => prev.map(t => 
        t.translated === 'Translating...' 
          ? { ...t, translated: 'Translation failed' }
          : t
      ));
    } finally {
      setIsProcessing(false);
    }
  }, [sourceLanguage, targetLanguage]);

  const { isRecording, startRecording, stopRecording, error: recognitionError } = useSpeechRecognition({
    onResult: handleTranscriptResult,
    language: sourceLanguage,
  })

  const handleLanguageChange = (newLanguage: string) => {
    // Stop any ongoing recording when language changes
    if (isRecording) {
      stopRecording();
    }
    setSourceLanguage(newLanguage);
    // Add a small delay before allowing new recording
    setTimeout(() => {
      setError(null);
    }, 300);
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    }>
      <div className="w-full max-w-full mx-auto pb-4 sm:pb-8 mt-4 sm:mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-12">
          <LanguageSelector 
            value={sourceLanguage} 
            onChange={handleLanguageChange} 
            label="Patient" 
            disabled={isRecording || isProcessing}
          />
          <LanguageSelector 
            value={targetLanguage} 
            onChange={setTargetLanguage} 
            label="Provider" 
            disabled={isRecording || isProcessing}
          />
        </div>

        <div className="mb-8 sm:mb-12">
          <ToggleButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onClick={() => {
              if (isRecording) {
                stopRecording()
              } else {
                setError(null)
                startRecording()
              }
            }}
            isSpeechRecognitionSupported={true}
          />
        </div>

        <div className="mb-4">
          <TranscriptDisplay 
            transcripts={transcripts} 
            playTranslation={handlePlayTranslation} 
            isPlayingAudio={isPlayingAudio} 
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <ExportButton 
            transcripts={transcripts}
            disabled={isProcessing}
          />
        </div>

        <div className="mb-4">
          <PrivacyNotice />
        </div>

        {(error || recognitionError) && (
          <div className="mb-4">
            <ErrorAlert error={error || recognitionError || ''} />
          </div>
        )}
      </div>
    </Suspense>
  )
}
