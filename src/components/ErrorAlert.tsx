'use client'

import { FC } from 'react'
import { Alert, AlertDescription } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

interface ErrorAlertProps {
  error: string | null
}

const ErrorAlert: FC<ErrorAlertProps> = ({ error }) => {
  if (!error) return null

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}

export default ErrorAlert
