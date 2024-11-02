'use client'

import { FC, ReactNode } from 'react'
import { useSelectContext } from './Select'
import { ChevronDown } from 'lucide-react'

interface SelectTriggerProps {
  children: ReactNode
}

const SelectTrigger: FC<SelectTriggerProps> = ({ children }) => {
  const { isOpen, setIsOpen } = useSelectContext()
  
  return (
    <button 
      className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm text-left flex justify-between items-center"
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
  )
}

export default SelectTrigger
