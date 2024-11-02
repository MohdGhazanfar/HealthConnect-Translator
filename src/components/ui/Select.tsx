'use client'

import { createContext, FC, ReactNode, useContext, useState, useEffect, useRef } from 'react'

interface SelectContextProps {
  value: string
  onChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined)

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  disabled?: boolean
}

export const Select: FC<SelectProps> = ({ value, onValueChange, children, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <SelectContext.Provider 
      value={{ 
        value, 
        onChange: onValueChange, 
        isOpen, 
        setIsOpen 
      }}
    >
      <div 
        ref={selectRef}
        className={`relative ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps {
  children: ReactNode
  className?: string
}

export const SelectTrigger: FC<SelectTriggerProps> = ({ children, className }) => {
  const { setIsOpen, isOpen } = useSelectContext()
  
  return (
    <button 
      type="button"
      className={`flex items-center justify-between w-full px-3 py-2 border rounded-md ${className}`}
      onClick={(e) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
      }}
    >
      {children}
    </button>
  )
}

interface SelectContentProps {
  children: ReactNode
}

export const SelectContent: FC<SelectContentProps> = ({ children }) => {
  const { isOpen } = useSelectContext()
  
  if (!isOpen) return null
  
  return (
    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
      {children}
    </div>
  )
}

interface SelectItemProps {
  children: ReactNode
  value: string
}

export const SelectItem: FC<SelectItemProps> = ({ children, value }) => {
  const { onChange, setIsOpen } = useSelectContext()
  
  return (
    <div 
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation()
        onChange(value)
        setIsOpen(false)
      }}
    >
      {children}
    </div>
  )
}

export const useSelectContext = () => {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error('Select components must be used within a Select wrapper')
  }
  return context
}
