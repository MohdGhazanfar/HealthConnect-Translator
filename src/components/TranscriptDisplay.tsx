'use client'

import { FC } from 'react'

interface Transcript {
  id: string
  timestamp: string
  original: string
  translated: string | null
  sourceLanguage: string
  targetLanguage: string
}

interface TranscriptDisplayProps {
  transcripts: Transcript[]
  playTranslation: (text: string, language: string) => void
  isPlayingAudio: boolean
}

const TranscriptDisplay: FC<TranscriptDisplayProps> = ({ 
  transcripts, 
  playTranslation,
  isPlayingAudio 
}) => {
  const handlePlayTranslation = (transcript: Transcript) => {
    if (!transcript.translated || 
        transcript.translated === 'Translating...' || 
        transcript.translated === 'Translation failed') {
      return;
    }

    // Call the playTranslation function with the translated text and target language
    playTranslation(transcript.translated, transcript.targetLanguage);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 min-h-[300px] sm:min-h-[500px] my-4 sm:my-8">
      <div className="border rounded-lg p-4 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-gray-800 pb-2 border-b">Original</h2>
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
          {transcripts.map((t) => (
            <div key={t.id} className="text-base">
              <span className="text-xs text-gray-500 block mb-2">{t.timestamp}</span>
              <p className="text-gray-700 leading-relaxed">{t.original}</p>
            </div>
          ))}
          {transcripts.length === 0 && (
            <p className="text-gray-500 italic text-center py-8">
              No conversation yet. Start speaking to see the transcript.
            </p>
          )}
        </div>
      </div>
      <div className="border rounded-lg p-4 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-gray-800 pb-2 border-b">Translated</h2>
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
          {transcripts.map((t) => (
            <div key={t.id} className="text-base group">
              <span className="text-xs text-gray-500 block mb-2">{t.timestamp}</span>
              <div className="flex items-start gap-4">
                <p className="text-gray-700 leading-relaxed flex-grow">{t.translated}</p>
                {t.translated && 
                 t.translated !== 'Translating...' && 
                 t.translated !== 'Translation failed' && (
                  <button
                    onClick={() => handlePlayTranslation(t)}
                    disabled={isPlayingAudio}
                    className={`
                      p-2.5 rounded-full transition-all duration-200 flex-shrink-0
                      ${isPlayingAudio ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'}
                      ${isPlayingAudio ? 'opacity-50' : 'opacity-100'}
                    `}
                    title={isPlayingAudio ? 'Playing...' : 'Play translation'}
                    type="button"
                  >
                    {isPlayingAudio ? '🔊' : '🔈'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {transcripts.length === 0 && (
            <p className="text-gray-500 italic text-center py-8">
              Translations will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TranscriptDisplay
