import '@/styles/globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'
import ResponsiveVoiceScript from '@/components/ResponsiveVoiceScript'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HealthConnect Translator',
  description: 'Real-time medical translation service',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={`
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://code.responsivevoice.org;
          connect-src 'self' https://texttospeech.responsivevoice.org https://code.responsivevoice.org;
          media-src 'self' blob: https://texttospeech.responsivevoice.org https://code.responsivevoice.org;
          img-src 'self' data: blob:;
          style-src 'self' 'unsafe-inline';
          font-src 'self' data:;
        `} />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 py-8 px-6">
            <div className="h-full flex flex-col">
              {children}
              <div className="flex-1" />
            </div>
          </main>
          <Footer />
        </div>
        <ResponsiveVoiceScript />
      </body>
    </html>
  )
}
