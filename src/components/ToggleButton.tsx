'use client'

import { Button } from '@/components/ui'
import { Mic, Loader2 } from 'lucide-react'
import { FC } from 'react'

interface ToggleButtonProps {
  isRecording: boolean
  isProcessing: boolean
  onClick: () => void
  isSpeechRecognitionSupported: boolean
}

const ToggleButton: FC<ToggleButtonProps> = ({ isRecording, isProcessing, onClick, isSpeechRecognitionSupported }) => (
  <div className="flex justify-center mb-10">
    <Button
      size="lg"
      className={`w-64 h-16 rounded-full transition-all flex items-center justify-center ${
        isRecording 
          ? 'bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 animate-pulse' 
          : 'bg-gradient-to-r from-blue-200 to-teal-200 hover:from-blue-300 hover:to-teal-300'
      }`}
      onClick={onClick}
      disabled={isProcessing || !isSpeechRecognitionSupported}
      aria-label={isRecording ? "Stop Recording" : "Start Recording"}
      title={isSpeechRecognitionSupported ? "Click to start/stop recording" : "Speech recognition not supported"}
    >
      {isProcessing ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        <Mic className={`h-8 w-8 ${isRecording ? 'text-white' : 'text-primary'}`} />
      )}
    </Button>
  </div>
)

export default ToggleButton
