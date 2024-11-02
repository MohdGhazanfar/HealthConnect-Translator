'use client'

import { FC } from 'react'
import { Button } from './ui'

interface Transcript {
  timestamp: string
  original: string
  translated: string | null
  sourceLanguage: string
  targetLanguage: string
}

interface ExportButtonProps {
  transcripts: Transcript[]
  disabled?: boolean
}

const ExportButton: FC<ExportButtonProps> = ({ transcripts, disabled }) => {
  const handleExport = () => {
    // Format the transcripts into a readable text
    const content = transcripts.map(t => (
      `Time: ${t.timestamp}\n` +
      `Original (${t.sourceLanguage}): ${t.original}\n` +
      `Translated (${t.targetLanguage}): ${t.translated}\n` +
      `----------------------------------------\n`
    )).join('\n')

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `medical-translation-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button 
      onClick={handleExport}
      disabled={disabled || transcripts.length === 0}
      className="fixed bottom-24 right-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md px-4 py-2 shadow-lg"
      variant="outline"
    >
      Export Conversation
    </Button>
  )
}

export default ExportButton 