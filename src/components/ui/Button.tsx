'use client'

import { ButtonHTMLAttributes, FC } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'lg'
}

const Button: FC<ButtonProps> = ({ variant = 'primary', size = 'sm', children, ...props }) => {
  const baseClass = 'rounded-lg transition-all'
  const sizeClass = size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-sm'
  const variantClass = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-100',
    ghost: 'text-blue-500 hover:bg-blue-50',
  }[variant]

  return (
    <button className={`${baseClass} ${sizeClass} ${variantClass}`} {...props}>
      {children}
    </button>
  )
}

export default Button
