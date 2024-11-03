'use client'

import { FC, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface AlertProps {
  children: ReactNode
  variant?: 'destructive' | 'info'
}

const Alert: FC<AlertProps> = ({ children, variant = 'info' }) => {
  const alertClass = variant === 'destructive' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'

  return (
    <div className={`p-4 rounded-lg ${alertClass} flex items-start`}>
      {variant === 'destructive' && <AlertTriangle className="h-5 w-5 mr-2" />}
      {children}
    </div>
  )
}

export const AlertDescription = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={className}>
    {children}
  </div>
)

export default Alert
