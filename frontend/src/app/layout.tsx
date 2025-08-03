import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '../components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nawy - Real Estate Platform',
  description: 'Find your dream property in the best compounds and developments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
} 