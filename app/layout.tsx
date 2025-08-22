import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Genesis - The Origin of Your Career Journey',
  description: 'The world\'s first gamified, AI-powered, community-based career growth platform. Discover your path, join elite communities, build streaks, compete globally, and get mentored by industry leaders.',
  keywords: 'career, social platform, mentorship, gamification, professional development, AI-powered, communities',
  authors: [{ name: 'Genesis Team' }],
  openGraph: {
    title: 'Genesis - The Origin of Your Career Journey',
    description: 'Join the world\'s first gamified career platform',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genesis - The Origin of Your Career Journey',
    description: 'Join the world\'s first gamified career platform',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
        <Toaster 
          theme="dark" 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              border: '1px solid #374151',
              color: '#f9fafb',
            },
          }}
        />
      </body>
    </html>
  )
}
