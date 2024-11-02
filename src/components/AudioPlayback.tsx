'use client'

import { useEffect, FC } from 'react'

interface AudioPlaybackProps {
  text: string
  language: string
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
}

const AudioPlayback: FC<AudioPlaybackProps> = ({ text, language, isPlaying, setIsPlaying }) => {
  useEffect(() => {
    if (isPlaying) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language

      utterance.onend = () => setIsPlaying(false)
      window.speechSynthesis.speak(utterance)
    }
  }, [isPlaying, text, language, setIsPlaying])

  return null
}

export default AudioPlayback
