'use client'

import { FC } from 'react'
import { useSelectContext } from './Select'

const SelectValue: FC = () => {
  const { value } = useSelectContext()
  return <span>{value ?? 'Select...'}</span>
}

export default SelectValue
