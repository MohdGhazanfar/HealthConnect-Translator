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
          connect-src 'self' https://* http://*;
          media-src 'self' blob: https://*;
          img-src 'self' data: blob: https://*;
          style-src 'self' 'unsafe-inline';
          font-src 'self' data:;
          object-src 'self' data:;
          base-uri 'self';
          form-action 'self';
        `} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col max-w-4xl mx-auto">
          <Header />
          <main className="flex-1 py-4 px-4 sm:py-8 sm:px-6 w-full">
            <div className="h-full flex flex-col max-w-full overflow-hidden">
              {children}
            </div>
          </main>
          <Footer />
        </div>
        <ResponsiveVoiceScript />
      </body>
    </html>
  )
}
