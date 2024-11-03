'use client'

import { Alert, AlertDescription } from '@/components/ui'

const PrivacyNotice = () => (
  <div className="mt-8 space-y-4">
    <Alert>
      <AlertDescription className="text-sm">
        This application provides real-time medical translation assistance. We prioritize your privacy - 
        no conversations are stored, and translations are processed securely. While this tool aids communication, 
        please consult certified medical interpreters for critical medical discussions.
      </AlertDescription>
    </Alert>
  </div>
)

export default PrivacyNotice
