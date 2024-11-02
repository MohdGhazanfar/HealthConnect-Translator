'use client'

import { FC, ReactNode } from 'react'
import { useSelectContext } from './Select'

interface SelectContentProps {
  children: ReactNode
}

const SelectContent: FC<SelectContentProps> = ({ children }) => {
  const { isOpen } = useSelectContext()
  
  if (!isOpen) return null
  
  return (
    <div className="absolute z-50 top-full mt-1 left-0 w-full max-h-60 overflow-y-auto bg-white border rounded-lg shadow-md">
      {children}
    </div>
  )
}

export default SelectContent
