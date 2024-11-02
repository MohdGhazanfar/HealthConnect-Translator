'use client'

import { FC } from 'react'
import { 
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from './ui'

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  label: string
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
]

const LanguageSelector: FC<LanguageSelectorProps> = ({ value, onChange, disabled, label }) => {
  const selectedLanguage = languages.find(lang => lang.code === value)

  return (
    <div className="flex-1 mr-2 border-r pr-2">
      <label className="block text-lg font-medium mb-2 flex items-center">
        {label}
      </label>
      <Select 
        value={value} 
        onValueChange={onChange} 
        disabled={disabled}
      >
        <SelectTrigger>
          <div className="flex items-center gap-2 text-base">
            <span>{selectedLanguage?.flag}</span>
            <span>{selectedLanguage?.name || 'Select language'}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2 text-base">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageSelector
