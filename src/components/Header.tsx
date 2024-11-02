'use client'

import Image from 'next/image'

const Header = () => (
  <header className="border-b bg-white py-4">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-center gap-3">
        <Image
          src="/images/naomedical_logo.jpeg"
          alt="Nao Medical Logo"
          width={40}
          height={40}
          className="object-contain"
          priority
        />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          HealthConnect Translator
        </h1>
      </div>
    </div>
  </header>
)

export default Header
